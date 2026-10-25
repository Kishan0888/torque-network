-- my_entitlement() runs with the caller's privileges: RLS already lets a
-- signed-in user read only their own subscriptions, so no elevated access is
-- needed (resolves advisor lint 0029). Logic mirrors public.is_entitled().
create or replace function public.my_entitlement()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1
    from public.subscriptions s
    where s.user_id = (select auth.uid())
      and (
        s.status = 'active'
        or (s.status in ('pending','cancelled','completed','halted')
            and s.current_end is not null
            and s.current_end > now())
      )
  );
$$;

revoke all on function public.my_entitlement() from public, anon;
grant execute on function public.my_entitlement() to authenticated, service_role;
