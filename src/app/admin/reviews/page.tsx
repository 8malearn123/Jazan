"use client";

import { useEffect, useState } from "react";
import { StarFilledIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { AdminPageHead, TableCard, Th, Td, Pill } from "../_components/AdminTable";
import {
  allReviews,
  reviewStatus,
  loadReviewModeration,
  saveReviewModeration,
  type Review,
  type ReviewModeration,
  type ReviewStatus,
} from "@/lib/reviews";

const statusMeta: Record<ReviewStatus, { label: string; tone: "warn" | "success" | "muted" }> = {
  pending: { label: "قيد المراجعة", tone: "warn" },
  approved: { label: "معتمد", tone: "success" },
  rejected: { label: "مرفوض", tone: "muted" },
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`التقييم ${rating} من 5`}>
      {Array.from({ length: 5 }).map((_, star) => (
        <StarFilledIcon
          key={star}
          className={star < rating ? "h-3.5 w-3.5 text-amber" : "h-3.5 w-3.5 text-line"}
        />
      ))}
    </span>
  );
}

function PendingCard({
  review,
  onDecide,
}: {
  review: Review;
  onDecide: (id: string, status: ReviewStatus) => void;
}) {
  return (
    <div className="rounded-[16px] border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-jazan/10 text-[14px] font-bold text-jazan">
            {review.author.trim().charAt(0)}
          </span>
          <div>
            <div className="text-[13px] font-bold text-charcoal">{review.author}</div>
            <div className="text-[11px] text-muted">
              {review.type} · {review.date}
            </div>
          </div>
        </div>
        <Stars rating={review.rating} />
      </div>
      <p className="mt-2.5 text-[13px] leading-relaxed text-ink">{review.comment}</p>
      <div className="mt-3 flex gap-2 border-t border-line-soft pt-3">
        <button
          onClick={() => onDecide(review.id, "approved")}
          className="cursor-pointer rounded-lg bg-jazan px-4 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-jazan-dark"
        >
          اعتماد ونشر
        </button>
        <button
          onClick={() => onDecide(review.id, "rejected")}
          className="cursor-pointer rounded-lg border border-danger-line bg-surface px-4 py-1.5 text-[12px] font-semibold text-danger transition-colors hover:bg-danger-soft"
        >
          رفض
        </button>
      </div>
    </div>
  );
}

export default function AdminReviewsPage() {
  const [moderation, setModeration] = useState<ReviewModeration>({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setModeration(loadReviewModeration());
  }, []);

  function decide(id: string, status: ReviewStatus) {
    const next = { ...moderation, [id]: status };
    setModeration(next);
    saveReviewModeration(next);
    setToast(status === "approved" ? "تم اعتماد التقييم — أصبح ظاهراً في المنصة" : "تم رفض التقييم — لن يظهر في المنصة");
    setTimeout(() => setToast(""), 2500);
  }

  const withStatus = allReviews.map((r) => ({ review: r, status: reviewStatus(r, moderation) }));
  const pending = withStatus.filter((r) => r.status === "pending");
  const decided = withStatus.filter((r) => r.status !== "pending");

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-5">
      <AdminPageHead
        title="التقييمات"
        subtitle={
          pending.length > 0
            ? `${pending.length} تقييم بانتظار المراجعة — لا يظهر أي تقييم في المنصة قبل اعتماده`
            : "لا يظهر أي تقييم في المنصة قبل اعتماده من هنا"
        }
      />

      {toast ? (
        <div className="rounded-xl bg-success/12 px-4 py-2.5 text-[13px] font-semibold text-success-ink">
          ✓ {toast}
        </div>
      ) : null}

      <div>
        <h2 className="text-[14px] font-bold text-charcoal">بانتظار الموافقة</h2>
        {pending.length === 0 ? (
          <div className="mt-2.5 rounded-[16px] border border-line bg-surface px-6 py-10 text-center text-[14px] text-muted">
            ✓ لا توجد تقييمات معلّقة — تمت مراجعة الكل.
          </div>
        ) : (
          <div className="mt-2.5 grid gap-3 lg:grid-cols-2">
            {pending.map(({ review }) => (
              <PendingCard key={review.id} review={review} onDecide={decide} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-[14px] font-bold text-charcoal">
          سجل التقييمات <span className="mono font-medium text-muted">({decided.length})</span>
        </h2>
        <div className="mt-2.5">
          <TableCard>
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="border-b border-line bg-cream">
                  <Th>صاحب التقييم</Th>
                  <Th>النجوم</Th>
                  <Th>التعليق</Th>
                  <Th>التاريخ</Th>
                  <Th>الحالة</Th>
                  <Th>إجراءات</Th>
                </tr>
              </thead>
              <tbody>
                {decided.map(({ review, status }) => (
                  <tr key={review.id} className="border-b border-line last:border-0">
                    <Td className="font-bold text-charcoal">
                      {review.author}
                      <span className="block text-[11px] font-medium text-muted">{review.type}</span>
                    </Td>
                    <Td>
                      <Stars rating={review.rating} />
                    </Td>
                    <Td className="max-w-[320px]">
                      <span className="line-clamp-2">{review.comment}</span>
                    </Td>
                    <Td className="whitespace-nowrap">{review.date}</Td>
                    <Td>
                      <Pill tone={statusMeta[status].tone}>{statusMeta[status].label}</Pill>
                    </Td>
                    <Td>
                      <button
                        onClick={() =>
                          decide(review.id, status === "approved" ? "rejected" : "approved")
                        }
                        className={cn(
                          "cursor-pointer rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition-colors",
                          status === "approved"
                            ? "border-danger-line bg-surface text-danger hover:bg-danger-soft"
                            : "border-jazan/40 bg-surface text-jazan hover:bg-jazan hover:text-white"
                        )}
                      >
                        {status === "approved" ? "إخفاء" : "اعتماد ونشر"}
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>
        </div>
      </div>
    </div>
  );
}
