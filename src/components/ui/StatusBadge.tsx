"use client";

import { cn } from "@/lib/cn";
import { useLocale } from "@/lib/i18n";
import type { AvailabilityStatus } from "@/lib/types";

const styles: Record<AvailabilityStatus, { dot: string; bg: string; text: string }> = {
  freelance: { dot: "bg-success", bg: "bg-success/12", text: "text-success-ink" },
  job: { dot: "bg-info", bg: "bg-info/12", text: "text-info-ink" },
  both: { dot: "bg-warn", bg: "bg-warn/16", text: "text-warn-ink" },
  producer: { dot: "bg-amber", bg: "bg-amber/16", text: "text-warn-ink" },
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
  const { d } = useLocale();
  const labels: Record<AvailabilityStatus, string> = {
    freelance: d.browse.chips.freelance,
    job: d.browse.chips.job,
    both: d.browse.chips.both,
    producer: d.status.producer,
  };
  const c = styles[status];
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
      {labels[status]}
    </span>
  );
}
