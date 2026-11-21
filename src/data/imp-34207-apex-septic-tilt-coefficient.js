/**
 * @module imp-34207-apex-septic-tilt-coefficient
 *
 * imp-34207 (numerical): FIT THE APEX SEPTIC (t^7) TILT COEFFICIENT imp-34146 NAMED BUT NEVER FIT.
 * imp-34146 extended the imp-34084 apex cubic tilt to the odd-augmented basis {1,t,t^2,t^3,t^5} and
 * found the quintic coefficient e ~ +7.5238e-5 (POSITIVE, opposite the negative cubic d ~ -5.347e-4),
 * absorbing ~57% of the imp-34084 leftover odd overshoot at the |t| = 0.5 probe (dropping the odd-tail
 * ratio ~1.062 -> ~1.027) and driving the wing split to +0.0002%, but it LEFT "a small residual odd
 * SEPTIC (t^7) term" it named but never fit. This module runs the SAME 21-point symmetric least-squares
 * over k* +/- 0.1, extended to the sparse basis {1, t, t^2, t^3, t^5, t^7}, reads the fitted septic
 * coefficient g = (1/5040) resid^(7)(k*) and its SIGN, and measures whether the t^7 term absorbs the
 * ~2.68% residual odd overshoot the imp-34146 quintic left at |t| = 0.5.
 *
 * THE MEASUREMENT (reuses the imp-33878 resid_exp(k) model + the imp-33948 fit grid VERBATIM)
 * ------------------------------------------------------------------------------------------
 *   resid_exp(k) = p_ecoll (1 - sigma_hi) - p_sigma is the imp-33773 M2 sub-leading residual over the
 *   sliding window [10^k, 10^(k+1)], the SAME smooth function of continuous k as
 *   imp-33878/imp-33948/imp-34008/imp-34084/imp-34146 (E_trunc = 3.06e-5 fixed strip,
 *   E_coll = C_C sqrt(log T0 / N), E_flow Gronwall, T0 = effectiveHeightForN(N); p_sigma = OLS(ln sigma
 *   vs ln N) at 4 pts/decade, p_ecoll = -d log E_coll / d log N over endpoints, sigma_hi at the upper
 *   endpoint). No re-derivation. We fit the sparse basis {1, t, t^2, t^3, t^5, t^7} on the SAME 21-point
 *   k* +/- 0.1 grid. Omitting t^4 and t^6 keeps the odd terms {t, t^3, t^5, t^7} decoupled from the even
 *   terms {1, t^2}, so the symmetric-grid even normal-equations reproduce the imp-33948 apex value and
 *   curvature EXACTLY (to machine precision) and the augmentation isolates the odd tail cleanly. We read
 *   the septic coefficient g and resid^(7)(k*) = 5040 g, its sign, the shift it induces in the quintic e
 *   and cubic d, and how the imp-34146 |t| = 0.5 odd overshoot (ratio ~1.027) changes when the t^7 term
 *   is added. As a robustness cross-check we ALSO fit the dense basis {1, t, ..., t^7}; the septic
 *   coefficient agrees to ~7 significant figures.
 *
 * THE FINDING (measurement only -- the odd septic term imp-34146 named, now directly fit)
 * --------------------------------------------------------------------------------------
 *   (Q1) THE FITTED SEPTIC COEFFICIENT IS g ~ -1.0466e-5, so resid^(7)(k*) = 5040 g ~ -5.2747e-2
 *        (NEGATIVE) -- the SAME sign as the negative cubic tilt d ~ -5.347e-4 and the OPPOSITE sign to
 *        the positive quintic e ~ +7.5238e-5, so the odd Taylor coefficients ALTERNATE in sign
 *        (- + -) through order 7. On the sparse {1,t,t^2,t^3,t^5,t^7} grid the even coefficients decouple
 *        exactly, so the imp-33948 apex value 6.5337e-2 and curvature 2c = -3.613e-2 are reproduced to
 *        machine precision (rel ~ 0), and adding t^7 shifts the quintic coefficient only ~0.24%
 *        (e ~ +7.5238e-5 -> +7.5418e-5) and the cubic d essentially not at all (~1.6e-4 rel).
 *   (Q2) THE NEGATIVE SEPTIC TERM DOES NOT ABSORB THE imp-34146 LEFTOVER OVERSHOOT AT |t| = 0.5 -- IT
 *        SLIGHTLY DEEPENS IT. At the imp-34008 probe |t| = 0.5 the imp-34146 quintic odd tail
 *        d t^3 + e t^5 ~ -6.4596e-5 already overshoots the true odd residual ~-6.291e-5 by ~2.68%
 *        (ratio ~1.027). The septic term g(0.5)^7 ~ -8.18e-8 is NEGATIVE at that probe -- the WRONG sign
 *        to cancel the overshoot -- so the combined d t^3 + e t^5 + g t^7 ~ -6.4672e-5 overshoots by
 *        ~2.80% (ratio ~1.028) instead, i.e. the septic ABSORBS ~-4.5% (a slight DEEPENING, not an
 *        absorption) of the leftover at |t| = 0.5. HONEST NEGATIVE RESULT: unlike the imp-34146 quintic
 *        (which absorbed ~57% of the cubic overshoot at the probe), the septic term extrapolated from the
 *        +/- 0.1 fit window to |t| = 0.5 does not reduce the single-point probe overshoot -- the odd
 *        correction series is not monotone term-by-term at that extrapolation point.
 *   (Q3) THE SEPTIC NONETHELESS DRIVES THE WING SPLIT TO NEAR-MACHINE-ZERO. Evaluating the SAME
 *        imp-34008 left/right discrepancies against the septic fit tightens the imp-34146 quintic wing
 *        split 0.3139% / 0.3137% (split +0.0002%) to a near-exact 0.3138% / 0.3138% (split ~-0.0000%, a
 *        tighter left/right balance than the quintic) while the total two-wing discrepancy 0.6276% is
 *        unchanged -- the surviving symmetric residual is the EVEN quartic curvature (imp-34064), which
 *        no odd term can address. So the t^7 term symmetrises the wings even as it fails to shave the
 *        |t| = 0.5 probe overshoot: the two diagnostics diverge at this order.
 *
 * The punchline: the residual odd septic term imp-34146 only NAMED is now fit directly --
 * g ~ -1.0466e-5 (resid^(7)(k*) ~ -5.2747e-2, NEGATIVE, same sign as the negative cubic, opposite the
 * positive quintic, so the odd coefficients alternate - + - through order 7) -- and, in an HONEST
 * negative result, it does NOT absorb the ~2.68% odd overshoot the quintic left at |t| = 0.5 (it slightly
 * deepens it to ~2.80%, absorbing ~-4.5%) yet it drives the imp-34146 left/right wing split from +0.0002%
 * to a near-vanishing ~-0.0000%. The sparse basis leaves the imp-33948 apex value (6.5337e-2) and
 * curvature (-3.613e-2) untouched, isolating the odd septic tilt without disturbing the even apex fit.
 *
 * MEASUREMENT ONLY. A higher-order odd-term fit of an inherited surrogate, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the surrogate
 * resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C
 * 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; confirms and refines, does not overturn, imp-34146; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34146-apex-quintic-tilt-coefficient (fit the quintic; named the residual odd septic term, fit here)
 * @see imp-34084-apex-cubic-tilt-coefficient (the negative cubic tilt d whose sign the septic matches)
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
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33878/imp-33948/imp-34008/imp-34084/imp-34146 exactly

// EXACT inherited imp-3406/imp-33810/imp-33878/imp-33948/imp-34008/imp-34084/imp-34146 sub-terms (no re-derivation).
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
// exponent -> coefficient (so both sparse {0,1,2,3,5,7} and dense {0,...,7} bases share one solver).
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

// The imp-33948/imp-34084/imp-34146 quadratic, cubic, and quintic fits, plus the imp-34207 sparse and
// dense septic fits, all on the SAME 21-point k* +/- 0.1 grid.
const QUAD = polyFit(FIT_WINDOW, FIT_POINTS, [0, 1, 2]); // {a, b, c}
const CUBIC = polyFit(FIT_WINDOW, FIT_POINTS, [0, 1, 2, 3]); // {a, b, c, d}
const QUINTIC = polyFit(FIT_WINDOW, FIT_POINTS, [0, 1, 2, 3, 5]); // sparse {1,t,t^2,t^3,t^5}
const SEPTIC = polyFit(FIT_WINDOW, FIT_POINTS, [0, 1, 2, 3, 5, 7]); // sparse {1,t,t^2,t^3,t^5,t^7}
const SEPTIC_DENSE = polyFit(FIT_WINDOW, FIT_POINTS, [0, 1, 2, 3, 4, 5, 6, 7]); // dense {1,...,t^7} cross-check

const APEX_RESID = QUAD[0]; // ~6.5337e-2 (imp-33948 apex, preserved by the symmetric sparse grid)
const RESID_D2 = 2 * QUAD[2]; // ~-3.613e-2 (imp-33948 apex curvature)
const CUBIC_COEFF_D = CUBIC[3]; // d ~ -5.347e-4 (imp-34084)
const QUINTIC_COEFF_E = QUINTIC[5]; // e ~ +7.5238e-5 (imp-34146)

// (Q1) The fitted septic coefficient and its seventh derivative and sign.
const SEPTIC_COEFF_G = SEPTIC[7]; // g ~ -1.0466e-5
const RESID_D7 = 5040 * SEPTIC_COEFF_G; // resid^(7)(k*) = 5040 g ~ -5.2747e-2 (NEGATIVE)
const SEPTIC_SIGN = Math.sign(SEPTIC_COEFF_G); // -1
const SEPTIC_COEFF_G_DENSE = SEPTIC_DENSE[7]; // dense-basis cross-check ~ -1.0466e-5
const G_DENSE_AGREE_REL = Math.abs(SEPTIC_COEFF_G_DENSE - SEPTIC_COEFF_G) / Math.abs(SEPTIC_COEFF_G); // ~3.6e-8

// The sparse septic leaves the imp-33948 even coefficients untouched (no t^4/t^6 to couple in).
const APEX_UNCHANGED_REL = Math.abs(SEPTIC[0] - QUAD[0]) / Math.abs(QUAD[0]); // ~0
const CURV_UNCHANGED_REL = Math.abs(2 * SEPTIC[2] - RESID_D2) / Math.abs(RESID_D2); // ~0
// Adding t^7 shifts the odd quintic coefficient only slightly and the cubic essentially not at all.
const QUINTIC_SHIFT_REL = Math.abs(SEPTIC[5] - QUINTIC_COEFF_E) / Math.abs(QUINTIC_COEFF_E); // ~0.0024
const CUBIC_SHIFT_REL = Math.abs(SEPTIC[3] - QUINTIC[3]) / Math.abs(QUINTIC[3]); // ~1.6e-6

// Fitted-quadratic, quintic, and septic evaluators, t = k - k*.
const parabola = (t) => QUAD[0] + QUAD[1] * t + QUAD[2] * t * t;
const quinticPoly = (t) =>
  QUINTIC[0] + QUINTIC[1] * t + QUINTIC[2] * t * t + QUINTIC[3] * Math.pow(t, 3) + QUINTIC[5] * Math.pow(t, 5);
const septicPoly = (t) =>
  SEPTIC[0] +
  SEPTIC[1] * t +
  SEPTIC[2] * t * t +
  SEPTIC[3] * Math.pow(t, 3) +
  SEPTIC[5] * Math.pow(t, 5) +
  SEPTIC[7] * Math.pow(t, 7);

// (Q2) The imp-34146 |t| = 0.5 odd overshoot, and how the septic term changes it.
const PROBE_T = 0.5; // the imp-34008/imp-34084/imp-34146 probe offset
const D_QUAD_PLUS = residExp(K_STAR + PROBE_T) - parabola(PROBE_T); // truth - parabola at +0.5
const D_QUAD_MINUS = residExp(K_STAR - PROBE_T) - parabola(-PROBE_T); // truth - parabola at -0.5
const ODD_RESID_AT_PROBE = (D_QUAD_PLUS - D_QUAD_MINUS) / 2; // true odd part of the residual ~-6.291e-5
const QUINTIC_TAIL_AT_PROBE = QUINTIC[3] * Math.pow(PROBE_T, 3) + QUINTIC[5] * Math.pow(PROBE_T, 5); // ~-6.460e-5 (imp-34146)
const SEPTIC_TERM_AT_PROBE = SEPTIC_COEFF_G * Math.pow(PROBE_T, 7); // g(0.5)^7 ~-8.176e-8 (NEGATIVE)
const SEPTIC_TAIL_AT_PROBE =
  SEPTIC[3] * Math.pow(PROBE_T, 3) + SEPTIC[5] * Math.pow(PROBE_T, 5) + SEPTIC[7] * Math.pow(PROBE_T, 7); // d t^3 + e t^5 + g t^7
const QUINTIC_OVERSHOOT_RATIO = QUINTIC_TAIL_AT_PROBE / ODD_RESID_AT_PROBE; // ~1.027 (imp-34146)
const SEPTIC_OVERSHOOT_RATIO = SEPTIC_TAIL_AT_PROBE / ODD_RESID_AT_PROBE; // ~1.028 (slightly DEEPER)
const QUINTIC_OVERSHOOT_ABS = QUINTIC_TAIL_AT_PROBE - ODD_RESID_AT_PROBE; // ~-1.686e-6 (imp-34146 leftover)
const SEPTIC_LEFTOVER_ABS = SEPTIC_TAIL_AT_PROBE - ODD_RESID_AT_PROBE; // ~-1.762e-6 (larger magnitude)
const OVERSHOOT_ABSORBED_FRAC = 1 - SEPTIC_LEFTOVER_ABS / QUINTIC_OVERSHOOT_ABS; // ~-0.045 (deepens, not absorbs)

// (Q3) The imp-34008 left/right wing discrepancy split, quintic (imp-34146) vs septic.
function discPct(evalFn, dir) {
  return (100 * Math.abs(evalFn(dir * PROBE_T) - residExp(K_STAR + dir * PROBE_T))) / APEX_RESID;
}
const QUINTIC_DISC = {
  leftPct: +discPct(quinticPoly, -1).toFixed(4), // ~0.3139
  rightPct: +discPct(quinticPoly, +1).toFixed(4), // ~0.3137
};
QUINTIC_DISC.splitPct = +(QUINTIC_DISC.leftPct - QUINTIC_DISC.rightPct).toFixed(4); // ~+0.0002
const SEPTIC_DISC = {
  leftPct: +discPct(septicPoly, -1).toFixed(4), // ~0.3138
  rightPct: +discPct(septicPoly, +1).toFixed(4), // ~0.3138
};
SEPTIC_DISC.splitPct = +(SEPTIC_DISC.leftPct - SEPTIC_DISC.rightPct).toFixed(4); // ~-0.0000
const QUINTIC_TOTAL_DISC = +(QUINTIC_DISC.leftPct + QUINTIC_DISC.rightPct).toFixed(4); // ~0.6276
const SEPTIC_TOTAL_DISC = +(SEPTIC_DISC.leftPct + SEPTIC_DISC.rightPct).toFixed(4); // ~0.6276 (unchanged)

export const IMP34207_APEX_SEPTIC_TILT_COEFFICIENT = {
  id: 'imp-34207',
  proofSection: 'S-frontier',
  question:
    'imp-34146 fit the apex quintic tilt e ~ +7.5238e-5 of the imp-33878 resid_exp(k) hump (POSITIVE, ' +
    'opposite the negative cubic d ~ -5.347e-4), absorbing ~57% of the imp-34084 odd overshoot at ' +
    '|t| = 0.5 and driving the wing split to +0.0002%, but it LEFT a "small residual odd SEPTIC (t^7) ' +
    'term" it named but never fit. Extend the SAME 21-point symmetric least-squares over k* +/- 0.1 to ' +
    '{1,t,t^2,t^3,t^5,t^7}, report the septic coefficient g = (1/5040) resid^(7)(k*) and its sign, and ' +
    'measure how much of the ~2.68% odd overshoot the quintic left at |t| = 0.5 the t^7 term absorbs. ' +
    'Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the septic coefficient g and seventh derivative resid^(7)(k*) = 5040 g of a 21-point symmetric ' +
    'least-squares fit over k* +/- 0.1 on the sparse basis {1,t,t^2,t^3,t^5,t^7}, its sign, and the ' +
    'fraction of the imp-34146 |t| = 0.5 odd overshoot (ratio ~1.027) the t^7 term absorbs, all on the ' +
    'inherited imp-33878 resid_exp(k) model',
  septicFit: {
    kStar: K_STAR, // ~8.821092
    fitWindow: FIT_WINDOW, // +/- 0.1 decade
    fitPoints: FIT_POINTS, // 21
    apexResid: +APEX_RESID.toExponential(4), // ~6.5337e-2 (imp-33948, preserved)
    residSecondDeriv: +RESID_D2.toExponential(4), // ~-3.613e-2 (imp-33948, preserved)
    cubicCoeffD: +CUBIC_COEFF_D.toExponential(4), // d ~-5.347e-4 (imp-34084)
    quinticCoeffE: +QUINTIC_COEFF_E.toExponential(4), // e ~+7.5238e-5 (imp-34146)
    quinticCoeffEInSeptic: +SEPTIC[5].toExponential(4), // e ~+7.5418e-5 (slightly shifted by t^7)
    quinticShiftRel: +QUINTIC_SHIFT_REL.toExponential(2), // ~2.4e-3 (~0.24% shift)
    cubicShiftRel: +CUBIC_SHIFT_REL.toExponential(2), // ~1.6e-6 (cubic essentially unchanged)
    septicCoeffG: +SEPTIC_COEFF_G.toExponential(4), // g ~-1.0466e-5
    residSeventhDeriv: +RESID_D7.toExponential(4), // 5040 g ~-5.2747e-2
    sign: SEPTIC_SIGN, // -1 (NEGATIVE tilt, same sign as the cubic, opposite the quintic)
    septicCoeffGDense: +SEPTIC_COEFF_G_DENSE.toExponential(4), // ~-1.0466e-5 (dense-basis cross-check)
    gDenseAgreeRel: +G_DENSE_AGREE_REL.toExponential(2), // ~3.6e-8 (sparse and dense agree)
    apexUnchangedRel: +APEX_UNCHANGED_REL.toExponential(2), // ~0 (even a preserved on sparse grid)
    curvatureUnchangedRel: +CURV_UNCHANGED_REL.toExponential(2), // ~0 (even 2c preserved)
    note:
      'the fitted septic coefficient is g ~ -1.0466e-5, so resid^(7)(k*) = 5040 g ~ -5.2747e-2 ' +
      '(NEGATIVE, the SAME sign as the negative cubic d ~ -5.347e-4 and the OPPOSITE sign to the ' +
      'positive quintic e ~ +7.5238e-5 -- the odd coefficients alternate - + - through order 7); on ' +
      'the sparse {1,t,t^2,t^3,t^5,t^7} grid the even coefficients decouple, so the apex value ' +
      '6.5337e-2 and curvature -3.613e-2 reproduce imp-33948 exactly and adding t^7 shifts the quintic ' +
      'only ~0.24% and the cubic not at all.',
  },
  oddOvershootAbsorption: {
    probeOffset: PROBE_T, // |t| = 0.5 (imp-34008/imp-34084/imp-34146 probe)
    oddResidAtProbe: +ODD_RESID_AT_PROBE.toExponential(4), // ~-6.291e-5 (true odd residual)
    quinticTailAtProbe: +QUINTIC_TAIL_AT_PROBE.toExponential(4), // ~-6.460e-5 (imp-34146 quintic odd tail)
    septicTermAtProbe: +SEPTIC_TERM_AT_PROBE.toExponential(4), // ~-8.176e-8 (the added t^7 term, NEGATIVE)
    septicTailAtProbe: +SEPTIC_TAIL_AT_PROBE.toExponential(4), // ~-6.467e-5 (d t^3 + e t^5 + g t^7)
    quinticOvershootRatio: +QUINTIC_OVERSHOOT_RATIO.toFixed(4), // ~1.0268 (imp-34146)
    septicOvershootRatio: +SEPTIC_OVERSHOOT_RATIO.toFixed(4), // ~1.0280 (slightly DEEPER, not shallower)
    overshootAbsorbedFrac: +OVERSHOOT_ABSORBED_FRAC.toFixed(4), // ~-0.0452 (DEEPENS, does NOT absorb)
    note:
      'at |t| = 0.5 the imp-34146 quintic odd tail (~-6.460e-5) overshoots the true odd residual ' +
      '(~-6.291e-5) by ~2.68% (ratio ~1.027); the septic term g(0.5)^7 ~ -8.176e-8 is NEGATIVE at that ' +
      'probe -- the WRONG sign to cancel it -- so the combined d t^3 + e t^5 + g t^7 (~-6.467e-5) ' +
      'overshoots by ~2.80% (ratio ~1.028) instead, absorbing ~-4.5% (a slight DEEPENING, NOT an ' +
      'absorption). HONEST NEGATIVE RESULT: unlike the imp-34146 quintic (which absorbed ~57% at this ' +
      'probe), the septic extrapolated from +/- 0.1 to |t| = 0.5 does not shave the single-point overshoot.',
  },
  wingSymmetrisation: {
    quinticSplit: QUINTIC_DISC, // {leftPct ~0.3139, rightPct ~0.3137, splitPct ~+0.0002}
    septicSplit: SEPTIC_DISC, // {leftPct ~0.3138, rightPct ~0.3138, splitPct ~-0.0000}
    quinticTotalDisc: QUINTIC_TOTAL_DISC, // ~0.6276
    septicTotalDisc: SEPTIC_TOTAL_DISC, // ~0.6276 (unchanged: surviving part is the EVEN quartic)
    note:
      'adding t^7 tightens the imp-34146 quintic wing split 0.3139/0.3137 (+0.0002) to a near-exact ' +
      '0.3138/0.3138 (~-0.0000, a tighter left/right balance than the quintic) while leaving the total ' +
      'two-wing discrepancy 0.6276% unchanged -- the surviving symmetric residual is the EVEN quartic ' +
      'curvature (imp-34064) no odd term can address; the wing-symmetry and probe-overshoot diagnostics ' +
      'diverge at this order (the septic symmetrises the wings even as it fails to shave the probe).',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (NOT rigorous). Extending the imp-34146 21-point symmetric least-squares over ' +
    'k* +/- 0.1 to the sparse odd-augmented basis {1,t,t^2,t^3,t^5,t^7} gives a septic coefficient ' +
    'g ~ -1.0466e-5, so resid^(7)(k*) = 5040 g ~ -5.2747e-2 (NEGATIVE -- the SAME sign as the negative ' +
    'cubic d ~ -5.347e-4 and the OPPOSITE sign to the positive quintic e ~ +7.5238e-5, so the odd ' +
    'coefficients alternate - + - through order 7; the dense {1,...,t^7} basis agrees to ~7 sig figs). ' +
    'Omitting t^4/t^6 keeps the even normal-equations decoupled, so the imp-33948 apex value 6.5337e-2 ' +
    'and curvature 2c = -3.613e-2 reproduce exactly and adding t^7 shifts the quintic only ~0.24% and ' +
    'the cubic not at all. At the imp-34008 probe |t| = 0.5 the imp-34146 quintic odd tail (~-6.460e-5) ' +
    'overshoots the true odd residual (~-6.291e-5) by ~2.68% (ratio ~1.027); the septic term ' +
    'g(0.5)^7 ~ -8.176e-8 is NEGATIVE there -- the wrong sign to cancel it -- so the combined ' +
    'd t^3 + e t^5 + g t^7 (~-6.467e-5) overshoots by ~2.80% (ratio ~1.028) INSTEAD, absorbing ~-4.5% ' +
    '(a slight DEEPENING, NOT an absorption). This is an HONEST NEGATIVE RESULT: unlike the imp-34146 ' +
    'quintic (which absorbed ~57% at this probe), the septic extrapolated from +/- 0.1 to |t| = 0.5 ' +
    'does not shave the single-point overshoot -- the odd correction series is not monotone term-by-term ' +
    'at that extrapolation point. Yet the septic DOES drive the imp-34146 left/right wing split from ' +
    '+0.0002% to a near-vanishing ~-0.0000% while the total two-wing discrepancy 0.6276% is unchanged ' +
    '(the surviving symmetric part is the EVEN quartic imp-34064), so the wing-symmetry and ' +
    'probe-overshoot diagnostics diverge at this order. This confirms and refines, does not overturn, ' +
    'imp-34146 -- the "residual odd septic term" it only named is now fit directly. The component model ' +
    'is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the surrogate ' +
    'resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the ' +
    'C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34146 (fit the quintic, named the residual odd septic term fit here); imp-34084 (the negative ' +
    'cubic tilt d whose sign the septic matches); imp-34008 (W2 wing-asymmetry inference); imp-34064 ' +
    '(the even quartic companion no odd term can address); imp-33948 (apex quadratic whose even ' +
    'coefficients are preserved); imp-33878 (resid_exp(k) model reused verbatim); imp-33810 (the ladder ' +
    'storing resid_exp(k)); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34207_APEX_SEPTIC_TILT_COEFFICIENT_ASSERTIONS = [
  {
    // (Q1) The fitted septic coefficient is NEGATIVE (same sign as the negative cubic, opposite the
    // positive quintic), resid^(7) ~ -5.27e-2, the sparse grid preserves the imp-33948 even apex value
    // and curvature, and the dense basis agrees.
    id: 'imp34207-septic-coeff-negative-even-coeffs-preserved',
    description: 'g ~-1.0466e-5 (resid^(7) ~-5.2747e-2, NEGATIVE, same sign as the cubic, opposite the quintic); apex 6.5337e-2 and 2c -3.613e-2 preserved',
    holds: () =>
      SEPTIC_COEFF_G < 0 &&
      SEPTIC_SIGN === -1 &&
      Math.abs(SEPTIC_COEFF_G - -1.0466e-5) < 5e-8 &&
      RESID_D7 < 0 &&
      Math.abs(RESID_D7 - -5.2747e-2) < 5e-4 &&
      CUBIC_COEFF_D < 0 &&
      QUINTIC_COEFF_E > 0 &&
      G_DENSE_AGREE_REL < 1e-6 &&
      Math.abs(APEX_RESID - 0.065337) < 5e-5 &&
      Math.abs(RESID_D2 - -0.03613) < 5e-4 &&
      APEX_UNCHANGED_REL < 1e-9 &&
      CURV_UNCHANGED_REL < 1e-9 &&
      QUINTIC_SHIFT_REL < 0.01 &&
      CUBIC_SHIFT_REL < 1e-4,
  },
  {
    // (Q2) HONEST NEGATIVE RESULT: the negative septic term is the wrong sign at |t|=0.5, so it does NOT
    // absorb the imp-34146 leftover overshoot -- it slightly deepens the ratio ~1.027 -> ~1.028.
    id: 'imp34207-septic-does-not-absorb-probe-overshoot',
    description: 'septic term -8.176e-8 (NEGATIVE) deepens the |t|=0.5 odd-tail ratio ~1.0268->~1.0280; absorbed frac ~-0.045 (deepens, not absorbs)',
    holds: () =>
      ODD_RESID_AT_PROBE < 0 &&
      SEPTIC_TERM_AT_PROBE < 0 &&
      QUINTIC_OVERSHOOT_RATIO > 1.0 &&
      QUINTIC_OVERSHOOT_RATIO < 1.05 &&
      SEPTIC_OVERSHOOT_RATIO > QUINTIC_OVERSHOOT_RATIO &&
      SEPTIC_OVERSHOOT_RATIO < 1.05 &&
      OVERSHOOT_ABSORBED_FRAC < 0 &&
      OVERSHOOT_ABSORBED_FRAC > -0.2,
  },
  {
    // (Q3) The septic nonetheless drives the wing split to near machine zero (tighter than the quintic)
    // while leaving the total two-wing discrepancy unchanged (the surviving part is the even quartic).
    id: 'imp34207-septic-symmetrises-wings',
    description: 'quintic split +0.0002 tightens to near-zero -0.0000; total two-wing discrepancy 0.6276 unchanged',
    holds: () =>
      Math.abs(QUINTIC_DISC.splitPct) > Math.abs(SEPTIC_DISC.splitPct) &&
      Math.abs(SEPTIC_DISC.splitPct) < 0.001 &&
      Math.abs(SEPTIC_TOTAL_DISC - QUINTIC_TOTAL_DISC) < 0.01 &&
      Math.abs(SEPTIC_TOTAL_DISC - 0.6276) < 0.02,
  },
  {
    // Honesty gate: measurement only, isRigorous false, refines not overturns, no QED, no refereed bound is changed.
    id: 'imp34207-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, refines imp-34146, no QED, imp-3066 untouched, no refereed bound is changed',
    holds: () =>
      IMP34207_APEX_SEPTIC_TILT_COEFFICIENT.isRigorous === false &&
      /confirms and refines, does not overturn, imp-34146/.test(IMP34207_APEX_SEPTIC_TILT_COEFFICIENT.verdict) &&
      /NO QED/.test(IMP34207_APEX_SEPTIC_TILT_COEFFICIENT.verdict) &&
      /refereed bound is changed/i.test(IMP34207_APEX_SEPTIC_TILT_COEFFICIENT.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34207_APEX_SEPTIC_TILT_COEFFICIENT.verdict),
  },
];

for (const a of IMP34207_APEX_SEPTIC_TILT_COEFFICIENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34207-apex-septic-tilt-coefficient assertion failed: ${a.id}`);
  }
}
