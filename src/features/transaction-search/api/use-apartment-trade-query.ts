import {
  requestApartmentTrades,
  RequestApartmentTradesParams,
} from '@/src/features/transaction-search/api/request-apartment-trades';
import { useQuery } from '@tanstack/react-query';

export type UseApartmentTradeQueryParams = RequestApartmentTradesParams & {
  enabled?: boolean;
};

export function useApartmentTradeQuery({
  enabled = true,
  ...params
}: UseApartmentTradeQueryParams) {
  return useQuery({
    enabled,
    queryFn: () => requestApartmentTrades(params),
    // 검색 조건 전체를 키에 포함해 조건별 결과를 독립적으로 캐시한다.
    queryKey: ['apartment-trades', params],
  });
}
