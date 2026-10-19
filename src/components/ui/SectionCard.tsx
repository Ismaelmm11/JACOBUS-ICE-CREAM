import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import tx from "@/styles/type.module.css";
import styles from "./SectionCard.module.css";

interface SectionCardProps {
  title: string;
  /** id de la sección; el título recibe `${id}-titulo` para aria-labelledby. */
  id?: string;
  action?: { href: string; label: string };
  headingLevel?: "h2" | "h3";
  className?: string;
  children: ReactNode;
}

export function SectionCard({ title, id, action, headingLevel = "h2", className, children }: SectionCardProps) {
  const Heading = headingLevel;
  const headingId = id ? `${id}-titulo` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className={cx(styles.card, className)}>
      <header className={styles.header}>
        <Heading id={headingId} className={tx.heading}>
          {title}
        </Heading>
        {action ? (
          <Link href={action.href} className={cx(styles.action, tx.label)}>
            {action.label}
            <span aria-hidden="true"> →</span>
          </Link>
        ) : null}
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
