import { NextRequest, NextResponse } from "next/server";
import { UUID } from "crypto";
import { pool } from "@/app/_lib/db";
import { createTempPassword } from "@/app/_utils/helper-functions";
import { v4 as uuidv4 } from "uuid";

export async function PUT(request: NextRequest) {
  const searchParams = await request.nextUrl.searchParams;
  const action = searchParams.get("action");
  const body = await request.json();
  const usernameValue = body.usernameValue;

  console.log(usernameValue);

  if (action === "reset-password-email") {
    return resetPasswordEmail(usernameValue);
  }

  if (action === "reset-password") {
    const user_id = body.user_id;
    const newPasswordHash = body.newPasswordHash;
    return resetPassword(user_id, newPasswordHash);
  }

  return NextResponse.json({ success: "worked?" });
}

async function resetPassword(user_id: UUID, newPasswordHash: string) {
  try {
    await pool.query("BEGIN;");

    //Update password to new hash value
    const passwordChangeQuery = `UPDATE auth_user SET password_hash = '${newPasswordHash}' WHERE id = '${user_id}'`;
    await pool.query(passwordChangeQuery);

    //Remove password request from DB
    const deleteRequestQuery = `DELETE FROM password_change_requests WHERE user_id = '${user_id}'`;
    await pool.query(deleteRequestQuery);

    await pool.query("COMMIT;");

    return NextResponse.json({ success: "Password changed successfully" });
  } catch (e) {
    await pool.query("ROLLBACK;");
    console.log(e);
    return NextResponse.json({ error: e });
  }
}

async function resetPasswordEmail(usernameValue: string) {
  const usernameQuery = `SELECT id, email FROM auth_user WHERE username = '${usernameValue}' OR email = '${usernameValue}'`;
  const queryResult = (await pool.query(usernameQuery)).rows;

  if (!queryResult || queryResult.length === 0) {
    return NextResponse.json({ error: "No user found" });
  }

  const emailAlreadySentQuery = `SELECT COUNT(*) FROM password_change_requests WHERE user_id = '${queryResult[0].id}'`;
  const emailAlreadySentResult = await pool.query(emailAlreadySentQuery);
  console.log(emailAlreadySentResult);
  if (emailAlreadySentResult.rows[0].count >= 1) return NextResponse.json({ error: "Email already sent" });

  const tempPassword = await createTempPassword();

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
    email: queryResult[0].email,
    tempPasswordID: tempPassword.tempPassword,
  });
}
