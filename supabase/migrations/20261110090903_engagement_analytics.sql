-- Instagram submissions are just a link: category and summary become optional
-- (LinkedIn still requires them, enforced by the API).
alter table public.member_posts alter column category drop not null;
alter table public.member_posts alter column summary drop not null;

-- Separate WhatsApp communities per platform: track joins per platform.
alter table public.member_platforms add column if not exists whatsapp_joined_at timestamptz;
update public.member_platforms mp
   set whatsapp_joined_at = p.whatsapp_joined_at
  from public.member_profiles p
 where p.user_id = mp.user_id and p.whatsapp_joined_at is not null and mp.whatsapp_joined_at is null;

-- A member marks a peer's post as engaged after reacting/commenting on it.
-- LinkedIn/Instagram don't expose who engaged, so this self-report powers analytics.
create table if not exists public.post_engagements (
  post_id    uuid not null references public.member_posts (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
create index if not exists post_engagements_user_idx on public.post_engagements (user_id, created_at desc);

alter table public.post_engagements enable row level security;
revoke all on public.post_engagements from anon, authenticated;
grant select, insert, update, delete on public.post_engagements to service_role;
