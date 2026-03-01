import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { Attendance } from "@/lib/models/Attendance";
import { requireRole } from "@/lib/auth/requireRole";
import { getAllMemberIds } from "@/lib/services/member/memberProfileService";

// Returns a list of all member IDs with their most recent attendance check-in timestamp.

export async function GET() {
  const roleResult = await requireRole("club-admin");
  if (roleResult?.error) {
    return NextResponse.json({ error: roleResult.error }, { status: roleResult.status });
  }

  try {
    await dbConnect();
    const memberIds = await getAllMemberIds();

    const attendanceByMember = await Attendance.aggregate([
      { $match: { userId: { $in: memberIds } } },
      { $sort: { timestamp: -1 } },
      { $group: { _id: "$userId", mostRecent: { $first: "$timestamp" } } },
    ]);

    const attendanceMap: Record<string, string> = {};
    type AttendanceAggregate = { _id: string; mostRecent: string };
    (attendanceByMember as AttendanceAggregate[]).forEach((a) => {
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
