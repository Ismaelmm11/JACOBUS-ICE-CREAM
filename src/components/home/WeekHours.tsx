"use client";

import { useEffect, useState } from "react";
import type { DayHours, Weekday } from "@/domain/schedule";
import { cx } from "@/lib/cx";
import { storeNow } from "@/lib/storeTime";
import tx from "@/styles/type.module.css";
import styles from "./WeekHours.module.css";

/** Horario semanal; el día de hoy (hora de la tienda) se marca en el cliente. */
export function WeekHours({ hours, timezone }: { hours: DayHours[]; timezone: string }) {
  const [today, setToday] = useState<Weekday | null>(null);

  useEffect(() => {
    setToday(storeNow(timezone).day);
  }, [timezone]);

  return (
    <dl className={styles.list}>
      {hours.map((day) => {
        const isToday = day.day === today;
        return (
          <div key={day.day} className={cx(styles.row, isToday && styles.today)}>
            <dt className={isToday ? tx.bodyStrong : undefined}>
              {day.label}
              {isToday ? <span className={cx(styles.badge, tx.label)}>Hoy</span> : null}
            </dt>
            <dd className={cx(styles.time, day.ranges.length === 0 && styles.closed)}>
              {day.ranges.length === 0
                ? "Cerrado"
                : day.ranges.map((r) => <span key={r.opens}>{`${r.opens}–${r.closes}`}</span>)}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
