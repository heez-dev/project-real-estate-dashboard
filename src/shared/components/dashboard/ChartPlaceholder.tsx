import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ChartPlaceholderProps = {
  title: string;
  variant?: 'bar' | 'donut' | 'line';
};

export function ChartPlaceholder({
  title,
  variant = 'line',
}: ChartPlaceholderProps) {
  return (
    <Card className="rounded-lg border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-48 items-end gap-2 rounded-lg border border-dashed border-border bg-muted p-4">
          {variant === 'donut' ? (
            <div className="m-auto size-28 rounded-full border-[22px] border-blue-500 border-r-blue-200 border-t-blue-300" />
          ) : (
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="flex-1 rounded-t bg-blue-500/70"
                style={{ height: `${32 + ((index * 17) % 58)}%` }}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
