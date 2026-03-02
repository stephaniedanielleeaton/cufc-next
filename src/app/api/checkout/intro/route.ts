import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth/auth0";
import { SquareService } from "@/lib/services/square/squareService";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { catalogObjectId, memberProfileId } = body;

    if (!catalogObjectId || !memberProfileId) {
      return NextResponse.json(
        { error: 'Missing required parameters: catalogObjectId and memberProfileId are required' },
        { status: 400 }
      );
    }

    const squareService = new SquareService();
    const checkoutUrl = await squareService.getSingleVariantCheckout(catalogObjectId, memberProfileId);

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: 'Failed to create checkout link' },
        { status: 500 }
      );
    }

    return NextResponse.json({ checkoutUrl }, { status: 200 });
  } catch (error) {
    console.error('Error in intro class checkout:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
