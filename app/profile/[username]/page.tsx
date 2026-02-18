import MainNav from "@/app/_components/MainNav";
import ProfileContainer from "@/app/_components/ProfileContainer";
import { validateRequest } from "@/app/_lib/auth";
import UserProvider from "@/app/_providers/UserProvider";

export default async function ProfilePage(context: any) {
  const params = await context.params;
  const { user }: any = await validateRequest();

  if (params!.username === undefined || params!.username === null)
    return (
      <main className="bg-background min-h-screen flex items-center justify-center">
        <div className="bg-surface rounded-xl shadow-lg border border-border p-8">
          <div>No user found...</div>
        </div>
      </main>
    );
  return (
    <UserProvider user={user}>
      <main className="flex min-h-screen bg-background">
        <div className="flex flex-col fixed h-screen">
          <MainNav active={"Profile"} />
        </div>

        <div className="flex-1 flex justify-center lg:ml-56">
          <div className="w-full max-w-4xl px-4 py-10">
            <div className="bg-surface rounded-xl shadow-lg border border-border p-8">
              {params!.username === undefined ? (
                <div className="text-center text-muted">No user found...</div>
              ) : (
                <>
                  {/* <PageTitle title={`- ${params!.username}'s Profile -`} /> */}
                  <ProfileContainer username={params!.username} />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </UserProvider>
  );
}
