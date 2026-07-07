import {
  sampleHeroes,
  producers,
  companies,
  jobs,
  pendingVerifications,
  reports,
} from "./data";
import type { Stat } from "./types";

/** أعداد محسوبة مباشرة من بيانات النظام */
export const counts = {
  heroes: sampleHeroes.length,
  producers: producers.length,
  companies: companies.length,
  jobs: jobs.length,
  /** إجمالي الفرص المفتوحة لدى الشركات */
  openings: companies.reduce((sum, c) => sum + (c.openings ?? 0), 0),
  /** طلبات التوثيق المعلّقة */
  pending: pendingVerifications.length,
  /** البلاغات المفتوحة */
  openReports: reports.filter((r) => r.status === "open").length,
};

/** إحصائيات الصفحة الرئيسية — تُشتق من الأعداد الفعلية */
export const heroStats: Stat[] = [
  { value: String(counts.heroes), label: "بطل مسجّل" },
  { value: String(counts.producers), label: "أسرة منتجة" },
  { value: String(counts.companies), label: "شركة وجهة" },
];
