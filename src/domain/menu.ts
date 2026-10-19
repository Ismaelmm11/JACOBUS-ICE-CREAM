import { FAMILY_ORDER, type Flavor, type StockStatus } from "./flavor";
import type { DayHours, Showcase, Weekday } from "./schedule";

export interface MenuEntry {
  slug: string;
  stock: StockStatus;
}

export interface MenuDay {
  /** AAAA-MM-DD */
  iso: string;
  weekday: Weekday;
  /** 0 = hoy, 1 = mañana… */
  offset: number;
  open: boolean;
  entries: MenuEntry[];
}

const FLAVORS_PER_DAY = 12;

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function byFamily(flavors: Map<string, Flavor>) {
  return (a: MenuEntry, b: MenuEntry) => {
    const fa = flavors.get(a.slug);
    const fb = flavors.get(b.slug);
    return FAMILY_ORDER.indexOf(fa?.family ?? "frutales") - FAMILY_ORDER.indexOf(fb?.family ?? "frutales");
  };
}

/**
 * Carta de los próximos días (mock, pero estable):
 * - hoy: la vitrina real, con su stock;
 * - mañana: lo anunciado como «recién hecho» + lo que sobra de hoy;
 * - después: una selección determinista por fecha (sin Math.random).
 * Los días sin horario salen cerrados y vacíos.
 */
export function buildMenuDays(params: {
  flavors: Flavor[];
  showcase: Showcase;
  hours: DayHours[];
  todayIso: string;
  days: number;
  addDays: (iso: string, days: number) => string;
  weekdayOf: (iso: string) => Weekday;
}): MenuDay[] {
  const { flavors, showcase, hours, todayIso, days, addDays, weekdayOf } = params;
  const bySlug = new Map(flavors.map((f) => [f.slug, f]));
  const sort = byFamily(bySlug);

  return Array.from({ length: days }, (_, offset) => {
    const iso = addDays(todayIso, offset);
    const weekday = weekdayOf(iso);
    const open = (hours.find((h) => h.day === weekday)?.ranges.length ?? 0) > 0;
    if (!open) return { iso, weekday, offset, open, entries: [] };

    let entries: MenuEntry[];
    if (offset === 0) {
      entries = showcase.today.map((slug) => ({ slug, stock: bySlug.get(slug)?.stock ?? "disponible" }));
    } else if (offset === 1) {
      const fresh = showcase.tomorrow.map((slug) => ({ slug, stock: "recien-hecho" as const }));
      const leftovers = showcase.today
        .filter((slug) => !showcase.tomorrow.includes(slug) && bySlug.get(slug)?.stock !== "agotado")
        .map((slug) => ({ slug, stock: "disponible" as const }));
      entries = [...fresh, ...leftovers].slice(0, FLAVORS_PER_DAY);
    } else {
      entries = [...flavors]
        .sort((a, b) => hash(`${iso}:${a.slug}`) - hash(`${iso}:${b.slug}`))
        .slice(0, FLAVORS_PER_DAY)
        .map((f) => ({ slug: f.slug, stock: "disponible" as const }));
    }
    return { iso, weekday, offset, open, entries: entries.sort(sort) };
  });
}
