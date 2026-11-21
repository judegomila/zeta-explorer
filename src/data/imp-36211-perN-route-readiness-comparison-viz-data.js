/**
 * @module imp-36211-perN-route-readiness-comparison-viz-data
 *
 * imp-36211 (ux, low): import-light viz-data module for a chart comparing the
 * imp-36045 G5-perN-translation three-route readiness ranking (C > B > A).
 * Bakes, per route, its weighted readiness score, its source tickets, and its
 * named residual blocker -- literals reused verbatim from the imp-36045
 * assessment (src/data/imp-36045-perN-translation-route-readiness-assessment.js)
 * and the imp-36164 cross-reference note (src/data/imp-36164-perN-translation-
 * storyline-cross-reference.js). No re-derivation, no new computation.
 *
 * Presentation only: closes nothing, discharges no gap, changes no bound;
 * C_mb stays GUE-conditional (imp-486); NO QED; no refereed bound is changed.
 *
 * @see imp-36045-perN-translation-route-readiness-assessment.js (source ROUTES/scores/ranking)
 * @see imp-36164-perN-translation-storyline-cross-reference.js (arc cross-reference)
 *
 * Ticket: imp-36211 (ux, low). Presentation only, RH-free; NO QED.
 */

export const IMP36211_ROUTE_COMPARISON = [
  {
    key: 'C',
    label: 'Route C -- density squeeze',
    sourceTickets: 'imp-337 / imp-342 / imp-343',
    score: 22,
    perNForm: 2,
    unconditional: 2,
    gapsClosed: 1,
    residualTractable: 2,
    blocker: 'G3a_max_gap: extremal max-gap statistics at the argmin site (NOT proven irreducible)',
    rank: 1,
  },
  {
    key: 'B',
    label: 'Route B -- Burgers uniformity (PRIMARY)',
    sourceTickets: 'imp-341 (lim-sup) + imp-348 (rate)',
    score: 11,
    perNForm: 0,
    unconditional: 2,
    gapsClosed: 0,
    residualTractable: 1,
    blocker: 'per-N O(1/N) upgrade requires local-law rigidity (re-imports GUE/ESY)',
    rank: 2,
  },
  {
    key: 'A',
    label: 'Route A -- monotonicity',
    sourceTickets: 'imp-336',
    score: 10,
    perNForm: 2,
    unconditional: 0,
    gapsClosed: 2,
    residualTractable: 0,
    blocker: 'C_mb many-body Calogero-Moser correction (imp-486: IRREDUCIBLE, needs GUE universality)',
    rank: 3,
  },
];

export const IMP36211_RANKING_ORDER = 'C > B > A';

export const IMP36211_WEIGHTS = Object.freeze({
  perNForm: 3,
  unconditional: 4,
  gapsClosed: 2,
  residualTractable: 3,
});
