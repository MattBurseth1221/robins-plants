import MainNav from "../_components/MainNav";
import PageTitle from "../_components/PageTitle";
import ProfileBar from "../_components/ProfileBar";
import { validateRequest } from "../_lib/auth";
import UserProvider from "../_providers/UserProvider";

import Image from "next/image";
import TJB from "@/public/tjb.jpg"

export const runtime = "edge";

export default async function Page() {
  const { user }: any = await validateRequest();

  return (
    <UserProvider user={user}>
      <main className="flex min-h-screen">
        <MainNav active={"About"} />

        <div className="p-10 flex flex-col text-center w-[60%] mx-auto items-center">
          <PageTitle title="- About -" />

          <h1 className="text-2xl mb-2 border-b-[1px] border-black">What to do</h1>
          <p>For beta testers - basically, just go fucking nuts on the site. You can create accounts, request password resets with the email addresses, create/edit/delete posts and comments, and like photos.</p>
          <p>If you find any issues or things that might be bugs, let me know and I&apos;ll fix that shit ASAP. If you&apos;re not sure if something is a bug or a feature, still let me know.</p>
          <p>Posts are limited to 10 image files, so feel free to test the limits. Also don&apos;t go too crazy because over a certain photo limit Amazon is going to start charging me...</p>
          <p>I have only focused on functionality so don&apos;t hit me up saying the site looks like shit - I know it does, just tell me if something is broken type shit fr</p>
          <br />
          <p>--- IMPORTANT ---</p>
          <p>As more shit gets posted and more people are logged in at the same time, stuff might take longer to load and update. If this is happening and it&apos;s noticeable, hit me up</p>
          <Image src={TJB} width="600" height="600" alt="TJB" className="mt-4 rounded-md" />
        </div>

        <ProfileBar />
      </main>
    </UserProvider>
  );
}
