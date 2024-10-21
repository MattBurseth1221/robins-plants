import { pool } from "@/app/_lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const displayId = searchParams.get("display_id");

  try {
    const messagesResult = (
      await pool.query(
        `SELECT m.* FROM messages m, chats c WHERE m.chat_id = c.id AND c.display_id = '${displayId}'`
      )
    ).rows;

    return NextResponse.json({ success: messagesResult })
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}

export async function POST() {}
