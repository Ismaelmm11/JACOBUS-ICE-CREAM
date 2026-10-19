"use client";

import Link from "next/link";
import { useRef } from "react";
import { FAMILY_LABELS, STOCK_LABELS, type FlavorFamily, type StockStatus } from "@/domain/flavor";
import { cx } from "@/lib/cx";
import { formatPrice } from "@/lib/format";
import tx from "@/styles/type.module.css";
import styles from "./Ticker.module.css";

export interface TickerItem {
  id: string;
  name: string;
  family: FlavorFamily;
  price: number;
  status: StockStatus;
  href: string;
}

export interface TickerDay {
  /** «HOY», «MAÑANA»… */
  day: string;
  items: TickerItem[];
}

interface TickerProps {
  days: TickerDay[];
  label?: string;
  className?: string;
}

/** «En la vitrina hoy»: equivalente al scoreboard de partidos, con separador por día. */
export function Ticker({ days, label = "En la vitrina hoy", className }: TickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <section className={cx(styles.ticker, className)} aria-label={label}>
      <button
        type="button"
        className={cx(styles.arrow, styles.prev)}
        onClick={() => scroll(-1)}
        aria-label="Ver sabores anteriores"
      >
        <span aria-hidden="true">←</span>
      </button>

      <div ref={trackRef} className={styles.track}>
        {days.map((group) => (
          <div key={group.day} className={styles.group} role="group" aria-label={group.day}>
            <p className={cx(styles.day, tx.label)} aria-hidden="true">
              {group.day}
            </p>
            <ul className={styles.list}>
              {group.items.map((item) => (
                <li key={item.id} className={styles.item}>
                  <Link
                    href={item.href}
                    className={cx(styles.card, item.status === "agotado" && styles.soldOut)}
                  >
                    {/* El nombre va primero en el DOM (es lo que se lee primero);
                        la familia se pinta encima con order. */}
                    <span className={cx(styles.name, tx.bodyStrong)}>{item.name}</span>
                    <span className={cx(styles.meta, tx.label)}>
                      <span className={cx(styles.dot, styles[item.family])} aria-hidden="true" />
                      {FAMILY_LABELS[item.family]}
                    </span>
                    <span className={styles.bottom}>
                      <span className={cx(styles.price, tx.price)}>{formatPrice(item.price)}</span>
                      {item.status !== "disponible" ? (
                        <span className={cx(styles.status, styles[item.status], tx.label)}>
                          {STOCK_LABELS[item.status]}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button
        type="button"
        className={cx(styles.arrow, styles.next)}
        onClick={() => scroll(1)}
        aria-label="Ver más sabores"
      >
        <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}
