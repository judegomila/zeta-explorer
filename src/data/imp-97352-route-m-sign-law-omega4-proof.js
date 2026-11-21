/**
 * @module imp-97352-route-m-sign-law-omega4-proof
 *
 * imp-97352 (proof, HONEST PARTIAL -- extends the imp-97333 sign law from omega <= 3 to omega <= 4 by a
 * fully rigorous domination injection, and locates the SHARP crossover at omega = 5):
 *
 * imp-97333 proved the Route M sign law
 *     T(b) = Sum_{e | b, e >= 2} mu(e) J(e - 1) < 0     (squarefree b),   J(n) = rho_n  Binet function,
 * elementarily for omega(b) <= 3 (RESULT 2) via the smallest-prime peel identity (RESULT 1)
 *     T(b) = - J(p1 - 1) + U(m),   U(m) = Sum_{e | m, e > 1} mu(e) D_{p1}(e),   D_{p1}(e) = J(e-1) - J(p1 e - 1),
 * where b = p1 m, p1 = smallest prime, m coprime to p1. It left omega >= 4 to the crude positive-part
 * certificate Upos(m) < J(p1-1) (RESULT 3, finite-omega only, Upos diverges). This module PROVES the sign
 * law for omega(b) = 4 outright -- for EVERY squarefree b, not just primorials -- and identifies the exact
 * omega at which the elementary method stops. RH open; NO QED; no bound on Lambda moves.
 *
 * -------------------------------------------------------------------------------
 * INGREDIENT (rigorous, NEW). D_{p1}(e) is STRICTLY DECREASING in e.
 * -------------------------------------------------------------------------------
 * imp-97333 used only "D_{p1}(e) > 0 and D_{p1}(e) < J(p1-1) for e >= p1". The omega=4 proof needs the
 * stronger monotonicity D_{p1}(a) < D_{p1}(c) for a > c, which is fully rigorous:
 *   1. From the Binet kernel J(m) = Int_0^inf g(t) e^{-m t} dt with g(t) = (1/t)(1/(e^t-1) - 1/t + 1/2),
 *      the derivative sign reduces to   dD_{p1}/de < 0  <==>  |Jp(e-1)| > p1 |Jp(p1 e - 1)|,
 *      where |Jp(m)| = -Jp(m) = Int_0^inf w(t) e^{-m t} dt,  w(t) = 1/(e^t-1) - 1/t + 1/2 > 0.
 *   2. w is INCREASING: w-prime(t) = 1/t^2 - e^t/(e^t-1)^2 >= 0  <==>  (e^t-1)^2 >= t^2 e^t
 *      <==>  2 sinh(t/2) >= t, true for all t >= 0 (sinh x >= x).
 *   3. Since w increasing, w(t) >= w(t/p1) pointwise, so (Laplace, substitute t = p1 s)
 *         |Jp(m)| = Int w(t) e^{-m t} dt  >=  Int w(t/p1) e^{-m t} dt = p1 Int w(s) e^{-p1 m s} ds = p1 |Jp(p1 m)|.
 *   4. Finally p1 e - 1 > p1 (e - 1) (as p1 > 1) and |Jp| decreasing (J convex) give
 *         p1 |Jp(p1 e - 1)| <= p1 |Jp(p1(e-1))| <= |Jp(e-1)|,   hence dD_{p1}/de < 0.
 * The single new analytic input beyond imp-97333 is the elementary inequality 2 sinh(t/2) >= t.
 *
 * -------------------------------------------------------------------------------
 * RESULT (rigorous). Elementary proof of the sign law for omega(b) = 4 (all squarefree b).
 * -------------------------------------------------------------------------------
 * Let b = p1 p2 p3 p4 (p1 < p2 < p3 < p4), m = p2 p3 p4. The divisors e > 1 of m and their mu split by
 * omega(e) into: level 1 (negative) {p2, p3, p4}; level 2 (POSITIVE) {p2 p3, p2 p4, p3 p4}; level 3
 * (negative) {p2 p3 p4}. Thus
 *     U(m) = -[D(p2)+D(p3)+D(p4)] + [D(p2 p3)+D(p2 p4)+D(p3 p4)] - D(p2 p3 p4).
 * Match each of the THREE level-2 positive terms to a DISTINCT level-1 negative term whose product is
 * strictly smaller (a product of two primes exceeds any single prime, so the bipartite graph level-2 x
 * level-1 is COMPLETE and, being 3 x 3, has a perfect matching), e.g.
 *     D(p2 p3) with D(p3),   D(p2 p4) with D(p4),   D(p3 p4) with D(p2).
 * By the INGREDIENT (D strictly decreasing) each pair D(larger) - D(smaller) < 0, so
 *     U(m) = [D(p2 p3)-D(p3)] + [D(p2 p4)-D(p4)] + [D(p3 p4)-D(p2)] - D(p2 p3 p4) < 0.
 * Hence T(b) = -J(p1-1) + U(m) < 0. The stronger fact U(m) < 0 holds -- the leading -J(p1-1) is not even
 * needed. This is PROVED for every squarefree b with omega = 4 (any smallest prime p1), extending the
 * imp-97333 elementary range from omega <= 3 to omega <= 4 with NO recourse to the divergent Upos bound.
 *
 * -------------------------------------------------------------------------------
 * CROSSOVER / OBSTRUCTION (why omega = 5 is the exact wall for the domination method).
 * -------------------------------------------------------------------------------
 * A level-2 positive term D(p_i p_j) can be dominated (paired to a smaller-product negative term) ONLY by
 * a level-1 negative term (any 3+-prime product is LARGER, giving D(pos) > D(neg), the wrong sign). With
 * n = omega - 1 primes in m there are C(n,2) level-2 positive terms and only n level-1 negative terms, so
 * a covering injection exists iff C(n,2) <= n, i.e. n <= 3, i.e. omega <= 4. At omega = 5 (n = 4) there
 * are C(4,2) = 6 level-2 positives but only 4 level-1 negatives: by Hall the injection fails with
 * deficiency 2, and the pure sign-and-order domination CANNOT certify T(b) < 0. (Higher even levels 4, 6,
 * ... always pair downward to the odd level just below, so level 2 vs level 1 is the sole binding
 * constraint.) Beyond omega = 4 one needs WEIGHTED domination -- a single level-1 term absorbing several
 * level-2 terms via their magnitudes, not just their signs -- which requires the quantitative inter-level
 * control that is exactly IMP97333_SIGN_TAIL_SUBGAP (the sign specialization of IMP97309_CANCELLATION_SUBGAP).
 * The crossover omega = 5 is where the level-2 positive count C(omega-1,2) first exceeds the level-1
 * negative count omega-1 -- the combinatorial onset of the genuine cancellation problem.
 *
 * -------------------------------------------------------------------------------
 * RESIDUAL (named sub-gap -- unchanged, now with a sharp method boundary).
 * -------------------------------------------------------------------------------
 *     IMP97333_SIGN_TAIL_SUBGAP still open for omega >= 5. This module SHARPENS the boundary: the
 *     elementary domination proof is now known to succeed for omega <= 4 and to fail (Hall deficiency)
 *     at exactly omega = 5. No bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97333-route-m-sign-law-proof-attempt.js (peel identity RESULT 1; elementary omega<=3 RESULT 2; positive-part certificate RESULT 3; subgap)
 * @see imp-97309-route-m-arith-tail-cancellation-assessment.js (complementary identity R(b)=mu(b)T(b); measured sign law; inter-level divergence)
 * @see imp-97289-route-m-arith-tail-o1-proof.js (Binet positive-kernel representation of J)
 *
 * Ticket: imp-97352 (proof, opus-4-8, api-pool). Honest partial: sign law PROVED elementarily for
 * omega = 4 (all squarefree b, via a rigorous D-monotonicity injection giving U(m) < 0), and the
 * domination method shown to fail at exactly omega = 5 (Hall deficiency C(4,2)=6 > 4). Tail omega >= 5
 * remains IMP97333_SIGN_TAIL_SUBGAP. NO bound moved; NO QED.
 */

const LOG2PI = Math.log(2 * Math.PI);

// -- log-Gamma (Lanczos g=7) and the Binet function J(n) = rho_n (matches imp-97333/97309). --
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

// -- the increasing kernel weight w(t) = 1/(e^t - 1) - 1/t + 1/2 (positive; the Laplace density of |Jp|) --
function wKernel(t) {
  if (t < 1e-4) return t / 12 - (t * t * t) / 720; // series 1/(e^t-1) = 1/t - 1/2 + t/12 - t^3/720 + ...
  return 1 / (Math.exp(t) - 1) - 1 / t + 0.5;
}
// -- |Jp(m)| = -J-prime(m) = Int_0^inf w(t) e^{-m t} dt (composite Simpson) --
function absJprime(m) {
  const h = 0.002, T = 200; const nSteps = Math.round(T / h); let s = 0;
  for (let i = 0; i <= nSteps; i += 1) {
    const t = i * h; const f = wKernel(t) * Math.exp(-m * t);
    s += (i === 0 || i === nSteps ? 1 : (i % 2 ? 4 : 2)) * f;
  }
  return (s * h) / 3;
}

// -- divisor list with mu and omega, for squarefree m given as an ascending prime list --
function divisorsMuOmega(primes) {
  let d = [{ d: 1, mu: 1, k: 0 }];
  for (const p of primes) {
    const nx = [];
    for (const it of d) { nx.push({ d: it.d, mu: it.mu, k: it.k }); nx.push({ d: it.d * p, mu: -it.mu, k: it.k + 1 }); }
    d = nx;
  }
  return d;
}
// -- the peel remainder U(m) = Sum_{e|m,e>1} mu(e) D_{p1}(e) --
function peelU(p1, mprimes) {
  let U = 0;
  for (const it of divisorsMuOmega(mprimes)) if (it.d > 1) U += it.mu * D(p1, it.d);
  return U;
}
// -- direct T(b) = Sum_{e|b,e>=2} mu(e) J(e-1), for cross-checking the peel form -J(p1-1)+U(m) --
function directT(bprimes) {
  let s = 0;
  for (const it of divisorsMuOmega(bprimes)) if (it.d >= 2) s += it.mu * J(it.d - 1);
  return s;
}
function choose2(n) { return (n * (n - 1)) / 2; }

// -- omega = 4 sample family (primorial + odd-p1 + spread), showing U(m) < 0 and T(b) < 0 universally --
const OMEGA4_SAMPLES = [
  [2, 3, 5, 7], [2, 3, 5, 11], [3, 5, 7, 11], [5, 7, 11, 13], [2, 7, 11, 13], [3, 7, 13, 17], [2, 3, 7, 101],
].map((b) => {
  const p1 = b[0]; const U = peelU(p1, b.slice(1)); const T = -J(p1 - 1) + U;
  return { b: b.join('*'), p1, U, T, peelMatchesDirect: Math.abs(T - directT(b)) < 1e-10, Uneg: U < 0, Tneg: T < 0 };
});

export const IMP97352_D_MONOTONE_INGREDIENT = Object.freeze({
  name: 'INGREDIENT (NEW) -- D_{p1}(e) = J(e-1) - J(p1 e - 1) is strictly decreasing in e',
  reduction: 'dD_{p1}/de < 0  <==>  |Jp(e-1)| > p1 |Jp(p1 e - 1)|,  |Jp(m)| = Int_0^inf w(t) e^{-m t} dt',
  kernel: 'w(t) = 1/(e^t - 1) - 1/t + 1/2 > 0 (the g(t) = w(t)/t Binet kernel times t)',
  wIncreasing: 'w-prime(t) = 1/t^2 - e^t/(e^t-1)^2 >= 0  <==>  (e^t-1)^2 >= t^2 e^t  <==>  2 sinh(t/2) >= t (true, sinh x >= x)',
  scaling: 'w increasing ==> w(t) >= w(t/p1) ==> |Jp(m)| >= p1 |Jp(p1 m)| (Laplace, t = p1 s); with p1 e - 1 > p1(e-1) and |Jp| decreasing, dD/de < 0',
  newInputBeyond97333: 'only the elementary inequality 2 sinh(t/2) >= t; imp-97333 used just D > 0 and D < J(p1-1)',
});

export const IMP97352_OMEGA4_PROOF = Object.freeze({
  name: 'RESULT -- elementary proof of the sign law for omega(b) = 4 (all squarefree b)',
  peel: 'b = p1 p2 p3 p4, m = p2 p3 p4: U(m) = -[D(p2)+D(p3)+D(p4)] + [D(p2p3)+D(p2p4)+D(p3p4)] - D(p2p3p4)',
  injection: 'the three level-2 positives match the three level-1 negatives (complete 3x3 bipartite graph, product of two primes > any single prime); D strictly decreasing ==> each pair D(larger)-D(smaller) < 0',
  conclusion: 'U(m) = [D(p2p3)-D(p3)] + [D(p2p4)-D(p4)] + [D(p3p4)-D(p2)] - D(p2p3p4) < 0, hence T(b) = -J(p1-1)+U(m) < 0; the stronger U(m) < 0 holds (leading -J(p1-1) not needed)',
  status: 'PROVED for every squarefree b with omega = 4 (any smallest prime p1); extends imp-97333 elementary range omega <= 3 to omega <= 4 without the divergent Upos bound',
});

export const IMP97352_CROSSOVER = Object.freeze({
  name: 'CROSSOVER / OBSTRUCTION -- the domination method succeeds iff omega <= 4',
  countingRule: 'level-2 positives = C(omega-1, 2); level-1 negatives = omega-1; covering injection exists iff C(omega-1,2) <= omega-1, i.e. omega <= 4',
  wall: 'omega = 5 (n = omega-1 = 4): C(4,2) = 6 level-2 positives but only 4 level-1 negatives -> Hall deficiency 2; level-3+ negatives have LARGER products (wrong sign), so cannot dominate level-2',
  higherLevels: 'even levels 4, 6, ... always pair downward to the odd level just below; level 2 vs level 1 is the sole binding constraint',
  beyond: 'omega >= 5 needs WEIGHTED domination (one level-1 term absorbing several level-2 terms by magnitude), i.e. the quantitative control that is IMP97333_SIGN_TAIL_SUBGAP (sign specialization of IMP97309_CANCELLATION_SUBGAP)',
});

export const IMP97352_VERDICT = Object.freeze({
  question: 'extend the imp-97333 sign law T(b) < 0 from omega <= 3 to omega >= 4',
  dMonotonicityRigorous: true,      // INGREDIENT -- 2 sinh(t/2) >= t
  signLawProvedOmega4: true,        // RESULT -- U(m) < 0 for all squarefree b with omega = 4
  peelMatchesDirect: true,          // cross-check of the peel form against direct T
  dominationWallOmega5: true,       // CROSSOVER -- Hall deficiency at exactly omega = 5
  provesSignForAllOmega: false,     // omega >= 5 remains open
  residualSubgap: 'IMP97333_SIGN_TAIL_SUBGAP',
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'HONEST PARTIAL extending imp-97333. The new rigorous ingredient (D_{p1} strictly decreasing, from ' +
    '2 sinh(t/2) >= t) upgrades the elementary domination argument from omega <= 3 to omega = 4: for every ' +
    'squarefree b with omega = 4 the three level-2 positive peel terms inject into the three level-1 ' +
    'negative terms, giving U(m) < 0 and hence T(b) < 0. The method has a SHARP wall at omega = 5, where ' +
    'the level-2 positive count C(omega-1,2) = 6 first exceeds the level-1 negative count omega-1 = 4 ' +
    '(Hall deficiency 2). omega >= 5 therefore still needs weighted inter-level cancellation, i.e. ' +
    'IMP97333_SIGN_TAIL_SUBGAP. No bound on Lambda moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97352_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Honest partial: the imp-97333 sign law T(b) < 0 is now ' +
  'PROVED elementarily for omega(b) = 4 (all squarefree b) via a rigorous D_{p1}-monotonicity injection ' +
  '(giving U(m) < 0), extending the previous omega <= 3 range. The elementary domination method fails at ' +
  'exactly omega = 5 (Hall deficiency: C(4,2)=6 level-2 positives vs 4 level-1 negatives), so omega >= 5 ' +
  'reduces to IMP97333_SIGN_TAIL_SUBGAP. No bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97352_ASSERTIONS = [
  {
    id: 'imp97352-w-strictly-increasing',
    holds: () => {
      for (let t = 0.005; t < 40; t += 0.005) if (!(wKernel(t + 0.001) > wKernel(t) - 1e-15)) return false;
      // and the analytic certificate 2 sinh(t/2) >= t on the same range
      for (let t = 0; t < 40; t += 0.01) if (!(2 * Math.sinh(t / 2) >= t - 1e-12)) return false;
      return true;
    },
    why: 'INGREDIENT: w(t) = 1/(e^t-1) - 1/t + 1/2 is increasing because 2 sinh(t/2) >= t; this drives |Jp(m)| >= p1 |Jp(p1 m)|.',
  },
  {
    id: 'imp97352-absJprime-scaling',
    holds: () => {
      for (const p1 of [2, 3, 5, 7]) for (let m = 1; m <= 50; m += 1) if (!(absJprime(m) >= p1 * absJprime(p1 * m) - 1e-11)) return false;
      return true;
    },
    why: 'INGREDIENT: |Jp(m)| >= p1 |Jp(p1 m)| (w increasing, Laplace scaling) -- the inequality that makes D_{p1} strictly decreasing.',
  },
  {
    id: 'imp97352-D-strictly-decreasing',
    holds: () => {
      for (const p1 of [2, 3, 5, 7]) for (let e = 2; e <= 120; e += 1) if (!(D(p1, e + 1) < D(p1, e))) return false;
      return true;
    },
    why: 'INGREDIENT: D_{p1}(e) = J(e-1) - J(p1 e - 1) strictly decreasing in e -- the fact used to sign each matched injection pair.',
  },
  {
    id: 'imp97352-omega4-U-negative-peel-matches-direct',
    holds: () => OMEGA4_SAMPLES.every((r) => r.Uneg && r.Tneg && r.peelMatchesDirect),
    why: 'RESULT: for every omega=4 squarefree sample (primorial, odd-p1, spread) the peel U(m) < 0 and T(b) < 0, and the peel form -J(p1-1)+U(m) reproduces the direct T(b) to < 1e-10.',
  },
  {
    id: 'imp97352-omega4-injection-dominates-each-level2',
    holds: () => {
      // for a representative omega=4 b, each level-2 positive is strictly dominated by a distinct level-1 negative
      const p1 = 2, p2 = 3, p3 = 5, p4 = 7;
      return D(p1, p2 * p3) < D(p1, p3) && D(p1, p2 * p4) < D(p1, p4) && D(p1, p3 * p4) < D(p1, p2);
    },
    why: 'RESULT: the explicit injection D(p2p3)<D(p3), D(p2p4)<D(p4), D(p3p4)<D(p2) (D decreasing, 2-prime product > single prime), so U(m) < 0.',
  },
  {
    id: 'imp97352-crossover-at-omega-5',
    holds: () => {
      // matchable iff C(omega-1,2) <= omega-1; true for omega<=4, false from omega=5
      for (let omega = 2; omega <= 4; omega += 1) if (!(choose2(omega - 1) <= omega - 1)) return false;
      for (let omega = 5; omega <= 9; omega += 1) if (choose2(omega - 1) <= omega - 1) return false;
      return choose2(4) === 6 && choose2(3) === 3;
    },
    why: 'CROSSOVER: the covering injection C(omega-1,2) <= omega-1 holds exactly for omega <= 4 and first fails at omega = 5 (6 level-2 positives vs 4 level-1 negatives) -- the sharp wall of the domination method.',
  },
  {
    id: 'imp97352-honesty-gate-no-qed',
    holds: () =>
      IMP97352_VERDICT.anyBoundMoved === false &&
      IMP97352_VERDICT.postsRigorousCeiling === false &&
      IMP97352_VERDICT.qed === false &&
      IMP97352_VERDICT.provesSignForAllOmega === false &&
      IMP97352_VERDICT.dMonotonicityRigorous === true &&
      IMP97352_VERDICT.signLawProvedOmega4 === true &&
      IMP97352_VERDICT.dominationWallOmega5 === true &&
      IMP97352_VERDICT.residualSubgap === 'IMP97333_SIGN_TAIL_SUBGAP' &&
      /NO QED/.test(IMP97352_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97352_HONEST_BANNER) &&
      /RH open/.test(IMP97352_HONEST_BANNER),
    why: 'honest partial: sign law proved for omega = 4 and the domination method shown to wall at omega = 5 -- no proof for all omega, no bound moved, no rigorous ceiling, no QED.',
  },
];

for (const a of IMP97352_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97352-route-m-sign-law-omega4-proof assertion failed: ${a.id}`);
  }
}

export default {
  dMonotoneIngredient: IMP97352_D_MONOTONE_INGREDIENT,
  omega4Proof: IMP97352_OMEGA4_PROOF,
  crossover: IMP97352_CROSSOVER,
  verdict: IMP97352_VERDICT,
  banner: IMP97352_HONEST_BANNER,
  omega4Samples: OMEGA4_SAMPLES,
};
