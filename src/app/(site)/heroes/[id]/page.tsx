import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { BackLink } from "@/components/BackLink";
import { HeroPortfolioView } from "@/components/hero/HeroPortfolioView";
import { sampleHeroes, getHero } from "@/lib/data";
import { getDbHero } from "@/lib/members-server";

export function generateStaticParams() {
  return sampleHeroes.map((h) => ({ id: h.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const hero = getHero(id) ?? (await getDbHero(id));
  if (!hero) return { title: "البطل غير موجود · فرصة" };
  return {
    title: `${hero.name} · ${hero.title} · فرصة`,
    description: hero.bio ?? `${hero.title} من ${hero.city}، جازان.`,
  };
}

export default async function HeroProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const hero = getHero(id) ?? (await getDbHero(id));
  if (!hero) notFound();

  const bio =
    hero.bio ??
    `${hero.title} من ${hero.city} بخبرة ${hero.years ?? "عدة"} سنوات، يقدّم خدماته لأهالي ومشاريع منطقة جازان.`;

  return (
    <Container className="py-6 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-4xl">
        <BackLink to="heroes" />

        <div className="mt-4">
          <HeroPortfolioView hero={hero} bio={bio} />
        </div>
      </div>
    </Container>
  );
}
