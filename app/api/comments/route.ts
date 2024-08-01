import { NextRequest, NextResponse } from "next/server";

export function POST(request: NextRequest) {
  console.log("got to comment post");

  try {
    

    return NextResponse.json({ success: "Comment posted." });
  } catch (e) {
    console.log(e);

    return NextResponse.json({ error: e });
  }
}
