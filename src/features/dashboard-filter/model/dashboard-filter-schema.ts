import { z } from 'zod';
import type {
  ApartmentTradeSearchParams,
  ApartmentTradeType,
} from '@/src/entities/apartment-trade/model/apartment-trade';
import {
  ALL_LOCATION_VALUE,
  type LocationSelectorValue,
  splitLocationGroupValue,
} from '@/src/shared/model/location-selector-model';
import type { TransactionType } from '@/src/shared/model/transaction-type-model';

export type DashboardFilterValue = {
  contractMonth?: string;
  location: LocationSelectorValue;
  transactionType: TransactionType;
};

// 화면 입력값을 API 요청 조건으로 바꾸기 전에 검색 가능한 상태인지 검증한다.
const dashboardFilterSchema = z.object({
  contractMonth: z
    .string({
      error: '계약년월을 선택해 주세요.',
    })
    .regex(/^\d{4}-\d{2}$/, '계약년월을 선택해 주세요.'),
  location: z.object({
    districtCode: z
      .string()
      .regex(/^(\d{5})(,\d{5})*$/, '시군구를 선택해 주세요.')
      .refine((value) => value !== ALL_LOCATION_VALUE, {
        message: '시군구를 선택해 주세요.',
      }),
    provinceCode: z.string(),
    townCode: z.string(),
    townNames: z.array(z.string()).optional(),
  }),
  transactionType: z.enum(['all', 'sale', 'jeonse', 'monthly-rent']),
});

function toApartmentTradeTypes(transactionType: TransactionType) {
  // 전체 조회는 매매 API와 전월세 API를 병렬로 호출해야 한다.
  if (transactionType === 'all') {
    return ['sale', 'rent'] satisfies ApartmentTradeType[];
  }

  if (transactionType === 'sale') {
    return ['sale'] satisfies ApartmentTradeType[];
  }

  return ['rent'] satisfies ApartmentTradeType[];
}

export function parseDashboardFilter(value: DashboardFilterValue) {
  const parsed = dashboardFilterSchema.safeParse(value);

  if (!parsed.success) {
    return {
      errorMessage:
        parsed.error.issues[0]?.message ?? '검색 조건을 확인해 주세요.',
      params: null,
    };
  }

  // UI의 YYYY-MM 값과 거래유형 선택값을 공공 API 호출 모델에 맞게 정규화한다.
  // 같은 표시명을 가진 시군구는 "11680,11740"처럼 묶여 들어올 수 있어 개별 요청으로 펼친다.
  const districtCodes = splitLocationGroupValue(parsed.data.location.districtCode);
  const params = toApartmentTradeTypes(parsed.data.transactionType).flatMap(
    (tradeType) => districtCodes.map((lawdCode): ApartmentTradeSearchParams => ({
      dealYearMonth: parsed.data.contractMonth.replace('-', ''),
      lawdCode,
      tradeType,
    })),
  );

  return {
    errorMessage: undefined,
    params,
  };
}
