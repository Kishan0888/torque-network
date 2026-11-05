-- Member dashboard + admin panel.
--
-- Security model: same as subscriptions. RLS is enabled on every table with
-- NO policies for anon/authenticated, so the browser cannot read or write
-- these tables directly. All access goes through the Vercel /api functions,
-- which verify the user's session, membership (per product) and admin role,
-- then use the service-role key.

-- Team members who can use /admin. Add rows here to grant access.
create table public.admins (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- Settings shared by both memberships.
create table public.member_profiles (
  user_id                 uuid primary key references auth.users (id) on delete cascade,
  guidelines_accepted_at  timestamptz,
  whatsapp_joined_at      timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- Per-platform setup (a member with both plans has two rows).
create table public.member_platforms (
  user_id          uuid not null references auth.users (id) on delete cascade,
  platform         text not null check (platform in ('linkedin', 'instagram')),
  domain           text check (char_length(domain) <= 60),
  role_title       text check (char_length(role_title) <= 80),
  experience       text check (char_length(experience) <= 20),
  interests        text[] not null default '{}',
  goals            text[] not null default '{}',
  profile_url      text check (char_length(profile_url) <= 300),   -- LinkedIn URL or Instagram handle
  connected_name   text check (char_length(connected_name) <= 120), -- name from "Connect LinkedIn"
  connected_at     timestamptz,
  checklist        jsonb not null default '{}'::jsonb,
  onboarded_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  primary key (user_id, platform)
);
create index member_platforms_platform_domain_idx on public.member_platforms (platform, domain);

-- Submitted posts and their moderation state.
create table public.member_posts (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  platform         text not null check (platform in ('linkedin', 'instagram')),
  url              text not null check (char_length(url) <= 500),
  category         text not null check (char_length(category) <= 40),
  topic            text check (char_length(topic) <= 60),
  summary          text not null check (char_length(summary) between 1 and 140),
  domain           text check (char_length(domain) <= 60),   -- author's domain at submission time
  status           text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  moderator_note   text check (char_length(moderator_note) <= 300),
  featured         boolean not null default false,
  reviewed_by      uuid references auth.users (id) on delete set null,
  reviewed_at      timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (user_id, url)
);
create index member_posts_user_idx on public.member_posts (user_id, platform, created_at desc);
create index member_posts_timeline_idx on public.member_posts (platform, status, reviewed_at desc);
create index member_posts_pending_idx on public.member_posts (created_at) where status = 'pending';

-- LinkedIn growth playbook videos (managed in /admin).
create table public.resources (
  id           uuid primary key default gen_random_uuid(),
  platform     text not null default 'all' check (platform in ('all', 'linkedin', 'instagram')),
  title        text not null check (char_length(title) between 1 and 120),
  youtube_url  text not null check (char_length(youtube_url) <= 300),
  duration     text check (char_length(duration) <= 10),
  sort_order   integer not null default 0,
  published    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index resources_order_idx on public.resources (platform, sort_order);

-- Monthly content guides per platform + domain (managed in /admin).
create table public.monthly_guides (
  id           uuid primary key default gen_random_uuid(),
  platform     text not null check (platform in ('linkedin', 'instagram')),
  domain       text not null check (char_length(domain) <= 60),
  month        date not null check (extract(day from month) = 1),
  theme        text check (char_length(theme) <= 200),
  weeks        jsonb not null default '[]'::jsonb,   -- [{ "week": "Week 1", "focus": "...", "suggested": "..." }]
  also_inside  text check (char_length(also_inside) <= 300),
  pdf_url      text check (char_length(pdf_url) <= 500),
  published    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (platform, domain, month)
);

create trigger member_profiles_set_updated_at before update on public.member_profiles for each row execute function public.set_updated_at();
create trigger member_platforms_set_updated_at before update on public.member_platforms for each row execute function public.set_updated_at();
create trigger member_posts_set_updated_at before update on public.member_posts for each row execute function public.set_updated_at();
create trigger resources_set_updated_at before update on public.resources for each row execute function public.set_updated_at();
create trigger monthly_guides_set_updated_at before update on public.monthly_guides for each row execute function public.set_updated_at();

alter table public.admins           enable row level security;
alter table public.member_profiles  enable row level security;
alter table public.member_platforms enable row level security;
alter table public.member_posts     enable row level security;
alter table public.resources        enable row level security;
alter table public.monthly_guides   enable row level security;

revoke all on public.admins, public.member_profiles, public.member_platforms,
              public.member_posts, public.resources, public.monthly_guides
  from anon, authenticated;
grant select, insert, update, delete on public.admins, public.member_profiles, public.member_platforms,
              public.member_posts, public.resources, public.monthly_guides
  to service_role;
