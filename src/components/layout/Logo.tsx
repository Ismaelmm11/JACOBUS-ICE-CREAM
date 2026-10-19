import Link from "next/link";
import { cx } from "@/lib/cx";
import styles from "./Logo.module.css";

/** No hay logotipo: el logo se compone en Unbounded 900. */
interface LogoProps {
  /** true cuando va sobre surface (panel móvil) en vez de sobre el header oscuro. */
  onSurface?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Logo({ onSurface = false, className, onClick }: LogoProps) {
  return (
    <Link href="/" className={cx(styles.logo, onSurface && styles.onSurface, className)} onClick={onClick} aria-label="Jacobus Ice Cream, inicio">
      <span className={styles.word} aria-hidden="true">
        JACOBUS
      </span>
      <span className={styles.sub} aria-hidden="true">
        ICE CREAM
      </span>
    </Link>
  );
}
