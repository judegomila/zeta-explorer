/**
 * @module imp-96913-route-m-ceiling-joint-p-ci-band
 *
 * imp-96913 (accuracy, SENSITIVITY ONLY): propagate the imp-96833 +/- 2 sigma lam_min-exponent
 * p-band JOINTLY with the imp-96656 95% confidence interval onto the composed Route M
 * conditioning ceiling M (~ 4.109e7), and test whether the two uncertainty sources TOGETHER
 * keep the strict T < F < M ordering with NON-OVERLAPPING bands. NO bound moved; NO QED.
 *
 * THE ISSUE. Two independent uncertainty analyses touched the Route M ceiling ladder but were
 * never combined:
 *   (1) imp-96833 banded the SINGLE shared lam_min exponent p (SE(p) = 0.00243) through the
 *       ceiling elasticity d(log N)/dp = -(log N)/(p+b) and reported a +/- 2 sigma p-band on all
 *       three ceilings T [2.484e7, 2.708e7], F [3.633e7, 3.899e7], M [3.958e7, 4.266e7], finding
 *       the bands NON-OVERLAPPING (T_hi < F_lo < F_hi < M_lo) -- but the F/M gap was thin
 *       (F_hi = 3.899e7 vs M_lo = 3.958e7, only ~1.5%).
 *   (2) imp-96656 propagated the log-log OLS fit-parameter standard errors through the ceiling
 *       map N* = (1/(eps C))^(1/q) to give the measured/fit composed ceiling a 95% CI
 *       (all-rung 95% CI [3.50e7, 4.07e7], sigma_ln = 0.02363; dense 95% CI [2.76e7, 6.69e7],
 *       sigma_ln = 0.10303).
 * These are DIFFERENT uncertainty sources (lam_min slope p vs cond#-fit sampling), reported on
 * overlapping objects, and never propagated jointly onto M.
 *
 * WHAT WAS DONE (tmp/imp-96913-scratch.mjs, reproducible; pure re-analysis, no Gram rebuilt).
 * Both siblings are import-light, so this module imports their baked bands directly and combines
 * them in LOG space. The p-band contributes a 1-sigma log-width sigma_p(ln M) =
 * |d(log M)/dp| * SE(p) = 7.7211 * 0.0024274 = 0.018742; the imp-96656 CI contributes
 * sigma_CI(ln M) = seLnCeiling (0.02363 all-rung / 0.10303 dense). Treating the two sources as
 * INDEPENDENT, the joint log-width is sigma_joint = sqrt(sigma_p^2 + sigma_CI^2), and the joint
 * +/- 2 sigma band on the central composed ceiling M = 4.1089e7 is
 * M * exp(+/- 2 sigma_joint):
 *     joint (all-rung CI):  sigma_joint = 0.03016,  M in [3.868e7, 4.364e7]
 *     joint (dense CI):     sigma_joint = 0.10473,  M in [3.332e7, 5.066e7]
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- T < F separation is UNCHANGED and robust (no M-CI enters it).
 * -------------------------------------------------------------------------------
 * The T/F pair carries only the imp-96833 p-band (the imp-96656 CI is a property of the composed
 * M ceiling, not of the rigorous trace T or the Frobenius F). So T_hi = 2.708e7 < F_lo = 3.633e7
 * stands with a wide ~34% margin, exactly as in imp-96833. The joint uncertainty does NOT touch
 * the low end of the ladder.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the F < M band separation does NOT survive the JOINT uncertainty.
 * -------------------------------------------------------------------------------
 * imp-96833 (p-band alone) reported F_hi = 3.899e7 < M_lo = 3.958e7 -- a thin but positive gap.
 * Folding the imp-96656 CI into M widens it downward: the joint M_lo drops to 3.868e7 (all-rung
 * CI) or 3.332e7 (dense CI), BELOW F_hi = 3.899e7 in BOTH cases. So the F and M +/- 2 sigma
 * bands now OVERLAP: by ~0.79% under the tight all-rung CI and by ~14.5% under the dense CI. The
 * "non-overlapping bands" claim that held for the p-band alone (imp-96833 Finding 2) is ERODED
 * once BOTH uncertainty sources are accounted for. The two ceilings F = 3.764e7 and M = 4.109e7
 * are only ~9% apart, and the composed-ceiling fit CI (already +/- 5-9% at 1 sigma) swamps that
 * gap once combined with the p-band.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the POINT ordering T < F < M and the compute-binds-first verdict survive.
 * -------------------------------------------------------------------------------
 * The strict ordering of the POINT ceilings (2.594e7 < 3.764e7 < 4.109e7) is p-invariant
 * (imp-96833: all three share the exponent 1/p) and is untouched -- what the joint band erodes is
 * the CLAIM that the F and M uncertainty bands are DISJOINT, not the central ordering. And the
 * imp-96352 compute ceiling 9916 still sits >= 3300x below even the widest joint M_lo (3.332e7),
 * so wall-clock compute binds first by a wide margin under the joint uncertainty too
 * (imp-96706 >= 1500x threshold).
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * Propagated JOINTLY, the p-band (sigma_p ln = 0.0187) and the imp-96656 95% CI
 * (sigma_CI ln = 0.0236 all / 0.1030 dense) give a joint +/- 2 sigma band on M of
 * [3.868e7, 4.364e7] (all-rung CI) / [3.332e7, 5.066e7] (dense CI). The T < F separation is
 * unchanged (T_hi = 2.708e7 < F_lo = 3.633e7, ~34% margin) because no M-CI enters it, but the
 * F < M band separation does NOT survive: the joint M_lo falls below F_hi = 3.899e7 in both CI
 * variants, so the F/M bands OVERLAP (by ~0.8% all-rung, ~14.5% dense). The central T < F < M
 * ordering (p-invariant) and the compute-binds-first verdict (>= 3300x) survive. Sensitivity
 * only; no bound moved; no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (imp-96913-joint-band-independence-is-conservative). The joint band assumes
 * the two sources are INDEPENDENT, which OVERSTATES the width: the imp-96656 cond#-fit exponent
 * q ~ p + b already contains the lam_min slope p, so adding SE(p) separately partially
 * double-counts the p contribution. The true (decorrelated) joint band is therefore somewhat
 * NARROWER than reported here. Consequently the tight all-rung F/M overlap (~0.8%) is within the
 * conservative-widening margin and could be an artifact of the independence assumption -- a
 * decorrelated treatment might restore a thin separation -- whereas the dense-CI overlap (~14.5%)
 * is far too large to be explained away by de-double-counting and is a genuine erosion. Both M and
 * F also still inherit the imp-96684 / imp-96443 log-fit extrapolation (only T is a rigorous lower
 * bound). This changes no bound and makes no fit ceiling rigorous.
 *
 * @see imp-96833-route-m-ceiling-p-sensitivity-band.js (the +/- 2 sigma p-band on T/F/M)
 * @see imp-96656-route-m-conditioning-ceiling-confidence-interval.js (the 95% CI on the fit ceiling)
 * @see imp-96682-route-m-conditioning-ceiling-ladder-status.js (the reconciled four-rung ladder)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (compute ceiling ~9916, binds first)
 *
 * Ticket: imp-96913 (accuracy, opus-4-8, api-pool). Sensitivity only; NO QED.
 */

import {
  IMP96833_BANDS_2SIGMA,
  IMP96833_FIT,
} from './imp-96833-route-m-ceiling-p-sensitivity-band.js';
import {
  IMP96656_ALL,
  IMP96656_DENSE,
} from './imp-96656-route-m-conditioning-ceiling-confidence-interval.js';

const T = IMP96833_BANDS_2SIGMA.find((r) => r.symbol === 'T');
const F = IMP96833_BANDS_2SIGMA.find((r) => r.symbol === 'F');
const M = IMP96833_BANDS_2SIGMA.find((r) => r.symbol === 'M');

// p-band 1-sigma log-width on a ceiling: |d(logN)/dp| * SE(p) (imp-96833 elasticity).
const sigmaPBand = (row) => Math.abs(row.dlogN_dp) * IMP96833_FIT.seP;

export const IMP96913_SIGMA_P_M = sigmaPBand(M); // ~0.018742
export const IMP96913_SIGMA_CI_ALL = IMP96656_ALL.seLnCeiling; // ~0.023632
export const IMP96913_SIGMA_CI_DENSE = IMP96656_DENSE.seLnCeiling; // ~0.103034

const K_SIGMA = 2; // match the imp-96833 +/- 2 sigma p-band convention.
const M_CENTRAL = M.N; // composed measured ceiling 4.1089e7

// Joint band on M: convolve the two sources INDEPENDENTLY in log space (conservative; see sub-gap).
function jointMBand(sigmaCI) {
  const sigmaJoint = Math.sqrt(IMP96913_SIGMA_P_M ** 2 + sigmaCI ** 2);
  return Object.freeze({
    sigmaJoint,
    lo: M_CENTRAL * Math.exp(-K_SIGMA * sigmaJoint),
    hi: M_CENTRAL * Math.exp(K_SIGMA * sigmaJoint),
    relHalfWidth: Math.exp(K_SIGMA * sigmaJoint) - 1,
  });
}

export const IMP96913_JOINT_M_ALL = jointMBand(IMP96913_SIGMA_CI_ALL);
export const IMP96913_JOINT_M_DENSE = jointMBand(IMP96913_SIGMA_CI_DENSE);

// imp-96352 compute ceiling (binds first) -- checked against the widest joint M_lo.
const COMPUTE_CEILING = 9916;

// Ordering tests. T/F carry only the p-band; M carries the joint band.
export const IMP96913_ORDERING = Object.freeze({
  // T < F: pure p-band, unchanged from imp-96833.
  tHigh: T.nHigh,
  fLow: F.nLow,
  tf_separated: T.nHigh < F.nLow,
  tf_marginPercent: (F.nLow / T.nHigh - 1) * 100, // ~34%
  // F < M: p-band F_hi vs JOINT M_lo.
  fHigh: F.nHigh,
  mLow_pBandOnly: M.nLow, // imp-96833 p-band-only M_lo (3.958e7)
  mLow_jointAll: IMP96913_JOINT_M_ALL.lo, // 3.868e7
  mLow_jointDense: IMP96913_JOINT_M_DENSE.lo, // 3.332e7
  fm_separated_pBandOnly: F.nHigh < M.nLow, // true (imp-96833 Finding 2)
  fm_separated_jointAll: F.nHigh < IMP96913_JOINT_M_ALL.lo, // false
  fm_separated_jointDense: F.nHigh < IMP96913_JOINT_M_DENSE.lo, // false
  fm_overlapPercentAll: (IMP96913_JOINT_M_ALL.lo / F.nHigh - 1) * 100, // ~ -0.79
  fm_overlapPercentDense: (IMP96913_JOINT_M_DENSE.lo / F.nHigh - 1) * 100, // ~ -14.5
});

export const IMP96913_BINDS_FIRST = Object.freeze({
  computeCeiling: COMPUTE_CEILING,
  widestJointMLow: IMP96913_JOINT_M_DENSE.lo,
  factorOverCompute: IMP96913_JOINT_M_DENSE.lo / COMPUTE_CEILING, // >= 3300x
  survives: IMP96913_JOINT_M_DENSE.lo / COMPUTE_CEILING >= 1500,
});

export const IMP96913_VERDICT = Object.freeze({
  question:
    'propagating the imp-96833 +/- 2 sigma lam_min-exponent p-band JOINTLY with the imp-96656 ' +
    '95% CI onto the composed Route M ceiling M ~ 4.109e7, do the two uncertainty sources ' +
    'together keep T < F < M with non-overlapping bands?',
  jointMBandAll: '[3.868e7, 4.364e7]',
  jointMBandDense: '[3.332e7, 5.066e7]',
  tfSeparationSurvives: IMP96913_ORDERING.tf_separated, // true, ~34% margin
  fmSeparationSurvivesJoint:
    IMP96913_ORDERING.fm_separated_jointAll || IMP96913_ORDERING.fm_separated_jointDense, // false
  pointOrderingSurvives: true, // 2.594e7 < 3.764e7 < 4.109e7, p-invariant (imp-96833)
  computeBindsFirstSurvives: IMP96913_BINDS_FIRST.survives, // true, >= 3300x
  anyBoundMoved: false,
  conclusion:
    'JOINT UNCERTAINTY ERODES THE F/M BAND SEPARATION. The joint +/- 2 sigma band on M is ' +
    '[3.868e7, 4.364e7] (all-rung CI) / [3.332e7, 5.066e7] (dense CI). T < F is unchanged ' +
    '(T_hi 2.708e7 < F_lo 3.633e7, ~34% margin) because no M-CI enters it, but F < M does NOT ' +
    'stay separated: the joint M_lo (3.868e7 all / 3.332e7 dense) falls below F_hi 3.899e7, so ' +
    'the F/M bands OVERLAP (~0.8% all-rung, ~14.5% dense). The central p-invariant ordering ' +
    'T < F < M and the compute-binds-first verdict (>= 3300x) survive. Sensitivity only; no ' +
    'bound moved; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96913_SUBGAP = Object.freeze({
  id: 'imp-96913-joint-band-independence-is-conservative',
  statement:
    'the joint band assumes the p-band and the imp-96656 CI are INDEPENDENT, which OVERSTATES ' +
    'the width: the imp-96656 cond#-fit exponent q ~ p + b already contains the lam_min slope p, ' +
    'so adding SE(p) separately partially double-counts p. The decorrelated joint band is ' +
    'therefore somewhat narrower, so the tight all-rung F/M overlap (~0.8%) is within the ' +
    'conservative-widening margin and could be an artifact of the independence assumption, ' +
    'whereas the dense-CI overlap (~14.5%) is far too large to be de-double-counted away and is ' +
    'a genuine erosion. Both F and M also inherit the imp-96684 / imp-96443 log-fit ' +
    'extrapolation (only T rigorous). No bound moved; no fit ceiling made rigorous.',
});

export const IMP96913_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Sensitivity only: the p-band and the 95% CI ' +
  'are imported verbatim from the import-light siblings imp-96833 / imp-96656 and combined by a ' +
  'pure log-space convolution (tmp/imp-96913-scratch.mjs); no Gram was rebuilt and no bound is ' +
  'claimed moved. The joint band is a fit-uncertainty band under a conservative independence ' +
  'assumption, NOT a rigorous enclosure.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96913_ASSERTIONS = [
  {
    id: 'imp96913-sigma-components-recovered',
    holds: () =>
      Math.abs(IMP96913_SIGMA_P_M - 0.018742) < 1e-5 &&
      Math.abs(IMP96913_SIGMA_CI_ALL - 0.023632) < 1e-5 &&
      Math.abs(IMP96913_SIGMA_CI_DENSE - 0.103034) < 1e-5,
    why: 'the p-band 1-sigma log-width on M (0.01874) and the imp-96656 CI log-widths (0.02363 all / 0.10303 dense) are recovered from the imported sibling bands.',
  },
  {
    id: 'imp96913-joint-band-wider-than-either-source',
    holds: () =>
      IMP96913_JOINT_M_ALL.sigmaJoint > IMP96913_SIGMA_P_M &&
      IMP96913_JOINT_M_ALL.sigmaJoint > IMP96913_SIGMA_CI_ALL &&
      IMP96913_JOINT_M_DENSE.sigmaJoint > IMP96913_JOINT_M_ALL.sigmaJoint,
    why: 'the convolved joint log-width exceeds either component and the dense-CI joint band is wider than the all-rung joint band.',
  },
  {
    id: 'imp96913-joint-M-bands-bracket-central',
    holds: () =>
      IMP96913_JOINT_M_ALL.lo < M_CENTRAL && M_CENTRAL < IMP96913_JOINT_M_ALL.hi &&
      Math.abs(IMP96913_JOINT_M_ALL.lo - 3.868e7) < 5e5 &&
      Math.abs(IMP96913_JOINT_M_DENSE.lo - 3.332e7) < 5e5,
    why: 'the joint +/- 2 sigma band brackets the central composed ceiling 4.1089e7 with lower edges 3.868e7 (all) / 3.332e7 (dense).',
  },
  {
    id: 'imp96913-TF-separation-unchanged',
    holds: () =>
      IMP96913_ORDERING.tf_separated === true &&
      IMP96913_ORDERING.tf_marginPercent > 30,
    why: 'the T < F separation carries only the p-band (no M-CI) and stays wide (~34% margin), unchanged from imp-96833.',
  },
  {
    id: 'imp96913-FM-separation-eroded-by-joint-band',
    holds: () =>
      IMP96913_ORDERING.fm_separated_pBandOnly === true &&
      IMP96913_ORDERING.fm_separated_jointAll === false &&
      IMP96913_ORDERING.fm_separated_jointDense === false &&
      IMP96913_ORDERING.fm_overlapPercentDense < -10,
    why: 'the F < M band separation held for the p-band alone (imp-96833) but is broken once the imp-96656 CI is folded in: the joint M_lo falls below F_hi (both CI variants), overlapping by ~0.8% all-rung and ~14.5% dense.',
  },
  {
    id: 'imp96913-compute-binds-first-survives-joint',
    holds: () =>
      IMP96913_BINDS_FIRST.survives === true &&
      IMP96913_BINDS_FIRST.factorOverCompute > 3000,
    why: 'the imp-96352 compute ceiling 9916 sits >= 3300x below even the widest joint M_lo, so compute binds first under the joint uncertainty.',
  },
  {
    id: 'imp96913-honesty-gate-no-qed',
    holds: () =>
      IMP96913_VERDICT.anyBoundMoved === false &&
      IMP96913_VERDICT.pointOrderingSurvives === true &&
      /NO QED/.test(IMP96913_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96913_HONEST_BANNER) &&
      /RH open/.test(IMP96913_HONEST_BANNER) &&
      /independence-is-conservative/.test(IMP96913_SUBGAP.id),
    why: 'sensitivity only: no bound moved, the point ordering survives, the honesty markers are present, and the conservative-independence sub-gap is recorded.',
  },
];

for (const a of IMP96913_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96913-route-m-ceiling-joint-p-ci-band assertion failed: ${a.id}`);
  }
}

export default {
  sigmaPM: IMP96913_SIGMA_P_M,
  sigmaCIAll: IMP96913_SIGMA_CI_ALL,
  sigmaCIDense: IMP96913_SIGMA_CI_DENSE,
  jointMAll: IMP96913_JOINT_M_ALL,
  jointMDense: IMP96913_JOINT_M_DENSE,
  ordering: IMP96913_ORDERING,
  bindsFirst: IMP96913_BINDS_FIRST,
  verdict: IMP96913_VERDICT,
  subGap: IMP96913_SUBGAP,
  banner: IMP96913_HONEST_BANNER,
};
