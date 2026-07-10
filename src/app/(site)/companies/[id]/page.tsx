import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { BackLink } from "@/components/BackLink";
import { companies, getCompany } from "@/lib/data";
import type { Job } from "@/lib/types";
import { CompanyView } from "./CompanyView";

export function generateStaticParams() {
  return companies.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const company = getCompany(id);
  if (!company) return { title: "شركة غير موجودة · أبطال جازان" };
  return {
    title: `${company.name} · أبطال جازان`,
    description:
      company.about ??
      `${company.name} — ${company.field}${company.city ? ` · ${company.city}` : ""}. تصفّح الفرص المتاحة وتقدّم مباشرة.`,
  };
}

/** يبني فرصاً تجريبية لشركة معيّنة */
function sampleJobsFor(companyId: string, companyName: string): Job[] {
  return [
    {
      id: `${companyId}-job1`,
      title: "مطوّر واجهات أمامية",
      companyName,
      companyId,
      city: "جيزان",
      type: "دوام كامل",
      salary: "8,000 – 12,000 ر.س",
      tags: ["React", "TypeScript", "RTL"],
      postedAt: "منذ يومين",
    },
    {
      id: `${companyId}-job2`,
      title: "مصمّم UI/UX",
      companyName,
      companyId,
      city: "عن بُعد",
      type: "عن بُعد",
      salary: "7,000 – 10,000 ر.س",
      tags: ["Figma", "بحوث مستخدم"],
      postedAt: "منذ 4 أيام",
    },
    {
      id: `${companyId}-job3`,
      title: "كاتب محتوى تقني",
      companyName,
      companyId,
      city: "جزئي",
      type: "عقد مستقل",
      salary: "بالاتفاق",
      tags: ["كتابة", "تدقيق"],
      postedAt: "منذ أسبوع",
    },
    {
      id: `${companyId}-job4`,
      title: "مهندس بيانات",
      companyName,
      companyId,
      city: "جيزان",
      type: "دوام كامل",
      salary: "9,000 – 13,000 ر.س",
      tags: ["SQL", "Python"],
      postedAt: "منذ أسبوعين",
    },
  ];
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = getCompany(id);
  if (!company) notFound();

  const openJobs = (company.jobs ?? sampleJobsFor(company.id, company.name)).slice(
    0,
    Math.max(company.openings, 1)
  );

  return (
    <Container className="py-8 sm:py-10 lg:py-12">
      <BackLink to="companies" />
      <CompanyView company={company} openJobs={openJobs} />
    </Container>
  );
}
