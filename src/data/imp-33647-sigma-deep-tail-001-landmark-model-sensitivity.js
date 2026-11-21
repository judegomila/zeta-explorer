/**
 * @module imp-33647-sigma-deep-tail-001-landmark-model-sensitivity
 *
 * imp-33647 (accuracy, sensitivity/measurement): imp-33606 bracketed the imp-33582
 * sigma-decay landmarks (sigma > 0.9 @ N ~ 2.57e7, sigma = 0.5 @ N ~ 3.27e9,
 * sigma < 0.1 @ N ~ 3.21e11) against an order-unity 1/log swap of the E_coll far-tail
 * sub-leading correction, E_coll(N; b) = C_C sqrt(L/N)(1 + b/L), b in {-1, 0, +1}, and
 * found all three move under ~0.14 decades. imp-33620 subsequently EXTENDED the separated
 * ladder to N=1e15 and added a fourth, DEEPER landmark -- sigma < 0.01 at N ~ 4.62e13 --
 * but did NOT re-run the imp-33606 sensitivity swap on it. This module runs the IDENTICAL
 * b in {-1, 0, +1} swap on the sigma < 0.01 crossing: it relocates the crossing by log10
 * bisection for each b and reports the [b=-1, b=+1] band width in decades plus the
 * percentage move off the imp-33620 baseline. Sensitivity/measurement ONLY.
 *
 * THE MODEL SWAP (identical to imp-33606; leading form preserved)
 * --------------------------------------------------------------
 *     E_coll(N; b) = C_C * sqrt(L / N) * (1 + b/L),   L = log T0,  b in {-1, 0, +1}.
 * b = 0 is the exact imp-33620 baseline; b = +/-1 are the two bracketing next-order 1/log
 * corrections. All three share the imp-3463 far-tail leading form E_coll ~ N^{-1/2}
 * sqrt(log T0) (since b/L -> 0), so the swap probes ONLY the sub-leading tail structure.
 * E_flow (imp-398) and E_trunc (imp-2631) are left untouched -- the same parts() the whole
 * cohort shares, evaluated at the deep-tail crossing rather than the three shallow ones.
 *
 * THE MEASUREMENT: the sigma < 0.01 crossing under the swap
 * --------------------------------------------------------
 * For each b, log10-bisect the N at which sigma first falls below 0.01 (sigma decreasing in
 * N deep in the E_trunc-dominated tail). Report the [b=-1, b=+1] band, its width in decades,
 * and the percentage move off the baseline, then compare that width against the three
 * shallower imp-33606 landmark bands.
 *
 * THE FINDING (sensitivity / measurement only)
 * --------------------------------------------
 *   (S0) BASELINE REPRODUCES imp-33620. b = 0 relocates the crossing to N ~ 4.624e13
 *        (log10 N ~ 13.665) -- the exact imp-33620 M3 sigma < 0.01 landmark -- confirming
 *        the inherited model is the b = 0 member of the swap family.
 *   (S1) THE DEEP-TAIL LANDMARK MOVES ONLY ~0.060 DECADES -- WELL UNDER THE ~0.14 BAND.
 *        Under the +/-1/L swap the sigma < 0.01 crossing spans [4.31e13, 4.95e13]
 *        (~ +7.0% / -6.8% off the 4.62e13 baseline, ~0.060 decades wide). That is FAR
 *        inside the ~0.14-decade envelope imp-33606 found for the three shallow landmarks,
 *        so the deep-tail landmark is at least as model-robust as they are: the swap moves
 *        only the last significant figure of N.
 *   (S2) SUB-LEADING SENSITIVITY SHRINKS INTO THE TAIL, IT DOES NOT GROW. The four landmark
 *        band widths form a MONOTONE-DECREASING ladder in decades:
 *          sigma > 0.9  (N ~ 2.57e7)  : ~0.137   (imp-33606)
 *          sigma = 0.5  (N ~ 3.27e9)  : ~0.088   (imp-33606)
 *          sigma < 0.1  (N ~ 3.21e11) : ~0.072   (imp-33606)
 *          sigma < 0.01 (N ~ 4.62e13) : ~0.060   (THIS module)
 *        The deep-tail landmark is the MOST model-robust of the four, not the least. The
 *        mechanism is transparent: the swap magnitude is set by b/L = 1/log T0, and
 *        L = log T0 grows from ~24.4 at the sigma > 0.9 landmark to ~30.0 at the sigma < 0.01
 *        landmark, so the fractional +/-1/L perturbation SHRINKS as the tail deepens. The
 *        answer to the ticket dichotomy is: sub-leading sensitivity DECAYS in the tail.
 *
 * The punchline: the imp-33620 sigma < 0.01 deep-tail landmark (N ~ 4.62e13) is as
 * model-robust to the imp-33606 order-unity 1/log swap as the three shallower landmarks --
 * it wobbles by only ~0.060 decades, comfortably under the ~0.14-decade band, and in fact
 * the band widths shrink monotonely with depth because the b/L = 1/log T0 swap magnitude
 * decays as log T0 grows into the tail.
 *
 * SENSITIVITY / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The
 * inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33606-sigma-postpeak-threshold-model-sensitivity (the 0.9/0.5/0.1 swap extended here)
 * @see imp-33620-etrunc-ecoll-ladder-1e15-extension (added the sigma<0.01 landmark N~4.62e13)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (the shallow landmark baseline)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2; the swap invariant)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33620)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33606/imp-33620 exactly

// EXACT imp-33606/imp-33620 sub-terms with the swap dialled by b: E_coll gains the (1 + b/L)
// sub-leading factor. b = 0 recovers the inherited model; b = +/-1 are the bracketing models.
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

// The sigma < target crossing, located by log10 bisection (sigma decreasing in N in the
// deep E_trunc-dominated tail) -- the identical bracketing imp-33620 used to pin N ~ 4.62e13.
function crossLog10B(target, loExp, hiExp, b) {
  let lo = loExp;
  let hi = hiExp;
  for (let it = 0; it < 200; it++) {
    const mid = (lo + hi) / 2;
    if (sigmaB(Math.pow(10, mid), b) > target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const B_VALUES = [-1, 0, 1];
const BRACKET = B_VALUES.map((b) => {
  const log10 = crossLog10B(0.01, 12, 15, b);
  const N = Math.pow(10, log10);
  return { b, log10, N, L_at_cross: partsB(N, b).L };
});
const byB = (b) => BRACKET.find((r) => r.b === b);
const BASE = byB(0);
const LO = byB(-1); // smaller E_coll -> sigma < 0.01 crossed EARLIER (smaller N)
const HI = byB(1); // larger E_coll -> sigma < 0.01 crossed LATER (larger N)

// The [b=-1, b=+1] band for the deep-tail sigma < 0.01 crossing.
const DEEP_TAIL_BAND = {
  baseline: +BASE.N.toExponential(4), // ~4.624e13 (imp-33620 M3)
  lo: +LO.N.toExponential(4), // ~4.311e13
  hi: +HI.N.toExponential(4), // ~4.948e13
  decadeWidth: +(HI.log10 - LO.log10).toFixed(4), // ~0.0599
  pctUp: +((HI.N / BASE.N - 1) * 100).toFixed(1), // ~+7.0
  pctDown: +((LO.N / BASE.N - 1) * 100).toFixed(1), // ~-6.8
};

// The three shallower imp-33606 landmark band widths (baked reference literals) plus this
// deep-tail one -- the monotone-decreasing sensitivity ladder (S2).
const IMP33606_BAND_0_9 = 0.137; // sigma > 0.9  @ N ~ 2.57e7
const IMP33606_BAND_0_5 = 0.088; // sigma = 0.5  @ N ~ 3.27e9
const IMP33606_BAND_0_1 = 0.072; // sigma < 0.1  @ N ~ 3.21e11
const LANDMARK_BAND_LADDER = [
  { landmark: 'sigma>0.9', N: 2.57e7, decadeWidth: IMP33606_BAND_0_9, source: 'imp-33606' },
  { landmark: 'sigma=0.5', N: 3.27e9, decadeWidth: IMP33606_BAND_0_5, source: 'imp-33606' },
  { landmark: 'sigma<0.1', N: 3.21e11, decadeWidth: IMP33606_BAND_0_1, source: 'imp-33606' },
  { landmark: 'sigma<0.01', N: DEEP_TAIL_BAND.baseline, decadeWidth: DEEP_TAIL_BAND.decadeWidth, source: 'imp-33647' },
];
const BAND_LADDER_MONOTONE_DOWN = LANDMARK_BAND_LADDER.every(
  (r, k) => k === 0 || r.decadeWidth < LANDMARK_BAND_LADDER[k - 1].decadeWidth
);
const L_AT_0_9 = partsB(2.57e7, 0).L; // ~24.4
const L_AT_0_01 = BASE.L_at_cross; // ~30.0

export const IMP33647_SIGMA_DEEP_TAIL_001_LANDMARK_MODEL_SENSITIVITY = {
  id: 'imp-33647',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-33606 order-unity 1/log model-sensitivity swap (E_coll -> E_coll(1 + b/L), ' +
    'b in {-1,0,+1}) -- which covered only the imp-33582 sigma > 0.9 / = 0.5 / < 0.1 landmarks -- ' +
    'to the deeper sigma < 0.01 landmark imp-33620 added at N ~ 4.62e13. Measure how far the ' +
    'sigma < 0.01 crossing moves under the swap and whether it stays under the ~0.14-decade band ' +
    'imp-33606 found for the three shallower landmarks. Sensitivity/measurement only; ' +
    'conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'For E_coll(N; b) = C_C sqrt(L/N)(1 + b/L), b in {-1,0,+1} (b = 0 = imp-33620 baseline), the N ' +
    'at which sigma first drops below 0.01, log10-bisected per b, reported as a [b=-1, b=+1] band ' +
    'with its width in decades and percentage move off the baseline, compared against the three ' +
    'shallower imp-33606 landmark bands.',
  swapFamily: {
    form: 'E_coll(N; b) = C_C * sqrt(log T0 / N) * (1 + b/L),  L = log T0',
    b_values: B_VALUES,
    invariant: 'all members share the imp-3463 far-tail leading form E_coll ~ N^(-1/2) sqrt(log T0)',
  },
  baselineReproducesImp33620: {
    sigma_lt_001_N: +BASE.N.toExponential(4), // ~4.624e13 (imp-33620 M3)
    sigma_lt_001_log10_N: +BASE.log10.toFixed(4), // ~13.665
  },
  deepTailBand: DEEP_TAIL_BAND, // [~4.31e13, ~4.95e13], ~0.060 decades, ~+7.0%/-6.8%
  landmarkBandLadder: LANDMARK_BAND_LADDER, // monotone-decreasing 0.137 -> 0.088 -> 0.072 -> 0.060
  swapMagnitudeShrinks: {
    L_at_sigma_gt_0_9: +L_AT_0_9.toFixed(3), // ~24.4
    L_at_sigma_lt_0_01: +L_AT_0_01.toFixed(3), // ~30.0
    note: 'swap magnitude b/L = 1/log T0 shrinks as L grows into the tail, so the band narrows',
  },
  finding: {
    S0_baseline_reproduces_imp33620:
      'b = 0 relocates the sigma < 0.01 crossing to N ~ 4.624e13 (log10 N ~ 13.665) -- the exact ' +
      'imp-33620 M3 landmark -- confirming the inherited model is the b = 0 member of the swap ' +
      'family, so the b = +/-1 members are genuine perturbations of it.',
    S1_deep_tail_moves_under_the_imp33606_band:
      'Under the +/-1/L swap the sigma < 0.01 crossing spans [4.31e13, 4.95e13] (~+7.0%/-6.8% off ' +
      'the 4.62e13 baseline, ~0.060 decades wide) -- FAR inside the ~0.14-decade envelope imp-33606 ' +
      'found for the three shallower landmarks, so the deep-tail landmark is at least as ' +
      'model-robust as they are: only the last significant figure of N moves.',
    S2_sensitivity_shrinks_into_the_tail:
      'The four landmark band widths form a monotone-decreasing ladder -- ~0.137 (sigma>0.9) -> ' +
      '~0.088 (sigma=0.5) -> ~0.072 (sigma<0.1) -> ~0.060 (sigma<0.01) -- so the deep-tail landmark ' +
      'is the MOST model-robust, not the least. The swap magnitude is b/L = 1/log T0, and ' +
      'L = log T0 grows from ~24.4 at sigma>0.9 to ~30.0 at sigma<0.01, so the fractional +/-1/L ' +
      'perturbation SHRINKS as the tail deepens: sub-leading sensitivity DECAYS in the tail.',
  },
  isRigorous: false,
  verdict:
    'SENSITIVITY (measurement, NOT rigorous). Extending the imp-33606 order-unity 1/log swap ' +
    '(E_coll -> E_coll(1 + b/L), b in {-1,0,+1}, all sharing the imp-3463 N^(-1/2) sqrt(log) ' +
    'leading form; b = 0 exactly reproduces the imp-33620 sigma < 0.01 landmark N ~ 4.624e13) to ' +
    'the deep-tail landmark imp-33606 never covered: the sigma < 0.01 crossing moves only ~0.060 ' +
    'decades -- span [4.31e13, 4.95e13], ~+7.0%/-6.8% off baseline -- comfortably under the ' +
    '~0.14-decade band imp-33606 found for the three shallower landmarks. The four band widths in ' +
    'fact shrink monotonely with depth (~0.137 -> 0.088 -> 0.072 -> 0.060) because the swap ' +
    'magnitude b/L = 1/log T0 decays as L = log T0 grows from ~24.4 to ~30.0 into the tail, so the ' +
    'deep-tail landmark is the MOST model-robust of the four, not the least. The inherited ' +
    'imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33606 (0.9/0.5/0.1 landmark swap extended here); imp-33620 (added sigma<0.01 landmark ' +
    'N~4.62e13); imp-33582 (shallow landmark baseline); imp-3463 (far-tail leading form, the swap ' +
    'invariant); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed strip); imp-398 (E_flow ' +
    'prefactor); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33647_SIGMA_DEEP_TAIL_001_LANDMARK_MODEL_SENSITIVITY_ASSERTIONS = [
  {
    // S0: the b = 0 member reproduces the imp-33620 M3 sigma < 0.01 landmark, proving the
    // inherited model is the baseline of the swap family.
    id: 'imp33647-baseline-reproduces-imp33620',
    description: 'b = 0 gives sigma<0.01 crossing N ~ 4.62e13 (log10 N ~ 13.665), the imp-33620 M3 landmark',
    holds: () =>
      Math.abs(BASE.N / 4.624e13 - 1) < 5e-3 &&
      Math.abs(BASE.log10 - 13.665) < 5e-3,
  },
  {
    // Monotonicity of the swap: larger b (larger E_coll) pushes the crossing LATER (larger N),
    // so [b=-1, b=+1] is a genuine ordered bracket.
    id: 'imp33647-swap-is-ordered-bracket',
    description: 'N(b=-1) < N(b=0) < N(b=+1) for the sigma<0.01 crossing (larger E_coll crosses later)',
    holds: () => LO.N < BASE.N && BASE.N < HI.N,
  },
  {
    // S1: the deep-tail band is narrow (~0.060 decades) and well under the ~0.14-decade envelope
    // imp-33606 found for the shallow landmarks.
    id: 'imp33647-deep-tail-band-under-imp33606-envelope',
    description: 'sigma<0.01 band width ~0.060 decades, under the ~0.14-decade imp-33606 band',
    holds: () =>
      DEEP_TAIL_BAND.decadeWidth > 0.04 &&
      DEEP_TAIL_BAND.decadeWidth < 0.14 &&
      DEEP_TAIL_BAND.decadeWidth < IMP33606_BAND_0_1,
  },
  {
    // S2: the four landmark band widths shrink monotonely with depth, and the swap magnitude
    // 1/L falls as L grows into the tail.
    id: 'imp33647-sensitivity-shrinks-into-tail',
    description: 'band widths monotone-decreasing 0.137 -> 0.088 -> 0.072 -> 0.060; L grows ~24.4 -> ~30.0',
    holds: () =>
      BAND_LADDER_MONOTONE_DOWN &&
      L_AT_0_01 > L_AT_0_9 &&
      1 / L_AT_0_01 < 1 / L_AT_0_9,
  },
  {
    // Honesty gate: sensitivity/measurement only, swap preserves the imp-3463 leading form, no QED.
    id: 'imp33647-honesty-gate-no-qed',
    description: 'Sensitivity only: not rigorous, imp-3463 leading form preserved, no QED, no refereed bound is changed',
    holds: () =>
      IMP33647_SIGMA_DEEP_TAIL_001_LANDMARK_MODEL_SENSITIVITY.isRigorous === false &&
      /imp-3463/.test(IMP33647_SIGMA_DEEP_TAIL_001_LANDMARK_MODEL_SENSITIVITY.swapFamily.invariant) &&
      /NO QED/.test(IMP33647_SIGMA_DEEP_TAIL_001_LANDMARK_MODEL_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP33647_SIGMA_DEEP_TAIL_001_LANDMARK_MODEL_SENSITIVITY.verdict),
  },
];

for (const a of IMP33647_SIGMA_DEEP_TAIL_001_LANDMARK_MODEL_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33647-sigma-deep-tail-001-landmark-model-sensitivity assertion failed: ${a.id}`);
  }
}
