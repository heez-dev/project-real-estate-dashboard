import { Download, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { colorTokens } from '@/src/shared/constants/design-tokens';
import { DatePicker } from '@/components/ui/date-picker';
import { ChartPlaceholder } from '@/src/shared/components/ChartPlaceholder';
import { TablePlaceholder } from '@/src/shared/components/TablePlaceholder';
import { KpiCard } from '@/src/shared/components/card/KpiCard';
import { DetailInfoCard } from '@/src/shared/components/card/DetailInfoCard';
import { TransactionTypeSelector } from '@/src/shared/components/filter/TransactionTypeSelector';
import { LocationSelector } from '@/src/shared/components/filter/LocationSelector';
import { ContractMonthPicker } from '@/src/shared/components/filter/ContractMonthPicker';

const regionOptions = [
  { label: '서울특별시', value: '11', keywords: ['서울'] },
  { label: '경기도', value: '41', keywords: ['경기'] },
  { label: '부산광역시', value: '26', keywords: ['부산'] },
] as const;

export default function DesignSystemPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-6">
      <header>
        <h1 className="text-[28px] font-bold leading-9 text-foreground">
          디자인 시스템
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          공통 토큰과 컴포넌트의 기본 상태를 확인하는 내부 점검 화면입니다.
        </p>
      </header>

      <Section title="Color Tokens">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <ColorGroup title="Primary" colors={colorTokens.primary} />
          <ColorGroup title="Neutral" colors={colorTokens.neutral} />
          <ColorGroup title="Semantic" colors={colorTokens.semantic} />
        </div>
      </Section>

      <Section title="Buttons">
        <Card className="rounded-lg border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Variant
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <ButtonRow description="가장 중요한 실행 액션" label="default">
              <Button>
                <Search className="size-4" aria-hidden="true" />
                조회
              </Button>
            </ButtonRow>
            <ButtonRow
              description="보조 실행, 다운로드, 뒤로가기"
              label="outline"
            >
              <Button variant="outline">
                <Download className="size-4" aria-hidden="true" />
                CSV
              </Button>
            </ButtonRow>
            <ButtonRow description="낮은 강조의 보조 액션" label="secondary">
              <Button variant="secondary">Secondary</Button>
            </ButtonRow>
            <ButtonRow description="툴바, 아이콘, 조용한 액션" label="ghost">
              <Button variant="ghost">Ghost</Button>
            </ButtonRow>
            <ButtonRow description="삭제, 취소, 위험 액션" label="destructive">
              <Button variant="destructive">Destructive</Button>
            </ButtonRow>
            <ButtonRow
              description="문장 안 링크 또는 낮은 단계 이동"
              label="link"
            >
              <Button variant="link">Link</Button>
            </ButtonRow>
          </CardContent>
        </Card>
      </Section>

      <Section title="Badges">
        <Card className="rounded-lg border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Variant
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <BadgeRow description="선택된 값이나 주요 상태" label="default">
              <Badge>Default</Badge>
            </BadgeRow>
            <BadgeRow description="외곽선으로만 약하게 구분" label="outline">
              <Badge variant="outline">Outline</Badge>
            </BadgeRow>
            <BadgeRow description="정보성 보조 라벨" label="ghost">
              <Badge variant="ghost">Ghost</Badge>
            </BadgeRow>
          </CardContent>
        </Card>
      </Section>

      <Section title="Inputs">
        <div className="grid gap-4 ">
          <Card className="rounded-lg border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">
                Input
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="아파트명을 입력하세요" />
            </CardContent>
          </Card>
          <Card className="rounded-lg border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">
                Combobox
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Combobox
                options={regionOptions}
                placeholder="지역을 선택하세요"
                searchPlaceholder="지역명을 검색하세요"
              />
            </CardContent>
          </Card>
          <Card className="rounded-lg border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">
                Date Picker
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              <Field label="year picker">
                <DatePicker picker="year" placeholder="연도를 선택하세요" />
              </Field>
              <Field label="month picker">
                <DatePicker picker="month" placeholder="월을 선택하세요" />
              </Field>
              <Field label="date picker">
                <DatePicker picker="date" placeholder="날짜를 선택하세요" />
              </Field>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section title="Filter Components">
        <div className="grid gap-4">
          <Card className="rounded-lg border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">
                Transaction Type Selector
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionTypeSelector />
            </CardContent>
          </Card>

          <Card className="rounded-lg border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">
                Location Selector
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                <LocationSelector />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">
                Contract Month Picker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ContractMonthPicker />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section title="Card Components">
        <div className="grid gap-4">
          <CardPreview title="KPI Cards">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                label="총 거래 건수"
                value="12,345"
                unit="건"
                change={{ tone: 'positive', value: '▲ 5.2%' }}
              />
              <KpiCard
                label="평균 매매가"
                value="850,000"
                unit="만원"
                change={{ tone: 'positive', value: '▲ 3.1%' }}
              />
              <KpiCard
                label="평균 월세"
                value="80"
                unit="만원"
                change={{ tone: 'negative', value: '▼ 1.3%' }}
              />
              <KpiCard label="최고 거래금액" value="2,450,000" unit="만원" />
            </div>
          </CardPreview>

          <CardPreview title="Detail Info Cards">
            <div className="grid gap-4 md:grid-cols-2">
              <DetailInfoCard title="기본 거래 정보">
                <InfoRow label="거래유형" value="매매" />
                <InfoRow label="계약일" value="2026-05-30" />
              </DetailInfoCard>
              <DetailInfoCard title="아파트 정보">
                <InfoRow label="아파트명" value="래미안 강남힐스" />
                <InfoRow label="전용면적" value="84.97㎡" />
              </DetailInfoCard>
            </div>
          </CardPreview>
        </div>
      </Section>

      <Section title="Charts & Tables">
        <div className="grid gap-4">
          <div className="grid gap-4 xl:grid-cols-3">
            <ChartPlaceholder title="지역별 거래 TOP 5" variant="bar" />
            <ChartPlaceholder title="거래유형 비중" variant="donut" />
          </div>
          <TablePlaceholder title="최근 거래 목록" />
        </div>
      </Section>
    </div>
  );
}

function Section({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="grid gap-3">
      <h2 className="text-[22px] font-bold leading-7.5 text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function CardPreview({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Card className="rounded-lg border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function ButtonRow({
  children,
  description,
  label,
}: {
  children: React.ReactNode;
  description: string;
  label: string;
}) {
  return (
    <div className="grid gap-2 rounded-lg border border-border bg-muted p-3 sm:grid-cols-[120px_1fr_auto] sm:items-center">
      <span className="font-mono text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <span className="text-sm text-muted-foreground">{description}</span>
      <div>{children}</div>
    </div>
  );
}

function BadgeRow({
  children,
  description,
  label,
}: {
  children: React.ReactNode;
  description: string;
  label: string;
}) {
  return (
    <div className="grid gap-2 rounded-lg border border-border bg-muted p-3 sm:grid-cols-[120px_1fr_auto] sm:items-center">
      <span className="font-mono text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <span className="text-sm text-muted-foreground">{description}</span>
      <div>{children}</div>
    </div>
  );
}

function ColorGroup({
  colors,
  title,
}: {
  colors: Record<string, string>;
  title: string;
}) {
  return (
    <Card className="rounded-lg border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {Object.entries(colors).map(([name, value]) => (
          <div key={name} className="flex items-center gap-3 text-sm">
            <span
              className="size-8 rounded-md border border-border"
              style={{ backgroundColor: value }}
            />
            <span className="w-20 font-medium text-foreground">{name}</span>
            <span className="font-mono text-xs text-muted-foreground">
              {value}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-2 last:border-b-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
