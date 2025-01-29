import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const newForm = new FormData();
    let newFiles = formData.getAll("files");

    for (let i = 0; i < newFiles.length; i++) {
      console.log(newFiles[i]);
      newForm.append("images", newFiles[i]);
    }

    const plantDetectionResponse = await fetch(
      `https://my-api.plantnet.org/v2/identify/all?api-key=${process.env.PLANTNET_API_KEY}`,
      {
        method: "POST",
        body: newForm,
      }
    ).then((res) => res.json());

    console.log(plantDetectionResponse);

    return NextResponse.json({ success: plantDetectionResponse });
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}
