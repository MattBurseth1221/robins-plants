"use client"

import Image from "next/image";
import MainNav from "./_components/MainNav"
import PageTitle from "./_components/PageTitle";

export default function Home() {
  async function callAPI() {
    await fetch('/api/posts');
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="p-10">
        <PageTitle title="Robin's Garden" />
        <MainNav active={"Home"} />

        
      </div>
      
      <div className="w-[50%] h-32 bg-gradient-to-b from-lg to-dg">

      </div>
      <div className="w-[50%] h-32 bg-gradient-to-b from-dg to-lb">

      </div>
      <div className="w-[50%] h-32 bg-gradient-to-b from-lb to-db">

      </div>
      <div className="w-[50%] h-32 bg-db">

      </div>

      <button onClick={() => {
        fetch('/api/posts');
      }} >
        Click me
      </button>
    </main>
  );
}
