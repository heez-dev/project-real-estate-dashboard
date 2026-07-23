import type { DashboardFilterValue } from '@/src/features/dashboard-filter/model/dashboard-filter-schema';
import { getDefaultDashboardFilterValue } from '@/src/features/dashboard-filter/model/dashboard-filter-defaults';
import { ALL_LOCATION_VALUE } from '@/src/shared/model/location-selector-model';
import type { TransactionType } from '@/src/shared/model/transaction-type-model';

const transactionTypes = new Set<TransactionType>([
  'all',
  'sale',
  'jeonse',
  'monthly-rent',
]);

export function createTransactionsHref(filter: DashboardFilterValue) {
  const searchParams = new URLSearchParams({
    contractMonth: filter.contractMonth ?? '',
    districtCode: filter.location.districtCode,
    provinceCode: filter.location.provinceCode,
    townCode: filter.location.townCode,
    transactionType: filter.transactionType,
  });

  if (filter.location.townNames.length > 0) {
    searchParams.set('townNames', filter.location.townNames.join(','));
  }

  return `/transactions?${searchParams.toString()}`;
}

export function parseDashboardFilterQuery(
  query: Record<string, string | string[] | undefined>,
): DashboardFilterValue {
  const defaults = getDefaultDashboardFilterValue();
  const getValue = (key: string) => {
    const value = query[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const transactionType = getValue('transactionType');
  const townNames = getValue('townNames')
    ?.split(',')
    .map((name) => name.trim())
    .filter(Boolean);

  return {
    contractMonth: getValue('contractMonth') || defaults.contractMonth,
    location: {
      districtCode: getValue('districtCode') ?? defaults.location.districtCode,
      provinceCode: getValue('provinceCode') ?? defaults.location.provinceCode,
      townCode: getValue('townCode') ?? ALL_LOCATION_VALUE,
      townNames: townNames ?? [],
    },
    transactionType: transactionTypes.has(transactionType as TransactionType)
      ? (transactionType as TransactionType)
      : defaults.transactionType,
  };
}
