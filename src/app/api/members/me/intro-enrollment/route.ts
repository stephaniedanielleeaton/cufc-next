import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth/auth0";
import { getProfileForUser } from "@/lib/services/member/memberProfileService";
import { SquareService } from "@/lib/services/square/squareService";
import { IntroClassOfferingsService } from "@/lib/services/square/introClassOfferingsService";

export const dynamic = "force-dynamic";

export type IntroEnrollment = {
  orderId: string;
  itemName: string;
  variationName: string;
};

export async function GET() {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const auth0Id = session.user.sub as string;
  const profile = await getProfileForUser(auth0Id);
  if (!profile) {
    return NextResponse.json({ enrollment: null });
  }

  const squareService = new SquareService();
  const orders = await squareService.getOrdersByMemberProfileId(profile._id);

  if (orders.length === 0) {
    return NextResponse.json({ enrollment: null });
  }

  const offeringsService = new IntroClassOfferingsService();
  const offerings = await offeringsService.getIntroClassOfferings();

  const order = orders[0];
  const lineItem = order.lineItems?.find((li) => li.metadata?.["memberProfileId"] === profile._id);

  const matchedVariation = lineItem?.catalogObjectId
    ? (offerings.variations ?? []).find((v) => v.id === lineItem.catalogObjectId)
    : null;

  const enrollment: IntroEnrollment = {
    orderId: order.id ?? "",
    itemName: offerings.name || "Intro Fencing Class",
    variationName: matchedVariation?.name ?? lineItem?.variationName ?? "",
  };

  return NextResponse.json({ enrollment });
}
