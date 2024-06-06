import { NextRequest, NextResponse } from "next/server";

import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const Bucket = process.env.AMPLIFY_BUCKET;
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

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

export async function uploadFileToS3(file: File, fileName: string) {
  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    //const fileBuffer = file;
    const actualFileName = `${fileName}-${Date.now()}`;

    const params = {
      Bucket: process.env.AMPLIFY_BUCKET,
      Key: actualFileName,
      Body: fileBuffer,
      ContentType: "image/jpg",
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);
    return actualFileName;
  } catch (e) {
    return e;
  }
}
