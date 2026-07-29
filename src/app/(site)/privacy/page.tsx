import type { Metadata } from "next";
import { PrivacyView } from "./PrivacyView";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: "سياسة الخصوصية لمنصة فرصة.",
};

export default function PrivacyPage() {
  return <PrivacyView />;
}
