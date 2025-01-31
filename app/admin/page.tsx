import { redirect } from "next/navigation";
import MainNav from "../_components/MainNav";
import PageTitle from "../_components/PageTitle";
import ProfileBar from "../_components/ProfileBar";
import { validateRequest } from "../_lib/auth";
import UploadForm from "../_components/UploadForm";
import { userIsAdmin } from "../_utils/helper-functions";
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

        <div className="p-10 text-center w-[60%] mx-auto items-center">
          <PageTitle title="- Create Post -" />

          <UploadForm />
        </div>
      </main>
    </UserProvider>
  );
}
