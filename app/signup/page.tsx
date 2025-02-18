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
    <main className="min-h-screen flex flex-col justify-center items-center bg-login-bg  bg-cover">
      <div className="bg-white flex flex-col items-center  justify-center mx-auto  rounded-xl p-8 px-16">
        <h1 className="text-xl mb-2">Create an account</h1>
        <Form action={signup} page="signup">
          <div className="flex flex-col justify-center text-left items-center w-full max-w-[400px]">
            <label htmlFor="firstname">First name</label>
            <input
              name="firstname"
              id="firstname"
              minLength={2}
              maxLength={32}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              // className="w-[60%] focus:p-2 transition-all duration-150"
            />
            <br />
            <label htmlFor="lastname">Last name</label>
            <input
              name="lastname"
              id="lastname"
              minLength={2}
              maxLength={32}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <label htmlFor="username">Username</label>
            <input
              name="username"
              id="username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <br />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <br />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <br />
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              name="confirm-password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <br />
          </div>
          <div className="flex justify-center gap-8">
            <button className="block mx-auto border-gray-400 border-opacity-50 border-2 rounded-xl p-2 px-8 hover:bg-gray-200 transition">
              Create Account
            </button>
            <Link
              href="/login"
              className="block mx-auto border-gray-400 border-opacity-50 border-2 rounded-xl p-2 px-8 hover:bg-gray-200 transition"
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
