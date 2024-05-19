import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Robin's Plants",
  description: "Robin's Plant website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray">{children}</body>
    </html>
  );
}
