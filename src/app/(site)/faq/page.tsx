import type { Metadata } from "next";
import { FaqView } from "./FaqView";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة",
  description: "إجابات لأكثر الأسئلة شيوعاً حول منصة أبطال جازان.",
};

export default function FaqPage() {
  return <FaqView />;
}
