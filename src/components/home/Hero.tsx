"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SearchIcon, MapIcon } from "@/components/icons";
import { JazanMap } from "@/components/home/JazanMap";
import { useLiveCounts } from "@/lib/registry";
import { useLocale } from "@/lib/i18n";
import { useLanding } from "@/lib/landing";
import { useHeroArt } from "@/lib/heroArt";

export function Hero() {
  const { d, isAr } = useLocale();
  const [mapOpen, setMapOpen] = useState(false);
  const live = useLiveCounts();
  const landing = useLanding();
  const heroArt = useHeroArt();

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

        {/* Visual side — الشخصية طافية بلا خلفية مع عناصر متحركة */}
        <div className="relative flex items-center justify-center py-6 lg:py-0">
          {/* توهج ناعم خلف الشخصية */}
          <span
            aria-hidden
            className="jh-pulse-soft pointer-events-none absolute h-[280px] w-[280px] rounded-full sm:h-[380px] sm:w-[380px] lg:h-[440px] lg:w-[440px]"
            style={{
              background:
                "radial-gradient(circle, rgba(15,92,74,.16) 0%, rgba(232,147,46,.10) 45%, transparent 70%)",
            }}
          />

          {/* حلقة متقطعة تدور ببطء */}
          <span
            aria-hidden
            className="jh-spin-slow pointer-events-none absolute h-[270px] w-[270px] rounded-full border-2 border-dashed border-jazan/25 sm:h-[360px] sm:w-[360px] lg:h-[420px] lg:w-[420px]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute h-[310px] w-[310px] rounded-full border border-jazan/10 sm:h-[410px] sm:w-[410px] lg:h-[480px] lg:w-[480px]"
          />

          {/* نجوم متلألئة */}
          {[
            { pos: "start-[6%] top-[10%]", size: 22, color: "text-amber", delay: "0s" },
            { pos: "end-[8%] top-[22%]", size: 16, color: "text-jazan", delay: "0.9s" },
            { pos: "start-[12%] bottom-[14%]", size: 14, color: "text-jazan", delay: "1.6s" },
            { pos: "end-[10%] bottom-[24%]", size: 20, color: "text-amber", delay: "0.4s" },
          ].map((s) => (
            <svg
              key={s.pos}
              aria-hidden
              viewBox="0 0 24 24"
              width={s.size}
              height={s.size}
              fill="currentColor"
              className={`jh-twinkle pointer-events-none absolute ${s.pos} ${s.color}`}
              style={{ animationDelay: s.delay }}
            >
              <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
            </svg>
          ))}

          {/* نقطتان عائمتان */}
          <span aria-hidden className="jh-float pointer-events-none absolute end-[4%] top-[48%] h-3 w-3 rounded-full bg-amber/70" />
          <span aria-hidden className="jh-float-slow pointer-events-none absolute start-[3%] top-[36%] h-2.5 w-2.5 rounded-full bg-jazan/40" />

          {/* الشخصية */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroArt || "/hero-art.svg"}
            alt={isAr ? "بطل من أبطال جازان" : "A Jazan hero"}
            className="jh-float relative z-10 h-[300px] w-auto max-w-full object-contain drop-shadow-[0_24px_36px_rgba(28,42,38,.18)] sm:h-[400px] lg:h-[470px]"
          />
        </div>
      </Container>
    </section>
  );
}
