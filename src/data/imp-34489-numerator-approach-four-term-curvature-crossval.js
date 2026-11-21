/**
 * @module imp-34489-numerator-approach-four-term-curvature-crossval
 *
 * imp-34489 (accuracy, frontier cross-validation): imp-34450 extended the imp-34375 TWO-TERM fit of the
 * numerator-approach gap g(kEnd) = 1 - numerator (numerator = |A| + |B|, A = pEcoll*(1-sigma), B = pSigma)
 * to an explicit THREE-TERM fit g ~ a/kEnd + b/kEnd^2 + c/kEnd^3 (a degree-2 least squares of g*kEnd vs
 * u = 1/kEnd), and found the leading coefficient a lands at 0.4353-0.4361 across the imp-34286 windows --
 * within ~0.0022 of the two-term value, with the third-order shift the same order as the imp-34375
 * two-term-vs-constant shift. That tested a-stability only THROUGH the third-order term c/kEnd^3. This module
 * adds the NEXT order: an explicit FOUR-TERM fit g ~ a/kEnd + b/kEnd^2 + c/kEnd^3 + c4/kEnd^4 (a degree-3
 * least squares of g*kEnd vs u = 1/kEnd, 4x4 normal equations), refits a over the SAME imp-34286 windows, and
 * asks the single question: does the fourth-order term c4/kEnd^4 relocate the leading coefficient a beyond the
 * imp-34450 three-term band 0.4353-0.4361, or does the order-to-order a-shift keep SHRINKING (the fit
 * converging)?
 *
 * THE FOUR-TERM FIT IN g*kEnd VS 1/kEnd SPACE (NO LOG-LOG)
 * -------------------------------------------------------
 *   Multiply through by kEnd: g*kEnd ~ a + b*u + c*u^2 + c4*u^3, with u = 1/kEnd. So plotting y = g*kEnd
 *   against u is a CUBIC whose value at u -> 0 (kEnd -> infinity) is the leading coefficient a; the higher
 *   coefficients are b (1/kEnd^2), c (1/kEnd^3) and c4 (1/kEnd^4). The three-term restriction is c4 = 0 (the
 *   imp-34450 quadratic fit). Fitting the cubic (an ordinary degree-3 least squares of y on u, 4x4 normal
 *   equations solved by Gaussian elimination with partial pivoting) and comparing a_fourTerm against the
 *   imp-34450 a_threeTerm over the SAME window isolates exactly how much fourth-order curvature the three-term
 *   intercept was absorbing. No log-log slope is fit, so this inherits none of the imp-34286 OLS-intercept/
 *   exponent coupling, exactly as in imp-34450/imp-34375.
 *
 * THE FOURTH-ORDER TERM MOVES a BY AT MOST ~0.0007 -- SMALLER THAN THE THIRD-ORDER SHIFT: THE FIT CONVERGES
 * ------------------------------------------------------------------------------------------------------
 *   Full window kEnd = 22..150 (the imp-34286 OLS window): the three-term fit gives a = 0.436104, the
 *   four-term fit gives a = 0.435437 with a cubic coefficient c4 = 66.38 -- the leading coefficient shifts by
 *   only -0.000667 (~0.15%). Far-field window kEnd = 40..150 (the imp-34286 FD window): three-term
 *   a = 0.435561, four-term a = 0.435100 (c4 = 154.88), a shift of -0.000462 (~0.11%). The deeper far-field
 *   windows land at 0.435017 (deep 50..150, shift -0.000396) and 0.434934 (deep 60..150, shift -0.000353). In
 *   EVERY window the four-term leading coefficient lands at 0.4349-0.4355 -- just BELOW the imp-34450
 *   three-term band 0.4353-0.4361 and within ~0.0021 of the imp-34286 bias-corrected band a ~ 0.437-0.438.
 *   The maximum order-to-order a-shift across all windows is ~0.000667, THREE times SMALLER than the imp-34450
 *   three-term (two-to-three) max shift ~0.002229: the order-to-order shift is SHRINKING order-by-order
 *   (~0.0022 at 2->3, ~0.00067 at 3->4), the signature of a converging expansion rather than a relocating
 *   leading coefficient. NET: the g ~ a/kEnd first-order verdict SURVIVES the fourth term -- a stays within
 *   ~0.0031 of 0.437 at every order tested (two-term 0.4364-0.4383, three-term 0.4353-0.4361, four-term
 *   0.4349-0.4355), with the order-to-order drift decreasing, and a ~ 0.4349-0.4370 remains the leading
 *   prefactor.
 *
 * SCOPE / HONESTY. The underlying numerator STILL uses the inherited imp-3406/imp-33810 quarter-decade OLS
 * exponent estimators (pSigma, pEcoll) verbatim -- those DEFINE the surrogate numerator and are not removed
 * here; this module only adds a fourth-order term to the SEPARATE a-extraction step and measures its effect on
 * the leading coefficient. Cross-validation / measurement only. The inherited imp-3220/imp-3406 component
 * model is NOT a rigorous asymptotic; the coefficient is descriptive within that model only; changes no bound;
 * establishes no operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34450-numerator-approach-three-term-curvature-crossval (the three-term fit a-stability extended here)
 * @see imp-34375-numerator-approach-two-term-curvature-crossval (the two-term fit a-stability)
 * @see imp-34286-numerator-approach-coefficient-fd-crossval (the bias-corrected a ~ 0.437-0.438 band)
 * @see imp-34210-numerator-approach-rate-to-unity (the OLS log-log intercept a ~ 0.4293 and g*kEnd plateau)
 * @see imp-34151-cancellation-numerator-past-crossing (the monotone numerator -> 1.0 tabulated)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. quarter-decade ladder reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N = (T0/2pi)(L0-1), the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-34210/imp-34286/imp-34375/imp-34450 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34450/imp-34375/imp-34286 (no re-derivation).
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

// The inherited quarter-decade OLS exponent estimators (pSigma, pEcoll) -- UNCHANGED from imp-34450.
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
// The approach gap toward the unity asymptote: g(kEnd) = 1.0 - numerator (positive, shrinking to 0).
const gapAt = (kEnd) => 1.0 - numeratorAt(kEnd);

// -- Two-term fit: y = g*kEnd = a + b*u, u = 1/kEnd. OLS of y on u; intercept = a (leading coefficient,
//    u -> 0), slope = b. This is the imp-34375 fit reproduced verbatim -- the baseline a is compared against.
function twoTermFit(kends) {
  const xs = kends.map((k) => 1 / k); // u = 1/kEnd
  const ys = kends.map((k) => gapAt(k) * k); // g*kEnd
  const n = xs.length;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  const b = sxy / sxx;
  const a = my - b * mx;
  return { a, b };
}

// -- Solve an n x n linear system M x = v by Gaussian elimination with partial pivoting (small, exact enough).
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

// -- Three-term fit: y = g*kEnd = a + b*u + c*u^2, u = 1/kEnd (imp-34450 degree-2 least squares). Reproduced
//    here as the baseline the fourth-order shift is measured against.
function threeTermFit(kends) {
  const us = kends.map((k) => 1 / k);
  const ys = kends.map((k) => gapAt(k) * k);
  const n = us.length;
  let s0 = n;
  let s1 = 0;
  let s2 = 0;
  let s3 = 0;
  let s4 = 0;
  let t0 = 0;
  let t1 = 0;
  let t2 = 0;
  for (let i = 0; i < n; i++) {
    const u = us[i];
    const y = ys[i];
    const u2 = u * u;
    s1 += u;
    s2 += u2;
    s3 += u2 * u;
    s4 += u2 * u2;
    t0 += y;
    t1 += u * y;
    t2 += u2 * y;
  }
  const M = [
    [s0, s1, s2],
    [s1, s2, s3],
    [s2, s3, s4],
  ];
  const [a, b, c] = solveLinear(M, [t0, t1, t2]);
  return { a, b, c };
}

// -- Four-term fit: y = g*kEnd = a + b*u + c*u^2 + c4*u^3, u = 1/kEnd. Degree-3 least squares of y on u via
//    the 4x4 normal equations (intercept a = leading coefficient at u = 0, c4 = coefficient of the c4/kEnd^4
//    term). Power-sum moments S[0..6] of u and cross-moments T[0..3] of u^j*y.
function fourTermFit(kends) {
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
  const [a, b, c, c4] = solveLinear(M, T);
  return { a, b, c, c4 };
}

// The imp-34286/imp-34450 windows: the full OLS window (22..150) and the far-field FD window (40..150),
// plus two deeper far-field windows to confirm the leading coefficient is window-stable.
const FULL_KENDS = [22, 25, 30, 35, 40, 45, 50, 60, 70, 80, 100, 120, 150];
const FARFIELD_KENDS = [40, 50, 60, 80, 100, 120, 150];
const DEEP1_KENDS = [50, 60, 70, 80, 100, 120, 150];
const DEEP2_KENDS = [60, 80, 100, 120, 150];

function rowFor(label, kends) {
  const two = twoTermFit(kends);
  const three = threeTermFit(kends);
  const four = fourTermFit(kends);
  return {
    window: label,
    kEndLo: kends[0],
    kEndHi: kends[kends.length - 1],
    twoTermA: +two.a.toFixed(6), // imp-34375 two-term leading coefficient
    threeTermA: +three.a.toFixed(6), // imp-34450 three-term leading coefficient (baseline for the shift)
    fourTermA: +four.a.toFixed(6), // four-term leading coefficient
    curvatureC4: +four.c4.toFixed(6), // fourth-order coefficient of c4/kEnd^4
    leadShift34: +(four.a - three.a).toFixed(6), // how much the fourth-order term moves a vs the three-term fit
    leadShift24: +(four.a - two.a).toFixed(6), // cumulative shift of a from the two-term fit
  };
}

const TABLE = [
  rowFor('full 22..150 (imp-34286 OLS window)', FULL_KENDS),
  rowFor('far-field 40..150 (imp-34286 FD window)', FARFIELD_KENDS),
  rowFor('deep 50..150', DEEP1_KENDS),
  rowFor('deep 60..150', DEEP2_KENDS),
];

const FARFIELD_ROW = TABLE[1];
const FULL_ROW = TABLE[0];
// Max absolute order-to-order shift of the leading coefficient across all windows at the FOURTH order.
const MAX_ABS_LEAD_SHIFT_34 = Math.max(...TABLE.map((r) => Math.abs(r.leadShift34))); // ~0.000667
// The imp-34450 three-term (two-to-three) max shift, reproduced as the order-to-order comparator: the
// fourth-order shift MAX_ABS_LEAD_SHIFT_34 is ~3x SMALLER, i.e. the order-to-order drift is shrinking.
const IMP34450_THREE_TERM_MAX_SHIFT = 0.002229;
// Every four-term leading coefficient stays at 0.4349-0.4355, just below the imp-34450 three-term band
// 0.4353-0.4361 and within ~0.0021 of the imp-34286 bias-corrected band 0.437-0.438.
const ALL_A_NEAR_BAND = TABLE.every((r) => r.fourTermA > 0.4345 && r.fourTermA < 0.437);
// The order-to-order shift is decreasing: the fourth-order max shift is strictly below the third-order one.
const SHIFT_SHRINKS_ORDER_TO_ORDER = MAX_ABS_LEAD_SHIFT_34 < IMP34450_THREE_TERM_MAX_SHIFT;

export const IMP34489_NUMERATOR_APPROACH_FOUR_TERM_CURVATURE_CROSSVAL = {
  id: 'imp-34489',
  proofSection: 'S-frontier',
  question:
    'imp-34450 extended the imp-34375 two-term fit of the numerator-approach gap g(kEnd) = 1 - numerator to ' +
    'a THREE-TERM fit g ~ a/kEnd + b/kEnd^2 + c/kEnd^3 and found the leading coefficient a stays at ' +
    '0.4353-0.4361, within ~0.0022 of the two-term value. Add the NEXT order -- an explicit FOUR-TERM fit ' +
    'g ~ a/kEnd + b/kEnd^2 + c/kEnd^3 + c4/kEnd^4 (a degree-3 least squares of g*kEnd vs u = 1/kEnd, 4x4 ' +
    'normal equations) -- refit the leading coefficient a over the same imp-34286 windows, and measure ' +
    'whether the fourth-order term c4/kEnd^4 relocates a beyond the three-term band or the order-to-order ' +
    'a-shift keeps SHRINKING. Cross-validation/measurement only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'The leading coefficient a from a four-term fit g*kEnd = a + b*u + c*u^2 + c4*u^3 (u = 1/kEnd), compared ' +
    'against the imp-34450 three-term fit g*kEnd = a + b*u + c*u^2 (c4 forced 0), across the imp-34286 ' +
    'windows kEnd = 22..150 (OLS) and kEnd = 40..150 (FD) plus two deeper far-field windows; leadShift34 = ' +
    'a_fourTerm - a_threeTerm isolates the fourth-order curvature the three-term intercept was absorbing.',
  table: TABLE,
  farFieldRow: FARFIELD_ROW, // {threeTermA ~ 0.435561, fourTermA ~ 0.435100, curvatureC4 ~ 154.88, leadShift34 ~ -0.000462}
  fullWindowRow: FULL_ROW, // {threeTermA ~ 0.436104, fourTermA ~ 0.435437, curvatureC4 ~ 66.38, leadShift34 ~ -0.000667}
  maxAbsLeadShift34: +MAX_ABS_LEAD_SHIFT_34.toFixed(6), // ~0.000667  (largest a-shift across all windows at 4th order)
  imp34450ThreeTermMaxShift: IMP34450_THREE_TERM_MAX_SHIFT, // 0.002229  (the 3rd-order comparator -- ~3x larger)
  allLeadingCoeffNearBand: ALL_A_NEAR_BAND, // true  (every four-term a in 0.4345-0.437)
  shiftShrinksOrderToOrder: SHIFT_SHRINKS_ORDER_TO_ORDER, // true  (4th-order shift < 3rd-order shift)
  finding: {
    A_four_term_leading_coefficient_lands_just_below_three_term_band:
      'Fitting g*kEnd = a + b*u + c*u^2 + c4*u^3 (u = 1/kEnd) over the imp-34286 windows lands the leading ' +
      'coefficient a at 0.435100 (far-field 40..150), 0.435437 (full 22..150), 0.435017 (deep 50..150) and ' +
      '0.434934 (deep 60..150) -- every value at 0.4349-0.4355, just below the imp-34450 three-term band ' +
      '0.4353-0.4361 and within ~0.0021 of the imp-34286 bias-corrected band a ~ 0.437-0.438. Adding the ' +
      'fourth-order term does NOT relocate the leading coefficient out of the neighbourhood of the band.',
    B_fourth_order_shift_is_smaller_than_third_order:
      'Against the imp-34450 three-term fit (c4 forced 0) over the SAME window, the four-term leading ' +
      'coefficient shifts by -0.000462 (~0.11%) in the far-field window and at most -0.000667 (~0.15%, full ' +
      'window). This ~0.00067 maximum is THREE times SMALLER than the imp-34450 three-term (two-to-three) max ' +
      'shift (0.002229) -- the order-to-order a-shift is SHRINKING order-by-order (~0.0022 at 2->3, ~0.00067 ' +
      'at 3->4), the signature of a converging expansion rather than a relocating leading coefficient.',
    C_first_order_verdict_survives_fourth_term:
      'Across all four windows the leading coefficient a stays within ~0.0031 of 0.437 at every order tested ' +
      '(two-term 0.4364-0.4383, three-term 0.4353-0.4361, four-term 0.4349-0.4355), with the order-to-order ' +
      'drift DECREASING. The g ~ a/kEnd first-order-in-1/kEnd verdict is STABLE against the explicit ' +
      'fourth-order term; a ~ 0.4349-0.4370 remains the leading prefactor.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / COEFFICIENT CROSS-VALIDATION (frontier-direction, NOT rigorous). Extending the imp-34450 ' +
    'three-term fit g ~ a/kEnd + b/kEnd^2 + c/kEnd^3 to an explicit FOUR-TERM fit g ~ a/kEnd + b/kEnd^2 + ' +
    'c/kEnd^3 + c4/kEnd^4, done as a degree-3 least squares of g*kEnd on u = 1/kEnd (intercept = a, cubic ' +
    'coefficient = c4, 4x4 normal equations) over the imp-34286 windows with the identical inherited ' +
    'imp-3406/imp-33810 sub-terms: (A) the four-term leading coefficient a lands at 0.435100 (far-field ' +
    '40..150), 0.435437 (full 22..150), 0.435017 and 0.434934 (deeper windows) -- every value at 0.4349-' +
    '0.4355, just below the imp-34450 three-term band 0.4353-0.4361 and within ~0.0021 of the 0.437-0.438 ' +
    'band. (B) Against the imp-34450 three-term fit over the SAME window (fourth-order forced off), a shifts ' +
    'by only -0.000462 (~0.11%) in the far field and at most -0.000667 (~0.15%) on the full window; this ' +
    '~0.00067 maximum is ~3x SMALLER than the imp-34450 three-term max shift (0.002229), so the order-to-' +
    'order a-shift is SHRINKING (~0.0022 at 2->3, ~0.00067 at 3->4) -- a converging expansion, not a ' +
    'relocating leading coefficient. (C) NET: the g ~ a/kEnd first-order verdict SURVIVES the fourth term -- ' +
    'a stays within ~0.0031 of 0.437 at every order tested with the order-to-order drift decreasing, and ' +
    'a ~ 0.4349-0.4370 remains the leading prefactor. The underlying numerator STILL uses the inherited ' +
    'quarter-decade OLS exponent estimators (pSigma, pEcoll) verbatim -- this adds a fourth-order term only ' +
    'in the a-extraction step, not the numerator internals. The inherited imp-3220/imp-3406 component model ' +
    'is NOT a rigorous asymptotic; the coefficient is descriptive within the model only; changes no bound; ' +
    'establishes no operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34450 (the three-term fit a-stability extended here); imp-34375 (the two-term fit a-stability); ' +
    'imp-34286 (the bias-corrected band a ~ 0.437-0.438); imp-34210 (the OLS log-log intercept a ~ 0.4293 ' +
    'and the g*kEnd plateau); imp-34151 (the monotone numerator -> 1.0); imp-33810 (the quarter-decade ' +
    'rungs); lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34489_NUMERATOR_APPROACH_FOUR_TERM_CURVATURE_CROSSVAL_ASSERTIONS = [
  {
    // (A) Every four-term leading coefficient stays near the imp-34286 band (0.4345-0.437).
    id: 'imp34489-four-term-leading-coeff-near-band',
    description: 'the four-term leading coefficient a stays in 0.4345-0.437 (just below the imp-34450 three-term band) across all windows',
    holds: () => ALL_A_NEAR_BAND === true && TABLE.length === 4,
  },
  {
    // (A) The far-field four-term a lands at ~0.4351, within ~0.0019 of the imp-34286 plateau ~0.4370.
    id: 'imp34489-farfield-four-term-near-plateau',
    description: 'the far-field (40..150) four-term leading coefficient ~0.43510 sits within ~0.0019 of the imp-34286 plateau ~0.4370',
    holds: () =>
      FARFIELD_ROW.fourTermA > 0.4345 && FARFIELD_ROW.fourTermA < 0.4365 &&
      Math.abs(FARFIELD_ROW.fourTermA - 0.436982) < 2.2e-3,
  },
  {
    // (B) Adding the fourth-order term shifts the leading coefficient by <=~0.0007 across all windows.
    id: 'imp34489-fourth-order-shift-bounded',
    description: 'including the c4/kEnd^4 term shifts a by <=~0.0007 across all windows (~0.00046 in the far field)',
    holds: () =>
      MAX_ABS_LEAD_SHIFT_34 < 1e-3 && Math.abs(FARFIELD_ROW.leadShift34) < 6e-4,
  },
  {
    // (B) The fourth-order max shift is strictly smaller than the imp-34450 three-term max shift (shrinking).
    id: 'imp34489-fourth-order-shift-shrinks-vs-third',
    description: 'the fourth-order max a-shift ~0.00067 is strictly below the imp-34450 three-term max shift 0.002229 -- the order-to-order shift shrinks',
    holds: () =>
      SHIFT_SHRINKS_ORDER_TO_ORDER === true &&
      MAX_ABS_LEAD_SHIFT_34 < 0.5 * IMP34450_THREE_TERM_MAX_SHIFT,
  },
  {
    // Honesty gate: cross-validation only, isRigorous false, no QED, no refereed bound is changed, K_a untouched.
    id: 'imp34489-honesty-gate-no-qed',
    description: 'Coefficient cross-validation only: isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34489_NUMERATOR_APPROACH_FOUR_TERM_CURVATURE_CROSSVAL.isRigorous === false &&
      /NO QED/.test(IMP34489_NUMERATOR_APPROACH_FOUR_TERM_CURVATURE_CROSSVAL.verdict) &&
      /refereed bound is changed/i.test(IMP34489_NUMERATOR_APPROACH_FOUR_TERM_CURVATURE_CROSSVAL.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34489_NUMERATOR_APPROACH_FOUR_TERM_CURVATURE_CROSSVAL.verdict),
  },
];

for (const a of IMP34489_NUMERATOR_APPROACH_FOUR_TERM_CURVATURE_CROSSVAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34489-numerator-approach-four-term-curvature-crossval assertion failed: ${a.id}`);
  }
}
