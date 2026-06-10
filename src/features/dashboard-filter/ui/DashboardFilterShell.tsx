import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TransactionTypeSelector } from '@/src/shared/components/filter/TransactionTypeSelector';
import { LocationSelector } from '@/src/shared/components/filter/LocationSelector';
import { ContractMonthPicker } from '@/src/shared/components/filter/ContractMonthPicker';

export function DashboardFilterShell() {
  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <TransactionTypeSelector />

      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_1fr_1fr] lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        <ContractMonthPicker />
        <LocationSelector />
        <div className="md:col-span-4 lg:col-span-1 lg:flex lg:items-end">
          <Button className="h-8 lg:h-full w-full min-w-20">
            <Search className="size-4" aria-hidden="true" />
            조회
          </Button>
        </div>
      </div>
    </section>
  );
}
