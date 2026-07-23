# 부동산 실거래가 대시보드

공공데이터포털의 국토교통부 OpenAPI를 활용해 국내 아파트 매매·전세·월세 실거래 정보를 조회하고 분석하는 대시보드입니다. 검색 중심의 데이터 조회, 서버/클라이언트 상태 분리, 외부 데이터 정규화 등 엔터프라이즈 대시보드에서 자주 사용하는 구조를 포트폴리오 형태로 구현했습니다.

## 주요 기능

### 대시보드

- 거래 유형(전체·매매·전세·월세), 계약 월, 시·도/시·군·구/법정동 조건 검색
- 거래 건수, 평균·최고 금액과 전월 대비 증감 요약
- 법정동별 거래량 TOP 5 및 최근 거래 목록 제공
- 첫 화면은 서버에서 데이터를 조회하고, 이후 검색은 TanStack Query로 처리
- 거래 행 선택 시 주택·계약 상세 정보를 반응형 드로어로 표시

### 거래 조회

- AG Grid 기반 실거래 목록 정렬 및 열 크기 조절
- 거래 금액, 보증금, 월세, 건축 연도, 전용면적, 층 범위 상세 필터
- 검색 조건을 URL 쿼리로 전달해 대시보드에서 거래 조회 화면으로 연계
- 입력 중인 조건과 실제 조회 조건을 분리해 조회 버튼을 누를 때만 재요청

### 데이터 처리

- 공공 API의 XML 응답을 애플리케이션 내부 모델로 정규화
- 매매와 전월세 API를 거래 유형에 맞게 조합
- 전체 페이지를 조회한 뒤 법정동 필터 및 요약 지표 계산
- Zod를 이용한 내부 API 요청 파라미터 검증
- 공공데이터 서비스 키를 서버에서만 사용하고 클라이언트에는 정규화된 결과만 전달
- 법정동 코드 데이터는 24시간 단위로 재검증

## 기술 스택

| 구분            | 기술                                              |
| --------------- | ------------------------------------------------- |
| 프레임워크      | Next.js 16(App Router), React 19, TypeScript      |
| 스타일/UI       | Tailwind CSS 4, shadcn/ui, Radix UI, Lucide React |
| 데이터 그리드   | AG Grid Community                                 |
| 서버 상태       | TanStack Query                                    |
| 클라이언트 상태 | Zustand                                           |
| 검증/파싱       | Zod, fast-xml-parser                              |
| 패키지 관리     | pnpm                                              |

## 시작하기

### 사전 준비

- Node.js 20.9 이상
- pnpm
- [공공데이터포털](https://www.data.go.kr/) 계정 및 아래 API의 활용 승인
  - 국토교통부 아파트 매매 실거래가 자료
  - 국토교통부 아파트 전월세 자료
  - 법정동 코드 조회 데이터

### 설치 및 환경 변수 설정

```bash
pnpm install
```

프로젝트 루트에 `.env.local` 파일을 만들고 공공데이터포털에서 발급받은 **Decoding 인증키**를 입력합니다.

```dotenv
DATA_GO_KR_SERVICE_KEY=발급받은_디코딩_인증키
```

`URLSearchParams`가 요청 URL을 생성할 때 값을 인코딩하므로 Encoding 인증키가 아닌 Decoding 인증키를 사용해야 합니다. `.env*` 파일은 Git에서 제외되므로 인증키를 저장소에 커밋하지 마세요.

### 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 `/dashboard`로 이동합니다.

### 검사 및 프로덕션 실행

```bash
# ESLint 검사
pnpm lint

# 프로덕션 빌드
pnpm build

# 빌드 결과 실행
pnpm start
```

## 화면 경로

| 경로             | 설명                                    |
| ---------------- | --------------------------------------- |
| `/`              | `/dashboard`로 이동                     |
| `/dashboard`     | 실거래 요약 대시보드                    |
| `/transactions`  | 상세 조건을 지원하는 전체 거래 조회     |
| `/design-system` | 프로젝트 UI 컴포넌트와 디자인 토큰 확인 |

## 내부 API

외부 공공 API 호출과 서비스 키 노출 방지를 위해 Next.js Route Handler를 경계로 사용합니다.

### `GET /api/apartment-trades`

| 파라미터        | 형식                          | 설명                        |
| --------------- | ----------------------------- | --------------------------- |
| `tradeType`     | `sale`, `sale-detail`, `rent` | 조회할 공공 API 유형        |
| `lawdCode`      | 숫자 5자리                    | 시·군·구 법정동 코드        |
| `dealYearMonth` | `YYYYMM`                      | 계약 연월                   |
| `pageNo`        | 1 이상의 정수                 | 페이지 번호, 기본값 `1`     |
| `numOfRows`     | 1~1000                        | 페이지당 건수, 기본값 `100` |

### `GET /api/legal-dong-codes`

| 파라미터          | 형식                           | 설명                                    |
| ----------------- | ------------------------------ | --------------------------------------- |
| `level`           | `province`, `district`, `town` | 반환할 지역 단계, 기본값 `district`     |
| `includeInactive` | boolean                        | 폐지된 법정동 포함 여부, 기본값 `false` |

유효하지 않은 요청은 `400`, 외부 API 호출 실패는 `500` 응답을 반환합니다.

## 프로젝트 구조

```text
.
├── app
│   ├── api                     # 공공데이터 호출용 Route Handler
│   ├── dashboard               # 대시보드 페이지
│   ├── design-system           # 디자인 시스템 확인 페이지
│   └── transactions            # 거래 조회 페이지
├── components
│   └── ui                      # shadcn/ui 기반 공통 UI
├── lib                         # 공통 유틸리티
└── src
    ├── entities
    │   ├── apartment-trade     # 실거래 도메인 모델, API 호출 및 파싱
    │   └── legal-dong-code     # 법정동 코드 모델, 조회 및 정규화
    ├── features
    │   ├── dashboard-filter    # 대시보드 검색 조건
    │   ├── dashboard-result    # 요약 지표 및 결과 UI
    │   ├── transaction-search  # 거래 데이터 조회 로직
    │   ├── transactions-detail # 거래 상세 드로어
    │   └── transactions-filter # 거래 조회 및 상세 필터
    └── shared
        ├── api                 # 공공데이터 인증키 처리
        ├── components          # 레이아웃·필터·피드백 공통 컴포넌트
        ├── constants           # 디자인 토큰
        ├── model               # 공통 타입
        ├── providers           # 전역 Provider
        └── stores              # Zustand 스토어
```

도메인 단위 코드는 `entities`, 사용자 기능은 `features`, 여러 기능에서 재사용하는 코드는 `shared`에 배치합니다. 외부 API의 필드명과 응답 구조는 `entities` 경계에서 내부 모델로 변환해 화면 코드가 공공 API 형식에 직접 의존하지 않도록 구성했습니다.

## 데이터 출처

- [공공데이터포털 국토교통부 아파트 매매 실거래가 자료](https://www.data.go.kr/data/15126469/openapi.do)
- [공공데이터포털 국토교통부 아파트 전월세 자료](https://www.data.go.kr/data/15126474/openapi.do)
- [공공데이터포털 국토교통부 법정동 코드 데이터](https://www.data.go.kr/data/15123287/fileData.do)

공공 API의 응답 여부와 데이터 갱신 시점은 제공 기관의 상태에 따라 달라질 수 있습니다.
