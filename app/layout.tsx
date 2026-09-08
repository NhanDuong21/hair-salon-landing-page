import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Noto_Serif } from "next/font/google";
import "./globals.css";

const body = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-body",
});
const display = Noto_Serif({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});
const title = "Sol. Hair Studio — Tóc đẹp, bắt đầu từ một lịch hẹn";
const description =
  "Khám phá dịch vụ, giá, thời lượng và phong cách của Sol. Hair Studio. Trải nghiệm đặt lịch mẫu; chưa tạo lịch hẹn thực tế.";
export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  openGraph: {
    title,
    description,
    locale: "vi_VN",
    type: "website",
    siteName: "Sol. Hair Studio · Concept",
  },
  twitter: { card: "summary", title, description },
};
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${body.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
