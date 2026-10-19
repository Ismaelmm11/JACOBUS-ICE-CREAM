"use client";

import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";
import tx from "@/styles/type.module.css";
import styles from "./FilterChip.module.css";

interface FilterChipProps extends Omit<ComponentPropsWithoutRef<"button">, "type"> {
  active: boolean;
}

export function FilterChip({ active, className, children, ...rest }: FilterChipProps) {
  return (
    <button
      {...rest}
      type="button"
      aria-pressed={active}
      className={cx(styles.chip, active && styles.active, tx.label, className)}
    >
      <span className={styles.check} aria-hidden="true">
        {active ? "✓" : "+"}
      </span>
      {children}
    </button>
  );
}
