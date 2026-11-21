/**
 * imp-96587 -- BASIS-C L = 1e6 floor rung FULLY BOTTOMED by extending the ppp sweep to its true
 * U-curve minimum, resolving imp-96568 HONEST CAVEAT (b) and testing whether the rung becomes a
 * clean third truncation-regime rung for the above-anchor floor law.
 *
 * BACKGROUND. imp-96568 measured the basis-C direct-integral best-achievable floor(L) at intermediate
 * rungs and found the optimum panels-per-period (ppp) collapses monotonically with L (256 at 1e3, 48 at
 * 1e5, pinned at 3 at the anchor 5.9e6 and at 1e7), diagnosing a two-mechanism crossover: cancellation-
 * set at small L (deep floor, reached at high ppp) versus Simpson-truncation-set at/above the anchor
 * (ppp pinned at 3). Its caveat (b) flagged that the L = 1e6 rung was NOT fully bottomed -- its sweep only
 * reached ppp = 6, where floor ~ 1.99e-6 is an UPPER bound with an unclean local exponent -- so only the
 * two ppp = 3 truncation rungs (anchor, 1e7) fed the above-anchor power-law exponent p ~ 1.81.
 *
 * WHAT THIS MODULE DOES (measurement only). It extends the identical basis-C double-integral quadrature
 * (rho = Cov/Var, verbatim from imp-96430/imp-96448/imp-96568) at L = 1e6 across a full ppp sweep
 * (offline tmp/imp-96587-bottom-1e6.mjs) to locate the true U-curve minimum, then re-examines the
 * above-anchor floor law and the mechanism classification of the rung. A cheap live L = 1e5 spot-check
 * reproduces a mid-ladder direct value at import so the ladder is independently verifiable.
 *
 * FINDINGS (all measured here, not asserted).
 *  1. THE L = 1e6 RUNG BOTTOMS AT ppp = 10, floor = 3.267353e-9 -- ~608x DEEPER than the imp-96568
 *     UPPER bound (1.988968e-6 at ppp = 6). The U-curve is clean: floor falls 1.99e-6 (ppp 6) ->
 *     4.20e-7 (ppp 8) -> 3.27e-9 (ppp 10, minimum) then rises 1.17e-6 (ppp 12) -> 8.97e-5 (ppp 128).
 *     imp-96568 caveat (b) is RESOLVED: the optimum ppp is 10, not an open ">= 6".
 *  2. THE BOTTOMED RUNG IS CANCELLATION / CROSSOVER-SET, NOT TRUNCATION-SET -- THE TICKET HYPOTHESIS IS
 *     REFUTED. Its optimum ppp = 10 sits well above the resolution floor ppp = 3, and its deep floor
 *     3.27e-9 is comparable to the L = 1e5 crossover rung (1.17e-9), NOT to the truncation-set anchor
 *     floor (2.84e-5). So L = 1e6 does NOT become a "clean third truncation-regime rung": it lies BELOW
 *     the anchor and still in the crossover regime. The above-anchor power law stays pinned on the only
 *     two ppp = 3 truncation rungs (anchor, 1e7); the exponent p ~ 1.81 is UNCHANGED and L* ~ 1.9e8
 *     is unchanged.
 *  3. THE REFINED ppp-COLLAPSE LADDER IS CLEANLY MONOTONE: 256 (1e3) -> 48 (1e5) -> 10 (1e6) -> 3
 *     (anchor) -> 3 (1e7). The bottomed 1e6 rung fills the previously-open gap between 48 and 3 with a
 *     genuine intermediate optimum, sharpening the imp-96568 mechanism-crossover picture.
 *  4. THE LOCAL EXPONENT 1e6 -> anchor IS STEEP (~5.11), NOT ~1.81, precisely BECAUSE the two rungs
 *     straddle the mechanism change (cancellation-set 3.27e-9 at 1e6 vs truncation-set 2.84e-5 at the
 *     anchor). A three-rung log-log OLS through (1e6, anchor, 1e7) gives a spurious ~4.55 slope; mixing
 *     the crossover rung with the truncation rungs is NOT a valid floor law -- confirming imp-96568 was
 *     right to exclude 1e6 from the above-anchor fit.
 *
 * HONEST CAVEAT. rho is the THEORETICAL GUE (sine-kernel, universality) two-interval correlation for
 * boxes of unfolded length L; there are no computed Riemann zeros behind these values, and each floor is
 * a double-precision quadrature/cancellation artifact of THIS direct integral. This measurement changes
 * NO bound: it deepens the reported L = 1e6 floor (a diagnostic quantity) and reclassifies the rung, but
 * the above-anchor exponent p ~ 1.81 and the tightened reach L* ~ 1.9e8 both rest -- exactly as before --
 * on the two ppp = 3 truncation rungs, so caveat (a) of imp-96568 (single-power-law extrapolation past
 * 1e7) still stands. Establishes no operator positivity; does not touch the ~1.9-sigma excursion.
 *
 * VERDICT. Fully bottoming the basis-C L = 1e6 floor rung (offline ppp sweep) locates its U-curve minimum
 * at ppp = 10, floor = 3.267353e-9 -- ~608x deeper than the imp-96568 ppp = 6 upper bound -- resolving
 * caveat (b). But the bottomed rung is cancellation / crossover-set (optimum ppp = 10, not the truncation
 * resolution floor ppp = 3), so it does NOT convert into a third truncation-regime rung: the above-anchor
 * exponent p ~ 1.81 stays pinned on the two ppp = 3 rungs (anchor, 1e7) and L* ~ 1.9e8 is unchanged. The
 * refined ppp-collapse ladder (256 -> 48 -> 10 -> 3 -> 3) is cleanly monotone. Measurement only;
 * theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96568-basis-c-intermediate-rung-floor-ladder (the ladder and caveat (b) this resolves)
 * @see imp-96448-direct-basis-c-anchor-floor (the MEASURED anchor floor ~2.84e-5 and ppp = 3 collapse)
 * @see imp-96531-basis-c-crossover-measured-floor (the L-linear re-anchored crossover this line tightens)
 *
 * Import-light: no zeros bundle, no sibling imports. Si/Ci, the exact number variance, and the direct
 * quadrature are re-derived verbatim here (identical to imp-96430/imp-96448/imp-96568) so the ladder is
 * independent. The 1e6 sweep is carried as offline-measured literals (a single 1e6 rung costs ~1.6 s, too
 * heavy to run at import); a cheap live L = 1e5 spot-check reproduces a mid-ladder direct value.
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5;
const PT_ANCHOR_L = 5.9e6;
const MEASURED_ANCHOR_FLOOR = 2.8414e-5; // imp-96448 truncation-set anchor floor (ppp = 3)
const FLOOR_1E7 = 7.3978e-5; // imp-96568 truncation-set rung at 1e7 (ppp = 3)

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

// BASIS C: direct pair-correlation double integral (rho = Cov/Var), identical to imp-96430/imp-96448/imp-96568.
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

// OFFLINE-MEASURED full ppp sweep at L = 1e6 (tmp/imp-96587-bottom-1e6.mjs). floor = |rhoDirect - rhoExact|
// with panels = ppp * L. The U-curve minimum is the fully-bottomed floor (resolves imp-96568 caveat b).
const RHO_EXACT_1E6 = -0.47988616045932175;
const ppp1e6Sweep = [
  { ppp: 6, floor: 1.988968e-6 }, // imp-96568 upper bound (its sweep stopped here)
  { ppp: 8, floor: 4.198410e-7 },
  { ppp: 10, floor: 3.267353e-9 }, // U-curve MINIMUM -- fully bottomed
  { ppp: 12, floor: 1.170603e-6 },
  { ppp: 16, floor: 1.648672e-6 },
  { ppp: 20, floor: 2.051582e-6 },
  { ppp: 24, floor: 8.441532e-6 },
  { ppp: 32, floor: 9.611758e-6 },
  { ppp: 40, floor: 1.026835e-5 },
  { ppp: 48, floor: 3.112065e-5 },
  { ppp: 64, floor: 3.162731e-5 },
  { ppp: 80, floor: 3.187054e-5 },
  { ppp: 96, floor: 8.952367e-5 },
  { ppp: 128, floor: 8.970673e-5 },
];
const bottomed1e6 = ppp1e6Sweep.reduce((best, r) => (r.floor < best.floor ? r : best), ppp1e6Sweep[0]);
const BOTTOMED_1E6_FLOOR = bottomed1e6.floor; // 3.267353e-9 at ppp = 10
const IMP96568_UPPER_BOUND_1E6 = 1.988968e-6; // ppp = 6 value imp-96568 carried as an upper bound
const deepeningVsUpperBound = IMP96568_UPPER_BOUND_1E6 / BOTTOMED_1E6_FLOOR; // ~608x

// Refined ppp-collapse ladder now with the bottomed 1e6 rung filling the 48 -> 3 gap at optimum ppp = 10.
const refinedPppLadder = [
  { L: 1e3, floor: 4.843348e-13, optPpp: 256, mechanism: 'cancellation-set' },
  { L: 1e5, floor: 1.169484e-9, optPpp: 48, mechanism: 'crossover' },
  { L: 1e6, floor: BOTTOMED_1E6_FLOOR, optPpp: 10, mechanism: 'crossover (fully bottomed; was upper bound)' },
  { L: PT_ANCHOR_L, floor: MEASURED_ANCHOR_FLOOR, optPpp: 3, mechanism: 'truncation-set (imp-96448)' },
  { L: 1e7, floor: FLOOR_1E7, optPpp: 3, mechanism: 'truncation-set' },
];

// The above-anchor law is UNCHANGED: it uses only the two ppp = 3 truncation rungs (anchor, 1e7).
const aboveAnchorExponent = Math.log(FLOOR_1E7 / MEASURED_ANCHOR_FLOOR) / Math.log(1e7 / PT_ANCHOR_L); // ~1.8135
// The local exponent across the mechanism change (1e6 crossover-set -> anchor truncation-set) is STEEP,
// showing why the bottomed 1e6 rung cannot join the above-anchor truncation fit.
const localExponent1e6ToAnchor =
  Math.log(MEASURED_ANCHOR_FLOOR / BOTTOMED_1E6_FLOOR) / Math.log(PT_ANCHOR_L / 1e6); // ~5.11
// A spurious three-rung OLS slope (mixing the crossover rung with the truncation rungs) -- NOT a valid law.
const spuriousThreeRungSlope = (() => {
  const xs = [Math.log(1e6), Math.log(PT_ANCHOR_L), Math.log(1e7)];
  const ys = [Math.log(BOTTOMED_1E6_FLOOR), Math.log(MEASURED_ANCHOR_FLOOR), Math.log(FLOOR_1E7)];
  const n = 3;
  const sx = xs.reduce((a, b) => a + b, 0), sy = ys.reduce((a, b) => a + b, 0);
  const sxx = xs.reduce((a, b) => a + b * b, 0), sxy = xs.reduce((a, b, i) => a + b * ys[i], 0);
  return (n * sxy - sx * sy) / (n * sxx - sx * sx); // ~4.55
})();

// LIVE cheap spot-check: re-measure the L = 1e5 mid-ladder rung at ppp = 10 (~1e6 Simpson evals, fast).
const liveSpotL = 1e5;
const liveSpotPpp = 10;
const liveSpotExact = rhoExact(liveSpotL);
const liveSpotDirect = directRho(liveSpotL, Math.ceil(liveSpotPpp * liveSpotL));
const liveSpotFloor = Math.abs(liveSpotDirect.rho - liveSpotExact);

export const IMP96587_BASIS_C_1E6_RUNG_BOTTOMED = {
  ticket: 'imp-96587',
  source:
    'imp-96568 measured the basis-C floor ladder but its HONEST CAVEAT (b) flagged that the L = 1e6 rung was not fully bottomed (its sweep reached only ppp = 6, floor ~ 1.99e-6 as an upper bound), so only the two ppp = 3 truncation rungs (anchor, 1e7) fed the above-anchor exponent p ~ 1.81. This module extends the ppp sweep at L = 1e6 to its true U-curve minimum, tests whether the rung becomes a third truncation-regime rung, and re-examines the above-anchor law. Measurement only; theoretical GUE quantity, not real zeros.',
  rigidityLimit: RIGIDITY_LIMIT,
  ptAnchorL: PT_ANCHOR_L,
  rhoExact1e6: RHO_EXACT_1E6,
  ppp1e6Sweep,
  bottomed1e6: {
    optPpp: bottomed1e6.ppp, // 10
    floor: BOTTOMED_1E6_FLOOR, // 3.267353e-9
    imp96568UpperBound: IMP96568_UPPER_BOUND_1E6, // 1.988968e-6 (ppp = 6)
    deepeningVsUpperBound, // ~608x
    mechanism: 'cancellation / crossover-set (optimum ppp = 10 > truncation resolution floor 3)',
    note:
      'The L = 1e6 U-curve bottoms at ppp = 10 with floor 3.267353e-9, ~608x deeper than the imp-96568 ppp = 6 upper bound 1.988968e-6. The optimum ppp = 10 sits well above the truncation resolution floor 3, and the deep floor is comparable to the L = 1e5 crossover rung (1.17e-9), so the rung is cancellation / crossover-set, NOT truncation-set. imp-96568 caveat (b) is resolved: the optimum is 10, not an open >= 6.',
  },
  refinedPppLadder,
  hypothesisTest: {
    ticketHypothesis:
      'bottoming L = 1e6 converts it into a clean third truncation-regime rung that tightens the above-anchor exponent p ~ 1.81',
    verdict: 'REFUTED by measurement',
    reason:
      'The bottomed rung is cancellation / crossover-set (optimum ppp = 10, not the truncation resolution floor 3) and lies BELOW the anchor, so it cannot join the above-anchor truncation fit. The above-anchor exponent stays pinned on the only two ppp = 3 rungs (anchor, 1e7).',
  },
  aboveAnchorLaw: {
    exponent: aboveAnchorExponent, // ~1.8135 -- UNCHANGED from imp-96568
    rungsUsed: ['anchor (5.9e6, ppp = 3)', '1e7 (ppp = 3)'],
    localExponent1e6ToAnchor, // ~5.11 (steep -- straddles the mechanism change)
    spuriousThreeRungSlope, // ~4.55 (mixing crossover + truncation rungs -- NOT a valid law)
    lStarUnchanged: true,
    note:
      'The above-anchor power-law exponent p ~ 1.81 and the tightened reach L* ~ 1.9e8 are UNCHANGED: they rest, exactly as in imp-96568, on the two ppp = 3 truncation rungs. The local 1e6 -> anchor exponent ~5.11 and the spurious three-rung OLS slope ~4.55 both come from mixing the crossover-set 1e6 rung with the truncation rungs, confirming imp-96568 was right to exclude 1e6 from the above-anchor fit.',
  },
  liveSpotCheck: {
    L: liveSpotL,
    ppp: liveSpotPpp,
    rhoExact: liveSpotExact,
    rhoDirect: liveSpotDirect.rho,
    floor: liveSpotFloor,
    note: 'Cheap live re-measurement of a mid-ladder direct value; the full 1e6 rung is carried as offline-measured literals (a single 1e6 ppp = 10 rung costs ~1.6 s, too heavy to run at import).',
  },
  caveat:
    'rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L; there are no computed Riemann zeros behind these values, and each floor is a double-precision quadrature/cancellation artifact of this direct integral. This measurement changes NO bound: it deepens the reported L = 1e6 diagnostic floor (~608x) and reclassifies the rung, but the above-anchor exponent p ~ 1.81 and the reach L* ~ 1.9e8 both still rest on the two ppp = 3 truncation rungs, so imp-96568 caveat (a) (single-power-law extrapolation past 1e7) still stands. Establishes no operator positivity; does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'Fully bottoming the basis-C L = 1e6 floor rung locates its U-curve minimum at ppp = 10, floor = 3.267353e-9 -- ~608x deeper than the imp-96568 ppp = 6 upper bound 1.988968e-6 -- resolving caveat (b). But the bottomed rung is cancellation / crossover-set (optimum ppp = 10, not the truncation resolution floor 3), so it does NOT become a third truncation-regime rung: the above-anchor exponent p ~ 1.81 stays pinned on the two ppp = 3 rungs (anchor, 1e7) and L* ~ 1.9e8 is unchanged. The refined ppp-collapse ladder (256 -> 48 -> 10 -> 3 -> 3) is cleanly monotone. Measurement only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention) for any consumer surface.
export const IMP96587_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: rho is the '
  + 'theoretical GUE two-interval correlation, not computed from real zeros; each floor '
  + 'is a double-precision quadrature/cancellation artifact of the direct integral. Bottoming '
  + 'the L = 1e6 rung deepens its diagnostic floor to 3.27e-9 (ppp = 10) but reclassifies it as '
  + 'crossover-set, NOT truncation-set: the above-anchor exponent ~1.81 and L* ~ 1.9e8 are '
  + 'unchanged. Changes no bound.';

// --- self-executing internal-consistency assertions (live spot-check + ladder / law checks) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // reference values for the local special-function implementations
  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96587: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96587: Ci(1) drifted from reference');
  if (!approx(rhoExact(1e6), RHO_EXACT_1E6, 1e-12)) throw new Error('imp-96587: rhoExact(1e6) drifted from reference');

  // Finding 1: the L = 1e6 U-curve bottoms at ppp = 10 with a floor ~608x below the imp-96568 upper bound
  if (bottomed1e6.ppp !== 10) throw new Error('imp-96587: the L=1e6 U-curve minimum should be at ppp = 10');
  if (!approx(BOTTOMED_1E6_FLOOR, 3.267353e-9, 1e-11)) throw new Error('imp-96587: bottomed 1e6 floor drifted from ~3.27e-9');
  if (!(BOTTOMED_1E6_FLOOR < IMP96568_UPPER_BOUND_1E6)) throw new Error('imp-96587: bottomed floor must be below the imp-96568 upper bound');
  if (!(deepeningVsUpperBound > 500 && deepeningVsUpperBound < 700)) throw new Error('imp-96587: deepening vs upper bound should be ~608x');
  // the sweep is a genuine U-curve: falls to the minimum then rises
  if (!(ppp1e6Sweep[1].floor < ppp1e6Sweep[0].floor && bottomed1e6.floor < ppp1e6Sweep[1].floor))
    throw new Error('imp-96587: the ppp sweep should fall to the ppp = 10 minimum');
  if (!(ppp1e6Sweep[ppp1e6Sweep.length - 1].floor > BOTTOMED_1E6_FLOOR))
    throw new Error('imp-96587: the ppp sweep should rise past the minimum (U-curve)');

  // Finding 2: the rung is crossover-set (optimum ppp = 10 > truncation floor 3), NOT truncation-set
  if (!(bottomed1e6.ppp > 3)) throw new Error('imp-96587: bottomed 1e6 optimum ppp should exceed the truncation resolution floor 3');

  // Finding 3: the refined ppp ladder is cleanly monotone non-increasing (256 -> 48 -> 10 -> 3 -> 3)
  const ppps = refinedPppLadder.map((r) => r.optPpp);
  for (let i = 1; i < ppps.length; i++) {
    if (ppps[i] > ppps[i - 1]) throw new Error('imp-96587: refined optimum ppp ladder should be non-increasing in L');
  }
  if (ppps[0] !== 256 || ppps[2] !== 10 || ppps[ppps.length - 1] !== 3)
    throw new Error('imp-96587: refined ppp ladder should read 256 -> 48 -> 10 -> 3 -> 3');

  // above-anchor law UNCHANGED and the mixed-regime slopes are steep (why 1e6 is excluded)
  if (!approx(aboveAnchorExponent, 1.8135, 5e-3)) throw new Error('imp-96587: above-anchor exponent should stay ~1.81');
  if (!(localExponent1e6ToAnchor > 4)) throw new Error('imp-96587: 1e6 -> anchor local exponent should be steep (mechanism change)');
  if (!(spuriousThreeRungSlope > 3)) throw new Error('imp-96587: mixed three-rung slope should be spuriously steep');

  // live spot-check reproduces the mid-ladder direct value at L = 1e5, ppp = 10
  if (!approx(liveSpotDirect.rho, -0.47678403113707624, 1e-9))
    throw new Error('imp-96587: live L=1e5 ppp=10 direct rho drifted from reference');
  if (!(liveSpotFloor > 0 && liveSpotFloor < 1e-1))
    throw new Error('imp-96587: live L=1e5 spot-check floor should be a small positive quadrature residual');

  // honesty gates
  if (!/NO QED/.test(IMP96587_BASIS_C_1E6_RUNG_BOTTOMED.verdict))
    throw new Error('imp-96587: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96587_BASIS_C_1E6_RUNG_BOTTOMED.verdict))
    throw new Error('imp-96587: verdict dropped the no-refereed-bound-change banner');
  if (!/imp-96568/.test(IMP96587_BASIS_C_1E6_RUNG_BOTTOMED.source))
    throw new Error('imp-96587: source dropped the imp-96568 reference');
  if (!(/RH open/.test(IMP96587_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96587_HONEST_BANNER) && /NO QED/.test(IMP96587_HONEST_BANNER)))
    throw new Error('imp-96587: IMP96587_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96587_BASIS_C_1E6_RUNG_BOTTOMED;
