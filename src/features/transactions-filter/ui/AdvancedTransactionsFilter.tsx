'use client';

import * as React from 'react';
import { ChevronDown, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field } from '@/src/shared/components/filter/Field';
import type { TransactionType } from '@/src/shared/model/transaction-type-model';
import {
  countAdvancedTransactionFilters,
  emptyAdvancedTransactionsFilter,
  type AdvancedTransactionsFilterValue,
} from '@/src/features/transactions-filter/model/transactions-filter-schema';
import { cn } from '@/lib/utils';

type AdvancedTransactionsFilterProps = {
  transactionType: TransactionType;
  value: AdvancedTransactionsFilterValue;
  onValueChange: (value: AdvancedTransactionsFilterValue) => void;
};

export function AdvancedTransactionsFilter({
  transactionType,
  value,
  onValueChange,
}: AdvancedTransactionsFilterProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const appliedCount = countAdvancedTransactionFilters(value);

  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-border bg-muted/20">
      <button
        type="button"
        className="flex min-h-10 w-full items-center justify-between gap-3 px-3 py-2 text-left outline-none transition-colors hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/40"
        aria-controls="advanced-transaction-filters"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          상세 조건
          {appliedCount > 0 ? (
            <Badge variant="ghost">{appliedCount}개 입력</Badge>
          ) : (
            <span className="text-xs font-normal text-muted-foreground">
              금액·면적·건축년도·층
            </span>
          )}
        </span>
        <ChevronDown
          className={cn(
            'size-4 text-muted-foreground transition-transform',
            isOpen && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div
          id="advanced-transaction-filters"
          className="border-t border-border px-3 py-3"
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {(transactionType === 'all' || transactionType === 'sale') && (
              <RangeField
                label="거래금액 (만원)"
                minValue={value.minDealAmount}
                maxValue={value.maxDealAmount}
                onMinChange={(nextValue) =>
                  onValueChange({ ...value, minDealAmount: nextValue })
                }
                onMaxChange={(nextValue) =>
                  onValueChange({ ...value, maxDealAmount: nextValue })
                }
              />
            )}
            {(transactionType === 'all' ||
              transactionType === 'jeonse' ||
              transactionType === 'monthly-rent') && (
              <RangeField
                label="보증금 (만원)"
                minValue={value.minDepositAmount}
                maxValue={value.maxDepositAmount}
                onMinChange={(nextValue) =>
                  onValueChange({ ...value, minDepositAmount: nextValue })
                }
                onMaxChange={(nextValue) =>
                  onValueChange({ ...value, maxDepositAmount: nextValue })
                }
              />
            )}
            {(transactionType === 'all' ||
              transactionType === 'monthly-rent') && (
              <RangeField
                label="월세 (만원)"
                minValue={value.minMonthlyRent}
                maxValue={value.maxMonthlyRent}
                onMinChange={(nextValue) =>
                  onValueChange({ ...value, minMonthlyRent: nextValue })
                }
                onMaxChange={(nextValue) =>
                  onValueChange({ ...value, maxMonthlyRent: nextValue })
                }
              />
            )}
            <RangeField
              label="건축년도"
              minValue={value.minBuildYear}
              maxValue={value.maxBuildYear}
              minPlaceholder="예: 2000"
              maxPlaceholder="예: 2025"
              onMinChange={(nextValue) =>
                onValueChange({ ...value, minBuildYear: nextValue })
              }
              onMaxChange={(nextValue) =>
                onValueChange({ ...value, maxBuildYear: nextValue })
              }
            />
            <RangeField
              label="전용면적 (㎡)"
              minValue={value.minExclusiveArea}
              maxValue={value.maxExclusiveArea}
              onMinChange={(nextValue) =>
                onValueChange({ ...value, minExclusiveArea: nextValue })
              }
              onMaxChange={(nextValue) =>
                onValueChange({ ...value, maxExclusiveArea: nextValue })
              }
            />
            <RangeField
              label="층"
              minValue={value.minFloor}
              maxValue={value.maxFloor}
              onMinChange={(nextValue) =>
                onValueChange({ ...value, minFloor: nextValue })
              }
              onMaxChange={(nextValue) =>
                onValueChange({ ...value, maxFloor: nextValue })
              }
            />
          </div>

          <div className="mt-3 flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={appliedCount === 0}
              onClick={() =>
                onValueChange(emptyAdvancedTransactionsFilter)
              }
            >
              <RotateCcw aria-hidden="true" />
              상세 조건 초기화
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function RangeField({
  label,
  maxPlaceholder = '최대',
  maxValue,
  minPlaceholder = '최소',
  minValue,
  onMaxChange,
  onMinChange,
}: {
  label: string;
  maxPlaceholder?: string;
  maxValue?: number;
  minPlaceholder?: string;
  minValue?: number;
  onMaxChange: (value?: number) => void;
  onMinChange: (value?: number) => void;
}) {
  return (
    <Field label={label}>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <NumberInput
          aria-label={`${label} 최소`}
          placeholder={minPlaceholder}
          value={minValue}
          onValueChange={onMinChange}
        />
        <span className="text-xs text-muted-foreground" aria-hidden="true">
          ~
        </span>
        <NumberInput
          aria-label={`${label} 최대`}
          placeholder={maxPlaceholder}
          value={maxValue}
          onValueChange={onMaxChange}
        />
      </div>
    </Field>
  );
}

function NumberInput({
  onValueChange,
  value,
  ...props
}: Omit<React.ComponentProps<typeof Input>, 'onChange' | 'type' | 'value'> & {
  onValueChange: (value?: number) => void;
  value?: number;
}) {
  return (
    <Input
      {...props}
      type="number"
      inputMode="decimal"
      min={0}
      value={value ?? ''}
      onChange={(event) => {
        const nextValue = event.target.value;
        onValueChange(nextValue === '' ? undefined : Number(nextValue));
      }}
    />
  );
}
