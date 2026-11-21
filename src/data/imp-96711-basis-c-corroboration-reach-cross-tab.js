/**
 * imp-96711 -- BASIS-C corroboration-reach L* CROSS-TABULATION and reconciliation. The floor = signal
 * crossover has accreted THREE divergent L* figures from three successive refinements of the same
 * quadrature ladder: imp-96531 L-linear re-anchored L* ~ 2.86e9, imp-96568 two-rung power-law
 * L* ~ 1.90e8, and imp-96690 five-rung OLS (p ~ 2.42) L* ~ 8.1e7 -- a span of ~1.5 orders that had
 * never been laid side by side or reconciled. Audit / reconciliation only.
 *
 * BACKGROUND. Every one of the three modules computes the SAME crossover: the largest unfolded box
 * length L at which the basis-C direct double integral still independently corroborates the exact
 * number-variance basis A above the logarithmically shrinking rigidity signal |rho + 1/2|. Each bisects
 * floor(L) = signal(L). They differ ONLY in the assumed above-anchor floor-growth law:
 *  - imp-96531 modeled the floor as L-LINEAR, floorModel(L) = slope * L with slope re-anchored to the
 *    imp-96448 MEASURED anchor floor 2.8414e-5 at L = 5.9e6. That is exactly 2.8414e-5 * (L/anchor)^1,
 *    i.e. an anchored power law with exponent p = 1, fitted to a SINGLE rung (the anchor). L* ~ 2.86e9.
 *  - imp-96568 MEASURED two ppp-pinned truncation-regime rungs (anchor and 1e7) and fitted an
 *    above-anchor power-law exponent p ~ 1.81, re-bisecting the same crossover to L* ~ 1.90e8.
 *  - imp-96690 EXTENDED the ladder to five above-anchor rungs (anchor, 1e7, 2e7, 3e7, 5e7), found the
 *    floor grows FASTER (log-log OLS p ~ 2.42, the optimum ppp itself collapsing 3 -> 2), and
 *    re-bisected to L* ~ 8.1e7.
 *
 * WHAT THIS MODULE DOES (reconciliation only). It re-derives all three L* from ONE anchored-power-law
 * crossover bisection floor(L) = 2.8414e-5 * (L/anchor)^p, sweeping p over the three published exponents
 * (1.0, the imp-96568 two-point fit, the imp-96690 five-rung OLS re-derived here from the committed rung
 * floors), and tabulates each row with its floor-growth model, rung basis, and fit-vs-projection label.
 * The exact sine-kernel signal(L) = |rho + 1/2| and the crossover bisection are re-derived verbatim
 * (identical to imp-96430/imp-96448/imp-96531/imp-96568/imp-96690) so the reconciliation is independent.
 *
 * FINDINGS (all re-derived / tabulated here, not asserted).
 *  1. THE THREE L* ARE ONE CROSSOVER AT THREE EXPONENTS, NOT THREE MECHANISMS. Feeding p = 1.0,
 *     1.8135, and the re-derived OLS ~2.42 into the SINGLE anchored-power-law crossover reproduces
 *     L* ~ 2.86e9, ~1.90e8, ~8.1e7 respectively (each within a couple percent of the published figure).
 *     The "distinct mechanism labels" (L-linear model vs two-rung power law vs five-rung OLS) are three
 *     successively better MEASUREMENTS of one quantity -- the above-anchor floor-growth exponent -- not
 *     three different physical floors. All three share the same anchor floor 2.8414e-5 and the same
 *     exact signal(L); they differ ONLY in p.
 *  2. L* IS MONOTONE DECREASING IN THE EXPONENT p -- STEEPER FLOOR, EARLIER CROSSOVER. Because the floor
 *     GROWS with L while the signal SHRINKS logarithmically, a larger exponent makes the floor overtake
 *     the signal sooner, so L*(p) is monotone decreasing. The refinement history (p: 1.0 -> 1.81 -> 2.42)
 *     is therefore a monotone TIGHTENING (L*: 2.86e9 -> 1.90e8 -> 8.1e7), each step a strict improvement
 *     on the previous projection, not a contradiction.
 *  3. THE ~1.5-ORDER SPAN IS THE EXPONENT UNCERTAINTY, AND THE BEST CURRENT PROJECTION IS imp-96690.
 *     L*(1.0)/L*(OLS) ~ 35 (~1.5 decades) is exactly the reach's sensitivity to the assumed exponent
 *     over p in [1, 2.42]. imp-96690 is the best current projection: it rests on the most rungs (five vs
 *     two vs one) and a directly MEASURED OLS exponent rather than an assumed L-linear form; its own
 *     honest caveat (accelerating local exponents 1.81 -> 2.81 -> 2.08 -> 2.65) means L* ~ 8.1e7 is an
 *     upper estimate that could tighten further, so it is the tightest DEFENSIBLE figure of the three.
 *
 * HONEST CAVEAT. rho is the THEORETICAL GUE (sine-kernel, universality) two-interval correlation for
 * boxes of unfolded length L; there are no computed Riemann zeros behind these values, and each floor is
 * a double-precision quadrature/cancellation artifact of the direct integral. None of the three L* is a
 * MEASURED reach -- each is a projection of an anchored power law past the last measured rung (1e7 for
 * imp-96568, 5e7 for imp-96690) while the signal keeps shrinking logarithmically. The reconciliation
 * moves no bound, establishes no operator positivity, and does not touch the ~1.9-sigma excursion
 * confidence. RH open; no refereed bound is changed.
 *
 * VERDICT. Cross-tabulating the three basis-C corroboration-reach figures shows they are ONE crossover
 * floor(L) = signal(L) at three successively better-measured above-anchor exponents: p = 1.0 (imp-96531
 * L-linear, single anchor rung) -> L* ~ 2.86e9; p ~ 1.81 (imp-96568 two ppp-pinned rungs) -> L* ~ 1.90e8;
 * p ~ 2.42 (imp-96690 five-rung log-log OLS) -> L* ~ 8.1e7. L*(p) is monotone decreasing (steeper floor,
 * earlier crossover), so the refinement history is a monotone tightening, not a contradiction; the
 * ~1.5-order span is the reach sensitivity to the exponent over p in [1, 2.42]. The best current
 * projection is imp-96690 L* ~ 8.1e7 (most rungs, directly measured OLS exponent), still an upper
 * estimate its accelerating local exponents suggest could tighten further. Reconciliation only;
 * theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96531-basis-c-crossover-measured-floor (L-linear re-anchored L* ~ 2.86e9, p = 1)
 * @see imp-96568-basis-c-intermediate-rung-floor-ladder (two-rung power-law L* ~ 1.90e8, p ~ 1.81)
 * @see imp-96690-basis-c-above-anchor-rung-ladder (five-rung OLS L* ~ 8.1e7, p ~ 2.42)
 * @see imp-96448-direct-basis-c-anchor-floor (the MEASURED anchor floor ~2.84e-5 all three share)
 *
 * Import-light: no zeros bundle, no sibling imports. Si/Ci, the exact number variance, the exact signal,
 * and the crossover bisection are re-derived verbatim here so the reconciliation is independent.
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5;
const PT_ANCHOR_L = 5.9e6;
const MEASURED_ANCHOR_FLOOR = 2.8414e-5; // imp-96448 best-achievable direct floor at the anchor (ppp = 3)

// Published L* figures the three modules report (targets the re-derivation must reproduce).
const IMP96531_PUBLISHED_LSTAR = 2.857e9; // imp-96531 L-linear re-anchored (p = 1)
const IMP96568_PUBLISHED_LSTAR = 1.8997e8; // imp-96568 two-rung power law (p ~ 1.81)
const IMP96690_PUBLISHED_LSTAR = 8.08e7; // imp-96690 five-rung OLS (p ~ 2.42)

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

// The SINGLE anchored-power-law crossover shared by all three modules:
//   floor(L) = MEASURED_ANCHOR_FLOOR * (L/anchor)^p ; L* solves floor(L*) = signal(L*).
// floor grows and signal shrinks, so floor(L) - signal(L) is monotone increasing above the anchor.
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

// imp-96568 two-point above-anchor exponent (anchor and 1e7 ppp-pinned truncation rungs).
const IMP96568_1E7_FLOOR = 7.3978e-5;
const twoPointExponent = Math.log(IMP96568_1E7_FLOOR / MEASURED_ANCHOR_FLOOR) / Math.log(1e7 / PT_ANCHOR_L); // ~1.8135

// imp-96690 five-rung above-anchor floors (committed best-achievable floors), re-fitted by log-log OLS.
const imp96690Rungs = [
  { L: PT_ANCHOR_L, floor: MEASURED_ANCHOR_FLOOR },
  { L: 1e7, floor: IMP96568_1E7_FLOOR },
  { L: 2e7, floor: 5.173078e-4 },
  { L: 3e7, floor: 1.203644e-3 },
  { L: 5e7, floor: 4.657430e-3 },
];
function olsLogLogSlope(rungs) {
  const xs = rungs.map((r) => Math.log(r.L));
  const ys = rungs.map((r) => Math.log(r.floor));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
  return sxy / sxx;
}
const olsExponent = olsLogLogSlope(imp96690Rungs); // ~2.42

// Re-derive each L* from the ONE shared crossover at its exponent.
const lstarLinear = crossoverL(1.0); // imp-96531
const lstarTwoPoint = crossoverL(twoPointExponent); // imp-96568
const lstarOls = crossoverL(olsExponent); // imp-96690

const spanDecades = Math.log10(lstarLinear / lstarOls); // ~1.5
const spanRatio = lstarLinear / lstarOls; // ~35

// Cross-tabulation rows: same crossover, three exponents, three fit bases.
const crossTab = [
  {
    ticket: 'imp-96531',
    exponent: 1.0,
    lstarPublished: IMP96531_PUBLISHED_LSTAR,
    lstarRederived: lstarLinear,
    floorGrowthModel: 'L-linear floorModel(L) = slope*L = anchorFloor*(L/anchor)^1',
    rungBasis: 'single anchor rung (imp-96448 measured floor 2.8414e-5), re-anchored L-linear',
    fitVsProjection: 'projection (exponent ASSUMED = 1, conservative; coarser than a mechanism-consistent interpolation)',
    mechanismLabel: 'truncation-set anchor floor extrapolated as an L-linear cancellation line',
  },
  {
    ticket: 'imp-96568',
    exponent: twoPointExponent,
    lstarPublished: IMP96568_PUBLISHED_LSTAR,
    lstarRederived: lstarTwoPoint,
    floorGrowthModel: 'anchored power law anchorFloor*(L/anchor)^p, p ~ 1.81',
    rungBasis: 'two ppp-pinned truncation-regime rungs (anchor, 1e7)',
    fitVsProjection: 'two-point fit -> projection past 1e7',
    mechanismLabel: 'super-linear Simpson-truncation-set floor (optimum ppp pinned at 3)',
  },
  {
    ticket: 'imp-96690',
    exponent: olsExponent,
    lstarPublished: IMP96690_PUBLISHED_LSTAR,
    lstarRederived: lstarOls,
    floorGrowthModel: 'anchored power law anchorFloor*(L/anchor)^p, p ~ 2.42 (log-log OLS)',
    rungBasis: 'five above-anchor rungs (anchor, 1e7, 2e7, 3e7, 5e7)',
    fitVsProjection: 'five-rung OLS fit -> projection past 5e7 (accelerating local exponents suggest could tighten further)',
    mechanismLabel: 'accelerating super-linear floor, optimum ppp collapsing 3 -> 2',
  },
];

export const IMP96711_BASIS_C_CORROBORATION_REACH_CROSS_TAB = {
  ticket: 'imp-96711',
  source:
    'The basis-C floor = signal corroboration-reach crossover carried three divergent L* figures from three successive refinements of the same quadrature ladder (imp-96531 L-linear L* ~ 2.86e9, imp-96568 two-rung power-law L* ~ 1.90e8, imp-96690 five-rung OLS L* ~ 8.1e7) that had never been cross-tabulated. This module re-derives all three from ONE anchored-power-law crossover floor(L) = anchorFloor*(L/anchor)^p at their three exponents (1.0, ~1.81, re-derived OLS ~2.42), tabulates the floor-growth model / rung basis / fit-vs-projection label for each, and reconciles the ~1.5-order span. Reconciliation only; theoretical GUE quantity, not real zeros.',
  rigidityLimit: RIGIDITY_LIMIT,
  ptAnchorL: PT_ANCHOR_L,
  measuredAnchorFloor: MEASURED_ANCHOR_FLOOR,
  crossTab,
  exponents: {
    linear: 1.0,
    twoPoint: twoPointExponent, // ~1.8135
    ols: olsExponent, // ~2.42
    note:
      'All three L* come from the SAME crossover floor(L) = anchorFloor*(L/anchor)^p = signal(L); the three modules differ ONLY in the above-anchor exponent p (1.0 assumed, 1.81 two-rung fit, 2.42 five-rung OLS). The distinct mechanism labels are three successively better MEASUREMENTS of one exponent, not three physical floors.',
  },
  reconciliation: {
    lstarRederived: { linear: lstarLinear, twoPoint: lstarTwoPoint, ols: lstarOls },
    lstarPublished: {
      linear: IMP96531_PUBLISHED_LSTAR,
      twoPoint: IMP96568_PUBLISHED_LSTAR,
      ols: IMP96690_PUBLISHED_LSTAR,
    },
    monotoneInExponent: lstarLinear > lstarTwoPoint && lstarTwoPoint > lstarOls,
    spanDecades, // ~1.5
    spanRatio, // ~35
    bestProjection: 'imp-96690',
    note:
      'L*(p) is monotone DECREASING in p: a steeper floor overtakes the logarithmically shrinking signal sooner, so the refinement history (p: 1.0 -> 1.81 -> 2.42) is a monotone tightening (L*: 2.86e9 -> 1.90e8 -> 8.1e7), each a strict improvement, not a contradiction. The ~1.5-decade span is the reach sensitivity to the exponent over p in [1, 2.42]. imp-96690 is the best current projection (most rungs, directly measured OLS exponent), still an upper estimate its accelerating local exponents suggest could tighten further.',
  },
  caveat:
    'rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L; there are no computed Riemann zeros behind these values, and each floor is a double-precision quadrature/cancellation artifact of the direct integral. None of the three L* is a MEASURED reach -- each projects an anchored power law past the last measured rung while the signal shrinks logarithmically. Changes no bound, establishes no operator positivity, does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'Cross-tabulating the three basis-C corroboration-reach figures shows they are ONE crossover floor(L) = signal(L) at three successively better-measured above-anchor exponents: p = 1.0 (imp-96531 L-linear, single anchor rung) -> L* ~ 2.86e9; p ~ 1.81 (imp-96568 two ppp-pinned rungs) -> L* ~ 1.90e8; p ~ 2.42 (imp-96690 five-rung log-log OLS) -> L* ~ 8.1e7. L*(p) is monotone decreasing (steeper floor, earlier crossover), so the refinement history is a monotone tightening, not a contradiction; the ~1.5-order span is the reach sensitivity to the exponent over p in [1, 2.42]. The best current projection is imp-96690 L* ~ 8.1e7 (most rungs, directly measured OLS exponent), still an upper estimate its accelerating local exponents suggest could tighten further. Reconciliation only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention) for any consumer surface.
export const IMP96711_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Reconciliation only: rho is the '
  + 'theoretical GUE two-interval correlation, not computed from real zeros. The three '
  + 'basis-C corroboration-reach figures (L* ~ 2.86e9 / 1.90e8 / 8.1e7) are ONE crossover '
  + 'floor(L) = signal(L) at three above-anchor exponents (p = 1.0 / 1.81 / 2.42); L*(p) is '
  + 'monotone decreasing, so the ~1.5-order span is exponent uncertainty and imp-96690 (five '
  + 'rungs, measured OLS) is the best current projection. Changes no bound.';

// --- self-executing internal-consistency assertions (unified crossover reproduces all three L*) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // reference values for the local special-function implementations
  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96711: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96711: Ci(1) drifted from reference');

  // the re-derived exponents match the published fits
  if (!approx(twoPointExponent, 1.8135, 5e-3)) throw new Error('imp-96711: two-point exponent should reproduce imp-96568 ~1.81');
  if (!(olsExponent > 2.2 && olsExponent < 2.7)) throw new Error('imp-96711: five-rung OLS exponent should reproduce imp-96690 ~2.42');

  // Finding 1: the ONE shared crossover reproduces each published L* within a couple percent
  if (!approx(lstarLinear / IMP96531_PUBLISHED_LSTAR, 1, 0.03)) throw new Error('imp-96711: p=1 crossover should reproduce the imp-96531 L* ~ 2.86e9');
  if (!approx(lstarTwoPoint / IMP96568_PUBLISHED_LSTAR, 1, 0.03)) throw new Error('imp-96711: p~1.81 crossover should reproduce the imp-96568 L* ~ 1.90e8');
  if (!approx(lstarOls / IMP96690_PUBLISHED_LSTAR, 1, 0.05)) throw new Error('imp-96711: p~2.42 crossover should reproduce the imp-96690 L* ~ 8.1e7');

  // Finding 2: L*(p) is monotone decreasing in the exponent (steeper floor, earlier crossover)
  if (!(lstarLinear > lstarTwoPoint && lstarTwoPoint > lstarOls))
    throw new Error('imp-96711: L* should be monotone decreasing in the floor-growth exponent');

  // Finding 3: the span is ~1.5 decades / ~35x, and imp-96690 is flagged as the best projection
  if (!(spanDecades > 1.3 && spanDecades < 1.7)) throw new Error('imp-96711: L* span should be ~1.5 decades over p in [1, 2.42]');
  if (IMP96711_BASIS_C_CORROBORATION_REACH_CROSS_TAB.reconciliation.bestProjection !== 'imp-96690')
    throw new Error('imp-96711: best current projection should be imp-96690 (most rungs, measured OLS)');
  if (crossTab.length !== 3) throw new Error('imp-96711: cross-tab should have exactly three rows');

  // honesty gates
  if (!/NO QED/.test(IMP96711_BASIS_C_CORROBORATION_REACH_CROSS_TAB.verdict))
    throw new Error('imp-96711: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96711_BASIS_C_CORROBORATION_REACH_CROSS_TAB.verdict))
    throw new Error('imp-96711: verdict dropped the no-refereed-bound-change banner');
  if (!/imp-96690/.test(IMP96711_BASIS_C_CORROBORATION_REACH_CROSS_TAB.source))
    throw new Error('imp-96711: source dropped the imp-96690 reference');
  if (!(/RH open/.test(IMP96711_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96711_HONEST_BANNER) && /NO QED/.test(IMP96711_HONEST_BANNER)))
    throw new Error('imp-96711: IMP96711_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96711_BASIS_C_CORROBORATION_REACH_CROSS_TAB;
