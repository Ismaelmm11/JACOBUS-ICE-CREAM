import Link from "next/link";
import { IceCream } from "@/components/illustrations/IceCream";
import { FAMILY_LABELS, FAMILY_ORDER, type Flavor } from "@/domain/flavor";
import type { IllustrationKind } from "@/domain/story";
import { cx } from "@/lib/cx";
import tx from "@/styles/type.module.css";
import styles from "./FamilyTiles.module.css";

const ART: Record<(typeof FAMILY_ORDER)[number], IllustrationKind> = {
  frutales: "cucurucho",
  "frutos-secos": "bola",
  cremas: "tarrina",
  chocolate: "cucurucho",
};

/** Accesos a las cuatro familias (equivale a la rejilla de equipos de NBA). */
export function FamilyTiles({ flavors }: { flavors: Flavor[] }) {
  return (
    <ul className={styles.grid}>
      {FAMILY_ORDER.map((family) => {
        const count = flavors.filter((f) => f.family === family).length;
        return (
          <li key={family}>
            <Link href={`/sabores#${family}`} className={cx(styles.tile, styles[family])}>
              <IceCream kind={ART[family]} family={family} className={styles.art} />
              <span className={tx.title}>{FAMILY_LABELS[family]}</span>
              <span className={tx.label}>{count} sabores →</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
