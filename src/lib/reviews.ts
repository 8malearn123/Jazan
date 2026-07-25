
export type ReviewStatus = "pending" | "approved" | "rejected";

export type Review = {
  id: string;
  author: string;
  type: "شركة" | "عميل";
  rating: number;
  comment: string;
  date: string;
  seedStatus: ReviewStatus;
};

export const allReviews: Review[] = [];

export type ReviewModeration = Record<string, ReviewStatus>;

const MODERATION_KEY = "jazanheroes.reviews.moderation";
const MODERATION_EVENT = "jazanheroes:reviews";

export function loadReviewModeration(): ReviewModeration {
  try {
    const raw = localStorage.getItem(MODERATION_KEY);
    return raw ? (JSON.parse(raw) as ReviewModeration) : {};
  } catch {
    return {};
  }
}

export function saveReviewModeration(moderation: ReviewModeration): void {
  try {
    localStorage.setItem(MODERATION_KEY, JSON.stringify(moderation));
    window.dispatchEvent(new Event(MODERATION_EVENT));
  } catch {
    // ignore
  }
}

export function onReviewModerationChange(listener: () => void): () => void {
  window.addEventListener(MODERATION_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(MODERATION_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function reviewStatus(review: Review, moderation: ReviewModeration): ReviewStatus {
  return moderation[review.id] ?? review.seedStatus;
}

export function approvedReviews(moderation: ReviewModeration): Review[] {
  return allReviews.filter((r) => reviewStatus(r, moderation) === "approved");
}

export function pendingReviews(moderation: ReviewModeration): Review[] {
  return allReviews.filter((r) => reviewStatus(r, moderation) === "pending");
}
