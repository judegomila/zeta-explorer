/**
 * imp-833 + imp-858 summary projection.
 *
 * A1 fix (Batch A bundle optimization): UI consumers (DashboardPage,
 * FullStoryPage, BlogPage) only need the summary statistics (N_max, E1/E2
 * results, sample values, analytic floor). Importing the full
 * empirical-m-sweep-extended.js from a page chunk would pull in the
 * 10^6-zero ZEROS_EXTENDED array transitively — ~16 MB. This file re-exports
 * a precomputed JSON snapshot (~6 KB) so page chunks stay small.
 *
 * Source of truth: src/data/empirical-m-sweep-extended.js (runs the sweep
 * at module load; regenerated via
 *   node -e "import('./src/data/empirical-m-sweep-extended.js').then(m => ...)"
 * emitting empirical-m-sweep-extended-summary.json).
 *
 * Any drift between the summary JSON and the live sweep is caught at
 * runtime by daily-health-check.sh (imp-877) which re-runs the full sweep
 * and writes .empirical-floor-violation if E1/E2 regresses.
 */

import summary from './empirical-m-sweep-extended-summary.json';

export const EMPIRICAL_M_SWEEP_EXTENDED_SUMMARY = summary;
