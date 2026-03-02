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
   * Return the set of customer IDs that have at least one ACTIVE subscription.
   * Uses a single Square API call for the entire list.
   */
  async getActiveSubscriptionsForCustomers(customerIds: string[]): Promise<Set<string>> {
    if (customerIds.length === 0) return new Set();
    try {
      const response = await this.client.subscriptions.search({
        query: {
          filter: {
            customerIds,
          },
        },
      });
      const active = new Set<string>();
      for (const sub of response.subscriptions ?? []) {
        if (sub.status === "ACTIVE" && sub.customerId) {
          active.add(sub.customerId);
        }
      }
      return active;
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
   * Search for Square customers by exact email address. Returns all matches.
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
   * Search all orders at the location for a given memberProfileId stored in line item metadata.
   * This works regardless of order state or whether the order has a Square customer ID attached.
   */
  async getOrdersByMemberProfileId(memberProfileId: string): Promise<Square.Order[]> {
    try {
      const response = await this.client.orders.search({
        locationIds: [this.RETAIL_LOCATION_ID],
        query: {
          sort: { sortField: "CREATED_AT", sortOrder: "DESC" },
        },
      });
      const orders = response.orders ?? [];
      return orders.filter((o) =>
        o.lineItems?.some((li) => li.metadata?.["memberProfileId"] === memberProfileId)
      );
    } catch (error) {
      this.logError(error as string);
      throw error;
    }
  }

  /**
   * Get Checkout URL for a given catalog object variant ID and member profile ID
   */
  async getSingleVariantCheckout(catalogObjectId: string, memberProfileId: string, customerId?: string): Promise<string> {
    try {
      const response = await this.client.checkout.paymentLinks.create({
        order: {
          locationId: this.RETAIL_LOCATION_ID,
          ...(customerId ? { customerId } : {}),
          lineItems: [
            {
              catalogObjectId,
              quantity: "1",
              metadata: {
                "memberProfileId": memberProfileId
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
