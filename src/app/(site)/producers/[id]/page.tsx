import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { BackLink } from "@/components/BackLink";
import { producers, getProducer } from "@/lib/data";
import { getDbProducer } from "@/lib/members-server";
import { ProducerView } from "./ProducerView";

export function generateStaticParams() {
  return producers.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const producer = getProducer(id) ?? (await getDbProducer(id));
  if (!producer) return { title: "غير موجود — فرصة" };
  return {
    title: `${producer.name} — فرصة`,
    description: producer.bio ?? `${producer.category} · ${producer.city}`,
  };
}

export default async function ProducerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const producer = getProducer(id) ?? (await getDbProducer(id));
  if (!producer) notFound();

  return (
    <Container className="py-8 sm:py-10">
      <BackLink to="producers" />
      <ProducerView producer={producer} />
    </Container>
  );
}
