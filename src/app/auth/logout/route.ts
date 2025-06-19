import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    return await auth0.logout();
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
