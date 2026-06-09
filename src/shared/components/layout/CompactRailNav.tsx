'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { appNavItems } from '@/src/shared/components/layout/nav-items';
import { DesignSystemLink } from '@/src/shared/components/layout/DesignSystemLink';
import { ThemeToggle } from '@/src/shared/components/layout/ThemeToggle';

export function CompactRailNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex md:w-20 md:flex-col lg:hidden">
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border">
        <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
          <Building2 className="size-5" aria-hidden="true" />
        </div>
      </div>

      <nav className="flex flex-1 flex-col items-center gap-2 py-4" aria-label="주요 메뉴">
        {appNavItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              title={item.label}
              className={cn(
                'flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                isActive &&
                  'bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-950/40 dark:hover:text-blue-300',
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
            </Link>
          );
        })}
      </nav>
      <div className="flex flex-col items-center gap-1 border-t border-sidebar-border p-3">
        <DesignSystemLink />
        <ThemeToggle />
      </div>
    </aside>
  );
}
