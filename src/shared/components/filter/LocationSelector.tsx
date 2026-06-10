'use client';

import * as React from 'react';

import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { cn } from '@/lib/utils';
import { Field } from '@/src/shared/components/filter/Field';
import { useLegalDongCodeQuery } from '@/src/features/transaction-search/api/use-legal-dong-code-query';
import {
  ALL_LOCATION_VALUE,
  createLocationGroupValue,
  defaultLocationValue,
  type LocationSelectorValue,
  splitLocationGroupValue,
} from '@/src/shared/model/location-selector-model';

type LocationSelectorProps = {
  value?: LocationSelectorValue;
  defaultValue?: LocationSelectorValue;
  onValueChange?: (value: LocationSelectorValue) => void;
  className?: string;
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
    () => data?.provinceOptions ?? [],
    [data?.provinceOptions],
  );

  const districtOptions = React.useMemo(() => {
    if (!data) {
      return [];
    }

    const districtGroup = data.districtGroups.find(
      (group) => group.provinceCode === selectedValue.provinceCode,
    );
    return districtGroup?.districts ?? [];
  }, [data, selectedValue.provinceCode]);

  const townOptions = React.useMemo(() => {
    if (!data || selectedValue.districtCode === ALL_LOCATION_VALUE) {
      return [allOption];
    }

    // 시군구가 중복 코드 그룹일 수 있으므로 선택된 모든 LAWD_CD에 속한 읍면동을 합쳐 노출한다.
    const selectedDistrictCodes = splitLocationGroupValue(
      selectedValue.districtCode,
    );
    const townGroups = new Map<string, ComboboxOption>();

    data.items
      .filter((item) => selectedDistrictCodes.includes(item.lawdCode))
      .map(
        (item): ComboboxOption => ({
          label: item.label.split(' ').at(-1) ?? item.label,
          value: item.code,
          keywords: [item.name, item.label],
        }),
      )
      .forEach((option) => {
        const existingOption = townGroups.get(option.label);

        if (existingOption) {
          existingOption.value = createLocationGroupValue([
            ...splitLocationGroupValue(existingOption.value),
            option.value,
          ]);
          existingOption.keywords = [
            ...(existingOption.keywords ?? []),
            ...(option.keywords ?? []),
          ];
        } else {
          townGroups.set(option.label, option);
        }
      });

    return [
      allOption,
      ...Array.from(townGroups.values()).sort((a, b) =>
        a.value.localeCompare(b.value),
      ),
    ];
  }, [data, selectedValue.districtCode]);

  const updateValue = React.useCallback(
    (nextValue: LocationSelectorValue) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange],
  );

  const handleProvinceChange = (provinceCode: string) => {
    const districtCode =
      data?.districtGroups.find((group) => group.provinceCode === provinceCode)
        ?.districts[0]?.value ?? ALL_LOCATION_VALUE;

    updateValue({
      districtCode,
      provinceCode,
      townCode: ALL_LOCATION_VALUE,
      townNames: [],
    });
  };

  const handleDistrictChange = (districtCode: string) => {
    updateValue({
      ...selectedValue,
      districtCode,
      townCode: ALL_LOCATION_VALUE,
      townNames: [],
    });
  };

  const handleTownChange = (townCode: string) => {
    const selectedTownNames =
      townCode === ALL_LOCATION_VALUE
        ? []
        : townOptions
            .filter((option) => option.value === townCode)
            .map((option) => option.label);

    updateValue({
      ...selectedValue,
      townCode,
      townNames: selectedTownNames,
    });
  };

  return (
    <div className={cn('contents', className)}>
      <Field label="시/도">
        <Combobox
          disabled={isLoading}
          isLoading={isLoading}
          options={provinceOptions}
          value={selectedValue.provinceCode}
          onValueChange={handleProvinceChange}
          placeholder="시/도 선택"
          searchPlaceholder="시/도를 검색하세요"
          emptyMessage="지역이 없습니다."
        />
      </Field>

      <Field label="시/군/구">
        <Combobox
          disabled={isLoading}
          isLoading={isLoading}
          options={districtOptions}
          value={selectedValue.districtCode}
          onValueChange={handleDistrictChange}
          placeholder="시/군/구 선택"
          searchPlaceholder="시/군/구를 검색하세요"
          emptyMessage="시/군/구가 없습니다."
        />
      </Field>

      <Field label="읍/면/동">
        <Combobox
          disabled={isLoading}
          isLoading={isLoading}
          options={townOptions}
          value={selectedValue.townCode}
          onValueChange={handleTownChange}
          placeholder="읍/면/동 선택"
          searchPlaceholder="읍/면/동을 검색하세요"
          emptyMessage="읍/면/동이 없습니다."
        />
      </Field>
    </div>
  );
}
