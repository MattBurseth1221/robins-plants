"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "../_providers/UserProvider";

export default function ProfileBar() {
  const user = useContext(UserContext);
  const router = useRouter();

  async function logout() {
    const result = await fetch(process.env.URL + "/api/auth");

    if (result.ok) {
      router.push(result.url);
      return;
    }
  }

  return (
    <nav className="w-40 p-5 h-64">
      <ul className="flex flex-col justify-between items-center">
        {user && <p>{user.username}</p>}
        {user ? (
          <button
            className="bg-slate-500 text-white p-2 px-4 w-auto rounded-xl hover:bg-slate-400 hover:text-black transition mt-2"
            onClick={() => {
              logout();
            }}
          >
            Log out
          </button>
        ) : (
          <a href="/login">Sign in</a>
        )}
      </ul>
    </nav>
  );
}
