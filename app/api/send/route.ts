import ResetPasswordEmail from "@/app/_components/ResetPasswordEmail";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { jsx } from 'react/jsx-runtime'

const resend = new Resend("re_HsX7qMNm_PoDHPThyrnkqtrpVTTSLMj3h");
//export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    // const { tempPassword, hashedTempPassword } = await createTempPassword();
    const body = await request.json();
    const tempPasswordID = body.tempPasswordID;
    const email = body.email;
    const usernameValue = body.usernameValue;

    if (!tempPasswordID || !email) return NextResponse.json({ error: "Missing data" });

    const { data, error } = await resend.emails.send({
      from: "Robin-Plants <donotreply@robinplants.com>",
      to: [email],
      subject: "Password Reset",
      react: jsx(ResetPasswordEmail, {firstName: usernameValue, tempPasswordID: tempPasswordID}),
    });

    if (error) {
      return NextResponse.json({ error: error });
    } else {
      return NextResponse.json({
        success: "Email successfully sent.",
        data: data,
      });
    }
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}
