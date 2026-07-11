"use client";

import { useState } from "react";
import Link from "next/link";
import { reports as initialReports } from "@/lib/data";
import type { AdminReport } from "@/lib/types";
import { XIcon, EyeIcon, CheckIcon } from "@/components/icons";
import { AdminPageHead, TableCard, Th, Td, Pill } from "../_components/AdminTable";

// البلاغات — زر «معالجة» يفتح تفاصيل البلاغ كاملة قبل اتخاذ الإجراء

/** نافذة تفاصيل البلاغ */
function ReportModal({
  report,
  onClose,
  onResolve,
  onRemove,
}: {
  report: AdminReport;
  onClose: () => void;
  onResolve: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const open = report.status === "open";
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`تفاصيل البلاغ عن ${report.target}`}
    >
      <button
        aria-label="إغلاق"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-[2px]"
      />
      <div className="relative z-10 flex max-h-[88vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_24px_70px_rgba(0,0,0,.35)]">
        {/* الترويسة */}
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[16px] font-extrabold text-charcoal">تفاصيل البلاغ</h2>
            {open ? <Pill tone="warn">مفتوح</Pill> : <Pill tone="success">تمت المعالجة</Pill>}
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

        {/* المحتوى */}
        <div className="overflow-y-auto px-5 py-4">
          <div className="grid gap-2.5 rounded-[14px] border border-line bg-cream/60 p-4 text-[13px] sm:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold text-muted">الجهة المُبلَّغ عنها</div>
              <div className="mt-0.5 flex flex-wrap items-center gap-2">
                <span className="font-bold text-charcoal">{report.target}</span>
                <span className="rounded-full bg-info/12 px-2 py-0.5 text-[11px] font-semibold text-info-ink">
                  {report.targetType}
                </span>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-muted">سبب البلاغ</div>
              <div className="mt-0.5 font-bold text-charcoal">{report.reason}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-muted">المُبلِّغ</div>
              <div className="mono mt-0.5 text-charcoal">{report.reporter}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-muted">التاريخ</div>
              <div className="mt-0.5 text-charcoal">{report.date}</div>
            </div>
          </div>

          <h3 className="mt-4 text-[13px] font-bold text-charcoal">نص البلاغ</h3>
          <p className="mt-1.5 rounded-[14px] border border-line bg-surface p-3.5 text-[13px] leading-relaxed text-ink">
            {report.message}
          </p>

          <h3 className="mt-4 text-[13px] font-bold text-charcoal">المحتوى المُبلَّغ عنه</h3>
          <p className="mt-1.5 rounded-[14px] border border-warn/40 bg-warn/8 p-3.5 text-[13px] leading-relaxed text-ink">
            {report.content}
          </p>

          {report.targetHref ? (
            <Link
              href={report.targetHref}
              target="_blank"
              className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-jazan no-underline hover:underline"
            >
              <EyeIcon width={15} height={15} />
              فتح صفحة {report.target} في المنصة
            </Link>
          ) : (
            <p className="mt-3 text-[12px] text-muted">لا توجد صفحة عامة لهذه الجهة.</p>
          )}
        </div>

        {/* الإجراءات */}
        <div className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-4">
          {open ? (
            <button
              onClick={() => onResolve(report.id)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-jazan px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-jazan-dark"
            >
              <CheckIcon width={15} height={15} strokeWidth={2.4} />
              تأكيد المعالجة وإغلاق البلاغ
            </button>
          ) : null}
          <button
            onClick={() => onRemove(report.id)}
            className="cursor-pointer rounded-xl border border-danger-line bg-surface px-5 py-2.5 text-[13px] font-semibold text-danger transition-colors hover:bg-danger-soft"
          >
            حذف البلاغ
          </button>
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

export default function AdminReportsPage() {
  const [reports, setReports] = useState(initialReports);
  const [toast, setToast] = useState("");
  const [openReportId, setOpenReportId] = useState<string | null>(null);

  const open = reports.filter((r) => r.status === "open").length;
  const selected = reports.find((r) => r.id === openReportId) ?? null;

  function resolveReport(id: string) {
    setReports((list) =>
      list.map((r) => (r.id === id ? { ...r, status: "resolved" as const } : r))
    );
    setOpenReportId(null);
    setToast("تمت معالجة البلاغ");
    setTimeout(() => setToast(""), 2500);
  }
  function removeReport(id: string) {
    setReports((list) => list.filter((r) => r.id !== id));
    setOpenReportId(null);
    setToast("تم حذف البلاغ");
    setTimeout(() => setToast(""), 2500);
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-5">
      <AdminPageHead title="البلاغات" subtitle={`${open} بلاغ مفتوح بحاجة لمراجعة`} />

      {toast ? (
        <div className="rounded-xl bg-success/12 px-4 py-2.5 text-[13px] font-semibold text-success-ink">
          ✓ {toast}
        </div>
      ) : null}

      {reports.length === 0 ? (
        <div className="rounded-[16px] border border-line bg-surface px-6 py-12 text-center text-[14px] text-muted">
          لا توجد بلاغات.
        </div>
      ) : (
        <TableCard>
          <table className="w-full min-w-[680px] border-collapse">
            <thead>
              <tr className="border-b border-line bg-cream">
                <Th>الجهة المُبلَّغ عنها</Th>
                <Th>السبب</Th>
                <Th>المُبلِّغ</Th>
                <Th>التاريخ</Th>
                <Th>الحالة</Th>
                <Th>إجراءات</Th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0">
                  <Td className="font-bold text-charcoal">{r.target}</Td>
                  <Td>{r.reason}</Td>
                  <Td>{r.reporter}</Td>
                  <Td>{r.date}</Td>
                  <Td>
                    {r.status === "open" ? (
                      <Pill tone="warn">مفتوح</Pill>
                    ) : (
                      <Pill tone="success">تمت المعالجة</Pill>
                    )}
                  </Td>
                  <Td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setOpenReportId(r.id)}
                        className="cursor-pointer rounded-lg bg-jazan px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-jazan-dark"
                      >
                        {r.status === "open" ? "معالجة" : "التفاصيل"}
                      </button>
                      <button
                        onClick={() => removeReport(r.id)}
                        className="cursor-pointer rounded-lg border border-danger-line bg-surface px-3 py-1.5 text-[12px] font-semibold text-danger transition-colors hover:bg-danger-soft"
                      >
                        حذف
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      )}

      {selected ? (
        <ReportModal
          report={selected}
          onClose={() => setOpenReportId(null)}
          onResolve={resolveReport}
          onRemove={removeReport}
        />
      ) : null}
    </div>
  );
}
