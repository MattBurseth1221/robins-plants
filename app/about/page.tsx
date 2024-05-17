import MainNav from "../_components/MainNav";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="p-10">
        <MainNav active={"Home"} />
      </div>
    </main>
  );
}
