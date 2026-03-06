"use client";

import { useEffect, useState } from "react";
import { getLabel, type I18nKey, type UiLang } from "@/lib/i18n";

type UiTheme = "light" | "dark";

const THEME_KEY = "ui-theme";
const applyPreferences = (theme: UiTheme, lang: UiLang) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  root.dataset.lang = lang;
  root.lang = lang;
};

export function useUiPreferences() {
  const [theme, setTheme] = useState<UiTheme>("light");
  const [lang] = useState<UiLang>("id");

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);
    const nextTheme = storedTheme === "dark" ? "dark" : "light";
    setTheme(nextTheme);
    applyPreferences(nextTheme, "id");
  }, []);

  useEffect(() => {
    const sync = () => {
      const storedTheme = localStorage.getItem(THEME_KEY);
      const nextTheme = storedTheme === "dark" ? "dark" : "light";
      setTheme(nextTheme);
      applyPreferences(nextTheme, "id");
    };

    window.addEventListener("storage", sync);
    window.addEventListener("ui-preferences", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("ui-preferences", sync);
    };
  }, []);

  const updatePreferences = (nextTheme: UiTheme, nextLang: UiLang) => {
    setTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    applyPreferences(nextTheme, "id");
    window.dispatchEvent(new Event("ui-preferences"));
  };

  const toggleTheme = () => {
    updatePreferences(theme === "dark" ? "light" : "dark", "id");
  };

  const toggleLang = () => {
    updatePreferences(theme, "id");
  };

  const t = (key: I18nKey) => getLabel(lang, key);

  return { theme, lang, toggleTheme, toggleLang, t };
}
