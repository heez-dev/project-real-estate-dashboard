import type { ComponentProps } from 'react';
import { LoaderCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

type SpinnerProps = ComponentProps<typeof LoaderCircle>;

function Spinner({
  className,
  'aria-label': ariaLabel = '로딩 중',
  ...props
}: SpinnerProps) {
  return (
    <LoaderCircle
      role="status"
      aria-label={ariaLabel}
      className={cn('size-4 animate-spin text-muted-foreground', className)}
      {...props}
    />
  );
}

export { Spinner };
