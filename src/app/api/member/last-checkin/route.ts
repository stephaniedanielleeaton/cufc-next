import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth/auth0";
import { dbConnect } from "@/lib/mongoose";
import { Attendance } from "@/lib/models/Attendance";
import { MemberProfile } from "@/lib/models/MemberProfile";

async function getMemberProfileByAuth0Id(auth0Id: string) {
  return MemberProfile.findOne({ auth0Id });
}

async function getLastAttendanceByMemberId(memberId: string) {
  return Attendance.findOne({ userId: memberId })
    .sort({ timestamp: -1 })
    .lean();
}

export async function GET() {
  try {
    await dbConnect();
    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const auth0Id = session.user.sub;
    const memberProfile = await getMemberProfileByAuth0Id(auth0Id);
    if (!memberProfile) {
      return NextResponse.json({ lastCheckIn: null });
    }

    const lastCheckIn = await getLastAttendanceByMemberId(memberProfile._id.toString());
    if (!lastCheckIn) {
      return NextResponse.json({ lastCheckIn: null });
    }

    return NextResponse.json({
      lastCheckIn: {
        timestamp: lastCheckIn.timestamp
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

