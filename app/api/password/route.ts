import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../_lib/db";
import { generateRandomIdFromString } from "../../_utils/helper-functions";

//export const runtime = "edge";

export async function GET(request: NextRequest) {
  let isIDValid = true;
  let user_id;
  let idQueryResult;
  
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  console.log("got to the api.");

  try {
    if (!id) return;

    const hashedID = generateRandomIdFromString(id);

    console.log("finding user...");

    idQueryResult = (
      await pool.query(
        `SELECT * FROM password_change_requests WHERE id = '${hashedID}' ORDER BY create_date DESC LIMIT 1`
      )
    ).rows;

    console.log("id result:");

    if (!idQueryResult || idQueryResult.length === 0) isIDValid = false;

    console.log(idQueryResult);

    user_id = idQueryResult[0].user_id;
    const goodDate =
      idQueryResult[0].create_date.getTime() + 1 * 24 * 60 * 60 * 1000;

    if (new Date() > goodDate) isIDValid = false;

    console.log(isIDValid);

    return NextResponse.json({
      success: "Access valid password records",
      isIDValid: isIDValid,
      result: idQueryResult,
      user_id: user_id,
    });
  } catch (e) {
    return NextResponse.json({ error: e });
  } 
}
