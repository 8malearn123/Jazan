// إعدادات الاتصال بـ Supabase
// تُقرأ من متغيّرات البيئة. إن لم تُضبط، يعمل الموقع على البيانات التجريبية.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** هل تم ضبط مفاتيح Supabase؟ */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
