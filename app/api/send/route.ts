import ResetPasswordEmail from "@/app/_components/ResetPasswordEmail";
import { createTempPassword } from "@/app/_utils/helper-functions";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);
//export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    // const { tempPassword, hashedTempPassword } = await createTempPassword();
    const body = await request.json();
    const tempPasswordID = body.tempPasswordID;
    const email = body.email;

    console.log("email");
    console.log(email);
    console.log("pasword");
    console.log(tempPasswordID);

    if (!tempPasswordID || !email) return NextResponse.json({ error: "Missing data" });

    const { data, error } = await resend.emails.send({
      from: "Robins-Plants <donotreply@mattburseth.com>",
      to: [email],
      subject: "Password Reset",
      react: ResetPasswordEmail({ firstName: "Matt", tempPasswordID: tempPasswordID }),
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
