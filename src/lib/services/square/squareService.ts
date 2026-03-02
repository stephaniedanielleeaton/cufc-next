import { SquareClient, Square } from 'square';
import type { SubscriptionPlanVariationObject } from '@/types/Square/SquareCatalogObjectResponse';


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


  async getInvoiceById(invoiceId: string): Promise<Square.Invoice | null> {
    try {
      const response = await this.client.invoices.get({ invoiceId });
      return response.invoice ?? null;
    } catch (error) {
      this.logError(error as string);
      throw error;
    }
  }

  async getSubscriptionPlanVariation(planVariationId: string): Promise<SubscriptionPlanVariationObject | null> {
    try {
      const response = await this.client.catalog.object.get({ objectId: planVariationId });
      if (!response.object) return null;
      return response.object as unknown as SubscriptionPlanVariationObject;
    } catch (error) {
      this.logError(error as string);
      throw error;
    }
  }

  /**
   * Get all subscriptions for a Square customer
   */
  async getCustomerSubscriptions(customerId: string): Promise<Square.Subscription[]> {
    try {
      const response = await this.client.subscriptions.search({
        query: {
          filter: {
            customerIds: [customerId],
          },
        },
      });
      return response.subscriptions ?? [];
    } catch (error) {
      this.logError(error as string);
      throw error;
    }
  }

  /**
   * Search for a Square customer by exact email address. Returns the first match or null.
   */
  async searchCustomersByEmail(email: string): Promise<Square.Customer[]> {
    try {
      const response = await this.client.customers.search({
        query: {
          filter: {
            emailAddress: { exact: email },
          },
        },
      });
      return response.customers ?? [];
    } catch (error) {
      this.logError(error as string);
      throw error;
    }
  }

  /**
   * Get Checkout URL for a given catalog object variant ID and member profile ID
   */
  async getSingleVariantCheckout(catalogObjectId: string, memberProfileId: string): Promise<string> {
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
