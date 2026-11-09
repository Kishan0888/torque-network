-- Landing-page checkout: a lead can pay straight from the landing page.
-- The lead row is saved first (form submit); these columns track how far the
-- visitor got in payment. An account is created for them server-side at the
-- payment step so the existing subscription/webhook logic works unchanged.

alter table public.leads
  add column if not exists user_id uuid references auth.users (id) on delete set null,
  add column if not exists checkout_started_at timestamptz,
  add column if not exists paid_at timestamptz,
  add column if not exists account_claimed_at timestamptz;

create index if not exists leads_user_id_idx on public.leads (user_id);

-- Service-role-only lookup of an auth user by email (PostgREST can't read auth.users).
create or replace function public.lead_account_by_email(p_email text)
returns table (id uuid, has_password boolean, created_via text, email_confirmed boolean)
language sql
security definer
set search_path = ''
stable
as $$
  select u.id,
         coalesce(u.encrypted_password, '') <> '',
         u.raw_app_meta_data ->> 'created_via',
         u.email_confirmed_at is not null
  from auth.users u
  where lower(u.email) = lower(trim(p_email))
  limit 1
$$;

revoke all on function public.lead_account_by_email(text) from public, anon, authenticated;
grant execute on function public.lead_account_by_email(text) to service_role;
