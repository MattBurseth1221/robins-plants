import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../_lib/db";
import { deleteFileFromS3, uploadFileToS3 } from "../../_lib/s3";
import { v4 as uuidv4 } from "uuid";

//export const runtime = "edge";

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

  const postQuery = `SELECT p.*, u.username FROM posts p LEFT JOIN auth_user u ON p.user_id = u.id ${whereQuery}ORDER BY ${sortQuery} ${orderParam} LIMIT ${limitParam}`;

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
    const user_id = formData.get("user_id");

    const files = formData.getAll("files") as File[];

    let fileName = "";

    //Upload images to S3
    for (let i = 0; i < files.length; i++) {
      fileName += (await uploadFileToS3(files[i], files[i].name)) + ";";
    }

    if (fileName === "") throw new Error();

    //Upload post info to database
    const newUUID = uuidv4();
    const values = [
      newUUID,
      postTitle,
      postBody,
      fileName.slice(0, -1),
      user_id,
    ];

    const query = {
      text: "INSERT INTO posts(post_id, title, body, image_ref, user_id) VALUES($1, $2, $3, $4, $5)",
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
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    //const deletePostFileName = searchParams.get("file_name");

    const files = (await request.json()).files;

    //if (!deletePostFileName) throw new Error("File name not found.");

    //Delete post
    const query = {
      text: `DELETE FROM posts WHERE post_id = '${id}'`,
    };

    const queryResult = await pool.query(query);

    //Delete photo from S3 bucket
    for (let i = 0; i < files.length; i++) {
      await deleteFileFromS3(files[i]);
    }

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

    const oldImageRefsString = formData.get("image_refs") as string;
    const oldImageRefs = oldImageRefsString!.split(',');
    
    //Get files from formData and filter out weird ghost file 
    let files = formData.getAll("files") as File[];
    files = files.filter((file) => file.type !== 'application/octet-stream');

    var query = "";

    await pool.query("BEGIN;");

    //If there was no file changes AKA photo is not changing, then we don't update image_ref
    if (files.length === 0) {
      console.log("got here?");
      query = `UPDATE posts SET title = '${title}', body = '${body}' WHERE post_id = '${id}'`;

      console.log(query);
    } else {
      //Go through all previous images in post and delete from S3
      oldImageRefs.forEach(async (ref) => {
        await deleteFileFromS3(ref);
      })

      //Upload images to S3
      let fileName = "";

      for (let i = 0; i < files.length; i++) {
        fileName += (await uploadFileToS3(files[i], files[i].name)) + ";";
      }

      if (fileName === "") throw new Error();

      console.log(fileName + " success");

      query = `UPDATE posts SET title = '${title}', body = '${body}', image_ref = '${fileName.slice(0, -1)}' WHERE post_id = '${id}'`;
    }

    await pool.query(query);

    await pool.query("COMMIT;");

    return NextResponse.json({ success: "Post updated successfully." });
  } catch (e) {
    await pool.query("ROLLBACK;");
    return NextResponse.json({ error: "Could not update post." });
  }
}
