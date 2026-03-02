import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { syncSquareCustomerIds } from "@/lib/services/square/syncSquareCustomerIds";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const result = await syncSquareCustomerIds();
    console.log("[sync-square-customers]", result);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[sync-square-customers] Fatal error:", err);
    return NextResponse.json({ error: "Job failed" }, { status: 500 });
  }
}
