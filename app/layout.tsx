import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rin-reboot-site.pages.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Rin — Frontend Engineer",
  description:
    "フロントエンドを軸に、Web・デスクトップ・インフラまで幅広く探究するエンジニア Rin のポートフォリオ。",
  icons: {
    icon: "/avatar.jpg",
    shortcut: "/avatar.jpg",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Rin — Frontend Engineer",
    description: "Interfaces, systems, and everything between.",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Rin — Frontend Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rin — Frontend Engineer",
    description: "Interfaces, systems, and everything between.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
