import type { FlavorFamily } from "./flavor";

export type StoryCategory = "sabor-nuevo" | "temporada" | "evento" | "promo" | "reportaje";

export const STORY_CATEGORIES: readonly StoryCategory[] = ["sabor-nuevo", "temporada", "evento", "promo", "reportaje"];

export const STORY_CATEGORY_LABELS: Record<StoryCategory, string> = {
  "sabor-nuevo": "Sabor nuevo",
  temporada: "Temporada",
  evento: "Evento",
  promo: "Promo",
  reportaje: "Reportaje",
};

export type IllustrationKind = "bola" | "tarrina" | "cucurucho";

export const ILLUSTRATION_KINDS: readonly IllustrationKind[] = ["bola", "tarrina", "cucurucho"];

/** Historia (equivale a una noticia de NBA). */
export interface Story {
  slug: string;
  category: StoryCategory;
  title: string;
  /** Titular corto (≤ 3 palabras) para el hero en `display`. */
  heroTitle: string;
  excerpt: string;
  /** AAAA-MM-DD */
  date: string;
  author: string;
  family: FlavorFamily;
  art: IllustrationKind;
  /** Aparece en el carrusel de la home. */
  featured: boolean;
  relatedFlavors: string[];
  /** Markdown sencillo: párrafos, ##, listas, **negrita**, *cursiva*, > cita. */
  body: string;
}

/** Story circular de la home (equivale a Storyteller en NBA). */
export interface Snap {
  id: string;
  label: string;
  family: FlavorFamily;
  art: IllustrationKind;
  frames: Array<{ text: string; sticker: string | null }>;
  cta: { label: string; href: string };
}
