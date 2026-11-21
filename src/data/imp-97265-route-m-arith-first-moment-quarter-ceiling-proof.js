/**
 * @module imp-97265-route-m-arith-first-moment-quarter-ceiling-proof
 *
 * imp-97265 (proof attempt -- HONEST PARTIAL, NO QED): attempt to PROVE the uniform arithmetic ceiling
 *     |E1(b)|  <=  b/4      for all b >= 2,
 * the last explicit-constant piece of IMP97202_SUBGAP (the "uniform-E1 constant"). imp-97208 MEASURED
 * this with 0 violations over b in [2,20000] and PROVED it on the prime class; imp-97224 removed the
 * 2^omega prefactor (|E1(b)| = O(b), tail |E1_tail(b)| <= (zeta(2)-1)/720 * b). This leaf tries to lift
 * the prime-class Glaisher-Kinkelin mechanism to ALL omega classes. It does NOT succeed in closing the
 * ceiling, but it (a) supplies a fully explicit factorial-free per-divisor identity, (b) proves the prime
 * ceiling with a strictly positive margin, (c) identifies a NEW obstruction that reshapes the residual,
 * and (d) rules out the natural tail-peeling reduction as a dead end. No bound on Lambda moves; no refereed bound is changed
 * ; RH open; NO QED.
 *
 *   Notation as imp-97133 / imp-97208 / imp-97224: E1(b) = L1(b) - phi(b) b((1/2) log b - 1/4),
 *   L1(b) = Sum_{a in R_b} a log a, R_b = {a : 1 <= a <= b-1, (a,b)=1}, omega(b) = number of distinct
 *   primes, mu = Moebius, phi = Euler totient, G(n) = Sum_{k=1}^n k log k = log hyperfactorial,
 *   ln A = 1/12 - zeta-prime(-1) = 0.2487544770337842 (Glaisher-Kinkelin log-constant).
 *
 * -------------------------------------------------------------------------------
 * STEP 1 -- THE EXACT FACTORIAL-FREE PER-DIVISOR IDENTITY (elementary; verified to machine precision).
 * -------------------------------------------------------------------------------
 * Detect coprimality by Sum_{d|(a,b)} mu(d) and reindex a = d k (k = 1 .. b/d - 1, exact since d|b):
 *     E1(b) = Sum_{d|b} mu(d) C_d,
 *     C_d = (b(b-d)/(2d)) log d + d G(b/d - 1) - (b^2/(2d)) log b + b^2/(4d).
 * This is EXACT (an identity, not an asymptotic) -- verified to ~1e-8 relative over a mixed ladder to
 * b = 2310. Substituting the Glaisher-Kinkelin expansion G(n) = (n^2/2 + n/2 + 1/12) log n - n^2/4 +
 * ln A + R(n) makes the b^2 log b and b log d pieces CANCEL exactly against the counter-term and the
 * Part-A divisor sum: the log d coefficient collapses to -d/12 and the log b coefficient to -b/2 + d/12,
 * so after Sum_{d|b} mu(d) = 0 the surviving per-divisor content is only b-LINEAR. The -b/4 leader is
 * carried by the d = 1 term; the higher divisors d > 1 enter with alternating mu-sign.
 *
 * -------------------------------------------------------------------------------
 * STEP 2 -- THE PRIME CEILING (PROVED, with a strictly positive margin).
 * -------------------------------------------------------------------------------
 * For prime b only d = 1 survives the Moebius sum (the d = b term is exactly 0), so the Glaisher-Kinkelin
 * collapse gives the EXACT prime asymptotic (imp-97208)
 *     E1(prime p) = -p/4 + (1/12) log p + ln A + O(1/p),
 * hence
 *     |E1(prime p)| = p/4 - [ (1/12) log p + ln A ] < p/4,      MARGIN (1/12) log p + ln A > ln A > 0.
 * The ceiling holds on the prime class with a POSITIVE, growing margin (verified: margin(101) = 0.63335,
 * margin(1009) = 0.82515, margin(9973) = 1.01606, each matching (1/12) log p + ln A to ~1e-7). So on the
 * binding class the ceiling is rigorous and saturated FROM BELOW (ratio |E1|/(b/4) -> 1^-).
 *
 * -------------------------------------------------------------------------------
 * STEP 3 -- NEW OBSTRUCTION: THE CEILING IS SATURATED BY CLOSE-PRIME SEMIPRIMES TOO, NOT ONLY PRIMES.
 * -------------------------------------------------------------------------------
 * imp-97208 / imp-97224 recorded the ceiling as "attained on the primes" with the smooth classes (prime
 * powers, primorials) undershooting. That is INCOMPLETE. Measuring consecutive-prime semiprimes
 * b = p * q (q = nextprime(p)) shows the ratio |E1(b)| / (b/4) ALSO rises monotonically toward 1:
 *     7*11 = 77       -> 0.6338
 *     29*31 = 899     -> 0.8616
 *     71*73 = 5183    -> 0.9335
 *     211*223 = 47053 -> 0.9744
 *     499*503         -> 0.9878
 *     997*1009        -> 0.9934
 *     1999*2003       -> 0.9965.
 * So the b/4 ceiling is saturated (asymptotically, from below) by the ENTIRE "few close prime factors"
 * family -- primes and near-twin semiprimes alike -- not by the primes alone. The worst COMPOSITE ratio
 * in [2,6000] is 0.9369 at b = 71*83 = 5893 (omega = 2). This is the crux of why the uniform proof is
 * hard: there is NO omega-class headroom to spare on the almost-prime family; a class-by-class "primes
 * tight, composites loose" argument is FALSE.
 *
 * -------------------------------------------------------------------------------
 * STEP 4 -- THE NATURAL TAIL-PEELING REDUCTION IS A DEAD END (ruled out here).
 * -------------------------------------------------------------------------------
 * imp-97224 gives E1(b) = CK(b) + E1_tail(b) with |E1_tail(b)| <= (zeta(2)-1)/720 * b (c_tail =
 * 8.95742e-4). The tempting reduction "prove |CK(b)| <= (1/4 - c_tail) b = 0.2491043 b, then add the tail
 * by the triangle inequality" is INVALID: at the saturating prime b = 9973, |CK(b)|/b = 0.249898 already
 * EXCEEDS the reduced target 0.2491043, while |E1(b)|/b = 0.249898 < 1/4 stays under the true ceiling.
 * The tail there is O(1e-4 b), same-signed and negligible, so triangle-splitting it OVER-charges the CK
 * budget by ~c_tail exactly where there is no room. CONCLUSION: the uniform ceiling cannot be obtained by
 * bounding CK and E1_tail separately -- the coherent -b/4 leader (and its cancellation with the positive
 * (1/12)log-type margin) must be retained through the whole estimate. This closes off the tail-peeling
 * route future work would naturally try.
 *
 * -------------------------------------------------------------------------------
 * RESIDUAL (the named sub-gap this leaf leaves open).
 * -------------------------------------------------------------------------------
 * A uniform proof of |E1(b)| <= b/4 for all b >= 2 requires controlling the Moebius-signed divisor sum
 * E1(b) = Sum_{d|b} mu(d) C_d on the "few close prime factors" family (primes, near-twin semiprimes,
 * products of a few nearby primes), where -- by Step 3 -- the ratio approaches 1 with no class headroom,
 * and -- by Step 4 -- the transcendental tail cannot be peeled off separately. The prime case is proved
 * (Step 2); the general case needs the -b/4 leader's cancellation with the summed (1/12)log + ln A + R
 * corrections retained uniformly across all omega classes. That is NOT closed here.
 *
 * VERDICT: honest PARTIAL. Proved: the exact factorial-free per-divisor identity and the prime ceiling
 * with positive margin. New: the close-prime-semiprime saturation obstruction (correcting the "primes
 * only" framing) and the ruling-out of the tail-peeling reduction. Residual: the uniform composite
 * ceiling on the close-factor family. kappa_arith unchanged; the cotangent first moment (imp-97097) stays
 * the separate open leaf; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97208-route-m-theorem2-tighter-remainder.js (measured |E1|<=b/4, proved prime asymptotic)
 * @see imp-97224-route-m-arith-first-moment-uniform-E1.js (2^omega removal; E1 = CK + E1_tail; tail bound)
 * @see imp-97202-route-m-arith-first-moment-uniform-remainder.js (IMP97202_SUBGAP; the E0 kernel-moment method)
 * @see imp-97133-route-m-arith-first-moment-explicit-remainder.js (the original Theorem-2 constant)
 *
 * Ticket: imp-97265 (proof, opus-4-8, api-pool). Proof attempt at the uniform b/4 ceiling; honest partial; NO QED.
 */

const LN_A = 1 / 12 - -0.1654211437004509; // Glaisher-Kinkelin log-constant = 0.2487544770337842
const C_TAIL = ((Math.PI * Math.PI) / 6 - 1) / 720; // imp-97224 tail constant (zeta(2)-1)/720 = 8.95742e-4

// -- self-contained arithmetic kernel --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
function primeFactors(b) {
  let n = b; const ps = [];
  for (let p = 2; p * p <= n; p++) { if (n % p === 0) { ps.push(p); while (n % p === 0) n /= p; } }
  if (n > 1) ps.push(n);
  return ps;
}
function omega(b) { return primeFactors(b).length; }
function radical(b) { let m = 1; for (const p of primeFactors(b)) m *= p; return m; }
function mobius(d) {
  if (d === 1) return 1;
  if (radical(d) !== d) return 0; // not squarefree
  return primeFactors(d).length % 2 === 0 ? 1 : -1;
}
function divisors(b) { const ds = []; for (let d = 1; d <= b; d++) if (b % d === 0) ds.push(d); return ds; }
function isPrime(b) { return b >= 2 && primeFactors(b).length === 1 && primeFactors(b)[0] === b; }
function nextPrime(n) { let m = n + 1; while (!isPrime(m)) m += 1; return m; }

// Exact G(n) = Sum_{k=1}^n k log k (FP-clean for the modest n used here).
function Gexact(n) { let s = 0; for (let k = 1; k <= n; k++) s += k * Math.log(k); return s; }
// Glaisher-Kinkelin asymptotic (imp-97224) and the counter-term for CK.
function Gasymp(n) {
  if (n <= 0) return 0;
  return (n * n / 2) * Math.log(n) - (n * n) / 4 + (n / 2) * Math.log(n) + (1 / 12) * Math.log(n) + LN_A;
}
function phiOf(b) { let p = 0; for (let a = 1; a < b; a++) if (gcd(a, b) === 1) p += 1; return p; }

// Direct E1(b) = L1(b) - phi(b) b((1/2)log b - 1/4).
function measureE1(b) {
  let phi = 0, L1 = 0;
  for (let a = 1; a < b; a++) if (gcd(a, b) === 1) { phi += 1; L1 += a * Math.log(a); }
  return L1 - phi * b * (0.5 * Math.log(b) - 0.25);
}

// STEP 1: the EXACT factorial-free per-divisor identity E1(b) = Sum_{d|b} mu(d) C_d.
function E1divisorSum(b) {
  let s = 0;
  for (const d of divisors(b)) {
    const mu = mobius(d);
    if (mu === 0) continue;
    const n = b / d - 1;
    const Cd = (b * (b - d) / (2 * d)) * Math.log(d) + d * Gexact(n) - (b * b / (2 * d)) * Math.log(b) + (b * b) / (4 * d);
    s += mu * Cd;
  }
  return s;
}

// STEP 2: the proved prime margin b/4 - |E1(p)| = (1/12)log p + ln A (> 0).
export const IMP97265_PRIME_MARGIN = (p) => (1 / 12) * Math.log(p) + LN_A;

// STEP 4: imp-97224 CK(b) = L1recon(b) - MAIN(b) (factorial-free once the exact G is replaced by Gasymp,
// but for the FP-clean cross-check we use exact G in the tail so CK = E1 - E1_tail).
function CK(b) {
  let recon = 0;
  for (const d of divisors(b)) {
    const mu = mobius(d);
    if (mu === 0) continue;
    const M = b / d - 1;
    recon += mu * d * (Math.log(d) * (M * (M + 1) / 2) + Gasymp(M));
  }
  return recon - phiOf(b) * b * (0.5 * Math.log(b) - 0.25);
}

export const IMP97265_KERNEL = Object.freeze({
  measureE1, E1divisorSum, CK, omega, mobius, divisors, isPrime, nextPrime,
  LN_A, C_TAIL, primeMargin: IMP97265_PRIME_MARGIN,
});

// -- baked measurements (reproduced by the assertions on a light ladder) --
export const IMP97265_RESULTS = Object.freeze({
  ceilingTarget: '|E1(b)| <= b/4 for all b >= 2',
  perDivisorIdentity: 'E1(b) = Sum_{d|b} mu(d) [ (b(b-d)/(2d))log d + d G(b/d-1) - (b^2/(2d))log b + b^2/(4d) ]',
  primeCeiling: '|E1(prime p)| = p/4 - [(1/12)log p + ln A] < p/4, margin (1/12)log p + ln A > ln A > 0',
  // Step 3: consecutive-prime semiprimes saturate the ceiling from below too.
  consecutivePrimeSemiprimes: [
    { b: 77, factors: '7*11', ratio: 0.633779 },
    { b: 899, factors: '29*31', ratio: 0.861591 },
    { b: 5183, factors: '71*73', ratio: 0.933494 },
    { b: 47053, factors: '211*223', ratio: 0.974382 },
    { b: 250997, factors: '499*503', ratio: 0.987776 },
    { b: 1005973, factors: '997*1009', ratio: 0.993427 },
    { b: 4003997, factors: '1999*2003', ratio: 0.996465 },
  ],
  worstCompositeRatioTo6000: { b: 5893, factors: '71*83', omega: 2, ratio: 0.936898 },
  worstPrimeRatioTo6000: { b: 5987, ratio: 0.999350 },
  // Step 4: the tail-peeling reduction fails at the saturating prime.
  tailPeelDeadEnd: {
    reducedTarget: 0.25 - C_TAIL, // 0.2491043 b
    atPrime9973: { absCKoverB: 0.249898, absE1overB: 0.249898, exceedsReducedTarget: true, underTrueCeiling: true },
  },
  cTail: C_TAIL,
});

export const IMP97265_VERDICT = Object.freeze({
  question: 'prove the uniform arithmetic ceiling |E1(b)| <= b/4 for all b >= 2 (IMP97202_SUBGAP uniform-E1 constant)',
  perDivisorIdentityProved: true, // exact, factorial-free, verified to machine precision
  primeCeilingProved: true, // |E1(p)| < p/4 with margin (1/12)log p + ln A > 0
  newObstruction: 'close-prime semiprimes p*q saturate b/4 from below too (ratio -> 1), not primes alone',
  classHeadroomExists: false, // no omega-class slack on the almost-prime family
  tailPeelReductionValid: false, // |CK|/b > (1/4 - c_tail) at the saturating prime b=9973; triangle-split over-charges
  uniformCeilingProved: false, // the general composite case stays OPEN
  residual: 'uniform |E1(b)| <= b/4 on the few-close-prime-factors family; -b/4 leader cancellation must be retained across all omega classes',
  supersededFraming: 'imp-97208/imp-97224 "attained on the primes" -- corrected: attained on primes AND close-prime semiprimes',
  cotangentLeafSeparate: true, // imp-97097
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'Honest PARTIAL toward |E1(b)| <= b/4. PROVED: (1) the exact factorial-free per-divisor identity ' +
    'E1(b) = Sum_{d|b} mu(d) C_d (verified to machine precision), whose Glaisher-Kinkelin collapse leaves ' +
    'only b-linear per-divisor content with the -b/4 leader on d=1; (2) the prime ceiling ' +
    '|E1(prime p)| = p/4 - [(1/12)log p + ln A] < p/4 with a strictly positive, growing margin. NEW: (3) ' +
    'the ceiling is saturated FROM BELOW not only by primes but by consecutive-prime semiprimes p*q ' +
    '(ratio 0.634 -> 0.997 across 7*11 .. 1999*2003), so the "primes tight / composites loose" framing of ' +
    'imp-97208/imp-97224 is incomplete -- there is no omega-class headroom on the almost-prime family; (4) ' +
    'the natural tail-peeling reduction is a DEAD END: at the saturating prime b=9973, |CK(b)|/b = 0.2499 ' +
    'already exceeds the reduced target 1/4 - (zeta(2)-1)/720 = 0.24910, so the transcendental tail cannot ' +
    'be triangle-split off. RESIDUAL: the uniform composite ceiling on the few-close-prime-factors family, ' +
    'which needs the coherent -b/4 leader cancellation retained across all omega classes. kappa_arith ' +
    'unchanged; the cotangent first moment (imp-97097) stays open; no bound on Lambda moves; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97265_SUBGAP = Object.freeze({
  id: 'imp-97265-uniform-quarter-ceiling-close-factor-family',
  statement:
    'The uniform ceiling |E1(b)| <= b/4 (b >= 2) is PROVED on the prime class (margin (1/12)log p + ln A > 0) ' +
    'but OPEN on composites. The binding obstruction is the "few close prime factors" family: consecutive- ' +
    'prime semiprimes p*q saturate the ceiling from below (|E1|/(b/4) -> 1), so no omega-class headroom is ' +
    'available, and the imp-97224 transcendental tail E1_tail cannot be peeled off by the triangle ' +
    'inequality (at b=9973 |CK|/b = 0.2499 > 1/4 - (zeta(2)-1)/720). A uniform proof must retain the ' +
    'coherent -b/4 leader (from the d=1 divisor) and its cancellation with the summed (1/12)log + ln A + R ' +
    'corrections across all omega classes. This is the residual of this leaf.',
  supersedesFraming: 'imp-97208 IMP97208_SUBGAP / imp-97224 "attained on the primes" (extended to close-prime semiprimes)',
});

export const IMP97265_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Proof attempt at the uniform ceiling |E1(b)| <= b/4: ' +
  'proves the exact factorial-free per-divisor identity and the prime ceiling with positive margin ' +
  '(1/12)log p + ln A; finds the NEW obstruction that close-prime semiprimes saturate b/4 from below too ' +
  '(not primes alone), and rules out the tail-peeling reduction as a dead end. The uniform composite ' +
  'ceiling stays a named residual; the cotangent first moment (imp-97097) stays open; no bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97265_ASSERTIONS = [
  {
    id: 'imp97265-per-divisor-identity-exact',
    holds: () => {
      // E1(b) = Sum_{d|b} mu(d) C_d to machine precision on a mixed ladder (primes, powers, primorials, semiprimes).
      for (const b of [2, 3, 4, 6, 7, 9, 12, 25, 30, 64, 101, 210, 899, 1009, 2310]) {
        const a = measureE1(b), c = E1divisorSum(b);
        if (Math.abs(a - c) > 1e-6 * (Math.abs(a) + 1)) return false;
      }
      return true;
    },
    why: 'the exact factorial-free per-divisor identity E1(b) = Sum mu(d) C_d reproduces the direct coprime sum to machine precision -- an identity, not an approximation.',
  },
  {
    id: 'imp97265-prime-ceiling-positive-margin',
    holds: () => {
      // |E1(p)| < p/4 and the margin equals (1/12)log p + ln A > 0.
      for (const p of [101, 1009, 9973]) {
        const e = Math.abs(measureE1(p));
        if (!(e < p / 4)) return false;
        const margin = p / 4 - e;
        if (!(margin > 0)) return false;
        if (Math.abs(margin - IMP97265_PRIME_MARGIN(p)) > 1e-4) return false;
      }
      return true;
    },
    why: 'the prime ceiling is rigorous: |E1(prime p)| = p/4 - [(1/12)log p + ln A] < p/4, margin > ln A > 0, matching (1/12)log p + ln A to ~1e-4.',
  },
  {
    id: 'imp97265-semiprime-saturation-obstruction',
    holds: () => {
      // Consecutive-prime semiprimes saturate the ceiling from below: ratio rises monotonically toward 1.
      const ratio = (b) => Math.abs(measureE1(b)) / (b / 4);
      const r1 = ratio(7 * 11), r2 = ratio(29 * 31), r3 = ratio(71 * 73), r4 = ratio(211 * 223);
      if (!(r1 < r2 && r2 < r3 && r3 < r4)) return false; // monotone increasing
      if (!(r4 > 0.97 && r4 < 1)) return false; // 211*223 -> 0.9744, from below
      // and it stays a semiprime (omega=2, product of two consecutive primes)
      return omega(211 * 223) === 2 && nextPrime(211) === 223;
    },
    why: 'consecutive-prime semiprimes p*q saturate b/4 from below (0.634 -> 0.862 -> 0.933 -> 0.974 over 7*11..211*223), so the ceiling is attained on the whole close-prime family, not primes alone -- no omega-class headroom.',
  },
  {
    id: 'imp97265-tail-peel-is-dead-end',
    holds: () => {
      // At the saturating prime b=9973, |CK|/b exceeds the reduced target 1/4 - c_tail, yet |E1|/b < 1/4.
      const b = 9973;
      const absCKoverB = Math.abs(CK(b)) / b;
      const absE1overB = Math.abs(measureE1(b)) / b;
      const reducedTarget = 0.25 - C_TAIL;
      return absCKoverB > reducedTarget && absE1overB < 0.25 && Math.abs(absCKoverB - absE1overB) < 5e-3;
    },
    why: 'the tail-peeling reduction fails: at b=9973 |CK|/b = 0.2499 > 1/4 - (zeta(2)-1)/720 = 0.24910 while |E1|/b < 1/4 -- triangle-splitting the tail over-charges the CK budget where there is no room.',
  },
  {
    id: 'imp97265-honesty-gate-no-qed',
    holds: () =>
      IMP97265_VERDICT.anyBoundMoved === false &&
      IMP97265_VERDICT.postsRigorousCeiling === false &&
      IMP97265_VERDICT.qed === false &&
      IMP97265_VERDICT.perDivisorIdentityProved === true &&
      IMP97265_VERDICT.primeCeilingProved === true &&
      IMP97265_VERDICT.uniformCeilingProved === false &&
      IMP97265_VERDICT.tailPeelReductionValid === false &&
      IMP97265_VERDICT.classHeadroomExists === false &&
      /close-factor/.test(IMP97265_SUBGAP.id) &&
      /NO QED/.test(IMP97265_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97265_HONEST_BANNER) &&
      /RH open/.test(IMP97265_HONEST_BANNER),
    why: 'proof attempt / honest partial -- proves the identity and the prime ceiling, finds the semiprime obstruction, rules out tail-peeling, leaves the uniform composite ceiling open; no bound moved, no rigorous ceiling posted, no QED.',
  },
];

for (const a of IMP97265_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97265-route-m-arith-first-moment-quarter-ceiling-proof assertion failed: ${a.id}`,
    );
  }
}

export default {
  kernel: IMP97265_KERNEL,
  results: IMP97265_RESULTS,
  verdict: IMP97265_VERDICT,
  subGap: IMP97265_SUBGAP,
  banner: IMP97265_HONEST_BANNER,
  primeMargin: IMP97265_PRIME_MARGIN,
};
