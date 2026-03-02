import { MemberProfile } from "@/lib/models/MemberProfile";
import { SquareService } from "./squareService";

export interface SyncSquareCustomerIdsResult {
  processed: number;
  linked: number;
  notFound: number;
  ambiguous: number;
  errors: number;
}

export async function syncSquareCustomerIds(): Promise<SyncSquareCustomerIdsResult> {
  const squareService = new SquareService();
  const result: SyncSquareCustomerIdsResult = { processed: 0, linked: 0, notFound: 0, ambiguous: 0, errors: 0 };

  const profiles = await MemberProfile.find({
    squareCustomerId: { $in: [null, undefined, ""] },
    "personalInfo.email": { $exists: true, $ne: "" },
  }).select("_id personalInfo.email").lean();

  result.processed = profiles.length;

  for (const profile of profiles) {
    const email = (profile as { personalInfo?: { email?: string } }).personalInfo?.email;
    if (!email) continue;

    try {
      const customers = await squareService.searchCustomersByEmail(email);

      if (customers.length === 0) {
        result.notFound++;
      } else if (customers.length === 1) {
        await MemberProfile.updateOne(
          { _id: profile._id },
          { $set: { squareCustomerId: customers[0].id } }
        );
        result.linked++;
      } else {
        console.warn(
          `[sync-square-customers] Ambiguous: ${customers.length} Square customers found for email "${email}" (profile ${profile._id}). Skipping — resolve manually.`
        );
        result.ambiguous++;
      }
    } catch (err) {
      console.error(`Failed to sync Square customer for profile ${profile._id}:`, err);
      result.errors++;
    }
  }

  return result;
}
