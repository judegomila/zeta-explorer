/**
 * A1 bundle fix: summary projection of imp-856 c-mb-weaker-bound-search
 * for UI consumers. Source module imports ZEROS_EXTENDED to compute a
 * reference N_MAX_AVAILABLE; that import alone pulls the 16 MB zero
 * table into any page chunk that reaches this module transitively.
 *
 * Source of truth: src/math/c-mb-weaker-bound-search.js.
 * Regenerate via:
 *   node -e "import('./src/math/c-mb-weaker-bound-search.js').then(m =>
 *     require('fs').writeFileSync(
 *       'src/math/c-mb-weaker-bound-search-summary.json',
 *       JSON.stringify(m.C_MB_WEAKER_BOUND_SEARCH, null, 2)))"
 */

import summary from './c-mb-weaker-bound-search-summary.json';

export const C_MB_WEAKER_BOUND_SEARCH_SUMMARY = summary;
