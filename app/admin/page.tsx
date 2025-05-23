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
      <main className="flex min-h-screen">
        <div className="pt-5 flex flex-col border-r-[1px] border-slate-300 fixed h-[100vh] px-5">
          <MainNav active={"Admin"} />
        </div>

        <div className="p-10 text-center lg:w-[60%] md:w-[60%] sm:w-[100%] mx-auto items-center">
          <PageTitle title="- Create Post -" />

          <UploadForm />
        </div>
      </main>
    </UserProvider>
  );
}
