import Link from "next/link";
import { IceCream } from "@/components/illustrations/IceCream";
import { Sticker } from "@/components/ui/Sticker";
import { STORY_CATEGORY_LABELS, type Story } from "@/domain/story";
import { cx } from "@/lib/cx";
import { formatShortDate } from "@/lib/format";
import tx from "@/styles/type.module.css";
import styles from "./StoryCard.module.css";

export type StoryCardVariant = "lead" | "compact" | "tile";

interface StoryCardProps {
  story: Story;
  variant?: StoryCardVariant;
  headingLevel?: "h2" | "h3";
  className?: string;
}

/**
 * Tarjeta de historia.
 * - lead: destacado grande con ilustración y entradilla.
 * - compact: miniatura a la izquierda y titular (laterales).
 * - tile: vertical pequeña (fila de 5).
 */
export function StoryCard({ story, variant = "compact", headingLevel = "h3", className }: StoryCardProps) {
  const Heading = headingLevel;
  return (
    <article className={cx(styles.card, styles[variant], className)}>
      <div className={cx(styles.media, styles[story.family])}>
        <IceCream kind={story.art} family={story.family} className={styles.art} />
        {variant === "lead" ? (
          <Sticker id={`story-${story.slug}`} tone="pink" className={styles.sticker}>
            {STORY_CATEGORY_LABELS[story.category]}
          </Sticker>
        ) : null}
      </div>
      <div className={styles.body}>
        {variant !== "lead" ? (
          <p className={cx(styles.category, tx.label)}>{STORY_CATEGORY_LABELS[story.category]}</p>
        ) : null}
        <Heading className={cx(styles.title, variant === "lead" ? tx.heading : tx.bodyStrong)}>
          <Link href={`/historias/${story.slug}`} className={styles.link}>
            {story.title}
          </Link>
        </Heading>
        {variant === "lead" ? <p className={styles.excerpt}>{story.excerpt}</p> : null}
        <p className={cx(styles.date, tx.label)}>
          <time dateTime={story.date}>{formatShortDate(story.date)}</time>
        </p>
      </div>
    </article>
  );
}
