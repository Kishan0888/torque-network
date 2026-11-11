-- Free ("complimentary") access granted by email, per product.
-- A signed-in user whose CONFIRMED email is on this list is treated exactly like
-- a paying member of that product until expires_at (null = no end date).
-- Managed by admins in /admin → Free access (service role only; no client access).

create table if not exists public.complimentary_access (
  email       text not null check (email = lower(btrim(email)) and email like '%_@_%'),
  product     text not null check (product in ('instagram', 'linkedin')),
  expires_at  timestamptz,
  source      text,
  note        text,
  created_by  uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now(),
  primary key (email, product)
);

alter table public.complimentary_access enable row level security;
revoke all on table public.complimentary_access from anon, authenticated;
grant select, insert, update, delete on table public.complimentary_access to service_role;

-- Products a user currently gets for free (confirmed email only, not expired).
create or replace function public.complimentary_products(p_user_id uuid)
returns table (product text, expires_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select c.product, c.expires_at
  from auth.users u
  join public.complimentary_access c on c.email = lower(btrim(u.email))
  where u.id = p_user_id
    and u.email_confirmed_at is not null
    and (c.expires_at is null or c.expires_at > now())
$$;

revoke all on function public.complimentary_products(uuid) from public, anon, authenticated;
grant execute on function public.complimentary_products(uuid) to service_role;

-- "Any membership" now also counts free access (my_entitlement() calls this too).
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
  )
  or exists (select 1 from public.complimentary_products(p_user_id));
$$;
