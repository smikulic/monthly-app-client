/**
 * Where the demo lives while it is running.
 *
 * One localStorage key holds the whole working copy. Demo mode *is* the
 * presence of that key, so ending the demo is a single delete with no cleanup
 * to get wrong and nothing left behind in anyone's account.
 *
 * Reads are memoised because the Apollo link asks on every operation and
 * parsing a year of expenses per keystroke is not free.
 */
import {
  DEMO_STORAGE_KEY,
  DemoState,
  StoredDemoDataset,
  isStale,
  materialiseDemoDataset,
  reviveDemoState,
} from "./demo-dataset";

interface DemoSession {
  /** The server's dataset version this copy was built from. */
  version: number;
  state: DemoState;
}

let cached: DemoSession | null | undefined;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((listener) => listener());

/**
 * Storage throws in a private window and in embedded webviews, and the demo is
 * the one feature that must not take the app down with it.
 */
const safeRead = (): string | null => {
  try {
    return localStorage.getItem(DEMO_STORAGE_KEY);
  } catch {
    return null;
  }
};

const safeWrite = (value: string) => {
  try {
    localStorage.setItem(DEMO_STORAGE_KEY, value);
    return true;
  } catch {
    return false;
  }
};

const safeRemove = () => {
  try {
    localStorage.removeItem(DEMO_STORAGE_KEY);
  } catch {
    /* nothing to undo: an unwritable store never held a session */
  }
};

const load = (): DemoSession | null => {
  if (cached !== undefined) return cached;

  const raw = safeRead();
  if (!raw) {
    cached = null;
    return cached;
  }

  try {
    const session = JSON.parse(raw) as { version: number; state: unknown };
    const state = reviveDemoState(JSON.stringify(session.state));
    // A copy anchored on a previous month would show the tour last month's
    // figures. Cheaper to drop it and refetch than to try to shift it.
    cached = isStale(state) ? null : { version: session.version, state };
  } catch {
    // A half-written or hand-edited value is not worth rescuing.
    cached = null;
  }

  if (!cached) safeRemove();
  return cached;
};

export const getDemoSession = (): DemoSession | null => load();

export const getDemoState = (): DemoState | null => load()?.state ?? null;

export const isDemoActive = (): boolean => load() !== null;

/**
 * Persists a change made during the demo.
 *
 * Failing to write is not fatal: the in-memory copy is still correct, so the
 * demo carries on and only loses its progress on reload.
 */
export const saveDemoState = (state: DemoState) => {
  const session = load();
  if (!session) return;

  cached = { ...session, state };
  safeWrite(JSON.stringify(cached));
  notify();
};

/** Materialises a freshly-fetched dataset and switches the app into demo mode. */
export const startDemo = (payload: StoredDemoDataset, version: number) => {
  cached = { version, state: materialiseDemoDataset(payload) };
  safeWrite(JSON.stringify(cached));
  notify();
};

export const exitDemo = () => {
  cached = null;
  safeRemove();
  notify();
};

export const subscribeToDemo = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
