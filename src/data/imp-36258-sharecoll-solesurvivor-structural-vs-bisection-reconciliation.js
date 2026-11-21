/**
 * @module imp-36258-sharecoll-solesurvivor-structural-vs-bisection-reconciliation
 *
 * imp-36258 (accuracy, reconciliation): RECONCILE the two independent determinations of the
 * gap between the imp-36097 shareColl < 1% crossing (N_cross, the first N at which
 * E_coll / E(N) drops below 0.01) and the imp-35971 E_trunc sole-survivor height (N*, the
 * first N at which E_coll / E_trunc drops below 0.01):
 *
 *   (A) imp-36155 STRUCTURAL gap -- ratio N* / N_cross ~ 1.020980 (~2.098% in N,
 *       ~0.009017 decades), read from the two BAKED source literals (imp-36097 crossing,
 *       imp-35971 sole-survivor stored via toExponential(4)); the ordering N_cross < N* is
 *       argued structurally from E(N) = E_trunc + E_flow + E_coll > E_trunc, superseding the
 *       earlier imp-36165 loose "~0.9%" figure.
 *   (B) imp-36200 BISECTION-RESOLUTION gap -- both landmarks recomputed fresh from the pinned
 *       imp-3406 / imp-33582 sub-terms by bisecting log N at depths {20..800}: bit-stable from
 *       depth 40, ratio -> 1.02098618 (~2.09862% in N, ~0.00901986 decades), with a
 *       tolerance-independent structural floor delta log10 N ~ 2 log10(E(N*)/E_trunc).
 *
 * THE RECONCILIATION QUESTION. imp-36155 quoted an exact structural ratio 1.020980 from
 * 5-7-sig-fig source literals; imp-36200 stress-tested the SAME two landmarks under finer
 * bisection to check the separation is not a tabulation-precision artifact that could MERGE
 * them. These two figures were produced independently and never cross-checked against each
 * other. This module imports BOTH frozen results verbatim (no fresh numerics) and confirms:
 *   1. the two ratio determinations AGREE -- the imp-36155 baked-literal ratio 1.020980 and
 *      the imp-36200 full-precision bisection ratio 1.02098618 differ by only ~6.2e-6, and
 *      that residual is EXPLAINED: it is the imp-35971 toExponential(4) truncation of N*
 *      (4.7214e13 vs full-precision 4.721428669e13, ~6.07e-6 relative) propagating directly
 *      into the ratio (N_cross is a 7-sig-fig literal, ~9e-8 relative), so the imp-36155 gap
 *      sits a hair BELOW the imp-36200 limit exactly as its truncated N* literal predicts;
 *   2. the two log10-decade determinations AGREE (0.009017 vs 0.00901986, differ ~2.9e-6);
 *   3. both landmark HEIGHTS agree across the two determinations to the imp-36155 literals'
 *      stored precision (N_cross to ~7 sig figs, N* to its toExponential(4) precision);
 *   4. both determinations put N_cross STRICTLY BELOW N* (ratio > 1), and the imp-36200
 *      bit-stability (depths 40..800 identical) plus the positive structural floor
 *      (E(N*)/E_trunc > 1 strictly) rule out any resolution at which the landmarks merge.
 * VERDICT: the structural gap (A) and the bisection-resolution gap (B) are consistent; the
 * ~2.10% / ~0.0090-decade separation is confirmed real and NOT a tabulation-precision artifact.
 *
 * RECONCILIATION / MEASUREMENT ONLY. Imports the imp-36155 and imp-36200 frozen results
 * verbatim; recomputes no landmark; re-derives no sub-term model; derives no remainder;
 * discharges nothing; changes no bound; E_trunc = 3.06e-5 (imp-2631) and
 * C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643, GUE-conditional, imp-486) are UNTOUCHED;
 * imp-35337a stays OPEN; no RH verdict, NO QED; no refereed bound is changed.
 *
 * @see imp-36155-sharecoll-crossing-precedes-sole-survivor.js (the structural gap, determination A)
 * @see imp-36200-sharecoll-solesurvivor-bisection-resolution-sensitivity.js (the bisection gap, determination B)
 * @see imp-36097-e-share-threshold-crossings-viz-data.js (source of the shareColl < 1% crossing)
 * @see imp-35971-etrunc-sole-survivor-height.js (source of the sole-survivor height)
 *
 * Ticket: imp-36258 (accuracy, medium). Reconciliation only, RH-free; changes no bound; NO QED.
 */

import { IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR } from './imp-36155-sharecoll-crossing-precedes-sole-survivor.js';
import { IMP36200_SHARECOLL_SOLESURVIVOR_BISECTION_RESOLUTION_SENSITIVITY } from './imp-36200-sharecoll-solesurvivor-bisection-resolution-sensitivity.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any reconciliation here)

const STRUCT = IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR; // determination A (baked literals)
const BISECT = IMP36200_SHARECOLL_SOLESURVIVOR_BISECTION_RESOLUTION_SENSITIVITY; // determination B (bisection)

// Determination A: the imp-36155 structural gap (from baked source literals).
const A_ratio = STRUCT.gap.ratioStarOverCross; // ~ 1.020980 (toFixed(6) of the limit)
const A_log10Gap = STRUCT.gap.log10Gap; // ~ 0.009017 decades
const A_pctApart = STRUCT.gap.pctApart; // ~ 2.0980 %
const A_nCross = STRUCT.shareCollCrossing.N; // ~ 4.624381e13
const A_nStar = STRUCT.soleSurvivor.N; // ~ 4.7214e13 (imp-35971 toExponential(4))

// Determination B: the imp-36200 bisection-resolution converged gap (full precision).
const B_ratio = BISECT.convergence.ratioLimit; // ~ 1.02098618
const B_log10Gap = BISECT.convergence.log10GapLimit; // ~ 0.00901986 decades
const B_pctApart = BISECT.convergence.pctApartLimit; // ~ 2.09862 %
const B_nCross = BISECT.convergence.N_crossLimit; // ~ 4.624380576e13
const B_nStar = BISECT.convergence.N_starLimit; // ~ 4.721428669e13

// Cross-determination residuals (A minus B): all tiny, the rounding of A to B's limit.
const ratioResidual = Math.abs(A_ratio - B_ratio); // ~ 6.2e-6 (toFixed(6) rounding)
const log10GapResidual = Math.abs(A_log10Gap - B_log10Gap); // ~ 2.9e-6
const pctResidual = Math.abs(A_pctApart - B_pctApart); // ~ 6.2e-4
const nCrossRelResidual = Math.abs(A_nCross / B_nCross - 1); // ~ 9e-8 (7-sig-fig literal)
const nStarRelResidual = Math.abs(A_nStar / B_nStar - 1); // ~ 6.07e-6 (toExponential(4) literal)

// The A-vs-B ratio residual is (to first order) the imp-35971 N* truncation minus the tiny
// N_cross-literal residual: d(ratio)/ratio ~ d(N*)/N* - d(N_cross)/N_cross. This attributes
// the ~6.2e-6 ratio gap to the imp-35971 toExponential(4) N* literal, not to any real drift.
const ratioResidualPredictedFromLiterals = A_ratio * (nStarRelResidual - nCrossRelResidual); // ~ 6.1e-6
const ratioAttributionResidual = Math.abs(ratioResidual - ratioResidualPredictedFromLiterals); // ~ 8e-8

export const IMP36258_SHARECOLL_SOLESURVIVOR_STRUCTURAL_VS_BISECTION_RECONCILIATION = Object.freeze({
  id: 'imp-36258',
  proofSection: 'S-frontier',
  title:
    'Reconcile the imp-36155 structural gap (ratio ~1.020980 from baked literals) with the imp-36200 ' +
    'bisection-resolution gap (ratio ~1.02098618, bit-stable + structurally floored) for the SAME two ' +
    'landmarks: the two determinations agree to ~6e-6 and the ~2.10% separation is not a tabulation artifact',

  sourceModules: [
    'imp-36155-sharecoll-crossing-precedes-sole-survivor.js',
    'imp-36200-sharecoll-solesurvivor-bisection-resolution-sensitivity.js',
  ],

  // Determination A: imp-36155 structural gap (baked source literals, toFixed(6)).
  structuralDetermination: Object.freeze({
    source: 'imp-36155',
    basis: 'ratio N* / N_cross from the imp-36097 crossing and imp-35971 sole-survivor baked literals',
    ratioStarOverCross: A_ratio, // ~ 1.020980
    log10Gap: A_log10Gap, // ~ 0.009017 decades
    pctApart: A_pctApart, // ~ 2.0980 %
    N_cross: A_nCross, // ~ 4.624381e13
    N_star: A_nStar, // ~ 4.7214e13
    orderingStructural: STRUCT.orderingMechanism.holdsForAllTailN, // true
  }),

  // Determination B: imp-36200 bisection-resolution converged gap (full precision).
  bisectionDetermination: Object.freeze({
    source: 'imp-36200',
    basis: 'both landmarks recomputed by bisecting log N at depths {20..800} on the pinned imp-3406/imp-33582 sub-terms',
    ratioStarOverCross: B_ratio, // ~ 1.02098618
    log10Gap: B_log10Gap, // ~ 0.00901986 decades
    pctApart: B_pctApart, // ~ 2.09862 %
    N_cross: B_nCross, // ~ 4.624380576e13
    N_star: B_nStar, // ~ 4.721428669e13
    bitStableFromDepth: BISECT.convergence.stableFromDepth, // 40
    depths40to800BitIdentical: BISECT.convergence.depths40to800BitIdentical, // true
    structuralFloorDecades: BISECT.structuralFloor.minSeparationDecades, // ~ 0.008643 (tolerance-independent)
    landmarksMerge: BISECT.convergence.landmarksMerge, // false
  }),

  // The reconciliation: A-vs-B residuals (A is B rounded to toFixed(6); N* is B to toExponential(4)).
  reconciliation: Object.freeze({
    ratioResidual: +ratioResidual.toExponential(3), // ~ 6.2e-6
    log10GapResidual: +log10GapResidual.toExponential(3), // ~ 2.9e-6
    pctResidual: +pctResidual.toExponential(3), // ~ 6.2e-4
    nCrossRelResidual: +nCrossRelResidual.toExponential(3), // ~ 9e-8
    nStarRelResidual: +nStarRelResidual.toExponential(3), // ~ 6.07e-6
    ratioResidualPredictedFromLiterals: +ratioResidualPredictedFromLiterals.toExponential(3), // ~ 6.1e-6
    ratioAttributionResidual: +ratioAttributionResidual.toExponential(3), // ~ 8e-8 (residual fully explained by N* truncation)
    ratiosAgree: ratioResidual < 1e-4, // true
    log10GapsAgree: log10GapResidual < 1e-4, // true
    heightsAgree: nCrossRelResidual < 1e-4 && nStarRelResidual < 1e-4, // true
    bothPutCrossBelowStar: A_ratio > 1 && B_ratio > 1, // true (N_cross < N* under both)
    mergeRuledOut:
      BISECT.convergence.depths40to800BitIdentical === true &&
      BISECT.convergence.landmarksMerge === false &&
      BISECT.structuralFloor.minSeparationDecades > 0, // bit-stable + positive structural floor
    explanation:
      'The imp-36155 structural ratio 1.020980 sits a hair BELOW the imp-36200 full-precision bisection ' +
      'limit 1.02098618 -- a ~6.2e-6 residual that is fully EXPLAINED, not a real drift: imp-36155 reads ' +
      'N* from the imp-35971 toExponential(4) literal 4.7214e13, which truncates the full-precision ' +
      '4.721428669e13 by ~6.07e-6 relative, and that shortfall propagates directly into the ratio ' +
      '(N_cross is a 7-sig-fig literal, only ~9e-8 relative). The first-order attribution ' +
      'd(ratio)/ratio ~ d(N*)/N* - d(N_cross)/N_cross predicts a ~6.1e-6 ratio residual, matching the ' +
      'measured ~6.2e-6 to ~8e-8. So the two determinations agree to the imp-35971 tabulation precision, ' +
      'and finer bisection revises the gap only at the 1e-6 level -- four orders of magnitude below the ' +
      '~2.1e-2 gap itself. Since imp-36200 is bit-stable across depths 40..800 and floored below by a ' +
      'tolerance-independent delta log10 N ~ 2 log10(E(N*)/E_trunc) > 0 (positive because E(N) > E_trunc ' +
      'strictly), the ~2.10% / ~0.0090-decade separation cannot collapse at any resolution: the two ' +
      'landmarks do NOT merge and the gap is a real structural feature.',
  }),

  conclusion:
    'The two independent gap determinations for the imp-36097 shareColl < 1% crossing (N_cross) and the ' +
    'imp-35971 E_trunc sole-survivor height (N*) are consistent: imp-36155 read ratio N* / N_cross ~ ' +
    '1.020980 (~2.098% in N, ~0.009017 decades) from the baked source literals, and imp-36200 recomputed ' +
    'the SAME landmarks by bisection to ratio ~ 1.02098618 (~2.09862% in N, ~0.00901986 decades); the two ' +
    'agree to ~6.2e-6 in ratio, a residual fully attributable to the imp-35971 toExponential(4) N* literal ' +
    '(~6.07e-6 relative), four orders below the ~2.1e-2 gap. Both put the crossing ' +
    'strictly below the sole-survivor, and imp-36200 bit-stability (depths 40..800 identical) plus a ' +
    'positive tolerance-independent structural floor (E(N*)/E_trunc > 1 strictly) rule out any resolution ' +
    'at which the landmarks merge. The ~2.10% / ~0.0090-decade separation is confirmed a real structural ' +
    'feature, NOT a tabulation-precision artifact.',

  honestCaveat: Object.freeze({
    isProof: false,
    isRigorous: false,
    isUnconditional: false,
    derivesRemainder: false,
    dischargesAnything: false,
    changesAnyBound: false,
    L_PT,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'RECONCILIATION (NOT rigorous). The imp-36155 structural gap (ratio ~1.020980 from baked source ' +
    'literals) and the imp-36200 bisection-resolution gap (ratio ~1.02098618, bit-stable from depth 40 ' +
    'to depth 800 and floored by a tolerance-independent delta log10 N ~ 2 log10(E(N*)/E_trunc) > 0) ' +
    'agree to ~6.2e-6 in ratio and ~2.9e-6 in log10 decades for the SAME two landmarks, the residual fully ' +
    'attributable to the imp-35971 toExponential(4) N* literal (~6.07e-6 relative). Both put the shareColl < 1% crossing strictly below the ' +
    'E_trunc sole-survivor height, and merging is ruled out at every resolution. The ~2.10% / ~0.0090-' +
    'decade separation is a real structural feature, not a tabulation-precision artifact. Imports both ' +
    'frozen results verbatim; recomputes no landmark; re-derives no sub-term; derives no remainder; ' +
    'discharges nothing; changes no bound; E_trunc = 3.06e-5 (imp-2631) and C_C = (1/8) sqrt(3 pi) ' +
    '(imp-2642 / imp-2643, GUE-conditional, imp-486) are UNTOUCHED; imp-35337a stays OPEN; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
});

export const IMP36258_SHARECOLL_SOLESURVIVOR_STRUCTURAL_VS_BISECTION_RECONCILIATION_ASSERTIONS = [
  {
    id: 'imp36258-ratios-agree',
    why: 'The imp-36155 baked-literal ratio (~1.020980) and the imp-36200 bisection limit (~1.02098618) must agree to ~1e-4.',
    holds: () => {
      const r = IMP36258_SHARECOLL_SOLESURVIVOR_STRUCTURAL_VS_BISECTION_RECONCILIATION.reconciliation;
      return r.ratiosAgree === true && r.ratioResidual < 1e-4;
    },
  },
  {
    id: 'imp36258-log10-gaps-agree',
    why: 'The two log10-decade determinations (~0.009017 vs ~0.00901986) must agree to ~1e-4.',
    holds: () => {
      const r = IMP36258_SHARECOLL_SOLESURVIVOR_STRUCTURAL_VS_BISECTION_RECONCILIATION.reconciliation;
      return r.log10GapsAgree === true && r.log10GapResidual < 1e-4;
    },
  },
  {
    id: 'imp36258-heights-agree',
    why: 'Both landmark heights must agree across the two determinations to the imp-36155 literals stored precision.',
    holds: () => {
      const r = IMP36258_SHARECOLL_SOLESURVIVOR_STRUCTURAL_VS_BISECTION_RECONCILIATION.reconciliation;
      return r.heightsAgree === true && r.nCrossRelResidual < 1e-4 && r.nStarRelResidual < 1e-4;
    },
  },
  {
    id: 'imp36258-both-put-cross-below-star',
    why: 'Both determinations must put the shareColl < 1% crossing strictly below the sole-survivor (ratio > 1).',
    holds: () => {
      const rec = IMP36258_SHARECOLL_SOLESURVIVOR_STRUCTURAL_VS_BISECTION_RECONCILIATION;
      return (
        rec.reconciliation.bothPutCrossBelowStar === true &&
        rec.structuralDetermination.ratioStarOverCross > 1 &&
        rec.bisectionDetermination.ratioStarOverCross > 1
      );
    },
  },
  {
    id: 'imp36258-merge-ruled-out',
    why: 'The imp-36200 bit-stability (depths 40..800) plus a positive structural floor must rule out any merge.',
    holds: () => {
      const rec = IMP36258_SHARECOLL_SOLESURVIVOR_STRUCTURAL_VS_BISECTION_RECONCILIATION;
      return (
        rec.reconciliation.mergeRuledOut === true &&
        rec.bisectionDetermination.depths40to800BitIdentical === true &&
        rec.bisectionDetermination.landmarksMerge === false &&
        rec.bisectionDetermination.structuralFloorDecades > 0
      );
    },
  },
  {
    id: 'imp36258-ratio-residual-explained-by-nstar-truncation',
    why: 'The ~6.2e-6 A-vs-B ratio residual must be first-order explained by the imp-35971 toExponential(4) N* literal truncation (not a real drift).',
    holds: () => {
      const r = IMP36258_SHARECOLL_SOLESURVIVOR_STRUCTURAL_VS_BISECTION_RECONCILIATION.reconciliation;
      return (
        r.ratioAttributionResidual < 5e-7 &&
        r.ratioResidual < 1e-5 &&
        r.nStarRelResidual > r.nCrossRelResidual
      );
    },
  },
  {
    id: 'imp36258-imp36155-below-imp36200-limit',
    why: 'The imp-36155 baked ratio must sit at or below the imp-36200 full-precision limit (its N* literal is truncated downward).',
    holds: () => {
      const rec = IMP36258_SHARECOLL_SOLESURVIVOR_STRUCTURAL_VS_BISECTION_RECONCILIATION;
      return (
        rec.structuralDetermination.ratioStarOverCross <= rec.bisectionDetermination.ratioStarOverCross &&
        rec.structuralDetermination.N_star <= rec.bisectionDetermination.N_star
      );
    },
  },
  {
    id: 'imp36258-honesty-gate',
    why: 'Reconciliation only: must not claim a proof, rigor, unconditionality, or a bound change; no refereed bound is changed.',
    holds: () =>
      IMP36258_SHARECOLL_SOLESURVIVOR_STRUCTURAL_VS_BISECTION_RECONCILIATION.honestCaveat.isProof === false &&
      IMP36258_SHARECOLL_SOLESURVIVOR_STRUCTURAL_VS_BISECTION_RECONCILIATION.honestCaveat.isRigorous === false &&
      IMP36258_SHARECOLL_SOLESURVIVOR_STRUCTURAL_VS_BISECTION_RECONCILIATION.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36258_SHARECOLL_SOLESURVIVOR_STRUCTURAL_VS_BISECTION_RECONCILIATION.honestCaveat.sota),
  },
  {
    id: 'imp36258-verdict-no-qed',
    why: 'The verdict must record NO QED and the standing no-refereed-bound-change caveat.',
    holds: () =>
      /NO QED/.test(IMP36258_SHARECOLL_SOLESURVIVOR_STRUCTURAL_VS_BISECTION_RECONCILIATION.verdict) &&
      /refereed bound is changed/i.test(IMP36258_SHARECOLL_SOLESURVIVOR_STRUCTURAL_VS_BISECTION_RECONCILIATION.verdict),
  },
];

for (const assertion of IMP36258_SHARECOLL_SOLESURVIVOR_STRUCTURAL_VS_BISECTION_RECONCILIATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36258-sharecoll-solesurvivor-structural-vs-bisection-reconciliation assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36258_SHARECOLL_SOLESURVIVOR_STRUCTURAL_VS_BISECTION_RECONCILIATION;
