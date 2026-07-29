"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "./supabase/client";
import { fetchOwnProfile, type OwnProfile } from "./members";
import { fetchWorks } from "./works";
import { loadPhotos } from "./photos";
import type { UserRole } from "./types";

/**
 * بوابة النشر — لا يظهر ملف أي عضو في التصفّح أو نتائج البحث حتى:
 * ١) يكمل بياناته الأساسية  ٢) يرسله للمراجعة  ٣) تعتمده الإدارة.
 */

export type PublishStatus = "draft" | "pending" | "approved" | "rejected";

export type PublishState = {
  status: PublishStatus;
  reviewNote?: string;
  submittedAt?: string;
  reviewedAt?: string;
};

export const publishLabels: Record<PublishStatus, string> = {
  draft: "مسودة — غير منشور",
  pending: "بانتظار المراجعة",
  approved: "منشور ومعتمد",
  rejected: "يحتاج تعديلاً",
};

export type RequirementItem = { key: string; label: string; done: boolean; hint: string };

/** بيانات التحقق من الاكتمال — تُجمع من الملف والصور والأعمال */
export type CompletionInput = {
  role: UserRole;
  profile: OwnProfile | null;
  hasAvatar: boolean;
  worksCount: number;
};

const MIN_BIO = 40;
const MIN_SKILLS = 3;
const MIN_WORKS = 1;

/** قائمة المتطلبات الإلزامية للنشر حسب نوع الحساب */
export function publishRequirements(input: CompletionInput): RequirementItem[] {
  const { role, profile, hasAvatar, worksCount } = input;
  const p = profile;
  const isCompany = role === "company";
  const isProducer = role === "producer";

  const titleLabel = isCompany ? "مجال الجهة" : isProducer ? "نشاط الأسرة" : "المسمى / التخصص";
  const bioLabel = isCompany ? "تعريف بالجهة" : "نبذة تعريفية";
  const avatarLabel = isCompany ? "شعار الجهة" : "صورة شخصية";
  const worksLabel = isProducer ? "منتج واحد على الأقل" : "عمل واحد على الأقل في معرض الأعمال";

  const items: RequirementItem[] = [
    {
      key: "name",
      label: "الاسم الكامل",
      done: (p?.name?.trim().length ?? 0) >= 3,
      hint: "اكتب اسمك كما تحب أن يظهر للزوار",
    },
    {
      key: "title",
      label: titleLabel,
      done: (p?.title?.trim().length ?? 0) >= 3,
      hint: "وصف مختصر لما تقدّمه",
    },
    {
      key: "city",
      label: "المدينة",
      done: Boolean(p?.city?.trim()),
      hint: "المحافظة التي تعمل منها",
    },
    {
      key: "whatsapp",
      label: "رقم واتساب للتواصل",
      done: (p?.whatsapp ?? "").replace(/[^0-9]/g, "").length >= 9,
      hint: "الرقم الذي يصلك عليه العملاء وأصحاب الفرص",
    },
    {
      key: "bio",
      label: `${bioLabel} (${MIN_BIO} حرفاً على الأقل)`,
      done: (p?.bio?.trim().length ?? 0) >= MIN_BIO,
      hint: "عرّف بنفسك وبخبرتك في سطرين",
    },
    {
      key: "avatar",
      label: avatarLabel,
      done: hasAvatar,
      hint: "صورة واضحة ترفعها من صفحة الملف الشخصي",
    },
  ];

  if (!isCompany) {
    items.push({
      key: "skills",
      label: `${MIN_SKILLS} مهارات على الأقل`,
      done: (p?.skills?.length ?? 0) >= MIN_SKILLS,
      hint: "المهارات تساعد الزوار على إيجادك في البحث",
    });
    items.push({
      key: "works",
      label: worksLabel,
      done: worksCount >= MIN_WORKS,
      hint: "أضفه من قسم «أعمالي» ليرى الزوار نموذجاً من شغلك",
    });
  }

  return items;
}

export function isComplete(items: RequirementItem[]): boolean {
  return items.every((i) => i.done);
}

export function completionPct(items: RequirementItem[]): number {
  if (!items.length) return 0;
  return Math.round((items.filter((i) => i.done).length / items.length) * 100);
}

type PublishRow = {
  publish_status: string | null;
  review_note: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
};

function rowToState(row: PublishRow): PublishState {
  const status = (row.publish_status ?? "draft") as PublishStatus;
  return {
    status: ["draft", "pending", "approved", "rejected"].includes(status) ? status : "draft",
    reviewNote: row.review_note ?? undefined,
    submittedAt: row.submitted_at ?? undefined,
    reviewedAt: row.reviewed_at ?? undefined,
  };
}

export async function fetchPublishState(userId: string): Promise<PublishState | null> {
  const supabase = createClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("publish_status, review_note, submitted_at, reviewed_at")
      .eq("id", userId)
      .maybeSingle();
    if (error || !data) return null;
    return rowToState(data as PublishRow);
  } catch {
    return null;
  }
}

/** إرسال الملف للمراجعة — يعيد null عندما لا يوجد Supabase */
export async function submitForReview(userId: string): Promise<boolean | null> {
  const supabase = createClient();
  if (!supabase) return null;
  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        publish_status: "pending",
        submitted_at: new Date().toISOString(),
        review_note: null,
      })
      .eq("id", userId);
    return !error;
  } catch {
    return false;
  }
}

/** حالة النشر للعضو الحالي مع دالة تحديث */
export function usePublishState(userId: string | undefined) {
  const [state, setState] = useState<PublishState | null>(null);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    if (!userId) return;
    const s = await fetchPublishState(userId);
    setState(s);
    setLoaded(true);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    fetchPublishState(userId).then((s) => {
      if (cancelled) return;
      setState(s);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { state, loaded, refresh, setState };
}

/** جمع بيانات الاكتمال من كل المصادر */
export function useCompletion(userId: string | undefined, role: UserRole) {
  const [items, setItems] = useState<RequirementItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const collect = useCallback(async (): Promise<RequirementItem[]> => {
    if (!userId) return [];
    const [profile, works] = await Promise.all([fetchOwnProfile(userId), fetchWorks(userId)]);
    const photos = loadPhotos(userId);
    return publishRequirements({
      role,
      profile,
      hasAvatar: Boolean(photos.avatar),
      worksCount: works.length,
    });
  }, [userId, role]);

  const load = useCallback(async () => {
    const next = await collect();
    setItems(next);
    setLoaded(true);
    return next;
  }, [collect]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    collect().then((next) => {
      if (cancelled) return;
      setItems(next);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [userId, collect]);

  return { items, loaded, reload: load, complete: isComplete(items), pct: completionPct(items) };
}

/* ── جانب الإدارة ── */

export type PendingProfile = {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  city?: string;
  title?: string;
  bio?: string;
  whatsapp?: string;
  status: PublishStatus;
  submittedAt?: string;
};

export async function fetchProfilesForReview(
  status: PublishStatus | "all" = "pending"
): Promise<PendingProfile[]> {
  const supabase = createClient();
  if (!supabase) return [];
  try {
    let query = supabase
      .from("profiles")
      .select("id, name, email, role, city, bio, whatsapp, publish_status, submitted_at")
      .neq("role", "admin");
    if (status !== "all") query = query.eq("publish_status", status);
    const { data, error } = await query.order("submitted_at", {
      ascending: false,
      nullsFirst: false,
    });
    if (error || !data) return [];
    return (
      data as unknown as {
        id: string;
        name: string | null;
        email: string | null;
        role: UserRole;
        city: string | null;
        bio: string | null;
        whatsapp: string | null;
        publish_status: string | null;
        submitted_at: string | null;
      }[]
    ).map((r) => ({
      id: r.id,
      name: r.name?.trim() || r.email || "عضو",
      email: r.email ?? undefined,
      role: r.role,
      city: r.city ?? undefined,
      bio: r.bio ?? undefined,
      whatsapp: r.whatsapp ?? undefined,
      status: (r.publish_status ?? "draft") as PublishStatus,
      submittedAt: r.submitted_at ?? undefined,
    }));
  } catch {
    return [];
  }
}

/** قرار الإدارة: اعتماد أو إعادة للتعديل مع ملاحظة */
export async function reviewProfile(
  profileId: string,
  decision: "approved" | "rejected",
  note?: string
): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        publish_status: decision,
        review_note: note?.trim() || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", profileId);
    return !error;
  } catch {
    return false;
  }
}

/** عدد الطلبات المنتظرة — لشارة القائمة الجانبية في لوحة المدير */
export async function countPendingReviews(): Promise<number> {
  const supabase = createClient();
  if (!supabase) return 0;
  try {
    const { count, error } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("publish_status", "pending");
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}
