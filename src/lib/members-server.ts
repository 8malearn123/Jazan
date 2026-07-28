import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./supabase/config";
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

// عميل عام بلا كوكيز — القراءة هنا عامة (سياسة public_read) ولا تحتاج جلسة،
// وقراءة الكوكيز داخل صفحة مولّدة مسبقاً ترمي DYNAMIC_SERVER_USAGE
function createPublicClient() {
  if (!isSupabaseConfigured) return null;
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // لا جلسة — لا شيء يُكتب
      },
    },
  });
}

async function fetchProfile(
  id: string,
  role: "hero" | "producer" | "company",
  select: string
): Promise<ProfileRow | null> {
  if (!UUID_RE.test(id)) return null;
  const supabase = createPublicClient();
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
