/**
 * @module imp-34506-four-term-higher-order-coeff-window-stability
 *
 * imp-34506 (numerical, frontier cross-validation): imp-34489 refit the LEADING coefficient a of the four-term
 * numerator-approach fit g(kEnd) = 1 - numerator ~ a/kEnd + b/kEnd^2 + c/kEnd^3 + c4/kEnd^4 across the
 * imp-34286 windows and found a window-stable (0.4349-0.4355) with an order-to-order shift that SHRINKS -- but
 * it only ever inspected a. The HIGHER-order coefficients b (1/kEnd^2), c (1/kEnd^3) and c4 (1/kEnd^4) of that
 * SAME degree-3 least squares were never tabulated across windows. This module tabulates b, c, c4 per window
 * and asks the single question imp-34489 left open: are the higher-order coefficients themselves window-STABLE
 * in sign and magnitude (a genuine converging series), or do they swing sign/scale (an ill-conditioned
 * high-order fit whose only robust output is the intercept a)? It ALSO reports the 4x4 normal-equation
 * condition number per window -- the direct diagnostic of how well-determined those high-order coefficients are.
 *
 * THE SAME FOUR-TERM FIT, READ AT THE HIGHER-ORDER COEFFICIENTS
 * ------------------------------------------------------------
 *   g*kEnd ~ a + b*u + c*u^2 + c4*u^3 with u = 1/kEnd (imp-34489 degree-3 least squares, 4x4 normal equations
 *   M x = T solved by Gaussian elimination with partial pivoting). imp-34489 reported only x[0] = a and the
 *   cubic coefficient x[3] = c4; here x[1] = b and x[2] = c are read off the SAME solve, and the 2-norm
 *   condition number of the symmetric PSD moment matrix M (ratio of its extreme eigenvalues, obtained by power
 *   iteration on M and on M^{-1}) is reported. The fit primitives -- parts, olsSigmaExponent, ecollExponentMag,
 *   numeratorAt, gapAt, solveLinear, the four windows -- are reproduced VERBATIM from imp-34489/imp-34450 (no
 *   re-derivation of the surrogate numerator).
 *
 * FINDING: SIGNS ARE WINDOW-STABLE (b>0, c<0, c4>0 EVERYWHERE) BUT MAGNITUDES ARE WINDOW-DRIVEN, ILL-CONDITIONED
 * ------------------------------------------------------------------------------------------------------------
 *   Across all four imp-34286 windows the higher-order coefficients hold a STRICTLY ALTERNATING sign pattern:
 *   b > 0, c < 0, c4 > 0 -- there is NO sign swing, so the higher-order structure is not sign-random noise.
 *   But their MAGNITUDES are NOT window-invariant: as the window narrows toward the far field each grows
 *   monotonically -- b: 0.2426 (full 22..150) -> 0.3156 (far 40..150) -> 0.3383 (deep 50..150) -> 0.3626
 *   (deep 60..150); c: -9.69 -> -14.31 -> -16.23 -> -18.49; c4: 66.38 -> 154.88 -> 205.03 -> 271.55 (c4 swings
 *   ~4.1x across windows). This magnitude drift tracks the 4x4 normal-equation condition number, which is
 *   ENORMOUS and grows ~3.5 orders of magnitude as the window narrows: 6.08e11 (full) -> 4.20e13 (far) ->
 *   2.85e14 (deep 50) -> 1.97e15 (deep 60). So the high-order coefficients are SIGN-determined but NOT
 *   magnitude-determined: the fit basis (powers of u = 1/kEnd, all small) is severely ill-conditioned, and the
 *   individual b, c, c4 are window-sensitive numbers, not converged series coefficients. This is exactly the
 *   regime in which imp-34489 found the INTERCEPT a nonetheless robust (0.4349-0.4355): a is the one linear
 *   functional of the ill-conditioned solve that the data pins down; the higher-order tail is not.
 *
 * NET. The imp-34489 leading-coefficient stability does NOT extend to the higher-order coefficients as
 * magnitudes -- b, c, c4 are window-driven and fit in a 6e11-2e15-conditioned basis -- but their SIGNS are
 * window-stable (alternating b>0, c<0, c4>0), so the four-term shape is not sign-noise. The robust output of
 * the fit remains the leading coefficient a alone.
 *
 * SCOPE / HONESTY. The underlying numerator STILL uses the inherited imp-3406/imp-33810 quarter-decade OLS
 * exponent estimators (pSigma, pEcoll) verbatim -- this module only READS the higher-order coefficients and the
 * condition number of the SAME imp-34489 solve. Measurement / diagnostic only. The inherited imp-3220/imp-3406
 * component model is NOT a rigorous asymptotic; the coefficients are descriptive within that model only; the
 * condition number confirms the high-order coefficients are ill-determined; changes no bound; establishes no
 * operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34489-numerator-approach-four-term-curvature-crossval (the four-term fit whose b, c, c4 are tabulated here)
 * @see imp-34450-numerator-approach-three-term-curvature-crossval (the three-term fit a-stability)
 * @see imp-34286-numerator-approach-coefficient-fd-crossval (the bias-corrected a ~ 0.437-0.438 band and windows)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. quarter-decade ladder reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N = (T0/2pi)(L0-1), the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-34489 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34489 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// The inherited quarter-decade OLS exponent estimators -- UNCHANGED from imp-34489.
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

// The imp-34087/imp-34151 cancellation numerator |A| + |B| at any endpoint rung (A = pEcoll*(1-sigma)).
function numeratorAt(kEnd) {
  const lo = Math.pow(10, kEnd);
  const hi = Math.pow(10, kEnd + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const s = parts(hi).sigma;
  const A = pEcoll * (1 - s);
  const B = pSigma;
  return Math.abs(A) + Math.abs(B);
}
const gapAt = (kEnd) => 1.0 - numeratorAt(kEnd);

// Solve an n x n linear system M x = v by Gaussian elimination with partial pivoting -- verbatim from imp-34489.
function solveLinear(M, v) {
  const n = v.length;
  const A = M.map((row, i) => row.concat(v[i]));
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(A[r][col]) > Math.abs(A[piv][col])) piv = r;
    }
    const tmp = A[col];
    A[col] = A[piv];
    A[piv] = tmp;
    const d = A[col][col];
    for (let j = col; j <= n; j++) A[col][j] /= d;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = A[r][col];
      for (let j = col; j <= n; j++) A[r][j] -= f * A[col][j];
    }
  }
  return A.map((row) => row[n]);
}

// The 4x4 normal-equation moment matrix M and RHS T for the four-term fit g*kEnd = a + b*u + c*u^2 + c4*u^3.
function normalSystem(kends) {
  const us = kends.map((k) => 1 / k);
  const ys = kends.map((k) => gapAt(k) * k);
  const n = us.length;
  const S = new Array(7).fill(0); // sum of u^0 .. u^6
  const T = new Array(4).fill(0); // sum of (u^0..u^3)*y
  for (let i = 0; i < n; i++) {
    const u = us[i];
    const y = ys[i];
    let p = 1;
    const pw = [];
    for (let e = 0; e <= 6; e++) {
      pw.push(p);
      p *= u;
    }
    for (let e = 0; e <= 6; e++) S[e] += pw[e];
    for (let e = 0; e <= 3; e++) T[e] += pw[e] * y;
  }
  const M = [
    [S[0], S[1], S[2], S[3]],
    [S[1], S[2], S[3], S[4]],
    [S[2], S[3], S[4], S[5]],
    [S[3], S[4], S[5], S[6]],
  ];
  return { M, T };
}

// Full coefficient vector [a, b, c, c4] of the four-term fit (imp-34489 solve, read at all four coefficients).
function fourTermCoeffs(kends) {
  const { M, T } = normalSystem(kends);
  const [a, b, c, c4] = solveLinear(M, T);
  return { a, b, c, c4 };
}

// 2-norm condition number of the symmetric PSD matrix M = lam_max / lam_min, extreme eigenvalues via power
// iteration (on M for lam_max, on M^{-1} for 1/lam_min). Fixed iteration count -- no Math.random / Date.
function matVec(M, x) {
  return M.map((row) => row.reduce((s, v, j) => s + v * x[j], 0));
}
function normalize(x) {
  const nrm = Math.sqrt(x.reduce((s, v) => s + v * v, 0));
  return x.map((v) => v / nrm);
}
function rayleigh(applyOp, x) {
  const Ax = applyOp(x);
  return Math.abs(x.reduce((s, v, i) => s + v * Ax[i], 0) / x.reduce((s, v) => s + v * v, 0));
}
function powerIter(applyOp, n, iters = 3000) {
  let x = normalize(Array.from({ length: n }, (_, i) => Math.sin(i + 1))); // deterministic seed
  for (let it = 0; it < iters; it++) x = normalize(applyOp(x));
  return rayleigh(applyOp, x);
}
function conditionNumber(M) {
  const n = M.length;
  const lamMax = powerIter((x) => matVec(M, x), n);
  const lamMinInv = powerIter((x) => solveLinear(M, x), n); // largest eigenvalue of M^{-1} = 1 / lam_min(M)
  const lamMin = 1 / lamMinInv;
  return lamMax / lamMin;
}

// The imp-34286/imp-34489 windows: the full OLS window (22..150), the far-field FD window (40..150), and two
// deeper far-field windows -- verbatim from imp-34489.
const FULL_KENDS = [22, 25, 30, 35, 40, 45, 50, 60, 70, 80, 100, 120, 150];
const FARFIELD_KENDS = [40, 50, 60, 80, 100, 120, 150];
const DEEP1_KENDS = [50, 60, 70, 80, 100, 120, 150];
const DEEP2_KENDS = [60, 80, 100, 120, 150];

function rowFor(label, kends) {
  const { M } = normalSystem(kends);
  const co = fourTermCoeffs(kends);
  return {
    window: label,
    kEndLo: kends[0],
    kEndHi: kends[kends.length - 1],
    a: +co.a.toFixed(6), // leading coefficient (imp-34489 verdict; reported here for cross-check)
    b: +co.b.toFixed(6), // 1/kEnd^2 coefficient
    c: +co.c.toFixed(6), // 1/kEnd^3 coefficient
    c4: +co.c4.toFixed(6), // 1/kEnd^4 coefficient
    conditionNumber: +conditionNumber(M).toExponential(4), // 2-norm condition number of the 4x4 normal matrix
  };
}

const TABLE = [
  rowFor('full 22..150 (imp-34286 OLS window)', FULL_KENDS),
  rowFor('far-field 40..150 (imp-34286 FD window)', FARFIELD_KENDS),
  rowFor('deep 50..150', DEEP1_KENDS),
  rowFor('deep 60..150', DEEP2_KENDS),
];

// The higher-order coefficients hold a strictly alternating sign pattern (b>0, c<0, c4>0) in EVERY window --
// no sign swing, so the four-term shape is not sign-random noise.
const SIGNS_WINDOW_STABLE = TABLE.every((r) => r.b > 0 && r.c < 0 && r.c4 > 0);
// The magnitudes are NOT window-invariant: each grows monotonically as the window narrows (full -> deep 60).
const B_GROWS = TABLE[0].b < TABLE[1].b && TABLE[1].b < TABLE[2].b && TABLE[2].b < TABLE[3].b;
const C4_GROWS =
  Math.abs(TABLE[0].c4) < Math.abs(TABLE[1].c4) &&
  Math.abs(TABLE[1].c4) < Math.abs(TABLE[2].c4) &&
  Math.abs(TABLE[2].c4) < Math.abs(TABLE[3].c4);
// c4 swings ~4x across the windows -- the clearest window-driven magnitude drift.
const C4_SWING_RATIO = Math.abs(TABLE[3].c4) / Math.abs(TABLE[0].c4); // ~4.1
// The 4x4 normal-equation condition number is enormous and grows as the window narrows.
const COND_HUGE = TABLE.every((r) => r.conditionNumber > 1e11);
const COND_GROWS = TABLE[0].conditionNumber < TABLE[3].conditionNumber;

export const IMP34506_FOUR_TERM_HIGHER_ORDER_COEFF_WINDOW_STABILITY = {
  id: 'imp-34506',
  proofSection: 'S-frontier',
  question:
    'imp-34489 refit the LEADING coefficient a of the four-term numerator-approach fit g ~ a/kEnd + b/kEnd^2 ' +
    '+ c/kEnd^3 + c4/kEnd^4 across the imp-34286 windows and found a window-stable, but only inspected a. ' +
    'Tabulate the higher-order coefficients b, c, c4 of that SAME degree-3 least squares per window and measure ' +
    'whether their signs and magnitudes are window-stable (a genuine converging series) or swing sign/scale ' +
    '(an ill-conditioned high-order fit), reporting the 4x4 normal-equation condition number per window. ' +
    'Measurement / diagnostic only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'The full coefficient vector [a, b, c, c4] of the four-term fit g*kEnd = a + b*u + c*u^2 + c4*u^3 ' +
    '(u = 1/kEnd, 4x4 normal equations) and the 2-norm condition number of the normal matrix M, across the ' +
    'imp-34286 windows kEnd = 22..150 (OLS), 40..150 (FD), and two deeper far-field windows.',
  table: TABLE,
  signsWindowStable: SIGNS_WINDOW_STABLE, // true (b>0, c<0, c4>0 in every window)
  c4SwingRatio: +C4_SWING_RATIO.toFixed(4), // ~4.09 (c4 magnitude ratio deep-60 / full)
  conditionNumberFull: TABLE[0].conditionNumber, // ~6.08e11
  conditionNumberDeep60: TABLE[3].conditionNumber, // ~1.97e15
  finding: {
    A_signs_are_window_stable_alternating:
      'Across all four imp-34286 windows the higher-order coefficients hold a STRICTLY ALTERNATING sign ' +
      'pattern: b > 0, c < 0, c4 > 0 -- there is NO sign swing, so the four-term higher-order structure is not ' +
      'sign-random noise. b: 0.2426 (full 22..150), 0.3156 (far 40..150), 0.3383 (deep 50..150), 0.3626 (deep ' +
      '60..150); c: -9.69, -14.31, -16.23, -18.49; c4: 66.38, 154.88, 205.03, 271.55.',
    B_magnitudes_are_window_driven_not_invariant:
      'The MAGNITUDES are NOT window-invariant: as the window narrows toward the far field each coefficient ' +
      'grows monotonically (b, |c| and c4 all increase full -> deep 60), with c4 swinging ~4.1x (66.38 -> ' +
      '271.55). Unlike the leading coefficient a (window-stable at 0.4349-0.4355 per imp-34489), the ' +
      'higher-order coefficients are window-sensitive numbers, not converged series coefficients.',
    C_condition_number_confirms_ill_conditioning:
      'The 4x4 normal-equation condition number is ENORMOUS and grows ~3.5 orders of magnitude as the window ' +
      'narrows: 6.08e11 (full 22..150), 4.20e13 (far 40..150), 2.85e14 (deep 50..150), 1.97e15 (deep 60..150). ' +
      'The fit basis (powers of the small u = 1/kEnd) is severely ill-conditioned, so the individual b, c, c4 ' +
      'are sign-determined but NOT magnitude-determined -- the one robust linear functional of the solve is the ' +
      'intercept a, exactly the coefficient imp-34489 found window-stable.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / DIAGNOSTIC (frontier-direction, NOT rigorous). Reading the higher-order coefficients b, c, c4 ' +
    'and the 4x4 normal-equation condition number of the SAME imp-34489 four-term fit g*kEnd = a + b*u + c*u^2 ' +
    '+ c4*u^3 (u = 1/kEnd) across the imp-34286 windows with the identical inherited imp-3406/imp-33810 ' +
    'sub-terms: (A) the higher-order coefficients hold a STRICTLY ALTERNATING sign pattern b > 0, c < 0, c4 > 0 ' +
    'in EVERY window -- no sign swing, so the four-term shape is not sign-random noise. (B) but their ' +
    'MAGNITUDES are NOT window-invariant: each grows monotonically as the window narrows (b 0.2426 -> 0.3626, ' +
    'c -9.69 -> -18.49, c4 66.38 -> 271.55, a ~4.1x swing in c4). (C) the condition number of the normal ' +
    'matrix is ENORMOUS and grows ~3.5 orders of magnitude (6.08e11 full -> 1.97e15 deep 60..150), so the ' +
    'high-order coefficients are sign-determined but NOT magnitude-determined -- an ill-conditioned fit whose ' +
    'one robust output is the intercept a (window-stable 0.4349-0.4355 per imp-34489), NOT its higher-order ' +
    'tail. The underlying numerator STILL uses the inherited quarter-decade OLS exponent estimators verbatim -- ' +
    'this module only READS the higher-order coefficients and the condition number of the imp-34489 solve. The ' +
    'inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the coefficients are descriptive ' +
    'within the model only; changes no bound; establishes no operator positivity; C_mb GUE-conditional per ' +
    'imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34489 (the four-term fit whose b, c, c4 are tabulated here); imp-34450 (the three-term fit); ' +
    'imp-34286 (the bias-corrected band and windows); imp-33810 (the quarter-decade rungs); ' +
    'lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34506_FOUR_TERM_HIGHER_ORDER_COEFF_WINDOW_STABILITY_ASSERTIONS = [
  {
    // (A) The higher-order coefficients hold a strictly alternating sign pattern in every window (b>0, c<0, c4>0).
    id: 'imp34506-higher-order-signs-window-stable',
    description: 'the higher-order coefficients hold b>0, c<0, c4>0 in every imp-34286 window (no sign swing)',
    holds: () => SIGNS_WINDOW_STABLE === true && TABLE.length === 4,
  },
  {
    // (B) The magnitudes are window-driven: b and |c4| grow monotonically as the window narrows.
    id: 'imp34506-higher-order-magnitudes-window-driven',
    description: 'b and |c4| grow monotonically as the window narrows (full -> deep 60), with c4 swinging >3x',
    holds: () => B_GROWS === true && C4_GROWS === true && C4_SWING_RATIO > 3,
  },
  {
    // (C) The 4x4 normal-equation condition number is enormous (>1e11) and grows as the window narrows.
    id: 'imp34506-condition-number-huge-and-grows',
    description: 'the 4x4 normal-equation condition number exceeds 1e11 in every window and grows as the window narrows',
    holds: () => COND_HUGE === true && COND_GROWS === true && TABLE[3].conditionNumber > 1e14,
  },
  {
    // Cross-check: the leading coefficient a matches the imp-34489 window-stable band (0.4345-0.437).
    id: 'imp34506-leading-coeff-matches-imp34489',
    description: 'the leading coefficient a reproduced here stays in the imp-34489 window-stable band 0.4345-0.437',
    holds: () => TABLE.every((r) => r.a > 0.4345 && r.a < 0.437),
  },
  {
    // Honesty gate: diagnostic only, isRigorous false, no QED, no refereed bound is changed, K_a untouched.
    id: 'imp34506-honesty-gate-no-qed',
    description: 'Diagnostic only: isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34506_FOUR_TERM_HIGHER_ORDER_COEFF_WINDOW_STABILITY.isRigorous === false &&
      /NO QED/.test(IMP34506_FOUR_TERM_HIGHER_ORDER_COEFF_WINDOW_STABILITY.verdict) &&
      /refereed bound is changed/i.test(IMP34506_FOUR_TERM_HIGHER_ORDER_COEFF_WINDOW_STABILITY.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34506_FOUR_TERM_HIGHER_ORDER_COEFF_WINDOW_STABILITY.verdict),
  },
];

for (const a of IMP34506_FOUR_TERM_HIGHER_ORDER_COEFF_WINDOW_STABILITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34506-four-term-higher-order-coeff-window-stability assertion failed: ${a.id}`);
  }
}
