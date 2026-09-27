/**
 * @module imp-124853-sigma-half-crossover-etrunc-offset-ladder
 *
 * imp-124853 (numerical, frontier-direction): the lambda-roadmap currentStatus (imp-33582)
 * reports the GUE-conditional share halving landmark N_half ~ 3.27e9 (sigma = 1/2) matching
 * the independent imp-3444 crossover N_cross ~ 3.28e9 (E_coll = E_trunc) "to ~0.4%", but that
 * agreement is stated as PROSE and pinned only at the single imp-2631 floor E_trunc = 3.06e-5.
 * imp-33601/imp-33723 measured the ~0.4% offset (only at factor = 1); imp-33708 swept the
 * E_trunc floor 0.5x..5x but tracked each SINGLE sigma-crossing (halving and sub-0.1), never
 * the AGREEMENT BETWEEN the two landmarks. This module supplies the missing cross-validation
 * OBJECT: it recomputes BOTH landmarks per floor and tabulates how their relative offset moves
 * across the imp-33708 0.5x..5x floor ladder.
 *
 * THE TWO LANDMARKS (identical component model to imp-33582 / imp-33601 / imp-33708)
 * --------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0      = effectiveHeightForN(N)            (Riemann-von Mangoldt inverse)
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)     (GUE-conditional, dominant)
 *     E_flow  = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5 * factor                  (perturbed floor; base imp-2631)
 *   N_half  : downslope solution of sigma(N) = 1/2        (imp-33582 halving landmark)
 *   N_cross : downslope solution of E_coll(N) = E_trunc   (imp-3444 crossover)
 * Every sub-term is reused byte-for-byte; factor = 1 reproduces the imp-33582 pins, so the
 * factor = 1 row of the ladder IS the prose "~0.4%" agreement stated in the roadmap.
 *
 * THE MEASUREMENT: the N_half vs N_cross agreement across the 0.5x..5x floor ladder
 * --------------------------------------------------------------------------------
 * For each floor factor in {0.5..5} both landmarks are re-located by downslope bisection in
 * log N, and the relative offset relOff = (N_cross - N_half)/N_cross is tabulated. The offset
 * is also compared to imp-33601's leading E_flow prediction relOff ~ 1 - (1 + E_flow/E_trunc)^-2
 * at each floor, to test whether the E_flow attribution survives the whole ladder.
 *
 * THE FINDING (measurement / cross-validation only)
 * -------------------------------------------------
 *   (F0) BASELINE REPRODUCES THE PROSE PIN. factor 1.0 gives N_half ~ 3.2672e9,
 *        N_cross ~ 3.2803e9 and relOff ~ 3.98e-3 -- the exact imp-33582/imp-33601/imp-33723
 *        "matches to ~0.4%" agreement, now an explicit tabulated cross-validation row rather
 *        than prose.
 *   (F1) THE AGREEMENT IS NOT FLOOR-INVARIANT -- IT DEGRADES MONOTONICALLY WITH THE FLOOR.
 *        The relative offset RISES monotonically across the ladder, from ~2.28e-3 at 0.5x to
 *        ~1.39e-2 at 5x (a ~6.1x span), scaling roughly as relOff ~ factor^0.79. So the tight
 *        "~0.4%" agreement is SPECIFIC to the imp-2631 floor; a heavier floor separates the two
 *        landmarks (the agreement is tightest at small floor, ~0.23% at 0.5x).
 *   (F2) THE E_flow ATTRIBUTION SURVIVES THE WHOLE LADDER. imp-33601's leading prediction
 *        relOff ~ 1 - (1 + E_flow/E_trunc)^-2 explains a STABLE ~95% of the measured offset at
 *        EVERY floor (fraction 0.947..0.957), so the offset is the Gronwall flow term E_flow
 *        throughout -- not a floor artifact. The reason it grows: a heavier floor pulls BOTH
 *        landmarks to smaller N (both scale ~E_trunc^-2, imp-33708), and at smaller N the
 *        surplus E_flow/E_trunc is larger (E_flow ~ log T0 / T0 grows as T0 shrinks while
 *        E_trunc rises only proportionally), so the two landmarks separate more. The residual
 *        ~5% is the slow log T0(N) second order, stable across the ladder (imp-33601 D2).
 *
 * VERDICT: the imp-33582 "sigma = 1/2 matches E_coll = E_trunc to ~0.4%" prose is now a
 * tabulated floor-ladder cross-validation object. The ~0.4% pin is reproduced at factor = 1 but
 * is NOT structural: the offset grows monotonically ~factor^0.79 across the 0.5x..5x floor
 * ladder (~0.23% -> ~1.4%), and the E_flow attribution (imp-33601) holds to a stable ~95% at
 * every floor. So the agreement is genuine and E_flow-signed but floor-model-dependent in size,
 * consistent with imp-33708's "robust qualitatively, fragile quantitatively" for the individual
 * landmarks.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED
 * (imp-2642/imp-2643); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (exact identity sigma=1/2 <=> E_coll=E_trunc+E_flow, offset at factor=1)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form N_cross fixed point at factor=1)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (0.5x..5x floor sweep of each SINGLE landmark, N ~ E_trunc^-2)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (prose "matches to ~0.4%" pin)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-2631 (E_trunc = 3.06e-5 fixed-strip truncation floor, the perturbed base)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-33582 pin)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-33601/imp-33708 exactly

// EXACT imp-33582/imp-33601/imp-33708 sub-terms; ONLY the E_trunc floor is a parameter here.
function partsWith(N, E_trunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return { T0, L, E_flow, E_coll, sigma: E_coll / (E_trunc + E_flow + E_coll) };
}

// Downslope bisection in log N for a strictly-decreasing quantity f: first N with f < target.
function crossBelow(f, target, lo = 1e6, hi = 1e18) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (f(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// factor 1.0 REPRODUCES imp-33582. The 0.5x..5x ladder is the imp-33708 floor sweep.
const FLOOR_FACTORS = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0, 3.0, 5.0];

// For a floor factor: both landmarks, the offset, and imp-33601's leading E_flow prediction.
function rowFor(factor) {
  const E_trunc = E_TRUNC_BASE * factor;
  const N_half = crossBelow((N) => partsWith(N, E_trunc).sigma, 0.5); // sigma = 1/2 (imp-33582)
  const N_cross = crossBelow((N) => partsWith(N, E_trunc).E_coll, E_trunc); // E_coll = E_trunc (imp-3444)
  const relOffset = (N_cross - N_half) / N_cross; // (N_cross - N_half)/N_cross
  const r = partsWith(N_half, E_trunc).E_flow / E_trunc; // E_flow/E_trunc at N_half
  const predRelOffset = 1 - 1 / (1 + r) ** 2; // imp-33601 leading E_flow prediction
  return {
    floorFactor: factor,
    E_trunc: +E_trunc.toExponential(3),
    N_half: +N_half.toExponential(5),
    N_cross: +N_cross.toExponential(5),
    rel_offset: +relOffset.toExponential(4),
    E_flow_over_E_trunc_at_N_half: +r.toExponential(4),
    predicted_rel_offset: +predRelOffset.toExponential(4),
    fraction_explained_by_E_flow: +(predRelOffset / relOffset).toFixed(4),
    ordered: N_half < N_cross,
  };
}

const LADDER = FLOOR_FACTORS.map(rowFor);
const BASE = LADDER.find((r) => r.floorFactor === 1.0);
const LO = LADDER.find((r) => r.floorFactor === 0.5);
const HI = LADDER.find((r) => r.floorFactor === 5.0);

// Offset scaling exponent p in rel_offset ~ factor^p, from two well-separated floors (0.5x, 2x).
const O_LO = rowFor(0.5).rel_offset;
const O_2X = rowFor(2.0).rel_offset;
const OFFSET_EXPONENT = Math.log(O_2X / O_LO) / Math.log(2.0 / 0.5);
const OFFSET_SPAN = HI.rel_offset / LO.rel_offset; // ~6.1x over the ladder
const ALL_ORDERED = LADDER.every((r) => r.ordered);
const ALL_MONOTONE = LADDER.every((r, i) => i === 0 || r.rel_offset > LADDER[i - 1].rel_offset);
const FRACS = LADDER.map((r) => r.fraction_explained_by_E_flow);
const FRAC_MIN = Math.min(...FRACS);
const FRAC_MAX = Math.max(...FRACS);

export const IMP124853_SIGMA_HALF_CROSSOVER_ETRUNC_OFFSET_LADDER = {
  id: 'imp-124853',
  proofSection: 'S-frontier',
  question:
    'Tabulate the never-formalized agreement between the imp-33582 sigma = 1/2 halving landmark ' +
    'N_half ~ 3.27e9 and the independent imp-3444 E_coll = E_trunc crossover N_cross ~ 3.28e9 ' +
    '(roadmap currentStatus states "to ~0.4%" as prose): recompute both landmarks, measure the ' +
    'exact relative offset, and sweep the E_trunc floor across the imp-33708 0.5x..5x ladder to ' +
    'report how the offset moves. Measurement/cross-validation only; conditional-share diagnostic, ' +
    'NOT an RH bound; no QED.',
  measuredQuantity:
    'For E_trunc = 3.06e-5 * factor, factor in {0.5..5} (factor = 1 = imp-33582 baseline), the ' +
    'downslope N_half (sigma = 1/2) and N_cross (E_coll = E_trunc), the relative offset ' +
    '(N_cross - N_half)/N_cross, and imp-33601 leading prediction 1 - (1 + E_flow/E_trunc)^-2.',
  ladder: LADDER,
  baseline: {
    N_half: BASE.N_half, // ~3.2672e9
    N_cross: BASE.N_cross, // ~3.2803e9
    rel_offset: BASE.rel_offset, // ~3.98e-3 (the prose "~0.4%")
    fraction_explained_by_E_flow: BASE.fraction_explained_by_E_flow, // ~0.955
  },
  offsetScaling: {
    exponent_relOffset_vs_factor: +OFFSET_EXPONENT.toFixed(4), // ~0.79
    span_over_ladder: +OFFSET_SPAN.toFixed(4), // ~6.1x (0.5x -> 5x)
    monotone_increasing_in_floor: ALL_MONOTONE,
    rel_offset_0_5x: LO.rel_offset, // ~2.28e-3
    rel_offset_5x: HI.rel_offset, // ~1.39e-2
  },
  eflowAttribution: {
    fraction_explained_min: +FRAC_MIN.toFixed(4), // ~0.947
    fraction_explained_max: +FRAC_MAX.toFixed(4), // ~0.957
    note:
      'imp-33601 leading E_flow prediction explains a stable ~95% of the offset at every floor; ' +
      'the offset grows because a heavier floor pulls both landmarks to smaller N (both ~E_trunc^-2, ' +
      'imp-33708) where the surplus E_flow/E_trunc is larger (E_flow ~ log T0 / T0 grows as T0 ' +
      'shrinks while E_trunc rises only proportionally). The residual ~5% is the slow log T0 second ' +
      'order (imp-33601 D2), stable across the ladder.',
  },
  finding: {
    F0_baseline_reproduces_prose_pin:
      'factor 1.0 gives N_half ~ 3.2672e9, N_cross ~ 3.2803e9 and rel offset ~3.98e-3 -- the exact ' +
      'imp-33582/imp-33601/imp-33723 "matches to ~0.4%" agreement, now an explicit tabulated ' +
      'cross-validation row rather than roadmap prose.',
    F1_agreement_degrades_monotonically_with_floor:
      'The relative offset rises monotonically across the 0.5x..5x ladder, from ~2.28e-3 (0.5x) to ' +
      '~1.39e-2 (5x) -- a ~6.1x span scaling roughly as rel_offset ~ factor^0.79. The tight "~0.4%" ' +
      'agreement is SPECIFIC to the imp-2631 floor; a heavier floor separates the two landmarks ' +
      '(tightest ~0.23% at 0.5x).',
    F2_eflow_attribution_survives_the_ladder:
      'imp-33601 leading prediction 1 - (1 + E_flow/E_trunc)^-2 explains a STABLE ~95% (0.947..0.957) ' +
      'of the offset at every floor, so the offset is the Gronwall flow term E_flow throughout, not a ' +
      'floor artifact. It grows because a heavier floor pulls both landmarks (~E_trunc^-2, imp-33708) ' +
      'to smaller N where the E_flow/E_trunc surplus is larger; the residual ~5% is the slow log T0 ' +
      'second order (imp-33601 D2), stable across the ladder.',
  },
  isRigorous: false,
  verdict:
    'CROSS-VALIDATION (frontier-direction, NOT rigorous). The imp-33582 "sigma = 1/2 matches ' +
    'E_coll = E_trunc to ~0.4%" prose is now a tabulated floor-ladder object: factor 1.0 reproduces ' +
    'the pin (N_half ~ 3.2672e9, N_cross ~ 3.2803e9, rel offset ~3.98e-3), but the agreement is NOT ' +
    'structural -- the offset grows monotonically ~factor^0.79 across the imp-33708 0.5x..5x floor ' +
    'ladder (~0.23% at 0.5x to ~1.4% at 5x, a ~6.1x span), while imp-33601 leading E_flow prediction ' +
    'holds to a stable ~95% at every floor. So the agreement is genuine and E_flow-signed but ' +
    'floor-model-dependent in size, consistent with imp-33708 "robust qualitatively, fragile ' +
    'quantitatively" for the individual landmarks. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33582 (prose "matches to ~0.4%" pin); imp-33601 (exact identity sigma=1/2 <=> ' +
    'E_coll=E_trunc+E_flow, offset at factor=1); imp-33723 (closed-form N_cross at factor=1); ' +
    'imp-33708 (0.5x..5x floor sweep of each single landmark, N ~ E_trunc^-2); imp-3444 ' +
    '(E_coll = E_trunc crossover N ~ 3.280e9); imp-2631 (E_trunc = 3.06e-5 fixed-strip floor); ' +
    'imp-398 (E_flow C_F prefactor); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP124853_SIGMA_HALF_CROSSOVER_ETRUNC_OFFSET_LADDER_ASSERTIONS = [
  {
    // Reuse gate: factor 1.0 reproduces the imp-33582/imp-33601 landmarks (identical formulas).
    id: 'imp124853-reproduces-baseline-landmarks',
    description: 'factor 1.0 reproduces N_half ~ 3.267e9, N_cross ~ 3.280e9 and rel offset ~3.98e-3',
    holds: () =>
      Math.abs(BASE.N_half / 3.267e9 - 1) < 5e-3 &&
      Math.abs(BASE.N_cross / 3.280294e9 - 1) < 5e-3 &&
      Math.abs(BASE.rel_offset - 3.98e-3) < 5e-4,
  },
  {
    // F1: the offset grows monotonically with the floor -- the agreement is not floor-invariant.
    id: 'imp124853-offset-grows-monotonically-with-floor',
    description: 'rel offset increases monotonically 0.5x..5x (from ~2.3e-3 to ~1.4e-2)',
    holds: () =>
      ALL_MONOTONE &&
      LO.rel_offset < BASE.rel_offset &&
      BASE.rel_offset < HI.rel_offset &&
      HI.rel_offset > 1e-2 &&
      LO.rel_offset < 3e-3,
  },
  {
    // F1 (concrete): the offset spans ~6x and scales roughly as factor^0.8 across the ladder.
    id: 'imp124853-offset-scaling-exponent-and-span',
    description: 'rel offset ~ factor^p with p in [0.6, 1.0] and a ~4x..8x span over the 0.5x..5x ladder',
    holds: () =>
      OFFSET_EXPONENT > 0.6 &&
      OFFSET_EXPONENT < 1.0 &&
      OFFSET_SPAN > 4 &&
      OFFSET_SPAN < 8,
  },
  {
    // F2: imp-33601 leading E_flow prediction explains ~95% of the offset at EVERY floor.
    id: 'imp124853-eflow-attribution-survives-the-ladder',
    description: 'E_flow leading prediction explains a stable ~95% (0.94..0.96) of the offset at every floor',
    holds: () => FRAC_MIN > 0.94 && FRAC_MAX < 0.96,
  },
  {
    // Structural: N_half precedes N_cross for every floor (the ordering is floor-independent).
    id: 'imp124853-ordering-holds-every-floor',
    description: 'N_half < N_cross for every floor factor (ordering is structural, only the gap moves)',
    holds: () => ALL_ORDERED,
  },
  {
    // Honesty gate: cross-validation/measurement only, no QED, PT stays SOTA.
    id: 'imp124853-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP124853_SIGMA_HALF_CROSSOVER_ETRUNC_OFFSET_LADDER.isRigorous === false &&
      /NO QED/.test(IMP124853_SIGMA_HALF_CROSSOVER_ETRUNC_OFFSET_LADDER.verdict) &&
      /remains SOTA/.test(IMP124853_SIGMA_HALF_CROSSOVER_ETRUNC_OFFSET_LADDER.verdict),
  },
];

for (const a of IMP124853_SIGMA_HALF_CROSSOVER_ETRUNC_OFFSET_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-124853-sigma-half-crossover-etrunc-offset-ladder assertion failed: ${a.id}`,
    );
  }
}
