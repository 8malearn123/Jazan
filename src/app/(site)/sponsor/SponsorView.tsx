"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WhatsappIcon, UsersIcon, StarIcon, CheckIcon } from "@/components/icons";
import { site, whatsappLink } from "@/lib/site";
import { useLocale } from "@/lib/i18n";

const benefitIcons = [UsersIcon, StarIcon, CheckIcon];

export function SponsorView() {
  const { d } = useLocale();
  const t = d.sponsorPage;
  const wa = whatsappLink(site.whatsapp, "السلام عليكم، أرغب في رعاية منصة أبطال جازان");

  return (
    <>
      {/* Hero */}
      <section className="bg-jazan py-16">
        <Container className="text-center">
          <div className="text-[13px] font-bold tracking-wide text-amber">{t.kicker}</div>
          <h1 className="mx-auto mt-3 max-w-2xl text-[30px] font-extrabold leading-[1.35] tracking-[-.6px] text-white sm:text-[42px]">
            {t.title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-8 text-white/75 sm:text-[18px]">
            {t.desc}
          </p>
          <div className="mt-7 flex justify-center">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-[13px] bg-whatsapp px-7 py-3.5 text-[16px] font-bold text-white shadow-[0_8px_20px_rgba(37,211,102,.32)] transition hover:brightness-95"
            >
              <WhatsappIcon width={20} height={20} />
              {t.cta}
            </a>
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="py-14 sm:py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[24px] font-extrabold tracking-[-.5px] text-charcoal sm:text-[30px]">
              {t.whyTitle}
            </h2>
          </div>
          <div className="mt-9 grid gap-4 sm:gap-5 md:grid-cols-3">
            {t.benefits.map((b, i) => {
              const Icon = benefitIcons[i];
              return (
                <div
                  key={b.title}
                  className="rounded-[18px] border border-line bg-surface p-7 shadow-[0_1px_2px_rgba(28,42,38,.04)]"
                >
                  <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-jazan/10 text-jazan">
                    <Icon width={26} height={26} />
                  </span>
                  <h3 className="mt-[18px] text-xl font-bold text-charcoal">{b.title}</h3>
                  <p className="mt-2 text-[15px] leading-7 text-muted">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Tiers */}
      <section className="pb-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[24px] font-extrabold tracking-[-.5px] text-charcoal sm:text-[30px]">
              {t.tiersTitle}
            </h2>
            <p className="mt-2 text-[15px] text-muted">{t.tiersDesc}</p>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {t.tiers.map((tier) => (
              <div
                key={tier.name}
                className={`flex flex-col rounded-[20px] border bg-surface p-7 ${
                  tier.highlight
                    ? "border-jazan shadow-[0_14px_34px_rgba(15,92,74,.14)]"
                    : "border-line shadow-[0_1px_2px_rgba(28,42,38,.04)]"
                }`}
              >
                {tier.highlight ? (
                  <span className="mb-3 inline-flex w-fit rounded-full bg-amber/15 px-3 py-1 text-xs font-bold text-amber-dark">
                    {t.popular}
                  </span>
                ) : null}
                <h3 className="text-[22px] font-extrabold text-charcoal">{tier.name}</h3>
                <ul className="mt-5 flex flex-1 flex-col gap-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[15px] text-ink">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                        <CheckIcon width={13} height={13} strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <Button
                    href={wa}
                    variant={tier.highlight ? "primary" : "ghost"}
                    className="w-full"
                  >
                    {t.choose} {tier.name}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
