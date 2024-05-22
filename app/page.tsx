import Image from "next/image";
import MainNav from "./_components/MainNav";
import PageTitle from "./_components/PageTitle";
// import { useEffect, useState } from "react";
import { validateRequest } from "./_lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    redirect("/login");
  }

  const posts = await fetch(process.env.URL + "/api/posts", {method: 'GET'});
  console.log(posts);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="p-10">
        <PageTitle title="Robin's Garden" />
        <MainNav active={"Home"} />
      </div>

      <div className="w-[50%] h-32 bg-gradient-to-b from-lg to-dg"></div>
      <div className="w-[50%] h-32 bg-gradient-to-b from-dg to-lb"></div>
      <div className="w-[50%] h-32 bg-gradient-to-b from-lb to-db"></div>
      <div className="w-[50%] h-32 bg-db"></div>

      <div className="w-[50%] h-32">{JSON.stringify(user)};</div>

      {/* {posts?.forEach((post: any, index: number) => {
        return <div className="w-[25%] h-24 border-black border-2" key={index}>{ post.title }</div>
      })} */}
    </main>
  );
}
