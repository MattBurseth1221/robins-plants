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

//export const runtime = "edge";

export default async function Page() {
  const { user } = await validateRequest();
  if (user) {
    return redirect("/");
  }
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-login-bg h-[900px] bg-cover">
      <div className="bg-white flex flex-col items-center w-[700px] justify-center mx-auto border-opacity-20 border-gray-800 rounded-xl border-4 p-8">
        <h1 className="text-xl">Sign in</h1>
        <Form action={login}>
          <label htmlFor="username">Email/Username</label>
          <input name="username" id="username" />
          <br />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
          <br />
          <button className="mb-8 w-32 block mx-auto border-gray-400 border-opacity-50 border-2 rounded-xl p-2 px-8 hover:bg-gray-400 transition">Continue</button>
        </Form>
        <Link href="/signup">Create an account</Link>
        <Link href="/reset-password">Forgot password?</Link>
      </div>
    </main>
  );
}

function sha256(data: string): string {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
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

  const validPassword = sha256(password) === existingUser.password_hash;

  if (!validPassword) {
    return {
      error: "Incorrect username or password",
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/");
}
