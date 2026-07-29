"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/cn";
import {
  submitForReview,
  useCompletion,
  usePublishState,
  type PublishStatus,
} from "@/lib/publish";

const statusStyles: Record<
  PublishStatus,
  { badge: string; dot: string; title: string; desc: string }
> = {
  draft: {
    badge: "bg-muted/[.14] text-muted",
    dot: "bg-muted",
    title: "ملفك غير منشور بعد",
    desc: "أكمل البيانات المطلوبة بالأسفل ثم أرسله للمراجعة — لن يظهر للزوار قبل اعتماد الإدارة.",
  },
  pending: {
    badge: "bg-warn/16 text-warn-ink",
    dot: "bg-warn",
    title: "ملفك بانتظار المراجعة",
    desc: "استلمت الإدارة طلبك وسيُراجع قريباً. سنبلغك هنا فور اعتماده.",
  },
  approved: {
    badge: "bg-success/12 text-success-ink",
    dot: "bg-success",
    title: "ملفك منشور ومعتمد",
    desc: "يظهر ملفك الآن في التصفّح ونتائج البحث أمام جميع الزوار.",
  },
  rejected: {
    badge: "bg-danger-soft text-danger",
    dot: "bg-danger",
    title: "ملفك يحتاج تعديلاً",
    desc: "راجعت الإدارة ملفك وطلبت تعديلاً قبل النشر. عدّل ما هو مطلوب ثم أعد الإرسال.",
  },
};

export function PublishGate({ compact = false }: { compact?: boolean }) {
  const { user } = useAuth();
  const role = user?.role ?? "hero";
  const { state, setState } = usePublishState(user?.id);
  const { items, complete, pct, reload } = useCompletion(user?.id, role);

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const status: PublishStatus = state?.status ?? "draft";
  const style = statusStyles[status];
  const canSubmit = complete && (status === "draft" || status === "rejected");
  const missing = items.filter((i) => !i.done);

  async function handleSubmit() {
    if (!user || sending || !canSubmit) return;
    setSending(true);
    setError("");
    await reload();
    const ok = await submitForReview(user.id);
    setSending(false);
    if (ok === null) {
      setError("الوضع التجريبي — أضف مفاتيح Supabase لتفعيل المراجعة الحقيقية.");
      return;
    }
    if (!ok) {
      setError("تعذّر الإرسال — أعد المحاولة بعد قليل.");
      return;
    }
    setState({ status: "pending", submittedAt: new Date().toISOString() });
  }

  if (compact) {
    return (
      <span
        className={cn(
          "inline-flex w-max items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-semibold",
          style.badge
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
        {style.title}
      </span>
    );
  }

  return (
    <section
      className={cn(
        "rounded-2xl border bg-surface p-5",
        status === "approved" ? "border-success/30" : "border-jazan/30"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-[16px] font-extrabold text-charcoal">حالة النشر</h2>
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-bold",
                style.badge
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
              {style.title}
            </span>
          </div>
          <p className="mt-1.5 max-w-[560px] text-[13px] leading-relaxed text-muted">{style.desc}</p>
        </div>
        <span className="mono text-[20px] font-bold text-jazan">{pct}%</span>
      </div>

      {state?.reviewNote && status === "rejected" ? (
        <p className="mt-3 rounded-xl border border-danger-line bg-danger-soft px-4 py-3 text-[13px] leading-relaxed text-danger">
          <span className="font-bold">ملاحظة الإدارة: </span>
          {state.reviewNote}
        </p>
      ) : null}

      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-line-soft">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500",
            complete ? "bg-success" : "bg-jazan"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.key} className="flex items-start gap-2.5">
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full",
                item.done ? "bg-success text-white" : "border-[1.5px] border-line"
              )}
            >
              {item.done ? <CheckIcon width={12} height={12} strokeWidth={2.6} /> : null}
            </span>
            <span className="min-w-0">
              <span
                className={cn(
                  "block text-[13px] font-medium",
                  item.done ? "text-ink" : "text-charcoal"
                )}
              >
                {item.label}
              </span>
              {!item.done ? (
                <span className="mt-0.5 block text-[12px] leading-relaxed text-muted">
                  {item.hint}
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>

      {error ? (
        <p className="mt-4 rounded-lg bg-warn/12 px-3 py-2 text-[13px] font-medium text-warn-ink">
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line-soft pt-4">
        {status === "pending" ? (
          <span className="text-[13px] font-semibold text-warn-ink">
            ⏳ طلبك قيد المراجعة — لا حاجة لإجراء آخر.
          </span>
        ) : status === "approved" ? (
          <>
            <Link
              href={`/heroes/${user?.id ?? ""}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl bg-jazan px-5 py-2.5 text-[14px] font-bold text-white no-underline transition-colors hover:bg-jazan-dark"
            >
              عرض ملفي العام
            </Link>
            <span className="text-[13px] text-muted">
              أي تعديل تحفظه يظهر مباشرة في ملفك المنشور.
            </span>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || sending}
              className="cursor-pointer rounded-xl bg-jazan px-6 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-jazan-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {sending ? "جارٍ الإرسال…" : "إرسال للمراجعة"}
            </button>
            {!complete ? (
              <span className="text-[13px] text-muted">
                باقي {missing.length} {missing.length === 1 ? "عنصر" : "عناصر"} لإكمال ملفك.
              </span>
            ) : (
              <span className="text-[13px] font-semibold text-success-ink">
                ✓ اكتملت بياناتك — أرسلها الآن للمراجعة.
              </span>
            )}
            <Link
              href="/dashboard/profile"
              className="text-[13px] font-semibold text-jazan no-underline hover:underline"
            >
              تعديل الملف الشخصي ←
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
