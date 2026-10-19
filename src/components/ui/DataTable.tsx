"use client";

import { useMemo, useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import tx from "@/styles/type.module.css";
import styles from "./DataTable.module.css";

export interface DataTableColumn<Row> {
  key: string;
  header: string;
  render: (row: Row) => ReactNode;
  /** Valor para ordenar; sin él la columna no es ordenable. */
  sortValue?: (row: Row) => string | number;
  align?: "start" | "end";
  /** Columna fija a la izquierda en scroll horizontal (la del nombre). */
  sticky?: boolean;
}

type SortDirection = "asc" | "desc";

interface DataTableProps<Row> {
  columns: DataTableColumn<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  caption: string;
  pageSize?: number;
  initialSort?: { key: string; direction: SortDirection };
  emptyMessage?: string;
  className?: string;
}

const collator = new Intl.Collator("es", { sensitivity: "base", numeric: true });

export function DataTable<Row>({
  columns,
  rows,
  rowKey,
  caption,
  pageSize = 10,
  initialSort,
  emptyMessage = "Nada por aquí. Prueba a quitar algún filtro.",
  className,
}: DataTableProps<Row>) {
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    const column = sort ? columns.find((c) => c.key === sort.key) : undefined;
    if (!sort || !column?.sortValue) return rows;
    const getValue = column.sortValue;
    const factor = sort.direction === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = getValue(a);
      const vb = getValue(b);
      const result =
        typeof va === "number" && typeof vb === "number" ? va - vb : collator.compare(String(va), String(vb));
      return result * factor;
    });
  }, [rows, columns, sort]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const visible = sorted.slice(currentPage * pageSize, currentPage * pageSize + pageSize);

  function toggleSort(key: string) {
    setPage(0);
    setSort((prev) =>
      prev?.key === key ? { key, direction: prev.direction === "asc" ? "desc" : "asc" } : { key, direction: "asc" },
    );
  }

  return (
    <div className={cx(styles.wrapper, className)}>
      <div className={styles.scroller} tabIndex={0} role="region" aria-label={caption}>
        <table className={styles.table}>
          <caption className="visually-hidden">{caption}</caption>
          <thead>
            <tr>
              {columns.map((column) => {
                const isSorted = sort?.key === column.key;
                const ariaSort = isSorted ? (sort.direction === "asc" ? "ascending" : "descending") : undefined;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={ariaSort}
                    className={cx(styles.th, column.align === "end" && styles.end, column.sticky && styles.sticky)}
                  >
                    {column.sortValue ? (
                      <button
                        type="button"
                        className={cx(styles.sortButton, tx.label, isSorted && styles.sorted)}
                        onClick={() => toggleSort(column.key)}
                      >
                        {column.header}
                        <span aria-hidden="true" className={styles.arrow}>
                          {isSorted ? (sort.direction === "asc" ? "▲" : "▼") : "↕"}
                        </span>
                      </button>
                    ) : (
                      <span className={tx.label}>{column.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={styles.empty}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              visible.map((row) => (
                <tr key={rowKey(row)} className={styles.row}>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cx(styles.td, column.align === "end" && styles.end, column.sticky && styles.sticky)}
                    >
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 1 ? (
        <nav className={styles.pagination} aria-label="Paginación de la tabla">
          <button
            type="button"
            className={cx(styles.pageButton, tx.label)}
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            ← Anterior
          </button>
          <p className={tx.label} aria-live="polite">
            Página {currentPage + 1} de {pageCount}
          </p>
          <button
            type="button"
            className={cx(styles.pageButton, tx.label)}
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage >= pageCount - 1}
          >
            Siguiente →
          </button>
        </nav>
      ) : null}
    </div>
  );
}
