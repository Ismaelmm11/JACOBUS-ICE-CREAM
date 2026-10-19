import type { Metadata } from "next";
import { CompareTable, type CompareFlavor } from "@/components/flavors/CompareTable";
import { FLAVOR_SECTION_TABS } from "@/components/layout/sections";
import { SubNav } from "@/components/layout/SubNav";
import { flavorRepository } from "@/infrastructure/repositories";
import { cx } from "@/lib/cx";
import page from "@/styles/page.module.css";
import tx from "@/styles/type.module.css";

export const metadata: Metadata = {
  title: "Comparar sabores",
  description: "Calorías, azúcar, grasa, alérgenos y precios de todos los sabores, en una tabla que puedes filtrar y ordenar.",
};

export default async function ComparePage() {
  const flavors = await flavorRepository.list();
  const rows: CompareFlavor[] = flavors.map(
    ({ slug, name, family, nutrition, allergens, prices, vegan, lactoseFree, glutenFree }) => ({
      slug,
      name,
      family,
      nutrition,
      allergens,
      prices,
      vegan,
      lactoseFree,
      glutenFree,
    }),
  );

  return (
    <>
      <SubNav title="Comparar" titleAs="h1" items={FLAVOR_SECTION_TABS} />
      <div className={page.container}>
        <p className={cx(tx.body, page.intro)}>
          Todos los números en una tabla, por si eres de los que leen la etiqueta. Toca una columna para ordenar.
        </p>
        <CompareTable flavors={rows} />
      </div>
    </>
  );
}
