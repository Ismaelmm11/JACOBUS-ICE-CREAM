import { SectionCard } from "@/components/ui/SectionCard";
import type { Story } from "@/domain/story";
import { cx } from "@/lib/cx";
import tx from "@/styles/type.module.css";
import { StoryCard } from "./StoryCard";
import styles from "./StoriesListing.module.css";

/**
 * Listado tipo News de NBA: destacado grande + 3 laterales, fila de 5 y el resto.
 * Con pocas historias (una categoría) se degrada sin huecos.
 */
export function StoriesListing({ stories }: { stories: Story[] }) {
  if (stories.length === 0) {
    return <p className={cx(tx.body, tx.muted)}>Todavía no hay historias aquí. Estamos en ello.</p>;
  }

  const [lead, ...others] = stories;
  const side = others.slice(0, 3);
  const row = others.slice(3, 8);
  const rest = others.slice(8);

  return (
    <div className={styles.listing}>
      <div className={styles.top}>
        {lead ? <StoryCard story={lead} variant="lead" headingLevel="h2" className={styles.lead} /> : null}
        {side.length ? (
          <div className={styles.side}>
            {side.map((story) => (
              <StoryCard key={story.slug} story={story} variant="compact" headingLevel="h2" />
            ))}
          </div>
        ) : null}
      </div>

      {row.length ? (
        <ul className={styles.row}>
          {row.map((story) => (
            <li key={story.slug}>
              <StoryCard story={story} variant="tile" headingLevel="h2" />
            </li>
          ))}
        </ul>
      ) : null}

      {rest.length ? (
        <SectionCard title="Más historias" headingLevel="h2">
          <div className={styles.rest}>
            {rest.map((story) => (
              <StoryCard key={story.slug} story={story} variant="compact" headingLevel="h3" />
            ))}
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}
