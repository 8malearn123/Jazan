"use client";

import { Container } from "@/components/ui/Container";
import { WhatsappIcon, MailIcon, MapPinIcon } from "@/components/icons";
import { site, whatsappLink } from "@/lib/site";
import { useLocale } from "@/lib/i18n";
import { ContactForm } from "./ContactForm";

export function ContactView() {
  const { d } = useLocale();
  const t = d.contactPage;

  const channels = [
    {
      Icon: MailIcon,
      label: t.email,
      value: "info@jazanheroes.sa",
      href: "mailto:info@jazanheroes.sa",
      wrap: "bg-jazan/10 text-jazan",
    },
    {
      Icon: WhatsappIcon,
      label: t.whatsapp,
      value: t.whatsappValue,
      href: whatsappLink(site.whatsapp, "السلام عليكم، لدي استفسار عن منصة أبطال جازان"),
      wrap: "bg-whatsapp/15 text-whatsapp",
    },
    {
      Icon: MapPinIcon,
      label: t.location,
      value: t.locationValue,
      href: undefined,
      wrap: "bg-amber/15 text-amber-dark",
    },
  ];

  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-[13px] font-bold tracking-wide text-amber">{t.kicker}</div>
        <h1 className="mt-2.5 text-[28px] font-extrabold tracking-[-.5px] text-charcoal sm:text-[36px]">
          {t.title}
        </h1>
        <p className="mt-3 text-[16px] leading-8 text-muted">{t.desc}</p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        {/* Channels */}
        <div className="flex flex-col gap-4">
          {channels.map((c) => {
            const inner = (
              <div className="flex items-center gap-4 rounded-[16px] border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(28,42,38,.04)] transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(28,42,38,.08)]">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] ${c.wrap}`}>
                  <c.Icon width={22} height={22} />
                </span>
                <div>
                  <div className="text-[13px] text-muted">{c.label}</div>
                  <div className="text-[15px] font-bold text-charcoal">{c.value}</div>
                </div>
              </div>
            );
            return c.href ? (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="no-underline"
              >
                {inner}
              </a>
            ) : (
              <div key={c.label}>{inner}</div>
            );
          })}
        </div>

        {/* Form */}
        <ContactForm />
      </div>
    </Container>
  );
}
