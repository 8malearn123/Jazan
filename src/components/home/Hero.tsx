"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SearchIcon, CheckIcon, MapIcon } from "@/components/icons";
import { JazanMap } from "@/components/home/JazanMap";
import { useLiveCounts } from "@/lib/registry";
import { useLocale } from "@/lib/i18n";
import { useLanding } from "@/lib/landing";
import { currentMonthLabel, useHeroOfMonth } from "@/lib/heroMonth";

export function Hero() {
  const { d, isAr } = useLocale();
  const [mapOpen, setMapOpen] = useState(false);
  const live = useLiveCounts();
  const landing = useLanding();
  const heroMonth = useHeroOfMonth();
  const [autoMonth, setAutoMonth] = useState("");
  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setAutoMonth(currentMonthLabel());
  }, []);
  const monthLabel = heroMonth.month.trim() || autoMonth;

  const copy = isAr
    ? landing
    : { tagline: d.hero.tagline, title1: d.hero.title1, title2: d.hero.title2, desc: d.hero.desc };

  const stats = [
    { value: String(live.heroes), label: d.stats.heroes },
    { value: String(live.producers), label: d.stats.producers },
    { value: String(live.companies), label: d.stats.companies },
  ];

  return (
    <section className="py-10 sm:py-14 lg:py-16">
      <Container className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-12">
        {/* Text side */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-semibold text-jazan sm:text-[13px]">
            <span className="h-[7px] w-[7px] rounded-full bg-success" />
            {copy.tagline}
          </div>

          <h1 className="mt-5 text-[30px] font-extrabold leading-[1.4] tracking-[-.6px] text-charcoal text-balance sm:mt-6 sm:text-[40px] sm:leading-[1.35] lg:text-[46px] lg:tracking-[-1px] xl:text-[54px]">
            {copy.title1}
            <br />
            {copy.title2}
          </h1>

          <p className="mt-4 max-w-[480px] text-base leading-7 text-muted sm:mt-5 sm:text-[17px] sm:leading-8 lg:text-[18px]">
            {copy.desc}
          </p>

          {/* Search */}
          <form
            action="/browse"
            className="mt-6 flex max-w-[520px] items-center gap-2 rounded-2xl border-[1.5px] border-line bg-surface p-[6px] ps-3.5 shadow-[0_6px_22px_rgba(28,42,38,.06)] sm:mt-7 sm:gap-3 sm:p-[7px] sm:ps-4"
          >
            <SearchIcon width={20} height={20} className="shrink-0 text-muted" />
            <input
              name="q"
              placeholder={d.hero.searchPh}
              className="min-w-0 flex-1 bg-transparent text-sm text-charcoal outline-none placeholder:text-[#9aa29d] sm:text-base"
            />
            <Button type="submit" size="sm">
              {d.hero.search}
            </Button>
            <button
              type="button"
              onClick={() => setMapOpen(true)}
              aria-label={d.map.open}
              title={d.map.open}
              className="flex h-[38px] w-[38px] flex-none cursor-pointer items-center justify-center rounded-xl border-[1.5px] border-line bg-surface text-jazan transition-colors hover:border-jazan hover:bg-jazan hover:text-white"
            >
              <MapIcon width={19} height={19} />
            </button>
          </form>

          <JazanMap open={mapOpen} onClose={() => setMapOpen(false)} />

          {/* Stats */}
          <div className="mt-6 flex items-center gap-4 sm:mt-7 sm:gap-6">
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-4 sm:gap-6">
                {i > 0 ? <span className="h-[30px] w-px bg-line sm:h-[34px]" /> : null}
                <div>
                  <div className="mono text-xl font-semibold text-jazan sm:text-2xl">
                    {s.value}
                  </div>
                  <div className="text-xs text-muted sm:text-[13px]">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual side */}
        <div className="relative">
          <div className="relative h-[230px] w-full overflow-hidden rounded-[24px] border border-line bg-[#0f5c4a] sm:h-[340px] lg:h-[420px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroMonth.image || "/hero-of-month.svg"}
              alt={`${d.hero.monthBadge} — ${heroMonth.name}`}
              className="h-full w-full object-cover"
            />

            <div className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-amber px-3 py-1.5 text-[12px] font-extrabold text-white shadow-[0_6px_16px_rgba(0,0,0,.22)] sm:start-4 sm:top-4 sm:text-[13px]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21 1.18.54 2.03 2.03 2.03 3.79" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
              {d.hero.monthBadge}
              {monthLabel ? <span className="font-semibold opacity-90">· {monthLabel}</span> : null}
            </div>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent px-4 pb-4 pt-10 sm:px-5 sm:pb-5">
              <div className="text-[16px] font-extrabold text-white sm:text-[19px]">
                {heroMonth.name}
              </div>
              <div className="mt-0.5 text-[12px] font-medium text-white/80 sm:text-[13px]">
                {heroMonth.title}
              </div>
            </div>
          </div>

          <div className="jh-float absolute -bottom-4 -start-2 flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 px-4 shadow-[0_12px_30px_rgba(28,42,38,.12)] sm:-start-3 sm:p-3.5 sm:px-[18px]">
            <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-success/15 sm:h-10 sm:w-10">
              <CheckIcon width={20} height={20} className="text-success" strokeWidth={2.2} />
            </span>
            <div>
              <div className="text-[13px] font-bold text-charcoal sm:text-sm">
                {d.hero.contacted}
              </div>
              <div className="text-[11px] text-muted sm:text-xs">{d.hero.viaWa}</div>
            </div>
          </div>

          <div className="jh-float-slow absolute -top-4 -end-2 rounded-2xl border border-line bg-surface px-3.5 py-2.5 shadow-[0_10px_26px_rgba(28,42,38,.10)] sm:-end-3 sm:px-4 sm:py-3">
            <div className="text-[11px] text-muted sm:text-xs">{d.hero.specsAvail}</div>
            <div className="text-sm font-bold text-jazan sm:text-[15px]">
              {d.hero.specs}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
