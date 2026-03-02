export type SubscriptionStatus = "ACTIVE" | "PAUSED" | "CANCELED" | "PENDING" | "DEACTIVATED";

export type MemberSubscriptionDTO = {
  id: string;
  planName: string;
  status: SubscriptionStatus;
  priceFormatted: string;
  activeThrough: string | null;
};
