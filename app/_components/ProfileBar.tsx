"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "../_providers/UserProvider";

export default function ProfileBar() {
  const user = useContext(UserContext);
  const router = useRouter();

  async function logout() {
    const result = await fetch(`/api/auth`);

    if (result.ok) {
      router.push(result.url);
      return;
    }
  }

  //bg-slate-500 text-white p-2 px-4 w-auto rounded-xl hover:bg-slate-400 hover:text-black transition mt-2
  //bg-slate-500 text-white p-2 px-4 w-auto rounded-xl hover:bg-slate-400 hover:text-black transition mt-2

  return (
    <nav className="p-4 bg-background rounded-lg shadow-inner">
      <ul className="flex flex-col gap-2 items-start">
        {user && <p className="text-lg text-text font-semibold mb-2">{user.username}</p>}
        {user ? (
          <>
            <button
              className="bg-error text-white px-4 py-2 rounded-lg border border-error hover:bg-error/80 transition"
              onClick={() => {
                logout();
              }}
            >
              Log Out
            </button>
          </>
        ) : (
          <a href="/login" className="text-primary hover:underline">Sign In</a>
        )}
      </ul>
    </nav>
  );
}
