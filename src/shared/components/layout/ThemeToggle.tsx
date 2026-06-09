"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUiPreferencesStore } from "@/src/shared/stores/use-ui-preferences-store";

const nextThemeMode = {
  dark: "system",
  light: "dark",
  system: "light",
} as const;

const themeModeLabel = {
  dark: "다크 모드",
  light: "라이트 모드",
  system: "시스템 설정",
} as const;

export function ThemeToggle() {
  const themeMode = useUiPreferencesStore((state) => state.themeMode);
  const setThemeMode = useUiPreferencesStore((state) => state.setThemeMode);

  const Icon =
    themeMode === "dark" ? Moon : themeMode === "light" ? Sun : Laptop;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={`테마 변경: 현재 ${themeModeLabel[themeMode]}`}
      title={`테마 변경: 현재 ${themeModeLabel[themeMode]}`}
      onClick={() => setThemeMode(nextThemeMode[themeMode])}
    >
      <Icon className="size-4" aria-hidden="true" />
    </Button>
  );
}

