/**
 * @module imp-33724-sigma-fartail-landmark-ccoll-prefactor-sensitivity
 *
 * imp-33724 (numerical, frontier-direction): imp-33582 pinned two FAR-TAIL landmarks of
 * the GUE-conditional share sigma(N) = E_coll/(E_trunc + E_flow + E_coll) -- the halving
 * point sigma = 0.5 at N ~ 3.27e9 and the sub-0.1 crossing sigma < 0.1 at N ~ 3.21e11 --
 * each located with a SINGLE value of the dominant collision prefactor C_C_PINNED (the
 * GUE-conditional C_H, imp-2714/imp-486) inside E_coll = C_C_PINNED*sqrt(log T0 / N).
 * imp-33708 already measured how these two landmarks move when the E_trunc floor MODEL
 * FORM is rescaled (0.5x..5x), finding N ~ E_trunc^(-2.0). This module runs the
 * COMPLEMENTARY perturbation on the SAME two landmarks: it perturbs the E_coll PREFACTOR
 * C_C_PINNED by +/-1%, +/-5%, +/-10% and re-locates each crossing per prefactor, measuring
 * how far the landmarks move and which one is more prefactor-sensitive. This is a DISTINCT
 * axis from imp-33708 (E_trunc floor, not the E_coll prefactor) and from imp-33606/imp-33647
 * (which swapped the E_coll sub-leading 1/log correction, NOT the leading prefactor).
 * Sensitivity/measurement only.
 *
 * THE QUANTITY (identical formulas to imp-33582 / imp-3406 / imp-33708)
 * -------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0      = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll  = (C_C_PINNED * factor) * sqrt(log T0 / N)   (perturbed prefactor; base imp-2714)
 *     E_flow  = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                             (fixed floor; base imp-2631)
 * The ONLY thing varied here is the constant prefactor C_C on E_coll; every other sub-term
 * is reused byte-for-byte from imp-33582, so factor = 1 reproduces the imp-33582 landmarks.
 *
 * WHY THE FAR-TAIL LANDMARKS SCALE AS C_C^(+2) (and why they mirror the imp-33708 E_trunc law)
 * -------------------------------------------------------------------------------------------
 * Deep in the tail E_flow is NEGLIGIBLE (E_flow/E_trunc ~ 1.9e-3 at sigma = 0.5, ~ 3.5e-5 at
 * sigma < 0.1), so the crossing sigma = thr is set by pure E_trunc-vs-E_coll balance:
 * sigma = 1/(1 + E_trunc/E_coll) = thr forces E_coll = E_trunc * thr/(1 - thr). With
 * E_coll = C_C sqrt(log T0 / N) this reads C_C sqrt(1/N) proportional to E_trunc, i.e.
 * sqrt(N) proportional to C_C/E_trunc and N_landmark ~ (C_C / E_trunc)^2 up to slow log T0
 * drift. So the landmark N depends on the RATIO C_C/E_trunc squared: raising the prefactor
 * C_C pushes E_coll UP, so sigma clears the threshold LATER (larger N) -- the exponent is
 * +2, the SAME magnitude as the imp-33708 E_trunc exponent -2 but the OPPOSITE SIGN, because
 * C_C sits in the numerator where E_trunc sits in the denominator of that ratio. The prefactor
 * is exactly as influential as the floor; only the direction of the shift is reversed.
 *
 * THE MEASUREMENT: each landmark under a +/-1/5/10% prefactor sweep
 * ----------------------------------------------------------------
 * For each prefactor factor and each threshold thr in {0.5, 0.1}, log10-bisect the N at which
 * sigma first drops below thr (sigma decreasing in N on the downslope). Report the per-prefactor
 * landmark table, the empirical scaling exponent p in N_landmark ~ C_C^p (from the 0.9x and 1.1x
 * prefactors), the [0.9x, 1.1x] +/-10% band in decades, and which landmark is more prefactor-sensitive.
 *
 * THE FINDING (measurement / sensitivity only)
 * --------------------------------------------
 *   (S0) BASELINE REPRODUCES imp-33582. factor 1.0 relocates the crossings to N ~ 3.267e9
 *        (sigma = 0.5) and N ~ 3.213e11 (sigma < 0.1) -- the exact imp-33582 far-tail
 *        landmarks -- confirming the inherited model is the factor = 1 member of the swap.
 *   (S1) BOTH FAR-TAIL LANDMARKS SCALE AS N ~ C_C^(+2.0). The measured exponent is ~ +2.103
 *        (sigma = 0.5) and ~ +2.079 (sigma < 0.1) -- the clean dimensional +2 the E_flow-negligible
 *        balance predicts, POSITIVE (raising C_C delays the crossing). A +/-10% prefactor moves
 *        each landmark by ~ +22%/-20% (sigma = 0.5: [2.62e9, 3.99e9]; sigma < 0.1: [2.58e11,
 *        3.92e11]), ~0.18 decades wide. The precise landmark N-values are NOT robust to the
 *        prefactor, but even a full +/-10% C_C swing keeps each landmark inside a fifth of a decade.
 *   (S2) THE PREFACTOR IS EXACTLY AS INFLUENTIAL AS THE FLOOR, OPPOSITE SIGN. The +2.103/+2.079
 *        prefactor exponents MIRROR the imp-33708 E_trunc exponents -2.099/-2.079 in magnitude
 *        (differ by < 0.01) but flip sign, because the tail landmark depends only on the ratio
 *        C_C/E_trunc squared. Halving (sigma = 0.5, exponent 2.103) is MARGINALLY more
 *        prefactor-sensitive than sub-0.1 (2.079), the SAME ordering imp-33708 found for the floor,
 *        since sigma < 0.1 sits deeper where the residual E_flow drift is even smaller.
 *   (S3) BUT THE QUALITATIVE FACT IS ROBUST. For EVERY positive prefactor the crossings
 *        sigma = 0.5 and sigma < 0.1 both still EXIST and stay ordered (halving precedes
 *        sub-0.1): a vanishing E_coll ~ N^(-1/2) is dragged to zero by ANY positive prefactor, so
 *        sigma still decays monotonically through every threshold. Only the N-COORDINATE of each
 *        landmark moves; the existence and ordering of the far-tail decay milestones do not.
 *
 * VERDICT: ROBUST QUALITATIVELY, FRAGILE QUANTITATIVELY (and the prefactor mirrors the floor).
 * imp-33582's far-tail milestones EXIST for any positive prefactor and stay ordered, but their
 * precise N-locations obey the clean dimensional N ~ C_C^(+2.0) -- the exact mirror image of the
 * imp-33708 E_trunc^(-2.0) law -- so the exact "halves at 3.27e9, sub-0.1 at 3.21e11" pins are
 * model-dependent in the prefactor too, not structural. The far-tail landmark N is a function of
 * the single ratio C_C/E_trunc squared.
 *
 * ASSESSMENT ONLY. C_mb stays GUE-conditional (imp-486); no bound changes, no positivity,
 * no bridge closure, no RH claim, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (the far-tail landmarks perturbed here)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (COMPLEMENTARY E_trunc floor swap on the SAME landmarks, exponent ~ -2.0)
 * @see imp-33684-sigma-interior-peak-etrunc-model-sensitivity (E_trunc floor swap on the INTERIOR PEAK, exponent ~ -1.375)
 * @see imp-33606-sigma-postpeak-threshold-model-sensitivity (E_coll SUB-LEADING 1/log swap -- DIFFERENT axis, not the leading prefactor)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9, the sigma = 1/2 landmark)
 * @see imp-2714 (C_C_PINNED = (1/8)*sqrt(3*pi) ~ 0.3837, the perturbed prefactor); imp-486 (C_mb GUE-conditional)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC = 3.06e-5; // imp-2631 fixed-strip floor (imp-33582 pin), HELD FIXED here
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-33708 exactly

// EXACT imp-33582 sub-terms; ONLY the E_coll prefactor C_C is a parameter here.
function partsWith(N, C_C) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C * Math.sqrt(L / N);
  return { T0, L, E_flow, E_coll, sigma: E_coll / (E_TRUNC + E_flow + E_coll) };
}
const sigmaWith = (N, C_C) => partsWith(N, C_C).sigma;

// The sigma < thr crossing on the downslope, located by log10 bisection (sigma decreasing
// in N in the E_trunc-dominated tail) -- the identical bracketing imp-33582/imp-33708 used.
function crossLog10(thr, C_C, loExp = 6, hiExp = 16) {
  let lo = loExp;
  let hi = hiExp;
  for (let i = 0; i < 300; i++) {
    const m = (lo + hi) / 2;
    if (sigmaWith(Math.pow(10, m), C_C) > thr) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// factor 1.0 REPRODUCES imp-33582. The +/-1/5/10% sweep is the prefactor-uncertainty band
// asked for -- COMPLEMENTARY to the imp-33708 E_trunc floor rescaling on the SAME landmarks.
const PREFACTOR_FACTORS = [0.9, 0.95, 0.99, 1.0, 1.01, 1.05, 1.1];
const THRESHOLDS = [0.5, 0.1];

function landmarkTableFor(thr) {
  return PREFACTOR_FACTORS.map((f) => {
    const C_C = C_C_PINNED * f;
    const log10N = crossLog10(thr, C_C);
    const N = Math.pow(10, log10N);
    return {
      prefactorFactor: f,
      C_C: +C_C.toExponential(4),
      N_landmark: +N.toExponential(4),
      log10_N: +log10N.toFixed(4),
    };
  });
}

// Empirical scaling exponent p in N_landmark ~ C_C^p, from the +/-10% prefactors.
function scalingExponent(thr) {
  const lgLo = crossLog10(thr, 0.9 * C_C_PINNED) * Math.LN10;
  const lgHi = crossLog10(thr, 1.1 * C_C_PINNED) * Math.LN10;
  return (lgHi - lgLo) / (Math.log(1.1 * C_C_PINNED) - Math.log(0.9 * C_C_PINNED));
}

function bandFor(thr) {
  const table = landmarkTableFor(thr);
  const base = table.find((r) => r.prefactorFactor === 1.0);
  const lo = table.find((r) => r.prefactorFactor === 0.9); // smaller prefactor -> crossing EARLIER (smaller N)
  const hi = table.find((r) => r.prefactorFactor === 1.1); // larger prefactor -> crossing LATER (larger N)
  const allN = table.map((r) => r.log10_N);
  return {
    threshold: thr,
    table,
    baseline: base.N_landmark,
    scalingExponent: +scalingExponent(thr).toFixed(4),
    pm10pct: {
      prefactor_0_9x_N: lo.N_landmark, // ~2.62e9 / ~2.58e11 (EARLIER, opposite side to the imp-33708 floor)
      prefactor_1_1x_N: hi.N_landmark, // ~3.99e9 / ~3.92e11 (LATER)
      decadeWidth: +(hi.log10_N - lo.log10_N).toFixed(4), // ~0.183 / ~0.181
    },
    fullSweepDecades: +(Math.max(...allN) - Math.min(...allN)).toFixed(4), // ~0.18 (+/-10% span)
  };
}

const LANDMARK_0_5 = bandFor(0.5); // baseline ~3.267e9 (imp-33582 halving point)
const LANDMARK_0_1 = bandFor(0.1); // baseline ~3.213e11 (imp-33582 sub-0.1 crossing)

// Mechanism diagnostics: E_flow is negligible at both base landmarks (same as imp-33708).
const BASE_0_5 = partsWith(LANDMARK_0_5.baseline, C_C_PINNED);
const BASE_0_1 = partsWith(LANDMARK_0_1.baseline, C_C_PINNED);
const EFLOW_OVER_ETRUNC_0_5 = BASE_0_5.E_flow / E_TRUNC; // ~1.9e-3
const EFLOW_OVER_ETRUNC_0_1 = BASE_0_1.E_flow / E_TRUNC; // ~3.5e-5
const IMP33708_ETRUNC_EXPONENT_0_5 = -2.099; // imp-33708 far-tail E_trunc exponent (baked ref)
const IMP33708_ETRUNC_EXPONENT_0_1 = -2.079; // imp-33708 far-tail E_trunc exponent (baked ref)

export const IMP33724_SIGMA_FARTAIL_LANDMARK_CCOLL_PREFACTOR_SENSITIVITY = {
  id: 'imp-33724',
  proofSection: 'S-frontier',
  question:
    'Measure the sensitivity of the imp-33582 sigma(N) FAR-TAIL landmarks -- the halving ' +
    'point sigma = 0.5 at N ~ 3.27e9 and the sub-0.1 crossing sigma < 0.1 at N ~ 3.21e11 -- ' +
    'to the DOMINANT E_coll PREFACTOR C_C_PINNED (the GUE-conditional C_H) under +/-1/5/10% ' +
    'perturbations, and assess which landmark is more prefactor-sensitive and whether the ' +
    'landmark rungs are robust or model-dependent. COMPLEMENTARY to the imp-33708 E_trunc ' +
    'floor swap on the SAME landmarks. Measurement/sensitivity only; conditional-share ' +
    'diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'For C_C = C_C_PINNED * factor, factor in {0.9, 0.95, 0.99, 1, 1.01, 1.05, 1.1} ' +
    '(factor = 1 = imp-33582 baseline), the N at which sigma first drops below 0.5 and below ' +
    '0.1, log10-bisected per prefactor; plus the empirical exponent p in N_landmark ~ C_C^p ' +
    'and the +/-10% prefactor band in decades.',
  mechanism: {
    E_flow_over_E_trunc_at_sigma_0_5: +EFLOW_OVER_ETRUNC_0_5.toExponential(3), // ~1.9e-3
    E_flow_over_E_trunc_at_sigma_0_1: +EFLOW_OVER_ETRUNC_0_1.toExponential(3), // ~3.5e-5
    note:
      'E_flow is negligible at both far-tail landmarks, so the crossing is pure E_trunc-vs-E_coll ' +
      'balance: E_coll = E_trunc*thr/(1-thr) with E_coll = C_C*sqrt(logT0/N) gives ' +
      'N ~ (C_C/E_trunc)^2. So the landmark N is set by the single ratio C_C/E_trunc squared: the ' +
      'prefactor exponent +2 mirrors the imp-33708 E_trunc exponent -2 (same magnitude, opposite ' +
      'sign) because C_C is in the numerator and E_trunc in the denominator of that ratio.',
  },
  landmark_sigma_0_5: LANDMARK_0_5, // baseline ~3.267e9, exponent ~ +2.103
  landmark_sigma_0_1: LANDMARK_0_1, // baseline ~3.213e11, exponent ~ +2.079
  floorComparison: {
    prefactor_exponent_sigma_0_5: LANDMARK_0_5.scalingExponent, // ~ +2.103
    prefactor_exponent_sigma_0_1: LANDMARK_0_1.scalingExponent, // ~ +2.079
    imp33708_etrunc_exponent_sigma_0_5: IMP33708_ETRUNC_EXPONENT_0_5, // ~ -2.099
    imp33708_etrunc_exponent_sigma_0_1: IMP33708_ETRUNC_EXPONENT_0_1, // ~ -2.079
    moreSensitiveLandmark: 'sigma_0_5', // halving exponent 2.103 > sub-0.1 exponent 2.079 in magnitude
    note:
      'the C_C prefactor exponents (+2.103, +2.079) MIRROR the imp-33708 E_trunc exponents ' +
      '(-2.099, -2.079) in magnitude but flip sign, because the far-tail landmark depends only on ' +
      'the ratio C_C/E_trunc squared -- the prefactor is exactly as influential as the floor, ' +
      'opposite direction. Halving (sigma=0.5) is marginally MORE prefactor-sensitive than sub-0.1, ' +
      'the same ordering imp-33708 found for the floor.',
  },
  finding: {
    S0_baseline_reproduces_imp33582:
      'factor 1.0 relocates the crossings to N ~ 3.267e9 (sigma = 0.5) and N ~ 3.213e11 ' +
      '(sigma < 0.1) -- the exact imp-33582 far-tail landmarks -- confirming the inherited model ' +
      'is the factor = 1 member of the prefactor swap, so the rescaled prefactors are genuine ' +
      'perturbations.',
    S1_landmarks_scale_as_ccoll_plus_2:
      'Both far-tail landmarks obey the clean dimensional N ~ C_C^(+2.0): exponent ~ +2.103 ' +
      '(sigma = 0.5) and ~ +2.079 (sigma < 0.1), POSITIVE (raising C_C delays the crossing). A ' +
      '+/-10% prefactor moves each by ~ +22%/-20% (~0.18 decades), so the precise landmark ' +
      'N-values are model-dependent, but even a full +/-10% swing keeps each inside a fifth of a decade.',
    S2_prefactor_mirrors_the_floor:
      'The +2.103/+2.079 prefactor exponents MIRROR the imp-33708 E_trunc exponents -2.099/-2.079 ' +
      'in magnitude (differ by < 0.01) but flip sign, because the tail landmark N depends only on ' +
      'the ratio C_C/E_trunc squared. The prefactor is exactly as influential as the floor, opposite ' +
      'direction. Halving (sigma = 0.5, exponent 2.103) is MARGINALLY more prefactor-sensitive than ' +
      'sub-0.1 (2.079) -- the same ordering imp-33708 found -- since sub-0.1 sits deeper where the ' +
      'residual E_flow drift is even smaller.',
    S3_qualitative_milestones_robust:
      'For every positive prefactor the sigma = 0.5 and sigma < 0.1 crossings both still EXIST and ' +
      'stay ordered (halving precedes sub-0.1): a vanishing E_coll ~ N^(-1/2) is dragged to zero by ' +
      'ANY positive C_C, so sigma decays monotonically through every threshold. Only the N-coordinate ' +
      'moves; the existence and ordering of the far-tail decay milestones do not.',
  },
  isRigorous: false,
  verdict:
    'ROBUST QUALITATIVELY, FRAGILE QUANTITATIVELY (and the prefactor mirrors the floor). Perturbing ' +
    'the dominant E_coll prefactor C_C_PINNED by +/-1/5/10% (factor = 1 reproduces the imp-33582 ' +
    'halving point N ~ 3.267e9 and sub-0.1 crossing N ~ 3.213e11) on the FAR-TAIL landmarks: both ' +
    'crossings obey the clean dimensional N ~ C_C^(+2.0) (measured ~ +2.103 and ~ +2.079), the EXACT ' +
    'mirror image of the imp-33708 E_trunc^(-2.0) law because the tail landmark depends only on the ' +
    'ratio C_C/E_trunc squared -- the prefactor is exactly as influential as the floor, opposite ' +
    'direction. Halving (sigma = 0.5) is marginally more prefactor-sensitive than sub-0.1. A +/-10% ' +
    'prefactor moves each landmark ~0.18 decades, so the precise "halves at 3.27e9, sub-0.1 at ' +
    '3.21e11" pins are model-dependent in the prefactor too. BUT for any positive prefactor both ' +
    'crossings still EXIST and stay ordered -- the milestones themselves are structural, only their ' +
    'N-coordinates move. Assessment only; C_mb stays GUE-conditional (imp-486), no bound changes, no ' +
    'positivity, no RH claim, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33582 (far-tail landmarks perturbed here); imp-33708 (COMPLEMENTARY E_trunc floor swap on ' +
    'the SAME landmarks, exponent ~ -2.0); imp-33684 (E_trunc floor swap on the interior peak, ' +
    'exponent ~ -1.375); imp-33606 (E_coll SUB-LEADING 1/log swap -- different axis); imp-3444 ' +
    '(E_coll = E_trunc crossover N ~ 3.280e9, the sigma = 1/2 landmark); imp-486 (C_mb ' +
    'GUE-conditional); imp-2714 (C_C_PINNED = (1/8)*sqrt(3*pi) ~ 0.3837 prefactor); imp-2631 ' +
    '(E_trunc = 3.06e-5 fixed-strip floor); imp-398 (E_flow C_F prefactor); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP33724_SIGMA_FARTAIL_LANDMARK_CCOLL_PREFACTOR_SENSITIVITY_ASSERTIONS = [
  {
    // Reuse gate: factor 1.0 reproduces the imp-33582 far-tail landmarks (identical formulas).
    id: 'imp33724-reproduces-imp33582-landmarks',
    description: 'factor 1.0 reproduces imp-33582 sigma=0.5 @ N ~ 3.27e9 and sigma<0.1 @ N ~ 3.21e11',
    holds: () =>
      Math.abs(LANDMARK_0_5.baseline / 3.267e9 - 1) < 5e-3 &&
      Math.abs(LANDMARK_0_1.baseline / 3.213e11 - 1) < 5e-3,
  },
  {
    // S1: both far-tail landmarks scale as ~C_C^(+2) (clean dimensional, E_flow-negligible), POSITIVE.
    id: 'imp33724-fartail-scales-as-ccoll-plus-2',
    description: 'both landmark exponents p in N ~ C_C^p land in [+1.9, +2.2] (clean dimensional +2, positive)',
    holds: () =>
      LANDMARK_0_5.scalingExponent > 1.9 &&
      LANDMARK_0_5.scalingExponent < 2.2 &&
      LANDMARK_0_1.scalingExponent > 1.9 &&
      LANDMARK_0_1.scalingExponent < 2.2,
  },
  {
    // S2: the prefactor exponents MIRROR the imp-33708 E_trunc exponents (same magnitude, opposite sign).
    id: 'imp33724-prefactor-mirrors-etrunc-floor',
    description: 'C_C exponent magnitudes match imp-33708 E_trunc exponents within 0.05, opposite sign',
    holds: () =>
      Math.abs(LANDMARK_0_5.scalingExponent + IMP33708_ETRUNC_EXPONENT_0_5) < 0.05 &&
      Math.abs(LANDMARK_0_1.scalingExponent + IMP33708_ETRUNC_EXPONENT_0_1) < 0.05,
  },
  {
    // S2 (ordering): halving (sigma=0.5) is marginally MORE prefactor-sensitive than sub-0.1.
    id: 'imp33724-halving-more-prefactor-sensitive',
    description: 'sigma=0.5 exponent magnitude exceeds sigma<0.1 exponent magnitude (halving more sensitive)',
    holds: () => LANDMARK_0_5.scalingExponent > LANDMARK_0_1.scalingExponent,
  },
  {
    // Mechanism: E_flow is negligible at both landmarks (the reason the exponent is clean +2).
    id: 'imp33724-eflow-negligible-in-tail',
    description: 'E_flow/E_trunc < 1e-2 at sigma=0.5 landmark and < 1e-3 at sigma<0.1 landmark',
    holds: () => EFLOW_OVER_ETRUNC_0_5 < 1e-2 && EFLOW_OVER_ETRUNC_0_1 < 1e-3,
  },
  {
    // S1 (concrete): a +/-10% prefactor moves each landmark by ~0.18 decades, ordered 1.1x LATER than 0.9x.
    id: 'imp33724-pm10pct-band-order-and-width',
    description: '+/-10% prefactor: 1.1x crossing later than 0.9x, band ~0.15-0.22 decades for both landmarks',
    holds: () =>
      LANDMARK_0_5.pm10pct.prefactor_1_1x_N > LANDMARK_0_5.pm10pct.prefactor_0_9x_N &&
      LANDMARK_0_1.pm10pct.prefactor_1_1x_N > LANDMARK_0_1.pm10pct.prefactor_0_9x_N &&
      LANDMARK_0_5.pm10pct.decadeWidth > 0.15 && LANDMARK_0_5.pm10pct.decadeWidth < 0.22 &&
      LANDMARK_0_1.pm10pct.decadeWidth > 0.15 && LANDMARK_0_1.pm10pct.decadeWidth < 0.22,
  },
  {
    // S3: both crossings exist and stay ordered (halving before sub-0.1) for every swept prefactor.
    id: 'imp33724-landmarks-exist-and-ordered-every-prefactor',
    description: 'sigma=0.5 crossing precedes sigma<0.1 crossing for every prefactor factor (structural ordering)',
    holds: () =>
      PREFACTOR_FACTORS.every((f, i) => LANDMARK_0_5.table[i].N_landmark < LANDMARK_0_1.table[i].N_landmark),
  },
  {
    // Honesty gate: sensitivity/assessment only, split verdict, no QED, PT stays SOTA.
    id: 'imp33724-honesty-gate-no-qed',
    description: 'Assessment only: robust-qualitative/fragile-quantitative verdict, no QED, PT stays SOTA',
    holds: () =>
      IMP33724_SIGMA_FARTAIL_LANDMARK_CCOLL_PREFACTOR_SENSITIVITY.isRigorous === false &&
      /ROBUST QUALITATIVELY, FRAGILE QUANTITATIVELY/.test(
        IMP33724_SIGMA_FARTAIL_LANDMARK_CCOLL_PREFACTOR_SENSITIVITY.verdict,
      ) &&
      /NO QED/.test(IMP33724_SIGMA_FARTAIL_LANDMARK_CCOLL_PREFACTOR_SENSITIVITY.verdict) &&
      /remains SOTA/.test(IMP33724_SIGMA_FARTAIL_LANDMARK_CCOLL_PREFACTOR_SENSITIVITY.verdict),
  },
];

for (const a of IMP33724_SIGMA_FARTAIL_LANDMARK_CCOLL_PREFACTOR_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-33724-sigma-fartail-landmark-ccoll-prefactor-sensitivity assertion failed: ${a.id}`,
    );
  }
}
