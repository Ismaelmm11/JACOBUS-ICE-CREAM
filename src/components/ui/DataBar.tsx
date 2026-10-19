import { cx } from "@/lib/cx";
import tx from "@/styles/type.module.css";
import styles from "./DataBar.module.css";

export interface DataBarItem {
  label: string;
  value: string;
  /** price → Space Mono; text → title */
  kind?: "price" | "text";
}

interface DataBarProps {
  items: DataBarItem[];
  label?: string;
  className?: string;
}

/** Barra de datos de la ficha (equivale a la barra de stats del jugador en NBA). */
export function DataBar({ items, label = "Datos clave", className }: DataBarProps) {
  return (
    <dl className={cx(styles.bar, className)} aria-label={label}>
      {items.map((item) => (
        <div key={item.label} className={styles.cell}>
          <dt className={cx(styles.label, tx.label)}>{item.label}</dt>
          <dd className={cx(styles.value, item.kind === "price" ? tx.price : tx.title)}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
