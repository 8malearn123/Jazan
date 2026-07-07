-- ============================================================
--  أبطال جازان · مخطط قاعدة البيانات (Supabase / PostgreSQL)
--  شغّل هذا الملف في: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- أنواع مُعدّة
do $$ begin
  create type user_role as enum ('hero', 'producer', 'company', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type availability_status as enum ('freelance', 'job', 'both', 'producer');
exception when duplicate_object then null; end $$;

-- ============================================================
--  profiles : يرتبط بمستخدمي المصادقة (auth.users)
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        user_role not null default 'hero',
  name        text not null default '',
  email       text,
  city        text,
  whatsapp    text,
  bio         text,
  avatar_url  text,
  cover_url   text,
  verified    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ملف البطل / المستقل
create table if not exists public.hero_profiles (
  profile_id    uuid primary key references public.profiles(id) on delete cascade,
  title         text,
  status        availability_status not null default 'freelance',
  years         int default 0,
  skills        text[] not null default '{}',
  rating        numeric(2,1) default 0,
  reviews_count int default 0
);

-- ملف الأسرة المنتجة / الصانع
create table if not exists public.producer_profiles (
  profile_id    uuid primary key references public.profiles(id) on delete cascade,
  category      text,
  rating        numeric(2,1) default 0,
  reviews_count int default 0
);

-- منتجات الأسر المنتجة
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  producer_id uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  price       numeric(10,2),
  category    text,
  image_url   text,
  created_at  timestamptz not null default now()
);

-- الشركات / الجهات
create table if not exists public.companies (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid references public.profiles(id) on delete set null,
  name        text not null,
  field       text,
  city        text,
  about       text,
  logo_url    text,
  cover_url   text,
  verified    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- الوظائف / الفرص
create table if not exists public.jobs (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid not null references public.companies(id) on delete cascade,
  title       text not null,
  city        text,
  type        text,
  salary      text,
  tags        text[] not null default '{}',
  posted_at   timestamptz not null default now()
);

-- معرض أعمال البطل
create table if not exists public.portfolio_items (
  id        uuid primary key default gen_random_uuid(),
  hero_id   uuid not null references public.profiles(id) on delete cascade,
  title     text,
  image_url text
);

-- التقييمات
create table if not exists public.reviews (
  id           uuid primary key default gen_random_uuid(),
  target_id    uuid not null references public.profiles(id) on delete cascade,
  author_name  text not null,
  rating       int not null check (rating between 1 and 5),
  comment      text,
  created_at   timestamptz not null default now()
);

-- رعاة المنصة
create table if not exists public.sponsors (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  logo_url   text,
  created_at timestamptz not null default now()
);

-- طلبات التوثيق (لوحة المشرف)
do $$ begin
  create type verification_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

create table if not exists public.verification_requests (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  status      verification_status not null default 'pending',
  note        text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at  timestamptz not null default now()
);

-- البلاغات (لوحة المشرف)
create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  target_id   uuid not null references public.profiles(id) on delete cascade,
  reporter_id uuid references public.profiles(id) on delete set null,
  reason      text not null,
  status      text not null default 'open' check (status in ('open', 'resolved')),
  created_at  timestamptz not null default now()
);

-- عدد الفرص المفتوحة لكل شركة (يقابل الحقل openings في الواجهة)
create or replace view public.companies_with_openings as
select c.*, coalesce(j.openings, 0)::int as openings
from public.companies c
left join (
  select company_id, count(*) as openings
  from public.jobs
  group by company_id
) j on j.company_id = c.id;

-- ============================================================
--  دالة مساعدة: هل المستخدم الحالي مشرف؟
-- ============================================================
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- ============================================================
--  إنشاء profile تلقائياً عند تسجيل مستخدم جديد
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'hero')
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
--  Row Level Security
-- ============================================================
alter table public.profiles          enable row level security;
alter table public.hero_profiles      enable row level security;
alter table public.producer_profiles  enable row level security;
alter table public.products           enable row level security;
alter table public.companies          enable row level security;
alter table public.jobs               enable row level security;
alter table public.portfolio_items    enable row level security;
alter table public.reviews            enable row level security;
alter table public.sponsors           enable row level security;
alter table public.verification_requests enable row level security;
alter table public.reports            enable row level security;

-- قراءة عامة (للجميع)
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','hero_profiles','producer_profiles','products',
    'companies','jobs','portfolio_items','reviews','sponsors'
  ] loop
    execute format('drop policy if exists "public_read" on public.%I;', t);
    execute format('create policy "public_read" on public.%I for select using (true);', t);
  end loop;
end $$;

-- sponsors: المشرف فقط يضيف/يعدّل
drop policy if exists "admin_write_sponsors" on public.sponsors;
create policy "admin_write_sponsors" on public.sponsors
  for all using (public.is_admin()) with check (public.is_admin());

-- verification_requests: المالك يقدّم طلبه ويراه، والمشرف يدير الكل
drop policy if exists "own_verification_insert" on public.verification_requests;
create policy "own_verification_insert" on public.verification_requests
  for insert with check (auth.uid() = profile_id);

drop policy if exists "own_or_admin_verification_read" on public.verification_requests;
create policy "own_or_admin_verification_read" on public.verification_requests
  for select using (auth.uid() = profile_id or public.is_admin());

drop policy if exists "admin_verification_update" on public.verification_requests;
create policy "admin_verification_update" on public.verification_requests
  for update using (public.is_admin());

-- reports: أي مستخدم مسجّل يبلّغ، والمشرف فقط يقرأ ويعالج
drop policy if exists "auth_report_insert" on public.reports;
create policy "auth_report_insert" on public.reports
  for insert with check (auth.uid() is not null);

drop policy if exists "admin_reports_read" on public.reports;
create policy "admin_reports_read" on public.reports
  for select using (public.is_admin());

drop policy if exists "admin_reports_update" on public.reports;
create policy "admin_reports_update" on public.reports
  for update using (public.is_admin());

-- profiles: المالك يعدّل ملفه، والمشرف يعدّل أي ملف
drop policy if exists "own_profile_update" on public.profiles;
create policy "own_profile_update" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

drop policy if exists "own_profile_insert" on public.profiles;
create policy "own_profile_insert" on public.profiles
  for insert with check (auth.uid() = id);

-- hero_profiles / producer_profiles: المالك يدير صفه
do $$
declare t text;
begin
  foreach t in array array['hero_profiles','producer_profiles'] loop
    execute format('drop policy if exists "owner_write" on public.%I;', t);
    execute format($f$create policy "owner_write" on public.%I
      for all using (auth.uid() = profile_id or public.is_admin())
      with check (auth.uid() = profile_id or public.is_admin());$f$, t);
  end loop;
end $$;

-- products: مالك الأسرة يدير منتجاته
drop policy if exists "owner_products" on public.products;
create policy "owner_products" on public.products
  for all using (auth.uid() = producer_id or public.is_admin())
  with check (auth.uid() = producer_id or public.is_admin());

-- portfolio_items: مالك البطل يدير أعماله
drop policy if exists "owner_portfolio" on public.portfolio_items;
create policy "owner_portfolio" on public.portfolio_items
  for all using (auth.uid() = hero_id or public.is_admin())
  with check (auth.uid() = hero_id or public.is_admin());

-- companies: المالك يدير شركته
drop policy if exists "owner_company" on public.companies;
create policy "owner_company" on public.companies
  for all using (auth.uid() = owner_id or public.is_admin())
  with check (auth.uid() = owner_id or public.is_admin());

-- jobs: مالك الشركة يدير وظائفها
drop policy if exists "owner_jobs" on public.jobs;
create policy "owner_jobs" on public.jobs
  for all using (
    public.is_admin() or exists (
      select 1 from public.companies c
      where c.id = jobs.company_id and c.owner_id = auth.uid()
    )
  )
  with check (
    public.is_admin() or exists (
      select 1 from public.companies c
      where c.id = jobs.company_id and c.owner_id = auth.uid()
    )
  );

-- reviews: أي مستخدم مسجّل يضيف تقييماً
drop policy if exists "auth_review_insert" on public.reviews;
create policy "auth_review_insert" on public.reviews
  for insert with check (auth.uid() is not null);

-- ============================================================
--  التخزين (الصور): أنشئ الحاويات
--  ملاحظة: أنشئ buckets من Dashboard → Storage أو عبر السطور التالية
-- ============================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true), ('covers', 'covers', true), ('products', 'products', true)
on conflict (id) do nothing;

-- قراءة عامة للصور + رفع للمستخدمين المسجّلين
drop policy if exists "public_read_images" on storage.objects;
create policy "public_read_images" on storage.objects
  for select using (bucket_id in ('avatars','covers','products'));

drop policy if exists "auth_upload_images" on storage.objects;
create policy "auth_upload_images" on storage.objects
  for insert with check (
    bucket_id in ('avatars','covers','products') and auth.uid() is not null
  );
