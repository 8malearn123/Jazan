import type { AvailabilityStatus, Company, Hero, Producer, UserRole } from "./types";

/**
 * تحويل صفوف جدول profiles (مع الجداول المرافقة) إلى أنواع الواجهة —
 * مشترك بين جلب العميل (المتصفح) وجلب الخادم (صفحات التفاصيل).
 */

export type HeroProfileJoin = {
  title: string | null;
  status: string | null;
  years: number | null;
  skills: string[] | null;
  rating: number | null;
  reviews_count: number | null;
};

export type ProducerProfileJoin = {
  category: string | null;
  rating: number | null;
  reviews_count: number | null;
};

export type ProfileRow = {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  city: string | null;
  bio: string | null;
  whatsapp: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  verified: boolean | null;
  created_at: string;
  hero_profiles?: HeroProfileJoin | HeroProfileJoin[] | null;
  producer_profiles?: ProducerProfileJoin | ProducerProfileJoin[] | null;
};

export const HERO_SELECT =
  "id, name, email, role, city, bio, whatsapp, avatar_url, cover_url, verified, created_at, hero_profiles(title, status, years, skills, rating, reviews_count)";

export const PRODUCER_SELECT =
  "id, name, email, role, city, bio, whatsapp, avatar_url, cover_url, verified, created_at, producer_profiles(category, rating, reviews_count)";

export const PROFILE_SELECT =
  "id, name, email, role, city, bio, whatsapp, avatar_url, cover_url, verified, created_at";

function first<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

const validStatus = new Set<AvailabilityStatus>(["freelance", "job", "both", "producer"]);

export function rowToHero(row: ProfileRow): Hero {
  const hp = first(row.hero_profiles);
  const status =
    hp?.status && validStatus.has(hp.status as AvailabilityStatus)
      ? (hp.status as AvailabilityStatus)
      : "both";
  return {
    id: row.id,
    name: row.name?.trim() || "عضو جديد",
    title: hp?.title?.trim() || "باحث عن فرص من جازان",
    city: row.city?.trim() || "جازان",
    status,
    skills: hp?.skills ?? [],
    years: hp?.years ?? undefined,
    rating: hp?.rating ?? undefined,
    reviewsCount: hp?.reviews_count ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
    coverUrl: row.cover_url ?? undefined,
    bio: row.bio ?? undefined,
    whatsapp: row.whatsapp ?? undefined,
    verified: !!row.verified,
  };
}

export function rowToProducer(row: ProfileRow): Producer {
  const pp = first(row.producer_profiles);
  return {
    id: row.id,
    name: row.name?.trim() || "أسرة منتجة",
    category: pp?.category?.trim() || "حِرف",
    city: row.city?.trim() || "جازان",
    bio: row.bio ?? undefined,
    rating: pp?.rating ?? undefined,
    reviewsCount: pp?.reviews_count ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
    coverUrl: row.cover_url ?? undefined,
    whatsapp: row.whatsapp ?? undefined,
    verified: !!row.verified,
    products: [],
  };
}

export function rowToCompany(row: ProfileRow): Company {
  return {
    id: row.id,
    name: row.name?.trim() || "جهة عمل",
    field: row.bio?.trim() || "جهة عمل في جازان",
    city: row.city?.trim() || "جازان",
    about: row.bio ?? undefined,
    logoUrl: row.avatar_url ?? undefined,
    coverUrl: row.cover_url ?? undefined,
    openings: 0,
    verified: !!row.verified,
    whatsapp: row.whatsapp ?? undefined,
    jobs: [],
  };
}

export type MemberRow = {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  city?: string;
  verified: boolean;
  createdAt: string;
};

export function rowToMember(row: ProfileRow): MemberRow {
  return {
    id: row.id,
    name: row.name?.trim() || row.email || "عضو",
    email: row.email ?? undefined,
    role: row.role,
    city: row.city ?? undefined,
    verified: !!row.verified,
    createdAt: row.created_at,
  };
}
