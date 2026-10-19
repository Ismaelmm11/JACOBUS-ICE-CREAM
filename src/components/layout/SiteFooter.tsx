import Link from "next/link";
import { Sticker } from "@/components/ui/Sticker";
import type { MegaMenuColumn } from "@/components/ui/MegaMenu";
import type { ContactInfo, DayHours } from "@/domain/schedule";
import { cx } from "@/lib/cx";
import tx from "@/styles/type.module.css";
import { Logo } from "./Logo";
import { NAV_LINKS } from "./navigation";
import styles from "./SiteFooter.module.css";

interface SiteFooterProps {
  families: MegaMenuColumn[];
  hours: DayHours[];
  contact: ContactInfo;
}


function isTodo(value: string): boolean {
  return value.startsWith("TODO");
}

export function SiteFooter({ families, hours, contact }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Logo />
          <p className={cx(tx.body, styles.tagline)}>Helado de barrio en Elda. Dulce por fuera, punk por dentro.</p>
          <Sticker id="footer-elda" tone="fresa" size="spray">
            Hecho en Elda
          </Sticker>
        </div>

        <div className={styles.columns}>
          <nav aria-labelledby="footer-sabores" className={styles.column}>
            <h2 id="footer-sabores" className={cx(styles.columnTitle, tx.label)}>
              Sabores
            </h2>
            <ul className={styles.list}>
              {families.map((family) => (
                <li key={family.family}>
                  <Link href={family.href} className={styles.link}>
                    <span className={cx(styles.dot, styles[family.family])} aria-hidden="true" />
                    {family.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-tienda" className={styles.column}>
            <h2 id="footer-tienda" className={cx(styles.columnTitle, tx.label)}>
              La tienda
            </h2>
            <ul className={styles.list}>
              <li>
                <Link href="/sabores" className={styles.link}>
                  Todos los sabores
                </Link>
              </li>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="footer-horario" className={styles.column}>
            <h2 id="footer-horario" className={cx(styles.columnTitle, tx.label)}>
              Horario
            </h2>
            <dl className={styles.hours}>
              {hours.map((day) => (
                <div key={day.day} className={styles.hoursRow}>
                  <dt>{day.label}</dt>
                  <dd className={day.ranges.length === 0 ? styles.closed : undefined}>
                    {day.ranges.length === 0
                      ? "Cerrado"
                      : day.ranges.map((r) => <span key={r.opens}>{`${r.opens}–${r.closes}`}</span>)}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="footer-contacto" className={styles.column}>
            <h2 id="footer-contacto" className={cx(styles.columnTitle, tx.label)}>
              Contacto
            </h2>
            <address className={styles.address}>
              <span className={cx(isTodo(contact.address) && styles.todo)}>{contact.address}</span>
              <span>{contact.city}</span>
              <span className={cx(isTodo(contact.phone) && styles.todo)}>{contact.phone}</span>
              <span className={cx(isTodo(contact.email) && styles.todo)}>{contact.email}</span>
            </address>
            <ul className={styles.social} aria-label="Redes sociales">
              {contact.social.map((s) => (
                <li key={s.network}>
                  {s.url ? (
                    <a href={s.url} className={cx(styles.socialLink, tx.label)} rel="noopener noreferrer" target="_blank">
                      {s.network}
                    </a>
                  ) : (
                    <span className={cx(styles.socialLink, styles.socialTodo, tx.label)}>
                      {s.network}: {s.handle}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className={styles.legal}>
        <div className={styles.legalInner}>
          <p className={tx.label}>© {year} Jacobus Ice Cream · Elda</p>
          <ul className={styles.legalList}>
            <li className={styles.todo}>TODO: Aviso legal</li>
            <li className={styles.todo}>TODO: Privacidad</li>
            <li className={styles.todo}>TODO: Cookies</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
