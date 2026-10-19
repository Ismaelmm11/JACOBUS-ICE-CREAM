import { FlavorCard, type FlavorCardData } from "@/components/ui/FlavorCard";
import { Rail } from "@/components/ui/Rail";
import type { IllustrationKind } from "@/domain/story";

const ART_CYCLE: IllustrationKind[] = ["cucurucho", "tarrina", "bola"];

interface FlavorRailProps {
  flavors: FlavorCardData[];
  label: string;
  /** Slug que lleva el sticker «Nuevo» (neon-lime): como mucho uno por pantalla. */
  newSlug?: string | null;
}

/** Rail «Lo más pedido» (equivale al rail «Trending» de NBA). */
export function FlavorRail({ flavors, label, newSlug }: FlavorRailProps) {
  return (
    <Rail
      label={label}
      itemName="sabor"
      items={flavors.map((flavor, index) => ({
        key: flavor.slug,
        node: (
          <FlavorCard
            flavor={flavor}
            illustration={ART_CYCLE[index % ART_CYCLE.length]}
            isNew={flavor.slug === newSlug}
          />
        ),
      }))}
    />
  );
}
