/**
 * Represents an inventory count for a Square catalog item variation
 */
export interface InventoryCount {
    catalogObjectId: string;
    catalogObjectType: string;
    state: 'IN_STOCK' | 'OUT_OF_STOCK' | 'SOLD_OUT' | string;
    locationId: string;
    quantity: string;
    calculatedAt: string;
  }
  
  /**
   * Array of inventory counts returned by Square API
   */
  export type SquareInventoryCountsResponse = InventoryCount[];