export const ALL_LOCATION_VALUE = 'all';
export const LOCATION_GROUP_VALUE_SEPARATOR = ',';

export type LocationSelectorValue = {
  provinceCode: string;
  districtCode: string;
  townCode: string;
  townNames: string[];
};

export const defaultLocationValue: LocationSelectorValue = {
  districtCode: '11680',
  provinceCode: '11',
  townCode: ALL_LOCATION_VALUE,
  townNames: [],
};

export function createLocationGroupValue(values: string[]) {
  // 표시명은 같지만 법정동 코드가 다른 지역을 하나의 옵션으로 보여주기 위해 여러 값을 묶어 보관한다.
  return [...new Set(values)]
    .sort((a, b) => a.localeCompare(b))
    .join(LOCATION_GROUP_VALUE_SEPARATOR);
}

export function splitLocationGroupValue(value: string) {
  // 그룹 옵션으로 저장한 값을 실제 API 요청에 사용할 개별 코드 목록으로 되돌린다.
  return value
    .split(LOCATION_GROUP_VALUE_SEPARATOR)
    .map((item) => item.trim())
    .filter(Boolean);
}
