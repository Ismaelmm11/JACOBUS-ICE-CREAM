import type { DayHours, Weekday } from "@/domain/schedule";

const WEEKDAYS: Record<string, Weekday> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** Día de la semana y minutos desde medianoche en la zona horaria de la tienda. */
export function storeNow(timezone: string, now = new Date()): { day: Weekday; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    day: WEEKDAYS[get("weekday")] ?? 0,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

function toMinutes(time: string): number {
  const [h = "0", m = "0"] = time.split(":");
  return Number(h) * 60 + Number(m);
}

export interface OpenStatus {
  open: boolean;
  /** «Cierra a las 22:00» / «Abre a las 16:30» / «Hoy no abrimos» */
  detail: string;
}

export function openStatus(hours: DayHours[], timezone: string, now = new Date()): OpenStatus {
  const { day, minutes } = storeNow(timezone, now);
  const today = hours.find((h) => h.day === day);
  const ranges = today?.ranges ?? [];
  const current = ranges.find((r) => minutes >= toMinutes(r.opens) && minutes < toMinutes(r.closes));
  if (current) return { open: true, detail: `Cierra a las ${current.closes}` };
  const next = ranges.find((r) => minutes < toMinutes(r.opens));
  if (next) return { open: false, detail: `Abre a las ${next.opens}` };
  return { open: false, detail: ranges.length ? "Hoy ya hemos cerrado" : "Hoy no abrimos" };
}
