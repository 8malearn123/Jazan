import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إنشاء حساب",
  description: "انضم لمنصة أبطال جازان — كبطل مستقل، أسرة منتجة، أو شركة.",
  robots: { index: false },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
