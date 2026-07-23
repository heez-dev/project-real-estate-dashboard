import type {
  ApartmentTradeSearchParams,
  ApartmentTradeSearchResult,
} from '@/src/entities/apartment-trade/model/apartment-trade';
import type { TransactionType } from '@/src/shared/model/transaction-type-model';

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

export async function requestAllTransactionTrades(
  params: ApartmentTradeSearchParams[],
  transactionType: TransactionType,
) {
  const results = await Promise.all(
    params.map((param) => requestAllApartmentTrades(param)),
  );
  const filteredItems = filterTransactionTrades(
    results.flatMap((result) => result.items),
    transactionType,
  );

  return {
    items: sortTradesByLatest(filteredItems),
    pageNo: 1,
    numOfRows: filteredItems.length,
    totalCount: filteredItems.length,
  };
}

export function filterTransactionTrades(
  items: ApartmentTradeSearchResult['items'],
  transactionType: TransactionType,
) {
  return items.filter((item) => {
    if (transactionType === 'all') {
      return true;
    }

    if (transactionType === 'sale') {
      return item.tradeType === 'sale';
    }

    return transactionType === 'jeonse'
      ? item.tradeType === 'rent' && (item.monthlyRent ?? 0) === 0
      : item.tradeType === 'rent' && (item.monthlyRent ?? 0) > 0;
  });
}

export function sortTradesByLatest<
  T extends {
    dealDay: number | null;
    dealMonth: number | null;
    dealYear: number | null;
  },
>(items: T[]) {
  return [...items].sort(
    (firstTrade, secondTrade) =>
      getDealDateKey(secondTrade) - getDealDateKey(firstTrade),
  );
}

function getDealDateKey(trade: {
  dealDay: number | null;
  dealMonth: number | null;
  dealYear: number | null;
}) {
  return Number(
    [
      trade.dealYear ?? 0,
      String(trade.dealMonth ?? 0).padStart(2, '0'),
      String(trade.dealDay ?? 0).padStart(2, '0'),
    ].join(''),
  );
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
