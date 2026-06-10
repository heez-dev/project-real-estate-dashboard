import type { DashboardFilterValue } from '@/src/features/dashboard-filter/model/dashboard-filter-schema';
import { defaultLocationValue } from '@/src/shared/model/location-selector-model';
import type { TransactionType } from '@/src/shared/model/transaction-type-model';

export const defaultTransactionType: TransactionType = 'all';

export function getCurrentContractMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}`;
}

// 서버 초기 조회와 클라이언트 필터 초기 상태가 같은 값을 바라보도록 한 곳에서 생성한다.
export function getDefaultDashboardFilterValue(): DashboardFilterValue {
  return {
    contractMonth: getCurrentContractMonth(),
    location: defaultLocationValue,
    transactionType: defaultTransactionType,
  };
}
