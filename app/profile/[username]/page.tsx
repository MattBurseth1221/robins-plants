import MainNav from "@/app/_components/MainNav";
import PageTitle from "@/app/_components/PageTitle";
import ProfileContainer from "@/app/_components/ProfileContainer";
import { GetServerSidePropsContext } from "next";

import { UserType } from "@/app/_components/PostContainer";
import ProfileOwner from "@/app/_components/ProfileOwner";

export default async function ProfilePage(context: GetServerSidePropsContext) {
  const params = await context.params;

  const profileUser: UserType = await fetch(
    `${process.env.HOME_URL}/api/user?username=${params!.username}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => data.data);

  if (params!.username === undefined || params!.username === null)
    return (
      <main>
        <div>No user found...</div>
      </main>
    );
  return (
    <main className="flex min-h-screen">
      <div className="pt-5 flex flex-col border-r-[1px] border-slate-300 fixed h-[100vh] px-5">
        <MainNav active={"Profile"} />
      </div>

      <div className="p-10 flex flex-col text-center w-[60%] mx-auto items-center">
        {params!.username === undefined ? (
          <div>No user found...</div>
        ) : (
          <>
            <PageTitle title={`- ${params!.username}'s Profile -`} />

            <ProfileContainer username={params!.username}>
              
            </ProfileContainer>
          </>
        )}
      </div>
    </main>
  );
}
