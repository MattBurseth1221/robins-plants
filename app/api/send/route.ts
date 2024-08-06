import ResetPasswordEmail from "@/app/_components/ResetPasswordEmail";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: "Robins-Plants <donotreply@mattburseth.com>",
      to: ["delivered@resend.dev"],
      subject: "First Email",
      react: ResetPasswordEmail({ firstName: "Matt" }),
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
