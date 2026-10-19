import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Ticker } from "@/components/ui/Ticker";
import { flavorRepository, scheduleRepository } from "@/infrastructure/repositories";
import { buildFamilyColumns, buildShowcaseDays } from "@/lib/flavorNav";
import styles from "./SiteShell.module.css";

/** Ticker + header + main + footer. Lo usan el layout del sitio y el 404 global. */
export async function SiteShell({ children }: { children: React.ReactNode }) {
  const [flavors, showcase, hours, contact] = await Promise.all([
    flavorRepository.list(),
    scheduleRepository.getShowcase(),
    scheduleRepository.getWeeklyHours(),
    scheduleRepository.getContact(),
  ]);
  const [today, tomorrow] = await Promise.all([
    flavorRepository.listBySlugs(showcase.today),
    flavorRepository.listBySlugs(showcase.tomorrow),
  ]);
  const columns = buildFamilyColumns(flavors);

  return (
    <div className={styles.shell}>
      {/* Como el scoreboard de NBA: arriba del todo y se va con el scroll. */}
      <Ticker days={buildShowcaseDays(today, tomorrow)} label="En la vitrina" />
      <SiteHeader flavorColumns={columns} />
      <main id="contenido" className={styles.main}>
        {children}
      </main>
      <SiteFooter families={columns} hours={hours} contact={contact} />
    </div>
  );
}
