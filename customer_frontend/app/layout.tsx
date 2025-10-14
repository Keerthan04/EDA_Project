import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Customer Portal - Banking System",
  description: "Customer portal for banking system microservices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
