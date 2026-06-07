import { create } from "zustand";

export type DashboardDensity = "compact" | "comfortable";
export type ThemeMode = "system" | "light" | "dark";

type UiPreferencesState = {
  gridDensity: DashboardDensity;
  isNavigationCollapsed: boolean;
  themeMode: ThemeMode;
  setGridDensity: (density: DashboardDensity) => void;
  setNavigationCollapsed: (isCollapsed: boolean) => void;
  setThemeMode: (themeMode: ThemeMode) => void;
  toggleNavigation: () => void;
};

export const useUiPreferencesStore = create<UiPreferencesState>((set) => ({
  gridDensity: "comfortable",
  isNavigationCollapsed: false,
  themeMode: "system",
  setGridDensity: (gridDensity) => set({ gridDensity }),
  setNavigationCollapsed: (isNavigationCollapsed) =>
    set({ isNavigationCollapsed }),
  setThemeMode: (themeMode) => set({ themeMode }),
  toggleNavigation: () =>
    set((state) => ({
      isNavigationCollapsed: !state.isNavigationCollapsed,
    })),
}));
