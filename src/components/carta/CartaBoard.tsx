"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { IceCream } from "@/components/illustrations/IceCream";
import { Sticker } from "@/components/ui/Sticker";
import { Switch } from "@/components/ui/Switch";
import { ALLERGEN_LABELS, FAMILY_LABELS, STOCK_LABELS, type Flavor } from "@/domain/flavor";
import type { MenuDay } from "@/domain/menu";
import { cx } from "@/lib/cx";
import { formatPrice } from "@/lib/format";
import tx from "@/styles/type.module.css";
import styles from "./CartaBoard.module.css";

export type CartaFlavor = Pick<
  Flavor,
  "slug" | "name" | "family" | "prices" | "allergens" | "vegan" | "lactoseFree" | "glutenFree"
>;

interface CartaBoardProps {
  /** 14 días a partir de hoy */
  days: MenuDay[];
  flavors: Record<string, CartaFlavor>;
}

const DAYS_PER_WEEK = 7;
const weekdayFmt = new Intl.DateTimeFormat("es-ES", { weekday: "short", timeZone: "UTC" });
const longFmt = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const monthFmt = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric", timeZone: "UTC" });

function toDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`);
}

function dayName(day: MenuDay): string {
  if (day.offset === 0) return "Hoy";
  if (day.offset === 1) return "Mañana";
  return weekdayFmt.format(toDate(day.iso)).replace(".", "");
}

export function CartaBoard({ days, flavors }: CartaBoardProps) {
  const [week, setWeek] = useState(0);
  // Por defecto, el primer día que abrimos (si hoy es lunes, mañana).
  const [selectedIso, setSelectedIso] = useState((days.find((d) => d.open) ?? days[0])?.iso ?? "");
  const [hideSoldOut, setHideSoldOut] = useState(false);
  const [onlyVegan, setOnlyVegan] = useState(false);

  const weekDays = days.slice(week * DAYS_PER_WEEK, week * DAYS_PER_WEEK + DAYS_PER_WEEK);
  const weekCount = Math.ceil(days.length / DAYS_PER_WEEK);
  const selected = days.find((d) => d.iso === selectedIso) ?? days[0];

  const rows = useMemo(() => {
    if (!selected) return [];
    return selected.entries
      .map((entry) => ({ entry, flavor: flavors[entry.slug] }))
      .filter((row): row is { entry: typeof row.entry; flavor: CartaFlavor } => row.flavor !== undefined)
      .filter(({ entry }) => !hideSoldOut || entry.stock !== "agotado")
      .filter(({ flavor }) => !onlyVegan || flavor.vegan);
  }, [selected, flavors, hideSoldOut, onlyVegan]);

  function changeWeek(next: number) {
    setWeek(next);
    const week = days.slice(next * DAYS_PER_WEEK, next * DAYS_PER_WEEK + DAYS_PER_WEEK);
    const first = week.find((d) => d.open) ?? week[0];
    if (first) setSelectedIso(first.iso);
  }

  const monthLabel = weekDays[0] ? monthFmt.format(toDate(weekDays[0].iso)) : "";

  return (
    <div className={styles.board}>
      <div className={styles.calendar}>
        <div className={styles.calendarTop}>
          <p className={cx(styles.month, tx.title)}>{monthLabel}</p>
          <div className={styles.weekNav}>
            <button
              type="button"
              className={cx(styles.weekButton, tx.label)}
              onClick={() => changeWeek(week - 1)}
              disabled={week === 0}
            >
              ← Esta semana
            </button>
            <button
              type="button"
              className={cx(styles.weekButton, tx.label)}
              onClick={() => changeWeek(week + 1)}
              disabled={week >= weekCount - 1}
            >
              Próxima →
            </button>
          </div>
        </div>

        <ul className={styles.days} aria-label="Elige un día">
          {weekDays.map((day) => {
            const isSelected = day.iso === selected?.iso;
            return (
              <li key={day.iso}>
                <button
                  type="button"
                  className={cx(styles.day, isSelected && styles.daySelected, !day.open && styles.dayClosed)}
                  aria-pressed={isSelected}
                  aria-label={`${longFmt.format(toDate(day.iso))}${day.open ? "" : ", cerrado"}`}
                  onClick={() => setSelectedIso(day.iso)}
                >
                  <span className={tx.label}>{dayName(day)}</span>
                  <span className={cx(styles.dayNumber, tx.title)}>{toDate(day.iso).getUTCDate()}</span>
                  <span className={cx(styles.dayMeta, tx.label)}>
                    {day.open ? `${day.entries.length} sab.` : "Cerrado"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.toolbar}>
        <p className={tx.bodyStrong} aria-live="polite">
          {selected ? longFmt.format(toDate(selected.iso)) : ""}
          {selected?.open ? ` · ${rows.length} sabores` : ""}
        </p>
        <div className={styles.switches}>
          <Switch checked={hideSoldOut} onChange={setHideSoldOut} label="Ocultar agotados" />
          <Switch checked={onlyVegan} onChange={setOnlyVegan} label="Solo veganos" />
        </div>
      </div>

      {!selected?.open ? (
        <div className={styles.empty}>
          <Sticker id="carta-cerrado" tone="lavanda" size="spray">
            Cerrado
          </Sticker>
          <p className={tx.body}>Ese día descansamos. Hasta las mantecadoras necesitan un respiro.</p>
        </div>
      ) : rows.length === 0 ? (
        <div className={styles.empty}>
          <p className={tx.body}>Con esos filtros no queda nada en la vitrina. Prueba a quitar alguno.</p>
        </div>
      ) : (
        <ul className={styles.rows}>
          {rows.map(({ entry, flavor }) => (
            <li key={flavor.slug} className={cx(styles.row, entry.stock === "agotado" && styles.soldOut)}>
              {/* Zona 1 · ficha */}
              <div className={styles.zoneInfo}>
                <span className={cx(styles.thumb, styles[flavor.family])}>
                  <IceCream kind="bola" family={flavor.family} />
                </span>
                <div className={styles.infoText}>
                  <p className={cx(tx.label, tx.muted)}>{FAMILY_LABELS[flavor.family]}</p>
                  <h2 className={tx.title}>
                    <Link href={`/sabores/${flavor.slug}`} className={styles.name}>
                      {flavor.name}
                    </Link>
                  </h2>
                  {entry.stock !== "disponible" ? (
                    <span className={cx(styles.stock, styles[entry.stock], tx.label)}>{STOCK_LABELS[entry.stock]}</span>
                  ) : null}
                </div>
              </div>

              {/* Zona 2 · tamaños y precios */}
              <dl className={styles.zonePrices}>
                {(
                  [
                    ["Bola", flavor.prices.scoop],
                    ["Tarrina S", flavor.prices.tubS],
                    ["Tarrina M", flavor.prices.tubM],
                    ["Tarrina L", flavor.prices.tubL],
                  ] as const
                ).map(([size, price]) => (
                  <div key={size} className={styles.price}>
                    <dt className={cx(tx.label, tx.muted)}>{size}</dt>
                    <dd className={tx.price}>{formatPrice(price)}</dd>
                  </div>
                ))}
              </dl>

              {/* Zona 3 · alérgenos */}
              <div className={styles.zoneAllergens}>
                <p className={cx(tx.label, tx.muted)}>Alérgenos</p>
                <p className={tx.bodyStrong}>
                  {flavor.allergens.length
                    ? flavor.allergens.map((a) => ALLERGEN_LABELS[a]).join(" · ")
                    : "Sin alérgenos principales"}
                </p>
                <ul className={styles.tags} aria-label="Apto para">
                  {flavor.vegan ? <li className={cx(styles.tag, tx.label)}>Vegano</li> : null}
                  {flavor.lactoseFree ? <li className={cx(styles.tag, tx.label)}>Sin lactosa</li> : null}
                  {flavor.glutenFree ? <li className={cx(styles.tag, tx.label)}>Sin gluten</li> : null}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
