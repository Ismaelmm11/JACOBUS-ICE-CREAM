import type { Flavor, FlavorFamily } from "./flavor";
import type { ContactInfo, DayHours, Showcase, StoreEvent } from "./schedule";
import type { Snap, Story, StoryCategory } from "./story";

/**
 * Contratos de acceso a datos. Los componentes solo conocen estas interfaces;
 * hoy las implementa un JSON local y mañana puede ser una API sin tocar la UI.
 * Todo es async para que el cambio sea transparente.
 */
export interface FlavorRepository {
  list(): Promise<Flavor[]>;
  getBySlug(slug: string): Promise<Flavor | null>;
  listByFamily(family: FlavorFamily): Promise<Flavor[]>;
  listBySlugs(slugs: readonly string[]): Promise<Flavor[]>;
  listMostOrdered(limit: number): Promise<Flavor[]>;
  /** El sabor dado de alta más recientemente (lleva el sticker «Nuevo»). */
  getNewest(): Promise<Flavor | null>;
}

export interface ScheduleRepository {
  getWeeklyHours(): Promise<DayHours[]>;
  getContact(): Promise<ContactInfo>;
  getShowcase(): Promise<Showcase>;
  listUpcomingEvents(from: Date): Promise<StoreEvent[]>;
  getTimezone(): Promise<string>;
}

export interface StoryRepository {
  /** Más recientes primero. */
  list(): Promise<Story[]>;
  getBySlug(slug: string): Promise<Story | null>;
  listFeatured(): Promise<Story[]>;
  listByCategory(category: StoryCategory): Promise<Story[]>;
  listRelated(story: Story, limit: number): Promise<Story[]>;
  listSnaps(): Promise<Snap[]>;
}
