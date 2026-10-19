import type { MegaMenuColumn } from "@/components/ui/MegaMenu";
import type { TickerDay } from "@/components/ui/Ticker";
import { FAMILY_LABELS, FAMILY_ORDER, type Flavor } from "@/domain/flavor";

/** Columnas del mega-menú «Sabores»: una por familia, en el orden del sistema. */
export function buildFamilyColumns(flavors: Flavor[]): MegaMenuColumn[] {
  return FAMILY_ORDER.map((family) => ({
    family,
    title: FAMILY_LABELS[family],
    href: `/sabores#${family}`,
    links: flavors
      .filter((f) => f.family === family)
      .map((f) => ({ label: f.name, href: `/sabores/${f.slug}` })),
  }));
}

/** Ticker «En la vitrina»: HOY con su estado real; MAÑANA siempre como disponible. */
export function buildShowcaseDays(today: Flavor[], tomorrow: Flavor[]): TickerDay[] {
  const toItem = (f: Flavor, day: string, forceAvailable: boolean) => ({
    id: `${day}-${f.slug}`,
    name: f.name,
    family: f.family,
    price: f.prices.scoop,
    status: forceAvailable ? ("disponible" as const) : f.stock,
    href: `/sabores/${f.slug}`,
  });
  return [
    { day: "Hoy", items: today.map((f) => toItem(f, "hoy", false)) },
    { day: "Mañana", items: tomorrow.map((f) => toItem(f, "manana", true)) },
  ];
}
