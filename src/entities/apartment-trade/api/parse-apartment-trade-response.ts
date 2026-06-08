import { XMLParser } from "fast-xml-parser";
import type {
  ApartmentTrade,
  ApartmentTradeSearchResult,
  ApartmentTradeSearchParams,
  PublicDataResponseHeader,
} from "@/src/entities/apartment-trade/model/apartment-trade";

const parser = new XMLParser({
  ignoreAttributes: false,
  // "84.97", "120,000"처럼 포맷이 섞인 값은 파싱 후 명시적으로 정규화한다.
  parseTagValue: false,
  trimValues: true,
});

type ParsedPublicDataResponse = {
  response?: {
    body?: {
      items?: {
        item?: unknown;
      };
      numOfRows?: string;
      pageNo?: string;
      totalCount?: string;
    };
    header?: {
      resultCode?: string;
      resultMsg?: string;
    };
  };
};

type ParsedPublicDataResponseHeader = NonNullable<
  ParsedPublicDataResponse["response"]
>["header"];

export function parseApartmentTradeResponse(
  xmlText: string,
  params: ApartmentTradeSearchParams,
): ApartmentTradeSearchResult {
  const parsed = parser.parse(xmlText) as ParsedPublicDataResponse;
  const response = parsed.response;
  const header = normalizeHeader(response?.header);

  if (header.resultCode !== "000") {
    throw new Error(
      `Public data API error: ${header.resultCode} ${header.resultMessage}`,
    );
  }

  const body = response?.body;
  // XML API는 결과가 1건이면 객체, 여러 건이면 배열로 내려준다.
  const rawItems = toArray(body?.items?.item);

  return {
    items: rawItems.map((item, index) =>
      normalizeApartmentTrade(item, index, params),
    ),
    numOfRows: toNumber(body?.numOfRows) ?? 0,
    pageNo: toNumber(body?.pageNo) ?? 1,
    totalCount: toNumber(body?.totalCount) ?? rawItems.length,
  };
}

function normalizeHeader(
  header: ParsedPublicDataResponseHeader,
): PublicDataResponseHeader {
  return {
    resultCode: String(header?.resultCode ?? ""),
    resultMessage: String(header?.resultMsg ?? ""),
  };
}

function normalizeApartmentTrade(
  value: unknown,
  index: number,
  params: ApartmentTradeSearchParams,
): ApartmentTrade {
  const item = toStringRecord(value);
  // 공공데이터 응답은 영문 필드와 한글 필드가 문서/엔드포인트별로 섞일 수 있다.
  const apartmentName = read(item, "aptNm", "아파트");
  const legalDong = read(item, "umdNm", "법정동");
  const jibun = read(item, "jibun", "지번");
  const dealYear = toNumber(read(item, "dealYear", "년"));
  const dealMonth = toNumber(read(item, "dealMonth", "월"));
  const dealDay = toNumber(read(item, "dealDay", "일"));
  const exclusiveArea = toNumber(read(item, "excluUseAr", "전용면적"));

  return {
    apartmentName,
    buildYear: toNumber(read(item, "buildYear", "건축년도")),
    dealAmount: toAmount(read(item, "dealAmount", "거래금액")),
    dealDay,
    dealMonth,
    dealYear,
    depositAmount: toAmount(read(item, "deposit", "보증금액")),
    exclusiveArea,
    floor: toNumber(read(item, "floor", "층")),
    // API가 안정적인 공통 row id를 제공하지 않아 검색 범위와 주요 식별 필드로 조합한다.
    id: [
      params.tradeType,
      params.lawdCode,
      params.dealYearMonth,
      legalDong,
      jibun,
      apartmentName,
      exclusiveArea ?? "area",
      dealYear ?? "year",
      dealMonth ?? "month",
      dealDay ?? "day",
      index,
    ].join("-"),
    jibun,
    legalDong,
    monthlyRent: toAmount(read(item, "monthlyRent", "월세금액")),
    // 실제 응답 필드 검증이 끝날 때까지 원본 row를 함께 보관한다.
    raw: item,
    regionalCode: read(item, "sggCd", "지역코드"),
    tradeType: params.tradeType,
  };
}

function read(
  item: Record<string, string>,
  englishKey: string,
  koreanKey: string,
) {
  return item[englishKey] ?? item[koreanKey] ?? "";
}

function toArray(value: unknown) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function toStringRecord(value: unknown) {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, itemValue]) => [
      key,
      String(itemValue ?? "").trim(),
    ]),
  );
}

function toAmount(value: string) {
  return toNumber(value.replaceAll(",", ""));
}

function toNumber(value?: string) {
  if (!value) {
    return null;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}
