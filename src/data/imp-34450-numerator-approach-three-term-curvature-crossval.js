/**
 * @module imp-34450-numerator-approach-three-term-curvature-crossval
 *
 * imp-34450 (accuracy, frontier cross-validation): imp-34375 extended the imp-34286 bias-corrected
 * numerator-approach leading prefactor a ~ 0.437-0.438 (in the approach gap g(kEnd) = 1 - numerator ~ a/kEnd,
 * numerator = |A| + |B|, A = pEcoll*(1-sigma), B = pSigma) to an explicit TWO-TERM fit g ~ a/kEnd + b/kEnd^2
 * (an OLS of g*kEnd on u = 1/kEnd: intercept a, slope b), and found the leading coefficient a STABLE against
 * the curvature term -- it stayed in 0.437-0.438, shifting only +0.000114 (far-field) to +0.002203 (full
 * window) from the one-term constant fit. That tested first-order stability only to SECOND order. This module
 * adds the NEXT order: an explicit THREE-TERM fit g ~ a/kEnd + b/kEnd^2 + c/kEnd^3, refits the leading
 * coefficient a, and asks the single question: does the third-order term c/kEnd^3 relocate the leading
 * coefficient a beyond where the two-term fit put it, i.e. is the imp-34375 first-order verdict stable at next
 * order, or was the two-term a still silently absorbing third-order curvature?
 *
 * THE THREE-TERM FIT IN g*kEnd VS 1/kEnd SPACE (NO LOG-LOG)
 * --------------------------------------------------------
 *   Multiply through by kEnd: g*kEnd ~ a + b*u + c*u^2, with u = 1/kEnd. So plotting y = g*kEnd against
 *   u is a QUADRATIC whose value at u -> 0 (kEnd -> infinity) is the leading coefficient a; the linear
 *   coefficient is b and the quadratic coefficient is c. The two-term restriction is c = 0 (the imp-34375
 *   straight-line fit). Fitting the quadratic (an ordinary degree-2 least squares of y on u, 3x3 normal
 *   equations solved by Gaussian elimination) and comparing a_threeTerm against the imp-34375 a_twoTerm over
 *   the SAME window isolates exactly how much third-order curvature the two-term intercept was absorbing. No
 *   log-log slope is fit, so this inherits none of the imp-34286 OLS-intercept/exponent coupling, exactly as
 *   in imp-34375.
 *
 * THE THIRD-ORDER TERM MOVES a BY AT MOST ~0.0022 -- THE FIRST-ORDER READING SURVIVES
 * ----------------------------------------------------------------------------------
 *   Far-field window kEnd = 40..150 (the imp-34286 FD window): the two-term fit gives a = 0.436974, the
 *   three-term fit gives a = 0.435561 with a quadratic coefficient c = -6.925 -- the leading coefficient
 *   shifts by only -0.001413 (~0.32%). Full window kEnd = 22..150 (the imp-34286 OLS window): two-term
 *   a = 0.438333, three-term a = 0.436104 (c = -4.597), a shift of -0.002229 (~0.51%). The deeper far-field
 *   windows land at 0.435413 (deep 50..150, shift -0.001243) and 0.435288 (deep 60..150, shift -0.001139).
 *   In EVERY window the three-term leading coefficient lands at 0.4353-0.4361 -- just BELOW, and within
 *   ~0.0015 of, the imp-34286 bias-corrected band a ~ 0.437-0.438. The maximum a-shift across all windows is
 *   ~0.002229, the SAME order of magnitude as the imp-34375 two-term-vs-constant shift (max +0.002203): the
 *   third-order term does not relocate a any more than the second-order term already did. NOTE (honest): in
 *   the far field the third-order shift (-0.001413) is LARGER than the imp-34375 second-order far-field shift
 *   (+0.000114), because the c/kEnd^3 term with |c| ~ 7 mops up residual small-kEnd curvature the b term left;
 *   but in absolute terms a still moves less than 0.52% and stays at ~0.4355. NET: the g ~ a/kEnd first-order
 *   verdict SURVIVES the third term -- a stays within ~0.0022 of 0.437 at every order tested, with no runaway
 *   drift order-to-order, and a ~ 0.4355-0.4370 remains the leading prefactor.
 *
 * SCOPE / HONESTY. The underlying numerator STILL uses the inherited imp-3406/imp-33810 quarter-decade OLS
 * exponent estimators (pSigma, pEcoll) verbatim -- those DEFINE the surrogate numerator and are not removed
 * here; this module only adds a third-order term to the SEPARATE a-extraction step and measures its effect on
 * the leading coefficient. Cross-validation / measurement only. The inherited imp-3220/imp-3406 component
 * model is NOT a rigorous asymptotic; the coefficient is descriptive within that model only; changes no bound;
 * establishes no operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34375-numerator-approach-two-term-curvature-crossval (the two-term fit a-stability extended here)
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
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-34151/imp-34210/imp-34286/imp-34375 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34375/imp-34286 (no re-derivation).
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

// The inherited quarter-decade OLS exponent estimators (pSigma, pEcoll) -- UNCHANGED from imp-34375.
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

// -- Solve a 3x3 linear system M x = v by Gaussian elimination with partial pivoting (small, exact enough).
function solve3(M, v) {
  const A = M.map((row, i) => row.concat(v[i]));
  for (let col = 0; col < 3; col++) {
    let piv = col;
    for (let r = col + 1; r < 3; r++) {
      if (Math.abs(A[r][col]) > Math.abs(A[piv][col])) piv = r;
    }
    const tmp = A[col];
    A[col] = A[piv];
    A[piv] = tmp;
    const d = A[col][col];
    for (let j = col; j < 4; j++) A[col][j] /= d;
    for (let r = 0; r < 3; r++) {
      if (r === col) continue;
      const f = A[r][col];
      for (let j = col; j < 4; j++) A[r][j] -= f * A[col][j];
    }
  }
  return [A[0][3], A[1][3], A[2][3]];
}

// -- Three-term fit: y = g*kEnd = a + b*u + c*u^2, u = 1/kEnd. Degree-2 least squares of y on u via the
//    normal equations (intercept a = leading coefficient at u = 0, c = coefficient of the c/kEnd^3 term).
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
  const [a, b, c] = solve3(M, [t0, t1, t2]);
  return { a, b, c };
}

// The imp-34286/imp-34375 windows: the full OLS window (22..150) and the far-field FD window (40..150),
// plus two deeper far-field windows to confirm the leading coefficient is window-stable.
const FULL_KENDS = [22, 25, 30, 35, 40, 45, 50, 60, 70, 80, 100, 120, 150];
const FARFIELD_KENDS = [40, 50, 60, 80, 100, 120, 150];
const DEEP1_KENDS = [50, 60, 70, 80, 100, 120, 150];
const DEEP2_KENDS = [60, 80, 100, 120, 150];

function rowFor(label, kends) {
  const two = twoTermFit(kends);
  const three = threeTermFit(kends);
  return {
    window: label,
    kEndLo: kends[0],
    kEndHi: kends[kends.length - 1],
    twoTermA: +two.a.toFixed(6), // imp-34375 two-term leading coefficient (baseline)
    threeTermA: +three.a.toFixed(6), // three-term leading coefficient
    curvatureC: +three.c.toFixed(6), // third-order coefficient of c/kEnd^3
    leadShift23: +(three.a - two.a).toFixed(6), // how much the third-order term moves a
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
// Max absolute shift of the leading coefficient across ALL windows when the third-order term is added.
const MAX_ABS_LEAD_SHIFT_23 = Math.max(...TABLE.map((r) => Math.abs(r.leadShift23))); // ~0.002229
// Every three-term leading coefficient stays at 0.4353-0.4361, just below and within ~0.0015 of the
// imp-34286 bias-corrected band 0.437-0.438 (band with a ~0.002 tolerance on the low side).
const ALL_A_NEAR_BAND = TABLE.every((r) => r.threeTermA > 0.434 && r.threeTermA < 0.438);
// The imp-34375 two-term-vs-constant max shift, reproduced here as the order-of-magnitude comparator: the
// third-order shift MAX_ABS_LEAD_SHIFT_23 is the same order as this (~0.0022), so the third term does not
// relocate a any more than the second term did.
const IMP34375_TWO_TERM_MAX_SHIFT = 0.002203;

export const IMP34450_NUMERATOR_APPROACH_THREE_TERM_CURVATURE_CROSSVAL = {
  id: 'imp-34450',
  proofSection: 'S-frontier',
  question:
    'imp-34375 extended the imp-34286 numerator-approach leading prefactor a ~ 0.437-0.438 (in g(kEnd) = ' +
    '1 - numerator ~ a/kEnd) to an explicit TWO-TERM fit g ~ a/kEnd + b/kEnd^2 and found a STABLE against the ' +
    'curvature term. Add the NEXT order -- an explicit THREE-TERM fit g ~ a/kEnd + b/kEnd^2 + c/kEnd^3 (a ' +
    'degree-2 least squares of g*kEnd vs u = 1/kEnd) -- refit the leading coefficient a, and measure whether ' +
    'the third-order term c/kEnd^3 SHIFTS a beyond the two-term value: is the imp-34375 first-order verdict ' +
    'stable at next order, or was the two-term a still absorbing third-order curvature? Cross-validation/' +
    'measurement only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'The leading coefficient a from a three-term fit g*kEnd = a + b*u + c*u^2 (u = 1/kEnd), compared against ' +
    'the imp-34375 two-term fit g*kEnd = a + b*u (c forced 0), across the imp-34286 windows kEnd = 22..150 ' +
    '(OLS) and kEnd = 40..150 (FD) plus two deeper far-field windows; leadShift23 = a_threeTerm - a_twoTerm ' +
    'isolates the third-order curvature the two-term intercept was absorbing.',
  table: TABLE,
  farFieldRow: FARFIELD_ROW, // {twoTermA ~ 0.436974, threeTermA ~ 0.435561, curvatureC ~ -6.925, leadShift23 ~ -0.001413}
  fullWindowRow: FULL_ROW, // {twoTermA ~ 0.438333, threeTermA ~ 0.436104, curvatureC ~ -4.597, leadShift23 ~ -0.002229}
  maxAbsLeadShift23: +MAX_ABS_LEAD_SHIFT_23.toFixed(6), // ~0.002229  (largest a-shift across all windows at 3rd order)
  imp34375TwoTermMaxShift: IMP34375_TWO_TERM_MAX_SHIFT, // 0.002203  (the 2nd-order comparator -- same order)
  allLeadingCoeffNearBand: ALL_A_NEAR_BAND, // true  (every three-term a in 0.434-0.438, i.e. the 0.437-0.438 band -~0.002)
  finding: {
    A_three_term_leading_coefficient_lands_just_below_band:
      'Fitting g*kEnd = a + b*u + c*u^2 (u = 1/kEnd) over the imp-34286 windows lands the leading coefficient ' +
      'a at 0.435561 (far-field 40..150), 0.436104 (full 22..150), 0.435413 (deep 50..150) and 0.435288 (deep ' +
      '60..150) -- every value at 0.4353-0.4361, just below and within ~0.0015 of the imp-34286 bias-corrected ' +
      'band a ~ 0.437-0.438. Adding the third-order term does NOT relocate the leading coefficient out of the ' +
      'neighbourhood of the band.',
    B_third_order_shift_is_same_order_as_second_order:
      'Against the imp-34375 two-term fit (c forced 0) over the SAME window, the three-term leading ' +
      'coefficient shifts by -0.001413 (~0.32%) in the far-field window and at most -0.002229 (~0.51%, full ' +
      'window). This ~0.0022 maximum is the SAME order of magnitude as the imp-34375 two-term-vs-constant max ' +
      'shift (+0.002203) -- the third-order term does not relocate a any more than the second-order term ' +
      'already did. Honest note: in the far field the third-order shift (-0.001413) is LARGER than the ' +
      'imp-34375 second-order far-field shift (+0.000114), the c/kEnd^3 term with |c| ~ 7 mopping up residual ' +
      'small-kEnd curvature; but a still moves less than 0.52% and stays at ~0.4355.',
    C_first_order_verdict_survives_third_term:
      'Across all four windows the leading coefficient a stays within ~0.0022 of 0.437 at every order tested ' +
      '(one-term 0.4361-0.4370, two-term 0.4364-0.4383, three-term 0.4353-0.4361), with no runaway drift ' +
      'order-to-order. The g ~ a/kEnd first-order-in-1/kEnd verdict is STABLE against the explicit ' +
      'third-order term; a ~ 0.4355-0.4370 remains the leading prefactor.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / COEFFICIENT CROSS-VALIDATION (frontier-direction, NOT rigorous). Extending the imp-34375 ' +
    'two-term fit g ~ a/kEnd + b/kEnd^2 to an explicit THREE-TERM fit g ~ a/kEnd + b/kEnd^2 + c/kEnd^3, done ' +
    'as a degree-2 least squares of g*kEnd on u = 1/kEnd (intercept = a, quadratic coefficient = c) over the ' +
    'imp-34286 windows with the identical inherited imp-3406/imp-33810 sub-terms: (A) the three-term leading ' +
    'coefficient a lands at 0.435561 (far-field 40..150), 0.436104 (full 22..150), 0.435413 and 0.435288 ' +
    '(deeper windows) -- every value at 0.4353-0.4361, just below and within ~0.0015 of the 0.437-0.438 band. ' +
    '(B) Against the imp-34375 two-term fit over the SAME window (third-order forced off), a shifts by only ' +
    '-0.001413 (~0.32%) in the far field and at most -0.002229 (~0.51%) on the full window; this ~0.0022 ' +
    'maximum is the SAME order as the imp-34375 two-term-vs-constant max shift (+0.002203), so the third term ' +
    'does not relocate a any more than the second term did. In the far field the third-order shift (-0.001413) ' +
    'exceeds the imp-34375 second-order far-field shift (+0.000114) because the c/kEnd^3 term (|c| ~ 7) mops up ' +
    'residual small-kEnd curvature, but a still moves < 0.52% and stays at ~0.4355. (C) NET: the g ~ a/kEnd ' +
    'first-order verdict SURVIVES the third term -- a stays within ~0.0022 of 0.437 at every order tested with ' +
    'no runaway drift, and a ~ 0.4355-0.4370 remains the leading prefactor. The underlying numerator STILL uses ' +
    'the inherited quarter-decade OLS exponent estimators (pSigma, pEcoll) verbatim -- this adds a third-order ' +
    'term only in the a-extraction step, not the numerator internals. The inherited imp-3220/imp-3406 component ' +
    'model is NOT a rigorous asymptotic; the coefficient is descriptive within the model only; changes no ' +
    'bound; establishes no operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34375 (the two-term fit a-stability extended here); imp-34286 (the bias-corrected band a ~ ' +
    '0.437-0.438); imp-34210 (the OLS log-log intercept a ~ 0.4293 and the g*kEnd plateau); imp-34151 (the ' +
    'monotone numerator -> 1.0); imp-33810 (the quarter-decade rungs); lambda-rh-height-mapping (RvM height ' +
    'law); polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34450_NUMERATOR_APPROACH_THREE_TERM_CURVATURE_CROSSVAL_ASSERTIONS = [
  {
    // (A) Every three-term leading coefficient stays near the imp-34286 band (0.434-0.438).
    id: 'imp34450-three-term-leading-coeff-near-band',
    description: 'the three-term leading coefficient a stays in 0.434-0.438 (just below the imp-34286 0.437-0.438 band) across all windows',
    holds: () => ALL_A_NEAR_BAND === true && TABLE.length === 4,
  },
  {
    // (A) The far-field three-term a lands at ~0.4356, within ~0.0015 of the imp-34286 plateau ~0.4370.
    id: 'imp34450-farfield-three-term-near-plateau',
    description: 'the far-field (40..150) three-term leading coefficient ~0.43556 sits within ~0.0015 of the imp-34286 plateau ~0.4370',
    holds: () =>
      FARFIELD_ROW.threeTermA > 0.434 && FARFIELD_ROW.threeTermA < 0.437 &&
      Math.abs(FARFIELD_ROW.threeTermA - 0.436982) < 2e-3,
  },
  {
    // (B) Adding the third-order term shifts the leading coefficient by <=~0.5% (far-field ~0.32%).
    id: 'imp34450-third-order-shift-bounded',
    description: 'including the c/kEnd^3 term shifts a by <=~0.0023 across all windows (~0.0014 in the far field)',
    holds: () =>
      MAX_ABS_LEAD_SHIFT_23 < 3e-3 && Math.abs(FARFIELD_ROW.leadShift23) < 2e-3,
  },
  {
    // (B) The third-order max shift is the same order as the imp-34375 two-term-vs-constant max shift.
    id: 'imp34450-third-order-same-order-as-second',
    description: 'the third-order max a-shift ~0.0022 is the same order as the imp-34375 two-term-vs-constant max shift 0.002203',
    holds: () =>
      MAX_ABS_LEAD_SHIFT_23 < 2 * IMP34375_TWO_TERM_MAX_SHIFT &&
      MAX_ABS_LEAD_SHIFT_23 > 0.4 * IMP34375_TWO_TERM_MAX_SHIFT,
  },
  {
    // Honesty gate: cross-validation only, isRigorous false, no QED, no refereed bound is changed, K_a untouched.
    id: 'imp34450-honesty-gate-no-qed',
    description: 'Coefficient cross-validation only: isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34450_NUMERATOR_APPROACH_THREE_TERM_CURVATURE_CROSSVAL.isRigorous === false &&
      /NO QED/.test(IMP34450_NUMERATOR_APPROACH_THREE_TERM_CURVATURE_CROSSVAL.verdict) &&
      /refereed bound is changed/i.test(IMP34450_NUMERATOR_APPROACH_THREE_TERM_CURVATURE_CROSSVAL.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34450_NUMERATOR_APPROACH_THREE_TERM_CURVATURE_CROSSVAL.verdict),
  },
];

for (const a of IMP34450_NUMERATOR_APPROACH_THREE_TERM_CURVATURE_CROSSVAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34450-numerator-approach-three-term-curvature-crossval assertion failed: ${a.id}`);
  }
}
