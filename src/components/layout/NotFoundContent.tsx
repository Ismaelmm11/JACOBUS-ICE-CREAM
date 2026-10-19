import { IceCream } from "@/components/illustrations/IceCream";
import { Button } from "@/components/ui/Button";
import { Sticker } from "@/components/ui/Sticker";
import { cx } from "@/lib/cx";
import tx from "@/styles/type.module.css";
import styles from "./NotFoundContent.module.css";

export function NotFoundContent() {
  return (
    <div className={styles.wrap}>
      <div className={styles.art}>
        <IceCream kind="bola" family="frutales" className={styles.scoop} />
        <Sticker id="404-derretido" tone="pink" size="spray" className={styles.sticker}>
          ¡Se derritió!
        </Sticker>
      </div>
      <p className={cx(tx.label, tx.muted)}>Error 404</p>
      <h1 className={tx.display}>Esta página ya no está</h1>
      <p className={cx(tx.body, styles.text)}>
        O nunca existió, o la dejamos demasiado rato fuera del congelador. Pasa, que dentro hay más.
      </p>
      <div className={styles.actions}>
        <Button href="/">Volver al inicio</Button>
        <Button href="/carta" variant="secondary">
          Ver la carta
        </Button>
      </div>
    </div>
  );
}
