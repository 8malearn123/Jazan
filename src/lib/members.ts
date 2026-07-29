"use client";

import { useEffect, useState } from "react";
import { createClient } from "./supabase/client";
import {
  HERO_SELECT,
  PRODUCER_SELECT,
  PROFILE_SELECT,
  rowToCompany,
  rowToHero,
  rowToMember,
  rowToProducer,
  type MemberRow,
  type ProfileRow,
} from "./members-shared";
import type { Company, Hero, Producer } from "./types";

/**
 * قراءة الأعضاء الحقيقيين من قاعدة البيانات (جدول profiles) لعرضهم
 * في التصفّح ولوحة المدير والعدادات. بدون Supabase تعيد قوائم فارغة
 * وتبقى الواجهة على البيانات المحلية.
 */

export async function fetchDbHeroes(): Promise<Hero[]> {
  const supabase = createClient();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(HERO_SELECT)
      .eq("role", "hero")
      .eq("publish_status", "approved")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return (data as unknown as ProfileRow[]).map(rowToHero);
  } catch {
    return [];
  }
}

export async function fetchDbProducers(): Promise<Producer[]> {
  const supabase = createClient();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(PRODUCER_SELECT)
      .eq("role", "producer")
      .eq("publish_status", "approved")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return (data as unknown as ProfileRow[]).map(rowToProducer);
  } catch {
    return [];
  }
}

export async function fetchDbCompanies(): Promise<Company[]> {
  const supabase = createClient();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(PROFILE_SELECT)
      .eq("role", "company")
      .eq("publish_status", "approved")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return (data as unknown as ProfileRow[]).map(rowToCompany);
  } catch {
    return [];
  }
}

export async function fetchDbMembers(): Promise<MemberRow[]> {
  const supabase = createClient();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(PROFILE_SELECT)
      .neq("role", "admin")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return (data as unknown as ProfileRow[]).map(rowToMember);
  } catch {
    return [];
  }
}

export type DbCounts = { heroes: number; producers: number; companies: number };

export async function fetchDbCounts(): Promise<DbCounts | null> {
  const supabase = createClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("publish_status", "approved");
    if (error || !data) return null;
    const rows = data as { role: string }[];
    return {
      heroes: rows.filter((r) => r.role === "hero").length,
      producers: rows.filter((r) => r.role === "producer").length,
      companies: rows.filter((r) => r.role === "company").length,
    };
  } catch {
    return null;
  }
}

function useFetched<T>(fetcher: () => Promise<T[]>): T[] {
  const [items, setItems] = useState<T[]>([]);
  useEffect(() => {
    let cancelled = false;
    fetcher().then((list) => {
      if (!cancelled && list.length) setItems(list);
    });
    return () => {
      cancelled = true;
    };
    // fetcher ثابتة على مستوى الوحدة
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return items;
}

export function useDbHeroes(): Hero[] {
  return useFetched(fetchDbHeroes);
}

export function useDbProducers(): Producer[] {
  return useFetched(fetchDbProducers);
}

export function useDbCompanies(): Company[] {
  return useFetched(fetchDbCompanies);
}

export function useDbMembers(): MemberRow[] {
  return useFetched(fetchDbMembers);
}

/** بيانات الملف الشخصي التي يملكها العضو ويحرّرها من لوحته */
export type OwnProfile = {
  name?: string;
  city?: string;
  whatsapp?: string;
  bio?: string;
  title?: string;
  status?: string;
  skills?: string[];
};

export async function fetchOwnProfile(userId: string): Promise<OwnProfile | null> {
  const supabase = createClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "name, city, whatsapp, bio, hero_profiles(title, status, skills), producer_profiles(category)"
      )
      .eq("id", userId)
      .maybeSingle();
    if (error || !data) return null;
    const row = data as unknown as {
      name: string | null;
      city: string | null;
      whatsapp: string | null;
      bio: string | null;
      hero_profiles?:
        | { title: string | null; status: string | null; skills: string[] | null }
        | { title: string | null; status: string | null; skills: string[] | null }[]
        | null;
      producer_profiles?: { category: string | null } | { category: string | null }[] | null;
    };
    const hp = Array.isArray(row.hero_profiles) ? row.hero_profiles[0] : row.hero_profiles;
    const pp = Array.isArray(row.producer_profiles)
      ? row.producer_profiles[0]
      : row.producer_profiles;
    return {
      name: row.name ?? undefined,
      city: row.city ?? undefined,
      whatsapp: row.whatsapp ?? undefined,
      bio: row.bio ?? undefined,
      title: hp?.title ?? pp?.category ?? undefined,
      status: hp?.status ?? undefined,
      skills: hp?.skills ?? undefined,
    };
  } catch {
    return null;
  }
}

/** حفظ الملف الشخصي في قاعدة البيانات — يعيد null عندما لا يوجد Supabase */
export async function saveOwnProfile(
  userId: string,
  role: string,
  p: {
    name: string;
    city: string;
    whatsapp: string;
    bio: string;
    title: string;
    status: string;
    skills: string[];
  }
): Promise<boolean | null> {
  const supabase = createClient();
  if (!supabase) return null;
  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        name: p.name,
        city: p.city || null,
        whatsapp: p.whatsapp || null,
        bio: p.bio || null,
      })
      .eq("id", userId);
    if (error) return false;

    if (role === "hero") {
      const { error: heroErr } = await supabase.from("hero_profiles").upsert(
        {
          profile_id: userId,
          title: p.title || null,
          status: p.status || "both",
          skills: p.skills,
        },
        { onConflict: "profile_id" }
      );
      if (heroErr) return false;
    } else if (role === "producer") {
      const { error: prodErr } = await supabase.from("producer_profiles").upsert(
        { profile_id: userId, category: p.title || null },
        { onConflict: "profile_id" }
      );
      if (prodErr) return false;
    }
    return true;
  } catch {
    return false;
  }
}

/** مزامنة الصورة الشخصية/الغلاف مع قاعدة البيانات (أفضل جهد) */
export async function savePhotoRemote(
  userId: string,
  kind: "avatar" | "cover",
  dataUrl: string | null
): Promise<void> {
  const supabase = createClient();
  if (!supabase) return;
  try {
    await supabase
      .from("profiles")
      .update(kind === "avatar" ? { avatar_url: dataUrl } : { cover_url: dataUrl })
      .eq("id", userId);
  } catch {
    // أفضل جهد — الصورة المحلية تبقى
  }
}

/** أقسام صفحة البطل الغنية — يعبّئها من لوحته وتظهر للزوار */
export type HeroService = { name: string; desc: string; price: string };
export type HeroTimelineEntry = { years: string; role: string; desc: string };
export type HeroCert = { name: string; year: string };
export type HeroDetails = {
  availabilityText?: string;
  cvUrl?: string;
  services?: HeroService[];
  timeline?: HeroTimelineEntry[];
  certs?: HeroCert[];
};

export async function fetchHeroDetails(heroId: string): Promise<HeroDetails | null> {
  const supabase = createClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("hero_profiles")
      .select("details")
      .eq("profile_id", heroId)
      .maybeSingle();
    if (error || !data) return null;
    return ((data as { details: HeroDetails | null }).details ?? null);
  } catch {
    return null;
  }
}

export async function saveHeroDetails(
  heroId: string,
  details: HeroDetails
): Promise<boolean | null> {
  const supabase = createClient();
  if (!supabase) return null;
  try {
    const { error } = await supabase
      .from("hero_profiles")
      .upsert({ profile_id: heroId, details }, { onConflict: "profile_id" });
    return !error;
  } catch {
    return false;
  }
}
