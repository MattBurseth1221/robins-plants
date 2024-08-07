import Link from "next/link";

import { pool } from "../_lib/db";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "../_lib/auth";
import { redirect } from "next/navigation";
import { Form } from "../_components/Form";
import { generateId } from "lucia";
import { v4 as uuidv4 } from "uuid";

import type { ActionResult } from "../_components/Form";
import { sha256, testPassword } from "../_utils/helper-functions";

export default async function Page() {
  const { user } = await validateRequest();
  if (user) {
    return redirect("/");
  }
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-login-bg h-[900px] bg-cover">
      <div className="bg-white flex flex-col items-center w-[700px] justify-center mx-auto border-opacity-20 border-gray-800 rounded-xl border-4 p-8">
        <h1>Create an account</h1>
        <Form action={signup}>
          <label htmlFor="username">Username</label>
          <input name="username" id="username" />
          <br />
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
          <br />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
          <br />
          <label htmlFor="confirm-password">Confirm Password</label>
          <input type="password" name="confirm-password" id="password" />
          <br />
          <button>Continue</button>
        </Form>
        <Link href="/login">Sign in</Link>
      </div>
    </main>
  );
}

async function signup(_: any, formData: FormData): Promise<ActionResult> {
  "use server";
  const username = formData.get("username");
  // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
  if (
    typeof username !== "string" ||
    username.length < 5 ||
    username.length > 31 ||
    !/^[A-Za-z0-9_-]+$/.test(username)
  ) {
    return {
      error: "Invalid username",
    };
  }
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm-password") as string;
  
  const passwordValid = testPassword(password, confirmPassword);

  if (passwordValid.error) return passwordValid;

  const hashedPassword = await sha256(password);
  const userId = uuidv4();
  const emailAddress = formData.get("email");

  const query = {
    text: "INSERT INTO auth_user(id, username, password_hash, email) VALUES($1, $2, $3, $4)",
    values: [userId, username, hashedPassword, emailAddress],
  };

  try {
    await pool.query(query);

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (e) {
    if (e) {
      console.log(e);

      return {
        error: "Username/Email already in use",
      };
    }
    return {
      error: "An unknown error occurred",
    };
  }
  return redirect("/");
}
