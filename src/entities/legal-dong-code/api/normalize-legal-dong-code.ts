import type {
  LegalDongCode,
  LegalDongCodeDistrictGroup,
  LegalDongCodeOption,
  LegalDongCodeSearchResult,
  LegalDongRegionLevel,
  PublicDataLegalDongCodeRow,
} from "@/src/entities/legal-dong-code/model/legal-dong-code";
import {
  createLocationGroupValue,
  splitLocationGroupValue,
} from "@/src/shared/model/location-selector-model";

type NormalizeLegalDongCodesParams = {
  includeInactive: boolean;
  level: LegalDongRegionLevel;
  rows: PublicDataLegalDongCodeRow[];
};

const provinceDisplayNameMap: Record<string, string> = {
  강원특별자치도: "강원도",
  전북특별자치도: "전라북도",
  제주특별자치도: "제주도",
};

export function normalizeLegalDongCodes({
  includeInactive,
  level,
  rows,
}: NormalizeLegalDongCodesParams): LegalDongCodeSearchResult {
  // 원본 row는 문자열/숫자가 섞여 내려오므로 먼저 앱 내부 표준 모델로 맞춘다.
  const normalizedActiveItems = rows
    .map(normalizeLegalDongCode)
    .filter((item): item is LegalDongCode => item !== null)
    .filter((item) => includeInactive || item.isActive);

  // 첫 번째 셀렉트에 사용할 시도 목록이다.
  const provinceItems = normalizedActiveItems
    .filter((item) => item.level === "province")
    .sort((a, b) => a.code.localeCompare(b.code));
  const provinceCodeGroups = toProvinceCodeGroups(provinceItems);

  // 요청된 level의 평면 목록도 유지해 단일 셀렉트나 관리 화면에서 재사용할 수 있게 한다.
  const items = filterSearchableRegionItems(
    normalizedActiveItems.filter((item) => item.level === level),
    level,
  )
    .sort((a, b) => a.code.localeCompare(b.code));

  return {
    // 두 번째 셀렉트에서 선택한 시도에 맞는 시군구 옵션만 꺼내 쓰기 위한 그룹이다.
    districtGroups: toDistrictGroups(
      filterSearchableRegionItems(
        normalizedActiveItems.filter((item) => item.level === "district"),
        "district",
      ),
      provinceCodeGroups,
    ),
    items,
    options: items.map(toLegalDongCodeOption),
    provinceOptions: toProvinceOptions(provinceItems),
    totalCount: items.length,
  };
}

function filterSearchableRegionItems(
  items: LegalDongCode[],
  level: LegalDongRegionLevel,
) {
  if (level !== "district") {
    return items;
  }

  // "경기도 수원시"처럼 하위 구가 따로 존재하는 상위 시 코드는 실거래가 조회용 옵션에서 제외한다.
  return items.filter(
    (item) =>
      !items.some(
        (candidate) =>
          candidate.code !== item.code &&
          candidate.name.startsWith(`${item.name} `),
      ),
  );
}

function normalizeLegalDongCode(
  row: PublicDataLegalDongCodeRow,
): LegalDongCode | null {
  const code = String(row.법정동코드 ?? "").padStart(10, "0");
  const name = String(row.법정동명 ?? "").trim();
  const displayName = normalizeProvinceDisplayName(name);

  if (!/^\d{10}$/.test(code) || !name) {
    return null;
  }

  const level = getLegalDongRegionLevel(code);

  if (!level) {
    return null;
  }

  return {
    code,
    isActive: row.폐지여부 !== "폐지",
    label: displayName,
    // 아파트 실거래가 API의 LAWD_CD는 10자리 법정동코드가 아니라 앞 5자리 지역코드다.
    lawdCode: code.slice(0, 5),
    level,
    name,
    provinceCode: code.slice(0, 2),
    provinceName: getProvinceName(displayName),
  };
}

function getLegalDongRegionLevel(
  code: string,
): LegalDongRegionLevel | null {
  // 법정동코드는 뒤쪽 0의 개수로 시도/시군구/읍면동 단계를 구분할 수 있다.
  if (code.endsWith("00000000")) {
    return "province";
  }

  if (code.endsWith("00000")) {
    return "district";
  }

  return "town";
}

function toLegalDongCodeOption(item: LegalDongCode): LegalDongCodeOption {
  return {
    label: item.label,
    value: item.lawdCode,
  };
}

function toDistrictGroups(
  districtItems: LegalDongCode[],
  provinceCodeGroups: Map<string, string[]>,
): LegalDongCodeDistrictGroup[] {
  const groupMap = new Map<string, LegalDongCodeDistrictGroup>();

  // 표시명이 같은 시도는 하나의 선택값으로 합치고, 해당 시도의 모든 코드에 속한 시군구를 함께 노출한다.
  districtItems
    .sort((a, b) => a.code.localeCompare(b.code))
    .forEach((item) => {
      const provinceCodes = provinceCodeGroups.get(item.provinceName) ?? [
        item.provinceCode,
      ];
      const provinceGroupValue = createProvinceGroupValue(provinceCodes);
      const group = groupMap.get(provinceGroupValue) ?? {
        districts: [],
        provinceCode: provinceGroupValue,
        provinceName: item.provinceName,
      };
      const districtLabel = item.label.replace(`${item.provinceName} `, "");
      const existingDistrict = group.districts.find(
        (district) => district.label === districtLabel,
      );

      if (existingDistrict) {
        existingDistrict.value = createLocationGroupValue([
          ...splitLocationGroupValue(existingDistrict.value),
          item.lawdCode,
        ]);
      } else {
        group.districts.push({
          label: districtLabel,
          value: item.lawdCode,
        });
      }

      group.districts.sort((a, b) => a.value.localeCompare(b.value));
      groupMap.set(provinceGroupValue, group);
    });

  return Array.from(groupMap.values());
}

function toProvinceOptions(items: LegalDongCode[]): LegalDongCodeOption[] {
  return Array.from(toProvinceCodeGroups(items).entries())
    .map(([provinceName, provinceCodes]) => ({
      label: provinceName,
      value: createProvinceGroupValue(provinceCodes),
    }))
    .sort((a, b) => a.value.localeCompare(b.value));
}

function toProvinceCodeGroups(items: LegalDongCode[]) {
  const groupMap = new Map<string, string[]>();

  items.forEach((item) => {
    const provinceCodes = groupMap.get(item.provinceName) ?? [];

    if (!provinceCodes.includes(item.provinceCode)) {
      provinceCodes.push(item.provinceCode);
    }

    groupMap.set(item.provinceName, provinceCodes);
  });

  return groupMap;
}

function createProvinceGroupValue(provinceCodes: string[]) {
  return createLocationGroupValue(provinceCodes);
}

function getProvinceName(name: string) {
  return name.split(" ")[0] ?? name;
}

function normalizeProvinceDisplayName(name: string) {
  const [provinceName, ...regionNames] = name.split(" ");
  // 법정동 원천 데이터에는 과거 행정명과 현재 행정명이 함께 남아 있어 화면 표시명은 현재 프로젝트 기준으로 통일한다.
  const normalizedProvinceName =
    provinceDisplayNameMap[provinceName] ??
    provinceName.replaceAll("직할시", "광역시");

  return [normalizedProvinceName, ...regionNames].join(" ");
}
