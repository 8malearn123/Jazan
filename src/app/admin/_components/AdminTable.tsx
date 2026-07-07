import { cn } from "@/lib/cn";

/** ترويسة صفحة في لوحة الأدمن */
export function AdminPageHead({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <h1 className="text-[18px] font-extrabold text-charcoal">{title}</h1>
      {subtitle ? <p className="mt-0.5 text-[13px] text-muted">{subtitle}</p> : null}
    </div>
  );
}

/** بطاقة تحوي جدولاً قابلاً للتمرير أفقياً */
export function TableCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-line bg-white">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-start text-[12px] font-semibold text-muted">{children}</th>;
}

export function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 text-[13px] text-ink", className)}>{children}</td>;
}

/** وسم حالة عام */
export function Pill({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "success" | "info" | "amber" | "warn" | "muted";
}) {
  const tones: Record<string, string> = {
    success: "bg-success/12 text-success-ink",
    info: "bg-info/12 text-info-ink",
    amber: "bg-amber/15 text-amber-dark",
    warn: "bg-warn/16 text-warn-ink",
    muted: "bg-muted/14 text-muted",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold", tones[tone])}>
      {children}
    </span>
  );
}
