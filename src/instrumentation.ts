export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { dbConnect } = await import("@/lib/mongoose");
  const { syncSquareCustomerIds } = await import(
    "@/lib/services/square/syncSquareCustomerIds"
  );

  try {
    await dbConnect();
    const result = await syncSquareCustomerIds();
    console.log("[startup] sync-square-customers:", result);
  } catch (err) {
    console.error("[startup] sync-square-customers failed:", err);
  }
}
