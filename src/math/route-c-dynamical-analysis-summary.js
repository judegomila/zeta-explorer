/**
 * A1 bundle fix: summary projection of imp-834 route-c-dynamical-analysis
 * for UI consumers. Source module imports ZEROS_EXTENDED (10^6 entries,
 * 16 MB) at load time to compute its output, which inflates any page
 * chunk that imports it transitively.
 *
 * This file re-exports a precomputed JSON snapshot (~10 KB) that
 * contains the same fields consumers need (samples, derivation,
 * preliminaryNegativeResult, etc.) without pulling in the zero table.
 *
 * Source of truth: src/math/route-c-dynamical-analysis.js.
 * Regenerate via:
 *   node -e "import('./src/math/route-c-dynamical-analysis.js').then(m =>
 *     require('fs').writeFileSync(
 *       'src/math/route-c-dynamical-analysis-summary.json',
 *       JSON.stringify(m.ROUTE_C_DYNAMICAL_ANALYSIS, null, 2)))"
 */

import summary from './route-c-dynamical-analysis-summary.json';

export const ROUTE_C_DYNAMICAL_ANALYSIS_SUMMARY = summary;
