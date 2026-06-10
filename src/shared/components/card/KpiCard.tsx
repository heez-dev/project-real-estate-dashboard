import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type KpiCardProps = {
  change?: {
    tone: 'negative' | 'positive' | 'neutral';
    value: string;
  };
  label: string;
  unit?: string;
  value: string;
};

const changeToneClassName = {
  negative: 'text-red-600 dark:text-red-400',
  neutral: 'text-muted-foreground',
  positive: 'text-emerald-600 dark:text-emerald-400',
} as const;

export function KpiCard({ change, label, unit, value }: KpiCardProps) {
  return (
    <Card className="rounded-lg border-border bg-card shadow-sm">
      <CardHeader className="flex-row items-start justify-between gap-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-1">
          <span className="text-2xl font-bold leading-8 text-foreground">
            {value}
          </span>
          {unit ? (
            <span className="pb-1 text-sm text-muted-foreground">{unit}</span>
          ) : null}
        </div>
        {change ? (
          <p className="mt-2 text-xs text-muted-foreground">
            전월 대비{' '}
            <span className={changeToneClassName[change.tone]}>
              {change.value}
            </span>
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
