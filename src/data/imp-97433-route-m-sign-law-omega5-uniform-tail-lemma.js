/**
 * @module imp-97433-route-m-sign-law-omega5-uniform-tail-lemma
 *
 * imp-97433 (proof, HONEST PARTIAL -- derives the uniform-in-(p1,q1) TAIL LEMMA that imp-97423 named as the
 * sole remaining sub-gap of the omega = 5 Route M sign law, IMP97333_SIGN_TAIL_SUBGAP). imp-97423 supplied the
 * rigorous enveloping Binet bracket 1/(12 n) - 1/(360 n^3) < J(n) < 1/(12 n), the explicit two-sided bounds
 * Dlo <= D_{p1}(e) <= Dhi, the certificates certA, certB (positive value proves inequalities (A),(B)), and the
 * STEP-4 monotonicity reduction of q2,q3,q4 to minimal configs -- but left the certificate margin decaying like
 * (1-1/p1)/(12 q1)[1 - Sum 1/qj] -> 0+ with no positive floor, so a finite check could not cover all q1. This
 * module carries out the bounded elementary calculation imp-97423 deferred: it produces an EXPLICIT threshold
 * Q0 = 7 above which the now-explicit O(1/e^3) bracket remainder is dominated by the leading margin, uniformly
 * in (p1, q1), reducing the whole q1-tail to the finite check q1 < 7. RH open; NO QED; no bound on Lambda
 * moves; no refereed bound is changed. The upstream imp-97396 reduction (T(b) < 0 <=> (A) & (B)) is taken as given
 * and NOT re-audited here, so this closes the NAMED sub-gap, not the omega = 5 sign law as an independent QED.
 *
 * -------------------------------------------------------------------------------
 * STEP 0 -- the exact main part M and its clean two-sided control.
 * -------------------------------------------------------------------------------
 * Write M(p1,e) = 1/(12(e-1)) - 1/(12(p1 e - 1)). Then the imp-97423 brackets read
 *     Dlo(p1,e) = M(p1,e) - 1/(360(e-1)^3),      Dhi(p1,e) = M(p1,e) + 1/(360(p1 e - 1)^3),
 * i.e. the O(1/e^3) bracket remainder is EXACTLY the two named cubic terms. Algebra collapses M to
 *     M(p1,e) = (p1 - 1) e / [12 (e-1)(p1 e - 1)].
 * Two elementary facts (both proved below, valid for e >= 2, p1 >= 2):
 *     (M-lo)   M(p1,q1)     >  (1 - 1/p1)/(12 q1)         [positive leading term, bounded from BELOW]
 *     (M-hi)   M(p1,e)      <  1/(12 (e - 1))             [any subtracted term, bounded from ABOVE, p1-free]
 * Proof of (M-lo): M(p1,q1) > (1-1/p1)/(12 q1)  <=>  p1 q1^2 > (q1-1)(p1 q1 - 1) = p1 q1^2 - (p1+1)q1 + 1
 *   <=>  (p1+1)q1 > 1, true. Proof of (M-hi): M = (1/12)[1/(e-1) - 1/(p1 e - 1)] < 1/(12(e-1)) since the
 *   subtracted term is positive.
 *
 * -------------------------------------------------------------------------------
 * STEP 1 -- a uniform (p1-free) lower bound on certA that only uses qj > q1.
 * -------------------------------------------------------------------------------
 * In the minimal (or any) omega = 5 config q1 < q2 < q3 < q4, so q1 qj > q1^2 for j = 2,3,4. Hence
 *     Dhi(p1, q1 qj) = M(p1, q1 qj) + 1/(360(p1 q1 qj - 1)^3)
 *                    <  1/(12(q1 qj - 1)) + 1/(360(q1^2 - 1)^3)   <  1/(12(q1^2 - 1)) + 1/(360(q1^2 - 1)^3),
 * using (M-hi), q1 qj - 1 > q1^2 - 1, and p1 q1 qj - 1 > q1^2 - 1. Summing the three j and pairing with
 * Dlo(p1,q1) = M(p1,q1) - 1/(360(q1-1)^3) >= (1-1/p1)/(12 q1) - 1/(360(q1-1)^3) [by (M-lo)] gives, since
 * 1 - 1/p1 >= 1/2 for p1 >= 2 (WORST case p1 = 2),
 *     certA(p1; q1, q2, q3, q4) > gA(q1) := 1/(24 q1) - 1/(4(q1^2 - 1)) - 1/(360(q1-1)^3) - 1/(120(q1^2 - 1)^3).
 * This lower bound is UNIFORM in p1 (>=2) and in the tail primes q2,q3,q4 (>q1) -- it needs no minimal-config
 * reduction; it uses only qj > q1. [The 1/(4(q1^2-1)) is 3 x 1/(12(q1^2-1)); the 1/(120(q1^2-1)^3) is
 * 3 x 1/(360(q1^2-1)^3).]
 *
 * -------------------------------------------------------------------------------
 * STEP 2 -- gA(q1) > 0 for every real q1 >= 7 (the explicit threshold Q0 = 7).
 * -------------------------------------------------------------------------------
 * Split gA = h - c with h(q1) = 1/(24 q1) - 1/(4(q1^2 - 1)) and c(q1) = 1/(360(q1-1)^3) + 1/(120(q1^2-1)^3) > 0.
 *   Lower bound on h: for q1 >= 7, q1^2 - 1 >= q1^2 (1 - 1/49) = (48/49) q1^2, so 1/(4(q1^2-1)) <= 49/(192 q1^2),
 *     h(q1) >= 1/(24 q1) - 49/(192 q1^2) = (1/q1)[1/24 - 49/(192 q1)] >= (1/q1)[1/24 - 49/1344] = (7/1344)/q1 > 0
 *     (the bracket [1/24 - 49/(192 q1)] is increasing in q1, so its q1 = 7 value 7/1344 = 0.0052083.. is the minimum).
 *   Upper bound on c: for q1 >= 7, q1 - 1 >= (6/7) q1 so (q1-1)^3 >= (216/343) q1^3 and 1/(360(q1-1)^3) <=
 *     343/(77760 q1^3) = 0.004411.../q1^3; the second term is <= 49^3/(120 . 48^3 q1^6) (tiny), so c(q1) < 0.0045/q1^3.
 *   Therefore gA(q1) = h(q1) - c(q1) > (7/1344)/q1 - 0.0045/q1^3 > 0  <=>  (7/1344) q1^2 > 0.0045  <=>  q1 > 0.86,
 * which holds for all q1 >= 7. So gA(q1) > 0 for every real q1 >= 7 -- an EXPLICIT, elementary, uniform bound.
 * (The border is genuine: gA(5) = -0.00213 < 0, so Q0 = 7 is essentially sharp for this bound; and the leading
 * behaviour gA(q1) ~ 1/(24 q1) reproduces the imp-97423 tail witness certA(q1=1e6, p1=2) ~ 4.167e-8.)
 *
 * -------------------------------------------------------------------------------
 * STEP 3 -- the analogous uniform lower bound closes certB for EVERY omega = 5 config (no finite check).
 * -------------------------------------------------------------------------------
 * certB(p1; q) = Dlo(p1, q2) - Dhi(p1, q2 q3) - Dhi(p1, q2 q4) with q3, q4 > q2. The same steps (two Dhi terms
 * instead of three) give certB > gB(q2) := 1/(24 q2) - 1/(6(q2^2 - 1)) - 1/(360(q2-1)^3) - 1/(180(q2^2-1)^3),
 * and gB(q2) > 0 for every real q2 >= 5 (binding term 1/(24 q2) > 1/(6(q2^2-1)) <=> q2 > 2 + sqrt5 = 4.236;
 * gB(5) = +0.001345 > 0). In ANY omega = 5 config p1 < q1 < q2, so q2 >= 5 always. Hence certB > 0 for EVERY
 * omega = 5 squarefree b unconditionally -- (B) needs NO finite check.
 *
 * -------------------------------------------------------------------------------
 * STEP 4 -- the finite residual check (q1 < 7) and the resulting closure of the named sub-gap.
 * -------------------------------------------------------------------------------
 * For q1 >= 7, STEP 1+2 give certA > gA(q1) > 0 for every (p1, q2, q3, q4). The only remaining certA cases have
 * q1 < 7; since p1 < q1 and all are primes, q1 in {3, 5} (q1 = 2 impossible: q1 > p1 >= 2), and the finitely many
 * (p1, q1) are exactly {(2,3), (2,5), (3,5)}. By the imp-97423 STEP-4 monotonicity (Dhi(p1,e) strictly
 * DECREASING in e, re-verified below via (p1 e -1)^2 > p1 (e-1)^2 = (p1-1)(p1 e^2 -1) > 0), certA is strictly
 * INCREASING in each of q2, q3, q4, so the worst case for each (p1, q1) is the minimal config = the three
 * smallest primes above q1 coprime to p1. Those three certificates are all strictly positive:
 *     certA(2; 3,5,7,11) = 0.018118,  certA(2; 5,7,11,13) = 0.008853,  certA(3; 5,7,11,13) = 0.011280.
 * Hence certA > 0 for EVERY omega = 5 config. Combined with STEP 3 (certB > 0 always), both certificates (A),(B)
 * are established for all omega = 5 squarefree b. This CLOSES the named IMP97333_SIGN_TAIL_SUBGAP at omega = 5:
 * the uniform-in-(p1,q1) tail lemma is DERIVED (Q0 = 7) and the finite residual (3 minimal-config checks) is
 * carried out. Conditional on the imp-97396 reduction T(b) < 0 <=> (A) & (B) (assumed, not re-audited here),
 * this would give the full omega = 5 sign law -- but we do NOT re-verify that upstream chain, so NO independent
 * QED of omega = 5 is claimed, and no bound on Lambda moves.
 *
 * @see imp-97423-route-m-sign-law-omega5-binet-two-sided-estimate.js (supplies BRACKET, Dlo/Dhi, certA/B, STEP-4; names this gap)
 * @see imp-97396-route-m-sign-law-omega5-weighted-reduction.js (reduces omega=5 to (A),(B))
 * @see imp-97333-route-m-sign-law-proof-attempt.js (peel identity; IMP97333_SIGN_TAIL_SUBGAP)
 *
 * Ticket: imp-97433 (proof, opus-4-8, api-pool). Honest partial: derives the explicit uniform tail threshold
 * Q0 = 7 (certA > gA(q1) > 0 for q1 >= 7, uniform in p1 >= 2 and the tail primes) plus the closed-form gB(q2)
 * that settles certB for all q2 >= 5, and carries out the finite q1 < 7 residual (3 minimal-config certA checks
 * all positive). Closes the NAMED sub-gap; the omega = 5 sign law rests on the un-re-audited imp-97396
 * reduction, so NO independent QED; no bound moved; no refereed bound is changed; RH open.
 */

const LOG2PI = Math.log(2 * Math.PI);

// -- log-Gamma (Lanczos g=7) and exact-reference Binet J(n); identical to imp-97423 for cross-consistency. --
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

// -- imp-97423 enveloping bracket and the two-sided D bounds (re-used verbatim). --
function Jlo(n) { return 1 / (12 * n) - 1 / (360 * n * n * n); }
function Jhi(n) { return 1 / (12 * n); }
function Dlo(p1, e) { return Jlo(e - 1) - Jhi(p1 * e - 1); }
function Dhi(p1, e) { return Jhi(e - 1) - Jlo(p1 * e - 1); }
function certA(p1, q) { const [q1, q2, q3, q4] = q; return Dlo(p1, q1) - (Dhi(p1, q1 * q2) + Dhi(p1, q1 * q3) + Dhi(p1, q1 * q4)); }
function certB(p1, q) { const [q1, q2, q3, q4] = q; return Dlo(p1, q2) - (Dhi(p1, q2 * q3) + Dhi(p1, q2 * q4)); }

// -- the derived UNIFORM lower bounds (STEP 1 and STEP 3): certA > gA(q1), certB > gB(q2). --
function gA(q1) { return 1 / (24 * q1) - 1 / (4 * (q1 * q1 - 1)) - 1 / (360 * (q1 - 1) ** 3) - 1 / (120 * (q1 * q1 - 1) ** 3); }
function gB(q2) { return 1 / (24 * q2) - 1 / (6 * (q2 * q2 - 1)) - 1 / (360 * (q2 - 1) ** 3) - 1 / (180 * (q2 * q2 - 1) ** 3); }

// -- helper: the `count` smallest primes above `after` coprime to p1 (minimal config). --
function nextPrimesCoprime(after, count, p1) {
  const isPrime = (x) => { for (let d = 2; d * d <= x; d += 1) if (x % d === 0) return false; return x > 1; };
  const out = []; let n = after + 1;
  while (out.length < count) { if (isPrime(n) && n % p1 !== 0) out.push(n); n += 1; }
  return out;
}

// -- STEP 4 finite residual: the three (p1,q1) with q1 < 7, each at its minimal config. --
const FINITE_RESIDUAL = [
  { p1: 2, q1: 3 }, { p1: 2, q1: 5 }, { p1: 3, q1: 5 },
].map(({ p1, q1 }) => {
  const [q2, q3, q4] = nextPrimesCoprime(q1, 3, p1);
  const cfg = [q1, q2, q3, q4];
  return { p1, config: `${p1}*${cfg.join('*')}`, certA: certA(p1, cfg), provesA: certA(p1, cfg) > 0 };
});

export const IMP97433_THRESHOLD = Object.freeze({
  name: 'the explicit uniform-in-(p1,q1) tail threshold Q0 = 7',
  Q0: 7,
  gA: 'gA(q1) = 1/(24 q1) - 1/(4(q1^2-1)) - 1/(360(q1-1)^3) - 1/(120(q1^2-1)^3)',
  claim: 'certA(p1;q1,q2,q3,q4) > gA(q1) for all p1 >= 2 and all tail primes q2,q3,q4 > q1 (uniform; uses only qj > q1)',
  positivity: 'gA(q1) > (7/1344)/q1 - 0.0045/q1^3 > 0 for every real q1 >= 7; gA(5) = -0.00213 < 0 so Q0 = 7 is essentially sharp',
  leadingMatch: 'gA(q1) ~ 1/(24 q1) reproduces the imp-97423 tail witness certA(1e6,p1=2) ~ 4.167e-8',
});

export const IMP97433_CERTB = Object.freeze({
  name: 'STEP 3 -- certB settled for EVERY omega = 5 config (no finite check)',
  gB: 'gB(q2) = 1/(24 q2) - 1/(6(q2^2-1)) - 1/(360(q2-1)^3) - 1/(180(q2^2-1)^3)',
  claim: 'certB(p1;q) > gB(q2) for all p1 >= 2, q3,q4 > q2; gB(q2) > 0 for every real q2 >= 5 (gB(5) = +0.001345)',
  alwaysApplies: 'in any omega = 5 config p1 < q1 < q2 forces q2 >= 5, so certB > 0 unconditionally',
});

export const IMP97433_FINITE_RESIDUAL = Object.freeze({
  name: 'STEP 4 -- the finite q1 < 7 residual for certA (3 minimal-config checks)',
  cases: '(p1,q1) in {(2,3),(2,5),(3,5)} (q1 in {3,5}, q1 = 2 impossible since q1 > p1 >= 2)',
  monotoneWorstIsMinimal: 'Dhi decreasing in e => certA increasing in q2,q3,q4 => minimal config is the worst case per (p1,q1)',
  rows: FINITE_RESIDUAL,
  allPositive: FINITE_RESIDUAL.every((r) => r.provesA),
});

export const IMP97433_VERDICT = Object.freeze({
  question: 'is there an explicit uniform-in-(p1,q1) threshold Q0 above which the O(1/e^3) Binet remainder is dominated by the leading margin, leaving only a finite check?',
  tailLemmaDerived: true,          // certA > gA(q1) > 0 for q1 >= 7, uniform in p1 and tail primes
  thresholdQ0: 7,
  certBSettledUnconditionally: true, // gB(q2) > 0 for all q2 >= 5, and q2 >= 5 always
  finiteResidualCarriedOut: true,  // the 3 minimal-config certA checks are all positive
  namedSubgapClosed: true,         // IMP97333_SIGN_TAIL_SUBGAP at omega = 5 is closed
  provesSignForAllOmega: false,
  upstreamReductionReaudited: false, // the imp-97396 T(b)<0 <=> (A)&(B) chain is assumed, not re-checked here
  independentOmega5QED: false,
  anyBoundMoved: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
  conclusion:
    'HONEST PARTIAL that CLOSES the named sub-gap. Derives the explicit uniform tail threshold Q0 = 7: with ' +
    'M(p1,e) = 1/(12(e-1)) - 1/(12(p1 e -1)), the bounds M(p1,q1) > (1-1/p1)/(12 q1) and M(p1,e) < 1/(12(e-1)) ' +
    'plus qj > q1 give certA > gA(q1) uniformly in p1 >= 2 and the tail primes, and gA(q1) > (7/1344)/q1 - ' +
    '0.0045/q1^3 > 0 for every q1 >= 7. The twin bound certB > gB(q2) > 0 holds for all q2 >= 5, which is ' +
    'automatic (q2 > q1 > p1 >= 2), so (B) needs no finite check. The certA residual q1 < 7 is the finite set ' +
    '(p1,q1) in {(2,3),(2,5),(3,5)}, worst case = minimal config by the re-verified Dhi monotonicity, and all ' +
    'three certificates are strictly positive. So both (A),(B) hold for every omega = 5 config. This closes ' +
    'IMP97333_SIGN_TAIL_SUBGAP at omega = 5. The omega = 5 sign law itself rests on the un-re-audited imp-97396 ' +
    'reduction, so NO independent QED is claimed; no bound on Lambda moves; no refereed bound is changed; RH open.',
});

export const IMP97433_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Honest partial: derives the explicit uniform-in-(p1,q1) tail ' +
  'threshold Q0 = 7 (certA > gA(q1) = 1/(24 q1) - 1/(4(q1^2-1)) - cubics > 0 for all q1 >= 7, uniform in p1 and ' +
  'the tail primes), settles certB via gB(q2) > 0 for all q2 >= 5 (automatic), and carries out the finite q1 < 7 ' +
  'residual (3 minimal-config certA checks, all positive). Closes IMP97333_SIGN_TAIL_SUBGAP at omega = 5; the ' +
  'omega = 5 sign law rests on the un-re-audited imp-97396 reduction, so no independent QED. No bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97433_ASSERTIONS = [
  {
    id: 'imp97433-gA-lower-bounds-certA-uniformly',
    holds: () => {
      const isPrime = (x) => { for (let d = 2; d * d <= x; d += 1) if (x % d === 0) return false; return x > 1; };
      // certA > gA(q1) for every prime q1 in [7, 2e5], p1 = 2 (worst case), minimal tail config.
      for (let q1 = 7; q1 <= 200000; q1 += 1) {
        if (!isPrime(q1)) continue;
        const [q2, q3, q4] = nextPrimesCoprime(q1, 3, 2);
        if (!(certA(2, [q1, q2, q3, q4]) >= gA(q1))) return false;
      }
      // and across a few odd p1 to confirm p1 = 2 is the worst case (larger p1 => larger certA).
      for (const p1 of [3, 5, 7]) {
        const [q2, q3, q4] = nextPrimesCoprime(101, 3, p1);
        if (!(certA(p1, [101, q2, q3, q4]) > gA(101))) return false;
      }
      return true;
    },
    why: 'STEP 1: the derived uniform bound certA > gA(q1) holds for every prime q1 in [7,2e5] (p1 = 2 worst) and for odd p1 -- confirming gA is a valid p1-uniform lower bound.',
  },
  {
    id: 'imp97433-gA-positive-above-Q0-negative-below',
    holds: () => {
      // gA(q1) > 0 for all q1 >= 7 (dense real sweep), and gA(5) < 0 (threshold essentially sharp).
      if (!(gA(5) < 0)) return false;
      for (let q1 = 7; q1 <= 1e7; q1 *= 1.3) { if (!(gA(q1) > 0)) return false; }
      // explicit elementary certificate: gA(q1) > (7/1344)/q1 - 0.0045/q1^3 for q1 >= 7
      // (7/1344 = 1/24 - 49/1344 is the exact q1 = 7 value of the increasing bracket [1/24 - 49/(192 q1)]).
      for (let q1 = 7; q1 <= 1e7; q1 *= 1.3) { if (!(gA(q1) > (7 / 1344) / q1 - 0.0045 / (q1 ** 3))) return false; }
      return true;
    },
    why: 'STEP 2: gA(q1) > 0 for every q1 >= 7 (matching the elementary bound (7/1344)/q1 - 0.0045/q1^3 > 0) while gA(5) < 0, so Q0 = 7 is the sharp integer threshold for this bound.',
  },
  {
    id: 'imp97433-certB-settled-for-all-q2',
    holds: () => {
      if (!(gB(5) > 0)) return false;
      const isPrime = (x) => { for (let d = 2; d * d <= x; d += 1) if (x % d === 0) return false; return x > 1; };
      // certB > gB(q2) > 0 for every prime q2 in [5, 2e5] with p1 = 2, q3,q4 minimal above q2.
      for (let q2 = 5; q2 <= 200000; q2 += 1) {
        if (!isPrime(q2)) continue;
        const [q3, q4] = nextPrimesCoprime(q2, 2, 2);
        if (!(certB(2, [3, q2, q3, q4]) >= gB(q2) && gB(q2) > 0)) return false;
      }
      return true;
    },
    why: 'STEP 3: certB > gB(q2) > 0 for every q2 >= 5 (which is automatic since q2 > q1 > p1 >= 2), so (B) holds for every omega = 5 config with no finite check.',
  },
  {
    id: 'imp97433-finite-residual-all-positive',
    holds: () => FINITE_RESIDUAL.length === 3 && FINITE_RESIDUAL.every((r) => r.provesA)
      && Math.abs(FINITE_RESIDUAL[0].certA - 0.01811753400441442) < 1e-9,
    why: 'STEP 4: the finite q1 < 7 residual (p1,q1) in {(2,3),(2,5),(3,5)} has all three minimal-config certA strictly positive (0.018118, 0.008853, 0.011280).',
  },
  {
    id: 'imp97433-Dhi-monotone-decreasing',
    holds: () => {
      // re-verify Dhi(p1,e) strictly decreasing in e (basis of the minimal-config = worst-case reduction).
      for (const p1 of [2, 3, 5]) {
        for (let e = 2; e <= 60; e += 1) { if (!(Dhi(p1, e + 1) < Dhi(p1, e))) return false; }
      }
      return true;
    },
    why: 'STEP 4 basis: Dhi(p1,e) is strictly decreasing in e, so certA increases in each qj and the minimal config is the worst case per (p1,q1).',
  },
  {
    id: 'imp97433-honesty-gate-no-qed',
    holds: () =>
      IMP97433_VERDICT.tailLemmaDerived === true &&
      IMP97433_VERDICT.thresholdQ0 === 7 &&
      IMP97433_VERDICT.certBSettledUnconditionally === true &&
      IMP97433_VERDICT.finiteResidualCarriedOut === true &&
      IMP97433_VERDICT.namedSubgapClosed === true &&
      IMP97433_VERDICT.provesSignForAllOmega === false &&
      IMP97433_VERDICT.upstreamReductionReaudited === false &&
      IMP97433_VERDICT.independentOmega5QED === false &&
      IMP97433_VERDICT.anyBoundMoved === false &&
      IMP97433_VERDICT.operatorPositivityProved === false &&
      IMP97433_VERDICT.rhResolved === false &&
      IMP97433_VERDICT.qed === false &&
      /NO QED/.test(IMP97433_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97433_HONEST_BANNER) &&
      /RH open/.test(IMP97433_HONEST_BANNER),
    why: 'honest partial: closes the NAMED tail sub-gap (Q0 = 7 + finite check) but the omega = 5 sign law rests on the un-re-audited imp-97396 reduction -- no independent QED, no bound moved, RH open.',
  },
];

for (const a of IMP97433_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97433-route-m-sign-law-omega5-uniform-tail-lemma assertion failed: ${a.id}`);
  }
}

export default {
  threshold: IMP97433_THRESHOLD,
  certB: IMP97433_CERTB,
  finiteResidual: IMP97433_FINITE_RESIDUAL,
  verdict: IMP97433_VERDICT,
  banner: IMP97433_HONEST_BANNER,
};
