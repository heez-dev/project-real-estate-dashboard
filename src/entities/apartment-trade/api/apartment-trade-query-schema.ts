import { z } from "zod";
import { APARTMENT_TRADE_TYPES } from "@/src/entities/apartment-trade/model/apartment-trade";

// 외부 공공데이터 API를 호출하기 전에 내부 API 경계에서 요청값을 검증한다.
export const apartmentTradeQuerySchema = z.object({
  dealYearMonth: z
    .string()
    .regex(/^\d{6}$/, "dealYearMonth must be YYYYMM format."),
  lawdCode: z.string().regex(/^\d{5}$/, "lawdCode must be 5 digits."),
  numOfRows: z.coerce.number().int().min(1).max(1000).default(100),
  pageNo: z.coerce.number().int().min(1).default(1),
  tradeType: z.enum(APARTMENT_TRADE_TYPES),
});
