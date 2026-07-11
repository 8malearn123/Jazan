// اعتماد الشعارات والصور — أي شعار أو صورة يرفعها عضو لا تُعرض
// في المنصة إلا بعد موافقة المدير. القرارات تُحفظ محلياً في الوضع التجريبي.

export type MediaStatus = "pending" | "approved" | "rejected";

export type MediaSubmission = {
  id: string;
  /** وصف العنصر */
  title: string;
  /** صاحب الطلب */
  owner: string;
  ownerType: "بطل" | "أسرة منتجة" | "شركة";
  kind: "شعار" | "صورة منتج" | "صورة غلاف" | "صورة شخصية";
  date: string;
  seedStatus: MediaStatus;
};

/** طلبات الشعارات والصور الواردة */
export const mediaSubmissions: MediaSubmission[] = [
  { id: "m1", title: "شعار جديد للشركة", owner: "تهامة للتقنية", ownerType: "شركة", kind: "شعار", date: "اليوم", seedStatus: "pending" },
  { id: "m2", title: "صورة طبق عريكة بالعسل", owner: "أسرة نكهات صبيا", ownerType: "أسرة منتجة", kind: "صورة منتج", date: "اليوم", seedStatus: "pending" },
  { id: "m3", title: "صورة غلاف الملف الشخصي", owner: "محمد عسيري", ownerType: "بطل", kind: "صورة غلاف", date: "أمس", seedStatus: "pending" },
  { id: "m4", title: "شعار المتجر المحدّث", owner: "متجر الساحل", ownerType: "شركة", kind: "شعار", date: "قبل يومين", seedStatus: "approved" },
  { id: "m5", title: "صورة عبوة دهن العود", owner: "عطور الساحل", ownerType: "أسرة منتجة", kind: "صورة منتج", date: "قبل 3 أيام", seedStatus: "approved" },
];

export type MediaModeration = Record<string, MediaStatus>;

const MODERATION_KEY = "jazanheroes.media.moderation";
const MODERATION_EVENT = "jazanheroes:media";

export function loadMediaModeration(): MediaModeration {
  try {
    const raw = localStorage.getItem(MODERATION_KEY);
    return raw ? (JSON.parse(raw) as MediaModeration) : {};
  } catch {
    return {};
  }
}

export function saveMediaModeration(moderation: MediaModeration): void {
  try {
    localStorage.setItem(MODERATION_KEY, JSON.stringify(moderation));
    window.dispatchEvent(new Event(MODERATION_EVENT));
  } catch {
    // ignore
  }
}

export function onMediaModerationChange(listener: () => void): () => void {
  window.addEventListener(MODERATION_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(MODERATION_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function mediaStatus(item: MediaSubmission, moderation: MediaModeration): MediaStatus {
  return moderation[item.id] ?? item.seedStatus;
}

export function pendingMedia(moderation: MediaModeration): MediaSubmission[] {
  return mediaSubmissions.filter((m) => mediaStatus(m, moderation) === "pending");
}
