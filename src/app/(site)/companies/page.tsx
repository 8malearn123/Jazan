import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { BrowseTabs } from "@/components/BrowseTabs";
import { companies, jobs } from "@/lib/data";
import { CompaniesClient } from "./CompaniesClient";
import { CompaniesIntro } from "./CompaniesIntro";

export const metadata: Metadata = {
  title: "الوظائف والشركات · أبطال جازان",
  description:
    "فرص عمل من شركات وجهات منطقة جازان — تصفّح الشركات الموثّقة وأحدث الوظائف وتقدّم مباشرة.",
};

export default function CompaniesPage() {
  return (
    <Container className="py-8 sm:py-10 lg:py-12">
      <BrowseTabs active="jobs" />

      <CompaniesIntro />

      <CompaniesClient companies={companies} jobs={jobs} />
    </Container>
  );
}
