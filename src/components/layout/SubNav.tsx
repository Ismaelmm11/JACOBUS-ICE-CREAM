"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";
import tx from "@/styles/type.module.css";
import styles from "./SubNav.module.css";

export interface SubNavItem {
  href: string;
  label: string;
  /** exact (por defecto) o prefix: activo también en sus subrutas. */
  match?: "exact" | "prefix";
}

interface SubNavProps {
  title: string;
  items: SubNavItem[];
  /** Por defecto el título es un párrafo: el h1 lo pone la página. */
  titleAs?: "p" | "h1";
}

/** Barra de sección con tabs subrayados, como la sub-nav blanca de cada sección de NBA. */
export function SubNav({ title, items, titleAs = "p" }: SubNavProps) {
  const pathname = usePathname();
  const Title = titleAs;

  // Gana el ítem más específico que encaje (evita que /sabores marque también /sabores/comparar).
  const activeHref = items
    .filter((item) =>
      item.match === "prefix" ? pathname === item.href || pathname.startsWith(`${item.href}/`) : pathname === item.href,
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <Title className={cx(styles.title, tx.heading)}>{title}</Title>
        <nav aria-label={`Secciones de ${title}`} className={styles.nav}>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cx(styles.tab, tx.label)}
                  aria-current={item.href === activeHref ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
