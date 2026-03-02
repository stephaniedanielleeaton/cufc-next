import { auth0 } from "@/lib/auth/auth0";
import { NextResponse } from "next/server";
import { getProfileForUser, createProfileForUser } from "@/lib/services/member/memberProfileService";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const auth0Id = session.user.sub as string;
  const profile = await getProfileForUser(auth0Id);

  return NextResponse.json({ profile });
}

export async function POST(req: Request) {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const auth0Id = session.user.sub as string;
  const body: {
    displayFirstName?: string;
    displayLastName?: string;
    personalInfo?: { email?: string };
    guardian?: { firstName?: string; lastName?: string };
  } = await req.json();

  const profile = await createProfileForUser(auth0Id, {
    displayFirstName: body.displayFirstName,
    displayLastName: body.displayLastName,
    personalInfo: body.personalInfo,
    guardian: body.guardian,
  });

  return NextResponse.json(profile, { status: 201 });
}
