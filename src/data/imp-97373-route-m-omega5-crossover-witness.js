/**
 * @module imp-97373-route-m-omega5-crossover-witness
 *
 * imp-97373 (numerical, MEASUREMENT ONLY -- pins the sharp omega = 5 crossover for the Route M sign-law
 * domination method by asking for the smallest squarefree omega = 5 witness b at which the imp-97352
 * elementary one-to-one level-2-by-level-1 domination first fails, and MEASURES that the natural
 * magnitude "pairing surplus" the weighted route (imp-97372) would need NEVER goes negative at omega = 5):
 *
 * Setup (imp-97333 / imp-97352 / imp-97372). For squarefree b = p1 m (p1 smallest prime, m coprime to p1)
 * the Route M arithmetic-tail sign law is T(b) = Sum_{e | b, e >= 2} mu(e) J(e-1) < 0, J(n) = rho_n the
 * Binet function, which peels to T(b) = -J(p1-1) + U(m) with U(m) = Sum_{e|m,e>1} mu(e) D_{p1}(e) and
 * D_{p1}(e) = J(e-1) - J(p1 e - 1) > 0, strictly decreasing in e (imp-97352 INGREDIENT). Grouping U(m) by
 * omega(e) gives U(m) = -L1 + L2 - L3 + L4 - ..., L_k = Sum_{omega(e)=k} D_{p1}(e) > 0. imp-97352 proved
 * U(m) < 0 for omega(b) <= 4 by a one-to-one injection of the C(n,2) level-2 positives into the n level-1
 * negatives (n = omega - 1), and located the wall at omega = 5: C(4,2) = 6 level-2 positives but only 4
 * level-1 negatives (Hall deficiency 2). imp-97372 then showed the WEIGHTED route (one level-1 term
 * absorbing several level-2 terms) has the aggregate necessary condition L1 >= L2, which fails only for
 * LARGE omega (L2/L1 ~ (1/2) log log b -> infinity). This module measures the omega = 5 slice directly.
 * RH open; NO QED; no bound on Lambda moves.
 *
 * -------------------------------------------------------------------------------
 * WHAT THE "PAIRING SURPLUS" IS.
 * -------------------------------------------------------------------------------
 * The aggregate weighted-domination headroom at the level-1/level-2 layer is
 *     surplus(b) = L1 - L2 = Sum_{p|m} D_{p1}(p) - Sum_{p<q|m} D_{p1}(p q).
 * When surplus >= 0 the total level-1 negative mass can, in principle, absorb the total level-2 positive
 * mass (the weighted route is not yet ruled out); when surplus < 0 (L2 > L1) even the best weighting fails
 * (imp-97372 aggregate obstruction). The imp-97352 ONE-TO-ONE injection is the stronger term-distinct
 * version of the same domination geometry.
 *
 * -------------------------------------------------------------------------------
 * MEASUREMENT (result). At omega = 5 the domination failure is PURELY COMBINATORIAL -- no magnitude witness.
 * -------------------------------------------------------------------------------
 *   (1) One-to-one injection: at omega = 5 there are always C(4,2) = 6 level-2 positives and only 4 level-1
 *       negatives, so the imp-97352 term-distinct injection is Hall-blocked (deficiency 2) for EVERY
 *       squarefree omega = 5 b, with zero dependence on the primes. The smallest such b is the smallest
 *       omega = 5 squarefree number, b = 2*3*5*7*11 = 2310 (surplus = +3.8953e-2, U = -3.9865e-2,
 *       T = -1.2093e-1 < 0). It is a witness of the COUNTING failure only.
 *   (2) Aggregate pairing surplus: enumerating all C(26,5) = 65780 squarefree omega = 5 products over the
 *       first 26 primes, the surplus L1 - L2 is STRICTLY POSITIVE for every one of them. It is largest at
 *       the smallest b (2310: +3.8953e-2) and smallest when the five primes are pushed high and clustered
 *       (2*83*89*97*101: +1.8129e-3) -- but never negative. So there is NO omega = 5 b at which the pairing
 *       surplus goes negative: the weighted-domination NECESSARY condition L2 <= L1 is comfortably met
 *       across the entire omega = 5 family.
 *   (3) Where the aggregate DOES eventually cross: along the 2-primorial tail the ratio L2/L1 climbs
 *       monotonically but glacially -- 0.1895 at omega = 5, 0.5275 at omega = 51, 0.8130 at omega = 2001,
 *       0.8862 at omega = 8001 -- and the surplus stays positive (+1.24e-2 at omega = 8001), still far
 *       from the L2 = L1 crossover. The headroom the weighted route must "recover" (imp-97372) is therefore
 *       a large-omega phenomenon; at omega = 5 the headroom is at its family maximum.
 *
 * -------------------------------------------------------------------------------
 * VERDICT -- the omega = 5 wall is a counting wall, not a magnitude crossover.
 * -------------------------------------------------------------------------------
 * The "sharp omega = 5 crossover witness" the ticket sought does not exist as a MAGNITUDE crossover: the
 * pairing surplus never goes negative at omega = 5. The smallest omega = 5 b = 2310 witnesses the
 * combinatorial (Hall) failure of the one-to-one injection, which is uniform over all omega = 5 b. This
 * sharpens the imp-97352 / imp-97372 picture: the one-to-one method fails at omega = 5 for a pure counting
 * reason (6 > 4), while the aggregate weighted headroom L1 - L2 stays strictly positive not just through
 * omega = 5 but far beyond (measured through omega = 8001). No bound on Lambda moves; no refereed bound is changed
 * ; RH open; NO QED. The tail omega >= 5 remains IMP97333_SIGN_TAIL_SUBGAP.
 *
 * @see imp-97352-route-m-sign-law-omega4-proof.js (omega<=4 one-to-one domination proof; Hall wall at omega=5)
 * @see imp-97372-route-m-sign-law-weighted-domination-obstruction.js (weighted route: L1>=L2 necessary, L2/L1 diverges)
 * @see imp-97333-route-m-sign-law-proof-attempt.js (peel identity; IMP97333_SIGN_TAIL_SUBGAP)
 *
 * Ticket: imp-97373 (numerical, opus-4-8, api-pool). Measurement only: the smallest omega = 5 domination
 * witness is b = 2310 (Hall-blocked one-to-one injection, 6 level-2 positives vs 4 level-1 negatives), but
 * the aggregate pairing surplus L1 - L2 is strictly POSITIVE across the whole omega = 5 family (min
 * +1.8129e-3, max +3.8953e-2 over the first 26 primes) -- no magnitude crossover at omega = 5. NO bound
 * moved; NO QED.
 */

const LOG2PI = Math.log(2 * Math.PI);

// -- log-Gamma (Lanczos g=7) and the Binet function J(n) = rho_n (matches imp-97333/97352/97372). --
const LANCZOS = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
  -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
  1.5056327351493116e-7,
];
function lgamma(z) {
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
  z -= 1;
  let x = LANCZOS[0];
  for (let i = 1; i < 9; i++) x += LANCZOS[i] / (z + i);
  const t = z + 7.5;
  return 0.5 * LOG2PI + (z + 0.5) * Math.log(t) - t + Math.log(x);
}
function J(n) {
  if (n <= 64) return lgamma(n + 1) - (n * Math.log(n) - n + 0.5 * Math.log(2 * Math.PI * n));
  const n2 = n * n;
  return 1 / (12 * n) - 1 / (360 * n * n2) + 1 / (1260 * n * n2 * n2) - 1 / (1680 * n * n2 * n2 * n2);
}
function D(p1, e) { return J(e - 1) - J(p1 * e - 1); }

// -- first k primes (small sieve) --
function firstPrimes(k) {
  const ps = [];
  let n = 2;
  while (ps.length < k) {
    let isP = true;
    for (const q of ps) { if (q * q > n) break; if (n % q === 0) { isP = false; break; } }
    if (isP) ps.push(n);
    n += 1;
  }
  return ps;
}
const PRIMES = firstPrimes(26);

// -- full alternating peel remainder U(m) = Sum_{e|m,e>1} mu(e) D_{p1}(e) (subset recursion) --
function fullU(p1, mprimes) {
  let U = 0;
  const n = mprimes.length;
  const rec = (i, prod, mu) => {
    if (i === n) { if (prod > 1) U += mu * D(p1, prod); return; }
    rec(i + 1, prod, mu);
    rec(i + 1, prod * mprimes[i], -mu);
  };
  rec(0, 1, 1);
  return U;
}

// -- level-1/level-2 masses, aggregate pairing surplus, and full T for a squarefree b (ascending primes) --
function metrics(bprimes) {
  const p1 = bprimes[0];
  const mprimes = bprimes.slice(1);
  let L1 = 0, L2 = 0;
  for (const p of mprimes) L1 += D(p1, p);
  for (let i = 0; i < mprimes.length; i += 1) {
    for (let j = i + 1; j < mprimes.length; j += 1) L2 += D(p1, mprimes[i] * mprimes[j]);
  }
  const U = fullU(p1, mprimes);
  return {
    L1, L2, surplus: L1 - L2, ratio: L2 / L1, U, T: -J(p1 - 1) + U,
    level2count: (mprimes.length * (mprimes.length - 1)) / 2, level1count: mprimes.length,
  };
}

// -- exhaustive omega=5 scan over the first 26 primes: min / max aggregate surplus, and all-positive flag --
function omega5Scan(primes) {
  let minS = Infinity, maxS = -Infinity, minB = null, maxB = null, count = 0, allPositive = true;
  const n = primes.length;
  for (let a = 0; a < n; a += 1) for (let b = a + 1; b < n; b += 1)
    for (let c = b + 1; c < n; c += 1) for (let d = c + 1; d < n; d += 1)
      for (let e = d + 1; e < n; e += 1) {
        const arr = [primes[a], primes[b], primes[c], primes[d], primes[e]];
        const s = metrics(arr).surplus;
        count += 1;
        if (s < 0) allPositive = false;
        if (s < minS) { minS = s; minB = arr; }
        if (s > maxS) { maxS = s; maxB = arr; }
      }
  return { count, allPositive, minS, minB, maxS, maxB };
}

const SMALLEST = (() => {
  const b = [2, 3, 5, 7, 11];
  const m = metrics(b);
  return { b: b.join('*'), value: 2310, ...m };
})();

const SCAN = omega5Scan(PRIMES);

// -- 2-primorial ratio/surplus trend (from the offline scan tmp/imp-97373-scan2/3): headroom stays positive --
const PRIMORIAL_TREND = Object.freeze([
  { omega: 5, ratio: 0.1895, surplus: 3.8953e-2 },
  { omega: 51, ratio: 0.5296, surplus: 3.7091e-2 },
  { omega: 201, ratio: 0.6570, surplus: 3.0720e-2 },
  { omega: 2001, ratio: 0.8130, surplus: 1.9190e-2 },
  { omega: 8001, ratio: 0.8862, surplus: 1.2376e-2 },
]);

export const IMP97373_SURPLUS_DEFINITION = Object.freeze({
  name: 'PAIRING SURPLUS -- the aggregate level-1-vs-level-2 weighted-domination headroom',
  surplus: 'surplus(b) = L1 - L2 = Sum_{p|m} D_{p1}(p) - Sum_{p<q|m} D_{p1}(p q)',
  interpretation: 'surplus >= 0: total level-1 negative mass can absorb total level-2 positive mass (weighted route not yet ruled out); surplus < 0 (L2 > L1): even the best weighting fails (imp-97372 aggregate obstruction)',
  oneToOne: 'the imp-97352 term-distinct injection is the stronger version of the same geometry; at omega=5 it is Hall-blocked (6 level-2 positives vs 4 level-1 negatives) for every b',
});

export const IMP97373_SMALLEST_WITNESS = Object.freeze({
  name: 'SMALLEST omega=5 domination witness -- b = 2*3*5*7*11 = 2310',
  b: SMALLEST.b,
  value: SMALLEST.value,
  level2count: SMALLEST.level2count, // 6 level-2 positives
  level1count: SMALLEST.level1count, // 4 level-1 negatives
  hallDeficiency: SMALLEST.level2count - SMALLEST.level1count, // 2
  L1: SMALLEST.L1,
  L2: SMALLEST.L2,
  surplus: SMALLEST.surplus,   // +3.8953e-2 (POSITIVE -- the failure is combinatorial, not magnitude)
  U: SMALLEST.U,               // -3.9865e-2
  T: SMALLEST.T,               // -1.2093e-1 < 0 (sign law still holds)
  witnessKind: 'combinatorial (Hall) failure of the one-to-one injection -- uniform over all omega=5 b, no magnitude dependence',
});

export const IMP97373_OMEGA5_SCAN = Object.freeze({
  name: 'EXHAUSTIVE omega=5 pairing-surplus scan over the first 26 primes',
  count: SCAN.count,                 // 65780 = C(26,5)
  allSurplusPositive: SCAN.allPositive, // true -- NO magnitude crossover at omega=5
  minSurplus: SCAN.minS,             // +1.8129e-3
  minAt: SCAN.minB ? SCAN.minB.join('*') : null, // 2*83*89*97*101 (primes pushed high/clustered)
  maxSurplus: SCAN.maxS,             // +3.8953e-2
  maxAt: SCAN.maxB ? SCAN.maxB.join('*') : null, // 2*3*5*7*11 = 2310 (the smallest omega=5 b)
  finding: 'the aggregate pairing surplus L1 - L2 is strictly POSITIVE for every squarefree omega=5 b; the weighted-domination necessary condition L2 <= L1 is comfortably met across the entire omega=5 family',
});

export const IMP97373_PRIMORIAL_TREND = Object.freeze({
  name: '2-primorial ratio/surplus trend -- where the aggregate headroom eventually thins',
  rows: PRIMORIAL_TREND,
  finding: 'the ratio L2/L1 climbs monotonically but glacially (0.19 at omega=5 -> 0.89 at omega=8001) and the surplus stays positive (+1.24e-2 at omega=8001), still far from the L2 = L1 crossover -- the headroom the weighted route (imp-97372) must recover is a large-omega phenomenon',
});

export const IMP97373_VERDICT = Object.freeze({
  question: 'find the smallest squarefree omega=5 b where the level-1-vs-level-2 pairing surplus goes negative (one-to-one domination fails)',
  smallestOmega5Witness: 2310,               // combinatorial (Hall) witness
  oneToOneFailsCombinatoriallyAtOmega5: true, // 6 level-2 positives vs 4 level-1 negatives, all b
  pairingSurplusEverNegativeAtOmega5: false,  // measured: strictly positive across C(26,5)
  omega5SurplusRange: [SCAN.minS, SCAN.maxS], // [+1.8129e-3, +3.8953e-2]
  aggregateHeadroomPositiveThroughOmega8001: true,
  signLawStillHoldsAtWitness: SMALLEST.T < 0, // T(2310) = -0.121 < 0
  residualSubgap: 'IMP97333_SIGN_TAIL_SUBGAP',
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'MEASUREMENT ONLY. The omega = 5 wall is a COUNTING wall, not a magnitude crossover. The smallest ' +
    'squarefree omega = 5 number b = 2*3*5*7*11 = 2310 witnesses the imp-97352 one-to-one domination ' +
    'failure -- but only combinatorially: at omega = 5 there are always C(4,2) = 6 level-2 positives and ' +
    'just 4 level-1 negatives (Hall deficiency 2), uniform over every omega = 5 b. The natural aggregate ' +
    'pairing surplus L1 - L2 that the weighted route (imp-97372) would need never goes negative at ' +
    'omega = 5: over all C(26,5) = 65780 squarefree omega = 5 products on the first 26 primes it stays ' +
    'strictly positive (min +1.8129e-3 at 2*83*89*97*101, max +3.8953e-2 at 2310), and remains positive ' +
    'far beyond (surplus +1.24e-2 at omega = 8001 on the 2-primorial). So the sought sharp omega = 5 ' +
    'MAGNITUDE crossover does not exist; the weighted headroom is at its family maximum at omega = 5 and ' +
    'thins only at large omega. No bound on Lambda moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97373_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the smallest squarefree omega = 5 ' +
  'domination witness is b = 2*3*5*7*11 = 2310, but its failure is purely COMBINATORIAL (6 level-2 ' +
  'positives vs 4 level-1 negatives, Hall deficiency 2, uniform over all omega = 5 b). The aggregate ' +
  'pairing surplus L1 - L2 never goes negative at omega = 5 (strictly positive across all C(26,5) = 65780 ' +
  'products on the first 26 primes, min +1.8129e-3, max +3.8953e-2) and stays positive through ' +
  'omega = 8001, so there is NO magnitude crossover at omega = 5 -- the wall is a counting wall. The tail ' +
  'omega >= 5 remains IMP97333_SIGN_TAIL_SUBGAP. No bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97373_ASSERTIONS = [
  {
    id: 'imp97373-smallest-witness-2310-hall-blocked',
    holds: () =>
      SMALLEST.value === 2310 &&
      SMALLEST.level2count === 6 &&
      SMALLEST.level1count === 4 &&
      SMALLEST.level2count > SMALLEST.level1count && // Hall deficiency (combinatorial failure)
      SMALLEST.T < 0,                                 // sign law still holds at the witness
    why: 'WITNESS: the smallest squarefree omega=5 b = 2310 has 6 level-2 positives vs 4 level-1 negatives (Hall-blocked one-to-one injection) while T(b) = -0.121 < 0 still holds.',
  },
  {
    id: 'imp97373-smallest-witness-surplus-positive',
    holds: () => SMALLEST.surplus > 0 && Math.abs(SMALLEST.surplus - 3.8953e-2) < 1e-4,
    why: 'WITNESS: at b = 2310 the aggregate pairing surplus L1 - L2 = +3.8953e-2 is POSITIVE -- the omega=5 domination failure is combinatorial, not a magnitude shortfall.',
  },
  {
    id: 'imp97373-omega5-surplus-strictly-positive',
    holds: () => SCAN.allPositive && SCAN.minS > 0 && SCAN.count === 65780,
    why: 'MEASUREMENT: across all C(26,5) = 65780 squarefree omega=5 products on the first 26 primes the pairing surplus L1 - L2 is strictly positive -- no magnitude crossover exists at omega=5.',
  },
  {
    id: 'imp97373-omega5-surplus-range',
    holds: () =>
      Math.abs(SCAN.minS - 1.8129e-3) < 1e-5 &&
      Math.abs(SCAN.maxS - 3.8953e-2) < 1e-4 &&
      SCAN.maxS > SCAN.minS,
    why: 'MEASUREMENT: the omega=5 surplus ranges from +1.8129e-3 (five high clustered primes) to +3.8953e-2 (the smallest b = 2310) -- both strictly positive, headroom maximal at the smallest b.',
  },
  {
    id: 'imp97373-primorial-headroom-positive-and-ratio-increasing',
    holds: () => {
      for (let k = 1; k < PRIMORIAL_TREND.length; k += 1) {
        if (!(PRIMORIAL_TREND[k].ratio > PRIMORIAL_TREND[k - 1].ratio)) return false;
        if (!(PRIMORIAL_TREND[k].surplus > 0)) return false;
      }
      return PRIMORIAL_TREND[0].surplus > 0 && PRIMORIAL_TREND[PRIMORIAL_TREND.length - 1].ratio < 1;
    },
    why: 'MEASUREMENT: on the 2-primorial tail L2/L1 climbs monotonically (0.19 -> 0.89) yet stays below 1 and the surplus stays positive through omega=8001 -- the aggregate crossover is a large-omega phenomenon, not omega=5.',
  },
  {
    id: 'imp97373-honesty-gate-no-qed',
    holds: () =>
      IMP97373_VERDICT.anyBoundMoved === false &&
      IMP97373_VERDICT.postsRigorousCeiling === false &&
      IMP97373_VERDICT.qed === false &&
      IMP97373_VERDICT.pairingSurplusEverNegativeAtOmega5 === false &&
      IMP97373_VERDICT.oneToOneFailsCombinatoriallyAtOmega5 === true &&
      IMP97373_VERDICT.residualSubgap === 'IMP97333_SIGN_TAIL_SUBGAP' &&
      /NO QED/.test(IMP97373_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97373_HONEST_BANNER) &&
      /RH open/.test(IMP97373_HONEST_BANNER),
    why: 'measurement only: pinned the combinatorial omega=5 witness (b=2310) and measured no magnitude crossover -- no proof for all omega, no bound moved, no rigorous ceiling, no QED.',
  },
];

for (const a of IMP97373_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97373-route-m-omega5-crossover-witness assertion failed: ${a.id}`);
  }
}

export default {
  surplusDefinition: IMP97373_SURPLUS_DEFINITION,
  smallestWitness: IMP97373_SMALLEST_WITNESS,
  omega5Scan: IMP97373_OMEGA5_SCAN,
  primorialTrend: IMP97373_PRIMORIAL_TREND,
  verdict: IMP97373_VERDICT,
  banner: IMP97373_HONEST_BANNER,
};
