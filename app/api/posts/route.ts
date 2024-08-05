import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../_lib/db";
import { deleteFileFromS3, uploadFileToS3 } from "../upload/route";
import { v4 as uuidv4 } from "uuid";

//Retrieves all posts given parameters from DB
export async function GET(request: NextRequest) {
  const limitParam = request.nextUrl.searchParams.get("limit");
  const sortParam = request.nextUrl.searchParams.get("sortType");
  const orderParam = request.nextUrl.searchParams.get("order");

  let sortQuery = "";
  let whereQuery = "";

  //Parse through search params for query params
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

  const queryResult = (await pool.query(postQuery)).rows;

  //Iterate through each post, get all comments for each
  for (let i = 0; i < queryResult.length; i++) {
    const post_id = queryResult[i].post_id;

    const commentQuery = `select c.*, u.username
    from comments c
    left join auth_user u 
    on c.user_id = u.id
    where c.post_id = '${post_id}'
    order by c.create_date DESC`;

    const postComments = (await pool.query(commentQuery)).rows;

    queryResult[i].comments = postComments;
  }

  return Response.json({ message: "Hello!", result: queryResult });
}

//Creates a post with passed FormData
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const postTitle = formData.get("title");
    const postBody = formData.get("body");

    const file = formData.get("file") as File;

    //Upload image to S3
    const fileName = await uploadFileToS3(file, file.name);

    //Upload post info to database
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

//Deletes a post based on passed search parameters (expects post_id)
export async function DELETE(request: NextRequest) {
  console.log("got to delete");

  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const deletePostFileName = searchParams.get("file_name");

    if (!deletePostFileName) throw new Error("File name not found.");

    //Delete post
    const query = {
      text: `DELETE FROM posts WHERE post_id = '${id}'`,
    };

    const queryResult = await pool.query(query);

    //Delete photo from S3 bucket
    await deleteFileFromS3(deletePostFileName)

    return NextResponse.json({ success: "Post was deleted." });
  } catch (e) {
    return NextResponse.json({ error: "Could not delete post." });
  }
}

//Edits a post based on passed FormData
export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    const formData = await request.formData();
    const title = formData.get("title");
    const body = formData.get("body");
    const file = formData.get("file") as File;

    var query = "";

    //If there was no file changes AKA photo is not changing, then we don't update image_ref
    if (file.size === 0) {
      query = `UPDATE posts SET title = '${title}', body = '${body}' WHERE post_id = '${id}'`;

      console.log(query);
    } else {
      //upload image to S3
      const fileName = await uploadFileToS3(file, file.name);

      console.log(fileName + " success");

      query = `UPDATE posts SET title = '${title}', body = '${body}', image_ref = '${fileName}' WHERE post_id = '${id}'`;
    }

    await pool.query(query);

    return NextResponse.json({ success: "Post updated successfully." });
  } catch (e) {
    return NextResponse.json({ error: "Could not update post." });
  }
}
