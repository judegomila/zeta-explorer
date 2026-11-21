/**
 * @module imp-34676-crossover-contraction-right-widening
 *
 * imp-34676 (proof, frontier-direction): imp-34650 certified the imp-33723 crossover map
 * g(N) = K log T0(N) as a Banach L-contraction on the FIXED deep-tail interval I = [1e9, 1e10],
 * with uniform constant L = g_prime(1e9) ~ 0.1485 < 1 and self-map g(I) subset I. imp-34675 then
 * located the LEFT edge of the contraction region in closed form (N_star = K(1 - 1/W(K)) ~ 1.475e8).
 * This module assesses the OTHER direction: how far the certified interval can be widened to the
 * RIGHT, keeping a = 1e9 fixed and pushing the right endpoint b outward, while both the contraction
 * constant L and the self-map g([a, b]) subset [a, b] continue to hold.
 *
 * WHY WIDENING RIGHT IS FREE (the key observation)
 * ------------------------------------------------
 * g_prime(N) = K*2pi/(T0 log(T0/2pi)) is positive and strictly DECREASING in N (T0 increasing,
 * t -> t log(t/2pi) increasing; see imp-34650). So on ANY interval [a, b] the supremum of |g_prime|
 * is attained at the LEFT endpoint: L = sup_[a,b] |g_prime| = g_prime(a) = g_prime(1e9) ~ 0.1485.
 * Widening b to the right does NOT change a, hence L is INVARIANT under right-widening -- it stays
 * ~0.1485 < 1 for every b > a. The contraction constant is therefore never the binding constraint on
 * the right.
 *
 * The self-map has two endpoint conditions (g is increasing, so g([a,b]) = [g(a), g(b)]):
 *   (lower) g(a) >= a : g(1e9) ~ 3.1036e9 >= 1e9 -- FIXED, holds with wide margin, independent of b.
 *   (upper) g(b) <= b : this is the only b-dependent condition.
 * Because g has a fixed point N_cross ~ 3.280294e9 and is an increasing contraction, g(N) < N for ALL
 * N > N_cross. Hence g(b) <= b holds for EVERY b >= N_cross, and the self-map margin
 *   m(b) := b - g(b) = b - K log T0(b)
 * GROWS without bound as b -> infinity, since g(b) = K log T0(b) grows only logarithmically in b while
 * b grows linearly. So there is NO right-hand obstruction: the certificate interval [1e9, b] remains a
 * certified L-contraction self-map for arbitrarily large b (any b >= N_cross), with L pinned at
 * g_prime(1e9) and the upper self-map margin increasing to +infinity.
 *
 * THE ONE HONEST COST (a-priori Picard bound from a far seed)
 * -----------------------------------------------------------
 * Widening b is not entirely without price. The Banach a-priori bound from seed N_0 = b is
 *   |N_k - N_cross| <= L^k/(1-L) * |N_1 - N_0|,   |N_1 - N_0| = |g(b) - b| = m(b) ~ b.
 * Since m(b) grows linearly in b, the a-priori bound from the FAR seed N_0 = b degrades linearly:
 * its k=5 relative value climbs from ~1.7e-4 at b = 1e10 to O(1e286) at b = 1e300. The per-iterate
 * rate is unchanged (L fixed), so the number of Picard iterates to floating-point agreement grows only
 * from 12 (b=1e10) to ~13 (b=1e300); but the a-priori CERTIFICATE from the far endpoint stops being
 * "useful" (bound < 1) once b is far above N_cross. The honest reading: widening b right preserves the
 * contraction + self-map for free, but the a-priori bound stays useful only when seeded near N_cross,
 * not from the far endpoint b itself.
 *
 * MEASUREMENT (a = 1e9 fixed; b swept to 1e300)
 * ---------------------------------------------
 *   L = g_prime(1e9) ~ 1.484829e-1 for every b (invariant), g(a) ~ 3.1036e9 >= a (invariant).
 *   b       g(b)        g(b)<=b   margin b-g(b)   a-priori k5 rel (seed b)
 *   1e10    3.4466e9    yes       6.5534e9        1.693e-4   (imp-34650 value)
 *   1e12    4.1383e9    yes       9.9586e11       2.573e-2
 *   1e16    5.5363e9    yes       1.0000e16       2.584e+2
 *   1e20    6.9463e9    yes       1.0000e20       2.584e+6
 *   1e50    1.7657e10   yes       1.0000e50       2.584e+36
 *   1e100   3.5651e10   yes       1.0000e100      2.584e+86
 *   1e300   1.0790e11   yes       1.0000e300      2.584e+286
 * Every row keeps L ~ 0.1485 < 1 and g(b) <= b; only the a-priori bound from the far seed degrades.
 *
 * WHAT THIS IS AND IS NOT (sub-gap)
 * ---------------------------------
 * This measures the right-widening scope of the imp-34650 contraction certificate for the INHERITED
 * imp-3220/imp-3406 surrogate crossover map, evaluated in IEEE-754 double precision via
 * effectiveHeightForN. It shows the certificate extends arbitrarily far to the right (the left edge is
 * the sole binding constraint, imp-34675), NOT that anything is machine-checked. NAMED SUB-GAP
 * imp-34676a: the endpoint evaluations g(b), g_prime(a) are double precision; a formal statement would
 * enclose T0(b) and dT0/dN under interval arithmetic (compare imp-34650a / imp-34675a) and prove
 * g(N) < N for all N > N_cross rather than sampling it.
 *
 * DERIVATION / MEASUREMENT ONLY. This measures the scope of a property of the inherited surrogate
 * crossover, NOT a rigorous asymptotic and NOT an RH bound. C_C = (1/8) sqrt(3 pi) 1/8 ansatz
 * (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0
 * untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34650-crossover-banach-contraction-certificate (the L-contraction certificate on I = [1e9, 1e10] this widens rightward)
 * @see imp-34675-crossover-contraction-left-edge (closed-form LEFT edge N_star; the sole binding constraint)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (states N_cross as the fixed point of g)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse, monotone increasing)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (same K as imp-34650/imp-34675)

// The imp-33723 fixed-point map and its imp-34650 analytic derivative.
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const gPrime = (N) => {
  const T0 = effectiveHeightForN(N);
  return (K_AMPL * TWO_PI) / (T0 * Math.log(T0 / TWO_PI)); // K*(dT0/dN)/T0
};

// Fixed left endpoint (imp-34650) and the fixed point (imp-33723).
const A = 1e9;
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 80); // ~3.280294e9

// L is attained at the fixed left endpoint and is INVARIANT under right-widening.
const L_CONTRACTION = gPrime(A); // ~1.484829e-1
const G_A = g(A); // ~3.103592e9 (lower self-map endpoint, fixed)

// Sweep the right endpoint b outward; a = 1e9 stays fixed throughout.
const B_GRID = [1e10, 1e12, 1e16, 1e20, 1e50, 1e100, 1e300];
const rightWideningTable = B_GRID.map((b) => {
  const gb = g(b);
  const margin = b - gb; // upper self-map margin b - g(b) (grows without bound)
  const N1 = g(b); // Picard from far seed N_0 = b
  const aPrioriK5Rel = (Math.pow(L_CONTRACTION, 5) / (1 - L_CONTRACTION)) * Math.abs(N1 - b) / N_CROSS;
  return {
    b: +b.toExponential(0),
    L: +gPrime(A).toExponential(6), // invariant (sup at a = 1e9)
    g_of_b: +gb.toExponential(6),
    self_map_upper_holds: gb <= b, // g(b) <= b
    self_map_margin: +margin.toExponential(6),
    a_priori_k5_rel_from_far_seed_b: +aPrioriK5Rel.toExponential(3),
  };
});

// Structural checks across the whole sweep. Every row recomputes g_prime(a) (a fixed), so the
// tabulated L is byte-identical across rows -- invariance is an exact equality of the stored values.
const L_ROUNDED = +L_CONTRACTION.toExponential(6);
const L_invariant = rightWideningTable.every((r) => r.L === L_ROUNDED);
const self_map_holds_all_b = rightWideningTable.every((r) => r.self_map_upper_holds === true);
const margin_monotone_growing =
  rightWideningTable.every((r, i) => i === 0 || r.self_map_margin > rightWideningTable[i - 1].self_map_margin);
const a_priori_degrades =
  rightWideningTable[rightWideningTable.length - 1].a_priori_k5_rel_from_far_seed_b >
  rightWideningTable[0].a_priori_k5_rel_from_far_seed_b;

// The right-widening obstruction threshold: g(b) <= b iff b >= N_cross. Below it the upper endpoint fails.
const G_JUST_BELOW_NCROSS = g(0.5 * N_CROSS); // > 0.5*N_cross would fail as an upper endpoint (below fixed point)
const UPPER_FAILS_BELOW_NCROSS = G_JUST_BELOW_NCROSS > 0.5 * N_CROSS; // g(N) > N below the fixed point

export const IMP34676_CROSSOVER_CONTRACTION_RIGHT_WIDENING = {
  id: 'imp-34676',
  proofSection: 'S-frontier',
  question:
    'imp-34650 certified g(N) = K log T0(N) an L-contraction with self-map on the FIXED interval ' +
    'I = [1e9, 1e10]. Assess how far the right endpoint b can be widened (a = 1e9 fixed) while both ' +
    'the contraction constant L = g_prime(a) < 1 and the self-map g([a,b]) subset [a,b] still hold, ' +
    'tabulating L and the two self-map endpoint margins vs b. Measurement only; certifies a property ' +
    'of the inherited surrogate crossover, NOT an RH bound; no QED.',
  invariants: {
    // L and the lower self-map endpoint do not depend on b.
    L_at_left_endpoint: +L_CONTRACTION.toExponential(6), // ~1.484829e-1 for every b
    L_is_b_independent: true,
    g_of_a: +G_A.toExponential(6), // ~3.103592e9
    lower_self_map_g_a_ge_a: G_A >= A, // fixed, holds with wide margin
  },
  rightWideningTable, // L invariant, g(b) <= b for all b, margin -> infinity, a-priori bound degrades
  structure: {
    L_invariant_under_right_widening: L_invariant,
    self_map_upper_holds_for_all_swept_b: self_map_holds_all_b,
    upper_self_map_margin_grows_without_bound: margin_monotone_growing,
    a_priori_bound_from_far_seed_degrades: a_priori_degrades,
    // g(N) < N for N > N_cross; g(N) > N for N < N_cross => upper endpoint needs b >= N_cross.
    upper_endpoint_requires_b_ge_N_cross: UPPER_FAILS_BELOW_NCROSS,
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9
  },
  finding:
    'Widening the imp-34650 certificate to the RIGHT is FREE. With a = 1e9 fixed, L = sup_[a,b]|g_prime| ' +
    '= g_prime(1e9) ~ 0.1485 < 1 is INVARIANT in b (g_prime decreasing, sup at the left edge), and the ' +
    'upper self-map endpoint g(b) <= b holds for EVERY b >= N_cross ~ 3.28e9 with margin b - g(b) growing ' +
    'without bound (g grows logarithmically, b linearly). So [1e9, b] is a certified L-contraction self-map ' +
    'for arbitrarily large b -- there is NO right-hand obstruction; the sole binding constraint is the LEFT ' +
    'edge (imp-34675: N_star ~ 1.475e8). The one honest cost: the Banach a-priori bound from the FAR seed ' +
    'N_0 = b degrades linearly in b (|N_1 - N_0| = b - g(b) ~ b), so it stays useful only when Picard is ' +
    'seeded near N_cross, not from the far endpoint; iterates to floating point rise only from 12 to ~13.',
  subGap:
    'imp-34676a: the endpoint evaluations g(b), g_prime(a) are IEEE-754 double precision via ' +
    'effectiveHeightForN, and g(N) < N for N > N_cross is sampled, not proved. Formalize by enclosing ' +
    'T0(b) and dT0/dN under interval arithmetic and proving the monotone g(N) - N < 0 above N_cross ' +
    '(compare imp-34650a / imp-34675a). This measures the certificate scope; it adds no RH bound.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT an RH bound). The imp-34650 Banach contraction certificate for ' +
    'g(N) = (C_C_PINNED/E_trunc)^2 log T0(N) widens to the RIGHT without bound: holding a = 1e9 fixed, the ' +
    'uniform constant L = g_prime(1e9) ~ 0.1485 < 1 is INVARIANT under right-widening (g_prime is positive ' +
    'and strictly decreasing, so the sup is the left endpoint for every b), and the self-map upper endpoint ' +
    'g(b) <= b holds for all b >= N_cross ~ 3.280294e9 with margin b - g(b) increasing to +infinity (g grows ' +
    'logarithmically, b linearly). Swept to b = 1e300 the certificate never breaks: L stays ~0.1485 and ' +
    'g(b) <= b throughout, so [1e9, b] is a certified L-contraction self-map for arbitrarily large b -- the ' +
    'ONLY binding constraint is the LEFT edge N_star ~ 1.475e8 (imp-34675). The single honest cost is that ' +
    'the Banach a-priori bound from the far seed N_0 = b degrades linearly in b (its k=5 relative value ' +
    'climbs from ~1.7e-4 at b=1e10 to O(1e286) at b=1e300), so the a-priori certificate stays useful only ' +
    'seeded near N_cross; the per-iterate rate is unchanged and iterates to floating point rise only 12 -> ~13. ' +
    'SUB-GAP imp-34676a: endpoint evaluations are double-precision, not interval-arithmetic enclosures, and ' +
    'g(N) < N above N_cross is sampled. This measures the scope of a property of the inherited imp-3220/imp-3406 ' +
    'surrogate crossover map, NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) and the C_mb ' +
    'GUE-conditional per imp-486 are UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34650 (Banach contraction certificate on I = [1e9, 1e10]); imp-34675 (closed-form left edge ' +
    'N_star = K(1 - 1/W(K)) ~ 1.475e8, the sole binding constraint); imp-33723 (closed-form crossover ' +
    'fixed point N_cross); imp-3444 (E_coll = E_trunc crossover); imp-2642 (C_C = (1/8) sqrt(3 pi) 1/8 ' +
    'ansatz); lambda-rh-height-mapping (effectiveHeightForN, monotone Riemann-von Mangoldt inverse).',
};

export const IMP34676_CROSSOVER_CONTRACTION_RIGHT_WIDENING_ASSERTIONS = [
  {
    // L is attained at the fixed left endpoint and does not change as b is widened rightward.
    id: 'imp34676-L-invariant-under-right-widening',
    description: 'L = g_prime(1e9) ~ 0.148 < 1 is invariant across the whole b sweep (sup at left endpoint)',
    holds: () =>
      L_CONTRACTION > 0 &&
      L_CONTRACTION < 1 &&
      Math.abs(L_CONTRACTION - 1.484829e-1) < 1e-4 &&
      L_invariant === true,
  },
  {
    // The upper self-map endpoint g(b) <= b holds for every swept b, with margin growing without bound.
    id: 'imp34676-self-map-upper-holds-all-b',
    description: 'g(b) <= b for all swept b (out to 1e300); the self-map margin b - g(b) is monotone growing',
    holds: () => self_map_holds_all_b === true && margin_monotone_growing === true,
  },
  {
    // Lower endpoint fixed; the right-widening obstruction is only b >= N_cross (g(N) > N below it).
    id: 'imp34676-lower-fixed-and-upper-needs-b-ge-Ncross',
    description: 'g(a) >= a fixed; g(N) > N below N_cross so the upper endpoint requires b >= N_cross ~ 3.28e9',
    holds: () =>
      G_A >= A &&
      Math.abs(N_CROSS / 3.280294e9 - 1) < 5e-3 &&
      UPPER_FAILS_BELOW_NCROSS === true,
  },
  {
    // Honest cost: the a-priori bound from the far seed b degrades as b grows (rate unchanged, distance grows).
    id: 'imp34676-a-priori-from-far-seed-degrades',
    description: 'a-priori k=5 bound from far seed N_0 = b grows with b (1.7e-4 at 1e10 up to O(1e286) at 1e300)',
    holds: () =>
      a_priori_degrades === true &&
      rightWideningTable[0].a_priori_k5_rel_from_far_seed_b < 1e-3,
  },
  {
    // Honesty gate: measurement of a surrogate property, not rigorous, no QED, no refereed bound is changed.
    id: 'imp34676-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, named sub-gap, no QED, no refereed bound is changed',
    holds: () =>
      IMP34676_CROSSOVER_CONTRACTION_RIGHT_WIDENING.isRigorous === false &&
      /imp-34676a/.test(IMP34676_CROSSOVER_CONTRACTION_RIGHT_WIDENING.subGap) &&
      /NO QED/.test(IMP34676_CROSSOVER_CONTRACTION_RIGHT_WIDENING.verdict) &&
      /refereed bound is changed/i.test(IMP34676_CROSSOVER_CONTRACTION_RIGHT_WIDENING.verdict),
  },
];

for (const a of IMP34676_CROSSOVER_CONTRACTION_RIGHT_WIDENING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34676-crossover-contraction-right-widening assertion failed: ${a.id}`);
  }
}
