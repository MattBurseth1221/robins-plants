import { NextResponse } from "next/server";
import { pool } from "../../_lib/db";
import { uploadFileToS3 } from "../upload/route"
import { v4 as uuidv4 } from 'uuid';
import { NextApiRequest } from "next";

export async function GET(request: Request) {
  const limitParam = new URL(request.url).searchParams.get("limit");
  const sortParam = new URL(request.url).searchParams.get("sortType");
  const orderParam = new URL(request.url).searchParams.get("order");
  
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

//FIX REQUEST TYPE
export async function DELETE(request: any) {
  console.log('do we get to the delete');

  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    const query = {
      text: `DELETE FROM posts WHERE post_id = '${id}'`
    };

  const queryResult = await pool.query(query);

  console.log('query result');
  console.log(queryResult);

    return NextResponse.json({ success: "Post was deleted." });
  } catch (e) {
    return NextResponse.json({ error: "Could not delete post." });
  }
}

export async function PUT(request: )
