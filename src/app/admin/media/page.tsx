"use client";

import { useEffect, useState } from "react";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { XIcon, CheckIcon } from "@/components/icons";
import { AdminPageHead, TableCard, Th, Td, Pill } from "../_components/AdminTable";
import { cn } from "@/lib/cn";
import {
  mediaSubmissions,
  mediaStatus,
  loadMediaModeration,
  saveMediaModeration,
  type MediaModeration,
  type MediaStatus,
} from "@/lib/media";

// الشعارات والصور — لا يُعرض شعار أو صورة في المنصة إلا بعد اعتمادها من هنا

const statusMeta: Record<MediaStatus, { label: string; tone: "warn" | "success" | "muted" }> = {
  pending: { label: "قيد المراجعة", tone: "warn" },
  approved: { label: "معتمد", tone: "success" },
  rejected: { label: "مرفوض", tone: "muted" },
};

const ownerTone: Record<string, string> = {
  "شركة": "bg-info/12 text-info-ink",
  "أسرة منتجة": "bg-amber/15 text-amber-dark",
  "بطل": "bg-jazan/10 text-jazan",
};


/** نافذة تفاصيل عنصر الشعارات/الصور — المراجعة قبل القرار */
function MediaModal({
  item,
  status,
  onClose,
  onDecide,
}: {
  item: (typeof mediaSubmissions)[number];
  status: MediaStatus;
  onClose: () => void;
  onDecide: (id: string, status: MediaStatus) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`تفاصيل ${item.title}`}
    >
      <button
        aria-label="إغلاق"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-[2px]"
      />
      <div className="relative z-10 flex max-h-[88vh] w-full max-w-[520px] flex-col overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_24px_70px_rgba(0,0,0,.35)]">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[16px] font-extrabold text-charcoal">تفاصيل العنصر</h2>
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
          {/* معاينة كبيرة */}
          <ImagePlaceholder shape="rect" label={`${item.kind} — معاينة بالحجم الكامل`} className="h-[190px] w-full rounded-[14px]" />

          <div className="mt-4 grid gap-2.5 rounded-[14px] border border-line bg-cream/60 p-4 text-[13px] sm:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold text-muted">العنصر</div>
              <div className="mt-0.5 font-bold text-charcoal">{item.title}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-muted">النوع</div>
              <div className="mt-0.5 font-bold text-charcoal">{item.kind}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-muted">صاحب الطلب</div>
              <div className="mt-0.5 flex flex-wrap items-center gap-2">
                <span className="font-bold text-charcoal">{item.owner}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", ownerTone[item.ownerType])}>
                  {item.ownerType}
                </span>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-muted">التاريخ</div>
              <div className="mt-0.5 text-charcoal">{item.date}</div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-[11px] font-semibold text-muted">الملف</div>
              <div className="mono mt-0.5 text-charcoal">{item.fileInfo}</div>
            </div>
          </div>

          <h3 className="mt-4 text-[13px] font-bold text-charcoal">وصف الطلب</h3>
          <p className="mt-1.5 rounded-[14px] border border-line bg-surface p-3.5 text-[13px] leading-relaxed text-ink">
            {item.note}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-4">
          {status !== "approved" ? (
            <button
              onClick={() => onDecide(item.id, "approved")}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-jazan px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-jazan-dark"
            >
              <CheckIcon width={15} height={15} strokeWidth={2.4} />
              اعتماد ونشر
            </button>
          ) : null}
          {status !== "rejected" ? (
            <button
              onClick={() => onDecide(item.id, "rejected")}
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

export default function AdminMediaPage() {
  const [moderation, setModeration] = useState<MediaModeration>({});
  const [toast, setToast] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setModeration(loadMediaModeration());
  }, []);

  function decide(id: string, status: MediaStatus) {
    const next = { ...moderation, [id]: status };
    setModeration(next);
    saveMediaModeration(next);
    setToast(status === "approved" ? "تم اعتماد العنصر — أصبح ظاهراً في المنصة" : "تم رفض العنصر — لن يظهر في المنصة");
    setTimeout(() => setToast(""), 2500);
    setOpenId(null);
  }

  const openItem = mediaSubmissions.find((m) => m.id === openId) ?? null;

  const withStatus = mediaSubmissions.map((m) => ({ item: m, status: mediaStatus(m, moderation) }));
  const pending = withStatus.filter((m) => m.status === "pending");
  const decided = withStatus.filter((m) => m.status !== "pending");

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-5">
      <AdminPageHead
        title="الشعارات والصور"
        subtitle={
          pending.length > 0
            ? `${pending.length} عنصر بانتظار المراجعة — لا يُعرض شعار أو صورة قبل اعتمادها`
            : "لا يُعرض شعار أو صورة في المنصة قبل اعتمادها من هنا"
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
            ✓ لا توجد عناصر معلّقة — تمت مراجعة الكل.
          </div>
        ) : (
          <div className="mt-2.5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pending.map(({ item }) => (
              <div key={item.id} className="overflow-hidden rounded-[16px] border border-line bg-surface">
                <ImagePlaceholder shape="rect" label={`${item.kind} — ${item.owner}`} className="h-[120px] w-full" />
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[13px] font-bold text-charcoal">{item.title}</h3>
                    <Pill tone="warn">{item.kind}</Pill>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-[12px] text-muted">
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", ownerTone[item.ownerType])}>
                      {item.ownerType}
                    </span>
                    {item.owner} · {item.date}
                  </div>
                  <div className="mt-3 flex gap-2 border-t border-line-soft pt-3">
                    <button
                      onClick={() => setOpenId(item.id)}
                      className="flex-1 cursor-pointer rounded-lg border border-line bg-surface px-3 py-1.5 text-[12px] font-semibold text-charcoal transition-colors hover:border-jazan hover:text-jazan"
                    >
                      التفاصيل
                    </button>
                    <button
                      onClick={() => decide(item.id, "approved")}
                      className="flex-1 cursor-pointer rounded-lg bg-jazan px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-jazan-dark"
                    >
                      اعتماد
                    </button>
                    <button
                      onClick={() => decide(item.id, "rejected")}
                      className="flex-1 cursor-pointer rounded-lg border border-danger-line bg-surface px-3 py-1.5 text-[12px] font-semibold text-danger transition-colors hover:bg-danger-soft"
                    >
                      رفض
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* السجل */}
      <div>
        <h2 className="text-[14px] font-bold text-charcoal">
          سجل العناصر <span className="mono font-medium text-muted">({decided.length})</span>
        </h2>
        <div className="mt-2.5">
          <TableCard>
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr className="border-b border-line bg-cream">
                  <Th>العنصر</Th>
                  <Th>النوع</Th>
                  <Th>صاحب الطلب</Th>
                  <Th>التاريخ</Th>
                  <Th>الحالة</Th>
                  <Th>إجراءات</Th>
                </tr>
              </thead>
              <tbody>
                {decided.map(({ item, status }) => (
                  <tr key={item.id} className="border-b border-line last:border-0">
                    <Td className="font-bold text-charcoal">{item.title}</Td>
                    <Td>{item.kind}</Td>
                    <Td>
                      {item.owner}
                      <span className="block text-[11px] text-muted">{item.ownerType}</span>
                    </Td>
                    <Td className="whitespace-nowrap">{item.date}</Td>
                    <Td>
                      <Pill tone={statusMeta[status].tone}>{statusMeta[status].label}</Pill>
                    </Td>
                    <Td>
                      <div className="flex gap-2">
                      <button
                        onClick={() => setOpenId(item.id)}
                        className="cursor-pointer rounded-lg border border-line bg-surface px-3 py-1.5 text-[12px] font-semibold text-charcoal transition-colors hover:border-jazan hover:text-jazan"
                      >
                        التفاصيل
                      </button>
                      <button
                        onClick={() => decide(item.id, status === "approved" ? "rejected" : "approved")}
                        className={cn(
                          "cursor-pointer rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition-colors",
                          status === "approved"
                            ? "border-danger-line bg-surface text-danger hover:bg-danger-soft"
                            : "border-jazan/40 bg-surface text-jazan hover:bg-jazan hover:text-white"
                        )}
                      >
                        {status === "approved" ? "إخفاء" : "اعتماد"}
                      </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>
        </div>
      </div>

      {openItem ? (
        <MediaModal
          item={openItem}
          status={mediaStatus(openItem, moderation)}
          onClose={() => setOpenId(null)}
          onDecide={decide}
        />
      ) : null}
    </div>
  );
}
