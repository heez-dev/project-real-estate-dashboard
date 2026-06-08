import { NextResponse, type NextRequest } from "next/server";
import { apartmentTradeQuerySchema } from "@/src/entities/apartment-trade/api/apartment-trade-query-schema";
import { fetchApartmentTrades } from "@/src/entities/apartment-trade/api/fetch-apartment-trades";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = Object.fromEntries(request.nextUrl.searchParams);
  const parsedQuery = apartmentTradeQuerySchema.safeParse(query);

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
    // 공공데이터 서비스 키는 서버에만 두고, 클라이언트에는 정규화된 데이터만 내려준다.
    const data = await fetchApartmentTrades(parsedQuery.data);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: "APARTMENT_TRADE_API_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Apartment trade API request failed.",
      },
      { status: 500 },
    );
  }
}
