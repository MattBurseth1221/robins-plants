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
        <MainNav active={"Admin"} />

        <div className="p-10 flex flex-col text-center w-[60%] mx-auto items-center">
          <PageTitle title="- Create Post -" />

          <UploadForm />
        </div>

        <ProfileBar />
      </main>
    </UserProvider>
  );
}
