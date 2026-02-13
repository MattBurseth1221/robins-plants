import { pool } from "@/app/_lib/db";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

//Get chat information?
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const displayId = searchParams.get("display_id") as string;

  try {
    const chatResult = (
      await pool.query({
        text: `SELECT * FROM chats WHERE display_id = $1`,
        values: [displayId]
      })
    ).rows;

    return NextResponse.json({ success: chatResult });
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const displayId = searchParams.get("display_id");
  const newUUID = uuidv4();

  try {
    pool.query("BEGIN;");

    const values = [newUUID, displayId, "", "New Chat"];

    const query = {
      text: "INSERT INTO chats(id, display_id, chat_users, chat_name) VALUES($1, $2, $3, $4)",
      values: values,
    };

    const newChatResult = await pool.query(query);

    pool.query("COMMIT;");

    return NextResponse.json({ success: newChatResult });
  } catch (e) {
    pool.query("ROLLBACK;");
    return NextResponse.json({ error: e });
  }
}
