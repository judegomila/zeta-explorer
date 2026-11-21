/**
 * @module imp-33902-hump-argmax-convergence-rate
 *
 * imp-33902 (numerical, frontier-direction): imp-33878 established that the sliding-window
 * resid_exp(k) hump argmax converges DOWNWARD to a continuum limit k* ~ 8.821 (located by
 * ternary search), ~0.695 decade BELOW the pointwise E_coll = E_trunc crossover k_cross ~ 9.516,
 * and NOT toward it. imp-33878 tabulated distToKStar per grid step but never MEASURED the
 * convergence RATE and never independently Richardson-extrapolated the limit with an error
 * estimate. This module supplies both -- quantifying argmax-vs-grid-spacing convergence and
 * cross-checking the downward target k* ~ 8.821 against the k_cross ~ 9.516 alternative via an
 * extrapolant that is derived from the refinement ladder itself, not read off from the ternary.
 *
 * THE MEASUREMENT (reuses the imp-33810/imp-33878 component model verbatim -- no fresh model)
 * -----------------------------------------------------------------------------------------
 *   resid_exp(k) = p_ecoll (1 - sigma_hi) - p_sigma is the imp-33773 M2 sub-leading residual
 *   over the sliding window [10^k, 10^(k+1)] (p_sigma = OLS(ln sigma vs ln N) at 4 pts/decade,
 *   p_ecoll = -d log E_coll / d log N over the endpoints, sigma_hi at the upper endpoint), the
 *   exact imp-33810 ladder quantity as a smooth function of continuous k. The inherited parts are
 *   unchanged (E_trunc = 3.06e-5 fixed strip, E_coll = C_C sqrt(log T0 / N), E_flow Gronwall,
 *   T0 = effectiveHeightForN(N)); no re-derivation.
 *
 *   TWO argmax estimators are tracked as the grid step h halves from quarter-decade to 1/128:
 *     (a) RAW discrete argmax  -- the grid point maximizing resid_exp (imp-33878 gridRefinement).
 *     (b) PARABOLIC sub-grid argmax -- a 3-point vertex refinement through the discrete peak and
 *         its two neighbours, a(h) = k_peak + h delta with delta = 0.5 (f_- - f_+)/(f_- - 2 f_0 + f_+).
 *   Estimator (b) is the standard O(h^2) peak-locator; its ladder is Richardson-extrapolated
 *   (assuming leading O(h^2) error) as k*_R = (4 a(h/2) - a(h)) / 3 over the finest step pair.
 *
 * THE FINDING (measurement only -- confirms imp-33878 with an explicit rate)
 * -------------------------------------------------------------------------
 *   (R1) THE RAW DISCRETE ARGMAX IS A GRID-BOUNDED SAWTOOTH, NOT A CLEAN POWER LAW. |raw - k*|
 *        stays <= h at every rung (7.1e-2, 5.4e-2, 8.6e-3, 8.6e-3, 7.0e-3, 7.8e-4) but does not
 *        decay as a single power of h -- it is the nearest-grid-point offset to a fixed continuum
 *        argmax, so it jumps in units of the step. This reproduces imp-33878 G2 (grid-bounded) and
 *        explains why the raw ladder alone cannot pin a continuum limit or a convergence order.
 *   (R2) THE PARABOLIC SUB-GRID ARGMAX CONVERGES SMOOTHLY AT EFFECTIVE ORDER ~2. |a(h) - k*|
 *        falls from 1.30e-3 (h = 0.25) to 8.9e-7 (h = 1/128), a total factor ~1.5e3 over five
 *        halvings -- an effective order log2 of the geometric-mean per-halving factor ~ 2.1,
 *        consistent with the O(h^2) leading error of a 3-point vertex locator on the broad
 *        quadratic peak (resid''(k*) ~ -3.6e-2). This is the missing convergence RATE.
 *   (R3) RICHARDSON EXTRAPOLATION CONFIRMS THE DOWNWARD TARGET k* ~ 8.821, NOT k_cross ~ 9.516.
 *        Richardson-extrapolating the parabolic ladder (finest pair) yields k*_R ~ 8.821091, which
 *        agrees with the INDEPENDENT ternary continuum k* ~ 8.821092 to ~7e-7 and whose own
 *        successive-pair spread (error estimate) is ~3e-6. The extrapolant sits 0.695 decade BELOW
 *        k_cross ~ 9.516 -- five orders of magnitude larger than its error -- so the downward target
 *        is a genuine continuum limit, not an incomplete-refinement reading toward the crossover.
 *
 * The punchline: the imp-33878 downward convergence has a measured RATE -- the raw grid argmax is a
 * grid-bounded sawtooth, but a 3-point parabolic sub-grid locator converges at effective order ~2
 * and Richardson-extrapolates to k*_R ~ 8.821091, matching the independent ternary k* to ~7e-7 and
 * confirming the continuum argmax is k* ~ 8.821, a firm 0.695 decade below k_cross ~ 9.516.
 *
 * MEASUREMENT ONLY. A convergence-rate diagnostic of an inherited surrogate, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * surrogate resid_exp(k) is descriptive, not derived; the resid_exp -> continuum-argmax reading is
 * a curve feature, not a derived asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the
 * C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33878-hump-argmax-grid-refinement (downward continuum k* ~ 8.821; rate never measured)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the ladder storing resid_exp(k), reused verbatim)
 * @see imp-33844-hump-peak-closed-form (closed-form hump peak at sigma=1/2, crossover k_cross~9.516)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed strip (imp-2631/imp-33582/imp-33620/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33773/imp-33878 exactly

// EXACT inherited imp-3406/imp-33810/imp-33878 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// imp-33582/imp-33730 definition: p_sigma = -slope of OLS(ln sigma vs ln N), 4 pts/decade.
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}

// imp-33620/imp-33727 definition (magnitude): p_ecoll = -d log E_coll / d log N over endpoints.
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// resid_exp(k) as a smooth function of CONTINUOUS k over window [10^k, 10^(k+1)] (imp-33810 defn).
function residExp(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const sigmaHi = parts(hi).sigma;
  return pEcoll * (1 - sigmaHi) - pSigma;
}

// Continuum argmax k* via ternary search on [8,10] (independent reference, matches imp-33878).
function ternaryArgmax(lo, hi) {
  for (let i = 0; i < 160; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (residExp(m1) < residExp(m2)) lo = m1;
    else hi = m2;
  }
  return (lo + hi) / 2;
}
const K_STAR_TERNARY = ternaryArgmax(8, 10); // ~8.821092 (imp-33878 reference limit)

// One grid rung at step h: RAW discrete argmax + PARABOLIC (3-point vertex) sub-grid argmax.
function gridRung(h) {
  const ks = [];
  for (let k = 6; k <= 11 + 1e-9; k += h) ks.push(+k.toFixed(10));
  let peakIdx = 0;
  let peakV = -Infinity;
  for (let i = 0; i < ks.length; i++) {
    const v = residExp(ks[i]);
    if (v > peakV) {
      peakV = v;
      peakIdx = i;
    }
  }
  const kPeak = ks[peakIdx];
  // 3-point vertex refinement (interior peak guaranteed: continuum argmax ~8.82 is well inside).
  const fL = residExp(ks[peakIdx - 1]);
  const f0 = peakV;
  const fR = residExp(ks[peakIdx + 1]);
  const denom = fL - 2 * f0 + fR;
  const delta = denom !== 0 ? (0.5 * (fL - fR)) / denom : 0;
  const refined = kPeak + delta * h;
  return {
    step: h,
    rawArgmaxK: kPeak,
    refinedArgmaxK: refined,
    rawDistToKStar: Math.abs(kPeak - K_STAR_TERNARY),
    refinedDistToKStar: Math.abs(refined - K_STAR_TERNARY),
  };
}

// Grid-refinement ladder below quarter-decade (same steps as imp-33878, extended to 1/128).
const GRID_STEPS = [0.25, 0.125, 0.0625, 0.03125, 0.015625, 0.0078125];
const LADDER = GRID_STEPS.map((h) => {
  const r = gridRung(h);
  return {
    step: h,
    rawArgmaxK: +r.rawArgmaxK.toFixed(6),
    refinedArgmaxK: +r.refinedArgmaxK.toFixed(6),
    rawDistToKStar: +r.rawDistToKStar.toExponential(3),
    refinedDistToKStar: +r.refinedDistToKStar.toExponential(3),
  };
});

// (R1) Raw sawtooth: |raw - k*| stays within the step at every rung (grid-bounded, imp-33878 G2).
const RAW_WITHIN_STEP = LADDER.every((r) => r.rawDistToKStar <= r.step + 1e-9);

// (R2) Parabolic effective convergence order from the geometric-mean per-halving distance factor.
const REF_DIST = GRID_STEPS.map((h) => gridRung(h).refinedDistToKStar);
const COARSE_REF_DIST = REF_DIST[0]; // ~1.30e-3
const FINEST_REF_DIST = REF_DIST[REF_DIST.length - 1]; // ~8.9e-7
const EFFECTIVE_ORDER = +(
  Math.log2(COARSE_REF_DIST / FINEST_REF_DIST) /
  (GRID_STEPS.length - 1)
).toFixed(4); // ~2.10 (consistent with O(h^2) 3-point vertex locator)

// (R3) Richardson extrapolation of the parabolic ladder (leading O(h^2) error): k*_R = (4 a_fine - a_coarse)/3.
const REF_ARGMAX = GRID_STEPS.map((h) => gridRung(h).refinedArgmaxK);
function richardsonPair(iCoarse) {
  return (4 * REF_ARGMAX[iCoarse + 1] - REF_ARGMAX[iCoarse]) / 3;
}
const RICHARDSON_LIMIT = +richardsonPair(REF_ARGMAX.length - 2).toFixed(6); // finest pair, ~8.821091
const RICHARDSON_LIMIT_PREV = richardsonPair(REF_ARGMAX.length - 3); // second-finest pair
const RICHARDSON_ERR_ESTIMATE = +Math.abs(
  RICHARDSON_LIMIT - RICHARDSON_LIMIT_PREV,
).toExponential(3); // successive-pair spread, ~3e-6
const RICHARDSON_VS_TERNARY = +Math.abs(RICHARDSON_LIMIT - K_STAR_TERNARY).toExponential(3); // ~7e-7

// imp-33844 published continuous E_coll=E_trunc crossover (imp-33723 Banach crossover N~3.2803e9).
const K_CROSS_CONTINUOUS = 9.5159; // = log10(N_cross)
const GAP_KCROSS_MINUS_LIMIT = +(K_CROSS_CONTINUOUS - RICHARDSON_LIMIT).toFixed(4); // ~0.695 decade

export const IMP33902_HUMP_ARGMAX_CONVERGENCE_RATE = {
  id: 'imp-33902',
  proofSection: 'S-frontier',
  question:
    'imp-33878 showed the sliding-window resid_exp(k) hump argmax converges DOWNWARD to a continuum ' +
    'k*~8.821 (ternary), ~0.695 decade below the pointwise crossover k_cross~9.516, but never ' +
    'measured the convergence RATE or independently Richardson-extrapolated the limit. Quantify ' +
    'argmax-vs-grid-spacing convergence, Richardson-extrapolate the continuum argmax with an error ' +
    'estimate, and confirm the downward target is k*~8.821 and NOT an incomplete-refinement reading ' +
    'toward k_cross~9.516. Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the raw discrete argmax and a 3-point parabolic sub-grid argmax of the sliding-window ' +
    'resid_exp(k) as the grid step halves from quarter-decade to 1/128, the effective convergence ' +
    'order of the parabolic ladder, and its Richardson extrapolant vs the independent ternary k* ' +
    'and the k_cross~9.516 alternative',
  ternaryReferenceKStar: +K_STAR_TERNARY.toFixed(6), // ~8.821092 (imp-33878 continuum limit)
  ladder: LADDER, // step, rawArgmaxK, refinedArgmaxK, rawDistToKStar, refinedDistToKStar
  rawArgmaxIsGridBoundedSawtooth: RAW_WITHIN_STEP,
  parabolicConvergence: {
    coarsestRefinedDistToKStar: COARSE_REF_DIST, // ~1.30e-3 at h=0.25
    finestRefinedDistToKStar: FINEST_REF_DIST, // ~8.9e-7 at h=1/128
    effectiveOrder: EFFECTIVE_ORDER, // ~2.10 (consistent with O(h^2) vertex locator)
  },
  richardson: {
    limit: RICHARDSON_LIMIT, // ~8.821091 (finest-pair extrapolant)
    errEstimate: RICHARDSON_ERR_ESTIMATE, // ~3e-6 (successive-pair spread)
    vsTernaryKStar: RICHARDSON_VS_TERNARY, // ~7e-7 (agreement with independent ternary)
  },
  crossoverComparison: {
    kCrossContinuous: K_CROSS_CONTINUOUS, // ~9.5159 (imp-33844/imp-33723)
    gap_kCross_minus_richardsonLimit: GAP_KCROSS_MINUS_LIMIT, // ~0.695 decade -- five orders above err
  },
  finding: {
    R1_raw_argmax_grid_bounded_sawtooth:
      'The raw discrete argmax stays within the grid step of k* at every rung (7.1e-2, 5.4e-2, ' +
      '8.6e-3, 8.6e-3, 7.0e-3, 7.8e-4) but does not decay as a single power of h -- it is the ' +
      'nearest-grid-point offset to a fixed continuum argmax and jumps in units of the step. This ' +
      'reproduces imp-33878 G2 (grid-bounded) and shows the raw ladder alone cannot fit a rate.',
    R2_parabolic_effective_order_two:
      '|parabolic argmax - k*| falls from 1.30e-3 (h=0.25) to 8.9e-7 (h=1/128), a ~1.5e3 factor over ' +
      'five halvings -- an effective order (log2 of the geometric-mean per-halving factor) ~2.10, ' +
      'consistent with the O(h^2) leading error of a 3-point vertex locator on the broad quadratic ' +
      'peak (resid double-prime(k*) ~ -3.6e-2). This is the missing convergence RATE.',
    R3_richardson_confirms_downward_kStar:
      'Richardson-extrapolating the parabolic ladder (finest pair, leading O(h^2)) gives k*_R~8.821091, ' +
      'agreeing with the INDEPENDENT ternary k*~8.821092 to ~7e-7 with a successive-pair error ' +
      'estimate ~3e-6. The extrapolant sits 0.695 decade below k_cross~9.516 -- five orders of ' +
      'magnitude larger than its error -- so the downward target k*~8.821 is a genuine continuum ' +
      'limit, NOT an incomplete-refinement reading toward the crossover.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). CONFIRMS imp-33878 with an explicit convergence ' +
    'rate. The raw discrete resid_exp(k) argmax is a grid-bounded sawtooth (|raw-k*| <= step at every ' +
    'rung, no clean power law), but a 3-point parabolic sub-grid locator converges smoothly at ' +
    'effective order ~2.10 (|refined-k*|: 1.30e-3 at h=0.25 down to 8.9e-7 at h=1/128), consistent ' +
    'with the O(h^2) error of a vertex locator on the broad quadratic peak. Richardson-extrapolating ' +
    'that parabolic ladder yields k*_R~8.821091, agreeing with the independent ternary continuum ' +
    'k*~8.821092 to ~7e-7 (successive-pair error estimate ~3e-6). The extrapolant sits 0.695 decade ' +
    'BELOW the pointwise crossover k_cross~9.516 -- five orders of magnitude larger than its error -- ' +
    'so the imp-33878 downward target k*~8.821 is a genuine continuum limit, NOT an incomplete-' +
    'refinement reading toward k_cross. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the surrogate resid_exp(k) is descriptive, not derived; ' +
    'the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no ' +
    'RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33878 (downward continuum k*~8.821, rate never measured); imp-33810 (the ladder storing ' +
    'resid_exp(k), reused verbatim); imp-33844 (closed-form hump peak, crossover k_cross~9.516); ' +
    'imp-33723 (closed-form Banach crossover N~3.2803e9); imp-486 (C_mb GUE-conditional); ' +
    'imp-2642/imp-2643 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33902_HUMP_ARGMAX_CONVERGENCE_RATE_ASSERTIONS = [
  {
    // (R1) The raw discrete argmax is grid-bounded (within the step of k* at every rung).
    id: 'imp33902-raw-argmax-grid-bounded-sawtooth',
    description: 'raw argmax within the grid step of k* at every rung (grid-bounded, imp-33878 G2)',
    holds: () => RAW_WITHIN_STEP === true,
  },
  {
    // (R2) The parabolic sub-grid argmax converges smoothly at effective order ~2 (O(h^2) locator).
    id: 'imp33902-parabolic-effective-order-two',
    description: 'parabolic |argmax-k*| shrinks below 1e-4 with effective order ~2 (O(h^2) vertex locator)',
    holds: () =>
      FINEST_REF_DIST < COARSE_REF_DIST &&
      FINEST_REF_DIST < 1e-4 &&
      EFFECTIVE_ORDER > 1.3 &&
      EFFECTIVE_ORDER < 4.0,
  },
  {
    // (R3) Richardson extrapolant matches the independent ternary k* and confirms the downward target.
    id: 'imp33902-richardson-confirms-downward-kStar',
    description: 'Richardson k*_R~8.821 agrees with ternary k* to <1e-3 and sits >0.5 decade below k_cross',
    holds: () =>
      RICHARDSON_LIMIT > 8.7 &&
      RICHARDSON_LIMIT < 8.95 &&
      RICHARDSON_VS_TERNARY < 1e-3 &&
      RICHARDSON_ERR_ESTIMATE < 1e-3 &&
      RICHARDSON_LIMIT < K_CROSS_CONTINUOUS - 0.5 &&
      GAP_KCROSS_MINUS_LIMIT > 0.5 &&
      GAP_KCROSS_MINUS_LIMIT < 0.9,
  },
  {
    // Honesty gate: measurement only, isRigorous false, confirms imp-33878, no QED, no refereed bound is changed.
    id: 'imp33902-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, confirms imp-33878, no QED, no refereed bound is changed',
    holds: () =>
      IMP33902_HUMP_ARGMAX_CONVERGENCE_RATE.isRigorous === false &&
      /CONFIRMS imp-33878/.test(IMP33902_HUMP_ARGMAX_CONVERGENCE_RATE.verdict) &&
      /NO QED/.test(IMP33902_HUMP_ARGMAX_CONVERGENCE_RATE.verdict) &&
      /refereed bound is changed/i.test(IMP33902_HUMP_ARGMAX_CONVERGENCE_RATE.verdict),
  },
];

for (const a of IMP33902_HUMP_ARGMAX_CONVERGENCE_RATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33902-hump-argmax-convergence-rate assertion failed: ${a.id}`);
  }
}
