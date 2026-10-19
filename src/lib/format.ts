const priceFormatter = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: false,
});

/** Siempre «3,50 €»: coma decimal y € detrás, con espacio fino irrompible. */
export function formatPrice(value: number): string {
  return `${priceFormatter.format(value)}\u00a0€`;
}

const shortDate = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", timeZone: "UTC" });
const longDate = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const weekdayDate = new Intl.DateTimeFormat("es-ES", { weekday: "short", timeZone: "UTC" });

/** «AAAA-MM-DD» → Date en UTC (sin desplazamiento por zona horaria del servidor). */
function parseIsoDate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

/** «16 oct» */
export function formatShortDate(iso: string): string {
  return shortDate.format(parseIsoDate(iso)).replace(".", "");
}

/** «16 de octubre de 2026» */
export function formatLongDate(iso: string): string {
  return longDate.format(parseIsoDate(iso));
}

/** Partes para bloques de fecha tipo calendario: { day: "24", month: "OCT", weekday: "SÁB" } */
export function dateParts(iso: string): { day: string; month: string; weekday: string } {
  const date = parseIsoDate(iso);
  return {
    day: String(date.getUTCDate()),
    month: shortDate.formatToParts(date).find((p) => p.type === "month")?.value.replace(".", "") ?? "",
    weekday: weekdayDate.format(date).replace(".", ""),
  };
}
