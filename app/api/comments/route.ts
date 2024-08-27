import { sql } from "@/app/_lib/db";
import { UUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

//export const runtime = "edge";

export async function POST(request: NextRequest) {
  console.log("got to comment post");

  try {
    const formData = await request.formData();
    const comment_body = formData.get("comment_body");
    const user_id = formData.get("user_id") as UUID;
    const post_id = formData.get("post_id") as UUID;

    console.log(user_id);
    console.log(post_id);

    const newUUID = uuidv4();
    const values = [newUUID, comment_body, user_id, post_id];

    const query = {
      text: "INSERT INTO comments(comment_id, body, user_id, post_id) VALUES($1, $2, $3, $4)",
      values: values,
    };

    await sql`INSERT INTO comments(comment_id, body, user_id, post_id) VALUES($1, $2, $3, $4)`, values;

    const resultingComment = (await sql
      `SELECT * FROM comments WHERE comment_id = ${newUUID}`
    );

    console.log(resultingComment);

    return NextResponse.json({ success: "Comment posted.", resultingComment: resultingComment });
  } catch (e) {
    console.log(e);

    return NextResponse.json({ error: e });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await sql`BEGIN;`;
    const searchParams = request.nextUrl.searchParams;
    const commendId = searchParams.get("id");
    
    await sql`DELETE FROM comments WHERE comment_id = '${commendId}'`;

    await sql`COMMIT;`;

    return NextResponse.json({ success: "Comment successfully deleted" });
  } catch(e) {
    await sql`ROLLBACK;`;
    return NextResponse.json({ error: e });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const commentId = searchParams.get("id");
    const body = await request.formData();
    const newCommentBody = body.get("comment-body") as string;

    const newComment = {
      body: newCommentBody,
      been_edited: true,
    }

    await sql`BEGIN;`;

    await sql`UPDATE comments SET ${sql(newComment, 'body', 'been_edited')} WHERE comment_id = '${commentId}'`;

    await sql`COMMIT;`;

    return NextResponse.json({ success: "Comment edited successfully" });
  } catch(e) {
    return NextResponse.json({ error: e });
  }
}

export async function GET(request: NextRequest) {
  console.log("Fetching comments");

  return NextResponse.json({ data: ['test comment'] });

  try {
    const searchParams = request.nextUrl.searchParams;
    const post_id = searchParams.get("id");

    const postComments = await sql`select c.*
      from comments c
      where c.post_id = '${post_id}'
      order by c.create_date DESC`;

    //console.log(postComments);

    return NextResponse.json({
      success: "Comments retrieved.",
      data: postComments,
    });
  } catch (e) {
    return NextResponse.json({ error: e, data: [] });
  }
}
