import { cn } from "@/lib/cn";

type Shape = "rect" | "rounded" | "circle";

/**
 * عنصر نائب للصور (مكان الصورة في التصميم).
 * يُستبدل بصورة حقيقية في مرحلة لاحقة.
 */
export function ImagePlaceholder({
  label,
  shape = "rounded",
  radius = 16,
  className,
}: {
  label?: string;
  shape?: Shape;
  radius?: number;
  className?: string;
}) {
  const shapeStyle =
    shape === "circle"
      ? { borderRadius: "50%" }
      : shape === "rounded"
        ? { borderRadius: radius }
        : undefined;

  return (
    <div
      style={shapeStyle}
      className={cn(
        "flex items-center justify-center overflow-hidden bg-gradient-to-br from-slot to-slot-deep text-center",
        className
      )}
    >
      {label ? (
        <span className="px-3 text-[13px] font-medium text-muted/80">
          {label}
        </span>
      ) : null}
    </div>
  );
}
