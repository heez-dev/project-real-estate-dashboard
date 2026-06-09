import type {
  PublicDataApartmentRentRow,
  PublicDataApartmentSaleDetailRow,
  PublicDataApartmentSaleRow,
  PublicDataApartmentTradeRawItem,
} from '@/src/entities/apartment-trade/model/public-data-apartment-trade';

export const APARTMENT_TRADE_TYPES = ['sale', 'sale-detail', 'rent'] as const;

export type ApartmentTradeType = (typeof APARTMENT_TRADE_TYPES)[number];

// 내부 API와 클라이언트 쿼리에서 공통으로 사용하는 검색 조건이다.
export type ApartmentTradeSearchParams = {
  tradeType: ApartmentTradeType; // 거래 유형
  lawdCode: string; // 법정동 코드(시군구 단위)
  dealYearMonth: string; // 거래 년월(YYYYMM)
};

// 화면, 차트, 그리드에서 공통으로 다루기 좋은 정제된 거래 기본 모델이다.
export type ApartmentTradeBase = {
  id: string; // 고유 식별자
  tradeType: ApartmentTradeType; // 거래 유형
  apartmentName: string; // 아파트 이름
  buildYear: number | null; // 건축년도
  dealYear: number | null; // 거래 년도
  dealMonth: number | null; // 거래 월
  dealDay: number | null; // 거래 일
  exclusiveArea: number | null; // 전용면적
  floor: number | null; // 층
  legalDong: string; // 법정동
  jibun: string; // 지번
  regionalCode: string; // 지역 코드
  raw: PublicDataApartmentTradeRawItem; // 원본 데이터
};

// 매매 API는 거래금액 중심으로 내려오며, 전월세 금액 필드는 사용하지 않는다.
export type ApartmentSaleTrade = ApartmentTradeBase & {
  tradeType: 'sale';
  dealAmount: number | null; // 거래금액
  depositAmount: null; // 보증금
  monthlyRent: null; // 월세
  raw: PublicDataApartmentSaleRow;
};

// 매매 상세 API는 매매 기본 정보에 도로명, 본번/부번, 단지 식별자 등이 추가된다.
export type ApartmentSaleDetailTrade = ApartmentTradeBase & {
  tradeType: 'sale-detail';
  dealAmount: number | null; // 거래금액
  depositAmount: null; // 보증금
  monthlyRent: null; // 월세
  raw: PublicDataApartmentSaleDetailRow;
};

// 전월세 API는 보증금과 월세 중심으로 내려오며, 매매 거래금액은 사용하지 않는다.
export type ApartmentRentTrade = ApartmentTradeBase & {
  tradeType: 'rent';
  dealAmount: null; // 거래금액
  depositAmount: number | null; // 보증금
  monthlyRent: number | null; // 월세
  raw: PublicDataApartmentRentRow;
};

// tradeType으로 분기하면 거래 유형별 금액 필드와 raw 타입이 함께 좁혀진다.
export type ApartmentTrade =
  | ApartmentSaleTrade
  | ApartmentSaleDetailTrade
  | ApartmentRentTrade;

// 클라이언트가 검색 결과로 받는 페이지 단위 응답 모델이다.
export type ApartmentTradeSearchResult = {
  items: ApartmentTrade[];
  pageNo: number;
  numOfRows: number;
  totalCount: number;
};

// 공공데이터 응답 헤더를 앱 내부 에러 처리에 맞게 정규화한 모델이다.
export type PublicDataResponseHeader = {
  resultCode: string;
  resultMessage: string;
};
