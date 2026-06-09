'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { appNavItems } from '@/src/shared/components/layout/nav-items';

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 grid h-16 grid-cols-2 border-t border-border bg-card md:hidden"
      aria-label="모바일 주요 메뉴"
    >
      {appNavItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground',
              isActive && 'text-blue-600 dark:text-blue-300',
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
