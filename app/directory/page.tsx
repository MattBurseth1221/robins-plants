import MainNav from "../_components/MainNav";
import { validateRequest } from "../_lib/auth";
import ProfileBar from "../_components/ProfileBar";
import UserProvider from "../_providers/UserProvider";

//export const runtime = "edge";

export default async function Directory() {
  const { user }: any = await validateRequest();

  return (
    <UserProvider user={user} >
      <main className="flex min-h-screen bg-secondary">
      <div className="flex flex-col fixed h-screen">
        <MainNav active={"Directory"} />
      </div>

      <div className="p-10 flex flex-col text-center w-[60%] mx-auto items-center">
        <div className="bg-surface rounded-xl shadow-lg border border-border w-full p-8">
          {/* <PageTitle title="- Plant Directory -" /> */}
          <p>I haven&apos;t written this part of the app yet </p>
        </div>
      </div>
    </main>
    </UserProvider>
    
  );
}
