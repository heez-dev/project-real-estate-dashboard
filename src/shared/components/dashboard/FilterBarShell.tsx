import type { ReactNode } from 'react';
import { Calendar, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type FilterBarShellProps = {
  children?: ReactNode;
  showApartmentInput?: boolean;
};

const transactionTypes = [
  { label: '전체', variant: 'default' },
  { label: '매매', variant: 'outline' },
  { label: '전세', variant: 'outline' },
  { label: '월세', variant: 'outline' },
] as const;

export function FilterBarShell({
  children,
  showApartmentInput = false,
}: FilterBarShellProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {transactionTypes.map((type) => (
          <Badge key={type.label} variant={type.variant}>
            {type.label}
          </Badge>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto]">
        <Field label="지역">
          <Select>
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="시/도 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seoul">서울특별시</SelectItem>
              <SelectItem value="gyeonggi">경기도</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="구">
          <Select>
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="시군구 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gangnam">강남구</SelectItem>
              <SelectItem value="jongno">종로구</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="계약년월">
          <div className="relative">
            <Input className="h-9 pr-9" type="month" defaultValue="2026-05" />
            <Calendar className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </Field>

        <div className="flex items-end">
          <Button className="h-9 w-full min-w-24">
            <Search className="size-4" aria-hidden="true" />
            조회
          </Button>
        </div>
      </div>

      {showApartmentInput ? (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <Field label="아파트명">
            <Input className="h-9" placeholder="아파트명을 입력하세요" />
          </Field>
          <div>{children}</div>
        </div>
      ) : (
        children
      )}
    </section>
  );
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
