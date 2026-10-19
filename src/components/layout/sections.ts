import { STORY_CATEGORIES, STORY_CATEGORY_LABELS } from "@/domain/story";
import type { SubNavItem } from "./SubNav";

/** Tabs de la sub-nav de la sección Sabores (incluye la carta y el comparador). */
export const FLAVOR_SECTION_TABS: SubNavItem[] = [
  // prefix: también activo en la ficha /sabores/[slug] (comparar gana por ser más específico).
  { href: "/sabores", label: "Todos los sabores", match: "prefix" },
  { href: "/carta", label: "Carta de la semana" },
  { href: "/sabores/comparar", label: "Comparar" },
];

/** Tabs de la sub-nav de Historias: todas + una por categoría. */
export const STORY_SECTION_TABS: SubNavItem[] = [
  // prefix: activo también dentro de un artículo; en una categoría gana su tab.
  { href: "/historias", label: "Todas", match: "prefix" },
  ...STORY_CATEGORIES.map((category) => ({
    href: `/historias/categoria/${category}`,
    label: STORY_CATEGORY_LABELS[category],
  })),
];

export const VISIT_SECTION_TABS: SubNavItem[] = [
  { href: "/visitanos", label: "Horario y local" },
  { href: "/historias/categoria/evento", label: "Eventos" },
];
