"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { A11y, Autoplay, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import type { FlavorFamily } from "@/domain/flavor";
import { IceCream, type IceCreamKind } from "@/components/illustrations/IceCream";
import { cx } from "@/lib/cx";
import tx from "@/styles/type.module.css";
import { Sticker } from "./Sticker";
import styles from "./ProgressCarousel.module.css";

export interface CarouselSlide {
  id: string;
  /** Texto corto de la barra de progreso y del sticker. */
  kicker: string;
  title: string;
  text: string;
  cta: { label: string; href: string };
  family: FlavorFamily;
  art: IceCreamKind;
}

interface ProgressCarouselProps {
  slides: CarouselSlide[];
  label: string;
  /** Debe coincidir con --carousel-interval de tokens.css. */
  interval?: number;
  /** display solo si es el único display de la vista. */
  titleStyle?: "display" | "heading";
  className?: string;
}

export function ProgressCarousel({
  slides,
  label,
  interval = 6000,
  titleStyle = "heading",
  className,
}: ProgressCarouselProps) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const barRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Sin autoplay con prefers-reduced-motion: el usuario puede darle a play si quiere.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) {
      swiperRef.current?.autoplay.start();
      setPlaying(true);
    }
  }, []);

  function togglePlay() {
    const swiper = swiperRef.current;
    if (!swiper) return;
    if (playing) {
      swiper.autoplay.stop();
      setBar(active, 1);
      setPlaying(false);
    } else {
      swiper.autoplay.start();
      setPlaying(true);
    }
  }

  function setBar(index: number, value: number) {
    barRefs.current[index]?.style.setProperty("--progress", String(value));
  }

  return (
    <section className={cx(styles.carousel, className)} aria-roledescription="carrusel" aria-label={label}>
      <Swiper
        modules={[A11y, Autoplay, Keyboard]}
        slidesPerView={1}
        spaceBetween={24}
        rewind
        keyboard={{ enabled: true, onlyInViewport: true }}
        autoplay={{ enabled: false, delay: interval, disableOnInteraction: false, pauseOnMouseEnter: true }}
        a11y={{
          enabled: true,
          containerRoleDescriptionMessage: "carrusel",
          itemRoleDescriptionMessage: "historia",
          slideLabelMessage: "{{index}} de {{slidesLength}}",
          prevSlideMessage: "Historia anterior",
          nextSlideMessage: "Historia siguiente",
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          const next = swiper.realIndex;
          slides.forEach((_, index) => setBar(index, index < next ? 1 : 0));
          setActive(next);
        }}
        onAutoplayTimeLeft={(swiper, _timeLeft, percentage) => {
          setBar(swiper.realIndex, 1 - percentage);
        }}
        className={styles.swiper}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className={styles.slideWrap}>
            <article className={cx(styles.slide, styles[slide.family])}>
              <div className={styles.copy}>
                <Sticker id={slide.id} tone="pink" className={styles.kicker}>
                  {slide.kicker}
                </Sticker>
                <h2 className={cx(styles.title, titleStyle === "display" ? tx.display : tx.heading)}>{slide.title}</h2>
                <p className={cx(styles.text, tx.body)}>{slide.text}</p>
                <Link href={slide.cta.href} className={cx(styles.cta, tx.label)} tabIndex={index === active ? 0 : -1}>
                  {slide.cta.label} <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className={styles.art} aria-hidden="true">
                <IceCream kind={slide.art} family={slide.family} />
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.controls}>
        <ol className={styles.bars}>
          {slides.map((slide, index) => {
            const state = index < active ? 1 : index === active ? (playing ? 0 : 1) : 0;
            return (
              <li key={slide.id} className={styles.barItem}>
                <button
                  type="button"
                  className={cx(styles.barButton, index === active && styles.barActive)}
                  aria-current={index === active ? "true" : undefined}
                  onClick={() => swiperRef.current?.slideTo(index)}
                >
                  <span
                    ref={(node) => {
                      barRefs.current[index] = node;
                    }}
                    className={styles.track}
                    style={{ "--progress": state } as CSSProperties}
                    aria-hidden="true"
                  />
                  <span className={cx(styles.barLabel, tx.label)}>
                    <span className="visually-hidden">Ir a la historia {index + 1}: </span>
                    {slide.kicker}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <button
          type="button"
          className={cx(styles.play, tx.label)}
          onClick={togglePlay}
          aria-label={playing ? "Pausar el carrusel" : "Reproducir el carrusel"}
        >
          <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span>
        </button>
      </div>
    </section>
  );
}
