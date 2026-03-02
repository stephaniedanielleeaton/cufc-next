import { SquareService } from "./squareService";

export interface ProfileToSync {
  id: string;
  email: string;
}

export interface SquareSyncResult {
  linked: Array<{ id: string; squareCustomerId: string }>;
  notFound: string[];
  ambiguous: Array<{ id: string; count: number }>;
  errors: string[];
}

export async function syncSquareCustomerIds(profiles: ProfileToSync[]): Promise<SquareSyncResult> {
  const squareService = new SquareService();
  const result: SquareSyncResult = { linked: [], notFound: [], ambiguous: [], errors: [] };

  for (const profile of profiles) {
    try {
      const customers = await squareService.searchCustomersByEmail(profile.email);

      if (customers.length === 0) {
        result.notFound.push(profile.id);
      } else if (customers.length === 1) {
        result.linked.push({ id: profile.id, squareCustomerId: customers[0].id! });
      } else {
        result.ambiguous.push({ id: profile.id, count: customers.length });
      }
    } catch {
      result.errors.push(profile.id);
    }
  }

  return result;
}
