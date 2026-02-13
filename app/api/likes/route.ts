import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/app/_lib/db";
import { v4 as uuidv4 } from "uuid";

//export const runtime = "edge";

//Creates a like in DB based on passed search parameters (expects a post_id and user_id)
//Also updates total_likes count for the post in question
export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const post_id = searchParams.get("post_id");
  const user_id = searchParams.get("user_id");

  try {
    await pool.query("BEGIN");
    const values = [post_id, user_id, uuidv4()];
    const query = {
      text: `INSERT INTO likes(parent_id, user_id, like_id) VALUES($1, $2, $3);`,
      values: values,
    };

    await pool.query(query);

    const updateQuery = `UPDATE posts SET total_likes = total_likes + 1 WHERE post_id = '${post_id}'`;

    await pool.query(updateQuery);
    await pool.query("COMMIT");

    return NextResponse.json({ success: "Like received." });
  } catch (e) {
    await pool.query("ROLLBACK");

    return NextResponse.json({ error: e });
  }
}

//Deletes a like record and decrements total_likes for respective post
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const parent_id = searchParams.get("parent_id");
  const user_id = searchParams.get("user_id");

  try {
    await pool.query("BEGIN");

    const query = `DELETE FROM likes WHERE parent_id = '${parent_id}' AND user_id = '${user_id}'`;
    await pool.query(query);

    const updateQuery = `UPDATE posts SET total_likes = total_likes - 1 WHERE post_id = '${parent_id}'`;
    await pool.query(updateQuery);

    await pool.query("COMMIT");

    return NextResponse.json({ success: "Deleted like." });
  } catch (e) {
    await pool.query("ROLLBACK");

    return NextResponse.json({ error: e });
  }
}

//Retrieves all liked posts/comments for a given user, expects search parameter "user_id"
//DOES NOT retrieve actual posts/comments, only a list of post_id's
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const user_id = searchParams.get("user_id");

  try {
    const query = `SELECT DISTINCT p.* FROM likes l LEFT JOIN posts p on l.parent_id = p.post_id WHERE l.user_id = '${user_id}'`;

    const likedItemsResponse = (await pool.query(query)).rows;

    return NextResponse.json({
      success: "Retrieved users liked items.",
      data: likedItemsResponse,
    });
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}
