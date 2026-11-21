/**
 * @module imp-97743-fold-amplitude-etrunc-floor-sensitivity
 *
 * imp-97743 (numerical, frontier-direction): MEASURE the sensitivity of the imp-97725
 * square-root-fold amplitude
 *
 *     K = sigma_max(1 - sigma_max) / (2 sqrt(A))
 *       = sqrt( sigma_max(1 - sigma_max) / (2 phi_xx) ),
 *     A = phi_xx(x_peak) sigma_max(1 - sigma_max) / 2,
 *     phi_xx = (ln R)_xx - (1/2)(ln L)_xx,   R = E_trunc + E_flow,  L = ln T0(N),
 *
 * to the imp-2631 truncation floor E_trunc = 3.06e-5, since the imp-97725 curvature
 * denominator phi_xx is read from R = E_trunc + E_flow and so carries the floor. This
 * runs the IDENTICAL imp-33708/imp-33723 0.5x..5x E_trunc-floor rescaling sweep on the
 * fold amplitude K (a DISTINCT target from the imp-33708 far-tail landmark N-coordinates
 * and the imp-33684 interior-peak N_max) and reports how far K = 0.4233 moves. Same
 * inherited imp-3406/imp-33582/imp-97662/imp-97725 surrogate component model, same
 * 5-point smooth-model second-log-derivative stencil (h = 1e-4 in x = ln N, no bisected
 * root, no quantization floor), same C_C_PINNED bare E_coll prefactor.
 *
 * THE MEASUREMENT: recompute the whole fold at each floor
 * ------------------------------------------------------
 * Unlike C_C (a bare E_coll prefactor that leaves the peak LOCATION invariant), the
 * E_trunc floor enters sigma = E_coll/(R + E_coll) through R, so a floor rescaling moves
 * the peak location x_peak, the peak share sigma_max, the numerator S = sigma_max(1 -
 * sigma_max), and the curvature phi_xx all together. For each floor factor the leaf
 * ternary-searches the interior peak, then reads S and phi_xx from the smooth model and
 * forms K = sqrt(S/(2 phi_xx)). factor = 1 reproduces the imp-97725 pin exactly.
 *
 * WHAT WAS MEASURED (0.5x..5x floor sweep)
 * ----------------------------------------
 *   (S0) BASELINE REPRODUCES imp-97725. factor 1.0 gives sigma_max = 0.9494290142,
 *        phi_xx = 1.339604e-1, A = 3.215959e-3 and K = 0.423330 -- the exact imp-97725
 *        pin -- confirming the inherited model is the factor = 1 member of the swap.
 *   (S1) K RISES GENTLY AND MONOTONICALLY WITH THE FLOOR: K = 0.363295 (0.5x) ->
 *        0.423330 (1.0x) -> 0.606688 (5x), a factor ~1.67 across the full 10x sweep,
 *        following the shallow power law K ~ E_trunc^(+0.221) (measured from the 0.5x/2x
 *        floors). A +/-10% floor moves K by only ~ -2.30% / +2.12% (K in [0.413610,
 *        0.432320]).
 *   (S2) K IS FAR MORE FLOOR-ROBUST THAN THE LANDMARK N-COORDINATES. Its |exponent|
 *        ~0.221 is an order of magnitude below the imp-33708 far-tail landmark
 *        ~E_trunc^(-2.0) and the imp-33684 interior-peak N_max ~E_trunc^(-1.375): a
 *        +/-10% floor moves the landmark N by ~ +/-18-21% but the fold amplitude K by
 *        only ~ +/-2.2%. The SIGN also flips -- K GROWS with the floor while the landmark
 *        N SHRINKS.
 *   (S3) MECHANISM (measured). As E_trunc rises the peak share sigma_max is pulled DOWN
 *        toward 1/2 (0.961189 at 0.5x -> 0.910321 at 5x), so the numerator S =
 *        sigma_max(1 - sigma_max) RISES (0.037303 -> 0.081637, since sigma_max > 1/2),
 *        while the denominator phi_xx FALLS only mildly (1.413250e-1 -> 1.108984e-1,
 *        ~E_trunc^(-0.087)). Both effects push K = sqrt(S/(2 phi_xx)) UP, and the partial
 *        cancellation between a rising S and a slowly falling phi_xx is exactly why K is
 *        so much less floor-sensitive than either factor alone or than the landmark N.
 *
 * VERDICT: ROBUST QUALITATIVELY, GENTLY FRAGILE QUANTITATIVELY (and FAR less fragile than
 * the landmark N). The imp-97725 fold amplitude K = 0.423330 exists for every positive
 * floor and stays a well-defined interior-peak amplitude, but its precise value obeys the
 * shallow K ~ E_trunc^(+0.221), so a +/-10% floor moves it ~ +/-2.2% and the full 10x
 * sweep spans a factor ~1.67 -- an order of magnitude tighter than the imp-33708 far-tail
 * ~E_trunc^(-2.0) and the imp-33684 peak ~E_trunc^(-1.375). This CONFIRMS the imp-97725
 * SUB-GAP (K inherits the floor-dependent surrogate curvature and is NOT a universal
 * constant) while SHARPENING it in the OTHER direction: the fold amplitude is the LEAST
 * floor-sensitive rung of the cohort, because a rising numerator S and a falling
 * denominator phi_xx partially cancel.
 *
 * MEASUREMENT / SENSITIVITY ONLY on the inherited imp-3220/imp-3406 extrapolation
 * surrogate (NOT a rigorous asymptotic). C_mb GUE-conditional per imp-486 UNTOUCHED;
 * C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED (bare E_coll prefactor); E_trunc base
 * pin 3.06e-5 unchanged (only rescaled as a perturbation); no bound moves; establishes
 * no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-97725-fold-amplitude-analytic-pin (the K = sqrt(S/(2 phi_xx)) pin whose floor dependence is measured here)
 * @see imp-97735-fold-amplitude-height-ladder-drift (SAME K denominator walked along a HEIGHT ladder -- different axis)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (SAME floor swap on the far-tail landmark N ~E_trunc^(-2.0))
 * @see imp-33684-sigma-interior-peak-etrunc-model-sensitivity (SAME floor swap on the interior-peak N_max ~E_trunc^(-1.375))
 * @see imp-97662-cc-elasticity-peak-divergence (the square-root fold law and first K route ~0.4233)
 * @see imp-2631 (E_trunc = 3.06e-5 fixed-strip truncation floor, the perturbed model)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-97725 pin)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97662/imp-97725 exactly

// EXACT imp-97725 sub-terms; ONLY the E_trunc floor is a parameter here.
function parts(N, E_trunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const R = E_trunc + E_flow;
  return { T0, L, R, E_flow, E_coll, sigma: E_coll / (R + E_coll), rho: R / E_coll };
}

// Second log-derivative of a SMOOTH component function in x = ln N (5-point, no bisected root).
function d2LnDx2(fn, x, h) {
  const f = (k) => Math.log(fn(Math.exp(x + k * h)));
  return (-f(2) + 16 * f(1) - 30 * f(0) + 16 * f(-1) - f(-2)) / (12 * h * h);
}

const H = 1e-4;

// Interior peak location: ternary search in x = ln N (matches imp-97725). NOT E_trunc-invariant.
function peakLogN(E_trunc) {
  let a = Math.log(1e4);
  let b = Math.log(1e8);
  for (let i = 0; i < 300; i++) {
    const m1 = a + (b - a) / 3;
    const m2 = b - (b - a) / 3;
    if (parts(Math.exp(m1), E_trunc).sigma < parts(Math.exp(m2), E_trunc).sigma) a = m1;
    else b = m2;
  }
  return (a + b) / 2;
}

// Recompute the whole fold (peak, numerator S, curvature phi_xx / A, amplitude K) at a floor.
function foldAt(E_trunc) {
  const x = peakLogN(E_trunc);
  const N = Math.exp(x);
  const p = parts(N, E_trunc);
  const S = p.sigma * (1 - p.sigma);
  const phixx =
    d2LnDx2((n) => parts(n, E_trunc).R, x, H) - 0.5 * d2LnDx2((n) => parts(n, E_trunc).L, x, H);
  const A = (phixx * S) / 2;
  const K = Math.sqrt(S / (2 * phixx));
  return { x, N, sigma_max: p.sigma, S, phixx, A, K };
}

// factor 1.0 REPRODUCES imp-97725. The 0.5x..5x sweep renders alternative truncation
// orders / cutoff conventions as floor rescalings (same rendering imp-33708/imp-33684 used).
const FLOOR_FACTORS = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0, 3.0, 5.0];

const TABLE = FLOOR_FACTORS.map((f) => {
  const r = foldAt(E_TRUNC_BASE * f);
  return {
    floorFactor: f,
    E_trunc: +(E_TRUNC_BASE * f).toExponential(3),
    N_peak: +r.N.toExponential(4),
    sigma_max: +r.sigma_max.toFixed(8),
    S: +r.S.toExponential(6),
    phi_xx: +r.phixx.toExponential(6),
    A: +r.A.toExponential(6),
    K: +r.K.toFixed(6),
  };
});

const BASE = TABLE.find((r) => r.floorFactor === 1.0);
const LO = TABLE.find((r) => r.floorFactor === 0.9); // smaller floor -> smaller K
const HI = TABLE.find((r) => r.floorFactor === 1.1); // larger floor -> larger K
const K_MIN = Math.min(...TABLE.map((r) => r.K));
const K_MAX = Math.max(...TABLE.map((r) => r.K));

// K is monotone INCREASING in the floor across the swept factors.
const K_MONOTONE_UP = TABLE.every((r, i) => i === 0 || r.K > TABLE[i - 1].K);
// sigma_max is monotone DECREASING (pulled toward 1/2 by a bigger floor) -> S rises.
const SIGMA_MONOTONE_DOWN = TABLE.every((r, i) => i === 0 || r.sigma_max < TABLE[i - 1].sigma_max);

// Empirical scaling exponent q in K ~ E_trunc^q, from two well-separated floors (0.5x, 2x).
function scalingExponent(field) {
  const lo = foldAt(0.5 * E_TRUNC_BASE)[field];
  const hi = foldAt(2.0 * E_TRUNC_BASE)[field];
  return (Math.log(hi) - Math.log(lo)) / (Math.log(2.0 * E_TRUNC_BASE) - Math.log(0.5 * E_TRUNC_BASE));
}
const K_EXPONENT = scalingExponent('K'); // ~ +0.221 (shallow, POSITIVE)
const PHIXX_EXPONENT = scalingExponent('phixx'); // ~ -0.087 (mild)

// Cohort reference exponents (baked literals): landmark N is FAR more floor-sensitive than K.
const IMP33708_FARTAIL_EXPONENT = -2.0; // imp-33708 far-tail landmark N floor-scaling
const IMP33684_PEAK_N_EXPONENT = -1.375; // imp-33684 interior-peak N_max floor-scaling

const PM10_REL_LO = (LO.K - BASE.K) / BASE.K; // ~ -0.0230
const PM10_REL_HI = (HI.K - BASE.K) / BASE.K; // ~ +0.0212

export const IMP97743_FOLD_AMPLITUDE_ETRUNC_FLOOR_SENSITIVITY = {
  id: 'imp-97743',
  proofSection: 'S-frontier',
  question:
    'Measure the sensitivity of the imp-97725 square-root-fold amplitude K = sqrt(sigma_max(1-sigma_max)/(2 phi_xx)) ' +
    'to the imp-2631 E_trunc = 3.06e-5 truncation floor across the imp-33708/imp-33723 0.5x..5x floor sweep, since ' +
    'phi_xx = (ln R)_xx - (1/2)(ln L)_xx is read from R = E_trunc + E_flow and so carries the floor. Report phi_xx, A ' +
    'and how far K = 0.4233 moves, and compare its floor-scaling to the imp-33708 far-tail landmark N ~E_trunc^(-2.0) ' +
    'and the imp-33684 interior-peak N_max ~E_trunc^(-1.375). Measurement only on the inherited surrogate; no bound ' +
    'moves; NO QED.',
  measuredQuantity:
    'For E_trunc = 3.06e-5 * factor, factor in {0.5..5} (factor = 1 = imp-97725 baseline), the fold recomputed per ' +
    'floor: interior peak x_peak (ternary search), sigma_max, S = sigma_max(1-sigma_max), phi_xx (5-point smooth ' +
    'stencil), A = phi_xx S /2, and K = sqrt(S/(2 phi_xx)); plus the empirical exponent q in K ~ E_trunc^q and the ' +
    '+/-10% floor band.',
  baseline: {
    N_peak: BASE.N_peak, // ~9.2186e5 (matches imp-97725)
    sigma_max: BASE.sigma_max, // ~0.94942901
    phi_xx: BASE.phi_xx, // ~1.339604e-1 (matches imp-97725)
    A: BASE.A, // ~3.215959e-3 (matches imp-97725)
    K: BASE.K, // ~0.423330 (matches imp-97725)
  },
  table: TABLE,
  drift: {
    K_min_0_5x: K_MIN, // ~0.363295
    K_base_1_0x: BASE.K, // ~0.423330
    K_max_5x: K_MAX, // ~0.606688
    K_full_sweep_factor: +(K_MAX / K_MIN).toFixed(4), // ~1.67
    K_monotone_increasing_in_floor: K_MONOTONE_UP, // true
    K_scaling_exponent_q: +K_EXPONENT.toFixed(4), // ~ +0.221 (shallow, POSITIVE)
    phi_xx_scaling_exponent: +PHIXX_EXPONENT.toFixed(4), // ~ -0.087 (mild)
    pm10pct: {
      K_0_9x: LO.K, // ~0.413610
      K_1_1x: HI.K, // ~0.432320
      rel_move_0_9x_pct: +(PM10_REL_LO * 100).toFixed(3), // ~ -2.30
      rel_move_1_1x_pct: +(PM10_REL_HI * 100).toFixed(3), // ~ +2.12
    },
  },
  cohortComparison: {
    K_exponent: +K_EXPONENT.toFixed(4), // ~ +0.221
    imp33708_fartail_landmark_N_exponent: IMP33708_FARTAIL_EXPONENT, // ~ -2.0
    imp33684_interior_peak_N_exponent: IMP33684_PEAK_N_EXPONENT, // ~ -1.375
    note:
      'the fold amplitude |exponent| ~0.221 is an order of magnitude below the landmark N-coordinate exponents ' +
      '(imp-33708 far-tail ~ -2.0, imp-33684 peak ~ -1.375): a +/-10% floor moves the landmark N by ~ +/-18-21% but ' +
      'K by only ~ +/-2.2%, and the SIGN flips (K grows with the floor while the landmark N shrinks) -- K is the LEAST ' +
      'floor-sensitive rung of the cohort',
  },
  mechanism: {
    sigma_max_monotone_decreasing_in_floor: SIGMA_MONOTONE_DOWN, // true (pulled toward 1/2)
    note:
      'as E_trunc rises the peak share sigma_max is pulled DOWN toward 1/2 (0.961189 at 0.5x -> 0.910321 at 5x), so ' +
      'S = sigma_max(1-sigma_max) RISES (sigma_max > 1/2); phi_xx falls only mildly (~E_trunc^(-0.087)); both push ' +
      'K = sqrt(S/(2 phi_xx)) UP, and the partial cancellation of a rising S against a slowly falling phi_xx is why ' +
      'K is far less floor-sensitive than either factor alone or than the landmark N',
  },
  finding:
    'The imp-97725 fold amplitude K = 0.423330 is only GENTLY floor-sensitive. factor 1.0 reproduces the imp-97725 pin ' +
    '(sigma_max = 0.94942901, phi_xx = 1.339604e-1, A = 3.215959e-3, K = 0.423330) exactly. Across the 0.5x..5x floor ' +
    'sweep K rises monotonically from 0.363295 (0.5x) through 0.423330 (1.0x) to 0.606688 (5x) -- a factor ~1.67 -- ' +
    'following the shallow power law K ~ E_trunc^(+0.221), so a +/-10% floor moves K by only ~ -2.30% / +2.12% ' +
    '(K in [0.413610, 0.432320]). This |exponent| ~0.221 is an order of magnitude below the imp-33708 far-tail landmark ' +
    'N ~E_trunc^(-2.0) and the imp-33684 interior-peak N_max ~E_trunc^(-1.375): the fold amplitude is the LEAST ' +
    'floor-sensitive rung of the cohort, and it GROWS with the floor while the landmark N shrinks. Mechanism: a bigger ' +
    'floor pulls sigma_max down toward 1/2 so the numerator S = sigma_max(1-sigma_max) RISES while the denominator ' +
    'phi_xx falls only mildly (~E_trunc^(-0.087)), and the two partially cancel. This CONFIRMS the imp-97725 SUB-GAP ' +
    '(K inherits the floor-dependent surrogate curvature and is NOT a universal constant) while sharpening it in the ' +
    'other direction: K is the most floor-robust rung, not the most fragile.',
  isRigorous: false,
  verdict:
    'ROBUST QUALITATIVELY, GENTLY FRAGILE QUANTITATIVELY (and FAR less fragile than the landmark N). Running the ' +
    'imp-33708/imp-33723 E_trunc floor swap (0.5x..5x, factor = 1 reproduces the imp-97725 pin sigma_max = 0.94942901, ' +
    'phi_xx = 1.339604e-1, K = 0.423330) on the imp-97725 fold amplitude K = sqrt(sigma_max(1-sigma_max)/(2 phi_xx)) ' +
    'shows K rises monotonically from 0.363295 (0.5x) to 0.606688 (5x), a factor ~1.67, following the shallow ' +
    'K ~ E_trunc^(+0.221). A +/-10% floor moves K only ~ -2.30% / +2.12% -- an order of magnitude tighter than the ' +
    'imp-33708 far-tail landmark N ~E_trunc^(-2.0) and the imp-33684 interior-peak N_max ~E_trunc^(-1.375), whose ' +
    '+/-10% bands are ~ +/-18-21%. The SIGN also flips: K GROWS with the floor (a bigger floor pulls sigma_max toward ' +
    '1/2 so the numerator S rises while phi_xx falls only mildly, ~E_trunc^(-0.087), and they partially cancel) while ' +
    'the landmark N SHRINKS. So K exists and stays a well-defined interior-peak amplitude for every positive floor; ' +
    'only its precise value moves, and it is the LEAST floor-sensitive rung of the cohort. This CONFIRMS the imp-97725 ' +
    'SUB-GAP that K inherits the floor-dependent surrogate curvature and is NOT a universal constant. Measurement / ' +
    'sensitivity only on the inherited imp-3220/imp-3406 extrapolation surrogate, NOT a rigorous asymptotic; C_mb ' +
    'GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; E_trunc base pin 3.06e-5 ' +
    'unchanged (only rescaled); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-97725 (the K pin whose floor dependence is measured here); imp-97735 (SAME K denominator walked along a HEIGHT ' +
    'ladder); imp-33708 (SAME floor swap on the far-tail landmark N ~E_trunc^(-2.0)); imp-33684 (SAME floor swap on the ' +
    'interior-peak N_max ~E_trunc^(-1.375)); imp-97662 (square-root fold law, first K route); imp-486 (C_mb ' +
    'GUE-conditional); imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi) ansatz); imp-2631 (E_trunc = 3.06e-5 fixed-strip ' +
    'floor); imp-398 (E_flow C_F prefactor); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP97743_FOLD_AMPLITUDE_ETRUNC_FLOOR_SENSITIVITY_ASSERTIONS = [
  {
    // Reuse gate: factor 1.0 reproduces the imp-97725 pin (identical formulas).
    id: 'imp97743-reproduces-imp97725-pin',
    description: 'factor 1.0 reproduces imp-97725 sigma_max ~0.94942901, phi_xx ~1.339604e-1, K ~0.423330',
    holds: () =>
      Math.abs(BASE.sigma_max - 0.94942901) < 5e-7 &&
      Math.abs(BASE.phi_xx - 1.339604e-1) < 5e-6 &&
      Math.abs(BASE.K - 0.42333) < 5e-4,
  },
  {
    // S1: K rises monotonically with the floor across the swept factors.
    id: 'imp97743-K-monotone-increasing-in-floor',
    description: 'K is strictly increasing across the 0.5x..5x floor sweep (bigger floor -> bigger K)',
    holds: () => K_MONOTONE_UP === true,
  },
  {
    // S1 (concrete): shallow POSITIVE power law K ~ E_trunc^(+0.221), full sweep factor ~1.67.
    id: 'imp97743-K-shallow-positive-exponent',
    description: 'K scaling exponent q in K ~ E_trunc^q lands in (0.15, 0.30) and the 10x sweep spans a factor ~1.5-1.9',
    holds: () =>
      K_EXPONENT > 0.15 &&
      K_EXPONENT < 0.3 &&
      K_MAX / K_MIN > 1.5 &&
      K_MAX / K_MIN < 1.9,
  },
  {
    // S2: K is FAR less floor-sensitive than the landmark N-coordinates (an order of magnitude gentler).
    id: 'imp97743-K-far-less-floor-sensitive-than-landmark-N',
    description: 'the K |exponent| ~0.22 is well below both the imp-33708 far-tail ~2.0 and imp-33684 peak ~1.375 in magnitude',
    holds: () =>
      Math.abs(K_EXPONENT) < 0.5 * Math.abs(IMP33684_PEAK_N_EXPONENT) &&
      Math.abs(K_EXPONENT) < 0.5 * Math.abs(IMP33708_FARTAIL_EXPONENT),
  },
  {
    // S1 (band): a +/-10% floor moves K by only ~ +/-2.2%, ordered K(0.9x) < K(1.1x).
    id: 'imp97743-pm10pct-K-band-small-and-ordered',
    description: '+/-10% floor: K(0.9x) < baseline < K(1.1x), each moving < 3% (K far tighter than the landmark N band)',
    holds: () =>
      LO.K < BASE.K &&
      BASE.K < HI.K &&
      Math.abs(PM10_REL_LO) < 0.03 &&
      Math.abs(PM10_REL_HI) < 0.03,
  },
  {
    // Mechanism: sigma_max falls (S rises) as the floor rises, which drives K up.
    id: 'imp97743-sigma-max-falls-with-floor',
    description: 'sigma_max is strictly decreasing in the floor (pulled toward 1/2), so S = sigma_max(1-sigma_max) rises',
    holds: () => SIGMA_MONOTONE_DOWN === true,
  },
  {
    // Honesty gate: sensitivity/assessment only, split verdict, no QED, no refereed bound is changed.
    id: 'imp97743-honesty-gate-no-qed',
    description: 'Measurement only: robust-qualitative/gently-fragile verdict, sub-gap confirmed, no QED, no refereed bound is changed',
    holds: () =>
      IMP97743_FOLD_AMPLITUDE_ETRUNC_FLOOR_SENSITIVITY.isRigorous === false &&
      /ROBUST QUALITATIVELY, GENTLY FRAGILE QUANTITATIVELY/.test(
        IMP97743_FOLD_AMPLITUDE_ETRUNC_FLOOR_SENSITIVITY.verdict,
      ) &&
      /SUB-GAP/.test(IMP97743_FOLD_AMPLITUDE_ETRUNC_FLOOR_SENSITIVITY.verdict) &&
      /NO QED/.test(IMP97743_FOLD_AMPLITUDE_ETRUNC_FLOOR_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP97743_FOLD_AMPLITUDE_ETRUNC_FLOOR_SENSITIVITY.verdict),
  },
];

for (const a of IMP97743_FOLD_AMPLITUDE_ETRUNC_FLOOR_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97743-fold-amplitude-etrunc-floor-sensitivity assertion failed: ${a.id}`);
  }
}
