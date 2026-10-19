"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { FilterChip } from "@/components/ui/FilterChip";
import { Switch } from "@/components/ui/Switch";
import { ALLERGEN_LABELS, FAMILY_LABELS, FAMILY_ORDER, type Flavor, type FlavorFamily } from "@/domain/flavor";
import { cx } from "@/lib/cx";
import { formatPrice } from "@/lib/format";
import tx from "@/styles/type.module.css";
import styles from "./CompareTable.module.css";

export type CompareFlavor = Pick<
  Flavor,
  "slug" | "name" | "family" | "nutrition" | "allergens" | "prices" | "vegan" | "lactoseFree" | "glutenFree"
>;

const grams = (value: number) => `${String(value).replace(".", ",")} g`;

const columns: DataTableColumn<CompareFlavor>[] = [
  {
    key: "name",
    header: "Sabor",
    sticky: true,
    sortValue: (f) => f.name,
    render: (f) => (
      <Link href={`/sabores/${f.slug}`} className={cx(styles.name, tx.bodyStrong)}>
        <span className={cx(styles.dot, styles[f.family])} aria-hidden="true" />
        {f.name}
      </Link>
    ),
  },
  { key: "family", header: "Familia", sortValue: (f) => FAMILY_ORDER.indexOf(f.family), render: (f) => FAMILY_LABELS[f.family] },
  { key: "kcal", header: "Kcal/100 g", align: "end", sortValue: (f) => f.nutrition.kcal, render: (f) => f.nutrition.kcal },
  { key: "sugar", header: "Azúcar", align: "end", sortValue: (f) => f.nutrition.sugar, render: (f) => grams(f.nutrition.sugar) },
  { key: "fat", header: "Grasa", align: "end", sortValue: (f) => f.nutrition.fat, render: (f) => grams(f.nutrition.fat) },
  {
    key: "allergens",
    header: "Alérgenos",
    sortValue: (f) => f.allergens.length,
    render: (f) => (
      <span className={styles.allergens}>
        {f.allergens.length ? f.allergens.map((a) => ALLERGEN_LABELS[a]).join(", ") : "—"}
      </span>
    ),
  },
  {
    key: "scoop",
    header: "Bola",
    align: "end",
    sortValue: (f) => f.prices.scoop,
    render: (f) => <span className={tx.price}>{formatPrice(f.prices.scoop)}</span>,
  },
  {
    key: "tub",
    header: "Tarrina M",
    align: "end",
    sortValue: (f) => f.prices.tubM,
    render: (f) => <span className={tx.price}>{formatPrice(f.prices.tubM)}</span>,
  },
];

export function CompareTable({ flavors }: { flavors: CompareFlavor[] }) {
  const [family, setFamily] = useState<FlavorFamily | "todas">("todas");
  const [vegan, setVegan] = useState(false);
  const [lactoseFree, setLactoseFree] = useState(false);
  const [glutenFree, setGlutenFree] = useState(false);

  const rows = useMemo(
    () =>
      flavors.filter(
        (f) =>
          (family === "todas" || f.family === family) &&
          (!vegan || f.vegan) &&
          (!lactoseFree || f.lactoseFree) &&
          (!glutenFree || f.glutenFree),
      ),
    [flavors, family, vegan, lactoseFree, glutenFree],
  );

  const filterKey = `${family}-${vegan}-${lactoseFree}-${glutenFree}`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.filters}>
        {/* Selección única: solo un chip activo, así neon-lime aparece una sola vez. */}
        <div className={styles.chips} role="group" aria-label="Familia">
          <FilterChip active={family === "todas"} onClick={() => setFamily("todas")}>
            Todas
          </FilterChip>
          {FAMILY_ORDER.map((f) => (
            <FilterChip key={f} active={family === f} onClick={() => setFamily(f)}>
              {FAMILY_LABELS[f]}
            </FilterChip>
          ))}
        </div>
        <div className={styles.switches} role="group" aria-label="Necesidades">
          <Switch checked={vegan} onChange={setVegan} label="Vegano" />
          <Switch checked={lactoseFree} onChange={setLactoseFree} label="Sin lactosa" />
          <Switch checked={glutenFree} onChange={setGlutenFree} label="Sin gluten" />
        </div>
      </div>

      <p className={tx.bodyStrong} aria-live="polite">
        {rows.length} {rows.length === 1 ? "sabor" : "sabores"}
      </p>

      <DataTable
        key={filterKey}
        caption="Comparativa de sabores"
        columns={columns}
        rows={rows}
        rowKey={(f) => f.slug}
        pageSize={10}
        initialSort={{ key: "family", direction: "asc" }}
      />
    </div>
  );
}
