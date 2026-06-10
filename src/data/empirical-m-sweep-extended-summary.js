/**
 * @module empirical-m-sweep-extended-summary
 * @fileoverview Lightweight summary projection of the extended empirical
 * m-sweep (imp-833 + imp-858). Re-exports a precomputed JSON snapshot so UI
 * page chunks can read the sweep statistics without importing the full
 * 10^6-zero sweep module.
 *
 * Proof-chain step
 *   Belongs to the empirical-floor support sub-tree: the extended m-sweep
 *   tests the E1/E2 floor inequalities against the analytic lower bound over
 *   a range of N_max. This file is the read-side projection consumed by the
 *   dashboard/full-story/blog presentation layer.
 *
 * Exports
 *   - EMPIRICAL_M_SWEEP_EXTENDED_SUMMARY — the precomputed summary object
 *     (N_max, E1/E2 results, sample values, analytic floor).
 *
 * Key assertions
 *   None evaluated here. The summary JSON is a frozen snapshot; drift versus
 *   the live sweep is detected at runtime by daily-health-check.sh (imp-877),
 *   which re-runs the full sweep and writes .empirical-floor-violation if
 *   E1/E2 regresses.
 *
 * Tickets
 *   Created by imp-833 / imp-858; bundle-split rationale from Batch A bundle
 *   optimization (A1); documented by imp-2589.
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
