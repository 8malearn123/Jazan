// طلبات عروض الشركات (وظائف وفرص جديدة) — لا يُنشر أي عرض في صفحة
// الشركات إلا بعد موافقة المدير. القرارات تُحفظ محلياً في الوضع التجريبي.

import type { Job } from "./types";

export type OfferStatus = "pending" | "approved" | "rejected";

export type CompanyOffer = Job & {
  /** الحالة الافتراضية قبل قرار المدير */
  seedStatus: OfferStatus;
};

/** طلبات العروض الواردة من الشركات */
export const companyOffers: CompanyOffer[] = [
  {
    id: "of1",
    title: "مصمم جرافيك للحملات الرمضانية",
    companyName: "واحة جازان الرقمية",
    companyId: "c2",
    city: "جيزان",
    type: "دوام جزئي",
    salary: "٤٬٥٠٠ ريال",
    postedAt: "اليوم",
    tags: ["تصميم", "حملات"],
    seedStatus: "pending",
  },
  {
    id: "of2",
    title: "مطوّر Flutter لتطبيق توصيل",
    companyName: "تهامة للتقنية",
    companyId: "c1",
    city: "صبيا",
    type: "دوام كامل",
    salary: "٩٬٠٠٠ ريال",
    postedAt: "أمس",
    tags: ["Flutter", "تطبيقات"],
    seedStatus: "pending",
  },
  {
    id: "of3",
    title: "منسّق شحن وتغليف",
    companyName: "متجر الساحل",
    companyId: "c3",
    city: "جيزان",
    type: "دوام كامل",
    salary: "٥٬٥٠٠ ريال",
    postedAt: "قبل يومين",
    tags: ["لوجستيات"],
    seedStatus: "pending",
  },
];

export type OfferModeration = Record<string, OfferStatus>;

const MODERATION_KEY = "jazanheroes.offers.moderation";
const MODERATION_EVENT = "jazanheroes:offers";

export function loadOfferModeration(): OfferModeration {
  try {
    const raw = localStorage.getItem(MODERATION_KEY);
    return raw ? (JSON.parse(raw) as OfferModeration) : {};
  } catch {
    return {};
  }
}

export function saveOfferModeration(moderation: OfferModeration): void {
  try {
    localStorage.setItem(MODERATION_KEY, JSON.stringify(moderation));
    window.dispatchEvent(new Event(MODERATION_EVENT));
  } catch {
    // ignore
  }
}

export function onOfferModerationChange(listener: () => void): () => void {
  window.addEventListener(MODERATION_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(MODERATION_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function offerStatus(offer: CompanyOffer, moderation: OfferModeration): OfferStatus {
  return moderation[offer.id] ?? offer.seedStatus;
}

export function pendingOffers(moderation: OfferModeration): CompanyOffer[] {
  return companyOffers.filter((o) => offerStatus(o, moderation) === "pending");
}

/** العروض المعتمدة — تُنشر في قائمة أحدث الوظائف بصفحة الشركات */
export function approvedOffers(moderation: OfferModeration): Job[] {
  return companyOffers
    .filter((o) => offerStatus(o, moderation) === "approved")
    .map((o) => {
      const { seedStatus, ...job } = o;
      void seedStatus;
      return job;
    });
}
