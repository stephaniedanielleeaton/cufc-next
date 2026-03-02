import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth/auth0";
import { dbConnect } from "@/lib/mongoose";
import { Attendance } from "@/lib/models/Attendance";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const memberProfileId = request.nextUrl.searchParams.get("memberProfileId");
    if (!memberProfileId) {
      return NextResponse.json({ lastCheckIn: null });
    }

    const lastCheckIn = await Attendance.findOne({ userId: memberProfileId })
      .sort({ timestamp: -1 })
      .lean();

    if (!lastCheckIn) {
      return NextResponse.json({ lastCheckIn: null });
    }

    return NextResponse.json({ lastCheckIn: { timestamp: lastCheckIn.timestamp } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
