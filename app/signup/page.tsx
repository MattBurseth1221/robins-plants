import Link from "next/link";

import { pool } from "../_lib/db";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "../_lib/auth";
import { redirect } from "next/navigation";
import { Form } from "../_components/Form";
import { v4 as uuidv4 } from "uuid";

import type { ActionResult } from "../_components/Form";
import { testPassword, generateSHA256 } from "../_utils/helper-functions";

export default async function Page() {
  const { user } = await validateRequest();
  if (user) {
    return redirect("/");
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-login-bg bg-cover px-4">
      <div className="bg-surface border border-border w-full max-w-md flex flex-col items-center justify-center mx-auto rounded-xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-text mb-6">Create an account</h1>
        <Form action={signup} page="signup" >
          <div className="w-full space-y-4">
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-muted mb-2">First name</label>
              <input
                name="firstname"
                id="firstname"
                minLength={2}
                maxLength={32}
                className="w-full p-3 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-muted mb-2">Last name</label>
              <input
                name="lastname"
                id="lastname"
                minLength={2}
                maxLength={32}
                className="w-full p-3 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-muted mb-2">Username</label>
              <input
                name="username"
                id="username"
                className="w-full p-3 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-muted mb-2">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="w-full p-3 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-muted mb-2">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className="w-full p-3 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-muted mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirm-password"
                id="confirm-password"
                className="w-full p-3 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button className="flex-1 bg-primary text-white border border-primary rounded-md px-6 py-3 font-semibold hover:bg-primaryDark transition">
              Create Account
            </button>
            <Link
              href="/login"
              className="flex-1 bg-surface text-muted border border-border rounded-md px-6 py-3 text-center font-semibold hover:bg-background transition"
            >
              Back to Login
            </Link>
          </div>
        </Form>
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

  const hashedPassword = generateSHA256(password);

  const userId = uuidv4();
  const emailAddress = formData.get("email");
  const firstName = formData.get("firstname");
  const lastName = formData.get("lastname");

  const query = {
    text: "INSERT INTO auth_user(id, username, password_hash, email, first_name, last_name) VALUES($1, $2, $3, $4, $5, $6)",
    values: [
      userId,
      username,
      hashedPassword,
      emailAddress,
      firstName,
      lastName,
    ],
  };

  try {
    await pool.query(query);

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
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
