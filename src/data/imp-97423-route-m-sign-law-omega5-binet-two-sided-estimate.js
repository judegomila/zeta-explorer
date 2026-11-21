/**
 * @module imp-97423-route-m-sign-law-omega5-binet-two-sided-estimate
 *
 * imp-97423 (proof, HONEST PARTIAL -- supplies the quantitative TWO-SIDED Binet estimate that imp-97396
 * flagged as the exact missing ingredient for the omega = 5 Route M sign law). imp-97396 reduced the whole
 * omega = 5 sign law T(b) < 0 to two explicit per-prime inequalities
 *     (A) D(q1) > D(q1 q2) + D(q1 q3) + D(q1 q4)      and      (B) D(q2) > D(q2 q3) + D(q2 q4),
 * where D_{p1}(e) = J(e - 1) - J(p1 e - 1) and J is the Binet function, and pinned the OBSTRUCTION as the
 * elementary toolkit giving only ONE-SIDED control of D (D > 0, D strictly decreasing): it cannot bound a
 * single D value from BELOW against a SUM of smaller-argument D values from above. This module derives the
 * missing two-sided estimate and applies it. RH open; NO QED; no bound on Lambda moves; no refereed bound is changed.
 *
 * -------------------------------------------------------------------------------
 * STEP 1 -- the rigorous two-sided Binet bracket (classical enveloping series).
 * -------------------------------------------------------------------------------
 * The Binet function J(n) = log Gamma(n+1) - [n log n - n + (1/2) log(2 pi n)] has the asymptotic expansion
 *     J(n) ~ 1/(12 n) - 1/(360 n^3) + 1/(1260 n^5) - ...  =  Sum_{k>=1} B_{2k} / [(2k-1)(2k) n^{2k-1}].
 * This series is ENVELOPING (a Stieltjes/completely-monotonic remainder): the truncation error after any term
 * is bounded in absolute value by the first neglected term AND carries that term's sign. The first two
 * truncations give the rigorous double inequality, valid for every real n >= 1,
 *     1/(12 n) - 1/(360 n^3)  <  J(n)  <  1/(12 n).                                             (BRACKET)
 * (Upper: first neglected term -1/(360 n^3) < 0 so J below 1/(12 n). Lower: first neglected term
 * +1/(1260 n^5) > 0 so J above 1/(12 n) - 1/(360 n^3).) This is the two-sided control the elementary toolkit
 * lacked.
 *
 * -------------------------------------------------------------------------------
 * STEP 2 -- explicit two-sided bounds on D_{p1}(e) = J(e - 1) - J(p1 e - 1).
 * -------------------------------------------------------------------------------
 * Subtracting the BRACKET across the two arguments n1 = e - 1 and n2 = p1 e - 1 (a difference, so the lower
 * bound of D pairs the lower bound of J(n1) with the UPPER bound of J(n2), and vice versa):
 *     Dlo(p1,e) = [1/(12 n1) - 1/(360 n1^3)] - [1/(12 n2)]                  <=  D_{p1}(e)
 *     Dhi(p1,e) = [1/(12 n1)]               - [1/(12 n2) - 1/(360 n2^3)]    >=  D_{p1}(e).
 * Both hold for e >= 2 (then n1 = e - 1 >= 1). To leading order, using n2 = p1 e - 1 > p1(e-1) = p1 n1,
 *     D_{p1}(e) = (1 - 1/p1)/(12 e) + O(1/e^2),
 * recovering the imp-97396 leading form with an EXPLICIT, rigorously bracketed remainder.
 *
 * -------------------------------------------------------------------------------
 * STEP 3 -- the two-sided estimate certifies (A) and (B) with a strictly positive margin.
 * -------------------------------------------------------------------------------
 * Form the rigorous CERTIFICATES (any positive value proves the inequality, since Dlo <= D <= Dhi):
 *     certA(p1; q) = Dlo(p1, q1) - [Dhi(p1, q1 q2) + Dhi(p1, q1 q3) + Dhi(p1, q1 q4)]   <=   D(q1) - RHS(A)
 *     certB(p1; q) = Dlo(p1, q2) - [Dhi(p1, q2 q3) + Dhi(p1, q2 q4)]                     <=   D(q2) - RHS(B).
 * certA > 0 ==> (A);  certB > 0 ==> (B). Across every omega = 5 family sampled (primorial, odd-p1, wide
 * spread, large trailing prime) both certificates are strictly positive: e.g. certA(2; 3,5,7,11) = 0.01812,
 * certB(2; 3,5,7,11) = 0.00951. So the two-sided estimate closes the one-sided gap imp-97396 named -- it
 * bounds the single D value from below and the sum from above simultaneously.
 *
 * -------------------------------------------------------------------------------
 * STEP 4 -- monotonicity reduction (the infinitude in q2, q3, q4 collapses to the minimal config).
 * -------------------------------------------------------------------------------
 * Dhi(p1, e) is strictly DECREASING in e (both J-terms decrease with their argument, which grows with e). In
 * certA the LHS Dlo(p1, q1) depends only on (p1, q1) while each RHS term Dhi(p1, q1 qj) strictly decreases as
 * qj grows. Hence certA is strictly INCREASING in each of q2, q3, q4 (same for certB in q3, q4). The WORST
 * (smallest-certificate) omega = 5 configuration for a fixed (p1, q1) is therefore q2, q3, q4 = the three
 * smallest primes above q1 coprime to p1. This reduces the infinitely many q-tuples to a single minimal
 * config per (p1, q1) -- a genuine finite-per-row reduction.
 *
 * -------------------------------------------------------------------------------
 * THE PRECISE RESIDUAL (why this is an honest partial, not a QED).
 * -------------------------------------------------------------------------------
 * On the minimal configs the certificate margin is strictly positive but DECAYS like the leading term:
 *     certA(p1; q1, minimal) ~ (1 - 1/p1)/(12 q1) * [1 - (1/q2 + 1/q3 + 1/q4)]  ->  0+   as q1 -> infinity,
 * e.g. certA at q1 = 10^6 (p1 = 2) is 4.167e-8 > 0 but no positive floor is attained. So the residual is NOT
 * the two-sided estimate (DERIVED here) nor the q2,q3,q4 direction (reduced here), but a UNIFORM-in-(p1, q1)
 * TAIL LEMMA: an explicit q1-threshold Q0 above which the O(1/e^3) Binet remainder in Dlo/Dhi is dominated by
 * the (1 - 1/p1)/(12 q1)[1 - Sum 1/qj] leading margin, leaving only q1 < Q0 as a finite check. The bracket
 * (STEP 1) makes that remainder explicit (the sole extra terms are -1/(360 n1^3) and +1/(360 n2^3), each
 * O(1/q1^3), against a leading margin ~ c/q1), so the tail lemma is now a bounded elementary calculation --
 * but it is not carried out here. Hence: two-sided estimate DERIVED, (A),(B) certified with positive margin
 * across families, q-direction reduced to minimal configs; the uniform (p1, q1) tail lemma is the named
 * remaining sub-gap. This localizes and shrinks IMP97333_SIGN_TAIL_SUBGAP at omega = 5 from "need a
 * two-sided Binet estimate" (imp-97396) to "need a uniform tail threshold for the now-explicit remainder".
 *
 * @see imp-97396-route-m-sign-law-omega5-weighted-reduction.js (reduces omega=5 to (A),(B); names this exact gap)
 * @see imp-97352-route-m-sign-law-omega4-proof.js (omega<=4 injection proof; one-sided toolkit; Hall wall at omega=5)
 * @see imp-97333-route-m-sign-law-proof-attempt.js (peel identity; IMP97333_SIGN_TAIL_SUBGAP)
 *
 * Ticket: imp-97423 (proof, opus-4-8, api-pool). Honest partial: derives the rigorous two-sided Binet estimate
 * (BRACKET -> Dlo, Dhi), certifies (A),(B) with strictly positive margin across the omega = 5 families,
 * reduces the q2,q3,q4 infinitude to minimal configs by monotonicity, and names the remaining residual (a
 * uniform-in-(p1,q1) tail lemma for the now-explicit O(1/e^3) remainder). NO proof for all omega = 5; NO bound
 * moved; NO QED.
 */

const LOG2PI = Math.log(2 * Math.PI);

// -- log-Gamma (Lanczos g=7) and the exact-reference Binet J(n) (matches imp-97333/97352/97396). --
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

// -- STEP 1: the rigorous enveloping Binet bracket 1/(12n) - 1/(360 n^3) < J(n) < 1/(12n). --
function Jlo(n) { return 1 / (12 * n) - 1 / (360 * n * n * n); }
function Jhi(n) { return 1 / (12 * n); }

// -- STEP 2: explicit two-sided bounds on D_{p1}(e) = J(e-1) - J(p1 e - 1) (n1 = e-1, n2 = p1 e - 1). --
function Dlo(p1, e) { return Jlo(e - 1) - Jhi(p1 * e - 1); }
function Dhi(p1, e) { return Jhi(e - 1) - Jlo(p1 * e - 1); }

// -- STEP 3: rigorous certificates (positive value proves the inequality). --
function certA(p1, q) { const [q1, q2, q3, q4] = q; return Dlo(p1, q1) - (Dhi(p1, q1 * q2) + Dhi(p1, q1 * q3) + Dhi(p1, q1 * q4)); }
function certB(p1, q) { const [q1, q2, q3, q4] = q; return Dlo(p1, q2) - (Dhi(p1, q2 * q3) + Dhi(p1, q2 * q4)); }

// -- helper: the count smallest primes above `after` coprime to p1 (STEP 4 minimal config). --
function nextPrimesCoprime(after, count, p1) {
  const isPrime = (x) => { for (let d = 2; d * d <= x; d += 1) if (x % d === 0) return false; return x > 1; };
  const out = []; let n = after + 1;
  while (out.length < count) { if (isPrime(n) && n % p1 !== 0) out.push(n); n += 1; }
  return out;
}

// -- omega = 5 families (same panel as imp-97396) plus large-trailing and wide-spread stress cases. --
const OMEGA5_SAMPLES = [
  [2, 3, 5, 7, 11], [2, 3, 5, 7, 13], [2, 5, 7, 11, 13], [3, 5, 7, 11, 13],
  [2, 3, 7, 13, 101], [2, 3, 5, 11, 1009], [5, 7, 11, 13, 17], [2, 3, 5, 7, 9973],
].map((b) => {
  const p1 = b[0]; const q = b.slice(1);
  const cA = certA(p1, q); const cB = certB(p1, q);
  const trueA = D(p1, q[0]) > D(p1, q[0] * q[1]) + D(p1, q[0] * q[2]) + D(p1, q[0] * q[3]);
  const trueB = D(p1, q[1]) > D(p1, q[1] * q[2]) + D(p1, q[1] * q[3]);
  const bracketsD = Dlo(p1, q[0]) < D(p1, q[0]) && D(p1, q[0]) < Dhi(p1, q[0]);
  return { b: b.join('*'), p1, certA: cA, certB: cB, provesA: cA > 0, provesB: cB > 0, trueA, trueB, bracketsD };
});

export const IMP97423_BRACKET = Object.freeze({
  name: 'STEP 1 -- rigorous enveloping two-sided Binet bracket',
  statement: '1/(12 n) - 1/(360 n^3) < J(n) < 1/(12 n) for all n >= 1',
  why: 'the Binet asymptotic series 1/(12n) - 1/(360 n^3) + 1/(1260 n^5) - ... is enveloping (Stieltjes/completely-monotonic remainder): truncation error is bounded by, and signed as, the first neglected term',
  supplies: 'the TWO-SIDED control the imp-97396 elementary toolkit lacked (it had only D > 0 and D decreasing)',
});

export const IMP97423_D_BOUNDS = Object.freeze({
  name: 'STEP 2 -- explicit two-sided bounds on D_{p1}(e) = J(e-1) - J(p1 e - 1)',
  Dlo: 'Dlo(p1,e) = [1/(12(e-1)) - 1/(360(e-1)^3)] - 1/(12(p1 e - 1))  <=  D_{p1}(e)',
  Dhi: 'Dhi(p1,e) = 1/(12(e-1)) - [1/(12(p1 e - 1)) - 1/(360(p1 e - 1)^3)]  >=  D_{p1}(e)',
  leadingOrder: 'D_{p1}(e) = (1 - 1/p1)/(12 e) + O(1/e^2), recovering the imp-97396 leading form with an EXPLICIT bracketed remainder',
  validFor: 'e >= 2 (so e - 1 >= 1); the sole remainder terms are -1/(360(e-1)^3) and +1/(360(p1 e - 1)^3)',
});

export const IMP97423_CERTIFICATION = Object.freeze({
  name: 'STEP 3 -- the two-sided estimate certifies (A) and (B) with strictly positive margin',
  certA: 'certA(p1;q) = Dlo(p1,q1) - [Dhi(p1,q1q2) + Dhi(p1,q1q3) + Dhi(p1,q1q4)] <= D(q1) - RHS(A); certA > 0 ==> (A)',
  certB: 'certB(p1;q) = Dlo(p1,q2) - [Dhi(p1,q2q3) + Dhi(p1,q2q4)] <= D(q2) - RHS(B); certB > 0 ==> (B)',
  witness: 'certA(2;3,5,7,11) = 0.01812, certB(2;3,5,7,11) = 0.00951 -- both strictly positive across every omega = 5 family sampled',
  closesGap: 'bounds the single D value from BELOW and the sum from ABOVE simultaneously -- exactly the one-sided limitation imp-97396 named',
});

export const IMP97423_REDUCTION = Object.freeze({
  name: 'STEP 4 -- monotonicity reduction of the q2,q3,q4 infinitude to a minimal config',
  monotone: 'Dhi(p1,e) strictly decreasing in e ==> certA strictly increasing in each of q2,q3,q4 (certB in q3,q4)',
  worstConfig: 'for fixed (p1,q1) the smallest certificate is at q2,q3,q4 = the three smallest primes above q1 coprime to p1',
  effect: 'collapses the infinitely many q-tuples to ONE minimal config per (p1,q1) -- a genuine finite-per-row reduction',
});

export const IMP97423_RESIDUAL = Object.freeze({
  name: 'PRECISE RESIDUAL -- the remaining sub-gap after this derivation',
  decays: 'on minimal configs certA(p1;q1) ~ (1-1/p1)/(12 q1)[1 - (1/q2+1/q3+1/q4)] -> 0+ as q1 -> infinity (positive, no floor)',
  tailWitness: 'certA at q1 = 10^6 (p1=2) is 4.167e-8 > 0 -- strictly positive but a finite check cannot cover all q1',
  needed: 'a UNIFORM-in-(p1,q1) tail lemma: an explicit threshold Q0 above which the O(1/q1^3) remainder is dominated by the leading margin, leaving q1 < Q0 as a finite check',
  nowElementary: 'the bracket makes the remainder explicit (only -1/(360(e-1)^3), +1/(360(p1 e - 1)^3)), so the tail lemma is a bounded elementary calculation -- not carried out here',
  localizes: 'shrinks IMP97333_SIGN_TAIL_SUBGAP at omega=5 from "need a two-sided Binet estimate" (imp-97396) to "need a uniform tail threshold for the now-explicit remainder"',
});

export const IMP97423_VERDICT = Object.freeze({
  question: 'does the two-sided Binet estimate certify the omega = 5 inequalities (A),(B) for all squarefree b?',
  twoSidedEstimateDerived: true,        // BRACKET -> explicit Dlo, Dhi
  certifiesABWithMargin: true,          // certA, certB > 0 across the families
  qDirectionReducedToMinimalConfig: true, // monotonicity in q2,q3,q4
  provesABForAllOmega5: false,          // needs the uniform (p1,q1) tail lemma
  provesSignForAllOmega: false,
  residualSubgap: 'IMP97333_SIGN_TAIL_SUBGAP (localized: uniform (p1,q1) tail lemma for the explicit O(1/e^3) remainder)',
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
  conclusion:
    'HONEST PARTIAL. Supplies the quantitative two-sided Binet estimate imp-97396 flagged as the missing ' +
    'ingredient: the enveloping bracket 1/(12n) - 1/(360 n^3) < J(n) < 1/(12n) gives explicit Dlo,Dhi with ' +
    'D_{p1}(e) = (1-1/p1)/(12 e) + O(1/e^2), which certifies both per-prime inequalities (A) D(q1) > ' +
    'D(q1q2)+D(q1q3)+D(q1q4) and (B) D(q2) > D(q2q3)+D(q2q4) with strictly positive margin across the ' +
    'omega = 5 families, and by monotonicity of Dhi reduces the q2,q3,q4 infinitude to one minimal config ' +
    'per (p1,q1). The margin decays like (1-1/p1)/(12 q1)[1 - Sum 1/qj] -> 0+ with no positive floor, so a ' +
    'finite check cannot close all q1: the residual is a uniform-in-(p1,q1) tail lemma for the now-explicit ' +
    'O(1/q1^3) remainder. So the two-sided estimate is DERIVED and the one-sided obstruction is removed, but ' +
    'the omega = 5 sign law is not yet proved. No bound on Lambda moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97423_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Honest partial: derives the rigorous two-sided Binet ' +
  'estimate (enveloping bracket 1/(12n) - 1/(360 n^3) < J(n) < 1/(12n) -> explicit Dlo,Dhi with D(e) = ' +
  '(1-1/p1)/(12 e) + O(1/e^2)) that imp-97396 named as missing, certifies the omega = 5 inequalities (A),(B) ' +
  'with strictly positive margin across the families, and reduces the q2,q3,q4 infinitude to a minimal ' +
  'config by monotonicity. The margin -> 0+ as q1 -> infinity with no floor, so the residual is a ' +
  'uniform-in-(p1,q1) tail lemma for the now-explicit O(1/q1^3) remainder. No bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97423_ASSERTIONS = [
  {
    id: 'imp97423-binet-bracket-brackets-J',
    holds: () => {
      for (const n of [2, 3, 4, 6, 10, 30, 100, 1000]) { if (!(Jlo(n) < J(n) && J(n) < Jhi(n))) return false; }
      return true;
    },
    why: 'STEP 1: the enveloping bracket 1/(12n) - 1/(360 n^3) < J(n) < 1/(12n) holds across n = 2..1000 (rigorous two-sided Binet control).',
  },
  {
    id: 'imp97423-D-bounds-bracket-D',
    holds: () => OMEGA5_SAMPLES.every((r) => r.bracketsD)
      && [[2, 3], [2, 15], [3, 5], [2, 35], [5, 7]].every(([p1, e]) => Dlo(p1, e) < D(p1, e) && D(p1, e) < Dhi(p1, e)),
    why: 'STEP 2: the explicit Dlo(p1,e) <= D_{p1}(e) <= Dhi(p1,e) brackets the exact D across the sampled arguments.',
  },
  {
    id: 'imp97423-certificates-prove-A-and-B',
    holds: () => OMEGA5_SAMPLES.every((r) => r.provesA && r.provesB && r.trueA && r.trueB),
    why: 'STEP 3: certA > 0 and certB > 0 across every omega = 5 family, so the two-sided estimate PROVES (A),(B) on each sampled b (matching the true inequalities).',
  },
  {
    id: 'imp97423-witness-values-stable',
    holds: () => {
      const cA = certA(2, [3, 5, 7, 11]); const cB = certB(2, [3, 5, 7, 11]);
      return Math.abs(cA - 0.01811753400441442) < 1e-9 && Math.abs(cB - 0.009508734) < 1e-6;
    },
    why: 'STEP 3 witness: certA(2;3,5,7,11) = 0.01812 and certB(2;3,5,7,11) = 0.00951 reproduce to the stored literals.',
  },
  {
    id: 'imp97423-monotone-reduction-worst-is-minimal',
    holds: () => {
      // certA strictly increases when any qj grows: growing q4 from its minimal value must not lower certA
      const p1 = 2; const q1 = 3;
      const [q2, q3, q4] = nextPrimesCoprime(q1, 3, p1);
      const base = certA(p1, [q1, q2, q3, q4]);
      const grown = certA(p1, [q1, q2, q3, q4 + 100]); // any larger admissible q4
      return grown > base && base > 0;
    },
    why: 'STEP 4: certA strictly increases as q4 grows, confirming the worst config is the minimal-primes one (finite-per-row reduction).',
  },
  {
    id: 'imp97423-residual-margin-decays-but-positive',
    holds: () => {
      // large-q1 minimal config: certificate strictly positive but tiny (margin -> 0+, no positive floor)
      const p1 = 2; const q1 = 1000003;
      const [q2, q3, q4] = nextPrimesCoprime(q1, 3, p1);
      const cA = certA(p1, [q1, q2, q3, q4]);
      return cA > 0 && cA < 1e-6;
    },
    why: 'RESIDUAL: at q1 = 10^6 the certificate is 4.167e-8 > 0 but < 1e-6 -- strictly positive yet with no floor, so a finite check cannot cover all q1 (the named tail-lemma sub-gap).',
  },
  {
    id: 'imp97423-honesty-gate-no-qed',
    holds: () =>
      IMP97423_VERDICT.twoSidedEstimateDerived === true &&
      IMP97423_VERDICT.certifiesABWithMargin === true &&
      IMP97423_VERDICT.qDirectionReducedToMinimalConfig === true &&
      IMP97423_VERDICT.provesABForAllOmega5 === false &&
      IMP97423_VERDICT.provesSignForAllOmega === false &&
      IMP97423_VERDICT.anyBoundMoved === false &&
      IMP97423_VERDICT.postsRigorousCeiling === false &&
      IMP97423_VERDICT.operatorPositivityProved === false &&
      IMP97423_VERDICT.rhResolved === false &&
      IMP97423_VERDICT.qed === false &&
      /IMP97333_SIGN_TAIL_SUBGAP/.test(IMP97423_VERDICT.residualSubgap) &&
      /NO QED/.test(IMP97423_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97423_HONEST_BANNER) &&
      /RH open/.test(IMP97423_HONEST_BANNER),
    why: 'honest partial: two-sided estimate derived and (A),(B) certified with margin plus q-direction reduced, but NOT proved for all omega = 5 -- no bound moved, no rigorous ceiling, no operator positivity, RH open, no QED.',
  },
];

for (const a of IMP97423_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97423-route-m-sign-law-omega5-binet-two-sided-estimate assertion failed: ${a.id}`);
  }
}

export default {
  bracket: IMP97423_BRACKET,
  dBounds: IMP97423_D_BOUNDS,
  certification: IMP97423_CERTIFICATION,
  reduction: IMP97423_REDUCTION,
  residual: IMP97423_RESIDUAL,
  verdict: IMP97423_VERDICT,
  banner: IMP97423_HONEST_BANNER,
  omega5Samples: OMEGA5_SAMPLES,
};
