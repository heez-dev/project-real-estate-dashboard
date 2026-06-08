import { useQuery } from "@tanstack/react-query";
import type {
  ApartmentTradeSearchParams,
  ApartmentTradeSearchResult,
} from "@/src/entities/apartment-trade/model/apartment-trade";

export type UseApartmentTradeQueryParams = ApartmentTradeSearchParams & {
  enabled?: boolean;
  numOfRows?: number;
  pageNo?: number;
};

export function useApartmentTradeQuery({
  enabled = true,
  ...params
}: UseApartmentTradeQueryParams) {
  return useQuery({
    enabled,
    queryFn: () => requestApartmentTrades(params),
    // 검색 조건 전체를 키에 포함해 조건별 결과를 독립적으로 캐시한다.
    queryKey: ["apartment-trades", params],
  });
}

async function requestApartmentTrades(
  params: Omit<UseApartmentTradeQueryParams, "enabled">,
) {
  const searchParams = new URLSearchParams({
    dealYearMonth: params.dealYearMonth,
    lawdCode: params.lawdCode,
    tradeType: params.tradeType,
  });

  if (params.numOfRows) {
    searchParams.set("numOfRows", String(params.numOfRows));
  }

  if (params.pageNo) {
    searchParams.set("pageNo", String(params.pageNo));
  }

  const response = await fetch(`/api/apartment-trades?${searchParams}`);

  if (!response.ok) {
    throw new Error(`Apartment trade query failed: ${response.status}`);
  }

  return (await response.json()) as ApartmentTradeSearchResult;
}
