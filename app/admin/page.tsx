import { redirect } from "next/navigation";
import MainNav from "../_components/MainNav";
import PageTitle from "../_components/PageTitle";
import ProfileBar from "../_components/ProfileBar";
import { validateRequest } from "../_lib/auth";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user || user.username !== "Robin") {
    return redirect("/");
  }

  return (
    <main className="flex min-h-screen">
      <MainNav active={"Home"} />

      <div className="p-10 flex flex-col text-center w-[60%] mx-auto items-center">
        <PageTitle title="- Robin's Admin Page -" />
      </div>

      <ProfileBar />
    </main>
  );
}
