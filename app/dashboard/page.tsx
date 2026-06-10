import { unstable_rethrow } from 'next/navigation';
import { fetchAllApartmentTrades } from '@/src/entities/apartment-trade/api/fetch-apartment-trades';
import { getDefaultDashboardFilterValue } from '@/src/features/dashboard-filter/model/dashboard-filter-defaults';
import { parseDashboardFilter } from '@/src/features/dashboard-filter/model/dashboard-filter-schema';
import { DashboardSearchSection } from '@/src/features/dashboard-filter/ui/DashboardSearchSection';

export default async function DashboardPage() {
  const initialFilter = getDefaultDashboardFilterValue();
  const { params: initialParams } = parseDashboardFilter(initialFilter);
  // 첫 화면은 서버에서 기본 검색 결과를 받아 렌더링하고, 이후 검색은 클라이언트 query가 담당한다.
  const initialResults = initialParams
    ? await Promise.all(
        initialParams.map((params) => fetchAllApartmentTrades(params)),
      ).catch((error: unknown) => {
        unstable_rethrow(error);
        console.error('Dashboard initial apartment trade fetch failed.', error);

        return undefined;
      })
    : undefined;

  return (
    <div className="mx-auto grid max-w-7xl gap-6">
      <header>
        <h1 className="text-[28px] font-bold leading-9 text-foreground">
          대시보드
        </h1>
      </header>

      <DashboardSearchSection
        initialFilter={initialFilter}
        initialParams={initialParams ?? undefined}
        initialResults={initialResults}
      />
    </div>
  );
}
