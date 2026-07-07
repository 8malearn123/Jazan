import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { BrowseTabs } from "@/components/BrowseTabs";
import { sampleHeroes } from "@/lib/data";
import { counts } from "@/lib/stats";
import { BrowseClient } from "./BrowseClient";

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

      {/* العنوان */}
      <header className="mt-6">
        <h1 className="text-[26px] font-extrabold tracking-[-.5px] text-charcoal sm:text-3xl">
          تصفّح أبطال جازان
        </h1>
        <p className="mt-2 text-[15px] text-muted sm:text-base">
          مطوّرون، مصمّمون، كتّاب ومواهب من قلب المنطقة —{" "}
          <span className="mono font-semibold text-charcoal">{counts.heroes}</span> بطل.
        </p>
      </header>

      <BrowseClient heroes={sampleHeroes} initialQuery={q ?? ""} />
    </Container>
  );
}
