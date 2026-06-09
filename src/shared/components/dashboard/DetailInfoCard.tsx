import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type DetailInfoCardProps = {
  children: ReactNode;
  title: string;
};

export function DetailInfoCard({ children, title }: DetailInfoCardProps) {
  return (
    <Card className="rounded-lg border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm text-foreground">
        {children}
      </CardContent>
    </Card>
  );
}
