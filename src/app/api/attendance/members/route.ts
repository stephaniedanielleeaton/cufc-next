import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { getMembersWithCheckInStatus } from "@/lib/services/attendance/getMembersWithCheckInStatus";

export async function GET() {
  try {
    await dbConnect();

    const result = await getMembersWithCheckInStatus();
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
