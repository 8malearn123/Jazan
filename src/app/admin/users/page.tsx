"use client";

import { useState } from "react";
import Link from "next/link";
import { sampleHeroes, producers, companies } from "@/lib/data";
import { CheckIcon } from "@/components/icons";
import { AdminPageHead, TableCard, Th, Td, Pill } from "../_components/AdminTable";

type Row = {
  id: string;
  name: string;
  role: "بطل" | "أسرة منتجة" | "شركة";
  tone: "info" | "amber";
  city: string;
  href: string;
  verified: boolean;
};

const rows: Row[] = [
  ...sampleHeroes.map((h) => ({
    id: `h-${h.id}`,
    name: h.name,
    role: "بطل" as const,
    tone: "info" as const,
    city: h.city,
    href: `/heroes/${h.id}`,
    verified: !!h.verified,
  })),
  ...producers.map((p) => ({
    id: `p-${p.id}`,
    name: p.name,
    role: "أسرة منتجة" as const,
    tone: "amber" as const,
    city: p.city,
    href: `/producers/${p.id}`,
    verified: !!p.verified,
  })),
  ...companies.map((c) => ({
    id: `c-${c.id}`,
    name: c.name,
    role: "شركة" as const,
    tone: "info" as const,
    city: c.city ?? "—",
    href: `/companies/${c.id}`,
    verified: c.verified,
  })),
];

export default function AdminUsersPage() {
  const [suspended, setSuspended] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setSuspended((s) => ({ ...s, [id]: !s[id] }));
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-5">
      <AdminPageHead
        title="المستخدمون"
        subtitle={`${rows.length} مستخدم مسجّل في المنصة`}
      />
      <TableCard>
        <table className="w-full min-w-[680px] border-collapse">
          <thead>
            <tr className="border-b border-line bg-cream">
              <Th>الاسم</Th>
              <Th>النوع</Th>
              <Th>المدينة</Th>
              <Th>الحالة</Th>
              <Th>إجراءات</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const isSuspended = suspended[r.id];
              return (
                <tr key={r.id} className="border-b border-line last:border-0">
                  <Td className="font-bold text-charcoal">
                    <span className="inline-flex items-center gap-1.5">
                      {r.name}
                      {r.verified ? (
                        <span
                          className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-jazan text-white"
                          title="موثّق"
                          aria-label="موثّق"
                        >
                          <CheckIcon width={11} height={11} strokeWidth={3} />
                        </span>
                      ) : null}
                    </span>
                  </Td>
                  <Td>
                    <Pill tone={r.tone}>{r.role}</Pill>
                  </Td>
                  <Td>{r.city}</Td>
                  <Td>
                    {isSuspended ? (
                      <Pill tone="muted">موقوف</Pill>
                    ) : (
                      <Pill tone="success">نشط</Pill>
                    )}
                  </Td>
                  <Td>
                    <div className="flex gap-2">
                      <Link
                        href={r.href}
                        className="cursor-pointer rounded-lg border border-line bg-white px-3 py-1.5 text-[12px] font-semibold text-charcoal no-underline transition-colors hover:bg-cream"
                      >
                        عرض
                      </Link>
                      <button
                        onClick={() => toggle(r.id)}
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
