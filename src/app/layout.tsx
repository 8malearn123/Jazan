import type { Metadata } from "next";
import { Alexandria, IBM_Plex_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { site } from "@/lib/site";
import "./globals.css";

const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-alexandria",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "أبطال جازان | منصة مواهب جازان المجتمعية",
    template: "%s | أبطال جازان",
  },
  description:
    "منصة محلية تربط المستقلين والباحثين عن عمل، والأسر المنتجة والصُنّاع، بالشركات والجهات في منطقة جازان — تواصل مباشر عبر واتساب.",
  keywords: [
    "أبطال جازان",
    "وظائف جازان",
    "مستقلين جازان",
    "أسر منتجة",
    "شركات جازان",
  ],
  openGraph: {
    title: "أبطال جازان | منصة مواهب جازان المجتمعية",
    description:
      "مواهب جازان تلتقي بالفرص الحقيقية — مستقلون، أسر منتجة، وشركات.",
    type: "website",
    locale: "ar_SA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${alexandria.variable} ${plexMono.variable}`}
    >
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
