
export type Work = { id: string; title: string; desc: string; image?: string };

export const seedWorks: Work[] = [];

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
