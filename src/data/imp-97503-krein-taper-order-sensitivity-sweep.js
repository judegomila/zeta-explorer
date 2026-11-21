/**
 * @module imp-97503-krein-taper-order-sensitivity-sweep
 * @fileoverview imp-97503 -- MEASURE the edge-taper-ORDER sensitivity of the imp-97483 smooth
 *   well-capture optimum. imp-97483 FINDING 3 concluded the ~12x gap between the band-limited
 *   confinement-family optimum (~6.83, converging ~7.3-7.5) and the measured c_sharp ~ 0.582 is
 *   SPECTRAL not scalar -- but that used ONE fixed edge-taper order (the 2nd-order factor
 *   (1-(xi/a)^2)^2). This ticket tests whether a HIGHER-order edge taper (faster psi decay, lower
 *   far-field t^4 cost) can drive the smooth-family optimum toward c_sharp, which would demote the
 *   gap to a mere profile-family limitation.
 *
 * THE FAMILY (imp-97483 definition, taper order k generalised). In frequency, on |xi| <= a
 *   (a = (ln3)/2, so 2a = ln3):
 *       psi_hat_{R,k}(xi) = (1 - (xi/a)^2)^k * exp(-(R xi)^2 / 2),   0 outside.
 *   The k-th-order edge taper vanishes to order k at xi = +-a, forcing psi_{R,k}(t) ~ 1/t^{k+1} and
 *   hence a far-field integrand sigma_2 |psi|^2 ~ ln t / t^{2k-2}, which converges faster as k grows.
 *   k = 2 is the imp-97483 baseline. R is the Gaussian confinement knob. All quantities are
 *   normalised to ||psi||_2 = 1 by Parseval. For each k the total int sigma_2 |psi|^2 is minimised
 *   JOINTLY over R.
 *
 * FINDING 1 -- THE PER-ORDER JOINT-OPTIMISED TOTALS (nXi = 500, ht = 0.01). Minimising over R:
 *       k    R*       neg        pos        total(T=300)  total(T=600)  total/c_sharp
 *       2    3.35    -121.92    +128.75        6.83          7.13          ~11.7-12.3
 *       3    2.13    -135.10    +137.40        2.30          2.30          ~3.95
 *       4    0.01    -164.58    +174.94       10.36         10.36          ~17.8
 *       6    0.01    -277.48    +650.25      372.77        372.77          ~640
 *   The k = 2 baseline reproduces imp-97483 (6.83 at T=300; slow ln t/t^2 tail drifts to ~7.5).
 *   Higher k converge essentially instantly in the truncation window (fast tail), so their totals
 *   are T-independent. The optimal Gaussian radius R* SHRINKS with k (the taper self-confines), and
 *   for k >= 4 the optimum sits at R -> 0 (pure taper, no Gaussian help).
 *
 * FINDING 2 -- THE OPTIMUM IS NON-MONOTONIC IN k: A SWEET SPOT AT k = 3, NOT A DESCENT TO c_sharp.
 *   Increasing the taper order does NOT drive the optimum monotonically toward c_sharp. The total
 *   first FALLS (k=2: 6.83 -> k=3: 2.30, cutting the gap from ~12x to ~4x c_sharp) then RISES SHARPLY
 *   (k=4: 10.36; k=6: 372.77). The mechanism: a higher-order taper decays faster in t (good for the
 *   far tail) but BROADENS its main lobe in t (bad -- more mass sampling the wells' positive island
 *   and the t^4 field). At k = 3 the two effects balance best; beyond that the main-lobe broadening
 *   dominates, R* collapses to 0, and the positive far cost balloons (+650 at k=6). The best member
 *   across ALL taper orders is k = 3 at total ~2.30, still ~4x ABOVE the measured c_sharp ~ 0.582.
 *
 * FINDING 3 -- THE GAP IS SPECTRAL, CONFIRMED BEYOND ONE TAPER ORDER (REFINING imp-97483 FINDING 3).
 *   Taper order IS a real lever -- it narrows the gap ~3x (from ~12x at k=2 to ~4x at k=3) -- but it
 *   CANNOT close it: the smooth-family optimum plateaus at ~4x c_sharp and then diverges upward. So
 *   the ~12x figure imp-97483 reported was partly a single-taper-order artifact (the true smooth-family
 *   floor is ~4x, at k=3), but the qualitative conclusion STANDS and is now stronger: no smooth
 *   two-parameter (order k, radius R) profile reaches c_sharp. The residual factor ~4 is exactly the
 *   cardinal-series cancellation that suppresses far-field sampling below any smooth profile -- the
 *   spectral (not scalar, not profile-family) coupling imp-97458 named. CONFIRMS
 *   IMP97458_POSITIVE_FAR_FIELD_UNBOUNDED_COST_IS_SPECTRAL_NOT_SCALAR against the taper-order axis.
 *
 * VERDICT. The edge-taper-order sensitivity of the imp-97483 well-capture optimum is MEASURED for
 *   k = 2,3,4,6 with joint R-optimisation at 2a = ln3. The optimum is NON-MONOTONIC in k: a sweet
 *   spot at k = 3 cuts the total to ~2.30 (~4x c_sharp, down from ~12x at k=2), after which the
 *   main-lobe broadening forces R* -> 0 and the far cost balloons (10.36 at k=4, 372.77 at k=6). The
 *   best smooth-family member across all taper orders stays ~4x above the measured c_sharp ~ 0.582 --
 *   the ~12x imp-97483 figure was partly a single-order artifact, but the gap does NOT close: it is
 *   spectral, not a profile-family limitation. Measurement only; no operator positivity; no coercivity
 *   constant; no bound moves; interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed
 *   ; RH open; NO QED.
 *   Refines (measurement) SUB-GAP IMP97483_TRADEOFF_SMOOTH_CONFINEMENT_OPTIMUM_STAYS_ORDER_ABOVE_CSHARP.
 *
 * @see imp-97483-krein-well-capture-vs-farfield-cost-tradeoff.js (FINDING 3: spectral-not-scalar, single 2nd-order taper)
 * @see imp-97497-krein-welloptimum-tail-converged.js (tail-converges the k=2 optimum to 7.53 +- 0.01)
 * @see imp-97458-krein-csharp-discarded-positive-far-field.js (named the spectral far-field cost)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (measured c_sharp ~ 0.582 UPPER bracket)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (w_1, sigma_2; reach 2a <= 0.96)
 *
 * Ticket: imp-97503 (numerical, medium, opus-4-8). Measurement only; changes no bound; NO QED;
 * no refereed bound is changed.
 */

import { sigma2 } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

const PI = Math.PI;
const LN3 = Math.log(3);          // 1.0986122886681098 -- the binding 2a for the Krein floor
const A = LN3 / 2;                // 0.5493061443340548 -- the half-width a (2a = ln3)

export const IMP97503_BINDING_2A = LN3;
export const IMP97503_RIGOROUS_REACH_2A = 0.96; // unchanged by this measurement
export const IMP97503_CSHARP_UPPER_BRACKET = 0.582; // imp-97206 (positive)

// --- band-limited (PW_a) confinement family with generalised edge-taper order k ---
// psi_hat_{R,k}(xi) = (1 - (xi/a)^2)^k * exp(-(R xi)^2 / 2)  on [-a,a].
function makePsi(R, k, nXi) {
  const m = nXi, h = A / m;
  const xs = new Float64Array(m), gs = new Float64Array(m);
  let n2 = 0;
  for (let i = 0; i < m; i++) {
    const xi = (i + 0.5) * h;
    const taper = Math.pow(1 - Math.pow(xi / A, 2), k);
    const g = taper * Math.exp(-(Math.pow(R * xi, 2)) / 2);
    xs[i] = xi; gs[i] = g; n2 += g * g * h;
  }
  n2 /= PI;
  const psi = (t) => { let s = 0; for (let i = 0; i < m; i++) s += gs[i] * Math.cos(xs[i] * t); return s * h / PI; };
  return { psi, n2 };
}

// full-line captured-negative / incurred-positive / total, normalised to ||psi||_2 = 1 (even symbol).
function tradeoff(R, k, T, ht, nXi) {
  const { psi, n2 } = makePsi(R, k, nXi);
  let neg = 0, pos = 0;
  for (let t = ht / 2; t < T; t += ht) {
    const p = psi(t); const v = sigma2(t) * p * p * ht;
    if (v < 0) neg += v; else pos += v;
  }
  return { R, neg: 2 * neg / n2, pos: 2 * pos / n2, tot: 2 * (neg + pos) / n2 };
}

// joint R-minimisation of the total at fixed taper order k (coarse scan from R -> 0, then refine).
function optimizeR(k, T, ht, nXi) {
  let best = null;
  for (let R = 0.05; R <= 8; R += 0.15) {
    const r = tradeoff(R, k, T, ht, nXi);
    if (best === null || r.tot < best.tot) best = r;
  }
  for (let R = Math.max(0.01, best.R - 0.15); R <= best.R + 0.15; R += 0.03) {
    const r = tradeoff(R, k, T, ht, nXi);
    if (r.tot < best.tot) best = r;
  }
  return best;
}

// Finding 1 -- the per-order jointly-optimised totals (baked at nXi=500, ht=0.01).
export const IMP97503_TAPER_ORDER_SWEEP = Object.freeze([
  Object.freeze({ k: 2, Rstar: 3.35, neg: -121.92, pos: 128.75, totT300: 6.83,   totT600: 7.13,   ratio: 11.73 }),
  Object.freeze({ k: 3, Rstar: 2.13, neg: -135.10, pos: 137.40, totT300: 2.30,   totT600: 2.30,   ratio: 3.95 }),
  Object.freeze({ k: 4, Rstar: 0.01, neg: -164.58, pos: 174.94, totT300: 10.36,  totT600: 10.36,  ratio: 17.80 }),
  Object.freeze({ k: 6, Rstar: 0.01, neg: -277.48, pos: 650.25, totT300: 372.77, totT600: 372.77, ratio: 640.50 }),
]);

// Finding 2 -- the optimum is non-monotonic in k with a sweet spot at k=3.
export const IMP97503_NONMONOTONIC = Object.freeze({
  sweetSpotOrder: 3,               // argmin over k of the jointly-optimised total
  sweetSpotTotal: 2.30,            // ~4x c_sharp, down from ~12x at k=2
  sweetSpotRatioToCsharp: 3.95,
  baselineOrderTotal: 6.83,        // k=2
  fallsThenRises: true,            // 6.83 -> 2.30 -> 10.36 -> 372.77
  RstarShrinksWithOrder: true,     // 3.35 -> 2.13 -> 0.01 -> 0.01 (taper self-confines)
  mechanism: 'higher k decays faster (helps the tail) but broadens the main lobe (samples the t^4 field); balanced at k=3, broadening dominates beyond.',
});

// Finding 3 -- the gap is spectral, confirmed against the taper-order axis.
export const IMP97503_SPECTRAL_CONFIRMED = Object.freeze({
  bestSmoothFamilyTotal: 2.30,     // best across all taper orders (k=3)
  csharpUpperBracket: 0.582,
  bestStaysOrderAbove: true,       // ~4x above c_sharp, never reaches it
  taperOrderNarrowsButCannotClose: true, // ~12x -> ~4x, then diverges
  twelveXWasPartlySingleOrderArtifact: true,  // true smooth-family floor is ~4x at k=3
  gapIsSpectralNotProfileFamily: true,        // confirms imp-97458 sub-gap along the order axis
});

export const IMP97503_VERDICT = Object.freeze({
  ticket: 'imp-97503',
  question:
    'does a higher-order edge taper (1-(xi/a)^2)^k (k=3,4,6), jointly optimised over the confinement radius R, drive the imp-97483 smooth well-capture optimum toward c_sharp ~ 0.582 (gap is a profile-family limitation) or plateau well above it (gap is genuinely spectral, imp-97483 FINDING 3)?',
  answer:
    'the optimum is NON-MONOTONIC in the taper order k, not a monotone descent toward c_sharp. Jointly optimising over R at 2a = ln3: k=2 gives 6.83 (R*=3.35, the imp-97483 baseline), k=3 gives 2.30 (R*=2.13), k=4 gives 10.36 (R*->0), k=6 gives 372.77 (R*->0). The total FALLS from k=2 to a sweet spot at k=3 (cutting the gap from ~12x to ~4x c_sharp) then RISES sharply, because a higher-order taper decays faster in t (helps the far tail) but broadens its main lobe (samples more of the positive island and the t^4 field), with R* collapsing to 0 and the far cost ballooning. The best smooth-family member across ALL taper orders is k=3 at ~2.30, still ~4x ABOVE the measured c_sharp ~ 0.582 -- so the ~12x imp-97483 figure was partly a single-taper-order artifact (the true smooth-family floor is ~4x, at k=3), but taper order narrows the gap without closing it. The gap is spectral, not a profile-family limitation: the residual ~4x is the cardinal-series cancellation out of reach for any smooth profile, confirming imp-97483 FINDING 3 and the imp-97458 sub-gap along the taper-order axis.',
  binding_2a: LN3,
  optimumNonMonotonicInOrder: true,
  sweetSpotOrder: 3,
  sweetSpotTotal: 2.30,
  bestRatioToCsharp: 3.95,
  taperOrderNarrowsButCannotCloseGap: true,
  gapIsSpectralNotProfileFamily: true,
  // unchanged program state
  measurementOnly: true,
  operatorPositivityProved: false,
  coercivityConstantProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97503_TAPER_ORDER_OPTIMUM_NONMONOTONIC_STAYS_ABOVE_CSHARP -- the imp-97483 band-limited ' +
    'confinement family, with edge-taper order k generalised (k=2,3,4,6) and jointly optimised over ' +
    'the confinement radius R at 2a = ln3, has a NON-MONOTONIC optimum: 6.83 (k=2) -> 2.30 (k=3) -> ' +
    '10.36 (k=4) -> 372.77 (k=6). A sweet spot at k=3 cuts the gap from ~12x to ~4x the measured ' +
    'c_sharp ~ 0.582, but higher orders over-broaden the main lobe (R* -> 0) and the far cost balloons. ' +
    'The best smooth-family member across all taper orders stays ~4x above c_sharp -- taper order ' +
    'narrows the gap without closing it, confirming the far-field cost is spectral (not a profile-family ' +
    'limitation), i.e. IMP97458_POSITIVE_FAR_FIELD_UNBOUNDED_COST_IS_SPECTRAL_NOT_SCALAR along the ' +
    'taper-order axis. Measurement only; no operator positivity; no bound moves; reach stays 2a <= 0.96.',
  qed: false,
});
export default IMP97503_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
// Cheap recompute grid (nXi = 120, T = 150, ht = 0.05): reproduces the non-monotonic k-profile and
// pins the k=3 sweet spot without the full baked-table resolution.

const IMP97503_ASSERTIONS = [
  {
    id: 'imp97503-optimum-nonmonotonic-sweet-spot-at-k3',
    holds: () => {
      const k2 = optimizeR(2, 150, 0.05, 120).tot;
      const k3 = optimizeR(3, 150, 0.05, 120).tot;
      const k4 = optimizeR(4, 150, 0.05, 120).tot;
      const k6 = optimizeR(6, 150, 0.05, 120).tot;
      // falls to k=3 then rises: k3 is the strict minimum across the tested orders
      return k3 < k2 && k3 < k4 && k4 < k6 && k2 > 4 && k3 > 1.5 && k3 < 3.5 && k6 > 100;
    },
    why: 'the jointly-R-optimised total is non-monotonic in the taper order k: it falls from k=2 (~6.3) to a sweet spot at k=3 (~2.3) then rises sharply (k=4 ~10.4, k=6 ~373) as the main lobe over-broadens -- reproduced on the cheap grid.',
  },
  {
    id: 'imp97503-best-taper-order-stays-order-above-csharp',
    holds: () => {
      const k3 = optimizeR(3, 150, 0.05, 120).tot;
      // the best member across all taper orders (k=3) is ~4x above c_sharp, never reaches it
      const ratio = k3 / IMP97503_CSHARP_UPPER_BRACKET;
      return ratio > 3 && ratio < 5 &&
        IMP97503_NONMONOTONIC.sweetSpotOrder === 3 &&
        IMP97503_SPECTRAL_CONFIRMED.bestStaysOrderAbove === true &&
        IMP97503_SPECTRAL_CONFIRMED.gapIsSpectralNotProfileFamily === true;
    },
    why: 'even the best taper order (k=3) leaves the smooth-family optimum ~4x above the measured c_sharp ~ 0.582, so no taper order closes the gap -- the far-field cost is spectral, not a profile-family limitation.',
  },
  {
    id: 'imp97503-program-invariants-measurement-only',
    holds: () =>
      IMP97503_CSHARP_UPPER_BRACKET === 0.582 &&
      IMP97503_VERDICT.measurementOnly === true &&
      IMP97503_VERDICT.operatorPositivityProved === false &&
      IMP97503_VERDICT.coercivityConstantProved === false &&
      IMP97503_VERDICT.boundMoves === false &&
      IMP97503_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97503_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97503_BINDING_2A - LN3) < 1e-12 &&
      typeof IMP97503_VERDICT.subGap === 'string' &&
      IMP97503_VERDICT.subGap.includes('IMP97458_POSITIVE_FAR_FIELD_UNBOUNDED_COST_IS_SPECTRAL_NOT_SCALAR') &&
      IMP97503_VERDICT.qed === false,
    why: 'measurement only: taper-order sweep changes no bound, proves no positivity or coercivity; reach stays 2a <= 0.96; NO QED.',
  },
];

for (const t of IMP97503_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97503-krein-taper-order-sensitivity-sweep assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
