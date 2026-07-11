// مطابقة البحث الموحّدة — تغطي الاسم والمسمى والمهارات والمنتجات
// والخدمات ومجالات التوظيف، مع مرونة الحروف العربية (fuzzyIncludes).

import { fuzzyIncludes } from "./text";
import type { Hero, Producer, Company, Job } from "./types";

/** بطل: الاسم، المسمى، النبذة، المهارات */
export function heroMatches(h: Hero, q: string): boolean {
  return (
    !q ||
    fuzzyIncludes(h.name, q) ||
    fuzzyIncludes(h.title, q) ||
    fuzzyIncludes(h.bio, q) ||
    h.skills.some((s) => fuzzyIncludes(s, q))
  );
}

/** أسرة منتجة: الاسم، الفئة، النبذة، أسماء المنتجات وفئاتها */
export function producerMatches(p: Producer, q: string): boolean {
  return (
    !q ||
    fuzzyIncludes(p.name, q) ||
    fuzzyIncludes(p.category, q) ||
    fuzzyIncludes(p.bio, q) ||
    (p.products ?? []).some(
      (pr) => fuzzyIncludes(pr.name, q) || fuzzyIncludes(pr.category, q)
    )
  );
}

/** وظيفة: المسمى، الشركة، نوع الدوام، الوسوم */
export function jobMatches(j: Job, q: string): boolean {
  return (
    !q ||
    fuzzyIncludes(j.title, q) ||
    fuzzyIncludes(j.companyName, q) ||
    fuzzyIncludes(j.type, q) ||
    (j.tags ?? []).some((t) => fuzzyIncludes(t, q))
  );
}

/**
 * شركة: الاسم، المجال، النبذة، ووظائفها (مسمى/نوع/وسوم).
 * الوظائف مخزنة في قائمة مستقلة مرتبطة بـ companyId، لذا تُمرَّر
 * القائمة العامة اختيارياً لتشمل المطابقة مجالات التوظيف.
 */
export function companyMatches(c: Company, q: string, allJobs?: Job[]): boolean {
  if (!q) return true;
  const companyJobs = [
    ...(c.jobs ?? []),
    ...(allJobs ?? []).filter((j) => j.companyId === c.id),
  ];
  return (
    fuzzyIncludes(c.name, q) ||
    fuzzyIncludes(c.field, q) ||
    fuzzyIncludes(c.about, q) ||
    companyJobs.some((j) => jobMatches(j, q))
  );
}
