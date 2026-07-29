-- رعاة المنصة: إضافة رابط موقع الراعي (الجدول نفسه موجود في schema.sql)
-- شغّل هذا الملف مرة واحدة من: Supabase Dashboard → SQL Editor → New query → الصق ثم Run

alter table public.sponsors add column if not exists website text;

-- حذف الراعي مسموح للمشرف فقط (الإضافة والتعديل مغطّاة بسياسة admin_write_sponsors)
drop policy if exists "admin_delete_sponsors" on public.sponsors;
create policy "admin_delete_sponsors" on public.sponsors
  for delete using (public.is_admin());
