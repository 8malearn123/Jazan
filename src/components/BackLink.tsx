"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";
import { useLocale } from "@/lib/i18n";

export function BackLink({ to }: { to: "heroes" | "producers" | "companies" }) {
  const { d } = useLocale();
  const map = {
    heroes: { href: "/browse", label: d.heroPage.back },
    producers: { href: "/producers", label: d.producerDetail.back },
    companies: { href: "/companies", label: d.companyDetail.back },
  } as const;
  const { href, label } = map[to];

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-medium text-muted no-underline transition-colors hover:text-jazan"
    >
      <ArrowLeftIcon className="h-[18px] w-[18px] ltr:-scale-x-100" />
      {label}
    </Link>
  );
}
