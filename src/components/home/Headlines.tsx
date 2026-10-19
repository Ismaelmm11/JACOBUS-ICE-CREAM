import Link from "next/link";
import { STORY_CATEGORY_LABELS, type Story } from "@/domain/story";
import { cx } from "@/lib/cx";
import { formatShortDate } from "@/lib/format";
import tx from "@/styles/type.module.css";
import styles from "./Headlines.module.css";

/** Lista de titulares de la sidebar (equivale a «Headlines» en la home de NBA). */
export function Headlines({ stories }: { stories: Story[] }) {
  return (
    <ol className={styles.list}>
      {stories.map((story) => (
        <li key={story.slug} className={styles.item}>
          <p className={cx(styles.meta, tx.label)}>
            <span className={cx(styles.swatch, styles[story.family])} aria-hidden="true" />
            {STORY_CATEGORY_LABELS[story.category]}
            <span aria-hidden="true">·</span>
            <time dateTime={story.date}>{formatShortDate(story.date)}</time>
          </p>
          <Link href={`/historias/${story.slug}`} className={cx(styles.link, tx.bodyStrong)}>
            {story.title}
          </Link>
        </li>
      ))}
    </ol>
  );
}
