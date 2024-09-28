import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../../_lib/db";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userID = searchParams.get("userID");

  console.log("made it here");

  if (!userID) throw new Error("No user id provided.");

  try {
    const results = (await pool.query(`SELECT * FROM posts WHERE user_id = '${userID}'`)).rows;

    return NextResponse.json({ success: "Successfully retrieved posts", data: results })
  } catch (e) {
    NextResponse.json({ error: e });
  }
}
