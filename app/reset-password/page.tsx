"use client";

import { useState } from "react";
import { pool } from "../_lib/db";

export default function Page() {
  const [usernameValue, setUsernameValue] = useState<string>("");

  async function sendPasswordResetEmail() {
    if (!usernameValue || typeof usernameValue !== "string") return;

    //TODO
    //Don't know if I can do this here, might have to break this out to a server component and lookup user.

    // const usernameQuery = `SELECT id FROM auth_user WHERE username = '${usernameValue}' OR email = '${usernameValue}'`;
    // const queryResult = (await pool.query(usernameQuery)).rows;

    // console.log(queryResult);

    // if (queryResult.length === 0) alert("No user found.");

    const passwordChangeResponse = await fetch(
      "/api/user?action=reset-password",
      {
        method: "PUT",
        body: JSON.stringify({
          usernameValue: usernameValue,
        }),
      }
    );

    console.log("pass change response");
    console.log(passwordChangeResponse);

    // const emailResponse = await fetch("/api/send", {
    //   method: "POST",
    //   body: JSON.stringify({ "tempPassword": tempPassword, "hashedTempPassword": hashedTempPassword }),
    // }).then((res) => res.json());

    // console.log(emailResponse);
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-login-bg h-[900px] bg-cover">
      <div className="bg-white flex flex-col items-center w-[700px] justify-center mx-auto border-opacity-20 border-gray-800 rounded-xl border-4 p-8">
        <h1 className="text-xl mb-4">Reset Password</h1>

        <h2 className="float-left mb-2">Enter your email/username</h2>
        <input
          type="text"
          name="username"
          id="username"
          value={usernameValue}
          onChange={(e) => {
            setUsernameValue(e.target.value);
          }}
          className="border-[1px] border-gray-400 p-2 w-[50%] rounded-md"
        />
        <button onClick={sendPasswordResetEmail} className="mt-4">
          Send email
        </button>
      </div>
    </main>
  );
}
