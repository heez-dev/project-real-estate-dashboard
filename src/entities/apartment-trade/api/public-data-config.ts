import type { ApartmentTradeType } from "@/src/entities/apartment-trade/model/apartment-trade";

const PUBLIC_DATA_BASE_URL = "https://apis.data.go.kr/1613000";

export const APARTMENT_TRADE_ENDPOINTS: Record<ApartmentTradeType, string> = {
  rent: `${PUBLIC_DATA_BASE_URL}/RTMSDataSvcAptRent/getRTMSDataSvcAptRent`,
  sale: `${PUBLIC_DATA_BASE_URL}/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade`,
  "sale-detail": `${PUBLIC_DATA_BASE_URL}/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev`,
};
