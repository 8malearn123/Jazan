import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description: "سجّل دخولك إلى منصة أبطال جازان لإدارة ملفك واستقبال الفرص.",
  robots: { index: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
