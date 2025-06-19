import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Redirect to Auth0 login page
    return NextResponse.redirect(new URL(
      "https://" + process.env.AUTH0_DOMAIN + "/authorize?" +
      "response_type=code&" +
      "client_id=" + process.env.AUTH0_CLIENT_ID + "&" +
      "redirect_uri=" + process.env.APP_BASE_URL + "/auth/callback&" +
      "scope=" + process.env.AUTH0_SCOPE
    ));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
