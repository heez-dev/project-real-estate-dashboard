import type {
  ApartmentTradeSearchParams,
  ApartmentTradeSearchResult,
} from '@/src/entities/apartment-trade/model/apartment-trade';

export type RequestApartmentTradesParams = ApartmentTradeSearchParams & {
  numOfRows?: number;
  pageNo?: number;
};

export async function requestApartmentTrades(
  params: RequestApartmentTradesParams,
) {
  const searchParams = new URLSearchParams({
    dealYearMonth: params.dealYearMonth,
    lawdCode: params.lawdCode,
    tradeType: params.tradeType,
  });

  if (params.numOfRows) {
    searchParams.set('numOfRows', String(params.numOfRows));
  }

  if (params.pageNo) {
    searchParams.set('pageNo', String(params.pageNo));
  }

  const response = await fetch(`/api/apartment-trades?${searchParams}`);

  if (!response.ok) {
    throw new Error(`Apartment trade query failed: ${response.status}`);
  }

  return (await response.json()) as ApartmentTradeSearchResult;
}

export async function requestAllApartmentTrades(
  params: RequestApartmentTradesParams,
) {
  // 대시보드 요약은 전세/월세 분류처럼 응답 item 전체가 필요한 지표가 있어 모든 페이지를 모아 계산한다.
  const pageSize = 1000;
  const firstPage = await requestApartmentTrades({
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
      requestApartmentTrades({
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
