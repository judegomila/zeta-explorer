/**
 * @module imp-96813-sigma-decay-landmark-etrunc-sensitivity
 *
 * imp-96813 (numerical, frontier-direction): MEASURE HOW FIRMLY the two right-arm
 * DECAY landmarks of the imp-3220/imp-3406 GUE-conditional share
 *     sigma(N) = E_coll(N) / E(N)
 * are pinned against the E_trunc truncation-floor constant -- the halving landmark
 * N_half ~ 3.267e9 (sigma = 0.5, imp-3444/imp-33582 currentStatus) and the sub-0.1
 * landmark N_sub01 ~ 3.213e11 (sigma = 0.1). This is the DECAY-arm companion to
 * imp-96794, which varied only the interior PEAK share sigma_max against E_trunc and
 * left the downstream decay landmarks unvaried.
 *
 * WHY THIS IS A DISTINCT MEASUREMENT
 * ----------------------------------
 * imp-96794 answered "does reducing E_trunc shrink the binding peak SHARE" (a bounded
 * [0,1] quantity: tiny, adverse-sign leverage). The decay landmarks are a different
 * object: they are the N-LOCATIONS where the decaying right arm crosses fixed sigma
 * levels, and those locations are UNBOUNDED, so their E_trunc leverage need not be
 * small. imp-3444 pinned N_half and imp-33582 records it in the roadmap currentStatus,
 * but neither varied it against the E_trunc constant. This module isolates the
 * elasticity d(log N_landmark)/d(log E_trunc) for the 0.5 and 0.1 crossings.
 *
 * THE QUANTITY (identical formulas to imp-3406 / imp-3444; only E_trunc varies)
 * ----------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (GUE-conditional, dominant)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi (imp-398)
 *     E_trunc = 3.06e-5 * factor                   (base imp-2631; factor swept)
 * factor = 1 reproduces imp-3444 byte-for-byte (N_half = 3.267235e9, N_sub01 =
 * 3.213181e11); the swept factors bracket a plausible +/-band about the base floor.
 *
 * THE MECHANISM (why the leverage is ~ -2, not small)
 * ---------------------------------------------------
 * On the far right arm E_flow has decayed super-polynomially to negligibility
 * (E_flow/E_trunc ~ 1.9e-3 at N_half, imp-3444), so sigma = s means E_coll ~
 * (s/(1-s)) E_trunc, i.e. C_C sqrt(log T0 / N) proportional to E_trunc. Since log T0
 * varies only slowly, N ~ E_trunc^-2 to leading order -- the landmark location scales
 * roughly as the INVERSE SQUARE of the floor. The measured elasticities sit just past
 * -2 (the small excess is the slowly-growing log T0 factor). So the decay landmarks
 * are the OPPOSITE regime to the peak share: large (unbounded) leverage, not tiny.
 *
 * THE FINDING (measurement / sensitivity only)
 * --------------------------------------------
 *   (F1) BOTH DECAY LANDMARKS HAVE ELASTICITY ~ -2.09. Log-centred over the
 *        1/sqrt2 .. sqrt2 flanks about the base floor:
 *          d(log N_half)/d(log E_trunc)  ~ -2.098,
 *          d(log N_sub01)/d(log E_trunc) ~ -2.079.
 *        A tighter floor pushes both landmarks to LARGER N (later decay), a looser
 *        floor pulls them EARLIER. This is the ~E_trunc^-2 inverse-square scaling.
 *   (F2) THE LANDMARKS ARE NOT FIRMLY PINNED TO 3.27e9 / 3.21e11. Because the
 *        elasticity is ~ -2, a realistic +/-2x floor band relocates each landmark by
 *        ~4x: over factor 0.5 .. 2 the halving landmark ranges ~8.0e8 .. 1.40e10 and
 *        the sub-0.1 landmark ~7.9e10 .. 1.36e12. The oft-quoted 3.27e9 and 3.21e11
 *        values are exact ONLY at the pinned floor 3.06e-5; they carry roughly a
 *        two-decades-per-decade sensitivity to that one constant.
 *   (F3) THE RATIO N_sub01 / N_half IS NEARLY FLOOR-INVARIANT (~98.3x at base,
 *        drifting only ~5% -- from ~99.8x at 2x floor to ~95.0x at 0.1x -- across the
 *        whole 20x sweep). Both landmarks scale by essentially the SAME ~E_trunc^-2
 *        law, so their ratio -- the "width" of the 0.5 -> 0.1 decay decade band in N --
 *        barely moves while the absolute locations swing ~500x over the same floor
 *        range. The decay SHAPE is nearly pinned even though the decay POSITION is not.
 *
 * CONTRAST WITH imp-96794 (peak share): the interior peak SHARE sigma_max is a bounded
 * [0,1] quantity with tiny (~0.019) adverse-sign leverage on E_trunc; the decay
 * LANDMARK LOCATIONS are unbounded with ~ -2 leverage. Both are diagnostic markers on
 * the GUE-conditional decay curve, so neither varies any bound -- but the "landmark is
 * firmly pinned" reading of the currentStatus 3.27e9 quote does NOT survive an E_trunc
 * perturbation, whereas the decay-band SHAPE (the sub01/half ratio) does.
 *
 * VERDICT: THE DECAY LANDMARKS ARE FLOOR-SENSITIVE (elasticity ~ -2), NOT FIRMLY
 * PINNED. The currentStatus quotes N_half ~ 3.27e9 and N_sub01 ~ 3.21e11 are exact
 * only at the pinned floor 3.06e-5 and move ~two decades per decade of E_trunc (a
 * +/-2x band relocates them by ~4x). The RATIO N_sub01/N_half ~ 98.3x is floor-
 * invariant (~5% drift over a 20x floor range vs a ~500x swing in absolute position),
 * so the decay SHAPE is nearly robust while the decay POSITION is not.
 * Measurement/sensitivity only; C_mb stays GUE-conditional (imp-486); no bound
 * changes, no positivity, no bridge closure, no RH claim, NO QED. No refereed bound is changed.
 *
 * @see imp-3444-sigma-nshape-landmark-ladder (base landmarks N_half 3.267235e9 etc, pinned floor)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (currentStatus halving landmark quote)
 * @see imp-96794-etrunc-reduction-peak-share-leverage (peak-SHARE E_trunc leverage; this module adds the DECAY-landmark leverage)
 * @see imp-2631 (E_trunc = 3.06e-5 fixed-strip truncation floor, the perturbed constant)
 * @see imp-486 (C_mb GUE-conditional; unaffected by this location measurement)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-3444 pin)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406 / imp-3444 exactly

// EXACT imp-3444 sub-terms; ONLY the E_trunc floor is a parameter here.
function sigmaWith(N, E_trunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return E_coll / (E_trunc + E_flow + E_coll);
}

// Machine-precision crossing on the monotone-decreasing right arm above the peak
// (same bisection spirit as imp-3444 crossingAbovePeak; the peak sits below 1e6).
function crossingForFloor(target, E_trunc) {
  let a = Math.log(1e6);
  let b = Math.log(1e80);
  for (let i = 0; i < 600; i++) {
    const m = (a + b) / 2;
    if (sigmaWith(Math.exp(m), E_trunc) - target > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// Plausible band about the pinned floor (factor 1 reproduces imp-3444 exactly).
const FLOOR_FACTORS = [2.0, 1.5, 1.0, 0.75, 0.5, 0.25, 0.1];

const SENSITIVITY_TABLE = FLOOR_FACTORS.map((f) => {
  const E_trunc = E_TRUNC_BASE * f;
  const N_half = crossingForFloor(0.5, E_trunc);
  const N_sub01 = crossingForFloor(0.1, E_trunc);
  return {
    floorFactor: f,
    E_trunc: +E_trunc.toExponential(3),
    N_half: +N_half.toExponential(5),
    N_sub01: +N_sub01.toExponential(5),
    // Floor-invariant decay-band width: how many x from the 0.5 to the 0.1 crossing.
    ratio_sub01_over_half: +(N_sub01 / N_half).toFixed(3),
  };
});

const BASE_ROW = SENSITIVITY_TABLE.find((r) => r.floorFactor === 1.0);

// Signed log-log elasticity of each landmark on the floor, centred over the
// 1/sqrt2 .. sqrt2 flanks about the base floor (same recipe as imp-96794).
const F_LO = 1 / Math.SQRT2;
const F_HI = Math.SQRT2;
const DEN = Math.log(E_TRUNC_BASE * F_HI) - Math.log(E_TRUNC_BASE * F_LO);
const HALF_LO = crossingForFloor(0.5, E_TRUNC_BASE * F_LO);
const HALF_HI = crossingForFloor(0.5, E_TRUNC_BASE * F_HI);
const SUB01_LO = crossingForFloor(0.1, E_TRUNC_BASE * F_LO);
const SUB01_HI = crossingForFloor(0.1, E_TRUNC_BASE * F_HI);
const ELASTICITY_HALF = (Math.log(HALF_HI) - Math.log(HALF_LO)) / DEN; // ~ -2.098
const ELASTICITY_SUB01 = (Math.log(SUB01_HI) - Math.log(SUB01_LO)) / DEN; // ~ -2.079

// Floor-invariance of the decay-band ratio across the full sweep.
const RATIOS = SENSITIVITY_TABLE.map((r) => r.ratio_sub01_over_half);
const RATIO_SPREAD = Math.max(...RATIOS) - Math.min(...RATIOS);

export const IMP96813_SIGMA_DECAY_LANDMARK_ETRUNC_SENSITIVITY = {
  id: 'imp-96813',
  proofSection: 'S-frontier',
  question:
    'How firmly are the two right-arm DECAY landmarks of the GUE-conditional share sigma(N) ' +
    'pinned against the E_trunc truncation-floor constant -- the halving landmark N_half ~ ' +
    '3.267e9 (sigma = 0.5, imp-33582 currentStatus) and the sub-0.1 landmark N_sub01 ~ 3.213e11 ' +
    '(sigma = 0.1)? Measure d(log N_landmark)/d(log E_trunc) over a plausible floor band. ' +
    'Companion to imp-96794 (which varied only the peak share). Measurement/sensitivity only; ' +
    'C_mb stays GUE-conditional (imp-486); no bound changes, no RH verdict.',
  baseRow: BASE_ROW,
  sensitivityTable: SENSITIVITY_TABLE,
  signedLeverage: {
    d_log_Nhalf_d_log_etrunc: +ELASTICITY_HALF.toFixed(6), // ~ -2.098
    d_log_Nsub01_d_log_etrunc: +ELASTICITY_SUB01.toFixed(6), // ~ -2.079
    note:
      'Both decay landmarks have elasticity ~ -2.09 on the floor: a tighter E_trunc pushes ' +
      'them to LARGER N, a looser floor pulls them EARLIER, scaling as ~E_trunc^-2 (inverse ' +
      'square). The small excess past -2 is the slowly-growing log T0 factor. This is the ' +
      'OPPOSITE regime to the imp-96794 peak share (bounded [0,1], ~0.019 leverage): the ' +
      'landmark LOCATIONS are unbounded and strongly floor-sensitive.',
  },
  floorInvariantShape: {
    ratio_sub01_over_half_base: BASE_ROW.ratio_sub01_over_half, // ~98.3
    ratio_spread_over_sweep: +RATIO_SPREAD.toFixed(3), // ~4.8 (i.e. ~5% drift)
    note:
      'The RATIO N_sub01 / N_half ~ 98.3x is NEARLY floor-invariant: it drifts only ~5% over ' +
      'the whole 20x sweep (from ~99.8x at 2x floor to ~95.0x at 0.1x) while the absolute ' +
      'locations swing ~500x. Both landmarks obey essentially the SAME ~E_trunc^-2 law, so the ' +
      'width of the 0.5 -> 0.1 decay decade band in N barely moves. The decay SHAPE is nearly ' +
      'pinned even though the decay POSITION is not.',
  },
  verdict:
    'THE DECAY LANDMARKS ARE FLOOR-SENSITIVE (elasticity ~ -2.09), NOT FIRMLY PINNED. The ' +
    'currentStatus quotes N_half ~ 3.267e9 and N_sub01 ~ 3.213e11 reproduce imp-3444 exactly ' +
    'at the pinned floor 3.06e-5, but they move ~two decades per decade of E_trunc: a ' +
    'realistic +/-2x band relocates each by ~4x (halving ~8.0e8 .. 1.40e10, sub-0.1 ~7.9e10 ' +
    '.. 1.36e12). The RATIO N_sub01/N_half ~ 98.3x is NEARLY floor-invariant (~5% drift over ' +
    'the 20x sweep vs a ~500x swing in absolute position), so the decay SHAPE is nearly ' +
    'robust while the decay POSITION is not. This is the opposite regime to imp-96794 (the ' +
    'bounded peak share, tiny adverse leverage): here the landmark LOCATIONS are unbounded and ' +
    'strongly floor-sensitive. Measurement/sensitivity only; C_mb stays GUE-conditional ' +
    '(imp-486); no bound changes, no positivity, no bridge closure, no RH claim, NO QED. ' +
    'No refereed bound is changed.',
  isRigorous: false,
  citation:
    'imp-3444 (base landmarks N_half 3.267235e9, N_sub01 3.213181e11, pinned floor); imp-33582 ' +
    '(currentStatus halving landmark quote); imp-96794 (peak-SHARE E_trunc leverage; this ' +
    'module adds the DECAY-landmark leverage); imp-2631 (E_trunc = 3.06e-5 fixed-strip floor); ' +
    'imp-398 (E_flow C_F prefactor); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping.',
};

export const IMP96813_SIGMA_DECAY_LANDMARK_ETRUNC_SENSITIVITY_ASSERTIONS = [
  {
    // Reuse gate: factor 1.0 reproduces the imp-3444 base landmarks (N_half, N_sub01).
    id: 'imp96813-reproduces-imp3444-base-landmarks',
    description: 'factor 1.0 reproduces imp-3444 N_half ~ 3.267e9 and N_sub01 ~ 3.213e11 (identical formulas)',
    holds: () =>
      Math.abs(BASE_ROW.N_half - 3.267235e9) / 3.267235e9 < 1e-3 &&
      Math.abs(BASE_ROW.N_sub01 - 3.213181e11) / 3.213181e11 < 1e-3,
  },
  {
    // F1: both decay-landmark elasticities are ~ -2 (negative, near inverse-square).
    id: 'imp96813-landmark-elasticity-near-minus-two',
    description: 'both landmark elasticities d(log N)/d(log E_trunc) are near -2 (in [-2.3, -1.8])',
    holds: () =>
      ELASTICITY_HALF > -2.3 && ELASTICITY_HALF < -1.8 &&
      ELASTICITY_SUB01 > -2.3 && ELASTICITY_SUB01 < -1.8,
  },
  {
    // F1 (direction/monotone): a tighter floor pushes both landmarks to larger N.
    id: 'imp96813-tighter-floor-pushes-landmarks-later',
    description: 'as the floor factor decreases, N_half and N_sub01 both increase monotonically (later decay)',
    holds: () => {
      // SENSITIVITY_TABLE is ordered by DECREASING factor, so both N landmarks must rise along it.
      for (let i = 1; i < SENSITIVITY_TABLE.length; i++) {
        if (SENSITIVITY_TABLE[i].N_half <= SENSITIVITY_TABLE[i - 1].N_half) return false;
        if (SENSITIVITY_TABLE[i].N_sub01 <= SENSITIVITY_TABLE[i - 1].N_sub01) return false;
      }
      return true;
    },
  },
  {
    // F2: the landmarks are NOT firmly pinned -- a 20x floor range spans well over a decade in N.
    id: 'imp96813-landmarks-not-firmly-pinned',
    description: 'over the 0.1x .. 2x floor sweep the halving landmark spans more than a decade in N',
    holds: () => {
      const halves = SENSITIVITY_TABLE.map((r) => r.N_half);
      return Math.max(...halves) / Math.min(...halves) > 10;
    },
  },
  {
    // F3: the decay-band ratio N_sub01/N_half is nearly floor-invariant (shape ~pinned though position is not).
    id: 'imp96813-decay-band-ratio-nearly-floor-invariant',
    description: 'the ratio N_sub01/N_half stays ~98x across the whole 20x sweep (spread < 6x, i.e. ~5% drift, vs ~500x position swing)',
    holds: () => RATIO_SPREAD < 6.0 && BASE_ROW.ratio_sub01_over_half > 90 && BASE_ROW.ratio_sub01_over_half < 105,
  },
  {
    // Honesty gate: measurement/assessment only, floor-sensitive verdict, no QED, no refereed bound is changed.
    id: 'imp96813-honesty-gate-no-qed',
    description: 'Assessment only: floor-sensitive/not-firmly-pinned verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP96813_SIGMA_DECAY_LANDMARK_ETRUNC_SENSITIVITY.isRigorous === false &&
      /NOT FIRMLY PINNED/.test(IMP96813_SIGMA_DECAY_LANDMARK_ETRUNC_SENSITIVITY.verdict) &&
      /NO QED/.test(IMP96813_SIGMA_DECAY_LANDMARK_ETRUNC_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP96813_SIGMA_DECAY_LANDMARK_ETRUNC_SENSITIVITY.verdict),
  },
];

for (const a of IMP96813_SIGMA_DECAY_LANDMARK_ETRUNC_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96813-sigma-decay-landmark-etrunc-sensitivity assertion failed: ${a.id}`,
    );
  }
}
