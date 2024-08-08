import MainNav from "./_components/MainNav";
import PageTitle from "./_components/PageTitle";
import ProfileBar from "@/app/_components/ProfileBar";
import PostContainer from "./_components/PostContainer";
import { Suspense } from "react";
import { validateRequest } from "./_lib/auth";
import UserProvider from "./_providers/UserProvider";

export default async function Page() {
  return (
    <main className="flex min-h-screen">
      <MainNav active={"Home"} />

      <div className="p-10 flex flex-col text-center w-[60%] mx-auto items-center">
        <PageTitle title="- Robin Grows -" />

        <Suspense fallback={<div>Loading posts...</div>}>
          <PostContainer />
        </Suspense>
      </div>

      <ProfileBar />

      {/* <div className="w-[50%] h-32 bg-gradient-to-b from-lg to-dg"></div>
      <div className="w-[50%] h-32 bg-gradient-to-b from-dg to-lb"></div>
      <div className="w-[50%] h-32 bg-gradient-to-b from-lb to-db"></div>
      <div className="w-[50%] h-32 bg-db"></div> */}

      {/* <div className="w-[50%] h-32">{JSON.stringify(user)};</div> */}
    </main>
  );
}
