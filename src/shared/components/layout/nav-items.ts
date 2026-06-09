import { BarChart3, Search } from 'lucide-react';

export const appNavItems = [
  {
    href: '/dashboard',
    icon: BarChart3,
    label: '대시보드',
  },
  {
    href: '/transactions',
    icon: Search,
    label: '거래조회',
  },
] as const;

