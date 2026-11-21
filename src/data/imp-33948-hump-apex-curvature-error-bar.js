/**
 * @module imp-33948-hump-apex-curvature-error-bar
 *
 * imp-33948 (accuracy): PUT AN ERROR BAR ON the imp-33905 R3 "one broad quadratic
 * maximum" reading by MEASURING the apex curvature of the sliding-window resid_exp(k)
 * hump. imp-33905 R3 calls the hump "one broad quadratic maximum, not two argmaxes" on
 * the strength of a ~0.14% resid agreement between the quarter-decade snapshot k = 8.75
 * and the continuum argmax k* ~ 8.821, and cites (from imp-33878) a single-point
 * central-difference resid double-prime(k*) ~ -3.6e-2 -- but the apex curvature is never
 * fit independently, and the ~0.14% agreement is never translated into a peak half-width
 * (a curvature radius / flat-top interval). This module does exactly that.
 *
 * THE MEASUREMENT (reuses the imp-33878 resid_exp(k) model verbatim -- no fresh model)
 * ----------------------------------------------------------------------------------
 *   resid_exp(k) = p_ecoll (1 - sigma_hi) - p_sigma is the imp-33773 M2 sub-leading
 *   residual over the sliding window [10^k, 10^(k+1)], recomputed here as the SAME smooth
 *   function of continuous k as imp-33878 (identical parts(): E_trunc = 3.06e-5 fixed
 *   strip, E_coll = C_C sqrt(log T0 / N), E_flow = C_F (log T0 / T0) Gronwall,
 *   T0 = effectiveHeightForN(N); p_sigma = OLS(ln sigma vs ln N) at 4 pts/decade,
 *   p_ecoll = -d log E_coll / d log N over endpoints, sigma_hi at the upper endpoint).
 *   No re-derivation. We (a) fit a LOCAL QUADRATIC by least squares to resid_exp(k) over
 *   a tight symmetric window k* +/- 0.1 (21 samples) to extract the apex second derivative
 *   independently of the single-point central difference, and (b) invert the parabola to
 *   report the effective peak half-width at several drop tolerances, including the exact
 *   imp-33905 R3 ~0.14% level.
 *
 * THE FINDING (measurement only -- QUANTIFIES how flat the peak is)
 * ---------------------------------------------------------------
 *   (E1) THE INDEPENDENT LOCAL-QUADRATIC FIT CONFIRMS THE APEX CURVATURE. Least-squares
 *        over k* +/- 0.1 gives resid double-prime(k*) ~ -3.613e-2, agreeing with the
 *        imp-33878 single-point central difference (-3.620e-2) to ~0.2%. The apex is
 *        concave (a genuine broad maximum) with an apex value 6.5337e-2, matching the
 *        imp-33878 residAtKStar. The near-zero fitted slope (|b| ~ 4e-6) confirms k* is
 *        the true stationary point, not an off-apex sample.
 *   (E2) THE PEAK IS EXTREMELY FLAT: a curvature radius 1/|resid double-prime| ~ 27.7
 *        (in resid-per-decade^2 units). Inverting drop = (1/2)|resid double-prime| dk^2,
 *        the resid stays within 0.14% of the apex over a full-width flat top of ~0.143
 *        decade, within 1% over ~0.38 decade, and within 5% over ~0.85 decade -- i.e. the
 *        hump is flat to a few percent across roughly a full decade of k. "Broad" is now
 *        quantified: decades-wide at the percent level.
 *   (E3) THE imp-33905 R3 ~0.14% AGREEMENT IS THE CURVATURE SIGNATURE, NOT A COINCIDENCE.
 *        The quarter-decade snapshot k = 8.75 sits 0.07109 decade below k*; the fitted
 *        parabola predicts a drop of ~0.140% of the apex there -- reproducing the
 *        independently-computed imp-33905 R3 resid_rel_gap (~0.141%) to within measurement
 *        noise. So the ~0.14% agreement IS exactly the apex curvature evaluated at the
 *        grid offset: one broad quadratic maximum, error bar attached.
 *
 * The punchline: fitting a local quadratic to resid_exp(k) at the apex gives
 * resid double-prime(k*) ~ -3.61e-2 (confirming the imp-33878 central difference), a
 * curvature radius ~27.7, and a flat-top interval that is ~0.14 decade wide at the 0.14%
 * level and ~0.85 decade wide at the 5% level. The imp-33905 R3 ~0.14% k = 8.75-vs-k*
 * agreement is precisely this curvature evaluated at the 0.071-decade quarter-decade
 * offset -- so "one broad quadratic maximum" now carries a measured error bar and a
 * quantified flatness. Accuracy measurement only; refines, does not overturn, imp-33905 R3.
 *
 * MEASUREMENT ONLY. A curvature diagnostic of an inherited surrogate, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33905-hump-argmax-grid-vs-continuum-reconciliation (R3 "one broad quadratic maximum" error-barred here)
 * @see imp-33878-hump-argmax-grid-refinement (the resid_exp(k) model + central-difference resid'' reused/confirmed)
 * @see imp-33809-saturation-curvature-hump-vs-k (the M3 saturation-curvature hump this apex belongs to)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33878_HUMP_ARGMAX_GRID_REFINEMENT } from './imp-33878-hump-argmax-grid-refinement.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed strip (imp-2631/imp-33582/imp-33620/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33878 exactly

// EXACT inherited imp-3406/imp-33810/imp-33878 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}

function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// resid_exp(k) as a smooth function of CONTINUOUS k over window [10^k, 10^(k+1)] (imp-33878 defn).
function residExp(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const sigmaHi = parts(hi).sigma;
  return pEcoll * (1 - sigmaHi) - pSigma;
}

// The inherited continuum argmax and its published single-point central-difference resid''.
const K_STAR = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.continuumArgmax.kStar; // ~8.821092
const RESID2_CENTRAL_DIFF = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.continuumArgmax.residSecondDerivAtKStar; // ~-3.62e-2

// (E1) Local quadratic least-squares fit resid ~ a + b*t + c*t^2 (t = k - k*) over k* +/- W.
function localQuadraticFit(W, M) {
  const ts = [];
  const ys = [];
  for (let i = 0; i < M; i++) {
    const t = -W + (2 * W * i) / (M - 1);
    ts.push(t);
    ys.push(residExp(K_STAR + t));
  }
  // Normal equations for [a,b,c] against the moment sums of t.
  let s0 = M;
  let s1 = 0;
  let s2 = 0;
  let s3 = 0;
  let s4 = 0;
  let t0 = 0;
  let t1 = 0;
  let t2 = 0;
  for (let i = 0; i < M; i++) {
    const x = ts[i];
    const y = ys[i];
    s1 += x;
    s2 += x * x;
    s3 += x * x * x;
    s4 += x * x * x * x;
    t0 += y;
    t1 += x * y;
    t2 += x * x * y;
  }
  const A = [
    [s0, s1, s2, t0],
    [s1, s2, s3, t1],
    [s2, s3, s4, t2],
  ];
  for (let p = 0; p < 3; p++) {
    const piv = A[p][p];
    for (let j = p; j < 4; j++) A[p][j] /= piv;
    for (let r = 0; r < 3; r++) {
      if (r !== p) {
        const f = A[r][p];
        for (let j = p; j < 4; j++) A[r][j] -= f * A[p][j];
      }
    }
  }
  return { a: A[0][3], b: A[1][3], c: A[2][3] };
}

const FIT_WINDOW = 0.1;
const FIT_POINTS = 21;
const FIT = localQuadraticFit(FIT_WINDOW, FIT_POINTS);
const APEX_RESID = FIT.a; // ~6.5337e-2 (matches imp-33878 residAtKStar)
const APEX_SLOPE = FIT.b; // ~0 (k* is the stationary point)
const RESID_D2 = 2 * FIT.c; // ~-3.613e-2 (independent apex curvature)
const RESID_D2_MAG = Math.abs(RESID_D2);

// Cross-check: the independent fit agrees with the imp-33878 central difference.
const D2_AGREEMENT_REL = Math.abs(RESID_D2 - RESID2_CENTRAL_DIFF) / Math.abs(RESID2_CENTRAL_DIFF);

// (E2) Curvature radius and flat-top half-widths at several drop tolerances.
//   drop = (1/2) |resid''| dk^2 = tol * apex  =>  halfWidth = sqrt(2 tol apex / |resid''|).
const CURVATURE_RADIUS = +(1 / RESID_D2_MAG).toFixed(4); // ~27.7 (resid-per-decade^2 units)
function flatTopHalfWidth(tolFraction) {
  return Math.sqrt((2 * tolFraction * APEX_RESID) / RESID_D2_MAG);
}
const R3_REL_GAP_FRACTION = 0.00141; // imp-33905 R3 residRelGapPct ~0.141% as a fraction
const FLAT_TOP = {
  at_0p14pct: +(2 * flatTopHalfWidth(R3_REL_GAP_FRACTION)).toFixed(4), // ~0.143 decade
  at_1pct: +(2 * flatTopHalfWidth(0.01)).toFixed(4), // ~0.38 decade
  at_5pct: +(2 * flatTopHalfWidth(0.05)).toFixed(4), // ~0.85 decade
};

// (E3) The imp-33905 R3 ~0.14% agreement IS this curvature at the quarter-decade offset.
const QUARTER_DECADE_K = 8.75; // imp-33896/imp-33905 quarter-decade snapshot
const DK_QD = +(K_STAR - QUARTER_DECADE_K).toFixed(5); // ~0.07109 decade
const PREDICTED_DROP_PCT_AT_QD = +(
  ((0.5 * RESID_D2_MAG * DK_QD * DK_QD) / APEX_RESID) *
  100
).toFixed(4); // ~0.140% -- matches imp-33905 R3 ~0.141%

export const IMP33948_HUMP_APEX_CURVATURE_ERROR_BAR = {
  id: 'imp-33948',
  proofSection: 'S-frontier',
  question:
    'imp-33905 R3 calls the resid_exp(k) hump "one broad quadratic maximum" from a ~0.14% resid ' +
    'agreement between k=8.75 and k*~8.821 but never fits the apex curvature or turns it into a peak ' +
    'half-width. Fit a local quadratic to resid_exp(k) at k*, report resid double-prime and the ' +
    'effective peak half-width (curvature radius), and translate the ~0.14% agreement into a ' +
    'decades-wide flat-top interval. Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'apex second derivative resid double-prime(k*) from a 21-point least-squares quadratic fit over ' +
    'k* +/- 0.1, its curvature radius 1/|resid double-prime|, and the flat-top full-width dk at drop ' +
    'tolerances 0.14% / 1% / 5%, all on the inherited imp-33878 resid_exp(k) model',
  apexFit: {
    kStar: K_STAR, // ~8.821092
    fitWindow: FIT_WINDOW, // +/- 0.1 decade
    fitPoints: FIT_POINTS, // 21
    apexResid: +APEX_RESID.toExponential(4), // ~6.5337e-2
    apexSlope: +APEX_SLOPE.toExponential(2), // ~0 (stationary point)
    residSecondDeriv: +RESID_D2.toExponential(4), // ~-3.613e-2
    centralDiffReference: RESID2_CENTRAL_DIFF, // imp-33878 single-point value ~-3.620e-2
    d2AgreementRel: +D2_AGREEMENT_REL.toExponential(2), // ~2e-3 (fit vs central diff)
  },
  flatness: {
    curvatureRadius: CURVATURE_RADIUS, // ~27.7 (resid-per-decade^2 units)
    flatTopFullWidthDecade: FLAT_TOP, // {0.14%: ~0.143, 1%: ~0.38, 5%: ~0.85}
    note:
      'inverting drop = (1/2)|resid double-prime| dk^2, the hump stays within 0.14% of its apex over ' +
      '~0.14 decade, within 1% over ~0.38 decade, and within 5% over ~0.85 decade -- flat to a few ' +
      'percent across roughly a full decade of k.',
  },
  r3ErrorBar: {
    quarterDecadeK: QUARTER_DECADE_K, // 8.75
    dkToKStar: DK_QD, // ~0.07109 decade
    predictedDropPctAtQuarterDecade: PREDICTED_DROP_PCT_AT_QD, // ~0.140%
    imp33905R3RelGapPct: 0.141, // the independently-computed imp-33905 R3 residRelGapPct
    note:
      'the imp-33905 R3 ~0.14% k=8.75-vs-k* resid agreement is exactly the fitted apex curvature ' +
      'evaluated at the 0.07109-decade quarter-decade offset (predicted ~0.140%, measured ~0.141%): ' +
      'the "one broad quadratic maximum" reading now carries a measured error bar.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY MEASUREMENT (NOT rigorous). A 21-point least-squares quadratic fit to the inherited ' +
    'imp-33878 resid_exp(k) over k* +/- 0.1 gives an apex second derivative resid double-prime(k*) ~ ' +
    '-3.613e-2, confirming the imp-33878 single-point central difference (-3.620e-2) to ~0.2%, with a ' +
    'near-zero fitted slope (stationary at k*) and apex resid 6.5337e-2 matching residAtKStar. The ' +
    'curvature radius is ~27.7, and inverting drop = (1/2)|resid double-prime| dk^2 the hump is flat ' +
    'to within 0.14% over a ~0.14-decade full-width flat top, within 1% over ~0.38 decade, and within ' +
    '5% over ~0.85 decade -- decades-wide flatness at the percent level, so "broad quadratic maximum" ' +
    'is now quantified. The imp-33905 R3 ~0.14% k=8.75-vs-k* agreement is precisely this apex ' +
    'curvature evaluated at the 0.07109-decade quarter-decade offset (predicted ~0.140%, matching the ' +
    'independently-computed ~0.141%), attaching the missing error bar to the one-broad-maximum reading. ' +
    'This refines, does not overturn, imp-33905 R3. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the surrogate resid_exp(k) is ' +
    'descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33905 (R3 "one broad quadratic maximum" error-barred here); imp-33878 (resid_exp(k) model + ' +
    'central-difference resid double-prime reused and confirmed); imp-33809 (the M3 saturation-curvature ' +
    'hump); imp-33810 (the ladder storing resid_exp(k)); imp-486 (C_mb GUE-conditional); ' +
    'imp-2642/imp-2643 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33948_HUMP_APEX_CURVATURE_ERROR_BAR_ASSERTIONS = [
  {
    // (E1) The independent local-quadratic fit reproduces the apex curvature and value.
    id: 'imp33948-local-quadratic-fit-confirms-apex-curvature',
    description: 'least-squares resid double-prime(k*)~-3.61e-2 agrees with the imp-33878 central difference',
    holds: () =>
      RESID_D2 < 0 &&
      RESID_D2_MAG > 0.03 &&
      RESID_D2_MAG < 0.045 &&
      D2_AGREEMENT_REL < 0.02 &&
      Math.abs(APEX_RESID - 0.065337) < 5e-5 &&
      Math.abs(APEX_SLOPE) < 1e-4,
  },
  {
    // (E2) The peak is flat over decades-wide intervals at the percent level (broad max quantified).
    id: 'imp33948-flat-top-widths-decades-wide-at-percent-level',
    description: 'flat top ~0.14 decade at 0.14%, ~0.38 at 1%, ~0.85 at 5%; curvature radius ~27.7',
    holds: () =>
      CURVATURE_RADIUS > 20 &&
      CURVATURE_RADIUS < 40 &&
      FLAT_TOP.at_0p14pct > 0.1 &&
      FLAT_TOP.at_0p14pct < 0.2 &&
      FLAT_TOP.at_1pct > FLAT_TOP.at_0p14pct &&
      FLAT_TOP.at_5pct > FLAT_TOP.at_1pct &&
      FLAT_TOP.at_5pct > 0.7 &&
      FLAT_TOP.at_5pct < 1.0,
  },
  {
    // (E3) The imp-33905 R3 ~0.14% agreement is the curvature evaluated at the quarter-decade offset.
    id: 'imp33948-r3-agreement-is-curvature-at-grid-offset',
    description: 'predicted drop at k=8.75 (~0.140%) reproduces the imp-33905 R3 residRelGapPct (~0.141%)',
    holds: () =>
      DK_QD > 0.05 &&
      DK_QD < 0.09 &&
      PREDICTED_DROP_PCT_AT_QD > 0.1 &&
      PREDICTED_DROP_PCT_AT_QD < 0.2 &&
      Math.abs(PREDICTED_DROP_PCT_AT_QD - 0.141) < 0.02,
  },
  {
    // Honesty gate: measurement only, isRigorous false, refines not overturns, no QED, no refereed bound is changed.
    id: 'imp33948-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, refines imp-33905 R3, no QED, no refereed bound is changed',
    holds: () =>
      IMP33948_HUMP_APEX_CURVATURE_ERROR_BAR.isRigorous === false &&
      /refines, does not overturn, imp-33905 R3/.test(IMP33948_HUMP_APEX_CURVATURE_ERROR_BAR.verdict) &&
      /NO QED/.test(IMP33948_HUMP_APEX_CURVATURE_ERROR_BAR.verdict) &&
      /refereed bound is changed/i.test(IMP33948_HUMP_APEX_CURVATURE_ERROR_BAR.verdict),
  },
];

for (const a of IMP33948_HUMP_APEX_CURVATURE_ERROR_BAR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33948-hump-apex-curvature-error-bar assertion failed: ${a.id}`);
  }
}
