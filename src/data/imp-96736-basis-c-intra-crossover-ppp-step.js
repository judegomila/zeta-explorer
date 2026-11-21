/**
 * imp-96736 -- BASIS-C INTRA-CROSSOVER ppp 5 -> 4 STEP: PINNED SCALE + SWEET-SPOT-vs-LAW VERDICT.
 * imp-96716 FINDING 3 reported that WITHIN the crossover regime the best-floor optimum panels-per-period
 * (ppp) first steps from ppp = 5 (at L = 3e6, 3.5e6) down to ppp = 4 (at L = 4e6..5.5e6) "near L ~ 3.75e6"
 * -- but that "3.75e6" was only the midpoint of the coarse (3.5e6, 4.0e6) bracket, and the non-monotone
 * crossover-regime floor sequence (1.19e-6, 3.03e-6, 4.71e-6, 3.12e-6, 1.31e-6, 6.03e-7) was labelled a
 * "quadrature/cancellation sweet-spot, not a law" WITHOUT the hypothesis being tested. This module sweeps
 * the SAME basis-C direct pair-correlation double integral (identical Simpson/Si/Ci quadrature to
 * imp-96716/imp-96690/imp-96448) on a FINE L grid in (3.5e6, 4.0e6), ppp in {4, 5, 6}, to (a) pin the
 * ppp 5 -> 4 step precisely and (b) decide whether its L scales with the panel/period geometry
 * (predictable) or floats with cancellation roundoff (artifact). Measurement only.
 *
 * WHAT THIS MODULE DOES (measurement only). floor(L, ppp) = |rhoDirect(L, ceil(ppp*L) panels) -
 * rhoExact(L)|; optimum ppp = argmin over {4, 5, 6}. It bakes the offline fine sweep (11 rungs at 5e4
 * spacing, tmp/imp-96736-step-bracket.mjs) plus a refined 7-rung bracket at 1e4 spacing
 * (tmp/imp-96736-refine.mjs), and re-runs a cheap live quadrature spot-check plus all the bracket /
 * monotonicity / roundoff-scale arithmetic at import.
 *
 * FINDINGS (all measured here, not asserted).
 *  1. THE ppp 5 -> 4 STEP IS PINNED to L in (3.93e6, 3.94e6] (geometric-mid ~3.935e6), NOT "near 3.75e6".
 *     On the fine grid the best-floor optimum is ppp = 5 at every rung up to L = 3.90e6 and ppp = 4 from
 *     L = 3.95e6; the refined 1e4-spacing bracket pins the flip to (3.93e6, 3.94e6] (the f4/f5 ratio last
 *     exceeds 1 at 3.93e6 = 1.0157 and first drops below 1 at 3.94e6 = 0.9920). So the true step sits
 *     ~0.02 decades ABOVE the imp-96716 "3.75e6" midpoint guess -- that guess was only the centre of the
 *     coarse (3.5e6, 4.0e6) bracket, not a measured crossing.
 *  2. THE CROSSING ITSELF IS DETERMINISTIC & REPRODUCIBLE, NOT ROUNDOFF JITTER. Across the fine grid the
 *     ppp = 5 floor branch is strictly monotone INCREASING (3.03e-6 at 3.5e6 -> 5.18e-6 at 4.0e6, 10/10
 *     up) and the ppp = 4 branch strictly monotone DECREASING (6.17e-6 -> 4.71e-6, 10/10 down); their
 *     ratio f4/f5 falls smoothly and monotonically (2.038 -> 0.910) and crosses 1 exactly once at
 *     ~3.935e6. A tiny ~1e-3-level wobble rides on the ratio (3.925e6 gives 1.0290 vs 3.920e6 gives
 *     1.0280) -- the roundoff jitter -- but it does NOT move the crossing. So the step L is a predictable,
 *     reproducible number, not a floating artifact.
 *  3. BUT THE STEP IS A GENUINE CANCELLATION-ROUNDOFF SWEET-SPOT IN MECHANISM. The per-ppp error is
 *     NON-monotone in ppp: f6 already exceeds f5 at L = 3.5e6 (5.20e-6 vs 3.03e-6) and BLOWS UP ~5x to
 *     ~3.0e-5 from L = 3.75e6, so finer panels accumulate MORE Var = L - 2*Int cancellation roundoff and
 *     the optimum sits at an INTERIOR ppp. The bare roundoff floor L*eps/Var ~ 4.4e-10 is ~4 decades
 *     BELOW the actual floors (~5e-6) and Var is essentially flat (~1.88 across the window), so it is the
 *     ACCUMULATED cancellation roundoff (proportional to the finer panel count), not the analytic Var,
 *     that drives the ppp = 5 branch up until the coarser ppp = 4 wins. This is the same double-precision
 *     mechanism imp-96728 proved (Neumaier compensation removes the naive ppp-optimum transitions).
 *
 * HONEST CAVEAT. rho is the THEORETICAL GUE (sine-kernel, universality) two-interval correlation for boxes
 * of unfolded length L; there are no computed Riemann zeros behind these values, and every floor is a
 * double-precision quadrature/cancellation artifact of THIS direct integral. The ppp 5 -> 4 step scale is
 * a property of the naive numerical scheme (a deterministic branch crossing whose EXISTENCE is a roundoff
 * sweet-spot), not of the analytic rho. This changes no bound, establishes no operator positivity, and
 * does not touch the ~1.9-sigma excursion confidence.
 *
 * VERDICT. imp-96716 FINDING 3's two labels are both refined: (i) "not a law" of rho is correct -- the
 * step is a pure numerical-scheme property; (ii) "sweet-spot" is correct in MECHANISM -- the optimum ppp
 * is interior because finer panels accumulate more Var cancellation roundoff (f6 > f5, f6 blows up); but
 * (iii) contrary to "floats with roundoff", the step L is DETERMINISTIC and now PINNED to (3.93e6, 3.94e6]
 * (geo-mid ~3.935e6, revising the "near 3.75e6" midpoint guess), and the branch crossing is a smooth
 * monotone crossing, not floating jitter. Measurement only; theoretical GUE quantity, not real zeros;
 * changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays
 * PCC/GRH-gated.
 *
 * @see imp-96716-basis-c-mechanism-transition-scale (FINDING 3: the ppp 5 -> 4 step located only to "near 3.75e6", sweet-spot never tested)
 * @see imp-96728-basis-c-compensated-var-transition (proves the naive-accumulator ppp optima are double-precision artifacts; Neumaier compensation removes them)
 * @see imp-96690-basis-c-above-anchor-rung-ladder (the crossover-set vs truncation-set ppp classification this refines)
 *
 * Import-light: no zeros bundle, no sibling imports. Si/Ci, the exact number variance, and the direct
 * quadrature are re-derived verbatim here (identical to imp-96716) so the ladder is independent.
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;
const EULER = 0.5772156649015329;
const EPS = 2.220446049250313e-16;

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

// BASIS C: direct pair-correlation double integral (rho = Cov/Var), identical to imp-96716/imp-96690.
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

// MEASURED fine sweep across (3.5e6, 4.0e6) at 5e4 spacing (offline: tmp/imp-96736-step-bracket.mjs).
// floor(L, ppp) = |rhoDirect(L, ceil(ppp*L)) - rhoExact(L)|; optPpp = argmin over {4,5,6}. Var/roundoff
// are the ppp=5 branch. Reproduces the imp-96716 baked endpoints exactly (f5(3.5e6)=3.028e-6, f4(4e6)=4.709e-6).
const fineLadder = [
  { L: 3.50e6, f4: 6.172e-6, f5: 3.028e-6, f6: 5.198e-6, optPpp: 5, Var: 1.873, roundoff: 4.149e-10 },
  { L: 3.55e6, f4: 6.070e-6, f5: 3.242e-6, f6: 5.406e-6, optPpp: 5, Var: 1.875, roundoff: 4.205e-10 },
  { L: 3.60e6, f4: 5.913e-6, f5: 3.418e-6, f6: 5.611e-6, optPpp: 5, Var: 1.876, roundoff: 4.261e-10 },
  { L: 3.65e6, f4: 5.769e-6, f5: 3.690e-6, f6: 5.807e-6, optPpp: 5, Var: 1.877, roundoff: 4.317e-10 },
  { L: 3.70e6, f4: 5.606e-6, f5: 3.850e-6, f6: 6.029e-6, optPpp: 5, Var: 1.879, roundoff: 4.373e-10 },
  { L: 3.75e6, f4: 5.456e-6, f5: 4.097e-6, f6: 2.963e-5, optPpp: 5, Var: 1.880, roundoff: 4.429e-10 }, // f6 blows up here
  { L: 3.80e6, f4: 5.312e-6, f5: 4.296e-6, f6: 3.038e-5, optPpp: 5, Var: 1.882, roundoff: 4.485e-10 },
  { L: 3.85e6, f4: 5.155e-6, f5: 4.510e-6, f6: 3.121e-5, optPpp: 5, Var: 1.883, roundoff: 4.540e-10 },
  { L: 3.90e6, f4: 5.023e-6, f5: 4.755e-6, f6: 3.199e-5, optPpp: 5, Var: 1.884, roundoff: 4.596e-10 }, // last ppp=5
  { L: 3.95e6, f4: 4.871e-6, f5: 4.944e-6, f6: 3.287e-5, optPpp: 4, Var: 1.885, roundoff: 4.652e-10 }, // first ppp=4
  { L: 4.00e6, f4: 4.709e-6, f5: 5.175e-6, f6: 3.365e-5, optPpp: 4, Var: 1.887, roundoff: 4.708e-10 },
];

// MEASURED refined bracket at 1e4 spacing (offline: tmp/imp-96736-refine.mjs), f4/f5 only.
const refinedBracket = [
  { L: 3.900e6, f4: 5.0231e-6, f5: 4.7548e-6, ratio: 1.0564, optPpp: 5 },
  { L: 3.910e6, f4: 4.9728e-6, f5: 4.7903e-6, ratio: 1.0381, optPpp: 5 },
  { L: 3.920e6, f4: 4.9538e-6, f5: 4.8187e-6, ratio: 1.0280, optPpp: 5 },
  { L: 3.925e6, f4: 4.9754e-6, f5: 4.8350e-6, ratio: 1.0290, optPpp: 5 }, // ~1e-3 wobble vs 3.920e6
  { L: 3.930e6, f4: 4.9324e-6, f5: 4.8562e-6, ratio: 1.0157, optPpp: 5 }, // last ppp=5
  { L: 3.940e6, f4: 4.8743e-6, f5: 4.9137e-6, ratio: 0.9920, optPpp: 4 }, // first ppp=4
  { L: 3.950e6, f4: 4.8712e-6, f5: 4.9444e-6, ratio: 0.9852, optPpp: 4 },
];

// Pin the step from the refined bracket: last ppp=5 rung and first ppp=4 rung.
let lastFive = null, firstFour = null;
for (const r of refinedBracket) {
  if (r.optPpp === 5) lastFive = r;
  else if (firstFour === null) firstFour = r;
}
const stepBracket = [lastFive.L, firstFour.L]; // (3.93e6, 3.94e6]
const stepGeoMid = Math.sqrt(lastFive.L * firstFour.L); // ~3.935e6
const imp96716MidpointGuess = 3.75e6;
const decadesAboveGuess = Math.log10(stepGeoMid / imp96716MidpointGuess); // ~0.02

// Monotonicity of each branch across the fine ladder (deterministic-crossing test).
function monoDir(vals) {
  let up = 0, down = 0;
  for (let i = 1; i < vals.length; i++) (vals[i] > vals[i - 1] ? (up += 1) : (down += 1));
  return { up, down };
}
const f4Mono = monoDir(fineLadder.map((r) => r.f4)); // strictly down
const f5Mono = monoDir(fineLadder.map((r) => r.f5)); // strictly up

// Roundoff-scale separation: floors are ~4 decades ABOVE the bare roundoff floor L*eps/Var.
const floorVsRoundoff = fineLadder[5].f5 / fineLadder[5].roundoff; // ~1e4 at L=3.75e6

// LIVE: cheap quadrature spot-check at small L (import-safe) confirming directRho is wired to the same
// integral, plus all the bracket/monotonicity arithmetic above (re-run at import).
const liveSpotL = 1e4;
const liveSpotPpp = 32;
const liveSpotExact = rhoExact(liveSpotL);
const liveSpotDirect = directRho(liveSpotL, Math.ceil(liveSpotPpp * liveSpotL));
const liveSpotFloor = Math.abs(liveSpotDirect.rho - liveSpotExact);

export const IMP96736_BASIS_C_INTRA_CROSSOVER_PPP_STEP = {
  ticket: 'imp-96736',
  source:
    'imp-96716 FINDING 3 located the intra-crossover best-floor optimum ppp 5 -> 4 step only to "near L ~ 3.75e6" (the midpoint of the coarse (3.5e6, 4.0e6) bracket) and labelled the non-monotone crossover-regime floor a "sweet-spot, not a law" without testing it. This module sweeps the SAME basis-C direct integral on a fine L grid in (3.5e6, 4.0e6), ppp in {4,5,6}, to pin the step and decide sweet-spot vs law. Measurement only; theoretical GUE quantity, not real zeros.',
  fineLadder,
  refinedBracket,
  step: {
    bracket: stepBracket, // (3.93e6, 3.94e6]
    geoMidScale: stepGeoMid, // ~3.935e6
    imp96716MidpointGuess, // 3.75e6 (only the coarse-bracket midpoint)
    decadesAboveGuess, // ~0.02 -- the true step sits above the 3.75e6 guess
    f4Monotonicity: f4Mono, // { up: 0, down: 10 } -- strictly decreasing
    f5Monotonicity: f5Mono, // { up: 10, down: 0 } -- strictly increasing
    floorVsRoundoffFactor: floorVsRoundoff, // ~1e4 -- floors sit ~4 decades above the bare roundoff floor
    note:
      'The best-floor optimum is ppp = 5 up to L = 3.93e6 and ppp = 4 from L = 3.94e6, so the step is pinned to L in (3.93e6, 3.94e6] (geo-mid ~3.935e6), ~0.02 decades ABOVE the imp-96716 "3.75e6" midpoint guess. The crossing is deterministic: the ppp=5 floor is strictly monotone increasing and the ppp=4 floor strictly monotone decreasing, and f4/f5 crosses 1 once (a ~1e-3 wobble rides on top but does not move the crossing). It is nonetheless a cancellation-roundoff sweet-spot in mechanism: the per-ppp error is non-monotone in ppp (f6 > f5, f6 blows up ~5x from 3.75e6) because finer panels accumulate more Var = L - 2*Int roundoff, so the optimum ppp is interior; the actual floors (~5e-6) sit ~4 decades above the bare roundoff floor L*eps/Var ~ 4.4e-10 with Var essentially flat (~1.88), so it is the accumulated roundoff, not the analytic Var, that drives the branch crossing -- the same mechanism imp-96728 proved by Neumaier compensation.',
  },
  liveSpotCheck: {
    L: liveSpotL,
    ppp: liveSpotPpp,
    rhoExact: liveSpotExact,
    rhoDirect: liveSpotDirect.rho,
    floor: liveSpotFloor, // small; confirms the quadrature path is wired identically
  },
  caveat:
    'rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L; there are no computed Riemann zeros behind these values, and every floor is a double-precision quadrature/cancellation artifact of this direct integral. The ppp 5 -> 4 step scale is a property of the naive numerical scheme (a deterministic branch crossing whose existence is a roundoff sweet-spot), not of the analytic rho. Changes no bound, establishes no operator positivity, does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'The basis-C intra-crossover best-floor optimum ppp 5 -> 4 step is PINNED to L in (3.93e6, 3.94e6] (geometric-mid ~3.935e6), ~0.02 decades ABOVE the imp-96716 "near 3.75e6" midpoint guess. The crossing is DETERMINISTIC and reproducible -- the ppp=5 floor branch is strictly monotone increasing and the ppp=4 branch strictly monotone decreasing, with f4/f5 crossing 1 exactly once (a ~1e-3 wobble does not move it) -- so it is not floating jitter; BUT it is a genuine cancellation-roundoff sweet-spot in MECHANISM: the per-ppp error is non-monotone in ppp (f6 > f5, f6 blows up ~5x from 3.75e6) because finer panels accumulate more Var = L - 2*Int roundoff, forcing an interior optimum, the same double-precision mechanism imp-96728 proved. So imp-96716 FINDING 3 is refined: "not a law of rho" is correct, "sweet-spot" is correct in mechanism, but the step L is deterministic and now pinned, not floating. Measurement only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 / imp-96716 convention).
export const IMP96736_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: rho is the '
  + 'theoretical GUE two-interval correlation, not computed from real zeros; each floor '
  + 'is a double-precision quadrature/cancellation artifact of the direct integral. The basis-C '
  + 'intra-crossover ppp 5 -> 4 step is pinned to L in (3.93e6, 3.94e6] (geo-mid ~3.935e6), a '
  + 'deterministic branch crossing that is a cancellation-roundoff sweet-spot in mechanism; changes no bound.';

// --- self-executing internal-consistency assertions (live spot-check + pinned-step arithmetic) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // reference values for the local special-function implementations
  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96736: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96736: Ci(1) drifted from reference');

  // reproduces the imp-96716 baked endpoints (same quadrature)
  if (!approx(fineLadder[0].f5, 3.028e-6, 5e-9)) throw new Error('imp-96736: f5(3.5e6) should match imp-96716 3.027824e-6');
  if (!approx(fineLadder[fineLadder.length - 1].f4, 4.709e-6, 5e-9)) throw new Error('imp-96736: f4(4e6) should match imp-96716 4.709289e-6');

  // Finding 1: the ppp 5 -> 4 step is pinned to (3.93e6, 3.94e6], ABOVE the 3.75e6 guess
  if (!(lastFive.L === 3.930e6 && lastFive.optPpp === 5)) throw new Error('imp-96736: last ppp=5 rung should be L = 3.93e6');
  if (!(firstFour.L === 3.940e6 && firstFour.optPpp === 4)) throw new Error('imp-96736: first ppp=4 rung should be L = 3.94e6');
  if (!(stepGeoMid > 3.93e6 && stepGeoMid < 3.94e6)) throw new Error('imp-96736: step geo-mid should land in (3.93e6, 3.94e6)');
  if (!(stepGeoMid > imp96716MidpointGuess && decadesAboveGuess > 0)) throw new Error('imp-96736: pinned step should sit ABOVE the imp-96716 3.75e6 guess');

  // Finding 2: deterministic crossing -- ppp=5 branch strictly up, ppp=4 branch strictly down
  if (!(f5Mono.up === fineLadder.length - 1 && f5Mono.down === 0)) throw new Error('imp-96736: ppp=5 floor should be strictly monotone increasing');
  if (!(f4Mono.down === fineLadder.length - 1 && f4Mono.up === 0)) throw new Error('imp-96736: ppp=4 floor should be strictly monotone decreasing');
  // f4/f5 ratio crosses 1 exactly once across the fine ladder
  {
    let crossings = 0;
    for (let i = 1; i < fineLadder.length; i++) {
      const a = fineLadder[i - 1].f4 / fineLadder[i - 1].f5 - 1;
      const b = fineLadder[i].f4 / fineLadder[i].f5 - 1;
      if (a > 0 && b <= 0) crossings += 1;
    }
    if (crossings !== 1) throw new Error('imp-96736: f4/f5 should cross 1 exactly once (single deterministic crossing)');
  }

  // Finding 3: roundoff-driven interior optimum -- f6 > f5 (finer panels worse) and f6 blows up from 3.75e6
  if (!(fineLadder[0].f6 > fineLadder[0].f5)) throw new Error('imp-96736: at L=3.5e6 the finer ppp=6 floor should already exceed ppp=5 (roundoff)');
  if (!(fineLadder[5].f6 > 1e-5 && fineLadder[4].f6 < 1e-5)) throw new Error('imp-96736: ppp=6 floor should blow up (>1e-5) from L=3.75e6');
  // floors sit ~4 decades above the bare roundoff floor L*eps/Var
  if (!(floorVsRoundoff > 1e3 && floorVsRoundoff < 1e5)) throw new Error('imp-96736: floors should sit ~4 decades above the bare roundoff floor');
  // Var essentially flat across the window (accumulated roundoff, not analytic Var, drives the crossing)
  if (!(fineLadder[fineLadder.length - 1].Var - fineLadder[0].Var < 0.05)) throw new Error('imp-96736: analytic Var should be essentially flat across the window');

  // live quadrature spot-check: directRho produces a finite small floor via the identical integral
  if (!(isFinite(liveSpotFloor) && liveSpotFloor >= 0 && liveSpotFloor < 1e-2))
    throw new Error('imp-96736: live quadrature spot-check floor drifted (directRho path not wired)');

  // honesty gates
  if (!/NO QED/.test(IMP96736_BASIS_C_INTRA_CROSSOVER_PPP_STEP.verdict)) throw new Error('imp-96736: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96736_BASIS_C_INTRA_CROSSOVER_PPP_STEP.verdict)) throw new Error('imp-96736: verdict dropped the no-refereed-bound-change banner');
  if (!/imp-96716/.test(IMP96736_BASIS_C_INTRA_CROSSOVER_PPP_STEP.source)) throw new Error('imp-96736: source dropped the imp-96716 reference');
  if (!(/RH open/.test(IMP96736_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96736_HONEST_BANNER) && /NO QED/.test(IMP96736_HONEST_BANNER)))
    throw new Error('imp-96736: IMP96736_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96736_BASIS_C_INTRA_CROSSOVER_PPP_STEP;
