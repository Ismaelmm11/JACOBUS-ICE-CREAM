import type { Metadata } from "next";
import { CartaBoard, type CartaFlavor } from "@/components/carta/CartaBoard";
import { FLAVOR_SECTION_TABS } from "@/components/layout/sections";
import { SubNav } from "@/components/layout/SubNav";
import { buildMenuDays } from "@/domain/menu";
import { flavorRepository, scheduleRepository } from "@/infrastructure/repositories";
import { addDaysIso, storeTodayIso, weekdayOfIso } from "@/lib/storeTime";
import page from "@/styles/page.module.css";
import tx from "@/styles/type.module.css";

export const metadata: Metadata = {
  title: "Carta de la semana",
  description: "Qué hay en la vitrina hoy, mañana y los próximos días, con precios y alérgenos.",
};

// «Hoy» depende de la fecha en la tienda: se calcula en cada petición.
export const dynamic = "force-dynamic";

export default async function CartaPage() {
  const [flavors, showcase, hours, timezone] = await Promise.all([
    flavorRepository.list(),
    scheduleRepository.getShowcase(),
    scheduleRepository.getWeeklyHours(),
    scheduleRepository.getTimezone(),
  ]);

  const days = buildMenuDays({
    flavors,
    showcase,
    hours,
    todayIso: storeTodayIso(timezone),
    days: 14,
    addDays: addDaysIso,
    weekdayOf: weekdayOfIso,
  });

  const cartaFlavors: Record<string, CartaFlavor> = Object.fromEntries(
    flavors.map(({ slug, name, family, prices, allergens, vegan, lactoseFree, glutenFree }) => [
      slug,
      { slug, name, family, prices, allergens, vegan, lactoseFree, glutenFree },
    ]),
  );

  return (
    <>
      <SubNav title="Carta" titleAs="h1" items={FLAVOR_SECTION_TABS} />
      <div className={page.container}>
        <p className={`${tx.body} ${page.intro}`}>
          Lo que hay en la vitrina cada día. Hacemos tandas pequeñas, así que lo de pasado mañana es una previsión:
          si algo vuela, vuela.
        </p>
        <CartaBoard days={days} flavors={cartaFlavors} />
      </div>
    </>
  );
}
