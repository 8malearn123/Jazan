import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** وسم مهارة */
export function Tag({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-[#f3f0e9] px-3 py-1.5 text-[13px] text-ink",
        className
      )}
    >
      {children}
    </span>
  );
}
