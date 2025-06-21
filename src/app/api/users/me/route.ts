// app/api/users/me/route.ts

import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { dbConnect } from "@/lib/mongoose";
import { findOrCreateUser } from "@/lib/services/userService";
import { findOrCreateMemberProfile } from "@/lib/services/memberProfileService";

export async function GET() {
  await dbConnect();
  const session = await auth0.getSession();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await findOrCreateUser(session.user);
  const profile = await findOrCreateMemberProfile(session.user);

  return NextResponse.json({ user, profile });
}
