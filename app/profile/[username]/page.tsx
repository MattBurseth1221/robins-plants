import MainNav from "@/app/_components/MainNav";
import PageTitle from "@/app/_components/PageTitle";
import ProfileBar from "@/app/_components/ProfileBar";
import ProfileContainer from "@/app/_components/ProfileContainer";
import { GetServerSidePropsContext } from "next";

export default async function ProfilePage(context: GetServerSidePropsContext) {
  const { params } = context;

  return (
    <main className="flex min-h-screen">
      <MainNav active={""} />

      <div className="p-10 flex flex-col text-center w-[60%] mx-auto items-center">
        <PageTitle title="- My Profile -" />

        <ProfileContainer username={ params!.username } />
      </div>

      <ProfileBar />
    </main>
  );
}
