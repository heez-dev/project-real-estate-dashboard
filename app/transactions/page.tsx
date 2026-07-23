import { unstable_rethrow } from 'next/navigation';
import { fetchAllApartmentTrades } from '@/src/entities/apartment-trade/api/fetch-apartment-trades';
import { parseDashboardFilter } from '@/src/features/dashboard-filter/model/dashboard-filter-schema';
import { parseDashboardFilterQuery } from '@/src/features/dashboard-filter/model/dashboard-filter-query';
import { TransactionsSearchSection } from '@/src/features/transactions-filter/ui/TransactionsSearchSection';

export default async function TransactionsPage({
  searchParams,
}: PageProps<'/transactions'>) {
  const initialFilter = parseDashboardFilterQuery(await searchParams);
  const { params: initialParams } = parseDashboardFilter(initialFilter);
  const initialResults = initialParams
    ? await Promise.all(
        initialParams.map((params) => fetchAllApartmentTrades(params)),
      ).catch((error: unknown) => {
        unstable_rethrow(error);
        console.error(
          'Transactions initial apartment trade fetch failed.',
          error,
        );

        return undefined;
      })
    : undefined;

  return (
    <div className="mx-auto grid max-w-7xl gap-6">
      <header>
        <h1 className="text-[28px] font-bold leading-9 text-foreground">
          거래조회
        </h1>
      </header>
      <TransactionsSearchSection
        initialFilter={initialFilter}
        initialParams={initialParams ?? undefined}
        initialResults={initialResults}
      />
    </div>
  );
}
