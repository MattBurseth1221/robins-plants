"use server";

import Image from "next/image";
import MainNav from "./_components/MainNav";
import PageTitle from "./_components/PageTitle";
import ProfileBar from "@/app/_components/ProfileBar"
import { lucia, validateRequest } from "./_lib/auth";
import { redirect } from "next/navigation";
import PostContainer from "./_components/PostContainer";
import { cookies } from "next/headers";
import { ActionResult } from "./_components/Form";
import { useSession } from "./_lib/hooks/SessionContext";

export default async function Page() {
  useSession();

  if (false) {
    redirect("/login");
  }

  async function logout(): Promise<ActionResult> {
    "use server";
    
    if (!session) {
      return {
        error: "Unauthorized"
      };
    }
  
    await lucia.invalidateSession(session.id);
  
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect("/login");
  }

  return (
    <main className="flex min-h-screen">
      <MainNav active={"Home"} />

      <div className="p-10 flex flex-col text-center w-[60%] mx-auto items-center">
        <PageTitle title="Robin's Garden" />

        <PostContainer />
      </div>

      <ProfileBar user={ user } logoutFunc={ logout }/>
      
      {/* <div className="w-[50%] h-32 bg-gradient-to-b from-lg to-dg"></div>
      <div className="w-[50%] h-32 bg-gradient-to-b from-dg to-lb"></div>
      <div className="w-[50%] h-32 bg-gradient-to-b from-lb to-db"></div>
      <div className="w-[50%] h-32 bg-db"></div> */}

      {/* <div className="w-[50%] h-32">{JSON.stringify(user)};</div> */}

      
    </main>
  );
}
