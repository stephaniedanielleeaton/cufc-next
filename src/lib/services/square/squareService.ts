import { SquareClient, Square } from 'square';


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


  private logError(error: string): void {
    console.error('Square API Error:', error);
  }

  async getIntroClassOfferingsFromSquare(): Promise<Square.GetCatalogObjectResponse> {
    try {
      const response = await this.client.catalog.object.get({
        objectId: this.INTRO_CLASS_CATALOG_OBJECT_ID,
      });
      return response;
    } catch (error) {
      this.logError(error as string);
      throw error;
    }
  }

  /**
   * Get inventory counts for a catalog object by ID
   */
  async getInventoryByCatalogObjectId(): Promise<Square.InventoryCount[]> {
    try {
      const response = await this.client.inventory.batchGetCounts({
        catalogObjectIds: [this.INTRO_CLASS_CATALOG_OBJECT_ID],
        locationIds: [this.RETAIL_LOCATION_ID]
      });
      
      return response.data;
    } catch (error) {
      this.logError(error as string);
      throw error;
    }
  }
}
