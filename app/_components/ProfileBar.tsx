'use client'

import { useRouter } from "next/navigation";
import { useSession } from "../_lib/hooks/SessionContext";

export default function ProfileBar() {

  
  const { user } = useSession();
  const router = useRouter();

  if (!user) {
    router.push("/login");
  }

  async function logout() {
    const result = await fetch(process.env.URL + "/api/auth");

    if (result.ok) {
      router.push(result.url);
      return;
    }

    console.log(result);
  }

  return (
    <nav className="w-40 p-5 border-black border-2 h-64">
      <ul className="flex flex-col justify-between items-center">
        {user && <p>{ user.username }</p>}
        {user ?
            <button className="bg-green-800 text-white p-2 px-4 w-auto rounded-xl hover:bg-green-700 hover:text-black transition" onClick={() => {
                logout();
            }}>Log out</button>
        :
            <a href="/login">Sign in</a>}
      </ul>
    </nav>
  );
}
