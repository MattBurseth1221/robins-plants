import type { Metadata } from "next";
import "./globals.css";
import "@mantine/core/styles.css";

import { SessionProvider } from "@/app/_lib/hooks/SessionContext";
import { validateRequest } from "@/app/_lib/auth";
import UserProvider from "./_providers/UserProvider";

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";

export const metadata: Metadata = {
  title: "Robin Plants",
  description: "Post about, research, and discuss your favorite plants!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await validateRequest();
  const { user }: any = await validateRequest();

  return (
    <UserProvider user={user}>
      <html lang="en">
        <head>
          
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          ></meta>
          {/* <ColorSchemeScript /> */}
        </head>

        <body className="bg-gradient-to-b  from-slate-200 from-50% via-slate-300  to-slate-500 to-90%">
          
            <SessionProvider value={session}><MantineProvider defaultColorScheme="light">{children}</MantineProvider></SessionProvider>
          
        </body>
      </html>
    </UserProvider>
  );
}
