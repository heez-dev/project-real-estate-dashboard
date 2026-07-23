'use client';

import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
} from 'ag-grid-community';
import { AgGridReact, type CustomCellRendererProps } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type {
  ApartmentTrade,
  ApartmentTradeSearchResult,
} from '@/src/entities/apartment-trade/model/apartment-trade';
import { createTransactionsHref } from '@/src/features/dashboard-filter/model/dashboard-filter-query';
import {
  formatAmount,
  formatDealDate,
  formatExclusiveArea,
  formatMonthlyChange,
  formatMonthlyCountChange,
  formatSelectedDealYearMonth,
  formatSelectedLocation,
  formatTradeAmount,
  getTradeTypeLabel,
  transactionTypeLabel,
} from '@/src/features/dashboard-result/model/dashboard-result-format';
import {
  createDashboardResultSummary,
  type DashboardResultSummary,
} from '@/src/features/dashboard-result/model/dashboard-result-summary';
import { KpiCard } from '@/src/shared/components/card/KpiCard';
import type { DashboardFilterValue } from '@/src/features/dashboard-filter/model/dashboard-filter-schema';
import type { TransactionType } from '@/src/shared/model/transaction-type-model';

ModuleRegistry.registerModules([AllCommunityModule]);

type DashboardTradeResultsProps = {
  hasError: boolean;
  isLoading: boolean;
  isPreviousMonthLoading: boolean;
  previousMonthResults: ApartmentTradeSearchResult[];
  results: ApartmentTradeSearchResult[];
  submittedFilter: DashboardFilterValue;
  townNames?: string[];
  transactionType: TransactionType;
};

export function DashboardTradeResults({
  hasError,
  isLoading,
  isPreviousMonthLoading,
  previousMonthResults,
  results,
  submittedFilter,
  townNames,
  transactionType,
}: DashboardTradeResultsProps) {
  if (hasError) {
    return (
      <Card className="rounded-lg border-border bg-card shadow-sm">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          조회 결과를 불러오지 못했습니다.
        </CardContent>
      </Card>
    );
  }

  if (isLoading && results.length === 0) {
    return (
      <Card className="rounded-lg border-border bg-card shadow-sm">
        <CardContent className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
          <Spinner aria-label="대시보드 결과 로딩 중" />
          거래 데이터를 조회하는 중입니다.
        </CardContent>
      </Card>
    );
  }

  const summary = createDashboardResultSummary({
    results,
    townNames,
    transactionType,
  });
  const previousMonthSummary =
    previousMonthResults.length > 0
      ? createDashboardResultSummary({
          results: previousMonthResults,
          townNames,
          transactionType,
        })
      : null;

  if (summary.targetTrades.length === 0) {
    return (
      <Card className="rounded-lg border-border bg-card shadow-sm">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          선택한 조건에 해당하는 {transactionTypeLabel[transactionType]} 거래가
          없습니다.
        </CardContent>
      </Card>
    );
  }

  const shouldShowTopLegalDongs = !townNames || townNames.length === 0;

  return (
    <section className="grid gap-4">
      <div className="flex gap-3 items-center justify-between">
        <h2 className="text-lg font-semibold leading-7 text-foreground">
          {transactionTypeLabel[transactionType]} 거래 요약
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default" className="bg-muted text-muted-foreground">
            {formatSelectedDealYearMonth(summary)}
          </Badge>
          <Badge variant="default" className="bg-muted text-muted-foreground">
            {formatSelectedLocation(summary)}
          </Badge>
        </div>
      </div>

      <ResultKpiGrid
        isPreviousMonthLoading={isPreviousMonthLoading}
        previousMonthSummary={previousMonthSummary}
        summary={summary}
      />

      <div
        className={cn(
          'grid gap-4',
          shouldShowTopLegalDongs && 'lg:grid-cols-[1fr_1.4fr]',
        )}
      >
        {shouldShowTopLegalDongs ? (
          <TopLegalDongCard summary={summary} />
        ) : null}
        <RecentTradeTable summary={summary} submittedFilter={submittedFilter} />
      </div>
    </section>
  );
}

function ResultKpiGrid({
  isPreviousMonthLoading,
  previousMonthSummary,
  summary,
}: {
  isPreviousMonthLoading: boolean;
  previousMonthSummary: DashboardResultSummary | null;
  summary: DashboardResultSummary;
}) {
  if (summary.transactionType === 'sale') {
    return (
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
        <KpiCard
          change={formatMonthlyCountChange({
            currentValue: summary.targetTotalCount,
            isLoading: isPreviousMonthLoading,
            previousValue: previousMonthSummary?.targetTotalCount ?? null,
          })}
          className="col-span-2 md:col-span-1"
          label="매매 거래"
          value={summary.targetTotalCount.toLocaleString()}
          unit="건"
        />
        <KpiCard
          change={formatMonthlyChange({
            currentValue: summary.averageDealAmount,
            isLoading: isPreviousMonthLoading,
            previousValue: previousMonthSummary?.averageDealAmount ?? null,
          })}
          label="평균 매매가"
          value={formatAmount(summary.averageDealAmount)}
        />
        <KpiCard
          change={formatMonthlyChange({
            currentValue: summary.highestDealAmount,
            isLoading: isPreviousMonthLoading,
            previousValue: previousMonthSummary?.highestDealAmount ?? null,
          })}
          label="최고 매매가"
          value={formatAmount(summary.highestDealAmount)}
        />
      </div>
    );
  }

  if (summary.transactionType === 'jeonse') {
    return (
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
        <KpiCard
          change={formatMonthlyCountChange({
            currentValue: summary.targetTotalCount,
            isLoading: isPreviousMonthLoading,
            previousValue: previousMonthSummary?.targetTotalCount ?? null,
          })}
          className="col-span-2 md:col-span-1"
          label="전세 거래"
          value={summary.targetTotalCount.toLocaleString()}
          unit="건"
        />
        <KpiCard
          change={formatMonthlyChange({
            currentValue: summary.averageDepositAmount,
            isLoading: isPreviousMonthLoading,
            previousValue: previousMonthSummary?.averageDepositAmount ?? null,
          })}
          label="평균 보증금"
          value={formatAmount(summary.averageDepositAmount)}
        />
        <KpiCard
          change={formatMonthlyChange({
            currentValue: summary.highestDepositAmount,
            isLoading: isPreviousMonthLoading,
            previousValue: previousMonthSummary?.highestDepositAmount ?? null,
          })}
          label="최고 보증금"
          value={formatAmount(summary.highestDepositAmount)}
        />
      </div>
    );
  }

  if (summary.transactionType === 'monthly-rent') {
    return (
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
        <KpiCard
          change={formatMonthlyCountChange({
            currentValue: summary.targetTotalCount,
            isLoading: isPreviousMonthLoading,
            previousValue: previousMonthSummary?.targetTotalCount ?? null,
          })}
          className="col-span-2 md:col-span-1"
          label="월세 거래"
          value={summary.targetTotalCount.toLocaleString()}
          unit="건"
        />
        <KpiCard
          change={formatMonthlyChange({
            currentValue: summary.averageDepositAmount,
            isLoading: isPreviousMonthLoading,
            previousValue: previousMonthSummary?.averageDepositAmount ?? null,
          })}
          label="평균 보증금"
          value={formatAmount(summary.averageDepositAmount)}
        />
        <KpiCard
          change={formatMonthlyChange({
            currentValue: summary.averageMonthlyRent,
            isLoading: isPreviousMonthLoading,
            previousValue: previousMonthSummary?.averageMonthlyRent ?? null,
          })}
          label="평균 월세"
          value={formatAmount(summary.averageMonthlyRent)}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
      <KpiCard
        change={formatMonthlyCountChange({
          currentValue: summary.targetTrades.length,
          isLoading: isPreviousMonthLoading,
          previousValue: previousMonthSummary?.targetTrades.length ?? null,
        })}
        label="전체 거래"
        value={summary.targetTrades.length.toLocaleString()}
        unit="건"
      />
      <KpiCard
        change={formatMonthlyCountChange({
          currentValue: summary.saleCount,
          isLoading: isPreviousMonthLoading,
          previousValue: previousMonthSummary?.saleCount ?? null,
        })}
        label="매매"
        value={summary.saleCount.toLocaleString()}
        unit="건"
      />
      <KpiCard
        change={formatMonthlyCountChange({
          currentValue: summary.jeonseCount,
          isLoading: isPreviousMonthLoading,
          previousValue: previousMonthSummary?.jeonseCount ?? null,
        })}
        label="전세"
        value={summary.jeonseCount.toLocaleString()}
        unit="건"
      />
      <KpiCard
        change={formatMonthlyCountChange({
          currentValue: summary.monthlyRentCount,
          isLoading: isPreviousMonthLoading,
          previousValue: previousMonthSummary?.monthlyRentCount ?? null,
        })}
        label="월세"
        value={summary.monthlyRentCount.toLocaleString()}
        unit="건"
      />
    </div>
  );
}

function TopLegalDongCard({ summary }: { summary: DashboardResultSummary }) {
  return (
    <Card className="rounded-lg border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          법정동별 거래 TOP 5
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {summary.topLegalDongs.map((item) => (
            <div key={item.name} className="grid gap-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{item.name}</span>
                <span className="text-muted-foreground">{item.count}건</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${Math.max(
                      8,
                      (item.count / summary.topLegalDongs[0].count) * 100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentTradeTable({
  summary,
  submittedFilter,
}: {
  summary: DashboardResultSummary;
  submittedFilter: DashboardFilterValue;
}) {
  return (
    <Card className="rounded-lg border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground flex items-center justify-between">
          최근 거래 목록
          <Button asChild variant="link" size="sm" className="text-xs">
            <Link href={createTransactionsHref(submittedFilter)}>더보기</Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="ag-theme-quartz w-full min-w-0">
          <AgGridReact<ApartmentTrade>
            columnDefs={recentTradeColumnDefs}
            rowData={summary.latestTrades}
            getRowId={({ data }) => data.id}
            defaultColDef={{ resizable: true, sortable: true }}
            domLayout="autoHeight"
            suppressCellFocus
            suppressScrollOnNewData
            theme="legacy"
            overlayNoRowsTemplate="최근 거래 내역이 없습니다."
          />
        </div>
      </CardContent>
    </Card>
  );
}

const recentTradeColumnDefs: ColDef<ApartmentTrade>[] = [
  {
    field: 'tradeType',
    headerName: '거래유형',
    width: 100,
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
  },
  {
    field: 'apartmentName',
    headerName: '아파트명',
    minWidth: 180,
    flex: 1,
  },
  {
    field: 'legalDong',
    headerName: '법정동',
    minWidth: 100,
    flex: 1,
  },
  {
    headerName: '금액',
    minWidth: 140,
    flex: 1,
    valueGetter: ({ data }) => (data ? formatTradeAmount(data) : '-'),
  },
  {
    field: 'exclusiveArea',
    headerName: '전용면적',
    width: 120,
    valueFormatter: ({ value }) => formatExclusiveArea(value),
  },
  {
    headerName: '계약일',
    width: 120,
    sort: 'desc',
    valueGetter: ({ data }) => (data ? formatDealDate(data) : '-'),
  },
];
