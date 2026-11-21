/**
 * @module imp-35169-knobA-growth-law-crossover
 *
 * imp-35169 (numerical, frontier-direction, DERIVATION/MEASUREMENT ONLY): imp-35149 scoped that
 * ONLY Knob A (grow the verified height T_v(N) -> infinity at a FIXED abscissa sigma bounded off
 * 1/2) can vanish the imp-2631 truncation floor E_trunc = (2e/kappa) T_v^{-kappa}, but left the
 * actual growth LAW T_v(N) and its CROSSOVER against the vanishing collision term E_coll(N)
 * unquantified. THIS module derives the growth law and locates the crossover, at the fixed working
 * abscissa sigma = 3/4 (Ingham e = 0.6, kappa = 1 - e = 0.4, prefactor 2e/kappa = 3.0), on the
 * inherited imp-3220/imp-3406 component surrogate. It also confirms E_flow does NOT re-inflate.
 *
 * THE SURROGATE COMPONENTS (inherited verbatim, NOT re-derived)
 * ------------------------------------------------------------
 *   E_trunc(T_v) = (2e/kappa) T_v^{-kappa}        (imp-2631; sigma = 3/4 fixed -> = 3.0 T_v^{-0.4})
 *   E_coll(N)    = C_C sqrt(log T0 / N)           (imp-2642 C_C = (1/8)sqrt(3pi); GUE-cond imp-486)
 *   E_flow(N)    = C_F (log T0 / T0) Gronwall      (imp-398/imp-3406; C_F = (log(T0/2pi)+1)/2pi)
 * with T0 = effectiveHeightForN(N) the INSTANTIATION height (Riemann-von Mangoldt inverse). The
 * verified height T_v is the Knob-A lever and enters ONLY E_trunc; T0 (hence E_coll, E_flow) is a
 * SEPARATE height that never references T_v (imp-35149 R4 decoupling).
 *
 * THE BALANCE / EQUAL-ERROR SCHEDULE (closed form)
 * ------------------------------------------------
 * The verified height at which the vanishing truncation term exactly equals the vanishing collision
 * term, E_trunc(T_v) = E_coll(N), solves 3 T_v^{-kappa} = C_C sqrt(log T0 / N), i.e.
 *     T_v*(N) = (3 / C_C)^{1/kappa} (N / log T0)^{1/(2 kappa)}
 *             = (3 / C_C)^{2.5}     (N / log T0)^{1.25},   (3/C_C)^{2.5} ~ 170.88   [kappa = 0.4].
 * So the CRITICAL GROWTH EXPONENT in N is
 *     beta_crit = 1/(2 kappa) = 1.25.
 * To push E_trunc strictly BELOW the vanishing E_coll one needs a verified-height schedule growing
 * AT LEAST as fast as T_v*(N), i.e. an exponent beta >= 1.25 in N. This is STRICTLY SUPER-LINEAR:
 * faster than the instantiation height itself, T0 ~ 2pi N / log N (exponent 1 in N). Growing the
 * verified height merely in lockstep with T0 is NOT enough.
 *
 * THE NATURAL T_v = T0 IDENTIFICATION IS TOO SLOW (does NOT cross)
 * ---------------------------------------------------------------
 * If one hypothesizes the minimal schedule T_v(N) = T0(N) (verified height keeps pace with the
 * instantiation height, exponent 1), then E_trunc / E_coll GROWS without bound and never crosses:
 * the ratio rises from ~10.5 at N = 1e6 to ~2420 at N = 1e30 (monotone up). Even the right-EXPONENT
 * but wrong-CONSTANT law T_v(N) = T0(N)^{1.25} (~15x below T_v* because T0^{1.25} ~ (2pi)^{1.25}
 * (N/log N)^{1.25} while T_v* ~ 170.88 (N/log T0)^{1.25}) never crosses within N <= 1e40. The
 * crossover is a property of BOTH the exponent AND the leading constant.
 *
 * THE CROSSOVER N IS CONSTANT-SENSITIVE AT THE MARGINAL EXPONENT
 * -------------------------------------------------------------
 * For a posited law T_v(N) = A N^{1.25} (exponent exactly at beta_crit) the crossover N where
 * E_trunc first drops below E_coll depends strongly on the amplitude A:
 *     A = 1     -> crossover at N ~ 10^{27.55}     (A only marginally above the ~170.88 balance scale
 *                                                   after the (N/log T0) vs N mismatch, so very late)
 *     A = 10    -> crossover at N ~ 10^{4.25}
 *     A = 0.1   -> no crossover for N <= 10^{40}.
 * The ROBUST, amplitude-independent invariant is therefore the EXPONENT beta_crit = 1.25, not any
 * single crossover N; reporting a crossover N without pinning A would over-claim.
 *
 * E_flow IS NOT RE-INFLATED (the ticket sub-question)
 * ---------------------------------------------------
 * E_flow = C_F (log T0 / T0) Gronwall keys off the instantiation height T0 = effectiveHeightForN(N)
 * and NEVER references the verified height T_v. So an arbitrarily steep Knob-A schedule T_v(N)
 * (even T_v ~ N^{1.25} >> T0 ~ N/log N) leaves E_flow NUMERICALLY INVARIANT -- no re-inflation
 * (confirms imp-35149 S3/R4). Consequently the NET surrogate E(N) = E_coll + E_trunc + E_flow -> 0
 * whenever the Knob-A exponent beta >= 1.25, and once E_trunc is pushed below E_coll the surviving
 * DOMINANT term is E_coll (C_mb / GUE-conditional per imp-486, E_flow being ~N^{-1/2} smaller).
 *
 * WHAT THIS SHARPENS (imp-35149 R3, the binding obligation)
 * ---------------------------------------------------------
 * imp-35149 R3 demanded merely "T_v(N) -> infinity" unconditionally beyond T_PT = 3e12. This module
 * sharpens the demand: to actually beat the vanishing E_coll one needs T_v growing like N^{1.25},
 * STRICTLY STEEPER than the instantiation-height pace T0 ~ N / log N. That makes R3 STRICTLY HARDER
 * (an N^{1.25}-fast unconditional verified-height supply, not merely an unbounded one), leaving R3
 * exactly as OPEN and binding as before. This is an INPUT-HYPOTHESIS derivation about the surrogate
 * arithmetic; T_v growth is POSITED, not discharged.
 *
 * DERIVATION / MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate. T_v growth is an INPUT
 * hypothesis, NOT a discharged bound; discharges none of imp-35149 R1..R5 (R3 stays OPEN/binding).
 * Changes no bound; C_mb GUE-conditional per imp-486 UNTOUCHED and SEPARATE from the R3
 * verified-height input; imp-2631 fixed strip UNTOUCHED; C_C 1/8 ansatz (imp-2642) UNTOUCHED;
 * imp-3066 K_a >= 0 untouched; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35149-vanishing-etrunc-strip-scope (Knob A named the only vanishing lever; law unscoped)
 * @see imp-35100-surrogate-total-E-fartail-floor (E(N) floors at the constant E_trunc)
 * @see imp-2631-honest-truncation-route-assessment (E_trunc = (2e/kappa) T_v^{-kappa}, fixed strip)
 * @see imp-33723 (E_coll = E_trunc closed-form crossover, the sibling N solve)
 * @see imp-486 (C_mb GUE-conditional caveat; separate conditional from the R3 verified-height input)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = instantiation height)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const T_PT = 3e12; // Platt-Trudgian verified height (imp-2631)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-35100/imp-35149 exactly

const SIGMA = 0.75; // fixed working abscissa
const E_ING = (3 * (1 - SIGMA)) / (2 - SIGMA); // Ingham density exponent = 0.6
const KAPPA = 1 - E_ING; // = 0.4
const PREFACTOR = (2 * E_ING) / KAPPA; // = 3.0

// E_trunc via the imp-2631 tail integral at fixed sigma = 3/4: 3.0 * T_v^{-0.4}.
const eTrunc = (T_v) => (T_v > 1 ? PREFACTOR * Math.pow(T_v, -KAPPA) : null);
// E_coll and E_flow key off T0 = effectiveHeightForN(N), NEVER the verified height T_v.
function collFlow(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  return { T0, L, E_coll, E_flow };
}

// Reuse gate: reproduce the imp-2631 / imp-35149 fixed-strip constant E_trunc = 3.06e-5.
const E_TRUNC_FIXED = eTrunc(T_PT); // ~3.06e-5

// --- The balance / equal-error verified-height schedule (closed form) ---------------------------
// T_v*(N) = (3/C_C)^{1/kappa} (N / log T0)^{1/(2 kappa)}; critical exponent beta_crit = 1/(2 kappa).
const BALANCE_CONST = Math.pow(PREFACTOR / C_C_PINNED, 1 / KAPPA); // (3/C_C)^{2.5} ~ 170.88
const BETA_CRIT = 1 / (2 * KAPPA); // = 1.25
function balanceHeight(N) {
  const { L } = collFlow(N);
  return BALANCE_CONST * Math.pow(N / L, BETA_CRIT);
}
// Verify it is a genuine root: E_trunc(T_v*(N)) == E_coll(N).
function balanceResidual(N) {
  const { E_coll } = collFlow(N);
  return eTrunc(balanceHeight(N)) / E_coll - 1;
}

// --- (S1) The natural T_v = T0 identification is TOO SLOW: ratio grows, never crosses ------------
const TV_EQ_T0_LADDER = [6, 9, 13, 20, 30].map((k) => {
  const N = Math.pow(10, k);
  const { T0, E_coll } = collFlow(N);
  return { log10N: k, ratio: eTrunc(T0) / E_coll }; // E_trunc(T0)/E_coll, monotone UP
});
let tvEqT0Monotone = true;
for (let i = 1; i < TV_EQ_T0_LADDER.length; i++) {
  if (!(TV_EQ_T0_LADDER[i].ratio > TV_EQ_T0_LADDER[i - 1].ratio)) tvEqT0Monotone = false;
}
const TV_EQ_T0_NEVER_CROSSES = TV_EQ_T0_LADDER[TV_EQ_T0_LADDER.length - 1].ratio > 1;

// --- Crossover N for a posited law T_v(N) = A N^{beta_crit} (constant-sensitive) ----------------
function crossoverLog10(A, beta, kMax) {
  for (let k = 1; k <= kMax; k += 0.05) {
    const N = Math.pow(10, k);
    const { E_coll } = collFlow(N);
    if (eTrunc(A * Math.pow(N, beta)) < E_coll) return k;
  }
  return null; // no crossover within [1, kMax]
}
const CROSS_A1 = crossoverLog10(1, BETA_CRIT, 40); // ~27.55
const CROSS_A10 = crossoverLog10(10, BETA_CRIT, 40); // ~4.25
const CROSS_A0p1 = crossoverLog10(0.1, BETA_CRIT, 40); // null (no crossover)
// Right exponent, wrong constant: T_v = T0^{1.25} never crosses (~15x below the balance scale).
function t0PowNeverCrosses(kMax) {
  for (let k = 1; k <= kMax; k += 0.5) {
    const N = Math.pow(10, k);
    const { T0, E_coll } = collFlow(N);
    if (eTrunc(Math.pow(T0, BETA_CRIT)) < E_coll) return false;
  }
  return true;
}
const T0POW_NEVER_CROSSES = t0PowNeverCrosses(40);

// --- E_flow decoupling: invariant to any Knob-A T_v choice (keys off T0 only) -------------------
const CF_1E9 = collFlow(1e9);

export const IMP35169_KNOBA_GROWTH_LAW_CROSSOVER = {
  id: 'imp-35169',
  proofSection: 'S-frontier',
  question:
    'Derive the Knob-A growing-verified-height law T_v(N) that drives the imp-35149 E_trunc(N) = ' +
    '(2e/kappa) T_v^{-kappa} floor toward 0 at fixed sigma = 3/4 (kappa = 0.4), locate the crossover ' +
    'N at which growing T_v(N) first pushes E_trunc below the vanishing E_coll = C_C sqrt(log T0/N), ' +
    'and measure whether the growing-height schedule re-inflates E_flow. Derivation/measurement only ' +
    'on the inherited imp-3220/imp-3406 surrogate; T_v growth is an INPUT hypothesis, not a ' +
    'discharged bound; C_mb GUE-conditional per imp-486; changes no bound; NO QED.',
  surrogate:
    'E_trunc(T_v) = 3.0 T_v^{-0.4} (imp-2631, sigma = 3/4); E_coll(N) = C_C sqrt(log T0/N) ' +
    '(GUE-cond); E_flow(N) = C_F (log T0/T0) Gronwall; T0 = effectiveHeightForN(N) the instantiation ' +
    'height, SEPARATE from and not referencing the verified height T_v.',
  balanceSchedule: {
    closedForm:
      'T_v*(N) = (3/C_C)^{1/kappa} (N / log T0)^{1/(2 kappa)} = (3/C_C)^{2.5} (N / log T0)^{1.25}',
    balanceConst: +BALANCE_CONST.toFixed(4), // ~170.88 = (3/C_C)^{2.5}
    betaCrit: BETA_CRIT, // 1.25 = 1/(2 kappa): the critical N-growth exponent
    interpretation:
      'To push E_trunc below the vanishing E_coll one needs a verified-height schedule growing AT ' +
      'LEAST like N^{1.25} -- STRICTLY super-linear, faster than the instantiation height T0 ~ ' +
      '2pi N/log N (exponent 1). Growing T_v merely in lockstep with T0 is insufficient.',
  },
  tvEqT0TooSlow: {
    statement:
      'The natural minimal identification T_v(N) = T0(N) (exponent 1) never crosses: E_trunc(T0)/' +
      'E_coll rises monotonically from ~10.5 at 1e6 to ~2420 at 1e30. Even the right-exponent ' +
      'wrong-constant law T_v = T0^{1.25} (~15x below the balance scale) never crosses to N <= 1e40.',
    ladder: TV_EQ_T0_LADDER.map((r) => ({ log10N: r.log10N, ratio: +r.ratio.toFixed(4) })),
    t0PowNeverCrosses: T0POW_NEVER_CROSSES,
  },
  crossoverConstantSensitive: {
    statement:
      'At the marginal exponent beta = beta_crit = 1.25 the crossover N depends strongly on the ' +
      'amplitude A of T_v = A N^{1.25}: A = 1 crosses at N ~ 10^27.55, A = 10 at N ~ 10^4.25, ' +
      'A = 0.1 not within 1e40. The robust invariant is the EXPONENT 1.25, not any single crossover N.',
    crossoverLog10N_A1: CROSS_A1 === null ? null : +CROSS_A1.toFixed(2),
    crossoverLog10N_A10: CROSS_A10 === null ? null : +CROSS_A10.toFixed(2),
    crossoverLog10N_A0p1: CROSS_A0p1, // null
  },
  eFlowReInflation: {
    statement:
      'E_flow = C_F (log T0/T0) Gronwall keys off T0 = effectiveHeightForN(N) and NEVER references ' +
      'T_v, so an arbitrarily steep Knob-A schedule leaves E_flow NUMERICALLY INVARIANT -- NO ' +
      're-inflation. Net E(N) -> 0 whenever the exponent beta >= 1.25; once E_trunc is pushed below ' +
      'E_coll the surviving dominant term is E_coll (GUE-conditional per imp-486).',
    E_flow_at_1e9: +CF_1E9.E_flow.toExponential(4), // invariant to T_v
    E_coll_at_1e9: +CF_1E9.E_coll.toExponential(4),
  },
  sharpensR3:
    'imp-35149 R3 demanded merely T_v -> infinity; this sharpens it to T_v growing like N^{1.25}, ' +
    'STRICTLY steeper than the instantiation-height pace T0 ~ N/log N, making R3 strictly HARDER ' +
    'and leaving it exactly as OPEN and binding.',
  landmarks: {
    E_trunc_fixed_at_TPT: +E_TRUNC_FIXED.toExponential(4), // ~3.06e-5 (reuse gate vs imp-2631/35149)
    balanceConst: +BALANCE_CONST.toFixed(4), // ~170.88
    betaCrit: BETA_CRIT, // 1.25
    tvEqT0_ratio_at_1e30: +TV_EQ_T0_LADDER[TV_EQ_T0_LADDER.length - 1].ratio.toFixed(2), // ~2420
  },
  isRigorous: false,
  verdict:
    'DERIVATION/MEASUREMENT (frontier-direction, NOT rigorous). Holding the density abscissa fixed ' +
    'at sigma = 3/4 (kappa = 0.4, prefactor 2e/kappa = 3.0), the Knob-A verified-height schedule that ' +
    'makes E_trunc(N) = 3.0 T_v^{-0.4} exactly balance the vanishing collision term E_coll = ' +
    'C_C sqrt(log T0/N) is the closed form T_v*(N) = (3/C_C)^{2.5} (N/log T0)^{1.25} ~ 170.88 ' +
    '(N/log T0)^{1.25}, so the CRITICAL N-growth exponent is beta_crit = 1/(2 kappa) = 1.25. To push ' +
    'E_trunc STRICTLY below E_coll one needs T_v growing at least like N^{1.25} -- STRICTLY ' +
    'super-linear, FASTER than the instantiation height T0 ~ 2pi N/log N (exponent 1). The natural ' +
    'minimal identification T_v = T0 is therefore TOO SLOW: E_trunc(T0)/E_coll rises monotonically ' +
    'from ~10.5 (1e6) to ~2420 (1e30) and never crosses; even the right-exponent wrong-constant law ' +
    'T_v = T0^{1.25} (~15x below the balance scale) never crosses to N <= 1e40. At the marginal ' +
    'exponent the crossover N is amplitude-sensitive (T_v = N^{1.25} crosses at N ~ 10^27.55, ' +
    '10 N^{1.25} at ~10^4.25, 0.1 N^{1.25} not within 1e40), so the robust invariant is the EXPONENT ' +
    '1.25, not a single crossover N. Crucially the growing-height schedule does NOT re-inflate ' +
    'E_flow = C_F (log T0/T0) Gronwall, which keys off T0 and never references T_v -- it is ' +
    'numerically invariant to any Knob-A choice (confirms imp-35149 S3/R4); the net E(N) -> 0 ' +
    'whenever beta >= 1.25 and the surviving dominant term is the GUE-conditional E_coll (imp-486). ' +
    'This SHARPENS imp-35149 R3 from T_v -> infinity to T_v ~ N^{1.25}, strictly steeper than the ' +
    'instantiation-height pace, making R3 strictly harder and leaving it exactly as OPEN and ' +
    'binding. DERIVATION/MEASUREMENT ONLY: T_v growth is an INPUT hypothesis, NOT a discharged ' +
    'bound; discharges none of imp-35149 R1..R5; changes no bound; C_mb GUE-conditional per imp-486 ' +
    'UNTOUCHED and SEPARATE from the R3 verified-height input; imp-2631 fixed strip UNTOUCHED; C_C ' +
    '1/8 ansatz (imp-2642) UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no operator ' +
    'positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35149 (Knob A named only vanishing lever, law unscoped); imp-35100 (E(N) floors at ' +
    'constant E_trunc); imp-2631 (E_trunc = (2e/kappa) T_v^{-kappa}, fixed strip); imp-33723 ' +
    '(E_coll = E_trunc sibling closed form); imp-486 (C_mb GUE-conditional, separate from R3); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35169_KNOBA_GROWTH_LAW_CROSSOVER_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-2631 / imp-35149 fixed-strip constant on the shared model.
    id: 'imp35169-reproduces-fixed-strip-constant',
    description: 'E_trunc(T_PT) ~ 3.06e-5 on the shared imp-2631 3.0 T_v^{-0.4} model',
    holds: () => Math.abs(E_TRUNC_FIXED / 3.06e-5 - 1) < 5e-3,
  },
  {
    // The balance height is a genuine root: E_trunc(T_v*(N)) = E_coll(N) to machine precision.
    id: 'imp35169-balance-schedule-is-a-root',
    description: 'T_v*(N) solves E_trunc(T_v*) = E_coll(N) at N = 1e6, 1e12, 1e20 (residual < 1e-9)',
    holds: () =>
      Math.abs(balanceResidual(1e6)) < 1e-9 &&
      Math.abs(balanceResidual(1e12)) < 1e-9 &&
      Math.abs(balanceResidual(1e20)) < 1e-9,
  },
  {
    // Critical exponent beta_crit = 1/(2 kappa) = 1.25 and constant (3/C_C)^{2.5} ~ 170.88.
    id: 'imp35169-critical-exponent-and-constant',
    description: 'beta_crit = 1.25 and (3/C_C)^{2.5} ~ 170.88',
    holds: () => Math.abs(BETA_CRIT - 1.25) < 1e-12 && Math.abs(BALANCE_CONST - 170.88) < 0.1,
  },
  {
    // (S1) T_v = T0 is too slow: E_trunc/E_coll monotone UP and never crosses below 1.
    id: 'imp35169-tvEqT0-too-slow-never-crosses',
    description: 'T_v = T0 gives E_trunc/E_coll monotone increasing (>1 throughout), never a crossover',
    holds: () => tvEqT0Monotone && TV_EQ_T0_NEVER_CROSSES && T0POW_NEVER_CROSSES,
  },
  {
    // Crossover at the marginal exponent is amplitude-sensitive: A=1 late, A=10 early, A=0.1 none.
    id: 'imp35169-crossover-constant-sensitive',
    description: 'T_v = A N^{1.25}: A=1 crosses ~1e27.5, A=10 crosses ~1e4.3, A=0.1 no crossover to 1e40',
    holds: () =>
      CROSS_A1 !== null &&
      CROSS_A1 > 25 &&
      CROSS_A10 !== null &&
      CROSS_A10 < 6 &&
      CROSS_A10 < CROSS_A1 &&
      CROSS_A0p1 === null,
  },
  {
    // E_flow keys off T0 and is invariant to T_v: no re-inflation from Knob A.
    id: 'imp35169-eflow-no-reinflation',
    description: 'E_flow computed from T0 alone (no T_v dependence); E_flow(1e9) < E_coll(1e9)',
    holds: () => CF_1E9.E_flow > 0 && CF_1E9.E_flow < CF_1E9.E_coll,
  },
  {
    // Honesty gate: derivation only, no QED, no refereed bound is changed, imp-486 GUE-conditional noted, R3 open.
    id: 'imp35169-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, GUE-conditional noted, R3 stays binding, no refereed bound is changed',
    holds: () =>
      IMP35169_KNOBA_GROWTH_LAW_CROSSOVER.isRigorous === false &&
      /NO QED/.test(IMP35169_KNOBA_GROWTH_LAW_CROSSOVER.verdict) &&
      /imp-486/.test(IMP35169_KNOBA_GROWTH_LAW_CROSSOVER.verdict) &&
      /refereed bound is changed/i.test(IMP35169_KNOBA_GROWTH_LAW_CROSSOVER.verdict) &&
      /binding/.test(IMP35169_KNOBA_GROWTH_LAW_CROSSOVER.sharpensR3),
  },
];

for (const a of IMP35169_KNOBA_GROWTH_LAW_CROSSOVER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35169-knobA-growth-law-crossover assertion failed: ${a.id}`);
  }
}
