"use client";

import { useEffect, useState } from "react";
import { createClient } from "./supabase/client";

/**
 * رعاة المنصة — يديرهم المشرف من لوحة المدير ويظهرون في الصفحة الرئيسية.
 * مع Supabase يُحفظون في جدول sponsors (كتابة للمشرف فقط، وقراءة للجميع)،
 * وبدونه محلياً في المتصفح (الوضع التجريبي).
 */

export type SponsorItem = {
  id: string;
  name: string;
  logo?: string;
  website?: string;
};

const STORAGE_KEY = "forsa.sponsors";
const CHANGE_EVENT = "forsa:sponsors";

function loadLocal(): SponsorItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SponsorItem[]) : [];
  } catch {
    return [];
  }
}

function saveLocal(list: SponsorItem[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
}

type SponsorRow = {
  id: string;
  name: string | null;
  logo_url: string | null;
  website: string | null;
};

function rowToSponsor(row: SponsorRow): SponsorItem {
  return {
    id: row.id,
    name: row.name?.trim() || "راعٍ",
    logo: row.logo_url ?? undefined,
    website: row.website ?? undefined,
  };
}

export async function fetchSponsors(): Promise<SponsorItem[]> {
  const supabase = createClient();
  if (!supabase) return loadLocal();
  try {
    const { data, error } = await supabase
      .from("sponsors")
      .select("id, name, logo_url, website")
      .order("created_at", { ascending: true });
    if (error || !data) return [];
    return (data as SponsorRow[]).map(rowToSponsor);
  } catch {
    return [];
  }
}

export async function createSponsor(
  sponsor: Omit<SponsorItem, "id">
): Promise<SponsorItem | null> {
  const supabase = createClient();
  if (!supabase) {
    const local: SponsorItem = { id: `s${Date.now()}`, ...sponsor };
    const list = [...loadLocal(), local];
    return saveLocal(list) ? local : null;
  }
  try {
    const { data, error } = await supabase
      .from("sponsors")
      .insert({
        name: sponsor.name,
        logo_url: sponsor.logo ?? null,
        website: sponsor.website?.trim() || null,
      })
      .select("id, name, logo_url, website")
      .single();
    if (error || !data) return null;
    return rowToSponsor(data as SponsorRow);
  } catch {
    return null;
  }
}

export async function updateSponsor(
  id: string,
  sponsor: Omit<SponsorItem, "id">
): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) {
    return saveLocal(loadLocal().map((s) => (s.id === id ? { ...s, ...sponsor } : s)));
  }
  try {
    const { error } = await supabase
      .from("sponsors")
      .update({
        name: sponsor.name,
        logo_url: sponsor.logo ?? null,
        website: sponsor.website?.trim() || null,
      })
      .eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteSponsor(id: string): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) {
    return saveLocal(loadLocal().filter((s) => s.id !== id));
  }
  try {
    const { error } = await supabase.from("sponsors").delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

/** رعاة المنصة للعرض العام */
export function useSponsors(): SponsorItem[] {
  const [list, setList] = useState<SponsorItem[]>([]);
  useEffect(() => {
    let cancelled = false;
    fetchSponsors().then((items) => {
      if (!cancelled) setList(items);
    });
    const update = () => {
      fetchSponsors().then((items) => setList(items));
    };
    window.addEventListener(CHANGE_EVENT, update);
    return () => {
      cancelled = true;
      window.removeEventListener(CHANGE_EVENT, update);
    };
  }, []);
  return list;
}
