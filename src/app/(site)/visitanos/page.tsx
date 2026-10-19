import type { Metadata } from "next";
import { WeekHours } from "@/components/home/WeekHours";
import { VISIT_SECTION_TABS } from "@/components/layout/sections";
import { SubNav } from "@/components/layout/SubNav";
import { Rail } from "@/components/ui/Rail";
import { SectionCard } from "@/components/ui/SectionCard";
import { EventCard } from "@/components/visit/EventCard";
import { MapPlaceholder } from "@/components/visit/MapPlaceholder";
import { OpenNow } from "@/components/visit/OpenNow";
import { scheduleRepository } from "@/infrastructure/repositories";
import { cx } from "@/lib/cx";
import page from "@/styles/page.module.css";
import tx from "@/styles/type.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Visítanos",
  description: "Horario, si estamos abiertos ahora mismo, cómo llegar y los próximos eventos en la heladería.",
};

// Los eventos «próximos» dependen de la fecha.
export const revalidate = 3600;

function isTodo(value: string) {
  return value.startsWith("TODO");
}

export default async function VisitPage() {
  const [hours, timezone, contact, events] = await Promise.all([
    scheduleRepository.getWeeklyHours(),
    scheduleRepository.getTimezone(),
    scheduleRepository.getContact(),
    scheduleRepository.listUpcomingEvents(new Date()),
  ]);

  return (
    <>
      <SubNav title="Visítanos" titleAs="h1" items={VISIT_SECTION_TABS} />
      <div className={page.container}>
        <div className={page.split}>
          <div className={cx(page.main, styles.main)}>
            <OpenNow hours={hours} timezone={timezone} />
            <SectionCard id="horario" title="Horario">
              <WeekHours hours={hours} timezone={timezone} />
              <p className={cx(tx.body, tx.muted, styles.note)}>
                En festivos puede cambiar. Si vienes de lejos, mejor pregunta antes.
              </p>
            </SectionCard>
          </div>

          <div className={page.aside}>
            <SectionCard id="como-llegar" title="Cómo llegar">
              <MapPlaceholder address={contact.address} />
              <address className={styles.address}>
                <span className={cx(isTodo(contact.address) && styles.todo)}>{contact.address}</span>
                <span>{contact.city}</span>
                <span className={cx(isTodo(contact.phone) && styles.todo)}>{contact.phone}</span>
                <span className={cx(isTodo(contact.email) && styles.todo)}>{contact.email}</span>
              </address>
            </SectionCard>
          </div>
        </div>

        <SectionCard id="eventos" title="Próximos eventos" action={{ href: "/historias/categoria/evento", label: "Historias de eventos" }}>
          {events.length ? (
            <Rail
              label="Próximos eventos"
              itemName="evento"
              items={events.map((event) => ({ key: event.slug, node: <EventCard event={event} /> }))}
            />
          ) : (
            <p className={tx.muted}>No hay nada en el calendario. Se nos ocurrirá algo, tranquilo.</p>
          )}
        </SectionCard>
      </div>
    </>
  );
}
