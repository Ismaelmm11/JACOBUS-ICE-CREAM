import type { StoreEvent } from "@/domain/schedule";
import { cx } from "@/lib/cx";
import { dateParts } from "@/lib/format";
import tx from "@/styles/type.module.css";
import styles from "./EventCard.module.css";

export function EventCard({ event }: { event: StoreEvent }) {
  const parts = dateParts(event.date);
  return (
    <article className={cx(styles.card, styles[event.family])}>
      <time dateTime={event.date} className={styles.date}>
        <span className={tx.label}>{parts.weekday}</span>
        <span className={cx(styles.day, tx.heading)}>{parts.day}</span>
        <span className={tx.label}>{parts.month}</span>
      </time>
      <h3 className={tx.title}>{event.title}</h3>
      <p className={tx.label}>
        {event.start}–{event.end}
      </p>
      <p>{event.summary}</p>
    </article>
  );
}
