"use client";

import { useState } from "react";
import Link from "next/link";
import { producers } from "@/lib/data";
import { CheckIcon } from "@/components/icons";
import { AdminPageHead, TableCard, Th, Td, Pill } from "../_components/AdminTable";

export default function AdminProducersPage() {
  const [suspended, setSuspended] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setSuspended((s) => ({ ...s, [id]: !s[id] }));
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-5">
      <AdminPageHead title="الأسر المنتجة" subtitle={`${producers.length} أسرة منتجة وصانع`} />
      <TableCard>
        <table className="w-full min-w-[660px] border-collapse">
          <thead>
            <tr className="border-b border-line bg-cream">
              <Th>الأسرة / الصانع</Th>
              <Th>الفئة</Th>
              <Th>المدينة</Th>
              <Th>الحالة</Th>
              <Th>إجراءات</Th>
            </tr>
          </thead>
          <tbody>
            {producers.map((p) => {
              const isSuspended = suspended[p.id];
              return (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <Td className="font-bold text-charcoal">{p.name}</Td>
                  <Td>
                    <Pill tone="amber">{p.category}</Pill>
                  </Td>
                  <Td>{p.city}</Td>
                  <Td>
                    {isSuspended ? (
                      <Pill tone="muted">موقوفة</Pill>
                    ) : p.verified ? (
                      <Pill tone="success">
                        <CheckIcon width={11} height={11} strokeWidth={3} />
                        موثّقة
                      </Pill>
                    ) : (
                      <Pill tone="muted">غير موثّقة</Pill>
                    )}
                  </Td>
                  <Td>
                    <div className="flex gap-2">
                      <Link
                        href={`/producers/${p.id}`}
                        className="cursor-pointer rounded-lg border border-line bg-white px-3 py-1.5 text-[12px] font-semibold text-charcoal no-underline transition-colors hover:bg-cream"
                      >
                        عرض
                      </Link>
                      <button
                        onClick={() => toggle(p.id)}
                        className={
                          isSuspended
                            ? "cursor-pointer rounded-lg bg-jazan px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-jazan-dark"
                            : "cursor-pointer rounded-lg border border-[#e8c9c9] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#b3261e] transition-colors hover:bg-[#fdf3f3]"
                        }
                      >
                        {isSuspended ? "تفعيل" : "إيقاف"}
                      </button>
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}
