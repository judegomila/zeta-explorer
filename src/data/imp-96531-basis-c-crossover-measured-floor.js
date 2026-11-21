/**
 * imp-96531 -- BASIS-C corroboration-reach crossover, RECOMPUTED from the imp-96448 MEASURED anchor
 * floor (~2.84e-5) instead of the imp-96430 L-linear MODEL floor (~4.96e-8).
 *
 * BACKGROUND. imp-96430 found the largest L at which the basis-C direct double integral still
 * INDEPENDENTLY corroborates the exact number-variance basis A above the shrinking |rho + 1/2|
 * rigidity signal, by extrapolating an L-linear cancellation floor floorModel(L) = slope * L calibrated
 * from accessible-L rungs (endpoint slope ~8.4e-15 per unit L). That put the crossover band at
 * L* ~ [1.3e12, 2.5e12] -- five-to-six decades past the PT anchor L = 5.9e6 -- and quoted a huge
 * anchor headroom signal/floor ~3.7e5. imp-96448 then DIRECTLY evaluated the basis-C double integral
 * at the anchor (feasible in the low-ppp regime, optimum ppp ~ 3, ~2.2 s) and MEASURED an achievable
 * floor ~2.84e-5 -- ~573x ABOVE the imp-96430 model floor -- because at the anchor the optimum ppp
 * collapses and the floor is Simpson-truncation-set, not the extrapolated cancellation line. The
 * imp-96430 crossover band and anchor headroom were never recomputed against that measured value.
 *
 * WHAT THIS MODULE DOES (cross-validation numerics only). It re-anchors the L-linear floor model to the
 * imp-96448 MEASURED anchor floor -- measuredSlope = measuredFloor / L_anchor ~ 4.82e-12 per unit L,
 * ~573x the imp-96430 endpoint slope -- and re-bisects the crossover L* where the (now ~573x-higher)
 * growing floor overtakes the exact, logarithmically-shrinking signal(L) = |rho + 1/2|. Everything is
 * recomputed live and import-light: Si/Ci, the exact number variance and rhoExact are re-derived
 * verbatim (identical to imp-96430/imp-96448) so the recomputed crossover is independent.
 *
 * FINDINGS (all measured / bisected here, not asserted).
 *  1. THE MEASURED-FLOOR CROSSOVER COLLAPSES BY ~460x, TO L* ~ 2.86e9. Re-anchoring the L-linear floor
 *     to the imp-96448 measured value (~573x higher slope) pulls the crossover down from the imp-96430
 *     endpoint-slope L* ~ 1.32e12 to L* ~ 2.86e9 -- a ~460x reduction. The ~573x-higher floor overtakes
 *     the same shrinking signal ~460x sooner in L (not exactly 573x sooner, because the signal keeps
 *     shrinking logarithmically over the intervening decades).
 *  2. CORROBORATION STILL REACHES PAST THE PT ANCHOR -- BUT ONLY ~2.7 DECADES, NOT ~5-6. The recomputed
 *     crossover L* ~ 2.86e9 is still ~2.69 decades beyond the PT anchor L = 5.9e6, so a DIRECT basis-C
 *     evaluation remains a genuine independent cross-check of basis A across the whole accessible-to-
 *     anchor range and a few decades past it. It just loses independence ~460x sooner than the model
 *     extrapolation claimed. At the recomputed crossover rho ~ -0.4862 and floor = signal ~ 1.38e-2.
 *  3. AT THE PT ANCHOR THE HEADROOM IS THE MEASURED ~642, NOT THE MODEL ~3.7e5. With the measured floor
 *     ~2.84e-5 the exact signal ~1.82e-2 beats it by ~642 -- the same figure imp-96448 reports -- so the
 *     anchor independence margin is ~573x smaller than the imp-96430 model quoted, consistent with the
 *     imp-96430 reconciliation note. The recomputed crossover and the measured anchor headroom now tell
 *     one story: real but modest independence, a few decades of reach, not five-to-six.
 *
 * HONEST CAVEAT. rho is the THEORETICAL GUE (sine-kernel, universality) two-interval correlation for
 * boxes of unfolded length L; there are no computed Riemann zeros behind these values. The recomputed
 * crossover is an EVEN COARSER extrapolation than imp-96430: the imp-96448 measured anchor floor is
 * Simpson-TRUNCATION-set at the collapsed optimum ppp ~ 3, a DIFFERENT mechanism from the
 * cancellation-set floor of the small-L rungs, so re-anchoring a single L-linear form to it is a
 * conservative modeling choice, not a mechanism-consistent interpolation. The true floor(L) between the
 * accessible rungs and the anchor is a crossover between two mechanisms and is not measured here; L* is
 * therefore a projected reach of an independence property, not a measured one. This changes no bound,
 * establishes no operator positivity, and does not touch the ~1.9-sigma excursion confidence.
 *
 * VERDICT. Recomputing the basis-C corroboration-reach crossover from the imp-96448 MEASURED anchor
 * floor (~2.84e-5, ~573x above the imp-96430 L-linear model floor) instead of the model floor moves the
 * crossover from L* ~ 1.32e12 down to L* ~ 2.86e9 -- a ~460x reduction -- where rho ~ -0.4862 and
 * floor = signal ~ 1.38e-2. Basis C still independently corroborates basis A across the accessible-to-
 * anchor range and ~2.7 decades past the PT anchor L = 5.9e6, but only ~2.7 decades, not the ~5-6 the
 * model extrapolation claimed; and the anchor headroom is the measured ~642, not the model ~3.7e5.
 * Cross-validation / extrapolation numerics only; theoretical GUE quantity, not real zeros; changes no
 * bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays
 * PCC/GRH-gated.
 *
 * @see imp-96430-basis-c-corroboration-reach-crossover (the model-floor crossover band this recomputes)
 * @see imp-96448-direct-basis-c-anchor-floor (the MEASURED anchor floor ~2.84e-5 this re-anchors to)
 * @see imp-96389-three-basis-rho-crossvalidation-table (basis-C L-linear floor is the binding floor)
 * @see imp-96267-covariance-drift-rigidity-limit-reach (the rho drift toward the rigidity limit -1/2)
 *
 * Import-light: no zeros bundle, no sibling imports. Si/Ci, the exact number variance and rhoExact are
 * re-derived verbatim here (identical to imp-96430/imp-96448) so the recomputed crossover is independent.
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5;
const PT_ANCHOR_L = 5.9e6;
const MEASURED_ANCHOR_FLOOR = 2.8414e-5; // imp-96448 best-achievable direct floor at the anchor (ppp = 3)
const MODEL_ANCHOR_FLOOR = 4.96e-8; // imp-96430 endpoint-slope L-linear model floor at the anchor
const MODEL_CROSS_ENDPOINT = 1.3216e12; // imp-96430 endpoint-slope crossover L* (for the reduction ratio)

// Si(x), Ci(x): power series small x, asymptotic large x (double-precision on our range).
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

// BASIS A (exact Dyson-Mehta) number variance and its rho; the signal |rho + 1/2|.
const sigma2Exact = (L) => {
  const x = TWO_PI * L;
  return (1 / (PI * PI)) * (Math.log(x) + EULER + 1 - Math.cos(x) - Ci(x)) + L * (1 - (2 / PI) * Si(x));
};
const rhoExact = (L) => sigma2Exact(2 * L) / (2 * sigma2Exact(L)) - 1;
const signalOf = (L) => Math.abs(rhoExact(L) - RIGIDITY_LIMIT); // |rho + 1/2|

// Re-anchor the L-linear floor slope to the imp-96448 MEASURED anchor floor (vs the imp-96430 model).
const measuredSlope = MEASURED_ANCHOR_FLOOR / PT_ANCHOR_L; // ~4.82e-12 per unit L (~573x the model slope)
const modelSlopeAtAnchor = MODEL_ANCHOR_FLOOR / PT_ANCHOR_L; // ~8.41e-15 per unit L
const floorModel = (L, slope) => slope * L;

// crossover L*: floorModel grows, signal shrinks, so slope*L - signal(L) is monotone increasing.
function crossoverL(slope) {
  let lo = 1e2, hi = 1e18;
  for (let i = 0; i < 300; i++) {
    const mid = Math.sqrt(lo * hi);
    if (floorModel(mid, slope) - signalOf(mid) > 0) hi = mid;
    else lo = mid;
  }
  return Math.sqrt(lo * hi);
}

const crossMeasured = crossoverL(measuredSlope);
const anchorSignal = signalOf(PT_ANCHOR_L);
const anchorHeadroom = anchorSignal / MEASURED_ANCHOR_FLOOR; // ~642 (imp-96448 measured, vs model ~3.7e5)
const reductionVsModel = MODEL_CROSS_ENDPOINT / crossMeasured; // ~460x closer than the model crossover
const decadesPastAnchor = Math.log10(crossMeasured / PT_ANCHOR_L); // ~2.69

export const IMP96531_BASIS_C_CROSSOVER_MEASURED_FLOOR = {
  ticket: 'imp-96531',
  source:
    'imp-96448 directly measured the basis-C anchor floor at ~2.84e-5 (~573x above the imp-96430 L-linear model floor ~4.96e-8), but the imp-96430 corroboration-reach crossover band [~1.3e12, ~2.5e12] and the anchor headroom (~3.7e5) were computed from the MODEL floor and never recomputed. This module re-anchors the L-linear floor to the measured value and re-bisects the crossover. Cross-validation / extrapolation numerics only; theoretical GUE quantity, not real zeros.',
  rigidityLimit: RIGIDITY_LIMIT,
  ptAnchorL: PT_ANCHOR_L,
  measuredAnchorFloor: MEASURED_ANCHOR_FLOOR,
  modelAnchorFloor: MODEL_ANCHOR_FLOOR,
  floorModel: {
    form: 'floorModel(L) = slope * L, slope re-anchored to the imp-96448 MEASURED anchor floor',
    measuredSlope, // ~4.82e-12 per unit L
    modelSlopeAtAnchor, // ~8.41e-15 per unit L (imp-96430 endpoint slope)
    slopeRatio: measuredSlope / modelSlopeAtAnchor, // ~573
  },
  crossover: {
    measuredFloor: {
      L: crossMeasured, // ~2.86e9
      rho: rhoExact(crossMeasured), // ~ -0.4862
      signal: signalOf(crossMeasured),
      floor: floorModel(crossMeasured, measuredSlope),
    },
    modelEndpointForReference: MODEL_CROSS_ENDPOINT, // ~1.32e12 (imp-96430 endpoint-slope crossover)
    reductionVsModel, // ~460x -- crossover moves this many times closer than the model claimed
    decadesPastAnchor, // ~2.69 -- still past the PT anchor, but far less reach than the model band
    note:
      'Re-anchoring the L-linear floor to the imp-96448 measured anchor value (~573x higher slope) pulls the crossover down ~460x, from L* ~ 1.32e12 to L* ~ 2.86e9. It still sits ~2.7 decades past the PT anchor L = 5.9e6, so direct basis C stays an independent check across the accessible-to-anchor range, just with far less reach than the imp-96430 model band [1.3e12, 2.5e12].',
  },
  atPtAnchor: {
    signal: anchorSignal, // ~1.82e-2
    measuredFloor: MEASURED_ANCHOR_FLOOR, // ~2.84e-5
    signalOverFloor: anchorHeadroom, // ~642 (measured), NOT the model-quoted ~3.7e5
  },
  caveat:
    'rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L; there are no computed Riemann zeros behind these values. The recomputed crossover is an even coarser extrapolation than imp-96430: the imp-96448 measured anchor floor is Simpson-truncation-set at the collapsed optimum ppp ~ 3, a different mechanism from the cancellation-set floor of the small-L rungs, so re-anchoring a single L-linear form to it is a conservative modeling choice, not a mechanism-consistent interpolation. L* is a projected reach of an independence property, not a measured one. Changes no bound, establishes no operator positivity, does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'Recomputing the basis-C corroboration-reach crossover from the imp-96448 MEASURED anchor floor (~2.84e-5, ~573x above the imp-96430 L-linear model floor) instead of the model floor moves the crossover from L* ~ 1.32e12 down to L* ~ 2.86e9 -- a ~460x reduction -- where rho ~ -0.4862 and floor = signal ~ 1.38e-2. Basis C still independently corroborates basis A across the accessible-to-anchor range and ~2.7 decades past the PT anchor L = 5.9e6, but only ~2.7 decades, not the ~5-6 the model extrapolation claimed; and the anchor headroom is the measured ~642, not the model ~3.7e5. Cross-validation / extrapolation numerics only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention) for any consumer surface.
export const IMP96531_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Cross-validation / '
  + 'extrapolation numerics only: rho is the theoretical GUE two-interval '
  + 'correlation, not computed from real zeros. Recomputed crossover L* ~ 2.86e9 '
  + 'uses the imp-96448 MEASURED anchor floor (~2.84e-5) re-anchored as an '
  + 'L-linear slope; the measured floor is truncation-set, a coarser extrapolation '
  + 'than the imp-96430 cancellation model.';

// --- self-executing internal-consistency assertions (live re-derivation + crossover bisection) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // reference values for the local special-function implementations
  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96531: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96531: Ci(1) drifted from reference');

  // the re-anchored slope is ~573x the imp-96430 endpoint slope
  if (!approx(measuredSlope / modelSlopeAtAnchor, 573, 20)) throw new Error('imp-96531: measured/model slope ratio should be ~573');

  // Finding 1: the measured-floor crossover collapses by roughly two-and-a-half orders vs the model crossover
  if (!(crossMeasured > 1e9 && crossMeasured < 1e10)) throw new Error('imp-96531: measured-floor crossover outside expected ~2.9e9 band');
  if (!(reductionVsModel > 3e2 && reductionVsModel < 6e2)) throw new Error('imp-96531: crossover reduction vs model should be ~460x');

  // Finding 2: the recomputed crossover still sits a few decades past the PT anchor, and floor = signal there
  if (!(decadesPastAnchor > 2 && decadesPastAnchor < 3)) throw new Error('imp-96531: crossover should be ~2-3 decades past the PT anchor');
  const cx = IMP96531_BASIS_C_CROSSOVER_MEASURED_FLOOR.crossover.measuredFloor;
  if (!approx(cx.floor, cx.signal, 5e-3 * cx.signal)) throw new Error('imp-96531: at the crossover the floor should equal the signal');
  if (!(cx.rho < RIGIDITY_LIMIT + 0.02 && cx.rho > RIGIDITY_LIMIT)) throw new Error('imp-96531: rho at the crossover should be within 0.02 of the rigidity limit');

  // Finding 3: at the anchor the headroom is the imp-96448 measured ~642, not the model ~3.7e5
  if (!(anchorHeadroom > 5e2 && anchorHeadroom < 8e2)) throw new Error('imp-96531: measured anchor headroom should be ~642');
  if (!(anchorSignal > 1.7e-2 && anchorSignal < 2.0e-2)) throw new Error('imp-96531: PT-anchor signal outside expected ~1.82e-2 range');

  // honesty gates
  if (!/NO QED/.test(IMP96531_BASIS_C_CROSSOVER_MEASURED_FLOOR.verdict))
    throw new Error('imp-96531: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96531_BASIS_C_CROSSOVER_MEASURED_FLOOR.verdict))
    throw new Error('imp-96531: verdict dropped the no-refereed-bound-change banner');
  if (!/imp-96448/.test(IMP96531_BASIS_C_CROSSOVER_MEASURED_FLOOR.source))
    throw new Error('imp-96531: source dropped the imp-96448 measured-floor reference');
  if (!(/RH open/.test(IMP96531_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96531_HONEST_BANNER) && /NO QED/.test(IMP96531_HONEST_BANNER)))
    throw new Error('imp-96531: IMP96531_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96531_BASIS_C_CROSSOVER_MEASURED_FLOOR;
