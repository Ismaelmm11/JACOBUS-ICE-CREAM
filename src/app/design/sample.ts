// Datos de muestra SOLO para el catálogo /design. Los datos reales irán en src/data/*.json.
import type { CarouselSlide } from "@/components/ui/ProgressCarousel";
import type { FlavorCardData } from "@/components/ui/FlavorCard";
import type { MegaMenuColumn } from "@/components/ui/MegaMenu";
import type { TickerDay } from "@/components/ui/Ticker";

export const sampleFlavors: FlavorCardData[] = [
  {
    slug: "fresa-de-la-huerta",
    name: "Fresa de la huerta",
    family: "frutales",
    prices: { scoop: 3.5, tubS: 4.5, tubM: 7.9, tubL: 12.5 },
    stock: "recien-hecho",
    vegan: true,
    lactoseFree: true,
  },
  {
    slug: "pistacho-tostado",
    name: "Pistacho tostado",
    family: "frutos-secos",
    prices: { scoop: 3.9, tubS: 4.9, tubM: 8.5, tubL: 13.5 },
    stock: "queda-poco",
    vegan: false,
    lactoseFree: false,
  },
  {
    slug: "galleta-de-la-abuela",
    name: "Galleta de la abuela",
    family: "cremas",
    prices: { scoop: 3.5, tubS: 4.5, tubM: 7.9, tubL: 12.5 },
    stock: "disponible",
    vegan: false,
    lactoseFree: false,
  },
  {
    slug: "chocolate-negro-70",
    name: "Chocolate negro 70 %",
    family: "chocolate",
    prices: { scoop: 3.7, tubS: 4.7, tubM: 8.2, tubL: 13 },
    stock: "agotado",
    vegan: true,
    lactoseFree: true,
  },
];

export const sampleTicker: TickerDay[] = [
  {
    day: "Hoy",
    items: [
      { id: "t1", name: "Fresa de la huerta", family: "frutales", price: 3.5, status: "recien-hecho", href: "/sabores/fresa-de-la-huerta" },
      { id: "t2", name: "Pistacho tostado", family: "frutos-secos", price: 3.9, status: "queda-poco", href: "/sabores/pistacho-tostado" },
      { id: "t3", name: "Galleta de la abuela", family: "cremas", price: 3.5, status: "disponible", href: "/sabores/galleta-de-la-abuela" },
      { id: "t4", name: "Chocolate negro 70 %", family: "chocolate", price: 3.7, status: "agotado", href: "/sabores/chocolate-negro-70" },
      { id: "t5", name: "Limón y albahaca", family: "frutales", price: 3.5, status: "disponible", href: "/sabores/limon-y-albahaca" },
    ],
  },
  {
    day: "Mañana",
    items: [
      { id: "t6", name: "Mango picante", family: "frutales", price: 3.7, status: "recien-hecho", href: "/sabores/mango-picante" },
      { id: "t7", name: "Avellana de Reus", family: "frutos-secos", price: 3.9, status: "disponible", href: "/sabores/avellana" },
      { id: "t8", name: "Turrón de Jijona", family: "cremas", price: 3.9, status: "disponible", href: "/sabores/turron" },
    ],
  },
];

export const sampleMegaMenu: MegaMenuColumn[] = [
  {
    family: "frutales",
    title: "Frutales",
    href: "/sabores#frutales",
    links: [
      { label: "Fresa de la huerta", href: "/sabores/fresa-de-la-huerta" },
      { label: "Limón y albahaca", href: "/sabores/limon-y-albahaca" },
      { label: "Mango picante", href: "/sabores/mango-picante" },
    ],
  },
  {
    family: "frutos-secos",
    title: "Frutos secos y verdes",
    href: "/sabores#frutos-secos",
    links: [
      { label: "Pistacho tostado", href: "/sabores/pistacho-tostado" },
      { label: "Avellana de Reus", href: "/sabores/avellana" },
      { label: "Té matcha", href: "/sabores/te-matcha" },
    ],
  },
  {
    family: "cremas",
    title: "Cremas y galleta",
    href: "/sabores#cremas",
    links: [
      { label: "Galleta de la abuela", href: "/sabores/galleta-de-la-abuela" },
      { label: "Turrón de Jijona", href: "/sabores/turron" },
      { label: "Vainilla de verdad", href: "/sabores/vainilla" },
    ],
  },
  {
    family: "chocolate",
    title: "Chocolate y especiales",
    href: "/sabores#chocolate",
    links: [
      { label: "Chocolate negro 70 %", href: "/sabores/chocolate-negro-70" },
      { label: "Chocolate con sal", href: "/sabores/chocolate-con-sal" },
      { label: "Café de puchero", href: "/sabores/cafe" },
    ],
  },
];

export const sampleSlides: CarouselSlide[] = [
  {
    id: "s1",
    kicker: "Sabor nuevo",
    title: "Mango picante: pica, refresca y no pide perdón",
    text: "Mango maduro con un toque de chile. Solo esta semana, y vuela.",
    cta: { label: "Pruébalo", href: "/sabores/mango-picante" },
    family: "frutales",
    art: "cucurucho",
  },
  {
    id: "s2",
    kicker: "Temporada",
    title: "Llega el turrón y no hemos podido esperar a diciembre",
    text: "Turrón de Jijona de verdad, del bueno. Tarrinas de medio y de litro.",
    cta: { label: "Ver la carta", href: "/carta" },
    family: "cremas",
    art: "tarrina",
  },
  {
    id: "s3",
    kicker: "Evento",
    title: "Sábado de pistacho: cata a ciegas en la vitrina",
    text: "Tres pistachos, una votación y cero vergüenza. Te esperamos.",
    cta: { label: "Apúntate", href: "/visitanos" },
    family: "frutos-secos",
    art: "bola",
  },
];

/** Paleta tal cual el sistema: [token, crema, noche, uso]. */
export const colorTokens: Array<[string, string, string, string]> = [
  ["surface", "#fff8ee", "#140b18", "Fondo de página"],
  ["surface-raised", "#ffffff", "#22142a", "Tarjetas, modales, menús"],
  ["ink", "#1a0f1f", "#fff4fb", "Texto, bordes gruesos, sombras"],
  ["ink-muted", "#5c4a63", "#c9b8cf", "Texto secundario, solo sobre surface"],
  ["on-color", "#1a0f1f", "#1a0f1f", "Texto sobre neón o pastel"],
  ["neon-pink", "#ff2e88", "#ff2e88", "Marca, CTA, novedades, subrayados"],
  ["neon-lime", "#c6ff1a", "#c6ff1a", "Precio destacado, «Nuevo», filtro activo · 1 por pantalla"],
  ["neon-cyan", "#18e7ff", "#18e7ff", "Foco, avisos, temporada"],
  ["pastel-fresa", "#ffc8dd", "#ffc8dd", "Frutales"],
  ["pastel-pistacho", "#cdeec0", "#cdeec0", "Frutos secos y verdes · vegano"],
  ["pastel-vainilla", "#fff0b8", "#fff0b8", "Cremas y galleta · promos"],
  ["pastel-lavanda", "#ddd0ff", "#ddd0ff", "Chocolate y especiales · formularios"],
];
