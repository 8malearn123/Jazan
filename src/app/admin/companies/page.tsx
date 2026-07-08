"use client";

import { useState } from "react";
import Link from "next/link";
import { companies } from "@/lib/data";
import { CheckIcon } from "@/components/icons";
import { AdminPageHead, TableCard, Th, Td, Pill } from "../_components/AdminTable";

export default function AdminCompaniesPage() {
  const [suspended, setSuspended] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setSuspended((s) => ({ ...s, [id]: !s[id] }));
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-5">
      <AdminPageHead title="الشركات" subtitle={`${companies.length} شركة وجهة مسجّلة`} />
      <TableCard>
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="border-b border-line bg-cream">
              <Th>الشركة</Th>
              <Th>المجال</Th>
              <Th>المدينة</Th>
              <Th>الفرص</Th>
              <Th>الحالة</Th>
              <Th>إجراءات</Th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => {
              const isSuspended = suspended[c.id];
              return (
                <tr key={c.id} className="border-b border-line last:border-0">
                  <Td className="font-bold text-charcoal">{c.name}</Td>
                  <Td>{c.field}</Td>
                  <Td>{c.city ?? "—"}</Td>
                  <Td>
                    <span className="mono font-semibold text-jazan">{c.openings}</span>
                  </Td>
                  <Td>
                    {isSuspended ? (
                      <Pill tone="muted">موقوفة</Pill>
                    ) : c.verified ? (
                      <Pill tone="info">
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
                        href={`/companies/${c.id}`}
                        className="cursor-pointer rounded-lg border border-line bg-surface px-3 py-1.5 text-[12px] font-semibold text-charcoal no-underline transition-colors hover:bg-cream"
                      >
                        عرض
                      </Link>
                      <button
                        onClick={() => toggle(c.id)}
                        className={
                          isSuspended
                            ? "cursor-pointer rounded-lg bg-jazan px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-jazan-dark"
                            : "cursor-pointer rounded-lg border border-danger-line bg-surface px-3 py-1.5 text-[12px] font-semibold text-danger transition-colors hover:bg-danger-soft"
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
