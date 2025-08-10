import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { Attendance } from "@/lib/models/Attendance";
import { MemberProfile } from "@/lib/models/MemberProfile";

import { requireRole } from "@/lib/auth/requireRole";

// Returns a list of all member IDs with their most recent attendance check-in timestamp.

export async function GET() {
  const roleResult = await requireRole("club-admin");
  if (roleResult?.error) {
    return NextResponse.json({ error: roleResult.error }, { status: roleResult.status });
  }

  try {
    await dbConnect();
    const members = await MemberProfile.find({}, { _id: 1 }).lean();
    const memberIds = members.map((m: any) => m._id.toString());

    const attendanceByMember = await Attendance.aggregate([
      { $match: { userId: { $in: memberIds } } },
      { $sort: { timestamp: -1 } },
      { $group: { _id: "$userId", mostRecent: { $first: "$timestamp" } } },
    ]);

    const attendanceMap: Record<string, string> = {};
    attendanceByMember.forEach((a: any) => {
      attendanceMap[a._id] = a.mostRecent;
    });

    const result = memberIds.map((id) => ({
      memberId: id,
      lastCheckIn: attendanceMap[id] || null,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
