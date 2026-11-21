/**
 * @module imp-34997-iters-to-floor-tail-grid-refinement
 *
 * imp-34997 (accuracy, frontier-direction): imp-34903 found the off-by-one iters-to-floor population
 *   vanishing ENTIRELY above 1e12 (13 seeds below 1e9, 21 in [1e9,1e12], 0 above), and imp-34951 confirmed
 *   0 off-by-one in both (1e12,1e15] and (1e15,1e18] -- but both measured ONLY on the coarse fixed 10^0.05
 *   grid, never testing whether GRID REFINEMENT repopulates the tail. A population that reads as 0 at
 *   10^0.05 spacing could be a coarse-grid sampling artifact (off-by-one seeds slipping between grid points)
 *   or a genuine depletion. This module reuses the imp-34903/imp-34951 map g(N) = K log T0(N), the off-by-one
 *   detector, and the ceil argument VERBATIM and REFINES the seed grid above 1e12 by up to 50x (10^0.05 ->
 *   10^0.001, 3001 seeds on (1e12,1e15]) to settle whether the tail off-by-one population is genuinely 0.
 *
 * WHAT IS MEASURED
 * ----------------
 * The SAME single-rate log law: amplitude K, fixed point N_CROSS_FP, contraction rate r, log-law constant
 * ln(1/r), point-valued ceil argument xArg(seed) = log(collapseDist/EPS_FP)/ln(1/r), single-rate predicted
 * count k_single = 1 + ceil(xArg), and the directly-measured Picard count -- all inherited VERBATIM from
 * imp-34903/imp-34951. Only the tail grid tightens: the (1e12,1e15] sub-band is re-swept at 10^0.05 (coarse
 * baseline, 60 seeds), then 10^0.01, 10^0.005, 10^0.002, and 10^0.001 (3001 seeds), tallying off-by-one at
 * each resolution. To EXPLAIN the result the module also tracks the ceil PHASE frac(xArg) = xArg - floor(xArg):
 * an off-by-one requires frac to land in the fixed phase window (W, 1) of width OFFSET = log(EPS_FP/penult)/
 * ln(1/r) ~ 0.1484 (penult = the imp-34951 quantized 1.4536e-16 collapse witness), because that is exactly
 * the phase interval in which the too-large EPS_FP floor forces the terminal ceil to under-count by one.
 *
 * THE RESULT: THE TAIL 0 IS REAL AT EVERY RESOLUTION, BUT IT IS A FINITE PHASE GAP, NOT ASYMPTOTIC EXTINCTION
 * ----------------------------------------------------------------------------------------------------------
 * Refining the (1e12,1e15] grid from 10^0.05 (60 seeds) all the way to 10^0.001 (3001 seeds) finds ZERO
 * off-by-one seeds at EVERY resolution -- a 50x refinement repopulates NOTHING. So the imp-34903/imp-34951
 * report of 0 off-by-one above 1e12 is NOT a coarse-grid sampling artifact; it is a genuine depletion of the
 * measured band. The mechanism is exact and geometric: over (1e12,1e15] the ceil phase frac(xArg) is confined
 * to roughly [0.213, 0.471], strictly BELOW the off-by-one window (W, 1) with W ~ 0.8516, so no seed in the
 * band can produce an off-by-one at any resolution.
 *
 * BUT the depletion is FINITE, not a monotone asymptotic vanishing driven by a widening margin (the imp-34951
 * margin is EXACTLY uniform, 0.36798*EPS_FP, so nothing widens). The real driver is the slow MONOTONE UPWARD
 * DRIFT of the ceil phase: frac(xArg) rises ~0.0187 per decade (~53 decades per unit phase) while floor(xArg)
 * stays pinned at 11 across [1e12,1e30] (the single-collapse count is flat far above the knee). The phase
 * therefore re-enters the off-by-one window (W, 1) at N ~ 10^27.08, where off-by-one seeds REAPPEAR (all -1,
 * consistent with the imp-34903 band-wide sign). So the correct reading of imp-34903/imp-34951 "vanishes
 * above 1e12" is a LOCAL ~15-decade phase-window gap over [1e12, ~1e27], not permanent extinction.
 *
 * NAMED RESIDUAL SUB-GAP (imp-34997a)
 * -----------------------------------
 * The reappearance at N ~ 10^27 is measured on the IEEE-754 double surrogate, where a seed that far above the
 * ~3.28e9 fixed point has ULP spacing ~1e11 and the effectiveHeightForN Newton inverse is itself in
 * double precision -- whether the surrogate remains a faithful proxy for the true collapse dynamics that far
 * above the knee is NOT established, and the phase-drift slope is measured, not certified uniform. Sub-gap
 * imp-34997a = certify the ceil-phase drift rate (and hence the reentry location) against a
 * higher-precision recomputation of the surrogate; it inherits, and does not discharge, imp-34951a / imp-34926a.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A tail grid-refinement of the imp-34903/imp-34951 off-by-one census plus a phase-drift explanation of the
 * tail 0. MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate map, IEEE-754 double precision, no
 * interval enclosure. The C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no
 * operator positivity; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-3463 (far-tail E_flow decay exponent 1/2)
 * @see imp-34903-iters-to-floor-residual-sign-wide-band (parent: 0 off-by-one above 1e12 on the 10^0.05 grid)
 * @see imp-34951-plus-one-impossibility-margin-band (uniform quantized penult margin; sub-gap imp-34951a)
 * @see imp-34926-iters-to-floor-ceil-boundary-geometry (terminal ceil-boundary geometry; +1 impossibility)
 * @see imp-34775-iters-to-floor-log-law (derives the closed-form log law and the ceil rounding floor)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34903/imp-34951)
const EPS_FP = 2.3e-16; // the ~machine-epsilon relative agreement floor (imp-34755/imp-34775/imp-34903)
const PENULT = 1.4536413720400559e-16; // the imp-34951 quantized penultimate collapse witness (bit-identical)

// The shared imp-34903/imp-34951 fixed-point map g(N) = K log T0(N).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}

// The unique double-precision fixed point (route B, converged) -- identical to imp-34903/imp-34951.
const N_CROSS_FP = iterate(1e9, 200); // 3280294351.65240669

// Central-difference contraction rate (h=1 stencil; identical to imp-34903/imp-34951).
const gPrimeAtStep = (h) => (g(N_CROSS_FP + h) - g(N_CROSS_FP - h)) / (2 * h);
const R_CONTRACT = Math.abs(gPrimeAtStep(1)); // ~0.0454235
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.09173 nats/iterate (the log-law constant)

// Post-collapse relative distance, ceil argument, single-rate predicted count (imp-34903/imp-34951).
const collapseDist = (seed) => Math.abs(g(seed) - N_CROSS_FP) / N_CROSS_FP;
const xArg = (seed) => Math.log(collapseDist(seed) / EPS_FP) / LN_INV_R;
const itersToFloorPredicted = (seed) => 1 + Math.ceil(xArg(seed));

// Directly-measured Picard count: iterates until bit-identical to the fixed point (matches imp-34903).
function itersToFloorMeasured(seed, cap = 500) {
  let N = seed;
  let k = 0;
  while (k < cap) {
    N = g(N);
    k++;
    if (N === N_CROSS_FP) break;
  }
  return k;
}

// The fixed off-by-one PHASE window: an off-by-one (resid -1) occurs iff frac(xArg) lands in (W, 1), where
// the window width OFFSET = log(EPS_FP/penult)/ln(1/r) is the phase gap between the too-large EPS_FP floor
// and the true (penult) collapse threshold. W is the lower edge of that window.
const OFFSET = Math.log(EPS_FP / PENULT) / LN_INV_R; // ~0.148408 (window width)
const WINDOW_LOWER_EDGE = 1 - OFFSET; // ~0.851592

// Off-by-one census over a seed band on the 10^step grid.
function offByOneBand(loExp, hiExp, step) {
  const seeds = [];
  for (let e = loExp; e <= hiExp + 1e-9; e += step) seeds.push(Math.pow(10, e));
  let offByOne = 0;
  let plusOne = 0;
  let minusOne = 0;
  for (const s of seeds) {
    const resid = itersToFloorPredicted(s) - itersToFloorMeasured(s);
    if (Math.abs(resid) === 1) {
      offByOne++;
      if (resid > 0) plusOne++;
      else minusOne++;
    }
  }
  return { points: seeds.length, offByOne, plusOne, minusOne };
}

// Ceil-phase statistics over a seed band: min/max frac(xArg) and the pinned floor(xArg).
function phaseBand(loExp, hiExp, step) {
  const seeds = [];
  for (let e = loExp; e <= hiExp + 1e-9; e += step) seeds.push(Math.pow(10, e));
  let minFrac = 1;
  let maxFrac = 0;
  const floors = new Set();
  for (const s of seeds) {
    const x = xArg(s);
    floors.add(Math.floor(x));
    const f = x - Math.floor(x);
    if (f < minFrac) minFrac = f;
    if (f > maxFrac) maxFrac = f;
  }
  return { points: seeds.length, minFrac, maxFrac, floorValues: [...floors].sort((a, b) => a - b) };
}

// THE REFINEMENT LADDER on the (1e12,1e15] tail: coarse imp-34903 baseline plus four finer resolutions.
const TAIL_LO = 12 + 1e-9; // strictly above 1e12
const TAIL_HI = 15;
const REFINE_STEPS = [0.05, 0.01, 0.005, 0.002, 0.001];
const REFINEMENT_LADDER = REFINE_STEPS.map((step) => {
  const b = offByOneBand(TAIL_LO, TAIL_HI, step);
  return { grid_step_exp: step, seeds: b.points, offByOne: b.offByOne, plusOne: b.plusOne, minusOne: b.minusOne };
});
const TAIL_ALL_ZERO = REFINEMENT_LADDER.every((r) => r.offByOne === 0);
const FINEST = REFINEMENT_LADDER[REFINEMENT_LADDER.length - 1]; // 10^0.001, 3001 seeds
const COARSE = REFINEMENT_LADDER[0]; // 10^0.05, 60 seeds (reproduces imp-34903 SUB_ABOVE)

// THE PHASE EXPLANATION: over (1e12,1e15] the phase sits strictly below the off-by-one window (W, 1).
const TAIL_PHASE = phaseBand(TAIL_LO, TAIL_HI, 0.005);
const PHASE_BELOW_WINDOW = TAIL_PHASE.maxFrac < WINDOW_LOWER_EDGE;

// THE FINITE-GAP FACT: the phase drifts up monotonically and REENTERS the window; off-by-one reappears.
// Bisect for the exponent where frac(xArg) first exceeds W (floor stays 11 across the whole tail).
function reentryExponent() {
  let lo = 24;
  let hi = 30;
  const fracAt = (e) => {
    const x = xArg(Math.pow(10, e));
    return x - Math.floor(x);
  };
  for (let i = 0; i < 80; i++) {
    const m = (lo + hi) / 2;
    if (fracAt(m) > WINDOW_LOWER_EDGE) hi = m;
    else lo = m;
  }
  return (lo + hi) / 2;
}
const REENTRY_EXP = reentryExponent(); // ~27.0847
// Off-by-one census in a narrow band straddling the reentry exponent: the population REAPPEARS, all -1.
const REENTRY_BAND = offByOneBand(REENTRY_EXP - 0.5, REENTRY_EXP + 0.5, 0.02);
// Phase drift slope near the reentry (frac units per decade).
const PHASE_DRIFT_PER_DECADE =
  (xArg(Math.pow(10, 27.5)) - Math.floor(xArg(Math.pow(10, 27.5)))) -
  (xArg(Math.pow(10, 26.5)) - Math.floor(xArg(Math.pow(10, 26.5))));

export const IMP34997_ITERS_TO_FLOOR_TAIL_GRID_REFINEMENT = {
  id: 'imp-34997',
  proofSection: 'S-frontier',
  question:
    'imp-34903 found the off-by-one iters-to-floor population vanishing entirely above 1e12 (0 in (1e12,1e15]) ' +
    'and imp-34951 confirmed 0 through 1e18, but both measured only on the coarse fixed 10^0.05 grid. Refine ' +
    'the tail seed grid above 1e12 (up to 10^0.001, 3001 seeds on (1e12,1e15]) to settle whether the 0 ' +
    'off-by-one population is a genuine depletion or a coarse-grid sampling artifact, and if genuine, whether ' +
    'the population -> 0 is a true asymptotic vanishing driven by the imp-34951 penultimate margin.',
  constants: {
    contraction_rate_r: +R_CONTRACT.toPrecision(6), // ~0.0454235 (h=1 stencil, as imp-34903/34951)
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.09173 nats/iterate
    eps_fp: EPS_FP, // 2.3e-16 model collapse floor
    penult_witness: PENULT, // 1.4536e-16 (imp-34951 quantized penultimate collapse witness)
    off_by_one_window_width_offset: +OFFSET.toPrecision(6), // ~0.148408
    off_by_one_window_lower_edge_W: +WINDOW_LOWER_EDGE.toPrecision(6), // ~0.851592
    tail_lo_exp: 12, // 1e12
    tail_hi_exp: 15, // 1e15
  },
  refinement_ladder: REFINEMENT_LADDER, // 10^0.05 -> 10^0.001 on (1e12,1e15], all offByOne 0
  tail_phase: {
    grid_step_exp: 0.005,
    seeds: TAIL_PHASE.points,
    min_frac_xArg: +TAIL_PHASE.minFrac.toPrecision(6), // ~0.212939
    max_frac_xArg: +TAIL_PHASE.maxFrac.toPrecision(6), // ~0.470658
    floor_xArg_values: TAIL_PHASE.floorValues, // [11] -- floor pinned across the tail
    phase_below_off_by_one_window: PHASE_BELOW_WINDOW, // true: max frac < W ~ 0.8516
  },
  finite_gap: {
    phase_drift_frac_per_decade: +PHASE_DRIFT_PER_DECADE.toPrecision(6), // ~0.0187
    reentry_exponent_log10N: +REENTRY_EXP.toPrecision(8), // ~27.0847
    reentry_band_seeds: REENTRY_BAND.points,
    reentry_band_off_by_one: REENTRY_BAND.offByOne, // > 0: the population REAPPEARS at ~10^27
    reentry_band_all_minus_one: REENTRY_BAND.offByOne > 0 && REENTRY_BAND.plusOne === 0,
  },
  summary: {
    coarse_baseline_seeds: COARSE.seeds, // 60 (reproduces imp-34903 SUB_ABOVE)
    coarse_baseline_off_by_one: COARSE.offByOne, // 0
    finest_grid_step_exp: FINEST.grid_step_exp, // 0.001
    finest_grid_seeds: FINEST.seeds, // 3001
    finest_grid_off_by_one: FINEST.offByOne, // 0 -- a 50x refinement repopulates NOTHING
    tail_off_by_one_zero_at_every_resolution: TAIL_ALL_ZERO, // true
    reentry_exponent_log10N: +REENTRY_EXP.toPrecision(8), // ~27.0847
    residual_sub_gap_imp_34997a:
      'The reappearance at N ~ 10^27 is measured on the IEEE-754 double surrogate, where such a seed has ULP ' +
      'spacing ~1e11 and the effectiveHeightForN Newton inverse is itself double precision; the surrogate ' +
      'fidelity that far above the ~3.28e9 fixed point is NOT established and the phase-drift slope is ' +
      'measured, not certified uniform. Sub-gap imp-34997a = certify the ceil-phase drift and reentry against ' +
      'a higher-precision surrogate recomputation; it inherits imp-34951a / imp-34926a.',
    verdict_on_ticket_question:
      'GENUINE depletion, NOT a coarse-grid artifact -- but a FINITE phase gap, NOT asymptotic vanishing. ' +
      'Refining the (1e12,1e15] grid from 10^0.05 (60 seeds) to 10^0.001 (3001 seeds) finds 0 off-by-one at ' +
      'every resolution: a 50x refinement repopulates nothing, so the imp-34903/imp-34951 tail 0 is real. The ' +
      'mechanism is that the ceil phase frac(xArg) is confined to ~[0.213,0.471] over the tail, strictly below ' +
      'the fixed off-by-one window (W ~ 0.8516, 1). The depletion is NOT driven by a widening margin (the ' +
      'imp-34951 margin is exactly uniform); it is the slow monotone upward drift of the ceil phase ' +
      '(~0.0187 per decade, floor pinned at 11), which re-enters the window at N ~ 10^27.08, where off-by-one ' +
      'seeds REAPPEAR (all -1). So imp-34903 "vanishes above 1e12" is a local ~15-decade phase gap over ' +
      '[1e12, ~1e27], not permanent extinction, subject to the named sub-gap imp-34997a.',
  },
  finding:
    'Refining the (1e12,1e15] tail seed grid 50x, from the imp-34903 coarse 10^0.05 (60 seeds) to 10^0.001 ' +
    '(3001 seeds), finds ZERO off-by-one seeds at every resolution -- the tail 0 reported by imp-34903/imp-34951 ' +
    'is a genuine depletion, NOT a coarse-grid sampling artifact. The mechanism is geometric: over the tail the ' +
    'terminal ceil phase frac(xArg) is confined to ~[0.213,0.471], strictly below the fixed off-by-one phase ' +
    'window (W ~ 0.8516, 1) of width OFFSET = log(EPS_FP/penult)/ln(1/r) ~ 0.1484. But the depletion is FINITE, ' +
    'not asymptotic: the imp-34951 margin is exactly uniform (nothing widens), and the real driver is the slow ' +
    'monotone upward drift of the ceil phase (~0.0187 per decade while floor(xArg) stays pinned at 11), which ' +
    're-enters the off-by-one window at N ~ 10^27.08 where the population REAPPEARS (all -1, consistent with the ' +
    'imp-34903 band-wide sign). So imp-34903 "vanishes above 1e12" is a local ~15-decade phase gap, not ' +
    'permanent extinction, subject to the named surrogate-fidelity sub-gap imp-34997a.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (accuracy, frontier-direction, NOT an RH bound). Refining the imp-34903/imp-34951 (1e12,1e15] ' +
    'off-by-one tail census from the coarse 10^0.05 grid (60 seeds) up to 10^0.001 (3001 seeds) finds 0 ' +
    'off-by-one at EVERY resolution: a 50x refinement repopulates nothing, so the tail 0 is a genuine depletion ' +
    'and NOT a coarse-grid sampling artifact. The tail 0 is explained by the terminal ceil phase frac(xArg) ' +
    'sitting confined to ~[0.213,0.471], strictly below the fixed off-by-one phase window (W ~ 0.8516, 1). The ' +
    'depletion is FINITE, not asymptotic: the imp-34951 penultimate margin is exactly uniform (nothing widens), ' +
    'and the driver is the slow monotone upward drift of the ceil phase (~0.0187 per decade, floor pinned at ' +
    '11), which re-enters the window at N ~ 10^27.08 where off-by-one seeds REAPPEAR (all -1). So imp-34903 ' +
    '"vanishes above 1e12" is a local ~15-decade phase gap over [1e12, ~1e27], subject to the named ' +
    'surrogate-fidelity sub-gap imp-34997a (certify the phase drift / reentry against a higher-precision ' +
    'recomputation; inherits imp-34951a / imp-34926a). IEEE-754 double precision; the component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/ ' +
    'imp-2643) and the C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no ' +
    'bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34903 (parent: 0 off-by-one above 1e12 on the 10^0.05 grid); imp-34951 (uniform quantized penult ' +
    'margin; sub-gap imp-34951a); imp-34926 (terminal ceil-boundary geometry; +1 impossibility); imp-34775 ' +
    '(derives the closed-form log law and the ceil rounding floor); imp-2642 (C_C = (1/8) sqrt(3 pi) ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN Riemann-von Mangoldt inverse).',
};

export const IMP34997_ITERS_TO_FLOOR_TAIL_GRID_REFINEMENT_ASSERTIONS = [
  {
    // The coarse baseline reproduces imp-34903: (1e12,1e15] at 10^0.05 has 60 seeds and 0 off-by-one.
    id: 'imp34997-coarse-baseline-reproduces-imp34903',
    description: 'the (1e12,1e15] tail at 10^0.05 reproduces imp-34903 SUB_ABOVE: 60 seeds, 0 off-by-one',
    holds: () => COARSE.seeds === 60 && COARSE.offByOne === 0,
  },
  {
    // The 50x refinement repopulates NOTHING: 0 off-by-one at every resolution down to 10^0.001 (3001 seeds).
    id: 'imp34997-refinement-repopulates-nothing',
    description: 'refining (1e12,1e15] to 10^0.001 (3001 seeds) keeps off-by-one 0 at every resolution',
    holds: () => FINEST.grid_step_exp === 0.001 && FINEST.seeds === 3001 && FINEST.offByOne === 0 && TAIL_ALL_ZERO === true,
  },
  {
    // The tail 0 is explained by the ceil phase sitting strictly below the fixed off-by-one window (W, 1).
    id: 'imp34997-phase-below-off-by-one-window',
    description: 'over (1e12,1e15] max frac(xArg) < window edge W ~ 0.8516; floor(xArg) pinned at 11',
    holds: () =>
      PHASE_BELOW_WINDOW === true &&
      TAIL_PHASE.maxFrac < WINDOW_LOWER_EDGE &&
      Math.abs(WINDOW_LOWER_EDGE - 0.851592) < 1e-5 &&
      TAIL_PHASE.floorValues.length === 1 &&
      TAIL_PHASE.floorValues[0] === 11,
  },
  {
    // The depletion is FINITE: the phase drifts up and off-by-one seeds REAPPEAR near N ~ 10^27, all -1.
    id: 'imp34997-finite-gap-reappears-near-1e27',
    description: 'off-by-one reappears at reentry exp ~27.08 (all -1): a finite phase gap, not extinction',
    holds: () =>
      REENTRY_EXP > 26 &&
      REENTRY_EXP < 28 &&
      PHASE_DRIFT_PER_DECADE > 0 &&
      REENTRY_BAND.offByOne > 0 &&
      REENTRY_BAND.plusOne === 0,
  },
  {
    // Honesty gate: measurement of a surrogate census, not rigorous, no QED, no refereed bound is changed, sub-gap named.
    id: 'imp34997-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, sub-gap named',
    holds: () =>
      IMP34997_ITERS_TO_FLOOR_TAIL_GRID_REFINEMENT.isRigorous === false &&
      /NO QED/.test(IMP34997_ITERS_TO_FLOOR_TAIL_GRID_REFINEMENT.verdict) &&
      /refereed bound is changed/i.test(IMP34997_ITERS_TO_FLOOR_TAIL_GRID_REFINEMENT.verdict) &&
      /imp-34997a/.test(IMP34997_ITERS_TO_FLOOR_TAIL_GRID_REFINEMENT.summary.residual_sub_gap_imp_34997a),
  },
];

for (const a of IMP34997_ITERS_TO_FLOOR_TAIL_GRID_REFINEMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34997-iters-to-floor-tail-grid-refinement assertion failed: ${a.id}`);
  }
}
