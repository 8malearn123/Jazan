import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "استعادة كلمة المرور",
  description: "استعد الوصول إلى حسابك في منصة أبطال جازان.",
  robots: { index: false },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
