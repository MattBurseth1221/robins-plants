import Link from "next/link";
import "@/app/globals.css";

import { pool } from "../_lib/db";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "../_lib/auth";
import { redirect } from "next/navigation";
import { Form } from "../_components/Form";

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
    <main className="min-h-screen flex flex-col justify-center items-center bg-login-bg sm:h-[100vh] lg:h-[900px] bg-cover px-4">
      <div className="bg-white w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-xl flex flex-col items-center justify-center mx-auto rounded-xl p-8 sm:p-6 md:p-8 lg:p-8 xl:p-8">
        <h1 className="text-xl md:text-2xl">Log in</h1>
        <Form action={login} page={"login"} >
          <label htmlFor="username">Email/Username</label>
          <input
            name="username"
            id="username"
            placeholder="Email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <button className="w-full border-gray-400 border-opacity-50 border-2 rounded-xl p-2 mt-2 hover:bg-gray-200 transition">
            Log in
          </button>
        </Form>
        <div className="w-full flex flex-col sm:flex-row justify-between mt-2 border-t-[1px] border-slate-500 border-opacity-20 pt-4 max-w-md">
          <Link
            href="/signup"
            className="border-gray-400 border-opacity-50 border-2 rounded-xl p-2 px-4 text-center hover:bg-gray-200 transition"
          >
            Create an account
          </Link>
          <Link
            href="/reset-password"
            className="border-gray-400 border-opacity-50 border-2 rounded-xl p-2 px-4 text-center hover:bg-gray-200 transition mt-2 sm:mt-0"
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
