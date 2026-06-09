import { useQuery } from "@tanstack/react-query";
import type {
  LegalDongCodeSearchResult,
  LegalDongRegionLevel,
} from "@/src/entities/legal-dong-code/model/legal-dong-code";

export type UseLegalDongCodeQueryParams = {
  enabled?: boolean;
  includeInactive?: boolean;
  level?: LegalDongRegionLevel;
};

export function useLegalDongCodeQuery({
  enabled = true,
  includeInactive = false,
  level = "district",
}: UseLegalDongCodeQueryParams = {}) {
  return useQuery({
    enabled,
    queryFn: () => requestLegalDongCodes({ includeInactive, level }),
    // 법정동 코드는 기준 데이터라 조회 조건별로 장시간 재사용해도 된다.
    queryKey: ["legal-dong-codes", { includeInactive, level }],
    staleTime: 60 * 60 * 1000,
  });
}

// 지역/구 2단 셀렉트에서 바로 사용할 수 있도록 시도 옵션과 선택된 시도의 시군구 옵션을 함께 반환한다.
export function useLegalDongDistrictOptions(provinceCode?: string) {
  const query = useLegalDongCodeQuery();
  const districtOptions =
    query.data?.districtGroups.find(
      (group) => group.provinceCode === provinceCode,
    )?.districts ?? [];

  return {
    ...query,
    districtOptions,
    provinceOptions: query.data?.provinceOptions ?? [],
  };
}

async function requestLegalDongCodes({
  includeInactive,
  level,
}: Required<Omit<UseLegalDongCodeQueryParams, "enabled">>) {
  // 클라이언트는 내부 API만 호출하고, 공공데이터 서비스 키는 서버 라우트에서만 사용한다.
  const searchParams = new URLSearchParams({
    includeInactive: String(includeInactive),
    level,
  });

  const response = await fetch(`/api/legal-dong-codes?${searchParams}`);

  if (!response.ok) {
    throw new Error(`Legal dong code query failed: ${response.status}`);
  }

  return (await response.json()) as LegalDongCodeSearchResult;
}
