"use client";

import { createClient } from "./supabase/client";

export type Work = {
  id: string;
  title: string;
  desc: string;
  image?: string;
  category?: string;
};

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

function saveLocal(userId: string, works: Work[]): boolean {
  try {
    localStorage.setItem(worksStorageKey(userId), JSON.stringify(works));
    return true;
  } catch {
    return false;
  }
}

type WorkRow = {
  id: string;
  title: string | null;
  description: string | null;
  category: string | null;
  image_url: string | null;
};

function rowToWork(row: WorkRow): Work {
  return {
    id: row.id,
    title: row.title ?? "",
    desc: row.description ?? "",
    image: row.image_url ?? undefined,
    category: row.category ?? undefined,
  };
}

/** أعمال عضو — من قاعدة البيانات، أو محلياً في الوضع التجريبي */
export async function fetchWorks(heroId: string): Promise<Work[]> {
  const supabase = createClient();
  if (!supabase) return loadWorks(heroId);
  try {
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("id, title, description, category, image_url")
      .eq("hero_id", heroId)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return (data as WorkRow[]).map(rowToWork);
  } catch {
    return [];
  }
}

export async function createWork(
  heroId: string,
  work: { title: string; desc: string; image?: string; category?: string }
): Promise<Work | null> {
  const supabase = createClient();
  if (!supabase) {
    const local: Work = { id: `w${Date.now()}`, ...work };
    const list = [local, ...loadWorks(heroId)];
    return saveLocal(heroId, list) ? local : null;
  }
  try {
    const { data, error } = await supabase
      .from("portfolio_items")
      .insert({
        hero_id: heroId,
        title: work.title,
        description: work.desc || null,
        category: work.category || null,
        image_url: work.image ?? null,
      })
      .select("id, title, description, category, image_url")
      .single();
    if (error || !data) return null;
    return rowToWork(data as WorkRow);
  } catch {
    return null;
  }
}

export async function updateWork(
  heroId: string,
  workId: string,
  work: { title: string; desc: string; image?: string; category?: string }
): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) {
    return saveLocal(
      heroId,
      loadWorks(heroId).map((w) => (w.id === workId ? { ...w, ...work } : w))
    );
  }
  try {
    const { error } = await supabase
      .from("portfolio_items")
      .update({
        title: work.title,
        description: work.desc || null,
        category: work.category || null,
        image_url: work.image ?? null,
      })
      .eq("id", workId);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteWork(heroId: string, workId: string): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) {
    return saveLocal(
      heroId,
      loadWorks(heroId).filter((w) => w.id !== workId)
    );
  }
  try {
    const { error } = await supabase.from("portfolio_items").delete().eq("id", workId);
    return !error;
  } catch {
    return false;
  }
}
