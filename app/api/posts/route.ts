import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../_lib/db";
import { uploadFileToS3 } from "../upload/route";
import { v4 as uuidv4 } from "uuid";
import { NextApiRequest } from "next";

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

//FIX REQUEST TYPE
export async function DELETE(request: NextRequest) {
  console.log("got to delete");

  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    const query = {
      text: `DELETE FROM posts WHERE post_id = '${id}'`,
    };

    const queryResult = await pool.query(query);

    console.log("query result");
    console.log(queryResult);

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
