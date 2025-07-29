
import { getMembersWithCheckInStatus } from "./getMembersWithCheckInStatus";
import { MemberProfile } from "@/lib/models/MemberProfile";
import { Attendance } from "@/lib/models/Attendance";
import { DateTime } from "luxon";
import { APP_TIMEZONE } from "@/lib/config/appTime";

jest.mock("@/lib/models/MemberProfile", () => ({
  MemberProfile: {
    find: jest.fn(),
  },
}));

jest.mock("@/lib/models/Attendance", () => ({
  Attendance: {
    find: jest.fn(),
  },
}));

const memberId1 = "member1";
const memberId2 = "member2";
const mockNow = DateTime.fromISO("2025-07-29T10:00:00", { zone: APP_TIMEZONE }) as DateTime<true>;

describe("getMembersWithCheckInStatus", () => {
  beforeAll(() => {
    jest.spyOn(DateTime, "now").mockReturnValue(mockNow);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("returns all members with correct check-in status", async () => {
    const mockMembers = [
      { _id: memberId1, displayFirstName: "Alice", displayLastName: "Smith" },
      { _id: memberId2, displayFirstName: "Bob", displayLastName: "Jones" },
    ];

    const mockAttendance = [{ userId: memberId2 }];

    (MemberProfile.find as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockMembers),
    });

    (Attendance.find as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockAttendance),
    });

    const result = await getMembersWithCheckInStatus();

    expect(result).toEqual([
      {
        id: memberId1,
        displayFirstName: "Alice",
        displayLastName: "Smith",
        isCheckedIn: false,
      },
      {
        id: memberId2,
        displayFirstName: "Bob",
        displayLastName: "Jones",
        isCheckedIn: true,
      },
    ]);
  });
});
