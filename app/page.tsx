import Image from "next/image";
import MainNav from "./_components/MainNav"
import PageTitle from "./_components/PageTitle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="p-10">
        <PageTitle title="Robin's Garden" />
        <MainNav active={"Home"} />
      </div>
      
      
    </main>
  );
}
