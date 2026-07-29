import type { Metadata } from "next";
import { ContactView } from "./ContactView";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description: "تواصل مع فريق منصة فرصة عبر البريد أو واتساب.",
};

export default function ContactPage() {
  return <ContactView />;
}
