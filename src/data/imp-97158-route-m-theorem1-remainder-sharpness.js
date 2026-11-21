/**
 * @module imp-97158-route-m-theorem1-remainder-sharpness
 *
 * imp-97158 (numerical, MEASUREMENT -- no bound moves): measure how SHARP the imp-97133 Theorem-1
 * explicit remainder constant is against the actual L0 coprime-sum remainder, and separately the
 * Theorem-2 constant against the L1 remainder.
 *
 * imp-97133 proved (elementary, triangle bound over the squarefree divisors of b):
 *     Theorem 1:  L0(b) = phi(b)(log b - 1) + E0(b),          |E0(b)| <= 2^omega(b) (log b + 2),
 *     Theorem 2:  L1(b) = phi(b) b((1/2)log b - 1/4) + E1(b), |E1(b)| <= 2^omega(b) b (log b + 2),
 * where L0(b) = Sum_{a in R_b} log a, L1(b) = Sum_{a in R_b} a log a, R_b = {a: 1<=a<b, (a,b)=1},
 * and omega(b) = number of distinct primes of b. imp-97133 PROVED the constant but never MEASURED its
 * tightness -- that is the residual this ticket fills. We compute the actual E0(b), E1(b) and the
 * saturation ratios
 *     r0(b) = |E0(b)| / (2^omega(b)(log b + 2)),   r1(b) = |E1(b)| / (2^omega(b) b (log b + 2)),
 * across a dense b-sweep and per b-class (primes, prime powers, primorials).
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 (E0: which class saturates, and the asymptotic sharpness limit).
 * -------------------------------------------------------------------------------
 * The E0 bound is saturated by the PRIMES and NOWHERE else. Over the dense sweep b in [2,5000] the
 * maximum ratio is r0 = 0.198605 at b = 4999 (the largest prime in range); r0 rises MONOTONICALLY
 * along the primes (r0(101)=0.1684, r0(1009)=0.1894, r0(9973)=0.2018, r0(99991)=0.2100,
 * r0(999983)=0.2158) and never reaches a constant on any finite range -- it CREEPS toward a limit.
 * For a prime b only the divisor d=1 survives the Moebius sum, so (imp-97133 sanity line)
 *     E0(prime b) = -1 + (1/2) log(2 pi (b-1)) + O(1/b)  ~  (1/2) log b - 0.0810,
 * while the bound is 2(log b + 2). Hence
 *     r0(prime b)  ->  ( (1/2) log b ) / ( 2 log b )  =  1/4   as b -> infinity,
 * approached from below (0.216 at b~10^6). So the named constant 2^omega(b)(log b + 2) is TIGHT UP TO
 * A CONSTANT FACTOR OF EXACTLY 4 on its tightest (prime) class: the honest overhead of the triangle
 * method on primes is asymptotically the single factor 4 (the "+2" and "2 pi" pieces account for the
 * remaining margin at finite b, e.g. factor ~5.0 at b=4999).
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 (E0: prime powers and primorials undershoot by ORDERS -- mu-cancellation).
 * -------------------------------------------------------------------------------
 * Prime POWERS (omega=1, same bound 2(log b + 2) as a prime) do NOT saturate: r0 DECAYS with the
 * exponent (2^k: r0 = 0.0481, 0.0412, ..., 0.0168 for b=4..4096; 3^k, 5^k similarly), because the
 * d=p divisor (mu(p)=-1) cancels the leading (1/2)log b that a bare prime carries. PRIMORIALS undershoot
 * far more: r0 = 0.0570, 0.00171, 4.72e-4, 1.46e-4, 4.97e-5, 1.80e-5 for b = 2,6,30,210,2310,30030 --
 * a genuine mu-sign cancellation over the 2^omega squarefree divisors that the triangle bound throws
 * away. This CONFIRMS the imp-97133 sub-gap diagnosis (bound is 2^omega-modulus-dependent, not tight
 * for smooth b; a uniform O(1/b) is plausible from this cancellation but not delivered by the method).
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 (E1: the Theorem-2 constant is much LOOSER -- it saturates nowhere).
 * -------------------------------------------------------------------------------
 * The E1 bound is roughly a factor ~40 loose even at its worst: over b in [2,5000] the maximum ratio
 * is r1 = 0.024240 at b = 7 (a small prime), and r1 DECAYS for primes (r1(7)=0.0242, r1(101)=0.0184,
 * r1(1009)=0.0140, r1(9973)=0.0111, r1(99991)=0.00925). The extra factor of b in the Theorem-2 bound
 * over-counts the L1 remainder (which is only ~b times a log-sized quantity with the SAME cancellation
 * structure as E0), so r1 -> 0 on every class. E1 is therefore the loose bound; E0 is the binding one.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (measurement only; nothing moves).
 * -------------------------------------------------------------------------------
 * The imp-97133 Theorem-1 constant 2^omega(b)(log b + 2) is sharp only along the PRIMES, where it holds
 * with an asymptotic saturation ratio of EXACTLY 1/4 (finite factor-4 overhead, ~5.0 at b~5000). It is
 * orders too large on prime powers and primorials (mu-cancellation the triangle bound discards). The
 * Theorem-2 constant is uniformly looser (~40x, ratio -> 0 everywhere). No bound on Lambda moves; the
 * exact leading coefficient kappa_arith and the o(1) remainder are unchanged; no refereed bound is changed;
 * RH open; NO QED.
 *
 * @see imp-97133-route-m-arith-first-moment-explicit-remainder.js (the two theorems whose sharpness this measures)
 * @see imp-97122-route-m-arith-first-moment-convergence-rate.js (measured O(log b / b) rate, L0 dominates)
 * @see imp-97159-route-m-arith-first-moment-positivity-crossover.js (eps(b) < kappa_arith crossover)
 *
 * Ticket: imp-97158 (numerical, opus-4-8, api-pool). Measurement filling the imp-97133 tightness residual; NO QED.
 */

// -- self-contained exact O(b) kernel (matches imp-97133) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
function omega(b) {
  let n = b, c = 0;
  for (let p = 2; p * p <= n; p++) {
    if (n % p === 0) { c += 1; while (n % p === 0) n /= p; }
  }
  if (n > 1) c += 1;
  return c;
}
function measure(b) {
  let phi = 0, L0 = 0, L1 = 0;
  for (let a = 1; a < b; a++) {
    if (gcd(a, b) === 1) { phi += 1; const la = Math.log(a); L0 += la; L1 += a * la; }
  }
  const E0 = L0 - phi * (Math.log(b) - 1);
  const E1 = L1 - phi * b * (0.5 * Math.log(b) - 0.25);
  return { phi, L0, L1, E0, E1 };
}
// Named Theorem-1 / Theorem-2 constants (imp-97133).
const E0Bound = (b) => Math.pow(2, omega(b)) * (Math.log(b) + 2);
const E1Bound = (b) => Math.pow(2, omega(b)) * b * (Math.log(b) + 2);
// Saturation ratios.
const r0 = (b) => Math.abs(measure(b).E0) / E0Bound(b);
const r1 = (b) => Math.abs(measure(b).E1) / E1Bound(b);

export const IMP97158_MEASURE = Object.freeze({ omega, measure, E0Bound, E1Bound, r0, r1 });

// -- measured saturation ratios (baked; reproduced by the assertions on a light ladder) --
export const IMP97158_RATIOS = Object.freeze({
  // Dense sweep b in [2,5000]: overall maxima.
  denseRange: [2, 5000],
  maxR0: 0.198605,       // |E0|/bound, at the largest prime in range
  maxR0AtB: 4999,        // prime, omega=1
  maxR1: 0.024240,       // |E1|/bound, at a small prime
  maxR1AtB: 7,           // prime, omega=1
  meanR0: 0.026633,      // mean r0 over the dense range (pulled down by composite b)
  // Primes: r0 rises monotonically toward 1/4; r1 decays.
  primes: [
    { b: 101, r0: 0.168351, r1: 0.018422 },
    { b: 1009, r0: 0.189385, r1: 0.013973 },
    { b: 9973, r0: 0.201772, r1: 0.011149 },
    { b: 99991, r0: 0.209999, r1: 0.009250 },
    { b: 999983, r0: 0.215823, r1: null },
  ],
  primeAsymptoticR0Limit: 0.25, // r0(prime b) -> ( (1/2)log b ) / ( 2 log b ) = 1/4, from below
  // Prime powers (omega=1): r0 DECAYS with the exponent (mu(p) cancellation of the leading (1/2)log b).
  primePowers: [
    { b: 4, r0: 0.048139 }, { b: 64, r0: 0.028030 }, { b: 4096, r0: 0.016794 },
    { b: 9, r0: 0.063242 }, { b: 729, r0: 0.031954 },
    { b: 25, r0: 0.075822 }, { b: 3125, r0: 0.040042 },
  ],
  // Primorials: r0 undershoots by ORDERS (genuine mu-sign cancellation over 2^omega divisors).
  primorials: [
    { b: 2, omega: 1, r0: 0.05696919 },
    { b: 6, omega: 2, r0: 0.00170890 },
    { b: 30, omega: 3, r0: 0.00047170 },
    { b: 210, omega: 4, r0: 0.00014644 },
    { b: 2310, omega: 5, r0: 0.00004965 },
    { b: 30030, omega: 6, r0: 0.00001796 },
  ],
});

export const IMP97158_VERDICT = Object.freeze({
  question:
    'measure the sharpness of the imp-97133 Theorem-1 constant |E0(b)| <= 2^omega(b)(log b+2) against ' +
    'the actual L0 remainder across b (dense sweep + primes/prime-powers/primorials); also report E1 sharpness',
  e0SaturatedBy: 'primes',                 // the ONLY class that approaches the bound
  e0AsymptoticSaturationRatio: 0.25,        // r0(prime b) -> 1/4 (constant factor-4 overhead of the triangle method)
  e0FiniteFactorAt5000: 5.03,               // 1/maxR0 ~ 1/0.1986: named constant beats |E0| by ~5x at b~5000
  e0DecaysOnSmoothB: true,                  // prime powers decay with exponent; primorials undershoot by orders
  e1SaturatesNowhere: true,                 // extra b factor over-counts; r1 -> 0 on every class
  e1MaxRatio: 0.024240,                     // ~40x loose even at its worst (b=7)
  bindingBound: 'E0',                       // E1 is the loose one
  ratioApproachesConstant: '1/4 on primes (from below), 0 on all other classes',
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'The imp-97133 Theorem-1 constant 2^omega(b)(log b+2) is sharp only along the PRIMES, with asymptotic ' +
    'saturation ratio EXACTLY 1/4 (a finite factor-4 overhead of the triangle method; ~5.0 at b~5000). It is ' +
    'orders too large on prime powers (r0 decays with the exponent) and primorials (r0 ~ 1.8e-5 at b=30030) -- ' +
    'the mu-sign cancellation the triangle bound discards, confirming the imp-97133 uniform-O(1/b) sub-gap. ' +
    'The Theorem-2 constant is uniformly ~40x looser (r1 -> 0 on every class, max 0.0242 at b=7), so E0 is the ' +
    'binding remainder. Measurement only; no bound on Lambda moves; kappa_arith and the o(1) remainder unchanged; ' +
    'no refereed bound is changed; RH open; NO QED.',
});

export const IMP97158_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement filling the imp-97133 tightness residual: the ' +
  'Theorem-1 constant 2^omega(b)(log b+2) is sharp only on PRIMES (saturation ratio -> 1/4, factor-4 overhead), ' +
  'orders too large on prime powers and primorials (mu-cancellation the triangle bound discards); the Theorem-2 ' +
  'constant is ~40x looser (ratio -> 0 everywhere). No bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97158_ASSERTIONS = [
  {
    id: 'imp97158-e0-bound-holds-and-primes-are-tightest',
    holds: () => {
      // The named constant HOLDS everywhere on the ladder, and among a prime / prime-power / primorial
      // of comparable size the PRIME has the largest ratio (it is the saturating class).
      for (const b of [4999, 4096, 2310]) if (!(Math.abs(measure(b).E0) <= E0Bound(b))) return false;
      return r0(4999) > r0(4096) && r0(4096) > r0(2310);
    },
    why: 'the Theorem-1 constant holds and among comparable-size b the prime 4999 (r0~0.199) beats the prime power 4096 (r0~0.017) beats the primorial 2310 (r0~5e-5): primes are the saturating class.',
  },
  {
    id: 'imp97158-e0-prime-ratio-rises-toward-quarter',
    holds: () => {
      // r0 rises monotonically along the primes toward 1/4, always staying below it.
      const a = r0(101), b = r0(1009), c = r0(9973), d = r0(99991);
      return a < b && b < c && c < d && d < 0.25 && d > 0.20;
    },
    why: 'r0(prime) climbs 0.168 -> 0.189 -> 0.202 -> 0.210 across b=101..99991, monotone and below 1/4 = the analytic limit ((1/2)log b)/(2 log b).',
  },
  {
    id: 'imp97158-e0-primorials-undershoot-by-orders',
    holds: () => {
      // Primorial ratios collapse with omega: r0(30030) is >1000x smaller than r0(2) -- mu-cancellation.
      return r0(30030) < 1e-4 && r0(2) / r0(30030) > 1000 && r0(210) < r0(30) && r0(30) < r0(6);
    },
    why: 'r0 along the primorials falls 0.057 (b=2) -> 1.8e-5 (b=30030), a >1000x collapse driven by mu-sign cancellation over the 2^omega squarefree divisors (imp-97133 sub-gap signature).',
  },
  {
    id: 'imp97158-e1-bound-looser-and-decays',
    holds: () => {
      // The E1 bound holds with a much larger margin (>40x) and its ratio DECAYS on primes.
      if (!(Math.abs(measure(4999).E1) <= E1Bound(4999))) return false;
      return r1(7) < 0.025 && r1(9973) < r1(101) && r1(101) < r1(7) && r1(9973) < 0.02;
    },
    why: 'the Theorem-2 constant is ~40x loose at worst (r1(7)=0.0242) and decays on primes (r1(101)=0.0184 > r1(9973)=0.0111): the extra b factor over-counts, so E0 is the binding remainder.',
  },
  {
    id: 'imp97158-baked-ratios-match-live-kernel',
    holds: () => {
      // The baked literals reproduce the live kernel to their stored precision.
      const near = (x, y, t) => Math.abs(x - y) <= t;
      return (
        near(r0(4999), IMP97158_RATIOS.maxR0, 5e-6) &&
        near(r1(7), IMP97158_RATIOS.maxR1, 5e-6) &&
        near(r0(9973), 0.201772, 5e-6) &&
        near(r0(210), 0.00014644, 5e-7)
      );
    },
    why: 'the baked saturation ratios (maxR0=0.198605 at b=4999, maxR1=0.024240 at b=7, r0(9973)=0.2018, r0(210)=1.46e-4) reproduce the live O(b) kernel to stored precision.',
  },
  {
    id: 'imp97158-honesty-gate-no-qed',
    holds: () =>
      IMP97158_VERDICT.anyBoundMoved === false &&
      IMP97158_VERDICT.postsRigorousCeiling === false &&
      IMP97158_VERDICT.qed === false &&
      IMP97158_VERDICT.e0SaturatedBy === 'primes' &&
      IMP97158_VERDICT.e0AsymptoticSaturationRatio === 0.25 &&
      IMP97158_VERDICT.bindingBound === 'E0' &&
      /NO QED/.test(IMP97158_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97158_HONEST_BANNER) &&
      /RH open/.test(IMP97158_HONEST_BANNER),
    why: 'measurement only -- reports the Theorem-1 constant is sharp only on primes (ratio -> 1/4) and loose elsewhere, moving no bound, posting no ceiling, claiming no QED.',
  },
];

for (const a of IMP97158_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97158-route-m-theorem1-remainder-sharpness assertion failed: ${a.id}`,
    );
  }
}

export default {
  ratios: IMP97158_RATIOS,
  measure: IMP97158_MEASURE,
  verdict: IMP97158_VERDICT,
  banner: IMP97158_HONEST_BANNER,
};
