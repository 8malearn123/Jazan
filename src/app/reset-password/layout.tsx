import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تعيين كلمة مرور جديدة",
  description: "عيّن كلمة مرور جديدة لحسابك في منصة أبطال جازان.",
  robots: { index: false },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
