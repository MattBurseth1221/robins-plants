import { redirect } from "next/navigation";
import MainNav from "../_components/MainNav";
import PageTitle from "../_components/PageTitle";
import { validateRequest } from "../_lib/auth";
import UploadForm from "../_components/UploadForm";
import UserProvider from "../_providers/UserProvider";

export default async function Page() {
  const { user }: any = await validateRequest();
  // if (!userIsAdmin(user)) {
  //   return redirect("/");
  // }

  return (
    <UserProvider user={user}>
      <main className="flex min-h-screen bg-background">
        <div className="flex flex-col fixed h-[100vh]">
          <MainNav active={"Admin"} />
        </div>

        <div className="p-10 text-center lg:w-[60%] md:w-[60%] sm:w-[100%] mx-auto items-center">
          <div className="bg-surface rounded-xl shadow-lg border border-border w-full p-8">
            {/* <PageTitle title="- Create Post -" /> */}
            <UploadForm />
          </div>
        </div>
      </main>
    </UserProvider>
  );
}
