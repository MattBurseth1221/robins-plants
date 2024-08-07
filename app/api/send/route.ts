import ResetPasswordEmail from "@/app/_components/ResetPasswordEmail";
import { createTempPassword } from "@/app/_utils/helper-functions";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

export async function POST() {
  try {
    const { tempPassword, hashedTempPassword } = await createTempPassword();

    

    const { data, error } = await resend.emails.send({
      from: "Robins-Plants <donotreply@mattburseth.com>",
      to: ["mattburseth1@gmail.com"],
      subject: "First Email",
      react: ResetPasswordEmail({ firstName: "Matt", tempPassword: tempPassword }),
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
