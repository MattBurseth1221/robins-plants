import type { Metadata } from "next";
import "./globals.css";

import { SessionProvider } from "@/app/_lib/hooks/SessionContext";
import { validateRequest } from "@/app/_lib/auth"

export const metadata: Metadata = {
  title: "Robin's Plants",
  description: "Robin's Plant website",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await validateRequest();

  return (
    <html lang="en">
      <body className="max-h-screen bg-gradient-to-b from-lg via-dg to-lb">
        <SessionProvider value={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
