import { SignedPostPolicyV4Output } from "@google-cloud/storage";
import { Storage } from "@google-cloud/storage";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  res: NextResponse<SignedPostPolicyV4Output | string>
) {
  const { body } = req;
  const fileName = req.nextUrl.searchParams.get("file");

//   if (method !== "POST") {
//     res.status(405).json("Method not allowed");
//     return;
//   }

console.log('here');
console.log(body);

  const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    credentials: {
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY,
    },
  });

  const bucket = storage.bucket(process.env.BUCKET_NAME!);
  const file = bucket.file(fileName as string);

  const options = {
    expires: Date.now() + 60 * 60 * 1000, //  60 minutes,
    fields: { "x-goog-meta-source": "nextjs-project" },
  };

  const [response] = await file.generateSignedPostPolicyV4(options);

  console.log('response');
  console.log(response);

  return NextResponse.json({response: response}, {status: 200});
}
