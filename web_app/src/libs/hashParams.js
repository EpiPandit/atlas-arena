import { useMemo, useSyncExternalStore } from 'react';

// Page state kept in the URL fragment as URLSearchParams, e.g.
// #job=3f9a1c2b4d5e&scenario=ssp2. The fragment never reaches the server, and
// writing it through the History API (not location.hash or Next's router)
// avoids scroll-to-anchor jumps. Next's own history.state is passed through so
// its popstate handling keeps working.

const CHANGE_EVENT = 'atlasarena:hashchange';

const subscribe = (callback) => {
  window.addEventListener('hashchange', callback);
  window.addEventListener('popstate', callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('hashchange', callback);
    window.removeEventListener('popstate', callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
};

const getSnapshot = () => window.location.hash;
// Static export: there is no fragment at build time.
const getServerSnapshot = () => '';

export const readHashParams = (hash = window.location.hash) =>
  Object.fromEntries(new URLSearchParams(hash.replace(/^#/, '')));

// Merges `updates` into the fragment; a null/undefined value removes the key.
// push: true adds a history entry (Back undoes it), otherwise it's replaced.
export const setHashParams = (updates, { push = false } = {}) => {
  const params = new URLSearchParams(window.location.hash.slice(1));
  Object.entries(updates).forEach(([key, value]) => {
    if (value == null) params.delete(key);
    else params.set(key, value);
  });
  const hash = params.toString();
  const url =
    window.location.pathname +
    window.location.search +
    (hash ? `#${hash}` : '');
  if (
    url ===
    window.location.pathname + window.location.search + window.location.hash
  ) {
    return;
  }
  window.history[push ? 'pushState' : 'replaceState'](
    window.history.state,
    '',
    url
  );
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

// Current fragment params as a plain object; re-renders when they change.
export const useHashParams = () => {
  const hash = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => readHashParams(hash), [hash]);
};
