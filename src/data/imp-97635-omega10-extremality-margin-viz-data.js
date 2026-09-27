/**
 * @module imp-97635-omega10-extremality-margin-viz-data
 *
 * imp-97635: import-light viz-data charting the imp-97606 omega=10 primorial-extremality margin.
 * Reuses IMP97606_OMEGA10_EXTREMALITY verbatim (no re-derivation, no new computation): the primorial
 * p_10# = {2,3,5,7,11,13,17,19,23,29} is the strict minimiser of T at omega=10 (T = +4.782772e-4), the
 * nearest non-primorial competitor {..,23,31} (top prime 29 -> 31) sits +7.520579e-5 above it at
 * T = +5.534829e-4, and none of the 20,437 tested sets in the broadened family (single-prime
 * substitutions, shift-up families k=1..5, two-prime substitutions of {23,29}, and a 20,000-trial
 * offline random sweep) crosses zero -- so the MCM onset stays exactly omega=11.
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97606-route-m-mcm-omega10-primorial-extremality-broadened.js (IMP97606_OMEGA10_EXTREMALITY)
 */

import { IMP97606_OMEGA10_EXTREMALITY as E } from './imp-97606-route-m-mcm-omega10-primorial-extremality-broadened.js';

// Two bars for the margin chart: the primorial's T and the nearest non-primorial competitor's T,
// both measured against the T=0 MCM-failure line.
export const IMP97635_MARGIN_ROWS = Object.freeze([
  Object.freeze({
    key: 'primorial',
    label: 'primorial p_10# = {2,3,5,7,11,13,17,19,23,29}',
    T: E.primorialT, // +4.782772e-4 -- the strict minimiser, the last holding margin
    note: 'strict minimiser over all 20,437 tested omega=10 sets',
  }),
  Object.freeze({
    key: 'nearestCompetitor',
    label: 'nearest competitor {2,3,5,7,11,13,17,19,23,31} (29 -> 31)',
    T: E.minNonPrimorialT, // +5.534829e-4 -- smallest non-primorial T
    note: `+${E.gapAbovePrimorial.toExponential(6)} above the primorial (tiniest single-prime perturbation)`,
  }),
]);

export const IMP97635_SUMMARY = Object.freeze({
  law:
    'At omega=10 the primorial p_10# is the strict minimiser of T over a broad family of 20,437 '
    + 'squarefree 10-sets (single-prime substitutions, shift-up families, two-prime substitutions, and '
    + 'a 20,000-trial offline random sweep): every non-primorial set sits above it, with the nearest '
    + `competitor only +${E.gapAbovePrimorial.toExponential(2)} away, and none of the 20,437 sets crosses `
    + 'the T=0 MCM-failure line.',
  reading:
    `The primorial holds at T = +${E.primorialT.toExponential(6)}, and the tightest non-primorial `
    + `competitor (top prime 29 -> 31) sits at T = +${E.minNonPrimorialT.toExponential(6)}, a gap of `
    + `+${E.gapAbovePrimorial.toExponential(6)} above the primorial. Both bars stay strictly positive, `
    + `so the MCM onset stays exactly omega=${E.onsetOmega} -- no set in the broadened family pulls the `
    + 'onset down to omega=10.',
  verdict:
    'Presentation only: every T-value and set is reused verbatim from imp-97606 (a measurement, not a '
    + 'derivation); no new computation. The b/4 ceiling is untouched; no bound moves; Platt-Trudgian '
    + 'Lambda <= 0.2 remains SOTA; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97635_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97635-two-rows',
    description: 'exactly two margin rows (primorial and nearest competitor)',
    holds: () => IMP97635_MARGIN_ROWS.length === 2,
  },
  {
    id: 'imp97635-both-strictly-positive',
    description: 'both T-values are strictly positive (neither crosses the MCM-failure line)',
    holds: () => IMP97635_MARGIN_ROWS.every((r) => r.T > 0),
  },
  {
    id: 'imp97635-competitor-above-primorial',
    description: 'the nearest competitor T exceeds the primorial T by the frozen gap',
    holds: () => {
      const [prim, comp] = IMP97635_MARGIN_ROWS;
      return (
        comp.T > prim.T &&
        Math.abs(comp.T - prim.T - E.gapAbovePrimorial) < 1e-9
      );
    },
  },
  {
    id: 'imp97635-onset-stays-eleven',
    description: 'the frozen onsetOmega stays 11, matching the honest-status narrative',
    holds: () => E.onsetOmega === 11 && E.ceilingTouched === false && E.qed === false,
  },
  {
    id: 'imp97635-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97635_SUMMARY.verdict) && /NO QED/.test(IMP97635_SUMMARY.verdict),
  },
];

for (const assertion of IMP97635_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97635 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97635_SUMMARY;
