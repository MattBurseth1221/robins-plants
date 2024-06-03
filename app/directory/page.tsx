import Image from "next/image";
import MainNav from "../_components/MainNav";
import PageTitle from "../_components/PageTitle";
import { validateRequest } from "../_lib/auth";
import ProfileBar from "../_components/ProfileBar";

export default async function Directory() {
  const { user } = await validateRequest();

  return (
    <main className="flex min-h-screen">
      <MainNav active={"Directory"} />

      <div className="p-10 flex flex-col text-center w-[60%] mx-auto items-center">
        <PageTitle title="- Plant Directory -" />
      </div>

      <ProfileBar />
    </main>
  );
}
