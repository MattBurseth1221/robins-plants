import Image from "next/image";
import MainNav from "../_components/MainNav"

export default function Directory() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <MainNav active={"Directory"} />
    </main>
  );
}
