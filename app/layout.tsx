import type { Metadata } from "next";
import "./globals.css";

import { SessionProvider } from "@/app/_lib/hooks/SessionContext";
import { validateRequest } from "@/app/_lib/auth";
import UserProvider from "./_providers/UserProvider";

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
    <UserProvider user={user} >
      <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </head>

      <body className="bg-gradient-to-b bg-slate-200 from-slate-100 to-slate-400">
        <SessionProvider value={session}>{children}</SessionProvider>
      </body>
    </html>
    </UserProvider>
    
  );
}


