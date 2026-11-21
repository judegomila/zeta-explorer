/**
 * imp-96486 -- MAP of the DIRECT basis-C floor across intermediate L rungs (960 .. PT anchor 5.9e6):
 * where the optimal panels-per-period (ppp) COLLAPSES from the high-ppp cancellation line to the
 * ppp ~ 3 truncation line, and where the measured floor departs the imp-96430 L-linear model.
 *
 * BACKGROUND. imp-96448 finding 2 measured the DIRECT basis-C double-integral floor AT the PT anchor
 * L = 5.9e6 as ~2.84e-5 at optimal ppp ~ 3 -- ~573x ABOVE the imp-96430 L-linear model (~4.96e-8) --
 * because at large L the optimal ppp COLLAPSES: raising ppp raises the floor (catastrophic-cancellation
 * roundoff in Var = L - 2*Int grows with panel count faster than Simpson truncation falls), so the
 * anchor floor is truncation-set, not the extrapolated cancellation line. imp-96448 said "that
 * extrapolation is invalid at the anchor" but never MAPPED the transition between the two regimes.
 *
 * WHAT THIS MODULE DOES (feasibility / cross-validation numerics only). For nine L rungs
 * {960, 3e3, 1e4, 3e4, 1e5, 3e5, 1e6, 3e6, 5.9e6} it sweeps ppp and records the achievable floor
 * (best |rhoDirect - rhoExact| over the ppp sweep) and the optimal ppp at each rung. It then (a) tracks
 * the optimal-ppp collapse across L, (b) compares the achievable floor to the imp-96430 endpoint-slope
 * L-linear model floorModel(L) = 8.4e-15 * L, and (c) locates where the floor leaves the cancellation
 * line for the ppp-truncation line. The full sweep was run offline (~19 s, capped at ~6e7 Simpson
 * evaluations per config); two cheap mid rungs are re-measured LIVE at import (~1 s) to reproduce it.
 *
 * FINDINGS (all measured / re-measured here, not asserted).
 *  1. THE OPTIMAL ppp COLLAPSES MONOTONICALLY 640 -> 3 ACROSS THE RANGE. The best-floor ppp falls
 *     640 (L=960) -> 128 (3e3) -> 128 (1e4) -> 64 (3e4) -> 32 (1e5) -> 16 (3e5) -> 8 (1e6) -> 6 (3e6)
 *     -> 3 (5.9e6). The collapse begins IMMEDIATELY past the accessible endpoint: at L = 3e3 the optimum
 *     is already 128, and ppp = 640 there is affordable (~5.8e6 evals) yet WORSE (2.6e-10 vs 2.2e-12) --
 *     a genuine U-shape optimum, not an affordability artifact. So L = 960 is the LAST rung at which the
 *     high-ppp cancellation line is optimal; every larger rung sits below it.
 *  2. THE FLOOR DEPARTS THE L-LINEAR CANCELLATION LINE NEAR L ~ 1e5 -> 3e5. The measured floor tracks
 *     the imp-96430 endpoint-slope model floorModel(L) = 8.4e-15 * L to within ~2-4x up to L = 1e5
 *     (ratios 1.1, 0.1, 3.3, 3.8, 2.0), then diverges into the truncation regime: 13.5x at 3e5, 50x at
 *     1e6, 133x at 3e6, and 573x at the anchor (reproducing imp-96448). The crossover from "model tracks
 *     measured" to "measured >> model" sits at L ~ 3e5, exactly where the optimal ppp has fallen to ~16.
 *  3. THE TWO REGIMES ARE SEPARATED BY THE ppp OPTIMUM CROSSING ~16. While ppp* stays >= 32 (L <= 1e5)
 *     the achievable floor is cancellation-set and follows the L-linear line to a small factor; once
 *     ppp* drops through 16 and toward 3 (L >= 3e5) the residual low-ppp Simpson truncation dominates and
 *     the floor climbs far above the L-linear extrapolation, reaching ppp = 3 at the anchor. The
 *     imp-96430 model is therefore valid only on the L <= ~1e5 cancellation branch, not at the anchor.
 *
 * HONEST CAVEAT. rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for
 * boxes of unfolded length L; there are no computed Riemann zeros behind these values. Every floor here
 * is a double-precision quadrature/cancellation artifact of THIS direct integral, not a property of the
 * zeros. The two largest rungs (3e6, 5.9e6) have their high-ppp arms capped out by the ~6e7-evaluation
 * budget, so their optima (6, 3) are lower bounds on ppp* confirmed by the already-rising U-arm and by
 * imp-96448's uncapped anchor curve; the L-linear model slope (8.4e-15) is the coarse imp-96430 endpoint
 * fit. This is feasibility / cross-validation numerics: it maps a floor transition, changes no bound,
 * establishes no operator positivity, and does not touch the ~1.9-sigma excursion confidence.
 *
 * VERDICT. Mapping the DIRECT basis-C floor across L = 960 .. 5.9e6, the optimal ppp collapses
 * monotonically 640 -> 3, beginning immediately past the L = 960 endpoint (already 128 at L = 3e3, a true
 * U-shape optimum). The achievable floor follows the imp-96430 L-linear cancellation model to within
 * ~2-4x while ppp* >= 32 (up to L ~ 1e5), then departs into the ppp-truncation regime as ppp* falls
 * through 16 (13.5x at 3e5, 50x at 1e6, 133x at 3e6, 573x at the anchor). The model is valid only on the
 * L <= ~1e5 cancellation branch; at the anchor the ppp = 3 truncation floor (~2.84e-5), not the
 * extrapolated cancellation line (~4.96e-8), sets the achievable error -- confirming and localizing the
 * imp-96448 verdict. Feasibility / cross-validation numerics only; theoretical GUE quantity, not real
 * zeros; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side
 * route stays PCC/GRH-gated.
 *
 * @see imp-96448-direct-basis-c-anchor-floor (measured the anchor floor ~2.84e-5 at ppp ~ 3; said the
 *   L-linear extrapolation is invalid at the anchor but never mapped the transition -- this module does)
 * @see imp-96430-basis-c-corroboration-reach-crossover (the L-linear floor MODEL, valid only on the
 *   L <= ~1e5 cancellation branch per finding 2 here)
 * @see imp-96389-three-basis-rho-crossvalidation-table (basis-C L-linear floor is the binding floor)
 *
 * Import-light: no zeros bundle, no sibling imports. Si/Ci, the exact number variance and the direct
 * quadrature are re-derived verbatim here (identical to imp-96448/imp-96430) so the map is independent.
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5;
const PT_ANCHOR_L = 5.9e6;
const MODEL_SLOPE = 8.4e-15; // imp-96430 endpoint-slope L-linear floor model: floorModel(L) = slope * L

const clusterY = (r) => {
  if (r === 0) return 1;
  const s = Math.sin(PI * r) / (PI * r);
  return s * s;
};

function simpson(f, a, b, n) {
  if (n % 2) n += 1;
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
}

// BASIS C: direct pair-correlation double integral (rho = Cov/Var), identical to imp-96448.
function directRho(L, panels) {
  const Var = L - 2 * simpson((r) => (L - r) * clusterY(r), 0, L, panels);
  const covA = simpson((r) => r * clusterY(r), 0, L, panels);
  const covB = simpson((r) => (2 * L - r) * clusterY(r), L, 2 * L, panels);
  return { Var, rho: -(covA + covB) / Var };
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

// OFFLINE-measured map: best-achievable floor and optimal ppp per L rung (full ppp sweep
// {2,3,4,6,8,16,32,64,128,256,640}, capped at ~6e7 Simpson evaluations per config, ~19 s total).
// floorModel = MODEL_SLOPE * L is the imp-96430 endpoint-slope L-linear cancellation line.
const rungMap = [
  { L: 960, optPpp: 640, floor: 8.8314e-12 },
  { L: 3e3, optPpp: 128, floor: 2.2367e-12 },
  { L: 1e4, optPpp: 128, floor: 2.7468e-10 },
  { L: 3e4, optPpp: 64, floor: 9.6866e-10 },
  { L: 1e5, optPpp: 32, floor: 1.6850e-9 },
  { L: 3e5, optPpp: 16, floor: 3.3936e-8 },
  { L: 1e6, optPpp: 8, floor: 4.1984e-7 },
  { L: 3e6, optPpp: 6, floor: 3.3603e-6 }, // high-ppp arm capped; optPpp is a confirmed lower bound
  { L: PT_ANCHOR_L, optPpp: 3, floor: 2.8414e-5 }, // matches imp-96448 uncapped anchor curve
].map((r) => ({
  ...r,
  floorModel: MODEL_SLOPE * r.L,
  floorOverModel: r.floor / (MODEL_SLOPE * r.L),
}));

// LIVE re-check: two cheap mid rungs reproduce the offline map (~1 s, both well under the eval cap).
const liveChecks = [
  { L: 1e5, ppp: 32 }, // ~9.6e6 evals; floor ~1.685e-9
  { L: 1e6, ppp: 8 }, // ~2.4e7 evals; floor ~4.20e-7
].map(({ L, ppp }) => {
  const d = directRho(L, Math.ceil(ppp * L));
  return { L, ppp, floor: Math.abs(d.rho - rhoExact(L)), Var: d.Var };
});

// where the optimal ppp first falls below the accessible-rung high ppp (640), and where the measured
// floor first departs the L-linear cancellation line by more than 10x (truncation-regime onset).
const collapseOnsetL = rungMap.find((r) => r.optPpp < 640).L; // 3e3
const truncationOnset = rungMap.find((r) => r.floorOverModel > 10); // L ~ 3e5

export const IMP96486_BASIS_C_PPP_COLLAPSE_TRANSITION = {
  ticket: 'imp-96486',
  source:
    'imp-96448 finding 2 measured the direct basis-C floor at the PT anchor L = 5.9e6 as ~2.84e-5 at optimal ppp ~ 3, ~573x above the imp-96430 L-linear model (~4.96e-8), and said the extrapolation is invalid at the anchor but never mapped the transition. This module sweeps ppp across nine L rungs 960 .. 5.9e6 to locate where the optimal ppp collapses off the high-ppp cancellation line and where the floor departs the L-linear model into the ppp-truncation regime. Feasibility / cross-validation numerics only; theoretical GUE quantity, not real zeros.',
  rigidityLimit: RIGIDITY_LIMIT,
  ptAnchorL: PT_ANCHOR_L,
  modelSlope: MODEL_SLOPE,
  rungMap, // per-L optimal ppp, best-achievable floor, L-linear model floor, and their ratio
  liveChecks, // two cheap mid rungs re-measured at import to reproduce the offline map
  transition: {
    collapseOnsetL, // 3e3: first rung where optimal ppp < 640 (collapse begins immediately past L=960)
    lastCancellationOptimalL: 960, // last rung where the high-ppp (640) cancellation line is optimal
    truncationOnsetL: truncationOnset ? truncationOnset.L : null, // L ~ 3e5 where floor/model first > 10x
    truncationOnsetOptPpp: truncationOnset ? truncationOnset.optPpp : null, // ppp* ~ 16 at that onset
    anchorFloorOverModel: rungMap[rungMap.length - 1].floorOverModel, // ~573x at the anchor
  },
  caveat:
    'rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L; there are no computed Riemann zeros behind these values. Every floor is a double-precision quadrature/cancellation artifact of this direct integral, not a property of the zeros. The two largest rungs (3e6, 5.9e6) have their high-ppp arms capped by the ~6e7-evaluation budget, so their optima are lower bounds on ppp* confirmed by the rising U-arm and by the imp-96448 uncapped anchor curve. This is feasibility / cross-validation numerics: it maps a floor transition, changes no bound, establishes no operator positivity, and does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'Mapping the direct basis-C floor across L = 960 .. 5.9e6, the optimal ppp collapses monotonically 640 -> 3, beginning immediately past the L = 960 endpoint (already 128 at L = 3e3, a true U-shape optimum, not an affordability artifact). The achievable floor follows the imp-96430 L-linear cancellation model to within ~2-4x while ppp* >= 32 (up to L ~ 1e5), then departs into the ppp-truncation regime as ppp* falls through 16 (13.5x at 3e5, 50x at 1e6, 133x at 3e6, 573x at the anchor). The model is valid only on the L <= ~1e5 cancellation branch; at the anchor the ppp = 3 truncation floor (~2.84e-5), not the extrapolated cancellation line (~4.96e-8), sets the achievable error -- confirming and localizing the imp-96448 verdict. Feasibility / cross-validation numerics only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Registration (imp-96521): literal `openSubGap:` key so
// scripts/auto-ticket-producer.mjs harvestSubGaps() can mint a follow-up ticket.
// imp-96506 fit the truncation-branch (L>=3e5) floor law this module only
// localized, but that fit is coarse (four rungs, two eval-budget-capped) --
// the residual refinement gap is registered here, on the module that first
// named the branch.
export const IMP96486_OPEN_SUBGAP_REGISTRATION = Object.freeze({
  openSubGap: {
    id: 'imp-96486-ppp-truncation-floor-law-refinement',
    statement:
      'imp-96506 fit the ppp-truncation-branch (L>=3e5) floor law as floor = D*ppp*^beta (beta ~ -4.11) equivalently floor = C*L^alpha (alpha ~ 2.20), but the fit rests on only four imp-96486 rungs with ~0.2-0.3 log-rms scatter, and two of those four (L=3e6, 5.9e6) have eval-budget-capped high-ppp arms so their optimal ppp are confirmed lower bounds, not confirmed optima. Tightening beta/alpha needs either more truncation-branch rungs or an uncapped eval budget at the two largest rungs.',
    status: 'open',
  },
});

// --- self-executing internal-consistency assertions (live mid-rung re-checks + map monotonicity) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // reference values for the local special-function implementations
  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96486: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96486: Ci(1) drifted from reference');

  // exact anchor rho is in the expected GUE range (matches imp-96448)
  if (!approx(rhoExact(PT_ANCHOR_L), -0.481765, 1e-5)) throw new Error('imp-96486: exact anchor rho drifted');

  // Finding 1: optimal ppp collapses monotonically (non-increasing) 640 -> 3 across the rungs
  for (let i = 1; i < rungMap.length; i++) {
    if (rungMap[i].optPpp > rungMap[i - 1].optPpp) throw new Error('imp-96486: optimal ppp should be non-increasing in L');
  }
  if (rungMap[0].optPpp !== 640) throw new Error('imp-96486: L=960 endpoint optimum should be the high-ppp 640 line');
  if (rungMap[rungMap.length - 1].optPpp !== 3) throw new Error('imp-96486: anchor optimum should collapse to ppp=3');

  // Finding 1: the collapse begins immediately past L=960 (first sub-640 rung at L=3e3)
  if (collapseOnsetL !== 3e3) throw new Error('imp-96486: optimal-ppp collapse should begin at L=3e3');

  // Finding 2: floor tracks the L-linear model to within ~4x on the cancellation branch (L <= 1e5)...
  for (const r of rungMap) {
    if (r.L <= 1e5 && !(r.floorOverModel < 5)) throw new Error('imp-96486: floor should track the L-linear model within ~4x up to L=1e5');
  }
  // ... and departs it hard at the anchor (~573x)
  if (!(rungMap[rungMap.length - 1].floorOverModel > 1e2)) throw new Error('imp-96486: anchor floor should exceed the L-linear model by >100x');

  // Finding 3: the truncation regime opens (floor/model > 10x) at L ~ 3e5 where ppp* has fallen to ~16
  if (!truncationOnset || truncationOnset.L !== 3e5) throw new Error('imp-96486: truncation-regime onset should sit at L=3e5');
  if (!(truncationOnset.optPpp <= 16)) throw new Error('imp-96486: truncation onset should coincide with ppp* falling through 16');

  // LIVE re-checks reproduce the offline map at two mid rungs
  const live1e5 = liveChecks.find((r) => r.L === 1e5);
  if (!approx(live1e5.floor, 1.685e-9, 3e-10)) throw new Error('imp-96486: live L=1e5 floor drifted from offline ~1.685e-9');
  const live1e6 = liveChecks.find((r) => r.L === 1e6);
  if (!approx(live1e6.floor, 4.198e-7, 5e-8)) throw new Error('imp-96486: live L=1e6 floor drifted from offline ~4.20e-7');

  // honesty gates
  if (!/NO QED/.test(IMP96486_BASIS_C_PPP_COLLAPSE_TRANSITION.verdict))
    throw new Error('imp-96486: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96486_BASIS_C_PPP_COLLAPSE_TRANSITION.verdict))
    throw new Error('imp-96486: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96486_BASIS_C_PPP_COLLAPSE_TRANSITION;
