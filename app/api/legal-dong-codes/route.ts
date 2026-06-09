import { NextResponse, type NextRequest } from "next/server";
import { fetchLegalDongCodes } from "@/src/entities/legal-dong-code/api/fetch-legal-dong-codes";
import { legalDongCodeQuerySchema } from "@/src/entities/legal-dong-code/api/legal-dong-code-query-schema";

export async function GET(request: NextRequest) {
  const query = Object.fromEntries(request.nextUrl.searchParams);
  const parsedQuery = legalDongCodeQuerySchema.safeParse(query);

  if (!parsedQuery.success) {
    return NextResponse.json(
      {
        error: "INVALID_QUERY",
        issues: parsedQuery.error.issues,
      },
      { status: 400 },
    );
  }

  try {
    const data = await fetchLegalDongCodes(parsedQuery.data);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: "LEGAL_DONG_CODE_API_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Legal dong code API request failed.",
      },
      { status: 500 },
    );
  }
}

