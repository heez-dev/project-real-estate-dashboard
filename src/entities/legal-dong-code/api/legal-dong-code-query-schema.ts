import { z } from "zod";
import { LEGAL_DONG_REGION_LEVELS } from "@/src/entities/legal-dong-code/model/legal-dong-code";

// 지역 선택 옵션 API의 조회 범위를 내부 API 경계에서 제한한다.
export const legalDongCodeQuerySchema = z.object({
  includeInactive: z.coerce.boolean().default(false),
  level: z.enum(LEGAL_DONG_REGION_LEVELS).default("district"),
});

