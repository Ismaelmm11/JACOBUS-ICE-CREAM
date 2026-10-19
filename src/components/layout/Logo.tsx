import Link from "next/link";
import { cx } from "@/lib/cx";
import styles from "./Logo.module.css";

interface LogoProps {
  /** true cuando va sobre surface (panel móvil) en vez de sobre el header oscuro. */
  onSurface?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * No hay logotipo: el logo se compone en Unbounded 900. El texto visible es el
 * nombre accesible («Jacobus Ice Cream, inicio»), así la etiqueta coincide (2.5.3).
 */
export function Logo({ onSurface = false, className, onClick }: LogoProps) {
  return (
    <Link href="/" className={cx(styles.logo, onSurface && styles.onSurface, className)} onClick={onClick}>
      <span className={styles.word}>JACOBUS</span> <span className={styles.sub}>ICE CREAM</span>
      <span className="visually-hidden">, inicio</span>
    </Link>
  );
}
