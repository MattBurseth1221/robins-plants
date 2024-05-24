'use client';

import MainNav from "./_components/MainNav";
import PageTitle from "./_components/PageTitle";
import ProfileBar from "@/app/_components/ProfileBar"
import { redirect } from "next/navigation";
import PostContainer from "./_components/PostContainer";
import { useSession } from "./_lib/hooks/SessionContext";

export default function Page() {
  const { user, session } = useSession();

  if (!user) {
    redirect("/login");
  }

  async function logout() {
    const result = await fetch(process.env.URL + "/api/auth");

    try {
      redirect(result.url);
    } catch(e) {
      console.log(e);
    }
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
