/**
 * @module imp-36165-sharecoll-vs-sole-survivor-honest-status
 * @fileoverview imp-36165 -- standalone HONEST-STATUS note (imp-36028/imp-35983-style banner
 *   pattern) clarifying that the imp-36097 shareColl < 1% crossing height (N ~ 4.624381e13,
 *   log10 N ~ 13.6651) sits STRICTLY BELOW, not AT, the imp-35971 E_trunc sole-survivor height
 *   (N* ~ 4.7214e13, log10 N* ~ 13.674) -- the two landmarks are close (~0.9% apart in N, ~0.0089
 *   decades in log10 N) but distinct, and the imp-36097 module text itself hedges with
 *   "essentially AT" / "to within the tabulation", which this note replaces with the exact
 *   ordering and gap so a reader does not mistake proximity for coincidence.
 *
 *   Read-only note: imports both source modules verbatim (no re-derivation, no new numerics)
 *   and restates the ordering plainly for a reader who lands on either ticket without having
 *   read both in full.
 *
 *   Ticket: imp-36165 (content, low). Note only; re-derives nothing new; discharges nothing;
 *   changes no bound; E_trunc = 3.06e-5 (imp-2631) and C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643)
 *   are UNTOUCHED; no refereed bound is changed; NO QED.
 *
 * @see imp-36097-e-share-threshold-crossings-viz-data.js (source of the shareColl < 1% crossing)
 * @see imp-35971-etrunc-sole-survivor-height.js (source of the sole-survivor height)
 * @see imp-36028-etrunc-sole-survivor-honest-status.js (the banner pattern this note follows)
 */

import { IMP36097_E_SHARE_THRESHOLD_CROSSINGS } from './imp-36097-e-share-threshold-crossings-viz-data.js';
import { IMP35971_ETRUNC_SOLE_SURVIVOR_HEIGHT } from './imp-35971-etrunc-sole-survivor-height.js';

const SHARE_COLL_CROSSING = IMP36097_E_SHARE_THRESHOLD_CROSSINGS.find(
  (c) => c.label === 'shareColl<1pct',
);
const SOLE_SURVIVOR = IMP35971_ETRUNC_SOLE_SURVIVOR_HEIGHT.soleSurvivor;

const N_CROSSING = SHARE_COLL_CROSSING.N;
const N_STAR = SOLE_SURVIVOR.N;
const RATIO_STAR_OVER_CROSSING = N_STAR / N_CROSSING;
const LOG10_GAP = SOLE_SURVIVOR.log10N - SHARE_COLL_CROSSING.log10_N;

export const IMP36165_SHARECOLL_VS_SOLE_SURVIVOR_HONEST_STATUS = Object.freeze({
  id: 'imp-36165',
  proofSection: 'S-frontier',
  title:
    'Honest-status note: the imp-36097 shareColl < 1% crossing (N ~ 4.624381e13) sits strictly ' +
    'BELOW, not AT, the imp-35971 E_trunc sole-survivor height (N* ~ 4.7214e13)',
  sourceModules: [
    'imp-36097-e-share-threshold-crossings-viz-data.js',
    'imp-35971-etrunc-sole-survivor-height.js',
  ],

  shareCollCrossing: Object.freeze({
    N: N_CROSSING,
    log10_N: SHARE_COLL_CROSSING.log10_N,
    shareColl: SHARE_COLL_CROSSING.shareColl,
  }),
  soleSurvivor: Object.freeze({
    N: N_STAR,
    log10N: SOLE_SURVIVOR.log10N,
    ratioCollOverTrunc: SOLE_SURVIVOR.ratioCollOverTrunc,
  }),
  gap: Object.freeze({
    ratioStarOverCrossing: +RATIO_STAR_OVER_CROSSING.toFixed(6), // ~1.021
    log10Gap: +LOG10_GAP.toFixed(4), // ~0.0089 decades
    crossingStrictlyBelowStar: N_CROSSING < N_STAR,
  }),

  conclusion:
    'The imp-36097 shareColl < 1% crossing is located at N ~ 4.624381e13 (log10 N ~ 13.6651), ' +
    'where shareColl equals exactly 1% by construction (it is the bisected root of that ' +
    'threshold). The imp-35971 sole-survivor height N* ~ 4.7214e13 (log10 N* ~ 13.674) is a ' +
    'DIFFERENT threshold -- the first height at which shareColl is strictly BELOW 1% (there ' +
    'shareColl ~ 0.99%, i.e. E_coll / E_trunc = 1.0000e-2 to the tabulated precision but the ' +
    'height itself is bisected on the "both terms below 1%" condition, not on the shareColl ' +
    'crossing alone). These are two distinct thresholds that happen to sit close together: N* is ' +
    'about 1.021x the crossing height (~0.0089 decades higher in log10 N, i.e. ~0.9% apart in N). ' +
    'The imp-36097 module text hedges this as "essentially AT ... to within the tabulation"; this ' +
    'note replaces that hedge with the exact ordering: the shareColl < 1% crossing height is ' +
    'STRICTLY BELOW the sole-survivor height, not identical to it, and the two should not be cited ' +
    'interchangeably as the same landmark.',

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
    'HONEST-STATUS note only: the imp-36097 shareColl < 1% crossing (N ~ 4.624381e13) and the ' +
    'imp-35971 E_trunc sole-survivor height (N* ~ 4.7214e13) are two distinct thresholds that sit ' +
    'close together (N* / N_crossing ~ 1.021, ~0.0089 decades apart) but the crossing height is ' +
    'STRICTLY BELOW the sole-survivor height, never AT it. Reuses both source modules verbatim; ' +
    'derives no remainder; discharges nothing; changes no bound; E_trunc = 3.06e-5 (imp-2631) and ' +
    'C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643) are UNTOUCHED; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
});

export const IMP36165_SHARECOLL_VS_SOLE_SURVIVOR_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36165-crossing-matches-source',
    why: 'The recorded shareColl < 1% crossing must match the imp-36097 source literal (N ~ 4.624381e13).',
    holds: () =>
      Math.abs(IMP36165_SHARECOLL_VS_SOLE_SURVIVOR_HONEST_STATUS.shareCollCrossing.N / 4.624381e13 - 1) < 1e-3,
  },
  {
    id: 'imp36165-sole-survivor-matches-source',
    why: 'The recorded sole-survivor height must match the imp-35971 source literal (N* ~ 4.7214e13).',
    holds: () =>
      Math.abs(IMP36165_SHARECOLL_VS_SOLE_SURVIVOR_HONEST_STATUS.soleSurvivor.N / 4.7214e13 - 1) < 1e-3,
  },
  {
    id: 'imp36165-crossing-strictly-below-sole-survivor',
    why: 'The core honest-status claim: the shareColl < 1% crossing must be strictly less than the sole-survivor height, not equal to it.',
    holds: () =>
      IMP36165_SHARECOLL_VS_SOLE_SURVIVOR_HONEST_STATUS.gap.crossingStrictlyBelowStar === true &&
      IMP36165_SHARECOLL_VS_SOLE_SURVIVOR_HONEST_STATUS.shareCollCrossing.N <
        IMP36165_SHARECOLL_VS_SOLE_SURVIVOR_HONEST_STATUS.soleSurvivor.N,
  },
  {
    id: 'imp36165-gap-is-small-but-nonzero',
    why: 'The two landmarks sit close together (~2% ratio) but the gap must be strictly positive, confirming proximity without coincidence.',
    holds: () => {
      const g = IMP36165_SHARECOLL_VS_SOLE_SURVIVOR_HONEST_STATUS.gap;
      return g.ratioStarOverCrossing > 1 && g.ratioStarOverCrossing < 1.05 && g.log10Gap > 0 && g.log10Gap < 0.05;
    },
  },
  {
    id: 'imp36165-conclusion-states-strictly-below',
    why: 'The conclusion text must plainly state the crossing is strictly below the sole-survivor height, not AT it.',
    holds: () =>
      /STRICTLY BELOW/.test(IMP36165_SHARECOLL_VS_SOLE_SURVIVOR_HONEST_STATUS.conclusion) &&
      /DIFFERENT threshold/.test(IMP36165_SHARECOLL_VS_SOLE_SURVIVOR_HONEST_STATUS.conclusion),
  },
  {
    id: 'imp36165-honesty-gate',
    why: 'This is a read-only cross-reference note: it must not claim a proof, rigor, unconditionality, or a bound change.',
    holds: () =>
      IMP36165_SHARECOLL_VS_SOLE_SURVIVOR_HONEST_STATUS.honestCaveat.isProof === false &&
      IMP36165_SHARECOLL_VS_SOLE_SURVIVOR_HONEST_STATUS.honestCaveat.isRigorous === false &&
      IMP36165_SHARECOLL_VS_SOLE_SURVIVOR_HONEST_STATUS.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36165_SHARECOLL_VS_SOLE_SURVIVOR_HONEST_STATUS.honestCaveat.sota),
  },
  {
    id: 'imp36165-verdict-no-qed',
    why: 'The verdict must record NO QED, matching the standing no-refereed-bound-change caveat.',
    holds: () => /NO QED/.test(IMP36165_SHARECOLL_VS_SOLE_SURVIVOR_HONEST_STATUS.verdict),
  },
];

for (const assertion of IMP36165_SHARECOLL_VS_SOLE_SURVIVOR_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36165-sharecoll-vs-sole-survivor-honest-status assertion failed: ${assertion.id}`);
  }
}

export default IMP36165_SHARECOLL_VS_SOLE_SURVIVOR_HONEST_STATUS;
