"use client";

import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CheckIcon, WhatsappIcon, MapPinIcon, StarFilledIcon } from "@/components/icons";
import { SocialLinksRow } from "@/components/SocialLinksRow";
import { CvButton } from "@/components/hero/CvButton";
import { usePublicPhotos } from "@/lib/photos";
import { whatsappLink, site } from "@/lib/site";
import { useLocale } from "@/lib/i18n";
import type { Hero } from "@/lib/types";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center px-4 py-1 text-center">
      <span className="mono text-[19px] font-bold text-charcoal">{value}</span>
      <span className="mt-0.5 text-[12px] text-muted">{label}</span>
    </div>
  );
}

export function ProfileHeader({ hero }: { hero: Hero }) {
  const { d } = useLocale();
  const photos = usePublicPhotos(hero.id);
  const wa = whatsappLink(
    hero.whatsapp ?? site.whatsapp,
    `مرحباً ${hero.name}، شفت ملفك في أبطال جازان`
  );

  return (
    <div className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_1px_3px_rgba(28,42,38,.06)]">
      <div className="relative">
        {photos.cover ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={photos.cover} alt="صورة غلاف" className="h-[140px] w-full object-cover sm:h-[190px]" />
        ) : (
          <ImagePlaceholder shape="rect" label="صورة غلاف" className="h-[140px] w-full sm:h-[190px]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-jazan/60 via-jazan/10 to-transparent" />
      </div>

      <div className="flex flex-col items-center px-5 pb-6 text-center sm:px-8">
        {photos.avatar ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={photos.avatar}
            alt={hero.name}
            className="-mt-14 h-[112px] w-[112px] rounded-full border-[5px] border-surface object-cover shadow-[0_8px_22px_rgba(28,42,38,.16)] sm:-mt-16 sm:h-[128px] sm:w-[128px]"
          />
        ) : (
          <ImagePlaceholder
            shape="circle"
            label="صورة"
            className="-mt-14 h-[112px] w-[112px] border-[5px] border-surface shadow-[0_8px_22px_rgba(28,42,38,.16)] sm:-mt-16 sm:h-[128px] sm:w-[128px]"
          />
        )}

        <div className="mt-3 flex items-center gap-2.5">
          <h1 className="text-2xl font-extrabold tracking-[-.4px] text-charcoal sm:text-[28px]">
            {hero.name}
          </h1>
          {hero.verified && (
            <span
              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-jazan text-white"
              aria-label={d.heroPage.verifiedBadge}
              title={d.heroPage.verifiedBadge}
            >
              <CheckIcon className="h-3.5 w-3.5" />
            </span>
          )}
        </div>

        <div className="mt-1.5 text-[16px] text-ink sm:text-[17px]">{hero.title}</div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          <StatusBadge status={hero.status} />
          <span className="inline-flex items-center gap-1.5 text-sm text-muted">
            <MapPinIcon className="h-4 w-4" />
            {hero.city}
            {d.heroPage.region}
          </span>
          {hero.rating ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-charcoal">
              <StarFilledIcon className="h-4 w-4 text-amber" />
              <span className="mono">{hero.rating.toFixed(1)}</span>
              {hero.reviewsCount ? (
                <span className="font-normal text-muted">({hero.reviewsCount} {d.cards.review})</span>
              ) : null}
            </span>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center divide-x divide-x-reverse divide-line rounded-2xl border border-line bg-cream/60 py-2">
          {hero.years != null && <Stat value={`+${hero.years}`} label={d.heroPage.yearsExp} />}
          <Stat value={`${hero.skills.length}`} label={d.heroPage.skillsStat} />
          {hero.rating != null && <Stat value={hero.rating.toFixed(1)} label={d.heroPage.ratingStat} />}
          <Stat value={hero.city} label={d.heroPage.cityStat} />
        </div>

        <div className="mt-5 flex w-full max-w-2xl flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <SocialLinksRow profileId={hero.id} seed={hero.socials} className="flex-none sm:order-first" />
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full flex-1 items-center justify-center gap-2.5 rounded-xl bg-whatsapp px-6 py-3 text-[15px] font-bold text-white shadow-[0_6px_16px_rgba(37,211,102,.28)] transition-[transform,filter] hover:-translate-y-px hover:brightness-95 sm:w-auto sm:min-w-[220px]"
          >
            <WhatsappIcon className="h-[19px] w-[19px]" />
            {d.heroPage.contactWa}
          </a>
          <CvButton hero={hero} />
        </div>
      </div>
    </div>
  );
}
