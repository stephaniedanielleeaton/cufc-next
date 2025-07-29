import { Attendance } from "@/lib/models/Attendance";
import { DateTime } from "luxon";
import { APP_TIMEZONE } from "@/lib/config/appTime";

export async function checkInMember(memberId: string) {
  const nowInAppTz = DateTime.now().setZone(APP_TIMEZONE);
  const startUtc = nowInAppTz.startOf("day").toUTC().toJSDate();
  const endUtc = nowInAppTz.endOf("day").toUTC().toJSDate();

  const existing = await Attendance.findOne({
    userId: memberId,
    timestamp: { $gte: startUtc, $lte: endUtc },
  });

  if (!existing) {
    const newAttendance = await Attendance.create({ userId: memberId });
    return { checkedIn: true, attendance: newAttendance };
  } else {
    await Attendance.deleteOne({ _id: existing._id });
    return { checkedIn: false };
  }
}
