import type {
  LegalDongCode,
  LegalDongCodeDistrictGroup,
  LegalDongCodeOption,
  LegalDongCodeSearchResult,
  LegalDongRegionLevel,
  PublicDataLegalDongCodeRow,
} from "@/src/entities/legal-dong-code/model/legal-dong-code";

type NormalizeLegalDongCodesParams = {
  includeInactive: boolean;
  level: LegalDongRegionLevel;
  rows: PublicDataLegalDongCodeRow[];
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
    ),
    items,
    options: items.map(toLegalDongCodeOption),
    provinceOptions: provinceItems.map(toProvinceOption),
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
    label: name,
    // 아파트 실거래가 API의 LAWD_CD는 10자리 법정동코드가 아니라 앞 5자리 지역코드다.
    lawdCode: code.slice(0, 5),
    level,
    name,
    provinceCode: code.slice(0, 2),
    provinceName: getProvinceName(name),
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

function toProvinceOption(item: LegalDongCode): LegalDongCodeOption {
  return {
    label: item.provinceName,
    value: item.provinceCode,
  };
}

function toDistrictGroups(
  districtItems: LegalDongCode[],
): LegalDongCodeDistrictGroup[] {
  const groupMap = new Map<string, LegalDongCodeDistrictGroup>();

  // provinceCode 기준으로 묶어 지역 선택값이 바뀔 때 구 셀렉트 옵션을 빠르게 찾는다.
  districtItems
    .sort((a, b) => a.code.localeCompare(b.code))
    .forEach((item) => {
      const group = groupMap.get(item.provinceCode) ?? {
        districts: [],
        provinceCode: item.provinceCode,
        provinceName: item.provinceName,
      };

      group.districts.push(toLegalDongCodeOption(item));
      groupMap.set(item.provinceCode, group);
    });

  return Array.from(groupMap.values());
}

function getProvinceName(name: string) {
  return name.split(" ")[0] ?? name;
}
