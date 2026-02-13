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
    <main className="min-h-screen flex flex-col justify-center items-center bg-login-bg bg-cover px-4">
      <div className="bg-surface border border-border w-full max-w-md flex flex-col items-center justify-center mx-auto rounded-xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-text mb-6">Log in</h1>
        <Form action={login} page={"login"} >
          <div className="w-full space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-muted mb-2">Email/Username</label>
              <input
                name="username"
                id="username"
                placeholder="Email"
                className="w-full p-3 border border-border rounded-md bg-background text-text focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-muted mb-2">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                className="w-full p-3 border border-border rounded-md bg-background text-text focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
            <button className="w-full bg-primary text-white border border-primary rounded-md px-6 py-3 font-semibold hover:bg-primaryDark transition mt-4">
              Log in
            </button>
          </div>
        </Form>
        <div className="w-full flex flex-col sm:flex-row justify-between mt-6 pt-6 border-t border-border">
          <Link
            href="/signup"
            className="bg-surface text-primary border border-primary rounded-md px-4 py-2 text-center hover:bg-primary hover:text-white transition mb-2 sm:mb-0"
          >
            Create an account
          </Link>
          <Link
            href="/reset-password"
            className="bg-surface text-muted border border-border rounded-md px-4 py-2 text-center hover:bg-background transition"
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
