import type { ReactNode } from 'react';
import { AppFooter } from '@/src/shared/components/layout/AppFooter';
import { AppHeader } from '@/src/shared/components/layout/AppHeader';
import { CompactRailNav } from '@/src/shared/components/layout/CompactRailNav';
import { MobileBottomNav } from '@/src/shared/components/layout/MobileBottomNav';
import { SidebarNav } from '@/src/shared/components/layout/SidebarNav';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-dvh min-w-[360px] bg-background text-foreground">
      <div className="flex min-h-dvh">
        <SidebarNav />
        <CompactRailNav />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 px-4 py-5 pb-24 md:px-6 md:py-6 md:pb-8 lg:px-8">
            {children}
          </main>
          <AppFooter />
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}
