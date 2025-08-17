import { SquareService } from "./squareService";
import { Square } from "square";
import { IntroClassDTO, VariationDTO } from "@/types/IntroClassDTO";


export class IntroClassOfferingsService {
  private squareService: SquareService;

  constructor() {
    this.squareService = new SquareService();
  }

  async getIntroClassOfferings(): Promise<IntroClassDTO> {
    const catalogResponse: Square.GetCatalogObjectResponse =
      await this.squareService.getIntroClassOfferingsFromSquare();

    const inventoryCounts: Square.InventoryCount[] =
      await this.squareService.getInventoryByCatalogObjectId();

    return this.mapOfferingsToDTO(catalogResponse, inventoryCounts);
  }

  private mapOfferingsToDTO(
    catalogResponse: Square.GetCatalogObjectResponse,
    inventoryCounts: Square.InventoryCount[]
  ): IntroClassDTO {
    const catalogObject = catalogResponse.object;
    if (!catalogObject) throw new Error("Square response missing catalog object");
    if (!this.isCatalogItem(catalogObject)) throw new Error(`Expected ITEM, but got ${catalogObject.type}`);
  
    const itemData = catalogObject.itemData ?? {};
  
    const allVariations = itemData.variations ?? [];
    const itemVariations = allVariations.filter(this.isItemVariation);
  
    const simplifiedVariations = this.mapSimplifiedVariations(itemVariations, inventoryCounts);
  
    const introClass: IntroClassDTO = {
      id: catalogObject.id,
      name: itemData.name ?? "",
      description: itemData.descriptionPlaintext ?? itemData.description ?? "",
      variations: simplifiedVariations,
    };
  
    return introClass;
  }
  

  private mapSimplifiedVariations(
    squareVariations: Square.CatalogObject.ItemVariation[],
    inventoryCounts: Square.InventoryCount[]
  ): VariationDTO[] {
    const quantityByVariationId = this.buildQuantityLookup(inventoryCounts);
    const variations: VariationDTO[] = [];
  
    for (const variation of squareVariations) {
      const data = variation.itemVariationData ?? {};
      const price = data.priceMoney ?? {};
      const amount = Number(price.amount ?? 0);
  
      const simplifiedVariation: VariationDTO = {
        id: variation.id,
        name: data.name ?? "",
        price: {
          amount: Number.isFinite(amount) ? amount : 0,
          currency: price.currency ?? "USD",
        },
        quantity: (quantityByVariationId[variation.id] ?? 0).toString(),
      };
  
      variations.push(simplifiedVariation);
    }
  
    return variations;
  }  

  private buildQuantityLookup(counts: Square.InventoryCount[]): Record<string, number> {
    const lookup: Record<string, number> = {};
  
    if (!counts) return lookup;
  
    for (const count of counts) {
      const variationId = count.catalogObjectId ?? "";
      const parsedQuantity = Number(count.quantity ?? 0);
      lookup[variationId] = Number.isFinite(parsedQuantity) ? parsedQuantity : 0;
    }
    return lookup;
  }
  
  private isCatalogItem(
    obj: Square.CatalogObject
  ): obj is Square.CatalogObject.Item {
    return obj.type === "ITEM";
  }

  private isItemVariation(
    obj: Square.CatalogObject
  ): obj is Square.CatalogObject.ItemVariation {
    return obj.type === "ITEM_VARIATION";
  }
}
