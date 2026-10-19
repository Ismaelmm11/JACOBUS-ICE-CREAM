import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { IceCream } from "@/components/illustrations/IceCream";
import { SubNav } from "@/components/layout/SubNav";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { DataBar } from "@/components/ui/DataBar";
import { FlavorCard } from "@/components/ui/FlavorCard";
import { MegaMenu } from "@/components/ui/MegaMenu";
import { ProgressCarousel } from "@/components/ui/ProgressCarousel";
import { SectionCard } from "@/components/ui/SectionCard";
import { Sticker } from "@/components/ui/Sticker";
import { Tabs } from "@/components/ui/Tabs";
import { Ticker } from "@/components/ui/Ticker";
import type { Theme } from "@/lib/theme";
import { cx } from "@/lib/cx";
import tx from "@/styles/type.module.css";
import { ChipDemo, TableDemo } from "./Demos";
import { colorTokens, sampleFlavors, sampleMegaMenu, sampleSlides, sampleTicker } from "./sample";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Sistema de diseño",
  robots: { index: false, follow: false },
};

const typeSpecimens = [
  { name: "display", spec: "Unbounded 900 · 72/0.95 · −0.02em · clamp() en móvil", className: tx.display, sample: "Dulce por fuera" },
  { name: "heading", spec: "Unbounded 800 · 36/40 · −0.01em · clamp() en móvil", className: tx.heading, sample: "Lo más pedido" },
  { name: "title", spec: "Unbounded 700 · 20/24", className: tx.title, sample: "Pistacho tostado" },
  { name: "body", spec: "Space Grotesk 400 · 16/24", className: tx.body, sample: "Pide antes de que se derrita. Hacemos cada tanda por la mañana y cuando se acaba, se acaba." },
  { name: "body-strong", spec: "Space Grotesk 700 · 16/24", className: tx.bodyStrong, sample: "Contiene leche y frutos de cáscara." },
  { name: "label", spec: "Space Grotesk 700 · 13/16 · 0.08em · MAYÚSCULAS", className: tx.label, sample: "Pide ya" },
  { name: "price", spec: "Space Mono 700 · 18/24 · «3,50 €»", className: tx.price, sample: "3,50 € · 12,90 €" },
] as const;

const spaces = ["space-1", "space-2", "space-4", "space-6", "space-12"] as const;
const radii = [
  ["radius-sharp", "0 · stickers, badges, franjas"],
  ["radius-scoop", "20px · tarjetas, imágenes, modales"],
  ["radius-pill", "999px · botones, chips"],
] as const;

function ComponentSet({ theme }: { theme: Theme }) {
  const [fresa, pistacho, galleta, chocolate] = sampleFlavors;
  return (
    <div className={styles.set}>
      <div className={styles.block}>
        <h4 className={cx(tx.label, styles.blockTitle)}>Button</h4>
        <div className={styles.row}>
          <Button>Pide ya</Button>
          <Button variant="secondary">Ver la carta</Button>
          <Button variant="ghost">Cómo llegar</Button>
          <Button size="sm">Pequeño</Button>
          <Button disabled>Agotado</Button>
        </div>
      </div>

      <div className={styles.block}>
        <h4 className={cx(tx.label, styles.blockTitle)}>Sticker / Badge</h4>
        <div className={styles.row}>
          <Sticker id={`${theme}-a`}>Queda poco</Sticker>
          <Sticker id={`${theme}-b`} tone="cyan">
            Temporada
          </Sticker>
          <Sticker id={`${theme}-c`} tone="pistacho">
            Vegano
          </Sticker>
          <Sticker id={`${theme}-d`} tone="raised">
            Agotado
          </Sticker>
          <Sticker id={`${theme}-e`} tone="vainilla" size="spray">
            ¡Recién hecho!
          </Sticker>
        </div>
      </div>

      <div className={styles.block}>
        <h4 className={cx(tx.label, styles.blockTitle)}>Chip de filtro · activo en neon-lime</h4>
        <ChipDemo />
      </div>

      <div className={styles.block}>
        <h4 className={cx(tx.label, styles.blockTitle)}>FlavorCard</h4>
        <div className={styles.cards}>
          {fresa ? <FlavorCard flavor={fresa} illustration="cucurucho" headingLevel="h4" /> : null}
          {pistacho ? <FlavorCard flavor={pistacho} illustration="tarrina" headingLevel="h4" /> : null}
          {galleta ? <FlavorCard flavor={galleta} headingLevel="h4" /> : null}
          {chocolate ? <FlavorCard flavor={chocolate} illustration="tarrina" headingLevel="h4" /> : null}
        </div>
      </div>

      <div className={styles.block}>
        <h4 className={cx(tx.label, styles.blockTitle)}>SectionCard + Tabs</h4>
        <SectionCard title="Lo último" headingLevel="h3" action={{ href: "/historias", label: "Ver todo" }}>
          <Tabs
            label="Secciones de la ficha"
            items={[
              { id: "ficha", label: "Ficha", content: <p>Pistacho de Bronte tostado en casa. Nada de colorantes: si es verde, es porque es pistacho.</p> },
              { id: "ingredientes", label: "Ingredientes", content: <p>Leche entera, nata, pistacho, azúcar, dextrosa.</p> },
              { id: "combina", label: "Combina con", content: <p>Chocolate negro 70 % o, si te va el riesgo, fresa.</p> },
              { id: "resenas", label: "Reseñas", content: <p>«Me lo comí de pie en la puerta. Sin remordimientos.»</p> },
            ]}
          />
        </SectionCard>
      </div>

      <div className={styles.block}>
        <h4 className={cx(tx.label, styles.blockTitle)}>DataBar</h4>
        <DataBar
          items={[
            { label: "Precio", value: "3,90 €", kind: "price" },
            { label: "Kcal/100 g", value: "228" },
            { label: "Alérgenos", value: "Leche · Pistacho" },
            { label: "Desde", value: "Mayo 2024" },
          ]}
        />
      </div>
    </div>
  );
}

export default function DesignPage() {
  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <p className={cx(styles.logo)}>
          <span className={styles.logoMark}>JACOBUS</span>
          <span className={cx(tx.label, styles.logoSub)}>Sistema de diseño · interno</span>
        </p>
        <ThemeToggle />
      </header>

      <main id="contenido" className={styles.main}>
        <section className={styles.intro}>
          <h1 className={tx.display}>Dulce por fuera, punk por dentro.</h1>
          <p className={cx(tx.body, styles.lede)}>
            Catálogo de tokens y componentes base. Los pasteles son el helado; los neones, el ruido. Proporción por
            pantalla: 60 % surface, 30 % pastel, 10 % neón.
          </p>
          <p className={cx(styles.note, tx.body)}>
            <strong className={tx.bodyStrong}>Ojo:</strong> esta página rompe a propósito la regla de «un solo
            neon-lime por pantalla» porque enseña cada componente en los dos temas. En las vistas reales se cumple.
          </p>
        </section>

        <SectionCard id="color" title="Color">
          <ul className={styles.swatches}>
            {colorTokens.map(([token, crema, noche, use]) => (
              <li key={token} className={styles.swatch}>
                <span className={styles.chipColor} style={{ background: `var(--${token})` } as CSSProperties} />
                <span className={tx.bodyStrong}>{token}</span>
                <span className={cx(tx.label, tx.muted)}>
                  {crema}
                  {crema !== noche ? ` / ${noche}` : ""}
                </span>
                <span className={cx(styles.swatchUse, tx.muted)}>{use}</span>
              </li>
            ))}
          </ul>
          <div className={styles.contrast}>
            <h3 className={tx.title}>Reglas de contraste</h3>
            <ul className={styles.rules}>
              <li>Los neones nunca son texto sobre crema (no llegan a 4.5:1). Sobre neón o pastel el texto es siempre on-color.</li>
              <li>En noche el neón sí puede ser texto sobre surface.</li>
              <li>
                Foco: anillo neon-cyan de 3px con 2px de separación, encerrado en ink para que llegue a 3:1 también sobre
                crema. Pulsa Tab para verlo.
              </li>
            </ul>
          </div>
        </SectionCard>

        <SectionCard id="tipografia" title="Tipografía">
          <ul className={styles.typeList}>
            {typeSpecimens.map((t) => (
              <li key={t.name} className={styles.typeRow}>
                <div className={styles.typeMeta}>
                  <span className={tx.bodyStrong}>{t.name}</span>
                  <span className={cx(tx.label, tx.muted)}>{t.spec}</span>
                </div>
                {t.name === "display" ? (
                  <p className={styles.typeNote}>Ver el título de arriba: solo un display por vista.</p>
                ) : (
                  <p className={t.className}>{t.sample}</p>
                )}
              </li>
            ))}
            <li className={styles.typeRow}>
              <div className={styles.typeMeta}>
                <span className={tx.bodyStrong}>sticker</span>
                <span className={cx(tx.label, tx.muted)}>Rubik Spray Paint · 32/36 · solo ≥28px sobre neón o pastel · máx. 3 palabras</span>
              </div>
              <div>
                <Sticker id="type-sticker" tone="pink" size="spray">
                  ¡Se derritió!
                </Sticker>
              </div>
            </li>
          </ul>
        </SectionCard>

        <SectionCard id="forma" title="Forma, espacio y elevación">
          <div className={styles.shapeGrid}>
            <div>
              <h3 className={cx(tx.label, styles.blockTitle)}>Espaciado</h3>
              <ul className={styles.spaceList}>
                {spaces.map((space) => (
                  <li key={space} className={styles.spaceRow}>
                    <span className={cx(tx.label, styles.spaceName)}>{space}</span>
                    <span className={styles.spaceBar} style={{ width: `var(--${space})` } as CSSProperties} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={cx(tx.label, styles.blockTitle)}>Radios</h3>
              <ul className={styles.radiusList}>
                {radii.map(([token, use]) => (
                  <li key={token} className={styles.radiusItem}>
                    <span className={styles.radiusBox} style={{ borderRadius: `var(--${token})` } as CSSProperties} />
                    <span className={tx.bodyStrong}>{token}</span>
                    <span className={cx(tx.label, tx.muted)}>{use}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={cx(tx.label, styles.blockTitle)}>Sombras y foco</h3>
              <div className={styles.shadowRow}>
                <div className={cx(styles.shadowBox, styles.shadowSm)}>
                  <span className={tx.label}>shadow-sticker</span>
                </div>
                <div className={cx(styles.shadowBox, styles.shadowLg)}>
                  <span className={tx.label}>shadow-sticker-lg</span>
                </div>
                <div className={cx(styles.shadowBox, styles.focusDemo)}>
                  <span className={tx.label}>foco</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className={cx(tx.label, styles.blockTitle)}>Ilustraciones placeholder</h3>
              <div className={styles.artRow}>
                <IceCream kind="cucurucho" family="frutales" label="Cucurucho de fresa" />
                <IceCream kind="bola" family="frutos-secos" label="Bola de pistacho" />
                <IceCream kind="tarrina" family="cremas" label="Tarrina de vainilla" />
                <IceCream kind="cucurucho" family="chocolate" label="Cucurucho de chocolate" />
              </div>
            </div>
          </div>
        </SectionCard>

        <section className={styles.compare} aria-labelledby="ambos-temas">
          <h2 id="ambos-temas" className={tx.heading}>
            Componentes en los dos temas
          </h2>
          <div className={styles.themes}>
            <div data-theme="crema" className={styles.themePanel}>
              <h3 className={cx(tx.title, styles.themeTitle)}>Crema</h3>
              <ComponentSet theme="crema" />
            </div>
            <div data-theme="noche" className={styles.themePanel}>
              <h3 className={cx(tx.title, styles.themeTitle)}>Noche</h3>
              <ComponentSet theme="noche" />
            </div>
          </div>
        </section>

        <section className={styles.compare} aria-labelledby="layout-components">
          <h2 id="layout-components" className={tx.heading}>
            Piezas de layout (tema actual)
          </h2>
          <p className={cx(tx.body, tx.muted)}>Usa el interruptor de arriba para verlas en el otro tema.</p>

          <div className={styles.block}>
            <h3 className={cx(tx.label, styles.blockTitle)}>Ticker «En la vitrina hoy»</h3>
            <div className={styles.frame}>
              <Ticker days={sampleTicker} />
            </div>
          </div>

          <div className={styles.block}>
            <h3 className={cx(tx.label, styles.blockTitle)}>SubNav de sección</h3>
            <div className={styles.frame}>
              <SubNav
                title="Sabores"
                items={[
                  { href: "/design", label: "Todos" },
                  { href: "/sabores/comparar", label: "Comparar" },
                  { href: "/carta", label: "Carta de la semana" },
                ]}
              />
            </div>
          </div>

          <div className={styles.block}>
            <h3 className={cx(tx.label, styles.blockTitle)}>MegaMenu «Sabores»</h3>
            <div className={styles.fakeHeader}>
              <MegaMenu
                label="Sabores"
                columns={sampleMegaMenu}
                footerLink={{ label: "Todos los sabores", href: "/sabores" }}
              />
              <span className={tx.label}>Carta</span>
              <span className={tx.label}>Historias</span>
            </div>
          </div>

          <div className={styles.block}>
            <h3 className={cx(tx.label, styles.blockTitle)}>ProgressCarousel</h3>
            <ProgressCarousel slides={sampleSlides} label="Historias destacadas" />
          </div>

          <div className={styles.block}>
            <h3 className={cx(tx.label, styles.blockTitle)}>DataTable · ordenación y paginación</h3>
            <TableDemo />
          </div>
        </section>
      </main>
    </div>
  );
}
