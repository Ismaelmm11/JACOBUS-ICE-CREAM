import type { CSSProperties, ReactNode } from "react";
import { cx } from "@/lib/cx";
import { rotationFromId } from "@/lib/rotation";
import tx from "@/styles/type.module.css";
import styles from "./Sticker.module.css";

export type StickerTone =
  | "pink"
  | "lime"
  | "cyan"
  | "fresa"
  | "pistacho"
  | "vainilla"
  | "lavanda"
  | "raised";

interface StickerProps {
  /** Semilla de la rotación determinista. */
  id: string;
  tone?: StickerTone;
  /** label = badge pequeño; spray = Rubik Spray Paint ≥ 28px, máx. 3 palabras. */
  size?: "label" | "spray";
  /** Sin rotación (p. ej. dentro de tablas densas). */
  flat?: boolean;
  className?: string;
  children: ReactNode;
}

export function Sticker({ id, tone = "pink", size = "label", flat = false, className, children }: StickerProps) {
  const style = { "--sticker-rotation": `${flat ? 0 : rotationFromId(id)}deg` } as CSSProperties;
  return (
    <span
      className={cx(styles.sticker, styles[tone], size === "spray" ? tx.sticker : tx.label, styles[size], className)}
      style={style}
    >
      {children}
    </span>
  );
}
