import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { useAuth } from '@/store/auth';

// The model runs a user has submitted from this browser. The API can't list a
// user's jobs, so their ids are kept in localStorage, one list per account
// (keyed by email, for shared computers). A finished run's results are
// public, so the id is all it takes to reopen one; the rest is for display.
// Entries: { id, species, viruses: [names], submittedAt (ms), status }, newest
// first. status is the last one seen: SUBMITTED, RUNNING, SUCCEEDED, FAILED,
// UNKNOWN, or UNAVAILABLE (the API or S3 no longer has the job).

const KEY_PREFIX = 'atlasarena.runs.v1:';
const MAX_RUNS = 50;
// localStorage's `storage` event only reaches other tabs; this one tells
// this tab.
const CHANGE_EVENT = 'atlasarena:runhistory';

// Asks the Run Models panel's list to open and scroll into view.
export const SHOW_RUNS_EVENT = 'atlasarena:showruns';
export const showRuns = () => window.dispatchEvent(new Event(SHOW_RUNS_EVENT));

const storageKey = (email) => `${KEY_PREFIX}${email}`;

const readRaw = (email) => {
  try {
    return localStorage.getItem(storageKey(email));
  } catch {
    return null;
  }
};

const parse = (raw) => {
  try {
    const runs = JSON.parse(raw);
    return Array.isArray(runs) ? runs : [];
  } catch {
    return [];
  }
};

export const listRuns = (email) => (email ? parse(readRaw(email)) : []);

const writeRuns = (email, runs) => {
  if (!email) return;
  try {
    if (runs.length) {
      localStorage.setItem(
        storageKey(email),
        JSON.stringify(runs.slice(0, MAX_RUNS))
      );
    } else localStorage.removeItem(storageKey(email));
  } catch {
    // Storage blocked or full: the run just isn't remembered.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

export const addRun = (email, run) =>
  writeRuns(email, [
    { submittedAt: Date.now(), status: 'SUBMITTED', ...run },
    ...listRuns(email).filter(({ id }) => id !== run.id),
  ]);

// No-op for a run that isn't in the list (someone else's shared link) or
// already has these values.
export const updateRun = (email, id, patch) => {
  const runs = listRuns(email);
  const run = runs.find((r) => r.id === id);
  if (!run || Object.entries(patch).every(([k, v]) => run[k] === v)) return;
  writeRuns(
    email,
    runs.map((r) => (r.id === id ? { ...r, ...patch } : r))
  );
};

export const removeRun = (email, id) =>
  writeRuns(
    email,
    listRuns(email).filter((r) => r.id !== id)
  );

export const clearRuns = (email) => writeRuns(email, []);

const subscribe = (callback) => {
  window.addEventListener('storage', callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
};

// The signed-in user's runs (empty when signed out), kept in sync across tabs.
export const useRunHistory = () => {
  const { user } = useAuth();
  const email = user?.email || null;
  // The raw string is the snapshot: it's stable between changes, unlike a
  // freshly parsed array.
  const raw = useSyncExternalStore(
    subscribe,
    () => (email ? readRaw(email) : null),
    () => null
  );
  const runs = useMemo(() => parse(raw), [raw]);
  const remove = useCallback((id) => removeRun(email, id), [email]);
  const clear = useCallback(() => clearRuns(email), [email]);
  return { runs, remove, clear, enabled: Boolean(email) };
};
