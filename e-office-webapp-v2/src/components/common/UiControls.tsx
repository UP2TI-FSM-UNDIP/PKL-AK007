"use client";

import { Moon, Sun } from "lucide-react";
import { useUiPreferences } from "@/components/common/useUiPreferences";

export function UiControls({ className }: { className?: string }) {
  const { theme, toggleTheme, t } = useUiPreferences();

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <button
        type="button"
        onClick={toggleTheme}
        className="rounded-full border border-white/30 p-1.5 text-white/90 hover:bg-white/10"
        aria-label={theme === "dark" ? t("lightMode") : t("darkMode")}
        title={theme === "dark" ? t("lightMode") : t("darkMode")}
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    </div>
  );
}
