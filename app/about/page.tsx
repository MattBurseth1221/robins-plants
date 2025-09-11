import MainNav from "../_components/MainNav";
import PageTitle from "../_components/PageTitle";
import ProfileBar from "../_components/ProfileBar";
import { validateRequest } from "../_lib/auth";
import UserProvider from "../_providers/UserProvider";

export default async function Page() {
  const { user }: any = await validateRequest();

  return (
    <UserProvider user={user}>
      <main className="flex min-h-screen bg-background">
        <div className="flex flex-col fixed h-[100vh]">
          <MainNav active={"About"} />
        </div>

        <div className="p-10 flex flex-col text-center w-[60%] mx-auto items-center">
          <div className="bg-surface rounded-xl shadow-lg border border-border w-full p-8">
            {/* <PageTitle title="- About -" /> */}
            <div>
              <p>This is a website for users to upload posts and track the progress/growth of their gardens. </p>
            </div>
          </div>
        </div>
      </main>
    </UserProvider>
  );
}
