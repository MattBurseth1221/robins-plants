import { pool } from "@/app/_lib/db";
import { UUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

//export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const comment_body = formData.get("comment_body");
    const user_id = formData.get("user_id") as UUID;
    const post_id = formData.get("post_id") as UUID;

    const newUUID = uuidv4();
    const values = [newUUID, comment_body, user_id, post_id];

    const query = {
      text: "INSERT INTO comments(comment_id, body, user_id, post_id) VALUES($1, $2, $3, $4)",
      values: values,
    };

    await pool.query(query);

    const resultingComment = (
      await pool.query({
        text: `SELECT * FROM comments WHERE comment_id = $1`,
        values: [newUUID],
      })
    ).rows;

    console.log(resultingComment);

    return NextResponse.json({
      success: "Comment posted.",
      resultingComment: resultingComment[0],
    });
  } catch (e) {
    console.log(e);

    return NextResponse.json({ error: e });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await pool.query("BEGIN;");
    const searchParams = request.nextUrl.searchParams;
    const commendId = searchParams.get("id");

    const deleteCommentQuery = {
      text: `DELETE FROM comments WHERE comment_id = $1`,
      values: [commendId],
    };
    await pool.query(deleteCommentQuery);

    await pool.query("COMMIT;");

    return NextResponse.json({ success: "Comment successfully deleted" });
  } catch (e) {
    await pool.query("ROLLBACK;");
    return NextResponse.json({ error: e });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const commentId = searchParams.get("id");
    const body = await request.formData();
    const newCommentBody = body.get("comment-body");

    await pool.query("BEGIN;");

    const editCommentQuery = {
      text: `UPDATE comments SET body = $1, been_edited = 'true' WHERE comment_id = $2`,
      values: [newCommentBody, commentId],
    };
    await pool.query(editCommentQuery);

    await pool.query("COMMIT;");

    return NextResponse.json({ success: "Comment edited successfully" });
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}

//ATTENTION
//THIS IS WHERE YOU NEED TO GET COMMENTS BY POST ID
//THE RETURNED COMMENTS ARRAY WILL BE STORED IN STATE PER POST
//AND PASSED DOWN VIA PROPS TO POST COMPONENT
//THEN YOU CAN PASS SETCOMMENT DOWN AS WELL TO EDIT AND DELETE COMMENTS WITHOUT REFRESH
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const post_id = searchParams.get("post_id");
  const user_id = searchParams.get("user_id");

  let commentQuery = {text: "", values: [""]};

  if (post_id) {
    commentQuery = {
      text: `select c.*, u.username
      from comments c
      left join auth_user u 
      on c.user_id = u.id
      where c.post_id = $1
      order by c.create_date DESC`,
      values: [post_id],
    };
  } else if (user_id) {
    commentQuery = {
      text: `select c.*, u.username
      from comments c
      left join auth_user u 
      on c.user_id = u.id
      where c.user_id = '${user_id}'
      order by c.create_date DESC`,
      values: [user_id],
    };
  }

  try {
    const postComments = (await pool.query(commentQuery)).rows;

    return NextResponse.json({
      success: "Comments retrieved.",
      data: postComments,
    });
  } catch (e) {
    return NextResponse.json({ error: e, data: [] });
  }
}
