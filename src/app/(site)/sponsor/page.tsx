import type { Metadata } from "next";
import { SponsorView } from "./SponsorView";

export const metadata: Metadata = {
  title: "كن راعياً",
  description: "ادعم مواهب جازان وكن راعياً لمنصة أبطال جازان.",
};

export default function SponsorPage() {
  return <SponsorView />;
}
