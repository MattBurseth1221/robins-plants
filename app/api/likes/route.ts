import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/app/_lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const post_id = searchParams.get("post_id");
  const user_id = searchParams.get("user_id");

  const values = [post_id, user_id, uuidv4()];
  const query = {
    text: `INSERT INTO likes(parent_id, user_id, like_id) VALUES($1, $2, $3)`,
    values: values,
  };

  const addLikeResult = (await pool.query(query)).rows;

  console.log(addLikeResult);

  try {
    return NextResponse.json({ success: "Like received." });
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const parent_id = searchParams.get("parent_id");
  const user_id = searchParams.get("user_id");

  try {
    const query = `DELETE FROM likes WHERE parent_id = '${parent_id}' AND user_id = '${user_id}'`;

    const deleteLikeResult = (await pool.query(query)).rows;

    return NextResponse.json({ success: "Deleted like." });
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}
