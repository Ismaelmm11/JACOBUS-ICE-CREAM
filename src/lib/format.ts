const priceFormatter = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: false,
});

/** Siempre «3,50 €»: coma decimal y € detrás, con espacio fino irrompible. */
export function formatPrice(value: number): string {
  return `${priceFormatter.format(value)}\u00a0€`;
}
