import type { FlavorFamily } from "@/domain/flavor";
import type { IllustrationKind } from "@/domain/story";
import { cx } from "@/lib/cx";
import styles from "./IceCream.module.css";

export type IceCreamKind = IllustrationKind;

interface IceCreamProps {
  kind?: IceCreamKind;
  family: FlavorFamily;
  /** Texto alternativo; si se omite, la ilustración es decorativa. */
  label?: string;
  className?: string;
}

/** Bola de helado con goteo. Ocupa la franja superior del viewBox (0–80). */
function Scoop({ y = 0 }: { y?: number }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <path
        className={styles.cream}
        d="M18 66 C14 34 36 12 60 12 C84 12 106 34 102 66
           C98 72 92 70 90 66 C88 76 80 80 76 72 C72 82 62 84 58 74
           C54 80 44 80 42 70 C38 76 28 76 26 68 C24 72 19 71 18 66 Z"
      />
      <path className={styles.shine} d="M36 34 C40 26 48 22 56 21" />
      <rect className={styles.sprinklePink} x="44" y="40" width="10" height="4" transform="rotate(-24 49 42)" />
      <rect className={styles.sprinkleCyan} x="68" y="32" width="10" height="4" transform="rotate(30 73 34)" />
      <rect className={styles.sprinklePink} x="78" y="50" width="10" height="4" transform="rotate(-8 83 52)" />
      <rect className={styles.sprinkleCyan} x="30" y="52" width="10" height="4" transform="rotate(16 35 54)" />
    </g>
  );
}

export function IceCream({ kind = "bola", family, label, className }: IceCreamProps) {
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true as const };

  return (
    <svg
      viewBox="0 0 120 140"
      className={cx(styles.svg, styles[family], className)}
      focusable="false"
      {...a11y}
    >
      {kind === "cucurucho" ? (
        <>
          <path className={styles.cone} d="M26 70 L94 70 L60 134 Z" />
          <path className={styles.waffle} d="M38 70 L70 116 M58 70 L80 102 M78 70 L88 84 M82 70 L50 116 M62 70 L40 102 M42 70 L32 84" />
          <Scoop y={4} />
        </>
      ) : null}

      {kind === "tarrina" ? (
        <>
          <Scoop y={14} />
          <path className={styles.cup} d="M14 82 L106 82 L94 132 L26 132 Z" />
          <path className={styles.band} d="M18 98 L102 98 L99 110 L21 110 Z" />
          <path className={styles.spoon} d="M84 40 L98 18" />
          <ellipse className={styles.spoonHead} cx="100" cy="14" rx="6" ry="8" transform="rotate(32 100 14)" />
        </>
      ) : null}

      {kind === "bola" ? (
        <>
          <ellipse className={styles.plate} cx="60" cy="122" rx="48" ry="10" />
          <Scoop y={38} />
        </>
      ) : null}
    </svg>
  );
}
