"use client";

import { useEffect } from "react";

type ScrollbarThemeProps = {
  theme:
    | "landing-theme"
    | "super-admin-theme"
    | "modern-theme"
    | "heritage-theme"
    | "hallway-theme"
    | "cozy-theme";
};

const THEME_CLASSES = [
  "landing-theme",
  "super-admin-theme",
  "modern-theme",
  "heritage-theme",
  "hallway-theme",
  "cozy-theme",
] as const;

export function ScrollbarTheme({ theme }: ScrollbarThemeProps) {
  useEffect(() => {
    const root = document.documentElement;

    // Pastikan hanya ada satu tema scrollbar yang aktif.
    root.classList.remove(...THEME_CLASSES);
    root.classList.add(theme);

    return () => {
      root.classList.remove(theme);
    };
  }, [theme]);

  return null;
}
