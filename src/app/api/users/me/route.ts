import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { findOrCreateUser } from "@/lib/services/userService";

export async function GET() {
  const session = await auth0.getSession();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await findOrCreateUser(session.user);
  return NextResponse.json(dbUser);
}
