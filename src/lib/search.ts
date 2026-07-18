
import { fuzzyIncludes } from "./text";
import type { Hero, Producer, Company, Job } from "./types";

export function heroMatches(h: Hero, q: string): boolean {
  return (
    !q ||
    fuzzyIncludes(h.name, q) ||
    fuzzyIncludes(h.title, q) ||
    fuzzyIncludes(h.bio, q) ||
    h.skills.some((s) => fuzzyIncludes(s, q))
  );
}

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

export function jobMatches(j: Job, q: string): boolean {
  return (
    !q ||
    fuzzyIncludes(j.title, q) ||
    fuzzyIncludes(j.companyName, q) ||
    fuzzyIncludes(j.type, q) ||
    (j.tags ?? []).some((t) => fuzzyIncludes(t, q))
  );
}

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
