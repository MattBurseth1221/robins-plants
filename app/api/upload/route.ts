import { NextRequest, NextResponse } from "next/server";

import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { Bucket, s3 } from "../../_lib/s3"

export const runtime = "edge";

// endpoint to get the list of files in the bucket
export async function GET() {
  try {
    const response = await s3.send(new ListObjectsCommand({ Bucket }));
    return NextResponse.json(response?.Contents ?? []);
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}

// endpoint to upload a file to the bucket
export async function POST(request: NextRequest) {
  console.log("do we actually get here");

  try {
    console.log("got here");
    const file = (await request.formData()).get("file") as File;

    console.log("got here");

    if (!file) {
      console.log("no file");
      return;
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    //const fileName = await uploadFileToS3(buffer, file.name);

    //return NextResponse.json({ success: "Good upload", fileName: fileName });
  } catch (e) {
    NextResponse.json({ error: "Bad upload" });
  }
}
