import { Tag } from "@/components/ui/Tag";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
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
        <section className="rounded-[18px] border border-line bg-white p-6">
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
          <section className="rounded-[18px] border border-line bg-white p-6">
            <SectionTitle>نبذة</SectionTitle>
            <p className="mt-3 text-[15px] leading-[1.95] text-ink">{bio}</p>
          </section>

          <section className="rounded-[18px] border border-line bg-white p-6">
            <SectionTitle>المهارات</SectionTitle>
            <div className="mt-4 flex flex-wrap gap-[9px]">
              {hero.skills.map((skill) => (
                <Tag key={skill}>{skill}</Tag>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
