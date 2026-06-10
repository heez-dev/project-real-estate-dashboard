'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { DateRange, Matcher } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

type PickerType = 'year' | 'month' | 'date';

type BaseProps = Omit<
  React.ComponentProps<typeof Calendar>,
  'mode' | 'selected' | 'onSelect'
> & {
  picker?: PickerType;
  placeholder?: string;
  className?: string;
  fromYear?: number;
  maxDate?: Date;
  toYear?: number;
};

type DatePickerProps =
  | (BaseProps & {
      picker?: 'date';
      mode?: 'single';
      selected?: Date;
      onSelect?: (date: Date | undefined) => void;
    })
  | (BaseProps & {
      picker?: 'date';
      mode: 'range';
      selected?: DateRange;
      onSelect?: (date: DateRange | undefined) => void;
    })
  | (BaseProps & {
      picker: 'year' | 'month';
      mode?: 'single';
      selected?: Date;
      onSelect?: (date: Date | undefined) => void;
    });

const MONTHS = Array.from({ length: 12 }, (_, index) => index);

const pickerPanelClassName =
  'group/calendar w-56 bg-background p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] in-data-[slot=popover-content]:bg-transparent';

const pickerCellButtonClassName =
  'h-(--cell-size) rounded-(--cell-radius) px-2 text-sm font-normal select-none';

function getDateLabel(
  date: Date | undefined,
  placeholder: string,
  picker: PickerType,
) {
  if (!date) return placeholder;

  if (picker === 'year') {
    return format(date, 'yyyy년', { locale: ko });
  }

  if (picker === 'month') {
    return format(date, 'yyyy년 M월', { locale: ko });
  }

  return format(date, 'PPP', { locale: ko });
}

function getRangeLabel(range: DateRange | undefined, placeholder: string) {
  if (!range?.from) return placeholder;

  if (!range.to) {
    return format(range.from, 'PPP', { locale: ko });
  }

  return `${format(range.from, 'PPP', { locale: ko })} - ${format(
    range.to,
    'PPP',
    { locale: ko },
  )}`;
}

function toDisabledMatchers(
  disabled: Matcher | Matcher[] | undefined,
  maxDate: Date | undefined,
) {
  const disabledMatchers = Array.isArray(disabled)
    ? disabled
    : disabled
      ? [disabled]
      : [];

  if (!maxDate) {
    return disabled;
  }

  return [...disabledMatchers, { after: maxDate }];
}

export function DatePicker(props: DatePickerProps) {
  const {
    placeholder = '거래일자를 선택하세요',
    className,
    picker = 'date',
    fromYear = 2000,
    maxDate,
    toYear = new Date().getFullYear(),
  } = props;
  const maxYear = maxDate?.getFullYear();
  const effectiveToYear = maxYear ? Math.min(toYear, maxYear) : toYear;

  const [open, setOpen] = React.useState(false);
  const [internalDate, setInternalDate] = React.useState<Date | undefined>();
  const [internalRange, setInternalRange] = React.useState<
    DateRange | undefined
  >();

  if (props.mode === 'range') {
    const selected = props.selected ?? internalRange;

    const handleSelect = (date: DateRange | undefined) => {
      setInternalRange(date);
      props.onSelect?.(date);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!selected}
            className={cn(
              'w-full justify-between border-input text-left font-normal data-[empty=true]:text-muted-foreground',
              className,
            )}
          >
            <span>{getRangeLabel(selected, placeholder)}</span>
            <CalendarIcon className="size-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            {...props}
            mode="range"
            selected={selected}
            onSelect={handleSelect}
            disabled={toDisabledMatchers(props.disabled, maxDate)}
            endMonth={maxDate ?? props.endMonth}
            locale={ko}
          />
        </PopoverContent>
      </Popover>
    );
  }

  const selected = props.selected ?? internalDate;

  const handleSelect = (date: Date | undefined) => {
    setInternalDate(date);
    props.onSelect?.(date);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!selected}
          className={cn(
            'w-full justify-between border-input text-left font-normal data-[empty=true]:text-muted-foreground',
            className,
          )}
        >
          <span>{getDateLabel(selected, placeholder, picker)}</span>
          <CalendarIcon className="size-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        {picker === 'year' ? (
          <YearPickerPanel
            selected={selected}
            fromYear={fromYear}
            maxDate={maxDate}
            toYear={effectiveToYear}
            onSelect={handleSelect}
          />
        ) : picker === 'month' ? (
          <MonthPickerPanel
            selected={selected}
            fromYear={fromYear}
            maxDate={maxDate}
            toYear={effectiveToYear}
            onSelect={handleSelect}
          />
        ) : (
          <Calendar
            {...props}
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            captionLayout="dropdown"
            disabled={toDisabledMatchers(props.disabled, maxDate)}
            startMonth={new Date(fromYear, 0)}
            endMonth={maxDate ?? new Date(effectiveToYear, 11)}
            locale={ko}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

function YearPickerPanel({
  selected,
  fromYear,
  maxDate,
  toYear,
  onSelect,
}: {
  selected?: Date;
  fromYear: number;
  maxDate?: Date;
  toYear: number;
  onSelect: (date: Date | undefined) => void;
}) {
  const years = React.useMemo(
    () =>
      Array.from(
        { length: toYear - fromYear + 1 },
        (_, index) => fromYear + index,
      ).reverse(),
    [fromYear, toYear],
  );

  return (
    <div className={pickerPanelClassName}>
      <div className="grid max-h-72 grid-cols-3 gap-1 overflow-y-auto">
        {years.map((year) => {
          const isSelected = selected?.getFullYear() === year;
          const isDisabled = maxDate ? year > maxDate.getFullYear() : false;

          return (
            <Button
              key={year}
              type="button"
              variant={isSelected ? 'default' : 'ghost'}
              className={pickerCellButtonClassName}
              disabled={isDisabled}
              onClick={() => onSelect(new Date(year, 0, 1))}
            >
              {year}년
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function MonthPickerPanel({
  selected,
  fromYear,
  maxDate,
  toYear,
  onSelect,
}: {
  selected?: Date;
  fromYear: number;
  maxDate?: Date;
  toYear: number;
  onSelect: (date: Date | undefined) => void;
}) {
  const [viewYear, setViewYear] = React.useState(
    selected?.getFullYear() ?? new Date().getFullYear(),
  );
  const [isYearPanelOpen, setIsYearPanelOpen] = React.useState(false);

  const safeViewYear = Math.min(Math.max(viewYear, fromYear), toYear);
  const years = React.useMemo(
    () =>
      Array.from(
        { length: toYear - fromYear + 1 },
        (_, index) => fromYear + index,
      ).reverse(),
    [fromYear, toYear],
  );

  const handlePreviousYear = () => {
    setViewYear((prev) => Math.max(prev - 1, fromYear));
  };

  const handleNextYear = () => {
    setViewYear((prev) => Math.min(prev + 1, toYear));
  };

  const handleYearSelect = (year: number) => {
    setViewYear(year);
    setIsYearPanelOpen(false);
  };

  return (
    <div className={pickerPanelClassName}>
      <div className="mb-2 flex h-(--cell-size) items-center justify-between gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-(--cell-size) p-0 select-none"
          disabled={safeViewYear <= fromYear}
          onClick={handlePreviousYear}
        >
          <ChevronLeft className="size-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="h-(--cell-size) flex-1 rounded-(--cell-radius) px-(--cell-size) text-sm font-medium select-none"
          aria-expanded={isYearPanelOpen}
          onClick={() => setIsYearPanelOpen((prev) => !prev)}
        >
          {safeViewYear}년
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-(--cell-size) p-0 select-none"
          disabled={safeViewYear >= toYear}
          onClick={handleNextYear}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {isYearPanelOpen ? (
        <div className="grid max-h-72 grid-cols-3 gap-1 overflow-y-auto">
          {years.map((year) => {
            const isSelected = safeViewYear === year;
            const isDisabled = maxDate ? year > maxDate.getFullYear() : false;

            return (
              <Button
                key={year}
                type="button"
                variant={isSelected ? 'default' : 'ghost'}
                className={pickerCellButtonClassName}
                disabled={isDisabled}
                onClick={() => handleYearSelect(year)}
              >
                {year}년
              </Button>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {MONTHS.map((month) => {
            const isSelected =
              selected?.getFullYear() === safeViewYear &&
              selected?.getMonth() === month;
            const isDisabled =
              maxDate !== undefined &&
              (safeViewYear > maxDate.getFullYear() ||
                (safeViewYear === maxDate.getFullYear() &&
                  month > maxDate.getMonth()));

            return (
              <Button
                key={month}
                type="button"
                variant={isSelected ? 'default' : 'ghost'}
                className={pickerCellButtonClassName}
                disabled={isDisabled}
                onClick={() => onSelect(new Date(safeViewYear, month, 1))}
              >
                {month + 1}월
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
