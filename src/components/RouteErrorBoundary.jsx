import React from 'react';

// A failed lazy-route chunk import (stale session behind the auth middleware,
// or a stale deploy whose chunk hashes changed) throws into this boundary as a
// ChunkLoadError. That is a transient infra condition, not a code bug, so we
// recover by reloading once — on reload the app or the login form serves
// cleanly — rather than showing the red crash card. See src/main.jsx for the
// full explanation and the matching window-level handlers.
const CHUNK_ERR_RE =
  /(Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|expected a JavaScript module|ChunkLoadError|Loading chunk \d+ failed)/i;
const CHUNK_RELOAD_KEY = 'me_chunk_reload_ts';
const CHUNK_RELOAD_COUNT_KEY = 'me_chunk_reload_n';
const MAX_CHUNK_RELOADS = 3;

function isChunkLoadError(error) {
  const msg = `${error?.name || ''} ${error?.message || error || ''}`;
  return CHUNK_ERR_RE.test(msg);
}
function reloadOnceForChunkFailure() {
  try {
    const last = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0);
    const count = Number(sessionStorage.getItem(CHUNK_RELOAD_COUNT_KEY) || 0);
    if (count >= MAX_CHUNK_RELOADS) return false; // permanently broken — give up, show error
    if (Date.now() - last > 10000) {
      sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
      sessionStorage.setItem(CHUNK_RELOAD_COUNT_KEY, String(count + 1));
      window.location.reload();
      return true;
    }
  } catch {
    // sessionStorage blocked (private mode etc.) — fall through to the card.
  }
  return false;
}

/**
 * RouteErrorBoundary — React class component error boundary that catches
 * crashes in any lazy-loaded page and surfaces the error + stack in-page
 * instead of white-screening the app.
 *
 * Wraps the Suspense + Routes block in App.jsx so a crash on one route
 * (e.g. /lambda-bounds) shows a readable error card rather than just
 * "nothing loads" — operator can paste the stack into a ticket. Chunk-load
 * failures are treated as transient and recovered by reloading (see above).
 */
export default class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null, recovering: false };
  }

  static getDerivedStateFromError(error) {
    // Transient chunk-load failure → reload once instead of showing the card.
    if (isChunkLoadError(error) && reloadOnceForChunkFailure()) {
      return { error, recovering: true };
    }
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    if (isChunkLoadError(error)) return; // recovering via reload; don't log noise
    // Surface in console for DevTools as well as in the in-page card.
    // eslint-disable-next-line no-console
    console.error('[RouteErrorBoundary]', error, errorInfo);
    this.setState({ errorInfo });
  }

  reset = () => {
    this.setState({ error: null, errorInfo: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    // Chunk-load failure: a reload is in flight (or just throttled). Show a
    // minimal neutral message, never the red crash card.
    if (this.state.recovering || isChunkLoadError(this.state.error)) {
      return (
        <main style={{ maxWidth: 420, margin: '80px auto', padding: 24, textAlign: 'center',
          fontFamily: 'var(--font-mono, monospace)', color: '#94a3b8' }}>
          <div style={{ fontSize: 14 }}>Refreshing…</div>
          <div style={{ marginTop: 10, fontSize: 12 }}>
            Your session or a cached file expired. <a href="#/" onClick={() => window.location.reload()}
              style={{ color: '#60a5fa' }}>Reload</a> if this does not clear on its own.
          </div>
        </main>
      );
    }

    const { error, errorInfo } = this.state;
    const message = error?.message || String(error);
    const stack = error?.stack || '(no stack)';
    const componentStack = errorInfo?.componentStack || '(no component stack)';

    return (
      <main style={{
        maxWidth: 900, margin: '24px auto', padding: '24px',
        background: 'rgba(127, 29, 29, 0.15)',
        border: '1px solid rgba(239, 68, 68, 0.5)',
        borderRadius: 10,
        fontFamily: 'var(--font-mono, monospace)',
      }}>
        <h2 style={{ margin: 0, color: '#fca5a5', fontSize: 18 }}>Page crashed</h2>
        <div style={{ marginTop: 8, color: '#cbd5e1', fontSize: 13 }}>
          The route component threw during render. Details below; paste the message + first
          5 lines of the stack into a bug ticket and we can fix it.
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ color: '#fbbf24', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Message</div>
          <pre style={{
            margin: '4px 0 0 0', padding: 10,
            background: 'rgba(15,23,42,0.9)',
            border: '1px solid #1e293b', borderRadius: 6,
            color: '#fca5a5', fontSize: 13, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>{message}</pre>
        </div>

        <details style={{ marginTop: 16 }}>
          <summary style={{ cursor: 'pointer', color: '#94a3b8', fontSize: 12 }}>Stack trace</summary>
          <pre style={{
            margin: '8px 0 0 0', padding: 10,
            background: 'rgba(15,23,42,0.9)', border: '1px solid #1e293b', borderRadius: 6,
            color: '#cbd5e1', fontSize: 11, overflow: 'auto', maxHeight: 360,
          }}>{stack}</pre>
        </details>

        <details style={{ marginTop: 8 }}>
          <summary style={{ cursor: 'pointer', color: '#94a3b8', fontSize: 12 }}>Component stack</summary>
          <pre style={{
            margin: '8px 0 0 0', padding: 10,
            background: 'rgba(15,23,42,0.9)', border: '1px solid #1e293b', borderRadius: 6,
            color: '#cbd5e1', fontSize: 11, overflow: 'auto', maxHeight: 240,
          }}>{componentStack}</pre>
        </details>

        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          <button onClick={this.reset} style={{
            padding: '8px 14px', fontSize: 12, fontFamily: 'var(--font-mono, monospace)',
            background: 'rgba(251,191,36,0.12)', color: '#fbbf24',
            border: '1px solid rgba(251,191,36,0.45)', borderRadius: 6, cursor: 'pointer',
          }}>Try again</button>
          <a href="#/" style={{
            padding: '8px 14px', fontSize: 12, fontFamily: 'var(--font-mono, monospace)',
            background: 'rgba(96,165,250,0.12)', color: '#60a5fa',
            border: '1px solid rgba(96,165,250,0.35)', borderRadius: 6, textDecoration: 'none',
          }}>← Home</a>
        </div>
      </main>
    );
  }
}
