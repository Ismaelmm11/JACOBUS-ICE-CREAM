import rawSchedule from "@/data/schedule.json";
import { FAMILY_ORDER } from "@/domain/flavor";
import type { ScheduleRepository } from "@/domain/repositories";
import type { ContactInfo, DayHours, Schedule, Showcase, StoreEvent, Weekday } from "@/domain/schedule";
import { assertArray, assertNumber, assertOneOf, assertRecord, assertString, fail } from "./validate";

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

function parseTime(value: unknown, path: string): string {
  const time = assertString(value, path);
  if (!TIME.test(time)) fail(path, "formato HH:MM");
  return time;
}

function parseSchedule(raw: unknown): Schedule {
  const r = assertRecord(raw, "schedule");
  const contact = assertRecord(r.contact, "schedule.contact");
  const showcase = assertRecord(r.showcase, "schedule.showcase");

  const weeklyHours: DayHours[] = assertArray(r.weeklyHours, "schedule.weeklyHours").map((rawDay, i) => {
    const p = `schedule.weeklyHours[${i}]`;
    const d = assertRecord(rawDay, p);
    const day = assertNumber(d.day, `${p}.day`);
    if (!Number.isInteger(day) || day < 0 || day > 6) fail(`${p}.day`, "entre 0 (domingo) y 6 (sábado)");
    return {
      day: day as Weekday,
      label: assertString(d.label, `${p}.label`),
      ranges: assertArray(d.ranges, `${p}.ranges`).map((rawRange, j) => {
        const range = assertRecord(rawRange, `${p}.ranges[${j}]`);
        return {
          opens: parseTime(range.opens, `${p}.ranges[${j}].opens`),
          closes: parseTime(range.closes, `${p}.ranges[${j}].closes`),
        };
      }),
    };
  });

  const events: StoreEvent[] = assertArray(r.events, "schedule.events").map((rawEvent, i) => {
    const p = `schedule.events[${i}]`;
    const e = assertRecord(rawEvent, p);
    const date = assertString(e.date, `${p}.date`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(`${p}.date`, "formato AAAA-MM-DD");
    return {
      slug: assertString(e.slug, `${p}.slug`),
      title: assertString(e.title, `${p}.title`),
      date,
      start: parseTime(e.start, `${p}.start`),
      end: parseTime(e.end, `${p}.end`),
      summary: assertString(e.summary, `${p}.summary`),
      family: assertOneOf(e.family, FAMILY_ORDER, `${p}.family`),
    };
  });

  return {
    timezone: assertString(r.timezone, "schedule.timezone"),
    contact: {
      address: assertString(contact.address, "schedule.contact.address"),
      city: assertString(contact.city, "schedule.contact.city"),
      phone: assertString(contact.phone, "schedule.contact.phone"),
      email: assertString(contact.email, "schedule.contact.email"),
      social: assertArray(contact.social, "schedule.contact.social").map((rawSocial, i) => {
        const s = assertRecord(rawSocial, `schedule.contact.social[${i}]`);
        return {
          network: assertString(s.network, `schedule.contact.social[${i}].network`),
          handle: assertString(s.handle, `schedule.contact.social[${i}].handle`),
          url: s.url === null ? null : assertString(s.url, `schedule.contact.social[${i}].url`),
        };
      }),
    },
    weeklyHours,
    showcase: {
      today: assertArray(showcase.today, "schedule.showcase.today").map((v, i) =>
        assertString(v, `schedule.showcase.today[${i}]`),
      ),
      tomorrow: assertArray(showcase.tomorrow, "schedule.showcase.tomorrow").map((v, i) =>
        assertString(v, `schedule.showcase.tomorrow[${i}]`),
      ),
    },
    events,
  };
}

export class JsonScheduleRepository implements ScheduleRepository {
  private readonly schedule = parseSchedule(rawSchedule);

  async getWeeklyHours(): Promise<DayHours[]> {
    return this.schedule.weeklyHours;
  }

  async getContact(): Promise<ContactInfo> {
    return this.schedule.contact;
  }

  async getShowcase(): Promise<Showcase> {
    return this.schedule.showcase;
  }

  async listUpcomingEvents(from: Date): Promise<StoreEvent[]> {
    // Fecha local de la tienda (en-CA da AAAA-MM-DD), no la UTC del servidor.
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: this.schedule.timezone }).format(from);
    return this.schedule.events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  }

  async getTimezone(): Promise<string> {
    return this.schedule.timezone;
  }
}
