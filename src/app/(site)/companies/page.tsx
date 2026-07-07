import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { BrowseTabs } from "@/components/BrowseTabs";
import { companies, jobs } from "@/lib/data";
import { counts } from "@/lib/stats";
import { CompaniesClient } from "./CompaniesClient";

export const metadata: Metadata = {
  title: "الوظائف والشركات · أبطال جازان",
  description:
    "فرص عمل من شركات وجهات منطقة جازان — تصفّح الشركات الموثّقة وأحدث الوظائف وتقدّم مباشرة.",
};

export default function CompaniesPage() {
  return (
    <Container className="py-8 sm:py-10 lg:py-12">
      <BrowseTabs active="jobs" />

      {/* العنوان */}
      <header className="mt-6">
        <h1 className="text-[26px] font-extrabold tracking-[-.5px] text-charcoal sm:text-3xl">
          شركات وجهات تنشر فرصها معنا
        </h1>
        <p className="mt-2 text-[15px] text-muted sm:text-base">
          فرص عمل من شركات وجهات جازان —{" "}
          <span className="mono font-semibold text-charcoal">{counts.openings}</span> فرصة من{" "}
          <span className="mono font-semibold text-charcoal">{counts.companies}</span> شركة.
        </p>
      </header>

      <CompaniesClient companies={companies} jobs={jobs} />
    </Container>
  );
}
