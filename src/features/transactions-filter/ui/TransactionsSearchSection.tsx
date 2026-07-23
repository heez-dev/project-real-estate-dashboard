'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
} from 'ag-grid-community';
import { AgGridReact, type CustomCellRendererProps } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type {
  ApartmentTradeSearchParams,
  ApartmentTradeSearchResult,
} from '@/src/entities/apartment-trade/model/apartment-trade';
import {
  filterTransactionTrades,
  requestAllTransactionTrades,
  sortTradesByLatest,
} from '@/src/features/transaction-search/api/request-apartment-trades';
import { parseDashboardFilter } from '@/src/features/dashboard-filter/model/dashboard-filter-schema';
import { getDefaultDashboardFilterValue } from '@/src/features/dashboard-filter/model/dashboard-filter-defaults';
import { createDashboardResultSummary } from '@/src/features/dashboard-result/model/dashboard-result-summary';
import type { TransactionsFilterValue } from '@/src/features/transactions-filter/model/transactions-filter-schema';
import {
  emptyAdvancedTransactionsFilter,
  filterTradesByAdvancedConditions,
  validateAdvancedTransactionFilters,
  type AdvancedTransactionsFilterValue,
} from '@/src/features/transactions-filter/model/transactions-filter-schema';
import { AdvancedTransactionsFilter } from '@/src/features/transactions-filter/ui/AdvancedTransactionsFilter';
import { ContractMonthPicker } from '@/src/shared/components/filter/ContractMonthPicker';
import { LocationSelector } from '@/src/shared/components/filter/LocationSelector';
import { TransactionTypeSelector } from '@/src/shared/components/filter/TransactionTypeSelector';
import type { LocationSelectorValue } from '@/src/shared/model/location-selector-model';
import type { TransactionType } from '@/src/shared/model/transaction-type-model';
import { Card, CardContent } from '@/components/ui/card';
import {
  formatDealDate,
  formatTradeAmount,
  getTradeTypeLabel,
  transactionTypeLabel,
} from '@/src/features/dashboard-result/model/dashboard-result-format';
import type { ApartmentTrade } from '@/src/entities/apartment-trade/model/apartment-trade';
import { Badge } from '@/components/ui/badge';
import { TransactionDetailDrawer } from '@/src/features/transactions-detail/ui/TransactionDetailDrawer';

ModuleRegistry.registerModules([AllCommunityModule]);

type TransactionsSearchSectionProps = {
  initialFilter?: TransactionsFilterValue;
  initialParams?: ApartmentTradeSearchParams[];
  initialResults?: ApartmentTradeSearchResult[];
};

export function TransactionsSearchSection({
  initialFilter,
  initialParams,
  initialResults,
}: TransactionsSearchSectionProps) {
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
  const [advancedFilter, setAdvancedFilter] =
    React.useState<AdvancedTransactionsFilterValue>(
      emptyAdvancedTransactionsFilter,
    );
  const [submittedParams, setSubmittedParams] = React.useState<
    ApartmentTradeSearchParams[] | null
  >(() => initialParams ?? parseDashboardFilter(defaultFilterValue).params);
  const [submittedFilter, setSubmittedFilter] =
    React.useState<TransactionsFilterValue>(defaultFilterValue);
  const [searchRequestId, setSearchRequestId] = React.useState(0);
  const [validationMessage, setValidationMessage] = React.useState<string>();
  const [selectedTrade, setSelectedTrade] =
    React.useState<ApartmentTrade | null>(null);
  const initialResult = React.useMemo(() => {
    if (
      !initialResults ||
      !initialParams ||
      submittedParams !== initialParams
    ) {
      return undefined;
    }

    const items = sortTradesByLatest(
      filterTransactionTrades(
        initialResults.flatMap((result) => result.items),
        initialFilter?.transactionType ?? 'all',
      ),
    );

    return {
      items,
      pageNo: 1,
      numOfRows: items.length,
      totalCount: initialResults.reduce(
        (sum, result) => sum + result.totalCount,
        0,
      ),
    };
  }, [
    initialFilter?.transactionType,
    initialParams,
    initialResults,
    submittedParams,
  ]);
  const query = useQuery({
    queryKey: [
      'transactions-apartment-trades',
      searchRequestId,
      submittedParams,
      submittedFilter.transactionType,
    ],
    enabled: submittedParams !== null,
    initialData: initialResult,
    queryFn: () =>
      requestAllTransactionTrades(
        submittedParams ?? [],
        submittedFilter.transactionType,
      ),
    staleTime: 1000 * 60,
  });
  const isSearching = query.isFetching;
  const hasError = query.isError;
  const results = query.data ? [query.data] : [];
  const summary = createDashboardResultSummary({
    results: results.map((result) => ({
      ...result,
      items: filterTradesByAdvancedConditions(result.items, submittedFilter),
    })),
    townNames: submittedFilter.location.townNames,
    transactionType: submittedFilter.transactionType,
  });

  const handleSearch = () => {
    const advancedFilterError =
      validateAdvancedTransactionFilters(advancedFilter);
    if (advancedFilterError) {
      setValidationMessage(advancedFilterError);
      return;
    }

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
      ...advancedFilter,
    });
    setSearchRequestId((currentId) => currentId + 1);
  };

  const trades = summary.targetTrades;
  const handleTransactionTypeChange = (nextType: TransactionType) => {
    setTransactionType(nextType);
    setAdvancedFilter((current) => ({
      ...current,
      ...(nextType === 'sale'
        ? {
            minDepositAmount: undefined,
            maxDepositAmount: undefined,
            minMonthlyRent: undefined,
            maxMonthlyRent: undefined,
          }
        : {}),
      ...(nextType === 'jeonse'
        ? {
            minDealAmount: undefined,
            maxDealAmount: undefined,
            minMonthlyRent: undefined,
            maxMonthlyRent: undefined,
          }
        : {}),
      ...(nextType === 'monthly-rent'
        ? {
            minDealAmount: undefined,
            maxDealAmount: undefined,
          }
        : {}),
    }));
  };
  const columnDefs = React.useMemo<ColDef<ApartmentTrade>[]>(
    () => [
      ...(submittedFilter.transactionType === 'all'
        ? [
            {
              field: 'tradeType',
              headerName: '거래유형',
              width: 100,
              sortable: true,
              cellRenderer: (
                props: CustomCellRendererProps<
                  ApartmentTrade,
                  ApartmentTrade['tradeType']
                >,
              ) => (
                <Badge variant="ghost">
                  {props.data ? getTradeTypeLabel(props.data) : '-'}
                </Badge>
              ),
            } satisfies ColDef<ApartmentTrade>,
          ]
        : []),
      {
        field: 'apartmentName',
        headerName: '아파트명',
        flex: 1,
        width: 220,
        minWidth: 220,
        sortable: true,
      },
      {
        field: 'legalDong',
        headerName: '법정동',
        width: 110,
        minWidth: 100,
        sortable: true,
      },
      {
        headerName: '금액',
        width: 150,
        minWidth: 150,
        sortable: true,
        valueGetter: ({ data }) => (data ? formatTradeAmount(data) : '-'),
      },
      {
        field: 'exclusiveArea',
        headerName: '전용면적',
        width: 120,
        minWidth: 120,
        sortable: true,
        valueFormatter: ({ value }) => (value == null ? '-' : `${value}㎡`),
      },
      {
        field: 'floor',
        headerName: '층',
        width: 80,
        minWidth: 70,
        sortable: true,
        valueFormatter: ({ value }) => (value == null ? '-' : `${value}층`),
      },
      {
        field: 'buildYear',
        headerName: '건축년도',
        width: 105,
        minWidth: 95,
        sortable: true,
        valueFormatter: ({ value }) => (value == null ? '-' : `${value}년`),
      },
      {
        headerName: '계약일',
        width: 120,
        minWidth: 120,
        sortable: true,
        sort: 'desc',
        valueGetter: ({ data }) => (data ? formatDealDate(data) : '-'),
      },
    ],
    [submittedFilter.transactionType],
  );

  if (hasError) {
    return (
      <p className="text-sm text-red-600">거래 데이터를 조회하지 못했습니다.</p>
    );
  }

  return (
    <section className="rounded-lg border border-border bg-card p-3 shadow-sm sm:p-4">
      <TransactionTypeSelector
        value={transactionType}
        onValueChange={handleTransactionTypeChange}
      />

      <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-[1fr_1fr_1fr_1fr] lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        <ContractMonthPicker
          value={contractMonth}
          onValueChange={setContractMonth}
        />
        <LocationSelector value={location} onValueChange={setLocation} />
        <div className="sm:col-span-2 md:col-span-4 lg:col-span-1 lg:flex lg:items-end">
          <Button
            type="button"
            className="h-8 w-full min-w-20 lg:h-full"
            disabled={isSearching}
            onClick={handleSearch}
          >
            <Search className="size-4" aria-hidden="true" />
            조회
          </Button>
        </div>
      </div>

      <AdvancedTransactionsFilter
        transactionType={transactionType}
        value={advancedFilter}
        onValueChange={setAdvancedFilter}
      />

      {validationMessage ? (
        <p className="mt-3 text-xs text-red-600 dark:text-red-400">
          {validationMessage}
        </p>
      ) : null}

      {isSearching && trades.length === 0 ? (
        <Card className="mt-4 bg-card">
          <CardContent className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Spinner aria-label="거래 결과 로딩 중" /> 거래 데이터를 조회하는
            중입니다.
          </CardContent>
        </Card>
      ) : null}

      {query.data ? (
        <div>
          <div className="py-2 text-sm text-right text-muted-foreground">
            {transactionTypeLabel[submittedFilter.transactionType]} 검색 결과{' '}
            {trades.length.toLocaleString()}건
          </div>
          <div className="ag-theme-quartz app-data-grid h-[min(65vh,36rem)] w-full min-w-0">
            <AgGridReact<ApartmentTrade>
              columnDefs={columnDefs}
              rowData={trades}
              getRowId={({ data }) => data.id}
              defaultColDef={{ resizable: true, sortable: true }}
              suppressCellFocus={true}
              suppressScrollOnNewData
              rowClass="cursor-pointer"
              onRowClicked={({ data }) => {
                if (data) {
                  setSelectedTrade(data);
                }
              }}
              theme="legacy"
              overlayNoRowsTemplate="조회 결과가 없습니다."
            />
          </div>
        </div>
      ) : null}
      <TransactionDetailDrawer
        trade={selectedTrade}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTrade(null);
          }
        }}
      />
    </section>
  );
}
