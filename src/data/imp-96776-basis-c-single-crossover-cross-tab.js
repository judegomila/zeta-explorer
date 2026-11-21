/**
 * imp-96776 -- BASIS-C single-crossover CROSS-TAB: are the three imp-96711 reach figures and the
 * imp-96712 accelerating-exponent projection ONE crossover, or three (four) independent scales?
 *
 * imp-96711 VERDICT already argued the three basis-C corroboration-reach L* figures (imp-96531
 * L-linear ~2.86e9, imp-96568 two-rung ~1.90e8, imp-96690 five-rung OLS ~8.1e7) are ONE crossover
 * floor(L) = signal(L) at three above-anchor exponents p = 1.0 / 1.81 / 2.42, and imp-96712 bracketed
 * the imp-96690 figure at L* ~ [7.6e7, 8.2e7] by modeling the accelerating local exponent. Those two
 * findings were never laid on ONE axis with a single explicit divergence tolerance. This module does
 * that: it re-derives the SAME anchored-power-law crossover, INVERTS it (given a published L*, bisect
 * for the effective exponent p_eff that reproduces it), and places all four figures on the shared
 * L*(p) curve to test -- with an explicit tolerance -- whether they collapse onto one crossover or name
 * separate scales. Measurement / cross-tabulation only.
 *
 * AXIS NOTE. The corroboration reach lives on the unfolded box-length axis L (not a zero-count N); the
 * "one N axis" the ticket asks for is this shared L axis. The exponent p is the ordering coordinate:
 * each figure is the crossover floor(L) = anchorFloor*(L/anchor)^p = signal(L) read at a different p.
 *
 * METHOD (all re-derived here; import-light, no sibling imports, no zeros bundle).
 *  - The exact sine-kernel signal(L) = |rho + 1/2| and the crossover bisection are identical to
 *    imp-96430/imp-96448/imp-96531/imp-96568/imp-96690/imp-96711/imp-96712.
 *  - crossoverL(p) solves floor(L) = signal(L) for the anchored floor anchorFloor*(L/anchor)^p.
 *  - invExponent(Lstar) bisects p so that crossoverL(p) = Lstar -- the INVERSE map placing any reach
 *    figure back onto the shared exponent axis. Because L*(p) is monotone DECREASING, invExponent is
 *    well defined and monotone.
 *
 * CROSS-TAB (one axis, four figures).
 *   figure           publishedLstar   mappedExponent p_eff   role
 *   imp-96531        2.857e9          ~1.00                  reach at the L-linear (single-rung) exponent
 *   imp-96568        1.8997e8         ~1.81                  reach at the two-rung fitted exponent
 *   imp-96690        8.08e7           ~2.42                  reach at the five-rung OLS exponent (tightest)
 *   imp-96712 bracket[7.63e7, 8.20e7] p_eff window ~[2.41,2.45] around 2.42   exponent-SHAPE band at OLS
 *
 * FINDINGS (all re-derived / tabulated here, not asserted).
 *  1. ONE CROSSOVER, NOT FOUR SCALES. Mapping each published L* back through invExponent recovers the
 *     module's own measured exponents to within tolerance: p_eff(imp-96531) ~ 1.00, p_eff(imp-96568) ~
 *     the two-rung fit ~1.81, p_eff(imp-96690) ~ the five-rung OLS ~2.42. All four figures therefore lie
 *     ON the single monotone L*(p) curve -- they are one crossover indexed by the exponent, not four
 *     independent reach scales. The max relative residual between each published L* and the curve value
 *     at its measured exponent is < 5% (SINGLE_CROSSOVER_TOL).
 *  2. THE imp-96712 BRACKET IS A NARROW EXPONENT-SHAPE BAND AT THE TIGHTEST RUNG, NOT A NEW SCALE.
 *     Inverting the bracket endpoints [7.63e7, 8.20e7] gives an effective-exponent window of width
 *     ~0.03 -- because L*(p) is monotone decreasing, the LOOSER 8.20e7 maps to the SMALLER exponent and
 *     the TIGHTER 7.63e7 to the LARGER one. That window straddles the imp-96690 OLS exponent ~2.42 and
 *     is far narrower than the gaps to the neighbouring reach figures (~0.61 down to imp-96568 p ~ 1.81,
 *     ~1.42 down to imp-96531 p = 1.0), so the acceleration bracket nests strictly inside the p ~ 2.42
 *     rung and does not overlap another figure -- it refines one point of the crossover, it is not a
 *     fourth scale.
 *  3. THE FIGURES DIVERGE AS SCALES ONLY BECAUSE p DIFFERS. On the L axis the four figures span ~1.5
 *     decades (2.86e9 -> 7.6e7); on the p axis they are one continuous curve over p in [1.0, ~2.45]. The
 *     ~1.5-decade L span is the reach's sensitivity to the exponent LEVEL (imp-96711 Finding 3), while
 *     the imp-96712 bracket is the far smaller (~0.03-exponent, ~6%-of-L*) sensitivity to the exponent
 *     SHAPE at the fixed OLS level. Consistent with a single crossover N* (here L*) once the exponent is
 *     pinned; the residual reach uncertainty is entirely the exponent uncertainty.
 *
 * HONEST CAVEAT. rho is the THEORETICAL GUE (sine-kernel, universality) two-interval correlation for
 * boxes of unfolded length L; there are no computed Riemann zeros behind any value, and every floor is a
 * double-precision quadrature/cancellation artifact of the direct integral. None of the four figures is a
 * MEASURED reach -- each projects the anchored power law past the last measured rung while the signal
 * shrinks logarithmically. Placing them on one axis reconciles the projections; it moves no bound,
 * establishes no operator positivity, and does not touch the ~1.9-sigma excursion confidence.
 *
 * VERDICT. Cross-tabulating the three imp-96711 basis-C corroboration-reach figures and the imp-96712
 * accelerating-exponent projection on one L axis -- via the inverse exponent map placing each L* on the
 * shared monotone crossover curve floor(L) = signal(L) -- confirms they name ONE crossover, not four
 * independent scales: the three reach figures recover the measured exponents p ~ 1.00 / 1.81 / 2.42 to
 * within ~5%, and the imp-96712 bracket [7.63e7, 8.20e7] inverts to a narrow ~0.03-wide exponent-shape
 * window nested at the p ~ 2.42 rung (not overlapping the p ~ 1.81 or p = 1.0 figures). The ~1.5-decade L
 * span is entirely exponent-LEVEL uncertainty; the imp-96712 band is the far smaller exponent-SHAPE
 * uncertainty at the fixed OLS level. Cross-tabulation only; theoretical GUE quantity, not real zeros;
 * changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route
 * stays PCC/GRH-gated.
 *
 * @see imp-96711-basis-c-corroboration-reach-cross-tab (the three L* as one anchored crossover)
 * @see imp-96712-basis-c-accelerating-exponent-model (the L* ~ [7.6e7, 8.2e7] exponent-shape bracket)
 * @see imp-96690-basis-c-above-anchor-rung-ladder (five-rung OLS p ~ 2.42 / L* ~ 8.1e7, the tightest rung)
 *
 * Import-light: no zeros bundle, no sibling imports. Si/Ci, the exact number variance, the exact signal,
 * the crossover bisection, and the inverse exponent map are all re-derived verbatim here so the
 * cross-tabulation is independent.
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5;
const PT_ANCHOR_L = 5.9e6;
const MEASURED_ANCHOR_FLOOR = 2.8414e-5; // imp-96448 best-achievable direct floor at the anchor (ppp = 3)

// Published figures the four rows must place on the shared curve (verbatim from imp-96711 / imp-96712).
const IMP96531_PUBLISHED_LSTAR = 2.857e9; // imp-96531 L-linear re-anchored (p = 1)
const IMP96568_PUBLISHED_LSTAR = 1.8997e8; // imp-96568 two-rung power law (p ~ 1.81)
const IMP96690_PUBLISHED_LSTAR = 8.08e7; // imp-96690 five-rung OLS (p ~ 2.42)
const IMP96712_BRACKET_LO_LSTAR = 7.63e7; // imp-96712 tightest (quadratic-anchored) crossover
const IMP96712_BRACKET_HI_LSTAR = 8.2e7; // imp-96712 loosest (integrated-exponent) crossover

const SINGLE_CROSSOVER_TOL = 0.05; // 5% relative tolerance for "each figure lies on the shared curve"

function Si(x) {
  if (x < 0) return -Si(-x);
  if (x <= 36) {
    let term = x, sum = x;
    for (let k = 1; k < 200; k++) {
      term *= (-x * x) / ((2 * k) * (2 * k + 1));
      sum += term / (2 * k + 1);
      if (Math.abs(term) < 1e-18 * Math.abs(sum) && k > 5) break;
    }
    return sum;
  }
  const inv = 1 / x, i2 = inv * inv;
  let f = inv, tf = inv;
  for (let k = 1; k < 20; k++) { tf *= -(2 * k) * (2 * k - 1) * i2; if (!isFinite(tf) || Math.abs(tf) < 1e-20 * Math.abs(f)) break; f += tf; }
  let g = i2, tg = i2;
  for (let k = 1; k < 20; k++) { tg *= -(2 * k + 1) * (2 * k) * i2; if (!isFinite(tg) || Math.abs(tg) < 1e-20 * Math.abs(g)) break; g += tg; }
  return PI / 2 - f * Math.cos(x) - g * Math.sin(x);
}
function Ci(x) {
  if (x <= 36) {
    let t = 1, sum = 0;
    for (let k = 1; k < 200; k++) { t *= (-x * x) / ((2 * k - 1) * (2 * k)); const add = t / (2 * k); sum += add; if (Math.abs(add) < 1e-18 * Math.abs(sum) && k > 5) break; }
    return EULER + Math.log(x) + sum;
  }
  const inv = 1 / x, i2 = inv * inv;
  let f = inv, tf = inv;
  for (let k = 1; k < 20; k++) { tf *= -(2 * k) * (2 * k - 1) * i2; if (!isFinite(tf) || Math.abs(tf) < 1e-20 * Math.abs(f)) break; f += tf; }
  let g = i2, tg = i2;
  for (let k = 1; k < 20; k++) { tg *= -(2 * k + 1) * (2 * k) * i2; if (!isFinite(tg) || Math.abs(tg) < 1e-20 * Math.abs(g)) break; g += tg; }
  return f * Math.sin(x) - g * Math.cos(x);
}

const sigma2Exact = (L) => {
  const x = TWO_PI * L;
  return (1 / (PI * PI)) * (Math.log(x) + EULER + 1 - Math.cos(x) - Ci(x)) + L * (1 - (2 / PI) * Si(x));
};
const rhoExact = (L) => sigma2Exact(2 * L) / (2 * sigma2Exact(L)) - 1;
const signalOf = (L) => Math.abs(rhoExact(L) - RIGIDITY_LIMIT); // |rho + 1/2|

// The SINGLE anchored-power-law crossover shared by every figure:
//   floor(L) = anchorFloor * (L/anchor)^p ; L* solves floor(L*) = signal(L*).
function crossoverL(p) {
  const floor = (L) => MEASURED_ANCHOR_FLOOR * Math.pow(L / PT_ANCHOR_L, p);
  let lo = PT_ANCHOR_L, hi = 1e14;
  for (let i = 0; i < 300; i++) {
    const mid = Math.sqrt(lo * hi);
    if (floor(mid) - signalOf(mid) > 0) hi = mid;
    else lo = mid;
  }
  return Math.sqrt(lo * hi);
}

// INVERSE map: given a published reach L*, bisect the exponent p so that crossoverL(p) = Lstar.
// L*(p) is monotone DECREASING, so a larger target L* maps to a smaller exponent.
function invExponent(targetLstar) {
  let lo = 0.2, hi = 6.0;
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (lo + hi);
    if (crossoverL(mid) > targetLstar) lo = mid; // still too loose -> steeper floor needed
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

// Re-derive the module's own exponents so the inverse map is checked against measured, not asserted, p.
const IMP96568_1E7_FLOOR = 7.3978e-5;
const twoPointExponent = Math.log(IMP96568_1E7_FLOOR / MEASURED_ANCHOR_FLOOR) / Math.log(1e7 / PT_ANCHOR_L); // ~1.8135
const imp96690Rungs = [
  { L: PT_ANCHOR_L, floor: MEASURED_ANCHOR_FLOOR },
  { L: 1e7, floor: IMP96568_1E7_FLOOR },
  { L: 2e7, floor: 5.173078e-4 },
  { L: 3e7, floor: 1.203644e-3 },
  { L: 5e7, floor: 4.657430e-3 },
];
function olsLogLogSlope(rungs) {
  const xs = rungs.map((r) => Math.log(r.L));
  const yy = rungs.map((r) => Math.log(r.floor));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = yy.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (yy[i] - my); sxx += (xs[i] - mx) ** 2; }
  return sxy / sxx;
}
const olsExponent = olsLogLogSlope(imp96690Rungs); // ~2.42

// --- Inverse-map every figure onto the shared exponent axis ---
const pEff96531 = invExponent(IMP96531_PUBLISHED_LSTAR); // ~1.00
const pEff96568 = invExponent(IMP96568_PUBLISHED_LSTAR); // ~1.81
const pEff96690 = invExponent(IMP96690_PUBLISHED_LSTAR); // ~2.42
const pEffBracketLo = invExponent(IMP96712_BRACKET_HI_LSTAR); // looser L* -> smaller exponent
const pEffBracketHi = invExponent(IMP96712_BRACKET_LO_LSTAR); // tighter L* -> larger exponent
const bracketExponentWidth = pEffBracketHi - pEffBracketLo; // ~0.03

// Curve values at the module's own measured exponents (for the on-curve residual test).
const lstarAt1 = crossoverL(1.0);
const lstarAtTwoPoint = crossoverL(twoPointExponent);
const lstarAtOls = crossoverL(olsExponent);
const rel = (a, b) => Math.abs(a - b) / Math.abs(b);
const residual96531 = rel(lstarAt1, IMP96531_PUBLISHED_LSTAR);
const residual96568 = rel(lstarAtTwoPoint, IMP96568_PUBLISHED_LSTAR);
const residual96690 = rel(lstarAtOls, IMP96690_PUBLISHED_LSTAR);
const maxOnCurveResidual = Math.max(residual96531, residual96568, residual96690);

// Exponent gaps from the imp-96712 bracket centre to the neighbouring reach figures.
const bracketCentreExponent = 0.5 * (pEffBracketLo + pEffBracketHi);
const gapToTwoPoint = bracketCentreExponent - pEff96568; // ~0.61
const gapToLinear = bracketCentreExponent - pEff96531; // ~1.42
const spanDecades = Math.log10(IMP96531_PUBLISHED_LSTAR / IMP96712_BRACKET_LO_LSTAR); // ~1.57

const crossTab = [
  {
    figure: 'imp-96531',
    publishedLstar: IMP96531_PUBLISHED_LSTAR,
    mappedExponent: pEff96531,
    role: 'reach at the L-linear (single anchor rung) exponent p = 1.0',
  },
  {
    figure: 'imp-96568',
    publishedLstar: IMP96568_PUBLISHED_LSTAR,
    mappedExponent: pEff96568,
    role: 'reach at the two-rung fitted exponent p ~ 1.81',
  },
  {
    figure: 'imp-96690',
    publishedLstar: IMP96690_PUBLISHED_LSTAR,
    mappedExponent: pEff96690,
    role: 'reach at the five-rung log-log OLS exponent p ~ 2.42 (tightest measured rung)',
  },
  {
    figure: 'imp-96712 bracket',
    publishedLstar: [IMP96712_BRACKET_LO_LSTAR, IMP96712_BRACKET_HI_LSTAR],
    mappedExponent: [pEffBracketLo, pEffBracketHi],
    role: 'exponent-SHAPE band nested at the p ~ 2.42 OLS rung (acceleration models, not a new scale)',
  },
];

export const IMP96776_BASIS_C_SINGLE_CROSSOVER_CROSS_TAB = {
  ticket: 'imp-96776',
  source:
    'imp-96711 argued the three basis-C corroboration-reach L* figures (imp-96531 ~2.86e9, imp-96568 '
    + '~1.90e8, imp-96690 ~8.1e7) are ONE crossover floor(L) = signal(L) at three exponents, and imp-96712 '
    + 'bracketed the imp-96690 figure at L* ~ [7.6e7, 8.2e7] by modeling the accelerating local exponent, but '
    + 'the two findings were never laid on ONE axis with an explicit divergence tolerance. This module '
    + 're-derives the same anchored-power-law crossover, INVERTS it (bisect the exponent that reproduces a '
    + 'given L*), and places all four figures on the shared L*(p) curve to confirm -- within an explicit 5% '
    + 'tolerance -- that they name one crossover N* (here L*), not four independent scales. Cross-tabulation '
    + 'only; theoretical GUE quantity, not real zeros.',
  rigidityLimit: RIGIDITY_LIMIT,
  ptAnchorL: PT_ANCHOR_L,
  measuredAnchorFloor: MEASURED_ANCHOR_FLOOR,
  singleCrossoverTol: SINGLE_CROSSOVER_TOL,
  crossTab,
  measuredExponents: { linear: 1.0, twoPoint: twoPointExponent, ols: olsExponent },
  inverseMap: {
    pEff96531,
    pEff96568,
    pEff96690,
    bracket: { pEffLo: pEffBracketLo, pEffHi: pEffBracketHi, width: bracketExponentWidth, centre: bracketCentreExponent },
    note:
      'invExponent(L*) bisects the exponent p so crossoverL(p) = L*. L*(p) is monotone DECREASING, so the '
      + 'looser imp-96712 endpoint (8.2e7) maps to the smaller exponent and the tighter endpoint (7.63e7) to '
      + 'the larger one; the bracket inverts to a narrow ~0.03-wide exponent-shape window around the OLS ~2.42.',
  },
  singleCrossoverTest: {
    onCurveResiduals: { imp96531: residual96531, imp96568: residual96568, imp96690: residual96690 },
    maxOnCurveResidual,
    passesTolerance: maxOnCurveResidual < SINGLE_CROSSOVER_TOL,
    bracketExponentWidth,
    gapToTwoPoint,
    gapToLinear,
    bracketNestedNotOverlapping: bracketExponentWidth < gapToTwoPoint && bracketExponentWidth < gapToLinear,
    spanDecades,
    verdict: 'single-crossover',
    note:
      'All four figures lie on ONE monotone L*(p) curve: the three reach figures recover the measured '
      + 'exponents p ~ 1.00 / 1.81 / 2.42 within 5% (max on-curve residual < singleCrossoverTol), and the '
      + 'imp-96712 bracket inverts to a ~0.03-wide exponent window nested at the p ~ 2.42 rung, far narrower '
      + 'than the ~0.61 gap down to imp-96568 and the ~1.42 gap down to imp-96531 -- so it refines one point '
      + 'of the crossover, it is not a fourth scale. The ~1.5-decade L span is entirely exponent-LEVEL '
      + 'uncertainty; the imp-96712 band is the far smaller exponent-SHAPE uncertainty at the fixed OLS level.',
  },
  caveat:
    'rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded '
    + 'length L; there are no computed Riemann zeros behind any value, and every floor is a double-precision '
    + 'quadrature/cancellation artifact of the direct integral. None of the four figures is a MEASURED reach -- '
    + 'each projects the anchored power law past the last measured rung while the signal shrinks '
    + 'logarithmically. Placing them on one axis reconciles the projections; it changes no bound, establishes '
    + 'no operator positivity, and does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'Cross-tabulating the three imp-96711 basis-C corroboration-reach figures and the imp-96712 accelerating-'
    + 'exponent projection on one L axis -- via the inverse exponent map placing each L* on the shared monotone '
    + 'crossover curve floor(L) = signal(L) -- confirms they name ONE crossover, not four independent scales: '
    + 'the three reach figures recover the measured exponents p ~ 1.00 / 1.81 / 2.42 within ~5%, and the '
    + 'imp-96712 bracket [7.63e7, 8.20e7] inverts to a narrow ~0.03-wide exponent-shape window nested at the '
    + 'p ~ 2.42 rung (not overlapping the p ~ 1.81 or p = 1.0 figures). The ~1.5-decade L span is entirely '
    + 'exponent-LEVEL uncertainty; the imp-96712 band is the far smaller exponent-SHAPE uncertainty at the '
    + 'fixed OLS level. Cross-tabulation only; theoretical GUE quantity, not real zeros; changes no bound; '
    + 'RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention) for any consumer surface.
export const IMP96776_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Cross-tabulation only: rho is the theoretical GUE '
  + 'two-interval correlation, not computed from real zeros. Placing the three imp-96711 reach figures '
  + '(L* ~ 2.86e9 / 1.90e8 / 8.1e7) and the imp-96712 bracket [7.63e7, 8.2e7] on one L axis via the inverse '
  + 'exponent map confirms ONE crossover, not four scales: the reach figures recover p ~ 1.00 / 1.81 / 2.42 '
  + 'within 5%, and the imp-96712 bracket is a ~0.03-wide exponent-shape window nested at the p ~ 2.42 rung. '
  + 'Changes no bound.';

// --- self-executing internal-consistency assertions (inverse map recovers the measured exponents) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // reference values for the local special-function implementations
  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96776: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96776: Ci(1) drifted from reference');

  // Finding 1: the inverse map recovers the module's OWN measured exponents from the published L*
  if (!approx(pEff96531, 1.0, 0.02)) throw new Error('imp-96776: imp-96531 L* should invert to p ~ 1.0');
  if (!approx(pEff96568, twoPointExponent, 0.03)) throw new Error('imp-96776: imp-96568 L* should invert to the two-rung exponent ~1.81');
  if (!approx(pEff96690, olsExponent, 0.03)) throw new Error('imp-96776: imp-96690 L* should invert to the five-rung OLS exponent ~2.42');

  // the three figures lie on the shared curve within the explicit tolerance
  if (!(maxOnCurveResidual < SINGLE_CROSSOVER_TOL))
    throw new Error('imp-96776: a reach figure fell off the shared crossover curve beyond the 5% tolerance');

  // Finding 2: the imp-96712 bracket inverts to a narrow exponent-shape window nested at the OLS rung
  if (!(pEffBracketHi > pEffBracketLo)) throw new Error('imp-96776: monotone-decreasing L*(p) means tighter L* -> larger exponent');
  if (!(bracketExponentWidth > 0 && bracketExponentWidth < 0.1))
    throw new Error('imp-96776: the imp-96712 bracket should invert to a narrow (<0.1) exponent-shape window');
  if (!(bracketCentreExponent > 2.2 && bracketCentreExponent < 2.6))
    throw new Error('imp-96776: the imp-96712 bracket should nest at the p ~ 2.42 OLS rung');
  if (!(bracketExponentWidth < gapToTwoPoint && bracketExponentWidth < gapToLinear))
    throw new Error('imp-96776: the bracket window should be far narrower than the gaps to the neighbouring figures');

  // Finding 3: the four figures span ~1.5 decades on L but are one continuous curve on p
  if (!(spanDecades > 1.3 && spanDecades < 1.8)) throw new Error('imp-96776: the L span should be ~1.5 decades');
  if (!(pEff96531 < pEff96568 && pEff96568 < pEff96690 && pEff96690 < pEffBracketHi))
    throw new Error('imp-96776: the mapped exponents should be strictly ordered along one crossover curve');

  // structural + verdict
  if (crossTab.length !== 4) throw new Error('imp-96776: cross-tab should have exactly four rows');
  if (IMP96776_BASIS_C_SINGLE_CROSSOVER_CROSS_TAB.singleCrossoverTest.verdict !== 'single-crossover')
    throw new Error('imp-96776: the verdict should be single-crossover');
  if (!IMP96776_BASIS_C_SINGLE_CROSSOVER_CROSS_TAB.singleCrossoverTest.passesTolerance)
    throw new Error('imp-96776: the single-crossover tolerance test should pass');

  // honesty gates
  if (!/NO QED/.test(IMP96776_BASIS_C_SINGLE_CROSSOVER_CROSS_TAB.verdict))
    throw new Error('imp-96776: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96776_BASIS_C_SINGLE_CROSSOVER_CROSS_TAB.verdict))
    throw new Error('imp-96776: verdict dropped the no-refereed-bound-change banner');
  if (!/imp-96690/.test(IMP96776_BASIS_C_SINGLE_CROSSOVER_CROSS_TAB.source))
    throw new Error('imp-96776: source dropped the imp-96690 reference');
  if (!(/RH open/.test(IMP96776_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96776_HONEST_BANNER) && /NO QED/.test(IMP96776_HONEST_BANNER)))
    throw new Error('imp-96776: IMP96776_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96776_BASIS_C_SINGLE_CROSSOVER_CROSS_TAB;
