import {
  LEGAL_DONG_CODE_ENDPOINT,
  LEGAL_DONG_CODE_FETCH_PAGE_SIZE,
} from "@/src/entities/legal-dong-code/api/public-data-config";
import { normalizeLegalDongCodes } from "@/src/entities/legal-dong-code/api/normalize-legal-dong-code";
import type {
  LegalDongCodeSearchResult,
  LegalDongRegionLevel,
  PublicDataLegalDongCodeResponse,
  PublicDataLegalDongCodeRow,
} from "@/src/entities/legal-dong-code/model/legal-dong-code";
import { getPublicDataServiceKey } from "@/src/shared/api/public-data-service-key";

export type FetchLegalDongCodesParams = {
  includeInactive?: boolean;
  level?: LegalDongRegionLevel;
};

export async function fetchLegalDongCodes({
  includeInactive = false,
  level = "district",
}: FetchLegalDongCodesParams = {}): Promise<LegalDongCodeSearchResult> {
  // 첫 페이지에서 totalCount를 확인한 뒤 남은 페이지를 병렬로 가져온다.
  const firstPage = await fetchLegalDongCodePage(1);
  const totalCount = firstPage.totalCount ?? firstPage.data?.length ?? 0;
  const totalPages = Math.ceil(totalCount / LEGAL_DONG_CODE_FETCH_PAGE_SIZE);
  const remainingPageNumbers = Array.from(
    { length: Math.max(totalPages - 1, 0) },
    (_, index) => index + 2,
  );

  const remainingPages = await Promise.all(
    remainingPageNumbers.map((page) => fetchLegalDongCodePage(page)),
  );

  const rows = [firstPage, ...remainingPages].flatMap((page) =>
    toLegalDongCodeRows(page.data),
  );

  // 외부 API 응답을 화면에서 바로 쓰기 좋은 셀렉트 옵션 구조로 정제한다.
  return normalizeLegalDongCodes({
    includeInactive,
    level,
    rows,
  });
}

async function fetchLegalDongCodePage(page: number) {
  const url = new URL(LEGAL_DONG_CODE_ENDPOINT);

  // 공공데이터포털 자동 변환 API는 page/perPage 형식의 페이지네이션을 사용한다.
  url.searchParams.set("page", String(page));
  url.searchParams.set("perPage", String(LEGAL_DONG_CODE_FETCH_PAGE_SIZE));
  url.searchParams.set("serviceKey", getPublicDataServiceKey());

  const response = await fetch(url, {
    // 법정동 코드는 기준 데이터라 매 요청마다 새로 받을 필요가 없어 하루 단위로 재검증한다.
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) {
    throw new Error(`Legal dong code API request failed: ${response.status}`);
  }

  return (await response.json()) as PublicDataLegalDongCodeResponse;
}

function toLegalDongCodeRows(
  rows?: PublicDataLegalDongCodeRow[],
): PublicDataLegalDongCodeRow[] {
  return rows ?? [];
}
