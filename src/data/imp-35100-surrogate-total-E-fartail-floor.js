/**
 * @module imp-35100-surrogate-total-E-fartail-floor
 *
 * imp-35100 (numerical, frontier-direction): LAMBDA_CHAIN_STEPS Step 4 requires an EXPLICIT
 * rate E(N) -> 0. currentStatus reports the conditional share sigma = E_coll/E decays past its
 * interior peak because the constant truncation floor E_trunc outlives the vanishing
 * GUE-conditional E_coll (imp-35071 pinned the peak; imp-34130 the E_coll local exponent). But
 * the SHARE decaying is NOT the same statement as the TOTAL E(N) decaying. This module measures
 * the surrogate TOTAL E(N) = E_coll + E_trunc + E_flow ITSELF across N in [1e6, 1e13] on the
 * inherited imp-33601/imp-3406 component model and asks the Step-4 question directly: does E(N)
 * tend to 0, or does it asymptote to the N-independent constant E_trunc?
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-33601 / imp-3406 / imp-35071; no re-derivation)
 * ---------------------------------------------------------------------------------------------
 *     E(N)    = E_coll + E_trunc + E_flow
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)      (dominant tail term, GUE-conditional C_H)
 *     E_flow  = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent fixed strip, imp-2631)
 *     T0      = effectiveHeightForN(N)             (Riemann-von Mangoldt inverse, imp-327)
 *
 * THE MEASUREMENT (what the ticket asks for)
 * ------------------------------------------
 * Both N-dependent terms vanish: E_coll ~ sqrt(log T0 / N) -> 0 like N^(-1/2) (up to a slow
 * sqrt-log factor) and E_flow ~ (log T0)/T0 -> 0 even faster (T0 grows ~linearly in N). But
 * E_trunc is a CONSTANT and does not move. Therefore
 *
 *     E(N) - E_trunc = E_coll + E_flow  -> 0,      while      E(N) -> E_trunc = 3.06e-5 > 0.
 *
 * The total surrogate error does NOT tend to 0. It monotonically DESCENDS to, and FLOORS at, the
 * constant truncation term E_trunc. Across the measured ladder E(N)/E_trunc falls 48.2 -> 1.02
 * (1e6 -> 1e13) and E(1e13) is already within ~2.1% of the floor: the curve is flattening onto
 * E_trunc, not onto 0.
 *
 * THE TENSION WITH STEP 4 (measurement verdict, no re-architecture)
 * -----------------------------------------------------------------
 * Step 4 asks for E(N) -> 0. On THIS surrogate that is FALSE: the limit is the strictly positive
 * constant E_trunc, so the surrogate as written cannot supply a Step-4 E(N) -> 0 rate. The
 * vanishing part E(N) - E_trunc = E_coll + E_flow does have a rate (~N^(-1/2) sqrt-log, dominated
 * by E_coll, imp-34130), but the constant E_trunc is the exact obstruction the share-decay
 * narrative already names: the share sigma = E_coll/E drops ONLY because E_coll vanishes UNDER a
 * fixed E_trunc, which is the same reason the total floors. Closing Step 4 needs the truncation
 * constant itself to be driven to 0 (an N-dependent strip / a genuinely vanishing E_trunc route,
 * NOT the imp-2631 fixed strip) -- a bound change this measurement does not make.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (M1) E(N) IS MONOTONE DECREASING across [1e6, 1e13] but STRICTLY ABOVE E_trunc at every rung
 *        (E(N) > E_trunc since E_coll, E_flow > 0). It is bounded below by the constant floor.
 *   (M2) E(N) -> E_trunc, NOT 0. E(1e13)/E_trunc ~ 1.021 and E(1e13) - E_trunc ~ 6.5e-7 (and
 *        still shrinking), so the total asymptotes to the constant 3.06e-5, contradicting a
 *        Step-4 E(N) -> 0 reading of THIS surrogate.
 *   (M3) THE VANISHING PART IS E_coll-DOMINATED. E(N) - E_trunc = E_coll + E_flow with
 *        E_flow/E_coll -> 0 (E_flow decays ~1/T0, E_coll ~ N^(-1/2)); by 1e13 E_flow is ~8e-5 of
 *        E_coll, so the residual-above-floor is essentially E_coll and inherits its ~N^(-1/2)
 *        sqrt-log rate (imp-34130).
 *
 * MEASUREMENT ONLY. Conditional-share/component diagnostic, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; C_C 1/8 ansatz (imp-2642) UNTOUCHED; E_trunc fixed
 * strip (imp-2631) UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35071-sigma-interior-peak-closed-form (same component model; interior peak closed form)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (E_flow offset identity; same model)
 * @see imp-3406-sigma-highN-extrapolation (component model source; interior max)
 * @see imp-34130-ecoll-local-exponent-residual-close-vs-floor (E_coll ~N^-1/2 sqrt-log tail rate)
 * @see imp-2631-honest-truncation-route-assessment (E_trunc = 3.06e-5 N-independent fixed strip)
 * @see imp-486 (C_mb GUE-conditional caveat)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP35121_LADDER } from './imp-35121-ecoll-etrunc-eflow-decomposition-viz-data.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33601)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33601/imp-35071 exactly

// EXACT imp-3406/imp-33601/imp-35071 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E };
}

// Far-tail ladder across the ticket window N in [1e6, 1e13], one rung per decade.
const LADDER = [6, 7, 8, 9, 10, 11, 12, 13].map((k) => {
  const N = Math.pow(10, k);
  const p = parts(N);
  return {
    log10N: k,
    E: p.E,
    E_coll: p.E_coll,
    E_flow: p.E_flow,
    E_minus_trunc: p.E - E_TRUNC_PT, // = E_coll + E_flow (the vanishing part)
    E_over_trunc: p.E / E_TRUNC_PT, // -> 1 (floor), NOT -> 0
    E_flow_over_coll: p.E_flow / p.E_coll, // -> 0 (E_coll dominates the residual)
  };
});

const FIRST = LADDER[0]; // 1e6
const LAST = LADDER[LADDER.length - 1]; // 1e13

// (M1) monotone decreasing and strictly above the E_trunc floor at every rung.
let monotoneDecreasing = true;
let strictlyAboveFloor = true;
for (let i = 0; i < LADDER.length; i++) {
  if (i > 0 && !(LADDER[i].E < LADDER[i - 1].E)) monotoneDecreasing = false;
  if (!(LADDER[i].E > E_TRUNC_PT)) strictlyAboveFloor = false;
}

// (M2) the total floors at E_trunc, not 0: deep-tail E/E_trunc is near 1, not near 0.
const E_OVER_TRUNC_1E13 = LAST.E_over_trunc; // ~1.021
const E_MINUS_TRUNC_1E13 = LAST.E_minus_trunc; // ~6.5e-7 (shrinking toward 0)
const FLOORS_AT_TRUNC = E_OVER_TRUNC_1E13 < 1.05; // within 5% of the constant floor by 1e13
const TOTAL_NOT_TO_ZERO = LAST.E / FIRST.E > 0.01 && E_OVER_TRUNC_1E13 > 0.9; // E stays O(E_trunc)

// (M3) the residual above the floor is E_coll-dominated; E_flow/E_coll -> 0.
const EFLOW_FRACTION_1E13 = LAST.E_flow_over_coll; // ~8e-5
const EFLOW_FRACTION_SHRINKS = LAST.E_flow_over_coll < FIRST.E_flow_over_coll;

// (imp-35159) Cross-module Gronwall-factor consistency. imp-35105 pins
// GRONWALL = exp(2.37e-4) "matches imp-34970/imp-34954 exactly"; this module uses the
// same numeral (line 77-78). imp-35121 ships baked E_flow literals with no live recompute.
// Recompute E_flow(N) here (which applies THIS module GRONWALL) and confirm it reproduces
// every imp-35121 baked E_flow rung to storage sig-fig precision -- so all three modules
// apply the identical Gronwall multiplier exp(2.37e-4), not a drifted value. A missing or
// drifted Gronwall factor would show up as a ~2.37e-4 relative offset on every rung.
const GRONWALL_XMODULE_MAX_RELERR = Math.max(
  ...IMP35121_LADDER.map((row) => {
    const recomputed = parts(row.N).E_flow; // uses GRONWALL = exp(2.37e-4)
    return Math.abs(recomputed / row.E_flow - 1);
  })
);

export const IMP35100_SURROGATE_TOTAL_E_FARTAIL_FLOOR = {
  id: 'imp-35100',
  proofSection: 'S-frontier',
  question:
    'Assess the surrogate E(N) = E_coll + E_trunc + E_flow far-tail behavior against the Step-4 ' +
    'requirement E(N) -> 0: measure whether the surrogate TOTAL E(N) (not just the share ' +
    'sigma = E_coll/E) tends to 0 or floors at the constant E_trunc as the GUE-conditional ' +
    'E_coll vanishes, across N in [1e6, 1e13]. Measurement only on the inherited ' +
    'imp-3220/imp-3406 surrogate; C_mb GUE-conditional per imp-486; changes no bound; NO QED.',
  componentModel:
    'E(N) = E_coll + E_trunc + E_flow; E_coll = C_C sqrt(log T0 / N) (GUE-conditional); ' +
    'E_flow = C_F (log T0 / T0) Gronwall (imp-398); E_trunc = 3.06e-5 (N-independent, imp-2631)',
  stepFourVerdict:
    'On THIS surrogate E(N) -> E_trunc = 3.06e-5 > 0, NOT E(N) -> 0. The N-dependent terms ' +
    '(E_coll, E_flow) both vanish but the constant truncation term is a hard floor, so the ' +
    'surrogate as written cannot supply a Step-4 E(N) -> 0 rate; only E(N) - E_trunc -> 0.',
  ladder: LADDER.map((r) => ({
    log10N: r.log10N,
    E: +r.E.toExponential(6),
    E_over_trunc: +r.E_over_trunc.toFixed(6),
    E_minus_trunc: +r.E_minus_trunc.toExponential(4),
    E_flow_over_coll: +r.E_flow_over_coll.toExponential(4),
  })),
  landmarks: {
    E_at_1e6: +FIRST.E.toExponential(6), // ~1.474357e-3
    E_at_1e13: +LAST.E.toExponential(6), // ~3.124818e-5
    E_over_trunc_at_1e6: +FIRST.E_over_trunc.toFixed(4), // ~48.1816
    E_over_trunc_at_1e13: +E_OVER_TRUNC_1E13.toFixed(6), // ~1.021182
    E_minus_trunc_at_1e13: +E_MINUS_TRUNC_1E13.toExponential(4), // ~6.4818e-7
    E_flow_over_coll_at_1e13: +EFLOW_FRACTION_1E13.toExponential(4), // ~7.9e-5
    E_trunc_floor: E_TRUNC_PT, // 3.06e-5 (the limit)
  },
  finding: {
    M1_monotone_above_floor:
      'E(N) is monotone decreasing across [1e6, 1e13] but STRICTLY above the constant E_trunc at ' +
      'every rung (E = E_trunc + E_coll + E_flow with E_coll, E_flow > 0). It is bounded below by ' +
      'the fixed truncation floor.',
    M2_floors_at_trunc_not_zero:
      'E(N) -> E_trunc = 3.06e-5, NOT 0. E(1e13)/E_trunc ~ 1.021 and E(1e13) - E_trunc ~ 6.5e-7 ' +
      '(still shrinking), so the total asymptotes to the strictly positive constant, contradicting ' +
      'a Step-4 E(N) -> 0 reading of THIS surrogate.',
    M3_residual_is_ecoll_dominated:
      'The residual above the floor is E(N) - E_trunc = E_coll + E_flow with E_flow/E_coll -> 0 ' +
      '(E_flow ~ 1/T0, E_coll ~ N^-1/2); by 1e13 E_flow is ~8e-5 of E_coll, so E(N) - E_trunc is ' +
      'essentially E_coll and inherits its ~N^-1/2 sqrt-log rate (imp-34130).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). On the inherited imp-33601/imp-3406 ' +
    'component surrogate the TOTAL E(N) = E_coll + E_trunc + E_flow does NOT tend to 0 across ' +
    'N in [1e6, 1e13]: it is monotone decreasing but floors at the N-independent constant ' +
    'E_trunc = 3.06e-5 (E/E_trunc falls 48.2 -> 1.02, within ~2.1% of the floor by 1e13). The ' +
    'vanishing part E(N) - E_trunc = E_coll + E_flow -> 0 (E_coll-dominated, ~N^-1/2 sqrt-log per ' +
    'imp-34130), but the constant truncation term is a hard floor, so this surrogate as written ' +
    'cannot supply a Step-4 E(N) -> 0 rate -- the same E_trunc that lets the share sigma decay ' +
    'is exactly what pins the total. Closing Step 4 would require driving E_trunc itself to 0 ' +
    '(an N-dependent strip, NOT the imp-2631 fixed strip), a bound change this measurement does ' +
    'not make. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; C_C 1/8 ansatz ' +
    '(imp-2642) UNTOUCHED; E_trunc fixed strip (imp-2631) UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35071 (same component model, interior peak closed form); imp-33601 (E_flow offset ' +
    'identity); imp-3406 (component model source); imp-34130 (E_coll ~N^-1/2 sqrt-log tail rate); ' +
    'imp-2631 (E_trunc fixed strip); imp-398 (E_flow C_F prefactor); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35100_SURROGATE_TOTAL_E_FARTAIL_FLOOR_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-35071/imp-3406 1e6 total-error landmark, proving the identical
    // inherited component model is in use.
    id: 'imp35100-reproduces-inherited-model-at-1e6',
    description: 'E(1e6) ~ 1.4744e-3 on the shared imp-33601/imp-3406 component model',
    holds: () => Math.abs(FIRST.E / 1.474357e-3 - 1) < 1e-3,
  },
  {
    // (M1): E(N) monotone decreasing but strictly above the constant E_trunc floor at every rung.
    id: 'imp35100-monotone-decreasing-above-floor',
    description: 'E(N) monotone decreasing across [1e6,1e13] and strictly > E_trunc everywhere',
    holds: () => monotoneDecreasing && strictlyAboveFloor,
  },
  {
    // (M2): the total floors at E_trunc, NOT 0 -- the Step-4 tension.
    id: 'imp35100-floors-at-trunc-not-zero',
    description: 'E(1e13)/E_trunc within ~2% of 1 (floors at the constant, does not vanish)',
    holds: () => FLOORS_AT_TRUNC && TOTAL_NOT_TO_ZERO,
  },
  {
    // (M2b): the vanishing part E(N)-E_trunc = E_coll+E_flow does shrink toward 0.
    id: 'imp35100-residual-above-floor-shrinks',
    description: 'E(N) - E_trunc shrinks by >100x from 1e6 to 1e13 (E_coll+E_flow -> 0)',
    holds: () => FIRST.E_minus_trunc / LAST.E_minus_trunc > 100 && E_MINUS_TRUNC_1E13 > 0,
  },
  {
    // (M3): the residual above the floor is E_coll-dominated; E_flow/E_coll -> 0.
    id: 'imp35100-residual-is-ecoll-dominated',
    description: 'E_flow/E_coll -> 0 (deep tail residual is essentially E_coll)',
    holds: () => EFLOW_FRACTION_1E13 < 1e-3 && EFLOW_FRACTION_SHRINKS,
  },
  {
    // (imp-35159) Cross-module Gronwall consistency: recomputed E_flow (this module GRONWALL =
    // exp(2.37e-4)) reproduces every imp-35121 baked E_flow rung to storage precision, confirming
    // imp-35100/imp-35105/imp-35121 all apply the identical Gronwall multiplier (no drift).
    id: 'imp35100-gronwall-factor-consistent-across-modules',
    description: 'recomputed E_flow matches imp-35121 baked E_flow to <1e-5 at every rung (shared exp(2.37e-4))',
    holds: () => GRONWALL_XMODULE_MAX_RELERR < 1e-5,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp35100-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35100_SURROGATE_TOTAL_E_FARTAIL_FLOOR.isRigorous === false &&
      /NO QED/.test(IMP35100_SURROGATE_TOTAL_E_FARTAIL_FLOOR.verdict) &&
      /refereed bound is changed/i.test(IMP35100_SURROGATE_TOTAL_E_FARTAIL_FLOOR.verdict),
  },
];

for (const a of IMP35100_SURROGATE_TOTAL_E_FARTAIL_FLOOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35100-surrogate-total-E-fartail-floor assertion failed: ${a.id}`);
  }
}
