import { NextRequest, NextResponse } from "next/server";
import { UUID } from "crypto";
import { pool } from "@/app/_lib/db";
import { createTempPassword } from "@/app/_utils/helper-functions";
import { v4 as uuidv4 } from "uuid";

export async function PUT(request: NextRequest) {
  const searchParams = await request.nextUrl.searchParams;
  const action = searchParams.get("action");
  const usernameValue = (await request.json()).usernameValue;

  console.log(usernameValue);

  if (action === "reset-password") {
    return resetPassword(usernameValue);
  }

  return NextResponse.json({ success: "worked?" });
}

async function resetPassword(usernameValue: string) {
  const usernameQuery = `SELECT id FROM auth_user WHERE username = '${usernameValue}' OR email = '${usernameValue}'`;
  const queryResult = (await pool.query(usernameQuery)).rows;

  console.log(queryResult);

  if (queryResult.length === 0) {
    return NextResponse.json({ error: "No user found" });
  }

  const tempPassword = await createTempPassword();

  console.log(tempPassword);

  //Make entry in password_change_request table
  try {
    await pool.query("BEGIN;");

    const newUUID = uuidv4();

    const values = [tempPassword.hashedTempPassword, queryResult[0].id];
    const insertQuery = {
      text: `INSERT INTO password_change_requests(id, user_id) VALUES($1, $2)`,
      values: values,
    };

    await pool.query(insertQuery);

    await pool.query("COMMIT;");

  } catch (e) {
    await pool.query("ROLLBACK;");
    console.log(e);
    return NextResponse.json({ error: "something went wrong" });
  }

  return NextResponse.json({
    success: "User found",
    user_id: queryResult[0].id,
  });
}
