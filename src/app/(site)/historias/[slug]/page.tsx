import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IceCream } from "@/components/illustrations/IceCream";
import { STORY_SECTION_TABS } from "@/components/layout/sections";
import { SubNav } from "@/components/layout/SubNav";
import { StoryCard } from "@/components/stories/StoryCard";
import { FlavorCard } from "@/components/ui/FlavorCard";
import { SectionCard } from "@/components/ui/SectionCard";
import { Sticker } from "@/components/ui/Sticker";
import { STORY_CATEGORY_LABELS } from "@/domain/story";
import { flavorRepository, storyRepository } from "@/infrastructure/repositories";
import { cx } from "@/lib/cx";
import { formatLongDate } from "@/lib/format";
import { renderMarkdown } from "@/lib/markdown";
import page from "@/styles/page.module.css";
import tx from "@/styles/type.module.css";
import styles from "./page.module.css";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export async function generateStaticParams() {
  const stories = await storyRepository.list();
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const story = await storyRepository.getBySlug((await params).slug);
  return story ? { title: story.title, description: story.excerpt } : {};
}

function readingMinutes(text: string): number {
  return Math.max(1, Math.round(text.split(/\s+/).length / 200));
}

export default async function StoryPage({ params }: { params: Params }) {
  const story = await storyRepository.getBySlug((await params).slug);
  if (!story) notFound();

  const [related, flavors] = await Promise.all([
    storyRepository.listRelated(story, 4),
    flavorRepository.listBySlugs(story.relatedFlavors),
  ]);

  return (
    <>
      <SubNav title="Historias" items={STORY_SECTION_TABS} />
      <div className={page.container}>
        <div className={page.split}>
          <article className={cx(page.main, styles.article)} aria-labelledby="historia-titulo">
            <header className={styles.header}>
              <Sticker id={`cat-${story.slug}`} tone="pink">
                {STORY_CATEGORY_LABELS[story.category]}
              </Sticker>
              <h1 id="historia-titulo" className={tx.heading}>
                {story.title}
              </h1>
              <p className={cx(styles.excerpt, tx.title)}>{story.excerpt}</p>
              <p className={cx(styles.byline, tx.label)}>
                <span>Por {story.author}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={story.date}>{formatLongDate(story.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{readingMinutes(story.body)} min de lectura</span>
              </p>
            </header>

            <div className={cx(styles.cover, styles[story.family])}>
              <IceCream kind={story.art} family={story.family} className={styles.coverArt} />
            </div>

            <div className={styles.body}>
              {renderMarkdown(story.body, { h2: tx.title, quote: styles.quote, list: styles.list })}
            </div>

            {flavors.length ? (
              <section aria-labelledby="sabores-mencionados" className={styles.flavors}>
                <h2 id="sabores-mencionados" className={tx.heading}>
                  Sabores de esta historia
                </h2>
                <ul className={styles.flavorGrid}>
                  {flavors.map((flavor) => (
                    <li key={flavor.slug}>
                      <FlavorCard flavor={flavor} illustration="tarrina" />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <p className={styles.back}>
              <Link href="/historias" className={tx.label}>
                ← Todas las historias
              </Link>
            </p>
          </article>

          <aside className={page.aside} aria-label="Relacionado">
            <SectionCard title="Relacionado" headingLevel="h2" action={{ href: "/historias", label: "Todas" }}>
              <div className={styles.related}>
                {related.map((s) => (
                  <StoryCard key={s.slug} story={s} variant="compact" />
                ))}
              </div>
            </SectionCard>
          </aside>
        </div>
      </div>
    </>
  );
}
