import { MemberProfile, IMemberProfile } from "@/lib/models/MemberProfile";
import { syncSquareCustomerIds, SquareSyncResult } from "@/lib/services/square/syncSquareCustomerIds";

export interface MemberSyncStats {
  processed: number;
  linked: number;
  notFound: number;
  ambiguous: number;
  errors: number;
}

export async function syncMissingSquareCustomerIds(): Promise<MemberSyncStats> {
  const docs = await MemberProfile.find({
    squareCustomerId: { $in: [null, ""] },
    "personalInfo.email": { $exists: true, $ne: "" },
  })
    .select("_id personalInfo.email")
    .lean<IMemberProfile[]>();

  const profiles = docs.map((d) => ({
    id: String(d._id),
    email: d.personalInfo!.email!,
  }));

  const result: SquareSyncResult = await syncSquareCustomerIds(profiles);

  if (result.linked.length > 0) {
    await Promise.all(
      result.linked.map(({ id, squareCustomerId }) =>
        MemberProfile.updateOne({ _id: id }, { $set: { squareCustomerId } })
      )
    );
  }

  result.ambiguous.forEach(({ id, count }) =>
    console.warn(
      `[sync-square-customers] Ambiguous: ${count} Square customers found for profile ${id}. Skipping — resolve manually.`
    )
  );

  result.errors.forEach((id) =>
    console.error(`[sync-square-customers] Error processing profile ${id}`)
  );

  return {
    processed: profiles.length,
    linked: result.linked.length,
    notFound: result.notFound.length,
    ambiguous: result.ambiguous.length,
    errors: result.errors.length,
  };
}
