import type { Metadata } from "next";
import { FaqView } from "./FaqView";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة",
  description: "إجابات لأكثر الأسئلة شيوعاً حول منصة فرصة.",
};

export default function FaqPage() {
  return <FaqView />;
}
