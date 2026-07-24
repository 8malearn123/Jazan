-- جدول محتوى الموقع العام (بطل الشهر وغيره)
-- شغّل هذا الملف مرة واحدة من: Supabase Dashboard → SQL Editor → New query → الصق والصق ثم Run

create table if not exists public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- القراءة متاحة للجميع (الزوار يشاهدون بطل الشهر)
drop policy if exists "site_content_read" on public.site_content;
create policy "site_content_read"
  on public.site_content for select
  using (true);

-- الكتابة مسموحة فقط على مفتاح بطل الشهر
drop policy if exists "site_content_insert" on public.site_content;
create policy "site_content_insert"
  on public.site_content for insert
  with check (key = 'hero_month');

drop policy if exists "site_content_update" on public.site_content;
create policy "site_content_update"
  on public.site_content for update
  using (key = 'hero_month')
  with check (key = 'hero_month');
