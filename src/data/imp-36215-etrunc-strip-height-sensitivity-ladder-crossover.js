/**
 * @module imp-36215-etrunc-strip-height-sensitivity-ladder-crossover
 *
 * imp-36215 (numerical, S-frontier, MEASUREMENT ONLY): imp-35164 records the honest Step-4
 * status -- on the CURRENT surrogate E(N) = E_coll + E_trunc + E_flow does NOT tend to 0, it
 * FLOORS at the fixed-strip constant E_trunc = 3.06e-5 (imp-2631, sigma = 3/4, verified height
 * T_v = T_PT = 3e12), and the only scoped route that would change this is imp-35149's Knob A: an
 * N-indexed GROWING verified height T_v(N) at fixed abscissa. imp-35169 derived the closed-form
 * balance GROWTH LAW T_v*(N) and its critical exponent beta_crit = 1.25, but reported the crossover
 * only via posited amplitude laws T_v = A N^{1.25} out to abstract N <= 1e40. THIS module does the
 * on-ticket per-rung measurement: it MEASURES E_trunc as a function of the strip-height parameter
 * T_v and TABULATES, at each rung of the actual imp-321 N-ladder {2458, 5000, 1e4, 1e5, 1e6, 1e7,
 * 1e8}, the crossover verified height T_v_cross(N) at which E_trunc(T_v) would fall below the
 * surrogate E_coll(N) -- i.e. how far T_v must grow before E_trunc drops below E_coll AT EACH RUNG.
 *
 * WHY THIS IS DISTINCT FROM imp-35169
 * -----------------------------------
 * imp-35169 gave the growth-law FORM T_v*(N) = (3/C_C)^{2.5}(N/log T0)^{1.25} and studied where a
 * posited T_v = A N^{1.25} crosses for abstract N up to 1e40 (an amplitude-sensitivity study). It
 * did NOT instantiate the crossover verified height on the concrete imp-321 ladder rungs that the
 * rest of the project actually runs. This module supplies exactly that missing per-rung table --
 * T_v_cross(N) evaluated at {2458 .. 1e8} against each rung's own effectiveHeightForN(N) -- and
 * reads off the qualitative finding the abstract law obscures: over the WHOLE imp-321 ladder the
 * required crossover verified height sits strictly BELOW the Platt-Trudgian T_PT = 3e12, so on the
 * ladder the fixed strip is already more than adequate and E_trunc is NOT the binding term.
 *
 * THE E_trunc STRIP-HEIGHT SENSITIVITY (inherited imp-2631 model, not re-derived)
 * ------------------------------------------------------------------------------
 *     E_trunc(T_v) = (2 e / kappa) T_v^{-kappa},  kappa = 1 - e,  e = 3(1-sigma)/(2-sigma) (Ingham)
 * At the fixed working abscissa sigma = 3/4: e = 0.6, kappa = 0.4, prefactor 2e/kappa = 3.0, so
 * E_trunc(T_v) = 3.0 T_v^{-0.4} and E_trunc(T_PT) = 3.0 (3e12)^{-0.4} = 3.0639e-5 (the imp-2631
 * fixed floor). The strip-height ELASTICITY is CONSTANT:
 *     d log E_trunc / d log T_v = -kappa = -0.4,
 * i.e. each decade of verified height multiplies E_trunc by 10^{-0.4} = 0.39811 (a ~2.51x drop per
 * decade). This is the entire sensitivity of the floor to the strip-height parameter -- a fixed
 * algebraic elasticity, independent of T_v and of N.
 *
 * THE PER-RUNG CROSSOVER VERIFIED HEIGHT (the on-ticket table)
 * -----------------------------------------------------------
 * Solving E_trunc(T_v) = E_coll(N) for the verified height gives the crossover
 *     T_v_cross(N) = (3.0 / E_coll(N))^{1/kappa} = (3.0 / E_coll(N))^{2.5},
 *     E_coll(N) = C_C sqrt(log T0 / N),  T0 = effectiveHeightForN(N)  (GUE-conditional C_H, imp-486).
 * Across the imp-321 ladder E_coll(N) runs 2.19e-2 (N=2458) down to 1.61e-4 (N=1e8) -- ALL well
 * ABOVE the fixed floor 3.06e-5 -- so T_v_cross(N) runs 2.20e5 up to 4.75e10, EVERY rung BELOW
 * T_PT = 3e12 (ratio T_v_cross/T_PT: 7.3e-8 -> 1.58e-2). Interpretation: on the imp-321 ladder the
 * dominant surrogate term is E_coll, not E_trunc; the fixed strip already keeps E_trunc a factor
 * ~5x to ~700x below E_coll, so the Knob-A demand "grow T_v" does NOT bite on the ladder -- it need
 * not grow at all there. The growing-verified-height obligation is an EXTRAPOLATION-scale demand.
 *
 * WHERE THE FIXED STRIP FIRST BECOMES INSUFFICIENT (beyond the ladder)
 * -------------------------------------------------------------------
 * T_v_cross(N) first reaches T_PT = 3e12 when E_coll(N) falls to the fixed floor 3.0639e-5, i.e. at
 * N_cross ~ 3.27e9 (log10 ~ 9.51) -- the imp-33723/imp-36174 E_coll = E_trunc crossover, BEYOND the
 * imp-321 ladder top (N = 1e8). Only for N > N_cross does E_coll drop below the fixed floor, at
 * which point the fixed T_PT = 3e12 is no longer enough and Knob A's growing T_v(N) ~ N^{1.25}
 * (imp-35169) is required. So the transition from "fixed strip adequate" to "must grow T_v" happens
 * one and a half decades of N above the ladder ceiling, not on it.
 *
 * MEASUREMENT ONLY on the inherited imp-2631/imp-3220/imp-3406 surrogate. T_v growth remains an
 * INPUT hypothesis (imp-35149 R3 stays OPEN and binding: an unconditional growing verified height
 * beyond T_PT = 3e12 is RH-free-compute-or-RH-circular); certifies no assembled bound; supplies no
 * T_v(N) -> infinity; the C_mb GUE-conditional per imp-486 is UNTOUCHED and SEPARATE from R3; the
 * imp-2631 fixed strip is UNTOUCHED; C_C 1/8 ansatz (imp-2642) UNTOUCHED; imp-3066 K_a >= 0
 * untouched; changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35149-vanishing-etrunc-strip-scope (Knob A named the only vanishing lever; R3 binding)
 * @see imp-35169-knobA-growth-law-crossover (closed-form growth law + amplitude-sensitivity study)
 * @see imp-2631-honest-truncation-route-assessment (E_trunc = (2e/kappa) T_v^{-kappa}, fixed strip)
 * @see imp-36174-eflow-strictness-margin-shortfall-height-ladder (N_cross ~ 3.28e9 sibling landmark)
 * @see lambda-pt-scale-extrapolation (the imp-321 N-ladder consumed here)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = instantiation height)
 * @see imp-486 (C_mb GUE-conditional; separate conditional from the R3 verified-height input)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { PT_SCALE_EXTRAPOLATION } from './lambda-pt-scale-extrapolation.js';

const T_PT = 3e12; // Platt-Trudgian verified height (imp-2631)
const SIGMA = 0.75; // fixed working abscissa
const E_ING = (3 * (1 - SIGMA)) / (2 - SIGMA); // Ingham density exponent = 0.6
const KAPPA = 1 - E_ING; // = 0.4
const PREFACTOR = (2 * E_ING) / KAPPA; // = 3.0

// E_trunc via the imp-2631 tail integral at fixed sigma = 3/4: 3.0 * T_v^{-0.4}.
const eTrunc = (T_v) => (T_v > 1 ? PREFACTOR * Math.pow(T_v, -KAPPA) : null);
// E_coll keys off T0 = effectiveHeightForN(N), NEVER the verified height T_v (imp-35149 R4).
function eColl(N) {
  const T0 = effectiveHeightForN(N);
  return C_C_PINNED * Math.sqrt(Math.log(T0) / N);
}
// Crossover verified height: E_trunc(T_v_cross) = E_coll(N) -> T_v_cross = (3/E_coll)^{1/kappa}.
const tvCross = (E_coll) => Math.pow(PREFACTOR / E_coll, 1 / KAPPA);

// Reuse gate: the imp-2631/imp-35149/imp-35169 fixed-strip floor E_trunc(T_PT) ~ 3.06e-5.
const E_TRUNC_FIXED = eTrunc(T_PT); // ~3.0639e-5

// The constant strip-height elasticity d log E_trunc / d log T_v = -kappa, and the per-decade factor.
const ELASTICITY = -KAPPA; // = -0.4
const PER_DECADE_FACTOR = Math.pow(10, ELASTICITY); // = 10^{-0.4} = 0.39811

// The imp-321 N-ladder, consumed live (single source of truth), rungs {2458 .. 1e8}.
const LADDER = PT_SCALE_EXTRAPOLATION.ladder.map((r) => {
  const N = r.N;
  const T0 = effectiveHeightForN(N);
  const E_coll = eColl(N);
  const T_v_cross = tvCross(E_coll);
  return {
    N,
    T0: +T0.toExponential(6),
    E_coll: +E_coll.toExponential(6),
    E_trunc_fixed_over_E_coll: +(E_TRUNC_FIXED / E_coll).toExponential(6), // < 1 => fixed strip adequate
    T_v_cross: +T_v_cross.toExponential(6), // verified height at which E_trunc = E_coll
    log10_T_v_cross: +Math.log10(T_v_cross).toFixed(4),
    T_v_cross_over_T_PT: +(T_v_cross / T_PT).toExponential(6), // < 1 across the whole ladder
    fixed_strip_adequate: T_v_cross < T_PT, // E_trunc already below E_coll at T_PT
  };
});

// Where the fixed strip first becomes INSUFFICIENT: E_coll(N) = E_TRUNC_FIXED, i.e. T_v_cross = T_PT.
// Bisect in log10 N (E_coll strictly decreasing in N). This is the imp-33723/imp-36174 N_cross.
function nCrossFixedStrip() {
  let lo = 6;
  let hi = 12;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (eColl(Math.pow(10, mid)) > E_TRUNC_FIXED) lo = mid;
    else hi = mid;
  }
  return Math.pow(10, (lo + hi) / 2);
}
const N_CROSS_FIXED_STRIP = nCrossFixedStrip(); // ~3.27e9, log10 ~9.51 (beyond the ladder top 1e8)

// Diagnostics for findings/assertions.
const LADDER_ALL_BELOW_TPT = LADDER.every((r) => r.T_v_cross_over_T_PT < 1 && r.fixed_strip_adequate);
const LADDER_TV_CROSS_MONOTONE = (() => {
  for (let i = 1; i < LADDER.length; i++) {
    if (!(LADDER[i].T_v_cross > LADDER[i - 1].T_v_cross)) return false;
  }
  return true;
})();
const LADDER_TOP = LADDER[LADDER.length - 1]; // N = 1e8
const LADDER_BOTTOM = LADDER[0]; // N = 2458
const N_CROSS_ABOVE_LADDER = N_CROSS_FIXED_STRIP > LADDER_TOP.N;

export const IMP36215_ETRUNC_STRIP_HEIGHT_SENSITIVITY_LADDER_CROSSOVER = {
  id: 'imp-36215',
  proofSection: 'S-frontier',
  question:
    'Measure the sensitivity of the honest-status E_trunc = 3.06e-5 fixed-strip floor to the ' +
    'strip-height / abscissa parameter across the imp-321 N-ladder, and tabulate at each rung the ' +
    'verified height T_v at which E_trunc would fall below the surrogate E_coll (the crossover ' +
    'height) -- quantifying how far T_v must grow (imp-35149 Knob A) before E_trunc drops below ' +
    'E_coll at each rung. Measurement of the surrogate only; certifies no assembled bound; supplies ' +
    'no T_v(N) -> infinity (R3 stays OPEN); C_mb GUE-conditional per imp-486; NO QED.',
  model:
    'E_trunc(T_v) = (2e/kappa) T_v^{-kappa} = 3.0 T_v^{-0.4} (imp-2631, sigma = 3/4, kappa = 0.4); ' +
    'E_coll(N) = C_C sqrt(log T0/N) (GUE-conditional C_H, imp-486); crossover verified height ' +
    'T_v_cross(N) = (3.0/E_coll(N))^{1/kappa} = (3.0/E_coll(N))^{2.5}.',
  stripHeightSensitivity: {
    elasticity_dlogEtrunc_dlogTv: ELASTICITY, // = -0.4, constant (independent of T_v and N)
    per_decade_factor: +PER_DECADE_FACTOR.toFixed(6), // 10^{-0.4} = 0.398107 (~2.51x drop per decade)
    statement:
      'The floor sensitivity to the strip-height parameter is a CONSTANT algebraic elasticity ' +
      'd log E_trunc / d log T_v = -kappa = -0.4: every decade of verified height multiplies ' +
      'E_trunc by 10^{-0.4} ~ 0.398 (a ~2.51x drop), independent of T_v and of N.',
    E_trunc_fixed_at_T_PT: +E_TRUNC_FIXED.toExponential(6), // ~3.0639e-5 (the imp-2631 floor)
  },
  ladder: LADDER,
  fixedStripFirstInsufficient: {
    N_cross: +N_CROSS_FIXED_STRIP.toExponential(6), // ~3.27e9
    log10_N_cross: +Math.log10(N_CROSS_FIXED_STRIP).toFixed(4), // ~9.51
    statement:
      'T_v_cross(N) first reaches T_PT = 3e12 (fixed strip first becomes insufficient) when E_coll(N) ' +
      'falls to the fixed floor 3.0639e-5, at N_cross ~ 3.27e9 (log10 ~9.51) -- the imp-33723/imp-36174 ' +
      'E_coll = E_trunc crossover, ONE AND A HALF DECADES of N ABOVE the imp-321 ladder top (N = 1e8). ' +
      'Only for N > N_cross does the fixed T_PT stop sufficing and Knob A T_v(N) ~ N^{1.25} kick in.',
  },
  landmarks: {
    T_v_cross_at_2458: LADDER_BOTTOM.T_v_cross, // ~2.20e5
    T_v_cross_at_1e8: LADDER_TOP.T_v_cross, // ~4.75e10 (still < T_PT = 3e12)
    T_v_cross_over_T_PT_at_1e8: LADDER_TOP.T_v_cross_over_T_PT, // ~1.58e-2 < 1
    N_cross_fixed_strip: +N_CROSS_FIXED_STRIP.toExponential(6), // ~3.27e9
  },
  finding: {
    M1_constant_elasticity:
      'E_trunc sensitivity to the strip-height parameter is a fixed elasticity ' +
      'd log E_trunc / d log T_v = -0.4 (10^{-0.4} ~ 0.398 per decade), independent of T_v and N -- ' +
      'the floor responds to the verified height only algebraically at rate kappa = 0.4.',
    M2_ladder_crossover_below_T_PT:
      'At EVERY imp-321 ladder rung {2458 .. 1e8} the crossover verified height T_v_cross(N) = ' +
      '(3.0/E_coll)^{2.5} sits strictly BELOW T_PT = 3e12 (2.20e5 -> 4.75e10, ratio 7.3e-8 -> 1.58e-2), ' +
      'because E_coll(N) (2.19e-2 -> 1.61e-4) stays above the fixed floor 3.06e-5 across the ladder. So ' +
      'on the ladder the fixed strip is already adequate and E_trunc is NOT the binding term -- the ' +
      'Knob-A demand to grow T_v does not bite on the ladder.',
    M3_transition_beyond_ladder:
      'The fixed T_PT = 3e12 first becomes insufficient only at N_cross ~ 3.27e9 (log10 ~9.51), one ' +
      'and a half decades of N ABOVE the imp-321 ladder ceiling (1e8). The growing-verified-height ' +
      'obligation (imp-35149 R3 / imp-35169 T_v ~ N^{1.25}) is therefore an EXTRAPOLATION-scale ' +
      'demand, not a ladder-scale one -- and R3 stays OPEN and binding beyond N_cross.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The E_trunc = 3.06e-5 fixed-strip floor ' +
    '(imp-2631, sigma = 3/4, T_v = T_PT = 3e12) responds to the strip-height parameter through a ' +
    'CONSTANT algebraic elasticity d log E_trunc / d log T_v = -kappa = -0.4 (each verified-height ' +
    'decade multiplies E_trunc by 10^{-0.4} ~ 0.398, ~2.51x, independent of T_v and N). Tabulating ' +
    'the crossover verified height T_v_cross(N) = (3.0/E_coll(N))^{2.5} across the concrete imp-321 ' +
    'N-ladder {2458, 5000, 1e4, 1e5, 1e6, 1e7, 1e8} shows T_v_cross runs 2.20e5 up to 4.75e10 -- ' +
    'EVERY rung strictly BELOW T_PT = 3e12 (ratio 7.3e-8 to 1.58e-2) -- because E_coll(N) (2.19e-2 ' +
    'down to 1.61e-4) stays above the fixed floor 3.06e-5 throughout. So over the ladder the fixed ' +
    'strip is already MORE than adequate: E_coll is the dominant surrogate term and E_trunc is NOT ' +
    'binding, hence "how far must T_v grow before E_trunc drops below E_coll" answers "not at all on ' +
    'the ladder". The fixed T_PT first becomes insufficient only at N_cross ~ 3.27e9 (log10 ~9.51), ' +
    'one and a half decades of N ABOVE the ladder top (1e8) -- the imp-33723/imp-36174 E_coll = ' +
    'E_trunc crossover -- beyond which the Knob-A growing height T_v(N) ~ N^{1.25} (imp-35169) is ' +
    'required. So the growing-verified-height demand is an EXTRAPOLATION-scale obligation, not a ' +
    'ladder-scale one. MEASUREMENT ONLY: T_v growth stays an INPUT hypothesis; certifies no assembled ' +
    'bound; supplies no T_v(N) -> infinity; imp-35149 R3 stays OPEN and binding beyond N_cross ' +
    '(unconditional growing verified height past T_PT = 3e12 is RH-free-compute-or-RH-circular); the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED and SEPARATE from R3; the imp-2631 fixed strip is ' +
    'UNTOUCHED; C_C 1/8 ansatz (imp-2642) UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35164 (Step-4 honest status: E(N) floors at E_trunc); imp-35149 (Knob A only vanishing ' +
    'lever, R3 binding); imp-35169 (closed-form growth law + amplitude-sensitivity); imp-2631 ' +
    '(E_trunc = (2e/kappa) T_v^{-kappa}, fixed strip); imp-33723/imp-36174 (E_coll = E_trunc N_cross ' +
    '~3.28e9); imp-486 (C_mb GUE-conditional, separate from R3); lambda-pt-scale-extrapolation ' +
    '(imp-321 N-ladder); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP36215_ETRUNC_STRIP_HEIGHT_SENSITIVITY_LADDER_CROSSOVER_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-2631 / imp-35149 / imp-35169 fixed-strip floor E_trunc ~ 3.06e-5.
    id: 'imp36215-reproduces-fixed-strip-constant',
    description: 'E_trunc(T_PT) ~ 3.06e-5 on the shared imp-2631 3.0 T_v^{-0.4} model',
    holds: () => Math.abs(E_TRUNC_FIXED / 3.06e-5 - 1) < 5e-3,
  },
  {
    // (M1): the strip-height elasticity is the constant -kappa = -0.4 (per-decade factor 10^{-0.4}).
    id: 'imp36215-constant-elasticity',
    description: 'd log E_trunc / d log T_v = -0.4 and per-decade factor = 10^{-0.4} ~ 0.3981',
    holds: () =>
      Math.abs(ELASTICITY + 0.4) < 1e-12 && Math.abs(PER_DECADE_FACTOR - 0.398107) < 1e-5,
  },
  {
    // The crossover verified height is a genuine root: recompute unrounded per rung and check
    // E_trunc(T_v_cross) = E_coll to machine precision (the stored table is rounded to 6 sig figs).
    id: 'imp36215-tv-cross-is-a-root',
    description: 'E_trunc(T_v_cross(N)) = E_coll(N) to machine precision at every ladder rung',
    holds: () =>
      LADDER.every((r) => {
        const E_coll = eColl(r.N);
        return Math.abs(eTrunc(tvCross(E_coll)) / E_coll - 1) < 1e-9;
      }),
  },
  {
    // (M2): across the WHOLE imp-321 ladder the crossover verified height stays below T_PT = 3e12,
    // and rises monotonically with N -- the fixed strip is already adequate on the ladder.
    id: 'imp36215-ladder-crossover-below-T_PT',
    description: 'T_v_cross(N) < T_PT = 3e12 at every imp-321 rung {2458..1e8}, monotone increasing',
    holds: () => LADDER_ALL_BELOW_TPT && LADDER_TV_CROSS_MONOTONE && LADDER.length === 7,
  },
  {
    // (M3): the fixed strip first becomes insufficient only BEYOND the ladder top, at N_cross ~3.27e9
    // (the imp-33723/imp-36174 E_coll = E_trunc crossover, ~1.5 decades of N above 1e8).
    id: 'imp36215-fixed-strip-first-insufficient-beyond-ladder',
    description: 'N_cross (E_coll = E_trunc_fixed) ~3.27e9 lies ABOVE the ladder top N = 1e8',
    holds: () =>
      N_CROSS_ABOVE_LADDER &&
      Math.abs(N_CROSS_FIXED_STRIP / 3.28e9 - 1) < 5e-2 &&
      Math.abs(eColl(N_CROSS_FIXED_STRIP) / E_TRUNC_FIXED - 1) < 1e-6,
  },
  {
    // Honesty gate: measurement only, no QED, R3 open, GUE-conditional noted, no refereed bound is changed.
    id: 'imp36215-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, R3/GUE-conditional noted, no refereed bound is changed',
    holds: () =>
      IMP36215_ETRUNC_STRIP_HEIGHT_SENSITIVITY_LADDER_CROSSOVER.isRigorous === false &&
      /NO QED/.test(IMP36215_ETRUNC_STRIP_HEIGHT_SENSITIVITY_LADDER_CROSSOVER.verdict) &&
      /R3/.test(IMP36215_ETRUNC_STRIP_HEIGHT_SENSITIVITY_LADDER_CROSSOVER.verdict) &&
      /imp-486/.test(IMP36215_ETRUNC_STRIP_HEIGHT_SENSITIVITY_LADDER_CROSSOVER.verdict) &&
      /refereed bound is changed/i.test(IMP36215_ETRUNC_STRIP_HEIGHT_SENSITIVITY_LADDER_CROSSOVER.verdict),
  },
];

for (const a of IMP36215_ETRUNC_STRIP_HEIGHT_SENSITIVITY_LADDER_CROSSOVER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-36215-etrunc-strip-height-sensitivity-ladder-crossover assertion failed: ${a.id}`,
    );
  }
}

export default IMP36215_ETRUNC_STRIP_HEIGHT_SENSITIVITY_LADDER_CROSSOVER;
