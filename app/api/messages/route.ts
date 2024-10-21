import { pool } from "@/app/_lib/db";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const displayId = searchParams.get("display_id");

  try {
    const messagesResult = (
      await pool.query(
        `SELECT m.* FROM messages m, chats c WHERE m.display_chat_id = c.display_id AND c.display_id = '${displayId}' order by m.create_date asc`
      )
    ).rows;

    return NextResponse.json({ success: messagesResult });
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const displayId = searchParams.get("display_id") as string;
  console.log(displayId);

  try {
    const body = await req.json();
    console.log(typeof body);

    pool.query("BEGIN;");

    const values = [uuidv4(), displayId, body];
    const query = {
      text: `INSERT INTO messages(id, display_chat_id, message_data) VALUES($1, $2, $3)`,
      values: values,
    };

    const messageResult = await pool.query(query);

    pool.query("COMMIT;");

    return NextResponse.json({ success: messageResult });
  } catch (e) {
    pool.query("ROLLBACK;");
    return NextResponse.json({ error: e });
  }
}
