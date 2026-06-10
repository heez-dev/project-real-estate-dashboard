import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import type { ApartmentTradeSearchResult } from '@/src/entities/apartment-trade/model/apartment-trade';
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
import type { TransactionType } from '@/src/shared/model/transaction-type-model';

type DashboardTradeResultsProps = {
  hasError: boolean;
  isLoading: boolean;
  isPreviousMonthLoading: boolean;
  previousMonthResults: ApartmentTradeSearchResult[];
  results: ApartmentTradeSearchResult[];
  townNames?: string[];
  transactionType: TransactionType;
};

export function DashboardTradeResults({
  hasError,
  isLoading,
  isPreviousMonthLoading,
  previousMonthResults,
  results,
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
        {shouldShowTopLegalDongs ? <TopLegalDongCard summary={summary} /> : null}
        <RecentTradeTable summary={summary} />
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
      <div className="grid gap-3 md:grid-cols-3">
        <KpiCard
          change={formatMonthlyCountChange({
            currentValue: summary.targetTotalCount,
            isLoading: isPreviousMonthLoading,
            previousValue: previousMonthSummary?.targetTotalCount ?? null,
          })}
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
      <div className="grid gap-3 md:grid-cols-3">
        <KpiCard
          change={formatMonthlyCountChange({
            currentValue: summary.targetTotalCount,
            isLoading: isPreviousMonthLoading,
            previousValue: previousMonthSummary?.targetTotalCount ?? null,
          })}
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
      <div className="grid gap-3 md:grid-cols-3">
        <KpiCard
          change={formatMonthlyCountChange({
            currentValue: summary.targetTotalCount,
            isLoading: isPreviousMonthLoading,
            previousValue: previousMonthSummary?.targetTotalCount ?? null,
          })}
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
    <div className="grid gap-3 md:grid-cols-4">
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

function RecentTradeTable({ summary }: { summary: DashboardResultSummary }) {
  return (
    <Card className="rounded-lg border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          최근 거래 목록
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-180 text-left text-sm">
            <thead className="border-b border-border text-xs text-muted-foreground">
              <tr>
                <th className="py-2 pr-3 font-medium">거래유형</th>
                <th className="py-2 pr-3 font-medium">아파트명</th>
                <th className="py-2 pr-3 font-medium">법정동</th>
                <th className="py-2 pr-3 font-medium">금액</th>
                <th className="py-2 pr-3 font-medium">전용면적</th>
                <th className="py-2 font-medium">계약일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {summary.latestTrades.map((trade) => (
                <tr key={trade.id}>
                  <td className="py-3 pr-3">
                    <Badge variant="ghost">{getTradeTypeLabel(trade)}</Badge>
                  </td>
                  <td className="py-3 pr-3 font-medium">
                    {trade.apartmentName || '-'}
                  </td>
                  <td className="py-3 pr-3 text-muted-foreground">
                    {trade.legalDong || '-'}
                  </td>
                  <td className="py-3 pr-3">{formatTradeAmount(trade)}</td>
                  <td className="py-3 pr-3">
                    {formatExclusiveArea(trade.exclusiveArea)}
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {formatDealDate(trade)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
