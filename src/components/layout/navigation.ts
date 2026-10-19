// Navegación principal compartida por header, panel móvil y footer.

export interface NavLink {
  href: string;
  label: string;
}

/** Enlaces del header después del mega-menú «Sabores». */
export const NAV_LINKS: readonly NavLink[] = [
  { href: "/carta", label: "Carta" },
  { href: "/sabores/comparar", label: "Comparar" },
  { href: "/historias", label: "Historias" },
  { href: "/visitanos", label: "Visítanos" },
];

/** El único CTA neon-pink del header. */
export const ORDER_CTA: NavLink = { href: "/carta", label: "Pide ya" };
