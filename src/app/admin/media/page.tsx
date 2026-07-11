"use client";

import { useEffect, useState } from "react";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
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

export default function AdminMediaPage() {
  const [moderation, setModeration] = useState<MediaModeration>({});
  const [toast, setToast] = useState("");

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
  }

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
