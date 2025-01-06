import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../../_lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userID: string }>}) {
  const { userID } = (await params);

  if (!userID) throw new Error("No user id provided.");

  try {
    const results = (await pool.query(`SELECT * FROM posts WHERE user_id = '${userID}'`)).rows;

    return NextResponse.json({ success: "Successfully retrieved posts", data: results })
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}
