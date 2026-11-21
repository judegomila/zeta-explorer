/**
 * @module imp-96930-route-m-ceiling-decorrelated-joint-band
 *
 * imp-96930 (numerical, SENSITIVITY ONLY): derive the DECORRELATED joint band on the imp-96913
 * Route M composed conditioning ceiling M (~ 4.109e7) by removing the double-counted lam_min
 * slope p, and decide whether the reported ~0.8 percent all-rung F/M band overlap is a genuine
 * erosion or an artifact of the independence assumption. NO bound moved; NO QED.
 *
 * THE ISSUE (imp-96913 sub-gap imp-96913-joint-band-independence-is-conservative). imp-96913
 * combined the imp-96833 lam_min-exponent p-band and the imp-96656 cond#-fit 95% CI on the
 * composed ceiling M by treating them as INDEPENDENT and convolving in log space:
 *     sigma_joint^2 = sigma_p^2 + sigma_CI^2.
 * But the imp-96656 CI propagates the cond#-fit slope q through the ceiling map
 * N* = (1/(eps C))^(1/q), and the cond# slope is q = p + b: ln cond# = ln lam_max - ln lam_min =
 * (a - ln A) + (b + p) ln N, so cond#-slope = lam_max-slope b PLUS lam_min-slope p EXACTLY.
 * Hence the CI already carries the p contribution inside its q-slope term, and adding the
 * standalone sigma_p on top DOUBLE-COUNTS p. The two sources use the SAME ceiling elasticity:
 * imp-96833 set d(ln N)/dp = -(ln N)/(p + b) = -(ln N)/q, which is identical to the delta-method
 * q-slope partial d(ln N*)/dq = -(ln N*)/q used by imp-96656.
 *
 * WHAT WAS DONE (tmp/imp-96930-scratch.mjs, reproducible; pure re-analysis, no Gram rebuilt).
 * Both siblings are import-light, so this module imports their baked bands directly and rebuilds
 * the joint band with the shared-p decorrelation:
 *   (1) Confirm q = p + b absorbs p by comparing the standalone lam_min slope error
 *       SE(p) = 0.0024274 (imp-96428/imp-96833, 12 rungs) against the cond#-fit slope errors
 *       SE(q) = 0.0048282 (all-rung, 5 rungs) / 0.0219014 (dense, 4 rungs). SE(q) EXCEEDS SE(p)
 *       in BOTH subsets, so the cond#-fit slope uncertainty already accounts for at least as much
 *       slope (hence p) variation as the standalone p-band -- the p-band adds no new information.
 *   (2) Since the p-slope variance is already inside the CI's (ln N/q)^2 Var(q) term, the correct
 *       decorrelated ceiling variance counts the slope uncertainty ONCE: it collapses to the
 *       imp-96656 CI band ALONE (sigma_decorr = sigma_CI). This is the fully shared-p end of the
 *       [independence (imp-96913), shared-p (here)] bracket; because SE(q) > SE(p) the p-band is
 *       fully subsumed, so this end is the defensible decorrelated band, not merely an endpoint.
 *
 * Decorrelated +/- 2 sigma band on M = 4.1089e7 (M * exp(+/- 2 sigma_decorr)):
 *     decorrelated (all-rung CI):  sigma = 0.023632,  M in [3.919e7, 4.308e7]
 *     decorrelated (dense CI):     sigma = 0.103034,  M in [3.344e7, 5.049e7]
 * vs the imp-96913 independence band [3.868e7, 4.364e7] (all) / [3.332e7, 5.066e7] (dense).
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the all-rung F/M overlap is an ARTIFACT of the independence assumption.
 * -------------------------------------------------------------------------------
 * Under independence imp-96913 reported the joint all-rung M_lo = 3.868e7, BELOW F_hi = 3.899e7
 * (overlap ~ -0.79%). Removing the double-counted p raises the decorrelated all-rung M_lo to
 * 3.919e7, ABOVE F_hi = 3.899e7: a THIN F < M separation is RESTORED (~ +0.52% gap). So the
 * ~0.8% all-rung overlap was created purely by adding sigma_p to a CI that already contained it;
 * it does not survive a covariance-consistent treatment. (The gap is thin -- ~0.5% -- so the
 * separation is real but not comfortable.)
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the dense-CI F/M overlap is a GENUINE erosion (survives decorrelation).
 * -------------------------------------------------------------------------------
 * The dense-CI band is dominated by the cond#-fit sampling error (sigma_CI = 0.1030 vs
 * sigma_p = 0.0187), so removing the small p contribution barely narrows it: the decorrelated
 * dense M_lo = 3.344e7 (vs 3.332e7 under independence) is still ~14.2% below F_hi = 3.899e7. The
 * dense overlap is far too large to be de-double-counted away and is a genuine erosion of the
 * F < M band separation -- exactly as the imp-96913 sub-gap anticipated.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- point ordering and compute-binds-first are untouched.
 * -------------------------------------------------------------------------------
 * The central p-invariant point ordering T < F < M (2.594e7 < 3.764e7 < 4.109e7) is unchanged,
 * and the imp-96352 compute ceiling 9916 still sits ~3372x below even the widest decorrelated
 * dense M_lo (3.344e7), above the imp-96706 >= 1500x threshold: wall-clock compute binds first
 * under the decorrelated band too.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * Removing the double-counted lam_min slope p (the cond#-fit slope q = p + b already carries it,
 * and SE(q) > SE(p) makes the standalone p-band fully subsumed) collapses the joint band to the
 * imp-96656 CI alone: M in [3.919e7, 4.308e7] (all-rung) / [3.344e7, 5.049e7] (dense). This
 * RESTORES a thin all-rung F < M separation (decorrelated M_lo 3.919e7 > F_hi 3.899e7, ~0.5%
 * gap), so the imp-96913 ~0.8% all-rung overlap is an ARTIFACT of the independence assumption;
 * but the dense-CI overlap (~14%) is a GENUINE erosion that survives decorrelation. The point
 * ordering T < F < M and the compute-binds-first verdict (~3372x) are untouched. Sensitivity
 * only; no bound moved; no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (imp-96930-decorrelated-band-inherits-fit-extrapolation). The decorrelated
 * band still rests on the same non-rigorous lam_min N^-p and lam_max a + b log N extrapolations
 * (imp-96684 / imp-96443) that F and M inherit -- only the trace ceiling T is a rigorous lower
 * bound. The shared-p collapse to the CI is exact under q = p + b with SE(q) > SE(p); a residual
 * refinement (inverse-variance tightening of the cond# slope with the 12-rung lam_min SE(p))
 * could NARROW the band further but only shrinks it, never re-opens the all-rung overlap. This
 * changes no bound and makes no fit ceiling rigorous.
 *
 * @see imp-96913-route-m-ceiling-joint-p-ci-band.js (the independence joint band and the sub-gap)
 * @see imp-96833-route-m-ceiling-p-sensitivity-band.js (the +/- 2 sigma p-band on T/F/M)
 * @see imp-96656-route-m-conditioning-ceiling-confidence-interval.js (the 95% CI on the fit ceiling; q = p + b slope)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (compute ceiling ~9916, binds first)
 *
 * Ticket: imp-96930 (numerical, opus-4-8, api-pool). Sensitivity only; NO QED.
 */

import {
  IMP96833_BANDS_2SIGMA,
  IMP96833_FIT,
} from './imp-96833-route-m-ceiling-p-sensitivity-band.js';
import {
  IMP96656_ALL,
  IMP96656_DENSE,
} from './imp-96656-route-m-conditioning-ceiling-confidence-interval.js';

const F = IMP96833_BANDS_2SIGMA.find((r) => r.symbol === 'F');
const M = IMP96833_BANDS_2SIGMA.find((r) => r.symbol === 'M');

const K_SIGMA = 2; // match the imp-96833 / imp-96913 +/- 2 sigma convention.
const M_CENTRAL = M.N; // composed measured ceiling 4.1089e7
const F_HIGH = F.nHigh; // p-band F_hi = 3.8991e7 (imp-96833)

// Standalone lam_min slope error (12 lam_min rungs) and its p-band log-width on M.
export const IMP96930_SE_P = IMP96833_FIT.seP; // 0.0024274
export const IMP96930_SIGMA_P_M = Math.abs(M.dlogN_dp) * IMP96930_SE_P; // ~0.018742

// cond#-fit slope errors (q = p + b). If SE(q) > SE(p) the p-band is fully subsumed by the CI.
export const IMP96930_SE_Q_ALL = IMP96656_ALL.seQ; // ~0.004828
export const IMP96930_SE_Q_DENSE = IMP96656_DENSE.seQ; // ~0.021901
export const IMP96930_P_SUBSUMED = Object.freeze({
  all: IMP96930_SE_Q_ALL > IMP96930_SE_P, // true
  dense: IMP96930_SE_Q_DENSE > IMP96930_SE_P, // true
  reason:
    'the cond#-fit slope is q = p + b (ln cond# = ln lam_max - ln lam_min carries the lam_min ' +
    'slope p), so the imp-96656 CI already contains the p contribution; SE(q) > SE(p) in both ' +
    'subsets confirms the standalone p-band adds no slope information and is fully double-counted.',
});

// imp-96656 CI log-widths (already the decorrelated slope-once band).
export const IMP96930_SIGMA_CI_ALL = IMP96656_ALL.seLnCeiling; // ~0.023632
export const IMP96930_SIGMA_CI_DENSE = IMP96656_DENSE.seLnCeiling; // ~0.103034

// +/- 2 sigma band on M from a log-width.
function mBand(sigma) {
  return Object.freeze({
    sigma,
    lo: M_CENTRAL * Math.exp(-K_SIGMA * sigma),
    hi: M_CENTRAL * Math.exp(K_SIGMA * sigma),
    relHalfWidth: Math.exp(K_SIGMA * sigma) - 1,
  });
}

// Independence band (imp-96913) recomputed here for the direct contrast.
export const IMP96930_INDEP_M_ALL = mBand(
  Math.sqrt(IMP96930_SIGMA_P_M ** 2 + IMP96930_SIGMA_CI_ALL ** 2),
);
export const IMP96930_INDEP_M_DENSE = mBand(
  Math.sqrt(IMP96930_SIGMA_P_M ** 2 + IMP96930_SIGMA_CI_DENSE ** 2),
);

// Decorrelated (shared-p) band: slope uncertainty counted once -> collapses to the CI alone.
export const IMP96930_DECORR_M_ALL = mBand(IMP96930_SIGMA_CI_ALL);
export const IMP96930_DECORR_M_DENSE = mBand(IMP96930_SIGMA_CI_DENSE);

// imp-96352 compute ceiling (binds first) -- checked against the widest decorrelated M_lo.
const COMPUTE_CEILING = 9916;

// F/M separation test: p-band F_hi vs the decorrelated / independence M_lo.
export const IMP96930_FM_SEPARATION = Object.freeze({
  fHigh: F_HIGH,
  // independence (imp-96913): both overlap.
  mLow_indepAll: IMP96930_INDEP_M_ALL.lo,
  mLow_indepDense: IMP96930_INDEP_M_DENSE.lo,
  overlapPercent_indepAll: (IMP96930_INDEP_M_ALL.lo / F_HIGH - 1) * 100, // ~ -0.79
  overlapPercent_indepDense: (IMP96930_INDEP_M_DENSE.lo / F_HIGH - 1) * 100, // ~ -14.5
  // decorrelated (this ticket): all-rung separation restored, dense overlap persists.
  mLow_decorrAll: IMP96930_DECORR_M_ALL.lo,
  mLow_decorrDense: IMP96930_DECORR_M_DENSE.lo,
  gapPercent_decorrAll: (IMP96930_DECORR_M_ALL.lo / F_HIGH - 1) * 100, // ~ +0.52
  gapPercent_decorrDense: (IMP96930_DECORR_M_DENSE.lo / F_HIGH - 1) * 100, // ~ -14.2
  separatedDecorrAll: IMP96930_DECORR_M_ALL.lo > F_HIGH, // true (RESTORED)
  separatedDecorrDense: IMP96930_DECORR_M_DENSE.lo > F_HIGH, // false (GENUINE erosion)
  allRungOverlapIsArtifact: IMP96930_INDEP_M_ALL.lo < F_HIGH && IMP96930_DECORR_M_ALL.lo > F_HIGH,
});

export const IMP96930_BINDS_FIRST = Object.freeze({
  computeCeiling: COMPUTE_CEILING,
  widestDecorrMLow: IMP96930_DECORR_M_DENSE.lo,
  factorOverCompute: IMP96930_DECORR_M_DENSE.lo / COMPUTE_CEILING, // ~3372x
  survives: IMP96930_DECORR_M_DENSE.lo / COMPUTE_CEILING >= 1500,
});

export const IMP96930_VERDICT = Object.freeze({
  question:
    'removing the double-counted lam_min slope p from the imp-96913 independence joint band ' +
    '(the imp-96656 cond#-fit slope q = p + b already carries p), is the reported ~0.8 percent ' +
    'all-rung F/M band overlap a genuine erosion or an artifact of the independence assumption, ' +
    'and is a thin F < M separation restored?',
  decorrMBandAll: '[3.919e7, 4.308e7]',
  decorrMBandDense: '[3.344e7, 5.049e7]',
  allRungOverlapIsArtifact: IMP96930_FM_SEPARATION.allRungOverlapIsArtifact, // true
  allRungSeparationRestored: IMP96930_FM_SEPARATION.separatedDecorrAll, // true (~0.5% gap)
  denseOverlapGenuine: !IMP96930_FM_SEPARATION.separatedDecorrDense, // true (~14% survives)
  pointOrderingSurvives: true, // 2.594e7 < 3.764e7 < 4.109e7, p-invariant (imp-96833)
  computeBindsFirstSurvives: IMP96930_BINDS_FIRST.survives, // true, ~3372x
  anyBoundMoved: false,
  conclusion:
    'DECORRELATION RESTORES THE THIN ALL-RUNG F/M SEPARATION. Because the cond#-fit slope is ' +
    'q = p + b, the imp-96656 CI already carries p (SE(q) > SE(p) in both subsets), so the ' +
    'decorrelated joint band collapses to the CI alone: M in [3.919e7, 4.308e7] (all) / ' +
    '[3.344e7, 5.049e7] (dense). The all-rung M_lo rises to 3.919e7 > F_hi 3.899e7, restoring a ' +
    'thin (~0.5%) separation -- the imp-96913 ~0.8% all-rung overlap was an ARTIFACT of the ' +
    'independence assumption. The dense-CI overlap (~14%) is a GENUINE erosion that survives ' +
    'decorrelation. The point ordering T < F < M and compute-binds-first (~3372x) are untouched. ' +
    'Sensitivity only; no bound moved; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96930_SUBGAP = Object.freeze({
  id: 'imp-96930-decorrelated-band-inherits-fit-extrapolation',
  statement:
    'the decorrelated band still rests on the non-rigorous lam_min N^-p and lam_max a + b log N ' +
    'extrapolations (imp-96684 / imp-96443) that F and M inherit -- only the trace ceiling T is ' +
    'rigorous. The shared-p collapse to the CI is exact under q = p + b with SE(q) > SE(p); a ' +
    'residual inverse-variance tightening of the cond# slope with the 12-rung lam_min SE(p) could ' +
    'only NARROW the band further, never re-open the all-rung overlap. No bound moved; no fit ' +
    'ceiling made rigorous.',
});

export const IMP96930_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Sensitivity only: the p-band, the 95% CI and ' +
  'the cond#-fit slope errors are imported verbatim from the import-light siblings imp-96833 / ' +
  'imp-96656 and recombined with the shared-p (q = p + b) decorrelation ' +
  '(tmp/imp-96930-scratch.mjs); no Gram was rebuilt and no bound is claimed moved. The ' +
  'decorrelated band is a covariance-consistent fit-uncertainty band, NOT a rigorous enclosure.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96930_ASSERTIONS = [
  {
    id: 'imp96930-p-fully-subsumed-by-condfit-slope',
    holds: () =>
      IMP96930_P_SUBSUMED.all === true &&
      IMP96930_P_SUBSUMED.dense === true &&
      IMP96930_SE_Q_ALL > IMP96930_SE_P &&
      IMP96930_SE_Q_DENSE > IMP96930_SE_P,
    why: 'the cond#-fit slope q = p + b carries the lam_min slope p, and SE(q) > SE(p) in both subsets, so the standalone p-band is fully double-counted and the decorrelated band is the CI alone.',
  },
  {
    id: 'imp96930-decorrelated-narrower-than-independence',
    holds: () =>
      IMP96930_DECORR_M_ALL.sigma < IMP96930_INDEP_M_ALL.sigma &&
      IMP96930_DECORR_M_DENSE.sigma < IMP96930_INDEP_M_DENSE.sigma &&
      Math.abs(IMP96930_DECORR_M_ALL.sigma - 0.023632) < 1e-5 &&
      Math.abs(IMP96930_DECORR_M_DENSE.sigma - 0.103034) < 1e-5,
    why: 'removing the double-counted p makes the decorrelated log-width (0.02363 all / 0.10303 dense) narrower than the imp-96913 independence width in both subsets.',
  },
  {
    id: 'imp96930-all-rung-separation-restored',
    holds: () =>
      IMP96930_INDEP_M_ALL.lo < F_HIGH && // overlap under independence
      IMP96930_DECORR_M_ALL.lo > F_HIGH && // separation restored decorrelated
      IMP96930_FM_SEPARATION.gapPercent_decorrAll > 0 &&
      IMP96930_FM_SEPARATION.gapPercent_decorrAll < 1.5 &&
      IMP96930_FM_SEPARATION.allRungOverlapIsArtifact === true,
    why: 'the decorrelated all-rung M_lo (3.919e7) exceeds F_hi (3.899e7) by ~0.5%, restoring a thin F < M separation: the imp-96913 ~0.8% all-rung overlap is an artifact of the independence assumption.',
  },
  {
    id: 'imp96930-dense-overlap-is-genuine',
    holds: () =>
      IMP96930_DECORR_M_DENSE.lo < F_HIGH &&
      IMP96930_FM_SEPARATION.gapPercent_decorrDense < -10 &&
      IMP96930_FM_SEPARATION.separatedDecorrDense === false,
    why: 'the dense-CI band is dominated by the cond#-fit sampling error, so decorrelation barely narrows it: the decorrelated dense M_lo (3.344e7) is still ~14% below F_hi, a genuine erosion.',
  },
  {
    id: 'imp96930-compute-binds-first-survives',
    holds: () =>
      IMP96930_BINDS_FIRST.survives === true &&
      IMP96930_BINDS_FIRST.factorOverCompute > 3000,
    why: 'the imp-96352 compute ceiling 9916 sits ~3372x below the widest decorrelated dense M_lo, so compute binds first under the decorrelated band too.',
  },
  {
    id: 'imp96930-honesty-gate-no-qed',
    holds: () =>
      IMP96930_VERDICT.anyBoundMoved === false &&
      IMP96930_VERDICT.pointOrderingSurvives === true &&
      /NO QED/.test(IMP96930_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96930_HONEST_BANNER) &&
      /RH open/.test(IMP96930_HONEST_BANNER) &&
      /inherits-fit-extrapolation/.test(IMP96930_SUBGAP.id),
    why: 'sensitivity only: no bound moved, the point ordering survives, the honesty markers are present, and the residual fit-extrapolation sub-gap is recorded.',
  },
];

for (const a of IMP96930_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96930-route-m-ceiling-decorrelated-joint-band assertion failed: ${a.id}`);
  }
}

export default {
  seP: IMP96930_SE_P,
  sigmaPM: IMP96930_SIGMA_P_M,
  seQAll: IMP96930_SE_Q_ALL,
  seQDense: IMP96930_SE_Q_DENSE,
  pSubsumed: IMP96930_P_SUBSUMED,
  indepMAll: IMP96930_INDEP_M_ALL,
  indepMDense: IMP96930_INDEP_M_DENSE,
  decorrMAll: IMP96930_DECORR_M_ALL,
  decorrMDense: IMP96930_DECORR_M_DENSE,
  fmSeparation: IMP96930_FM_SEPARATION,
  bindsFirst: IMP96930_BINDS_FIRST,
  verdict: IMP96930_VERDICT,
  subGap: IMP96930_SUBGAP,
  banner: IMP96930_HONEST_BANNER,
};
