import type { ApartmentTradeType } from "@/src/entities/apartment-trade/model/apartment-trade";

const PUBLIC_DATA_BASE_URL = "https://apis.data.go.kr/1613000";

export const APARTMENT_TRADE_ENDPOINTS: Record<ApartmentTradeType, string> = {
  rent: `${PUBLIC_DATA_BASE_URL}/RTMSDataSvcAptRent/getRTMSDataSvcAptRent`,
  sale: `${PUBLIC_DATA_BASE_URL}/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade`,
  "sale-detail": `${PUBLIC_DATA_BASE_URL}/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev`,
};

export function getPublicDataServiceKey() {
  // URLSearchParams가 요청 URL 생성 시 인코딩하므로 data.go.kr의 Decoding 키를 사용한다.
  const serviceKey = process.env.DATA_GO_KR_SERVICE_KEY;

  if (!serviceKey) {
    throw new Error("DATA_GO_KR_SERVICE_KEY is not configured.");
  }

  return serviceKey;
}
