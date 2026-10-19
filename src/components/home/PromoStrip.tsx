import { Button } from "@/components/ui/Button";
import { Sticker } from "@/components/ui/Sticker";
import { cx } from "@/lib/cx";
import tx from "@/styles/type.module.css";
import styles from "./PromoStrip.module.css";

interface PromoStripProps {
  sticker: string;
  title: string;
  text: string;
  cta: { label: string; href: string };
}

/** Franja de promo en pastel-vainilla con borde ink y esquinas rectas. */
export function PromoStrip({ sticker, title, text, cta }: PromoStripProps) {
  return (
    <aside className={styles.strip} aria-label="Promoción">
      <Sticker id={`promo-${sticker}`} tone="pink" size="spray" className={styles.sticker}>
        {sticker}
      </Sticker>
      <div className={styles.copy}>
        <p className={cx(styles.title, tx.title)}>{title}</p>
        <p>{text}</p>
      </div>
      <Button href={cta.href} variant="secondary" className={styles.cta}>
        {cta.label}
      </Button>
    </aside>
  );
}
