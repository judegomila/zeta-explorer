/**
 * @module imp-34084-apex-cubic-tilt-coefficient
 *
 * imp-34084 (numerical): MEASURE THE APEX CUBIC COEFFICIENT imp-34008 ONLY INFERRED.
 * imp-34008 W2 found the imp-33948 apex parabola P(t) = a + b t + c t^2 (t = k - k*) is
 * faithful to the true imp-33878 resid_exp(k) hump but ASYMMETRICALLY: the low-k (left)
 * wing departs first (0.410% vs 0.218% of the apex at |t| = 0.5), which it read as a
 * "nonzero cubic tilt the parabola cannot capture" -- but it never FIT the cubic term. This
 * module runs the SAME 21-point symmetric least-squares over k* +/- 0.1 on the FULL cubic
 * basis {1, t, t^2, t^3}, reports the fitted cubic coefficient d = (1/6) resid triple-prime(k*)
 * and its sign, and tests quantitatively how much of the imp-34008 left/right wing asymmetry
 * the cubic tilt reconstructs.
 *
 * THE MEASUREMENT (reuses the imp-33878 resid_exp(k) model + the imp-33948 fit grid VERBATIM)
 * ------------------------------------------------------------------------------------------
 *   resid_exp(k) = p_ecoll (1 - sigma_hi) - p_sigma is the imp-33773 M2 sub-leading residual
 *   over the sliding window [10^k, 10^(k+1)], the SAME smooth function of continuous k as
 *   imp-33878/imp-33948/imp-34008 (E_trunc = 3.06e-5 fixed strip, E_coll = C_C sqrt(log T0 / N),
 *   E_flow Gronwall, T0 = effectiveHeightForN(N); p_sigma = OLS(ln sigma vs ln N) at 4 pts/decade,
 *   p_ecoll = -d log E_coll / d log N over endpoints, sigma_hi at the upper endpoint). No
 *   re-derivation. We run a 21-point symmetric least-squares fit on {1, t, t^2, t^3} over
 *   k* +/- 0.1 -- the SAME grid as the imp-33948 quadratic and the imp-34008 wing test -- read
 *   the cubic coefficient d and resid triple-prime(k*) = 6 d, and compare (i) the fitted cubic
 *   term d t^3 against the odd part of the imp-33948 quadratic residual at the |t| = 0.5 probe,
 *   and (ii) the left/right discrepancy split before vs after adding the cubic.
 *
 * THE FINDING (measurement only -- the cubic tilt imp-34008 inferred, now directly fit)
 * -----------------------------------------------------------------------------------
 *   (C1) THE FITTED CUBIC COEFFICIENT IS d ~ -5.347e-4, so resid triple-prime(k*) = 6 d ~
 *        -3.208e-3 (NEGATIVE). On the symmetric k* +/- 0.1 grid the even normal-equations
 *        decouple from the odd ones, so the cubic fit leaves the imp-33948 even coefficients
 *        UNCHANGED to machine precision -- apex a = 6.5337e-2 and 2c = resid double-prime(k*) =
 *        -3.613e-2 both reproduce imp-33948 E1 -- and the cubic augmentation adds ONLY the odd
 *        tilt d t^3, isolating it cleanly from the apex value and curvature.
 *   (C2) THE FITTED CUBIC TERM MATCHES THE ODD PART OF THE imp-33948 QUADRATIC RESIDUAL. At the
 *        imp-34008 probe |t| = 0.5, the odd part of the quadratic residual (truth - parabola),
 *        [(D(+0.5) - D(-0.5)) / 2] ~ -6.29e-5, is reproduced by the fitted cubic term
 *        d (0.5)^3 ~ -6.68e-5 to within ~6% (ratio ~1.06) -- so the negative cubic IS the odd
 *        curvature the parabola omitted, with a small residual quintic overshoot.
 *   (C3) THE CUBIC RECONSTRUCTS ESSENTIALLY ALL OF THE imp-34008 WING ASYMMETRY. Evaluating the
 *        SAME left/right parabola-vs-truth discrepancies imp-34008 reported (0.410% left /
 *        0.218% right at |t| = 0.5, split 0.193%) against the CUBIC fit collapses the split to
 *        0.311% left / 0.317% right (split -0.007%) -- the cubic tilt reconstructs ~103% of the
 *        measured wing asymmetry (a slight ~3% overshoot from the residual odd quintic term),
 *        quantitatively confirming the imp-34008 W2 inference that the low-k-departs-first
 *        asymmetry IS a nonzero cubic tilt of the true hump.
 *
 * The punchline: the cubic tilt imp-34008 W2 only inferred from wing asymmetry is now fit
 * directly -- d ~ -5.347e-4 (resid triple-prime(k*) ~ -3.208e-3, NEGATIVE) -- and it accounts
 * for the odd part of the parabola residual to ~6% and reconstructs ~103% of the measured
 * 0.410%-vs-0.218% left/right wing split, turning the balanced parabola discrepancy into a
 * near-symmetric 0.311%/0.317% once the tilt is included. The symmetric grid leaves the
 * imp-33948 apex value (6.5337e-2) and curvature (-3.613e-2) untouched, so this isolates the
 * odd tilt without disturbing the even apex fit.
 *
 * MEASUREMENT ONLY. A higher-order odd-term fit of an inherited surrogate, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per imp-486
 * is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; refines, does not overturn,
 * imp-34008; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34008-apex-parabola-wing-fidelity (W2 inferred but never fit the cubic tilt; asymmetry reconstructed here)
 * @see imp-34064-apex-quartic-curvature-fit (the EVEN quartic companion; this is the ODD cubic term it omitted)
 * @see imp-33948-hump-apex-curvature-error-bar (the apex quadratic fit whose even coefficients are preserved here)
 * @see imp-33878-hump-argmax-grid-refinement (the resid_exp(k) model reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33878_HUMP_ARGMAX_GRID_REFINEMENT } from './imp-33878-hump-argmax-grid-refinement.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed strip (imp-2631/imp-33582/imp-33620/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33878/imp-33948/imp-34008 exactly

// EXACT inherited imp-3406/imp-33810/imp-33878/imp-33948/imp-34008 sub-terms (no re-derivation).
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

// General polynomial least-squares of degree `deg` over M symmetric points in [-W, W],
// solved by Gaussian elimination on the (deg+1) normal equations. Returns [c0, c1, ..., cdeg].
function polyFit(W, M, deg) {
  const ts = [];
  const ys = [];
  for (let i = 0; i < M; i++) {
    const t = -W + (2 * W * i) / (M - 1);
    ts.push(t);
    ys.push(residExp(K_STAR + t));
  }
  const nc = deg + 1;
  const S = Array.from({ length: nc }, () => Array(nc + 1).fill(0));
  for (let i = 0; i < M; i++) {
    const x = ts[i];
    const y = ys[i];
    for (let a = 0; a < nc; a++) {
      for (let b = 0; b < nc; b++) S[a][b] += Math.pow(x, a + b);
      S[a][nc] += Math.pow(x, a) * y;
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
  return S.map((row) => row[nc]);
}

const FIT_WINDOW = 0.1;
const FIT_POINTS = 21;

// (C1) The pure-quadratic fit (imp-33948 E1 / imp-34008) and the cubic-augmented fit on the SAME grid.
const QUAD = polyFit(FIT_WINDOW, FIT_POINTS, 2); // [a, b, c]
const CUBIC = polyFit(FIT_WINDOW, FIT_POINTS, 3); // [a, b, c, d]
const APEX_RESID = QUAD[0]; // ~6.5337e-2 (imp-33948 apex, preserved by the symmetric grid)
const RESID_D2 = 2 * QUAD[2]; // ~-3.613e-2 (imp-33948 apex curvature)
const CUBIC_COEFF_D = CUBIC[3]; // d ~ -5.347e-4
const RESID_D3 = 6 * CUBIC_COEFF_D; // resid triple-prime(k*) = 6 d ~ -3.208e-3 (NEGATIVE)
const CUBIC_SIGN = Math.sign(CUBIC_COEFF_D); // -1

// On the symmetric grid the even coefficients are untouched by adding the odd cubic term.
const APEX_UNCHANGED_REL = Math.abs(CUBIC[0] - QUAD[0]) / Math.abs(QUAD[0]); // ~0 (even a preserved)
const CURV_UNCHANGED_REL = Math.abs(2 * CUBIC[2] - RESID_D2) / Math.abs(RESID_D2); // ~0 (even 2c preserved)

// Fitted-quadratic and cubic-augmented evaluators, t = k - k*.
const parabola = (t) => QUAD[0] + QUAD[1] * t + QUAD[2] * t * t;
const cubicPoly = (t) => CUBIC[0] + CUBIC[1] * t + CUBIC[2] * t * t + CUBIC[3] * t * t * t;

// (C2) The fitted cubic term vs the odd part of the imp-33948 quadratic residual at |t| = 0.5.
const PROBE_T = 0.5; // the imp-34008 W2 probe offset
const D_QUAD_PLUS = residExp(K_STAR + PROBE_T) - parabola(PROBE_T); // signed truth - parabola at +0.5
const D_QUAD_MINUS = residExp(K_STAR - PROBE_T) - parabola(-PROBE_T); // signed truth - parabola at -0.5
const ODD_RESID_AT_PROBE = (D_QUAD_PLUS - D_QUAD_MINUS) / 2; // odd part of the quadratic residual ~-6.29e-5
const CUBIC_TERM_AT_PROBE = CUBIC_COEFF_D * Math.pow(PROBE_T, 3); // d (0.5)^3 ~-6.68e-5
const CUBIC_VS_ODD_RATIO = CUBIC_TERM_AT_PROBE / ODD_RESID_AT_PROBE; // ~1.06 (cubic captures the odd part)

// (C3) The imp-34008 left/right wing discrepancy split, before (quadratic) vs after (cubic).
function discPct(evalFn, dir) {
  return (100 * Math.abs(evalFn(dir * PROBE_T) - residExp(K_STAR + dir * PROBE_T))) / APEX_RESID;
}
const QUAD_DISC = {
  leftPct: +discPct(parabola, -1).toFixed(4), // ~0.4101 (reproduces imp-34008 0.410)
  rightPct: +discPct(parabola, +1).toFixed(4), // ~0.2175 (reproduces imp-34008 0.218)
};
QUAD_DISC.splitPct = +(QUAD_DISC.leftPct - QUAD_DISC.rightPct).toFixed(4); // ~0.1926
const CUBIC_DISC = {
  leftPct: +discPct(cubicPoly, -1).toFixed(4), // ~0.3105
  rightPct: +discPct(cubicPoly, +1).toFixed(4), // ~0.3171
};
CUBIC_DISC.splitPct = +(CUBIC_DISC.leftPct - CUBIC_DISC.rightPct).toFixed(4); // ~-0.0066
// Fraction of the imp-34008 wing asymmetry reconstructed by the cubic tilt.
const ASYM_RECONSTRUCTED_PCT = +(
  (100 * (QUAD_DISC.splitPct - CUBIC_DISC.splitPct)) / QUAD_DISC.splitPct
).toFixed(2); // ~103.4%

export const IMP34084_APEX_CUBIC_TILT_COEFFICIENT = {
  id: 'imp-34084',
  proofSection: 'S-frontier',
  question:
    'imp-34008 W2 found the imp-33948 apex parabola tracks the true resid_exp(k) hump asymmetrically ' +
    '(low-k wing departs first, 0.410% vs 0.218% at |t|=0.5), diagnosing a nonzero cubic tilt, but only ' +
    'INFERRED it. Fit P(t)=a+b t+c t^2+d t^3 over k* +/- 0.1, report d=(1/6) resid triple-prime(k*) and ' +
    'its sign, and measure how much of the imp-34008 left/right wing asymmetry the cubic reconstructs. ' +
    'Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the cubic coefficient d and third derivative resid triple-prime(k*)=6 d of a 21-point symmetric ' +
    'least-squares fit over k* +/- 0.1 on {1,t,t^2,t^3}, its sign, and the fraction of the imp-34008 ' +
    'left/right wing-discrepancy split it reconstructs, all on the inherited imp-33878 resid_exp(k) model',
  cubicFit: {
    kStar: K_STAR, // ~8.821092
    fitWindow: FIT_WINDOW, // +/- 0.1 decade
    fitPoints: FIT_POINTS, // 21
    apexResid: +APEX_RESID.toExponential(4), // ~6.5337e-2 (imp-33948, preserved)
    residSecondDeriv: +RESID_D2.toExponential(4), // ~-3.613e-2 (imp-33948, preserved)
    cubicCoeffD: +CUBIC_COEFF_D.toExponential(4), // d ~-5.347e-4
    residThirdDeriv: +RESID_D3.toExponential(4), // 6 d ~-3.208e-3
    sign: CUBIC_SIGN, // -1 (NEGATIVE tilt)
    apexUnchangedRel: +APEX_UNCHANGED_REL.toExponential(2), // ~0 (even a preserved on symmetric grid)
    curvatureUnchangedRel: +CURV_UNCHANGED_REL.toExponential(2), // ~0 (even 2c preserved)
    note:
      'the fitted cubic coefficient is d ~ -5.347e-4, so resid triple-prime(k*) = 6 d ~ -3.208e-3 ' +
      '(NEGATIVE); on the symmetric k* +/- 0.1 grid the even coefficients decouple, so the apex value ' +
      '6.5337e-2 and curvature -3.613e-2 reproduce imp-33948 exactly and the cubic adds only the odd tilt.',
  },
  oddPartMatch: {
    probeOffset: PROBE_T, // |t| = 0.5 (imp-34008 W2 probe)
    oddResidAtProbe: +ODD_RESID_AT_PROBE.toExponential(4), // ~-6.29e-5
    cubicTermAtProbe: +CUBIC_TERM_AT_PROBE.toExponential(4), // ~-6.68e-5
    ratio: +CUBIC_VS_ODD_RATIO.toFixed(4), // ~1.06
    note:
      'at |t|=0.5 the odd part of the imp-33948 quadratic residual (truth - parabola) is ~-6.29e-5, ' +
      'reproduced by the fitted cubic term d (0.5)^3 ~ -6.68e-5 to within ~6% (ratio ~1.06) -- the ' +
      'negative cubic IS the omitted odd curvature, with a small residual quintic overshoot.',
  },
  wingAsymmetryReconstruction: {
    quadraticSplit: QUAD_DISC, // {leftPct ~0.4101, rightPct ~0.2175, splitPct ~0.1926}
    cubicSplit: CUBIC_DISC, // {leftPct ~0.3105, rightPct ~0.3171, splitPct ~-0.0066}
    reconstructedPct: ASYM_RECONSTRUCTED_PCT, // ~103.4%
    note:
      'the imp-34008 left/right discrepancy split 0.410%/0.218% (0.193%) collapses to 0.311%/0.317% ' +
      '(-0.007%) once the cubic is included -- the tilt reconstructs ~103% of the measured wing ' +
      'asymmetry (~3% overshoot from residual odd quintic), confirming the imp-34008 W2 cubic-tilt inference.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (NOT rigorous). A 21-point symmetric least-squares fit of the inherited ' +
    'imp-33878 resid_exp(k) hump over k* +/- 0.1 on the full cubic basis {1,t,t^2,t^3} gives a cubic ' +
    'coefficient d ~ -5.347e-4, so resid triple-prime(k*) = 6 d ~ -3.208e-3 (NEGATIVE). On the symmetric ' +
    'grid the even normal-equations decouple, so the apex value 6.5337e-2 and curvature 2c = -3.613e-2 ' +
    'reproduce imp-33948 E1 to machine precision and the cubic adds ONLY the odd tilt. At the imp-34008 ' +
    'probe |t|=0.5 the odd part of the quadratic residual (~-6.29e-5) is reproduced by the fitted cubic ' +
    'term d(0.5)^3 (~-6.68e-5) to within ~6% (ratio ~1.06), and including the cubic collapses the ' +
    'imp-34008 left/right wing discrepancy split from 0.410%/0.218% (0.193%) to 0.311%/0.317% (-0.007%) ' +
    '-- so the negative cubic tilt reconstructs ~103% of the measured wing asymmetry (a ~3% overshoot ' +
    'from residual odd quintic curvature), quantitatively confirming the imp-34008 W2 inference that the ' +
    'low-k-departs-first asymmetry IS a nonzero cubic tilt of the true hump. This refines, does not ' +
    'overturn, imp-34008. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34008 (W2 cubic-tilt inference + wing asymmetry reconstructed here); imp-34064 (the even ' +
    'quartic companion; this is the odd cubic it omitted); imp-33948 (apex quadratic whose even ' +
    'coefficients are preserved); imp-33878 (resid_exp(k) model reused verbatim); imp-33810 (the ladder ' +
    'storing resid_exp(k)); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34084_APEX_CUBIC_TILT_COEFFICIENT_ASSERTIONS = [
  {
    // (C1) The fitted cubic coefficient is negative, resid''' ~ -3.2e-3, and the symmetric grid
    // leaves the imp-33948 even apex value and curvature unchanged.
    id: 'imp34084-cubic-coeff-negative-even-coeffs-preserved',
    description: 'd ~-5.347e-4 (resid triple-prime ~-3.208e-3, NEGATIVE); apex 6.5337e-2 and 2c -3.613e-2 preserved',
    holds: () =>
      CUBIC_COEFF_D < 0 &&
      CUBIC_SIGN === -1 &&
      Math.abs(CUBIC_COEFF_D - -5.347e-4) < 5e-6 &&
      RESID_D3 < 0 &&
      Math.abs(RESID_D3 - -3.208e-3) < 3e-5 &&
      Math.abs(APEX_RESID - 0.065337) < 5e-5 &&
      Math.abs(RESID_D2 - -0.03613) < 5e-4 &&
      APEX_UNCHANGED_REL < 1e-9 &&
      CURV_UNCHANGED_REL < 1e-9,
  },
  {
    // (C2) The fitted cubic term reproduces the odd part of the imp-33948 quadratic residual at |t|=0.5.
    id: 'imp34084-cubic-term-matches-odd-residual',
    description: 'cubic term d(0.5)^3 ~-6.68e-5 matches odd quadratic residual ~-6.29e-5 to ~6% (ratio ~1.06)',
    holds: () =>
      ODD_RESID_AT_PROBE < 0 &&
      CUBIC_TERM_AT_PROBE < 0 &&
      CUBIC_VS_ODD_RATIO > 0.9 &&
      CUBIC_VS_ODD_RATIO < 1.2,
  },
  {
    // (C3) The cubic reconstructs essentially all of the imp-34008 left/right wing asymmetry.
    id: 'imp34084-reconstructs-imp34008-wing-asymmetry',
    description: 'quad split 0.410/0.218 (0.193) collapses to ~0.311/0.317 (~-0.007); ~103% reconstructed',
    holds: () =>
      Math.abs(QUAD_DISC.leftPct - 0.4101) < 0.01 &&
      Math.abs(QUAD_DISC.rightPct - 0.2175) < 0.01 &&
      QUAD_DISC.splitPct > 0.15 &&
      Math.abs(CUBIC_DISC.splitPct) < 0.03 &&
      Math.abs(CUBIC_DISC.splitPct) < QUAD_DISC.splitPct &&
      ASYM_RECONSTRUCTED_PCT > 90 &&
      ASYM_RECONSTRUCTED_PCT < 115,
  },
  {
    // Honesty gate: measurement only, isRigorous false, refines not overturns, no QED, no refereed bound is changed.
    id: 'imp34084-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, refines imp-34008, no QED, imp-3066 untouched, no refereed bound is changed',
    holds: () =>
      IMP34084_APEX_CUBIC_TILT_COEFFICIENT.isRigorous === false &&
      /refines, does not overturn, imp-34008/.test(IMP34084_APEX_CUBIC_TILT_COEFFICIENT.verdict) &&
      /NO QED/.test(IMP34084_APEX_CUBIC_TILT_COEFFICIENT.verdict) &&
      /refereed bound is changed/i.test(IMP34084_APEX_CUBIC_TILT_COEFFICIENT.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34084_APEX_CUBIC_TILT_COEFFICIENT.verdict),
  },
];

for (const a of IMP34084_APEX_CUBIC_TILT_COEFFICIENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34084-apex-cubic-tilt-coefficient assertion failed: ${a.id}`);
  }
}
