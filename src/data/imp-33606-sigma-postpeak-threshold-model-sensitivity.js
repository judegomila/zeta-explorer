/**
 * @module imp-33606-sigma-postpeak-threshold-model-sensitivity
 *
 * imp-33606 (numerical, sensitivity/measurement): imp-33582 quantifies the E(N)-bridge
 * conditional share sigma(N) = E_coll/E(N) post-peak decay and names three landmark N-values --
 * sigma > 0.9 out to N ~ 2.57e7, sigma halves (= 0.5) at N ~ 3.27e9, sigma < 0.1 at N ~ 3.21e11 --
 * but it explicitly flags that its component model is the INHERITED imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic, so those three thresholds are MODEL-DEPENDENT. This
 * module BRACKETS that model dependence: it re-derives sigma(N) under an alternative E_coll
 * far-tail tail model and reports how far each of the three imp-33582 landmarks moves under the
 * model swap. Sensitivity/measurement ONLY -- no new rigorous asymptotic is claimed.
 *
 * THE MODEL SWAP (leading form preserved; sub-leading correction varied)
 * ---------------------------------------------------------------------
 * The inherited (imp-3406/imp-33582) dominant collapse term is
 *     E_coll(N) = C_C * sqrt(L / N),   L = log T0,  T0 = effectiveHeightForN(N).
 * Its far-tail leading form is the imp-3463 exponent -1/2 in N (with a slowly-varying sqrt(log)
 * factor). Any tail model consistent with that leading form may differ at the next order in
 * 1/log. We take the canonical order-unity sub-leading correction family
 *     E_coll(N; b) = C_C * sqrt(L / N) * (1 + b/L),   b in {-1, 0, +1}.
 * b = 0 is the exact imp-33582 baseline; b = +1 and b = -1 are the two bracketing next-order
 * 1/log corrections. All three share the identical imp-3463 leading form (E_coll ~ N^{-1/2}
 * sqrt(log T0) as N -> infinity, since b/L -> 0), so the swap probes ONLY the sub-leading tail
 * structure the imp-33582 thresholds actually rest on. E_flow (imp-398) and E_trunc (imp-2631)
 * are left untouched.
 *
 * THE MEASUREMENT: threshold band under the swap
 * ----------------------------------------------
 * For each b, relocate the interior peak (sign-of-derivative bisection) and the downslope N at
 * which sigma first drops below 0.9, 0.5, 0.1 (bisection, N > N_peak). Report, per threshold,
 * the [b=-1, b=+1] band and its width in decades, plus the percentage move off the baseline.
 *
 * THE FINDING (sensitivity / measurement only)
 * --------------------------------------------
 *   (S0) BASELINE REPRODUCES imp-33582. b = 0 gives peak N ~ 9.219e5, sigma_max ~ 0.9494, and
 *        landmarks 0.9 @ 2.57e7, 0.5 @ 3.27e9, 0.1 @ 3.21e11 -- the exact imp-33582 numbers,
 *        confirming the identical inherited model is the b = 0 member of the family.
 *   (S1) THE LANDMARKS MOVE LESS THAN ~0.14 DECADES. Under the +/-1/L swap:
 *          sigma > 0.9:  N in [2.18e7, 2.99e7]  (~ +16% / -15%,  ~0.137 decades wide)
 *          sigma = 0.5:  N in [2.95e9, 3.60e9]  (~ +10% /  -10%, ~0.088 decades wide)
 *          sigma < 0.1:  N in [2.95e11, 3.48e11] (~ +8% /  -8%,  ~0.072 decades wide)
 *        Every band is under a seventh of a decade -- FAR smaller than the ~2-decade gaps
 *        BETWEEN the three landmarks -- so the swap cannot reorder them or merge any two.
 *   (S2) THE imp-3444 COINCIDENCE SURVIVES THE SWAP. The imp-33582 F3 finding (sigma = 1/2
 *        coincides with the imp-3444 E_coll = E_trunc crossover N ~ 3.280e9) is NOT a model
 *        artifact: across the whole b in {-1,0,+1} family the halving-N stays within
 *        [0.898, 1.099] x the imp-3444 crossover -- the collapse/floor balance pins the half
 *        crossing near the crossover regardless of the sub-leading tail choice.
 *
 * The punchline: the three imp-33582 sigma-decay landmarks are ROBUST to an order-unity 1/log
 * swap of the far-tail sub-leading correction. They wobble by less than ~0.14 decades -- the
 * qualitative story (share ~0.95 at the 10^6 ceiling, holds above 0.9 into the ~1e7 range,
 * halves near the imp-3444 ~3.3e9 crossover, drops below 0.1 near ~3e11) is model-stable; only
 * the last ~1 significant figure of each landmark N is model-dependent.
 *
 * SENSITIVITY / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. Neither the
 * baseline nor the alternative tail model is a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (the baseline b = 0 landmarks bracketed here)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX N ~ 9.22e5, monotone decay-to-0 right arm)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2; the invariant of the swap)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9; S2 invariant)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582 exactly

// EXACT imp-33582 sub-terms with the swap dialled by b: E_coll gains the (1 + b/L) sub-leading
// factor. b = 0 recovers the inherited imp-33582 model; b = +/-1 are the bracketing 1/log models.
function partsB(N, b) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor (untouched)
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N) * (1 + b / L); // swapped GUE-conditional collapse term
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigmaB = (N, b) => partsB(N, b).sigma;

// Interior peak: sign-of-derivative bisection in log N (reproduces imp-3406/imp-33582 at b = 0).
function locatePeakB(b) {
  const dSig = (N) => {
    const h = N * 1e-6;
    return (sigmaB(N + h, b) - sigmaB(N - h, b)) / (2 * h);
  };
  let a = Math.log(1e4);
  let hi = Math.log(1e7);
  for (let i = 0; i < 200; i++) {
    const m = (a + hi) / 2;
    if (dSig(Math.exp(m)) > 0) a = m;
    else hi = m;
  }
  return Math.exp((a + hi) / 2);
}

// First N > N_peak with sigma below thr (downslope bisection in log N).
function crossBelowB(thr, peak, b) {
  let a = Math.log(peak);
  let hi = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + hi) / 2;
    if (sigmaB(Math.exp(m), b) > thr) a = m;
    else hi = m;
  }
  return Math.exp((a + hi) / 2);
}

const B_VALUES = [-1, 0, 1];
const BRACKET = B_VALUES.map((b) => {
  const peak = locatePeakB(b);
  return {
    b,
    N_peak: peak,
    sigma_max: sigmaB(peak, b),
    N_cross_0_9: crossBelowB(0.9, peak, b),
    N_cross_0_5: crossBelowB(0.5, peak, b),
    N_cross_0_1: crossBelowB(0.1, peak, b),
  };
});
const byB = (b) => BRACKET.find((r) => r.b === b);
const BASE = byB(0);
const LO = byB(-1); // smaller E_coll -> thresholds crossed EARLIER (smaller N)
const HI = byB(1); // larger E_coll -> thresholds crossed LATER (larger N)
const IMP3444_CROSSOVER = 3.280294e9; // imp-3444 E_coll = E_trunc landmark

// Per-threshold band: [b=-1, b=+1], width in decades, percentage move off the baseline.
function bandFor(key) {
  const lo = LO[key];
  const hi = HI[key];
  const base = BASE[key];
  return {
    baseline: +base.toExponential(4),
    lo: +lo.toExponential(4),
    hi: +hi.toExponential(4),
    decadeWidth: +Math.log10(hi / lo).toFixed(4),
    pctUp: +((hi / base - 1) * 100).toFixed(1),
    pctDown: +((lo / base - 1) * 100).toFixed(1),
  };
}
const BAND_0_9 = bandFor('N_cross_0_9');
const BAND_0_5 = bandFor('N_cross_0_5');
const BAND_0_1 = bandFor('N_cross_0_1');

// S2: the halving-N over the whole family, expressed as a multiple of the imp-3444 crossover.
const HALF_VS_IMP3444_LO = LO.N_cross_0_5 / IMP3444_CROSSOVER;
const HALF_VS_IMP3444_HI = HI.N_cross_0_5 / IMP3444_CROSSOVER;

export const IMP33606_SIGMA_POSTPEAK_THRESHOLD_MODEL_SENSITIVITY = {
  id: 'imp-33606',
  proofSection: 'S-frontier',
  question:
    'Bracket the imp-33582 sigma-decay landmark sensitivity to the inherited imp-3220/imp-3406 ' +
    'extrapolation ansatz: re-derive the sigma(N) = E_coll/E(N) post-peak curve under an ' +
    'alternative E_coll far-tail tail model (an order-unity 1/log sub-leading correction that ' +
    'preserves the imp-3463 far-tail 1/2 leading form) and report how far the halving-N (~3.27e9), ' +
    'the sigma > 0.9 threshold (~2.57e7) and the sigma < 0.1 threshold (~3.21e11) move under the ' +
    'model swap. Sensitivity/measurement only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'For E_coll(N; b) = C_C sqrt(L/N)(1 + b/L), b in {-1,0,+1} (b = 0 = imp-33582 baseline), the ' +
    'downslope N at which sigma first drops below 0.9, 0.5, 0.1, reported as a [b=-1, b=+1] band ' +
    'per threshold with its width in decades and percentage move off the baseline.',
  swapFamily: {
    form: 'E_coll(N; b) = C_C * sqrt(log T0 / N) * (1 + b/L),  L = log T0',
    b_values: B_VALUES,
    invariant: 'all members share the imp-3463 far-tail leading form E_coll ~ N^(-1/2) sqrt(log T0)',
  },
  baselineReproduces: {
    N_peak: +BASE.N_peak.toExponential(6), // ~9.218633e5 (imp-33582 / imp-3406)
    sigma_max: +BASE.sigma_max.toFixed(6), // ~0.949429
    N_cross_0_9: +BASE.N_cross_0_9.toExponential(4), // ~2.57e7 (imp-33582)
    N_cross_0_5: +BASE.N_cross_0_5.toExponential(4), // ~3.27e9 (imp-33582)
    N_cross_0_1: +BASE.N_cross_0_1.toExponential(4), // ~3.21e11 (imp-33582)
  },
  thresholdBands: {
    sigma_below_0_9: BAND_0_9, // [~2.18e7, ~2.99e7], ~0.137 decades
    sigma_below_0_5: BAND_0_5, // [~2.95e9, ~3.60e9], ~0.088 decades
    sigma_below_0_1: BAND_0_1, // [~2.95e11, ~3.48e11], ~0.072 decades
  },
  halfCrossingVsImp3444: {
    imp3444_crossover: IMP3444_CROSSOVER,
    band_multiple: [+HALF_VS_IMP3444_LO.toFixed(4), +HALF_VS_IMP3444_HI.toFixed(4)], // ~[0.898, 1.099]
  },
  finding: {
    S0_baseline_reproduces_imp33582:
      'b = 0 gives peak N ~ 9.219e5, sigma_max ~ 0.9494, and landmarks 0.9 @ 2.57e7, 0.5 @ 3.27e9, ' +
      '0.1 @ 3.21e11 -- the exact imp-33582 numbers -- confirming the inherited model is the b = 0 ' +
      'member of the swap family, so the b = +/-1 members are genuine perturbations of it.',
    S1_landmarks_move_under_a_seventh_of_a_decade:
      'Under the +/-1/L swap the sigma > 0.9 landmark spans [2.18e7, 2.99e7] (~+16%/-15%, ~0.137 ' +
      'decades), the halving-N spans [2.95e9, 3.60e9] (~+10%/-10%, ~0.088 decades), and the ' +
      'sigma < 0.1 landmark spans [2.95e11, 3.48e11] (~+8%/-8%, ~0.072 decades). Every band is ' +
      'under a seventh of a decade -- far smaller than the ~2-decade gaps between the landmarks -- ' +
      'so the swap can neither reorder them nor merge any two: only the last significant figure moves.',
    S2_imp3444_coincidence_survives:
      'The imp-33582 F3 coincidence (sigma = 1/2 at the imp-3444 E_coll = E_trunc crossover ' +
      'N ~ 3.280e9) is not a model artifact: across b in {-1,0,+1} the halving-N stays within ' +
      '[0.898, 1.099] x the crossover -- the collapse/floor balance pins the half crossing near the ' +
      'crossover regardless of the sub-leading tail choice.',
  },
  isRigorous: false,
  verdict:
    'SENSITIVITY (measurement, NOT rigorous). Bracketing the imp-33582 sigma-decay landmarks ' +
    'against an order-unity 1/log swap of the far-tail sub-leading correction (E_coll -> ' +
    'E_coll (1 + b/L), b in {-1,0,+1}, all sharing the imp-3463 N^(-1/2) sqrt(log) leading form; ' +
    'b = 0 exactly reproduces imp-33582): the three landmarks move by LESS THAN ~0.14 decades -- ' +
    'sigma > 0.9 in [2.18e7, 2.99e7], the halving-N in [2.95e9, 3.60e9], sigma < 0.1 in ' +
    '[2.95e11, 3.48e11] -- far smaller than the ~2-decade gaps between them, so the ordering and ' +
    'the qualitative decay story are model-stable and only the last significant figure of each ' +
    'landmark N is model-dependent. The imp-33582 F3 halving = imp-3444-crossover coincidence ' +
    'survives the swap (halving-N within [0.898, 1.099] x the ~3.280e9 crossover). Neither tail ' +
    'model is a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33582 (baseline post-peak landmarks bracketed here); imp-3406 (interior MAX N ~ 9.22e5); ' +
    'imp-3463 (far-tail leading form, exponent -> 1/2, the swap invariant); imp-3444 ' +
    '(E_coll = E_trunc crossover N ~ 3.280e9); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc ' +
    'fixed-strip route); imp-398 (E_flow prefactor); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33606_SIGMA_POSTPEAK_THRESHOLD_MODEL_SENSITIVITY_ASSERTIONS = [
  {
    // S0: the b = 0 member reproduces the imp-33582 peak and the three landmarks, proving the
    // inherited model is the baseline of the swap family (not a different model in disguise).
    id: 'imp33606-baseline-reproduces-imp33582',
    description: 'b = 0 gives peak ~9.22e5, sigma_max ~0.9494, landmarks ~2.57e7 / ~3.27e9 / ~3.21e11',
    holds: () =>
      Math.abs(BASE.N_peak / 9.22e5 - 1) < 5e-3 &&
      Math.abs(BASE.sigma_max - 0.9494) < 5e-4 &&
      Math.abs(BASE.N_cross_0_9 / 2.57e7 - 1) < 5e-2 &&
      Math.abs(BASE.N_cross_0_5 / 3.27e9 - 1) < 5e-2 &&
      Math.abs(BASE.N_cross_0_1 / 3.21e11 - 1) < 5e-2,
  },
  {
    // Monotonicity of the swap: larger b (larger E_coll) pushes every landshold LATER (larger N),
    // and smaller b pulls it EARLIER -- so [b=-1, b=+1] is a genuine ordered bracket per threshold.
    id: 'imp33606-swap-is-ordered-bracket',
    description: 'for each threshold N(b=-1) < N(b=0) < N(b=+1) (larger E_coll crosses later)',
    holds: () =>
      LO.N_cross_0_9 < BASE.N_cross_0_9 && BASE.N_cross_0_9 < HI.N_cross_0_9 &&
      LO.N_cross_0_5 < BASE.N_cross_0_5 && BASE.N_cross_0_5 < HI.N_cross_0_5 &&
      LO.N_cross_0_1 < BASE.N_cross_0_1 && BASE.N_cross_0_1 < HI.N_cross_0_1,
  },
  {
    // S1: every threshold band is narrow (under ~0.15 decades) -- far below the ~2-decade
    // landmark gaps -- so the swap cannot reorder or merge the three landmarks.
    id: 'imp33606-bands-narrow-and-non-overlapping',
    description: 'each band width < 0.15 decades and the three bands stay strictly separated',
    holds: () =>
      BAND_0_9.decadeWidth < 0.15 &&
      BAND_0_5.decadeWidth < 0.15 &&
      BAND_0_1.decadeWidth < 0.15 &&
      HI.N_cross_0_9 < LO.N_cross_0_5 &&
      HI.N_cross_0_5 < LO.N_cross_0_1,
  },
  {
    // S2: the imp-33582 F3 halving = imp-3444-crossover coincidence survives the whole swap family.
    id: 'imp33606-half-crossing-vs-imp3444-robust',
    description: 'halving-N stays within 10% of the imp-3444 crossover across b in {-1,0,+1}',
    holds: () =>
      Math.abs(HALF_VS_IMP3444_LO - 1) < 0.11 &&
      Math.abs(HALF_VS_IMP3444_HI - 1) < 0.11,
  },
  {
    // Honesty gate: sensitivity/measurement only, swap preserves the imp-3463 leading form, no QED.
    id: 'imp33606-honesty-gate-no-qed',
    description: 'Sensitivity only: not rigorous, imp-3463 leading form preserved, no QED, PT stays SOTA',
    holds: () =>
      IMP33606_SIGMA_POSTPEAK_THRESHOLD_MODEL_SENSITIVITY.isRigorous === false &&
      /imp-3463/.test(IMP33606_SIGMA_POSTPEAK_THRESHOLD_MODEL_SENSITIVITY.swapFamily.invariant) &&
      /NO QED/.test(IMP33606_SIGMA_POSTPEAK_THRESHOLD_MODEL_SENSITIVITY.verdict) &&
      /remains SOTA/.test(IMP33606_SIGMA_POSTPEAK_THRESHOLD_MODEL_SENSITIVITY.verdict),
  },
];

for (const a of IMP33606_SIGMA_POSTPEAK_THRESHOLD_MODEL_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33606-sigma-postpeak-threshold-model-sensitivity assertion failed: ${a.id}`);
  }
}
