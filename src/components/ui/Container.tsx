import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * حاوية بعرض أقصى وحشوة جانبية متجاوبة.
 * جوال: 20px · آيباد: 32px · لابتوب: 44px — بعرض أقصى 1280px (مطابق للتصميم).
 */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-11",
        className
      )}
    >
      {children}
    </div>
  );
}
