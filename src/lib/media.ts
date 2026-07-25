
export type MediaStatus = "pending" | "approved" | "rejected";

export type MediaSubmission = {
  id: string;
  title: string;
  owner: string;
  ownerType: "بطل" | "أسرة منتجة" | "شركة";
  kind: "شعار" | "صورة منتج" | "صورة غلاف" | "صورة شخصية";
  date: string;
  seedStatus: MediaStatus;
  note: string;
  fileInfo: string;
};

export const mediaSubmissions: MediaSubmission[] = [];

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
