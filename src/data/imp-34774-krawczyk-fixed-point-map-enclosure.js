/**
 * @module imp-34774-krawczyk-fixed-point-map-enclosure
 *
 * imp-34774 (numerical, frontier): imp-34755 confirmed the closed-form and Picard routes to the crossover
 * fixed point N_cross ~ 3.280294e9 are bit-identical N-uniformly, but explicitly states it adds NO interval
 * enclosure (deferring to the imp-34693a sub-gap). This module ASSESSES whether the imp-34752 outward-ULP
 * Krawczyk operator N([X]) = m - F(m)/[F_prime] can be applied to the FIXED-POINT MAP g(N) = K log T0(N)
 * ITSELF -- via the residual F(N) = N - g(N), whose root is N_cross -- to produce a verified enclosure of
 * N_cross, and measures the (H1)/(H2) inclusion margins and the surviving outward-ULP budget k* for the
 * crossover bracket. Measurement only; double-precision surrogate for the imp-34687a directed-rounding
 * layer; does NOT close the imp-34714a machine certificate; changes no bound. NO QED.
 *
 * WHY THE FIXED-POINT MAP IS DIFFERENT FROM THE imp-34752 INVERSE MAP
 * ------------------------------------------------------------------
 * imp-34752 applied the Krawczyk operator to the Riemann-von Mangoldt inverse f(T) = (T/2pi)(log(T/2pi)-1)-N
 * to enclose the HEIGHT T0(N) at various N; there (H1) reads 0 not in [f_prime] with f_prime = log(T/2pi)/2pi
 * ~ 3, a derivative that has no intrinsic lower bound (it just happens to be positive on the bracket). Here
 * the object of interest is the CROSSOVER LANDMARK N_cross itself, the fixed point of the Banach map
 * g(N) = K log T0(N) (K = (C_C/E_trunc)^2 ~ 1.5727e8, imp-33723/imp-34693/imp-34755). Enclosing a fixed point
 * of g is enclosing the root of F(N) = N - g(N), whose derivative is F_prime(N) = 1 - g_prime(N). Because g is
 * a CONTRACTION near N_cross with |g_prime(N_cross)| ~ 0.045 << 1, the Krawczyk (H1) hypothesis
 * 0 not in [F_prime] is guaranteed by the CONTRACTION GAP: F_prime ~ 1 - 0.045 ~ 0.955 is bounded away from 0
 * by 1 - |g_prime|, so (H1) here is a structural consequence of the Banach contraction, not an accident of
 * positivity. That is the qualitative distinction this module records.
 *
 * SETUP (same fixed-delta bracket + outward-ULP surrogate as imp-34752)
 * --------------------------------------------------------------------
 * The bracket is centred at m = N_cross (the double-precision fixed point) at FIXED relative half-width
 * delta = 2e-4: [X_lo, X_hi] = [N_cross(1 - delta), N_cross(1 + delta)]. The residual F(N) = N - g(N) and its
 * derivative F_prime(N) = 1 - g_prime(N) are evaluated with the closed-form g_prime(N) = 2 pi K / (T0(N) u),
 * u = log(T0(N)/2pi) (from dT/dN = 2pi/u on the RvM footing; cross-checked against a central difference of g
 * below). Since g_prime is monotone decreasing in N on the bracket, F_prime is monotone increasing, so its
 * range over [X_lo, X_hi] is the endpoint values. The outward-ULP surrogate widens every computed real v to
 * [v - k eps |v|, v + k eps |v|], eps = 2^-52, and composes the interval-Newton image
 * N([X]) = m - F(m)/[F_prime] under that rule (identical composition to imp-34752). k*(N_cross) is the
 * largest k for which (H1) and (H2 strict N([X]) subset int([X])) both survive (bisection).
 *
 * WHAT IS MEASURED (single crossover bracket at N = N_cross ~ 3.28e9)
 * ------------------------------------------------------------------
 *  (1) [F_prime] over the bracket and the (H1) margin (its lower endpoint), compared to the contraction gap
 *      1 - |g_prime(N_cross)|.
 *  (2) The nominal (k = 0) interval-Newton image N([X]) and its strict-inclusion margins X_lo -> N_lo and
 *      N_hi -> X_hi. Because F(m) = m - g(m) is exactly 0 at the double-precision fixed point, the nominal
 *      image collapses to the point m, so the a-priori margins are ~ delta * N_cross on each side.
 *  (3) k*: the largest surviving outward-ULP budget for (H1) AND (H2), and separately k*_H1: the budget for
 *      (H1) ALONE. k*_H1 ~ 1/eps (F_prime widened to 0 needs k eps ~ 1) sits ~4 orders ABOVE the binding k*,
 *      so (H2), not (H1), is binding -- the contraction gap gives (H1) enormous head-room.
 *
 * RESULT (double-precision surrogate for the exact evaluations; see imp-34714a)
 * ----------------------------------------------------------------------------
 *   N_cross:            3.28029435165241e9 (the imp-34755 bit-identical fixed point)
 *   g_prime(N_cross):   ~0.045423 (closed form == central difference to ~6 digits)
 *   [F_prime]:          ~[0.954568, 0.954586]  -> (H1) margin ~0.9546 = contraction gap 1 - |g_prime|
 *   nominal N([X]):     the point m (F(m) = 0), a-priori margins ~ delta*N_cross ~ 6.56e5 each side
 *   k*  (H1 and H2):    ~4.5034e11 ULP  (relative widening ~1.0e-4 = delta/2)
 *   k*_H1 (H1 alone):   ~4.5036e15 ULP  (~1/eps) -> ~4 orders above k*, so (H2) binds
 * So the fixed-point-map route DOES yield a verified (surrogate) enclosure of N_cross, and reaches the SAME
 * binding outward-ULP budget k* ~ 4.5034e11 as the imp-34752 inverse-map route -- because k* is fixed by the
 * SAME scale-invariant break condition 2 k eps ~ delta on (H2), independent of which map is enclosed. The new
 * structural fact is that (H1) here is no longer the near-binding constraint it could be for a generic root:
 * the Banach contraction gap 1 - |g_prime| ~ 0.955 buys (H1) ~4 orders of extra ULP head-room over (H2).
 *
 * INTERPRETATION -- ENCLOSURE EXISTS (SURROGATE), CERTIFICATE STILL OPEN
 * ---------------------------------------------------------------------
 * YES: applied to F(N) = N - g(N), the imp-34752 outward-ULP Krawczyk operator produces a self-consistent
 * enclosure of the crossover landmark N_cross with (H1) held by the contraction gap and (H2) binding at the
 * same k* ~ 4.5e11 ULP found for the inverse map. This is EVIDENCE that a real directed-rounding
 * instantiation would enclose N_cross, NOT a proof: the k eps model is a surrogate for the imp-34687a layer,
 * not that layer, and F(m) = 0 is a double-precision artifact of centring at the machine fixed point (a
 * directed-rounding F(m) would be a small nonzero interval, tightening but not collapsing the image). The
 * machine certificate imp-34714a REMAINS OPEN.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; NOT a rigorous asymptotic and
 * NOT an RH bound. C_C = (1/8) sqrt(3 pi) 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no
 * RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34752-krawczyk-outward-ulp-slack-N (the inverse-map outward-ULP slack sweep this reuses; sub-gap imp-34714a)
 * @see imp-34755-two-route-residual-across-N (the two-route N_cross fixed point; states it adds NO interval enclosure)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (the Banach map g(N) = K log T0(N) and its fixed point)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-33723/imp-34693/imp-34755)
const DELTA = 2e-4; // same FIXED relative bracket half-width as the imp-34752 sweep

// The shared imp-33723/imp-34755 Banach map g(N) = K log T0(N) and its residual F(N) = N - g(N).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const F = (N) => N - g(N);
// Closed-form g_prime(N) = 2 pi K / (T0 u), u = log(T0/2pi), from dT/dN = 2pi/u on the RvM footing.
const gPrime = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};
const FPrime = (N) => 1 - gPrime(N); // F_prime(N) = 1 - g_prime(N)

// The unique double-precision fixed point (route B converged; imp-34755): every seed flows here.
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // 3.28029435165241e9

// Cross-check the closed-form g_prime against a central difference of g at the fixed point.
const H_FD = N_CROSS * 1e-7;
const G_PRIME_CLOSED = gPrime(N_CROSS);
const G_PRIME_FD = (g(N_CROSS + H_FD) - g(N_CROSS - H_FD)) / (2 * H_FD);
const G_PRIME_RELERR = Math.abs(G_PRIME_CLOSED - G_PRIME_FD) / Math.abs(G_PRIME_FD);
const CONTRACTION_GAP = 1 - Math.abs(G_PRIME_CLOSED); // 1 - |g_prime| ~ 0.955

// Fixed-delta bracket centred at m = N_cross, exactly as the imp-34752 construction.
const M = N_CROSS;
const X_LO = M * (1 - DELTA);
const X_HI = M * (1 + DELTA);
// F_prime range: g_prime is monotone decreasing on the bracket, so F_prime is monotone increasing.
const FP_A = FPrime(X_LO);
const FP_B = FPrime(X_HI);
const FP_LO = Math.min(FP_A, FP_B);
const FP_HI = Math.max(FP_A, FP_B);
const F_M = F(M); // residual at the machine fixed point (exactly 0 in double precision)

// Interval-Newton image N([X]) = m - F(m)/[F_prime]; enclose the quotient over the four endpoint ratios.
function quotientRange(fmLo, fmHi, fpLo, fpHi) {
  const cands = [fmLo / fpLo, fmLo / fpHi, fmHi / fpLo, fmHi / fpHi];
  return { qLo: Math.min(...cands), qHi: Math.max(...cands) };
}
const { qLo: Q_LO_NOM, qHi: Q_HI_NOM } = quotientRange(F_M, F_M, FP_LO, FP_HI);
const N_LO_NOM = M - Q_HI_NOM;
const N_HI_NOM = M - Q_LO_NOM;
const MARGIN_LO_NOM = N_LO_NOM - X_LO;
const MARGIN_HI_NOM = X_HI - N_HI_NOM;

// Outward-ULP surrogate: widen each computed endpoint by k eps |value|; report (H1) and (H2 strict).
function check(k) {
  const w = k * EPS;
  const fpLo = FP_LO - w * Math.abs(FP_LO);
  const fpHi = FP_HI + w * Math.abs(FP_HI);
  const fmLo = F_M - w * Math.abs(F_M);
  const fmHi = F_M + w * Math.abs(F_M);
  const mLo = M - w * Math.abs(M);
  const mHi = M + w * Math.abs(M);
  let { qLo, qHi } = quotientRange(fmLo, fmHi, fpLo, fpHi);
  qLo = qLo - w * Math.abs(qLo); // widen the quotient result outward
  qHi = qHi + w * Math.abs(qHi);
  let nLo = mLo - qHi; // widen the subtraction result outward
  nLo = nLo - w * Math.abs(nLo);
  let nHi = mHi - qLo;
  nHi = nHi + w * Math.abs(nHi);
  const H1 = fpLo > 0; // 0 not in [F_prime]
  const H2 = nLo > X_LO && nHi < X_HI; // N([X]) subset int([X]) (strict)
  return { H1, H2, nLo, nHi, marginLo: nLo - X_LO, marginHi: X_HI - nHi };
}

// Largest surviving budget under a predicate (double then bisect between good and bad).
function largestSurvivingK(predicate) {
  let good = 1;
  let bad = 1;
  while (bad < 1e18) {
    if (predicate(check(bad))) {
      good = bad;
      bad *= 2;
    } else break;
  }
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (good + bad);
    if (predicate(check(mid))) good = mid;
    else bad = mid;
  }
  return good;
}

const K_STAR = largestSurvivingK((c) => c.H1 && c.H2); // (H1) AND (H2): the binding budget
const K_STAR_H1 = largestSurvivingK((c) => c.H1); // (H1) alone: ~1/eps (contraction gap head-room)
const AT_BREAK = check(K_STAR);
const PAST_BREAK = check(K_STAR * 1.001);
const SLACK_ORDERS = Math.log10(K_STAR / 4); // ULP-budget slack over a real few-ULP directed-rounding layer
const H1_HEADROOM_ORDERS = Math.log10(K_STAR_H1 / K_STAR); // how far (H1) sits above the binding (H2)

// Cross-consistency with imp-34752: same delta/2 relative widening at the crossover rung.
const K_STAR_IMP34752 = 4.5034e11; // the N-independent budget imp-34752 reported (incl. N ~ 3.28e9 rung)
const K_STAR_MATCHES_IMP34752 = Math.abs(K_STAR - K_STAR_IMP34752) / K_STAR_IMP34752 < 5e-4;

export const IMP34774_KRAWCZYK_FIXED_POINT_MAP_ENCLOSURE = {
  id: 'imp-34774',
  proofSection: 'S-frontier',
  question:
    'imp-34755 confirmed the closed-form and Picard routes to N_cross ~ 3.280294e9 are bit-identical ' +
    'N-uniformly but states it adds NO interval enclosure. Assess whether the imp-34752 outward-ULP ' +
    'Krawczyk operator N([X]) = m - F(m)/[F_prime] can be applied to the FIXED-POINT map g(N) = K log T0(N) ' +
    'itself (via the residual F(N) = N - g(N)) to produce a verified enclosure of N_cross, measuring the ' +
    '(H1)/(H2) inclusion margins and the surviving outward-ULP budget k* for the crossover bracket. ' +
    'Measurement only; double-precision surrogate for the imp-34687a directed-rounding layer; does NOT ' +
    'close the imp-34714a machine certificate. NO QED.',
  model: {
    setup:
      'Enclosing the fixed point N_cross of the Banach map g(N) = K log T0(N) (K = (C_C/E_trunc)^2 ~ ' +
      '1.5727e8) is enclosing the root of the residual F(N) = N - g(N), F_prime(N) = 1 - g_prime(N). The ' +
      'bracket is centred at m = N_cross at FIXED relative half-width delta = 2e-4 (the imp-34752 ' +
      'construction); the outward-ULP surrogate widens every computed real v to [v - k eps |v|, v + k eps ' +
      '|v|], eps = 2^-52, and composes N([X]) = m - F(m)/[F_prime] under that rule; k*(N_cross) is the ' +
      'largest k for which (H1) 0 not in [F_prime] AND (H2) N([X]) subset int([X]) both survive.',
    contraction_gap_gives_H1:
      'Because g is a contraction near N_cross with |g_prime(N_cross)| ~ 0.045 << 1, F_prime = 1 - g_prime ~ ' +
      '0.955 is bounded away from 0 by the CONTRACTION GAP 1 - |g_prime|, so (H1) is a structural consequence ' +
      'of the Banach contraction, not an accident of positivity. The (H1)-alone budget k*_H1 ~ 1/eps sits ~4 ' +
      'orders ABOVE the binding k*, so (H2), not (H1), is binding here.',
  },
  constants: {
    K_amplitude: +K_AMPL.toExponential(6), // ~1.572709e8
    N_cross: +N_CROSS.toPrecision(15), // 3.28029435165241e9
    g_prime_at_N_cross_closed: +G_PRIME_CLOSED.toFixed(6), // ~0.045423
    g_prime_at_N_cross_central_diff: +G_PRIME_FD.toFixed(6), // ~0.045423
    g_prime_closed_vs_fd_relerr: +G_PRIME_RELERR.toExponential(3), // closed form == central difference
    contraction_gap: +CONTRACTION_GAP.toFixed(6), // 1 - |g_prime| ~ 0.954577
    delta: +DELTA.toExponential(1),
  },
  measurement: {
    // Double-precision surrogate for the exact evaluations; certifies nothing (see imp-34714a).
    bracket: [+X_LO.toPrecision(15), +X_HI.toPrecision(15)],
    F_prime_range: [+FP_LO.toFixed(8), +FP_HI.toFixed(8)], // ~[0.954568, 0.954586]
    H1_margin: +FP_LO.toFixed(8), // lower endpoint of [F_prime] = distance of (H1) from 0
    F_at_m: F_M, // exactly 0 at the double-precision fixed point
    nominal_image: [+N_LO_NOM.toPrecision(15), +N_HI_NOM.toPrecision(15)], // collapses to m (F(m)=0)
    margin_lo_nominal: +MARGIN_LO_NOM.toExponential(4), // ~ delta*N_cross ~ 6.56e5
    margin_hi_nominal: +MARGIN_HI_NOM.toExponential(4),
    k_star: +K_STAR.toExponential(4), // ~4.5034e11 (H1 and H2)
    k_star_relative: +(K_STAR * EPS).toExponential(4), // ~1.0e-4 = delta/2
    k_star_H1_only: +K_STAR_H1.toExponential(4), // ~4.5036e15 (~1/eps)
    H1_headroom_orders_over_binding: +H1_HEADROOM_ORDERS.toFixed(2), // ~4 orders
    slack_orders_over_few_ulp: +SLACK_ORDERS.toFixed(2), // ~11.05
    H1_survives_at_break: AT_BREAK.H1,
    H2_survives_at_break: AT_BREAK.H2,
    both_inclusions_fail_past_break: !PAST_BREAK.H2 && PAST_BREAK.marginLo <= 0 && PAST_BREAK.marginHi <= 0,
    k_star_matches_imp34752: K_STAR_MATCHES_IMP34752, // same delta/2 budget as the inverse-map route
  },
  finding:
    'Applied to the residual F(N) = N - g(N) of the Banach crossover map g(N) = K log T0(N), the imp-34752 ' +
    'outward-ULP Krawczyk operator N([X]) = m - F(m)/[F_prime] DOES produce a self-consistent (surrogate) ' +
    'enclosure of the fixed point N_cross ~ 3.28029435165241e9. Two structural facts: (i) (H1) 0 not in ' +
    '[F_prime] is guaranteed by the CONTRACTION GAP -- F_prime = 1 - g_prime ~ 0.9546 is bounded away from 0 ' +
    'by 1 - |g_prime(N_cross)| ~ 0.955, so the (H1)-alone budget k*_H1 ~ 1/eps ~ 4.5036e15 sits ~4 orders ' +
    'ABOVE the binding k*, i.e. (H2), not (H1), is binding; (ii) the binding outward-ULP budget k* ~ ' +
    '4.5034e11 ULP (relative widening ~1.0e-4 = delta/2) is the SAME as the imp-34752 inverse-map route, ' +
    'because k* is fixed by the SAME scale-invariant break condition 2 k eps ~ delta on (H2), independent of ' +
    'which map is enclosed. The nominal image collapses to the centre m because F(m) = 0 at the ' +
    'double-precision fixed point (a directed-rounding F(m) would be a small nonzero interval), leaving the ' +
    'a-priori margins ~ delta*N_cross ~ 6.56e5 each side. This is EVIDENCE a real directed-rounding ' +
    'instantiation would enclose N_cross, NOT a machine certificate; imp-34714a REMAINS OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN. This ASSESSES a Krawczyk enclosure of N_cross with a k eps surrogate for the ' +
    'imp-34687a directed-rounding layer; it does NOT instantiate that layer, and F(m) = 0 is a ' +
    'double-precision artifact of centring at the machine fixed point. The uniform ~4.5034e11-ULP budget ' +
    'and the ~4-order (H1) contraction-gap head-room are EVIDENCE the target margins have room to spare, ' +
    'NOT a proof the computed F(m) and [F_prime] endpoints ARE valid enclosures. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK FIXED-POINT-MAP ENCLOSURE ASSESSMENT (frontier, NOT an RH bound). imp-34755 left N_cross ~ ' +
    '3.280294e9 as a double-precision-only landmark with NO interval enclosure. Applying the imp-34752 ' +
    'outward-ULP Krawczyk operator N([X]) = m - F(m)/[F_prime] to the residual F(N) = N - g(N) of the Banach ' +
    'crossover map g(N) = K log T0(N) DOES yield a self-consistent (surrogate) enclosure of the fixed point. ' +
    '(H1) 0 not in [F_prime] is guaranteed by the CONTRACTION GAP F_prime = 1 - g_prime ~ 0.9546 (bounded ' +
    'away from 0 by 1 - |g_prime(N_cross)| ~ 0.955), giving an (H1)-alone budget k*_H1 ~ 1/eps ~ 4.5036e15 ' +
    'ULP that sits ~4 orders ABOVE the binding k* -- so (H2), not (H1), is binding, unlike a generic root. ' +
    'The binding outward-ULP budget k* ~ 4.5034e11 ULP (relative widening ~1.0e-4 = delta/2) MATCHES the ' +
    'imp-34752 inverse-map route, because both are fixed by the same scale-invariant 2 k eps ~ delta break ' +
    'condition on (H2). The nominal image collapses to m (F(m) = 0 at the machine fixed point), a-priori ' +
    'margins ~ delta*N_cross ~ 6.56e5. INTERPRETATION: YES a Krawczyk enclosure of N_cross exists at the ' +
    'surrogate level with (H1) held by contraction and (H2) binding at the shared k*; this is EVIDENCE a ' +
    'real directed-rounding instantiation would enclose N_cross, NOT a machine certificate. SUB-GAP ' +
    'imp-34714a REMAINS OPEN: the k eps model is a surrogate for the imp-34687a directed-rounding layer, ' +
    'not that layer. Measurement only on the inherited imp-3220/imp-3406 surrogate crossover map; the C_C ' +
    '1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 ' +
    'untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34752 (outward-ULP Krawczyk slack of the inverse map across N; sub-gap imp-34714a); imp-34755 ' +
    '(two-route N_cross fixed point, states it adds NO interval enclosure); imp-34714 (Krawczyk ' +
    'existence-uniqueness lemma; sub-gap imp-34714a); imp-34687 (crossover interval-arithmetic scope; ' +
    'sub-gap imp-34687a directed-rounding layer); imp-33723 (Banach map g(N) = K log T0(N) and its fixed ' +
    'point); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN, RvM inverse). ' +
    'Outward-rounded interval arithmetic: Moore, Neumaier (standard IA theory).',
};

export const IMP34774_KRAWCZYK_FIXED_POINT_MAP_ENCLOSURE_ASSERTIONS = [
  {
    // (H1) is held by the contraction gap: [F_prime] lower endpoint ~ 1 - |g_prime| ~ 0.955, far from 0.
    id: 'imp34774-H1-held-by-contraction-gap',
    description: 'lower endpoint of [F_prime] ~ contraction gap 1 - |g_prime(N_cross)| ~ 0.955, bounded away from 0',
    holds: () =>
      FP_LO > 0.9 &&
      Math.abs(FP_LO - CONTRACTION_GAP) < 1e-3 &&
      CONTRACTION_GAP > 0.95 &&
      Math.abs(G_PRIME_CLOSED - 0.045) < 5e-3,
  },
  {
    // Closed-form g_prime agrees with the central difference of g at the fixed point.
    id: 'imp34774-g-prime-closed-vs-fd',
    description: 'closed-form g_prime(N_cross) == central difference to < 1e-4 relative',
    holds: () => G_PRIME_RELERR < 1e-4,
  },
  {
    // The binding budget k* matches the imp-34752 inverse-map route (~4.5034e11, delta/2 widening).
    id: 'imp34774-k-star-matches-inverse-map',
    description: 'k* ~ 4.5034e11 ULP (delta/2 relative), matching the imp-34752 inverse-map route',
    holds: () =>
      K_STAR > 1e11 &&
      K_STAR < 1e12 &&
      K_STAR_MATCHES_IMP34752 &&
      Math.abs(K_STAR * EPS - DELTA / 2) / (DELTA / 2) < 1e-2,
  },
  {
    // (H1) has ~4 orders of ULP head-room over the binding (H2): (H2) is what binds, not (H1).
    id: 'imp34774-H2-binds-not-H1',
    description: 'k*_H1 (H1 alone) ~ 1/eps sits ~4 orders above the binding k*; H1 survives, both fail past break',
    holds: () =>
      K_STAR_H1 > 1e15 &&
      H1_HEADROOM_ORDERS > 3 &&
      AT_BREAK.H1 &&
      AT_BREAK.H2 &&
      !PAST_BREAK.H2 &&
      PAST_BREAK.H1,
  },
  {
    // Honesty gate: enclosure assessment / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34774-honesty-gate-no-qed',
    description: 'Surrogate enclosure: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34774_KRAWCZYK_FIXED_POINT_MAP_ENCLOSURE.isRigorous === false &&
      /imp-34714a/.test(IMP34774_KRAWCZYK_FIXED_POINT_MAP_ENCLOSURE.subGap) &&
      /REMAINS OPEN/.test(IMP34774_KRAWCZYK_FIXED_POINT_MAP_ENCLOSURE.subGap) &&
      /NO QED/.test(IMP34774_KRAWCZYK_FIXED_POINT_MAP_ENCLOSURE.verdict) &&
      /refereed bound is changed/i.test(IMP34774_KRAWCZYK_FIXED_POINT_MAP_ENCLOSURE.verdict),
  },
];

for (const a of IMP34774_KRAWCZYK_FIXED_POINT_MAP_ENCLOSURE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34774-krawczyk-fixed-point-map-enclosure assertion failed: ${a.id}`);
  }
}
