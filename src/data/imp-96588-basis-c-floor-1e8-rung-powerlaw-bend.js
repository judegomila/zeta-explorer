/**
 * imp-96588 -- BASIS-C direct-integral floor MEASURED at a further rung ABOVE 1e7 (L = 1e8),
 * testing the imp-96568 above-anchor power law p ~ 1.81 past 1e7. The single power law does NOT
 * persist: the floor BENDS UPWARD (local exponent steepens 1.81 -> ~2.57), sharpening the projected
 * corroboration reach from L* ~ 1.9e8 down to ~8e7.
 *
 * BACKGROUND. imp-96568 measured the basis-C best-achievable direct-quadrature floor at intermediate
 * L rungs and found (a) the optimum panels-per-period ppp collapses monotonically with L (256 at 1e3,
 * 48 at 1e5, pinned at 3 at the anchor 5.9e6 and at 1e7), and (b) the two clean ppp = 3-pinned
 * truncation-regime rungs (anchor floor 2.8414e-5, 1e7 floor 7.3978e-5) give an above-anchor power-law
 * exponent p ~ 1.81. Re-bisecting the crossover (growing floor vs the logarithmically shrinking sine-
 * kernel signal) with 2.8414e-5 * (L/5.9e6)^1.81 gave L* ~ 1.9e8. imp-96568's HONEST CAVEAT (a) flagged
 * that p ~ 1.81 rests on only TWO rungs, extrapolated past 1e7, so L* ~ 1.9e8 was a projection.
 *
 * WHAT THIS MODULE DOES (measurement only). It evaluates the SAME basis-C double-box integral
 * rho = Cov/Var (identical quadrature to imp-96430/imp-96448/imp-96568) at L = 1e8, sweeping ppp to
 * characterize the floor. The offline run (tmp/imp-96588-scratch.mjs, ~2 min per ppp=3e8-panel rung)
 * measured ppp = 1, 1.5, 2, 2.5, 3, 4; the anchor and 1e7 ppp = 3 rungs are carried from imp-96568.
 * A cheap live recheck at import recomputes the sine-kernel signal, the local exponents, and the
 * re-bisected L* (all closed-form -- no 3e8-panel quadrature is run at import).
 *
 * FINDINGS (all measured / bisected here, not asserted).
 *  1. THE POWER LAW DOES NOT PERSIST -- THE FLOOR BENDS UPWARD PAST 1e7. imp-96568's single law
 *     2.8414e-5 * (L/5.9e6)^1.81 predicts floor(1e8) ~ 4.82e-3; the MEASURED clean ppp = 3 floor at
 *     1e8 is 2.7235e-2 -- ~5.7x ABOVE the prediction. The local exponent STEEPENS from 1.8135
 *     (anchor -> 1e7) to 2.566 (1e7 -> 1e8); the two-decade anchor -> 1e8 ppp = 3 exponent is 2.426.
 *     The floor grows FASTER than the imp-96568 extrapolation, not slower.
 *  2. THE OPTIMUM ppp COLLAPSES FURTHER (3 -> 2) -- THE "PINNED AT 3" ASSUMPTION BREAKS AT 1e8. The
 *     ppp sweep gives floors 1.784e-2 (ppp = 2), 3.031e-2 (2.5), 2.723e-2 (3), 4.982e-2 (4); ppp = 1
 *     and 1.5 alias to rho ~ 0 (the panel width straddles whole sin^2 periods -- pathological
 *     undersampling, floor ~ 0.484 = |0 - rhoExact|, excluded). The best-achievable (min-over-sensible-
 *     ppp) floor is at ppp = 2 (1.784e-2), so the ppp-collapse continues past 1e7; even this best floor
 *     is ~3.7x above the imp-96568 p = 1.81 prediction.
 *  3. THE FLOOR ALREADY EXCEEDS THE SIGNAL AT 1e8 -- L* IS BELOW 1e8, NOT AT 1.9e8. The sine-kernel
 *     signal |rhoExact + 1/2| at 1e8 is 1.5872e-2, BELOW both the ppp = 3 floor (2.723e-2) and the best
 *     ppp = 2 floor (1.784e-2). Re-bisecting the crossover with the measured steeper two-decade exponent
 *     2.426 gives L* ~ 8.04e7 (ppp = 3) or ~9.51e7 (best ppp = 2) -- only ~1.13-1.21 decades past the PT
 *     anchor, roughly HALVING the imp-96568 projection of 1.90e8 (~1.51 decades).
 *
 * HONEST CAVEAT. rho is the THEORETICAL GUE (sine-kernel, universality) two-interval correlation for
 * boxes of unfolded length L; there are no computed Riemann zeros behind these values, and each floor is
 * a double-precision quadrature/cancellation artifact of THIS direct integral (Var = L - 2*Int subtracts
 * ~1e8 from ~1e8, so at 1e8 the catastrophic-cancellation roundoff mechanism imp-96568 identified now
 * co-dominates the Simpson truncation -- part of the "bend" is that roundoff floor overtaking). The
 * measured 1e8 floors sit in the noisy ppp-transition regime (ppp = 2, 2.5, 3 are non-monotone), so the
 * exponent 2.426 and L* ~ 8e7 are a SHARPENED projection, not a proof of a converged floor. This changes
 * no bound, establishes no operator positivity, and does not touch the ~1.9-sigma excursion confidence.
 *
 * VERDICT. Measuring a further basis-C rung at L = 1e8 shows the imp-96568 single power law p ~ 1.81
 * does NOT persist past 1e7: the measured clean ppp = 3 floor (2.7235e-2) is ~5.7x above the p = 1.81
 * prediction (4.82e-3), the local exponent steepens to ~2.57, and the optimum ppp collapses further
 * (3 -> 2, best floor 1.784e-2 at ppp = 2). The floor already EXCEEDS the shrinking sine-kernel signal
 * (1.587e-2) at 1e8, so re-bisecting the crossover with the measured steeper law sharpens the projected
 * corroboration reach from L* ~ 1.90e8 down to ~8.0e7 (ppp = 3) / ~9.5e7 (best) -- ~1.1-1.2 decades
 * past the PT anchor, roughly half the imp-96568 projection. Measurement only; theoretical GUE quantity,
 * not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed; the
 * zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96568-basis-c-intermediate-rung-floor-ladder (the two-rung p ~ 1.81 law and L* ~ 1.9e8 this bends)
 * @see imp-96448-direct-basis-c-anchor-floor (the MEASURED anchor floor ~2.84e-5 and ppp = 3 collapse)
 * @see imp-96531-basis-c-crossover-measured-floor (the L-linear re-anchored crossover L* ~ 2.86e9)
 * @see imp-96430-basis-c-corroboration-reach-crossover (the original L-linear floor MODEL)
 *
 * Import-light: no zeros bundle, no sibling imports. Si/Ci, the exact number variance, the exact rho and
 * the signal are re-derived verbatim here (identical to imp-96430/imp-96448/imp-96568) so the rung is
 * independent; the expensive direct-quadrature floors are carried as offline-measured constants.
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5;
const PT_ANCHOR_L = 5.9e6;
const MEASURED_ANCHOR_FLOOR = 2.8414e-5; // imp-96448/imp-96568 ppp = 3 floor at the anchor
const FLOOR_1E7 = 7.3978e-5; // imp-96568 ppp = 3 floor at 1e7
const IMP96568_EXPONENT = 1.8135; // imp-96568 above-anchor exponent (anchor -> 1e7)
const IMP96568_LSTAR = 1.8997e8; // imp-96568 re-bisected L* at p = 1.81

// Offline-measured basis-C direct-quadrature floors at L = 1e8 (tmp/imp-96588-scratch.mjs, ~2 min/rung).
// floor = |rhoDirect(1e8, ppp*1e8 panels) - rhoExact(1e8)|. ppp 1 and 1.5 alias to rho ~ 0 (excluded).
const L_1E8 = 1e8;
const floor1e8Sweep = [
  { ppp: 1, floor: 4.841282e-1, aliased: true, note: 'panel width straddles whole sin^2 periods; rhoDirect ~ 0' },
  { ppp: 1.5, floor: 4.841281e-1, aliased: true, note: 'aliased; rhoDirect ~ -6e-8' },
  { ppp: 2, floor: 1.783527e-2, aliased: false, note: 'best-achievable (min-over-sensible-ppp)' },
  { ppp: 2.5, floor: 3.031097e-2, aliased: false, note: 'noisy ppp-transition regime' },
  { ppp: 3, floor: 2.723498e-2, aliased: false, note: 'clean ppp = 3 rung (imp-96568 protocol)' },
  { ppp: 4, floor: 4.981668e-2, aliased: false, note: 'above optimum; Simpson-panel roundoff growing' },
];
const FLOOR_1E8_PPP3 = 2.723498e-2; // clean ppp = 3 (matches the anchor/1e7 ppp = 3 protocol)
const FLOOR_1E8_BEST = 1.783527e-2; // best-achievable, at ppp = 2 (optimum collapsed 3 -> 2)

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

// LIVE (cheap, closed-form): local exponents, the p = 1.81 prediction gap, the signal at 1e8, and L*.
const localExponent1e7to1e8 = Math.log(FLOOR_1E8_PPP3 / FLOOR_1E7) / Math.log(L_1E8 / 1e7); // ~2.566
const exponentAnchorTo1e8 = Math.log(FLOOR_1E8_PPP3 / MEASURED_ANCHOR_FLOOR) / Math.log(L_1E8 / PT_ANCHOR_L); // ~2.426
const exponentAnchorTo1e8Best = Math.log(FLOOR_1E8_BEST / MEASURED_ANCHOR_FLOOR) / Math.log(L_1E8 / PT_ANCHOR_L);
const predictedFloor1e8 = MEASURED_ANCHOR_FLOOR * Math.pow(L_1E8 / PT_ANCHOR_L, IMP96568_EXPONENT); // ~4.82e-3
const ppp3AbovePrediction = FLOOR_1E8_PPP3 / predictedFloor1e8; // ~5.66x
const bestAbovePrediction = FLOOR_1E8_BEST / predictedFloor1e8; // ~3.70x
const signal1e8 = signalOf(L_1E8); // ~1.587e-2

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
const crossPpp3 = crossoverL(exponentAnchorTo1e8); // ~8.04e7
const crossBest = crossoverL(exponentAnchorTo1e8Best); // ~9.51e7
const decadesPastAnchorPpp3 = Math.log10(crossPpp3 / PT_ANCHOR_L); // ~1.13
const sharpeningVsImp96568 = IMP96568_LSTAR / crossPpp3; // ~2.36x tighter

export const IMP96588_BASIS_C_FLOOR_1E8_RUNG_POWERLAW_BEND = {
  ticket: 'imp-96588',
  source:
    'imp-96568 measured the basis-C direct-quadrature floor at intermediate L rungs, found the optimum ppp collapses monotonically (pinned at 3 at the anchor 5.9e6 and at 1e7), and fitted an above-anchor power law 2.8414e-5 * (L/5.9e6)^1.81 from those two ppp = 3 rungs, re-bisecting the corroboration-reach crossover to L* ~ 1.9e8. Its HONEST CAVEAT (a) flagged that the exponent rests on only two rungs extrapolated past 1e7. This module measures a further clean ppp = 3 rung at L = 1e8 with the identical direct double-box quadrature to test whether the power law persists or bends, and re-reports the L* bisection. Measurement only; theoretical GUE quantity, not real zeros.',
  rigidityLimit: RIGIDITY_LIMIT,
  ptAnchorL: PT_ANCHOR_L,
  measuredAnchorFloor: MEASURED_ANCHOR_FLOOR,
  floor1e7: FLOOR_1E7,
  L: L_1E8,
  floor1e8Sweep,
  floor1e8Ppp3: FLOOR_1E8_PPP3,
  floor1e8Best: FLOOR_1E8_BEST,
  powerLawBend: {
    imp96568Exponent: IMP96568_EXPONENT, // 1.8135 (anchor -> 1e7)
    localExponent1e7to1e8: localExponent1e7to1e8, // ~2.566 -- STEEPENS
    exponentAnchorTo1e8: exponentAnchorTo1e8, // ~2.426 (two-decade, ppp = 3)
    predictedFloor1e8: predictedFloor1e8, // ~4.82e-3 from p = 1.81
    measuredPpp3Floor: FLOOR_1E8_PPP3, // 2.7235e-2
    ppp3AbovePrediction: ppp3AbovePrediction, // ~5.66x
    bestAbovePrediction: bestAbovePrediction, // ~3.70x
    note:
      'The imp-96568 single power law does NOT persist past 1e7. The p = 1.81 law predicts floor(1e8) ~ 4.82e-3, but the measured clean ppp = 3 floor is 2.7235e-2 (~5.7x above); even the best ppp = 2 floor 1.784e-2 is ~3.7x above. The local exponent steepens from 1.81 (anchor -> 1e7) to ~2.57 (1e7 -> 1e8): the floor bends UPWARD, growing faster than the extrapolation.',
  },
  pppCollapse: {
    anchorAnd1e7OptPpp: 3,
    optPpp1e8: 2, // best-achievable at ppp = 2, not 3
    note:
      'The optimum ppp collapses further at 1e8 (3 -> 2): the best-achievable floor 1.784e-2 is at ppp = 2, so the imp-96568 "pinned at 3" assumption breaks past 1e7. ppp = 1 and 1.5 alias to rhoDirect ~ 0 (panel width straddles whole sin^2 periods; floor ~ 0.484, excluded). The Var = L - 2*Int catastrophic-cancellation roundoff now co-dominates Simpson truncation, so fewer panels help.',
  },
  crossover: {
    signal1e8: signal1e8, // ~1.587e-2 -- BELOW both 1e8 floors, so L* < 1e8
    floorExceedsSignalAt1e8: FLOOR_1E8_PPP3 > signal1e8,
    imp96568Lstar: IMP96568_LSTAR, // ~1.90e8
    measuredLstarPpp3: crossPpp3, // ~8.04e7
    measuredLstarBest: crossBest, // ~9.51e7
    exponentUsedPpp3: exponentAnchorTo1e8,
    decadesPastAnchorPpp3: decadesPastAnchorPpp3, // ~1.13
    sharpeningVsImp96568: sharpeningVsImp96568, // ~2.36x tighter
    note:
      'The sine-kernel signal |rhoExact + 1/2| at 1e8 is 1.587e-2, BELOW both the ppp = 3 floor (2.723e-2) and the best ppp = 2 floor (1.784e-2): the floor already EXCEEDS the signal at 1e8, so L* < 1e8. Re-bisecting the crossover with the measured steeper two-decade exponent 2.426 gives L* ~ 8.04e7 (ppp = 3) or ~9.51e7 (best), only ~1.13-1.21 decades past the PT anchor, roughly halving the imp-96568 projection of 1.90e8.',
  },
  caveat:
    'rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L; there are no computed Riemann zeros behind these values, and each floor is a double-precision quadrature/cancellation artifact of this direct integral. At 1e8 the Var = L - 2*Int catastrophic-cancellation roundoff co-dominates the Simpson truncation, so part of the upward bend is that roundoff floor overtaking; the ppp = 2, 2.5, 3 floors are non-monotone (noisy transition regime), so the exponent 2.426 and L* ~ 8e7 are a SHARPENED projection, not a proof of a converged floor. Changes no bound, establishes no operator positivity, does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'Measuring a further basis-C rung at L = 1e8 shows the imp-96568 single power law p ~ 1.81 does NOT persist past 1e7: the measured clean ppp = 3 floor (2.7235e-2) is ~5.7x above the p = 1.81 prediction (4.82e-3), the local exponent steepens to ~2.57, and the optimum ppp collapses further (3 -> 2, best floor 1.784e-2). The floor already EXCEEDS the shrinking sine-kernel signal (1.587e-2) at 1e8, so re-bisecting with the measured steeper law sharpens the projected corroboration reach from L* ~ 1.90e8 down to ~8.0e7 (ppp = 3) / ~9.5e7 (best), ~1.1-1.2 decades past the PT anchor. Measurement only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention) for any consumer surface.
export const IMP96588_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: rho is the '
  + 'theoretical GUE two-interval correlation, not computed from real zeros; each floor is a '
  + 'double-precision quadrature/cancellation artifact of the direct integral. The measured '
  + 'L = 1e8 rung shows the imp-96568 p ~ 1.81 law BENDS upward (clean ppp = 3 floor 2.72e-2 '
  + 'is ~5.7x above the 4.82e-3 prediction; exponent steepens to ~2.57), sharpening the '
  + 'projected reach from L* ~ 1.9e8 to ~8e7; still a projection in the noisy ppp-transition '
  + 'regime, changes no bound.';

// --- self-executing internal-consistency assertions (cheap live closed-form rechecks) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // reference values for the local special-function implementations
  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96588: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96588: Ci(1) drifted from reference');

  // rhoExact at 1e8 reproduces the offline scratch value (closed-form, cheap)
  if (!approx(rhoExact(L_1E8), -0.4841281692261168, 1e-12))
    throw new Error('imp-96588: rhoExact(1e8) drifted from the offline-measured value');

  // Finding 1: the power law bends UPWARD -- measured ppp = 3 floor well above the p = 1.81 prediction
  if (!(ppp3AbovePrediction > 4 && ppp3AbovePrediction < 8))
    throw new Error('imp-96588: ppp = 3 floor should be ~5.7x above the imp-96568 p = 1.81 prediction (upward bend)');
  if (!(localExponent1e7to1e8 > IMP96568_EXPONENT + 0.4))
    throw new Error('imp-96588: local exponent 1e7 -> 1e8 should STEEPEN well above the imp-96568 1.81');
  if (!(exponentAnchorTo1e8 > 2.2 && exponentAnchorTo1e8 < 2.7))
    throw new Error('imp-96588: two-decade anchor -> 1e8 exponent should be ~2.43');

  // Finding 2: the best-achievable floor is at ppp = 2 (optimum collapsed 3 -> 2), and the aliased
  // low-ppp rungs are excluded (rhoDirect ~ 0 => floor ~ |rhoExact|)
  const best = floor1e8Sweep.filter((r) => !r.aliased).reduce((m, r) => (r.floor < m.floor ? r : m));
  if (best.ppp !== 2) throw new Error('imp-96588: best-achievable 1e8 floor should be at ppp = 2 (collapse 3 -> 2)');
  // aliased low-ppp rungs collapse to rhoDirect ~ 0, so floor ~ |rhoExact(1e8)| ~ 0.484
  for (const r of floor1e8Sweep) {
    if (r.aliased && !approx(r.floor, Math.abs(rhoExact(L_1E8)), 5e-3))
      throw new Error('imp-96588: aliased low-ppp rung should be ~|rhoExact(1e8)| (rhoDirect ~ 0)');
  }

  // Finding 3: the floor exceeds the signal at 1e8, and L* is re-bisected below 1e8 (~8e7)
  if (!(FLOOR_1E8_PPP3 > signal1e8 && FLOOR_1E8_BEST > signal1e8))
    throw new Error('imp-96588: both 1e8 floors should EXCEED the sine-kernel signal at 1e8');
  if (!(crossPpp3 > 6e7 && crossPpp3 < 1e8))
    throw new Error('imp-96588: re-bisected L* (ppp = 3) should land ~8e7, below 1e8');
  if (!(crossPpp3 < IMP96568_LSTAR))
    throw new Error('imp-96588: re-bisected L* should be SHARPER (smaller) than the imp-96568 1.9e8');
  if (!(sharpeningVsImp96568 > 1.5 && sharpeningVsImp96568 < 3.5))
    throw new Error('imp-96588: measured law should sharpen L* ~2x vs the imp-96568 projection');

  // honesty gates
  if (!/NO QED/.test(IMP96588_BASIS_C_FLOOR_1E8_RUNG_POWERLAW_BEND.verdict))
    throw new Error('imp-96588: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96588_BASIS_C_FLOOR_1E8_RUNG_POWERLAW_BEND.verdict))
    throw new Error('imp-96588: verdict dropped the no-refereed-bound-change banner');
  if (!/imp-96568/.test(IMP96588_BASIS_C_FLOOR_1E8_RUNG_POWERLAW_BEND.source))
    throw new Error('imp-96588: source dropped the imp-96568 reference');
  if (!(/RH open/.test(IMP96588_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96588_HONEST_BANNER) && /NO QED/.test(IMP96588_HONEST_BANNER)))
    throw new Error('imp-96588: IMP96588_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96588_BASIS_C_FLOOR_1E8_RUNG_POWERLAW_BEND;
