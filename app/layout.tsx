import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "frame-nest",
  description: "Next.js on Cloudflare"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
