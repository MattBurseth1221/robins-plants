import Link from 'next/link';

import { pool } from '../_lib/db';
import { cookies } from 'next/headers';
import { lucia, validateRequest } from '../_lib/auth';
import { redirect } from 'next/navigation';
import { Form } from '../_components/Form';
import crypto from 'node:crypto';

import type { DatabaseUser } from '../_lib/db';
import type { ActionResult } from '../_components/Form';

export default async function Page() {
  const { user } = await validateRequest();
  if (user) {
    return redirect('/');
  }
  return (
    <div className="flex flex-col">
      <h1>Sign in</h1>
      <Form action={login}>
        <label htmlFor="username">Username</label>
        <input name="username" id="username" />
        <br />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <br />
        <button>Continue</button>
      </Form>
      <Link href="/signup">Create an account</Link>
    </div>
  );
}

function sha256(data: string): string {
    const hash = crypto.createHash("sha256");
    hash.update(data);
    return hash.digest("hex");
  }

async function login(_: any, formData: FormData): Promise<ActionResult> {
  'use server';

  //const db = await pool.connect();

  console.log(sha256('asdfasdf'));

  const username = formData.get('username');
  if (
    typeof username !== 'string' ||
    username.length < 3 ||
    username.length > 31 
    //||
    // !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      error: 'Invalid username',
    };
  }
  const password = formData.get('password');
  if (
    typeof password !== 'string' ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: 'Invalid password',
    };
  }

  const query = {
    text: 'SELECT * FROM auth_user WHERE username = $1',
    values: [username],
  }

  const existingUser = (await pool.query(query)).rows[0] as DatabaseUser | undefined;
  if (!existingUser) {
    return {
      error: 'Incorrect username or password',
    };
  }

  const validPassword = sha256(password) === existingUser.password_hash;

  console.log(sha256(password) + " " + existingUser.password_hash);
  if (!validPassword) {
    return {
      error: 'Incorrect username or password',
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect('/');
}
