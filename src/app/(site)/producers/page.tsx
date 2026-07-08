import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { BrowseTabs } from "@/components/BrowseTabs";
import { producers } from "@/lib/data";
import { ProducersClient } from "./ProducersClient";
import { ProducersIntro } from "./ProducersIntro";

export const metadata: Metadata = {
  title: "الأسر المنتجة والصُنّاع — أبطال جازان",
  description:
    "طعام منزلي، حِرف يدوية وعطور من جازان — تصفّح الأسر المنتجة والصُنّاع وتواصل معهم مباشرة.",
};

export default function ProducersPage() {
  return (
    <Container className="py-10 sm:py-12">
      <BrowseTabs active="producers" />

      <ProducersIntro />

      <ProducersClient producers={producers} />
    </Container>
  );
}
