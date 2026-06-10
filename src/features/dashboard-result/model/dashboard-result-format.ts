import type { ApartmentTrade } from '@/src/entities/apartment-trade/model/apartment-trade';
import type { DashboardResultSummary } from '@/src/features/dashboard-result/model/dashboard-result-summary';
import type { TransactionType } from '@/src/shared/model/transaction-type-model';

export const transactionTypeLabel = {
  all: '전체',
  jeonse: '전세',
  'monthly-rent': '월세',
  sale: '매매',
} as const satisfies Record<TransactionType, string>;

export function getTradeTypeLabel(trade: ApartmentTrade) {
  if (trade.tradeType === 'sale') {
    return '매매';
  }

  return (trade.monthlyRent ?? 0) > 0 ? '월세' : '전세';
}

export function formatTradeAmount(trade: ApartmentTrade) {
  if (trade.tradeType === 'sale') {
    return formatAmount(trade.dealAmount);
  }

  if ((trade.monthlyRent ?? 0) > 0) {
    return `${formatAmount(trade.depositAmount)} / ${formatAmount(trade.monthlyRent)}`;
  }

  return formatAmount(trade.depositAmount);
}

export function formatAmount(value: number | null) {
  if (value === null) {
    return '-';
  }

  if (value >= 10_000) {
    const hundredMillionAmount = Math.round((value / 10_000) * 10) / 10;

    return `${hundredMillionAmount.toLocaleString()}억`;
  }

  if (value >= 1_000 && value % 1_000 === 0) {
    return `${value / 1_000}천`;
  }

  return `${value.toLocaleString()}만원`;
}

export function formatMonthlyChange({
  currentValue,
  isLoading,
  previousValue,
}: {
  currentValue: number | null;
  isLoading: boolean;
  previousValue: number | null;
}) {
  if (isLoading) {
    return {
      tone: 'neutral' as const,
      value: '계산 중',
    };
  }

  if (currentValue === null || previousValue === null) {
    return {
      tone: 'neutral' as const,
      value: '비교 데이터 없음',
    };
  }

  if (previousValue === 0) {
    return {
      tone: currentValue > 0 ? ('positive' as const) : ('neutral' as const),
      value: currentValue > 0 ? '신규' : '0%',
    };
  }

  const changeRate = ((currentValue - previousValue) / previousValue) * 100;
  const roundedChangeRate = Math.round(changeRate * 10) / 10;

  return {
    tone:
      roundedChangeRate > 0
        ? ('positive' as const)
        : roundedChangeRate < 0
          ? ('negative' as const)
          : ('neutral' as const),
    value: `${roundedChangeRate > 0 ? '+' : ''}${roundedChangeRate}%`,
  };
}

export function formatMonthlyCountChange({
  currentValue,
  isLoading,
  previousValue,
}: {
  currentValue: number;
  isLoading: boolean;
  previousValue: number | null;
}) {
  if (isLoading) {
    return {
      tone: 'neutral' as const,
      value: '계산 중',
    };
  }

  if (previousValue === null) {
    return {
      tone: 'neutral' as const,
      value: '비교 데이터 없음',
    };
  }

  const difference = currentValue - previousValue;

  return {
    tone:
      difference > 0
        ? ('positive' as const)
        : difference < 0
          ? ('negative' as const)
          : ('neutral' as const),
    value: `${difference > 0 ? '+' : ''}${difference.toLocaleString()}건`,
  };
}

export function formatSelectedDealYearMonth(summary: DashboardResultSummary) {
  const trade = summary.targetTrades.find(
    (item) => item.dealYear && item.dealMonth,
  );

  if (!trade?.dealYear || !trade.dealMonth) {
    return '계약년월 미상';
  }

  return `${trade.dealYear}년 ${String(trade.dealMonth).padStart(2, '0')}월`;
}

export function formatSelectedLocation(summary: DashboardResultSummary) {
  const legalDongs = Array.from(
    new Set(
      summary.targetTrades
        .map((trade) => trade.legalDong)
        .filter((legalDong) => legalDong.length > 0),
    ),
  );

  if (legalDongs.length === 0) {
    return '지역 미상';
  }

  if (legalDongs.length === 1) {
    return legalDongs[0];
  }

  return `${legalDongs[0]} 외 ${legalDongs.length - 1}개 법정동`;
}

export function formatDealDate(trade: ApartmentTrade) {
  if (!trade.dealYear || !trade.dealMonth || !trade.dealDay) {
    return '-';
  }

  return [
    trade.dealYear,
    String(trade.dealMonth).padStart(2, '0'),
    String(trade.dealDay).padStart(2, '0'),
  ].join('.');
}

export function formatExclusiveArea(value: number | null) {
  if (value === null) {
    return '-';
  }

  return `${(Math.round(value * 100) / 100).toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })}㎡`;
}
