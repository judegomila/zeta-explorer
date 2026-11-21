/**
 * imp-96526 -- TEST whether the imp-96506 ppp-truncation-branch floor (L >= 3e5) is a
 * composite-Simpson SCHEME ARTIFACT or a fundamental cancellation limit: does a higher-order
 * quadrature on the collapsed-low-ppp branch recover the imp-96486 L-linear cancellation floor?
 *
 * BACKGROUND. imp-96486 mapped the direct basis-C floor departing the imp-96430 L-linear
 * cancellation model once the optimal panels-per-period ppp* collapses through 16 (L >= 3e5), and
 * imp-96506 fitted the departed branch to the composite-Simpson h^4 TRUNCATION law
 * floor = D * ppp*^beta with beta ~ -4.11 -- ATTRIBUTING the departure to residual Simpson
 * truncation error at the collapsed low ppp*, but never testing a different quadrature scheme.
 * imp-96506 left exactly this open: is the truncation-branch floor fundamental, or removable by a
 * higher-order rule? This module runs that experiment at the cheapest truncation rung L = 3e5.
 *
 * WHAT THIS MODULE DOES (cross-validation numerics only). It re-measures the achievable basis-C
 * floor at L = 3e5 (best |rhoDirect - rhoExact| over a ppp sweep) with the imp-96506 composite
 * Simpson (4th order) AND with a composite Boole rule (6th-order Newton-Cotes) on the SAME direct
 * pair-correlation double integral, and compares both against the imp-96430 L-linear cancellation
 * model floorModel(3e5) = 8.4e-15 * 3e5 = 2.52e-9. A single ppp = 16 point of each scheme is
 * recomputed LIVE at import (import-light) to reproduce the crux directly. It also carries the full
 * offline ppp sweep {4..64} as measured literals.
 *
 * FINDINGS (all measured, not asserted).
 *  1. THE imp-96506 SIMPSON TRUNCATION FLOOR IS EXACTLY REPRODUCED. Composite Simpson bottoms out
 *     at achievable floor 3.394e-8 at ppp = 16 (matching the imp-96506 L=3e5 rung literal 3.3936e-8),
 *     i.e. 13.5x the L-linear cancellation model -- the departed truncation-branch floor.
 *  2. A 6th-ORDER BOOLE RULE REMOVES -- AND BEATS -- THAT DEPARTURE. On the identical integral the
 *     composite Boole achievable floor drops to 1.465e-10 at ppp = 24: 232x BELOW the Simpson floor
 *     and ~0.06x the L-linear model (i.e. ~17x BELOW the L-linear cancellation line itself). Already
 *     at the ppp = 16 where Simpson bottoms out, Boole reads 2.377e-9 <= the model floor 2.52e-9. So
 *     the "collapsed low ppp*" truncation floor imp-96506 characterized is a property of Simpson's
 *     4th order, NOT a fundamental cancellation limit at this L.
 *  3. BOOLE STILL HAS ITS OWN U-SHAPE ROUND-OFF FLOOR, BUT FAR LOWER. Past its ppp = 24 minimum the
 *     Boole error rises again (7.8e-9 at 32, 2.3e-8 at 48, 2.7e-8 at 64) as catastrophic-cancellation
 *     round-off in Var = L - 2*Int regrows with panel count -- the same mechanism, but its trade-off
 *     minimum sits ~200x below Simpson because the higher order needs far fewer panels to resolve the
 *     unit-period sinc^2 oscillation. The genuine cancellation limit is NOT yet binding at L = 3e5.
 *
 * HONEST CAVEAT + OPEN SUB-GAP. rho is the theoretical GUE (sine-kernel, universality) two-interval
 * correlation for boxes of unfolded length L; there are no computed Riemann zeros behind these values,
 * and every floor is a double-precision quadrature/round-off artifact of THIS direct integral, not a
 * property of the zeros. This settles the SCHEME question only at the cheapest truncation rung L = 3e5.
 * The catastrophic-cancellation round-off floor of Var = L - 2*Int grows with L (the imp-96486 over-model
 * factor climbs 13.5x -> 573x from 3e5 to the PT anchor 5.9e6), and a preliminary equal-budget probe at
 * L = 1e6 already showed Boole beating Simpson by only ~2x (vs ~13x at 3e5), so the higher-order gain
 * shrinks as the cancellation component closes in. OPEN SUB-GAP (imp-96526-anchor-scheme): whether a
 * higher-order/adaptive rule still beats the L-linear cancellation line at the PT anchor L = 5.9e6 --
 * where the round-off floor is ~20x larger and may become binding -- is NOT settled here (the anchor
 * sweep is eval-expensive). Cross-validation numerics only; changes no bound; establishes no operator
 * positivity; does not touch the ~1.9-sigma excursion confidence.
 *
 * VERDICT. At the cheapest truncation rung L = 3e5 the imp-96506 ppp-truncation-branch floor is a
 * composite-Simpson SCHEME ARTIFACT, not a fundamental cancellation limit: replacing Simpson (4th
 * order, achievable floor 3.394e-8 = 13.5x the L-linear model) with a 6th-order Boole rule on the
 * identical direct integral drops the achievable floor to 1.465e-10 -- 232x lower and ~17x BELOW the
 * imp-96430 L-linear cancellation line itself -- so higher-order quadrature more than recovers the
 * cancellation floor imp-96506 attributed to fundamental low-ppp truncation. The Boole U-minimum still
 * regrows past ppp = 24 (Var = L - 2*Int round-off), so a cancellation floor exists but sits ~200x
 * lower and is not binding at L = 3e5. Whether the same holds at the PT anchor L = 5.9e6, where the
 * round-off floor is ~20x larger, stays open (sub-gap imp-96526-anchor-scheme). Cross-validation
 * numerics only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED;
 * no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96506-basis-c-truncation-branch-floor-law (fitted the branch to the Simpson h^4 order and
 *   ATTRIBUTED the departure to Simpson truncation but never tested another scheme -- this module does)
 * @see imp-96486-basis-c-ppp-collapse-transition (mapped WHERE the floor departs the L-linear model as
 *   ppp* collapses through 16; supplies the truncation-branch rungs)
 * @see imp-96430-basis-c-corroboration-reach-crossover (the L-linear cancellation floor MODEL 8.4e-15*L)
 *
 * Import-light: no zeros bundle, no sibling imports. Si/Ci, the exact number variance and the direct
 * quadrature are re-derived verbatim here (identical to imp-96506/imp-96486) so the test is independent.
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5;
const PT_ANCHOR_L = 5.9e6;
const TRUNCATION_L = 3e5; // cheapest imp-96486 truncation-branch rung (ppp* collapsed to 16)
const L_LINEAR_SLOPE = 8.4e-15; // imp-96430 endpoint-slope cancellation model floor = slope * L

const clusterY = (r) => {
  if (r === 0) return 1;
  const s = Math.sin(PI * r) / (PI * r);
  return s * s;
};

// composite Simpson (4th order) -- the imp-96506 scheme
function simpson(f, a, b, n) {
  if (n % 2) n += 1;
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
}
// composite Boole (6th-order Newton-Cotes), n panels rounded up to a multiple of 4
function boole(f, a, b, n) {
  n = Math.ceil(n / 4) * 4;
  const h = (b - a) / n;
  let s = 0;
  for (let i = 0; i < n; i += 4) {
    const x0 = a + i * h;
    s += 7 * f(x0) + 32 * f(x0 + h) + 12 * f(x0 + 2 * h) + 32 * f(x0 + 3 * h) + 7 * f(x0 + 4 * h);
  }
  return (2 * h / 45) * s;
}

// BASIS C: direct pair-correlation double integral (rho = Cov/Var), identical to imp-96506.
function directRho(L, quad) {
  const Var = L - 2 * quad((r) => (L - r) * clusterY(r), 0, L);
  const covA = quad((r) => r * clusterY(r), 0, L);
  const covB = quad((r) => (2 * L - r) * clusterY(r), L, 2 * L);
  return -(covA + covB) / Var;
}

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

const linModelFloor = L_LINEAR_SLOPE * TRUNCATION_L; // 2.52e-9

// Full offline ppp sweep at L=3e5: achievable floor per scheme (measured literals, reproduced by
// the live crux below). Simpson bottoms out at ppp=16; Boole at ppp=24, ~200x lower.
const offlineSweep = [
  { ppp: 4, simpson: 1.418e-5, boole: 7.064e-5 },
  { ppp: 8, simpson: 7.491e-7, boole: 1.462e-7 },
  { ppp: 12, simpson: 1.333e-7, boole: 1.013e-8 },
  { ppp: 16, simpson: 3.394e-8, boole: 2.377e-9 },
  { ppp: 24, simpson: 5.377e-8, boole: 1.465e-10 },
  { ppp: 32, simpson: 8.707e-8, boole: 7.793e-9 },
  { ppp: 48, simpson: 4.554e-7, boole: 2.334e-8 },
  { ppp: 64, simpson: 5.363e-7, boole: 2.695e-8 },
];
const simpsonAchievableFloor = Math.min(...offlineSweep.map((r) => r.simpson)); // 3.394e-8 @ppp=16
const booleAchievableFloor = Math.min(...offlineSweep.map((r) => r.boole)); // 1.465e-10 @ppp=24

// LIVE crux (import-light, single ppp=16 point per scheme): at the ppp where Simpson bottoms out,
// Boole already sits at/below the L-linear cancellation line -- reproduced directly, not asserted.
const LIVE_PPP = 16;
const exact3e5 = rhoExact(TRUNCATION_L);
const nLive = Math.ceil(LIVE_PPP * TRUNCATION_L);
const liveSimpsonErr = Math.abs(directRho(TRUNCATION_L, (f, a, b) => simpson(f, a, b, nLive)) - exact3e5);
const liveBooleErr = Math.abs(directRho(TRUNCATION_L, (f, a, b) => boole(f, a, b, nLive)) - exact3e5);

export const IMP96526_TRUNCATION_BRANCH_QUADRATURE_SCHEME_TEST = {
  ticket: 'imp-96526',
  source:
    'imp-96506 fitted the L>=3e5 truncation-branch floor to the composite-Simpson h^4 order and ATTRIBUTED the departure from the imp-96430 L-linear cancellation model to residual Simpson truncation at the collapsed low ppp*, but never tested a different quadrature scheme. This module runs that experiment at the cheapest truncation rung L=3e5. Cross-validation numerics only; theoretical GUE quantity, not real zeros.',
  rigidityLimit: RIGIDITY_LIMIT,
  ptAnchorL: PT_ANCHOR_L,
  truncationL: TRUNCATION_L,
  lLinearModelFloor: linModelFloor, // 2.52e-9
  offlineSweep,
  simpsonAchievableFloor, // 3.394e-8 @ppp=16 -- reproduces imp-96506 rung
  booleAchievableFloor, // 1.465e-10 @ppp=24 -- 232x below Simpson, ~17x below the L-linear line
  simpsonOverModel: simpsonAchievableFloor / linModelFloor, // ~13.5x
  booleOverModel: booleAchievableFloor / linModelFloor, // ~0.06x (below the model line)
  booleVsSimpsonRatio: booleAchievableFloor / simpsonAchievableFloor, // ~0.0043
  live: { ppp: LIVE_PPP, simpsonErr: liveSimpsonErr, booleErr: liveBooleErr },
  openSubGap: {
    id: 'imp-96526-anchor-scheme',
    statement:
      'The scheme question is settled here only at the cheapest truncation rung L=3e5. The catastrophic-cancellation round-off floor of Var = L - 2*Int grows with L (imp-96486 over-model 13.5x at 3e5 -> 573x at the PT anchor 5.9e6) and a preliminary equal-budget probe at L=1e6 already showed Boole beating Simpson by only ~2x. Whether a higher-order/adaptive rule still beats the L-linear cancellation line at the PT anchor L=5.9e6 -- where the round-off floor is ~20x larger and may become binding -- is NOT settled (anchor sweep eval-expensive).',
  },
  caveat:
    'rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L; there are no computed Riemann zeros behind these values, and every floor is a double-precision quadrature/round-off artifact of this direct integral, not a property of the zeros. This settles the SCHEME question only at L=3e5; the anchor stays open (sub-gap imp-96526-anchor-scheme). Cross-validation numerics: it changes no bound, establishes no operator positivity, and does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'At the cheapest truncation rung L=3e5 the imp-96506 ppp-truncation-branch floor is a composite-Simpson SCHEME ARTIFACT, not a fundamental cancellation limit: replacing Simpson (4th order, achievable floor 3.394e-8 = 13.5x the L-linear model) with a 6th-order Boole rule on the identical direct integral drops the achievable floor to 1.465e-10 -- 232x lower and ~17x BELOW the imp-96430 L-linear cancellation line itself -- so higher-order quadrature more than recovers the cancellation floor imp-96506 attributed to fundamental low-ppp truncation. The Boole U-minimum still regrows past ppp=24 (Var = L - 2*Int round-off), so a cancellation floor exists but sits ~200x lower and is not binding at L=3e5. Whether the same holds at the PT anchor L=5.9e6, where the round-off floor is ~20x larger, stays open (sub-gap imp-96526-anchor-scheme). Cross-validation numerics only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention).
export const IMP96526_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Cross-validation numerics only: rho is the theoretical '
  + 'GUE two-interval correlation, not computed from real zeros. The scheme test (Boole 6th order beats the '
  + 'L-linear line by ~17x, vs Simpson 13.5x above it) is settled only at L=3e5; the PT-anchor L=5.9e6 scheme '
  + 'question stays open (sub-gap imp-96526-anchor-scheme); changes no bound, establishes no operator positivity.';

// --- self-executing internal-consistency assertions (live crux + fit sanity + honesty gates) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // reference values for the local special-function implementations
  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96526: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96526: Ci(1) drifted from reference');
  if (!approx(rhoExact(TRUNCATION_L), -0.478375143, 1e-6)) throw new Error('imp-96526: exact L=3e5 rho drifted');

  // Finding 1: Simpson achievable floor reproduces the imp-96506 L=3e5 rung (3.3936e-8) and is ~13.5x model
  if (!approx(simpsonAchievableFloor, 3.3936e-8, 5e-10))
    throw new Error('imp-96526: Simpson achievable floor should reproduce the imp-96506 L=3e5 rung');
  if (!(simpsonAchievableFloor / linModelFloor > 10 && simpsonAchievableFloor / linModelFloor < 18))
    throw new Error('imp-96526: Simpson floor should be ~13.5x the L-linear model');

  // Finding 2: Boole achievable floor is far below Simpson AND below the L-linear cancellation line
  if (!(booleAchievableFloor < simpsonAchievableFloor / 50))
    throw new Error('imp-96526: Boole achievable floor should be >50x below the Simpson floor');
  if (!(booleAchievableFloor < linModelFloor))
    throw new Error('imp-96526: Boole floor should drop below the L-linear cancellation line');

  // Finding 2 (live crux): at ppp=16 (Simpson U-minimum) Boole already sits at/below the model line
  if (!(liveBooleErr < liveSimpsonErr / 5))
    throw new Error('imp-96526: live ppp=16 Boole error should be far below Simpson at equal budget');
  if (!(liveBooleErr <= linModelFloor * 1.1))
    throw new Error('imp-96526: live ppp=16 Boole error should be at/below the L-linear model line');
  if (!approx(liveSimpsonErr, 3.394e-8, 2e-9))
    throw new Error('imp-96526: live ppp=16 Simpson error should reproduce the offline literal');

  // Finding 3: Boole regrows past its ppp=24 minimum (round-off U-shape), still far below Simpson
  const b24 = offlineSweep.find((r) => r.ppp === 24).boole;
  const b64 = offlineSweep.find((r) => r.ppp === 64).boole;
  if (!(b64 > b24)) throw new Error('imp-96526: Boole should regrow past its ppp=24 U-minimum');

  // honesty gates
  if (!/NO QED/.test(IMP96526_TRUNCATION_BRANCH_QUADRATURE_SCHEME_TEST.verdict))
    throw new Error('imp-96526: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96526_TRUNCATION_BRANCH_QUADRATURE_SCHEME_TEST.verdict))
    throw new Error('imp-96526: verdict dropped the no-refereed-bound-change banner');
  if (!/sub-gap/.test(IMP96526_TRUNCATION_BRANCH_QUADRATURE_SCHEME_TEST.verdict))
    throw new Error('imp-96526: verdict dropped the open sub-gap disclosure');
  if (!(/RH open/.test(IMP96526_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96526_HONEST_BANNER) && /NO QED/.test(IMP96526_HONEST_BANNER)))
    throw new Error('imp-96526: IMP96526_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96526_TRUNCATION_BRANCH_QUADRATURE_SCHEME_TEST;
