"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { roleLabels } from "@/components/auth/AuthProvider";
import { AdminPageHead, TableCard, Th, Td, Pill } from "../_components/AdminTable";
import {
  fetchProfilesForReview,
  reviewProfile,
  publishLabels,
  type PendingProfile,
  type PublishStatus,
} from "@/lib/publish";
import { cn } from "@/lib/cn";

const roleTone: Record<string, "info" | "amber"> = {
  hero: "info",
  producer: "amber",
  company: "info",
};

const tabs: { key: PublishStatus | "all"; label: string }[] = [
  { key: "pending", label: "بانتظار المراجعة" },
  { key: "approved", label: "المنشورون" },
  { key: "rejected", label: "مُعادة للتعديل" },
  { key: "draft", label: "مسودّات" },
  { key: "all", label: "الكل" },
];

const profilePath: Record<string, string> = {
  hero: "heroes",
  producer: "producers",
  company: "companies",
};

function formatDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("ar-SA-u-ca-gregory", {
      month: "long",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function VerificationsPage() {
  const [tab, setTab] = useState<PublishStatus | "all">("pending");
  const [rows, setRows] = useState<PendingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [busyId, setBusyId] = useState("");
  const [rejectId, setRejectId] = useState("");
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const list = await fetchProfilesForReview(tab);
    setRows(list);
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    let cancelled = false;
    fetchProfilesForReview(tab).then((list) => {
      if (cancelled) return;
      setRows(list);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [tab]);

  async function decide(row: PendingProfile, decision: "approved" | "rejected", reason?: string) {
    setBusyId(row.id);
    const ok = await reviewProfile(row.id, decision, reason);
    setBusyId("");
    if (!ok) {
      setToast("تعذّر حفظ القرار — أعد المحاولة.");
      setTimeout(() => setToast(""), 3000);
      return;
    }
    setRejectId("");
    setNote("");
    setToast(
      decision === "approved"
        ? `تم اعتماد ونشر ملف ${row.name}`
        : `أُعيد ملف ${row.name} للتعديل`
    );
    setTimeout(() => setToast(""), 3000);
    load();
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-5">
      <AdminPageHead
        title="مراجعة الملفات والنشر"
        subtitle="لا يظهر أي عضو في المنصة حتى تعتمد ملفه من هنا"
      />

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "cursor-pointer rounded-full border-[1.5px] px-4 py-1.5 text-[13px] font-semibold transition-colors",
              tab === t.key
                ? "border-jazan bg-jazan text-white"
                : "border-line bg-surface text-charcoal hover:border-jazan/50"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {toast ? (
        <div className="rounded-xl bg-success/12 px-4 py-2.5 text-[13px] font-semibold text-success-ink">
          ✓ {toast}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-[16px] border border-line bg-surface px-6 py-12 text-center text-[14px] text-muted">
          جارٍ التحميل…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-[16px] border border-line bg-surface px-6 py-12 text-center text-[14px] text-muted">
          {tab === "pending"
            ? "✓ لا توجد طلبات معلّقة — تمت مراجعة الكل."
            : "لا توجد ملفات في هذه الحالة."}
        </div>
      ) : (
        <TableCard>
          <table className="w-full min-w-[860px] border-collapse">
            <thead>
              <tr className="border-b border-line bg-cream">
                <Th>العضو</Th>
                <Th>النوع</Th>
                <Th>المدينة</Th>
                <Th>الحالة</Th>
                <Th>تاريخ الطلب</Th>
                <Th>إجراءات</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0 align-top">
                  <Td className="font-bold text-charcoal">
                    <div>{r.name}</div>
                    {r.email ? (
                      <div className="mono mt-0.5 text-[11px] font-normal text-muted" dir="ltr">
                        {r.email}
                      </div>
                    ) : null}
                  </Td>
                  <Td>
                    <Pill tone={roleTone[r.role] ?? "info"}>{roleLabels[r.role]}</Pill>
                  </Td>
                  <Td>{r.city ?? "—"}</Td>
                  <Td>
                    <Pill
                      tone={
                        r.status === "approved"
                          ? "success"
                          : r.status === "pending"
                            ? "amber"
                            : "muted"
                      }
                    >
                      {publishLabels[r.status]}
                    </Pill>
                  </Td>
                  <Td>{formatDate(r.submittedAt)}</Td>
                  <Td>
                    {rejectId === r.id ? (
                      <div className="flex min-w-[260px] flex-col gap-2">
                        <textarea
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          rows={2}
                          placeholder="سبب الإعادة — يظهر للعضو في لوحته"
                          className="w-full resize-none rounded-lg border-[1.5px] border-line bg-surface px-3 py-2 text-[13px] text-charcoal outline-none focus:border-jazan"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => decide(r, "rejected", note)}
                            disabled={busyId === r.id}
                            className="cursor-pointer rounded-lg bg-danger px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                          >
                            إرسال الملاحظة
                          </button>
                          <button
                            onClick={() => {
                              setRejectId("");
                              setNote("");
                            }}
                            className="cursor-pointer rounded-lg border border-line px-3 py-1.5 text-[12px] font-semibold text-muted transition-colors hover:bg-cream"
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/${profilePath[r.role] ?? "heroes"}/${r.id}`}
                          target="_blank"
                          className="cursor-pointer rounded-lg border border-line bg-surface px-3 py-1.5 text-[12px] font-semibold text-charcoal no-underline transition-colors hover:bg-cream"
                        >
                          معاينة
                        </Link>
                        {r.status !== "approved" ? (
                          <button
                            onClick={() => decide(r, "approved")}
                            disabled={busyId === r.id}
                            className="cursor-pointer rounded-lg bg-jazan px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-jazan-dark disabled:opacity-50"
                          >
                            {busyId === r.id ? "…" : "اعتماد ونشر"}
                          </button>
                        ) : null}
                        {r.status !== "rejected" ? (
                          <button
                            onClick={() => {
                              setRejectId(r.id);
                              setNote("");
                            }}
                            className="cursor-pointer rounded-lg border border-danger-line bg-surface px-3 py-1.5 text-[12px] font-semibold text-danger transition-colors hover:bg-danger-soft"
                          >
                            {r.status === "approved" ? "إلغاء النشر" : "إعادة للتعديل"}
                          </button>
                        ) : null}
                      </div>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      )}
    </div>
  );
}
