export const APARTMENT_TRADE_TYPES = [
  "sale",
  "sale-detail",
  "rent",
] as const;

export type ApartmentTradeType = (typeof APARTMENT_TRADE_TYPES)[number];

export type ApartmentTradeSearchParams = {
  tradeType: ApartmentTradeType;
  lawdCode: string;
  dealYearMonth: string;
};

export type ApartmentTrade = {
  id: string;
  tradeType: ApartmentTradeType;
  apartmentName: string;
  buildYear: number | null;
  dealAmount: number | null;
  depositAmount: number | null;
  monthlyRent: number | null;
  dealYear: number | null;
  dealMonth: number | null;
  dealDay: number | null;
  exclusiveArea: number | null;
  floor: number | null;
  legalDong: string;
  jibun: string;
  regionalCode: string;
  raw: Record<string, string>;
};

export type ApartmentTradeSearchResult = {
  items: ApartmentTrade[];
  pageNo: number;
  numOfRows: number;
  totalCount: number;
};

export type PublicDataResponseHeader = {
  resultCode: string;
  resultMessage: string;
};

