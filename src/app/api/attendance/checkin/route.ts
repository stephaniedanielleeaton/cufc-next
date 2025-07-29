// app/api/attendance/checkin/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { checkInMember } from "@/lib/services/attendance/checkIn";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { memberId } = await request.json();
    if (!memberId) {
      return NextResponse.json({ error: "Missing memberId" }, { status: 400 });
    }

    const result = await checkInMember(memberId);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
