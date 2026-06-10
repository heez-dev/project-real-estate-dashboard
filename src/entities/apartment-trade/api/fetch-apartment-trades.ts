import { APARTMENT_TRADE_ENDPOINTS } from "@/src/entities/apartment-trade/api/public-data-config";
import { parseApartmentTradeResponse } from "@/src/entities/apartment-trade/api/parse-apartment-trade-response";
import type {
  ApartmentTradeSearchParams,
  ApartmentTradeSearchResult,
} from "@/src/entities/apartment-trade/model/apartment-trade";
import { getPublicDataServiceKey } from "@/src/shared/api/public-data-service-key";

export type FetchApartmentTradesParams = ApartmentTradeSearchParams & {
  numOfRows?: number;
  pageNo?: number;
};

export async function fetchApartmentTrades(
  params: FetchApartmentTradesParams,
): Promise<ApartmentTradeSearchResult> {
  const endpoint = APARTMENT_TRADE_ENDPOINTS[params.tradeType];
  const url = new URL(endpoint);

  // 공공 API의 레거시 파라미터명은 이 경계에서만 사용하고, 앱 내부는 도메인 중심 이름을 유지한다.
  url.searchParams.set("serviceKey", getPublicDataServiceKey());
  url.searchParams.set("LAWD_CD", params.lawdCode);
  url.searchParams.set("DEAL_YMD", params.dealYearMonth);
  url.searchParams.set("pageNo", String(params.pageNo ?? 1));
  url.searchParams.set("numOfRows", String(params.numOfRows ?? 100));

  const response = await fetch(url, {
    // 검색 결과는 캐시된 응답이 아니라 현재 검색 조건을 기준으로 받아온다.
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Public data API request failed: ${response.status}`);
  }

  const xmlText = await response.text();

  return parseApartmentTradeResponse(xmlText, params);
}

export async function fetchAllApartmentTrades(
  params: FetchApartmentTradesParams,
): Promise<ApartmentTradeSearchResult> {
  // 서버 초기 렌더링도 클라이언트 재조회와 같은 전체 페이지 기준으로 맞춘다.
  // 전세/월세 분류와 법정동 TOP 계산은 응답 item 전체가 있어야 정확하게 산출된다.
  const pageSize = 1000;
  const firstPage = await fetchApartmentTrades({
    ...params,
    numOfRows: pageSize,
    pageNo: 1,
  });
  const totalPages = Math.ceil(firstPage.totalCount / pageSize);

  if (totalPages <= 1) {
    return firstPage;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      fetchApartmentTrades({
        ...params,
        numOfRows: pageSize,
        pageNo: index + 2,
      }),
    ),
  );

  return {
    ...firstPage,
    items: [
      ...firstPage.items,
      ...remainingPages.flatMap((result) => result.items),
    ],
  };
}
