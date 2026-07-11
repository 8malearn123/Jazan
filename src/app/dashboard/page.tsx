"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { CheckIcon, WhatsappIcon, EyeIcon, StarFilledIcon, XIcon } from "@/components/icons";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/cn";

// أيقونات محلية صغيرة
function ChartIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
function EditIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />
    </svg>
  );
}
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

// نصوص موحّدة تناسب جميع مزوّدي الخدمات (أبطال، أسر منتجة، شركات)
const copy = {
  worksTitle: "أعمالي ونماذجي",
  addLabel: "أضف عملاً",
  tableTitle: "آخر من تواصل معك",
  availTitle: "حالة التوفّر",
  availOn: "متاح للتواصل",
  availOff: "غير متاح حالياً",
};

const stats = [
  { value: "1,240", label: "مشاهدات الملف", delta: "+18%", Icon: EyeIcon, bg: "bg-jazan/10", text: "text-jazan" },
  { value: "86", label: "نقرات واتساب", delta: "+9%", Icon: WhatsappIcon, bg: "bg-whatsapp/12", text: "text-whatsapp" },
  { value: "32", label: "طلبات التواصل", delta: null, Icon: ChartIcon, bg: "bg-info/12", text: "text-info-ink" },
];

const chart = [
  { label: "السبت", h: 96, hot: false },
  { label: "الأحد", h: 128, hot: true },
  { label: "الاثنين", h: 80, hot: false },
  { label: "الثلاثاء", h: 148, hot: true },
  { label: "الأربعاء", h: 172, hot: true },
  { label: "الخميس", h: 120, hot: false },
  { label: "اليوم", h: 104, hot: false, today: true },
];

// آخر من تواصل معك — عام لجميع مزوّدي الخدمات
const recentRows = [
  { name: "تهامة للتقنية", interest: "مهتم بخدماتك", date: "اليوم" },
  { name: "أبو خالد", interest: "استفسار عن الأسعار", date: "أمس" },
  { name: "واحة جازان الرقمية", interest: "طلب عرض سعر", date: "5 يونيو" },
  { name: "متجر الساحل", interest: "مهتم بالتعاون", date: "1 يونيو" },
] as const;

// التقييمات — آراء العملاء والشركات (الصندوق يعرض أحدث 3 والنافذة تعرض الكل)
const allReviews = [
  { author: "تهامة للتقنية", type: "شركة", rating: 5, comment: "تسليم قبل الموعد وجودة عالية في التفاصيل. تجربة تعامل ممتازة وننصح به.", date: "قبل أسبوع" },
  { author: "أم فيصل", type: "عميل", rating: 5, comment: "تعامل راقي وسرعة في الرد، والنتيجة فاقت التوقع. شكراً من القلب!", date: "قبل أسبوعين" },
  { author: "متجر الساحل", type: "شركة", rating: 4, comment: "عمل احترافي والتواصل سلس عبر واتساب. نتطلع لتعاون قادم.", date: "قبل شهر" },
  { author: "واحة جازان الرقمية", type: "شركة", rating: 5, comment: "التزام كامل بالمتطلبات وتسليم مرتّب. شراكة موفقة إن شاء الله.", date: "قبل شهر" },
  { author: "أبو خالد", type: "عميل", rating: 4, comment: "خدمة جيدة وسعر مناسب، وياليت تكون الردود أسرع شوي في أوقات الذروة.", date: "قبل شهرين" },
  { author: "دار صبيا للنشر", type: "شركة", rating: 5, comment: "إبداع في التنفيذ وتفاصيل مدروسة. تعاملنا معه أكثر من مرة وما قصّر.", date: "قبل شهرين" },
  { author: "نوف الجيزاني", type: "عميل", rating: 3, comment: "الشغل حلو بس تأخر التسليم يومين عن الموعد المتفق عليه.", date: "قبل 3 أشهر" },
  { author: "مؤسسة الشاطئ", type: "شركة", rating: 5, comment: "احترافية عالية من أول تواصل حتى التسليم. يستاهل التقييم الكامل.", date: "قبل 4 أشهر" },
] as const;

const recentReviews = allReviews.slice(0, 3);

const avgRating = (
  allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
).toFixed(1);

/** نجوم من 5 */
function Stars({ rating, size = "h-3.5 w-3.5" }: { rating: number; size?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`التقييم ${rating} من 5`}>
      {Array.from({ length: 5 }).map((_, star) => (
        <StarFilledIcon
          key={star}
          className={star < rating ? `${size} text-amber` : `${size} text-line`}
        />
      ))}
    </span>
  );
}

/** نافذة كل التقييمات */
function AllReviewsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="جميع التقييمات">
      <button aria-label="إغلاق" onClick={onClose} className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-[2px]" />
      <div className="relative z-10 flex max-h-[88vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_24px_70px_rgba(0,0,0,.35)]">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[16px] font-extrabold text-charcoal">جميع التقييمات</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber/15 px-2.5 py-1 text-[12px] font-bold text-amber-dark">
              <StarFilledIcon className="h-3.5 w-3.5 text-amber" />
              <span className="mono">{avgRating}</span>
              <span className="font-medium text-muted">· <span className="mono">{allReviews.length}</span></span>
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="flex h-9 w-9 flex-none cursor-pointer items-center justify-center rounded-[10px] border border-line text-muted transition-colors hover:border-jazan hover:text-jazan"
          >
            <XIcon width={18} height={18} />
          </button>
        </div>
        <div className="overflow-y-auto">
          {allReviews.map((r, i) => (
            <div key={i} className={cn("flex flex-col gap-2 px-5 py-4", i < allReviews.length - 1 && "border-b border-line-soft")}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-jazan/10 text-[14px] font-bold text-jazan">
                    {r.author.trim().charAt(0)}
                  </span>
                  <div>
                    <div className="text-[13px] font-bold text-charcoal">{r.author}</div>
                    <div className="text-[11px] text-muted">{r.type} · {r.date}</div>
                  </div>
                </div>
                <Stars rating={r.rating} />
              </div>
              <p className="text-[13px] leading-relaxed text-ink">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = (user?.name ?? "بطل").split(" ")[0];

  const [available, setAvailable] = useState(true);
  const [reviewsOpen, setReviewsOpen] = useState(false);

  const maxBar = Math.max(...chart.map((b) => b.h));

  return (
    <div className="pb-10">
      {/* الترحيب */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[18px] font-extrabold text-charcoal">
            أهلاً {firstName} 👋
          </h1>
          <p className="mt-0.5 text-[13px] text-muted">
            هذي نظرة على أداء ملفك آخر 30 يوم
          </p>
        </div>
        <span className="inline-flex w-max items-center gap-2 rounded-full bg-success/12 px-3.5 py-2 text-[13px] font-semibold text-success-ink">
          <CheckIcon width={15} height={15} strokeWidth={2.4} />
          الملف معتمد · منشور
        </span>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[14px] border border-line bg-surface p-4">
            <div className="flex items-center justify-between">
              <span className={cn("flex h-8 w-8 items-center justify-center rounded-[10px]", s.bg)}>
                <s.Icon className={cn("h-[18px] w-[18px]", s.text)} />
              </span>
              {s.delta ? (
                <span className="rounded-[7px] bg-success/12 px-2 py-0.5 text-[11px] font-semibold text-success-ink">
                  {s.delta}
                </span>
              ) : null}
            </div>
            <div className="mono mt-2.5 text-[20px] font-bold text-charcoal">
              {s.value}
            </div>
            <div className="mt-0.5 text-[12px] text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* اكتمال الملف + حالة التوفّر */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* اكتمال الملف */}
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-charcoal">اكتمال الملف</h3>
            <span className="mono text-[15px] font-semibold text-jazan">85%</span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-line-soft">
            <div className="h-full rounded-full bg-jazan" style={{ width: "85%" }} />
          </div>
          <p className="mt-3 text-[13px] text-muted">
            أكمل ملفك ليظهر بشكل أفضل في نتائج البحث.
          </p>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {[
              { label: "أضفت صورتك", done: true },
              { label: "أضفت نبذة تعريفية", done: true },
              { label: "حدّدت مهاراتك", done: true },
              { label: "أضف رابط أعمالك", done: false },
            ].map((item) => (
              <li key={item.label} className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex h-5 w-5 flex-none items-center justify-center rounded-full",
                    item.done ? "bg-success text-white" : "border-[1.5px] border-line"
                  )}
                >
                  {item.done ? <CheckIcon width={12} height={12} strokeWidth={2.6} /> : null}
                </span>
                <span className={cn("text-[13px]", item.done ? "text-ink" : "text-muted")}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-line-soft pt-4">
            <Button variant="secondary" size="sm" className="gap-2" href="/dashboard/profile">
              <EditIcon />
              تعديل الملف الشخصي
            </Button>
          </div>
        </div>

        {/* حالة التوفّر */}
        <div className="rounded-2xl border border-line bg-surface p-5">
          <h3 className="text-[15px] font-bold text-charcoal">{copy.availTitle}</h3>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-cream px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-charcoal">
                {available ? copy.availOn : copy.availOff}
              </div>
              <div className="text-[12px] text-muted">
                {available ? "ملفك يظهر للجميع" : "ملفك مخفي مؤقتاً"}
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={available}
              onClick={() => setAvailable((v) => !v)}
              className={cn(
                "relative h-7 w-12 flex-none rounded-full transition-colors",
                available ? "bg-jazan" : "bg-sand"
              )}
            >
              <span
                className={cn(
                  "absolute top-1 h-5 w-5 rounded-full bg-surface shadow transition-all",
                  available ? "start-1" : "start-6"
                )}
              />
            </button>
          </div>

          <div className="mt-4 rounded-xl bg-whatsapp/10 p-3.5">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-charcoal">
              <WhatsappIcon className="h-4 w-4 text-whatsapp" />
              التواصل عبر واتساب مُفعّل
            </div>
            <p className="mt-1 text-[12px] text-muted">
              الزوّار يصلونك مباشرة بضغطة زر.
            </p>
          </div>
        </div>
      </div>

      {/* الرسم البياني + معرض الأعمال */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* الرسم البياني */}
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-bold text-charcoal">مشاهدات الملف</h3>
              <div className="mt-0.5 text-[13px] text-muted">آخر 7 أيام</div>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-muted">
              <span className="h-2.5 w-2.5 rounded-[3px] bg-jazan" />
              مشاهدات
            </div>
          </div>
          <div className="mt-6 flex h-[180px] items-end justify-between gap-2.5">
            {chart.map((b) => (
              <div key={b.label} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-full max-w-[42px] rounded-t-lg transition-[filter] hover:brightness-105",
                    b.today ? "bg-amber" : b.hot ? "bg-jazan" : "bg-tag"
                  )}
                  style={{ height: `${(b.h / maxBar) * 100}%` }}
                />
                <span
                  className={cn(
                    "text-[12px]",
                    b.today ? "font-semibold text-charcoal" : "text-muted"
                  )}
                >
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* معرض الأعمال */}
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-charcoal">{copy.worksTitle}</h3>
            <span className="mono text-[13px] text-muted">3</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {["تصميم هوية", "واجهة متجر", "لوحة تحكم"].map((label) => (
              <div key={label} className="group relative">
                <ImagePlaceholder
                  label={label}
                  className="aspect-[4/3] w-full"
                  radius={12}
                />
                <Link
                  href="/dashboard/profile"
                  aria-label={`تعديل ${label}`}
                  className="absolute end-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-charcoal opacity-0 shadow transition-opacity group-hover:opacity-100"
                >
                  <EditIcon />
                </Link>
              </div>
            ))}
            {/* زر الإضافة */}
            <Link
              href="/dashboard/profile"
              className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-1.5 rounded-[12px] border-[1.5px] border-dashed border-line text-muted no-underline transition-colors hover:border-jazan hover:bg-jazan/[.03] hover:text-jazan"
            >
              <PlusIcon />
              <span className="text-[12px] font-semibold">{copy.addLabel}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* الجدول */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h3 className="text-[15px] font-bold text-charcoal">{copy.tableTitle}</h3>
        </div>

        {/* رأس الجدول — سطح المكتب */}
        <div className="hidden grid-cols-[1.4fr_1.4fr_110px_120px] gap-3 bg-cream px-5 py-3 text-[12px] font-bold text-muted sm:grid">
          <span>الاسم</span>
          <span>الاهتمام</span>
          <span>التاريخ</span>
          <span>الطريقة</span>
        </div>

        {recentRows.map((row, i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-cream sm:grid sm:grid-cols-[1.4fr_1.4fr_110px_120px] sm:items-center sm:gap-3",
              i < recentRows.length - 1 && "border-b border-line-soft"
            )}
          >
            <span className="text-[15px] font-semibold text-charcoal">{row.name}</span>
            <span className="text-sm text-ink">{row.interest}</span>
            <span className="mono text-[13px] text-muted">{row.date}</span>
            <span className="inline-flex w-max items-center gap-1.5 rounded-full bg-whatsapp/12 px-2.5 py-1 text-[12px] font-semibold text-success-ink">
              <WhatsappIcon className="h-3.5 w-3.5" />
              واتساب
            </span>
          </div>
        ))}
      </div>

      {/* آخر التقييمات */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4">
          <h3 className="text-[15px] font-bold text-charcoal">آخر التقييمات</h3>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber/15 px-3 py-1.5 text-[13px] font-bold text-amber-dark">
              <StarFilledIcon className="h-4 w-4 text-amber" />
              <span className="mono">{avgRating}</span>
              <span className="font-medium text-muted">
                من <span className="mono">{allReviews.length}</span> تقييمات
              </span>
            </span>
            <button
              type="button"
              onClick={() => setReviewsOpen(true)}
              className="cursor-pointer rounded-[10px] border-[1.5px] border-jazan bg-surface px-3.5 py-1.5 text-[13px] font-semibold text-jazan transition-colors hover:bg-jazan hover:text-white"
            >
              جميع التقييمات
            </button>
          </div>
        </div>

        <div className="grid gap-0 sm:grid-cols-3 sm:divide-x sm:divide-x-reverse sm:divide-line-soft">
          {recentReviews.map((r, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col gap-2 px-5 py-4",
                i < recentReviews.length - 1 && "border-b border-line-soft sm:border-b-0"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-jazan/10 text-[14px] font-bold text-jazan">
                    {r.author.trim().charAt(0)}
                  </span>
                  <div>
                    <div className="text-[13px] font-bold text-charcoal">{r.author}</div>
                    <div className="text-[11px] text-muted">{r.type} · {r.date}</div>
                  </div>
                </div>
              </div>
              <Stars rating={r.rating} />
              <p className="text-[13px] leading-relaxed text-ink">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>

      <AllReviewsModal open={reviewsOpen} onClose={() => setReviewsOpen(false)} />
    </div>
  );
}
