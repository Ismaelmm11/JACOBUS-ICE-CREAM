import type { Flavor, FlavorFamily } from "./flavor";
import type { ContactInfo, DayHours, Showcase, StoreEvent } from "./schedule";

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
}

export interface ScheduleRepository {
  getWeeklyHours(): Promise<DayHours[]>;
  getContact(): Promise<ContactInfo>;
  getShowcase(): Promise<Showcase>;
  listUpcomingEvents(from: Date): Promise<StoreEvent[]>;
  getTimezone(): Promise<string>;
}
