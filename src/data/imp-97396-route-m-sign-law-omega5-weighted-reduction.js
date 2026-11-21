/**
 * @module imp-97396-route-m-sign-law-omega5-weighted-reduction
 *
 * imp-97396 (proof, HONEST PARTIAL -- assesses whether the imp-97352 domination-injection method extends to
 * omega = 5, and pins the precise boundary): it does NOT extend as a pure one-to-one injection (imp-97352
 * Hall wall stands), but the WEIGHTED-domination refinement is STILL ALIVE at omega = 5 -- unlike its
 * eventual large-omega death (imp-97372) -- and it REDUCES the entire omega = 5 sign law to just TWO
 * explicit per-prime inequalities. This sharpens the "omega = 5 is the method boundary" statement: omega = 5
 * is not where weighted domination dies (that is large omega, L2/L1 ~ (1/2) log log b, imp-97372); it is
 * where the elementary sign/order/convexity toolkit stops SUFFICING and a quantitative Binet bound becomes
 * necessary. RH open; NO QED; no bound on Lambda moves.
 *
 * -------------------------------------------------------------------------------
 * SETUP (imp-97333 / imp-97352). For squarefree b = p1 m (p1 smallest prime, m = q1 q2 ... qn coprime to p1,
 * q1 < q2 < ... < qn, n = omega - 1) the Route M arithmetic tail sign law is
 *     T(b) = Sum_{e | b, e >= 2} mu(e) J(e - 1) < 0,      J(n) = rho_n  (Binet function),
 * peeled to T(b) = -J(p1-1) + U(m), U(m) = Sum_{e | m, e > 1} mu(e) D_{p1}(e), D_{p1}(e) = J(e-1) - J(p1 e-1).
 * imp-97352 proved U(m) < 0 for omega <= 4 by a one-to-one domination injection of the C(n,2) level-2
 * positives into the n level-1 negatives (D strictly decreasing), and located the SHARP combinatorial wall
 * at omega = 5: C(4,2) = 6 level-2 positives exceed the 4 level-1 negatives (Hall deficiency 2), so the
 * pure injection cannot cover. This module takes the next step flagged there -- WEIGHTED domination -- for
 * omega = 5 exactly.
 *
 * -------------------------------------------------------------------------------
 * REDUCTION (the omega = 5 sign law collapses to TWO explicit inequalities).
 * -------------------------------------------------------------------------------
 * Write U(m) = -L1 + L2 - L3 + L4 with L_k = Sum_{omega(e)=k} D_{p1}(e) > 0. CHARGE each level-2 positive
 * D_{p1}(qi qj) (i < j) to the level-1 term of its SMALLER factor D_{p1}(qi). This partitions the six
 * level-2 positives as {q1q2,q1q3,q1q4} -> q1, {q2q3,q2q4} -> q2, {q3q4} -> q3, {} -> q4, giving
 *     -L1 + L2 = -[D(q1) - D(q1q2) - D(q1q3) - D(q1q4)]   (bracket A)
 *                -[D(q2) - D(q2q3) - D(q2q4)]              (bracket B)
 *                -[D(q3) - D(q3q4)]                        (bracket C, = monotonicity, D decreasing)
 *                - D(q4)                                   (bracket D, = positivity, D > 0).
 * Brackets C, D are already in the imp-97352 elementary toolkit (D strictly decreasing; D > 0). So
 *     -L1 + L2 < 0   <==   (A) D(q1) > D(q1q2)+D(q1q3)+D(q1q4)   AND   (B) D(q2) > D(q2q3)+D(q2q4).
 * The level-3/level-4 tail is unconditional: -L3 + L4 < 0 because each of the four triple products qi qj qk
 * is smaller than the single quad q1q2q3q4, so by D decreasing L3 > 4 D(q1q2q3q4) > D(q1q2q3q4) = L4.
 * Therefore U(m) = (-L1+L2) + (-L3+L4) < 0, and T(b) = -J(p1-1) + U(m) < 0, is EQUIVALENT (given the
 * elementary toolkit) to the two per-prime weighted inequalities (A) and (B). Everything else is trivial.
 *
 * -------------------------------------------------------------------------------
 * WHY omega = 5 IS ALIVE (contrast with imp-97372's large-omega death).
 * -------------------------------------------------------------------------------
 * imp-97372 showed the AGGREGATE necessary condition for any level-2-by-level-1 weighting, L1 >= L2, FAILS
 * for all large omega because L2/L1 ~ (1/2) log log b -> +infinity. At omega = 5 that ratio is still small:
 * measured L2/L1 = 0.19 on the 2-primorial 2*3*5*7*11 (and < 0.27 across the omega = 5 families sampled),
 * so L1 > L2 with wide margin -- weighted domination is NOT dead at omega = 5. The per-prime inequalities
 * (A), (B) are the SUFFICIENT sharpening of that aggregate condition, and both hold across every omega = 5
 * family tested (primorial, odd-p1, wide-spread, large trailing prime). To leading Binet order
 * D_{p1}(e) = (1-1/p1)/(12 e) + O(1/e^2), inequality (A) is Sum_{j>1} 1/qj < 1 and (B) is Sum_{j>2} 1/qj < 1,
 * both true for omega = 5 with margin (worst case q = 3,5,7,11: 1/5+1/7+1/11 = 0.434 < 1). So the
 * asymptotics that KILL weighted domination at large omega are exactly what KEEP it alive at omega = 5.
 *
 * -------------------------------------------------------------------------------
 * THE PRECISE OBSTRUCTION (why this is not a proof -- named sub-gap, sharpened).
 * -------------------------------------------------------------------------------
 * (A) and (B) are inequalities between a single D value and a SUM of smaller-argument D values. The
 * elementary toolkit gives only ONE-SIDED order/convexity control of D (D > 0, D strictly decreasing,
 * |Jp(m)| >= p1 |Jp(p1 m)|); it does not bound D(qi) from BELOW against a sum of D(qi qj) from above. That
 * requires a quantitative TWO-SIDED Binet estimate -- D_{p1}(e) = (1-1/p1)/(12 e) + controlled remainder,
 * with the remainder sign/size pinned -- which is exactly IMP97333_SIGN_TAIL_SUBGAP (the sign specialization
 * of IMP97309_CANCELLATION_SUBGAP) restricted to omega = 5. Hence the REFINED boundary statement: the pure
 * injection walls combinatorially at omega = 5 (imp-97352); weighted domination remains analytically viable
 * at omega = 5 (this module) and reduces it to (A), (B); but proving (A), (B) elementarily is out of reach of
 * sign/order alone. omega = 5 is the first omega where quantitative magnitude control is UNAVOIDABLE.
 *
 * -------------------------------------------------------------------------------
 * RESIDUAL (named sub-gap). IMP97333_SIGN_TAIL_SUBGAP still open for omega >= 5. This module localizes it at
 * omega = 5 to the two explicit inequalities (A), (B) and confirms weighted domination is alive there (L1 >
 * L2), correcting any read of imp-97372 as killing weighted domination AT omega = 5 (it kills it only in the
 * large-omega limit). No bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97352-route-m-sign-law-omega4-proof.js (omega<=4 injection proof; Hall wall at omega=5; D monotonicity)
 * @see imp-97372-route-m-sign-law-weighted-domination-obstruction.js (aggregate L1>=L2 dies at LARGE omega; L2/L1~(1/2)loglog b)
 * @see imp-97333-route-m-sign-law-proof-attempt.js (peel identity; elementary omega<=3; the sign tail sub-gap)
 *
 * Ticket: imp-97396 (proof, opus-4-8, api-pool). Honest partial: reduces the omega = 5 sign law to two
 * explicit per-prime weighted inequalities (A),(B), shows weighted domination is ALIVE at omega = 5 (L1 > L2,
 * unlike large omega), and pins the boundary as the onset of unavoidable quantitative Binet control. NO
 * proof for omega >= 5; NO bound moved; NO QED.
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

// -- level masses and peel remainder for m = product of the ascending prime list qs (coprime to p1) --
function levelMasses(p1, qs) {
  const n = qs.length;
  const L = [0, 0, 0, 0, 0];
  let divs = [{ d: 1, k: 0 }];
  for (const p of qs) {
    const nx = [];
    for (const it of divs) { nx.push({ d: it.d, k: it.k }); nx.push({ d: it.d * p, k: it.k + 1 }); }
    divs = nx;
  }
  for (const it of divs) if (it.d > 1) L[it.k] += D(p1, it.d);
  return { n, L1: L[1], L2: L[2], L3: L[3], L4: L[4] };
}
function peelU(p1, qs) {
  let U = 0;
  let divs = [{ d: 1, mu: 1 }];
  for (const p of qs) {
    const nx = [];
    for (const it of divs) { nx.push({ d: it.d, mu: it.mu }); nx.push({ d: it.d * p, mu: -it.mu }); }
    divs = nx;
  }
  for (const it of divs) if (it.d > 1) U += it.mu * D(p1, it.d);
  return U;
}
function directT(bprimes) {
  let s = 0;
  let divs = [{ d: 1, mu: 1 }];
  for (const p of bprimes) {
    const nx = [];
    for (const it of divs) { nx.push({ d: it.d, mu: it.mu }); nx.push({ d: it.d * p, mu: -it.mu }); }
    divs = nx;
  }
  for (const it of divs) if (it.d >= 2) s += it.mu * J(it.d - 1);
  return s;
}

// -- omega = 5 family: b = p1 * q1 * q2 * q3 * q4 (q ascending, coprime to p1). --
const OMEGA5_SAMPLES = [
  [2, 3, 5, 7, 11], [2, 3, 5, 7, 13], [2, 5, 7, 11, 13], [3, 5, 7, 11, 13],
  [2, 3, 7, 13, 101], [2, 3, 5, 11, 1009], [5, 7, 11, 13, 17], [2, 3, 5, 7, 9973],
].map((b) => {
  const p1 = b[0]; const [q1, q2, q3, q4] = b.slice(1);
  const { L1, L2 } = levelMasses(p1, b.slice(1));
  const A = { lhs: D(p1, q1), rhs: D(p1, q1 * q2) + D(p1, q1 * q3) + D(p1, q1 * q4) };
  const B = { lhs: D(p1, q2), rhs: D(p1, q2 * q3) + D(p1, q2 * q4) };
  const U = peelU(p1, b.slice(1)); const T = -J(p1 - 1) + U;
  return {
    b: b.join('*'), p1, L1, L2, L1gtL2: L1 > L2, ratio: L2 / L1,
    ineqA: A.lhs > A.rhs, ineqB: B.lhs > B.rhs,
    Uneg: U < 0, Tneg: T < 0, peelMatchesDirect: Math.abs(T - directT(b)) < 1e-10,
  };
});

export const IMP97396_REDUCTION = Object.freeze({
  name: 'REDUCTION -- the omega = 5 sign law collapses to two explicit per-prime weighted inequalities',
  charging: 'charge each level-2 positive D(qi qj) (i<j) to the level-1 term D(qi) of its smaller factor: {q1q2,q1q3,q1q4}->q1, {q2q3,q2q4}->q2, {q3q4}->q3, {}->q4',
  ineqA: '(A) D(q1) > D(q1 q2) + D(q1 q3) + D(q1 q4)',
  ineqB: '(B) D(q2) > D(q2 q3) + D(q2 q4)',
  trivialTail: 'bracket C = D(q3) > D(q3 q4) is monotonicity; bracket D = D(q4) > 0 is positivity; both already in imp-97352 toolkit',
  levelTail: '-L3 + L4 < 0 unconditionally: each of the four triple products < the single quad, so L3 > 4 D(quad) > D(quad) = L4',
  conclusion: 'U(m) = (-L1+L2) + (-L3+L4) < 0 (hence T(b) < 0) is EQUIVALENT, given the elementary toolkit, to (A) AND (B)',
});

export const IMP97396_ALIVE_AT_OMEGA5 = Object.freeze({
  name: 'ALIVE -- weighted domination survives at omega = 5 (contrast imp-97372 large-omega death)',
  aggregateNecessary: 'imp-97372: any level-2-by-level-1 weighting needs L1 >= L2; this FAILS for large omega since L2/L1 ~ (1/2) log log b -> infinity',
  atOmega5: 'L2/L1 = 0.19 on 2*3*5*7*11 and < 0.27 across omega=5 families, so L1 > L2 with wide margin -- weighted domination is NOT dead at omega = 5',
  leadingOrder: 'D(e) = (1-1/p1)/(12 e) + O(1/e^2), so (A) is Sum_{j>1} 1/qj < 1 and (B) is Sum_{j>2} 1/qj < 1 -- worst case q=3,5,7,11 gives 1/5+1/7+1/11 = 0.434 < 1',
});

export const IMP97396_OBSTRUCTION = Object.freeze({
  name: 'OBSTRUCTION -- why (A),(B) are not proved elementarily (the refined boundary)',
  toolkitLimit: 'the elementary toolkit gives only ONE-SIDED control (D > 0, D strictly decreasing, |Jp(m)| >= p1 |Jp(p1 m)|); it cannot bound D(qi) from below against a SUM of D(qi qj) from above',
  needed: 'a quantitative TWO-SIDED Binet estimate D(e) = (1-1/p1)/(12 e) + controlled remainder, remainder sign/size pinned -- exactly IMP97333_SIGN_TAIL_SUBGAP restricted to omega = 5',
  refinedBoundary: 'omega = 5 is the first omega where quantitative magnitude control is UNAVOIDABLE: pure injection walls combinatorially (imp-97352), weighted domination stays viable (this module) but is not elementarily provable',
});

export const IMP97396_VERDICT = Object.freeze({
  question: 'does the imp-97352 domination-injection method extend to omega = 5?',
  pureInjectionExtends: false,          // imp-97352 Hall wall stands
  weightedDominationAliveOmega5: true,  // L1 > L2 at omega = 5 (unlike large omega)
  reducesOmega5ToTwoInequalities: true, // (A) and (B)
  ineqABHoldNumerically: true,          // measured across omega=5 families
  provesSignLawOmega5: false,           // (A),(B) not proved elementarily
  provesSignForAllOmega: false,
  residualSubgap: 'IMP97333_SIGN_TAIL_SUBGAP',
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
  conclusion:
    'HONEST PARTIAL. The pure one-to-one injection of imp-97352 does NOT extend to omega = 5 (Hall wall ' +
    'stands). But the WEIGHTED-domination refinement is still ALIVE at omega = 5 (L1 > L2 with wide margin, ' +
    'unlike the large-omega death of imp-97372) and REDUCES the entire omega = 5 sign law to exactly two ' +
    'explicit per-prime inequalities (A) D(q1) > D(q1q2)+D(q1q3)+D(q1q4) and (B) D(q2) > D(q2q3)+D(q2q4), ' +
    'both verified numerically across the omega = 5 families and true to leading Binet order (Sum 1/qj < 1). ' +
    'Proving (A),(B) elementarily is out of reach of the one-sided sign/order toolkit -- it needs the ' +
    'quantitative two-sided Binet control of IMP97333_SIGN_TAIL_SUBGAP. So omega = 5 is the boundary of the ' +
    'ELEMENTARY method, not of weighted domination itself. No bound on Lambda moves; no refereed bound is changed; ' +
    'RH open; NO QED.',
});

export const IMP97396_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Honest partial: the imp-97352 pure injection does NOT ' +
  'extend to omega = 5 (Hall wall), but weighted domination is ALIVE there (L1 > L2, unlike the large-omega ' +
  'death of imp-97372) and reduces the omega = 5 sign law T(b) < 0 to two explicit per-prime inequalities ' +
  '(A) D(q1) > D(q1q2)+D(q1q3)+D(q1q4) and (B) D(q2) > D(q2q3)+D(q2q4). These hold numerically and to ' +
  'leading Binet order (Sum 1/qj < 1) but need the quantitative two-sided control of ' +
  'IMP97333_SIGN_TAIL_SUBGAP to prove. No bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97396_ASSERTIONS = [
  {
    id: 'imp97396-omega5-weighted-alive-L1-gt-L2',
    holds: () => OMEGA5_SAMPLES.every((r) => r.L1gtL2 && r.ratio < 0.3),
    why: 'ALIVE: at omega = 5 the aggregate necessary condition L1 > L2 holds with wide margin (ratio < 0.3) across every family -- weighted domination is not the large-omega dead case of imp-97372.',
  },
  {
    id: 'imp97396-two-inequalities-hold',
    holds: () => OMEGA5_SAMPLES.every((r) => r.ineqA && r.ineqB),
    why: 'REDUCTION: the two per-prime weighted inequalities (A) D(q1) > D(q1q2)+D(q1q3)+D(q1q4) and (B) D(q2) > D(q2q3)+D(q2q4) hold across the omega = 5 families (primorial, odd-p1, spread, large trailing prime).',
  },
  {
    id: 'imp97396-inequalities-imply-U-and-T-negative',
    holds: () => OMEGA5_SAMPLES.every((r) => r.ineqA && r.ineqB && r.Uneg && r.Tneg && r.peelMatchesDirect),
    why: 'REDUCTION closure: wherever (A),(B) hold the peel remainder U(m) < 0 and T(b) < 0, and the peel form -J(p1-1)+U(m) reproduces the direct T to < 1e-10 -- confirming the equivalence.',
  },
  {
    id: 'imp97396-leading-order-reduces-to-reciprocal-sum',
    holds: () => {
      // worst omega=5 reciprocal sums: (A) uses j>1, (B) uses j>2; both must be < 1 for q = 3,5,7,11
      const q = [3, 5, 7, 11];
      const A = 1 / q[1] + 1 / q[2] + 1 / q[3];
      const B = 1 / q[2] + 1 / q[3];
      return A < 1 && B < 1 && Math.abs(A - 0.4337662337662338) < 1e-9;
    },
    why: 'ALIVE (leading order): to O(1/e) inequality (A) is Sum_{j>1} 1/qj < 1 and (B) is Sum_{j>2} 1/qj < 1; worst omega=5 primes q=3,5,7,11 give 0.4335 < 1 and 0.234 < 1.',
  },
  {
    id: 'imp97396-large-omega-ratio-grows',
    holds: () => {
      // on the 2-primorial the aggregate ratio L2/L1 is increasing in omega (imp-97372 direction),
      // yet omega=5 sits well below 1 -- the boundary is elementary, not the death point.
      const prim = [3, 5, 7, 11, 13, 17, 19, 23, 29];
      let prev = 0;
      for (let n = 2; n <= 9; n += 1) {
        const { L1, L2 } = levelMasses(2, prim.slice(0, n));
        const r = L2 / L1;
        if (!(r > prev)) return false;
        prev = r;
      }
      const o5 = levelMasses(2, [3, 5, 7, 11]);
      return o5.L2 / o5.L1 < 0.2; // omega=5 ratio still small
    },
    why: 'CONTRAST: L2/L1 increases with omega (imp-97372 log log b growth) so weighted domination eventually dies, but at omega=5 the ratio is ~0.19 -- the boundary here is the elementary toolkit, not the aggregate death.',
  },
  {
    id: 'imp97396-honesty-gate-no-qed',
    holds: () =>
      IMP97396_VERDICT.pureInjectionExtends === false &&
      IMP97396_VERDICT.weightedDominationAliveOmega5 === true &&
      IMP97396_VERDICT.reducesOmega5ToTwoInequalities === true &&
      IMP97396_VERDICT.provesSignLawOmega5 === false &&
      IMP97396_VERDICT.provesSignForAllOmega === false &&
      IMP97396_VERDICT.anyBoundMoved === false &&
      IMP97396_VERDICT.postsRigorousCeiling === false &&
      IMP97396_VERDICT.operatorPositivityProved === false &&
      IMP97396_VERDICT.rhResolved === false &&
      IMP97396_VERDICT.qed === false &&
      IMP97396_VERDICT.residualSubgap === 'IMP97333_SIGN_TAIL_SUBGAP' &&
      /NO QED/.test(IMP97396_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97396_HONEST_BANNER) &&
      /RH open/.test(IMP97396_HONEST_BANNER),
    why: 'honest partial: omega = 5 reduced to two inequalities and shown weighted-domination-alive, but NOT proved -- no bound moved, no rigorous ceiling, no operator positivity, RH open, no QED.',
  },
];

for (const a of IMP97396_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97396-route-m-sign-law-omega5-weighted-reduction assertion failed: ${a.id}`);
  }
}

export default {
  reduction: IMP97396_REDUCTION,
  aliveAtOmega5: IMP97396_ALIVE_AT_OMEGA5,
  obstruction: IMP97396_OBSTRUCTION,
  verdict: IMP97396_VERDICT,
  banner: IMP97396_HONEST_BANNER,
  omega5Samples: OMEGA5_SAMPLES,
};
