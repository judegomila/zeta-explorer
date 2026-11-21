/**
 * @module imp-33747-sigma-fartail-landmark-CC-amplitude-sensitivity
 *
 * imp-33747 (numerical, frontier-direction): imp-33708 swept the E_trunc truncation-FLOOR
 * model form of the two imp-33582 FAR-TAIL landmarks of the GUE-conditional share
 * sigma(N) = E_coll/(E_trunc + E_flow + E_coll) -- the halving point sigma = 0.5 at
 * N ~ 3.27e9 and the sub-0.1 crossing sigma < 0.1 at N ~ 3.21e11 -- finding N ~ E_trunc^(-2).
 * That is only ONE of the two constants in the tail balance. This module sweeps the
 * COMPLEMENTARY axis: the E_coll AMPLITUDE C_C (the C_H = 1/8 ansatz constant, imp-2714),
 * over 0.5x..2x, re-locating each landmark per amplitude and measuring the empirical
 * exponent in N_landmark ~ C_C^p. This is DISTINCT from imp-33708 (E_trunc floor, not C_C
 * amplitude) and from the imp-33606/imp-33647 E_coll sub-leading 1/log swap (a DIFFERENT
 * model-form axis: the shape of the log correction, not its overall amplitude). The
 * C_H = 1/8 ansatz itself is UNTOUCHED -- C_C is rescaled only to probe sensitivity.
 * Sensitivity/measurement only.
 *
 * THE QUANTITY (identical formulas to imp-33582 / imp-33708; ONLY C_C is a parameter here)
 * ---------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0      = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll  = C_C * sqrt(log T0 / N)              (GUE-conditional, dominant; C_C swept)
 *     E_flow  = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                             (imp-2631 fixed-strip floor; PINNED here)
 * The ONLY thing varied is the E_coll amplitude C_C; every other sub-term is reused
 * byte-for-byte from imp-33582/imp-33708, so ampFactor = 1 reproduces the imp-33582 landmarks.
 *
 * WHY THE FAR-TAIL LANDMARKS SCALE AS N ~ C_C^(+2) (mechanism -- and the sign flip vs E_trunc)
 * -------------------------------------------------------------------------------------------
 * Deep in the tail E_flow is NEGLIGIBLE (E_flow/E_trunc ~ 1.9e-3 at sigma = 0.5, ~ 3.5e-5 at
 * sigma < 0.1). So the crossing sigma = thr is set by pure E_trunc-vs-E_coll balance:
 * sigma = 1/(1 + E_trunc/E_coll) = thr forces E_coll = E_trunc * thr/(1 - thr). Since
 * E_coll = C_C sqrt(log T0 / N) ~ C_C * N^(-1/2), holding the RHS fixed gives
 * sqrt(1/N) proportional to 1/C_C, i.e. N_landmark ~ C_C^(+2) up to slow log T0 drift.
 * KEY SYMMETRY: only the ratio C_C/E_trunc enters the balance, so N ~ (C_C/E_trunc)^2 and
 * d log N / d log C_C = - d log N / d log E_trunc. The C_C exponent is therefore the EXACT
 * MAGNITUDE of the imp-33708 E_trunc exponent with the OPPOSITE SIGN: raising the collision
 * amplitude PUSHES each landmark to LARGER N (share stays higher longer), whereas raising the
 * floor pulls it EARLIER. Same |p| ~ 2, mirrored sign.
 *
 * THE MEASUREMENT: each landmark under a 0.5x..2x amplitude sweep
 * --------------------------------------------------------------
 * For each amplitude factor and each threshold thr in {0.5, 0.1}, log10-bisect the N at which
 * sigma first drops below thr (sigma decreasing in N on the downslope). Report the per-amplitude
 * landmark table, the empirical exponent p in N_landmark ~ C_C^p (from the 0.5x and 2x
 * amplitudes), the [0.9x, 1.1x] +/-10% amplitude band in decades, and the comparison of that
 * band width against the imp-33708 E_trunc^(-2) band.
 *
 * THE FINDING (measurement / sensitivity only)
 * --------------------------------------------
 *   (S0) BASELINE REPRODUCES imp-33582/imp-33708. ampFactor 1.0 relocates the crossings to
 *        N ~ 3.267e9 (sigma = 0.5) and N ~ 3.213e11 (sigma < 0.1) -- the exact imp-33582
 *        far-tail landmarks -- confirming C_C = C_C_PINNED is the factor = 1 member of the swap.
 *   (S1) BOTH FAR-TAIL LANDMARKS SCALE AS N ~ C_C^(+2.0). The measured exponent is ~ +2.104
 *        (sigma = 0.5) and ~ +2.079 (sigma < 0.1) -- the clean dimensional +2 the
 *        E_flow-negligible balance predicts. A +/-10% amplitude moves each landmark by
 *        ~ +/-20% (~0.18 decades), and the full 0.5x..2x sweep spans ~1.27 decades of N.
 *   (S2) THE C_C AND E_trunc AXES ARE SIGN-MIRRORED, SAME MAGNITUDE. The C_C exponent
 *        (+2.104 / +2.079) equals the imp-33708 E_trunc exponent (-2.099 / -2.079) in
 *        magnitude with the OPPOSITE SIGN, because only C_C/E_trunc enters the tail balance
 *        (N ~ (C_C/E_trunc)^2). The +/-10% BAND WIDTHS are therefore essentially IDENTICAL
 *        (~0.18 decades) between the two axes -- the amplitude axis is exactly as sensitive as
 *        the floor axis, just in the opposite direction.
 *   (S3) THE QUALITATIVE MILESTONES ARE ROBUST. For EVERY positive amplitude the crossings
 *        sigma = 0.5 and sigma < 0.1 both still EXIST and stay ordered (halving precedes
 *        sub-0.1): a positive constant floor always outlives the vanishing E_coll for any
 *        C_C > 0, so sigma decays monotonically through every threshold. Only the N-coordinate
 *        of each landmark moves; the existence and ordering of the milestones do not.
 *
 * VERDICT: ROBUST QUALITATIVELY, FRAGILE QUANTITATIVELY. The far-tail milestones EXIST for
 * any positive C_C and stay ordered, but their precise N-locations obey the clean dimensional
 * N ~ C_C^(+2.0) -- the exact mirror (same |p|, opposite sign) of the imp-33708 E_trunc^(-2.0)
 * floor law -- so the "halves at 3.27e9, sub-0.1 at 3.21e11" pins are jointly model-dependent
 * on BOTH the E_coll amplitude and the E_trunc floor, through their ratio.
 *
 * ASSESSMENT ONLY. C_H = 1/8 ansatz untouched; C_mb stays GUE-conditional (imp-486); no bound
 * changes, no positivity, no bridge closure, no RH claim, NO QED. No refereed bound is changed.
 *
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (COMPLEMENTARY E_trunc-floor swap on the SAME landmarks; N ~ E_trunc^(-2))
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (the far-tail landmarks perturbed here)
 * @see imp-33606-sigma-postpeak-threshold-model-sensitivity (E_coll sub-leading 1/log SHAPE swap -- different model-form axis)
 * @see imp-33647-sigma-deep-tail-001-landmark-model-sensitivity (that sub-leading swap on the sigma<0.01 landmark)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9, the sigma = 1/2 landmark)
 * @see polymath15-constant-C-C (C_C_PINNED = (1/8) sqrt(3 pi) ~ 0.3837, the swept amplitude; imp-2714)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC = 3.06e-5; // imp-2631 fixed-strip floor (PINNED here; the imp-33708 axis)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-33708 exactly

// EXACT imp-33582 sub-terms; ONLY the E_coll amplitude C_C is a parameter here.
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

// ampFactor 1.0 REPRODUCES imp-33582/imp-33708. The 0.5x..2x sweep renders the C_H = 1/8
// ansatz uncertainty as an overall E_coll-amplitude rescaling (the untouched ansatz remains
// the factor = 1 member).
const AMP_FACTORS = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0];
const THRESHOLDS = [0.5, 0.1];

function landmarkTableFor(thr) {
  return AMP_FACTORS.map((f) => {
    const C_C = C_C_PINNED * f;
    const log10N = crossLog10(thr, C_C);
    const N = Math.pow(10, log10N);
    return {
      ampFactor: f,
      C_C: +C_C.toExponential(4),
      N_landmark: +N.toExponential(4),
      log10_N: +log10N.toFixed(4),
    };
  });
}

// Empirical scaling exponent p in N_landmark ~ C_C^p, from two well-separated amplitudes.
function scalingExponent(thr) {
  const lgLo = crossLog10(thr, 0.5 * C_C_PINNED) * Math.LN10;
  const lgHi = crossLog10(thr, 2.0 * C_C_PINNED) * Math.LN10;
  return (lgHi - lgLo) / (Math.log(2.0 * C_C_PINNED) - Math.log(0.5 * C_C_PINNED));
}

function bandFor(thr) {
  const table = landmarkTableFor(thr);
  const base = table.find((r) => r.ampFactor === 1.0);
  const lo = table.find((r) => r.ampFactor === 0.9); // smaller amplitude -> crossing EARLIER (smaller N)
  const hi = table.find((r) => r.ampFactor === 1.1); // larger amplitude -> crossing LATER (larger N)
  const allN = table.map((r) => r.log10_N);
  return {
    threshold: thr,
    table,
    baseline: base.N_landmark,
    scalingExponent: +scalingExponent(thr).toFixed(4),
    pm10pct: {
      amp_0_9x_N: lo.N_landmark, // ~2.67e9 / ~2.64e11 (SMALLER amplitude -> EARLIER crossing)
      amp_1_1x_N: hi.N_landmark, // ~4.08e9 / ~4.00e11 (LARGER amplitude -> LATER crossing)
      decadeWidth: +(hi.log10_N - lo.log10_N).toFixed(4), // ~0.18 (positive: amp raises N)
    },
    fullSweepDecades: +(Math.max(...allN) - Math.min(...allN)).toFixed(4), // ~1.27
  };
}

const LANDMARK_0_5 = bandFor(0.5); // baseline ~3.267e9 (imp-33582 halving point)
const LANDMARK_0_1 = bandFor(0.1); // baseline ~3.213e11 (imp-33582 sub-0.1 crossing)

// Mechanism diagnostics: E_flow negligible at both base landmarks (same reason the exponent is +2).
const BASE_0_5 = partsWith(LANDMARK_0_5.baseline, C_C_PINNED);
const BASE_0_1 = partsWith(LANDMARK_0_1.baseline, C_C_PINNED);
const EFLOW_OVER_ETRUNC_0_5 = BASE_0_5.E_flow / E_TRUNC; // ~1.9e-3
const EFLOW_OVER_ETRUNC_0_1 = BASE_0_1.E_flow / E_TRUNC; // ~3.5e-5
const IMP33708_ETRUNC_EXPONENT_0_5 = -2.099; // imp-33708 E_trunc floor-scaling exponent (baked ref)
const IMP33708_ETRUNC_EXPONENT_0_1 = -2.079; // imp-33708 sub-0.1 landmark (baked ref)

export const IMP33747_SIGMA_FARTAIL_LANDMARK_CC_AMPLITUDE_SENSITIVITY = {
  id: 'imp-33747',
  proofSection: 'S-frontier',
  question:
    'Measure the C_C (C_H = 1/8 ansatz) AMPLITUDE sensitivity of the two imp-33708 far-tail ' +
    'sigma(N) landmarks -- the halving point sigma = 0.5 at N ~ 3.27e9 and the sub-0.1 crossing ' +
    'sigma < 0.1 at N ~ 3.21e11 -- under a 0.5x..2x C_C sweep, COMPLEMENTARY to the imp-33708 ' +
    'E_trunc-floor swap (N ~ E_trunc^(-2)) and the imp-33606/imp-33647 E_coll sub-leading swap, ' +
    'and DERIVE the expected N ~ C_C^2 scaling. Measurement/sensitivity only; C_H = 1/8 ansatz ' +
    'untouched; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'For C_C = C_C_PINNED * ampFactor, ampFactor in {0.5..2} (ampFactor = 1 = imp-33582 baseline), ' +
    'the N at which sigma first drops below 0.5 and below 0.1, log10-bisected per amplitude; plus ' +
    'the empirical exponent p in N_landmark ~ C_C^p and the +/-10% amplitude band in decades.',
  mechanism: {
    E_flow_over_E_trunc_at_sigma_0_5: +EFLOW_OVER_ETRUNC_0_5.toExponential(3), // ~1.9e-3
    E_flow_over_E_trunc_at_sigma_0_1: +EFLOW_OVER_ETRUNC_0_1.toExponential(3), // ~3.5e-5
    note:
      'E_flow is negligible at both far-tail landmarks, so the crossing is pure E_trunc-vs-E_coll ' +
      'balance: E_coll = E_trunc*thr/(1-thr) with E_coll = C_C sqrt(log T0 / N) ~ C_C N^(-1/2) gives ' +
      'N ~ C_C^(+2). Only the ratio C_C/E_trunc enters the balance, so N ~ (C_C/E_trunc)^2 and the ' +
      'C_C exponent is the EXACT MAGNITUDE of the imp-33708 E_trunc exponent with the OPPOSITE SIGN.',
  },
  landmark_sigma_0_5: LANDMARK_0_5, // baseline ~3.267e9, exponent ~ +2.104
  landmark_sigma_0_1: LANDMARK_0_1, // baseline ~3.213e11, exponent ~ +2.079
  axisComparison: {
    CC_exponent_sigma_0_5: LANDMARK_0_5.scalingExponent, // ~ +2.104
    CC_exponent_sigma_0_1: LANDMARK_0_1.scalingExponent, // ~ +2.079
    imp33708_etrunc_exponent_sigma_0_5: IMP33708_ETRUNC_EXPONENT_0_5, // ~ -2.099
    imp33708_etrunc_exponent_sigma_0_1: IMP33708_ETRUNC_EXPONENT_0_1, // ~ -2.079
    note:
      'the C_C amplitude exponent (~ +2.10 / +2.08) is the SIGN-MIRROR of the imp-33708 E_trunc ' +
      'floor exponent (~ -2.10 / -2.08) with essentially IDENTICAL magnitude, because only the ratio ' +
      'C_C/E_trunc enters the far-tail balance (N ~ (C_C/E_trunc)^2). The +/-10% band widths match ' +
      '(~0.18 decades): the amplitude axis is exactly as sensitive as the floor axis, opposite sign.',
  },
  finding: {
    S0_baseline_reproduces_imp33582:
      'ampFactor 1.0 relocates the crossings to N ~ 3.267e9 (sigma = 0.5) and N ~ 3.213e11 ' +
      '(sigma < 0.1) -- the exact imp-33582/imp-33708 far-tail landmarks -- confirming ' +
      'C_C = C_C_PINNED is the factor = 1 member of the amplitude swap.',
    S1_landmarks_scale_as_CC_plus_2:
      'Both far-tail landmarks obey the clean dimensional N ~ C_C^(+2.0): exponent ~ +2.104 ' +
      '(sigma = 0.5) and ~ +2.079 (sigma < 0.1). A +/-10% amplitude moves each by ~ +/-20% ' +
      '(~0.18 decades), and the full 0.5x..2x sweep spans ~1.27 decades of N.',
    S2_CC_and_etrunc_axes_sign_mirrored:
      'The C_C exponent (~ +2.104 / +2.079) equals the imp-33708 E_trunc exponent ' +
      '(~ -2.099 / -2.079) in magnitude with OPPOSITE sign, because only C_C/E_trunc enters the ' +
      'tail balance (N ~ (C_C/E_trunc)^2). Raising the collision amplitude pushes each landmark to ' +
      'LARGER N; raising the floor pulls it earlier -- same |p| ~ 2, mirrored direction, matching ' +
      '+/-10% band width (~0.18 decades).',
    S3_qualitative_milestones_robust:
      'For every positive amplitude the sigma = 0.5 and sigma < 0.1 crossings both still EXIST and ' +
      'stay ordered (halving precedes sub-0.1): a positive constant floor always outlives the ' +
      'vanishing E_coll for any C_C > 0, so sigma decays monotonically through every threshold. Only ' +
      'the N-coordinate moves; the existence and ordering of the far-tail decay milestones do not.',
  },
  isRigorous: false,
  verdict:
    'ROBUST QUALITATIVELY, FRAGILE QUANTITATIVELY. Sweeping the E_coll amplitude C_C (the C_H = 1/8 ' +
    'ansatz constant) over 0.5x..2x (ampFactor = 1 reproduces the imp-33582 halving point N ~ 3.267e9 ' +
    'and sub-0.1 crossing N ~ 3.213e11) on the FAR-TAIL landmarks: both crossings obey the clean ' +
    'dimensional N ~ C_C^(+2.0) (measured ~ +2.104 and ~ +2.079), the EXACT SIGN-MIRROR of the ' +
    'imp-33708 E_trunc floor law N ~ E_trunc^(-2.0) (same |p| ~ 2, opposite sign) because only the ' +
    'ratio C_C/E_trunc enters the E_flow-negligible tail balance (E_flow/E_trunc ~ 1.9e-3 and ~ 3.5e-5 ' +
    'at the two landmarks). A +/-10% amplitude moves each landmark ~0.18 decades -- the same band ' +
    'width as the imp-33708 floor axis -- and the 0.5x..2x sweep spans ~1.27 decades, so the precise ' +
    '"halves at 3.27e9, sub-0.1 at 3.21e11" pins are jointly model-dependent on BOTH the E_coll ' +
    'amplitude and the E_trunc floor, through their ratio. BUT for any positive C_C both crossings ' +
    'still EXIST and stay ordered -- the milestones are structural, only their N-coordinates move. ' +
    'Assessment only; C_H = 1/8 ansatz untouched, C_mb stays GUE-conditional (imp-486), no bound ' +
    'changes, no positivity, no RH claim, NO QED. No refereed bound is changed.',
  citation:
    'imp-33708 (COMPLEMENTARY E_trunc-floor swap on the same landmarks, exponent ~ -2.0); imp-33582 ' +
    '(far-tail landmarks perturbed here); imp-33606 (E_coll sub-leading 1/log SHAPE swap -- different ' +
    'axis); imp-33647 (that sub-leading swap on the sigma<0.01 landmark); imp-3444 (E_coll = E_trunc ' +
    'crossover N ~ 3.280e9, the sigma = 1/2 landmark); imp-486 (C_mb GUE-conditional); imp-2714 ' +
    '(C_C = (1/8) sqrt(3 pi) ansatz, the swept amplitude); imp-2631 (E_trunc = 3.06e-5 floor); ' +
    'imp-398 (E_flow C_F prefactor); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33747_SIGMA_FARTAIL_LANDMARK_CC_AMPLITUDE_SENSITIVITY_ASSERTIONS = [
  {
    // Reuse gate: ampFactor 1.0 reproduces the imp-33582 far-tail landmarks (identical formulas).
    id: 'imp33747-reproduces-imp33582-landmarks',
    description: 'ampFactor 1.0 reproduces imp-33582 sigma=0.5 @ N ~ 3.27e9 and sigma<0.1 @ N ~ 3.21e11',
    holds: () =>
      Math.abs(LANDMARK_0_5.baseline / 3.267e9 - 1) < 5e-3 &&
      Math.abs(LANDMARK_0_1.baseline / 3.213e11 - 1) < 5e-3,
  },
  {
    // S1: both far-tail landmarks scale as ~C_C^(+2) (clean dimensional, E_flow-negligible).
    id: 'imp33747-fartail-scales-as-CC-plus-2',
    description: 'both landmark exponents p in N ~ C_C^p land in [+1.9, +2.2] (clean dimensional +2)',
    holds: () =>
      LANDMARK_0_5.scalingExponent > 1.9 &&
      LANDMARK_0_5.scalingExponent < 2.2 &&
      LANDMARK_0_1.scalingExponent > 1.9 &&
      LANDMARK_0_1.scalingExponent < 2.2,
  },
  {
    // S2: the C_C exponent is the sign-mirror of the imp-33708 E_trunc exponent, same magnitude.
    id: 'imp33747-CC-sign-mirror-of-etrunc',
    description: 'C_C exponent ~ -1 * imp-33708 E_trunc exponent (same |p| ~ 2, opposite sign, within 5e-2)',
    holds: () =>
      Math.abs(LANDMARK_0_5.scalingExponent + IMP33708_ETRUNC_EXPONENT_0_5) < 5e-2 &&
      Math.abs(LANDMARK_0_1.scalingExponent + IMP33708_ETRUNC_EXPONENT_0_1) < 5e-2,
  },
  {
    // Mechanism: E_flow is negligible at both landmarks (the reason the exponent is clean +2).
    id: 'imp33747-eflow-negligible-in-tail',
    description: 'E_flow/E_trunc < 1e-2 at sigma=0.5 landmark and < 1e-3 at sigma<0.1 landmark',
    holds: () => EFLOW_OVER_ETRUNC_0_5 < 1e-2 && EFLOW_OVER_ETRUNC_0_1 < 1e-3,
  },
  {
    // S1 (concrete): a +/-10% amplitude moves each landmark ~0.18 decades, ordered hi(1.1x) > lo(0.9x).
    id: 'imp33747-pm10pct-band-order-and-width',
    description: '+/-10% amplitude: 1.1x crossing later than 0.9x, band ~0.15-0.22 decades for both landmarks',
    holds: () =>
      LANDMARK_0_5.pm10pct.amp_1_1x_N > LANDMARK_0_5.pm10pct.amp_0_9x_N &&
      LANDMARK_0_1.pm10pct.amp_1_1x_N > LANDMARK_0_1.pm10pct.amp_0_9x_N &&
      LANDMARK_0_5.pm10pct.decadeWidth > 0.15 && LANDMARK_0_5.pm10pct.decadeWidth < 0.22 &&
      LANDMARK_0_1.pm10pct.decadeWidth > 0.15 && LANDMARK_0_1.pm10pct.decadeWidth < 0.22,
  },
  {
    // S3: both crossings exist and stay ordered (halving before sub-0.1) for every swept amplitude.
    id: 'imp33747-landmarks-exist-and-ordered-every-amplitude',
    description: 'sigma=0.5 crossing precedes sigma<0.1 crossing for every amplitude factor (structural ordering)',
    holds: () =>
      AMP_FACTORS.every((f, i) => LANDMARK_0_5.table[i].N_landmark < LANDMARK_0_1.table[i].N_landmark),
  },
  {
    // Honesty gate: sensitivity/assessment only, split verdict, no QED, no refereed bound is changed.
    id: 'imp33747-honesty-gate-no-qed',
    description: 'Assessment only: robust-qualitative/fragile-quantitative verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP33747_SIGMA_FARTAIL_LANDMARK_CC_AMPLITUDE_SENSITIVITY.isRigorous === false &&
      /ROBUST QUALITATIVELY, FRAGILE QUANTITATIVELY/.test(
        IMP33747_SIGMA_FARTAIL_LANDMARK_CC_AMPLITUDE_SENSITIVITY.verdict,
      ) &&
      /NO QED/.test(IMP33747_SIGMA_FARTAIL_LANDMARK_CC_AMPLITUDE_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP33747_SIGMA_FARTAIL_LANDMARK_CC_AMPLITUDE_SENSITIVITY.verdict),
  },
];

for (const a of IMP33747_SIGMA_FARTAIL_LANDMARK_CC_AMPLITUDE_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-33747-sigma-fartail-landmark-CC-amplitude-sensitivity assertion failed: ${a.id}`,
    );
  }
}
