import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../_lib/db";
import { uploadFileToS3 } from "../upload/route";
import { v4 as uuidv4 } from "uuid";
import { NextApiRequest } from "next";
import { UUID } from "crypto";

export async function GET(request: NextRequest) {
  const limitParam = request.nextUrl.searchParams.get("limit");
  const sortParam = request.nextUrl.searchParams.get("sortType");
  const orderParam = request.nextUrl.searchParams.get("order");

  let sortQuery = "";
  let whereQuery = "";

  switch (String(sortParam)) {
    case "body":
      sortQuery = "body";
      break;
    case "title":
      sortQuery = "title";
      break;
    default:
      sortQuery = "create_date";
      break;
  }

  const postQuery = `SELECT * FROM posts ${whereQuery}ORDER BY ${sortQuery} ${orderParam} LIMIT ${limitParam}`;

  console.log(postQuery);

  const queryResult = (await pool.query(postQuery)).rows;

  console.log('trying for comments');
  //Get all comments for each post?
  for (let i = 0; i < queryResult.length; i++) {
    // const postComments = await fetch(`/comments`, {
    //   method: "GET",
    // })
    // .then((res) => res.json())
    // .then((res) => res.data);
    const post_id = queryResult[i].post_id;

    const commentQuery = `select c.*, u.username
    from comments c
    left join auth_user u 
    on c.user_id = u.id
    where c.post_id = '${post_id}'
    order by c.create_date DESC`;

  const postComments = (await pool.query(commentQuery)).rows;

  //console.log(postComments);

    queryResult[i].comments = postComments;
  }

  console.log("check here");
  console.log(queryResult);

  return Response.json({ message: "Hello!", result: queryResult });
}

export async function POST(request: Request) {
  console.log("do we get here");

  try {
    const formData = await request.formData();
    const postTitle = formData.get("title");
    const postBody = formData.get("body");

    const file = formData.get("file") as File;

    console.log("type " + file.type);

    //upload image to S3
    const fileName = await uploadFileToS3(file, file.name);

    //upload post info to database
    const newUUID = uuidv4();
    const values = [newUUID, postTitle, postBody, fileName];

    const query = {
      text: "INSERT INTO posts(post_id, title, body, image_ref) VALUES($1, $2, $3, $4)",
      values: values,
    };

    const queryResult = await pool.query(query);

    return NextResponse.json({ success: "Post created.", fileName: fileName });
  } catch (e) {
    return NextResponse.json({ error: "Post was not created." });
  }
}

export async function DELETE(request: NextRequest) {
  console.log("got to delete");

  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    //Delete post
    const query = {
      text: `DELETE FROM posts WHERE post_id = '${id}'`,
    };

    const queryResult = await pool.query(query);

    console.log("query result");
    console.log(queryResult);

    //Delete comments
    const deleteCommentQuery = {
      text: `DELETE FROM comments WHERE post_id = '${id}'`,
    }

    const deleteCommentsResult = await pool.query(deleteCommentQuery);

    return NextResponse.json({ success: "Post was deleted." });
  } catch (e) {
    return NextResponse.json({ error: "Could not delete post." });
  }
}

export async function PUT(request: NextRequest) {
  console.log("got to update");

  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    const formData = await request.formData();
    const title = formData.get("title");
    const body = formData.get("body");
    const file = formData.get("file") as File;

    console.log(title + " " + body);

    var query = "";

    if (file.size === 0) {
      query = `UPDATE posts SET title = '${title}', body = '${body}' WHERE post_id = '${id}'`;

      console.log(query);
    } else {
      //upload image to S3
      const fileName = await uploadFileToS3(file, file.name);

      console.log(fileName + " success");

      query = `UPDATE posts SET title = '${title}', body = '${body}', image_ref = '${fileName}' WHERE post_id = '${id}'`;
    }

    console.log("here????");

    const queryResult = (await pool.query(query)).rows;

    console.log(queryResult);

    return NextResponse.json({ success: "Post updated successfully." });
  } catch (e) {
    return NextResponse.json({ error: "Could not update post." });
  }
}
