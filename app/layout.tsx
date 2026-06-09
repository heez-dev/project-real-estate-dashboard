import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AppProviders } from '@/src/shared/providers/app-providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  applicationName: '아파트 실거래가 데이터 대시보드',
  description:
    '국토교통부 공공데이터 기반 아파트 실거래가 검색 및 분석 대시보드입니다.',
  keywords: ['아파트 실거래가', '공공데이터', '대시보드', '부동산 데이터'],
  title: {
    default: '아파트 실거래가 데이터 대시보드',
    template: '%s | 아파트 실거래가 데이터 대시보드',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
