
import { SquareService } from './squareService';
import type { IntroClassDTO, VariationDTO } from '@/types/IntroClassDTO';
import type { SquareCatalogObjectResponse, ItemVariation } from '@/types/Square/SquareCatalogObjectResponse';
import type { SquareInventoryCountsResponse } from '@/types/Square/SquareInventoryCountsResponse';

/**
 * Service for handling intro class offerings data from Square
 */
export class IntroClassOfferingsService {
  private squareService: SquareService;

  constructor() {
    this.squareService = new SquareService();
  }

  /**
   * Get intro class offerings from Square
   * @returns {Promise<Object>} The intro class offerings data with inventory counts
   */
  async getIntroClassOfferings() {
    try {
      const offeringsData: SquareCatalogObjectResponse = await this.squareService.getIntroClassOfferingsFromSquare()
      const inventoryCounts: SquareInventoryCountsResponse = await this.squareService.getInventoryByCatalogObjectId()

      return this.mapOfferingsToDTO(offeringsData, inventoryCounts);

    } catch (error) {
      console.error('Error fetching intro class offerings:', error);
      throw error;
    }
  }

  async mapOfferingsToDTO(offeringsData: SquareCatalogObjectResponse, inventoryCounts: SquareInventoryCountsResponse) {
      
    let introClassOfferings: IntroClassDTO[] = [];

    introClassOfferings.push({
      id: offeringsData.object.id,
      name: offeringsData.object.itemData.name,
      description: offeringsData.object.itemData.description,
      variations: this.mapSimplifiedVariations(offeringsData.object.itemData.variations, inventoryCounts),
    });

    return introClassOfferings;
}

 mapSimplifiedVariations(offeringsDataVariations: ItemVariation[], inventoryCounts: SquareInventoryCountsResponse) {
    let variations: VariationDTO[] = [];
    for (const variation of offeringsDataVariations) {
        variations.push({
            id: variation.id,
            name: variation.itemVariationData.name,
            quantity: this.mapInventoryCountsToDTO(variation.id, inventoryCounts),
            price: { amount: Number(variation.itemVariationData.priceMoney.amount), currency: 'USD' },
        });
    }
    return variations;
}

 mapInventoryCountsToDTO(variationId: string, inventoryCounts: SquareInventoryCountsResponse): string {
    
    for (const count of inventoryCounts) {
        if (count.catalogObjectId === variationId) {
            return count.quantity;
        }
    }
    return '0';
}

}