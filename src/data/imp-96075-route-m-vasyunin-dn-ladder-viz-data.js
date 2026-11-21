/**
 * @module imp-96075-route-m-vasyunin-dn-ladder-viz-data
 *
 * imp-96075 (content): import-light viz-data leaf for RH Route M
 * (rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js), which
 * records the exact Vasyunin-Gram Nyman-Beurling distance ladder d_N and
 * the Mellin-side zero-pinned residual test but had no viz surface.
 *
 * Two things are re-presented here, copied verbatim from the source
 * module's own exported records (no re-derivation, no re-execution of
 * the underlying Gram/Cholesky or quadrature numerics beyond what that
 * module already computes at import time):
 *   (1) the d_N ladder: N vs d_N^2 log N / Sum_rho 1/|rho|^2 (the Burnol
 *       ratio), which the source module shows converges from 1.258 at
 *       N=5 to 0.998 at N=500 -- the exact-Gram distance sitting on the
 *       Burnol floor;
 *   (2) the |1+zeta D_N|^2/(1/4+t^2) residual structure: this ratio
 *       equals 1 exactly AT every zero (forced, since zeta(rho)=0) and
 *       has median 0.079 / max 0.692 (normalized by 1/|rho|^2) between
 *       zeros -- the source module's mellinResidual summary statistics.
 *       No continuous curve is baked anywhere upstream, so only the
 *       three baked summary points (at-zero, between-zero median,
 *       between-zero max) are plotted, not a fabricated smooth curve.
 *
 * MEASUREMENT / PRESENTATION ONLY. Changes no bound, establishes no
 * operator positivity, no RH claim; no refereed bound is changed
 * . RH open. NO QED.
 *
 * @see rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js
 *   (NB_DISTANCE_LADDER.rows, RECIPROCITY_STRUCTURAL_TEST.mellinResidual)
 *
 * Ticket: imp-96075 (content, sonnet-4-6, medium). Presentation only,
 * RH-free; changes no bound; NO QED.
 */

import RH_ROUTE_M, { NB_DISTANCE_LADDER, RECIPROCITY_STRUCTURAL_TEST } from './rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js';

// [N, d_N^2, d_N^2 log N, ratio to the Burnol constant Sum_rho 1/|rho|^2]
export const IMP96075_DN_LADDER = NB_DISTANCE_LADDER.rows.map(([N, dN2, dN2LogN, ratio]) => ({
  N,
  dN2,
  dN2LogN,
  ratioToBurnol: ratio,
}));

export const IMP96075_BURNOL_CONSTANT = NB_DISTANCE_LADDER.C_burnol;

const m = RECIPROCITY_STRUCTURAL_TEST.mellinResidual;

// three baked points of |1+zeta D_N|^2/(1/4+t^2) normalized by 1/|rho|^2:
// forced to 1 exactly at every zero; median and max away from zeros.
export const IMP96075_RESIDUAL_POINTS = [
  { label: 'at a zero (forced)', value: 1 - m.atZeroNormalizedErr, err: m.atZeroNormalizedErr },
  { label: 'between-zero median', value: m.midpointNormalizedMedian, err: null },
  { label: 'between-zero max', value: m.midpointNormalizedMax, err: null },
];

export const IMP96075_MELLIN_SUMMARY = Object.freeze({
  N: m.N,
  T: m.T,
  fracCaptured: m.fracCaptured,
  zerosBelowT: m.zerosBelowT,
  dN2OverBurnol: m.dN2OverC,
  oneOverLogN: m.oneOverLogN,
});

export const IMP96075_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every plotted value is copied verbatim from the rh-route-m-nyman-beurling-vasyunin-reciprocity module’s own NB_DISTANCE_LADDER and RECIPROCITY_STRUCTURAL_TEST.mellinResidual records; no bound is claimed and no operator positivity is established.';

// imp-96119: honest-status correction. Denser later sampling (imp-96094,
// N=250..2600; imp-96105, extended to N=6000) found the N=500 ratio=0.998
// figure above is a SAMPLING ARTIFACT, not genuine convergence: ratio(N)
// does not tighten toward 1 anywhere on N<=6000 -- it oscillates in a band
// [0.9639,1.0102] (~4.6 percent spread, six sign changes over the full
// ladder), and the very next rung N=750 is already 3.6 percent off. See
// imp-96094-route-m-burnol-ratio-dense-ladder.js / imp-96105-route-m-
// vasyunin-gram-extend-n6000.js for the full dense ladder and named
// beyond-N sub-gaps (the N~1e4 target is not yet reached; 6000 is the
// completable range so far).
export const IMP96075_LATER_DENSE_LADDER_NOTE =
  'Later denser sampling (imp-96094, dense ladder N=250..2600; imp-96105, extended to N=6000) found the N=500 ratio=0.998 figure above is a SAMPLING ARTIFACT, not convergence: ratio(N) does not tighten toward 1 anywhere on N<=6000 -- it oscillates in a band [0.9639,1.0102] (~4.6 percent spread, six sign changes), and the very next rung, N=750, is already 3.6 percent off. Extending the exact Vasyunin Gram to the N~1e4 target (from the completable N=6000 reached so far) remains the named open sub-gap.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96075_ASSERTIONS = [
  {
    id: 'imp96075-ladder-matches-source-verbatim',
    holds: () =>
      IMP96075_DN_LADDER.length === NB_DISTANCE_LADDER.rows.length &&
      IMP96075_DN_LADDER.every((row, i) => {
        const src = NB_DISTANCE_LADDER.rows[i];
        return row.N === src[0] && row.dN2 === src[1] && row.dN2LogN === src[2] && row.ratioToBurnol === src[3];
      }) &&
      IMP96075_BURNOL_CONSTANT === NB_DISTANCE_LADDER.C_burnol,
    why: 'every ladder row and the Burnol constant are copied field-for-field from NB_DISTANCE_LADDER, no re-derivation.',
  },
  {
    id: 'imp96075-ladder-ratio-converges-toward-one',
    holds: () => {
      const first = IMP96075_DN_LADDER[0];
      const last = IMP96075_DN_LADDER[IMP96075_DN_LADDER.length - 1];
      return first.N === 5 && first.ratioToBurnol > 1.2 && last.N === 500 && Math.abs(last.ratioToBurnol - 1) < 0.01;
    },
    why: 'the source module states the ladder converges from 1.258 (N=5) to 0.998 (N=500); the baked ratios reproduce that bracket.',
  },
  {
    id: 'imp96075-residual-forced-to-one-at-zeros',
    holds: () => {
      const atZero = IMP96075_RESIDUAL_POINTS[0];
      const median = IMP96075_RESIDUAL_POINTS[1];
      const max = IMP96075_RESIDUAL_POINTS[2];
      return Math.abs(atZero.value - 1) < 1e-9 && atZero.err < 1e-9 && median.value > 0 && median.value < max.value && max.value < 1;
    },
    why: '|1+zeta D_N|^2/(1/4+t^2) is forced to equal 1/|rho|^2 exactly at every zero (zeta(rho)=0); the median and max between zeros are strictly between 0 and 1 in the normalized units the source module reports.',
  },
  {
    id: 'imp96075-mellin-summary-matches-source-and-honest-banner-present',
    holds: () =>
      IMP96075_MELLIN_SUMMARY.N === m.N &&
      IMP96075_MELLIN_SUMMARY.fracCaptured === m.fracCaptured &&
      Math.abs(IMP96075_MELLIN_SUMMARY.dN2OverBurnol / IMP96075_MELLIN_SUMMARY.oneOverLogN - 1) < 0.003 &&
      /RH open/.test(IMP96075_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96075_HONEST_BANNER) &&
      /NO QED/.test(IMP96075_HONEST_BANNER) &&
      RH_ROUTE_M.verdict.key === 'M',
    why: 'the mellin summary fields are copied verbatim (dN2/Burnol matches 1/log N to 0.3%, as the source module states) and the honest banner carries the RH-open / PT-Lambda / NO-QED markers required of every Route A-M viz surface.',
  },
  {
    id: 'imp96119-later-dense-ladder-note-present',
    holds: () =>
      /imp-96094/.test(IMP96075_LATER_DENSE_LADDER_NOTE) &&
      /imp-96105/.test(IMP96075_LATER_DENSE_LADDER_NOTE) &&
      /sampling artifact/i.test(IMP96075_LATER_DENSE_LADDER_NOTE) &&
      /1e4/.test(IMP96075_LATER_DENSE_LADDER_NOTE),
    why: 'the N=500 apparent convergence to 0.998 shown by this ladder is later shown (imp-96094/imp-96105) to be a sampling artifact, not genuine convergence; the note must name both correcting tickets and the still-open N~1e4 sub-gap so this page cannot be misread in isolation.',
  },
];

for (const a of IMP96075_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96075-route-m-vasyunin-dn-ladder-viz-data assertion failed: ${a.id}`);
  }
}
