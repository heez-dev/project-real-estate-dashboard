'use client';

import * as React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  type AppToast,
  useToastStore,
} from '@/src/shared/stores/use-toast-store';

const toastVariantClassName = {
  error: 'border-red-200 bg-red-50 text-red-950 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100',
  info: 'border-border bg-card text-card-foreground',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100',
} as const;

const toastIcon = {
  error: AlertCircle,
  info: Info,
  success: CheckCircle2,
} as const;

export function AppToaster() {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-50 grid w-[min(24rem,calc(100vw-2rem))] gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: AppToast }) {
  const dismissToast = useToastStore((state) => state.dismissToast);
  const Icon = toastIcon[toast.variant];

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      dismissToast(toast.id);
    }, 4500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [dismissToast, toast.id]);

  return (
    <div
      role="status"
      className={cn(
        'grid grid-cols-[auto_1fr_auto] items-start gap-3 rounded-lg border p-3 text-sm shadow-lg',
        toastVariantClassName[toast.variant],
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="grid gap-1">
        <p className="font-medium leading-5">{toast.title}</p>
        {toast.description ? (
          <p className="text-xs leading-5 opacity-80">{toast.description}</p>
        ) : null}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-6 text-current hover:bg-black/5 dark:hover:bg-white/10"
        onClick={() => dismissToast(toast.id)}
      >
        <X className="size-3.5" aria-hidden="true" />
        <span className="sr-only">알림 닫기</span>
      </Button>
    </div>
  );
}
