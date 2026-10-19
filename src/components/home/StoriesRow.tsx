"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { IceCream } from "@/components/illustrations/IceCream";
import { Sticker } from "@/components/ui/Sticker";
import type { Snap } from "@/domain/story";
import { cx } from "@/lib/cx";
import { getSeenSnaps, getServerSeenSnaps, markSnapSeen, subscribeSeenSnaps } from "@/lib/seenSnaps";
import tx from "@/styles/type.module.css";
import styles from "./StoriesRow.module.css";

/** Duración de cada pantalla cuando avanza sola. */
const FRAME_MS = 5000;

interface Position {
  snap: number;
  frame: number;
}

export function StoriesRow({ snaps, label = "Stories" }: { snaps: Snap[]; label?: string }) {
  const seen = useSyncExternalStore(subscribeSeenSnaps, getSeenSnaps, getServerSeenSnaps);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const [position, setPosition] = useState<Position | null>(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  const go = useCallback(
    (direction: 1 | -1) => {
      setPosition((current) => {
        if (!current) return current;
        const snap = snaps[current.snap];
        if (!snap) return null;
        const frame = current.frame + direction;
        if (frame >= 0 && frame < snap.frames.length) return { snap: current.snap, frame };
        const nextSnap = current.snap + direction;
        if (nextSnap < 0) return { snap: 0, frame: 0 };
        if (nextSnap >= snaps.length) {
          close();
          return null;
        }
        return { snap: nextSnap, frame: direction === 1 ? 0 : (snaps[nextSnap]?.frames.length ?? 1) - 1 };
      });
    },
    [snaps, close],
  );

  // Marca como vista la story que se abre.
  const currentSnap = position ? snaps[position.snap] : undefined;
  useEffect(() => {
    if (currentSnap) markSnapSeen(currentSnap.id);
  }, [currentSnap]);

  // Avance automático con barra de progreso (sin autoplay con movimiento reducido).
  useEffect(() => {
    if (!position || paused || reducedMotion) return;
    let frameId = 0;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min(1, (now - start) / FRAME_MS);
      progressRef.current?.style.setProperty("--progress", String(progress));
      if (progress >= 1) go(1);
      else frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [position, paused, reducedMotion, go]);

  function open(index: number) {
    setPosition({ snap: index, frame: 0 });
    setPaused(false);
    dialogRef.current?.showModal();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  }

  const frame = currentSnap && position ? currentSnap.frames[position.frame] : undefined;

  return (
    <section className={styles.row} aria-label={label}>
      <ul className={styles.list}>
        {snaps.map((snap, index) => {
          const isSeen = seen.has(snap.id);
          return (
            <li key={snap.id}>
              <button type="button" className={styles.bubble} onClick={() => open(index)}>
                <span className={cx(styles.ring, !isSeen && styles.unseen)}>
                  <span className={cx(styles.circle, styles[snap.family])}>
                    <IceCream kind={snap.art} family={snap.family} className={styles.art} />
                  </span>
                </span>
                <span className={cx(styles.label, tx.label)}>
                  {snap.label}
                  {!isSeen ? <span className="visually-hidden"> (sin ver)</span> : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        className={styles.viewer}
        aria-label={currentSnap ? `Story: ${currentSnap.label}` : "Story"}
        onClose={() => setPosition(null)}
        onKeyDown={onKeyDown}
      >
        {currentSnap && position && frame ? (
          <div className={cx(styles.frame, styles[currentSnap.family])}>
            <div className={styles.segments} aria-hidden="true">
              {currentSnap.frames.map((_, i) => (
                <span key={i} className={styles.segment}>
                  <span
                    ref={i === position.frame ? progressRef : undefined}
                    className={styles.segmentFill}
                    style={
                      {
                        "--progress": i < position.frame || (i === position.frame && reducedMotion) ? 1 : 0,
                      } as React.CSSProperties
                    }
                  />
                </span>
              ))}
            </div>

            <div className={styles.top}>
              <p className={tx.label}>{currentSnap.label}</p>
              <div className={styles.topActions}>
                {!reducedMotion ? (
                  <button
                    type="button"
                    className={cx(styles.iconButton, tx.label)}
                    onClick={() => setPaused((p) => !p)}
                    aria-label={paused ? "Reanudar" : "Pausar"}
                  >
                    <span aria-hidden="true">{paused ? "▶" : "❚❚"}</span>
                  </button>
                ) : null}
                <button type="button" className={cx(styles.iconButton, tx.label)} onClick={close} aria-label="Cerrar">
                  <span aria-hidden="true">✕</span>
                </button>
              </div>
            </div>

            <div className={styles.content} aria-live="polite">
              <IceCream kind={currentSnap.art} family={currentSnap.family} className={styles.bigArt} />
              {frame.sticker ? (
                <Sticker id={`${currentSnap.id}-${position.frame}`} tone="pink" size="spray">
                  {frame.sticker}
                </Sticker>
              ) : null}
              <p className={cx(styles.text, tx.title)}>{frame.text}</p>
              <p className={cx(styles.counter, tx.label)}>
                {position.frame + 1} / {currentSnap.frames.length}
              </p>
            </div>

            <div className={styles.bottom}>
              <button type="button" className={cx(styles.nav, tx.label)} onClick={() => go(-1)}>
                ← Anterior
              </button>
              <Link href={currentSnap.cta.href} className={cx(styles.cta, tx.label)} onClick={close}>
                {currentSnap.cta.label}
              </Link>
              <button type="button" className={cx(styles.nav, tx.label)} onClick={() => go(1)}>
                Siguiente →
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
