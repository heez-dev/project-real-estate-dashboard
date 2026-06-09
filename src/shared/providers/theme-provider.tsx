"use client";

import { type ReactNode, useEffect } from "react";
import {
  type ThemeMode,
  useUiPreferencesStore,
} from "@/src/shared/stores/use-ui-preferences-store";

const THEME_STORAGE_KEY = "apartment-dashboard-theme";

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeMode = useUiPreferencesStore((state) => state.themeMode);
  const setThemeMode = useUiPreferencesStore((state) => state.setThemeMode);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (isThemeMode(savedTheme)) {
      setThemeMode(savedTheme);
    }
  }, [setThemeMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function applyTheme() {
      const shouldUseDark =
        themeMode === "dark" ||
        (themeMode === "system" && mediaQuery.matches);

      document.documentElement.classList.toggle("dark", shouldUseDark);
    }

    applyTheme();
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);

    mediaQuery.addEventListener("change", applyTheme);

    return () => {
      mediaQuery.removeEventListener("change", applyTheme);
    };
  }, [themeMode]);

  return children;
}

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "system" || value === "light" || value === "dark";
}

