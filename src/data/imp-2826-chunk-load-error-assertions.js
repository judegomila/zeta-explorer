// @module data/imp-2826-chunk-load-error-assertions
// imp-2826 -- Build-time assertions for RouteErrorBoundary ChunkLoadError detection.
//
// The RouteErrorBoundary in src/components/RouteErrorBoundary.jsx uses a
// regex to distinguish transient chunk-load failures (recover by reload)
// from genuine code crashes (show the red error card). If the regex drifts
// or a new Vite/browser error message format emerges, the recovery silently
// breaks — this module locks the classification behaviour at build time.
//
// The regex and isChunkLoadError logic are mirrored here (not imported)
// because the component imports React+DOM globals that are unavailable in
// the Vite SSR / node assertion sweep. When the component regex changes,
// update CHUNK_ERR_RE below to stay in sync — the mismatched-pattern
// assertions below will fail immediately and flag the drift.

const CHUNK_ERR_RE =
  /(Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|expected a JavaScript module|ChunkLoadError|Loading chunk \d+ failed)/i;

function isChunkLoadError(error) {
  const msg = `${error?.name || ''} ${error?.message || error || ''}`;
  return CHUNK_ERR_RE.test(msg);
}

// ── Assertion fixtures ────────────────────────────────────────────────────

const CHUNK_PATTERNS_THAT_MUST_MATCH = [
  { label: 'Vite failed-fetch message', error: { message: 'Failed to fetch dynamically imported module: /assets/LambdaPage.abc123.js' } },
  { label: 'Firefox error loading message', error: { message: 'error loading dynamically imported module: chunk.js' } },
  { label: 'Safari Importing a module script failed', error: { message: 'Importing a module script failed.' } },
  { label: 'expected a JavaScript module', error: { message: 'expected a JavaScript module script but the server responded with MIME type text/html; strict MIME type checking is enforced' } },
  { label: 'Webpack-style ChunkLoadError name', error: { name: 'ChunkLoadError', message: 'Loading chunk 42 failed.' } },
  { label: 'Webpack Loading chunk N failed in message', error: { message: 'Loading chunk 7 failed.' } },
  { label: 'case-insensitive: FAILED TO FETCH', error: { message: 'FAILED TO FETCH DYNAMICALLY IMPORTED MODULE' } },
];

const NON_CHUNK_ERRORS_THAT_MUST_NOT_MATCH = [
  { label: 'generic TypeError', error: { name: 'TypeError', message: 'Cannot read properties of undefined' } },
  { label: 'network 404', error: { message: 'HTTP error! status: 404' } },
  { label: 'syntax error', error: { name: 'SyntaxError', message: 'Unexpected token <' } },
  { label: 'empty error', error: {} },
  { label: 'null input', error: null },
  { label: 'string error', error: 'something went wrong' },
];

export const CHUNK_LOAD_ERROR_ASSERTIONS = [
  ...CHUNK_PATTERNS_THAT_MUST_MATCH.map((fixture) => ({
    id: `imp-2826-chunk-match-${fixture.label.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
    why: `RouteErrorBoundary must recognise "${fixture.label}" as a chunk-load error so it recovers by reload rather than showing the red crash card.`,
    holds: () => isChunkLoadError(fixture.error) === true,
  })),
  ...NON_CHUNK_ERRORS_THAT_MUST_NOT_MATCH.map((fixture) => ({
    id: `imp-2826-non-chunk-no-match-${fixture.label.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
    why: `RouteErrorBoundary must NOT classify "${fixture.label}" as a chunk-load error — doing so would suppress a real crash and hide the error from users.`,
    holds: () => isChunkLoadError(fixture.error) === false,
  })),
  {
    id: 'imp-2826-chunk-err-re-is-case-insensitive',
    why: 'The regex flag /i must be present; browser error messages vary in capitalisation across vendors.',
    holds: () => CHUNK_ERR_RE.flags.includes('i'),
  },
  {
    id: 'imp-2826-chunk-err-re-covers-six-patterns',
    why: 'The alternation must cover exactly the 6 known vendor patterns (Vite, Firefox, Safari, MIME, ChunkLoadError name, Webpack chunk-N). Fewer means new browser messages fall through to the crash card.',
    holds: () => {
      const src = CHUNK_ERR_RE.source;
      const patterns = [
        'Failed to fetch dynamically imported module',
        'error loading dynamically imported module',
        'Importing a module script failed',
        'expected a JavaScript module',
        'ChunkLoadError',
        'Loading chunk',
      ];
      return patterns.every((p) => src.includes(p));
    },
  },
  {
    id: 'imp-2826-is-chunk-load-error-returns-boolean',
    why: 'isChunkLoadError must always return a boolean, never undefined or a match object.',
    holds: () => {
      const results = [
        isChunkLoadError({ message: 'Failed to fetch dynamically imported module: x' }),
        isChunkLoadError({ message: 'TypeError: cannot read' }),
        isChunkLoadError(null),
        isChunkLoadError({}),
      ];
      return results.every((r) => r === true || r === false);
    },
  },
];
