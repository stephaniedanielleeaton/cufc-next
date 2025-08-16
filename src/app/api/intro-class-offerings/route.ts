import { NextResponse } from "next/server";
import { IntroClassOfferingsService } from "@/lib/services/square/introClassOfferingsService";

/**
 * GET handler for retrieving intro class offerings from Square
 * @returns {Promise<NextResponse>} JSON response with intro class offerings data
 */
export async function GET() {
  try {
    const introClassOfferingsService = new IntroClassOfferingsService();
    const offerings = await introClassOfferingsService.getIntroClassOfferings();
    
    return NextResponse.json(offerings);
  } catch (error) {
    console.error('Error in intro class offerings API route:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve intro class offerings' },
      { status: 500 }
    );
  }
}
