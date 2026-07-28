import { createClient } from "./supabase/server";
import {
  HERO_SELECT,
  PRODUCER_SELECT,
  PROFILE_SELECT,
  rowToCompany,
  rowToHero,
  rowToProducer,
  type ProfileRow,
} from "./members-shared";
import type { Company, Hero, Producer } from "./types";

/**
 * جلب عضو واحد من قاعدة البيانات لصفحات التفاصيل العامة
 * (/heroes/[id] وأخواتها) — تُستدعى من مكوّنات الخادم فقط.
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function fetchProfile(
  id: string,
  role: "hero" | "producer" | "company",
  select: string
): Promise<ProfileRow | null> {
  if (!UUID_RE.test(id)) return null;
  const supabase = await createClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(select)
      .eq("id", id)
      .eq("role", role)
      .maybeSingle();
    if (error || !data) return null;
    return data as unknown as ProfileRow;
  } catch {
    return null;
  }
}

export async function getDbHero(id: string): Promise<Hero | null> {
  const row = await fetchProfile(id, "hero", HERO_SELECT);
  return row ? rowToHero(row) : null;
}

export async function getDbProducer(id: string): Promise<Producer | null> {
  const row = await fetchProfile(id, "producer", PRODUCER_SELECT);
  return row ? rowToProducer(row) : null;
}

export async function getDbCompany(id: string): Promise<Company | null> {
  const row = await fetchProfile(id, "company", PROFILE_SELECT);
  return row ? rowToCompany(row) : null;
}
