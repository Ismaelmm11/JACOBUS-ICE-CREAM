export type FlavorFamily = "frutales" | "frutos-secos" | "cremas" | "chocolate";

export const FAMILY_LABELS: Record<FlavorFamily, string> = {
  frutales: "Frutales",
  "frutos-secos": "Frutos secos y verdes",
  cremas: "Cremas y galleta",
  chocolate: "Chocolate y especiales",
};

export const FAMILY_ORDER: readonly FlavorFamily[] = ["frutales", "frutos-secos", "cremas", "chocolate"];

export type StockStatus = "disponible" | "queda-poco" | "recien-hecho" | "agotado";

export const STOCK_LABELS: Record<StockStatus, string> = {
  disponible: "Disponible",
  "queda-poco": "Queda poco",
  "recien-hecho": "Recién hecho",
  agotado: "Agotado",
};

export type Allergen =
  | "leche"
  | "huevo"
  | "frutos-de-cascara"
  | "cacahuete"
  | "gluten"
  | "soja"
  | "sesamo"
  | "sulfitos";

export const ALLERGEN_LABELS: Record<Allergen, string> = {
  leche: "Leche",
  huevo: "Huevo",
  "frutos-de-cascara": "Frutos de cáscara",
  cacahuete: "Cacahuete",
  gluten: "Gluten",
  soja: "Soja",
  sesamo: "Sésamo",
  sulfitos: "Sulfitos",
};

export interface FlavorPrices {
  scoop: number;
  tubS: number;
  tubM: number;
  tubL: number;
}

export interface FlavorNutrition {
  kcal: number;
  sugar: number;
  fat: number;
}

export interface Flavor {
  slug: string;
  name: string;
  family: FlavorFamily;
  description: string;
  ingredients: string[];
  allergens: Allergen[];
  nutrition: FlavorNutrition;
  prices: FlavorPrices;
  vegan: boolean;
  lactoseFree: boolean;
  glutenFree: boolean;
  stock: StockStatus;
  /** Pedidos en la última semana (mock): ordena «Lo más pedido». */
  weeklyOrders: number;
  /** Fecha de alta en ISO (AAAA-MM-DD) */
  addedOn: string;
}
