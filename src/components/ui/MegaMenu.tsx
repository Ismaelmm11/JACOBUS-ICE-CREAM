"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FocusEvent } from "react";
import type { FlavorFamily } from "@/domain/flavor";
import { cx } from "@/lib/cx";
import tx from "@/styles/type.module.css";
import styles from "./MegaMenu.module.css";

export interface MegaMenuColumn {
  family: FlavorFamily;
  title: string;
  href: string;
  links: Array<{ label: string; href: string }>;
}

interface MegaMenuProps {
  label: string;
  columns: MegaMenuColumn[];
  footerLink?: { label: string; href: string };
  /** «container»: el panel se ancla al ancestro posicionado (p. ej. todo el header). */
  placement?: "trigger" | "container";
  className?: string;
}

/**
 * Mega-menú tipo «disclosure» (botón + panel), como el desplegable Teams de NBA.
 * Escape cierra y devuelve el foco al botón; salir con Tab o clicar fuera también cierra.
 */
export function MegaMenu({ label, columns, footerLink, placement = "trigger", className }: MegaMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function onBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
  }

  return (
    <div
      ref={rootRef}
      className={cx(styles.root, placement === "container" && styles.inContainer, className)}
      onBlur={onBlur}
    >
      <button
        ref={triggerRef}
        type="button"
        className={cx(styles.trigger, tx.label)}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.triggerText}>{label}</span>
        <span aria-hidden="true" className={cx(styles.caret, open && styles.caretOpen)}>
          ▾
        </span>
      </button>

      <div id={panelId} className={styles.panel} hidden={!open}>
        <div className={styles.columns}>
          {columns.map((column) => (
            <div key={column.family} className={styles.column}>
              <h2 className={cx(styles.columnTitle, tx.label)}>
                <Link href={column.href} className={styles.columnLink} onClick={() => setOpen(false)}>
                  <span className={cx(styles.swatch, styles[column.family])} aria-hidden="true" />
                  {column.title}
                </Link>
              </h2>
              <ul className={styles.list}>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.link} onClick={() => setOpen(false)}>
                      <span className={cx(styles.dot, styles[column.family])} aria-hidden="true" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {footerLink ? (
          <div className={styles.footer}>
            <Link href={footerLink.href} className={cx(styles.footerLink, tx.label)} onClick={() => setOpen(false)}>
              {footerLink.label} <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
