import type { Metadata } from "next";
import "./globals.css";

import { SessionProvider } from "@/app/_lib/hooks/SessionContext";
import { validateRequest } from "@/app/_lib/auth";
import UserProvider from "./_providers/UserProvider";

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
  const { user }: any = await validateRequest();

  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </head>

      <UserProvider user={user}>
        <body className="bg-gradient-to-b from-lg via-dg to-lb bg-no-repeat bg-contain">
          <SessionProvider value={session}>{children}</SessionProvider>
        </body>
      </UserProvider>
    </html>
  );
}
