import Image from "next/image";
import MainNav from "./_components/MainNav"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <MainNav active={"Home"} />
    </main>
  );
}
