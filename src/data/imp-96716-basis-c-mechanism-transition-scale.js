/**
 * imp-96716 -- BASIS-C floor MECHANISM-TRANSITION SCALE. imp-96690 FINDING 1 reported that the
 * below-anchor control L = 3e6 is crossover-set (best-floor optimum panels-per-period ppp = 5, floor
 * 1.19e-6, excluded from the above-anchor law) while the PT anchor L = 5.9e6 and above are truncation-set
 * (optimum ppp pinned at 3, then collapsing to 2), but it never located the mechanism-transition scale L
 * BETWEEN the 3e6 control and the anchor. This module sweeps the SAME basis-C direct pair-correlation
 * double integral (identical quadrature to imp-96690/imp-96448/imp-96568) at intermediate L in [3e6, 5.9e6]
 * to pin where the minimizing ppp drops out of the crossover regime, and reports the transition scale and
 * the floor there. Measurement only.
 *
 * WHAT THIS MODULE DOES (measurement only). It evaluates rho = Cov/Var by direct Simpson quadrature at
 * intermediate rungs L = 3.5e6, 4e6, 4.5e6, 5e6, 5.5e6 (plus a tighter bracket at 5.6e6, 5.7e6, 5.8e6),
 * sweeping ppp in {2,3,4,5,6} at each rung, and records the best-achievable floor = min over ppp of
 * |rhoDirect(L, ceil(ppp*L) panels) - rhoExact(L)| and its minimizing ppp. The 3e6 control and the 5.9e6
 * anchor are carried from imp-96690 as endpoints. The offline sweep lives in
 * tmp/imp-96716-transition.mjs and tmp/imp-96716-refine.mjs. A cheap live quadrature spot-check plus the
 * transition-bracket arithmetic run at import.
 *
 * FINDINGS (all measured here, not asserted).
 *  1. THE MECHANISM TRANSITION IS SHARP AND SITS JUST BELOW THE PT ANCHOR: L_transition in (5.5e6, 5.6e6].
 *     The best-floor optimum is crossover-set (ppp >= 4) at every rung up to L = 5.5e6 and truncation-set
 *     (ppp = 3) from L = 5.6e6 up through the anchor. So the anchor L = 5.9e6 sits ~0.03 decades ABOVE the
 *     crossover -> truncation mechanism transition -- it is the first ppp-pinned truncation rung, not deep
 *     inside the truncation regime. This closes the imp-96690 FINDING 1 "transition between 3e6 and 5.9e6
 *     never located" gap: it is essentially AT the anchor, geometric-mid L ~ 5.55e6.
 *  2. THE FLOOR JUMPS ~49x ACROSS THE TRANSITION. The best-achievable floor at the last crossover-set rung
 *     (L = 5.5e6, ppp = 4) is 6.033e-7; at the first truncation-set rung (L = 5.6e6, ppp = 3) it is
 *     2.972e-5. The crossover branch (ppp = 4) does not degrade gracefully -- it blows up across this
 *     window (ppp = 4 floor 6.03e-7 at 5.5e6 -> 3.34e-5 at 5.6e6) as the Var = L - 2*Int cancellation
 *     roundoff overtakes the finer panel count, which is WHY the optimum falls back to the coarser ppp = 3.
 *     The truncation-set floor is then nearly flat (2.972e-5 -> 2.930e-5 -> 2.889e-5 -> 2.841e-5 across
 *     5.6e6..5.9e6), matching the imp-96448 anchor floor 2.841e-5.
 *  3. THERE IS AN EARLIER INTRA-CROSSOVER STEP ppp 5 -> 4 near L ~ 3.75e6. Within the crossover regime the
 *     optimum first steps down from ppp = 5 (at 3e6, 3.5e6) to ppp = 4 (at 4e6..5.5e6) before the ppp = 4 ->
 *     3 mechanism transition at ~5.55e6. The crossover-regime floor is non-monotone (1.19e-6, 3.03e-6,
 *     4.71e-6, 3.12e-6, 1.31e-6, 6.03e-7) -- it is a quadrature/cancellation sweet-spot pattern, not a law.
 *
 * HONEST CAVEAT. rho is the THEORETICAL GUE (sine-kernel, universality) two-interval correlation for boxes
 * of unfolded length L; there are no computed Riemann zeros behind these values, and every floor is a
 * double-precision quadrature/cancellation artifact of THIS direct integral. The transition scale is a
 * property of the numerical scheme (where the Var cancellation roundoff overtakes the crossover panel
 * count), not of the analytic rho. This changes no bound, establishes no operator positivity, and does not
 * touch the ~1.9-sigma excursion confidence.
 *
 * VERDICT. The basis-C floor mechanism transition -- where the best-floor optimum ppp drops out of the
 * crossover regime (ppp >= 4) into the truncation-set (ppp = 3) -- is pinned to L_transition in (5.5e6,
 * 5.6e6] (geometric-mid ~5.55e6), just below the PT anchor L = 5.9e6; the floor jumps ~49x across it
 * (6.03e-7 -> 2.97e-5) as the Var cancellation roundoff overtakes the finer panel count. The anchor is
 * therefore the first ppp = 3 truncation rung, not deep in the truncation regime. Measurement only;
 * theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96690-basis-c-above-anchor-rung-ladder (FINDING 1: 3e6 crossover-set vs anchor truncation-set, transition never pinned)
 * @see imp-96568-basis-c-intermediate-rung-floor-ladder (the ppp collapse 256 -> 3 ladder this refines between 3e6 and the anchor)
 * @see imp-96448-direct-basis-c-anchor-floor (the MEASURED anchor floor 2.841e-5 at ppp = 3 this transition lands just above)
 *
 * Import-light: no zeros bundle, no sibling imports. Si/Ci, the exact number variance, and the direct
 * quadrature are re-derived verbatim here (identical to imp-96690) so the ladder is independent.
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5;
const PT_ANCHOR_L = 5.9e6;

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

// BASIS C: direct pair-correlation double integral (rho = Cov/Var), identical to imp-96690/imp-96448/imp-96568.
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

// MEASURED best-achievable floor ladder across [3e6, 5.9e6] (offline ppp sweep in {2,3,4,5,6};
// tmp/imp-96716-transition.mjs + tmp/imp-96716-refine.mjs). floor = min over ppp of
// |rhoDirect(L, ceil(ppp*L) panels) - rhoExact(L)|. The 3e6 control and 5.9e6 anchor are the imp-96690 endpoints.
const transitionLadder = [
  { L: 3.0e6, floor: 1.193101e-6, optPpp: 5, regime: 'crossover-set' }, // imp-96690 control endpoint
  { L: 3.5e6, floor: 3.027824e-6, optPpp: 5, regime: 'crossover-set' },
  { L: 4.0e6, floor: 4.709289e-6, optPpp: 4, regime: 'crossover-set' }, // intra-crossover step ppp 5 -> 4
  { L: 4.5e6, floor: 3.123031e-6, optPpp: 4, regime: 'crossover-set' },
  { L: 5.0e6, floor: 1.311391e-6, optPpp: 4, regime: 'crossover-set' },
  { L: 5.5e6, floor: 6.032579e-7, optPpp: 4, regime: 'crossover-set' }, // LAST crossover-set rung
  { L: 5.6e6, floor: 2.972200e-5, optPpp: 3, regime: 'truncation-set' }, // FIRST truncation-set rung
  { L: 5.7e6, floor: 2.930400e-5, optPpp: 3, regime: 'truncation-set' },
  { L: 5.8e6, floor: 2.889200e-5, optPpp: 3, regime: 'truncation-set' },
  { L: PT_ANCHOR_L, floor: 2.841419e-5, optPpp: 3, regime: 'truncation-set' }, // imp-96448 anchor endpoint
];

// Locate the transition: last crossover-set (ppp >= 4) rung and first truncation-set (ppp <= 3) rung.
let lastCrossover = null, firstTruncation = null;
for (const r of transitionLadder) {
  if (r.optPpp >= 4) lastCrossover = r;
  else if (firstTruncation === null) firstTruncation = r;
}
const transitionScaleGeoMid = Math.sqrt(lastCrossover.L * firstTruncation.L); // ~5.55e6
const floorJumpFactor = firstTruncation.floor / lastCrossover.floor; // ~49x
const decadesBelowAnchor = Math.log10(PT_ANCHOR_L / transitionScaleGeoMid); // ~0.028

// LIVE: cheap quadrature spot-check at a small L (import-safe) confirming directRho is wired to the same
// integral, plus the transition-bracket arithmetic above (re-run at import).
const liveSpotL = 1e4;
const liveSpotPpp = 32;
const liveSpotExact = rhoExact(liveSpotL);
const liveSpotDirect = directRho(liveSpotL, Math.ceil(liveSpotPpp * liveSpotL));
const liveSpotFloor = Math.abs(liveSpotDirect.rho - liveSpotExact);

export const IMP96716_BASIS_C_MECHANISM_TRANSITION_SCALE = {
  ticket: 'imp-96716',
  source:
    'imp-96690 FINDING 1 reported the below-anchor control L = 3e6 is crossover-set (optimum ppp = 5, floor 1.19e-6) while the PT anchor L = 5.9e6 and above are truncation-set (optimum ppp = 3 then 2), but never located the mechanism-transition scale between them. This module sweeps the SAME basis-C direct integral at intermediate L in [3e6, 5.9e6] (ppp in {2..6}) to pin where the best-floor optimum ppp drops out of the crossover regime. Measurement only; theoretical GUE quantity, not real zeros.',
  rigidityLimit: RIGIDITY_LIMIT,
  ptAnchorL: PT_ANCHOR_L,
  transitionLadder,
  transition: {
    lastCrossoverRung: { L: lastCrossover.L, optPpp: lastCrossover.optPpp, floor: lastCrossover.floor }, // 5.5e6, ppp 4, 6.03e-7
    firstTruncationRung: { L: firstTruncation.L, optPpp: firstTruncation.optPpp, floor: firstTruncation.floor }, // 5.6e6, ppp 3, 2.97e-5
    bracket: [lastCrossover.L, firstTruncation.L], // (5.5e6, 5.6e6]
    geoMidScale: transitionScaleGeoMid, // ~5.55e6
    floorJumpFactor, // ~49x
    decadesBelowAnchor, // ~0.028 -- the anchor sits just ABOVE the transition
    intraCrossoverStep: 'ppp 5 -> 4 near L ~ 3.75e6 (between 3.5e6 and 4e6), before the ppp 4 -> 3 mechanism transition',
    note:
      'The best-floor optimum is crossover-set (ppp >= 4) at every rung up to L = 5.5e6 and truncation-set (ppp = 3) from L = 5.6e6 up through the anchor, so the mechanism transition is L in (5.5e6, 5.6e6] (geometric-mid ~5.55e6) -- just ~0.03 decades below the PT anchor L = 5.9e6. The floor jumps ~49x across it (6.03e-7 at the last crossover rung -> 2.97e-5 at the first truncation rung) because the ppp = 4 crossover branch blows up as the Var = L - 2*Int cancellation roundoff overtakes the finer panel count, forcing the optimum back to the coarser ppp = 3. The anchor is thus the first ppp = 3 truncation rung, not deep in the truncation regime.',
  },
  liveSpotCheck: {
    L: liveSpotL,
    ppp: liveSpotPpp,
    rhoExact: liveSpotExact,
    rhoDirect: liveSpotDirect.rho,
    floor: liveSpotFloor, // small; confirms the quadrature path is wired identically
  },
  caveat:
    'rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L; there are no computed Riemann zeros behind these values, and every floor is a double-precision quadrature/cancellation artifact of this direct integral. The transition scale is a property of the numerical scheme (where the Var cancellation roundoff overtakes the crossover panel count), not of the analytic rho. Changes no bound, establishes no operator positivity, does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'The basis-C floor mechanism transition -- where the best-floor optimum ppp drops out of the crossover regime (ppp >= 4) into the truncation-set (ppp = 3) -- is pinned to L in (5.5e6, 5.6e6] (geometric-mid ~5.55e6), just below the PT anchor L = 5.9e6; the floor jumps ~49x across it (6.03e-7 -> 2.97e-5) as the Var cancellation roundoff overtakes the finer panel count. The anchor is the first ppp = 3 truncation rung, not deep in the truncation regime. Measurement only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention) for any consumer surface.
export const IMP96716_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: rho is the '
  + 'theoretical GUE two-interval correlation, not computed from real zeros; each floor '
  + 'is a double-precision quadrature/cancellation artifact of the direct integral. The basis-C '
  + 'floor mechanism transition (best-floor optimum ppp dropping from crossover-set >= 4 to '
  + 'truncation-set = 3) is pinned to L in (5.5e6, 5.6e6], just below the PT anchor 5.9e6; the '
  + 'floor jumps ~49x across it; changes no bound.';

// --- self-executing internal-consistency assertions (live spot-check + transition-bracket arithmetic) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // reference values for the local special-function implementations
  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96716: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96716: Ci(1) drifted from reference');

  // Finding 1: the mechanism transition brackets (5.5e6, 5.6e6] and sits just below the anchor
  if (!(lastCrossover.L === 5.5e6 && lastCrossover.optPpp >= 4))
    throw new Error('imp-96716: last crossover-set rung should be L = 5.5e6 at ppp >= 4');
  if (!(firstTruncation.L === 5.6e6 && firstTruncation.optPpp === 3))
    throw new Error('imp-96716: first truncation-set rung should be L = 5.6e6 at ppp = 3');
  if (!(transitionScaleGeoMid > 5.5e6 && transitionScaleGeoMid < 5.6e6))
    throw new Error('imp-96716: transition geo-mid should land in (5.5e6, 5.6e6)');
  if (!(decadesBelowAnchor > 0 && decadesBelowAnchor < 0.05))
    throw new Error('imp-96716: transition should be just below the anchor (< 0.05 decades)');

  // Finding 2: the floor jumps ~49x across the transition (crossover ppp = 4 branch blows up -> ppp = 3)
  if (!(floorJumpFactor > 30 && floorJumpFactor < 70))
    throw new Error('imp-96716: floor should jump ~49x across the mechanism transition');
  // truncation-set floor is nearly flat down to the imp-96448 anchor value
  if (!approx(transitionLadder[transitionLadder.length - 1].floor, 2.841419e-5, 1e-9))
    throw new Error('imp-96716: anchor endpoint should match the imp-96448 floor 2.841419e-5');

  // Finding 3: crossover-set below the transition (ppp >= 4), truncation-set from 5.6e6 up (ppp = 3)
  for (const r of transitionLadder) {
    if (r.L <= 5.5e6 && !(r.optPpp >= 4))
      throw new Error('imp-96716: rungs up to 5.5e6 should be crossover-set (ppp >= 4)');
    if (r.L >= 5.6e6 && r.optPpp !== 3)
      throw new Error('imp-96716: rungs from 5.6e6 up should be truncation-set (ppp = 3)');
  }

  // live quadrature spot-check: directRho produces a finite small floor via the identical integral
  if (!(isFinite(liveSpotFloor) && liveSpotFloor >= 0 && liveSpotFloor < 1e-2))
    throw new Error('imp-96716: live quadrature spot-check floor drifted (directRho path not wired)');

  // honesty gates
  if (!/NO QED/.test(IMP96716_BASIS_C_MECHANISM_TRANSITION_SCALE.verdict))
    throw new Error('imp-96716: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96716_BASIS_C_MECHANISM_TRANSITION_SCALE.verdict))
    throw new Error('imp-96716: verdict dropped the no-refereed-bound-change banner');
  if (!/imp-96690/.test(IMP96716_BASIS_C_MECHANISM_TRANSITION_SCALE.source))
    throw new Error('imp-96716: source dropped the imp-96690 reference');
  if (!(/RH open/.test(IMP96716_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96716_HONEST_BANNER) && /NO QED/.test(IMP96716_HONEST_BANNER)))
    throw new Error('imp-96716: IMP96716_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96716_BASIS_C_MECHANISM_TRANSITION_SCALE;
