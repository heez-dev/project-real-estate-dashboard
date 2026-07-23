import { LocationSelectorValue } from '@/src/shared/model/location-selector-model';
import { TransactionType } from '@/src/shared/model/transaction-type-model';

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
