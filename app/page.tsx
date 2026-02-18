import MainNav from "./_components/MainNav";
import PostContainer from "./_components/PostContainer";
import { Suspense } from "react";
import { validateRequest } from "./_lib/auth";
import UserProvider from "./_providers/UserProvider";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user }: any = await validateRequest();

  if (!user) redirect("/login");

  return (
    <UserProvider user={user}>
      <main className="min-h-screen bg-secondary flex justify-center">
        <div className=" block fixed left-0 top-0 h-full z-10">
          <MainNav active="Home" />
        </div>

        <div className="flex-1 flex justify-center lg:ml-56">
          <div className="w-full max-w-2xl px-4 py-10">
            <div className="bg-surface rounded-xl shadow-lg border border-border p-6">
              <Suspense fallback={<div>Loading posts...</div>}>
                <PostContainer />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </UserProvider>
  );
}
