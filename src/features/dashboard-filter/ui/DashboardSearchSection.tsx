'use client';

import * as React from 'react';
import { useQueries } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { TransactionTypeSelector } from '@/src/shared/components/filter/TransactionTypeSelector';
import { LocationSelector } from '@/src/shared/components/filter/LocationSelector';
import { ContractMonthPicker } from '@/src/shared/components/filter/ContractMonthPicker';
import type {
  ApartmentTradeSearchParams,
  ApartmentTradeSearchResult,
} from '@/src/entities/apartment-trade/model/apartment-trade';
import { requestAllApartmentTrades } from '@/src/features/transaction-search/api/request-apartment-trades';
import {
  parseDashboardFilter,
  type DashboardFilterValue,
} from '@/src/features/dashboard-filter/model/dashboard-filter-schema';
import { getDefaultDashboardFilterValue } from '@/src/features/dashboard-filter/model/dashboard-filter-defaults';
import type { TransactionType } from '@/src/shared/model/transaction-type-model';
import type { LocationSelectorValue } from '@/src/shared/model/location-selector-model';
import { DashboardTradeResults } from '@/src/features/dashboard-result/ui/DashboardTradeResults';
import { useToastStore } from '@/src/shared/stores/use-toast-store';

type DashboardSearchSectionProps = {
  initialFilter?: DashboardFilterValue;
  initialParams?: ApartmentTradeSearchParams[];
  initialResults?: ApartmentTradeSearchResult[];
};

export function DashboardSearchSection({
  initialFilter,
  initialParams,
  initialResults,
}: DashboardSearchSectionProps) {
  const defaultFilterValue = initialFilter ?? getDefaultDashboardFilterValue();
  // 입력 중인 필터 상태와 실제 조회에 사용된 조건을 분리해 조회 버튼 클릭 시점에만 API 요청이 바뀌게 한다.
  const [transactionType, setTransactionType] = React.useState<TransactionType>(
    defaultFilterValue.transactionType,
  );
  const [location, setLocation] = React.useState<LocationSelectorValue>(
    defaultFilterValue.location,
  );
  const [contractMonth, setContractMonth] = React.useState<string | undefined>(
    defaultFilterValue.contractMonth,
  );
  const [submittedParams, setSubmittedParams] = React.useState<
    ApartmentTradeSearchParams[] | null
  >(() => initialParams ?? parseDashboardFilter(defaultFilterValue).params);
  const [submittedFilter, setSubmittedFilter] =
    React.useState<DashboardFilterValue>(defaultFilterValue);
  const [validationMessage, setValidationMessage] = React.useState<string>();
  const showToast = useToastStore((state) => state.showToast);

  const queries = useQueries({
    queries:
      submittedParams?.map((params, index) => ({
        // SSR에서 받은 초기 결과는 첫 기본 검색 조건에만 연결하고, 사용자가 다시 조회하면 새 요청으로 갱신한다.
        initialData:
          submittedParams === initialParams
            ? initialResults?.[index]
            : undefined,
        queryFn: () => requestAllApartmentTrades(params),
        queryKey: ['dashboard-apartment-trades', params],
        staleTime: 1000 * 60,
      })) ?? [],
  });
  const previousMonthParams = React.useMemo(
    () =>
      submittedParams?.map((params) => ({
        ...params,
        dealYearMonth: getPreviousDealYearMonth(params.dealYearMonth),
      })) ?? null,
    [submittedParams],
  );
  const previousMonthQueries = useQueries({
    queries:
      previousMonthParams?.map((params) => ({
        queryFn: () => requestAllApartmentTrades(params),
        queryKey: ['dashboard-apartment-trades-previous-month', params],
        staleTime: 1000 * 60,
      })) ?? [],
  });

  const isSearching = queries.some((query) => query.isFetching);
  const hasError = queries.some((query) => query.isError);
  const hasAnyQueryError = [...queries, ...previousMonthQueries].some(
    (query) => query.isError,
  );
  const errorToastKey = [...queries, ...previousMonthQueries]
    .map((query) => query.errorUpdatedAt)
    .filter(Boolean)
    .join('-');
  const isCurrentResultReady =
    submittedParams !== null &&
    queries.length === submittedParams.length &&
    queries.every((query) => query.data && !query.isFetching);
  const results = isCurrentResultReady
    ? queries
        .map((query) => query.data)
        .filter((result): result is ApartmentTradeSearchResult =>
          Boolean(result),
        )
    : [];
  const isPreviousMonthLoading = previousMonthQueries.some(
    (query) => query.isFetching,
  );
  const isPreviousMonthResultReady =
    previousMonthParams !== null &&
    previousMonthQueries.length === previousMonthParams.length &&
    previousMonthQueries.every((query) => query.data && !query.isFetching);
  const previousMonthResults = isPreviousMonthResultReady
    ? previousMonthQueries
        .map((query) => query.data)
        .filter((result): result is ApartmentTradeSearchResult =>
          Boolean(result),
        )
    : [];

  React.useEffect(() => {
    if (!hasAnyQueryError || !errorToastKey) {
      return;
    }

    showToast({
      description: '잠시 후 다시 조회하거나 검색 조건을 변경해 주세요.',
      title: '거래 데이터를 조회하지 못했습니다.',
      variant: 'error',
    });
  }, [errorToastKey, hasAnyQueryError, showToast]);

  const handleSearch = () => {
    // Zod 검증과 API 파라미터 변환을 model 레이어에 위임해 UI 컴포넌트는 상태 전환만 담당한다.
    const { errorMessage, params } = parseDashboardFilter({
      contractMonth,
      location,
      transactionType,
    });

    setValidationMessage(errorMessage);

    if (!params) {
      return;
    }

    setSubmittedParams(params);
    setSubmittedFilter({
      contractMonth,
      location,
      transactionType,
    });
  };

  return (
    <>
      <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <TransactionTypeSelector
          value={transactionType}
          onValueChange={setTransactionType}
        />

        <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_1fr_1fr] lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
          <ContractMonthPicker
            value={contractMonth}
            onValueChange={setContractMonth}
          />
          <LocationSelector value={location} onValueChange={setLocation} />
          <div className="md:col-span-4 lg:col-span-1 lg:flex lg:items-end">
            <Button
              type="button"
              className="h-8 w-full min-w-20 lg:h-full"
              disabled={isSearching}
              onClick={handleSearch}
            >
              {isSearching ? (
                <Spinner
                  className="size-4 text-current"
                  aria-label="거래 데이터 조회 중"
                />
              ) : (
                <Search className="size-4" aria-hidden="true" />
              )}
              {isSearching ? '조회 중' : '조회'}
            </Button>
          </div>
        </div>

        {validationMessage ? (
          <p className="mt-3 text-xs text-red-600 dark:text-red-400">
            {validationMessage}
          </p>
        ) : null}
      </section>

      <DashboardTradeResults
        hasError={hasError}
        isLoading={isSearching}
        isPreviousMonthLoading={isPreviousMonthLoading}
        previousMonthResults={previousMonthResults}
        results={results}
        townNames={submittedFilter.location.townNames}
        transactionType={submittedFilter.transactionType}
      />
    </>
  );
}

function getPreviousDealYearMonth(dealYearMonth: string) {
  const year = Number(dealYearMonth.slice(0, 4));
  const month = Number(dealYearMonth.slice(4, 6));

  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return dealYearMonth;
  }

  const previousYear = month === 1 ? year - 1 : year;
  const previousMonth = month === 1 ? 12 : month - 1;

  return `${previousYear}${String(previousMonth).padStart(2, '0')}`;
}
