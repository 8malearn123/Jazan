import { cn } from "@/lib/cn";

/** بطاقة إحصائية في لوحة المشرف */
export function StatCard({
  label,
  value,
  accent,
  dot,
}: {
  label: string;
  value: string | number;
  /** لون الشريط الجانبي (border-right) */
  accent: string;
  /** لون النقطة بجانب التسمية */
  dot: string;
}) {
  return (
    <div
      className="rounded-[14px] border border-line bg-surface p-3.5"
      style={{ borderInlineEndWidth: 3, borderInlineEndColor: accent }}
    >
      <div className="flex items-center gap-2">
        <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
        <span className="text-[12px] text-muted">{label}</span>
      </div>
      <div className="mono mt-1.5 text-[22px] font-bold text-charcoal">
        {value}
      </div>
    </div>
  );
}
