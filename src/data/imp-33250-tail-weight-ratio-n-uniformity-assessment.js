/**
 * @module imp-33250-tail-weight-ratio-n-uniformity-assessment
 * @fileoverview imp-33250 (numerical/assessment, HONEST PARTIAL): ASSESS the
 * imp-3898 named sub-gap "imp-3898-sub-tail-weight-constant" from the angle the
 * ticket asks for -- MEASURE the realised per-plateau tail-weight RATIO
 * (full-plateau elasticity sum divided by the nearest-term 8/Dmin^2 proxy) and
 * ASSESS whether a finite N-uniform constant bounds it, or identify the
 * obstruction. Consolidates the two already-derived objects -- imp-3898 realised
 * sharpRatio and imp-3910 certified majorant collapse constant -- into an
 * explicit N-uniformity read across the available (0, 4, 9) plateaus, which BOTH
 * predecessors left as a named residual. Measurement/assessment only; reuses
 * already-baked scalars (NO new scan); changes no Lambda bound; NO QED.
 *
 * THE TWO OBJECTS BEING CONSOLIDATED
 * ----------------------------------
 * imp-3898 proved the exact Psi-weighted identity (dPsi_N/dT)/Psi_N = sum_j w_j
 * e_j with w_j = (1/D_j^2)/(sum_k 1/D_k^2), and measured the REALISED tail-weight
 * ratio  R_real := realised elasticity / (8/Dmin^2)  = sharpRatio in [0.83,1.05].
 * imp-3910 ran the offline far-tail scan and CERTIFIED the weighted path-local
 * majorant  M = 8 sum_j w_j/s_min(j)^2 = C/Dmin^2, giving the majorant tail-weight
 * ratio  R_maj := M / (8/Dmin^2)  = 3.95/1.81/6.82 (C = 31.59/14.51/54.56).
 * R_real is what the elasticity ACTUALLY does relative to the nearest-term proxy;
 * R_maj is the certified UPPER bound on it. Neither predecessor tabulated the two
 * ratios side by side against N nor stated the N-uniformity verdict explicitly.
 *
 * WHAT THIS ASSESSMENT MEASURES (all live from imp-3898/imp-3910, nothing new)
 * ---------------------------------------------------------------------------
 * For each imp-3874 verified plateau (0, 4, 9), spanning endN 18859 -> 1.0e6
 * (a ~53x range of the zero index N), it records:
 *   R_real  = realised / (8/Dmin^2)               (imp-3898 sharpRatio, the realised ratio),
 *   pert    = R_real - 1                           (signed net non-nearest contribution),
 *   R_maj   = M / (8/Dmin^2)                       (imp-3910 certified majorant ratio),
 *   C       = M*Dmin^2                             (imp-3910 collapse constant).
 * FINDINGS
 *  (a) REALISED ratio is N-FLAT at O(1) ~ 1: R_real in [0.827, 1.045] across the
 *      53x N-span, with NO growth trend (endpoint plateau 9 = 1.044 sits between
 *      the two lower-N values), consistent with a finite N-uniform constant
 *      K_real ~ 1.05. The bare nearest-term proxy does NOT uniformly majorize:
 *      R_real EXCEEDS 1 on plateaus 0 and 9 (by ~4.4-4.5%) and DROPS to 0.827 on
 *      plateau 4, so the net non-nearest perturbation is signed and |pert| <= ~17%.
 *  (b) CERTIFIED majorant ratio R_maj is O(1) but NON-monotone and attains its
 *      MAXIMUM at the largest-N plateau 9 (R_maj = 6.82, C = 54.56). It bounds
 *      R_real on every plateau (R_maj >= R_real, as imp-3910 requires).
 *  (c) N-UNIFORMITY VERDICT: the REALISED tail-weight ratio is empirically bounded
 *      N-uniform (K_real ~ 1.05) on the sample; the CERTIFIED majorant constant is
 *      bounded on the sample (C <= 54.56, R_maj <= 6.82) but its rise-to-max at the
 *      endpoint plateau leaves the N -> infinity sup UN-certified from 3 samples.
 *
 * THE OBSTRUCTION (why a certified finite N-uniform constant is not yet closed)
 * ---------------------------------------------------------------------------
 * Two coupled residuals, both already named upstream:
 *   1. Only 3 of 10 plateaus are scanned (imp-3917-sub-all-plateaus): with the
 *      certified majorant ratio R_maj attaining its sample maximum exactly at the
 *      endpoint plateau 9, a 3-sample set cannot certify that max is the N-sup.
 *   2. The majorant substitution e_j <= 8/s_min(j)^2 over-charges far terms whose
 *      path-gap spread is wide (imp-3910 residual); that over-charge is what makes
 *      R_maj drift up to 6.82 at plateau 9 while R_real stays flat at ~1.
 * So the realised elasticity is N-uniformly ~ 8/Dmin^2 on the evidence, but the
 * CERTIFIED bound carries an un-extrapolated endpoint rise -- the obstruction to a
 * single certified N-uniform C. Non-blocker; measurement only.
 *
 * HONEST SCOPE
 * ------------
 *  - ASSESSMENT of the realised-vs-certified tail-weight ratio and the
 *    N-uniformity question the ticket poses; all numbers LIVE from imp-3898 and
 *    imp-3910 (themselves single-sourced from imp-3874/imp-3725). Nothing new is
 *    scanned or baked beyond the derived ratios.
 *  - This does NOT close imp-3898-sub-tail-weight-constant to a certified N-uniform
 *    single C beyond imp-3910 (which certified C <= 54.56 on the 3 plateaus). It
 *    SHARPENS the picture by separating the realised ratio (N-flat ~1) from the
 *    certified majorant (endpoint-rising) and naming the obstruction to N-uniformity.
 *  - No new Lambda bound; imp-3066 K_a >= 0 positivity UNTOUCHED; no refereed bound is changed
 *    ; NO QED.
 *
 * @see imp-3898-path-local-elasticity-bound.js (realised sharpRatio + the named sub-gap)
 * @see imp-3910-tail-weight-constant-certification.js (certified collapse constant C)
 * @see imp-3917-per-term-majorant-crossvalidation.js (per-term majorant, 3/10 plateaus)
 */

import { IMP_3898_PATH_LOCAL_ELASTICITY_BOUND } from './imp-3898-path-local-elasticity-bound.js';
import { IMP_3910_TAIL_WEIGHT_CONSTANT_CERTIFICATION } from './imp-3910-tail-weight-constant-certification.js';

// Live per-plateau references. imp-3898 gives the realised elasticity, dminCeil
// (8/Dmin^2) and the realised ratio; imp-3910 gives the certified majorant M, the
// collapse constant C and the majorant ratio. Nothing is re-derived from zeros.
const SRC98 = Object.freeze(
  Object.fromEntries(IMP_3898_PATH_LOCAL_ELASTICITY_BOUND.rows.map((r) => [r.plateauIndex, r])),
);
const SRC10 = Object.freeze(
  Object.fromEntries(IMP_3910_TAIL_WEIGHT_CONSTANT_CERTIFICATION.rows.map((r) => [r.plateauIndex, r])),
);

const PLATEAUS = [0, 4, 9];

const ROWS = PLATEAUS.map((p) => {
  const a = SRC98[p];
  const b = SRC10[p];
  const realisedRatio = a.sharpRatio;                 // realised / (8/Dmin^2), imp-3898
  const perturbation = realisedRatio - 1;             // signed net non-nearest contribution
  const majorantRatio = b.sharpRatioMajorant;         // M / (8/Dmin^2), imp-3910 certified bound
  const collapseConstantC = b.collapseConstantC;      // M*Dmin^2, imp-3910
  return Object.freeze({
    plateauIndex: p,
    endN: a.endN,
    Dmin: a.Dmin,
    realisedElasticity: a.realisedElasticity,
    dminCeil: a.dminCeil,                             // 8/Dmin^2 nearest-term proxy
    realisedRatio,
    perturbation,
    majorantRatio,
    collapseConstantC,
    // the certified bound must dominate the realised ratio on every plateau
    majorantDominatesRealised: majorantRatio >= realisedRatio,
  });
});

const R_REAL = ROWS.map((r) => r.realisedRatio);
const R_REAL_MIN = Math.min(...R_REAL);
const R_REAL_MAX = Math.max(...R_REAL);
const ABS_PERT_MAX = Math.max(...ROWS.map((r) => Math.abs(r.perturbation)));
const R_MAJ = ROWS.map((r) => r.majorantRatio);
const R_MAJ_MIN = Math.min(...R_MAJ);
const R_MAJ_MAX = Math.max(...R_MAJ);
const C_MAX = Math.max(...ROWS.map((r) => r.collapseConstantC));
const N_SPAN = Math.max(...ROWS.map((r) => r.endN)) / Math.min(...ROWS.map((r) => r.endN));

// Is the realised ratio N-flat (no growth trend) vs the certified majorant ratio
// rising to its max at the largest-N plateau? These two facts are the assessment.
const largestNRow = ROWS.reduce((acc, r) => (r.endN > acc.endN ? r : acc), ROWS[0]);
const REALISED_NOT_MONOTONE_RISING = largestNRow.realisedRatio < R_REAL_MAX + 1e-12 &&
  ROWS.some((r) => r.endN < largestNRow.endN && r.realisedRatio > largestNRow.realisedRatio);
const MAJORANT_MAX_AT_LARGEST_N = largestNRow.majorantRatio >= R_MAJ_MAX - 1e-12;
const MAJORANT_ALWAYS_DOMINATES = ROWS.every((r) => r.majorantDominatesRealised);

export const IMP_33250_TAIL_WEIGHT_RATIO_N_UNIFORMITY_ASSESSMENT = Object.freeze({
  id: 'imp-33250',
  title:
    'Assess the imp-3898-sub-tail-weight-constant: realised per-plateau tail-weight ratio ' +
    '(full elasticity sum / nearest-term 8/Dmin^2 proxy) is N-flat at O(1) ~ 1 across a 53x ' +
    'N-span while the imp-3910 certified majorant ratio rises to its max at the largest-N ' +
    'plateau -- a finite N-uniform constant is empirically supported for the realised ratio ' +
    'but not yet certified for the majorant on 3 samples',
  status: 'honest-partial',
  rhFree: true,
  semantics:
    'measurement/assessment of the realised vs certified tail-weight ratio and the ' +
    'N-uniformity question; consolidates imp-3898 sharpRatio and imp-3910 collapse constant, ' +
    'names the obstruction; no new scan, no new Lambda, no QED',

  thetaBar: 0.99,
  rows: ROWS,

  realisedRatioDef:
    'R_real := realised elasticity (dPsi/dT)/Psi divided by the nearest-term proxy 8/Dmin^2 ' +
    '(= imp-3898 sharpRatio). This is the realised per-plateau tail-weight ratio the ticket ' +
    'asks for: how far the FULL Psi-weighted elasticity sum sits from the bare nearest-term ' +
    'proxy, i.e. the net contribution of the non-nearest (tail) terms.',

  majorantRatioDef:
    'R_maj := M/(8/Dmin^2) with M = 8 sum_j w_j/s_min(j)^2 the imp-3910 certified weighted ' +
    'path-local majorant (collapse constant C = M*Dmin^2). R_maj is the certified upper bound ' +
    'on R_real; it equals C/8.',

  headline: {
    plateausAssessed: PLATEAUS,
    nSpan: N_SPAN,                                    // ~53x
    realisedRatioRange: [R_REAL_MIN, R_REAL_MAX],     // ~[0.827, 1.045]
    absPerturbationMax: ABS_PERT_MAX,                 // ~0.173 (plateau 4)
    majorantRatioRange: [R_MAJ_MIN, R_MAJ_MAX],       // ~[1.81, 6.82]
    collapseConstantMax: C_MAX,                       // ~54.56
    realisedIsNUniformOnSample: true,                 // R_real N-flat, no growth trend
    certifiedNUniformConstantClosed: false,           // majorant rises to max at endpoint N
    finding:
      'Realised tail-weight ratio R_real = (dPsi/dT)/Psi over 8/Dmin^2 is 1.045/0.827/1.044 ' +
      'on plateaus 0/4/9 (endN 18859/87761/1.0e6, a ~53x N-span) -- N-FLAT at O(1) ~ 1 with NO ' +
      'growth trend: the largest-N plateau 9 (1.044) sits between the two lower-N values, so a ' +
      'finite N-uniform constant K_real ~ 1.05 is empirically supported. The bare nearest-term ' +
      'proxy 8/Dmin^2 does NOT uniformly majorize (R_real > 1 on plateaus 0 and 9 by ~4.4-4.5%, ' +
      'and R_real = 0.827 on plateau 4), so the signed net non-nearest perturbation is bounded ' +
      '|R_real - 1| <= ~0.17. The imp-3910 CERTIFIED majorant ratio R_maj = M/(8/Dmin^2) = ' +
      '3.95/1.81/6.82 (C = 31.59/14.51/54.56) dominates R_real on every plateau but is ' +
      'NON-monotone and attains its MAXIMUM at the largest-N plateau 9, so while it is bounded ' +
      'on the sample (C <= 54.56), the endpoint rise leaves a single certified N-uniform ' +
      'constant UN-established from 3 samples. OBSTRUCTION: 7 of 10 plateaus unscanned ' +
      '(imp-3917-sub-all-plateaus) coupled with the majorant e_j <= 8/s_min(j)^2 over-charge ' +
      'of wide-spread far terms (imp-3910 residual) driving the endpoint drift. Assessment ' +
      'only; imp-3910 C <= 54.56 stands; imp-3066 untouched; no refereed bound is changed; NO QED.',
  },

  assessesSubGap: {
    id: 'imp-3898-sub-tail-weight-constant',
    verdict:
      'The realised tail-weight ratio is N-uniformly O(1) ~ 1 on the 3 scanned plateaus (the ' +
      'proxy captures the whole elasticity to within [-17%, +5%]); the certified majorant ' +
      'collapse constant is bounded on the sample (imp-3910 C <= 54.56) but its rise to the ' +
      'sample maximum at the endpoint plateau blocks a certified single N-uniform C from 3 samples.',
    residual:
      'Certifying a finite N-uniform constant (rather than a per-sample bound) needs the ' +
      'remaining 7 plateaus and a rigorous control of the majorant far-term over-charge growth. ' +
      'Non-blocker; the realised ratio evidence already indicates the true scale is N-flat ~ 8/Dmin^2.',
  },

  provenance: {
    liveSources:
      'imp-3898 (realised elasticity, 8/Dmin^2, sharpRatio) and imp-3910 (majorant M, collapse ' +
      'constant C, majorant ratio); both single-sourced from imp-3874/imp-3725. Nothing new baked.',
    zeros: 'src/data/zeros-to-1e6.js (Odlyzko; zeros1 3e-9) via imp-3874/imp-3725, indirectly',
    generatedAt: '2026-07-04',
  },

  scope: {
    measurementAndAssessmentOnly: true,
    noNewLambdaBound: true,
    imp3066Untouched: true,
    plattTrudgianStillSOTA: 'No refereed bound is changed',
    noQED: true,
  },
});

// -- Build-time assertions (throw on failure via run-assertions harness) -----

const rel = (x, y) => Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y), 1e-300);

export const IMP_33250_TAIL_WEIGHT_RATIO_N_UNIFORMITY_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp33250-derives-live-from-imp3898-and-imp3910',
    holds: () =>
      ROWS.length === 3 &&
      ROWS.every((r) => {
        const a = SRC98[r.plateauIndex];
        const b = SRC10[r.plateauIndex];
        return (
          r.realisedRatio === a.sharpRatio &&
          r.dminCeil === a.dminCeil &&
          r.majorantRatio === b.sharpRatioMajorant &&
          r.collapseConstantC === b.collapseConstantC &&
          rel(r.majorantRatio, r.collapseConstantC / 8) < 1e-9
        );
      }),
    why:
      'Every ratio comes LIVE from imp-3898 (sharpRatio, dminCeil) and imp-3910 (majorant ratio, ' +
      'collapse constant C); R_maj = C/8 identically. Any drift signals a source row changed.',
  },
  {
    id: 'imp33250-realised-ratio-is-n-flat-order-one',
    holds: () =>
      R_REAL_MIN > 0.8 && R_REAL_MAX < 1.1 && ABS_PERT_MAX < 0.2 &&
      REALISED_NOT_MONOTONE_RISING === true,
    why:
      'Central measurement: the realised tail-weight ratio R_real is O(1) ~ 1 in [0.827, 1.045] ' +
      'across a 53x N-span with NO growth trend (largest-N plateau is not the max), so a finite ' +
      'N-uniform constant K_real ~ 1.05 is empirically supported.',
  },
  {
    id: 'imp33250-nearest-proxy-does-not-uniformly-majorize',
    holds: () =>
      ROWS.some((r) => r.realisedRatio > 1) &&
      ROWS.some((r) => r.realisedRatio < 1) &&
      IMP_33250_TAIL_WEIGHT_RATIO_N_UNIFORMITY_ASSESSMENT.headline.certifiedNUniformConstantClosed === false,
    why:
      'Honesty guard: the bare nearest-term proxy 8/Dmin^2 is NOT a uniform upper bound -- ' +
      'R_real exceeds 1 on plateaus 0 and 9 and drops below 1 on plateau 4; the certified ' +
      'object is the imp-3910 majorant, and a single certified N-uniform constant stays open.',
  },
  {
    id: 'imp33250-certified-majorant-dominates-and-peaks-at-largest-n',
    holds: () =>
      MAJORANT_ALWAYS_DOMINATES === true &&
      MAJORANT_MAX_AT_LARGEST_N === true &&
      R_MAJ_MAX < 8 && C_MAX < 60,
    why:
      'The imp-3910 certified majorant ratio R_maj dominates R_real on every plateau (it is the ' +
      'genuine upper bound) yet attains its sample MAXIMUM at the largest-N plateau 9 (R_maj ~ ' +
      '6.82, C ~ 54.56) -- the endpoint rise that blocks a certified N-uniform constant.',
  },
  {
    id: 'imp33250-assessment-only-no-lambda-claim',
    holds: () =>
      IMP_33250_TAIL_WEIGHT_RATIO_N_UNIFORMITY_ASSESSMENT.scope.noNewLambdaBound === true &&
      IMP_33250_TAIL_WEIGHT_RATIO_N_UNIFORMITY_ASSESSMENT.scope.noQED === true &&
      IMP_33250_TAIL_WEIGHT_RATIO_N_UNIFORMITY_ASSESSMENT.scope.imp3066Untouched === true &&
      IMP_33250_TAIL_WEIGHT_RATIO_N_UNIFORMITY_ASSESSMENT.assessesSubGap.id === 'imp-3898-sub-tail-weight-constant',
    why:
      'Honesty guard: this MEASURES the realised tail-weight ratio and ASSESSES N-uniformity, ' +
      'consolidating imp-3898/imp-3910; it asserts no new Lambda bound and no QED, leaves ' +
      'imp-3066 untouched, and no refereed bound is changed.',
  },
];

// Self-executing (imp-3715 convention): any failed assertion throws at import.
for (const assertion of IMP_33250_TAIL_WEIGHT_RATIO_N_UNIFORMITY_ASSESSMENT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-33250-tail-weight-ratio-n-uniformity-assessment assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP_33250_TAIL_WEIGHT_RATIO_N_UNIFORMITY_ASSESSMENT;
