import { SquareCatalogObjectResponse } from '@/types/Square/SquareCatalogObjectResponse';
import { SquareClient } from 'square';
import type { SquareInventoryCountsResponse } from '@/types/Square/SquareInventoryCountsResponse';

/**
 * Service for interacting with the Square API
 */
export class SquareService {
  private client: SquareClient;
  private readonly INTRO_CLASS_CATALOG_OBJECT_ID = 'HSHTGZJIN54744UBG7UMBN24';
  private readonly RETAIL_LOCATION_ID = process.env.SQUARE_RETAIL_LOCATION_ID || '';

  constructor() {
    this.client = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN
    });
  }

  /**
   * Helper function to handle BigInt serialization in Square API responses
   */
  private handleBigIntSerialization(data: any): any {
    return data;
  }

  private logError(error: any): void {
    console.error('Square API Error:', error);
  }

  async getIntroClassOfferingsFromSquare(): Promise<SquareCatalogObjectResponse> {
    try {
      const response = await this.client.catalog.object.get({
        objectId: this.INTRO_CLASS_CATALOG_OBJECT_ID,
      });
      return this.handleBigIntSerialization(response);
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  /**
   * Get inventory counts for a catalog object by ID
   */
  async getInventoryByCatalogObjectId(): Promise<SquareInventoryCountsResponse> {
    try {
      const response = await this.client.inventory.batchGetCounts({
        catalogObjectIds: [this.INTRO_CLASS_CATALOG_OBJECT_ID],
        locationIds: [this.RETAIL_LOCATION_ID]
      });
      
      return this.handleBigIntSerialization(response.data);
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }
}
