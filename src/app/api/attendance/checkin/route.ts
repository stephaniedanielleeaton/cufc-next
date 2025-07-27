import { NextResponse } from "next/server";
import { Attendance } from "@/lib/models/Attendance";
import { dbConnect } from "@/lib/mongoose";
import { DateTime } from "luxon";
import { APP_TIMEZONE } from "@/lib/config/appTime";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { memberId } = await request.json();
    if (!memberId) {
      return NextResponse.json({ error: "Missing memberId" }, { status: 400 });
    }

    const nowInAppTz = DateTime.now().setZone(APP_TIMEZONE);
    const startUtc = nowInAppTz.startOf("day").toUTC().toJSDate();
    const endUtc = nowInAppTz.endOf("day").toUTC().toJSDate();

    const existing = await Attendance.findOne({
      userId: memberId,
      timestamp: { $gte: startUtc, $lte: endUtc }
    });

    if (!existing) {
      const newAttendance = await Attendance.create({ userId: memberId });
      return NextResponse.json({ checkedIn: true, attendance: newAttendance });
    } else {
      await Attendance.deleteOne({ _id: existing._id });
      return NextResponse.json({ checkedIn: false });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
