import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type TablePlaceholderProps = {
  title: string;
};

const rows = [
  ['매매', '래미안 강남힐스', '강남구 개포동', '1,780,000', '2026-05-30'],
  ['전세', '아크로리버파크', '서초구 반포동', '180,000', '2026-05-29'],
  ['월세', 'e편한세상 강동', '강동구 고덕동', '5,000 / 120', '2026-05-28'],
  ['매매', '잠실엘스', '송파구 잠실동', '1,350,000', '2026-05-28'],
  ['전세', '마포래미안푸르지오', '마포구 아현동', '90,000', '2026-05-27'],
];

export function TablePlaceholder({ title }: TablePlaceholderProps) {
  return (
    <Card className="rounded-lg border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-160 text-left text-sm">
            <thead className="border-b border-border text-xs text-muted-foreground">
              <tr>
                <th className="py-2 font-medium">거래유형</th>
                <th className="py-2 font-medium">아파트명</th>
                <th className="py-2 font-medium">지역</th>
                <th className="py-2 font-medium">거래금액/보증금</th>
                <th className="py-2 font-medium">계약일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {rows.map((row) => (
                <tr key={row.join('-')}>
                  {row.map((cell) => (
                    <td key={cell} className="py-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-center">
          <Button variant="ghost" size="sm">
            전체 보기
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
