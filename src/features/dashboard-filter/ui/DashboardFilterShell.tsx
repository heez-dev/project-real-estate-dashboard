import type { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TransactionTypeSelector } from '@/src/shared/components/filter/TransactionTypeSelector';
import { Field } from '@/src/shared/components/filter/Field';
import { LocationSelector } from '@/src/shared/components/filter/LocationSelector';
import { ContractMonthPicker } from '@/src/shared/components/filter/ContractMonthPicker';

type DashboardFilterShellProps = {
  children?: ReactNode;
  showApartmentInput?: boolean;
};

export function DashboardFilterShell({
  children,
  showApartmentInput = false,
}: DashboardFilterShellProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <TransactionTypeSelector />

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_1fr_1fr]">
        <LocationSelector />
        <ContractMonthPicker />
      </div>

      <Button className="mt-4 h-9 w-full min-w-24">
        <Search className="size-4" aria-hidden="true" />
        조회
      </Button>

      {showApartmentInput ? (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <Field label="아파트명">
            <Input className="h-9" placeholder="아파트명을 입력하세요" />
          </Field>
          <div>{children}</div>
        </div>
      ) : (
        children
      )}
    </section>
  );
}
