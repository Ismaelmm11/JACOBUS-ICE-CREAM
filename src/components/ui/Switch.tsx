"use client";

import { cx } from "@/lib/cx";
import tx from "@/styles/type.module.css";
import styles from "./Switch.module.css";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}

/**
 * Interruptor on/off (como Hide Scores en NBA). No usa neon-lime: así varios
 * pueden estar activos a la vez sin romper la regla de un lime por pantalla.
 */
export function Switch({ checked, onChange, label, className }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cx(styles.switch, tx.label, className)}
      onClick={() => onChange(!checked)}
    >
      <span className={cx(styles.track, checked && styles.on)} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      {label}
    </button>
  );
}
