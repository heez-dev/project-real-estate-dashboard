import { DashboardFilterShell } from '@/src/features/dashboard-filter/ui/DashboardFilterShell';

export default function DashboardPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-6">
      <header>
        <h1 className="text-[28px] font-bold leading-9 text-foreground">
          대시보드
        </h1>
      </header>

      <DashboardFilterShell />
    </div>
  );
}
