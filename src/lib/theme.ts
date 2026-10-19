export type Theme = "crema" | "noche";

export const THEME_STORAGE_KEY = "jacobus-theme";

/**
 * Script que corre antes del primer pintado para aplicar el tema guardado y
 * evitar el parpadeo. Si no hay preferencia guardada no toca nada y manda
 * prefers-color-scheme (ver tokens.css).
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="crema"||t==="noche"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;

export function readStoredTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === "crema" || value === "noche" ? value : null;
  } catch {
    return null;
  }
}

export function storeTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Almacenamiento bloqueado: el tema se aplica igual, solo que no se recuerda.
  }
}

export function getEffectiveTheme(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "crema" || attr === "noche") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "noche" : "crema";
}
