import { cn } from "@/lib/cn";
import type { AvailabilityStatus } from "@/lib/types";

const config: Record<
  AvailabilityStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  freelance: {
    label: "متاح للعمل الحر",
    dot: "bg-success",
    bg: "bg-success/12",
    text: "text-success-ink",
  },
  job: {
    label: "يبحث عن وظيفة",
    dot: "bg-info",
    bg: "bg-info/12",
    text: "text-info-ink",
  },
  both: {
    label: "متاح للاثنين",
    dot: "bg-warn",
    bg: "bg-warn/16",
    text: "text-warn-ink",
  },
  producer: {
    label: "أسرة منتجة",
    dot: "bg-amber",
    bg: "bg-amber/16",
    text: "text-warn-ink",
  },
};

export function StatusBadge({
  status,
  className,
  size = "md",
}: {
  status: AvailabilityStatus;
  className?: string;
  size?: "sm" | "md";
}) {
  const c = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-semibold",
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-[13px]",
        c.bg,
        c.text,
        className
      )}
    >
      <span
        className={cn(
          "rounded-full",
          size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2",
          c.dot
        )}
      />
      {c.label}
    </span>
  );
}
