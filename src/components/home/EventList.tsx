import type { StoreEvent } from "@/domain/schedule";
import { cx } from "@/lib/cx";
import { dateParts } from "@/lib/format";
import tx from "@/styles/type.module.css";
import styles from "./EventList.module.css";

/** Próximos eventos con bloque de fecha tipo calendario. */
export function EventList({ events }: { events: StoreEvent[] }) {
  if (events.length === 0) {
    return <p className={tx.muted}>No hay nada en el calendario. Se nos ocurrirá algo, tranquilo.</p>;
  }
  return (
    <ul className={styles.list}>
      {events.map((event) => {
        const parts = dateParts(event.date);
        return (
          <li key={event.slug} className={styles.item}>
            <time dateTime={event.date} className={cx(styles.date, styles[event.family])}>
              <span className={tx.label}>{parts.weekday}</span>
              <span className={cx(styles.day, tx.title)}>{parts.day}</span>
              <span className={tx.label}>{parts.month}</span>
            </time>
            <div className={styles.body}>
              <h3 className={tx.bodyStrong}>{event.title}</h3>
              <p className={cx(tx.label, tx.muted)}>
                {event.start}–{event.end}
              </p>
              <p className={styles.summary}>{event.summary}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
