/**
 * @module imp-34146-apex-quintic-tilt-coefficient
 *
 * imp-34146 (numerical): FIT THE APEX QUINTIC (t^5) TERM imp-34084 NAMED BUT NEVER FIT.
 * imp-34084 C2/C3 fit the apex cubic tilt d ~ -5.347e-4 of the imp-33878 resid_exp(k) hump and
 * found it reconstructs ~103% of the imp-34008 left/right wing asymmetry, but LEFT a small residual
 * odd overshoot: at the |t| = 0.5 probe the cubic term d(0.5)^3 ~ -6.68e-5 OVERSHOOTS the true odd
 * part of the parabola residual (~-6.29e-5) by ~6% (ratio ~1.06), and the wing split overshot ~3%.
 * imp-34084 attributed that leftover to "a small residual odd quintic overshoot" but never FIT the
 * t^5 term. This module runs the SAME 21-point symmetric least-squares over k* +/- 0.1, extended to
 * the odd-augmented basis {1, t, t^2, t^3, t^5}, reads the fitted quintic coefficient
 * e = (1/120) resid^(5)(k*) and its SIGN, and measures how much of the imp-34084 residual odd
 * overshoot the quintic term absorbs.
 *
 * THE MEASUREMENT (reuses the imp-33878 resid_exp(k) model + the imp-33948 fit grid VERBATIM)
 * ------------------------------------------------------------------------------------------
 *   resid_exp(k) = p_ecoll (1 - sigma_hi) - p_sigma is the imp-33773 M2 sub-leading residual over
 *   the sliding window [10^k, 10^(k+1)], the SAME smooth function of continuous k as
 *   imp-33878/imp-33948/imp-34008/imp-34084 (E_trunc = 3.06e-5 fixed strip, E_coll = C_C sqrt(log T0 / N),
 *   E_flow Gronwall, T0 = effectiveHeightForN(N); p_sigma = OLS(ln sigma vs ln N) at 4 pts/decade,
 *   p_ecoll = -d log E_coll / d log N over endpoints, sigma_hi at the upper endpoint). No
 *   re-derivation. We fit the sparse basis {1, t, t^2, t^3, t^5} on the SAME 21-point k* +/- 0.1 grid.
 *   Omitting t^4 keeps the odd terms {t, t^3, t^5} decoupled from the even terms {1, t^2}, so the
 *   symmetric-grid even normal-equations reproduce the imp-33948 apex value and curvature EXACTLY
 *   (to machine precision) and the augmentation isolates the odd tail cleanly. We read the quintic
 *   coefficient e and resid^(5)(k*) = 120 e, its sign, the shift it induces in the cubic d, and how
 *   much of the imp-34084 |t| = 0.5 odd overshoot (ratio ~1.06) the t^5 term removes. As a robustness
 *   cross-check we ALSO fit the dense basis {1, t, t^2, t^3, t^4, t^5}; the quintic coefficient agrees
 *   to ~6 significant figures.
 *
 * THE FINDING (measurement only -- the odd quintic overshoot imp-34084 named, now directly fit)
 * --------------------------------------------------------------------------------------------
 *   (Q1) THE FITTED QUINTIC COEFFICIENT IS e ~ +7.5238e-5, so resid^(5)(k*) = 120 e ~ +9.0286e-3
 *        (POSITIVE) -- the OPPOSITE sign to the negative cubic tilt d ~ -5.347e-4. On the sparse
 *        {1,t,t^2,t^3,t^5} grid the even coefficients decouple exactly, so the imp-33948 apex value
 *        6.5337e-2 and curvature 2c = -3.613e-2 are reproduced to machine precision (rel ~ 0), and
 *        adding t^5 shifts the cubic coefficient only slightly, d ~ -5.347e-4 -> -5.356e-4 (~0.2%).
 *   (Q2) THE POSITIVE QUINTIC TERM ABSORBS ~57% OF THE imp-34084 ODD OVERSHOOT. At the imp-34008
 *        probe |t| = 0.5 the cubic-only odd tail d(0.5)^3 ~ -6.683e-5 overshoots the true odd
 *        residual ~-6.291e-5 by ~6.24% (ratio ~1.062). The positive quintic term e(0.5)^5 ~ +2.351e-6
 *        partially cancels that overshoot: the combined odd tail d t^3 + e t^5 ~ -6.460e-5 drops the
 *        overshoot to ~2.68% (ratio ~1.027), absorbing ~57% of the leftover odd overshoot magnitude
 *        (from ~3.92e-6 down to ~1.69e-6) and leaving a SMALL residual odd septic (t^7) term.
 *   (Q3) THE QUINTIC FURTHER SYMMETRISES THE WINGS. Evaluating the SAME imp-34008 left/right
 *        discrepancies against the quintic fit tightens the imp-34084 cubic split 0.3105% / 0.3171%
 *        (split -0.0066%) to 0.3139% / 0.3137% (split +0.0002%) -- a near-exact left/right balance --
 *        while the total two-wing discrepancy 0.6276% is unchanged (the surviving symmetric part is
 *        the EVEN quartic curvature imp-34064, which no odd term can address).
 *
 * The punchline: the residual odd quintic overshoot imp-34084 only NAMED is now fit directly --
 * e ~ +7.5238e-5 (resid^(5)(k*) ~ +9.0286e-3, POSITIVE, opposite in sign to the negative cubic) --
 * and it absorbs ~57% of the cubic-tilt odd overshoot at |t| = 0.5 (dropping the odd-tail ratio from
 * ~1.062 to ~1.027) and drives the imp-34084 left/right wing split from -0.0066% to a near-vanishing
 * +0.0002%, leaving only the even quartic residual and a small odd septic tail. The sparse basis
 * leaves the imp-33948 apex value (6.5337e-2) and curvature (-3.613e-2) untouched, isolating the odd
 * quintic tilt without disturbing the even apex fit.
 *
 * MEASUREMENT ONLY. A higher-order odd-term fit of an inherited surrogate, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; refines, does not overturn, imp-34084; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34084-apex-cubic-tilt-coefficient (C2/C3 named the residual odd quintic overshoot; fit here)
 * @see imp-34008-apex-parabola-wing-fidelity (W2 inferred the tilt from the wing asymmetry)
 * @see imp-34064-apex-quartic-curvature-fit (the EVEN quartic companion the odd terms cannot address)
 * @see imp-33948-hump-apex-curvature-error-bar (the apex quadratic fit whose even coefficients are preserved)
 * @see imp-33878-hump-argmax-grid-refinement (the resid_exp(k) model reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33878_HUMP_ARGMAX_GRID_REFINEMENT } from './imp-33878-hump-argmax-grid-refinement.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed strip (imp-2631/imp-33582/imp-33620/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33878/imp-33948/imp-34008/imp-34084 exactly

// EXACT inherited imp-3406/imp-33810/imp-33878/imp-33948/imp-34008/imp-34084 sub-terms (no re-derivation).
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

const K_STAR = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.continuumArgmax.kStar; // ~8.821092

// General polynomial least-squares over M symmetric points in [-W, W] on the given list of monomial
// exponents `powers`, solved by Gaussian elimination on the normal equations. Returns a map
// exponent -> coefficient (so both dense {0,1,2,3} and sparse {0,1,2,3,5} bases share one solver).
function polyFit(W, M, powers) {
  const ts = [];
  const ys = [];
  for (let i = 0; i < M; i++) {
    const t = -W + (2 * W * i) / (M - 1);
    ts.push(t);
    ys.push(residExp(K_STAR + t));
  }
  const nc = powers.length;
  const S = Array.from({ length: nc }, () => Array(nc + 1).fill(0));
  for (let i = 0; i < M; i++) {
    const x = ts[i];
    const y = ys[i];
    for (let a = 0; a < nc; a++) {
      for (let b = 0; b < nc; b++) S[a][b] += Math.pow(x, powers[a] + powers[b]);
      S[a][nc] += Math.pow(x, powers[a]) * y;
    }
  }
  for (let p = 0; p < nc; p++) {
    let piv = p;
    for (let r = p + 1; r < nc; r++) if (Math.abs(S[r][p]) > Math.abs(S[piv][p])) piv = r;
    const tmp = S[p];
    S[p] = S[piv];
    S[piv] = tmp;
    const pv = S[p][p];
    for (let j = p; j <= nc; j++) S[p][j] /= pv;
    for (let r = 0; r < nc; r++) {
      if (r !== p) {
        const f = S[r][p];
        for (let j = p; j <= nc; j++) S[r][j] -= f * S[p][j];
      }
    }
  }
  const out = {};
  powers.forEach((pw, i) => (out[pw] = S[i][nc]));
  return out;
}

const FIT_WINDOW = 0.1;
const FIT_POINTS = 21;

// The imp-33948/imp-34084 quadratic and cubic fits, plus the imp-34146 sparse and dense quintic fits,
// all on the SAME 21-point k* +/- 0.1 grid.
const QUAD = polyFit(FIT_WINDOW, FIT_POINTS, [0, 1, 2]); // {a, b, c}
const CUBIC = polyFit(FIT_WINDOW, FIT_POINTS, [0, 1, 2, 3]); // {a, b, c, d}
const QUINTIC = polyFit(FIT_WINDOW, FIT_POINTS, [0, 1, 2, 3, 5]); // sparse {1,t,t^2,t^3,t^5}
const QUINTIC_DENSE = polyFit(FIT_WINDOW, FIT_POINTS, [0, 1, 2, 3, 4, 5]); // dense {1,...,t^5} cross-check

const APEX_RESID = QUAD[0]; // ~6.5337e-2 (imp-33948 apex, preserved by the symmetric sparse grid)
const RESID_D2 = 2 * QUAD[2]; // ~-3.613e-2 (imp-33948 apex curvature)
const CUBIC_COEFF_D = CUBIC[3]; // d ~ -5.347e-4 (imp-34084)

// (Q1) The fitted quintic coefficient and its fifth derivative and sign.
const QUINTIC_COEFF_E = QUINTIC[5]; // e ~ +7.5238e-5
const RESID_D5 = 120 * QUINTIC_COEFF_E; // resid^(5)(k*) = 120 e ~ +9.0286e-3 (POSITIVE)
const QUINTIC_SIGN = Math.sign(QUINTIC_COEFF_E); // +1
const QUINTIC_COEFF_E_DENSE = QUINTIC_DENSE[5]; // dense-basis cross-check ~ +7.5238e-5
const E_DENSE_AGREE_REL = Math.abs(QUINTIC_COEFF_E_DENSE - QUINTIC_COEFF_E) / Math.abs(QUINTIC_COEFF_E); // ~2e-8

// The sparse quintic leaves the imp-33948 even coefficients untouched (no t^4 to couple in).
const APEX_UNCHANGED_REL = Math.abs(QUINTIC[0] - QUAD[0]) / Math.abs(QUAD[0]); // ~0
const CURV_UNCHANGED_REL = Math.abs(2 * QUINTIC[2] - RESID_D2) / Math.abs(RESID_D2); // ~0
// Adding t^5 shifts the odd cubic coefficient only slightly.
const CUBIC_SHIFT_REL = Math.abs(QUINTIC[3] - CUBIC_COEFF_D) / Math.abs(CUBIC_COEFF_D); // ~0.0017

// Fitted-quadratic, cubic, and quintic evaluators, t = k - k*.
const parabola = (t) => QUAD[0] + QUAD[1] * t + QUAD[2] * t * t;
const cubicPoly = (t) => CUBIC[0] + CUBIC[1] * t + CUBIC[2] * t * t + CUBIC[3] * t * t * t;
const quinticPoly = (t) =>
  QUINTIC[0] + QUINTIC[1] * t + QUINTIC[2] * t * t + QUINTIC[3] * Math.pow(t, 3) + QUINTIC[5] * Math.pow(t, 5);

// (Q2) The imp-34084 |t| = 0.5 odd overshoot, and how much of it the quintic term absorbs.
const PROBE_T = 0.5; // the imp-34008/imp-34084 probe offset
const D_QUAD_PLUS = residExp(K_STAR + PROBE_T) - parabola(PROBE_T); // truth - parabola at +0.5
const D_QUAD_MINUS = residExp(K_STAR - PROBE_T) - parabola(-PROBE_T); // truth - parabola at -0.5
const ODD_RESID_AT_PROBE = (D_QUAD_PLUS - D_QUAD_MINUS) / 2; // true odd part of the residual ~-6.29e-5
const CUBIC_TAIL_AT_PROBE = CUBIC_COEFF_D * Math.pow(PROBE_T, 3); // cubic-only odd tail ~-6.68e-5
const QUINTIC_TERM_AT_PROBE = QUINTIC_COEFF_E * Math.pow(PROBE_T, 5); // e(0.5)^5 ~+2.351e-6 (POSITIVE)
const QUINTIC_TAIL_AT_PROBE = QUINTIC[3] * Math.pow(PROBE_T, 3) + QUINTIC[5] * Math.pow(PROBE_T, 5); // d t^3 + e t^5
const CUBIC_OVERSHOOT_RATIO = CUBIC_TAIL_AT_PROBE / ODD_RESID_AT_PROBE; // ~1.062 (imp-34084 ~1.06)
const QUINTIC_OVERSHOOT_RATIO = QUINTIC_TAIL_AT_PROBE / ODD_RESID_AT_PROBE; // ~1.027
const CUBIC_OVERSHOOT_ABS = CUBIC_TAIL_AT_PROBE - ODD_RESID_AT_PROBE; // ~-3.92e-6
const QUINTIC_LEFTOVER_ABS = QUINTIC_TAIL_AT_PROBE - ODD_RESID_AT_PROBE; // ~-1.69e-6 (residual septic)
const OVERSHOOT_ABSORBED_FRAC = 1 - QUINTIC_LEFTOVER_ABS / CUBIC_OVERSHOOT_ABS; // ~0.570 (~57%)

// (Q3) The imp-34008 left/right wing discrepancy split, cubic (imp-34084) vs quintic.
function discPct(evalFn, dir) {
  return (100 * Math.abs(evalFn(dir * PROBE_T) - residExp(K_STAR + dir * PROBE_T))) / APEX_RESID;
}
const CUBIC_DISC = {
  leftPct: +discPct(cubicPoly, -1).toFixed(4), // ~0.3105
  rightPct: +discPct(cubicPoly, +1).toFixed(4), // ~0.3171
};
CUBIC_DISC.splitPct = +(CUBIC_DISC.leftPct - CUBIC_DISC.rightPct).toFixed(4); // ~-0.0066
const QUINTIC_DISC = {
  leftPct: +discPct(quinticPoly, -1).toFixed(4), // ~0.3139
  rightPct: +discPct(quinticPoly, +1).toFixed(4), // ~0.3137
};
QUINTIC_DISC.splitPct = +(QUINTIC_DISC.leftPct - QUINTIC_DISC.rightPct).toFixed(4); // ~+0.0002
const CUBIC_TOTAL_DISC = +(CUBIC_DISC.leftPct + CUBIC_DISC.rightPct).toFixed(4); // ~0.6276
const QUINTIC_TOTAL_DISC = +(QUINTIC_DISC.leftPct + QUINTIC_DISC.rightPct).toFixed(4); // ~0.6276 (unchanged)

export const IMP34146_APEX_QUINTIC_TILT_COEFFICIENT = {
  id: 'imp-34146',
  proofSection: 'S-frontier',
  question:
    'imp-34084 C2/C3 fit the apex cubic tilt d ~ -5.347e-4 of the imp-33878 resid_exp(k) hump and found ' +
    'it reconstructs ~103% of the imp-34008 wing asymmetry, but LEFT a small residual odd overshoot ' +
    '(cubic term d(0.5)^3 overshoots the true odd residual by ~6%, ratio ~1.06 at |t|=0.5) it named a ' +
    '"residual odd quintic overshoot" but never fit. Extend the SAME 21-point symmetric least-squares ' +
    'over k* +/- 0.1 to {1,t,t^2,t^3,t^5}, report the quintic coefficient e=(1/120) resid^(5)(k*) and its ' +
    'sign, and measure how much of the imp-34084 odd overshoot the t^5 term absorbs. Measurement only; ' +
    'NOT an RH bound; no QED.',
  measuredQuantity:
    'the quintic coefficient e and fifth derivative resid^(5)(k*)=120 e of a 21-point symmetric ' +
    'least-squares fit over k* +/- 0.1 on the sparse basis {1,t,t^2,t^3,t^5}, its sign, and the fraction ' +
    'of the imp-34084 |t|=0.5 odd overshoot (ratio ~1.06) the t^5 term absorbs, all on the inherited ' +
    'imp-33878 resid_exp(k) model',
  quinticFit: {
    kStar: K_STAR, // ~8.821092
    fitWindow: FIT_WINDOW, // +/- 0.1 decade
    fitPoints: FIT_POINTS, // 21
    apexResid: +APEX_RESID.toExponential(4), // ~6.5337e-2 (imp-33948, preserved)
    residSecondDeriv: +RESID_D2.toExponential(4), // ~-3.613e-2 (imp-33948, preserved)
    cubicCoeffD: +CUBIC_COEFF_D.toExponential(4), // d ~-5.347e-4 (imp-34084)
    cubicCoeffDInQuintic: +QUINTIC[3].toExponential(4), // d ~-5.356e-4 (slightly shifted by t^5)
    cubicShiftRel: +CUBIC_SHIFT_REL.toExponential(2), // ~1.7e-3 (~0.2% shift)
    quinticCoeffE: +QUINTIC_COEFF_E.toExponential(4), // e ~+7.5238e-5
    residFifthDeriv: +RESID_D5.toExponential(4), // 120 e ~+9.0286e-3
    sign: QUINTIC_SIGN, // +1 (POSITIVE tilt, opposite the negative cubic)
    quinticCoeffEDense: +QUINTIC_COEFF_E_DENSE.toExponential(4), // ~+7.5238e-5 (dense-basis cross-check)
    eDenseAgreeRel: +E_DENSE_AGREE_REL.toExponential(2), // ~2e-8 (sparse and dense agree)
    apexUnchangedRel: +APEX_UNCHANGED_REL.toExponential(2), // ~0 (even a preserved on sparse grid)
    curvatureUnchangedRel: +CURV_UNCHANGED_REL.toExponential(2), // ~0 (even 2c preserved)
    note:
      'the fitted quintic coefficient is e ~ +7.5238e-5, so resid^(5)(k*) = 120 e ~ +9.0286e-3 ' +
      '(POSITIVE, the OPPOSITE sign to the negative cubic d ~ -5.347e-4); on the sparse ' +
      '{1,t,t^2,t^3,t^5} grid the even coefficients decouple, so the apex value 6.5337e-2 and ' +
      'curvature -3.613e-2 reproduce imp-33948 exactly and adding t^5 only shifts the cubic ~0.2%.',
  },
  oddOvershootAbsorption: {
    probeOffset: PROBE_T, // |t| = 0.5 (imp-34008/imp-34084 probe)
    oddResidAtProbe: +ODD_RESID_AT_PROBE.toExponential(4), // ~-6.291e-5 (true odd residual)
    cubicTailAtProbe: +CUBIC_TAIL_AT_PROBE.toExponential(4), // ~-6.683e-5 (cubic-only odd tail)
    quinticTermAtProbe: +QUINTIC_TERM_AT_PROBE.toExponential(4), // ~+2.351e-6 (the added t^5 term)
    quinticTailAtProbe: +QUINTIC_TAIL_AT_PROBE.toExponential(4), // ~-6.460e-5 (d t^3 + e t^5)
    cubicOvershootRatio: +CUBIC_OVERSHOOT_RATIO.toFixed(4), // ~1.0624 (imp-34084 ~1.06)
    quinticOvershootRatio: +QUINTIC_OVERSHOOT_RATIO.toFixed(4), // ~1.0268
    overshootAbsorbedFrac: +OVERSHOOT_ABSORBED_FRAC.toFixed(4), // ~0.5704 (~57%)
    note:
      'at |t|=0.5 the cubic-only odd tail (~-6.683e-5) overshoots the true odd residual (~-6.291e-5) ' +
      'by ~6.24% (ratio ~1.062); the positive quintic term e(0.5)^5 ~ +2.351e-6 cancels part of that, ' +
      'so the combined d t^3 + e t^5 (~-6.460e-5) overshoots by only ~2.68% (ratio ~1.027) -- ' +
      'absorbing ~57% of the imp-34084 leftover odd overshoot, leaving a small residual odd septic term.',
  },
  wingSymmetrisation: {
    cubicSplit: CUBIC_DISC, // {leftPct ~0.3105, rightPct ~0.3171, splitPct ~-0.0066}
    quinticSplit: QUINTIC_DISC, // {leftPct ~0.3139, rightPct ~0.3137, splitPct ~+0.0002}
    cubicTotalDisc: CUBIC_TOTAL_DISC, // ~0.6276
    quinticTotalDisc: QUINTIC_TOTAL_DISC, // ~0.6276 (unchanged: surviving part is the EVEN quartic)
    note:
      'adding t^5 tightens the imp-34084 cubic wing split 0.3105/0.3171 (-0.0066) to a near-exact ' +
      '0.3139/0.3137 (+0.0002) while leaving the total two-wing discrepancy 0.6276% unchanged -- the ' +
      'surviving symmetric residual is the EVEN quartic curvature (imp-34064) no odd term can address.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (NOT rigorous). Extending the imp-34084 21-point symmetric least-squares over ' +
    'k* +/- 0.1 to the sparse odd-augmented basis {1,t,t^2,t^3,t^5} gives a quintic coefficient ' +
    'e ~ +7.5238e-5, so resid^(5)(k*) = 120 e ~ +9.0286e-3 (POSITIVE -- the OPPOSITE sign to the ' +
    'negative cubic d ~ -5.347e-4; the dense {1,...,t^5} basis agrees to ~6 sig figs). Omitting t^4 keeps ' +
    'the even normal-equations decoupled, so the imp-33948 apex value 6.5337e-2 and curvature 2c = ' +
    '-3.613e-2 reproduce exactly and adding t^5 shifts the cubic only ~0.2%. At the imp-34008 probe ' +
    '|t|=0.5 the cubic-only odd tail (~-6.683e-5) overshoots the true odd residual (~-6.291e-5) by ~6.24% ' +
    '(ratio ~1.062); the positive quintic term e(0.5)^5 ~ +2.351e-6 partially cancels it, so the combined ' +
    'd t^3 + e t^5 (~-6.460e-5) overshoots by only ~2.68% (ratio ~1.027) -- absorbing ~57% of the ' +
    'imp-34084 leftover odd overshoot and leaving a small residual odd SEPTIC (t^7) term. Including the ' +
    'quintic also tightens the imp-34084 left/right wing split from -0.0066% to a near-vanishing +0.0002% ' +
    'while the total two-wing discrepancy 0.6276% is unchanged (the surviving symmetric part is the EVEN ' +
    'quartic imp-34064). This confirms and refines, does not overturn, imp-34084 -- the "residual odd ' +
    'quintic overshoot" it only named is now fit directly. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the surrogate resid_exp(k) is ' +
    'descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34084 (C2/C3 named the residual odd quintic overshoot, fit here); imp-34008 (W2 cubic-tilt ' +
    'inference from wing asymmetry); imp-34064 (the even quartic companion no odd term can address); ' +
    'imp-33948 (apex quadratic whose even coefficients are preserved); imp-33878 (resid_exp(k) model ' +
    'reused verbatim); imp-33810 (the ladder storing resid_exp(k)); imp-486 (C_mb GUE-conditional); ' +
    'imp-2642/imp-2643 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34146_APEX_QUINTIC_TILT_COEFFICIENT_ASSERTIONS = [
  {
    // (Q1) The fitted quintic coefficient is POSITIVE (opposite the negative cubic), resid^(5) ~ +9.0e-3,
    // the sparse grid preserves the imp-33948 even apex value and curvature, and the dense basis agrees.
    id: 'imp34146-quintic-coeff-positive-even-coeffs-preserved',
    description: 'e ~+7.5238e-5 (resid^(5) ~+9.0286e-3, POSITIVE, opposite the negative cubic); apex 6.5337e-2 and 2c -3.613e-2 preserved',
    holds: () =>
      QUINTIC_COEFF_E > 0 &&
      QUINTIC_SIGN === 1 &&
      Math.abs(QUINTIC_COEFF_E - 7.5238e-5) < 5e-7 &&
      RESID_D5 > 0 &&
      Math.abs(RESID_D5 - 9.0286e-3) < 5e-5 &&
      CUBIC_COEFF_D < 0 &&
      E_DENSE_AGREE_REL < 1e-6 &&
      Math.abs(APEX_RESID - 0.065337) < 5e-5 &&
      Math.abs(RESID_D2 - -0.03613) < 5e-4 &&
      APEX_UNCHANGED_REL < 1e-9 &&
      CURV_UNCHANGED_REL < 1e-9 &&
      CUBIC_SHIFT_REL < 0.01,
  },
  {
    // (Q2) The positive quintic term partially cancels the imp-34084 odd overshoot, dropping the
    // odd-tail overshoot ratio from ~1.06 to ~1.03 and absorbing ~57% of the leftover.
    id: 'imp34146-quintic-absorbs-cubic-odd-overshoot',
    description: 'quintic term +2.351e-6 drops the |t|=0.5 odd-tail ratio ~1.062->~1.027, absorbing ~57% of the imp-34084 overshoot',
    holds: () =>
      ODD_RESID_AT_PROBE < 0 &&
      QUINTIC_TERM_AT_PROBE > 0 &&
      CUBIC_OVERSHOOT_RATIO > 1.05 &&
      CUBIC_OVERSHOOT_RATIO < 1.08 &&
      QUINTIC_OVERSHOOT_RATIO > 1.0 &&
      QUINTIC_OVERSHOOT_RATIO < CUBIC_OVERSHOOT_RATIO &&
      OVERSHOOT_ABSORBED_FRAC > 0.4 &&
      OVERSHOOT_ABSORBED_FRAC < 0.7,
  },
  {
    // (Q3) The quintic further symmetrises the wings (split -> near zero) while leaving the total
    // two-wing discrepancy unchanged (the surviving part is the even quartic).
    id: 'imp34146-quintic-symmetrises-wings',
    description: 'cubic split -0.0066 tightens to near-zero +0.0002; total two-wing discrepancy 0.6276 unchanged',
    holds: () =>
      Math.abs(CUBIC_DISC.splitPct) > Math.abs(QUINTIC_DISC.splitPct) &&
      Math.abs(QUINTIC_DISC.splitPct) < 0.005 &&
      Math.abs(QUINTIC_TOTAL_DISC - CUBIC_TOTAL_DISC) < 0.01 &&
      Math.abs(QUINTIC_TOTAL_DISC - 0.6276) < 0.02,
  },
  {
    // Honesty gate: measurement only, isRigorous false, refines not overturns, no QED, no refereed bound is changed.
    id: 'imp34146-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, refines imp-34084, no QED, imp-3066 untouched, no refereed bound is changed',
    holds: () =>
      IMP34146_APEX_QUINTIC_TILT_COEFFICIENT.isRigorous === false &&
      /confirms and refines, does not overturn, imp-34084/.test(IMP34146_APEX_QUINTIC_TILT_COEFFICIENT.verdict) &&
      /NO QED/.test(IMP34146_APEX_QUINTIC_TILT_COEFFICIENT.verdict) &&
      /refereed bound is changed/i.test(IMP34146_APEX_QUINTIC_TILT_COEFFICIENT.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34146_APEX_QUINTIC_TILT_COEFFICIENT.verdict),
  },
];

for (const a of IMP34146_APEX_QUINTIC_TILT_COEFFICIENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34146-apex-quintic-tilt-coefficient assertion failed: ${a.id}`);
  }
}
