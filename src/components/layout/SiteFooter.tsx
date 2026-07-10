"use client";

import Link from "next/link";
import { StarIcon, WhatsappIcon, InstagramIcon, YoutubeIcon } from "@/components/icons";
import { site } from "@/lib/site";
import { useLocale } from "@/lib/i18n";

const socials = [
  { label: "واتساب", Icon: WhatsappIcon, href: "#" },
  { label: "انستقرام", Icon: InstagramIcon, href: "#" },
  { label: "يوتيوب", Icon: YoutubeIcon, href: "#" },
];

export function SiteFooter() {
  const { d, isAr } = useLocale();

  const columns = [
    {
      title: d.footer.platform,
      links: [
        { label: d.header.browse, href: "/browse" },
        { label: d.header.companies, href: "/companies" },
        { label: d.header.how, href: "/#how-it-works" },
      ],
    },
    {
      title: d.footer.support,
      links: [
        { label: d.footer.faq, href: "/faq" },
        { label: d.footer.contact, href: "/contact" },
        { label: d.footer.privacy, href: "/privacy" },
        { label: d.footer.terms, href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="bg-[#1c2a26] px-5 pb-8 pt-12 sm:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <span className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-jazan">
                <StarIcon width={22} height={22} className="text-amber" strokeWidth={2.1} />
              </span>
              <span className="text-[19px] font-extrabold text-white">{isAr ? site.name : "Jazan Heroes"}</span>
            </div>
            <p className="mt-4 max-w-[300px] text-sm leading-8 text-white/55">
              {d.footer.about}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <div className="mb-4 text-sm font-bold text-white">{col.title}</div>
              <div className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-sm text-white/60 no-underline transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div>
            <div className="mb-4 text-sm font-bold text-white">{d.footer.follow}</div>
            <div className="flex gap-3">
              {socials.map(({ label, Icon, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-white/[.08] text-white/70 transition-colors hover:bg-white/[.16]"
                >
                  <Icon width={19} height={19} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-9 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-[13px] text-white/45 sm:flex-row">
          <span>© {site.year} {isAr ? site.name : "Jazan Heroes"} — {d.footer.rights}</span>
          <span>{d.footer.made}</span>
        </div>
      </div>
    </footer>
  );
}
