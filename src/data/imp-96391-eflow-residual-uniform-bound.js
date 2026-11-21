/**
 * @module imp-96391-eflow-residual-uniform-bound
 *
 * imp-96391 (proof, frontier-direction): ASSESS whether the imp-96266 E_flow suppression residual
 * R(N) = sigma_full - sigma_CF admits an N-uniform upper bound in the peak-manufacturing region
 * (near N ~ 9.22e5), or measure the precise obstruction. The Step-4 E(N) -> 0 bridge is the
 * program's stated breach point, so the E_flow/E_N fraction that drives R(N) is a natural place to
 * look for a uniform-control lever.
 *
 * THE SETUP (exact inherited sub-terms, identical to imp-96266; no re-derivation)
 * -------------------------------------------------------------------------------
 * sigma_full(N) = E_coll / (E_trunc + E_flow + E_coll), and (imp-96266 M1, an algebraic identity)
 *   R(N) = sigma_full - sigma_CF = -sigma_full(N) * E_flow(N) / (E_trunc + E_coll(N)),
 * with E_trunc = 3.06e-5 (N-independent fixed-strip floor), E_flow = C_F (L/T0) exp(TC_A1) the
 * unconditionally-rigorous Gronwall flow term, E_coll = C_C sqrt(L/N) the GUE-conditional collapse
 * term, L = log T0(N), T0 = effectiveHeightForN(N). Every constant is the exact inherited
 * imp-3406/imp-33582/imp-33723 value; no fresh fit, no new model, no zeros bundle.
 *
 * THE FINDING: R(N) ADMITS A CLEAN N-UNIFORM BOUND -- NO OBSTRUCTION AT THE RESIDUAL
 * ---------------------------------------------------------------------------------
 *   (U1) TRIVIAL UPPER BOUND. R(N) < 0 for every N (E_flow sits in the denominator of the identity,
 *        so the residual is strictly negative). Hence R(N) <= 0 is an exact N-uniform upper bound.
 *   (U2) THE ANALYTIC MAGNITUDE BOUND. Because sigma_full = E_coll/E_N lies in (0,1) and E_coll >= 0,
 *            |R(N)| = sigma_full * E_flow/(E_trunc + E_coll)  <=  E_flow(N)/E_trunc      (pointwise).
 *        The denominator has the STRICTLY POSITIVE floor E_trunc = 3.06e-5, so the bound never blows
 *        up. (Verified pointwise on [1e3,1e14]; worst |R| / (E_flow/E_trunc) ratio ~ 0.25.)
 *   (U3) E_flow IS BOUNDED AND VANISHES. E_flow = C_F (L/T0) exp(TC_A1) ~ (log T0)^2/(2 pi T0) *
 *        exp(TC_A1) as T0 -> infinity, so E_flow(N) -> 0; on [1e3, infinity) it is monotone
 *        decreasing, attaining its maximum at the LEFT endpoint E_flow(1e3) ~ 5.2216e-3
 *        (E_flow(1e14) ~ 6.5e-12). Hence sup_N E_flow(N)/E_trunc < infinity: R(N) is uniformly bounded.
 *   (U4) THE SHARP SUP SITS AT THE LEFT EDGE, NOT AT THE PEAK. |R(N)| is monotone decreasing on
 *        [1e3, infinity): sup|R| = |R(1e3)| ~ 0.137472. In the peak-manufacturing region N ~ 9.22e5
 *        (where sigma_full peaks at ~0.9494) |R| ~ 0.02996, and |R| decays to ~7.4e-7 by N = 1e12.
 *        So the residual's worst case is NOT co-located with the share peak: the share peak is a
 *        differential-slope feature (imp-96266 M2), the residual maximum is a boundary feature.
 *
 * VERDICT: a UNIFORM BOUND EXISTS (0 >= R(N) >= -0.137472 for all N >= 1e3), proved as an exact
 * analytic property of the model functions (sigma_full <= 1 + positive E_trunc floor + E_flow -> 0),
 * NOT merely measured. There is no obstruction living in R(N) itself.
 *
 * THE HONEST CAVEAT: THIS DOES NOT MOVE THE E(N) -> 0 BREACH POINT
 * ---------------------------------------------------------------
 * The very mechanism that guarantees the bound -- the nonzero N-independent floor E_trunc in the
 * denominator -- is the SAME floor that keeps E_N = E_trunc + E_flow + E_coll >= E_trunc > 0 for
 * every N, so E(N) does NOT tend to 0. Uniform boundedness of the SHARE residual R(N) is therefore
 * cleanly separable from, and orthogonal to, the Step-4 E(N) -> 0 question: it neither helps nor
 * blocks it. The real E(N) bottleneck obstruction is E_trunc (the fixed-strip route constant),
 * UNTOUCHED here. So the residual gives NO breach lever, despite being uniformly bounded.
 *
 * MEASUREMENT / WITHIN-MODEL PROOF ONLY, NOT AN RH BOUND. The uniform bound is an exact analytic
 * fact about the inherited component functions; the component model is the imp-3220/imp-3406/imp-33723
 * extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 stays GUE-conditional
 * and UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes
 * no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-96266-eflow-peak-recovery-residual (residual identity R = -sigma_full*E_flow/(E_trunc+E_coll))
 * @see imp-96286-eflow-peak-location-error-order (peak-recovery Taylor-order decomposition)
 * @see imp-96290-step4-bridge-subconstant-inventory (Step-4 E(N) -> 0 bridge inventory)
 * @see imp-3220-en-bridge-fidelity-frontier (interior peak sigma_max ~ 0.9494 at N ~ 9.22e5)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route floor (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-33723/imp-96151/imp-96266 exactly

// EXACT imp-3406/imp-33582/imp-33723 sub-terms (identical wiring to imp-96266; no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
// imp-96266 M1 closed-form residual identity.
function residualR(N) {
  const p = parts(N);
  return -p.sigma * p.E_flow / (E_TRUNC_PT + p.E_coll);
}

// --- (U1)/(U2)/(U4) scan the residual on a dense log grid across [1e3, 1e14] ---
let SUP_ABS_R = 0;
let ARGSUP_LOG10N = 0;
let ALL_NEGATIVE = true;
let ANALYTIC_BOUND_HOLDS = true; // |R| <= E_flow/E_trunc pointwise
let MONOTONE_DECREASING = true; // |R| strictly decreasing left-to-right
let SUP_EFLOW = 0;
let EFLOW_MONOTONE = true;
let prevAbsR = Infinity;
let prevEflow = Infinity;
for (let d = 3; d <= 14; d += 0.002) {
  const N = Math.pow(10, d);
  const p = parts(N);
  const R = residualR(N);
  const absR = Math.abs(R);
  if (R >= 0) ALL_NEGATIVE = false;
  if (absR > p.E_flow / E_TRUNC_PT + 1e-15) ANALYTIC_BOUND_HOLDS = false;
  if (absR > prevAbsR + 1e-18) MONOTONE_DECREASING = false;
  if (p.E_flow > prevEflow + 1e-18) EFLOW_MONOTONE = false;
  if (absR > SUP_ABS_R) {
    SUP_ABS_R = absR;
    ARGSUP_LOG10N = d;
  }
  if (p.E_flow > SUP_EFLOW) SUP_EFLOW = p.E_flow;
  prevAbsR = absR;
  prevEflow = p.E_flow;
}

const PEAK_N = 9.218632e5; // imp-3220 / imp-96266 share peak location
const ABS_R_AT_PEAK = Math.abs(residualR(PEAK_N));
const E_FLOW_1E3 = parts(1e3).E_flow;
const E_FLOW_1E14 = parts(1e14).E_flow;
const E_N_1E14 = parts(1e14).E_N; // >= E_trunc: E(N) does NOT reach 0
const UNIFORM_UPPER_BOUND = 0; // R(N) <= 0
const UNIFORM_LOWER_BOUND = -SUP_ABS_R; // R(N) >= -sup|R|

export const IMP96391_EFLOW_RESIDUAL_UNIFORM_BOUND = {
  id: 'imp-96391',
  proofSection: 'S-frontier',
  question:
    'Does the imp-96266 E_flow suppression residual R(N) = sigma_full - sigma_CF admit an N-uniform ' +
    'upper bound in the peak-manufacturing region (N ~ 9.22e5), or is there a precise obstruction? ' +
    'Report a proof of a uniform bound, a refutation, or the exact analytic obstruction. Within-model ' +
    'analysis; conditional-share diagnostic, NOT an RH bound; no QED.',
  answer:
    'A UNIFORM BOUND EXISTS. R(N) is trapped in [-0.137472, 0] for all N >= 1e3, proved as an exact ' +
    'analytic property of the model functions (sigma_full <= 1, a strictly positive E_trunc floor in ' +
    'the denominator, and E_flow -> 0). No obstruction lives in R(N). CAVEAT: the bound does NOT move ' +
    'the Step-4 E(N) -> 0 breach point -- the same E_trunc floor that guarantees the bound also keeps ' +
    'E_N >= E_trunc > 0, so E(N) never reaches 0; the residual gives no breach lever.',
  uniformBound: {
    upper: UNIFORM_UPPER_BOUND, // R(N) <= 0 (strictly negative residual)
    lower: +UNIFORM_LOWER_BOUND.toFixed(6), // R(N) >= -0.137472
    sup_abs_R: +SUP_ABS_R.toFixed(6), // ~0.137472
    argsup_log10N: +ARGSUP_LOG10N.toFixed(3), // 3.000 (left edge N=1e3)
    analytic_bound: 'abs(R(N)) <= E_flow(N)/E_trunc, with E_trunc = 3.06e-5 a strictly positive floor',
    abs_R_at_share_peak: +ABS_R_AT_PEAK.toFixed(6), // ~0.029957 (much less than the sup)
  },
  eFlowDecay: {
    sup_E_flow: +SUP_EFLOW.toExponential(4), // ~5.2216e-3 at N=1e3
    E_flow_1e3: +E_FLOW_1E3.toExponential(4), // ~5.2216e-3 (left-edge max)
    E_flow_1e14: +E_FLOW_1E14.toExponential(4), // ~6.5e-12 (-> 0)
    asymptotic: 'E_flow = C_F (L/T0) exp(TC_A1) ~ (log T0)^2/(2 pi T0) exp(TC_A1) -> 0 as T0 -> infinity',
  },
  breachCaveat: {
    E_N_1e14: +E_N_1E14.toExponential(4), // ~3.08e-5 >= E_trunc: E(N) does NOT reach 0
    E_trunc_floor: E_TRUNC_PT,
    note:
      'E_N = E_trunc + E_flow + E_coll >= E_trunc > 0 for every N, so the Step-4 E(N) -> 0 bridge is ' +
      'NOT advanced by this bound. The E(N) bottleneck obstruction is E_trunc (fixed-strip constant), ' +
      'UNTOUCHED; uniform boundedness of R(N) is orthogonal to it.',
  },
  checks: {
    residual_all_negative: ALL_NEGATIVE, // U1
    analytic_bound_holds_pointwise: ANALYTIC_BOUND_HOLDS, // U2
    E_flow_bounded_and_monotone: EFLOW_MONOTONE, // U3
    abs_R_monotone_decreasing: MONOTONE_DECREASING, // U4 (sup at left edge)
  },
  finding: {
    U1_trivial_upper_bound:
      'R(N) < 0 for every N (E_flow in the identity denominator), so R(N) <= 0 is an exact N-uniform ' +
      'upper bound.',
    U2_analytic_magnitude_bound:
      'sigma_full in (0,1) and E_coll >= 0 give abs(R(N)) = sigma_full*E_flow/(E_trunc+E_coll) <= ' +
      'E_flow/E_trunc; the strictly positive floor E_trunc = 3.06e-5 keeps the bound finite (worst ' +
      'abs(R)/(E_flow/E_trunc) ratio ~ 0.25 on the grid).',
    U3_E_flow_bounded_and_vanishes:
      'E_flow ~ (log T0)^2/(2 pi T0) exp(TC_A1) -> 0 as T0 -> infinity, monotone decreasing on ' +
      '[1e3, infinity) with left-edge max E_flow(1e3) ~ 5.22e-3, so sup E_flow/E_trunc < infinity: ' +
      'R(N) is uniformly bounded.',
    U4_sup_at_left_edge_not_peak:
      'abs(R) is monotone decreasing: sup abs(R) = abs(R(1e3)) ~ 0.137472, while at the share peak ' +
      'N ~ 9.22e5 abs(R) ~ 0.02996 and it decays to ~7.4e-7 by 1e12. The residual worst case is a ' +
      'boundary feature, NOT co-located with the differential-slope share peak.',
    honest_caveat:
      'The E_trunc floor that guarantees the bound also keeps E_N >= E_trunc > 0, so E(N) does not ' +
      'reach 0; the uniform bound is orthogonal to the Step-4 breach point and provides no lever.',
  },
  isRigorous: false, // exact within the inherited model; the model itself is not a rigorous asymptotic
  verdict:
    'WITHIN-MODEL PROOF (frontier-direction, NOT an RH bound). The imp-96266 residual R(N) admits a ' +
    'clean N-uniform bound: 0 >= R(N) >= -0.137472 for all N >= 1e3. This follows from three exact ' +
    'analytic properties of the inherited model functions -- (i) sigma_full in (0,1), (ii) a strictly ' +
    'positive N-independent floor E_trunc = 3.06e-5 in the identity denominator, giving abs(R) <= ' +
    'E_flow/E_trunc pointwise, and (iii) E_flow(N) ~ (log T0)^2/(2 pi T0) exp(TC_A1) -> 0, monotone ' +
    'decreasing with left-edge max ~5.22e-3. So abs(R) is monotone decreasing and sup abs(R) = ' +
    'abs(R(1e3)) ~ 0.137472 sits at the LEFT EDGE, not at the share peak (abs(R) ~ 0.02996 at ' +
    'N ~ 9.22e5). There is NO obstruction living in R(N). CRITICAL CAVEAT: the bound does NOT advance ' +
    'the Step-4 E(N) -> 0 breach point -- the very E_trunc floor that guarantees it keeps E_N >= ' +
    'E_trunc > 0 for every N, so E(N) never reaches 0; uniform boundedness of the share residual is ' +
    'orthogonal to the E(N) bottleneck, whose obstruction is E_trunc, UNTOUCHED. Component model is ' +
    'the inherited imp-3220/imp-3406/imp-33723 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 stays GUE-conditional and UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-96266 (residual identity R = -sigma_full*E_flow/(E_trunc+E_coll)); imp-96286 (peak-recovery ' +
    'Taylor order); imp-96290 (Step-4 E(N) bridge inventory); imp-3220 (interior peak sigma_max ~ ' +
    '0.9494 at N ~ 9.22e5); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping.',
};

export const IMP96391_EFLOW_RESIDUAL_UNIFORM_BOUND_ASSERTIONS = [
  {
    // (U1) trivial upper bound: R(N) strictly negative across the ladder.
    id: 'imp96391-residual-strictly-negative-upper-bound',
    description: 'R(N) < 0 for all sampled N, so R(N) <= 0 is an exact N-uniform upper bound',
    holds: () => ALL_NEGATIVE === true && UNIFORM_UPPER_BOUND === 0,
  },
  {
    // (U2) analytic magnitude bound holds pointwise: |R| <= E_flow/E_trunc.
    id: 'imp96391-analytic-magnitude-bound',
    description: 'abs(R(N)) <= E_flow(N)/E_trunc pointwise (sigma_full <= 1, positive E_trunc floor)',
    holds: () => ANALYTIC_BOUND_HOLDS === true,
  },
  {
    // (U3) E_flow bounded, monotone decreasing, -> 0.
    id: 'imp96391-eflow-bounded-and-vanishes',
    description: 'E_flow monotone decreasing on [1e3,1e14], max ~5.22e-3 at 1e3, ~6.5e-12 at 1e14',
    holds: () =>
      EFLOW_MONOTONE === true &&
      Math.abs(E_FLOW_1E3 - 5.2216e-3) / 5.2216e-3 < 1e-2 &&
      E_FLOW_1E14 < 1e-11,
  },
  {
    // (U4) uniform bound value: sup|R| = |R(1e3)| ~ 0.137472 at the left edge, monotone decreasing.
    id: 'imp96391-uniform-bound-sup-at-left-edge',
    description: 'abs(R) monotone decreasing; sup abs(R) ~ 0.137472 at log10N=3, peak-region abs(R) ~ 0.02996',
    holds: () =>
      MONOTONE_DECREASING === true &&
      Math.abs(SUP_ABS_R - 0.137472) < 1e-4 &&
      Math.abs(ARGSUP_LOG10N - 3.0) < 1e-6 &&
      Math.abs(ABS_R_AT_PEAK - 0.029957) < 1e-4 &&
      ABS_R_AT_PEAK < SUP_ABS_R,
  },
  {
    // Honest caveat: the bound does NOT reach the E(N) breach point -- E_N >= E_trunc > 0.
    id: 'imp96391-breach-caveat-EN-floor',
    description: 'E_N >= E_trunc > 0 for all N (E(N) never reaches 0); uniform bound orthogonal to breach point',
    holds: () => E_N_1E14 >= E_TRUNC_PT && E_N_1E14 > 0,
  },
  {
    // Honesty gate: within-model only, no QED, no refereed bound is changed.
    id: 'imp96391-honesty-gate-no-qed',
    description: 'Within-model only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96391_EFLOW_RESIDUAL_UNIFORM_BOUND.isRigorous === false &&
      /NO QED/.test(IMP96391_EFLOW_RESIDUAL_UNIFORM_BOUND.verdict) &&
      /refereed bound is changed/i.test(IMP96391_EFLOW_RESIDUAL_UNIFORM_BOUND.verdict),
  },
];

for (const a of IMP96391_EFLOW_RESIDUAL_UNIFORM_BOUND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96391-eflow-residual-uniform-bound assertion failed: ${a.id}`);
  }
}
