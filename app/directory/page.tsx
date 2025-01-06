import MainNav from "../_components/MainNav";
import PageTitle from "../_components/PageTitle";
import { validateRequest } from "../_lib/auth";
import ProfileBar from "../_components/ProfileBar";
import UserProvider from "../_providers/UserProvider";

//export const runtime = "edge";

export default async function Directory() {
  const { user }: any = await validateRequest();

  return (
    <UserProvider user={user} >
      <main className="flex min-h-screen">
      <div className="pt-5 flex flex-col border-r-[1px] border-slate-300 fixed h-[100vh] px-5">
        <MainNav active={"Directory"} />
      </div>

      <div className="p-10 flex flex-col text-center w-[60%] mx-auto items-center">
        <PageTitle title="- Plant Directory -" />

        <p>I haven&apos;t written this part of the app yet </p>
      </div>
    </main>
    </UserProvider>
    
  );
}
