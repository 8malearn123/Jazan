"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { HeroCard } from "@/components/HeroCard";
import { sampleHeroes } from "@/lib/data";
import { useLocale } from "@/lib/i18n";

export function SampleHeroes() {
  const { d } = useLocale();

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-[13px] font-bold tracking-wide text-amber">{d.sample.kicker}</div>
            <h2 className="mt-2.5 text-[24px] font-extrabold tracking-[-.5px] text-charcoal sm:text-[28px] lg:text-[34px]">
              {d.sample.title}
            </h2>
          </div>
          <Link
            href="/browse"
            className="jh-link shrink-0 text-sm font-semibold text-jazan no-underline sm:text-[15px]"
          >
            {d.sample.browseAll}
          </Link>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-4 sm:mt-8 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {sampleHeroes.map((hero) => (
            <HeroCard key={hero.id} hero={hero} />
          ))}
        </div>
      </Container>
    </section>
  );
}
