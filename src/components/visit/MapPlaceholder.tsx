import { Sticker } from "@/components/ui/Sticker";
import { cx } from "@/lib/cx";
import tx from "@/styles/type.module.css";
import styles from "./MapPlaceholder.module.css";

/** Mapa de mentira hasta tener la dirección real (no inventamos datos del negocio). */
export function MapPlaceholder({ address }: { address: string }) {
  return (
    <figure className={styles.map}>
      <svg viewBox="0 0 400 240" className={styles.svg} aria-hidden="true" focusable="false">
        <rect className={styles.block} x="20" y="20" width="110" height="70" />
        <rect className={styles.block} x="160" y="20" width="90" height="70" />
        <rect className={styles.park} x="280" y="20" width="100" height="70" />
        <rect className={styles.block} x="20" y="120" width="110" height="100" />
        <rect className={styles.here} x="160" y="120" width="90" height="100" />
        <rect className={styles.block} x="280" y="120" width="100" height="100" />
        <path className={styles.pin} d="M205 128 C190 128 182 140 182 150 C182 166 205 186 205 186 C205 186 228 166 228 150 C228 140 220 128 205 128 Z" />
        <circle className={styles.pinDot} cx="205" cy="151" r="7" />
      </svg>
      <Sticker id="map-aqui" tone="pink" className={styles.sticker}>
        Aquí estamos
      </Sticker>
      <figcaption className={cx(styles.caption, tx.label)}>{address}</figcaption>
    </figure>
  );
}
