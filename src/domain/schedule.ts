import type { FlavorFamily } from "./flavor";

/** 0 = domingo … 6 = sábado (igual que Date.getDay()). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface TimeRange {
  /** «HH:MM» en hora local de la tienda */
  opens: string;
  closes: string;
}

export interface DayHours {
  day: Weekday;
  label: string;
  /** Vacío = cerrado */
  ranges: TimeRange[];
}

export interface SocialLink {
  network: string;
  handle: string;
  /** null mientras sea TODO */
  url: string | null;
}

export interface ContactInfo {
  address: string;
  city: string;
  phone: string;
  email: string;
  social: SocialLink[];
}

export interface StoreEvent {
  slug: string;
  title: string;
  /** AAAA-MM-DD */
  date: string;
  start: string;
  end: string;
  summary: string;
  family: FlavorFamily;
}

export interface Showcase {
  today: string[];
  tomorrow: string[];
}

export interface Schedule {
  timezone: string;
  contact: ContactInfo;
  weeklyHours: DayHours[];
  showcase: Showcase;
  events: StoreEvent[];
}
