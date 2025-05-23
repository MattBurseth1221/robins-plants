import { NextRequest, NextResponse } from "next/server";
import { UUID } from "crypto";
import { pool } from "@/app/_lib/db";
import { createTempPassword } from "@/app/_utils/helper-functions";
import { v4 as uuidv4 } from "uuid";

//export const runtime = "edge";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");

  if (!username)
    return NextResponse.json({ error: "No username supplied to API." });

  try {
    const fetchedUser = await pool.query(
      `SELECT * FROM auth_user WHERE username = '${username}'`
    );
    delete fetchedUser.rows[0]["password_hash"];
    delete fetchedUser.rows[0]["email"];

    return NextResponse.json({
      success: "Fetched user by username.",
      data: fetchedUser.rows[0],
    });
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}

export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action");

  if (action === "update-profile") {
    console.log("got here aasdfa");
    const formData = await request.formData();

    try {
      const updateProfileQuery = `UPDATE auth_user SET first_name = '${formData.get(
        "firstname"
      )}', last_name = '${formData.get("lastname")}' WHERE id = '${formData.get(
        "user_id"
      )}'`;

      await pool.query("BEGIN;");

      await pool.query(updateProfileQuery);

      await pool.query("COMMIT;");
    } catch (e) {
      await pool.query("ROLLBACK;");
      console.log(e);
      return NextResponse.json({ error: e });
    } finally {
      return NextResponse.json({ success: "Updated profile info." });
    }
  }

  const body = await request.json();

  if (action === "reset-password-email") {
    const usernameValue = body.usernameValue;
    return resetPasswordEmail(usernameValue);
  }

  if (action === "reset-password") {
    const user_id = body.user_id;
    const newPasswordHash = body.newPasswordHash;
    return resetPassword(user_id, newPasswordHash);
  }

  return NextResponse.json({ success: "worked?" });
}

export async function DELETE(request: NextRequest) {
  console.log("trying to delete")

  try {
    const body = await request.json();
    const userId = body.user_id;

    console.log(userId);

    if (!userId) throw new Error("No user ID supplied");

    await pool.query("BEGIN;");

    //Delete user session before account
    await pool.query(`DELETE FROM user_session WHERE user_id = '${userId}'`)
    await pool.query(`DELETE FROM auth_user WHERE id = '${userId}'`);

    await pool.query("COMMIT;");

  } catch (e) {
    await pool.query("ROLLBACK;");

    return NextResponse.json({ error: e });
  }

  return NextResponse.json({ success: "User deleted successfully." });
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
  console.log("username value");
  console.log(usernameValue);

  const usernameQuery = `SELECT id, email, username FROM auth_user WHERE username = '${usernameValue}' OR email = '${usernameValue}'`;
  const queryResult = (await pool.query(usernameQuery)).rows;

  if (!queryResult || queryResult.length === 0) {
    return NextResponse.json({ error: "No user found" });
  }

  const emailAlreadySentQuery = `SELECT COUNT(*) FROM password_change_requests WHERE user_id = '${queryResult[0].id}'`;
  const emailAlreadySentResult = await pool.query(emailAlreadySentQuery);
  console.log(emailAlreadySentResult);
  if (emailAlreadySentResult.rows[0].count >= 1)
    return NextResponse.json({ error: "Email already sent" });

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
    username: queryResult[0].username,
    tempPasswordID: tempPassword.tempPassword,
  });
}
