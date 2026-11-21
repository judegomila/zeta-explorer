/**
 * imp-96891 -- Resolve the imp-96874 SUB-GAP IMP96874_SIGMA2_L_EXACTNESS: is the box-sine number-variance
 * window L = 495.779 an EXACT defined decimal box length, or a rounded T = 1.5e5 tiling proxy? Select the
 * 8e-14 (L exact) vs 1e-7 (L to 6 digits) Sigma^2 enclosure by tracing the provenance of L. Derivation
 * only; conditional on GUE; NO QED.
 *
 * THE SUB-GAP (imp-96874). imp-96874 certified the box-sine number variance Sigma^2(495.779) in
 * [0.9748336999829, 0.9748336999831] (half-width 7.8e-14) but flagged that this tight enclosure is
 * CONDITIONAL on L = 495.779 being the exact window. Because dSigma^2/dL = 1/(pi^2 L) = 2.043e-4 (the
 * oscillatory Ci/Si part of the derivative cancels), a 6-digit L (+/- 0.0005) widens the enclosure to
 * +/- 1.02e-7. imp-96874 could not say which regime applies without tracing where 495.779 came from.
 *
 * THE PROVENANCE (imp-96109 / imp-96542 / imp-96567). Following the chain back, L is NOT introduced as a
 * decimal at all. imp-96109 (line "L = 2*Delta*delta(T)") DEFINES it as the mean number of zeros in one
 * width-2*Delta hard box at the significant height T = 1.5e5:
 *   Delta   = sqrt(T / (2 pi)),
 *   delta(T)= log(T / (2 pi)) / (2 pi)   (the local mean zero density),
 *   L(T)    = 2 * Delta * delta(T) = sqrt(T/(2 pi)) * log(T/(2 pi)) / pi.
 * At the EXACT input T = 1.5e5 this evaluates to
 *   L(1.5e5) = 495.7794011038582   (full double precision),
 * and "495.779" is simply its 6-digit rounding. imp-96542 / imp-96567 then carry the rounded 6-digit
 * literal forward as "the T = 1.5e5 box length"; imp-96874 enclosed Sigma^2 at that literal.
 *
 * THE ANSWER TO THE SUB-GAP. L = 495.779 is NEITHER an exact defined decimal window NOR a T/n integer
 * tiling ratio: T/L = 302.5539 and (10^6-zero span)/L = 2017.0261 are both non-integer, so no "T divided
 * by an integer number of boxes" reading pins it. It is a 6-digit ROUNDED PROXY for the transcendental
 * L(T) = sqrt(T/(2 pi)) log(T/(2 pi)) / pi evaluated at the exact height T = 1.5e5. Since T is exact and
 * L(T) is a deterministic elementary-transcendental function, L is pinnable to full double precision:
 * perturbing the argument T/(2 pi) by one ulp moves L by ~1.14e-13, which propagates through 1/(pi^2 L)
 * to a Sigma^2 change of ~2.3e-17. So the TIGHT 8e-14 regime is the correct selection -- the 1e-7 floor
 * was an artifact of pretending L was known only to the 6 printed digits, which it is not.
 *
 * THE CORRECTION (a consequence of pinning L exactly). The tight enclosure must be RE-CENTERED. imp-96874
 * evaluated Sigma^2 at the truncated literal 495.779000, obtaining 0.97483369998301. At the formula-exact
 * window L = 495.7794011038582 the SAME closed form gives
 *   Sigma^2(L exact) = 0.97483378192975,
 * which is 8.19e-8 ABOVE imp-96874`s central value. This offset is exactly the sub-gap width the linear
 * sensitivity predicted: (L exact - 495.779) * dSigma^2/dL = 4.011e-4 * 2.043e-4 = 8.20e-8. So the 1e-7
 * "honest floor" imp-96874 quoted was not extra uncertainty to be lived with -- it was the size of the
 * error incurred by anchoring on the 6-digit literal, and pinning L via the formula both removes the
 * sub-gap AND moves the certified value up by ~8.2e-8 to Sigma^2 = 0.9748337819 (tight half-width ~2e-13,
 * dominated by imp-96874`s own series/argument budget, the L-pinning contribution being ~2e-17).
 *
 * VERDICT. SUB-GAP IMP96874_SIGMA2_L_EXACTNESS is RESOLVED: L = 495.779 is a 6-digit rounded proxy for the
 * exact-height transcendental L(T) = sqrt(T/(2 pi)) log(T/(2 pi)) / pi = 495.7794011038582 at the exact
 * T = 1.5e5 (neither an exact decimal window nor a T/n integer tiling ratio, T/L = 302.55, span/L =
 * 2017.03). Because T is exact, L is pinnable to double precision (~1e-13), so the TIGHT 8e-14 enclosure
 * regime is selected -- but it must be re-centered on the formula-exact window: Sigma^2(495.7794011) =
 * 0.97483378192975, which is +8.19e-8 relative to imp-96874`s 495.779-literal value 0.97483369998301
 * (offset = 4.011e-4 * 2.043e-4 = 8.20e-8). The prior 1e-7 fallback was exactly this L-truncation gap,
 * not irreducible uncertainty. This tightens imp-96853 residual item (i) to a formula-anchored 8e-14
 * enclosure and closes the sub-gap, leaving item (iii) (GUE throughout) as the standing condition.
 * Derivation only; conditional on the GUE sine kernel / Montgomery pair correlation for the zeta zeros
 * (UNPROVEN, GRH-flavored); changes NO unconditional bound; RH open; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96874-boxsine-number-variance-interval-enclosure (the enclosure and the sub-gap this resolves)
 * @see imp-96109-tue5-dip-decorrelation-safety-margin (the L = 2*Delta*delta(T) definition of the window)
 * @see imp-96542-excursion-empirical-lag2-lag3-box-covariance (carries the rounded literal forward)
 * @see imp-96567-box-averaged-sine-kernel-lag-decay (the direct Sigma^2 = 0.974834 at the rounded literal)
 *
 * Import-light: no zeros bundle, no sibling imports. The provenance formula, the exact L, the two Sigma^2
 * evaluations, and the re-centering offset are re-derived here and checked in the self-tests below.
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;
const GAMMA = 0.5772156649015329;

const T_SIGNIFICANT = 1.5e5; // the imp-96089 / imp-96109 significant height (EXACT input)

// The provenance formula (imp-96109): L = mean zeros in a width-2*Delta hard box at height T.
//   Delta = sqrt(T/(2 pi)),  delta = log(T/(2 pi))/(2 pi),  L = 2*Delta*delta = sqrt(T/2pi) log(T/2pi) / pi.
function boxLengthFromHeight(Tval) {
  const arg = Tval / TWO_PI;
  return (Math.sqrt(arg) * Math.log(arg)) / PI;
}

const L_EXACT = boxLengthFromHeight(T_SIGNIFICANT); // 495.7794011038582 (full double precision)
const L_LITERAL = 495.779; // the 6-digit rounded proxy carried by imp-96542 / imp-96567 / imp-96874
const DELTA_L = L_EXACT - L_LITERAL; // 4.011e-4 truncation

// Double-precision pinning of L: one-ulp perturbation of the argument T/(2 pi).
const _arg = T_SIGNIFICANT / TWO_PI;
const _Lp = (Math.sqrt(_arg * (1 + Number.EPSILON)) * Math.log(_arg * (1 + Number.EPSILON))) / PI;
const _Lm = (Math.sqrt(_arg * (1 - Number.EPSILON)) * Math.log(_arg * (1 - Number.EPSILON))) / PI;
const L_PIN_SPREAD = Math.abs(_Lp - _Lm); // ~1.14e-13

// The exact Dyson-Mehta number variance via the enveloping Stieltjes midpoints (imp-96874 convention).
function sigma2(Lval) {
  const x = TWO_PI * Lval;
  const flo = 1 / x - 2 / x ** 3 + 24 / x ** 5 - 720 / x ** 7;
  const fhi = 1 / x - 2 / x ** 3 + 24 / x ** 5;
  const glo = 1 / (x * x) - 6 / x ** 4 + 120 / x ** 6 - 5040 / x ** 8;
  const ghi = 1 / (x * x) - 6 / x ** 4 + 120 / x ** 6;
  const f = (flo + fhi) / 2, g = (glo + ghi) / 2;
  const c = Math.cos(x), s = Math.sin(x), lnx = Math.log(x);
  const A = (lnx + GAMMA + 1 - c - f * s + g * c) / (PI * PI);
  const B = ((2 * Lval) / PI) * (f * c + g * s);
  return A + B;
}

const SIGMA2_AT_LITERAL = sigma2(L_LITERAL); // 0.97483369998301 (imp-96874`s value, at the truncated L)
const SIGMA2_AT_EXACT = sigma2(L_EXACT); // 0.97483378192975 (at the formula-exact window)
const RECENTER_OFFSET = SIGMA2_AT_EXACT - SIGMA2_AT_LITERAL; // 8.19e-8
const LEADING_DERIV = 1 / (PI * PI * L_EXACT); // 2.043e-4
const PREDICTED_OFFSET = DELTA_L * LEADING_DERIV; // 8.20e-8 (linear-sensitivity prediction)
const SIGMA2_PIN_HALFWIDTH = LEADING_DERIV * L_PIN_SPREAD; // ~2.3e-17 (L-pinning contribution to Sigma^2)

// Integer-tiling disproof: neither T/L nor (10^6-zero span)/L is an integer, so L is not a T/n proxy.
const T_OVER_L = T_SIGNIFICANT / L_EXACT; // 302.5539
const SPAN_OVER_L = 1e6 / L_EXACT; // 2017.0261

export const IMP96891_BOXSINE_WINDOW_L_EXACTNESS_PROVENANCE = {
  ticket: 'imp-96891',
  question:
    'Is the box-sine number-variance window L = 495.779 an exact defined decimal box length or a rounded T = 1.5e5 tiling proxy? Trace its provenance to select the 8e-14 (L exact) vs 1e-7 (L to 6 digits) Sigma^2 enclosure (imp-96874 SUB-GAP IMP96874_SIGMA2_L_EXACTNESS).',
  provenance:
    'imp-96109 DEFINES the window as L = 2*Delta*delta(T), Delta = sqrt(T/(2 pi)), delta = log(T/(2 pi))/(2 pi), i.e. the mean number of zeros in a width-2*Delta hard box at the significant height T = 1.5e5. imp-96542 / imp-96567 carry the 6-digit rounding 495.779 forward; imp-96874 enclosed Sigma^2 at that literal.',
  boxLengthFormula: 'L(T) = sqrt(T/(2 pi)) * log(T/(2 pi)) / pi  (= 2*Delta*delta, mean zeros per width-2*Delta box)',
  significantHeight: T_SIGNIFICANT,
  lExact: L_EXACT, // 495.7794011038582
  lLiteral: L_LITERAL, // 495.779
  deltaL: DELTA_L, // 4.011e-4 truncation of the literal vs the formula-exact value
  notExactDecimal: true,
  notIntegerTiling: { T_over_L: T_OVER_L, span_over_L: SPAN_OVER_L, bothNonInteger: true },
  lPinnableToDoublePrecision: { ulpSpread: L_PIN_SPREAD, sigma2Contribution: SIGMA2_PIN_HALFWIDTH },
  regimeSelected: 'tight 8e-14 (L pinned by the formula), NOT the 1e-7 fallback',
  sigma2AtLiteral: SIGMA2_AT_LITERAL, // 0.97483369998301 (imp-96874)
  sigma2AtExact: SIGMA2_AT_EXACT, // 0.97483378192975 (formula-exact window)
  recenterOffset: RECENTER_OFFSET, // +8.19e-8: imp-96874`s value is low by this, from the L-truncation
  predictedOffset: PREDICTED_OFFSET, // 8.20e-8 = deltaL * 1/(pi^2 L), matching the measured recenter
  correction:
    'The tight enclosure must be re-centered on the formula-exact window: Sigma^2(495.7794011) = 0.97483378192975, which is +8.19e-8 relative to imp-96874`s 495.779-literal 0.97483369998301. The 1e-7 fallback was exactly this L-truncation gap, not irreducible uncertainty.',
  conditionality:
    'Conditional on the GUE sine kernel / Montgomery pair correlation holding for the actual zeta zeros (UNPROVEN, GRH-flavored) -- imp-96853 residual item (iii), untouched here. Changes NO unconditional bound.',
  verdict:
    'SUB-GAP IMP96874_SIGMA2_L_EXACTNESS is RESOLVED: L = 495.779 is a 6-digit rounded proxy for the exact-height transcendental L(T) = sqrt(T/(2 pi)) log(T/(2 pi)) / pi = 495.7794011038582 at the exact T = 1.5e5 (neither an exact decimal window nor a T/n integer tiling ratio: T/L = 302.55, span/L = 2017.03 are both non-integer). Because T is exact, L is pinnable to double precision (ulp spread ~1.1e-13 -> Sigma^2 shift ~2e-17), so the TIGHT 8e-14 enclosure regime is selected -- but it must be re-centered on the formula-exact window: Sigma^2(495.7794011) = 0.97483378192975, which is +8.19e-8 relative to imp-96874`s 495.779-literal value 0.97483369998301 (offset = 4.011e-4 * 2.043e-4 = 8.20e-8). The prior 1e-7 fallback was exactly this L-truncation gap, not irreducible uncertainty. This tightens imp-96853 residual item (i) to a formula-anchored 8e-14 enclosure and closes the sub-gap, leaving item (iii) (GUE throughout) as the standing condition. Derivation only; conditional on the GUE sine kernel / Montgomery pair correlation for the zeta zeros (UNPROVEN); changes NO unconditional bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96428 / imp-96593 / imp-96853 / imp-96874 convention).
export const IMP96891_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Derivation only: the box-sine number-variance window '
  + 'L = 495.779 is a 6-digit rounded proxy for the transcendental L(T) = sqrt(T/(2 pi)) log(T/(2 pi)) / pi '
  + '= 495.7794011038582 at the exact height T = 1.5e5 (not an exact decimal, not a T/n integer tiling: '
  + 'T/L = 302.55, span/L = 2017.03). Since T is exact, L is pinnable to double precision, so the TIGHT '
  + '8e-14 regime is selected, but re-centered on the formula-exact window: Sigma^2 = 0.97483378192975, '
  + '+8.19e-8 above imp-96874`s 495.779-literal 0.97483369998301 (offset = deltaL * 1/(pi^2 L)). This '
  + 'RESOLVES SUB-GAP IMP96874_SIGMA2_L_EXACTNESS. Conditional on the pair correlation for the zeta zeros '
  + '(UNPROVEN); changes no unconditional bound.';

// --- self-executing internal-consistency assertions (re-derivation; no zeros, no offline script) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // 1. The provenance formula reproduces 495.779 to 6 digits from the exact height T = 1.5e5.
  if (!approx(L_EXACT, 495.779, 5e-4)) throw new Error('imp-96891: L(T) formula must reproduce 495.779 to 6 digits');
  if (!approx(L_EXACT, 495.7794011038582, 1e-10)) throw new Error('imp-96891: L exact drifted from 495.7794011038582');

  // 2. L = 495.779 is NOT a T/n integer tiling ratio (neither T/L nor the 10^6-span/L is an integer).
  const nearInt = (v) => Math.abs(v - Math.round(v)) < 1e-3;
  if (nearInt(T_OVER_L) || nearInt(SPAN_OVER_L))
    throw new Error('imp-96891: L must NOT be a T/n integer tiling ratio');

  // 3. L is pinnable to double precision (tight regime): ulp spread negligible for Sigma^2.
  if (!(L_PIN_SPREAD < 1e-12)) throw new Error('imp-96891: L ulp spread must be below 1e-12 (double-precision pinnable)');
  if (!(SIGMA2_PIN_HALFWIDTH < 1e-15)) throw new Error('imp-96891: L-pinning Sigma^2 contribution must be < 1e-15');

  // 4. The Sigma^2 at the truncated literal reproduces imp-96874`s stated central value.
  if (!approx(SIGMA2_AT_LITERAL, 0.97483369998301, 1e-12))
    throw new Error('imp-96891: Sigma^2 at 495.779 must reproduce imp-96874`s 0.97483369998301');

  // 5. The re-centering offset equals the linear-sensitivity prediction deltaL * 1/(pi^2 L).
  if (!approx(SIGMA2_AT_EXACT, 0.97483378192975, 1e-12))
    throw new Error('imp-96891: Sigma^2 at the formula-exact L drifted from 0.97483378192975');
  if (!approx(RECENTER_OFFSET, PREDICTED_OFFSET, 1e-10))
    throw new Error('imp-96891: measured re-centering offset must match deltaL * 1/(pi^2 L)');
  if (!approx(RECENTER_OFFSET, 8.2e-8, 5e-10))
    throw new Error('imp-96891: re-centering offset drifted from 8.2e-8');

  // honesty gates
  const V = IMP96891_BOXSINE_WINDOW_L_EXACTNESS_PROVENANCE.verdict;
  if (!/NO QED/.test(V)) throw new Error('imp-96891: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(V)) throw new Error('imp-96891: verdict dropped the no-refereed-bound-change banner');
  if (!/[Cc]onditional/.test(V)) throw new Error('imp-96891: verdict must flag the result as CONDITIONAL');
  if (!(/RH open/.test(IMP96891_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96891_HONEST_BANNER) && /NO QED/.test(IMP96891_HONEST_BANNER)))
    throw new Error('imp-96891: IMP96891_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96891_BOXSINE_WINDOW_L_EXACTNESS_PROVENANCE;
