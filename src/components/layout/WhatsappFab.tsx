"use client";

import { WhatsappIcon } from "@/components/icons";
import { site, whatsappLink } from "@/lib/site";
import { useLocale } from "@/lib/i18n";

/** زر واتساب ثابت أسفل الشاشة (للجوال) */
export function WhatsappFab() {
  const { d } = useLocale();

  return (
    <div className="sticky bottom-0 z-40 bg-gradient-to-t from-cream from-70% to-transparent p-4 lg:hidden">
      <a
        href={whatsappLink(site.whatsapp, "السلام عليكم، تواصلت معكم عبر منصة أبطال جازان")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2.5 rounded-[13px] bg-whatsapp px-5 py-3.5 text-base font-bold text-white shadow-[0_8px_20px_rgba(37,211,102,.32)] transition hover:brightness-95"
      >
        <WhatsappIcon width={20} height={20} />
        {d.fab}
      </a>
    </div>
  );
}
