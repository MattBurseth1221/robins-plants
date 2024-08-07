import { NextRequest, NextResponse } from "next/server";
import { UUID } from "crypto";

export async function PUT(request: NextRequest) {
    const searchParams = await request.nextUrl.searchParams;
    const action = searchParams.get("action");
    const usernameValue = (await request.json()).usernameValue;

    console.log(usernameValue);

    if (action === "reset-password") {
        //return resetPassword();
    }

    return NextResponse.json({ success: "worked?" });
}
 
async function resetPassword(usernameValue: string, hashedTempPassword: string) {

}