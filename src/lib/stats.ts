import {
  sampleHeroes,
  producers,
  companies,
  jobs,
  pendingVerifications,
  reports,
} from "./data";
import type { Stat } from "./types";

export const counts = {
  heroes: sampleHeroes.length,
  producers: producers.length,
  companies: companies.length,
  jobs: jobs.length,
  openings: companies.reduce((sum, c) => sum + (c.openings ?? 0), 0),
  pending: pendingVerifications.length,
  openReports: reports.filter((r) => r.status === "open").length,
};

export const heroStats: Stat[] = [
  { value: String(counts.heroes), label: "بطل مسجّل" },
  { value: String(counts.producers), label: "أسرة منتجة" },
  { value: String(counts.companies), label: "شركة وجهة" },
];
