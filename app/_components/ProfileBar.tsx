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
    <nav className="w-40 p-5">
      <ul className="flex flex-col justify-between items-center">
        {user && <p className="text-xl">{user.username}</p>}
        {user ? (
          <>
            <button
              className="bg-slate-300 text-slate-900 p-2 px-4 w-auto rounded-xl border-slate-500 border-2 hover:bg-slate-200 transition mt-2"
              onClick={() => {
                logout();
              }}
            >
              Log Out
            </button>
            <button
            className="bg-slate-300 text-slate-900 p-2 px-4 w-auto rounded-xl border-slate-500 border-2 hover:bg-slate-200 transition mt-2"
            onClick={() => {
              router.push(`/profile/${user.username}`)
            }}>
              My Profile
            </button>
          </>
        ) : (
          <a href="/login">Sign In</a>
        )}
      </ul>
    </nav>
  );
}
