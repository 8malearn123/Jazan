"use client";

import Link from "next/link";
import { roleLabels } from "@/components/auth/AuthProvider";
import { useVerifications } from "../_components/useVerifications";
import { AdminPageHead, TableCard, Th, Td, Pill } from "../_components/AdminTable";

const roleTone: Record<"hero" | "producer" | "company", "info" | "amber"> = {
  hero: "info",
  producer: "amber",
  company: "info",
};
export default function VerificationsPage() {
  const { pending: rows, resolve, toast } = useVerifications();

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-5">
      <AdminPageHead
        title="التوثيق والطلبات"
        subtitle={`${rows.length} طلب توثيق بانتظار المراجعة`}
      />

      {toast ? (
        <div className="rounded-xl bg-success/12 px-4 py-2.5 text-[13px] font-semibold text-success-ink">
          ✓ {toast}
        </div>
      ) : null}

      {rows.length === 0 ? (
        <div className="rounded-[16px] border border-line bg-white px-6 py-12 text-center text-[14px] text-muted">
          ✓ لا توجد طلبات معلّقة — تمت مراجعة الكل.
        </div>
      ) : (
        <TableCard>
          <table className="w-full min-w-[680px] border-collapse">
            <thead>
              <tr className="border-b border-line bg-cream">
                <Th>الاسم</Th>
                <Th>الدور</Th>
                <Th>المدينة</Th>
                <Th>التاريخ</Th>
                <Th>إجراءات</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0">
                  <Td className="font-bold text-charcoal">{r.name}</Td>
                  <Td>
                    <Pill tone={roleTone[r.role]}>{roleLabels[r.role]}</Pill>
                  </Td>
                  <Td>{r.city}</Td>
                  <Td>{r.date}</Td>
                  <Td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => resolve(r.id, true)}
                        className="cursor-pointer rounded-lg bg-jazan px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-jazan-dark"
                      >
                        قبول
                      </button>
                      <button
                        onClick={() => resolve(r.id, false)}
                        className="cursor-pointer rounded-lg border border-[#e8c9c9] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#b3261e] transition-colors hover:bg-[#fdf3f3]"
                      >
                        رفض
                      </button>
                      <Link
                        href={`/admin/verifications/${r.id}`}
                        className="cursor-pointer rounded-lg border border-line bg-white px-3 py-1.5 text-[12px] font-semibold text-charcoal no-underline transition-colors hover:bg-cream"
                      >
                        معاينة
                      </Link>
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
