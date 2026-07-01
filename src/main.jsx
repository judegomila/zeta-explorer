import React from 'react';
import { createRoot } from 'react-dom/client';
import 'katex/dist/katex.min.css';
import App from './App.jsx';

// Recover from failed lazy-route chunk loads (2026-06-16).
//
// The site is gated behind a Vercel Edge middleware (middleware.js) whose
// matcher protects /assets/* too. When the session cookie goes stale — the
// auth password was rotated on a redeploy, or the 30-day cookie aged out
// while a tab stayed open — a navigation to a not-yet-visited route fires a
// dynamic import() for that route's chunk, the middleware answers with the
// LOGIN HTML (text/html, 401) instead of JavaScript, and the import fails
// with "expected a module, got text/html". React's error boundary then shows
// an error box on that page (already-visited pages keep working because their
// chunks are browser-cached — so it hits SOME pages, not all). The same thing
// happens to any tab left open across a new deploy: the chunk hashes change
// and the old hashes 404.
//
// In every case the fix is the same: reload. On reload the middleware cleanly
// serves either the fresh app (cookie still valid / new index.html) or the
// login form (cookie expired) — never a half-broken error box. A sessionStorage
// guard prevents a reload loop if the reload itself can't recover.
const CHUNK_RELOAD_KEY = 'me_chunk_reload_ts';
const CHUNK_RELOAD_COUNT_KEY = 'me_chunk_reload_n';
const MAX_CHUNK_RELOADS = 3;
function reloadOnceForChunkFailure() {
  const last = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0);
  const count = Number(sessionStorage.getItem(CHUNK_RELOAD_COUNT_KEY) || 0);
  if (count >= MAX_CHUNK_RELOADS) return false; // permanently broken — give up, show error
  if (Date.now() - last > 10000) {
    sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
    sessionStorage.setItem(CHUNK_RELOAD_COUNT_KEY, String(count + 1));
    window.location.reload();
    return true;
  }
  return false; // already reloaded recently — let the error boundary render
}

// Vite fires this when a preloaded/dynamic import fails to fetch.
window.addEventListener('vite:preloadError', (event) => {
  if (reloadOnceForChunkFailure()) event.preventDefault();
});

// Belt-and-suspenders: some lazy() failures surface as a rejected promise with
// a chunk-load message rather than vite:preloadError. Match those too.
const CHUNK_ERR_RE =
  /(Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|expected a JavaScript module)/i;
window.addEventListener('unhandledrejection', (event) => {
  const msg = String(event?.reason?.message || event?.reason || '');
  if (CHUNK_ERR_RE.test(msg)) reloadOnceForChunkFailure();
});

// Reset the reload budget once the app has proven stable. MAX_CHUNK_RELOADS is a
// guard against a reload LOOP within a single staleness episode — NOT a lifetime
// cap. Without this reset, a long-open tab that survives several deploys (each a
// legitimate one-shot reload) permanently exhausts the budget, after which every
// later stale-chunk navigation shows the error box instead of recovering — i.e.
// "various pages stop loading" until a manual hard refresh. If the app stays up
// for STABLE_MS with no chunk-triggered reload, the current index.html + its
// chunks are demonstrably consistent, so we clear the counter and hand the next
// episode a fresh budget. The 20s window is safely longer than the 10s reload
// throttle, so a genuinely-missing chunk still caps at MAX_CHUNK_RELOADS.
const STABLE_MS = 20000;
window.addEventListener('load', () => {
  setTimeout(() => {
    try {
      const last = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0);
      if (Date.now() - last > STABLE_MS) {
        sessionStorage.removeItem(CHUNK_RELOAD_COUNT_KEY);
        sessionStorage.removeItem(CHUNK_RELOAD_KEY);
      }
    } catch {
      /* sessionStorage blocked — nothing to reset */
    }
  }, STABLE_MS);
});

const root = createRoot(document.getElementById('root'));
root.render(<App />);
