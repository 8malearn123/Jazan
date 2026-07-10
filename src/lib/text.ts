/**
 * تطبيع النص العربي للبحث المرن:
 * - إزالة التشكيل والتطويل (ـ)
 * - توحيد الهمزات: أ إ آ ٱ ← ا
 * - توحيد التاء المربوطة: ة ← ه
 * - توحيد الألف المقصورة: ى ← ي
 * - وتحويل اللاتيني إلى أحرف صغيرة
 */
export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0670]/g, "") // التشكيل
    .replace(/\u0640/g, "") // التطويل ـ
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي");
}

/** هل تحتوي `haystack` على `needle` بعد تطبيع الطرفين؟ */
export function fuzzyIncludes(haystack: string | undefined, needle: string): boolean {
  if (!haystack) return false;
  return normalizeText(haystack).includes(needle);
}
