"use client";

import { useEffect, useState } from "react";
import { Tag } from "@/components/ui/Tag";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { StarFilledIcon } from "@/components/icons";
import { useLocale } from "@/lib/i18n";
import { loadWorks, type Work } from "@/lib/works";
import { demoUserForPublicProfile } from "@/lib/social";
import type { Hero } from "@/lib/types";
import { ProfileHeader } from "./ProfileHeader";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[17px] font-bold text-charcoal">{children}</h2>;
}

export function HeroProfileView({
  hero,
  bio,
  worksCount = 6,
}: {
  hero: Hero;
  bio: string;
  worksCount?: number;
}) {
  const { d } = useLocale();

  const [works, setWorks] = useState<Work[] | null>(null);
  useEffect(() => {
    const demoUser = demoUserForPublicProfile(hero.id);
    if (!demoUser) return;
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setWorks(loadWorks(demoUser));
  }, [hero.id]);

  const shownWorks = works?.slice(0, 5) ?? null;

  return (
    <>
      <ProfileHeader hero={hero} />

      <div className="mt-5 flex flex-col gap-5">
        <section className="rounded-[18px] border border-line bg-surface p-6">
          <div className="flex items-center justify-between">
            <SectionTitle>{d.heroPage.portfolio}</SectionTitle>
            <span className="mono text-[13px] text-muted">
              {works ? works.length : worksCount} {d.heroPage.works}
            </span>
          </div>
          {shownWorks && shownWorks.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {shownWorks.map((w, i) => {
                const featured = i === 0;
                const cls = featured
                  ? "col-span-2 row-span-2 aspect-square w-full sm:aspect-auto"
                  : "aspect-square w-full";
                return (
                  <figure key={w.id} className={`relative m-0 overflow-hidden rounded-[16px] ${cls}`}>
                    {w.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={w.image} alt={w.title} className="h-full w-full object-cover" />
                    ) : (
                      <ImagePlaceholder shape="rounded" radius={16} label={w.title} className="h-full w-full" />
                    )}
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6 text-[12px] font-bold text-white">
                      {w.title}
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ImagePlaceholder
                shape="rounded"
                radius={16}
                label="عمل مميّز"
                className="col-span-2 row-span-2 aspect-square w-full sm:aspect-auto"
              />
              {Array.from({ length: Math.max(0, worksCount - 2) }).slice(0, 4).map((_, i) => (
                <ImagePlaceholder
                  key={i}
                  shape="rounded"
                  radius={14}
                  label={`عمل ${i + 2}`}
                  className="aspect-square w-full"
                />
              ))}
            </div>
          )}
        </section>

        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-[18px] border border-line bg-surface p-6">
            <SectionTitle>{d.heroPage.about}</SectionTitle>
            <p className="mt-3 text-[15px] leading-[1.95] text-ink">{bio}</p>
          </section>

          <section className="rounded-[18px] border border-line bg-surface p-6">
            <SectionTitle>{d.heroPage.skills}</SectionTitle>
            <div className="mt-4 flex flex-wrap gap-[9px]">
              {hero.skills.map((skill) => (
                <Tag key={skill}>{skill}</Tag>
              ))}
            </div>
          </section>
        </div>

        {hero.reviews?.length ? (
          <section className="rounded-[18px] border border-line bg-surface p-6">
            <div className="flex items-center justify-between">
              <SectionTitle>{d.heroPage.reviews}</SectionTitle>
              {hero.rating ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-charcoal">
                  <StarFilledIcon className="h-4 w-4 text-amber" />
                  <span className="mono">{hero.rating.toFixed(1)}</span>
                  <span className="font-normal text-muted">
                    {d.heroPage.of} {hero.reviewsCount ?? hero.reviews.length} {d.cards.review}
                  </span>
                </span>
              ) : null}
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {hero.reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-[14px] border border-line bg-cream/40 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[14px] font-bold text-charcoal">
                      {review.author}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="inline-flex items-center gap-0.5"
                        aria-label={`التقييم ${review.rating} من 5`}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarFilledIcon
                            key={i}
                            className={
                              i < review.rating
                                ? "h-3.5 w-3.5 text-amber"
                                : "h-3.5 w-3.5 text-line"
                            }
                          />
                        ))}
                      </span>
                      {review.date ? (
                        <span className="text-[12px] text-muted">{review.date}</span>
                      ) : null}
                    </span>
                  </div>
                  <p className="mt-2 text-[14px] leading-[1.8] text-ink">
                    {review.comment}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
