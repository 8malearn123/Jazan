"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { CheckIcon } from "@/components/icons";
import { companies as partners } from "@/lib/data";
import { useLocale } from "@/lib/i18n";

export function Partners() {
  const { d } = useLocale();

  return (
    <section className="pb-12">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-[13px] font-bold tracking-wide text-amber">{d.partners.kicker}</div>
            <h2 className="mt-2.5 text-[24px] font-extrabold tracking-[-.5px] text-charcoal sm:text-[28px] lg:text-[34px]">
              {d.partners.title}
            </h2>
            <p className="mt-2 text-[15px] text-muted sm:text-base">
              {d.partners.desc}
            </p>
          </div>
          <Link
            href="/companies"
            className="jh-link shrink-0 text-sm font-semibold text-jazan no-underline sm:text-[15px]"
          >
            {d.partners.all}
          </Link>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {partners.map((p) => (
            <Link
              key={p.id}
              href={`/companies/${p.id}`}
              aria-label={p.name}
              className="jh-cat block rounded-[18px] border border-line bg-surface p-6 no-underline shadow-[0_1px_2px_rgba(28,42,38,.04)] transition-[transform,box-shadow,border-color] duration-[250ms] hover:-translate-y-1 hover:border-jazan hover:shadow-[0_12px_30px_rgba(28,42,38,.10)]"
            >
              <div className="flex items-center gap-3">
                <ImagePlaceholder
                  radius={12}
                  className="h-[52px] w-[52px] shrink-0 border border-line"
                />
                <div>
                  <div className="text-base font-bold text-charcoal">{p.name}</div>
                  <div className="text-[13px] text-muted">{p.field}</div>
                </div>
              </div>
              <div className="mt-[18px] flex items-center justify-between border-t border-line-soft pt-4">
                <span className="text-[13px] text-muted">
                  <span className="mono font-semibold text-jazan">{p.openings}</span>{" "}
                  {p.openings === 1 ? d.partners.opening : d.partners.openings}
                </span>
                {p.verified ? (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-info/12 px-2 py-1 text-[11px] font-bold text-info-ink">
                    <CheckIcon width={11} height={11} strokeWidth={3} />
                    {d.partners.verified}
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
