"use client";

import { useRef, useState, type CSSProperties } from "react";
import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import { FlavorCard, type FlavorCardData } from "@/components/ui/FlavorCard";
import type { IllustrationKind } from "@/domain/story";
import { cx } from "@/lib/cx";
import { rotationFromId } from "@/lib/rotation";
import styles from "./FlavorRail.module.css";

const ART_CYCLE: IllustrationKind[] = ["cucurucho", "tarrina", "bola"];

interface FlavorRailProps {
  flavors: FlavorCardData[];
  label: string;
  /** Slug que lleva el sticker «Nuevo» (neon-lime): como mucho uno por pantalla. */
  newSlug?: string | null;
}

/** Rail horizontal de sabores (equivale al rail «Trending» de NBA). */
export function FlavorRail({ flavors, label, newSlug }: FlavorRailProps) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  function syncEdges(swiper: SwiperInstance) {
    setEdges({ start: swiper.isBeginning, end: swiper.isEnd });
  }

  return (
    <div className={styles.rail}>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          style={{ "--sticker-rotation": `${rotationFromId(`${label}-prev`)}deg` } as CSSProperties}
          onClick={() => swiperRef.current?.slidePrev()}
          disabled={edges.start}
          aria-label="Sabores anteriores"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          className={styles.arrow}
          style={{ "--sticker-rotation": `${rotationFromId(`${label}-next`)}deg` } as CSSProperties}
          onClick={() => swiperRef.current?.slideNext()}
          disabled={edges.end}
          aria-label="Más sabores"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <Swiper
        modules={[A11y, Keyboard]}
        slidesPerView={1.2}
        spaceBetween={16}
        breakpoints={{
          480: { slidesPerView: 1.6, spaceBetween: 16 },
          640: { slidesPerView: 2.3, spaceBetween: 24 },
          1024: { slidesPerView: 3.3, spaceBetween: 24 },
          1280: { slidesPerView: 4, spaceBetween: 24 },
        }}
        keyboard={{ enabled: true, onlyInViewport: true }}
        a11y={{
          enabled: true,
          containerMessage: label,
          containerRoleDescriptionMessage: "carrusel",
          itemRoleDescriptionMessage: "sabor",
          slideLabelMessage: "{{index}} de {{slidesLength}}",
        }}
        watchSlidesProgress
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          syncEdges(swiper);
        }}
        onSlideChange={syncEdges}
        onResize={syncEdges}
        className={styles.swiper}
      >
        {flavors.map((flavor, index) => (
          <SwiperSlide key={flavor.slug} className={styles.slide}>
            <FlavorCard
              flavor={flavor}
              illustration={ART_CYCLE[index % ART_CYCLE.length]}
              isNew={flavor.slug === newSlug}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
