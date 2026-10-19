import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IceCream } from "@/components/illustrations/IceCream";
import { FLAVOR_SECTION_TABS } from "@/components/layout/sections";
import { SubNav } from "@/components/layout/SubNav";
import { StoryCard } from "@/components/stories/StoryCard";
import { Button } from "@/components/ui/Button";
import { DataBar } from "@/components/ui/DataBar";
import { FlavorCard } from "@/components/ui/FlavorCard";
import { SectionCard } from "@/components/ui/SectionCard";
import { Sticker } from "@/components/ui/Sticker";
import { Tabs } from "@/components/ui/Tabs";
import { ALLERGEN_LABELS, FAMILY_LABELS, STOCK_LABELS } from "@/domain/flavor";
import { flavorRepository, storyRepository } from "@/infrastructure/repositories";
import { cx } from "@/lib/cx";
import { formatMonthYear, formatPrice } from "@/lib/format";
import page from "@/styles/page.module.css";
import tx from "@/styles/type.module.css";
import styles from "./page.module.css";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export async function generateStaticParams() {
  const flavors = await flavorRepository.list();
  return flavors.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const flavor = await flavorRepository.getBySlug((await params).slug);
  return flavor ? { title: flavor.name, description: flavor.description } : {};
}

function formatGrams(value: number): string {
  return `${String(value).replace(".", ",")} g`;
}

export default async function FlavorPage({ params }: { params: Params }) {
  const flavor = await flavorRepository.getBySlug((await params).slug);
  if (!flavor) notFound();

  const [newest, pairings, stories] = await Promise.all([
    flavorRepository.getNewest(),
    flavorRepository.listPairings(flavor, 3),
    storyRepository.listByFlavor(flavor.slug),
  ]);
  const isNew = newest?.slug === flavor.slug;

  const sizes = [
    ["Bola", flavor.prices.scoop],
    ["Tarrina S", flavor.prices.tubS],
    ["Tarrina M", flavor.prices.tubM],
    ["Tarrina L", flavor.prices.tubL],
  ] as const;

  const suitability = [
    flavor.vegan && "Vegano",
    flavor.lactoseFree && "Sin lactosa",
    flavor.glutenFree && "Sin gluten",
  ].filter((v): v is string => Boolean(v));

  return (
    <>
      <SubNav title="Sabores" items={FLAVOR_SECTION_TABS} />
      {/* Hero en el pastel de su familia: la página con más carácter, como la ficha de jugador. */}
      <section className={cx(styles.hero, styles[flavor.family])} aria-labelledby="sabor-nombre">
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <nav aria-label="Migas de pan" className={tx.label}>
              <ol className={styles.crumbs}>
                <li>
                  <Link href="/sabores">Sabores</Link>
                </li>
                <li>
                  <Link href={`/sabores#${flavor.family}`}>{FAMILY_LABELS[flavor.family]}</Link>
                </li>
              </ol>
            </nav>
            <div className={styles.stickers}>
              {isNew ? (
                <Sticker id={`${flavor.slug}-nuevo`} tone="lime">
                  Nuevo
                </Sticker>
              ) : null}
              {flavor.stock !== "disponible" ? (
                <Sticker id={`${flavor.slug}-estado`} tone={flavor.stock === "agotado" ? "raised" : "pink"}>
                  {STOCK_LABELS[flavor.stock]}
                </Sticker>
              ) : null}
            </div>
            <h1 id="sabor-nombre" className={cx(tx.display, styles.name)}>
              {flavor.name}
            </h1>
            <p className={cx(tx.body, styles.description)}>{flavor.description}</p>
            <div className={styles.actions}>
              <Button href="/carta">Mira si está hoy</Button>
              <Button href="/sabores/comparar" variant="secondary">
                Comparar
              </Button>
            </div>
          </div>
          <div className={styles.heroArt}>
            <IceCream kind="cucurucho" family={flavor.family} label={`Ilustración de ${flavor.name}`} />
          </div>
        </div>
      </section>

      <div className={page.container}>
        <DataBar
          className={styles.databar}
          label={`Datos de ${flavor.name}`}
          items={[
            { label: "Precio bola", value: formatPrice(flavor.prices.scoop), kind: "price" },
            { label: "Kcal / 100 g", value: String(flavor.nutrition.kcal) },
            {
              label: "Alérgenos",
              value: flavor.allergens.length ? flavor.allergens.map((a) => ALLERGEN_LABELS[a]).join(" · ") : "Ninguno",
            },
            { label: "Desde", value: formatMonthYear(flavor.addedOn) },
          ]}
        />

        <div className={page.split}>
          <Tabs
            className={page.main}
            label={`Información de ${flavor.name}`}
            items={[
              {
                id: "ficha",
                label: "Ficha",
                content: (
                  <div className={styles.panel}>
                    <h2 className={tx.title}>Tamaños y precios</h2>
                    <dl className={styles.sizes}>
                      {sizes.map(([size, price]) => (
                        <div key={size} className={styles.size}>
                          <dt className={tx.label}>{size}</dt>
                          <dd className={tx.price}>{formatPrice(price)}</dd>
                        </div>
                      ))}
                    </dl>
                    <h2 className={tx.title}>Apto para</h2>
                    {suitability.length ? (
                      <ul className={styles.tags}>
                        {suitability.map((s) => (
                          <li key={s} className={cx(styles.tag, tx.label)}>
                            {s}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={tx.muted}>Lleva leche y no es apto para veganos.</p>
                    )}
                  </div>
                ),
              },
              {
                id: "ingredientes",
                label: "Ingredientes",
                content: (
                  <div className={styles.panel}>
                    <h2 className={tx.title}>Ingredientes</h2>
                    <p>{flavor.ingredients.join(", ")}.</p>
                    <h2 className={tx.title}>Alérgenos</h2>
                    <p className={tx.bodyStrong}>
                      {flavor.allergens.length
                        ? flavor.allergens.map((a) => ALLERGEN_LABELS[a]).join(" · ")
                        : "Sin alérgenos principales"}
                    </p>
                    <h2 className={tx.title}>Por 100 g</h2>
                    <table className={styles.nutrition}>
                      <caption className="visually-hidden">Información nutricional por 100 g</caption>
                      <tbody>
                        <tr>
                          <th scope="row">Energía</th>
                          <td className={tx.price}>{flavor.nutrition.kcal} kcal</td>
                        </tr>
                        <tr>
                          <th scope="row">Azúcares</th>
                          <td className={tx.price}>{formatGrams(flavor.nutrition.sugar)}</td>
                        </tr>
                        <tr>
                          <th scope="row">Grasas</th>
                          <td className={tx.price}>{formatGrams(flavor.nutrition.fat)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ),
              },
              {
                id: "combina",
                label: "Combina con",
                content: (
                  <ul className={styles.pairings}>
                    {pairings.map((p) => (
                      <li key={p.slug}>
                        <FlavorCard flavor={p} headingLevel="h2" illustration="tarrina" />
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                id: "resenas",
                label: "Reseñas",
                content: (
                  <div className={styles.empty}>
                    <p className={tx.title}>Aún no hay reseñas.</p>
                    <p className={tx.muted}>
                      Las reseñas llegarán cuando conectemos la web con las opiniones reales del local. No nos las
                      vamos a inventar.
                    </p>
                    <p className={cx(styles.todo, tx.label)}>TODO: conectar reseñas reales</p>
                  </div>
                ),
              },
            ]}
          />

          <aside className={page.aside} aria-label="Relacionado">
            <SectionCard title="Se habla de él" headingLevel="h2">
              {stories.length ? (
                <div className={styles.related}>
                  {stories.slice(0, 3).map((story) => (
                    <StoryCard key={story.slug} story={story} variant="compact" />
                  ))}
                </div>
              ) : (
                <p className={tx.muted}>De momento nadie ha escrito sobre este sabor. Todo llegará.</p>
              )}
            </SectionCard>
          </aside>
        </div>
      </div>
    </>
  );
}
