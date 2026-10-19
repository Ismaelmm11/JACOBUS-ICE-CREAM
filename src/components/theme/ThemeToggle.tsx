"use client";

import { useSyncExternalStore } from "react";
import { cx } from "@/lib/cx";
import { getEffectiveTheme, storeTheme, type Theme } from "@/lib/theme";
import tx from "@/styles/type.module.css";
import styles from "./ThemeToggle.module.css";

const THEME_EVENT = "jacobus:themechange";

function subscribe(onChange: () => void): () => void {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onChange);
  window.addEventListener(THEME_EVENT, onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener(THEME_EVENT, onChange);
  };
}

function getServerSnapshot(): Theme | null {
  return null;
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getEffectiveTheme, getServerSnapshot);
  const isNoche = theme === "noche";

  function toggle() {
    const next: Theme = isNoche ? "crema" : "noche";
    document.documentElement.setAttribute("data-theme", next);
    storeTheme(next);
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <button
      type="button"
      className={cx(styles.toggle, tx.label, className)}
      onClick={toggle}
      aria-pressed={theme === null ? undefined : isNoche}
      aria-label="Tema noche"
    >
      <span className={styles.track} aria-hidden="true">
        <span className={cx(styles.thumb, isNoche && styles.thumbOn)} />
      </span>
      <span aria-hidden="true">{theme === null ? "Tema" : isNoche ? "Noche" : "Crema"}</span>
    </button>
  );
}
