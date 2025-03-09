import MainNav from "./_components/MainNav";
import PageTitle from "./_components/PageTitle";
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
      <main className="flex min-h-screen">
        <div className="pt-5 flex flex-col fixed h-[100vh] px-5">
          <MainNav active={"Home"} />
        </div>

        <div className="lg:p-10 md:p-10 flex flex-col text-center sm:w-[100%] lg:w-[60%] md:w-[60%] mx-auto items-center">
          <PageTitle title="- Robin Plants -" />

          <Suspense fallback={<div>Loading posts...</div>}>
            <PostContainer />
          </Suspense>
        </div>
      </main>
    </UserProvider>
  );
}
