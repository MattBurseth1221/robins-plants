import type { Metadata } from "next";
import "./globals.css";

import { SessionProvider } from "@/app/_lib/hooks/SessionContext";
import { validateRequest } from "@/app/_lib/auth";
import UserProvider from "./_providers/UserProvider";
import { Suspense } from "react";

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
  //const { user }: any = await validateRequest();

  return (
    <Suspense
      fallback={
        <div>
          <span className="text-primary">Loading page...</span>
        </div>
      }
    >
      <UserProvider user={session.user}>
        <html lang="en">
          <head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
              viewport-fit="cover"
            ></meta>

            {/* <style>
            @import url('https://fonts.googleapis.com/css2?family=Anybody:ital,wght@0,100..900;1,100..900&display=swap');
          </style> */}
            <style>
              @import
              url('https://fonts.googleapis.com/css2?family=Anybody:ital,wght@0,100..900;1,100..900&family=Jost:ital,wght@0,100..900;1,100..900&display=swap');
            </style>
          </head>

          <body className="bg-linear-to-b  from-slate-200 from-50% via-slate-300  to-slate-500 to-90% anybody-fonty">
            <SessionProvider value={session}>{children}</SessionProvider>
          </body>
        </html>
      </UserProvider>
    </Suspense>
  );
}
