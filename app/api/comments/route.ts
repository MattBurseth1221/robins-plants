import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  console.log("got to comment post");

  try {
    const formData = await request.formData();
    const comment_body = formData.get('comment_body');
    const user_id = formData.get('user_id');
    const post_id = formData.get('post_id');

    const newUUID = uuidv4();
    const values = [newUUID, comment_body, user_id, post_id];

    const query = {
      text: "INSERT INTO posts(comment_id, body, user_id, post_id) VALUES($1, $2, $3, $4)",
      values: values,
    };

    return NextResponse.json({ success: "Comment posted." });
  } catch (e) {
    console.log(e);

    return NextResponse.json({ error: e });
  }
}
