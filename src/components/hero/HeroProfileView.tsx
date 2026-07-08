import { Tag } from "@/components/ui/Tag";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { StarFilledIcon } from "@/components/icons";
import type { Hero } from "@/lib/types";
import { ProfileHeader } from "./ProfileHeader";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[17px] font-bold text-charcoal">{children}</h2>;
}

/**
 * عرض ملف البطل الكامل — يُستخدم في الصفحة العامة وفي معاينة المشرف
 * ليكونا متطابقين تماماً.
 */
export function HeroProfileView({
  hero,
  bio,
  worksCount = 6,
}: {
  hero: Hero;
  bio: string;
  worksCount?: number;
}) {
  return (
    <>
      {/* الترويسة */}
      <ProfileHeader hero={hero} />

      {/* المحتوى */}
      <div className="mt-5 flex flex-col gap-5">
        {/* معرض الأعمال — الأبرز */}
        <section className="rounded-[18px] border border-line bg-surface p-6">
          <div className="flex items-center justify-between">
            <SectionTitle>معرض الأعمال</SectionTitle>
            <span className="mono text-[13px] text-muted">{worksCount} أعمال</span>
          </div>
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
        </section>

        {/* نبذة + المهارات */}
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-[18px] border border-line bg-surface p-6">
            <SectionTitle>نبذة</SectionTitle>
            <p className="mt-3 text-[15px] leading-[1.95] text-ink">{bio}</p>
          </section>

          <section className="rounded-[18px] border border-line bg-surface p-6">
            <SectionTitle>المهارات</SectionTitle>
            <div className="mt-4 flex flex-wrap gap-[9px]">
              {hero.skills.map((skill) => (
                <Tag key={skill}>{skill}</Tag>
              ))}
            </div>
          </section>
        </div>

        {/* التقييمات */}
        {hero.reviews?.length ? (
          <section className="rounded-[18px] border border-line bg-surface p-6">
            <div className="flex items-center justify-between">
              <SectionTitle>التقييمات</SectionTitle>
              {hero.rating ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-charcoal">
                  <StarFilledIcon className="h-4 w-4 text-amber" />
                  <span className="mono">{hero.rating.toFixed(1)}</span>
                  <span className="font-normal text-muted">
                    من {hero.reviewsCount ?? hero.reviews.length} تقييم
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
