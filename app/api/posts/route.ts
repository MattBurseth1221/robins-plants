import { NextResponse } from "next/server";
import { pool } from "../../_lib/db";
import { uploadFileToS3 } from "../upload/route"
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
  const limitParam = new URL(request.url).searchParams.get("limit");
  const sortParam = new URL(request.url).searchParams.get("sort");
  
  let sortQuery = "";
  let whereQuery = "";

  switch (sortParam) {
    case "sort_desc":
      sortQuery = "create_date DESC";
    case "sort_asc":
      sortQuery = "create_date ASC";
    default:
      sortQuery = "create_date DESC";
  }

  const postQuery = `SELECT * FROM posts ${whereQuery}ORDER BY ${sortQuery} LIMIT ${limitParam}`;
  const queryResult = (await pool.query(postQuery)).rows;

  return Response.json({ message: "Hello!", result: queryResult });
}

export async function POST(request: Request) {
    console.log('do we get here');

  try {
    const formData = await request.formData();
    const postTitle = formData.get("title");
    const postBody = formData.get("body");

    console.log(postTitle, postBody);

    const file = formData.get("file") as File;

    console.log('good');

    //upload image to S3
    const fileName = await uploadFileToS3(file, file.name);

    console.log(fileName + ' success');

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
