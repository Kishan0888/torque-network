-- Growth Playbook items can now be a PDF worksheet instead of a YouTube video.
-- pdf_file names a file shipped with the site in content/playbook/ and served only
-- to signed-in members through /api/dashboard?action=playbook-pdf.
alter table public.resources alter column youtube_url drop not null;
alter table public.resources add column if not exists pdf_file text
  check (pdf_file ~ '^[a-z0-9][a-z0-9-]{0,100}\.pdf$');
alter table public.resources add constraint resources_video_or_pdf
  check (youtube_url is not null or pdf_file is not null);
