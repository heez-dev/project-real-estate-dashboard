'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { TransactionType } from '@/src/shared/model/transaction-type-model';

type TransactionTypeOption = {
  label: string;
  value: TransactionType;
};

type TransactionTypeSelectorProps = {
  value?: TransactionType;
  defaultValue?: TransactionType;
  onValueChange?: (value: TransactionType) => void;
  className?: string;
  label?: string;
};

const transactionTypeOptions = [
  { label: '전체', value: 'all' },
  { label: '매매', value: 'sale' },
  { label: '전세', value: 'jeonse' },
  { label: '월세', value: 'monthly-rent' },
] satisfies TransactionTypeOption[];

export function TransactionTypeSelector({
  className,
  defaultValue = 'all',
  label = '거래유형',
  onValueChange,
  value,
}: TransactionTypeSelectorProps) {
  return (
    <div className={cn('grid gap-1.5', className)}>
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <RadioGroup
        value={value}
        defaultValue={defaultValue}
        onValueChange={(nextValue) =>
          onValueChange?.(nextValue as TransactionType)
        }
        className="grid h-9 grid-cols-4 gap-1 rounded-lg border border-border bg-muted/60 p-0.5"
        aria-label={label}
      >
        {transactionTypeOptions.map((option) => (
          <RadioGroupItem
            key={option.value}
            value={option.value}
            className="h-full rounded-md border-0 bg-transparent px-2 text-sm font-medium text-muted-foreground shadow-none hover:bg-muted hover:text-foreground data-[state=checked]:bg-blue-600 data-[state=checked]:text-white data-[state=checked]:shadow-sm data-[state=checked]:hover:bg-blue-600 dark:hover:bg-muted dark:data-[state=checked]:bg-blue-500 dark:data-[state=checked]:text-white dark:data-[state=checked]:hover:bg-blue-500"
          >
            {option.label}
          </RadioGroupItem>
        ))}
      </RadioGroup>
    </div>
  );
}
