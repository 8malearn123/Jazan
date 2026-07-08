"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { UsersIcon, StoreIcon, BuildingIcon, ArrowLeftIcon } from "@/components/icons";
import { useLocale } from "@/lib/i18n";

export function CategoryCards() {
  const { d } = useLocale();

  const cards = [
    {
      ...d.categories.hero,
      href: "/register?role=hero",
      Icon: UsersIcon,
      iconBg: "bg-jazan/10",
      iconColor: "text-jazan",
      accent: "text-jazan",
    },
    {
      ...d.categories.producer,
      href: "/register?role=producer",
      Icon: StoreIcon,
      iconBg: "bg-amber/15",
      iconColor: "text-amber-dark",
      accent: "text-amber-dark",
    },
    {
      ...d.categories.company,
      href: "/register?role=company",
      Icon: BuildingIcon,
      iconBg: "bg-info/12",
      iconColor: "text-info",
      accent: "text-info",
    },
  ];

  return (
    <section className="pb-10 sm:pb-14">
      <Container className="grid gap-4 sm:gap-5 md:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="jh-cat group rounded-[18px] border border-line bg-surface p-7 no-underline shadow-[0_1px_2px_rgba(28,42,38,.04)] transition-[transform,box-shadow,border-color] duration-[250ms] hover:-translate-y-1 hover:border-jazan hover:shadow-[0_12px_30px_rgba(28,42,38,.10)]"
          >
            <span className={`flex h-[52px] w-[52px] items-center justify-center rounded-[14px] ${c.iconBg}`}>
              <c.Icon width={26} height={26} className={c.iconColor} />
            </span>
            <h3 className="mt-[18px] text-xl font-bold text-charcoal">{c.title}</h3>
            <p className="mt-2 text-[15px] leading-7 text-muted">{c.desc}</p>
            <span className={`mt-[18px] flex items-center gap-1.5 text-sm font-semibold ${c.accent}`}>
              {d.categories.start}
              <ArrowLeftIcon width={16} height={16} strokeWidth={2.2} className="ltr:-scale-x-100" />
            </span>
          </Link>
        ))}
      </Container>
    </section>
  );
}
