import rawFlavors from "@/data/flavors.json";
import {
  FAMILY_ORDER,
  type Allergen,
  type Flavor,
  type FlavorFamily,
  type StockStatus,
} from "@/domain/flavor";
import type { FlavorRepository } from "@/domain/repositories";
import {
  assertArray,
  assertBoolean,
  assertNumber,
  assertOneOf,
  assertRecord,
  assertString,
  fail,
} from "./validate";

const ALLERGENS: readonly Allergen[] = [
  "leche",
  "huevo",
  "frutos-de-cascara",
  "cacahuete",
  "gluten",
  "soja",
  "sesamo",
  "sulfitos",
];
const STOCK: readonly StockStatus[] = ["disponible", "queda-poco", "recien-hecho", "agotado"];

function parseFlavor(raw: unknown, index: number): Flavor {
  const p = `flavors[${index}]`;
  const r = assertRecord(raw, p);
  const nutrition = assertRecord(r.nutrition, `${p}.nutrition`);
  const prices = assertRecord(r.prices, `${p}.prices`);
  const addedOn = assertString(r.addedOn, `${p}.addedOn`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(addedOn)) fail(`${p}.addedOn`, "formato AAAA-MM-DD");

  return {
    slug: assertString(r.slug, `${p}.slug`),
    name: assertString(r.name, `${p}.name`),
    family: assertOneOf(r.family, FAMILY_ORDER, `${p}.family`),
    description: assertString(r.description, `${p}.description`),
    ingredients: assertArray(r.ingredients, `${p}.ingredients`).map((v, i) => assertString(v, `${p}.ingredients[${i}]`)),
    allergens: assertArray(r.allergens, `${p}.allergens`).map((v, i) =>
      assertOneOf(v, ALLERGENS, `${p}.allergens[${i}]`),
    ),
    nutrition: {
      kcal: assertNumber(nutrition.kcal, `${p}.nutrition.kcal`),
      sugar: assertNumber(nutrition.sugar, `${p}.nutrition.sugar`),
      fat: assertNumber(nutrition.fat, `${p}.nutrition.fat`),
    },
    prices: {
      scoop: assertNumber(prices.scoop, `${p}.prices.scoop`),
      tubS: assertNumber(prices.tubS, `${p}.prices.tubS`),
      tubM: assertNumber(prices.tubM, `${p}.prices.tubM`),
      tubL: assertNumber(prices.tubL, `${p}.prices.tubL`),
    },
    vegan: assertBoolean(r.vegan, `${p}.vegan`),
    lactoseFree: assertBoolean(r.lactoseFree, `${p}.lactoseFree`),
    glutenFree: assertBoolean(r.glutenFree, `${p}.glutenFree`),
    stock: assertOneOf(r.stock, STOCK, `${p}.stock`),
    addedOn,
  };
}

function load(): Flavor[] {
  const flavors = assertArray(rawFlavors, "flavors").map(parseFlavor);
  const seen = new Set<string>();
  for (const flavor of flavors) {
    if (seen.has(flavor.slug)) fail("flavors", `slug duplicado «${flavor.slug}»`);
    seen.add(flavor.slug);
  }
  return flavors;
}

export class JsonFlavorRepository implements FlavorRepository {
  private readonly flavors: Flavor[] = load();
  private readonly bySlug = new Map(this.flavors.map((f) => [f.slug, f]));

  async list(): Promise<Flavor[]> {
    return [...this.flavors];
  }

  async getBySlug(slug: string): Promise<Flavor | null> {
    return this.bySlug.get(slug) ?? null;
  }

  async listByFamily(family: FlavorFamily): Promise<Flavor[]> {
    return this.flavors.filter((f) => f.family === family);
  }

  /** Respeta el orden de `slugs`; los slugs desconocidos rompen (dato mock mal escrito). */
  async listBySlugs(slugs: readonly string[]): Promise<Flavor[]> {
    return slugs.map((slug) => this.bySlug.get(slug) ?? fail("listBySlugs", `slug desconocido «${slug}»`));
  }
}
