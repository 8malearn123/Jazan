-- مدونة الأعضاء: منشورات شخصية تظهر في الملف العام
-- شغّل هذا الملف مرة واحدة من: Supabase Dashboard → SQL Editor → New query → الصق ثم Run

create table if not exists public.posts (
  id         uuid primary key default gen_random_uuid(),
  author_id  uuid not null references public.profiles(id) on delete cascade,
  content    text not null,
  image_url  text,
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

-- القراءة متاحة للجميع (الزوار يقرؤون مدونات الأعضاء)
drop policy if exists "posts_public_read" on public.posts;
create policy "posts_public_read" on public.posts
  for select using (true);

-- صاحب الحساب ينشر باسمه فقط
drop policy if exists "posts_owner_insert" on public.posts;
create policy "posts_owner_insert" on public.posts
  for insert with check (auth.uid() = author_id);

-- صاحب المنشور (أو المشرف) يعدّل ويحذف
drop policy if exists "posts_owner_update" on public.posts;
create policy "posts_owner_update" on public.posts
  for update using (auth.uid() = author_id or public.is_admin());

drop policy if exists "posts_owner_delete" on public.posts;
create policy "posts_owner_delete" on public.posts
  for delete using (auth.uid() = author_id or public.is_admin());
