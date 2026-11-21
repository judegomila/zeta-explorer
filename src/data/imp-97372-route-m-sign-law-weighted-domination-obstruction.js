/**
 * @module imp-97372-route-m-sign-law-weighted-domination-obstruction
 *
 * imp-97372 (proof, HONEST PARTIAL -- attempts the imp-97352-flagged WEIGHTED-domination route for the
 * Route M sign law at omega >= 5 and reaches the PRECISE obstruction: the route is not merely
 * combinatorially blocked at omega = 5 (Hall, imp-97352) but ANALYTICALLY DEAD for all large omega):
 *
 * Setup (imp-97333 / imp-97352). For squarefree b = p1 m (p1 smallest prime, m coprime to p1) the Route M
 * arithmetic tail sign law is
 *     T(b) = Sum_{e | b, e >= 2} mu(e) J(e - 1) < 0,      J(n) = rho_n  (Binet function),
 * and imp-97333 RESULT 1 peels it to T(b) = -J(p1-1) + U(m) with the peel remainder
 *     U(m) = Sum_{e | m, e > 1} mu(e) D_{p1}(e),    D_{p1}(e) = J(e-1) - J(p1 e - 1) > 0.
 * imp-97352 proved U(m) < 0 (hence T(b) < 0) for omega(b) <= 4 by a one-to-one DOMINATION injection of the
 * level-2 positive peel terms into the level-1 negative peel terms (D_{p1} strictly decreasing), and located
 * the SHARP wall at omega = 5: with n = omega - 1 primes in m there are C(n,2) level-2 positives but only n
 * level-1 negatives, so the covering injection needs C(n,2) <= n, i.e. omega <= 4; at omega = 5 (n = 4) the
 * count is C(4,2) = 6 > 4 (Hall deficiency 2). imp-97352 flagged the natural next attempt: WEIGHTED
 * domination -- let ONE level-1 negative term absorb SEVERAL level-2 positive terms by magnitude. This
 * module attempts that route and reaches its precise obstruction. RH open; NO QED; no bound on Lambda moves.
 *
 * -------------------------------------------------------------------------------
 * THE WEIGHTED-DOMINATION ARCHITECTURE and its NECESSARY CONDITION.
 * -------------------------------------------------------------------------------
 * Write the peel remainder by omega(e) level: U(m) = -L1 + L2 - L3 + L4 - ..., where the level-k mass is
 *     L_k = Sum_{e | m, omega(e) = k} D_{p1}(e)  >  0   (each D_{p1} > 0).
 * imp-97352 CROSSOVER established the domination geometry: a level-2 positive D_{p1}(p_i p_j) can be
 * term-magnitude-dominated (D strictly decreasing => dominator needs a SMALLER argument) only by a level-1
 * negative D_{p1}(p_k) with p_k < p_i p_j, and, more generally, each even level 2r is absorbed by the odd
 * level 2r-1 just below it (any higher-omega negative has a LARGER product, the wrong sign). "Weighted
 * domination" is exactly this architecture made many-to-one: PARTITION the C(n,2) level-2 positives into n
 * groups G_1, ..., G_n, assign group G_k to the level-1 term D_{p1}(p_k), and require
 *     D_{p1}(p_k)  >=  Sum_{e in G_k} D_{p1}(e)      for each k.
 * Summing the n group inequalities gives the AGGREGATE NECESSARY CONDITION
 *     L1  >=  L2.
 * (Even allowing the free leading term to help -- absorbing part of the level-2 mass into J(p1-1) -- only
 * weakens this to J(p1-1) + L1 >= L2, with J(p1-1) <= J(1) = 1 - (1/2)log(2*pi) approx 0.0811 a bounded
 * constant.) So ANY level-2-by-level-1 weighting, however cleverly the six-or-more positives are grouped,
 * forces L2 <= L1 + O(1).
 *
 * -------------------------------------------------------------------------------
 * OBSTRUCTION (rigorous). L2 / L1 diverges: the necessary condition L2 <= L1 fails for all large omega.
 * -------------------------------------------------------------------------------
 * From J(n) = 1/(12 n) + O(1/n^3) the peel weight has the leading size
 *     D_{p1}(e) = J(e-1) - J(p1 e - 1) = (1/(12 e)) (1 - 1/p1) + O(1/e^2).
 * Hence, with S1 = Sum_{p | m} 1/p and S2 = Sum_{p | m} 1/p^2 (bounded), and by Mertens S1 ~ log log b:
 *     L1 = Sum_{p | m} D_{p1}(p)      ~  ((1 - 1/p1)/12) S1        ~  c1 * log log b      -> +infinity,
 *     L2 = Sum_{p<q | m} D_{p1}(pq)   ~  ((1 - 1/p1)/12) (S1^2 - S2)/2  ~  c2 * (log log b)^2 -> +infinity,
 * with c2/c1 = 1/2. THEREFORE the ratio -- in which the (1-1/p1)/12 prefactor cancels, so the leading
 * asymptotic is normalization-free --
 *     L2 / L1  ~  (S1 - S2/S1) / 2  ~  (1/2) log log b   ->  +infinity.
 * The aggregate necessary condition L2 <= L1 (even L2 <= L1 + O(1)) is therefore VIOLATED for every
 * sufficiently large omega. Weighted domination of the level-2 positives by the level-1 negatives is not
 * merely blocked one-to-one at omega = 5 (imp-97352 Hall deficiency, a COMBINATORIAL wall); it is
 * ANALYTICALLY DEAD -- no weighting whatsoever can succeed once L2 exceeds L1, because the total positive
 * level-2 mass simply outweighs the total negative level-1 mass. This is the SIGN specialization of the
 * imp-97309 / imp-97333 inter-level divergence (single-prime level ~ log log b, two-prime level ~
 * (log log b)^2) read as a hard no-go for the domination architecture, not just for the crude Upos bound.
 *
 * -------------------------------------------------------------------------------
 * WHY THE SIGN LAW NEVERTHELESS HOLDS (what the real mechanism must be).
 * -------------------------------------------------------------------------------
 * The individual level masses L1, L2, L3, ... each DIVERGE, yet the alternating sum U(m) = -L1 + L2 - L3 +
 * ... stays NEGATIVE and BOUNDED (measured U(m) approx -0.047, slowly convergent, for omega up to 16 on the
 * 2-primorial; the sign law is TRUE). Hence the surplus level-2 mass (L2 - L1 > 0 for large omega) is not
 * absorbed by level 1 at all -- it is cancelled by the level-3 negative mass and beyond, i.e. by GENUINE
 * cross-level cancellation between divergent alternating sums. That is precisely IMP97333_SIGN_TAIL_SUBGAP
 * (the sign specialization of IMP97309_CANCELLATION_SUBGAP), and this module shows it cannot be dodged by
 * any level-2-by-level-1 weighting: the domination altitude is structurally too low.
 *
 * -------------------------------------------------------------------------------
 * RESIDUAL (named sub-gap -- unchanged, now with the domination route closed at both ends).
 * -------------------------------------------------------------------------------
 *     IMP97333_SIGN_TAIL_SUBGAP still open for omega >= 5. imp-97352 sharpened the LOWER boundary (the
 *     one-to-one injection fails at exactly omega = 5, Hall); this module closes the UPPER end of the
 *     domination family (no WEIGHTED level-2-by-level-1 injection can exist for large omega, since
 *     L2/L1 ~ (1/2) log log b -> infinity). A proof for all omega must use genuine inter-level
 *     cancellation. No bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97352-route-m-sign-law-omega4-proof.js (omega<=4 domination proof; Hall wall at omega=5; flags weighted domination)
 * @see imp-97333-route-m-sign-law-proof-attempt.js (peel identity RESULT 1; Upos divergence (1/24)(loglog b)^2; IMP97333_SIGN_TAIL_SUBGAP)
 * @see imp-97309-route-m-arith-tail-cancellation-assessment.js (inter-level divergence; IMP97309_CANCELLATION_SUBGAP)
 *
 * Ticket: imp-97372 (proof, opus-4-8, api-pool). Honest partial: the imp-97352-flagged weighted-domination
 * route (one level-1 term absorbing several level-2 terms) requires L2 <= L1, but L2/L1 ~ (1/2) log log b
 * diverges, so the route is analytically dead for large omega -- the sign law tail is genuinely
 * IMP97333_SIGN_TAIL_SUBGAP. NO bound moved; NO QED.
 */

const LOG2PI = Math.log(2 * Math.PI);

// -- log-Gamma (Lanczos g=7) and the Binet function J(n) = rho_n (matches imp-97333/97352). --
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
const PRIMES = firstPrimes(3000);

// -- level-1 and level-2 peel masses for m = product of the given ascending primes --
function levelMasses(p1, mprimes) {
  let L1 = 0, L2 = 0, S1 = 0, S2 = 0;
  for (const p of mprimes) { L1 += D(p1, p); S1 += 1 / p; S2 += 1 / (p * p); }
  for (let i = 0; i < mprimes.length; i += 1) {
    for (let j = i + 1; j < mprimes.length; j += 1) L2 += D(p1, mprimes[i] * mprimes[j]);
  }
  return { L1, L2, S1, S2, ratio: L2 / L1, asy: S1 / 2 - S2 / (2 * S1) };
}

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

// -- ratio trend along the 2-primorial tail m = 3*5*7*... (omega = n+1); ratio climbs toward (1/2)loglog b --
const RATIO_TREND = [10, 50, 200, 800, 2400].map((n) => {
  const mp = PRIMES.slice(1, 1 + n);
  const { L1, L2, ratio, asy } = levelMasses(2, mp);
  return { n, omega: n + 1, pmax: mp[mp.length - 1], L1, L2, ratio, asy };
});

export const IMP97372_NECESSARY_CONDITION = Object.freeze({
  name: 'WEIGHTED-DOMINATION ARCHITECTURE -- level-2 positives absorbed by level-1 negatives',
  peelByLevel: 'U(m) = -L1 + L2 - L3 + L4 - ..., L_k = Sum_{omega(e)=k} D_{p1}(e) > 0',
  geometry: 'D_{p1} strictly decreasing (imp-97352) => a level-2 positive is term-dominated only by a level-1 negative of SMALLER argument; higher-omega negatives have larger products (wrong sign)',
  weighting: 'partition the C(n,2) level-2 positives into n groups G_k, require D_{p1}(p_k) >= Sum_{e in G_k} D_{p1}(e)',
  aggregate: 'summing the n group inequalities forces L1 >= L2 (even with the free leading term: J(p1-1) + L1 >= L2, J(p1-1) <= J(1) approx 0.0811 bounded)',
  necessaryCondition: 'L2 <= L1 + O(1)',
});

export const IMP97372_OBSTRUCTION = Object.freeze({
  name: 'OBSTRUCTION -- L2 / L1 diverges, so the necessary condition fails for all large omega',
  leadingSize: 'D_{p1}(e) = (1/(12 e))(1 - 1/p1) + O(1/e^2)',
  L1asy: 'L1 ~ ((1-1/p1)/12) S1 ~ c1 log log b -> +infinity (Mertens, S1 = Sum 1/p)',
  L2asy: 'L2 ~ ((1-1/p1)/12) (S1^2 - S2)/2 ~ c2 (log log b)^2 -> +infinity, c2/c1 = 1/2',
  ratio: 'L2/L1 ~ (S1 - S2/S1)/2 ~ (1/2) log log b -> +infinity (the (1-1/p1)/12 prefactor cancels; leading asymptotic is normalization-free)',
  verdict: 'weighted domination of level-2 by level-1 is ANALYTICALLY DEAD for large omega, not merely combinatorially Hall-blocked at omega=5 (imp-97352); the total level-2 positive mass outweighs the total level-1 negative mass',
  isSignSpecializationOf: 'the imp-97309 / imp-97333 inter-level divergence',
});

export const IMP97372_REAL_MECHANISM = Object.freeze({
  name: 'WHY THE SIGN LAW STILL HOLDS -- genuine cross-level cancellation',
  levelsDiverge: 'L1, L2, L3, ... each diverge (loglog, (loglog)^2, ...)',
  sumBounded: 'yet U(m) = -L1 + L2 - L3 + ... stays negative and bounded (measured U(m) approx -0.047, slowly convergent, omega up to 16)',
  consequence: 'the surplus L2 - L1 > 0 is cancelled by level-3 and beyond, not absorbed by level-1 -- exactly IMP97333_SIGN_TAIL_SUBGAP; the domination altitude is structurally too low',
});

export const IMP97372_VERDICT = Object.freeze({
  question: 'can WEIGHTED domination (one level-1 term absorbing several level-2 terms) prove the sign law for omega >= 5',
  weightedDominationRequiresL2leL1: true,   // aggregate necessary condition
  ratioDiverges: true,                      // L2/L1 ~ (1/2) loglog b
  weightedDominationDeadForLargeOmega: true,
  signLawStillTrueNumerically: true,        // U(m) < 0 measured through omega = 16
  provesSignForAllOmega: false,
  residualSubgap: 'IMP97333_SIGN_TAIL_SUBGAP',
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'HONEST PARTIAL. The imp-97352-flagged weighted-domination route (partition the C(n,2) level-2 ' +
    'positive peel terms among the n level-1 negative terms, each level-1 term absorbing its group by ' +
    'magnitude) has the aggregate NECESSARY condition L1 >= L2 (even with the bounded free term J(p1-1)). ' +
    'But L1 ~ (1/12)(1-1/p1) log log b and L2 ~ (1/24)(1-1/p1)(log log b)^2, so L2/L1 ~ (1/2) log log b ' +
    '-> infinity: the necessary condition fails for all large omega and the route is ANALYTICALLY DEAD, ' +
    'not merely Hall-blocked at omega = 5. The sign law nonetheless holds (U(m) < 0 measured), so the true ' +
    'mechanism is genuine cross-level cancellation between divergent alternating sums -- exactly ' +
    'IMP97333_SIGN_TAIL_SUBGAP. No bound on Lambda moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97372_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Honest partial: the imp-97352-flagged WEIGHTED ' +
  'domination of the level-2 positive peel terms by the level-1 negative terms requires L2 <= L1, but ' +
  'L2/L1 ~ (1/2) log log b -> infinity (L1 ~ loglog b, L2 ~ (loglog b)^2), so the route is analytically ' +
  'dead for large omega -- closing the UPPER end of the domination family (imp-97352 closed the one-to-one ' +
  'LOWER end at omega = 5). The sign law itself still holds; its tail is genuine cross-level cancellation, ' +
  'i.e. IMP97333_SIGN_TAIL_SUBGAP. No bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97372_ASSERTIONS = [
  {
    id: 'imp97372-leading-size-of-D',
    holds: () => {
      // D_{p1}(e) ~ (1/(12 e))(1 - 1/p1): the relative error of the leading term -> 0 as e grows
      for (const p1 of [2, 3, 5]) {
        const e = 40000;
        const lead = (1 / (12 * e)) * (1 - 1 / p1);
        if (!(Math.abs(D(p1, e) / lead - 1) < 0.02)) return false;
      }
      return true;
    },
    why: 'OBSTRUCTION input: D_{p1}(e) = (1/(12 e))(1 - 1/p1) + O(1/e^2) -- the leading peel-weight size that drives L1 ~ loglog b, L2 ~ (loglog b)^2.',
  },
  {
    id: 'imp97372-L2-over-L1-monotone-increasing',
    holds: () => {
      // ratio L2/L1 strictly increases along the 2-primorial tail (divergent trend), tracking (1/2)loglog b
      for (let k = 1; k < RATIO_TREND.length; k += 1) {
        if (!(RATIO_TREND[k].ratio > RATIO_TREND[k - 1].ratio)) return false;
      }
      return RATIO_TREND[0].ratio > 0.2 && RATIO_TREND[RATIO_TREND.length - 1].ratio > 0.8;
    },
    why: 'OBSTRUCTION: L2/L1 climbs monotonically (0.3 -> 0.82 over omega 11 -> 2401) toward the divergent asymptotic (1/2) log log b -- the necessary condition L2 <= L1 must eventually fail.',
  },
  {
    id: 'imp97372-ratio-tracks-S1-over-2',
    holds: () => RATIO_TREND.every((r) => r.ratio < r.asy && r.ratio > 0.6 * r.asy),
    why: 'OBSTRUCTION: the measured ratio L2/L1 stays below and within a bounded factor of its asymptote (S1 - S2/S1)/2 = (1/2) log log b + O(1) -- confirming L2/L1 -> infinity.',
  },
  {
    id: 'imp97372-both-levels-diverge',
    holds: () => {
      // L1 and L2 both strictly increase along the tail (each diverges), so cancellation is unavoidable
      for (let k = 1; k < RATIO_TREND.length; k += 1) {
        if (!(RATIO_TREND[k].L1 > RATIO_TREND[k - 1].L1)) return false;
        if (!(RATIO_TREND[k].L2 > RATIO_TREND[k - 1].L2)) return false;
      }
      return true;
    },
    why: 'OBSTRUCTION / REAL MECHANISM: the level masses L1, L2 individually diverge, so a proof must cancel across levels rather than dominate level 2 by level 1.',
  },
  {
    id: 'imp97372-sign-law-still-holds',
    holds: () => {
      // U(m) < 0 through omega = 13 on the 2-primorial (sign law TRUE despite L2 > L1 asymptotically)
      for (const n of [4, 6, 8, 10, 12]) {
        const mp = PRIMES.slice(1, 1 + n);
        if (!(fullU(2, mp) < 0)) return false;
      }
      return true;
    },
    why: 'REAL MECHANISM: the alternating peel remainder U(m) < 0 stays negative and bounded even where L2 outgrows L1 -- the sign law is true; only the domination METHOD is dead.',
  },
  {
    id: 'imp97372-honesty-gate-no-qed',
    holds: () =>
      IMP97372_VERDICT.anyBoundMoved === false &&
      IMP97372_VERDICT.postsRigorousCeiling === false &&
      IMP97372_VERDICT.qed === false &&
      IMP97372_VERDICT.provesSignForAllOmega === false &&
      IMP97372_VERDICT.weightedDominationRequiresL2leL1 === true &&
      IMP97372_VERDICT.ratioDiverges === true &&
      IMP97372_VERDICT.weightedDominationDeadForLargeOmega === true &&
      IMP97372_VERDICT.residualSubgap === 'IMP97333_SIGN_TAIL_SUBGAP' &&
      /NO QED/.test(IMP97372_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97372_HONEST_BANNER) &&
      /RH open/.test(IMP97372_HONEST_BANNER),
    why: 'honest partial: weighted domination shown analytically dead for large omega and the tail reduced to IMP97333_SIGN_TAIL_SUBGAP -- no proof for all omega, no bound moved, no rigorous ceiling, no QED.',
  },
];

for (const a of IMP97372_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97372-route-m-sign-law-weighted-domination-obstruction assertion failed: ${a.id}`);
  }
}

export default {
  necessaryCondition: IMP97372_NECESSARY_CONDITION,
  obstruction: IMP97372_OBSTRUCTION,
  realMechanism: IMP97372_REAL_MECHANISM,
  verdict: IMP97372_VERDICT,
  banner: IMP97372_HONEST_BANNER,
  ratioTrend: RATIO_TREND,
};
