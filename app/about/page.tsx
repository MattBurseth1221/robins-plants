import MainNav from "../_components/MainNav";
import PageTitle from "../_components/PageTitle";
import ProfileBar from "../_components/ProfileBar";
import UserProvider from "../_providers/UserProvider";

export default function Page() {
  return (
    <main className="flex min-h-screen">
      <MainNav active={"About"} />

      <div className="p-10 flex flex-col text-center w-[60%] mx-auto items-center">
        <PageTitle title="- About Me -" />
      </div>

      <ProfileBar />
    </main>
  );
}
