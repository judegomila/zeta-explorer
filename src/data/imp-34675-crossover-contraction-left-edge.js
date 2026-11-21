/**
 * @module imp-34675-crossover-contraction-left-edge
 *
 * imp-34675 (proof, frontier-direction): imp-34650 certified the imp-33723 crossover map
 * g(N) = K log T0(N) as a Banach L-contraction ONLY on the deep-tail interval I = [1e9, 1e10],
 * where L = g_prime(1e9) ~ 0.1485 < 1, and noted that g_prime(1e8) ~ 1.4727 > 1 so the map is
 * NOT a contraction at small N. imp-34650 named g_prime > 1 at 1e8 but never located the exact
 * left edge of the contraction region -- the boundary N_star where g_prime(N_star) = 1. This
 * module derives that boundary IN CLOSED FORM.
 *
 * THE BOUNDARY EQUATION
 * ---------------------
 *   g_prime(N) = K * 2pi / (T0 * log(T0 / 2pi)) = 1,      K = (C_C_PINNED / E_trunc)^2 ~ 1.5727e8,
 * with T0 = effectiveHeightForN(N) the Riemann-von Mangoldt inverse height. Setting g_prime = 1:
 *
 *   T0 * log(T0 / 2pi) = 2pi K.
 *
 * CLOSED FORM VIA LAMBERT W
 * -------------------------
 * Substitute u = T0 / 2pi (so T0 = 2pi u). Then T0 log(T0/2pi) = 2pi u log u, and the boundary
 * equation becomes
 *
 *   u log u = K.
 *
 * Writing u = e^w gives w e^w = K, i.e. w = W(K) (principal branch of the Lambert W function).
 * Hence log u = W(K) and u = e^{W(K)} = K / W(K), so the boundary height is CLOSED FORM
 *
 *   T0_star = 2pi K / W(K).
 *
 * The corresponding zero count follows from the SAME Riemann-von Mangoldt asymptotic that defines
 * effectiveHeightForN, N(T) = (T/2pi)(log(T/2pi) - 1) = u(log u - 1):
 *
 *   N_star = u (log u - 1) = (K / W(K)) (W(K) - 1) = K (1 - 1 / W(K)).
 *
 * This is exact for the asymptotic: g_prime(N_star) = K 2pi / (T0_star log(T0_star/2pi))
 *                                                    = K 2pi / (2pi u * W(K)) = K / (u W(K)) = 1,
 * since u W(K) = (K/W(K)) W(K) = K. (Verified below to machine precision through the imp-34650
 * effectiveHeightForN machinery, both directly and via the round trip effectiveHeightForN(N_star)
 * = T0_star.)
 *
 * NUMBERS
 * -------
 *   K = 1.572709e8,  W(K) = 16.094973,  T0_star = 6.139569e7,  N_star = 1.474994e8.
 * So the contraction region begins at N_star ~ 1.475e8, a factor of N_cross / N_star ~ 22.24 BELOW
 * the fixed point N_cross ~ 3.280294e9 (imp-33723/imp-34650). This sharpens the honest scope of the
 * imp-34650 certificate: g is a contraction (g_prime < 1) for ALL N > N_star ~ 1.475e8, so the
 * chosen certificate left edge a = 1e9 was conservative -- the true left edge of the contraction
 * region lies a further ~6.8x to the left, well below a. (g_prime(1e8) > 1 and g_prime(1e9) < 1
 * straddle N_star, consistent with the 1e8 < N_star < 1e9 bracket.)
 *
 * WHAT THIS IS AND IS NOT (sub-gap)
 * ---------------------------------
 * This is a closed-form location of the g_prime = 1 boundary of the INHERITED imp-3220/imp-3406
 * surrogate crossover map, evaluated in IEEE-754 double precision (Lambert W by Halley iteration,
 * effectiveHeightForN by Newton inversion). It SHARPENS the description of the imp-34650 contraction
 * region; it does NOT widen the imp-34650 certificate itself (which still requires the self-map
 * g(I) subset I to be re-verified on any widened interval -- see imp-34676). NAMED SUB-GAP
 * imp-34675a: the boundary N_star is a double-precision root of the RvM asymptotic; a formal edge
 * would enclose W(K) and T0_star = 2pi K / W(K) under interval arithmetic (compare imp-34650a).
 *
 * DERIVATION ONLY. This locates a boundary of a property of the inherited surrogate crossover, NOT
 * a rigorous asymptotic and NOT an RH bound. C_C = (1/8) sqrt(3 pi) 1/8 ansatz (imp-2642/imp-2643)
 * UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no
 * bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34650-crossover-banach-contraction-certificate (the L-contraction certificate on I = [1e9, 1e10] whose left edge this locates)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (states N_cross as the fixed point of g)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse, monotone increasing)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (same K as imp-34650)

// The imp-34650 analytic derivative of the imp-33723 fixed-point map g(N) = K log T0(N).
const gPrime = (N) => {
  const T0 = effectiveHeightForN(N);
  return (K_AMPL * TWO_PI) / (T0 * Math.log(T0 / TWO_PI)); // K*(dT0/dN)/T0
};

// Principal-branch Lambert W by Halley iteration (converges quadratically-plus for W(K), K ~ 1.6e8).
function lambertW(x) {
  // Asymptotic seed w ~ ln x - ln ln x (valid for large x, here x = K ~ 1.6e8).
  let w = Math.log(x) - Math.log(Math.log(x));
  for (let i = 0; i < 60; i++) {
    const ew = Math.exp(w);
    const f = w * ew - x;
    const w1 = w + 1;
    const dw = f / (ew * w1 - ((w + 2) * f) / (2 * w1)); // Halley step
    w -= dw;
    if (Math.abs(dw) < 1e-15 * Math.max(1, Math.abs(w))) break;
  }
  return w;
}

// Closed-form left edge of the contraction region: g_prime(N_star) = 1.
const W_K = lambertW(K_AMPL); // ~16.094973
const T0_STAR = (TWO_PI * K_AMPL) / W_K; // ~6.139569e7
const N_STAR = K_AMPL * (1 - 1 / W_K); // ~1.474994e8  (= (K/W)(W-1))

// Verify the closed form through the imp-34650 machinery (double-precision certificate).
const GP_AT_NSTAR = gPrime(N_STAR); // ~1 (machine precision)
const T0_ROUNDTRIP = effectiveHeightForN(N_STAR); // ~T0_STAR (RvM inverse round trip)
const N_CROSS = 3.280294e9; // imp-33723/imp-34650 fixed point
const N_CROSS_OVER_N_STAR = N_CROSS / N_STAR; // ~22.24

// Straddle sanity: g_prime crosses 1 between 1e8 and 1e9 (imp-34650 named these two samples).
const GP_1E8 = gPrime(1e8); // ~1.4727 > 1
const GP_1E9 = gPrime(1e9); // ~0.1485 < 1

export const IMP34675_CROSSOVER_CONTRACTION_LEFT_EDGE = {
  id: 'imp-34675',
  proofSection: 'S-frontier',
  question:
    'imp-34650 certified g(N) = K log T0(N) an L-contraction on I = [1e9, 1e10] and noted ' +
    'g_prime(1e8) ~ 1.47 > 1 (contraction fails at small N) but never located the boundary. Derive ' +
    'in CLOSED FORM the left edge N_star where g_prime(N_star) = 1 -- the exact start of the ' +
    'contraction region -- using the Riemann-von Mangoldt inverse height, and report where N_star ' +
    'sits relative to N_cross ~ 3.28e9. Derivation only; certifies a property of the inherited ' +
    'surrogate crossover, NOT an RH bound; no QED.',
  boundaryEquation: 'g_prime(N) = K*2pi/(T0 log(T0/2pi)) = 1  <=>  T0 log(T0/2pi) = 2pi K  <=>  u log u = K, u = T0/2pi',
  closedForm: {
    // u log u = K  =>  log u = W(K), u = K/W(K)  =>  T0_star = 2pi K / W(K), N_star = K(1 - 1/W(K)).
    K: +K_AMPL.toExponential(6), // ~1.572709e8
    lambert_W_of_K: +W_K.toExponential(6), // ~1.609497e1
    T0_star: +T0_STAR.toExponential(6), // ~6.139569e7
    N_star: +N_STAR.toExponential(6), // ~1.474994e8
    N_star_formula: 'N_star = K (1 - 1/W(K)) = (K/W(K))(W(K) - 1)',
  },
  verification: {
    g_prime_at_N_star: +GP_AT_NSTAR.toExponential(6), // ~1.000000 (machine precision)
    g_prime_at_N_star_err: +Math.abs(GP_AT_NSTAR - 1).toExponential(3), // ~0
    roundtrip_T0_rel_err: +Math.abs(T0_ROUNDTRIP / T0_STAR - 1).toExponential(3), // ~0 (RvM inverse)
    g_prime_1e8: +GP_1E8.toExponential(6), // ~1.472732 > 1  (below N_star)
    g_prime_1e9: +GP_1E9.toExponential(6), // ~1.484829e-1 < 1 (above N_star)
    straddles_1e8_1e9: 1e8 < N_STAR && N_STAR < 1e9,
  },
  location: {
    // Where the boundary sits relative to the fixed point and the imp-34650 certificate left edge.
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9
    N_cross_over_N_star: +N_CROSS_OVER_N_STAR.toFixed(4), // ~22.2394
    imp34650_left_edge_a: 1e9,
    a_over_N_star: +(1e9 / N_STAR).toFixed(4), // ~6.7797 (a is ~6.8x above the true edge)
    finding:
      'The contraction region g_prime < 1 begins at N_star ~ 1.475e8, a factor ~22.24 below the ' +
      'fixed point N_cross ~ 3.28e9 and ~6.78x below the imp-34650 certificate left edge a = 1e9. ' +
      'So a = 1e9 was a conservative choice: g is already a contraction for all N > N_star, though ' +
      'widening the certificate leftward still requires re-verifying the self-map (see imp-34676).',
  },
  subGap:
    'imp-34675a: N_star is a double-precision root of the Riemann-von Mangoldt asymptotic (Lambert W ' +
    'by Halley, effectiveHeightForN by Newton), so this is a numerically located boundary, NOT an ' +
    'interval-arithmetic enclosure. Formalize by enclosing W(K) and T0_star = 2pi K/W(K) rigorously ' +
    '(compare imp-34650a). This locates the contraction edge; it does not by itself widen the ' +
    'imp-34650 certificate (self-map re-verification needed, imp-34676).',
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT an RH bound). The left edge of the imp-34650 contraction ' +
    'region -- the boundary where the imp-33723 map derivative g_prime(N) = K*2pi/(T0 log(T0/2pi)) ' +
    'equals 1 -- is CLOSED FORM: with u = T0/2pi the condition is u log u = K, so log u = W(K) ' +
    '(Lambert W), giving T0_star = 2pi K/W(K) and N_star = K(1 - 1/W(K)) ~ 1.474994e8. Verified to ' +
    'machine precision through the imp-34650 effectiveHeightForN machinery (g_prime(N_star) = 1 and ' +
    'the RvM round trip effectiveHeightForN(N_star) = T0_star). N_star sits a factor ~22.24 below ' +
    'the fixed point N_cross ~ 3.280294e9 and ~6.78x below the imp-34650 certificate left edge ' +
    'a = 1e9, so g contracts for all N > N_star ~ 1.475e8 (the a = 1e9 edge was conservative). ' +
    'SUB-GAP imp-34675a: N_star is double-precision, not an interval-arithmetic enclosure; and ' +
    'locating the edge does not itself widen the certificate (self-map re-verification needed, ' +
    'imp-34676). This locates a boundary of a property of the inherited imp-3220/imp-3406 surrogate ' +
    'crossover map, NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) and the C_mb ' +
    'GUE-conditional per imp-486 are UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34650 (Banach contraction certificate on I = [1e9, 1e10], names g_prime(1e8) > 1); ' +
    'imp-33723 (closed-form crossover fixed point N_cross, pointwise |g_prime| ~ 0.045); imp-3444 ' +
    '(E_coll = E_trunc crossover); imp-2642 (C_C = (1/8) sqrt(3 pi) 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN, monotone Riemann-von Mangoldt inverse).',
};

export const IMP34675_CROSSOVER_CONTRACTION_LEFT_EDGE_ASSERTIONS = [
  {
    // Closed form satisfies the boundary condition g_prime(N_star) = 1 through the imp-34650 machinery.
    id: 'imp34675-boundary-condition-g-prime-equals-1',
    description: 'g_prime(N_star) = 1 to machine precision (closed form N_star = K(1 - 1/W(K)))',
    holds: () => Number.isFinite(N_STAR) && N_STAR > 0 && Math.abs(GP_AT_NSTAR - 1) < 1e-9,
  },
  {
    // Lambert W solves w e^w = K; the derived T0_star, N_star are internally consistent.
    id: 'imp34675-lambert-w-and-closed-form-consistent',
    description: 'W(K) e^{W(K)} = K, T0_star = 2pi K/W(K), N_star = K(1 - 1/W(K)) round-trips through the RvM inverse',
    holds: () =>
      Math.abs(W_K * Math.exp(W_K) - K_AMPL) < 1e-3 * K_AMPL &&
      Math.abs(T0_STAR - (TWO_PI * K_AMPL) / W_K) < 1e-6 * T0_STAR &&
      Math.abs(T0_ROUNDTRIP / T0_STAR - 1) < 1e-6,
  },
  {
    // The boundary straddles the two imp-34650 samples: g_prime > 1 below, g_prime < 1 above.
    id: 'imp34675-boundary-straddles-1e8-1e9',
    description: 'g_prime(1e8) > 1 > g_prime(1e9) and 1e8 < N_star < 1e9',
    holds: () => GP_1E8 > 1 && GP_1E9 < 1 && 1e8 < N_STAR && N_STAR < 1e9,
  },
  {
    // Location relative to the fixed point: N_star well below N_cross and below the imp-34650 edge a = 1e9.
    id: 'imp34675-N-star-below-N-cross-and-edge',
    description: 'N_star ~ 1.475e8 is ~22.24x below N_cross ~ 3.28e9 and ~6.78x below a = 1e9',
    holds: () =>
      Math.abs(N_STAR / 1.474994e8 - 1) < 5e-3 &&
      N_STAR < 1e9 &&
      N_CROSS_OVER_N_STAR > 20 &&
      N_CROSS_OVER_N_STAR < 25,
  },
  {
    // Honesty gate: derivation of a surrogate boundary, not rigorous, no QED, no refereed bound is changed.
    id: 'imp34675-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, named sub-gap, no QED, no refereed bound is changed',
    holds: () =>
      IMP34675_CROSSOVER_CONTRACTION_LEFT_EDGE.isRigorous === false &&
      /imp-34675a/.test(IMP34675_CROSSOVER_CONTRACTION_LEFT_EDGE.subGap) &&
      /NO QED/.test(IMP34675_CROSSOVER_CONTRACTION_LEFT_EDGE.verdict) &&
      /refereed bound is changed/i.test(IMP34675_CROSSOVER_CONTRACTION_LEFT_EDGE.verdict),
  },
];

for (const a of IMP34675_CROSSOVER_CONTRACTION_LEFT_EDGE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34675-crossover-contraction-left-edge assertion failed: ${a.id}`);
  }
}
