// Validación mínima de los JSON mock: un error de tecleo en los datos rompe el build
// con un mensaje claro en vez de colarse como `undefined` en la UI.

export function fail(path: string, message: string): never {
  throw new Error(`[datos mock] ${path}: ${message}`);
}

export function assertOneOf<T extends string>(value: unknown, allowed: readonly T[], path: string): T {
  if (typeof value !== "string" || !(allowed as readonly string[]).includes(value)) {
    fail(path, `valor «${String(value)}» no permitido (${allowed.join(", ")})`);
  }
  return value as T;
}

export function assertString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.length === 0) fail(path, "se esperaba un texto no vacío");
  return value;
}

export function assertNumber(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) fail(path, "se esperaba un número");
  return value;
}

export function assertBoolean(value: unknown, path: string): boolean {
  if (typeof value !== "boolean") fail(path, "se esperaba true o false");
  return value;
}

export function assertArray(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) fail(path, "se esperaba una lista");
  return value;
}

export function assertRecord(value: unknown, path: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) fail(path, "se esperaba un objeto");
  return value as Record<string, unknown>;
}
