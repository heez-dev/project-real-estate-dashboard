import { LocationSelectorValue } from '@/src/shared/model/location-selector-model';
import { TransactionType } from '@/src/shared/model/transaction-type-model';
import type { ApartmentTrade } from '@/src/entities/apartment-trade/model/apartment-trade';

export type TransactionsFilterValue = {
  contractMonth?: string;
  location: LocationSelectorValue;
  transactionType: TransactionType;
  maxBuildYear?: number;
  maxDealAmount?: number;
  maxDepositAmount?: number;
  maxExclusiveArea?: number;
  maxFloor?: number;
  maxMonthlyRent?: number;
  minBuildYear?: number;
  minDealAmount?: number;
  minDepositAmount?: number;
  minExclusiveArea?: number;
  minFloor?: number;
  minMonthlyRent?: number;
};

export type AdvancedTransactionsFilterValue = Omit<
  TransactionsFilterValue,
  'contractMonth' | 'location' | 'transactionType'
>;

export const emptyAdvancedTransactionsFilter: AdvancedTransactionsFilterValue =
  {};

export function countAdvancedTransactionFilters(
  value: AdvancedTransactionsFilterValue,
) {
  return Object.values(value).filter((item) => item !== undefined).length;
}

export function validateAdvancedTransactionFilters(
  value: AdvancedTransactionsFilterValue,
) {
  const ranges: Array<[number | undefined, number | undefined, string]> = [
    [value.minDealAmount, value.maxDealAmount, '거래금액'],
    [value.minDepositAmount, value.maxDepositAmount, '보증금'],
    [value.minMonthlyRent, value.maxMonthlyRent, '월세'],
    [value.minBuildYear, value.maxBuildYear, '건축년도'],
    [value.minExclusiveArea, value.maxExclusiveArea, '전용면적'],
    [value.minFloor, value.maxFloor, '층'],
  ];
  const invalidRange = ranges.find(
    ([minimum, maximum]) =>
      minimum !== undefined &&
      maximum !== undefined &&
      minimum > maximum,
  );

  return invalidRange
    ? `${invalidRange[2]}의 최소값은 최대값보다 클 수 없습니다.`
    : undefined;
}

export function filterTradesByAdvancedConditions(
  trades: ApartmentTrade[],
  value: AdvancedTransactionsFilterValue,
) {
  return trades.filter(
    (trade) =>
      isInRange(trade.dealAmount, value.minDealAmount, value.maxDealAmount) &&
      isInRange(
        trade.depositAmount,
        value.minDepositAmount,
        value.maxDepositAmount,
      ) &&
      isInRange(
        trade.monthlyRent,
        value.minMonthlyRent,
        value.maxMonthlyRent,
      ) &&
      isInRange(trade.buildYear, value.minBuildYear, value.maxBuildYear) &&
      isInRange(
        trade.exclusiveArea,
        value.minExclusiveArea,
        value.maxExclusiveArea,
      ) &&
      isInRange(trade.floor, value.minFloor, value.maxFloor),
  );
}

function isInRange(
  target: number | null,
  minimum?: number,
  maximum?: number,
) {
  if (minimum === undefined && maximum === undefined) {
    return true;
  }

  return (
    target !== null &&
    (minimum === undefined || target >= minimum) &&
    (maximum === undefined || target <= maximum)
  );
}
