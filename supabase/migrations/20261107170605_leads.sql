-- Leads from public landing pages (e.g. /landing-linkedin).
-- Written only by the server (/api/lead), read only by admins (/api/admin).
create table public.leads (
  id            uuid primary key default gen_random_uuid(),
  platform      text not null default 'linkedin' check (platform in ('linkedin', 'instagram')),
  name          text not null check (char_length(name) between 1 and 120),
  phone         text not null check (char_length(phone) between 10 and 16),
  email         text check (char_length(email) <= 254),
  industry      text check (char_length(industry) <= 60),
  experience    text check (char_length(experience) <= 20),
  profile_url   text check (char_length(profile_url) <= 300),
  status        text not null default 'new' check (status in ('new', 'contacted', 'converted', 'not_interested')),
  page          text check (char_length(page) <= 100),
  utm_source    text check (char_length(utm_source) <= 100),
  utm_medium    text check (char_length(utm_medium) <= 100),
  utm_campaign  text check (char_length(utm_campaign) <= 150),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index leads_created_idx on public.leads (created_at desc);
create index leads_phone_idx on public.leads (phone, created_at desc);

create trigger leads_set_updated_at before update on public.leads for each row execute function public.set_updated_at();

alter table public.leads enable row level security;
revoke all on public.leads from anon, authenticated;
grant select, insert, update, delete on public.leads to service_role;
