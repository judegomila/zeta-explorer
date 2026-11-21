/**
 * @module imp-33587-band-crossing-floor-climb-viz-data
 *
 * imp-33587 (ux): lightweight, import-light viz-data module for a chart of the
 * imp-33557 band-crossing floor-climb. Presents the graded-GL grade-4 plateau
 * arithmetic floor (the smallest residual reachable at budgets &gt;= 200 nodes
 * vs the imp-33213 A_log target) at the three imp-33537 band-crossing rungs
 * n in {495,510,596}, alongside the minimum node budget reaching the
 * imp-33316 &lt; 64 ULP band at each rung, and the per-rung HOLDS/EDGE/FAILS
 * verdict.
 *
 * Reference literals are baked from a direct re-run of the imp-33557
 * self-computing sweep (same phiKernel/saddleTau/graded-GL formulas) -- no
 * re-derivation of the underlying A(tau) kernel or quadrature rules here.
 *
 * @see imp-33557-band-crossing-min-budget.js (source module: the sweep this charts)
 * @see imp-33537-deep-tail-plateau-spike-recurrence.js (the dense scan bracketing the crossing)
 * @see imp-33316-graded-plateau-deep-tail-node-budget.js (the &lt; 64 ULP deep band)
 *
 * Ticket: imp-33587 (ux, low). Presentation only, RH-equivalent; imp-3066
 * untouched; no refereed bound is changed; NO QED.
 */

export const IMP33587_BAND_ULP = 64;

export const IMP33587_RUNGS = [
  { n: 495, floorUlp: 24.234621297454126, minInBandNodes: 200, verdict: 'HOLDS' },
  { n: 510, floorUlp: 61.3628804220252, minInBandNodes: 500, verdict: 'EDGE' },
  { n: 596, floorUlp: 65.30275557543644, minInBandNodes: Infinity, verdict: 'FAILS' },
];
