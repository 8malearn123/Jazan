"use client";

import { useState } from "react";
import { reports as initialReports } from "@/lib/data";
import { AdminPageHead, TableCard, Th, Td, Pill } from "../_components/AdminTable";

export default function AdminReportsPage() {
  const [reports, setReports] = useState(initialReports);
  const [toast, setToast] = useState("");

  const open = reports.filter((r) => r.status === "open").length;

  function resolveReport(id: string) {
    setReports((list) =>
      list.map((r) => (r.id === id ? { ...r, status: "resolved" as const } : r))
    );
    setToast("تمت معالجة البلاغ");
    setTimeout(() => setToast(""), 2500);
  }
  function removeReport(id: string) {
    setReports((list) => list.filter((r) => r.id !== id));
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
        <div className="rounded-[16px] border border-line bg-white px-6 py-12 text-center text-[14px] text-muted">
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
                      {r.status === "open" ? (
                        <button
                          onClick={() => resolveReport(r.id)}
                          className="cursor-pointer rounded-lg bg-jazan px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-jazan-dark"
                        >
                          معالجة
                        </button>
                      ) : null}
                      <button
                        onClick={() => removeReport(r.id)}
                        className="cursor-pointer rounded-lg border border-[#e8c9c9] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#b3261e] transition-colors hover:bg-[#fdf3f3]"
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
    </div>
  );
}
