
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

export const allReviews: Review[] = [
  { id: "rv1", author: "مؤسسة النخبة للتسويق", type: "شركة", rating: 5, comment: "سرعة إنجاز ودقة عالية، والتقارير كانت واضحة أولاً بأول. تجربة يعتمد عليها.", date: "اليوم", seedStatus: "pending" },
  { id: "rv2", author: "أبو راكان", type: "عميل", rating: 4, comment: "النتيجة النهائية ممتازة والتواصل مريح، أنصح بالتعامل معه.", date: "أمس", seedStatus: "pending" },
  { id: "rv3", author: "تهامة للتقنية", type: "شركة", rating: 5, comment: "تسليم قبل الموعد وجودة عالية في التفاصيل. تجربة تعامل ممتازة وننصح به.", date: "قبل أسبوع", seedStatus: "approved" },
  { id: "rv4", author: "أم فيصل", type: "عميل", rating: 5, comment: "تعامل راقي وسرعة في الرد، والنتيجة فاقت التوقع. شكراً من القلب!", date: "قبل أسبوعين", seedStatus: "approved" },
  { id: "rv5", author: "متجر الساحل", type: "شركة", rating: 4, comment: "عمل احترافي والتواصل سلس عبر واتساب. نتطلع لتعاون قادم.", date: "قبل شهر", seedStatus: "approved" },
  { id: "rv6", author: "واحة جازان الرقمية", type: "شركة", rating: 5, comment: "التزام كامل بالمتطلبات وتسليم مرتّب. شراكة موفقة إن شاء الله.", date: "قبل شهر", seedStatus: "approved" },
  { id: "rv7", author: "أبو خالد", type: "عميل", rating: 4, comment: "خدمة جيدة وسعر مناسب، وياليت تكون الردود أسرع شوي في أوقات الذروة.", date: "قبل شهرين", seedStatus: "approved" },
  { id: "rv8", author: "دار صبيا للنشر", type: "شركة", rating: 5, comment: "إبداع في التنفيذ وتفاصيل مدروسة. تعاملنا معه أكثر من مرة وما قصّر.", date: "قبل شهرين", seedStatus: "approved" },
  { id: "rv9", author: "نوف الجيزاني", type: "عميل", rating: 3, comment: "الشغل حلو بس تأخر التسليم يومين عن الموعد المتفق عليه.", date: "قبل 3 أشهر", seedStatus: "approved" },
  { id: "rv10", author: "مؤسسة الشاطئ", type: "شركة", rating: 5, comment: "احترافية عالية من أول تواصل حتى التسليم. يستاهل التقييم الكامل.", date: "قبل 4 أشهر", seedStatus: "approved" },
];

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
