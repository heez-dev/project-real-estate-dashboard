'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Palette } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function DesignSystemLink() {
  const pathname = usePathname();
  const isActive = pathname === '/design-system';

  return (
    <Button asChild variant={isActive ? 'default' : 'ghost'} size="icon">
      <Link
        href="/design-system"
        aria-current={isActive ? 'page' : undefined}
        aria-label="디자인 시스템"
        title="디자인 시스템"
      >
        <Palette className="size-4" aria-hidden="true" />
      </Link>
    </Button>
  );
}
