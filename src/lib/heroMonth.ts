"use client";

import { useEffect, useState } from "react";
import { createClient } from "./supabase/client";

export type HeroOfMonth = {
  name: string;
  title: string;
  month: string;
  image: string;
};

export const defaultHeroOfMonth: HeroOfMonth = {
  name: "أحمد عقيلي",
  title: "مطوّر واجهات — الأكثر تفاعلاً في المنصة",
  month: "",
  image: "",
};

const STORAGE_KEY = "jazanheroes.heroMonth";
const CHANGE_EVENT = "jazanheroes:heroMonth";
const REMOTE_TABLE = "site_content";
const REMOTE_KEY = "hero_month";

export function currentMonthLabel(): string {
  try {
    return new Intl.DateTimeFormat("ar-SA-u-ca-gregory", {
      month: "long",
      year: "numeric",
    }).format(new Date());
  } catch {
    return "";
  }
}

export function loadHeroOfMonth(): HeroOfMonth {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultHeroOfMonth;
    return { ...defaultHeroOfMonth, ...(JSON.parse(raw) as Partial<HeroOfMonth>) };
  } catch {
    return defaultHeroOfMonth;
  }
}

export function saveHeroOfMonth(value: HeroOfMonth): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
}

export async function fetchHeroOfMonthRemote(): Promise<HeroOfMonth | null> {
  const supabase = createClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from(REMOTE_TABLE)
      .select("value")
      .eq("key", REMOTE_KEY)
      .maybeSingle();
    if (error || !data?.value) return null;
    return { ...defaultHeroOfMonth, ...(data.value as Partial<HeroOfMonth>) };
  } catch {
    return null;
  }
}

/**
 * Publishes locally (always) and to Supabase when configured.
 * remote: true = published globally, false = Supabase write failed,
 * null = Supabase not configured (demo mode).
 */
export async function publishHeroOfMonth(
  value: HeroOfMonth
): Promise<{ local: boolean; remote: boolean | null }> {
  const local = saveHeroOfMonth(value);
  const supabase = createClient();
  if (!supabase) return { local, remote: null };
  try {
    const { error } = await supabase
      .from(REMOTE_TABLE)
      .upsert(
        { key: REMOTE_KEY, value, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    return { local, remote: !error };
  } catch {
    return { local, remote: false };
  }
}

export function onHeroOfMonthChange(listener: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function useHeroOfMonth(): HeroOfMonth {
  const [value, setValue] = useState<HeroOfMonth>(defaultHeroOfMonth);
  useEffect(() => {
    const update = () => setValue(loadHeroOfMonth());
    update();
    const unsubscribe = onHeroOfMonthChange(update);
    let cancelled = false;
    fetchHeroOfMonthRemote().then((remote) => {
      if (!remote || cancelled) return;
      setValue(remote);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
      } catch {
        // keep in-memory value only
      }
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);
  return value;
}
