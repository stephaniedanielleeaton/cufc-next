export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { dbConnect } = await import("@/lib/mongoose");
  const { syncMissingSquareCustomerIds } = await import(
    "@/lib/services/member/memberSquareSyncService"
  );

  try {
    await dbConnect();
    const result = await syncMissingSquareCustomerIds();
    console.log("[startup] sync-square-customers:", result);
  } catch (err) {
    console.error("[startup] sync-square-customers failed:", err);
  }
}
