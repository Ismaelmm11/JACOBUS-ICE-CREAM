"use client";

import { useEffect, useState } from "react";
import type { DayHours } from "@/domain/schedule";
import { cx } from "@/lib/cx";
import { openStatus, type OpenStatus } from "@/lib/storeTime";
import tx from "@/styles/type.module.css";
import styles from "./OpenNow.module.css";

const REFRESH_MS = 60_000;

/**
 * «¿Abierto ahora?» con la hora de la tienda. Se calcula en el navegador (y se
 * refresca cada minuto) para que una página cacheada no mienta.
 */
export function OpenNow({ hours, timezone }: { hours: DayHours[]; timezone: string }) {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(openStatus(hours, timezone));
    update();
    const id = window.setInterval(update, REFRESH_MS);
    return () => window.clearInterval(id);
  }, [hours, timezone]);

  return (
    <div className={styles.card} aria-live="polite">
      <p className={tx.label}>¿Abierto ahora?</p>
      {status ? (
        <>
          <p className={cx(styles.badge, status.open ? styles.open : styles.closed, tx.label)}>
            <span aria-hidden="true">●</span> {status.open ? "Abierto" : "Cerrado"}
          </p>
          <p className={cx(tx.display, styles.answer)}>{status.open ? "¡Sí!" : "Ahora no"}</p>
          <p className={tx.bodyStrong}>{status.detail}</p>
        </>
      ) : (
        <p className={cx(tx.display, styles.answer)}>…</p>
      )}
    </div>
  );
}
