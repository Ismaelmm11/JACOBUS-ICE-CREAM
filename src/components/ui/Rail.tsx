"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import { rotationFromId } from "@/lib/rotation";
import styles from "./Rail.module.css";

export interface RailItem {
  key: string;
  node: ReactNode;
}

interface RailProps {
  items: RailItem[];
  /** Nombre accesible del carrusel y semilla de la rotación de las flechas. */
  label: string;
  /** Qué es cada elemento, para el lector de pantalla («sabor», «evento»…). */
  itemName?: string;
}

/** Rail horizontal con Swiper y flechas en sticker (equivale a los rails de vídeo de NBA). */
export function Rail({ items, label, itemName = "elemento" }: RailProps) {
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
          aria-label="Anteriores"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          className={styles.arrow}
          style={{ "--sticker-rotation": `${rotationFromId(`${label}-next`)}deg` } as CSSProperties}
          onClick={() => swiperRef.current?.slideNext()}
          disabled={edges.end}
          aria-label="Siguientes"
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
          itemRoleDescriptionMessage: itemName,
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
        {items.map((item) => (
          <SwiperSlide key={item.key} className={styles.slide}>
            {item.node}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
