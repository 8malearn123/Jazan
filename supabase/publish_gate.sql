-- بوابة النشر: لا يظهر أي ملف في المنصة حتى يكتمل ويُراجَع من الإدارة
-- شغّل هذا الملف مرة واحدة من: Supabase Dashboard → SQL Editor → New query → الصق ثم Run

-- draft: مسودة | pending: بانتظار المراجعة | approved: منشور | rejected: مُعاد للتعديل
alter table public.profiles
  add column if not exists publish_status text not null default 'draft';

do $$ begin
  alter table public.profiles
    add constraint profiles_publish_status_check
    check (publish_status in ('draft', 'pending', 'approved', 'rejected'));
exception when duplicate_object then null; end $$;

alter table public.profiles add column if not exists review_note text;
alter table public.profiles add column if not exists submitted_at timestamptz;
alter table public.profiles add column if not exists reviewed_at timestamptz;

-- حماية على مستوى قاعدة البيانات: العضو يقدّم للمراجعة فقط،
-- والاعتماد أو الرفض للمشرف وحده (حتى لو حاول أحد تعديل الطلب يدوياً)
create or replace function public.guard_publish_status()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.publish_status is distinct from old.publish_status
     and new.publish_status in ('approved', 'rejected')
     and not public.is_admin() then
    raise exception 'only admins can approve or reject profiles';
  end if;
  return new;
end $$;

drop trigger if exists profiles_publish_guard on public.profiles;
create trigger profiles_publish_guard
  before update on public.profiles
  for each row execute function public.guard_publish_status();

-- الأعضاء المسجّلون قبل تفعيل البوابة يبدؤون كمسودّات (لن يظهروا حتى يراجَعوا).
-- لاعتماد من سجّل سابقاً دفعةً واحدة، شغّل السطر التالي بعد إزالة علامتي التعليق:
-- update public.profiles set publish_status = 'approved', reviewed_at = now() where role <> 'admin';
