const STORAGE_KEY = "stashly-recent-searches";
const MAX_RECENT = 5;

let cachedSnapshot: string[] = [];
let cachedSerialized = "[]";
const listeners = new Set<() => void>();

function readFromStorage(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((entry): entry is string => typeof entry === "string")
      : [];
  } catch {
    return [];
  }
}

function syncCache(next: string[]) {
  const serialized = JSON.stringify(next);
  if (serialized === cachedSerialized) return false;

  cachedSerialized = serialized;
  cachedSnapshot = next;
  return true;
}

function notifyListeners() {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeRecentSearches(listener: () => void) {
  listeners.add(listener);

  function onStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY || event.key === null) {
      syncCache(readFromStorage());
      listener();
    }
  }

  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Stable snapshot for useSyncExternalStore — same reference until data changes. */
export function getRecentSearchesSnapshot(): string[] {
  if (typeof window === "undefined") return [];

  syncCache(readFromStorage());
  return cachedSnapshot;
}

export function getRecentSearches(): string[] {
  return readFromStorage();
}

export function addRecentSearch(query: string) {
  const trimmed = query.trim();
  if (trimmed.length < 2 || typeof window === "undefined") return;

  const next = [
    trimmed,
    ...readFromStorage().filter(
      (entry) => entry.toLowerCase() !== trimmed.toLowerCase(),
    ),
  ].slice(0, MAX_RECENT);

  if (!syncCache(next)) return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  notifyListeners();
}
