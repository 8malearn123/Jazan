"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BuildingIcon, EyeIcon, XIcon, CheckIcon } from "@/components/icons";
import { AdminPageHead, TableCard, Th, Td, Pill } from "../_components/AdminTable";
import { cn } from "@/lib/cn";
import {
  companyOffers,
  offerStatus,
  loadOfferModeration,
  saveOfferModeration,
  type OfferModeration,
  type OfferStatus,
} from "@/lib/offers";

// عروض الشركات — طلبات نشر الوظائف والفرص، تُنشر في صفحة الشركات بعد الموافقة

const statusMeta: Record<OfferStatus, { label: string; tone: "warn" | "success" | "muted" }> = {
  pending: { label: "قيد المراجعة", tone: "warn" },
  approved: { label: "منشور", tone: "success" },
  rejected: { label: "مرفوض", tone: "muted" },
};


/** نافذة تفاصيل عرض الشركة — المراجعة الكاملة قبل القرار */
function OfferModal({
  offer,
  status,
  onClose,
  onDecide,
}: {
  offer: (typeof companyOffers)[number];
  status: OfferStatus;
  onClose: () => void;
  onDecide: (id: string, status: OfferStatus) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`تفاصيل ${offer.title}`}
    >
      <button
        aria-label="إغلاق"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-[2px]"
      />
      <div className="relative z-10 flex max-h-[88vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_24px_70px_rgba(0,0,0,.35)]">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[16px] font-extrabold text-charcoal">تفاصيل العرض</h2>
            <Pill tone={statusMeta[status].tone}>{statusMeta[status].label}</Pill>
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

        <div className="overflow-y-auto px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[13px] bg-info/12 text-info-ink">
              <BuildingIcon width={20} height={20} />
            </span>
            <div>
              <h3 className="text-[15px] font-extrabold text-charcoal">{offer.title}</h3>
              <div className="text-[12px] text-muted">{offer.companyName}</div>
            </div>
          </div>

          <div className="mt-4 grid gap-2.5 rounded-[14px] border border-line bg-cream/60 p-4 text-[13px] sm:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold text-muted">المدينة</div>
              <div className="mt-0.5 font-bold text-charcoal">{offer.city}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-muted">نوع الدوام</div>
              <div className="mt-0.5 font-bold text-charcoal">{offer.type}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-muted">الراتب</div>
              <div className="mono mt-0.5 font-bold text-charcoal">{offer.salary}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-muted">تاريخ الطلب</div>
              <div className="mt-0.5 text-charcoal">{offer.postedAt}</div>
            </div>
          </div>

          <h3 className="mt-4 text-[13px] font-bold text-charcoal">وصف العرض</h3>
          <p className="mt-1.5 rounded-[14px] border border-line bg-surface p-3.5 text-[13px] leading-relaxed text-ink">
            {offer.desc}
          </p>

          {(offer.tags ?? []).length > 0 ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {(offer.tags ?? []).map((t) => (
                <span key={t} className="rounded-full bg-tag px-2.5 py-1 text-[12px] text-muted">{t}</span>
              ))}
            </div>
          ) : null}

          {offer.companyId ? (
            <Link
              href={`/companies/${offer.companyId}`}
              target="_blank"
              className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-jazan no-underline hover:underline"
            >
              <EyeIcon width={15} height={15} />
              فتح صفحة {offer.companyName} في المنصة
            </Link>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-4">
          {status !== "approved" ? (
            <button
              onClick={() => onDecide(offer.id, "approved")}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-jazan px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-jazan-dark"
            >
              <CheckIcon width={15} height={15} strokeWidth={2.4} />
              موافقة ونشر
            </button>
          ) : null}
          {status !== "rejected" ? (
            <button
              onClick={() => onDecide(offer.id, "rejected")}
              className="cursor-pointer rounded-xl border border-danger-line bg-surface px-5 py-2.5 text-[13px] font-semibold text-danger transition-colors hover:bg-danger-soft"
            >
              رفض
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="ms-auto cursor-pointer rounded-xl border border-line bg-surface px-5 py-2.5 text-[13px] font-semibold text-muted transition-colors hover:bg-cream"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminOffersPage() {
  const [moderation, setModeration] = useState<OfferModeration>({});
  const [toast, setToast] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setModeration(loadOfferModeration());
  }, []);

  function decide(id: string, status: OfferStatus) {
    const next = { ...moderation, [id]: status };
    setModeration(next);
    saveOfferModeration(next);
    setToast(
      status === "approved"
        ? "تمت الموافقة — العرض منشور الآن في صفحة الشركات"
        : "تم رفض الطلب — لن يُنشر العرض"
    );
    setTimeout(() => setToast(""), 2500);
    setOpenId(null);
  }

  const openOffer = companyOffers.find((o) => o.id === openId) ?? null;

  const withStatus = companyOffers.map((o) => ({ offer: o, status: offerStatus(o, moderation) }));
  const pending = withStatus.filter((o) => o.status === "pending");
  const decided = withStatus.filter((o) => o.status !== "pending");

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-5">
      <AdminPageHead
        title="عروض الشركات"
        subtitle={
          pending.length > 0
            ? `${pending.length} طلب نشر بانتظار موافقتك — لا يُنشر عرض قبل الموافقة عليه`
            : "لا يُنشر أي عرض في صفحة الشركات قبل الموافقة عليه من هنا"
        }
      />

      {toast ? (
        <div className="rounded-xl bg-success/12 px-4 py-2.5 text-[13px] font-semibold text-success-ink">
          ✓ {toast}
        </div>
      ) : null}

      {/* بانتظار الموافقة */}
      <div>
        <h2 className="text-[14px] font-bold text-charcoal">بانتظار الموافقة</h2>
        {pending.length === 0 ? (
          <div className="mt-2.5 rounded-[16px] border border-line bg-surface px-6 py-10 text-center text-[14px] text-muted">
            ✓ لا توجد طلبات معلّقة — تمت مراجعة الكل.
          </div>
        ) : (
          <div className="mt-2.5 grid gap-3 lg:grid-cols-2">
            {pending.map(({ offer }) => (
              <div key={offer.id} className="rounded-[16px] border border-line bg-surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[12px] bg-info/12 text-info-ink">
                      <BuildingIcon width={18} height={18} />
                    </span>
                    <div>
                      <h3 className="text-[14px] font-bold text-charcoal">{offer.title}</h3>
                      <div className="text-[12px] text-muted">
                        {offer.companyName} · {offer.city} · {offer.postedAt}
                      </div>
                    </div>
                  </div>
                  <Pill tone="warn">قيد المراجعة</Pill>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px]">
                  {offer.type ? (
                    <span className="rounded-full bg-jazan/10 px-2.5 py-1 font-semibold text-jazan">{offer.type}</span>
                  ) : null}
                  {offer.salary ? (
                    <span className="mono rounded-full bg-amber/15 px-2.5 py-1 font-semibold text-amber-dark">{offer.salary}</span>
                  ) : null}
                  {(offer.tags ?? []).map((t) => (
                    <span key={t} className="rounded-full bg-tag px-2.5 py-1 text-muted">{t}</span>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line-soft pt-3">
                  <button
                    onClick={() => setOpenId(offer.id)}
                    className="cursor-pointer rounded-lg border border-line bg-surface px-4 py-1.5 text-[12px] font-semibold text-charcoal transition-colors hover:border-jazan hover:text-jazan"
                  >
                    التفاصيل
                  </button>
                  <button
                    onClick={() => decide(offer.id, "approved")}
                    className="cursor-pointer rounded-lg bg-jazan px-4 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-jazan-dark"
                  >
                    موافقة ونشر
                  </button>
                  <button
                    onClick={() => decide(offer.id, "rejected")}
                    className="cursor-pointer rounded-lg border border-danger-line bg-surface px-4 py-1.5 text-[12px] font-semibold text-danger transition-colors hover:bg-danger-soft"
                  >
                    رفض
                  </button>
                  {offer.companyId ? (
                    <Link
                      href={`/companies/${offer.companyId}`}
                      target="_blank"
                      className="ms-auto inline-flex items-center gap-1.5 text-[12px] font-semibold text-jazan no-underline hover:underline"
                    >
                      <EyeIcon width={14} height={14} />
                      صفحة الشركة
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* السجل */}
      <div>
        <h2 className="text-[14px] font-bold text-charcoal">
          سجل الطلبات <span className="mono font-medium text-muted">({decided.length})</span>
        </h2>
        {decided.length === 0 ? (
          <div className="mt-2.5 rounded-[16px] border border-line bg-surface px-6 py-8 text-center text-[13px] text-muted">
            لم يُبتّ في أي طلب بعد.
          </div>
        ) : (
          <div className="mt-2.5">
            <TableCard>
              <table className="w-full min-w-[720px] border-collapse">
                <thead>
                  <tr className="border-b border-line bg-cream">
                    <Th>العرض</Th>
                    <Th>الشركة</Th>
                    <Th>الدوام</Th>
                    <Th>الراتب</Th>
                    <Th>الحالة</Th>
                    <Th>إجراءات</Th>
                  </tr>
                </thead>
                <tbody>
                  {decided.map(({ offer, status }) => (
                    <tr key={offer.id} className="border-b border-line last:border-0">
                      <Td className="font-bold text-charcoal">{offer.title}</Td>
                      <Td>{offer.companyName}</Td>
                      <Td>{offer.type}</Td>
                      <Td className="mono whitespace-nowrap">{offer.salary}</Td>
                      <Td>
                        <Pill tone={statusMeta[status].tone}>{statusMeta[status].label}</Pill>
                      </Td>
                      <Td>
                        <div className="flex gap-2">
                        <button
                          onClick={() => setOpenId(offer.id)}
                          className="cursor-pointer rounded-lg border border-line bg-surface px-3 py-1.5 text-[12px] font-semibold text-charcoal transition-colors hover:border-jazan hover:text-jazan"
                        >
                          التفاصيل
                        </button>
                        <button
                          onClick={() => decide(offer.id, status === "approved" ? "rejected" : "approved")}
                          className={cn(
                            "cursor-pointer rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition-colors",
                            status === "approved"
                              ? "border-danger-line bg-surface text-danger hover:bg-danger-soft"
                              : "border-jazan/40 bg-surface text-jazan hover:bg-jazan hover:text-white"
                          )}
                        >
                          {status === "approved" ? "إيقاف النشر" : "موافقة ونشر"}
                        </button>
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableCard>
          </div>
        )}
      </div>

      {openOffer ? (
        <OfferModal
          offer={openOffer}
          status={offerStatus(openOffer, moderation)}
          onClose={() => setOpenId(null)}
          onDecide={decide}
        />
      ) : null}
    </div>
  );
}
