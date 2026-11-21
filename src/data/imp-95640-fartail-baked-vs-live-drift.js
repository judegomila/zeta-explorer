/**
 * @module imp-95640-fartail-baked-vs-live-drift
 *
 * imp-95640 (accuracy, cross-validation): baked-vs-live drift check for the
 * imp-95606 far-tail sigma(N) decay-exponent literals now shown on the
 * Imp95622SigmaExponentRampViz page. Those literals are a one-off bake of the
 * imp-95602/imp-95614 live log-space evaluator (endpoint p(1e12), the 1/2
 * far-tail asymptote, and the two tolerance-crossing heights). This module
 * re-runs that live evaluator and diffs each baked value, reporting the max
 * relative drift and flagging any field outside the ~1e-6 storage-precision
 * tolerance (the known 7-sig-fig bake trap, imp-2546/imp-2539). Cross-validation
 * only; records a drift for a follow-up bake fix, claims no bound.
 *
 * METHOD. Ran tmp/imp-95640-drift.mjs: imported the imp-95602 module (which
 * self-evaluates CROSS_1PCT/CROSS_0P1PCT and the ramp on import from the exact
 * imp-3406 component model) and the imp-95606 viz-data module, then computed
 * relDrift = |baked - live| / |live| for each far-tail literal. The two
 * crossing heights were diffed against BOTH the imp-95602 live evaluator and the
 * imp-95625 companion table (imp-95606 itself does not bake the crossings -- see
 * SCOPE below).
 *
 * SCOPE CLARIFICATION. The imp-95606 module bakes only two far-tail literals:
 * IMP95606_FAR_TAIL_EXPONENT = 0.5 (the imp-3463 asymptote) and the
 * IMP95606_FINE_GRID endpoint p(1e12) = 0.4526. The two tolerance-crossing
 * heights (log10 N ~ 44.167 within 1%, ~436.059 within 0.1%) are NOT in
 * imp-95606; they live in the imp-95602 live evaluator and the imp-95625
 * companion crossing-ladder table. All four are diffed here for completeness.
 *
 * FINDING -- 3 of 4 agree to full storage precision; the one drift is a
 * quoting-precision difference, NOT a copy error.
 *
 *   FAR_TAIL_EXPONENT (asymptote):  baked 0.5      vs live 0.5        drift 0
 *   within-1% crossing log10N:      baked 44.167   vs live 44.167     drift 0
 *   within-0.1% crossing log10N:    baked 436.059  vs live 436.059    drift 0
 *   endpoint p(1e12):               baked 0.4526   vs live 0.45264    drift 8.837e-5
 *
 * MAX relative drift = 8.837e-5, carried by the single endpoint field. That
 * drift is NOT a mis-copied value: the imp-95606 IMP95606_FINE_GRID quotes every
 * p_local to 4 decimal places (0.4326, 0.4526, ...), and 0.4526 is the correct
 * round-down of the live 0.45264 to 4 dp. The higher-precision companion
 * imp-95625 table quotes the same endpoint to 5 dp (0.45264), agreeing with the
 * live evaluator to full precision. So the 8.837e-5 is the imp-95606 FINE_GRID
 * table's own 4-dp quoting granularity, a display-precision choice, not a
 * baked-copy drift from the source evaluator.
 *
 * FOLLOW-UP BAKE FIX. Optional and cosmetic only: if the page ever needs the
 * endpoint to full source precision, re-bake the IMP95606_FINE_GRID p(1e12) row
 * as 0.45264 (matching imp-95625). No functional or bound impact -- the FINE_GRID
 * is intentionally a coarse 4-dp visual table, so no fix is applied this run.
 *
 * Cross-validation only atop the inherited imp-3220/imp-3406 extrapolation, NOT
 * rigorous; the C_mb GUE-conditional (imp-486) is untouched; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; changes no bound; no RH
 * verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-95606-sigma-postpeak-fine-exponent-ramp-viz-data.js (baked far-tail literals audited here)
 * @see imp-95602-sigma-exponent-ramp-past-1e12.js (live log-space evaluator re-run)
 * @see imp-95614-sigma-exponent-ramp-crosscheck.js (cross-check of the same evaluator)
 * @see imp-95625-sigma-exponent-crossing-ladder-table.js (companion 5-dp crossing table)
 * @see Imp95622SigmaExponentRampViz.jsx (page consuming the imp-95606 literals)
 */

// Baked-vs-live diff rows (values from tmp/imp-95640-drift.mjs; drifts baked as
// literals so this module stays import-light and float-divergence-free).
const DRIFT_ROWS = Object.freeze([
  {
    field: 'IMP95606_FAR_TAIL_EXPONENT (asymptote)',
    source: 'imp-95606',
    baked: 0.5,
    live: 0.5,
    relDrift: 0,
    withinTol: true,
  },
  {
    field: 'endpoint p(1e12) [IMP95606_FINE_GRID]',
    source: 'imp-95606',
    baked: 0.4526,
    live: 0.45264,
    relDrift: 8.837e-5,
    withinTol: false, // exceeds 1e-6 -- but see explanation: 4-dp table quote, not a copy error
  },
  {
    field: 'within-1% crossing log10N',
    source: 'imp-95625 / imp-95602-live',
    baked: 44.167,
    live: 44.167,
    relDrift: 0,
    withinTol: true,
  },
  {
    field: 'within-0.1% crossing log10N',
    source: 'imp-95625 / imp-95602-live',
    baked: 436.059,
    live: 436.059,
    relDrift: 0,
    withinTol: true,
  },
]);

const TOL = 1e-6; // storage-precision (7-sig-fig bake trap) threshold
const MAX_REL_DRIFT = 8.837e-5; // carried entirely by the endpoint p(1e12) field
const FIELDS_OUTSIDE_TOL = 1; // the single endpoint field

export const IMP95640_FARTAIL_BAKED_VS_LIVE_DRIFT = Object.freeze({
  id: 'imp-95640',
  proofSection: 'S-frontier',
  question:
    'Do the baked imp-95606 far-tail sigma(N) decay-exponent literals shown on ' +
    'Imp95622SigmaExponentRampViz match the imp-95602/imp-95614 live log-space ' +
    'evaluator within ~1e-6 storage precision, or has a bake drifted?',
  driftRows: DRIFT_ROWS,
  tolerance: TOL,
  maxRelDrift: MAX_REL_DRIFT,
  fieldsOutsideTolerance: FIELDS_OUTSIDE_TOL,
  verdictShort:
    'AGREEMENT WITH ONE EXPLAINED QUOTING-PRECISION DRIFT. 3 of 4 far-tail ' +
    'literals (the 1/2 asymptote and both tolerance-crossing heights ' +
    '44.167 / 436.059) match the imp-95602 live evaluator to full storage ' +
    'precision (relDrift 0). The 4th, the IMP95606_FINE_GRID endpoint ' +
    'p(1e12) = 0.4526, sits 8.837e-5 below the live 0.45264 -- exactly the ' +
    'round-down of the live value to the FINE_GRID table 4-dp quote, not a ' +
    'mis-copied value (the imp-95625 5-dp companion agrees to full precision).',
  followUpBakeFix:
    'OPTIONAL / COSMETIC. Re-baking IMP95606_FINE_GRID p(1e12) as 0.45264 would ' +
    'lift the FINE_GRID endpoint to source precision; not applied this run since ' +
    'the FINE_GRID is intentionally a coarse 4-dp visual table. No bound impact.',
  isRigorous: false,
  verdict:
    'CROSS-VALIDATION ONLY. No genuine baked-copy drift found: the lone ' +
    'above-tolerance field is the imp-95606 FINE_GRID 4-dp display quote, ' +
    'correctly rounded from the live 0.45264. Changes no bound; establishes no ' +
    'operator positivity; C_mb GUE-conditional (imp-486) untouched; no RH ' +
    'verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-95606 (baked viz-data literals); imp-95602/imp-95614 (live evaluator + ' +
    'cross-check); imp-95625 (5-dp companion crossing table); imp-2546/imp-2539 ' +
    '(7-sig-fig storage-precision bake trap).',
});

export const IMP95640_FARTAIL_BAKED_VS_LIVE_DRIFT_ASSERTIONS = [
  {
    id: 'imp95640-four-fields-diffed',
    description: 'exactly four far-tail literals were diffed baked-vs-live',
    holds: () => DRIFT_ROWS.length === 4,
  },
  {
    id: 'imp95640-three-exact',
    description: 'three of four literals agree to full storage precision (relDrift 0)',
    holds: () => DRIFT_ROWS.filter((r) => r.relDrift === 0).length === 3,
  },
  {
    id: 'imp95640-max-drift-is-endpoint',
    description: 'the single above-tolerance field is the p(1e12) endpoint',
    holds: () =>
      FIELDS_OUTSIDE_TOL === 1 &&
      DRIFT_ROWS.filter((r) => r.withinTol === false).length === 1 &&
      DRIFT_ROWS.find((r) => r.withinTol === false).field.indexOf('p(1e12)') >= 0,
  },
  {
    id: 'imp95640-max-drift-value',
    description: 'reported max relative drift matches the endpoint field row',
    holds: () =>
      Math.abs(MAX_REL_DRIFT - DRIFT_ROWS.find((r) => !r.withinTol).relDrift) < 1e-12,
  },
  {
    id: 'imp95640-endpoint-is-rounddown',
    description: 'the baked 0.4526 endpoint is the correct 4-dp round-down of the live 0.45264',
    holds: () => Math.round(0.45264 * 1e4) / 1e4 === 0.4526,
  },
  {
    id: 'imp95640-no-bound-claim',
    description: 'cross-validation only, not rigorous, claims no bound',
    holds: () => IMP95640_FARTAIL_BAKED_VS_LIVE_DRIFT.isRigorous === false,
  },
];

for (const assertion of IMP95640_FARTAIL_BAKED_VS_LIVE_DRIFT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-95640-fartail-baked-vs-live-drift assertion failed: ${assertion.id}`);
  }
}
