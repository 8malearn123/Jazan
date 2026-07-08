import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { BrowseTabs } from "@/components/BrowseTabs";
import { sampleHeroes } from "@/lib/data";
import { BrowseClient } from "./BrowseClient";
import { BrowseIntro } from "./BrowseIntro";

export const metadata: Metadata = {
  title: "تصفّح الأبطال · أبطال جازان",
  description:
    "مطوّرون، مصمّمون، كتّاب ومواهب من قلب منطقة جازان — تصفّح الأبطال وتواصل مباشرة.",
};

export default async function BrowseHeroesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return (
    <Container className="py-8 sm:py-10 lg:py-12">
      <BrowseTabs active="heroes" />

      <BrowseIntro />

      <BrowseClient heroes={sampleHeroes} initialQuery={q ?? ""} />
    </Container>
  );
}
