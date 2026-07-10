import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { BackLink } from "@/components/BackLink";
import { producers, getProducer } from "@/lib/data";
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
  const producer = getProducer(id);
  if (!producer) return { title: "غير موجود — أبطال جازان" };
  return {
    title: `${producer.name} — أبطال جازان`,
    description: producer.bio ?? `${producer.category} · ${producer.city}`,
  };
}

export default async function ProducerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const producer = getProducer(id);
  if (!producer) notFound();

  return (
    <Container className="py-8 sm:py-10">
      <BackLink to="producers" />
      <ProducerView producer={producer} />
    </Container>
  );
}
