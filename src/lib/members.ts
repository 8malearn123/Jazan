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
    const { data, error } = await supabase.from("profiles").select("role");
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
