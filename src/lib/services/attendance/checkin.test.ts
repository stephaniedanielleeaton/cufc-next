import { checkInMember } from "./checkIn";
import { Attendance } from "@/lib/models/Attendance";
import { DateTime } from "luxon";
import { APP_TIMEZONE } from "@/lib/config/appTime";

jest.mock("@/lib/models/Attendance", () => ({
  Attendance: {
    findOne: jest.fn(),
    create: jest.fn(),
    deleteOne: jest.fn(),
  },
}));

describe("checkInMember", () => {
  const mockMemberId = "user123";
  const mockNow = DateTime.fromISO("2025-07-29T10:00:00", { zone: APP_TIMEZONE }) as DateTime<true>;

  beforeAll(() => {
    jest.spyOn(DateTime, "now").mockReturnValue(mockNow);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("creates attendance if none exists for today", async () => {
    (Attendance.findOne as jest.Mock).mockResolvedValue(null);
    (Attendance.create as jest.Mock).mockResolvedValue({
      _id: "a1",
      userId: mockMemberId,
    });

    const result = await checkInMember(mockMemberId);

    expect(result).toEqual({
      checkedIn: true,
      attendance: { _id: "a1", userId: mockMemberId },
    });

    expect(Attendance.findOne).toHaveBeenCalledWith({
      userId: mockMemberId,
      timestamp: {
        $gte: mockNow.startOf("day").toUTC().toJSDate(),
        $lte: mockNow.endOf("day").toUTC().toJSDate(),
      },
    });

    expect(Attendance.create).toHaveBeenCalledWith({ userId: mockMemberId });
  });

  it("removes existing attendance and returns checkedIn: false", async () => {
    const mockAttendance = { _id: "existing123", userId: mockMemberId };

    (Attendance.findOne as jest.Mock).mockResolvedValue(mockAttendance);
    (Attendance.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });

    const result = await checkInMember(mockMemberId);

    expect(result).toEqual({ checkedIn: false });
    expect(Attendance.deleteOne).toHaveBeenCalledWith({ _id: "existing123" });
  });
});
