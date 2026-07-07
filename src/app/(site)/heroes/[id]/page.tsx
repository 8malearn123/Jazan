import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ArrowLeftIcon } from "@/components/icons";
import { HeroProfileView } from "@/components/hero/HeroProfileView";
import { sampleHeroes, getHero } from "@/lib/data";

export function generateStaticParams() {
  return sampleHeroes.map((h) => ({ id: h.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const hero = getHero(id);
  if (!hero) return { title: "البطل غير موجود · أبطال جازان" };
  return {
    title: `${hero.name} · ${hero.title} · أبطال جازان`,
    description: hero.bio ?? `${hero.title} من ${hero.city}، جازان.`,
  };
}

export default async function HeroProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const hero = getHero(id);
  if (!hero) notFound();

  const bio =
    hero.bio ??
    `${hero.title} من ${hero.city} بخبرة ${hero.years ?? "عدة"} سنوات، يقدّم خدماته لأهالي ومشاريع منطقة جازان.`;

  return (
    <Container className="py-6 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted no-underline transition-colors hover:text-jazan"
        >
          <ArrowLeftIcon className="h-[18px] w-[18px]" />
          رجوع لتصفّح الأبطال
        </Link>

        <div className="mt-4">
          <HeroProfileView hero={hero} bio={bio} />
        </div>
      </div>
    </Container>
  );
}
