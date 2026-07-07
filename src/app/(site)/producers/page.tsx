import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { BrowseTabs } from "@/components/BrowseTabs";
import { producers } from "@/lib/data";
import { counts } from "@/lib/stats";
import { ProducersClient } from "./ProducersClient";

export const metadata: Metadata = {
  title: "الأسر المنتجة والصُنّاع — أبطال جازان",
  description:
    "طعام منزلي، حِرف يدوية وعطور من جازان — تصفّح الأسر المنتجة والصُنّاع وتواصل معهم مباشرة.",
};

export default function ProducersPage() {
  return (
    <Container className="py-10 sm:py-12">
      <BrowseTabs active="producers" />

      {/* العنوان */}
      <div className="mt-7">
        <h1 className="text-[28px] font-extrabold tracking-[-.5px] text-charcoal sm:text-[30px]">
          الأسر المنتجة والصُنّاع
        </h1>
        <p className="mt-2 text-[15px] text-muted sm:text-base">
          طعام منزلي، حِرف يدوية وعطور من جازان —{" "}
          <span className="mono font-semibold text-charcoal">{counts.producers}</span> أسرة.
        </p>
      </div>

      <ProducersClient producers={producers} />
    </Container>
  );
}
