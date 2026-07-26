
// قيم مشروع Supabase الافتراضية — مفاتيح عامة بطبيعتها (anon/publishable)،
// الحماية الفعلية في سياسات Row Level Security داخل قاعدة البيانات.
// متغيّرات البيئة إن وُجدت وكانت سليمة تتقدّم عليها.
const DEFAULT_SUPABASE_URL = "https://zrqthlspmqcfqcaymuwh.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_BRRfQosNKxERsn74OOPnxw_mgfzrM9g";

// رابط صالح فقط إذا كان https فعلياً — ونأخذ أصله حتى لو لُصق بمسار زائد
// (مثل /rest/v1/)، وأي قيمة مشوّهة تُستبدل بالافتراضية بدل أن تُسقط الموقع
function normalizeUrl(value: string): string {
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === "https:" ? parsed.origin : "";
  } catch {
    return "";
  }
}

// مفتاح anon المقبول: الصيغة الجديدة sb_publishable أو JWT القديمة eyJ
function normalizeKey(value: string): string {
  const key = value.trim();
  return key.startsWith("sb_publishable_") || key.startsWith("eyJ") ? key : "";
}

export const SUPABASE_URL =
  normalizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "") || DEFAULT_SUPABASE_URL;
export const SUPABASE_ANON_KEY =
  normalizeKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "") || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
