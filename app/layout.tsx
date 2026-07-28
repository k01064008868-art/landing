import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "브레인시티 메디스파크 로제비앙 모아엘가 | 분양 안내",
  description: "평택 브레인시티 6BL 총 1,215세대. 입지환경, 단지배치, 84A·84B·101㎡ 평면과 분양 상담을 확인하세요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
