import { SquareService } from "./squareService";
import { MemberSubscriptionDTO, SubscriptionStatus } from "@/types/Subscription";

function formatMoney(amount: bigint | number | undefined, currency: string | undefined): string {
  if (amount === undefined || amount === null) return "—";
  const dollars = Number(amount) / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? "USD",
  }).format(dollars);
}

function formatDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export async function getMemberSubscriptions(squareCustomerId: string): Promise<MemberSubscriptionDTO[]> {
  const squareService = new SquareService();
  const subscriptions = await squareService.getCustomerSubscriptions(squareCustomerId);

  const results: MemberSubscriptionDTO[] = [];

  for (const sub of subscriptions) {
    let planName = "Membership";
    let priceFormatted = "—";

    if (sub.planVariationId) {
      try {
        const planVariation = await squareService.getSubscriptionPlanVariation(sub.planVariationId);
        const planData = planVariation?.subscriptionPlanVariationData;
        if (planData?.name) planName = planData.name;
      } catch (err) {
        console.error("Failed to fetch subscription plan variation:", err);
      }
    }

    const invoiceIds = sub.invoiceIds ?? [];
    const mostRecentInvoiceId = invoiceIds[invoiceIds.length - 1];
    if (mostRecentInvoiceId) {
      try {
        const invoice = await squareService.getInvoiceById(mostRecentInvoiceId);
        const money = invoice?.paymentRequests?.[0]?.computedAmountMoney;
        priceFormatted = formatMoney(money?.amount ?? undefined, money?.currency ?? undefined);
      } catch (err) {
        console.error("Failed to fetch subscription invoice:", err);
      }
    }

    results.push({
      id: sub.id ?? "",
      planName,
      status: (sub.status ?? "ACTIVE") as SubscriptionStatus,
      priceFormatted,
      activeThrough: formatDate(sub.chargedThroughDate),
    });
  }

  return results;
}
