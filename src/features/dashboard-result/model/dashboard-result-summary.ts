import type {
  ApartmentTrade,
  ApartmentTradeSearchResult,
} from '@/src/entities/apartment-trade/model/apartment-trade';
import type { TransactionType } from '@/src/shared/model/transaction-type-model';

export type DashboardResultSummary = {
  averageDealAmount: number | null;
  averageDepositAmount: number | null;
  averageMonthlyRent: number | null;
  highestDealAmount: number | null;
  highestDepositAmount: number | null;
  latestTrades: ApartmentTrade[];
  monthlyRentCount: number;
  saleCount: number;
  targetTotalCount: number;
  targetTrades: ApartmentTrade[];
  topLegalDongs: Array<{
    count: number;
    name: string;
  }>;
  totalCount: number;
  totalSampleCount: number;
  transactionType: TransactionType;
  jeonseCount: number;
};

export function createDashboardResultSummary({
  results,
  townNames = [],
  transactionType,
}: {
  results: ApartmentTradeSearchResult[];
  townNames?: string[];
  transactionType: TransactionType;
}): DashboardResultSummary {
  const allTrades = filterTradesByTownNames(
    results.flatMap((result) => result.items),
    townNames,
  );
  const saleTrades = allTrades.filter((trade) => trade.tradeType === 'sale');
  const rentTrades = allTrades.filter((trade) => trade.tradeType === 'rent');
  const jeonseTrades = rentTrades.filter((trade) => isJeonseTrade(trade));
  const monthlyRentTrades = rentTrades.filter((trade) => isMonthlyRentTrade(trade));
  const targetTrades = filterTradesByTransactionType(allTrades, transactionType);

  return {
    averageDealAmount: averageAmount(
      targetTrades.map((trade) => trade.dealAmount),
    ),
    averageDepositAmount: averageAmount(
      targetTrades.map((trade) => trade.depositAmount),
    ),
    averageMonthlyRent: averageAmount(
      targetTrades.map((trade) => trade.monthlyRent),
    ),
    highestDealAmount: maxAmount(targetTrades.map((trade) => trade.dealAmount)),
    highestDepositAmount: maxAmount(
      targetTrades.map((trade) => trade.depositAmount),
    ),
    jeonseCount: jeonseTrades.length,
    latestTrades: sortByLatestDealDate(targetTrades).slice(0, 6),
    monthlyRentCount: monthlyRentTrades.length,
    saleCount: saleTrades.length,
    targetTotalCount: targetTrades.length,
    targetTrades,
    topLegalDongs: createTopLegalDongs(targetTrades),
    totalCount: results.reduce((sum, result) => sum + result.totalCount, 0),
    totalSampleCount: allTrades.length,
    transactionType,
  };
}

function filterTradesByTownNames(
  trades: ApartmentTrade[],
  townNames: string[],
) {
  if (townNames.length === 0) {
    return trades;
  }

  // 공공 API는 시군구 코드까지만 조회하므로 읍/면/동 선택은 응답의 법정동명으로 한 번 더 좁힌다.
  const townNameSet = new Set(townNames);

  return trades.filter((trade) => townNameSet.has(trade.legalDong));
}

function filterTradesByTransactionType(
  trades: ApartmentTrade[],
  transactionType: TransactionType,
) {
  if (transactionType === 'sale') {
    return trades.filter((trade) => trade.tradeType === 'sale');
  }

  if (transactionType === 'jeonse') {
    return trades.filter((trade) => trade.tradeType === 'rent' && isJeonseTrade(trade));
  }

  if (transactionType === 'monthly-rent') {
    return trades.filter(
      (trade) => trade.tradeType === 'rent' && isMonthlyRentTrade(trade),
    );
  }

  return trades;
}

function isJeonseTrade(trade: ApartmentTrade) {
  return trade.tradeType === 'rent' && (trade.monthlyRent ?? 0) === 0;
}

function isMonthlyRentTrade(trade: ApartmentTrade) {
  return trade.tradeType === 'rent' && (trade.monthlyRent ?? 0) > 0;
}

function averageAmount(values: Array<number | null>) {
  const validValues = values.filter((value): value is number => value !== null);

  if (validValues.length === 0) {
    return null;
  }

  return Math.round(
    validValues.reduce((sum, value) => sum + value, 0) / validValues.length,
  );
}

function maxAmount(values: Array<number | null>) {
  const validValues = values.filter((value): value is number => value !== null);

  return validValues.length > 0 ? Math.max(...validValues) : null;
}

function sortByLatestDealDate(trades: ApartmentTrade[]) {
  return [...trades].sort((firstTrade, secondTrade) => {
    return getDealDateKey(secondTrade) - getDealDateKey(firstTrade);
  });
}

function getDealDateKey(trade: ApartmentTrade) {
  return Number(
    [
      trade.dealYear ?? 0,
      String(trade.dealMonth ?? 0).padStart(2, '0'),
      String(trade.dealDay ?? 0).padStart(2, '0'),
    ].join(''),
  );
}

function createTopLegalDongs(trades: ApartmentTrade[]) {
  const countByLegalDong = trades.reduce<Record<string, number>>((acc, trade) => {
    const key = trade.legalDong || '미상';
    acc[key] = (acc[key] ?? 0) + 1;

    return acc;
  }, {});

  return Object.entries(countByLegalDong)
    .map(([name, count]) => ({ count, name }))
    .sort((firstItem, secondItem) => secondItem.count - firstItem.count)
    .slice(0, 5);
}
