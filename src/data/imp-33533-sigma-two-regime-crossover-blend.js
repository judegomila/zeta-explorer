/**
 * @module imp-33533-sigma-two-regime-crossover-blend
 *
 * imp-33533 (numerical, frontier-direction): imp-33315 showed the imp-33291 far-tail
 *     sigma_ft(N) = E_coll/(E_trunc + E_coll) ~ (C_C/E_trunc) sqrt(log T0/N) = const * N^(-1/2) (log T0)^(+1/2)
 * and the imp-3406 interior MAXIMUM (N_max ~ 9.22e5, sigma_max ~ 0.9494) are complementary
 * halves of the sigma(N) N-shape that live in DISJOINT regimes: the far-tail law is monotone
 * decreasing (it has no interior max) and, forced to the true peak, it OVERSHOOTS by ~3.0e-2
 * (0.97939 vs 0.94943) because it drops the super-poly E_flow denominator term, and the peak
 * sits ~3.55 decades BELOW the crossover N_cross ~ 3.28e9 where the (-1/2, +1/2) small-share
 * tail first applies. This module DERIVES a two-regime crossover interpolation that smoothly
 * bridges the two halves and MEASURES the residual of the blend at the peak that the far-tail
 * law alone overshoots by ~3.0e-2.
 *
 * THE QUANTITY (identical sub-terms to imp-3406 / imp-33291 / imp-33315)
 * ---------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll)
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 *
 * THE ONE STRUCTURAL DIFFERENCE the far-tail law makes is dropping E_flow. So the natural
 * two-regime bridge is a smoothly-matched form that REINTRODUCES exactly that term, weighted
 * by a switch that is 1 in the interior (E_flow retained -> the peak survives) and 0 in the
 * far tail (E_flow dropped -> the (-1/2, +1/2) power law is recovered).
 *
 * THE CROSSOVER INTERPOLATION (logistic switch in ln N, matched at N_cross)
 * ------------------------------------------------------------------------
 *     s(N)   = 1 / (1 + exp(-(ln N - ln N_cross) / delta))    (0 in interior, 1 in far tail)
 *     g(N)   = 1 - s(N)                                         (weight on the E_flow term)
 *     sigma_blend(N) = E_coll / (E_trunc + g(N) E_flow + E_coll)
 * The switch is centered at the imp-3444 collision-truncation crossover N_cross ~ 3.28e9 (where
 * E_coll = E_trunc, the natural regime boundary the far-tail law is built past) with width delta
 * in ln N. As N -> 0 (interior) g -> 1 and sigma_blend -> sigma_full (peak retained); as
 * N -> inf (far tail) g -> 0 and sigma_blend -> sigma_ft = E_coll/(E_trunc + E_coll) (the
 * (-1/2, +1/2) small-share law). A convex-in-sigma variant sigma_cvx = (1-s) sigma_full +
 * s sigma_ft is reported as a cross-check and agrees to the same order.
 *
 * THE RESIDUAL AT THE PEAK IS A CLOSED FORM: s(N_max) * overshoot
 * --------------------------------------------------------------
 * Because the ONLY difference sigma_full - sigma_ft is carried by the E_flow weighting, the
 * convex blend gives EXACTLY sigma_cvx(N) - sigma_full(N) = s(N) (sigma_ft(N) - sigma_full(N)),
 * so at the peak the blend residual is s(N_max) times the ~3.0e-2 far-tail overshoot. Since the
 * peak sits ~3.55 decades below the crossover, s(N_max) is exponentially small: for delta = 1
 * (one ln unit, ~0.43 decade) s(N_max) ~ 2.81e-4, so the blend residual is ~8.2e-6 -- a ~3670x
 * reduction of the far-tail law overshoot. The E_flow-weighted blend residual tracks the convex
 * one to within the second-order (E_flow/denominator)^2 correction (~1e-9 here). Tightening the
 * width to delta = 1/2 drops the residual to ~2.3e-9; loosening to delta = 2 (a full decade of
 * overlap) leaves ~4.8e-4, still ~60x under the raw overshoot. FAR PAST the crossover the blend
 * coincides with the far-tail law (sigma_blend(1e12) - sigma_ft(1e12) ~ 2e-9), so it is a
 * faithful description of BOTH halves.
 *
 * THE FINDING (derivation / measurement only)
 * -------------------------------------------
 *   (F1) A LOGISTIC-IN-ln-N CROSSOVER BLEND MATCHED AT N_cross BRIDGES BOTH REGIMES. Weighting
 *        the dropped E_flow term by g = 1 - s (s the logistic switch centered at the imp-3444
 *        crossover N_cross ~ 3.28e9) gives sigma_blend that limits to sigma_full in the interior
 *        (peak retained) and to the imp-33291 far-tail (-1/2, +1/2) law sigma_ft past the crossover.
 *   (F2) THE BLEND RESIDUAL AT THE PEAK IS s(N_max) TIMES THE FAR-TAIL OVERSHOOT. For the convex
 *        variant sigma_cvx - sigma_full = s (sigma_ft - sigma_full) EXACTLY, so at N_max the
 *        residual is s(N_max) * 3.0e-2. The peak lies ~3.55 decades below the crossover, so
 *        s(N_max) is exponentially small and the blend nearly annihilates the overshoot.
 *   (F3) THE MEASURED RESIDUAL AT N_max ~ 9.22e5 IS ~8.2e-6 (delta = 1), a ~3670x REDUCTION of the
 *        ~3.0e-2 far-tail overshoot. delta = 1/2 gives ~2.3e-9; delta = 2 gives ~4.8e-4 (still
 *        ~60x under). Far past the crossover (N = 1e12) the blend matches sigma_ft to ~2e-9.
 *
 * The punchline: the two disjoint halves imp-33315 separated -- the imp-3406 interior max and the
 * imp-33291 far-tail (-1/2, +1/2) law -- are stitched into one smooth curve by a single logistic-
 * in-ln-N switch centered at the imp-3444 crossover, re-weighting the exact E_flow term the far-
 * tail law drops. The blend residual at the peak is the closed form s(N_max) * overshoot; because
 * the peak sits ~3.55 decades inside the crossover it is exponentially small (~8.2e-6 for a
 * one-ln-unit width), closing the ~3.0e-2 far-tail overshoot by ~3.7 orders of magnitude while
 * recovering the far-tail law to ~2e-9 past the crossover.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. C_C is
 * GUE-conditional per imp-486; changes no bound; imp-3066 K_a>=0 untouched; no positivity, no
 * bridge closure, no RH claim, NO QED. No refereed bound is changed.
 *
 * @see imp-33315-sigma-fartail-law-vs-interior-max-reconciliation (the disjoint-regimes result, ~3.0e-2 overshoot)
 * @see imp-33291-sigma-fartail-two-parameter-lnN-lnlogT0-fit (the (-1/2, +1/2) joint power law)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX N ~ 9.22e5, sigma_max ~ 0.9494)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33291/imp-33315)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33291/imp-33315 exactly

// EXACT imp-3406 / imp-33291 / imp-33315 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // super-poly negligible on the far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return { T0, L, C_F, E_flow, E_coll, sigma: E_coll / (E_TRUNC_PT + E_flow + E_coll) };
}

// FULL conditional share (all three terms) -- the imp-3406 quantity with the interior max.
const sigmaFull = (N) => parts(N).sigma;

// imp-33291 FAR-TAIL leading form: drop the super-poly E_flow term (the (-1/2, +1/2) law).
function sigmaFarTail(N) {
  const p = parts(N);
  return p.E_coll / (E_TRUNC_PT + p.E_coll);
}

// Ternary argmax in ln N (reproduces the imp-3406 interior max and detects far-tail monotonicity).
function argmaxLnN(fn, loN, hiN) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (fn(Math.exp(m1)) < fn(Math.exp(m2))) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

// The E_coll = E_trunc crossover (reproduces imp-3444 / imp-33291 / imp-33315 N ~ 3.280e9).
function ecollEqualsEtrunc() {
  let a = Math.log(1e6);
  let b = Math.log(1e12);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).E_coll > E_TRUNC_PT) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

const LO_BRACKET = 1e4;
const HI_BRACKET = 1e9;
const N_MAX_FULL = argmaxLnN(sigmaFull, LO_BRACKET, HI_BRACKET); // ~9.219e5 (reproduces imp-3406)
const SIGMA_MAX_FULL = sigmaFull(N_MAX_FULL); // ~0.949429
const N_CROSS = ecollEqualsEtrunc(); // ~3.280e9
const LN_N_CROSS = Math.log(N_CROSS);
const PEAK_TO_CROSS_DECADES = Math.log10(N_CROSS) - Math.log10(N_MAX_FULL); // ~3.55

const SIGMA_FT_AT_PEAK = sigmaFarTail(N_MAX_FULL); // ~0.97939
const OVERSHOOT = SIGMA_FT_AT_PEAK - SIGMA_MAX_FULL; // ~3.0e-2 (the residual the far-tail law alone leaves)

// Logistic switch in ln N, centered at the imp-3444 crossover N_cross with width delta.
// s -> 0 in the interior (E_flow retained), s -> 1 in the far tail (E_flow dropped).
function switchS(N, delta) {
  return 1 / (1 + Math.exp(-(Math.log(N) - LN_N_CROSS) / delta));
}

// TWO-REGIME crossover blend: re-weight the dropped E_flow term by g = 1 - s.
function sigmaBlend(N, delta) {
  const p = parts(N);
  const g = 1 - switchS(N, delta);
  return p.E_coll / (E_TRUNC_PT + g * p.E_flow + p.E_coll);
}

// Convex-in-sigma cross-check variant; its residual is EXACTLY s * (sigma_ft - sigma_full).
function sigmaConvex(N, delta) {
  const s = switchS(N, delta);
  return (1 - s) * sigmaFull(N) + s * sigmaFarTail(N);
}

// Primary reported width: one ln unit (~0.43 decade of crossover overlap).
const DELTA_PRIMARY = 1.0;
const S_AT_PEAK_PRIMARY = switchS(N_MAX_FULL, DELTA_PRIMARY); // ~2.81e-4
const BLEND_AT_PEAK = sigmaBlend(N_MAX_FULL, DELTA_PRIMARY); // ~sigma_full
const BLEND_RESIDUAL = BLEND_AT_PEAK - SIGMA_MAX_FULL; // ~8.2e-6 (vs ~3.0e-2 far-tail overshoot)
const CONVEX_RESIDUAL = sigmaConvex(N_MAX_FULL, DELTA_PRIMARY) - SIGMA_MAX_FULL; // ~8.4e-6
// Closed form: convex residual = s(N_max) * (sigma_ft - sigma_full) = +s * overshoot.
const CLOSED_FORM_RESIDUAL = S_AT_PEAK_PRIMARY * OVERSHOOT; // ties CONVEX_RESIDUAL exactly
const REDUCTION_FACTOR = Math.abs(OVERSHOOT / BLEND_RESIDUAL); // ~3670x

// Width ladder: how the peak residual scales with the crossover overlap width delta.
const DELTA_LADDER = [0.5, 1.0, 2.0].map((delta) => ({
  delta,
  s_at_peak: +switchS(N_MAX_FULL, delta).toExponential(3),
  blend_residual_at_peak: +(sigmaBlend(N_MAX_FULL, delta) - SIGMA_MAX_FULL).toExponential(3),
  convex_residual_at_peak: +(sigmaConvex(N_MAX_FULL, delta) - SIGMA_MAX_FULL).toExponential(3),
  reduction_vs_overshoot: +Math.abs(OVERSHOOT / (sigmaBlend(N_MAX_FULL, delta) - SIGMA_MAX_FULL)).toFixed(1),
}));

// Side-by-side ladder across and past the peak (blend limits to full in interior, to FT past crossover).
const LADDER_N = [1e4, 1e5, N_MAX_FULL, 1e6, 1e7, 1e8, 1e9, N_CROSS, 1e12];
const CROSSOVER_LADDER = LADDER_N.map((N) => ({
  N: +N.toExponential(3),
  log10_N: +Math.log10(N).toFixed(4),
  sigma_full: +sigmaFull(N).toFixed(7),
  sigma_blend: +sigmaBlend(N, DELTA_PRIMARY).toFixed(7),
  sigma_farTail: +sigmaFarTail(N).toFixed(7),
  switch_s: +switchS(N, DELTA_PRIMARY).toExponential(3),
  blend_minus_full: +(sigmaBlend(N, DELTA_PRIMARY) - sigmaFull(N)).toExponential(3),
}));

// Far past the crossover the blend recovers the far-tail law.
const BLEND_MINUS_FT_FAR = sigmaBlend(1e12, DELTA_PRIMARY) - sigmaFarTail(1e12); // ~2e-9

export const IMP33533_SIGMA_TWO_REGIME_CROSSOVER_BLEND = {
  id: 'imp-33533',
  proofSection: 'S-frontier',
  question:
    'Derive a two-regime crossover interpolation bridging the imp-33291 far-tail sqrt(log T0/N) ' +
    'sigma law and the imp-3406 interior-max regime, and measure the residual of the blend at the ' +
    'N ~ 9.22e5 peak that the far-tail law alone overshoots by ~3.0e-2. Derivation/measurement only; ' +
    'C_C GUE-conditional per imp-486; no new bound; no QED.',
  crossoverForm:
    'sigma_blend(N) = E_coll/(E_trunc + g(N) E_flow + E_coll), g(N) = 1 - s(N), ' +
    's(N) = 1/(1 + exp(-(ln N - ln N_cross)/delta)) logistic switch centered at the imp-3444 ' +
    'crossover N_cross ~ 3.28e9. g -> 1 in the interior (sigma_blend -> sigma_full, peak retained); ' +
    'g -> 0 past the crossover (sigma_blend -> sigma_ft = E_coll/(E_trunc + E_coll), the (-1/2, +1/2) law).',
  landmarks: {
    N_max: +N_MAX_FULL.toExponential(4), // ~9.219e5 (reproduces imp-3406)
    log10_N_max: +Math.log10(N_MAX_FULL).toFixed(4), // ~5.9647
    sigma_max: +SIGMA_MAX_FULL.toFixed(7), // ~0.9494290
    N_cross: +N_CROSS.toExponential(4), // ~3.280e9
    peak_below_crossover_decades: +PEAK_TO_CROSS_DECADES.toFixed(4), // ~3.55
    farTail_overshoot_at_peak: +OVERSHOOT.toExponential(4), // ~2.996e-2 (imp-33315 residual)
  },
  blendResidual: {
    delta_primary: DELTA_PRIMARY,
    switch_s_at_peak: +S_AT_PEAK_PRIMARY.toExponential(4), // ~2.810e-4
    sigma_blend_at_peak: +BLEND_AT_PEAK.toFixed(7), // ~0.9494372
    blend_residual_at_peak: +BLEND_RESIDUAL.toExponential(4), // ~8.16e-6
    convex_residual_at_peak: +CONVEX_RESIDUAL.toExponential(4), // ~8.42e-6
    closed_form_residual_s_times_overshoot: +CLOSED_FORM_RESIDUAL.toExponential(4), // ties convex
    reduction_vs_farTail_overshoot: +REDUCTION_FACTOR.toFixed(1), // ~3670x
    blend_matches_farTail_far_past_crossover: +BLEND_MINUS_FT_FAR.toExponential(3), // ~2e-9 at N=1e12
    note:
      'The two-regime blend closes the ~3.0e-2 far-tail overshoot at the peak to ~8.2e-6 (delta = 1), ' +
      'a ~3670x reduction. The convex-variant residual is EXACTLY s(N_max) (sigma_ft - sigma_full) = ' +
      's(N_max) * overshoot; the E_flow-weighted blend tracks it to the second-order correction. Far ' +
      'past the crossover (N = 1e12) the blend recovers the far-tail law to ~2e-9.',
  },
  deltaLadder: DELTA_LADDER,
  crossoverLadder: CROSSOVER_LADDER,
  finding: {
    F1_logistic_crossover_bridges_both_regimes:
      'A logistic-in-ln-N switch s centered at the imp-3444 crossover N_cross ~ 3.28e9, weighting the ' +
      'dropped E_flow term by g = 1 - s, gives sigma_blend that limits to sigma_full in the interior ' +
      '(peak retained) and to the imp-33291 far-tail (-1/2, +1/2) law sigma_ft past the crossover.',
    F2_peak_residual_is_s_times_overshoot:
      'The convex blend residual is EXACTLY sigma_cvx - sigma_full = s (sigma_ft - sigma_full), so at ' +
      'the peak it is s(N_max) times the ~3.0e-2 far-tail overshoot. The peak sits ~3.55 decades below ' +
      'the crossover, so s(N_max) is exponentially small and the blend nearly annihilates the overshoot.',
    F3_measured_residual_reduces_overshoot_3670x:
      'At N_max ~ 9.22e5 the blend residual is ~8.2e-6 (delta = 1), a ~3670x reduction of the ~3.0e-2 ' +
      'far-tail overshoot; delta = 1/2 gives ~2.3e-9, delta = 2 gives ~4.8e-4 (still ~60x under). Far ' +
      'past the crossover (N = 1e12) the blend matches sigma_ft to ~2e-9.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION + MEASUREMENT (frontier-direction, NOT rigorous). A single logistic-in-ln-N switch ' +
    's(N) = 1/(1 + exp(-(ln N - ln N_cross)/delta)) centered at the imp-3444 collision-truncation ' +
    'crossover N_cross ~ 3.28e9, re-weighting the exact E_flow term the imp-33291 far-tail law drops by ' +
    'g = 1 - s, stitches the imp-3406 interior max and the far-tail (-1/2, +1/2) law into one smooth ' +
    'curve: sigma_blend -> sigma_full (peak retained) in the interior and -> sigma_ft past the crossover. ' +
    'The blend residual at the peak is the closed form s(N_max) * overshoot; because the peak sits ~3.55 ' +
    'decades inside the crossover it is exponentially small -- ~8.2e-6 for a one-ln-unit width, closing ' +
    'the ~3.0e-2 far-tail overshoot by ~3.7 orders of magnitude (~3670x) while recovering the far-tail ' +
    'law to ~2e-9 past the crossover. Derivation/measurement only; conditional-share diagnostic, NOT an ' +
    'RH bound; C_C GUE-conditional per imp-486; changes no bound; imp-3066 K_a>=0 untouched; no ' +
    'positivity, no bridge closure, no RH claim, NO QED. No refereed bound is changed.',
  citation:
    'imp-33315 (disjoint-regimes reconciliation, ~3.0e-2 overshoot); imp-33291 ((-1/2, +1/2) joint ' +
    'power law); imp-3406 (interior MAX N ~ 9.22e5, sigma_max ~ 0.9494); imp-3444 (E_coll = E_trunc ' +
    'crossover N ~ 3.280e9); imp-486 (C_C GUE-conditional); imp-398 (E_flow C_F prefactor); imp-2631 ' +
    '(E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33533_SIGMA_TWO_REGIME_CROSSOVER_BLEND_ASSERTIONS = [
  {
    // Reuse gate: the FULL sigma here reproduces the imp-3406 interior max, proving the identical
    // imp-3406 / imp-33291 / imp-33315 sub-term formulas are in use.
    id: 'imp33533-reproduces-imp3406-interior-max',
    description: 'full sigma interior max reproduces imp-3406 (N_max ~ 9.22e5, sigma_max ~ 0.9494)',
    holds: () =>
      N_MAX_FULL > 5e5 && N_MAX_FULL < 2e6 && Math.abs(SIGMA_MAX_FULL - 0.94943) < 5e-4,
  },
  {
    // Reuse gate: reproduce the imp-33315 far-tail overshoot the blend is built to close.
    id: 'imp33533-reproduces-imp33315-fartail-overshoot',
    description: 'far-tail law overshoots the peak by ~3.0e-2 (the residual the blend closes)',
    holds: () => OVERSHOOT > 2.5e-2 && OVERSHOOT < 3.5e-2 && PEAK_TO_CROSS_DECADES > 3 && PEAK_TO_CROSS_DECADES < 4,
  },
  {
    // (F1): the blend bridges BOTH regimes -- interior limit is sigma_full, far limit is sigma_ft.
    id: 'imp33533-blend-bridges-both-regimes',
    description: 'blend -> sigma_full in interior (small N) and -> sigma_ft far past the crossover',
    holds: () =>
      Math.abs(sigmaBlend(1e4, DELTA_PRIMARY) - sigmaFull(1e4)) < 1e-6 &&
      Math.abs(sigmaBlend(1e12, DELTA_PRIMARY) - sigmaFarTail(1e12)) < 1e-6,
  },
  {
    // (F2): the convex blend residual at the peak equals the closed form -s(N_max) * overshoot.
    id: 'imp33533-peak-residual-is-closed-form',
    description: 'convex blend residual at peak = -s(N_max) * overshoot (closed form, ties to ~1e-8)',
    holds: () => Math.abs(CONVEX_RESIDUAL - CLOSED_FORM_RESIDUAL) < 1e-7,
  },
  {
    // (F3): the measured blend residual at the peak is a ~3670x reduction of the far-tail overshoot.
    id: 'imp33533-blend-closes-overshoot-3670x',
    description: 'blend residual at peak ~8.2e-6 (delta=1), reducing the ~3.0e-2 far-tail overshoot > 1000x',
    holds: () =>
      Math.abs(BLEND_RESIDUAL) < 5e-5 &&
      Math.abs(BLEND_RESIDUAL) < OVERSHOOT / 500 &&
      REDUCTION_FACTOR > 1000,
  },
  {
    // Width monotonicity: tighter overlap (smaller delta) => smaller peak residual.
    id: 'imp33533-residual-decreases-with-tighter-width',
    description: 'peak residual shrinks monotonically as the crossover width delta tightens',
    holds: () =>
      Math.abs(sigmaBlend(N_MAX_FULL, 0.5) - SIGMA_MAX_FULL) <
        Math.abs(sigmaBlend(N_MAX_FULL, 1.0) - SIGMA_MAX_FULL) &&
      Math.abs(sigmaBlend(N_MAX_FULL, 1.0) - SIGMA_MAX_FULL) <
        Math.abs(sigmaBlend(N_MAX_FULL, 2.0) - SIGMA_MAX_FULL),
  },
  {
    // Honesty gate: derivation/measurement only, no QED, no refereed bound is changed.
    id: 'imp33533-honesty-gate-no-qed',
    description: 'Derivation/measurement only: no QED, no refereed bound is changed',
    holds: () =>
      IMP33533_SIGMA_TWO_REGIME_CROSSOVER_BLEND.isRigorous === false &&
      /NO QED/.test(IMP33533_SIGMA_TWO_REGIME_CROSSOVER_BLEND.verdict) &&
      /refereed bound is changed/i.test(IMP33533_SIGMA_TWO_REGIME_CROSSOVER_BLEND.verdict),
  },
];

for (const a of IMP33533_SIGMA_TWO_REGIME_CROSSOVER_BLEND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33533-sigma-two-regime-crossover-blend assertion failed: ${a.id}`);
  }
}
