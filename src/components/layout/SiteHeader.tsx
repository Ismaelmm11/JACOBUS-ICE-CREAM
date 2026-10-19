"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { MegaMenu, type MegaMenuColumn } from "@/components/ui/MegaMenu";
import { cx } from "@/lib/cx";
import tx from "@/styles/type.module.css";
import { Logo } from "./Logo";
import { NAV_LINKS, ORDER_CTA } from "./navigation";
import styles from "./SiteHeader.module.css";

interface SiteHeaderProps {
  flavorColumns: MegaMenuColumn[];
}

/** Distancia mínima de scroll antes de esconder/mostrar, para que no tiemble. */
const SCROLL_THRESHOLD = 8;
/**
 * No se esconde hasta pasar el ticker y el propio header. Va fijo porque con
 * position: sticky el offsetTop del header se mueve con el scroll.
 */
const HIDE_AFTER = 200;

export function SiteHeader({ flavorColumns }: SiteHeaderProps) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Como en NBA: se oculta al bajar y reaparece al subir.
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    function update() {
      frame = 0;
      const y = window.scrollY;
      const header = headerRef.current;
      const delta = y - lastY;
      if (Math.abs(delta) < SCROLL_THRESHOLD) return;
      // Nunca se esconde con el foco dentro (teclado) o con el mega-menú abierto.
      const busy = header?.contains(document.activeElement) ?? false;
      setHidden(delta > 0 && y > HIDE_AFTER && !busy);
      lastY = y;
    }

    function onScroll() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Cerrar el panel móvil al navegar.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  function openMenu() {
    dialogRef.current?.showModal();
    setMenuOpen(true);
  }

  function closeMenu() {
    dialogRef.current?.close();
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header
      ref={headerRef}
      className={cx(styles.header, hidden && styles.hidden)}
      onFocus={() => setHidden(false)}
    >
      <div className={styles.inner}>
        <Logo className={styles.logo} />

        <nav className={styles.nav} aria-label="Principal">
          <ul className={styles.navList}>
            <li>
              <MegaMenu
                label="Sabores"
                columns={flavorColumns}
                placement="container"
                footerLink={{ label: "Todos los sabores", href: "/sabores" }}
              />
            </li>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cx(styles.navLink, tx.label)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <ThemeToggle className={styles.toggle} />
          <Button href={ORDER_CTA.href} size="sm" className={styles.cta}>
            {ORDER_CTA.label}
          </Button>
          <button
            type="button"
            className={styles.burger}
            onClick={openMenu}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-label="Abrir menú"
          >
            <span className={styles.burgerLines} aria-hidden="true" />
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className={styles.panel}
        aria-label="Menú"
        onClose={() => setMenuOpen(false)}
      >
        <div className={styles.panelTop}>
          <Logo onSurface onClick={closeMenu} />
          <button type="button" className={cx(styles.close, tx.label)} onClick={closeMenu}>
            Cerrar <span aria-hidden="true">✕</span>
          </button>
        </div>

        <nav aria-label="Principal (móvil)" className={styles.panelNav}>
          <ul className={styles.panelList}>
            <li>
              <Link href="/sabores" className={cx(styles.panelLink, tx.heading)} onClick={closeMenu}>
                Sabores
              </Link>
              <ul className={styles.familyList}>
                {flavorColumns.map((column) => (
                  <li key={column.family}>
                    <Link href={column.href} className={cx(styles.familyLink, tx.bodyStrong)} onClick={closeMenu}>
                      <span className={cx(styles.dot, styles[column.family])} aria-hidden="true" />
                      {column.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cx(styles.panelLink, tx.heading)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.panelBottom}>
          <ThemeToggle />
          <Button href={ORDER_CTA.href} onClick={closeMenu}>
            {ORDER_CTA.label}
          </Button>
        </div>
      </dialog>
    </header>
  );
}
