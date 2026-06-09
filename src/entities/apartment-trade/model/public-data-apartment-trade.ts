// data.go.kr XML 응답의 원본 header 구조다.
export type PublicDataResponseHeader = {
  resultCode?: string;
  resultMsg?: string;
};

// 공공데이터 목록 API의 공통 XML 응답 구조다.
export type PublicDataListResponse<TItem> = {
  response?: {
    body?: {
      items?: {
        item?: TItem | TItem[];
      };
      numOfRows?: string; // 한 페이지 결과 수
      pageNo?: string; // 페이지 번호
      totalCount?: string; // 전체 결과 수
    };
    header?: PublicDataResponseHeader;
  };
};

// 아파트 실거래가 API들이 공통으로 내려주는 원본 row 필드다.
// XML 파서가 문자열 그대로 읽어오므로 숫자처럼 보이는 값도 string으로 둔다.
export type PublicDataApartmentTradeCommonRow = {
  aptNm?: string; // 아파트 이름
  buildYear?: string; // 건축년도
  dealDay?: string; // 거래 일자(일)
  dealMonth?: string; // 거래 일자(월)
  dealYear?: string; // 거래 일자(년)
  excluUseAr?: string; // 전용면적
  floor?: string; // 층
  jibun?: string; // 지번
  sggCd?: string; // 법정동 시군구 코드
  umdNm?: string; // 법정동 이름
};

// 아파트 매매 실거래가 API의 원본 row 스키마다.
export type PublicDataApartmentSaleRow = PublicDataApartmentTradeCommonRow & {
  aptDong?: string; // 아파트 동
  buyerGbn?: string; // 매수자
  cdealDay?: string; // 해제 사유 발생일
  cdealType?: string; // 해제 여부
  dealAmount?: string; // 거래 금액
  dealingGbn?: string; // 거래 유형
  estateAgentSggNm?: string; // 중개사 소재지
  landLeaseholdGbn?: string; // 토지임대부 아파트 여부
  rgstDate?: string; // 등기 일자
  slerGbn?: string; // 매도자
};

// 아파트 매매 실거래가 상세 API의 원본 row 스키마다.
export type PublicDataApartmentSaleDetailRow = PublicDataApartmentSaleRow & {
  umdCd?: string; // 법정동 읍면동 코드
  landCd?: string; // 법정동 지번 코드
  bonbun?: string; // 법정동 본번 코드
  bubun?: string; // 법정동 부번 코드
  roadNm?: string; // 도로명
  roadNmSggCd?: string; // 도로명 시군구 코드
  roadNmCd?: string; // 도로명 코드
  roadNmSeq?: string; // 도로명 일련번호 코드
  roadNmbCd?: string; // 도로명 지상지하 코드
  roadNmBonbun?: string; // 도로명 건물 본번호 코드
  roadNmBubun?: string; // 도로명 건물 부번호 코드
  aptSeq?: string; // 아파트 단지 식별자
};

// 아파트 전월세 실거래가 API의 원본 row 스키마다.
export type PublicDataApartmentRentRow = PublicDataApartmentTradeCommonRow & {
  aptSeq?: string; // 아파트 단지 식별자
  contractTerm?: string; // 계약 기간
  contractType?: string; // 계약 구분
  deposit?: string; // 보증금
  monthlyRent?: string; // 월세
  preDeposit?: string; // 종전 계약 보증금
  preMonthlyRent?: string; // 종전 계약 월세
  roadnm?: string; // 도로명
  roadnmbcd?: string; // 도로명 지상지하 코드
  roadnmbonbun?: string; // 도로명 건물 본번호 코드
  roadnmbubun?: string; // 도로명 건물 부번호 코드
  roadnmcd?: string; // 도로명 코드
  roadnmseq?: string; // 도로명 일련번호 코드
  roadnmsggcd?: string; // 도로명 시군구 코드
  useRRRight?: string; // 갱신 요구권 사용
};

// 파서가 거래 유형별 원본 row를 보존할 때 사용하는 union 타입이다.
export type PublicDataApartmentTradeRawItem =
  | PublicDataApartmentSaleRow
  | PublicDataApartmentSaleDetailRow
  | PublicDataApartmentRentRow;
