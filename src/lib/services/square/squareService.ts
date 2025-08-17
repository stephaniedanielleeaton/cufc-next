import { SquareClient, Square } from 'square';


/**
 * Service for interacting with the Square API
 */
export class SquareService {
  private client: SquareClient;
  private readonly RETAIL_LOCATION_ID = process.env.SQUARE_RETAIL_LOCATION_ID || '';

  constructor() {
    this.client = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN
    });
  }


  private logError(error: string): void {
    console.error('Square API Error:', error);
  }

  async getCatalogObjectById(catalogObjectId: string ): Promise<Square.GetCatalogObjectResponse> {
    try {
      const response = await this.client.catalog.object.get({
        objectId: catalogObjectId,
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
  async getInventoryByCatalogObjectId(catalogObjectId: string): Promise<Square.InventoryCount[]> {
    try {
      const response = await this.client.inventory.batchGetCounts({
        catalogObjectIds: [catalogObjectId],
        locationIds: [this.RETAIL_LOCATION_ID]
      });
      
      return response.data;
    } catch (error) {
      this.logError(error as string);
      throw error;
    }
  }

  async getIntroClassCheckout(catalogObjectId: string, memberProfileId: string): Promise<string> {
    try {
      const response = await this.client.checkout.paymentLinks.create({
        order: {
          locationId: this.RETAIL_LOCATION_ID,
          lineItems: [
            {
              catalogObjectId,
              quantity: "1",
              metadata: {
                "memberProfileId":memberProfileId
              }
            }
          ]
        }
      });
      return response.paymentLink?.url ?? "";
    } catch (error) {
      this.logError(error as string);
      throw error;
    }
  }
}
