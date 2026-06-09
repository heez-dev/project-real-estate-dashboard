export const LEGAL_DONG_REGION_LEVELS = [
  "province",
  "district",
  "town",
] as const;

export type LegalDongRegionLevel =
  (typeof LEGAL_DONG_REGION_LEVELS)[number];

// 공공데이터포털 자동 변환 API가 내려주는 원본 법정동코드 row다.
export type PublicDataLegalDongCodeRow = {
  법정동코드?: number | string;
  법정동명?: string;
  폐지여부?: string;
};

export type PublicDataLegalDongCodeResponse = {
  currentCount?: number;
  data?: PublicDataLegalDongCodeRow[];
  matchCount?: number;
  page?: number;
  perPage?: number;
  totalCount?: number;
};

// 지역 셀렉트와 검색 조건에서 사용하기 쉽게 정제한 법정동 코드 모델이다.
export type LegalDongCode = {
  code: string;
  isActive: boolean;
  label: string;
  lawdCode: string;
  level: LegalDongRegionLevel;
  name: string;
  provinceCode: string;
  provinceName: string;
};

export type LegalDongCodeOption = {
  label: string;
  value: string;
};

// 시도 셀렉트 선택값으로 시군구 옵션을 찾기 위한 그룹 모델이다.
export type LegalDongCodeDistrictGroup = {
  districts: LegalDongCodeOption[];
  provinceCode: string;
  provinceName: string;
};

export type LegalDongCodeSearchResult = {
  // 지역/구 2단 셀렉트용 그룹 데이터다.
  districtGroups: LegalDongCodeDistrictGroup[];
  items: LegalDongCode[];
  // level 쿼리 기준의 평면 셀렉트 옵션이다.
  options: LegalDongCodeOption[];
  // 첫 번째 지역 셀렉트에 표시할 시도 옵션이다.
  provinceOptions: LegalDongCodeOption[];
  totalCount: number;
};
