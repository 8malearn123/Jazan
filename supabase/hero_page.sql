-- صفحة البطل الشخصية الغنية: تفاصيل إضافية + معرض أعمال في قاعدة البيانات
-- شغّل هذا الملف مرة واحدة من: Supabase Dashboard → SQL Editor → New query → الصق ثم Run

-- تفاصيل الصفحة (الخدمات، الخبرات، الشهادات، أوقات التوفر، رابط السيرة)
alter table public.hero_profiles add column if not exists details jsonb;

-- ترقية جدول معرض الأعمال: وصف وتصنيف وتاريخ إضافة
alter table public.portfolio_items add column if not exists description text;
alter table public.portfolio_items add column if not exists category text;
alter table public.portfolio_items add column if not exists created_at timestamptz not null default now();
