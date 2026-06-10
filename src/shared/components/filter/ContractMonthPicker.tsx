'use client';

import * as React from 'react';

import { DatePicker } from '@/components/ui/date-picker';
import { Field } from '@/src/shared/components/filter/Field';

type ContractMonthPickerProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  className?: string;
  label?: string;
  maxDate?: Date;
  placeholder?: string;
};

function parseContractMonth(value: string | undefined) {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) {
    return undefined;
  }

  const [year, month] = value.split('-').map(Number);

  if (!year || !month || month < 1 || month > 12) {
    return undefined;
  }

  return new Date(year, month - 1, 1);
}

function formatContractMonth(date: Date | undefined) {
  if (!date) {
    return undefined;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}`;
}

export function ContractMonthPicker({
  className,
  defaultValue,
  label = '계약년월',
  maxDate = new Date(),
  onValueChange,
  placeholder = '계약년월을 선택하세요',
  value,
}: ContractMonthPickerProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const selectedValue = value ?? internalValue;
  const isControlled = value !== undefined;

  const handleSelect = (date: Date | undefined) => {
    const nextValue = formatContractMonth(date);

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  };

  return (
    <Field label={label}>
      <DatePicker
        className={className}
        picker="month"
        placeholder={placeholder}
        selected={parseContractMonth(selectedValue)}
        onSelect={handleSelect}
        maxDate={maxDate}
      />
    </Field>
  );
}
