import { auth0 } from "@/lib/auth/auth0";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { token } = await auth0.getAccessToken();

    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );

    return NextResponse.json({
      roles: payload["https://cufc.app/roles"] || [],
      payload,
    });
  } catch (err) {
    console.error("Error getting token", err);
    return NextResponse.json({ error: "Could not get token" }, { status: 500 });
  }
}
