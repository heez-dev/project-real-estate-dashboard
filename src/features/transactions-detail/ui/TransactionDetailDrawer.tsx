'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { ApartmentTrade } from '@/src/entities/apartment-trade/model/apartment-trade';
import {
  formatAmount,
  formatDealDate,
  formatExclusiveArea,
  formatTradeAmount,
  getTradeTypeLabel,
} from '@/src/features/dashboard-result/model/dashboard-result-format';

type TransactionDetailDrawerProps = {
  trade: ApartmentTrade | null;
  onOpenChange: (open: boolean) => void;
};

export function TransactionDetailDrawer({
  trade,
  onOpenChange,
}: TransactionDetailDrawerProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <Drawer
      direction={isDesktop ? 'right' : 'bottom'}
      open={trade !== null}
      onOpenChange={onOpenChange}
    >
      <DrawerContent className="border border-border shadow-2xl [&::after]:hidden data-[vaul-drawer-direction=bottom]:inset-x-3 data-[vaul-drawer-direction=bottom]:bottom-3 data-[vaul-drawer-direction=bottom]:max-h-[calc(80vh-0.75rem)] data-[vaul-drawer-direction=bottom]:w-auto data-[vaul-drawer-direction=bottom]:rounded-xl data-[vaul-drawer-direction=right]:inset-y-3 data-[vaul-drawer-direction=right]:right-3 data-[vaul-drawer-direction=right]:h-[calc(100%-1.5rem)] data-[vaul-drawer-direction=right]:rounded-xl lg:max-w-md">
        {trade ? <TransactionDetailContent trade={trade} /> : null}
      </DrawerContent>
    </Drawer>
  );
}

function TransactionDetailContent({ trade }: { trade: ApartmentTrade }) {
  const address = getAddress(trade);
  return (
    <>
      <DrawerHeader className="relative border-b border-border py-10 pr-14 lg:pt-12">
        <DrawerTitle className="flex items-center justify-center gap-2 text-lg font-semibold">
          <Badge variant="ghost">{getTradeTypeLabel(trade)}</Badge>
          {trade.apartmentName || '아파트명 미상'}
        </DrawerTitle>
        <DrawerClose asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 hidden lg:inline-flex"
            aria-label="거래 상세 닫기"
          >
            <X aria-hidden="true" />
          </Button>
        </DrawerClose>
      </DrawerHeader>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <section aria-labelledby="transaction-property-heading">
          <h3
            id="transaction-property-heading"
            className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-foreground"
          >
            주택 정보
          </h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <DetailItem
              label="전용면적"
              value={formatExclusiveArea(trade.exclusiveArea)}
            />
            <DetailItem
              label="층"
              value={trade.floor === null ? '-' : `${trade.floor}층`}
            />
            <DetailItem
              label="건축년도"
              value={trade.buildYear === null ? '-' : `${trade.buildYear}년`}
            />
            <DetailItem label="주소" value={address || '-'} />
          </dl>
        </section>

        <Separator className="my-4" />

        {trade.tradeType === 'rent' ? (
          <RentContractDetails trade={trade} />
        ) : (
          <SaleContractDetails trade={trade} />
        )}
      </div>
    </>
  );
}

function RentContractDetails({
  trade,
}: {
  trade: Extract<ApartmentTrade, { tradeType: 'rent' }>;
}) {
  return (
    <section aria-labelledby="transaction-contract-heading">
      <h3
        id="transaction-contract-heading"
        className="mb-3 text-sm font-semibold text-foreground"
      >
        계약 정보
      </h3>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        <DetailItem label="거래일" value={formatDealDate(trade)} />
        <DetailItem label="계약구분" value={trade.raw.contractType || '-'} />
        <DetailItem label="보증금" value={formatAmount(trade.depositAmount)} />
        {trade.monthlyRent ? (
          <DetailItem label="월세" value={formatAmount(trade.monthlyRent)} />
        ) : null}
        <DetailItem
          label="종전 보증금"
          value={formatRawAmount(trade.raw.preDeposit)}
        />
        {trade.monthlyRent ? (
          <DetailItem
            label="종전 월세"
            value={formatRawAmount(trade.raw.preMonthlyRent)}
          />
        ) : null}
        <DetailItem label="계약기간" value={trade.raw.contractTerm || '-'} />
        {!trade.monthlyRent ? (
          <DetailItem
            label="갱신요구권 사용"
            value={trade.raw.useRRRight || '-'}
          />
        ) : null}
      </dl>
    </section>
  );
}

function SaleContractDetails({
  trade,
}: {
  trade: Exclude<ApartmentTrade, { tradeType: 'rent' }>;
}) {
  const amountPerSquareMeter = getAmountPerSquareMeter(trade);

  return (
    <section aria-labelledby="transaction-contract-heading">
      <h3
        id="transaction-contract-heading"
        className="mb-3 text-sm font-semibold text-foreground"
      >
        계약 정보
      </h3>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        <DetailItem label="거래일" value={formatDealDate(trade)} />
        <DetailItem
          label="거래 금액"
          value={`${formatTradeAmount(trade)}${
            amountPerSquareMeter !== null
              ? ` (㎡당 약 ${Math.round(amountPerSquareMeter).toLocaleString()}만원)`
              : ''
          }`}
        />
        <DetailItem label="아파트 동" value={trade.raw.aptDong || '-'} />
        <DetailItem label="거래 방식" value={trade.raw.dealingGbn || '-'} />
        <DetailItem label="매도자" value={trade.raw.slerGbn || '-'} />
        <DetailItem label="매수자" value={trade.raw.buyerGbn || '-'} />
        <DetailItem label="등기일" value={trade.raw.rgstDate || '-'} />
        <DetailItem
          label="해제 여부"
          value={
            trade.raw.cdealType ? `해제 (${trade.raw.cdealDay || '-'})` : '-'
          }
        />
        <DetailItem
          className="col-span-2"
          label="중개사 소재지"
          value={trade.raw.estateAgentSggNm || '-'}
        />
      </dl>
    </section>
  );
}

function DetailItem({
  className,
  label,
  value,
}: {
  className?: string;
  label: string;
  value: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 wrap-break-word text-sm font-medium text-foreground">
        {value}
      </dd>
    </div>
  );
}

function getAddress(trade: ApartmentTrade) {
  const roadName =
    trade.tradeType === 'sale-detail'
      ? trade.raw.roadNm
      : trade.tradeType === 'rent'
        ? trade.raw.roadnm
        : undefined;

  return roadName || [trade.legalDong, trade.jibun].filter(Boolean).join(' ');
}

function getAmountPerSquareMeter(trade: ApartmentTrade) {
  if (!trade.exclusiveArea || trade.exclusiveArea <= 0) {
    return null;
  }

  const amount =
    trade.tradeType === 'rent' ? trade.depositAmount : trade.dealAmount;

  return amount === null ? null : amount / trade.exclusiveArea;
}

function formatRawAmount(value?: string) {
  if (!value) {
    return '-';
  }

  const amount = Number(value.replaceAll(',', '').trim());
  return Number.isFinite(amount) ? formatAmount(amount) : value;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const updateMatches = () => setMatches(mediaQuery.matches);
    updateMatches();
    mediaQuery.addEventListener('change', updateMatches);

    return () => mediaQuery.removeEventListener('change', updateMatches);
  }, [query]);

  return matches;
}
