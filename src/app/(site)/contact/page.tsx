import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { WhatsappIcon } from "@/components/icons";
import { site, whatsappLink } from "@/lib/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description: "تواصل مع فريق منصة أبطال جازان عبر البريد أو واتساب.",
};

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

const channels = [
  {
    Icon: MailIcon,
    label: "البريد الإلكتروني",
    value: "info@jazanheroes.sa",
    href: "mailto:info@jazanheroes.sa",
    wrap: "bg-jazan/10 text-jazan",
  },
  {
    Icon: WhatsappIcon,
    label: "واتساب",
    value: "تواصل مباشر",
    href: whatsappLink(site.whatsapp, "السلام عليكم، لدي استفسار عن منصة أبطال جازان"),
    wrap: "bg-whatsapp/15 text-whatsapp",
  },
  {
    Icon: PinIcon,
    label: "الموقع",
    value: "منطقة جازان، المملكة العربية السعودية",
    href: undefined,
    wrap: "bg-amber/15 text-amber-dark",
  },
];

export default function ContactPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-[13px] font-bold tracking-wide text-amber">نحن هنا لمساعدتك</div>
        <h1 className="mt-2.5 text-[28px] font-extrabold tracking-[-.5px] text-charcoal sm:text-[36px]">
          تواصل معنا
        </h1>
        <p className="mt-3 text-[16px] leading-8 text-muted">
          أي سؤال أو اقتراح أو شراكة؟ يسعدنا أن نسمع منك.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        {/* Channels */}
        <div className="flex flex-col gap-4">
          {channels.map((c) => {
            const inner = (
              <div className="flex items-center gap-4 rounded-[16px] border border-line bg-white p-5 shadow-[0_1px_2px_rgba(28,42,38,.04)] transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(28,42,38,.08)]">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] ${c.wrap}`}>
                  <c.Icon />
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
