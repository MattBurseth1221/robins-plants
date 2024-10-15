import ChatRoom from "@/app/_components/ChatRoom";
import MainNav from "@/app/_components/MainNav";
import PageTitle from "@/app/_components/PageTitle";
import ProfileBar from "@/app/_components/ProfileBar";
import { validateRequest } from "@/app/_lib/auth";
import UserProvider from "@/app/_providers/UserProvider";

export default async function Chat() {
  const { user }: any = await validateRequest();

  return (
    <UserProvider user={user}>
      <main className="flex min-h-screen">
        <MainNav active={"Home"} />

        <div className="p-10 flex flex-col text-center w-[60%] mx-auto items-center">
          <PageTitle title="- Messaging -" />

          <ChatRoom />

          {/* <Suspense fallback={<div>Loading posts...</div>}>
              
            </Suspense> */}
        </div>

        <ProfileBar />

        {/* <div className="w-[50%] h-32 bg-gradient-to-b from-lg to-dg"></div>
        <div className="w-[50%] h-32 bg-gradient-to-b from-dg to-lb"></div>
        <div className="w-[50%] h-32 bg-gradient-to-b from-lb to-db"></div>
        <div className="w-[50%] h-32 bg-db"></div> */}

        {/* <div className="w-[50%] h-32">{JSON.stringify(user)};</div> */}
      </main>
    </UserProvider>
  );
}
