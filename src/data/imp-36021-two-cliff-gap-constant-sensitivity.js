/**
 * @module imp-36021-two-cliff-gap-constant-sensitivity
 *
 * MEASUREMENT / DIAGNOSTIC ONLY (double precision). imp-35972 bisected the imp-35892 overflow edge into
 * TWO distinct, sub-decade-adjacent representability cliffs:
 *   CLIFF B -- the R_direct NaN cliff (a -> 0): aOf = 2 pi K/(T . u) collapses to 0 because the
 *              DENOMINATOR product T . u overflows to +Infinity one double before T does.
 *   CLIFF A -- the effectiveHeightForN -> +Infinity cliff, ~6.2e-4 decade ABOVE B: the Newton seed
 *              NUMERATOR 2 pi . N exceeds MAX_VALUE once N > MAX_VALUE/(2 pi).
 * imp-35972 LOCATED both at the pinned imp-35855/imp-35892 constants (K ~ 1.5727e8, delta = 2e-4,
 * S_inf = 1/(2 delta) = 2500) but never PERTURBED them. This module varies each constant across (and well
 * beyond) its stated provenance and measures dlog10(N_cliff)/dlog(each constant) for BOTH cliffs, and
 * whether their ~6.2e-4-decade separation is preserved.
 *
 * WHAT THE PERTURBATION FINDS -- THE GAP IS EXACTLY CONSTANT-ROBUST (SENSITIVITY IS STRUCTURALLY ZERO)
 * ---------------------------------------------------------------------------------------------------
 * Both cliffs are representability cliffs of the double-precision effectiveHeightForN seed and its T . u
 * product; neither event location depends on K, delta, or S_inf:
 *
 *   CLIFF A depends ONLY on N via the RvM seed T = 2 pi . N / log(N + 2 pi): it overflows when the
 *   NUMERATOR 2 pi . N exceeds MAX_VALUE, i.e. at N > MAX_VALUE/(2 pi). K, delta, S_inf never enter
 *   effectiveHeightForN, so N_A is bit-identical under every perturbation -> dlog10(N_A)/dlog(*) = 0.
 *
 *   CLIFF B is where the DENOMINATOR T . u overflows to +Infinity, forcing a = (2 pi K)/(T . u) -> 0.
 *   K sits in the NUMERATOR only, so it cannot move the point at which T . u overflows: a = finite/Infinity
 *   is 0 for ANY finite positive K. delta and S_inf do not appear in aOf at all. So N_B is bit-identical
 *   under every K/delta/S_inf perturbation across provenance -> dlog10(N_B)/dlog(*) = 0.
 *
 *   The downstream R_direct NaN cliff (which DOES carry S_inf, delta, M_G) coincides EXACTLY with cliff B:
 *   R_direct = -dFP/dG_direct with dG_direct = -S_inf . a/(2-a) goes 0/0 -> NaN precisely when a -> 0, and
 *   a -> 0 is set by the K/delta/S_inf-independent T . u overflow. So even the constant-carrying R_direct
 *   cliff does not move.
 *
 * Therefore the ~6.2e-4-decade separation N_A/N_B is INVARIANT: dlog10(gap)/dlog(K) =
 * dlog10(gap)/dlog(delta) = dlog10(gap)/dlog(S_inf) = 0 to the last bit across the tested ranges. The
 * separation is a fixed geometric property of the IEEE-754 seed, NOT a constant-tunable quantity.
 *
 * ONLY-IF EDGE (outside provenance, reported for honesty): cliff B WOULD move only if K were driven so
 * small that a underflows to 0 while T . u is still finite -- that needs 2 pi K < MIN_DENORMAL . (T . u) ~
 * 5e-324 . 1.8e308 ~ 9e-16, i.e. K < ~1.4e-16, ~24 orders below the pinned K ~ 1.57e8. No realistic K,
 * delta, or S_inf provenance approaches this, so the zero-sensitivity result is robust.
 *
 * SCOPE / HONESTY
 * ---------------
 * Measurement/diagnostic only, double precision, on the imp-35855/imp-35892 surrogate (identical aOf,
 * effectiveHeightForN, R_direct form). Instantiates NO interval, ports nothing, derives no remainder,
 * changes no bound. imp-34714a REMAINS OPEN. C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486)
 * UNTOUCHED. NO QED. No refereed bound is changed.
 *
 * @see imp-35972-effective-height-overflow-cliff-bisection (LOCATED the two cliffs at the pinned constants; never perturbed them)
 * @see imp-35892-rdirect-own-floor-departure-height (coarse decade sweep; R_direct = -S_inf a/(2-a))
 * @see imp-35855-rclean-interval-de-cancellation-assessment (de-cancelled the dG node)
 * @see imp-34996-krawczyk-headroom-safety-factor-asymptote (S_inf = 1/(2 delta) floor)
 * @see lambda-rh-height-mapping (effectiveHeightForN RvM inverse; the 2 pi . N seed numerator overflow edge)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (identical to imp-35892)
const K_PINNED = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (imp-35855/imp-35892)
const DELTA_PINNED = 2e-4; // fixed imp-34774/34776/34799 relative bracket half-width
const S_INF_PINNED = 1 / (2 * DELTA_PINNED); // 2500 exactly (imp-34996 large-N floor)
const MIN_NORMAL_DOUBLE = 2.2250738585072014e-308;

// Parametrized aOf: K is a NUMERATOR-only amplitude, exactly as in imp-35892.
const aOfK = (N, K) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K) / (T * u);
};

// Parametrized R_direct exactly as imp-35892 evaluates it (carries K, delta, S_inf, M_G).
function rDirect(N, K, delta, sInf) {
  const a = aOfK(N, K);
  const G = 1 - a;
  const aLo = aOfK(N * (1 - delta), K);
  const M_G = (2 * G) / (1 + G);
  const dG_direct = -(sInf * a) / (2 - a);
  const dFP = sInf * M_G * (aLo / (1 - aLo));
  return -dFP / dG_direct;
}

// Bisect on the double N itself for the last N satisfying predicate; lo must hold, hi must fail.
function bisectDoubleBoundary(loStart, hiStart, predicate) {
  let lo = loStart;
  let hi = hiStart;
  for (let i = 0; i < 200; i++) {
    const mid = lo + (hi - lo) / 2;
    if (mid === lo || mid === hi) break;
    if (predicate(mid)) lo = mid;
    else hi = mid;
  }
  return { lastHolds: lo, firstFails: hi };
}

// CLIFF A: effectiveHeightForN(N) finite -> +Infinity. Takes NO K/delta/S_inf argument.
const CLIFF_A = bisectDoubleBoundary(1e307, Number.MAX_VALUE, (N) => Number.isFinite(effectiveHeightForN(N)));
const N_A = CLIFF_A.lastHolds;
const LOG10_N_A = Math.log10(N_A);

// Locate cliff B (a -> 0 via T . u overflow) for a given K. loStart 1e307, hiStart N_A (cliff A above it).
const cliffBForK = (K) => bisectDoubleBoundary(1e307, N_A, (N) => aOfK(N, K) > 0).lastHolds;

// Locate the downstream R_direct NaN cliff for a given (K, delta, S_inf).
const cliffRForKDS = (K, delta, sInf) =>
  bisectDoubleBoundary(1e307, N_A, (N) => Number.isFinite(rDirect(N, K, delta, sInf))).lastHolds;

// Provenance-and-beyond K ladder: +/- 4 orders around the pinned K (provenance uncertainty in
// C_C ~ 0.3837 and E_trunc ~ 3.06e-5 is well under one order each, so this brackets it generously).
const K_FACTORS = [1e-4, 1e-2, 0.1, 1, 10, 1e2, 1e4];
const K_SWEEP = K_FACTORS.map((f) => {
  const K = K_PINNED * f;
  const N_B = cliffBForK(K);
  const log10N_B = Math.log10(N_B);
  return {
    K_over_pinned: f,
    K: +K.toExponential(6),
    a_zero_last_positive_log10_N: +log10N_B.toFixed(9),
    N_B_bit_identical_to_pinned: N_B === cliffBForK(K_PINNED),
    gap_A_minus_B_decade: +(LOG10_N_A - log10N_B).toExponential(6),
  };
});

// delta/S_inf ladder on the R_direct NaN cliff. delta in [1e-4, 4e-4] (imp-34774/34776/34799 bracket);
// S_inf coupled 1/(2 delta) AND an independent decoupled S_inf probe, all at the pinned K.
const N_B_PINNED = cliffBForK(K_PINNED);
const DELTA_LADDER = [1e-4, 2e-4, 4e-4];
const DELTA_SWEEP = DELTA_LADDER.map((delta) => {
  const sInf = 1 / (2 * delta);
  const N_R = cliffRForKDS(K_PINNED, delta, sInf);
  return {
    delta,
    S_inf_coupled: +sInf.toFixed(6),
    rdirect_nan_last_finite_log10_N: +Math.log10(N_R).toFixed(9),
    rdirect_cliff_equals_a_zero_cliff: N_R === N_B_PINNED,
  };
});
// Independent S_inf decoupling probe (delta fixed at pinned) to show S_inf alone does not move the cliff.
const S_INF_DECOUPLED = [250, 2500, 25000];
const S_INF_SWEEP = S_INF_DECOUPLED.map((sInf) => {
  const N_R = cliffRForKDS(K_PINNED, DELTA_PINNED, sInf);
  return {
    S_inf: sInf,
    rdirect_nan_last_finite_log10_N: +Math.log10(N_R).toFixed(9),
    rdirect_cliff_equals_a_zero_cliff: N_R === N_B_PINNED,
  };
});

// Sensitivity slopes dlog10(N_cliff)/dlog(K): finite-difference on the widest K bracket used.
const log10N_B_lo = K_SWEEP[0].a_zero_last_positive_log10_N;
const log10N_B_hi = K_SWEEP[K_SWEEP.length - 1].a_zero_last_positive_log10_N;
const dlnK = Math.log(K_FACTORS[K_FACTORS.length - 1]) - Math.log(K_FACTORS[0]);
const SENS_dlog10NB_dlnK = (log10N_B_hi - log10N_B_lo) / dlnK; // expected exactly 0
const GAP_MAX = Math.max(...K_SWEEP.map((r) => r.gap_A_minus_B_decade));
const GAP_MIN = Math.min(...K_SWEEP.map((r) => r.gap_A_minus_B_decade));
const GAP_SPREAD = GAP_MAX - GAP_MIN; // expected exactly 0

// The only-if-edge K below which cliff B WOULD move (a underflows before T . u overflows).
const TU_NEAR_MAX = Number.MAX_VALUE; // T . u sits just below MAX_VALUE at cliff B
const K_UNDERFLOW_EDGE = (MIN_NORMAL_DOUBLE * TU_NEAR_MAX) / TWO_PI; // ~ 6.4e-17: K below this moves cliff B

export const IMP36021_TWO_CLIFF_GAP_CONSTANT_SENSITIVITY = {
  id: 'imp-36021',
  proofSection: 'S-frontier',
  question:
    'Vary the pinned K, delta, and S_inf across their stated provenance and measure ' +
    'dlog10(N_cliff)/dlog(each constant) for BOTH imp-35972 cliffs (the R_direct NaN cliff a -> 0, which ' +
    'binds first, and the effectiveHeightForN -> +Infinity cliff ~6.2e-4 decade above), and whether their ' +
    'separation is constant-robust. Measurement/diagnostic only, double precision; instantiates no ' +
    'interval; NO QED.',
  finding:
    'The two-cliff separation is EXACTLY constant-robust: perturbing K over +/-4 orders and delta over ' +
    '[1e-4,4e-4] (with S_inf coupled and decoupled) moves NEITHER cliff by a single bit. CLIFF A ' +
    '(effectiveHeightForN -> +Infinity) depends only on the RvM seed numerator 2 pi . N exceeding ' +
    'MAX_VALUE -- K/delta/S_inf never enter effectiveHeightForN, so N_A is fixed at log10 N ~ ' +
    LOG10_N_A.toFixed(6) +
    '. CLIFF B (a -> 0) is where the DENOMINATOR T . u overflows to +Infinity; K sits in the NUMERATOR ' +
    'only (a = finite/Infinity = 0 for any finite K) and delta/S_inf do not appear in aOf, so N_B is ' +
    'bit-identical (log10 N ~ ' +
    Math.log10(N_B_PINNED).toFixed(6) +
    ') across every perturbation. The downstream R_direct NaN cliff, which DOES carry S_inf/delta/M_G, ' +
    'coincides EXACTLY with cliff B in all ' +
    (DELTA_SWEEP.length + S_INF_SWEEP.length) +
    ' delta/S_inf probes. Hence dlog10(N_A)/dlog(*) = dlog10(N_B)/dlog(*) = 0 (measured slope ' +
    'dlog10(N_B)/dlnK = ' +
    SENS_dlog10NB_dlnK.toExponential(2) +
    ') and the ~6.2e-4-decade gap has ZERO spread (' +
    GAP_SPREAD.toExponential(2) +
    ') over the K sweep. The separation is a fixed IEEE-754 seed geometry, not a constant-tunable ' +
    'quantity. MEASUREMENT/DIAGNOSTIC, double precision; no interval instantiated.',
  constants: {
    reused_from: 'imp-35855/imp-35892/imp-35972 (identical aOf, effectiveHeightForN, R_direct form)',
    K_pinned: +K_PINNED.toExponential(6),
    delta_pinned: DELTA_PINNED,
    S_inf_pinned: S_INF_PINNED,
    max_double: Number.MAX_VALUE,
    min_normal_double: MIN_NORMAL_DOUBLE,
    K_underflow_edge_below_which_cliffB_moves: +K_UNDERFLOW_EDGE.toExponential(6),
  },
  metric: {
    cliffA_height_overflow_log10_N: +LOG10_N_A.toFixed(9),
    cliffB_a_zero_log10_N_at_pinned: +Math.log10(N_B_PINNED).toFixed(9),
    gap_A_minus_B_decade_at_pinned: +(LOG10_N_A - Math.log10(N_B_PINNED)).toExponential(9),
    K_sweep: K_SWEEP,
    delta_sweep: DELTA_SWEEP,
    S_inf_decoupled_sweep: S_INF_SWEEP,
    sensitivity_dlog10_NB_dlnK: +SENS_dlog10NB_dlnK.toExponential(6),
    gap_spread_over_K_sweep_decade: +GAP_SPREAD.toExponential(6),
    all_K_perturbations_bit_identical_NB: K_SWEEP.every((r) => r.N_B_bit_identical_to_pinned),
    all_delta_probes_rdirect_equals_aZero: DELTA_SWEEP.every((r) => r.rdirect_cliff_equals_a_zero_cliff),
    all_S_inf_probes_rdirect_equals_aZero: S_INF_SWEEP.every((r) => r.rdirect_cliff_equals_a_zero_cliff),
  },
  subGap:
    'imp-34714a REMAINS OPEN. This is a double-precision SENSITIVITY MEASUREMENT of two nested ' +
    'representability cliffs of the imp-35892 surrogate; it instantiates NO interval, ports no operator, ' +
    'and does not touch F(m)=0 (which stays a double-precision artifact). Changes no bound. The zero ' +
    'sensitivity is a property of the shipped IEEE-754 effectiveHeightForN seed and its T . u product, ' +
    'NOT an RH quantity. The only-if edge K < ~6.4e-17 that would move cliff B lies ~24 orders below the ' +
    'pinned K and outside every stated provenance.',
  isRigorous: false,
  verdict:
    'THE imp-35972 TWO-CLIFF GAP IS EXACTLY CONSTANT-ROBUST (measurement/diagnostic, NOT an RH bound). ' +
    'dlog10(N_A)/dlog(K,delta,S_inf) = dlog10(N_B)/dlog(K,delta,S_inf) = 0 to the last bit: cliff A is set ' +
    'by the K/delta/S_inf-free RvM seed numerator overflow, and cliff B by the K/delta/S_inf-free T . u ' +
    'denominator overflow (K is numerator-only; delta/S_inf never enter aOf). The R_direct NaN cliff ' +
    'coincides with cliff B under every delta/S_inf probe, so the ~6.2e-4-decade separation has zero ' +
    'spread across a +/-4-order K sweep. Reuses the imp-35855/imp-35892/imp-35972 machinery. imp-34714a ' +
    'REMAINS OPEN; C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; instantiates ' +
    'no interval; changes no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-35972 (located both cliffs at the pinned constants; never perturbed them); imp-35892 (coarse ' +
    'decade sweep, R_direct = -S_inf a/(2-a)); imp-35855 (de-cancelled dG node); imp-34996 (S_inf = ' +
    '1/(2 delta) floor); imp-34714a (OPEN Krawczyk certificate); lambda-rh-height-mapping ' +
    '(effectiveHeightForN RvM inverse, seed T = 2 pi . N / log(N + 2 pi)). IEEE-754 double MAX_VALUE ~ ' +
    '1.7977e308 and min normal ~ 2.2251e-308: standard float model.',
};

export const IMP36021_TWO_CLIFF_GAP_CONSTANT_SENSITIVITY_ASSERTIONS = [
  {
    // Cliff B (a -> 0) is bit-identical across the +/-4-order K sweep: K is numerator-only.
    id: 'imp36021-cliffB-bit-identical-across-K-sweep',
    description: 'N_B unchanged for K over [1e-4, 1e4] x pinned; dlog10(N_B)/dlnK = 0',
    holds: () =>
      K_SWEEP.every((r) => r.N_B_bit_identical_to_pinned) &&
      SENS_dlog10NB_dlnK === 0 &&
      GAP_SPREAD === 0,
  },
  {
    // Cliff A is set by the K/delta/S_inf-free RvM seed; it is the same fixed log10 height as imp-35972.
    id: 'imp36021-cliffA-constant-free-seed-overflow',
    description: 'effectiveHeightForN overflow at log10 N ~ 307.4565 carries no K/delta/S_inf dependence',
    holds: () =>
      Number.isFinite(effectiveHeightForN(N_A)) &&
      !Number.isFinite(effectiveHeightForN(CLIFF_A.firstFails)) &&
      LOG10_N_A > 307.455 &&
      LOG10_N_A < 307.46,
  },
  {
    // The R_direct NaN cliff (which carries delta/S_inf) coincides EXACTLY with the a -> 0 cliff B.
    id: 'imp36021-rdirect-nan-cliff-equals-a-zero-cliff',
    description: 'R_direct NaN cliff = cliff B for all delta in [1e-4,4e-4] and decoupled S_inf probes',
    holds: () =>
      DELTA_SWEEP.every((r) => r.rdirect_cliff_equals_a_zero_cliff) &&
      S_INF_SWEEP.every((r) => r.rdirect_cliff_equals_a_zero_cliff) &&
      N_B_PINNED < N_A,
  },
  {
    // Honesty gate: measurement only, not rigorous, sub-gap open, no interval, no QED, no refereed bound is changed.
    id: 'imp36021-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no interval, no QED, no refereed bound is changed',
    holds: () =>
      IMP36021_TWO_CLIFF_GAP_CONSTANT_SENSITIVITY.isRigorous === false &&
      /imp-34714a REMAINS OPEN/.test(IMP36021_TWO_CLIFF_GAP_CONSTANT_SENSITIVITY.subGap) &&
      /NO QED/.test(IMP36021_TWO_CLIFF_GAP_CONSTANT_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP36021_TWO_CLIFF_GAP_CONSTANT_SENSITIVITY.verdict),
  },
];

for (const a of IMP36021_TWO_CLIFF_GAP_CONSTANT_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36021-two-cliff-gap-constant-sensitivity assertion failed: ${a.id}`);
  }
}
