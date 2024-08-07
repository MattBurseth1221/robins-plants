import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../_lib/db";
import { sha256 } from "../../_utils/helper-functions";

export async function GET(request: NextRequest) {
  let isIDValid = true;
  let user_id;

  try {
    const searchParams = await request.nextUrl.searchParams;
    const id = searchParams.get("id");

    const hashedID = await sha256(!id ? "" : id);

    console.log("finding user...");

    const idQueryResult = (
      await pool.query(
        `SELECT * FROM password_change_requests WHERE id = '${hashedID}' ORDER BY create_date DESC LIMIT 1`
      )
    ).rows;

    if (!idQueryResult || idQueryResult.length === 0) isIDValid = false;

    user_id = idQueryResult[0].user_id;
    const goodDate =
      idQueryResult[0].create_date.getTime() + 1 * 24 * 60 * 60 * 1000;

    if (new Date() > goodDate) isIDValid = false;
  } catch (e) {
    return NextResponse.json({ error: e });
  } finally {
    return NextResponse.json({
      success: "Access valid password records",
      isIDValid: isIDValid,
      user_id: user_id,
    });
  }
}
