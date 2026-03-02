import { auth0 } from "@/lib/auth/auth0";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import {
  getLinkedProfilesForUser,
  createManagedProfile,
} from "@/lib/services/member/userProfileLinkService";
import type { ProfileRelationship } from "@/lib/models/UserProfileLink";

export async function GET() {
  const session = await auth0.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const auth0Id = session.user.sub as string;
  const profiles = await getLinkedProfilesForUser(auth0Id);
  const primaryProfileId = profiles[0]?._id ?? null;

  return NextResponse.json({ profiles, primaryProfileId });
}

export async function POST(req: Request) {
  const session = await auth0.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const auth0Id = session.user.sub as string;
  const body: {
    relationship: ProfileRelationship;
    displayFirstName?: string;
    displayLastName?: string;
    personalInfo?: { email?: string };
  } = await req.json();

  if (!body.relationship) {
    return NextResponse.json({ error: "relationship is required" }, { status: 400 });
  }

  const profile = await createManagedProfile(auth0Id, body.relationship, {
    displayFirstName: body.displayFirstName,
    displayLastName: body.displayLastName,
    personalInfo: body.personalInfo,
  });

  return NextResponse.json(profile, { status: 201 });
}
