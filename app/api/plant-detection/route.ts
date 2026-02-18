import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    console.log(formData);
    const newForm = new FormData();
    let newFiles = formData.getAll("files") as Blob[] | null;

    if (!newFiles) return NextResponse.json({ error: "No files found." })

    for (let i = 0; i < newFiles.length; i++) {
      console.log(newFiles[i]);
      newForm.append("images", newFiles[i]);
    }

    console.log(newForm);

    const plantDetectionResponse = await fetch(
      `https://my-api.plantnet.org/v2/identify/all?api-key=${process.env.PLANTNET_API_KEY}&include-related-images=true`,
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
