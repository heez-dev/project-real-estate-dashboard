export function getPublicDataServiceKey() {
  // URLSearchParams가 요청 URL 생성 시 인코딩하므로 data.go.kr의 Decoding 키를 사용한다.
  const serviceKey = process.env.DATA_GO_KR_SERVICE_KEY;

  if (!serviceKey) {
    throw new Error("DATA_GO_KR_SERVICE_KEY is not configured.");
  }

  return serviceKey;
}

