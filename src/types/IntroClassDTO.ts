// The exact shape your API returns

export type CurrencyCode = 'USD' | string;

export interface PriceDTO {
  amount: number;
  currency: CurrencyCode;
}

export interface VariationDTO {
  id: string;
  name: string;
  price: PriceDTO;
  quantity?: string       
}

export interface IntroClassDTO {
  id: string;
  name: string;
  description: string;
  variations?: VariationDTO[];
}
