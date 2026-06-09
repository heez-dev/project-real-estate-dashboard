import { DesignSystemLink } from '@/src/shared/components/layout/DesignSystemLink';
import { ThemeToggle } from '@/src/shared/components/layout/ThemeToggle';

type AppHeaderProps = {
  title?: string;
};

export function AppHeader({ title = '아파트 실거래가' }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur md:px-6 lg:hidden">
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-foreground">{title}</p>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <DesignSystemLink />
        <ThemeToggle />
      </div>
    </header>
  );
}
