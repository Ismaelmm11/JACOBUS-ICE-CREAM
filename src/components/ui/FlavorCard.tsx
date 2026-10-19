import Link from "next/link";
import { FAMILY_LABELS, STOCK_LABELS, type Flavor } from "@/domain/flavor";
import { IceCream, type IceCreamKind } from "@/components/illustrations/IceCream";
import { cx } from "@/lib/cx";
import { formatPrice } from "@/lib/format";
import tx from "@/styles/type.module.css";
import { Sticker } from "./Sticker";
import styles from "./FlavorCard.module.css";

export type FlavorCardData = Pick<
  Flavor,
  "slug" | "name" | "family" | "prices" | "stock" | "vegan" | "lactoseFree"
>;

interface FlavorCardProps {
  flavor: FlavorCardData;
  illustration?: IceCreamKind;
  /** Sticker «Nuevo» en neon-lime. Úsalo como mucho en una tarjeta por pantalla. */
  isNew?: boolean;
  headingLevel?: "h2" | "h3" | "h4";
  className?: string;
}

export function FlavorCard({
  flavor,
  illustration = "bola",
  isNew = false,
  headingLevel = "h3",
  className,
}: FlavorCardProps) {
  const Heading = headingLevel;
  const soldOut = flavor.stock === "agotado";

  return (
    <article className={cx(styles.card, styles[flavor.family], soldOut && styles.soldOut, className)}>
      <div className={styles.media}>
        <IceCream kind={illustration} family={flavor.family} className={styles.art} />
        <div className={styles.stickers}>
          {isNew ? (
            <Sticker id={`${flavor.slug}-nuevo`} tone="lime">
              Nuevo
            </Sticker>
          ) : null}
          {flavor.stock === "queda-poco" || flavor.stock === "recien-hecho" || soldOut ? (
            <Sticker id={`${flavor.slug}-stock`} tone={soldOut ? "raised" : "pink"}>
              {STOCK_LABELS[flavor.stock]}
            </Sticker>
          ) : null}
        </div>
      </div>

      <p className={cx(styles.family, tx.label)}>{FAMILY_LABELS[flavor.family]}</p>
      <Heading className={cx(styles.name, tx.title)}>
        <Link href={`/sabores/${flavor.slug}`} className={styles.link}>
          {flavor.name}
        </Link>
      </Heading>

      <div className={styles.footer}>
        <p className={styles.price}>
          <span className={tx.label}>Bola</span> <span className={tx.price}>{formatPrice(flavor.prices.scoop)}</span>
        </p>
        {flavor.vegan || flavor.lactoseFree ? (
          <ul className={styles.tags} aria-label="Apto para">
            {flavor.vegan ? <li className={cx(styles.tag, tx.label)}>Vegano</li> : null}
            {flavor.lactoseFree && !flavor.vegan ? <li className={cx(styles.tag, tx.label)}>Sin lactosa</li> : null}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
