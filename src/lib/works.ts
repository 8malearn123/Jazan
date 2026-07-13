// أعمال العضو — يديرها من «أعمالي» في لوحة التحكم وتظهر في ملفه العام.

export type Work = { id: string; title: string; desc: string; image?: string };

/** أعمال مبدئية للوضع التجريبي */
export const seedWorks: Work[] = [
  { id: "w1", title: "واجهة متجر إلكتروني", desc: "تصميم وتطوير واجهة متجر متكاملة." },
  { id: "w2", title: "تصميم هوية بصرية", desc: "هوية كاملة لعلامة محلية ناشئة." },
  { id: "w3", title: "لوحة تحكم", desc: "لوحة إدارة ببيانات مباشرة ورسوم بيانية." },
];

export function worksStorageKey(userId: string): string {
  return `jazanheroes.works.${userId}`;
}

export function loadWorks(userId: string): Work[] {
  try {
    const raw = localStorage.getItem(worksStorageKey(userId));
    return raw ? (JSON.parse(raw) as Work[]) : seedWorks;
  } catch {
    return seedWorks;
  }
}
