'use client';

import * as React from 'react';

import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { cn } from '@/lib/utils';
import { Field } from '@/src/shared/components/filter/Field';
import { useLegalDongCodeQuery } from '@/src/features/transaction-search/api/use-legal-dong-code-query';

export const ALL_LOCATION_VALUE = 'all';

export type LocationSelectorValue = {
  provinceCode: string;
  districtCode: string;
  townCode: string;
};

type LocationSelectorProps = {
  value?: LocationSelectorValue;
  defaultValue?: LocationSelectorValue;
  onValueChange?: (value: LocationSelectorValue) => void;
  className?: string;
};

const defaultLocationValue: LocationSelectorValue = {
  districtCode: ALL_LOCATION_VALUE,
  provinceCode: ALL_LOCATION_VALUE,
  townCode: ALL_LOCATION_VALUE,
};

const allOption = {
  label: '전체',
  value: ALL_LOCATION_VALUE,
} satisfies ComboboxOption;

export function LocationSelector({
  className,
  defaultValue = defaultLocationValue,
  onValueChange,
  value,
}: LocationSelectorProps) {
  const [internalValue, setInternalValue] =
    React.useState<LocationSelectorValue>(defaultValue);
  const selectedValue = value ?? internalValue;
  const isControlled = value !== undefined;

  const { data, isLoading } = useLegalDongCodeQuery({ level: 'town' });

  const provinceOptions = React.useMemo(
    () => [allOption, ...(data?.provinceOptions ?? [])],
    [data?.provinceOptions],
  );

  const districtOptions = React.useMemo(() => {
    if (!data || selectedValue.provinceCode === ALL_LOCATION_VALUE) {
      return [allOption];
    }

    const districtGroup = data.districtGroups.find(
      (group) => group.provinceCode === selectedValue.provinceCode,
    );
    const districts =
      districtGroup?.districts.map((district) => ({
        ...district,
        label: district.label.replace(`${districtGroup.provinceName} `, ''),
      })) ?? [];

    return [allOption, ...districts];
  }, [data, selectedValue.provinceCode]);

  const townOptions = React.useMemo(() => {
    if (!data || selectedValue.districtCode === ALL_LOCATION_VALUE) {
      return [allOption];
    }

    const towns = data.items
      .filter((item) => item.lawdCode === selectedValue.districtCode)
      .map(
        (item): ComboboxOption => ({
          label: item.name.split(' ').at(-1) ?? item.label,
          value: item.code,
          keywords: [item.name, item.label],
        }),
      );

    return [allOption, ...towns];
  }, [data, selectedValue.districtCode]);

  const updateValue = (nextValue: LocationSelectorValue) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  };

  const handleProvinceChange = (provinceCode: string) => {
    updateValue({
      districtCode: ALL_LOCATION_VALUE,
      provinceCode,
      townCode: ALL_LOCATION_VALUE,
    });
  };

  const handleDistrictChange = (districtCode: string) => {
    updateValue({
      ...selectedValue,
      districtCode,
      townCode: ALL_LOCATION_VALUE,
    });
  };

  const handleTownChange = (townCode: string) => {
    updateValue({
      ...selectedValue,
      townCode,
    });
  };

  return (
    <div className={cn('contents', className)}>
      <Field label="시/도">
        <Combobox
          disabled={isLoading}
          options={provinceOptions}
          value={selectedValue.provinceCode}
          onValueChange={handleProvinceChange}
          placeholder="시/도 선택"
          searchPlaceholder="시/도를 검색하세요"
          emptyMessage="지역이 없습니다."
        />
      </Field>

      <Field label="시군구">
        <Combobox
          disabled={isLoading}
          options={districtOptions}
          value={selectedValue.districtCode}
          onValueChange={handleDistrictChange}
          placeholder="시군구 선택"
          searchPlaceholder="시군구를 검색하세요"
          emptyMessage="시군구가 없습니다."
        />
      </Field>

      <Field label="읍면동">
        <Combobox
          disabled={isLoading}
          options={townOptions}
          value={selectedValue.townCode}
          onValueChange={handleTownChange}
          placeholder="읍면동 선택"
          searchPlaceholder="읍면동을 검색하세요"
          emptyMessage="읍면동이 없습니다."
        />
      </Field>
    </div>
  );
}
