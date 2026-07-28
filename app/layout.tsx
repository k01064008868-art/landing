import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://landing-rho-eight-55.vercel.app"),
  title: "브레인시티 메디스파크 로제비앙 모아엘가 | 분양 안내",
  description:
    "평택 브레인시티 6BL 총 1,215세대. 입지환경, 단지배치, 84A·84B·101㎡ 평면과 분양 상담을 확인하세요.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "브레인시티 메디스파크",
    title: "브레인시티 메디스파크 로제비앙 모아엘가",
    description:
      "건강과 배움, 공원까지 가까운 새로운 중심. 총 1,215세대 분양 안내 및 상담 신청.",
    images: [
      {
        url: "/og-medispark.png",
        width: 1733,
        height: 910,
        alt: "브레인시티 메디스파크 로제비앙 모아엘가 단지 조감도",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "브레인시티 메디스파크 로제비앙 모아엘가",
    description: "총 1,215세대 분양 안내 및 상담 신청",
    images: ["/og-medispark.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
