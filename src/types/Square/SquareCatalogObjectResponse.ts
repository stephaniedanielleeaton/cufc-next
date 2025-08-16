export type CurrencyCode = 'USD' | string;

export interface Money {
  amount: string;
  currency: CurrencyCode;
}

export interface LocationOverride {
  locationId: string;
  trackInventory?: boolean;
  soldOut?: boolean;
}

export interface ItemVariationVendorInfoData {
  ordinal: number;
  price_money?: Money;
  item_variation_id: string;
}

export interface ItemVariationVendorInfo {
  type: string;
  id: string;
  updated_at: string;
  created_at: string;
  version: number;
  is_deleted: boolean;
  present_at_all_locations: boolean;
  present_at_location_ids?: string[];
  item_variation_vendor_info_data: ItemVariationVendorInfoData;
}

export interface CatalogV1Id {
  catalogV1Id: string;
  locationId: string;
}

export interface ItemVariationData {
  itemId: string;
  name: string;
  ordinal: number;
  pricingType: string;
  priceMoney: Money;
  locationOverrides: LocationOverride[];
  trackInventory?: boolean;
  sellable: boolean;
  stockable: boolean;
  price_description?: string;
  channels?: string[];
  default_unit_cost?: Money;
  item_variation_vendor_info_ids?: string[];
  item_variation_vendor_infos?: ItemVariationVendorInfo[];
}

export interface ItemVariation {
  type: string;
  created_at: string;
  itemVariationData: ItemVariationData;
  id: string;
  updatedAt: string;
  version: string;
  isDeleted: boolean;
  presentAtAllLocations: boolean;
  catalogV1Ids?: CatalogV1Id[];
  presentAtLocationIds?: string[];
}

export interface Category {
  id: string;
  ordinal: string;
}

export interface ItemData {
  name: string;
  description: string;
  isTaxable: boolean;
  variations: ItemVariation[];
  productType: string;
  skipModifierScreen: boolean;
  ecom_available: boolean;
  ecom_visibility: string;
  imageIds?: string[];
  categories?: Category[];
  descriptionHtml: string;
  descriptionPlaintext: string;
  channels: string[];
  isArchived: boolean;
  reportingCategory: Category;
  isAlcoholic: boolean;
}

export interface CatalogObject {
  type: string;
  created_at: string;
  itemData: ItemData;
  id: string;
  updatedAt: string;
  version: string;
  isDeleted: boolean;
  presentAtAllLocations: boolean;
}

export interface SquareCatalogObjectResponse {
  object: CatalogObject;
}