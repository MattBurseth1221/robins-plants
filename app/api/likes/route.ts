import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/app/_lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const post_id = searchParams.get("post_id");
  const user_id = searchParams.get("user_id");

  try {
    await pool.query('BEGIN');
    const values = [post_id, user_id, uuidv4()];
    const query = {
      text: `INSERT INTO likes(parent_id, user_id, like_id) VALUES($1, $2, $3);`,
      values: values,
    };

    await pool.query(query);

    const updateQuery = `UPDATE posts SET total_likes = total_likes + 1 WHERE post_id = '${post_id}'`;

    await pool.query(updateQuery);
    await pool.query('COMMIT');

    return NextResponse.json({ success: "Like received." });
  } catch (e) {
    await pool.query('ROLLBACK');

    return NextResponse.json({ error: e });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const parent_id = searchParams.get("parent_id");
  const user_id = searchParams.get("user_id");

  try {
    await pool.query('BEGIN');

    const query = `DELETE FROM likes WHERE parent_id = '${parent_id}' AND user_id = '${user_id}'`;
    await pool.query(query);

    const updateQuery = `UPDATE posts SET total_likes = total_likes - 1 WHERE post_id = '${parent_id}'`;
    await pool.query(updateQuery);

    await pool.query('COMMIT');

    return NextResponse.json({ success: "Deleted like." });
  } catch (e) {
    await pool.query('ROLLBACK');

    return NextResponse.json({ error: e });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const user_id = searchParams.get("user_id");

  try {
    const query = `SELECT parent_id FROM likes WHERE user_id = '${user_id}'`;

    const likedItemsResponse = (await pool.query(query)).rows;
    let likedItems = [];

    for (let i = 0; i < likedItemsResponse.length; i++) {
      likedItems.push(likedItemsResponse[i].parent_id);
    }

    console.log(likedItems);

    return NextResponse.json({
      success: "Retrieved users liked items.",
      data: likedItems,
    });
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}
