// Estado «visto» de las Stories de la home. Vive solo en este navegador:
// si el almacenamiento falla (modo privado, bloqueado), todo sale como no visto.

const STORAGE_KEY = "jacobus-snaps-seen";
const CHANGE_EVENT = "jacobus:snapsseen";

let cache: ReadonlySet<string> | null = null;
const EMPTY: ReadonlySet<string> = new Set();

function read(): ReadonlySet<string> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : []);
  } catch {
    return EMPTY;
  }
}

/** Snapshot estable para useSyncExternalStore (misma referencia hasta que cambie). */
export function getSeenSnaps(): ReadonlySet<string> {
  cache ??= read();
  return cache;
}

export function getServerSeenSnaps(): ReadonlySet<string> {
  return EMPTY;
}

export function subscribeSeenSnaps(onChange: () => void): () => void {
  function onStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY) {
      cache = null;
      onChange();
    }
  }
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function markSnapSeen(id: string): void {
  const current = getSeenSnaps();
  if (current.has(id)) return;
  const next = new Set(current);
  next.add(id);
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  } catch {
    // Sin almacenamiento: se marca como visto solo durante esta visita.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
