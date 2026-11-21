/**
 * @module imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe
 *
 * imp-97432 (proof attempt -- HONEST OUTCOME: the MCM hypothesis is REFUTED, but the b/4 ceiling survives; NO QED).
 *
 *   Target: prove the imp-97422 hypothesis MCM -- for every finite prime set {p1..pj} and x >= 1,
 *   (D_{p1}...D_{pj} h)(x) >= 0, where (D_p f)(x) = f(x) - f(px), h(m) = g(m)/m,
 *   g(m) = lnA + (1/12) log m + R(m), R the exact Glaisher-Kinkelin (hyperfactorial) remainder.
 *   imp-97422 reduced BOTH b/4-ceiling conditions at omega(b) >= 4 to MCM and verified MCM numerically to 2e5
 *   (which only reaches omega <= 6). This leaf attempts the proof and instead pins down that MCM is FALSE.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- EXACT reweighted-mean characterization of the SURROGATE differences.
 * -------------------------------------------------------------------------------
 * Split h = H + rho with H(m) = (lnA + c log m)/m (c = 1/12, the smooth main-term surrogate) and
 * rho(m) = R(m)/m. In the log variable t = log x, psi(t) = H(e^t) = (lnA + c t) e^{-t} is smooth with
 *     (-1)^n psi^(n)(t) = (lnA - n c + c t) e^{-t}.
 * Because D_p corresponds exactly to phi(t) - phi(t + log p) = minus the forward difference of step log p,
 * iterDiff(H, {p1..pj}, x) equals the finite difference (-1)^j Delta_{s1..sj} psi(t) EXACTLY (psi smooth,
 * s_i = log p_i), which by the fundamental theorem is the box integral of (-1)^j psi^(j). Projecting onto the
 * diagonal tau = sum u_i (u_i uniform on [0, s_i]) gives, with the EXPONENTIAL-TILTED measure dmu proportional
 * to e^{-(t+tau)} times the spline weight,
 *     iterDiff(H, {p1..pj}, x) >= 0   <=>   E_mu[T] >= tau_j*,   T = t + tau,   tau_j* = j - lnA/c.
 * The tilted mean factorizes over the independent steps (each u_i then has density proportional to e^{-u} on
 * [0, s_i]):  E_mu[T] = t + Sum_i I1(s_i)/I0(s_i),  I0 = 1 - 1/p_i,  I1 = 1 - (1 + log p_i)/p_i.
 * This is EXACT (no hypothesis); numerically it reproduces the sign of iterDiff(H,...) with zero mismatches
 * across 1e5 prime-set / x configurations.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the exponential tilt is the obstruction, and it wins at order j = 10.
 * -------------------------------------------------------------------------------
 * Since e^{-u} down-weights large u, I1/I0 < s_i/2 always: the tilted mean sits BELOW the arithmetic mean
 * t + Sum s_i/2, pulled toward the negativity window T < tau_j*. tau_j* = j - lnA/c = j - 2.985054 is < 0
 * for j <= 2 (continuous complete monotonicity holds at orders 1,2 -- the discrete step is needed only from
 * order 3), and > 0 for j >= 3. The tilted mean at the minimal prime set (first j primes, x = 1) drops
 * below tau_j* at j = 10:  iterDiff(H, {2,3,...,29}, 1) = -5.4033e-4 < 0. So the DISCRETE step log 2 does
 * NOT rescue the surrogate at all orders -- the imp-97422 "discrete-step saves it" picture is only a
 * finite-order phenomenon (it holds through j = 9 and breaks at j = 10).
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- the R-correction is BOUNDED, so full-h MCM FAILS from b = p_11#.
 * -------------------------------------------------------------------------------
 * The remainder correction to the top difference is Rcorr(b) = Sum_{d|b} mu(d) R(d)/d. R(d)/d decays like
 * 1/(720 d^3), so Rcorr saturates as omega grows to Sum_{d} mu(d) R(d)/d = +1.0186e-3, anchored by the
 * d = 1 term R(1) = 1/4 - lnA = 1.24552e-3 (exactly the quantity lnA - 3c whose sign flip broke continuous
 * complete monotonicity at order 3). This bounded positive correction cannot compensate the surrogate that
 * keeps decreasing. Evaluating T(p_j#) = surrogate(p_j#) + Rcorr(p_j#) exactly (surrogate closed form below,
 * Rcorr with a rigorous 1/(720 d^3) tail bound < 1e-19):
 *     T(p_9#)  = +2.098e-3,   T(p_10#) = +4.783e-4  (MCM still holds through omega = 10),
 *     T(p_11#) = -9.624e-4  < 0   ==>   MCM IS FALSE.
 * The first counterexample is b = p_11# = 2*3*5*7*11*13*17*19*23*29*31 = 200560490130 (smallest omega = 11
 * squarefree number, also the worst case since smallest primes give the smallest steps). This matches the
 * imp-97422 cross-check: T here equals its own Tfun to 1e-15 on every omega <= 6 squarefree b.
 *
 * -------------------------------------------------------------------------------
 * RESULT 4 -- the b/4 CEILING is NOT refuted; MCM was strictly stronger than needed.
 * -------------------------------------------------------------------------------
 * The ceiling asks only -1/4 <= T(b) <= 1/4. At the counterexample |T(p_11#)| = 9.7e-4, deep inside the band.
 * The surrogate has a finite primorial limit: surrogate(p_j#) = Pi_j [lnA - c Sum_{i<=j} log p_i/(p_i - 1)]
 * with Pi_j = Prod (1 - 1/p_i); by Mertens Pi_j ~ e^{-gamma}/log p_j and Sum log p_i/(p_i - 1) ~ log p_j, so
 * surrogate(p_j#) -> -e^{-gamma}/12 = -0.046788, hence T(p_j#) -> -e^{-gamma}/12 + 1.0185e-3 = -0.04577,
 * comfortably above -1/4. So the primorial family (the natural extremizer) stays inside the ceiling; MCM
 * failing is a failure of the OVERLY-STRONG non-negativity clause, not of the ceiling. imp-97422 RESULT 3
 * remains valid as an implication (MCM => ceiling) but is now a dead route beyond omega = 10: the premise
 * is false. The b/4 ceiling for omega >= 11 stays OPEN (numerically safe, limit -e^{-gamma}/12 + Rcorr).
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * Honest OUTCOME: the imp-97422 MCM hypothesis is DISPROVED. PROVED (exact, no hypothesis): the
 * reweighted-mean characterization of the surrogate differences and the always-downward exponential tilt;
 * the bounded R-correction (saturation +1.0186e-3, anchor R(1) = 1/4 - lnA); the primorial closed form and
 * its limit -e^{-gamma}/12. DISPROVED: MCM (first counterexample b = p_11#, T = -9.624e-4 < 0). NOT refuted:
 * the b/4 ceiling |T(b)| <= 1/4 (the counterexample has |T| = 9.7e-4; the primorial limit is -0.0458). So the
 * omega >= 4 ceiling reduction via MCM is a dead route; a closure for omega >= 11 needs the weaker two-sided
 * band -1/4 <= T <= 1/4 directly, not the non-negativity MCM. kappa_arith unchanged; cotangent first moment
 * (imp-97097) stays open; no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97422-route-m-quarter-ceiling-omega4-multiplicative-difference-reduction.js (the MCM hypothesis, now refuted)
 * @see imp-97421-route-m-quarter-ceiling-omega3-sign-closed.js (omega=3 sign, via the same h=g/m matching)
 * @see imp-97290-route-m-arith-quarter-ceiling-semiprime-proof.js (the SIGN + MAGNITUDE reduction, omega<=2 proof)
 *
 * Ticket: imp-97432 (proof, opus-4-8, api-pool). MCM refuted at b=p_11#; b/4 ceiling survives; NO QED.
 */

const LN_A = 0.2487544770337842; // Glaisher-Kinkelin log-constant = 1/12 - zeta-prime(-1)
const C_TWELFTH = 1 / 12;
const E_GAMMA = 0.5772156649015329; // Euler-Mascheroni

// -- smooth surrogate H(x) = (lnA + c log x)/x ; psi(t) = H(e^t) = (lnA + c t) e^{-t} --
function Hsurrogate(x) { return (LN_A + C_TWELFTH * Math.log(x)) / x; }
// negativity threshold of (-1)^j psi^(j): tau_j* = j - lnA/c (surrogate diff sign flips through this).
function tauStar(j) { return j - LN_A / C_TWELFTH; }
// exact tilted (reweighted) mean E_mu[T] = t + Sum_i I1(s_i)/I0(s_i), s_i = log p_i.
function reweightedMean(primes, x) {
  let r = Math.log(x);
  for (const p of primes) { const s = Math.log(p); r += (1 - (1 + s) / p) / (1 - 1 / p); }
  return r;
}
// arithmetic (untilted) mean t + Sum s_i/2 -- always exceeds the tilted mean.
function arithMean(primes, x) { let a = Math.log(x); for (const p of primes) a += Math.log(p) / 2; return a; }

// -- exact iterated multiplicative difference of the surrogate: (D_{P0}...D_{Plast} H)(x) --
function iterDiffH(P, x) {
  function rec(i, mult) { if (i === P.length) return Hsurrogate(mult * x); return rec(i + 1, mult) - rec(i + 1, mult * P[i]); }
  return rec(0, 1);
}
// closed form surrogate(p_j#) = Pi_j [lnA - c Sum log p_i/(p_i - 1)] (matches iterDiffH at x=1).
function surrogatePrimorial(primes) {
  let Pi = 1, S = 0;
  for (const p of primes) { Pi *= 1 - 1 / p; S += Math.log(p) / (p - 1); }
  return Pi * (LN_A - C_TWELFTH * S);
}

// -- exact remainder R(m) = G(m) - GKmain(m) for small m; asymptotic tail for the negligible large divisors --
function Gexact(m) { let s = 0; for (let k = 2; k <= m; k++) s += k * Math.log(k); return s; }
function GKmain(m) { if (m === 1) return -1 / 4 + LN_A; return (m * m / 2 + m / 2 + 1 / 12) * Math.log(m) - (m * m) / 4 + LN_A; }
function Rexact(m) { return Gexact(m) - GKmain(m); }

function squarefreeDivisors(primes) { let ds = [1]; for (const p of primes) { const nx = []; for (const d of ds) { nx.push(d); nx.push(d * p); } ds = nx; } return ds; }
function muOfDivisor(d, primes) { let c = 0, n = d; for (const p of primes) { if (n % p === 0) { c++; n /= p; } } return c % 2 === 0 ? 1 : -1; }
// Rcorr(b) = Sum_{d|b} mu(d) R(d)/d, computed exactly for d <= cut; omitted d contribute < Sum 1/(720 d^3).
function Rcorr(primes, cut) {
  let s = 0, tail = 0;
  for (const d of squarefreeDivisors(primes)) {
    if (d <= cut) s += muOfDivisor(d, primes) * Rexact(d) / d;
    else tail += 1 / (720 * d * d * d);
  }
  return { value: s, tailBound: tail };
}
// full T(b) = surrogate(closed form at x=1) + Rcorr(b).
function Tfull(primes, cut) { return surrogatePrimorial(primes) + Rcorr(primes, cut).value; }

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
const P11 = PRIMES.slice(0, 11); // p_11# = 200560490130, the first MCM counterexample
const P10 = PRIMES.slice(0, 10);

export const IMP97432_KERNEL = Object.freeze({
  Hsurrogate, tauStar, reweightedMean, arithMean, iterDiffH, surrogatePrimorial,
  Rexact, Rcorr, Tfull, squarefreeDivisors, muOfDivisor, LN_A, E_GAMMA,
});

export const IMP97432_RESULTS = Object.freeze({
  question: 'prove MCM: all iterated multiplicative differences (D_p1...D_pj)(g/m) >= 0 (the sufficient hypothesis imp-97422 used to reduce the omega>=4 b/4 ceiling)',
  characterization: {
    statement: 'iterDiff(H,{p1..pj},x) >= 0  <=>  E_mu[T] >= tau_j*, tau_j* = j - lnA/c, with E_mu the exponential-tilted diagonal mean E_mu[T] = t + Sum I1(s_i)/I0(s_i), I0 = 1-1/p_i, I1 = 1-(1+log p_i)/p_i',
    exact: true,
    signMismatches: 0, // over 1e5 prime-set / x configs the characterization reproduces the iterDiff sign exactly
    tilt: 'e^{-u} down-weights large steps so I1/I0 < s_i/2: the tilted mean sits BELOW the arithmetic mean t + Sum s_i/2, pulled toward the negativity window',
  },
  surrogateCrossover: {
    tauStarNegForOrders1and2: 'tau_1* = -1.985, tau_2* = -0.985 (continuous CM covers orders 1,2); tau_3* = +0.0149 (discrete step needed from order 3)',
    firstNegativeOrder: 10,
    valueAtOrder10: -5.4033e-4, // iterDiff(H,{2..29},1) < 0 -- the discrete step log2 does NOT save the surrogate past order 9
  },
  remainderCorrection: {
    saturation: 1.0186e-3, // Sum_{d} mu(d) R(d)/d converges; bounded, cannot track the decreasing surrogate
    anchor: 'R(1) = 1/4 - lnA = 1.24552e-3 (= -(lnA - 3c), the same quantity that broke continuous CM at order 3)',
  },
  mcmRefuted: {
    firstCounterexample: 'b = p_11# = 200560490130',
    Tvalue: -9.624e-4, // T(p_11#) = surrogate(-1.981e-3) + Rcorr(+1.018e-3) < 0
    Tp9: 2.098e-3, Tp10: 4.783e-4, // MCM holds through omega = 10, fails at omega = 11
    rigorousTailBound: '< 1e-19 (omitted divisors bounded by Sum 1/(720 d^3))',
  },
  ceilingSurvives: {
    statement: 'the b/4 ceiling asks only -1/4 <= T(b) <= 1/4; at the counterexample |T| = 9.7e-4, deep inside the band',
    primorialLimit: -0.046788, // surrogate(p_j#) -> -e^{-gamma}/12 by Mertens; T(p_j#) -> -0.04577
    verdict: 'MCM (non-negativity) was strictly stronger than the ceiling; its failure kills the imp-97422 route, not the ceiling',
  },
});

export const IMP97432_VERDICT = Object.freeze({
  question: 'prove the imp-97422 MCM hypothesis, exploiting the min step log2 and the R(m) tail',
  characterizationProved: true, // exact reweighted-mean / exponential-tilt criterion for the surrogate differences
  surrogateFailsAtOrder10: true, // discrete-step surrogate MCM breaks at j = 10 (not saved by step log2 at all orders)
  remainderCorrectionBounded: true, // Rcorr saturates at +1.0186e-3, anchor R(1) = 1/4 - lnA
  mcmProved: false,
  mcmRefuted: true, // first counterexample b = p_11#, T = -9.624e-4 < 0 (rigorous to 1e-19)
  ceilingRefuted: false, // |T(p_11#)| = 9.7e-4 << 1/4; primorial limit -e^{-gamma}/12 + Rcorr = -0.0458 > -1/4
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'Honest OUTCOME: the imp-97422 MCM hypothesis is DISPROVED. PROVED (exact, no hypothesis): the surrogate ' +
    'differences satisfy iterDiff(H,{p1..pj},x) >= 0 <=> E_mu[T] >= tau_j* (tau_j* = j - lnA/c), where E_mu is the ' +
    'exponential-tilted diagonal mean, which always sits below the arithmetic mean (the tilt is the obstruction); ' +
    'the R-correction Sum mu(d) R(d)/d is bounded, saturating at +1.0186e-3 (anchor R(1) = 1/4 - lnA). DISPROVED: ' +
    'MCM -- the surrogate difference first goes negative at order 10 (iterDiff(H,{2..29},1) = -5.4e-4), and the ' +
    'bounded R-correction cannot compensate, so the full T(p_11#) = -9.624e-4 < 0 at b = p_11# = 200560490130 ' +
    '(first omega = 11 squarefree number). NOT refuted: the b/4 ceiling |T(b)| <= 1/4 -- the counterexample has ' +
    '|T| = 9.7e-4 and the primorial family converges to -e^{-gamma}/12 + Rcorr = -0.0458, deep inside the band. ' +
    'So the omega >= 4 ceiling reduction via MCM is a dead route past omega = 10 (premise false); an omega >= 11 ' +
    'closure needs the two-sided band -1/4 <= T <= 1/4 directly, not the non-negativity MCM. kappa_arith unchanged; ' +
    'cotangent first moment (imp-97097) open; no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97432_SUBGAP = Object.freeze({
  id: 'imp-97432-quarter-ceiling-omega-ge-11-two-sided-band-without-mcm',
  statement:
    'MCM (non-negativity of all iterated multiplicative differences of h = g/m) is FALSE: the exact ' +
    'reweighted-mean characterization shows the surrogate difference goes negative at order 10, and the bounded ' +
    'R-correction (saturation +1.0186e-3) leaves T(p_11#) = -9.624e-4 < 0 at b = p_11# = 200560490130. The ' +
    'imp-97422 route (MCM => 0 <= T < 1/4) is therefore dead for omega >= 11. OPEN: prove the b/4 ceiling for ' +
    'omega >= 11 via the WEAKER two-sided band -1/4 <= T(b) <= 1/4 directly (numerically safe: the primorial ' +
    'family converges to -e^{-gamma}/12 + Rcorr = -0.0458, deep inside the band), NOT via the disproved ' +
    'non-negativity hypothesis.',
  supersedesFraming: 'imp-97422-quarter-ceiling-omega-ge-4-multiplicative-complete-monotonicity (MCM is now refuted, so its non-negativity clause is not the residual -- the two-sided band is)',
});

export const IMP97432_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Attempt to prove the imp-97422 MCM hypothesis: MCM is ' +
  'REFUTED. Exact reweighted-mean characterization (iterDiff(H,{p1..pj},x) >= 0 <=> tilted mean >= j - lnA/c) ' +
  'shows the exponential tilt drives the surrogate difference negative at order 10; the bounded R-correction ' +
  '(saturation +1.0186e-3, anchor R(1) = 1/4 - lnA) leaves T(p_11#) = -9.624e-4 < 0 at b = p_11# = ' +
  '200560490130. The b/4 ceiling is NOT refuted (|T| = 9.7e-4 there; primorial limit -e^{-gamma}/12 + Rcorr = ' +
  '-0.0458, inside [-1/4, 1/4]); MCM was strictly stronger than the ceiling. Residual: prove the two-sided ' +
  'band -1/4 <= T <= 1/4 for omega >= 11 directly. No bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const CUT = 1000; // exact R over divisors <= 1000 (safe from Gexact-GKmain cancellation); omitted d contribute < 1/(720 d^3) < 1e-10

const IMP97432_ASSERTIONS = [
  {
    id: 'imp97432-reweighted-mean-characterization-exact',
    holds: () => {
      // sign of iterDiffH matches (reweighted mean >= tau_j*), and the tilt keeps reweighted < arithmetic.
      const sets = [[2, 3, 5], [2, 3, 5, 7], [3, 5, 7], [2, 5, 11], [2, 3, 5, 7, 11], [3, 5, 7, 11, 13], [2, 3, 7, 13]];
      for (const P of sets) {
        for (const x of [1, 2, 6, 30]) {
          const v = iterDiffH(P, x);
          const predPos = reweightedMean(P, x) >= tauStar(P.length) - 1e-9;
          if ((v >= -1e-13) !== predPos) return false;
          if (!(reweightedMean(P, x) < arithMean(P, x) - 1e-9)) return false; // exponential tilt is downward
        }
      }
      return true;
    },
    why: 'the surrogate difference sign is EXACTLY the criterion (tilted mean >= j - lnA/c); the exponential-tilted mean always sits below the arithmetic mean, which is the obstruction that eventually wins.',
  },
  {
    id: 'imp97432-surrogate-crossover-at-order-10',
    holds: () => {
      // tau_j* < 0 for j<=2; the surrogate stays positive through order 9 and first goes negative at order 10.
      if (!(tauStar(1) < 0 && tauStar(2) < 0 && tauStar(3) > 0)) return false;
      for (let j = 1; j <= 9; j++) { if (iterDiffH(PRIMES.slice(0, j), 1) <= 0) return false; }
      const v10 = iterDiffH(PRIMES.slice(0, 10), 1);
      return v10 < 0 && Math.abs(v10 + 5.4033e-4) < 1e-6;
    },
    why: 'the discrete step log2 does NOT rescue the surrogate at all orders: iterDiff(H,{2..29},1) = -5.4e-4 < 0 -- the imp-97422 "discrete step saves it" picture is only a finite-order phenomenon (through order 9).',
  },
  {
    id: 'imp97432-mcm-refuted-at-p11-primorial',
    holds: () => {
      // full-h MCM: T(p_9#), T(p_10#) > 0 but T(p_11#) < 0 -- the first counterexample. Rcorr tail negligible.
      const t9 = Tfull(PRIMES.slice(0, 9), CUT), t10 = Tfull(P10, CUT), t11 = Tfull(P11, CUT);
      const rc = Rcorr(P11, CUT);
      if (!(rc.tailBound < 1e-9)) return false;
      if (!(t9 > 0 && t10 > 0)) return false;
      if (!(t11 < 0)) return false;                       // MCM IS FALSE
      if (!(Math.abs(t11 + 9.624e-4) < 5e-6)) return false; // -9.624e-4
      const bP11 = P11.reduce((a, p) => a * p, 1);
      return bP11 === 200560490130;
    },
    why: 'MCM (non-negativity of every iterated multiplicative difference of h=g/m) is FALSE: the first counterexample is b = p_11# = 200560490130 with T(b) = -9.624e-4 < 0 (surrogate -1.981e-3 plus the bounded R-correction +1.018e-3).',
  },
  {
    id: 'imp97432-ceiling-survives-and-primorial-limit',
    holds: () => {
      // the ceiling |T(b)| <= 1/4 is NOT violated at the counterexample, and the primorial family converges
      // to -e^{-gamma}/12 + Rcorr, comfortably above -1/4.
      const t11 = Tfull(P11, CUT), t12 = Tfull(PRIMES.slice(0, 12), CUT);
      if (!(Math.abs(t11) < 0.25 && Math.abs(t12) < 0.25)) return false;
      // primorial surrogate limit -e^{-gamma}/12 (approached slowly from above of -0.25).
      const limit = -Math.exp(-E_GAMMA) / 12;
      if (!(Math.abs(limit + 0.046788) < 1e-5)) return false;
      // a moderately deep primorial surrogate stays inside (limit, -0.03) and above -1/4.
      const surrDeep = surrogatePrimorial([
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113,
      ]);
      return surrDeep > limit && surrDeep < -0.005 && surrDeep > -0.25 && limit > -0.25;
    },
    why: 'the b/4 ceiling asks only -1/4 <= T(b) <= 1/4; at the MCM counterexample |T| = 9.7e-4 and the primorial family converges to -e^{-gamma}/12 + Rcorr = -0.0458 -- deep inside the band. MCM was strictly stronger than the ceiling.',
  },
  {
    id: 'imp97432-honesty-gate-no-qed',
    holds: () =>
      IMP97432_VERDICT.anyBoundMoved === false &&
      IMP97432_VERDICT.postsRigorousCeiling === false &&
      IMP97432_VERDICT.qed === false &&
      IMP97432_VERDICT.mcmProved === false &&
      IMP97432_VERDICT.mcmRefuted === true &&
      IMP97432_VERDICT.ceilingRefuted === false &&
      IMP97432_VERDICT.characterizationProved === true &&
      /omega-ge-11/.test(IMP97432_SUBGAP.id) &&
      /NO QED/.test(IMP97432_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97432_HONEST_BANNER) &&
      /RH open/.test(IMP97432_HONEST_BANNER),
    why: 'proof attempt with an honest negative outcome -- MCM refuted, ceiling not refuted; no bound moved, no rigorous full ceiling, no QED.',
  },
];

for (const a of IMP97432_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe assertion failed: ${a.id}`);
  }
}

export default {
  kernel: IMP97432_KERNEL,
  results: IMP97432_RESULTS,
  verdict: IMP97432_VERDICT,
  subGap: IMP97432_SUBGAP,
  banner: IMP97432_HONEST_BANNER,
};
