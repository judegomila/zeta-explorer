/**
 * @module imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity
 *
 * imp-33708 (numerical, frontier-direction): imp-33582 pinned two FAR-TAIL landmarks of
 * the GUE-conditional share sigma(N) = E_coll/(E_trunc + E_flow + E_coll) -- the halving
 * point sigma = 0.5 at N ~ 3.27e9 and the sub-0.1 crossing sigma < 0.1 at N ~ 3.21e11 --
 * each located with a SINGLE truncation-floor value E_trunc = 3.06e-5 (the imp-2631
 * fixed-strip constant). imp-33684 already measured the E_trunc floor-MODEL-FORM
 * sensitivity of the INTERIOR PEAK (N_max ~ 9.22e5), finding a softened power law
 * N_max ~ E_trunc^(-1.375). This module runs the IDENTICAL floor-rescaling swap on the
 * two FAR-TAIL landmarks instead, re-locating each crossing per floor and measuring how
 * far they move -- a DISTINCT question from imp-33684 (peak, not tail) and from
 * imp-33606/imp-33647 (which swapped the E_coll sub-leading 1/log correction, NOT the
 * E_trunc floor). Sensitivity/measurement only.
 *
 * THE QUANTITY (identical formulas to imp-33582 / imp-3406 / imp-33684)
 * --------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0      = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)       (GUE-conditional, dominant)
 *     E_flow  = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5 * factor                    (perturbed floor; base imp-2631)
 * The ONLY thing varied here is the constant E_trunc floor; every other sub-term is
 * reused byte-for-byte from imp-33582, so factor = 1 reproduces the imp-33582 landmarks.
 *
 * WHY THE FAR-TAIL LANDMARKS SCALE AS E_trunc^(-2) (mechanism -- and why STEEPER than the peak)
 * --------------------------------------------------------------------------------------------
 * Deep in the tail E_flow is NEGLIGIBLE: at the base sigma = 0.5 landmark
 * E_flow/E_trunc ~ 1.9e-3, at the sigma < 0.1 landmark ~ 3.5e-5. So the crossing sigma = thr
 * is set by pure E_trunc-vs-E_coll balance: sigma = 1/(1 + E_trunc/E_coll) = thr forces
 * E_coll = E_trunc * thr/(1 - thr). Since E_coll = C_C sqrt(log T0 / N) ~ N^(-1/2), that gives
 * sqrt(1/N) proportional to E_trunc, i.e. N_landmark ~ E_trunc^(-2) up to slow log T0 drift.
 * Contrast the INTERIOR PEAK (imp-33684): there E_flow ~ 4.7e-5 is COMPARABLE to E_trunc, so
 * it enters the balance and SOFTENS the exponent to ~ -1.375. The far tail has no such
 * softening term, so its floor-sensitivity power law is the CLEAN dimensional ~ -2.0 --
 * STEEPER than the peak, not gentler.
 *
 * THE MEASUREMENT: each landmark under a 0.5x..5x floor sweep
 * ----------------------------------------------------------
 * For each floor factor and each threshold thr in {0.5, 0.1}, log10-bisect the N at which
 * sigma first drops below thr (sigma decreasing in N on the downslope). Report the per-floor
 * landmark table, the empirical scaling exponent p in N_landmark ~ E_trunc^p (from the 0.5x
 * and 2x floors), and the [0.9x, 1.1x] +/-10% floor band in decades.
 *
 * THE FINDING (measurement / sensitivity only)
 * --------------------------------------------
 *   (S0) BASELINE REPRODUCES imp-33582. factor 1.0 relocates the crossings to N ~ 3.267e9
 *        (sigma = 0.5) and N ~ 3.213e11 (sigma < 0.1) -- the exact imp-33582 far-tail
 *        landmarks -- confirming the inherited model is the factor = 1 member of the swap.
 *   (S1) BOTH FAR-TAIL LANDMARKS SCALE AS N ~ E_trunc^(-2.0). The measured exponent is
 *        ~ -2.099 (sigma = 0.5) and ~ -2.079 (sigma < 0.1) -- the CLEAN dimensional -2 the
 *        E_flow-negligible balance predicts. So a +/-10% floor moves each landmark by ~ +21%
 *        / -18% (sigma = 0.5: [4.08e9, 2.67e9]; sigma < 0.1: [4.00e11, 2.64e11]), ~0.18-0.19
 *        decades wide, and a 10x floor sweep spans ~2.1 decades of N. The precise landmark
 *        N-values are NOT robust to the floor MODEL FORM.
 *   (S2) THE FAR-TAIL LANDMARKS ARE STRICTLY MORE FLOOR-SENSITIVE THAN THE PEAK. Their
 *        ~ -2.0 exponent EXCEEDS the imp-33684 interior-peak ~ -1.375 in magnitude, because
 *        the tail balance drops the E_flow softening term the peak still carries. This is the
 *        opposite ordering from the imp-33606/imp-33647 E_coll-sub-leading swap, whose band
 *        SHRANK into the tail -- floor-form sensitivity GROWS with depth, sub-leading-form
 *        sensitivity shrinks: the two model-form axes move the tail in opposite directions.
 *   (S3) BUT THE QUALITATIVE FACT IS ROBUST. For EVERY positive constant floor the crossings
 *        sigma = 0.5 and sigma < 0.1 both still EXIST and stay ordered (halving precedes
 *        sub-0.1): a constant E_trunc always outlives the vanishing E_coll, so sigma still
 *        decays monotonically through every threshold. Only the N-COORDINATE of each landmark
 *        moves; the existence and ordering of the far-tail decay milestones do not.
 *
 * VERDICT: ROBUST QUALITATIVELY, FRAGILE QUANTITATIVELY (and MORE fragile than the peak).
 * imp-33582's far-tail milestones EXIST for any positive floor and stay ordered, but their
 * precise N-locations obey the clean dimensional N ~ E_trunc^(-2.0) -- steeper than the
 * imp-33684 peak's ~ -1.375 because the tail balance is E_flow-free -- so the exact
 * "halves at 3.27e9, sub-0.1 at 3.21e11" pins are model-dependent, not structural.
 *
 * ASSESSMENT ONLY. C_mb stays GUE-conditional (imp-486); no bound changes, no positivity,
 * no bridge closure, no RH claim, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (the far-tail landmarks perturbed here)
 * @see imp-33684-sigma-interior-peak-etrunc-model-sensitivity (SAME floor swap on the INTERIOR PEAK, exponent ~ -1.375)
 * @see imp-33606-sigma-postpeak-threshold-model-sensitivity (E_coll sub-leading 1/log swap on these landmarks -- DIFFERENT axis)
 * @see imp-33647-sigma-deep-tail-001-landmark-model-sensitivity (that sub-leading swap on the sigma<0.01 landmark; band SHRINKS with depth)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9, the sigma = 1/2 landmark)
 * @see imp-2631 (E_trunc = 3.06e-5 fixed-strip truncation floor, the perturbed model)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-33582 pin)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-33684 exactly

// EXACT imp-33582 sub-terms; ONLY the E_trunc floor is a parameter here.
function partsWith(N, E_trunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { T0, L, E_flow, E_coll, sigma: E_coll / (E_trunc + E_flow + E_coll) };
}
const sigmaWith = (N, E_trunc) => partsWith(N, E_trunc).sigma;

// The sigma < thr crossing on the downslope, located by log10 bisection (sigma decreasing
// in N in the E_trunc-dominated tail) -- the identical bracketing imp-33582 used.
function crossLog10(thr, E_trunc, loExp = 6, hiExp = 16) {
  let lo = loExp;
  let hi = hiExp;
  for (let i = 0; i < 300; i++) {
    const m = (lo + hi) / 2;
    if (sigmaWith(Math.pow(10, m), E_trunc) > thr) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// factor 1.0 REPRODUCES imp-33582. The 0.5x..5x sweep renders "alternative truncation
// orders / cutoff conventions" as floor rescalings (same rendering imp-33684 used).
const FLOOR_FACTORS = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0, 3.0, 5.0];
const THRESHOLDS = [0.5, 0.1];

function landmarkTableFor(thr) {
  return FLOOR_FACTORS.map((f) => {
    const E_trunc = E_TRUNC_BASE * f;
    const log10N = crossLog10(thr, E_trunc);
    const N = Math.pow(10, log10N);
    return {
      floorFactor: f,
      E_trunc: +E_trunc.toExponential(3),
      N_landmark: +N.toExponential(4),
      log10_N: +log10N.toFixed(4),
    };
  });
}

// Empirical scaling exponent p in N_landmark ~ E_trunc^p, from two well-separated floors.
function scalingExponent(thr) {
  const lgLo = crossLog10(thr, 0.5 * E_TRUNC_BASE) * Math.LN10;
  const lgHi = crossLog10(thr, 2.0 * E_TRUNC_BASE) * Math.LN10;
  return (lgHi - lgLo) / (Math.log(2.0 * E_TRUNC_BASE) - Math.log(0.5 * E_TRUNC_BASE));
}

function bandFor(thr) {
  const table = landmarkTableFor(thr);
  const base = table.find((r) => r.floorFactor === 1.0);
  const lo = table.find((r) => r.floorFactor === 0.9); // smaller floor -> crossing LATER (larger N)
  const hi = table.find((r) => r.floorFactor === 1.1); // larger floor -> crossing EARLIER (smaller N)
  const allN = table.map((r) => r.log10_N);
  return {
    threshold: thr,
    table,
    baseline: base.N_landmark,
    scalingExponent: +scalingExponent(thr).toFixed(4),
    pm10pct: {
      floor_0_9x_N: lo.N_landmark, // ~4.08e9 / ~4.00e11
      floor_1_1x_N: hi.N_landmark, // ~2.67e9 / ~2.64e11
      decadeWidth: +(lo.log10_N - hi.log10_N).toFixed(4), // ~0.183 / ~0.181
    },
    fullSweepDecades: +(Math.max(...allN) - Math.min(...allN)).toFixed(4), // ~2.10
  };
}

const LANDMARK_0_5 = bandFor(0.5); // baseline ~3.267e9 (imp-33582 halving point)
const LANDMARK_0_1 = bandFor(0.1); // baseline ~3.213e11 (imp-33582 sub-0.1 crossing)

// Mechanism diagnostics: E_flow is negligible at both base landmarks, unlike at the peak.
const BASE_0_5 = partsWith(LANDMARK_0_5.baseline, E_TRUNC_BASE);
const BASE_0_1 = partsWith(LANDMARK_0_1.baseline, E_TRUNC_BASE);
const EFLOW_OVER_ETRUNC_0_5 = BASE_0_5.E_flow / E_TRUNC_BASE; // ~1.9e-3
const EFLOW_OVER_ETRUNC_0_1 = BASE_0_1.E_flow / E_TRUNC_BASE; // ~3.5e-5
const IMP33684_PEAK_EXPONENT = -1.375; // imp-33684 interior-peak floor-scaling exponent (baked ref)

export const IMP33708_SIGMA_FARTAIL_LANDMARK_ETRUNC_MODEL_SENSITIVITY = {
  id: 'imp-33708',
  proofSection: 'S-frontier',
  question:
    'Measure the sensitivity of the imp-33582 sigma(N) FAR-TAIL landmarks -- the halving ' +
    'point sigma = 0.5 at N ~ 3.27e9 and the sub-0.1 crossing sigma < 0.1 at N ~ 3.21e11 -- ' +
    'to the E_trunc truncation-floor MODEL FORM (0.5x..5x rescaling of the imp-2631 floor), ' +
    'and assess whether the landmark rungs are robust or model-dependent. Distinct from the ' +
    'imp-33684 interior-peak sensitivity (peak, not tail) and from the imp-33606/imp-33647 ' +
    'E_coll sub-leading swap (different model-form axis). Measurement/sensitivity only; ' +
    'conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'For E_trunc = 3.06e-5 * factor, factor in {0.5..5} (factor = 1 = imp-33582 baseline), the ' +
    'N at which sigma first drops below 0.5 and below 0.1, log10-bisected per floor; plus the ' +
    'empirical exponent p in N_landmark ~ E_trunc^p and the +/-10% floor band in decades.',
  mechanism: {
    E_flow_over_E_trunc_at_sigma_0_5: +EFLOW_OVER_ETRUNC_0_5.toExponential(3), // ~1.9e-3
    E_flow_over_E_trunc_at_sigma_0_1: +EFLOW_OVER_ETRUNC_0_1.toExponential(3), // ~3.5e-5
    note:
      'E_flow is negligible at both far-tail landmarks, so the crossing is pure E_trunc-vs-E_coll ' +
      'balance: E_coll = E_trunc*thr/(1-thr) with E_coll ~ N^(-1/2) gives N ~ E_trunc^(-2). At the ' +
      'interior peak (imp-33684) E_flow ~ 4.7e-5 is comparable to E_trunc and softens the exponent ' +
      'to ~ -1.375; the tail has no such softening, so its floor-scaling is steeper.',
  },
  landmark_sigma_0_5: LANDMARK_0_5, // baseline ~3.267e9, exponent ~ -2.099
  landmark_sigma_0_1: LANDMARK_0_1, // baseline ~3.213e11, exponent ~ -2.079
  peakComparison: {
    fartail_exponent_sigma_0_5: LANDMARK_0_5.scalingExponent, // ~ -2.099
    fartail_exponent_sigma_0_1: LANDMARK_0_1.scalingExponent, // ~ -2.079
    imp33684_peak_exponent: IMP33684_PEAK_EXPONENT, // ~ -1.375
    note:
      'both far-tail landmarks scale as ~E_trunc^(-2.0), STEEPER (more floor-sensitive) than the ' +
      'imp-33684 interior peak ~E_trunc^(-1.375) -- floor-form sensitivity GROWS with depth, ' +
      'opposite to the imp-33647 sub-leading-form band that SHRINKS with depth',
  },
  finding: {
    S0_baseline_reproduces_imp33582:
      'factor 1.0 relocates the crossings to N ~ 3.267e9 (sigma = 0.5) and N ~ 3.213e11 ' +
      '(sigma < 0.1) -- the exact imp-33582 far-tail landmarks -- confirming the inherited model ' +
      'is the factor = 1 member of the floor swap, so the rescaled floors are genuine perturbations.',
    S1_landmarks_scale_as_etrunc_minus_2:
      'Both far-tail landmarks obey the clean dimensional N ~ E_trunc^(-2.0): exponent ~ -2.099 ' +
      '(sigma = 0.5) and ~ -2.079 (sigma < 0.1). A +/-10% floor moves each by ~ +21%/-18% ' +
      '(~0.18-0.19 decades), and a 10x floor sweep spans ~2.1 decades of N -- the precise landmark ' +
      'N-values are NOT robust to the floor model form.',
    S2_fartail_more_floor_sensitive_than_peak:
      'The far-tail ~ -2.0 exponent EXCEEDS the imp-33684 interior-peak ~ -1.375 in magnitude, ' +
      'because the tail balance drops the E_flow softening term the peak still carries ' +
      '(E_flow/E_trunc ~ 1.9e-3 at sigma = 0.5, ~ 3.5e-5 at sigma < 0.1). Floor-form sensitivity ' +
      'GROWS with depth -- the OPPOSITE of the imp-33606/imp-33647 E_coll sub-leading swap, whose ' +
      'band shrank into the tail: the two model-form axes move the tail in opposite directions.',
    S3_qualitative_milestones_robust:
      'For every positive constant floor the sigma = 0.5 and sigma < 0.1 crossings both still EXIST ' +
      'and stay ordered (halving precedes sub-0.1): a constant E_trunc always outlives the vanishing ' +
      'E_coll, so sigma decays monotonically through every threshold. Only the N-coordinate moves; ' +
      'the existence and ordering of the far-tail decay milestones do not.',
  },
  isRigorous: false,
  verdict:
    'ROBUST QUALITATIVELY, FRAGILE QUANTITATIVELY (and MORE fragile than the peak). Running the ' +
    'imp-33684 E_trunc floor swap (0.5x..5x, factor = 1 reproduces the imp-33582 halving point ' +
    'N ~ 3.267e9 and sub-0.1 crossing N ~ 3.213e11) on the FAR-TAIL landmarks instead of the peak: ' +
    'both crossings obey the clean dimensional N ~ E_trunc^(-2.0) (measured ~ -2.099 and ~ -2.079), ' +
    'STEEPER than the imp-33684 interior peak ~ -1.375 because the tail balance is E_flow-free ' +
    '(E_flow/E_trunc ~ 1.9e-3 and ~ 3.5e-5 at the two landmarks). A +/-10% floor moves each landmark ' +
    '~0.18 decades and a 10x sweep ~2.1 decades, so the precise "halves at 3.27e9, sub-0.1 at ' +
    '3.21e11" pins are model-dependent. BUT for any positive floor both crossings still EXIST and ' +
    'stay ordered -- the milestones themselves are structural, only their N-coordinates move. Note ' +
    'floor-form sensitivity GROWS with depth here, opposite to the imp-33606/imp-33647 E_coll ' +
    'sub-leading swap whose band shrank with depth. Assessment only; C_mb stays GUE-conditional ' +
    '(imp-486), no bound changes, no positivity, no RH claim, NO QED. Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA.',
  citation:
    'imp-33582 (far-tail landmarks perturbed here); imp-33684 (SAME floor swap on the interior ' +
    'peak, exponent ~ -1.375); imp-33606 (E_coll sub-leading 1/log swap on these landmarks -- ' +
    'different axis); imp-33647 (that sub-leading swap on the sigma<0.01 landmark, band shrinks with ' +
    'depth); imp-3444 (E_coll = E_trunc crossover N ~ 3.280e9, the sigma = 1/2 landmark); imp-486 ' +
    '(C_mb GUE-conditional); imp-2631 (E_trunc = 3.06e-5 fixed-strip floor); imp-398 (E_flow C_F ' +
    'prefactor); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33708_SIGMA_FARTAIL_LANDMARK_ETRUNC_MODEL_SENSITIVITY_ASSERTIONS = [
  {
    // Reuse gate: factor 1.0 reproduces the imp-33582 far-tail landmarks (identical formulas).
    id: 'imp33708-reproduces-imp33582-landmarks',
    description: 'factor 1.0 reproduces imp-33582 sigma=0.5 @ N ~ 3.27e9 and sigma<0.1 @ N ~ 3.21e11',
    holds: () =>
      Math.abs(LANDMARK_0_5.baseline / 3.267e9 - 1) < 5e-3 &&
      Math.abs(LANDMARK_0_1.baseline / 3.213e11 - 1) < 5e-3,
  },
  {
    // S1: both far-tail landmarks scale as ~E_trunc^(-2) (clean dimensional, E_flow-negligible).
    id: 'imp33708-fartail-scales-as-etrunc-minus-2',
    description: 'both landmark exponents p in N ~ E_trunc^p land in [-2.2, -1.9] (clean dimensional -2)',
    holds: () =>
      LANDMARK_0_5.scalingExponent < -1.9 &&
      LANDMARK_0_5.scalingExponent > -2.2 &&
      LANDMARK_0_1.scalingExponent < -1.9 &&
      LANDMARK_0_1.scalingExponent > -2.2,
  },
  {
    // S2: the far-tail landmarks are strictly MORE floor-sensitive than the imp-33684 peak.
    id: 'imp33708-fartail-steeper-than-peak',
    description: 'both far-tail exponents exceed the imp-33684 peak ~ -1.375 in magnitude',
    holds: () =>
      LANDMARK_0_5.scalingExponent < IMP33684_PEAK_EXPONENT &&
      LANDMARK_0_1.scalingExponent < IMP33684_PEAK_EXPONENT,
  },
  {
    // Mechanism: E_flow is negligible at both landmarks (the reason the exponent is clean -2).
    id: 'imp33708-eflow-negligible-in-tail',
    description: 'E_flow/E_trunc < 1e-2 at sigma=0.5 landmark and < 1e-3 at sigma<0.1 landmark',
    holds: () => EFLOW_OVER_ETRUNC_0_5 < 1e-2 && EFLOW_OVER_ETRUNC_0_1 < 1e-3,
  },
  {
    // S1 (concrete): a +/-10% floor moves each landmark by ~0.18 decades, ordered lo(0.9x) > hi(1.1x).
    id: 'imp33708-pm10pct-band-order-and-width',
    description: '+/-10% floor: 0.9x crossing later than 1.1x, band ~0.15-0.22 decades for both landmarks',
    holds: () =>
      LANDMARK_0_5.pm10pct.floor_0_9x_N > LANDMARK_0_5.pm10pct.floor_1_1x_N &&
      LANDMARK_0_1.pm10pct.floor_0_9x_N > LANDMARK_0_1.pm10pct.floor_1_1x_N &&
      LANDMARK_0_5.pm10pct.decadeWidth > 0.15 && LANDMARK_0_5.pm10pct.decadeWidth < 0.22 &&
      LANDMARK_0_1.pm10pct.decadeWidth > 0.15 && LANDMARK_0_1.pm10pct.decadeWidth < 0.22,
  },
  {
    // S3: both crossings exist and stay ordered (halving before sub-0.1) for every swept floor.
    id: 'imp33708-landmarks-exist-and-ordered-every-floor',
    description: 'sigma=0.5 crossing precedes sigma<0.1 crossing for every floor factor (structural ordering)',
    holds: () =>
      FLOOR_FACTORS.every((f, i) => LANDMARK_0_5.table[i].N_landmark < LANDMARK_0_1.table[i].N_landmark),
  },
  {
    // Honesty gate: sensitivity/assessment only, split verdict, no QED, PT stays SOTA.
    id: 'imp33708-honesty-gate-no-qed',
    description: 'Assessment only: robust-qualitative/fragile-quantitative verdict, no QED, PT stays SOTA',
    holds: () =>
      IMP33708_SIGMA_FARTAIL_LANDMARK_ETRUNC_MODEL_SENSITIVITY.isRigorous === false &&
      /ROBUST QUALITATIVELY, FRAGILE QUANTITATIVELY/.test(
        IMP33708_SIGMA_FARTAIL_LANDMARK_ETRUNC_MODEL_SENSITIVITY.verdict,
      ) &&
      /NO QED/.test(IMP33708_SIGMA_FARTAIL_LANDMARK_ETRUNC_MODEL_SENSITIVITY.verdict) &&
      /remains SOTA/.test(IMP33708_SIGMA_FARTAIL_LANDMARK_ETRUNC_MODEL_SENSITIVITY.verdict),
  },
];

for (const a of IMP33708_SIGMA_FARTAIL_LANDMARK_ETRUNC_MODEL_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity assertion failed: ${a.id}`,
    );
  }
}
