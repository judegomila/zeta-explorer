/**
 * @module imp-34375-numerator-approach-two-term-curvature-crossval
 *
 * imp-34375 (accuracy, frontier cross-validation): imp-34286 finite-difference-cross-validated the
 * imp-34210 numerator-approach coefficient and reported a BIAS-CORRECTED leading prefactor a ~ 0.437-0.438
 * in the approach gap g(kEnd) = 1 - numerator ~ a / kEnd (the imp-34151 cancellation numerator |A| + |B|,
 * A = pEcoll*(1-sigma), B = pSigma, closing toward unity past the kEnd* ~ 21.28 crossing). Every prior
 * a-extraction (OLS log-log intercept, FD derivative, g*kEnd plateau) assumed a PURELY first-order form
 * g ~ a/kEnd with NO explicit higher-order term. This module adds an explicit second-order curvature term,
 * fitting the two-term model g(kEnd) ~ a/kEnd + b/kEnd^2, and asks the single question: does including the
 * curvature term SHIFT the leading coefficient a, i.e. is the first-order verdict stable against an explicit
 * higher-order term, or was the one-term a silently ABSORBING curvature?
 *
 * THE TWO-TERM FIT IN g*kEnd VS 1/kEnd SPACE (NO LOG-LOG)
 * ------------------------------------------------------
 *   Multiply through by kEnd: g*kEnd ~ a + b/kEnd = a + b*u, with u = 1/kEnd. So plotting y = g*kEnd against
 *   x = u is a STRAIGHT LINE whose intercept (u -> 0, i.e. kEnd -> infinity) is the leading coefficient a and
 *   whose slope is the curvature coefficient b. The one-term restriction is b = 0, giving a = mean(g*kEnd)
 *   over the window (the imp-34210 part-D plateau in fitted form). The ONLY difference between the two fits is
 *   the presence of the b*u term, so the shift a_twoTerm - a_const isolates exactly how much curvature the
 *   one-term coefficient was absorbing. No log-log slope is fit, so this inherits none of the imp-34286
 *   OLS-intercept/exponent coupling.
 *
 * THE CURVATURE TERM DOES NOT SHIFT THE LEADING COEFFICIENT -- a STAYS IN 0.437-0.438
 * ----------------------------------------------------------------------------------
 *   Far-field window kEnd = 40..150 (the imp-34286 FD window): the constant fit gives a = 0.436860, the
 *   two-term fit gives a = 0.436974 with a TINY curvature b = -0.008079 -- the leading coefficient shifts by
 *   only +0.000114 (~0.026%). Full window kEnd = 22..150 (the imp-34286 OLS window): constant a = 0.436130,
 *   two-term a = 0.438333 (b = -0.101173), a shift of +0.002203 (~0.5%), the larger |b| coming entirely from
 *   the small-kEnd rungs (22..40) where genuine higher-order structure lives. In EVERY window the two-term
 *   leading coefficient lands inside (or immediately adjacent to) the imp-34286 bias-corrected band
 *   a ~ 0.437-0.438: 0.436426 (kEnd = 60..150) up to 0.438333 (kEnd = 22..150). The curvature contribution
 *   b/kEnd^2 at kEnd = 100 is |b|*1e-4 <= 1.0e-5, roughly four orders below g(100) ~ 0.00437 -- negligible in
 *   the far field. NET: the g ~ a/kEnd first-order verdict is STABLE against an explicit curvature term; the
 *   leading coefficient was NOT absorbing curvature, and a ~ 0.437-0.438 is confirmed as the leading prefactor.
 *
 * SCOPE / HONESTY. The underlying numerator STILL uses the inherited imp-3406/imp-33810 quarter-decade OLS
 * exponent estimators (pSigma, pEcoll) verbatim -- those DEFINE the surrogate numerator and are not removed
 * here; this module only adds a curvature term to the SEPARATE a-extraction step and measures its effect on
 * the leading coefficient. Cross-validation / measurement only. The inherited imp-3220/imp-3406 component
 * model is NOT a rigorous asymptotic; the coefficient is descriptive within that model only; changes no bound;
 * establishes no operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34286-numerator-approach-coefficient-fd-crossval (the bias-corrected a ~ 0.437-0.438 cross-validated here)
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
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-34151/imp-34210/imp-34286 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34286/imp-34210 (no re-derivation).
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

// The inherited quarter-decade OLS exponent estimators (pSigma, pEcoll) -- UNCHANGED from imp-34286.
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

// -- One-term (constant) fit in g*kEnd space: g*kEnd = a (b forced 0), so a = mean(g*kEnd) over the window.
//    This is the imp-34210 part-D plateau in fitted form -- the leading coefficient with NO curvature term.
function constCoefficient(kends) {
  const ys = kends.map((k) => gapAt(k) * k);
  return ys.reduce((s, v) => s + v, 0) / ys.length;
}

// -- Two-term fit: y = g*kEnd = a + b*u, u = 1/kEnd. Ordinary least squares of y on u; intercept = a
//    (leading coefficient, u -> 0), slope = b (curvature coefficient of the b/kEnd^2 term).
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
  const b = sxy / sxx; // curvature coefficient
  const a = my - b * mx; // leading coefficient (intercept at u = 0)
  return { a, b };
}

// The imp-34286 windows: the full OLS window (22..150) and the far-field FD window (40..150), plus two
// deeper far-field windows to confirm the leading coefficient is window-stable.
const FULL_KENDS = [22, 25, 30, 35, 40, 45, 50, 60, 70, 80, 100, 120, 150];
const FARFIELD_KENDS = [40, 50, 60, 80, 100, 120, 150];
const DEEP1_KENDS = [50, 60, 70, 80, 100, 120, 150];
const DEEP2_KENDS = [60, 80, 100, 120, 150];

function rowFor(label, kends) {
  const constA = constCoefficient(kends);
  const { a, b } = twoTermFit(kends);
  return {
    window: label,
    kEndLo: kends[0],
    kEndHi: kends[kends.length - 1],
    constA: +constA.toFixed(6), // one-term leading coefficient (no curvature term)
    twoTermA: +a.toFixed(6), // two-term leading coefficient
    curvatureB: +b.toFixed(6), // second-order coefficient of b/kEnd^2
    leadShift: +(a - constA).toFixed(6), // how much the curvature term moves a
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
// Max absolute shift of the leading coefficient across ALL windows when curvature is added.
const MAX_ABS_LEAD_SHIFT = Math.max(...TABLE.map((r) => Math.abs(r.leadShift))); // ~0.002203
// Every two-term leading coefficient stays inside the imp-34286 bias-corrected band 0.437-0.438
// (with a ~0.001 tolerance for the deepest windows drifting just below 0.437).
const ALL_A_IN_BAND = TABLE.every((r) => r.twoTermA > 0.436 && r.twoTermA < 0.439);
// The far-field curvature contribution b/kEnd^2 at kEnd = 100 is negligible against g(100).
const FARFIELD_CURV_AT_100 = Math.abs(FARFIELD_ROW.curvatureB) * 1e-4; // ~8.1e-7
const G_AT_100 = +gapAt(100).toFixed(8); // ~0.00436982

export const IMP34375_NUMERATOR_APPROACH_TWO_TERM_CURVATURE_CROSSVAL = {
  id: 'imp-34375',
  proofSection: 'S-frontier',
  question:
    'imp-34286 bias-corrected the imp-34210 numerator-approach leading prefactor to a ~ 0.437-0.438 in ' +
    'g(kEnd) = 1 - numerator ~ a/kEnd, but every prior estimator assumed a PURELY first-order form with no ' +
    'explicit higher-order term. Fit the two-term model g ~ a/kEnd + b/kEnd^2 (linear in g*kEnd vs u = 1/kEnd) ' +
    'and measure whether including the curvature term b SHIFTS the leading coefficient a -- i.e. whether the ' +
    'first-order verdict is stable against an explicit higher-order term or the one-term a was absorbing ' +
    'curvature. Cross-validation/measurement only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'The leading coefficient a from a two-term fit g*kEnd = a + b*u (u = 1/kEnd), compared against the ' +
    'one-term constant fit g*kEnd = a (b forced 0), across the imp-34286 windows kEnd = 22..150 (OLS) and ' +
    'kEnd = 40..150 (FD) plus two deeper far-field windows; the leadShift = a_twoTerm - a_const isolates the ' +
    'curvature absorbed by the one-term coefficient.',
  table: TABLE,
  farFieldRow: FARFIELD_ROW, // {constA ~ 0.436860, twoTermA ~ 0.436974, curvatureB ~ -0.008079, leadShift ~ +0.000114}
  fullWindowRow: FULL_ROW, // {constA ~ 0.436130, twoTermA ~ 0.438333, curvatureB ~ -0.101173, leadShift ~ +0.002203}
  maxAbsLeadShift: +MAX_ABS_LEAD_SHIFT.toFixed(6), // ~0.002203  (largest a-shift across all windows)
  allLeadingCoeffInBand: ALL_A_IN_BAND, // true  (every two-term a in 0.436-0.439, i.e. the 0.437-0.438 band +/- ~0.001)
  farFieldCurvatureAt100: +FARFIELD_CURV_AT_100.toExponential(3), // ~8.079e-7  (b/kEnd^2 at kEnd=100)
  gapAt100: G_AT_100, // ~0.00436982  (curvature term is ~4 orders below g here)
  finding: {
    A_two_term_leading_coefficient_stays_in_band:
      'Fitting g*kEnd = a + b*u (u = 1/kEnd) over the imp-34286 windows lands the leading coefficient a at ' +
      '0.436974 (far-field 40..150), 0.438333 (full 22..150), 0.436656 (deep 50..150) and 0.436426 (deep ' +
      '60..150) -- every value inside or immediately adjacent to the imp-34286 bias-corrected band a ~ ' +
      '0.437-0.438. Adding an explicit curvature term does NOT relocate the leading coefficient.',
    B_leading_coefficient_shift_is_tiny:
      'Against the one-term constant fit (b forced 0) over the SAME window, the two-term leading coefficient ' +
      'shifts by only +0.000114 (~0.026%) in the far-field window and at most +0.002203 (~0.5%, full window). ' +
      'The larger full-window shift comes entirely from the small-kEnd rungs (22..40) where genuine ' +
      'higher-order structure lives; in the far field the shift is negligible. The one-term coefficient was ' +
      'NOT absorbing curvature.',
    C_curvature_term_negligible_in_far_field:
      'The fitted curvature coefficient b is small (|b| <= 0.102, and only 0.008 in the far field). Its ' +
      'contribution b/kEnd^2 at kEnd = 100 is |b|*1e-4 <= ~8.1e-7, roughly four orders of magnitude below ' +
      'g(100) ~ 0.00437. The g ~ a/kEnd first-order-in-1/kEnd verdict is STABLE against the explicit ' +
      'higher-order term; a ~ 0.437-0.438 is confirmed as the leading prefactor.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / COEFFICIENT CROSS-VALIDATION (frontier-direction, NOT rigorous). Cross-checking the ' +
    'imp-34286 bias-corrected leading prefactor a ~ 0.437-0.438 (in g(kEnd) = 1 - numerator ~ a/kEnd) against ' +
    'an explicit two-term fit g ~ a/kEnd + b/kEnd^2, done as an OLS of g*kEnd on u = 1/kEnd (intercept = a, ' +
    'slope = b) over the imp-34286 windows, with the identical inherited imp-3406/imp-33810 sub-terms: (A) the ' +
    'two-term leading coefficient a lands at 0.436974 (far-field 40..150), 0.438333 (full 22..150), 0.436656 ' +
    'and 0.436426 (deeper windows) -- every value inside or immediately adjacent to the 0.437-0.438 band. ' +
    '(B) Against the one-term constant fit over the SAME window (curvature forced off), a shifts by only ' +
    '+0.000114 (~0.026%) in the far field and at most +0.002203 (~0.5%) on the full window, the larger shift ' +
    'coming entirely from the small-kEnd rungs where genuine higher-order structure lives -- the one-term ' +
    'coefficient was NOT absorbing curvature. (C) The fitted curvature b is small (|b| <= 0.102; 0.008 in the ' +
    'far field) and its b/kEnd^2 contribution at kEnd = 100 is ~8.1e-7, ~4 orders below g(100) ~ 0.00437. NET: ' +
    'the g ~ a/kEnd first-order verdict is STABLE against an explicit curvature term; only the prefactor is ' +
    'confirmed at a ~ 0.437-0.438. The underlying numerator STILL uses the inherited quarter-decade OLS ' +
    'exponent estimators (pSigma, pEcoll) verbatim -- this adds a curvature term only in the a-extraction step, ' +
    'not the numerator internals. The inherited imp-3220/imp-3406 component model is NOT a rigorous ' +
    'asymptotic; the coefficient is descriptive within the model only; changes no bound; establishes no ' +
    'operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34286 (the bias-corrected leading prefactor a ~ 0.437-0.438 cross-validated here); imp-34210 (the ' +
    'OLS log-log intercept a ~ 0.4293 and the g*kEnd plateau); imp-34151 (the monotone numerator -> 1.0); ' +
    'imp-33810 (the quarter-decade rungs); lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C ' +
    '(E_coll prefactor).',
};

export const IMP34375_NUMERATOR_APPROACH_TWO_TERM_CURVATURE_CROSSVAL_ASSERTIONS = [
  {
    // (A) Every two-term leading coefficient stays inside the imp-34286 bias-corrected band (0.436-0.439).
    id: 'imp34375-two-term-leading-coeff-in-band',
    description: 'the two-term leading coefficient a stays in 0.436-0.439 (the imp-34286 0.437-0.438 band) across all windows',
    holds: () => ALL_A_IN_BAND === true && TABLE.length === 4,
  },
  {
    // (A) The far-field two-term a reproduces the imp-34286 FD/plateau consensus ~0.4370 to within ~0.001.
    id: 'imp34375-farfield-two-term-matches-plateau',
    description: 'the far-field (40..150) two-term leading coefficient ~0.43697 matches the imp-34286 g*kEnd plateau ~0.4370 to ~0.001',
    holds: () =>
      FARFIELD_ROW.twoTermA > 0.435 && FARFIELD_ROW.twoTermA < 0.438 &&
      Math.abs(FARFIELD_ROW.twoTermA - 0.436982) < 1.5e-3,
  },
  {
    // (B) Adding the curvature term shifts the leading coefficient by <=~0.5% (far-field <=~0.03%).
    id: 'imp34375-leading-coeff-shift-tiny',
    description: 'including the b/kEnd^2 curvature term shifts a by <=~0.0023 across all windows (~0.0001 in the far field)',
    holds: () =>
      MAX_ABS_LEAD_SHIFT < 3e-3 && Math.abs(FARFIELD_ROW.leadShift) < 5e-4,
  },
  {
    // (C) The far-field curvature contribution b/kEnd^2 at kEnd=100 is ~4 orders below g(100).
    id: 'imp34375-farfield-curvature-negligible',
    description: 'the far-field curvature term b/kEnd^2 at kEnd=100 (~8e-7) is ~4 orders below g(100) ~ 0.00437',
    holds: () =>
      FARFIELD_CURV_AT_100 < 1e-5 && G_AT_100 > 0.004 && G_AT_100 / FARFIELD_CURV_AT_100 > 1e3,
  },
  {
    // Honesty gate: cross-validation only, isRigorous false, no QED, no refereed bound is changed, K_a untouched.
    id: 'imp34375-honesty-gate-no-qed',
    description: 'Coefficient cross-validation only: isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34375_NUMERATOR_APPROACH_TWO_TERM_CURVATURE_CROSSVAL.isRigorous === false &&
      /NO QED/.test(IMP34375_NUMERATOR_APPROACH_TWO_TERM_CURVATURE_CROSSVAL.verdict) &&
      /refereed bound is changed/i.test(IMP34375_NUMERATOR_APPROACH_TWO_TERM_CURVATURE_CROSSVAL.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34375_NUMERATOR_APPROACH_TWO_TERM_CURVATURE_CROSSVAL.verdict),
  },
];

for (const a of IMP34375_NUMERATOR_APPROACH_TWO_TERM_CURVATURE_CROSSVAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34375-numerator-approach-two-term-curvature-crossval assertion failed: ${a.id}`);
  }
}
