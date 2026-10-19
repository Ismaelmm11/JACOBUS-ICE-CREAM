import type { Metadata } from "next";
import Link from "next/link";
import { IceCream } from "@/components/illustrations/IceCream";
import { FLAVOR_SECTION_TABS } from "@/components/layout/sections";
import { SubNav } from "@/components/layout/SubNav";
import { FlavorCard } from "@/components/ui/FlavorCard";
import { FAMILY_DESCRIPTIONS, FAMILY_LABELS, FAMILY_ORDER } from "@/domain/flavor";
import type { IllustrationKind } from "@/domain/story";
import { flavorRepository } from "@/infrastructure/repositories";
import { cx } from "@/lib/cx";
import page from "@/styles/page.module.css";
import tx from "@/styles/type.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Sabores",
  description: "Los 24 sabores de Jacobus, ordenados por familia: frutales, frutos secos, cremas y chocolate.",
};

const ART: IllustrationKind[] = ["cucurucho", "tarrina", "bola"];

export default async function SaboresPage() {
  const [flavors, newest] = await Promise.all([flavorRepository.list(), flavorRepository.getNewest()]);

  return (
    <>
      <SubNav title="Sabores" titleAs="h1" items={FLAVOR_SECTION_TABS} />
      <div className={page.container}>
        <div className={styles.top}>
          <p className={cx(tx.body, page.intro)}>
            {flavors.length} sabores, cuatro familias y ninguno de bote. Los nombres van en serio; el resto, no tanto.
          </p>
          <nav aria-label="Ir a una familia">
            <ul className={styles.jump}>
              {FAMILY_ORDER.map((family) => (
                <li key={family}>
                  <a href={`#${family}`} className={cx(styles.jumpLink, tx.label)}>
                    <span className={cx(styles.dot, styles[family])} aria-hidden="true" />
                    {FAMILY_LABELS[family]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {FAMILY_ORDER.map((family) => {
          const items = flavors.filter((f) => f.family === family);
          return (
            <section key={family} id={family} aria-labelledby={`${family}-titulo`} className={styles.family}>
              <header className={cx(styles.band, styles[family])}>
                <div className={styles.bandText}>
                  <h2 id={`${family}-titulo`} className={tx.heading}>
                    {FAMILY_LABELS[family]}
                  </h2>
                  <p>{FAMILY_DESCRIPTIONS[family]}</p>
                  <p className={tx.label}>{items.length} sabores</p>
                </div>
                <IceCream kind={ART[FAMILY_ORDER.indexOf(family) % ART.length]} family={family} className={styles.bandArt} />
              </header>
              <ul className={styles.grid}>
                {items.map((flavor, i) => (
                  <li key={flavor.slug}>
                    <FlavorCard flavor={flavor} illustration={ART[i % ART.length]} isNew={flavor.slug === newest?.slug} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <p className={cx(tx.body, styles.more)}>
          ¿Dudas entre dos? <Link href="/sabores/comparar">Compáralos</Link> o mira qué hay hoy en la{" "}
          <Link href="/carta">carta</Link>.
        </p>
      </div>
    </>
  );
}
