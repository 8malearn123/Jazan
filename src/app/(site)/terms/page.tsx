import type { Metadata } from "next";
import { TermsView } from "./TermsView";

export const metadata: Metadata = {
  title: "شروط الاستخدام",
  description: "شروط استخدام منصة فرصة.",
};

export default function TermsPage() {
  return <TermsView />;
}
