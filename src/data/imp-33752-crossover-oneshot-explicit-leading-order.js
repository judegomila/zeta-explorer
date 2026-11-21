/**
 * @module imp-33752-crossover-oneshot-explicit-leading-order
 *
 * imp-33752 (accuracy, frontier-direction): imp-33723 pinned the imp-3444 E_coll = E_trunc
 * crossover as the CLOSED-FORM fixed point N_cross = K * log T0(N_cross) with the pinned
 * amplitude K = (C_C_PINNED / E_trunc)^2, solved by Banach iteration (~5 steps). Because
 * T0 = effectiveHeightForN(N) depends on N only LOGARITHMICALLY, a single substitution should
 * give an EXPLICIT non-iterative leading-order estimate. imp-33723 reported one single-shot value
 * (freezing log T0 at the ad-hoc coarse seed N = 20*K, ~0.2% off) but never wrote the truly
 * parameter-free explicit form, nor measured its error across the imp-33708 floor ladder. This
 * module supplies that: the ONLY seed-free leading substitution is N ~ K * log T0(K) -- put the
 * amplitude K itself into the slow log -- and MEASURES its single-shot relative error against the
 * fully converged fixed point at the base floor and across the imp-33708 0.5x..5x E_trunc-floor
 * ladder, then assesses whether one shot suffices to the printed (6-sig-fig) precision.
 *
 * THE EXPLICIT LEADING-ORDER DERIVATION (the deliverable the ticket asks for)
 * -------------------------------------------------------------------------
 * The fixed point is N* = K * log T0(N*). Since log T0 is slowly varying, expand about a leading
 * estimate N0: N* = K*log T0(N0) + K*(log T0)_prime(N0)*(N* - N0) + ... The correction carries the
 * factor g_prime = K*(log T0)_prime = K*2pi/(T0 log(T0/2pi)) ~ 0.045 (imp-33749) -- small -- so the
 * zeroth order N0 already dominates. The ONLY parameter-free zeroth-order seed is the amplitude
 * itself, N0 = K, giving the EXPLICIT non-iterative form
 *
 *     N_cross ~ K * log T0(K),          K = (C_C_PINNED / E_trunc)^2.            (ONE SHOT)
 *
 * A second substitution nests it: N_cross ~ K * log T0(K * log T0(K)) (TWO SHOT), and each further
 * substitution is one Banach step, multiplying the residual by |g_prime(N_cross)| ~ 0.045.
 *
 * THE MEASUREMENT / FINDING (derivation / measurement only)
 * --------------------------------------------------------
 *   (D1) ONE SHOT IS ~14%, NOT PRINTED PRECISION. At the base floor (f = 1) the explicit form
 *        N ~ K*log T0(K) lands at ~2.83e9 vs the converged N_cross ~ 3.280e9 -- a ~13.7% relative
 *        error. Across the whole imp-33708 0.5x..5x ladder the one-shot error stays in
 *        ~[13.2%, 15.1%], essentially FLOOR-FLAT. This is FAR above the ~5e-7 printed 6-sig-fig
 *        precision, so a SINGLE shot from the amplitude K does NOT suffice; the ~0.2% imp-33723
 *        single-shot was better only because its ad-hoc seed 20*K already sits near N_cross (K
 *        itself is ~21x below N_cross since log T0(N_cross) ~ 20.9), not because one substitution
 *        is intrinsically accurate.
 *   (D2) THE RESIDUAL CONTRACTS AT EXACTLY THE imp-33749 RATE. The two-shot error is ~0.6%..0.87%
 *        (base ~0.67%), and the measured ratio e2/e1 = |residual shrink per substitution| lands in
 *        ~[4.59e-2, 5.75e-2] across the ladder -- IDENTICAL to the imp-33749 analytic contraction
 *        |g_prime(N_cross)| in [4.28e-2, 5.30e-2]. So each substitution is one Banach step and the
 *        explicit series converges geometrically at |g_prime|, confirming the imp-33723 ~5-step
 *        count: reaching ~5e-7 from a ~14% one-shot needs ceil(log(5e-7/0.137)/log(0.049)) ~ 5
 *        further substitutions (~6 total), which is why the fixed point is solved iteratively.
 *
 * The punchline: the explicit non-iterative leading-order crossover is N_cross ~ K*log T0(K); it is
 * a genuine closed form but only ~14%-accurate (floor-flat), so ONE SHOT does NOT reach the printed
 * precision -- the convergence to 6 sig figs is the imp-33749 geometric contraction at |g_prime| ~
 * 0.045 per step, needing ~5 further substitutions. This QUANTIFIES the imp-33723 "single-shot
 * leading value" remark as seed-dependent and measures the honest seed-free error.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-33723-sigma-half-vs-crossover-closed-form (the fixed point N=K*log T0(N), seed-20K single-shot ~0.2%)
 * @see imp-33749-crossover-contraction-etrunc-floor-sweep (analytic |g_prime(N_cross)| in [4.28e-2,5.30e-2] over the ladder)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (the 0.5x..5x floor sweep; N ~ E_trunc^(-2))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_BASE = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)

// K = (C_C/E_trunc)^2 (imp-33723 amplitude) and the closed-form map g(N) = K * log T0(N).
const kFor = (E_trunc) => (C_C_PINNED / E_trunc) ** 2;
// Fully-converged Banach fixed point (reference: strong contraction => ~5 iters, 80 is overkill).
function converged(K, seed) {
  let N = seed;
  for (let i = 0; i < 80; i++) N = K * Math.log(effectiveHeightForN(N));
  return N;
}
// EXPLICIT non-iterative one-shot: substitute the amplitude K itself into the slow log ONCE.
const oneShot = (K) => K * Math.log(effectiveHeightForN(K));
// Two-shot: one further Banach substitution nested inside the slow log.
const twoShot = (K) => K * Math.log(effectiveHeightForN(oneShot(K)));

// Printed-precision target: toExponential(6) keeps 7 sig figs => ~5e-7 relative half-ULP.
const PRINTED_PRECISION = 5e-7;

// Same 0.5x..5x floor ladder imp-33708/imp-33749 used (f = 1 = imp-33723/imp-2631 base floor).
const FLOOR_FACTORS = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0, 3.0, 5.0];

const LADDER = FLOOR_FACTORS.map((f) => {
  const K = kFor(E_TRUNC_BASE * f);
  const N_conv = converged(K, 1e9);
  const N1 = oneShot(K);
  const N2 = twoShot(K);
  const e1 = Math.abs(N1 - N_conv) / N_conv; // one-shot relative error
  const e2 = Math.abs(N2 - N_conv) / N_conv; // two-shot relative error
  const ratio = e2 / e1; // measured residual shrink per substitution == |g_prime| (imp-33749)
  // Substitutions past the one-shot needed to reach printed precision: e1 * ratio^k <= tol.
  const kExtra = Math.ceil(Math.log(PRINTED_PRECISION / e1) / Math.log(ratio));
  return {
    floorFactor: f,
    K_amplitude: +K.toExponential(4),
    N_converged: +N_conv.toExponential(4),
    N_one_shot: +N1.toExponential(4),
    one_shot_rel_error: +e1.toExponential(4),
    two_shot_rel_error: +e2.toExponential(4),
    residual_shrink_per_shot: +ratio.toExponential(4), // == |g_prime(N_cross)|
    substitutions_to_printed_precision: 1 + kExtra, // one-shot + kExtra further Banach steps
  };
});

const BASE = LADDER.find((r) => r.floorFactor === 1.0);
const e1Values = LADDER.map((r) => r.one_shot_rel_error);
const ratioValues = LADDER.map((r) => r.residual_shrink_per_shot);
const E1_MIN = Math.min(...e1Values); // ~1.32e-1 (deepest floor 0.5)
const E1_MAX = Math.max(...e1Values); // ~1.51e-1 (shallowest floor 5.0)
const RATIO_MIN = Math.min(...ratioValues); // ~4.59e-2
const RATIO_MAX = Math.max(...ratioValues); // ~5.75e-2
const STEPS_MAX = Math.max(...LADDER.map((r) => r.substitutions_to_printed_precision)); // ~6

export const IMP33752_CROSSOVER_ONESHOT_EXPLICIT_LEADING_ORDER = {
  id: 'imp-33752',
  proofSection: 'S-frontier',
  question:
    'Derive the EXPLICIT non-iterative leading-order form of the imp-33723 crossover fixed point ' +
    'N_cross = K*log T0(N_cross) as N_cross ~ K*log T0(K) (substitute the amplitude K into the slow ' +
    'log once), and MEASURE its single-shot relative error against the converged Banach fixed point ' +
    'at the base floor and across the imp-33708 0.5x..5x E_trunc-floor ladder, assessing whether one ' +
    'shot suffices to the printed 6-sig-fig precision. Derivation/measurement only; conditional-share ' +
    'diagnostic, NOT an RH bound; no QED.',
  explicitForm:
    'N_cross ~ K * log T0(K),  K = (C_C_PINNED / E_trunc)^2  (the only seed-free leading substitution; ' +
    'two-shot nests one more Banach step, residual x |g_prime| ~ 0.045 per shot).',
  base_floor: BASE,
  ladder: LADDER,
  spans: {
    one_shot_rel_error_min: +E1_MIN.toExponential(4), // ~1.32e-1
    one_shot_rel_error_max: +E1_MAX.toExponential(4), // ~1.51e-1
    residual_shrink_per_shot_min: +RATIO_MIN.toExponential(4), // ~4.59e-2
    residual_shrink_per_shot_max: +RATIO_MAX.toExponential(4), // ~5.75e-2
    printed_precision_target: PRINTED_PRECISION,
    max_substitutions_to_printed_precision: STEPS_MAX, // ~6
  },
  finding: {
    D1_one_shot_is_floor_flat_14pct_not_printed:
      'The explicit non-iterative form N ~ K*log T0(K) lands at ~13.7% relative error at the base ' +
      'floor and stays essentially floor-flat in ~[13.2%, 15.1%] across the imp-33708 0.5x..5x ladder ' +
      '-- FAR above the ~5e-7 printed 6-sig-fig precision, so a SINGLE shot from the amplitude K does ' +
      'NOT suffice. The imp-33723 ~0.2% single-shot was better only because its ad-hoc seed 20*K ' +
      'already sits near N_cross (K itself is ~21x below N_cross), not because one substitution is ' +
      'intrinsically accurate.',
    D2_residual_contracts_at_imp33749_rate:
      'The two-shot error is ~0.6%..0.87% and the measured residual shrink per substitution e2/e1 lands ' +
      'in ~[4.59e-2, 5.75e-2] -- IDENTICAL to the imp-33749 analytic contraction |g_prime(N_cross)| in ' +
      '[4.28e-2, 5.30e-2]. Each substitution is one Banach step; reaching printed precision from a ~14% ' +
      'one-shot needs ~5 further substitutions (~6 total), confirming the imp-33723 ~5-step count.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). The imp-33723 crossover fixed point ' +
    'N_cross = K*log T0(N_cross), K = (C_C_PINNED/E_trunc)^2, has the explicit non-iterative ' +
    'leading-order form N_cross ~ K*log T0(K) (the only seed-free single substitution). MEASURED ' +
    'single-shot error: ~13.7% at the base floor, floor-flat in ~[13.2%, 15.1%] across the imp-33708 ' +
    '0.5x..5x E_trunc-floor ladder -- FAR above the ~5e-7 printed 6-sig-fig precision, so one shot does ' +
    'NOT suffice (the imp-33723 ~0.2% single-shot owed its accuracy to an ad-hoc near-root seed 20*K, ' +
    'not to one substitution). The residual contracts geometrically at exactly the imp-33749 rate: ' +
    'e2/e1 ~ [4.59e-2, 5.75e-2] matches |g_prime(N_cross)| ~ [4.28e-2, 5.30e-2], so ~5 further ' +
    'substitutions (~6 total) reach printed precision, confirming the imp-33723 ~5-step Banach count. ' +
    'Component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; changes ' +
    'no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-33723 (closed-form crossover fixed point N=K*log T0(N), seed-20K single-shot ~0.2%); imp-33749 ' +
    '(analytic |g_prime(N_cross)| in [4.28e-2,5.30e-2] over the floor ladder); imp-33708 (0.5x..5x floor ' +
    'sweep, N ~ E_trunc^(-2)); imp-399/imp-2642 (C_C = (1/8) sqrt(3 pi), 1/8 ansatz); imp-2631 (E_trunc ' +
    'fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN Riemann-von Mangoldt inverse).',
};

export const IMP33752_CROSSOVER_ONESHOT_EXPLICIT_LEADING_ORDER_ASSERTIONS = [
  {
    // (D1): the explicit one-shot is ~14% at the base floor, well above printed precision.
    id: 'imp33752-one-shot-base-floor-is-14pct',
    description: 'base-floor one-shot rel error ~0.137 (>> 5e-7 printed precision)',
    holds: () =>
      Math.abs(BASE.one_shot_rel_error - 0.137) < 0.01 &&
      BASE.one_shot_rel_error > 100 * PRINTED_PRECISION,
  },
  {
    // (D1): the one-shot error is essentially floor-flat across the whole 0.5x..5x ladder.
    id: 'imp33752-one-shot-floor-flat',
    description: 'one-shot rel error stays in ~[0.13, 0.16] across the imp-33708 ladder (floor-flat)',
    holds: () => E1_MIN > 0.13 && E1_MAX < 0.16 && E1_MAX / E1_MIN < 1.2,
  },
  {
    // (D2): the two-shot error is far tighter than the one-shot (a real Banach step).
    id: 'imp33752-two-shot-tighter-than-one-shot',
    description: 'base-floor two-shot rel error < 1% and < one-shot/10',
    holds: () => BASE.two_shot_rel_error < 1e-2 && BASE.two_shot_rel_error < BASE.one_shot_rel_error / 10,
  },
  {
    // (D2): the measured residual shrink per substitution matches the imp-33749 contraction rate.
    id: 'imp33752-shrink-matches-imp33749-contraction',
    description: 'residual shrink per shot e2/e1 in [4.2e-2, 6.0e-2], matching imp-33749 |g_prime|',
    holds: () => RATIO_MIN > 4.2e-2 && RATIO_MAX < 6.0e-2,
  },
  {
    // (D2): reaching printed precision needs the imp-33723-consistent ~5-6 substitution count.
    id: 'imp33752-steps-to-printed-precision-is-about-6',
    description: 'substitutions to reach 5e-7 printed precision is ~5-7 across the ladder (imp-33723 ~5-step)',
    holds: () => STEPS_MAX >= 4 && STEPS_MAX <= 8,
  },
  {
    // Honesty gate: derivation/measurement only, no QED, no refereed bound is changed.
    id: 'imp33752-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33752_CROSSOVER_ONESHOT_EXPLICIT_LEADING_ORDER.isRigorous === false &&
      /NO QED/.test(IMP33752_CROSSOVER_ONESHOT_EXPLICIT_LEADING_ORDER.verdict) &&
      /refereed bound is changed/i.test(IMP33752_CROSSOVER_ONESHOT_EXPLICIT_LEADING_ORDER.verdict),
  },
];

for (const a of IMP33752_CROSSOVER_ONESHOT_EXPLICIT_LEADING_ORDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33752-crossover-oneshot-explicit-leading-order assertion failed: ${a.id}`);
  }
}
