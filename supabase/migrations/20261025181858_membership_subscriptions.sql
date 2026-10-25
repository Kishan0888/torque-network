-- Torque Network: member accounts + Razorpay recurring subscriptions.
--
-- Security model
--   * Every table has RLS enabled.
--   * Signed-in users may READ only their own rows (and update their own
--     profile's editable fields). They can never write subscription, payment
--     or webhook data.
--   * All subscription/payment writes happen server-side (Vercel /api
--     functions) with the service-role key, which bypasses RLS.
--   * anon has no access to any of these tables.

-- ---------------------------------------------------------------------------
-- Shared helper: keep updated_at current
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles: one row per auth user
-- ---------------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text check (char_length(full_name) <= 120),
  phone       text check (char_length(phone) <= 20),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Create the profile automatically when someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    left(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 120),
    left(nullif(trim(new.raw_user_meta_data ->> 'phone'), ''), 20)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for users who signed up before this migration.
insert into public.profiles (id, full_name, phone)
select u.id,
       left(nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''), 120),
       left(nullif(trim(u.raw_user_meta_data ->> 'phone'), ''), 20)
from auth.users u
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- subscriptions: mirror of Razorpay subscription state
-- ---------------------------------------------------------------------------
create table public.subscriptions (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid not null references auth.users (id) on delete cascade,
  razorpay_subscription_id  text not null unique,
  razorpay_plan_id          text not null,
  razorpay_customer_id      text,
  status                    text not null
    check (status in ('created','authenticated','active','pending','halted',
                      'cancelled','completed','expired','paused')),
  current_start             timestamptz,
  current_end               timestamptz,
  charge_at                 timestamptz,
  ended_at                  timestamptz,
  paid_count                integer not null default 0,
  total_count               integer,
  cancel_at_cycle_end       boolean not null default false,
  short_url                 text,
  -- Bookkeeping: created_at of the newest Razorpay webhook seen for this row.
  -- (Ordering safety comes from re-fetching the live subscription on every event.)
  last_event_at             timestamptz,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create index subscriptions_user_id_idx on public.subscriptions (user_id);
create index subscriptions_user_status_idx on public.subscriptions (user_id, status);

create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- payments: each charge (successful or failed) seen for a subscription
-- ---------------------------------------------------------------------------
create table public.payments (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid not null references auth.users (id) on delete cascade,
  subscription_id           uuid references public.subscriptions (id) on delete set null,
  razorpay_payment_id       text not null unique,
  razorpay_subscription_id  text,
  razorpay_invoice_id       text,
  amount                    integer not null,           -- in paise
  currency                  text not null default 'INR',
  status                    text not null,              -- captured / authorized / failed / refunded ...
  method                    text,
  error_code                text,
  error_description         text,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create index payments_user_id_idx on public.payments (user_id);
create index payments_subscription_id_idx on public.payments (subscription_id);

create trigger payments_set_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- razorpay_webhook_events: idempotency ledger (keyed by x-razorpay-event-id)
-- ---------------------------------------------------------------------------
create table public.razorpay_webhook_events (
  event_id      text primary key,
  event_type    text not null,
  payload       jsonb not null,
  attempts      integer not null default 1,
  received_at   timestamptz not null default now(),
  processed_at  timestamptz,
  last_error    text
);

create index razorpay_webhook_events_unprocessed_idx
  on public.razorpay_webhook_events (received_at)
  where processed_at is null;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles                enable row level security;
alter table public.subscriptions           enable row level security;
alter table public.payments                enable row level security;
alter table public.razorpay_webhook_events enable row level security;

-- Table privileges: nothing for anon; authenticated gets only what policies allow.
revoke all on public.profiles, public.subscriptions, public.payments,
              public.razorpay_webhook_events from anon, authenticated;

grant select on public.profiles      to authenticated;
grant update (full_name, phone) on public.profiles to authenticated;
grant select on public.subscriptions to authenticated;
grant select on public.payments      to authenticated;
-- razorpay_webhook_events: no grants at all for signed-in users (service role only).

-- The server (service role, bypasses RLS) needs full access.
grant select, insert, update, delete on public.profiles, public.subscriptions,
  public.payments, public.razorpay_webhook_events to service_role;

create policy "profiles: read own"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "profiles: update own"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "subscriptions: read own"
  on public.subscriptions for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "payments: read own"
  on public.payments for select to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Entitlement
--   active                                   -> entitled
--   pending / cancelled / completed / halted -> entitled only until the end
--                                               of the period already paid for
--   created / authenticated / expired / paused -> not entitled
-- ---------------------------------------------------------------------------
create or replace function public.is_entitled(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.subscriptions s
    where s.user_id = p_user_id
      and (
        s.status = 'active'
        or (s.status in ('pending','cancelled','completed','halted')
            and s.current_end is not null
            and s.current_end > now())
      )
  );
$$;

-- Server-side only (service role). Signed-in users use my_entitlement().
revoke all on function public.is_entitled(uuid) from public, anon, authenticated;
grant execute on function public.is_entitled(uuid) to service_role;

create or replace function public.my_entitlement()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when (select auth.uid()) is null then false
    else public.is_entitled((select auth.uid()))
  end;
$$;

revoke all on function public.my_entitlement() from public, anon;
grant execute on function public.my_entitlement() to authenticated;
