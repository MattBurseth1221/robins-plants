"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
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

    console.log(result);
  }

  useEffect(() => {
    console.log(user);
  }, [])

  return (
    <nav className="w-40 p-5 h-64">
      <ul className="flex flex-col justify-between items-center">
        {user && <p>{user.username}</p>}
        {user ? (
          <button
            className="bg-green-800 text-white p-2 px-4 w-auto rounded-xl hover:bg-green-700 hover:text-black transition"
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
