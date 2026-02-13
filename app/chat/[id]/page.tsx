import ChatRoom from "@/app/_components/ChatRoom";
import MainNav from "@/app/_components/MainNav";
import { validateRequest } from "@/app/_lib/auth";
import UserProvider from "@/app/_providers/UserProvider";

export default async function Chat() {
  const { user }: any = await validateRequest();

  return (
    <UserProvider user={user}>
      <main className="flex min-h-screen bg-background">
        <div className="flex flex-col fixed h-[100vh]">
          <MainNav active={"Home"} />
        </div>

        <div className="flex-1 flex justify-center lg:ml-56">
          <div className="w-full max-w-4xl px-4 py-10">
            <div className="bg-surface rounded-xl shadow-lg border border-border p-6 h-[calc(100vh-5rem)] flex flex-col">
              <ChatRoom />
            </div>
          </div>
        </div>
      </main>
    </UserProvider>
  );
}
