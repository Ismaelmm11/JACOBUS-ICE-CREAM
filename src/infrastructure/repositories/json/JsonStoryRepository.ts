import rawSnaps from "@/data/snaps.json";
import rawStories from "@/data/stories.json";
import { FAMILY_ORDER } from "@/domain/flavor";
import type { StoryRepository } from "@/domain/repositories";
import { ILLUSTRATION_KINDS, STORY_CATEGORIES, type Snap, type Story, type StoryCategory } from "@/domain/story";
import { assertArray, assertBoolean, assertOneOf, assertRecord, assertString, fail } from "./validate";

function parseStory(raw: unknown, index: number): Story {
  const p = `stories[${index}]`;
  const r = assertRecord(raw, p);
  const date = assertString(r.date, `${p}.date`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(`${p}.date`, "formato AAAA-MM-DD");
  return {
    slug: assertString(r.slug, `${p}.slug`),
    category: assertOneOf(r.category, STORY_CATEGORIES, `${p}.category`),
    title: assertString(r.title, `${p}.title`),
    heroTitle: assertString(r.heroTitle, `${p}.heroTitle`),
    excerpt: assertString(r.excerpt, `${p}.excerpt`),
    date,
    author: assertString(r.author, `${p}.author`),
    family: assertOneOf(r.family, FAMILY_ORDER, `${p}.family`),
    art: assertOneOf(r.art, ILLUSTRATION_KINDS, `${p}.art`),
    featured: assertBoolean(r.featured, `${p}.featured`),
    relatedFlavors: assertArray(r.relatedFlavors, `${p}.relatedFlavors`).map((v, i) =>
      assertString(v, `${p}.relatedFlavors[${i}]`),
    ),
    body: assertString(r.body, `${p}.body`),
  };
}

function parseSnap(raw: unknown, index: number): Snap {
  const p = `snaps[${index}]`;
  const r = assertRecord(raw, p);
  const cta = assertRecord(r.cta, `${p}.cta`);
  return {
    id: assertString(r.id, `${p}.id`),
    label: assertString(r.label, `${p}.label`),
    family: assertOneOf(r.family, FAMILY_ORDER, `${p}.family`),
    art: assertOneOf(r.art, ILLUSTRATION_KINDS, `${p}.art`),
    frames: assertArray(r.frames, `${p}.frames`).map((rawFrame, i) => {
      const f = assertRecord(rawFrame, `${p}.frames[${i}]`);
      return {
        text: assertString(f.text, `${p}.frames[${i}].text`),
        sticker: f.sticker === null ? null : assertString(f.sticker, `${p}.frames[${i}].sticker`),
      };
    }),
    cta: { label: assertString(cta.label, `${p}.cta.label`), href: assertString(cta.href, `${p}.cta.href`) },
  };
}

export class JsonStoryRepository implements StoryRepository {
  private readonly stories = assertArray(rawStories, "stories")
    .map(parseStory)
    .sort((a, b) => b.date.localeCompare(a.date));
  private readonly snaps = assertArray(rawSnaps, "snaps").map(parseSnap);

  async list(): Promise<Story[]> {
    return [...this.stories];
  }

  async getBySlug(slug: string): Promise<Story | null> {
    return this.stories.find((s) => s.slug === slug) ?? null;
  }

  async listFeatured(): Promise<Story[]> {
    return this.stories.filter((s) => s.featured);
  }

  async listByCategory(category: StoryCategory): Promise<Story[]> {
    return this.stories.filter((s) => s.category === category);
  }

  /** Primero las de la misma categoría, luego las que comparten sabores, luego el resto. */
  async listRelated(story: Story, limit: number): Promise<Story[]> {
    const score = (other: Story) =>
      (other.category === story.category ? 2 : 0) +
      other.relatedFlavors.filter((f) => story.relatedFlavors.includes(f)).length;
    return this.stories
      .filter((s) => s.slug !== story.slug)
      .map((s) => ({ s, score: score(s) }))
      .sort((a, b) => b.score - a.score || b.s.date.localeCompare(a.s.date))
      .slice(0, limit)
      .map(({ s }) => s);
  }

  async listByFlavor(slug: string): Promise<Story[]> {
    return this.stories.filter((s) => s.relatedFlavors.includes(slug));
  }

  async listSnaps(): Promise<Snap[]> {
    return this.snaps;
  }
}
