import { lucia, validateRequest } from "@/app/_lib/auth";
import { cookies } from "next/headers";

//export const runtime = "edge";

export async function GET(request: Request, response: Response) {
  const { user, session } = await validateRequest();

  if (!session) {
    return Response.error();
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return Response.redirect(process.env.HOME_URL + "/login");
}
