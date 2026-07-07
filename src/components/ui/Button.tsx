import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "amber" | "whatsapp";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-jazan text-white shadow-[0_6px_16px_rgba(15,92,74,.22)] hover:bg-jazan-dark",
  secondary:
    "bg-white text-jazan border-[1.5px] border-jazan hover:bg-jazan/5",
  ghost:
    "bg-transparent text-charcoal border-[1.5px] border-line hover:bg-black/[.03]",
  amber:
    "bg-amber text-white shadow-[0_8px_20px_rgba(232,147,46,.28)] hover:bg-amber-dark",
  whatsapp:
    "bg-whatsapp text-white shadow-[0_6px_16px_rgba(37,211,102,.28)] hover:brightness-95",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2.5 text-sm rounded-[10px]",
  md: "px-6 py-3 text-[15px] rounded-xl",
  lg: "px-8 py-4 text-[17px] rounded-[13px]",
};

const baseClass =
  "inline-flex items-center justify-center gap-2.5 font-semibold cursor-pointer transition-[transform,background,box-shadow,filter] duration-150 hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<"button">, keyof CommonProps> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<ComponentProps<typeof Link>, keyof CommonProps | "href"> & {
    href: string;
  };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(baseClass, variants[variant], sizes[size], className);

  if ("href" in props && props.href !== undefined) {
    const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
      props;
    void _v;
    void _s;
    void _c;
    void _ch;
    return (
      <Link className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
    props as ButtonAsButton;
  void _v;
  void _s;
  void _c;
  void _ch;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
