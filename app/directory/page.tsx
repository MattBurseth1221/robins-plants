"use client";

import Image from "next/image";
import MainNav from "../_components/MainNav"
import PageTitle from "../_components/PageTitle";
import { useSession } from "../_lib/hooks/SessionContext";

export default function Directory() {
  const { user, session } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="p-10">
        <PageTitle title="Plant Directory" />
        <MainNav active={"Directory"} />

        <div>
          { user ? user.username : "lol" }
        </div>
      </div>
    </main>
  );
}
