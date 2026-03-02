import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/requireRole";
import { dbConnect } from "@/lib/mongoose";
import { Attendance } from "@/lib/models/Attendance";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireRole("club-admin");
  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { id } = await params;
  await dbConnect();

  const attendanceRecords = await Attendance.find({ userId: id })
    .sort({ timestamp: -1 })
    .limit(100)
    .lean();

  const attendance = attendanceRecords.map((record) => ({
    id: record._id.toString(),
    timestamp: record.timestamp.toISOString(),
  }));

  return NextResponse.json({ attendance });
}
