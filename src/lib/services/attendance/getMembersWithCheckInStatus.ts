// lib/services/attendanceService.ts
import { MemberProfile } from "@/lib/models/MemberProfile";
import { Attendance } from "@/lib/models/Attendance";
import { DateTime } from "luxon";
import { APP_TIMEZONE } from "@/lib/config/appTime";
import { AttendanceScreenMember } from "@/lib/types/AttendanceScreenMember";
import { MemberCheckIn } from "@/lib/types/MemberCheckIn";

export async function getMembersWithCheckInStatus(): Promise<MemberCheckIn[]> {
  const members = await MemberProfile.find({}, {
    displayFirstName: 1,
    displayLastName: 1,
    _id: 1,
  }).lean();

  const typedMembers = members as AttendanceScreenMember[];

  const nowInAppTz = DateTime.now().setZone(APP_TIMEZONE);
  const startUtc = nowInAppTz.startOf("day").toUTC().toJSDate();
  const endUtc = nowInAppTz.endOf("day").toUTC().toJSDate();

  const todaysAttendance = await Attendance.find({
    timestamp: { $gte: startUtc, $lte: endUtc },
  }).lean();

  const checkedInIds = new Set(todaysAttendance.map((a) => a.userId.toString()));

  return typedMembers.map((member) => ({
    id: member._id.toString(),
    displayFirstName: member.displayFirstName,
    displayLastName: member.displayLastName,
    isCheckedIn: checkedInIds.has(member._id.toString()),
  }));
}
