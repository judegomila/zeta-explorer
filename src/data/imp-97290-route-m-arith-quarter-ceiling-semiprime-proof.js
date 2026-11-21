/**
 * @module imp-97290-route-m-arith-quarter-ceiling-semiprime-proof
 *
 * imp-97290 (proof -- HONEST PARTIAL, NO QED): attempt the uniform composite ceiling
 *     |E1(b)|  <=  b/4
 * on the close-prime-factor family (near-twin semiprimes, few nearby primes), retaining the +-b/4
 * leader cancellation, per the imp-97265 residual. This leaf does NOT close the full uniform ceiling,
 * but it (a) proves a NEW exact "leader + inward-correction" decomposition that pulls the +-b/4 leader
 * out CLEANLY as mu(b) b/4 with the sign fixed by the parity (-1)^omega of the number of prime factors,
 * (b) reduces the ceiling to a sign condition + a magnitude condition on the correction, and (c) uses
 * that decomposition to PROVE the ceiling on the ENTIRE semiprime class omega(b)=2 (distinct primes) --
 * exactly the near-twin-semiprime family imp-97265 flagged as the binding obstruction. This lifts the
 * imp-97265 prime-only proof to the first composite class. No bound on Lambda moves; no refereed bound is changed
 * ; RH open; NO QED.
 *
 *   Notation as imp-97133 / imp-97208 / imp-97224 / imp-97265: E1(b) = L1(b) - phi(b) b((1/2) log b - 1/4),
 *   L1(b) = Sum_{a in R_b} a log a, R_b = {a : 1 <= a <= b-1, (a,b)=1}, omega(b) = number of distinct
 *   primes, mu = Moebius, phi = Euler totient, G(m) = Sum_{k=1}^m k log k = log hyperfactorial,
 *   ln A = 1/12 - zeta-prime(-1) = 0.2487544770337842 (Glaisher-Kinkelin log-constant).
 *
 * -------------------------------------------------------------------------------
 * STEP 1 -- THE EXACT LEADER + INWARD-CORRECTION DECOMPOSITION (elementary; verified to machine precision).
 * -------------------------------------------------------------------------------
 * Start from the imp-97265 exact per-divisor identity E1(b) = Sum_{d|b} mu(d) C_d and substitute the
 * Glaisher-Kinkelin form G(m) = (m^2/2 + m/2 + 1/12) log m - m^2/4 + ln A + R(m), with R(m) DEFINED
 * exactly as R(m) = G(m) - [(m^2/2 + m/2 + 1/12) log m - m^2/4 + ln A] (so R(m) -> 0 and R(1) = 1/4 - ln A,
 * not small). Writing m = b/d and collapsing (the b^2 log b, b log d and log m pieces cancel via
 * log(dm) = log d + log m and Sum_{d|b} mu(d) = 0) gives the compact per-divisor content
 *     C_d = -(b/2) log b + (d/12) log(b/d) + d ln A + d R(b/d).
 * The -(b/2) log b term is d-independent and dies under Sum_{d|b} mu(d) = 0. Peeling the d=b term of the
 * remainder, whose R(1) = 1/4 - ln A carries the ONLY b-scale piece, yields the exact identity
 *     E1(b) = mu(b) (b/4)  +  Delta(b),
 *     Delta(b) = Sum_{d|b, d<b} mu(d) d g(b/d),   g(m) = ln A + (1/12) log m + R(m),   g(1) = 1/4.
 * This is EXACT (verified to ~1e-8 relative over a mixed ladder to b = 30030). It is the crux advance:
 * the +-b/4 LEADER is now isolated as mu(b) b/4, so its SIGN is (-1)^omega(b) -- NEGATIVE on odd-omega
 * b (primes, p*q*r) and POSITIVE on even-omega b (semiprimes p*q). imp-97265 attributed the -b/4 to the
 * "d=1 term"; the true carrier is the d=b remainder R(1) = 1/4 - ln A, and its sign flips with parity.
 * The rest, Delta(b), is a Moebius-signed sum over PROPER divisors of the smooth, positive, increasing
 * weight g (g is O(log m); g(1) = 1/4 exactly). This explains the imp-97265 measurements at a stroke:
 * primes have E1 ~ -b/4 (mu=-1), semiprimes E1 ~ +b/4 (mu=+1), both saturating |E1|/(b/4) -> 1.
 *
 * -------------------------------------------------------------------------------
 * STEP 2 -- THE CEILING AS A SIGN + MAGNITUDE CONDITION ON THE CORRECTION.
 * -------------------------------------------------------------------------------
 * From Step 1, |E1(b)| <= b/4 is EQUIVALENT to mu(b) b/4 + Delta(b) in [-b/4, b/4], i.e.
 *   (i)  SIGN:      mu(b) Delta(b) <= 0     (the correction must point INWARD, opposite the leader), and
 *   (ii) MAGNITUDE: |Delta(b)| <= b/2.
 * (For non-squarefree b, mu(b) = 0 and the condition collapses to |Delta(b)| <= b/4.) The naive triangle
 * bound |Delta(b)| <= Sum_{d|b, d<b} d g(b/d) = g(2)(sigma(b) - b)-scale OVER-charges for many-small-prime
 * b (sigma(b)/b = prod(1 + 1/p) unbounded) -- the same over-charge imp-97265 saw at the CK level -- so the
 * Moebius sign cancellation in Delta is essential in general. But on the FEW-close-prime family the number
 * of proper divisors is small and the triangle bound is already tame; this is what makes omega = 2 tractable.
 *
 * -------------------------------------------------------------------------------
 * STEP 3 -- THE SEMIPRIME CEILING (PROVED, all omega = 2, distinct primes, near-twin family included).
 * -------------------------------------------------------------------------------
 * Let b = p q with 2 <= p < q distinct primes, so mu(b) = +1 and the proper divisors are 1, p, q with
 * mu(1) = 1, mu(p) = mu(q) = -1. Then
 *     Delta(pq) = g(pq) - p g(q) - q g(p).
 * Two elementary facts about g(m) = ln A + (1/12) log m + R(m):
 *   (A) g(m) > 0 and strictly increasing for m >= 1 (dominant (1/12) log m; R(m) > 0);
 *   (B) g(m)/m is strictly DECREASING for m >= 1, so g(m)/m <= g(2)/2 = 0.1534264... for all m >= 2.
 *       [(ln A + (1/12) log m)/m has derivative (1/12 - ln A - (1/12) log m)/m^2 < 0 for all m >= 1
 *        since 1/12 - ln A < 0; and R(m)/m > 0 is decreasing. Both decreasing => g(m)/m decreasing.
 *        Numerically confirmed max_{2<=m<=1e5} g(m)/m = g(2)/2 exactly at m = 2.]
 * SIGN (i), mu(b) Delta = Delta <= 0:  g(pq) < p g(q). Indeed p g(q) - g(pq) = (p-1) ln A +
 *     ((p-1)/12) log q - (1/12) log p + p R(q) - R(pq); with p >= 2 and q > p each group is > 0
 *     ((p-1) ln A >= ln A; ((p-1)/12) log q - (1/12) log p >= (1/12)(log q - log p) > 0; p R(q) - R(pq)
 *     > 2 R(q) - R(q) > 0 since R is positive-decreasing and pq > q). Hence Delta(pq) = g(pq) - p g(q)
 *     - q g(p) < -q g(p) < 0. SIGN holds with strict room.
 * MAGNITUDE (ii), |Delta| < b/2:  by (B), p g(q) = pq (g(q)/q) <= pq (g(2)/2) and q g(p) <= pq (g(2)/2),
 *     so p g(q) + q g(p) <= pq g(2) = 0.306853 pq. Since g(pq) > 0, |Delta(pq)| = p g(q) + q g(p) - g(pq)
 *     < pq g(2) < pq/2. MAGNITUDE holds with margin (1/2 - g(2)) pq = 0.193147 pq.
 * Combining: E1(pq) = pq/4 + Delta(pq) lies in (pq/4 - pq g(2), pq/4) = (-0.056853 pq, 0.25 pq) subset
 * (-pq/4, pq/4). THEREFORE |E1(pq)| < pq/4 for EVERY semiprime b = pq (distinct primes) -- a strict,
 * rigorous ceiling that includes the near-twin saturating family 6, 15, 77, 899, 5183, 47053, ...
 * (measured |E1|/(pq/4) -> 1 from below, with the growing absolute margin g(pq) - Delta-slack ~ sqrt(b)).
 *
 * -------------------------------------------------------------------------------
 * RESIDUAL (the named sub-gap this leaf leaves open).
 * -------------------------------------------------------------------------------
 * The uniform ceiling for omega(b) >= 3 stays OPEN. Step 2 reduces it to the SIGN condition
 * mu(b) Delta(b) <= 0 (the delicate part -- the leader's parity sign must be matched by the Moebius-signed
 * correction) plus the MAGNITUDE |Delta(b)| <= b/2, which needs the Moebius cancellation retained (the
 * triangle bound over-charges for highly-composite b, precisely where imp-97269 measured |E1|/(b/4) -> 0,
 * so triangle is loose exactly where it fails). The proved cases are now omega = 0/1 (imp-97265 prime
 * ceiling) and omega = 2 (this leaf). VERDICT: honest PARTIAL. Proved: the exact leader + inward-correction
 * decomposition and the full semiprime ceiling. Residual: omega >= 3 sign + magnitude via retained
 * Moebius cancellation. kappa_arith unchanged; the cotangent first moment (imp-97097) stays the separate
 * open leaf; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97265-route-m-arith-first-moment-quarter-ceiling-proof.js (prime ceiling; the close-factor residual this advances)
 * @see imp-97269-route-m-e1-quarter-b-class-uniformity-crosscheck.js (per-class |E1|/(b/4) tabulation)
 * @see imp-97208-route-m-theorem2-tighter-remainder.js (measured |E1|<=b/4; proved prime asymptotic)
 * @see imp-97202-route-m-arith-first-moment-uniform-remainder.js (IMP97202_SUBGAP; the uniform-E1 constant)
 *
 * Ticket: imp-97290 (proof, opus-4-8, api-pool). Semiprime ceiling proved; honest partial; NO QED.
 */

const LN_A = 0.2487544770337842; // Glaisher-Kinkelin log-constant = 1/12 - zeta-prime(-1)

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

// Exact G(m) = Sum_{k=1}^m k log k (FP-clean for the modest m used here).
function Gexact(m) { let s = 0; for (let k = 1; k <= m; k++) s += k * Math.log(k); return s; }
// Glaisher-Kinkelin main part (m=1 handled explicitly: log 1 = 0).
function GKmain(m) {
  if (m === 1) return -1 / 4 + LN_A;
  return (m * m / 2 + m / 2 + 1 / 12) * Math.log(m) - (m * m) / 4 + LN_A;
}
// Exact remainder R(m) = G(m) - GKmain(m); R(1) = 1/4 - ln A (not small), R(m) -> 0.
function Rrem(m) { return Gexact(m) - GKmain(m); }
// The inward-correction weight g(m) = ln A + (1/12) log m + R(m); g(1) = 1/4 exactly.
function gWeight(m) { return LN_A + (1 / 12) * Math.log(m) + Rrem(m); }

// Direct E1(b) = L1(b) - phi(b) b((1/2)log b - 1/4).
function measureE1(b) {
  let phi = 0, L1 = 0;
  for (let a = 1; a < b; a++) if (gcd(a, b) === 1) { phi += 1; L1 += a * Math.log(a); }
  return L1 - phi * b * (0.5 * Math.log(b) - 0.25);
}

// STEP 1: the exact leader + inward-correction decomposition E1(b) = mu(b) b/4 + Delta(b).
function Delta(b) {
  let s = 0;
  for (const d of divisors(b)) {
    if (d === b) continue;
    const mu = mobius(d);
    if (mu === 0) continue;
    s += mu * d * gWeight(b / d);
  }
  return s;
}
function E1decomp(b) { return (mobius(b) * b) / 4 + Delta(b); }

export const IMP97290_KERNEL = Object.freeze({
  measureE1, E1decomp, Delta, gWeight, omega, mobius, divisors, isPrime, nextPrime, LN_A,
});

// STEP 3: the proved semiprime magnitude constant g(2) (per-term ceiling p g(q) + q g(p) <= b g(2)).
export const IMP97290_G2 = gWeight(2); // 0.3068528194400547; g(2)/2 = 0.1534264097... = max g(m)/m on m>=2

export const IMP97290_RESULTS = Object.freeze({
  ceilingTarget: '|E1(b)| <= b/4 for all b >= 2',
  leaderDecomposition: 'E1(b) = mu(b) (b/4) + Delta(b), Delta(b) = Sum_{d|b, d<b} mu(d) d g(b/d), g(m) = ln A + (1/12)log m + R(m), g(1) = 1/4',
  leaderSign: 'the +-b/4 leader is mu(b) b/4; sign = (-1)^omega(b) (NEGATIVE on primes / odd omega, POSITIVE on semiprimes / even omega)',
  ceilingReduction: '|E1(b)| <= b/4  <=>  (i) mu(b) Delta(b) <= 0  AND  (ii) |Delta(b)| <= b/2',
  semiprimeProof: {
    statement: '|E1(pq)| < pq/4 for every semiprime b = pq (distinct primes p<q) -- PROVED',
    deltaForm: 'Delta(pq) = g(pq) - p g(q) - q g(p)',
    signPart: 'g(pq) < p g(q) => Delta(pq) < -q g(p) < 0 (matches mu(pq)=+1 inward requirement)',
    magnitudePart: '|Delta(pq)| = p g(q) + q g(p) - g(pq) < pq g(2) = 0.306853 pq < pq/2 (via g(m)/m <= g(2)/2)',
    envelope: 'E1(pq) in (-0.056853 pq, 0.25 pq) subset (-pq/4, pq/4)',
    g2: gWeight(2),
    maxGoverM: 'max_{m>=2} g(m)/m = g(2)/2 = 0.1534264097 (attained at m=2; g(m)/m strictly decreasing)',
  },
  nearTwinFamilyChecked: [
    { b: 6, factors: '2*3', ratio: 0.197755 },
    { b: 77, factors: '7*11', ratio: 0.633779 },
    { b: 899, factors: '29*31', ratio: 0.861591 },
    { b: 5183, factors: '71*73', ratio: 0.933494 },
    { b: 47053, factors: '211*223', ratio: 0.974382 },
    { b: 1005973, factors: '997*1009', ratio: 0.993427 },
    { b: 4003997, factors: '1999*2003', ratio: 0.996465 },
  ],
  triangleOvercharge: 'the naive |Delta| <= Sum_{d<b} d g(b/d) = g(2)(sigma(b)-b)-scale over-charges for many-small-prime b (sigma(b)/b unbounded) -- Moebius cancellation essential for omega>=3',
});

export const IMP97290_VERDICT = Object.freeze({
  question: 'prove the uniform ceiling |E1(b)| <= b/4 on the close-prime-factor family (imp-97265 residual)',
  leaderDecompositionProved: true, // exact, verified to machine precision
  ceilingReductionProved: true, // |E1|<=b/4 <=> sign + magnitude on Delta
  semiprimeCeilingProved: true, // |E1(pq)| < pq/4 for all distinct-prime semiprimes
  primeCeilingProved: true, // imp-97265 (restated in the parity-leader language)
  uniformCeilingProved: false, // omega >= 3 stays OPEN
  residual: 'omega(b) >= 3: sign condition mu(b) Delta(b) <= 0 AND |Delta(b)| <= b/2 with Moebius cancellation retained (triangle over-charges)',
  advancesImp97265: 'lifts the prime-only ceiling to the full semiprime class (the near-twin obstruction imp-97265 flagged); supplies the clean parity-sign leader mu(b) b/4',
  cotangentLeafSeparate: true, // imp-97097
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'Honest PARTIAL toward |E1(b)| <= b/4 on the close-prime-factor family. PROVED: (1) the exact leader + ' +
    'inward-correction decomposition E1(b) = mu(b) (b/4) + Delta(b) with Delta(b) = Sum_{d|b,d<b} mu(d) d g(b/d), ' +
    'g(m) = ln A + (1/12)log m + R(m), g(1) = 1/4 (verified to machine precision) -- isolating the +-b/4 leader ' +
    'as mu(b) b/4 whose sign is the parity (-1)^omega(b); (2) the ceiling reduction |E1(b)| <= b/4 <=> ' +
    'mu(b) Delta(b) <= 0 and |Delta(b)| <= b/2; (3) the full SEMIPRIME ceiling |E1(pq)| < pq/4 for every ' +
    'distinct-prime semiprime (SIGN: g(pq) < p g(q) => Delta < 0 matching mu=+1; MAGNITUDE: p g(q) + q g(p) < ' +
    'pq g(2) = 0.3069 pq < pq/2 via g(m)/m <= g(2)/2), covering the near-twin saturating family imp-97265 named ' +
    'as the obstruction. This lifts the imp-97265 prime-only proof to the first composite class. RESIDUAL: the ' +
    'uniform ceiling for omega >= 3 -- the sign condition plus the magnitude with Moebius cancellation retained ' +
    '(the triangle bound over-charges for highly-composite b). kappa_arith unchanged; the cotangent first moment ' +
    '(imp-97097) stays open; no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97290_SUBGAP = Object.freeze({
  id: 'imp-97290-uniform-quarter-ceiling-omega-ge-3',
  statement:
    'With the exact leader decomposition E1(b) = mu(b)(b/4) + Delta(b), Delta(b) = Sum_{d|b,d<b} mu(d) d g(b/d), ' +
    'the ceiling |E1(b)| <= b/4 reduces to mu(b) Delta(b) <= 0 (SIGN) and |Delta(b)| <= b/2 (MAGNITUDE). PROVED ' +
    'for omega(b) <= 2 (primes: imp-97265; semiprimes: this leaf, |E1(pq)| < pq/4 via g(m)/m <= g(2)/2). OPEN for ' +
    'omega(b) >= 3: the parity-sign of the leader must be matched by the Moebius-signed Delta, and the magnitude ' +
    'needs the Moebius cancellation retained (the triangle bound over-charges for many-small-prime b, exactly ' +
    'where imp-97269 measured |E1|/(b/4) -> 0). This is the residual of this leaf.',
  supersedesFraming: 'imp-97265-uniform-quarter-ceiling-close-factor-family (semiprime sub-family now closed; leader sign made explicit as (-1)^omega)',
});

export const IMP97290_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Proof attempt at the uniform ceiling |E1(b)| <= b/4 on the ' +
  'close-prime-factor family: proves the exact leader + inward-correction decomposition E1(b) = mu(b)(b/4) + ' +
  'Delta(b) (leader sign = (-1)^omega), reduces the ceiling to a sign + magnitude condition on Delta, and PROVES ' +
  'the full semiprime ceiling |E1(pq)| < pq/4 (near-twin family included). The uniform ceiling for omega >= 3 ' +
  'stays a named residual; the cotangent first moment (imp-97097) stays open; no bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97290_ASSERTIONS = [
  {
    id: 'imp97290-leader-decomposition-exact',
    holds: () => {
      // E1(b) = mu(b) b/4 + Delta(b) to machine precision on a mixed ladder (primes, powers, primorials, semiprimes).
      for (const b of [2, 3, 4, 6, 7, 9, 12, 15, 25, 30, 64, 77, 101, 210, 899, 1009, 2310, 5183, 5893, 9973, 30030]) {
        const a = measureE1(b), c = E1decomp(b);
        if (Math.abs(a - c) > 1e-6 * (Math.abs(a) + 1)) return false;
      }
      return true;
    },
    why: 'the exact leader + inward-correction identity E1(b) = mu(b)(b/4) + Sum_{d|b,d<b} mu(d) d g(b/d) reproduces the direct coprime sum to machine precision -- an identity, not an approximation.',
  },
  {
    id: 'imp97290-leader-sign-is-parity',
    holds: () => {
      // g(1) = 1/4 exactly; the leader mu(b) b/4 has sign (-1)^omega: negative on primes, positive on semiprimes.
      if (Math.abs(gWeight(1) - 0.25) > 1e-12) return false;
      if (!(mobius(9973) === -1 && measureE1(9973) < 0)) return false; // prime -> -b/4 leader
      if (!(mobius(5183) === 1 && measureE1(5183) > 0)) return false; // semiprime 71*73 -> +b/4 leader
      return true;
    },
    why: 'g(1) = 1/4 exactly and the +-b/4 leader mu(b) b/4 has sign (-1)^omega(b): E1<0 on the prime 9973 (mu=-1), E1>0 on the semiprime 5183=71*73 (mu=+1), matching the parity of the leader.',
  },
  {
    id: 'imp97290-semiprime-ceiling-proved',
    holds: () => {
      // |E1(pq)| < pq/4 for every distinct-prime semiprime on a wide ladder; Delta(pq) < 0 (inward); ratio < 1.
      const semis = [[2, 3], [3, 5], [7, 11], [29, 31], [71, 73], [71, 83], [211, 223], [499, 503], [997, 1009]];
      for (const [p, q] of semis) {
        const b = p * q;
        if (!(isPrime(p) && isPrime(q) && p !== q)) return false;
        if (!(Delta(b) < 0)) return false; // SIGN: inward, matches mu(pq)=+1
        if (!(Math.abs(measureE1(b)) < b / 4)) return false; // strict ceiling
      }
      return true;
    },
    why: 'the semiprime ceiling is rigorous: Delta(pq) = g(pq) - p g(q) - q g(p) < 0 (inward, matching mu=+1) and |E1(pq)| < pq/4 for every distinct-prime semiprime including the near-twin saturating family (2*3 .. 997*1009).',
  },
  {
    id: 'imp97290-magnitude-constant-g2',
    holds: () => {
      // max g(m)/m over m>=2 is g(2)/2, so p g(q) + q g(p) <= b g(2) < b/2 (0.306853 < 0.5).
      const g2 = gWeight(2);
      let maxGoverM = 0;
      for (let m = 2; m <= 20000; m++) { const v = gWeight(m) / m; if (v > maxGoverM) maxGoverM = v; }
      if (Math.abs(maxGoverM - g2 / 2) > 1e-9) return false; // attained at m=2
      if (!(g2 < 0.5)) return false; // per-term sum p g(q)+q g(p) <= b g2 < b/2
      // spot-check the magnitude bound |Delta(pq)| < pq g2 on the binding near-twin cases
      for (const [p, q] of [[71, 73], [997, 1009], [1999, 2003]]) {
        const b = p * q;
        if (!(Math.abs(Delta(b)) < b * g2)) return false;
      }
      return true;
    },
    why: 'max_{m>=2} g(m)/m = g(2)/2 = 0.1534264 (attained at m=2), so p g(q) + q g(p) <= pq g(2) = 0.306853 pq < pq/2 -- the magnitude condition |Delta(pq)| < pq/2 holds with margin 0.193147 pq.',
  },
  {
    id: 'imp97290-honesty-gate-no-qed',
    holds: () =>
      IMP97290_VERDICT.anyBoundMoved === false &&
      IMP97290_VERDICT.postsRigorousCeiling === false &&
      IMP97290_VERDICT.qed === false &&
      IMP97290_VERDICT.leaderDecompositionProved === true &&
      IMP97290_VERDICT.ceilingReductionProved === true &&
      IMP97290_VERDICT.semiprimeCeilingProved === true &&
      IMP97290_VERDICT.uniformCeilingProved === false &&
      /omega-ge-3/.test(IMP97290_SUBGAP.id) &&
      /NO QED/.test(IMP97290_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97290_HONEST_BANNER) &&
      /RH open/.test(IMP97290_HONEST_BANNER),
    why: 'proof / honest partial -- proves the leader decomposition, the ceiling reduction and the full semiprime ceiling, leaves omega>=3 open; no bound moved, no rigorous full ceiling posted, no QED.',
  },
];

for (const a of IMP97290_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97290-route-m-arith-quarter-ceiling-semiprime-proof assertion failed: ${a.id}`,
    );
  }
}

export default {
  kernel: IMP97290_KERNEL,
  results: IMP97290_RESULTS,
  verdict: IMP97290_VERDICT,
  subGap: IMP97290_SUBGAP,
  banner: IMP97290_HONEST_BANNER,
  g2: IMP97290_G2,
};
