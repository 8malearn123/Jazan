export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0670]/g, "")
    .replace(/\u0640/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي");
}

export function fuzzyIncludes(haystack: string | undefined, needle: string): boolean {
  if (!haystack) return false;
  return normalizeText(haystack).includes(needle);
}
