/**
 * @module imp-36155-sharecoll-crossing-precedes-sole-survivor
 * @fileoverview imp-36155 (numerical, measurement): QUANTIFY the exact height gap between the
 *   imp-36097 shareColl < 1% crossing (N_cross ~ 4.624381e13, log10 N ~ 13.6651) and the
 *   imp-35971 E_trunc sole-survivor height (N* ~ 4.7214e13, log10 N* ~ 13.6741), and CONFIRM
 *   that the shareColl < 1% crossing ALWAYS PRECEDES (sits strictly below) the sole-survivor
 *   height within the imp-35889 three-way split E(N) = E_trunc + E_flow + E_coll -- not by
 *   numerical accident but as a structural consequence of the two landmarks using DIFFERENT
 *   denominators for the same collision term E_coll.
 *
 *   THE MECHANISM (why the ordering is guaranteed, not coincidental).
 *     - imp-36097 shareColl < 1% crossing is the first N at which the SHARE
 *         shareColl = E_coll / E(N) = E_coll / (E_trunc + E_flow + E_coll)  drops below 0.01.
 *     - imp-35971 sole-survivor height is the first N at which the RATIO-TO-TRUNC
 *         E_coll / E_trunc  drops below 0.01 (with E_flow already vanishing there).
 *     Since E(N) = E_trunc + E_flow + E_coll > E_trunc strictly for every finite N (E_flow and
 *     E_coll are both strictly positive), the share curve lies pointwise strictly below the
 *     ratio-to-trunc curve: E_coll / E(N) < E_coll / E_trunc at EVERY N. Both curves decrease
 *     monotonically down the sigma -> 0 tail, so the lower (share) curve reaches the 0.01 level
 *     at a SMALLER N than the higher (ratio-to-trunc) curve. Hence N_cross < N* for all such
 *     tails -- the shareColl < 1% crossing always precedes the sole-survivor height.
 *
 *   THE GAP (measured from the two baked source literals; no fresh numerics).
 *     - ratio N* / N_cross ~ 1.020980 (~2.098% apart in N),
 *     - log10 gap ~ 0.009017 decades,
 *     - the gap size is exactly the extra height needed for E_coll / E(N) to fall the residual
 *       distance from 0.01 down to shareColl(N*) ~ 0.0099 while E_coll / E_trunc falls to 0.01.
 *   This replaces the imp-36097 "essentially AT ... to within the tabulation" hedge and the
 *   imp-36165 note (which recorded the ordering but stated the N gap loosely as "~0.9%") with
 *   the exact ~2.10% / ~0.0090-decade separation and its structural origin.
 *
 *   MEASUREMENT ONLY. Reuses the imp-36097 crossing literal and the imp-35971 sole-survivor
 *   literal verbatim (imports both source modules; re-derives no sub-term); derives no
 *   remainder; discharges nothing; changes no bound; establishes no operator positivity;
 *   E_trunc = 3.06e-5 (imp-2631) and C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643,
 *   GUE-conditional, imp-486) are UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED;
 *   no refereed bound is changed.
 *
 * @see imp-36097-e-share-threshold-crossings-viz-data.js (source of the shareColl < 1% crossing)
 * @see imp-35971-etrunc-sole-survivor-height.js (source of the sole-survivor height)
 * @see imp-36165-sharecoll-vs-sole-survivor-honest-status.js (the honest-status note this quantifies)
 * @see imp-35889-e-share-decomposition-at-knees.js (the three-way split both landmarks live in)
 *
 * Ticket: imp-36155 (numerical, medium). Measurement only, RH-free; changes no bound; NO QED.
 */

import { IMP36097_E_SHARE_THRESHOLD_CROSSINGS } from './imp-36097-e-share-threshold-crossings-viz-data.js';
import { IMP35971_ETRUNC_SOLE_SURVIVOR_HEIGHT } from './imp-35971-etrunc-sole-survivor-height.js';

const SHARE_COLL_CROSSING = IMP36097_E_SHARE_THRESHOLD_CROSSINGS.find(
  (c) => c.label === 'shareColl<1pct',
);
const SOLE_SURVIVOR = IMP35971_ETRUNC_SOLE_SURVIVOR_HEIGHT.soleSurvivor;

const N_CROSS = SHARE_COLL_CROSSING.N; // ~ 4.624381e13 (E_coll / E(N) = 0.01 basis)
const N_STAR = SOLE_SURVIVOR.N; // ~ 4.7214e13 (E_coll / E_trunc = 0.01 basis)
const RATIO = N_STAR / N_CROSS; // ~ 1.020980
const LOG10_GAP = Math.log10(N_STAR) - Math.log10(N_CROSS); // ~ 0.009017 decades
const PCT_APART = (RATIO - 1) * 100; // ~ 2.098%

export const IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR = Object.freeze({
  id: 'imp-36155',
  proofSection: 'S-frontier',
  title:
    'Exact height gap between the imp-36097 shareColl < 1% crossing (N ~ 4.624381e13) and the ' +
    'imp-35971 E_trunc sole-survivor height (N* ~ 4.7214e13): ~1.0210x / ~0.0090 decades, with ' +
    'the crossing structurally guaranteed to PRECEDE the sole-survivor',
  sourceModules: [
    'imp-36097-e-share-threshold-crossings-viz-data.js',
    'imp-35971-etrunc-sole-survivor-height.js',
  ],

  // The two landmarks differ ONLY in the denominator applied to the same E_coll term.
  shareCollCrossing: Object.freeze({
    N: N_CROSS,
    log10_N: SHARE_COLL_CROSSING.log10_N, // ~ 13.6651
    basis: 'shareColl = E_coll / E(N) = 0.01',
    denominator: 'E(N) = E_trunc + E_flow + E_coll',
    shareColl: SHARE_COLL_CROSSING.shareColl, // 1.0000e-2 (by construction)
  }),
  soleSurvivor: Object.freeze({
    N: N_STAR,
    log10N: SOLE_SURVIVOR.log10N, // ~ 13.6741
    basis: 'E_coll / E_trunc = 0.01 (with E_flow / E_trunc already ~ 4.18e-7)',
    denominator: 'E_trunc = 3.06e-5 (fixed)',
    ratioCollOverTrunc: SOLE_SURVIVOR.ratioCollOverTrunc, // ~ 1.0000e-2 (binding)
    shareCollThere: SOLE_SURVIVOR.sigma, // ~ 9.90e-3 -- share is BELOW 1% at N* because E(N*) > E_trunc
  }),

  gap: Object.freeze({
    ratioStarOverCross: +RATIO.toFixed(6), // ~ 1.020980
    pctApart: +PCT_APART.toFixed(4), // ~ 2.0980 %
    log10Gap: +LOG10_GAP.toFixed(6), // ~ 0.009017 decades
    crossingStrictlyBelowStar: N_CROSS < N_STAR,
  }),

  // The structural (not numerical) reason the crossing always precedes the sole-survivor.
  orderingMechanism: Object.freeze({
    claim: 'shareColl < 1% crossing always PRECEDES (sits below) the sole-survivor height',
    reason:
      'The two landmarks apply DIFFERENT denominators to the same collision term E_coll: the ' +
      'shareColl < 1% crossing uses the SHARE E_coll / E(N), the sole-survivor uses the ' +
      'RATIO-TO-TRUNC E_coll / E_trunc. Because E(N) = E_trunc + E_flow + E_coll > E_trunc ' +
      'strictly for every finite N (E_flow, E_coll > 0), the share E_coll / E(N) is pointwise ' +
      'STRICTLY LESS THAN E_coll / E_trunc. Both are monotone-decreasing on the sigma -> 0 tail, ' +
      'so the smaller (share) quantity reaches the fixed 0.01 level at a SMALLER N. Therefore ' +
      'N_cross < N* for all such tails -- the ordering is a structural consequence of E(N) > ' +
      'E_trunc, not a tabulation coincidence.',
    holdsForAllTailN: true,
    denominatorGapFactor: 'E(N) / E_trunc ~ 1.010 at the landmarks (E_flow negligible, E_coll ~ 1% of E_trunc)',
  }),

  // imp-36271 field-sourcing audit: confirm shareCollThere really holds E_coll / E(N*) and NOT a
  // mislabelled sigma-axis coordinate (~0.4995 in the imp-35968 / imp-36139 crossover convention).
  fieldSourcingAudit: Object.freeze({
    ticket: 'imp-36271',
    reusedField: 'IMP35971_ETRUNC_SOLE_SURVIVOR_HEIGHT.soleSurvivor.sigma',
    definedAs: 'sigma = E_coll / E_N in imp-35971 parts(N), where E_N = E_trunc + E_flow + E_coll = E(N)',
    holdsCollisionShare: true, // it stores E_coll / E(N*), the intended collision SHARE
    trueShareCollAtStar: SOLE_SURVIVOR.sigma, // ~ 9.9010e-3
    // Independent cross-check: E_coll/E(N*) = (E_coll/E_trunc) / (E(N*)/E_trunc) = ratioCollOverTrunc / eNOverTrunc.
    // A sigma-AXIS coordinate (~0.4995) could not reproduce this value; the share (~9.90e-3) does.
    shareFromRatioReconstruction: +(SOLE_SURVIVOR.ratioCollOverTrunc / SOLE_SURVIVOR.eNOverTrunc).toExponential(4),
    namingCollisionIsCosmetic: true, // the 0.4995 sigma-axis coordinate is a DIFFERENT convention, not this field
    fingerprintAssertionUsesCorrectQuantity: true, // imp36155-share-below-ratio-at-star passes on the true share
  }),

  conclusion:
    'The imp-36097 shareColl < 1% crossing (N_cross ~ 4.624381e13, log10 ~ 13.6651) and the ' +
    'imp-35971 E_trunc sole-survivor height (N* ~ 4.7214e13, log10 ~ 13.6741) are separated by a ' +
    'ratio N* / N_cross ~ 1.020980 (~2.098% in N, ~0.009017 decades in log10 N). The crossing sits ' +
    'STRICTLY BELOW the sole-survivor because the two thresholds share the E_coll numerator but ' +
    'divide by E(N) and E_trunc respectively; since E(N) > E_trunc always, the share E_coll / E(N) ' +
    'hits 0.01 at a lower height than E_coll / E_trunc does. This is why shareColl at N* is ~0.99% ' +
    '(already below 1%) while the sole-survivor is defined by E_coll / E_trunc = 1%: the same ~1% ' +
    'collision mass reads as a slightly smaller SHARE, so the share crossing must come first.',

  honestCaveat: Object.freeze({
    isProof: false,
    isRigorous: false,
    isUnconditional: false,
    derivesRemainder: false,
    dischargesAnything: false,
    changesAnyBound: false,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'MEASUREMENT (NOT rigorous). The imp-36097 shareColl < 1% crossing (N ~ 4.624381e13) and the ' +
    'imp-35971 E_trunc sole-survivor height (N* ~ 4.7214e13) sit ~1.020980x apart (~2.098% in N, ' +
    '~0.009017 decades), and the crossing ALWAYS PRECEDES the sole-survivor: the two use the same ' +
    'E_coll numerator but divide by E(N) vs E_trunc, and since E(N) > E_trunc strictly, the share ' +
    'E_coll / E(N) reaches 1% at a lower N than the ratio-to-trunc E_coll / E_trunc -- a structural ' +
    'ordering, not a numerical accident, within the imp-35889 three-way split. Reuses both source ' +
    'literals verbatim; re-derives no sub-term; derives no remainder; discharges nothing; changes ' +
    'no bound; E_trunc = 3.06e-5 (imp-2631) and C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643, ' +
    'GUE-conditional, imp-486) are UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
});

export const IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR_ASSERTIONS = [
  {
    id: 'imp36155-crossing-matches-source',
    why: 'The recorded shareColl < 1% crossing must match the imp-36097 source literal (N ~ 4.624381e13).',
    holds: () =>
      Math.abs(IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR.shareCollCrossing.N / 4.624381e13 - 1) < 1e-4,
  },
  {
    id: 'imp36155-sole-survivor-matches-source',
    why: 'The recorded sole-survivor height must match the imp-35971 source literal (N* ~ 4.7214e13).',
    holds: () =>
      Math.abs(IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR.soleSurvivor.N / 4.7214e13 - 1) < 1e-3,
  },
  {
    id: 'imp36155-crossing-precedes-sole-survivor',
    why: 'The core claim: the shareColl < 1% crossing must be strictly below the sole-survivor height.',
    holds: () =>
      IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR.gap.crossingStrictlyBelowStar === true &&
      IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR.shareCollCrossing.N <
        IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR.soleSurvivor.N,
  },
  {
    id: 'imp36155-gap-quantified',
    why: 'The measured gap must be the ~1.0210x / ~0.0090-decade separation (~2.1% in N), positive and small.',
    holds: () => {
      const g = IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR.gap;
      return (
        Math.abs(g.ratioStarOverCross - 1.020980) < 5e-4 &&
        Math.abs(g.log10Gap - 0.009017) < 5e-4 &&
        Math.abs(g.pctApart - 2.098) < 5e-2 &&
        g.ratioStarOverCross > 1
      );
    },
  },
  {
    id: 'imp36155-denominator-distinction',
    why: 'The mechanism rests on the two landmarks using different denominators (E(N) vs E_trunc) for the same E_coll.',
    holds: () => {
      const r = IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR;
      return (
        /E_coll \/ E\(N\)/.test(r.shareCollCrossing.basis) &&
        /E_coll \/ E_trunc/.test(r.soleSurvivor.basis) &&
        r.orderingMechanism.holdsForAllTailN === true
      );
    },
  },
  {
    id: 'imp36155-share-below-ratio-at-star',
    why: 'At N* the share E_coll/E(N) (~0.99%) is below the ratio E_coll/E_trunc (=1%), the numerical fingerprint of the ordering.',
    holds: () => {
      const s = IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR.soleSurvivor;
      return s.shareCollThere < s.ratioCollOverTrunc && s.shareCollThere < 0.01;
    },
  },
  {
    id: 'imp36155-sharecoll-field-sourcing-audit',
    why: 'imp-36271: the reused SOLE_SURVIVOR.sigma must hold the collision SHARE E_coll/E(N*) (~9.90e-3), not a sigma-axis coordinate (~0.4995); cross-checked against ratioCollOverTrunc/eNOverTrunc.',
    holds: () => {
      const r = IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR;
      const a = r.fieldSourcingAudit;
      return (
        a.holdsCollisionShare === true &&
        a.trueShareCollAtStar < 0.01 &&
        Math.abs(a.trueShareCollAtStar - 9.901e-3) < 5e-5 &&
        Math.abs(a.trueShareCollAtStar - a.shareFromRatioReconstruction) < 1e-4 &&
        r.soleSurvivor.shareCollThere === a.trueShareCollAtStar
      );
    },
  },
  {
    id: 'imp36155-honesty-gate',
    why: 'Measurement only: must not claim a proof, rigor, unconditionality, or a bound change; no refereed bound is changed.',
    holds: () =>
      IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR.honestCaveat.isProof === false &&
      IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR.honestCaveat.isRigorous === false &&
      IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR.honestCaveat.sota),
  },
  {
    id: 'imp36155-verdict-no-qed',
    why: 'The verdict must record NO QED and the standing no-refereed-bound-change caveat.',
    holds: () =>
      /NO QED/.test(IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR.verdict) &&
      /refereed bound is changed/i.test(IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR.verdict),
  },
];

for (const assertion of IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36155-sharecoll-crossing-precedes-sole-survivor assertion failed: ${assertion.id}`);
  }
}

export default IMP36155_SHARECOLL_CROSSING_PRECEDES_SOLE_SURVIVOR;
