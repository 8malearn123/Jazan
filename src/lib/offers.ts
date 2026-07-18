
import type { Job } from "./types";

export type OfferStatus = "pending" | "approved" | "rejected";

export type CompanyOffer = Job & {
  seedStatus: OfferStatus;
  desc: string;
};

export const companyOffers: CompanyOffer[] = [
  {
    id: "of1",
    desc: "نبحث عن مصمم جرافيك لتنفيذ حملة رمضان كاملة: هوية الحملة، منشورات يومية لمنصات التواصل، وتصاميم إعلانات ممولة. العمل عن بُعد مع اجتماع أسبوعي في مقرنا بجيزان، لمدة شهرين قابلة للتمديد.",
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
    desc: "مطلوب مطوّر Flutter بخبرة سنتين فأكثر للانضمام لفريق تطبيق توصيل جديد يخدم منطقة جازان. المهام تشمل بناء واجهات التطبيق وربط الخرائط والدفع الإلكتروني. دوام كامل من مكتبنا في صبيا مع إمكانية يومين عن بُعد.",
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
    desc: "وظيفة منسّق شحن وتغليف في مستودعنا بجيزان: تجهيز الطلبات، متابعة شركات الشحن، وضبط المخزون. يشترط إجادة استخدام أنظمة نقاط البيع، والأولوية لسكان جيزان وضواحيها.",
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

export function approvedOffers(moderation: OfferModeration): Job[] {
  return companyOffers
    .filter((o) => offerStatus(o, moderation) === "approved")
    .map((o) => {
      const { seedStatus, ...job } = o;
      void seedStatus;
      return job;
    });
}
