
export const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
export const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

// رابط Supabase صالح فقط إذا كان URL فعلياً بـ https — أي قيمة مشوّهة
// (مفتاح ملصوق بالخطأ، رابط ناقص…) تُتجاهل بدل أن تُسقط الموقع بخطأ 500
function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export const isSupabaseConfigured = Boolean(
  isValidUrl(SUPABASE_URL) && SUPABASE_ANON_KEY
);
