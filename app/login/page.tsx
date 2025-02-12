import Link from "next/link";
import "@/app/globals.css";

import { pool } from "../_lib/db";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "../_lib/auth";
import { redirect } from "next/navigation";
import { Form } from "../_components/Form";
import crypto from "node:crypto";

import type { DatabaseUser } from "../_lib/db";
import type { ActionResult } from "../_components/Form";
import { generateSHA256 } from "../_utils/helper-functions";

//export const runtime = "edge";

export default async function Page() {
  const { user } = await validateRequest();
  if (user) {
    return redirect("/");
  }
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-login-bg h-[900px] bg-cover">
      <div className="bg-white flex flex-col items-center w-[700px] justify-center mx-auto rounded-xl p-8">
        <h1 className="text-xl">Sign in</h1>
        <Form action={login} page={"login"}>
          <label htmlFor="username">Email/Username</label>
          <input name="username" id="username" placeholder="Email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
          <br />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" placeholder="Password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
          <br />
          {/* <div className="w-full"> */}
            <button className="inline-block mx-auto border-gray-400 border-opacity-50 border-2 rounded-xl p-2 px-8 hover:bg-gray-200 transition">
            Log in
          </button>
          {/* </div> */}
          
        </Form>
        <div className="w-[100%] flex flex-row justify-between mt-2 border-t-[1px] border-slate-500 border-opacity-20 pt-4 max-w-[400px]">
          <Link
            href="/signup"
            className="inline-block border-gray-400 border-opacity-50 border-2 rounded-xl p-2 px-4 hover:bg-gray-200 transition"
          >
            Create an account
          </Link>
          <Link
            href="/reset-password"
            className="inline-block border-gray-400 border-opacity-50 border-2 rounded-xl p-2 px-8 hover:bg-gray-200 transition"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </main>
  );
}

async function login(_: any, formData: FormData): Promise<ActionResult> {
  "use server";

  const username = formData.get("username");
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31
    //||
    // !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      error: "Invalid username",
    };
  }
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }

  const query = {
    text: "SELECT * FROM auth_user WHERE username = $1 OR email = $1",
    values: [username],
  };

  const existingUser = (await pool.query(query)).rows[0] as
    | DatabaseUser
    | undefined;
  if (!existingUser) {
    return {
      error: "Incorrect username or password",
    };
  }

  const validPassword = generateSHA256(password) === existingUser.password_hash;

  if (!validPassword) {
    return {
      error: "Incorrect username or password",
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect(process.env.HOME_URL as string);
}
