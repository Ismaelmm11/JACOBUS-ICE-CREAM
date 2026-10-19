"use client";

import { useState } from "react";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { FilterChip } from "@/components/ui/FilterChip";
import { FAMILY_LABELS } from "@/domain/flavor";
import { formatPrice } from "@/lib/format";
import tx from "@/styles/type.module.css";
import type { FlavorCardData } from "@/components/ui/FlavorCard";
import { sampleFlavors } from "./sample";
import styles from "./page.module.css";

const CHIPS = ["Vegano", "Sin lactosa", "Sin gluten", "Frutales"] as const;

export function ChipDemo({ withActive = true }: { withActive?: boolean }) {
  const [active, setActive] = useState<string | null>(withActive ? "Vegano" : null);
  return (
    <div className={styles.row} role="group" aria-label="Filtros de ejemplo">
      {CHIPS.map((chip) => (
        <FilterChip key={chip} active={active === chip} onClick={() => setActive(active === chip ? null : chip)}>
          {chip}
        </FilterChip>
      ))}
    </div>
  );
}

const columns: DataTableColumn<FlavorCardData>[] = [
  { key: "name", header: "Sabor", sticky: true, sortValue: (f) => f.name, render: (f) => <span className={tx.bodyStrong}>{f.name}</span> },
  { key: "family", header: "Familia", sortValue: (f) => FAMILY_LABELS[f.family], render: (f) => FAMILY_LABELS[f.family] },
  { key: "vegan", header: "Vegano", render: (f) => (f.vegan ? "Sí" : "No") },
  {
    key: "scoop",
    header: "Bola",
    align: "end",
    sortValue: (f) => f.prices.scoop,
    render: (f) => <span className={tx.price}>{formatPrice(f.prices.scoop)}</span>,
  },
  {
    key: "tubL",
    header: "Tarrina L",
    align: "end",
    sortValue: (f) => f.prices.tubL,
    render: (f) => <span className={tx.price}>{formatPrice(f.prices.tubL)}</span>,
  },
];

export function TableDemo() {
  return (
    <DataTable
      caption="Comparativa de sabores de ejemplo"
      columns={columns}
      rows={sampleFlavors}
      rowKey={(f) => f.slug}
      pageSize={3}
      initialSort={{ key: "name", direction: "asc" }}
    />
  );
}
