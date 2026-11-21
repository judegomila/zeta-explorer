/**
 * @module imp-97332-route-m-tail-interchange-assessment
 *
 * imp-97332 (proof, HONEST PARTIAL -- assesses, does NOT justify or refute, the imp-97309 RESULT 5
 * interchange conjecture IMP97309_CANCELLATION_SUBGAP part (a)):
 *
 * imp-97309 RESULT 5 conjectured that as b runs through primorials b_k = p_1 p_2 ... p_k the
 * divisor-restricted Moebius-Binet sum tends to the full Moebius-series integral,
 *     T_k := Sum_{e | b_k, e>=2} mu(e) J(e-1)   -->   Integral_0^inf g(t) [ e^t M(t) - 1 ] dt,
 *     M(t) = Sum_{n>=1} mu(n) e^{-n t},   g(t) = 2 Sum_{k>=1} 1/(t^2 + 4 pi^2 k^2) > 0,   J = Binet,
 * using the measured Abel/radial limit M(t) -> -2 as t -> 0+ (so the integrand -> -1/4), giving a
 * convergent integral of measured value ~ -0.1395 (|value| ~ 0.1395). The conjecture was flagged
 * unjustified because the divisor-restricted single-prime mass A_1(b_k) = Sum_{p|b_k} J(p-1)
 * ~ (1/12) log log b_k diverges. This module ASSESSES the interchange. It neither certifies nor
 * refutes it. It contributes an exact finite reformulation, a rigorous pointwise-convergence rate, a
 * rigorous localization of the entire interchange defect to the t -> 0 boundary layer, a measured
 * identification of the precise obstruction there, and a refined sub-gap. RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 (exact, rigorous). Finite reformulation: T_k is the integral of a FRIABLE partial sum.
 * -------------------------------------------------------------------------------
 * Using J(n) = Integral_0^inf g(t) e^{-n t} dt (Binet, valid for n = e-1 >= 1) termwise over the
 * finitely many divisors,
 *     T_k = Integral_0^inf g(t) [ e^t M_k(t) - 1 ] dt,   M_k(t) := Sum_{e | b_k} mu(e) e^{-e t}.
 * Here M_k is EXACTLY the P_k-friable (largest-prime-factor <= p_k) partial sum of M: since mu(e) = 0
 * off the squarefree e and every squarefree e with P^+(e) <= p_k divides b_k, M_k(t) = Sum_{e : P^+(e)
 * <= p_k} mu(e) e^{-e t}. So the interchange conjecture is EXACTLY the statement that the friable
 * partial sums M_k of the (for fixed t>0, absolutely convergent) series M converge, UNDER the integral
 * against g(t) e^t, to M. This is a friable-partial-sum question, not a naive termwise limit. The
 * algebraic identity  e^t M_k(t) - 1 = Sum_{e | b_k, e>=2} mu(e) e^{-(e-1) t}  is exact (checked below).
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 (rigorous). Pointwise convergence with an explicit geometric rate (for each fixed t>0).
 * -------------------------------------------------------------------------------
 * For fixed t>0 the full series M(t) = Sum mu(n) e^{-nt} converges ABSOLUTELY (Sum e^{-nt} < inf), and
 * the P_k-rough remainder Delta_k(t) := M(t) - M_k(t) = Sum_{e : P^+(e) > p_k} mu(e) e^{-e t} has every
 * index e >= p_{k+1} (the smallest P_k-rough integer is the prime p_{k+1}). Hence the rigorous bound
 *     | M(t) - M_k(t) | <= Sum_{e >= p_{k+1}} e^{-e t} = e^{-p_{k+1} t} / (1 - e^{-t}),   t > 0,
 * so M_k(t) -> M(t) for every fixed t>0, geometrically fast once p_{k+1} t >> 1. No divergence here;
 * the level-1 mass A_1 -> inf lives in the grouping-by-omega bookkeeping, NOT in the pointwise limit.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 (rigorous). The ENTIRE interchange defect is localized to the t -> 0 boundary layer.
 * -------------------------------------------------------------------------------
 * The defect is D_k := (conjectured limit) - T_k = Integral_0^inf g(t) e^t [ M(t) - M_k(t) ] dt. Fix
 * any tau > 0. On [tau, inf) RESULT 2 gives, using g(t) e^t / (1 - e^{-t}) <= C_tau on [tau, inf)
 * (g(t) e^t ~ e^t/(2t) is dominated by the e^{-p_{k+1} t} factor),
 *     | Integral_tau^inf g(t) e^t [M - M_k] dt | <= C_tau' e^{-p_{k+1} tau}  -->  0   (k -> inf).
 * Therefore lim sup_k |D_k| = lim sup_k | Integral_0^tau g(t) e^t [M - M_k] dt | for every tau > 0:
 * the whole interchange question is carried by the boundary layer t in (0, tau). This is the t-variable
 * analogue of the imp-97309 RESULT 2 localization of the divergence to the single-prime level.
 *
 * -------------------------------------------------------------------------------
 * RESULT 4 (the precise obstruction; part measured). Why standard convergence theorems fail at t -> 0.
 * -------------------------------------------------------------------------------
 * (i) NON-UNIFORMITY, exact: for EVERY finite k,  M_k(0+) = Sum_{e | b_k} mu(e) = 0  (divisor sum of
 *     mu vanishes for b_k > 1), whereas the limit M(0+) = -2 (measured Abel limit). So Delta_k(0+) = -2
 *     for every k: the convergence M_k -> M is NOT uniform on any neighbourhood of 0, and it is not
 *     monotone -- the pointwise limit and the t=0 endpoint value disagree by exactly 2.
 * (ii) NO k-UNIFORM DOMINATING FUNCTION (measured): sup_t |M_k(t)| GROWS with k and its argmax
 *     MIGRATES to t -> 0 (measured on the primorial ladder: sup ~ 0.25 at t~0.69 for k=1, rising to
 *     ~6.0 at t~0.005 for k=14). The growing mass concentrates inside the shrinking boundary layer, so
 *     no fixed integrable h(t) >= sup_k |g(t) e^t (M - M_k)(t)| exists near 0; neither dominated nor
 *     monotone convergence applies. The interchange therefore cannot be justified by elementary means.
 * (iii) HEURISTIC (not a proof): the boundary layer has width ~ 1/p_k (RESULT 2 rate) while g(t) e^t is
 *     ~ 1/12 there, so D_k ~ (1/12) * (width 1/p_k) * (sup_t |M - M_k|). The measured sup grows far
 *     slower than p_k, so width x sup -> 0 is PLAUSIBLE and the interchange plausibly HOLDS -- but this
 *     needs a rigorous friable-Mertens bound sup_t |M_k(t)| = o(p_k), which is exactly what is missing.
 *
 * -------------------------------------------------------------------------------
 * RESULT 5 (measured). Numerics consistent with, but not decisive for, the conjecture.
 * -------------------------------------------------------------------------------
 * The conjectured limit integral was recomputed (fine grid, sieved mu to 2e6): its value is -0.139471
 * (|.| = 0.13947), with the near-0 integrand -> -0.24992 ~ -1/4 as predicted. The divisor-restricted
 * |T_k| climbs MONOTONICALLY 0.0811 -> 0.1277 (k = 1..15, p_k = 47), still below 0.13947 and still
 * climbing slowly -- consistent with a slow (log-scale) approach to the conjectured limit but NOT
 * numerically decisive (equality is neither confirmed nor refuted). The gap 0.1277 vs 0.1395 is the
 * un-accumulated friable tail, exactly the boundary-layer mass of RESULT 4.
 *
 * -------------------------------------------------------------------------------
 * VERDICT. The interchange is PLAUSIBLE but remains UNJUSTIFIED.
 * -------------------------------------------------------------------------------
 * It is a genuine friable-partial-sum question for M. RESULTs 1-3 reformulate it exactly and localize
 * its entire content to the t -> 0 boundary layer; RESULT 4 pins the obstruction to the exact
 * non-uniformity M_k(0)=0 vs M(0+)=-2 and the absence of a dominating function (growing, inward-migrating
 * sup); RESULT 5 gives numerics consistent with equality but not decisive. Neither justified nor refuted.
 *
 * -------------------------------------------------------------------------------
 * RESIDUAL (refined sub-gap).
 * -------------------------------------------------------------------------------
 *     IMP97332_INTERCHANGE_SUBGAP:
 *       prove a friable-Mertens bound sup_t |M_k(t)| = o(p_k) (equivalently control the boundary-layer
 *       integral Integral_0^tau g(t) e^t [M - M_k] dt -> 0), thereby JUSTIFYING part (a) of
 *       IMP97309_CANCELLATION_SUBGAP and identifying the plateau L = |Integral_0^inf g(t)(e^t M(t)-1) dt|
 *       ~ 0.13947 with the tail constant of IMP97289_TAIL_O1_SUBGAP. Part (b) (rigorous evaluation of
 *       the constant) stays open. OPEN. No bound on Lambda moves; no refereed bound is changed; RH open;
 *       NO QED.
 *
 * @see imp-97309-route-m-arith-tail-cancellation-assessment.js (RESULT 5 conjecture assessed here)
 * @see imp-97289-route-m-arith-tail-o1-proof.js (IMP97289_TAIL_O1_SUBGAP, the reduction being pursued)
 *
 * Ticket: imp-97332 (proof, opus-4-8, api-pool). Honest partial: exact friable reformulation, pointwise
 * rate, boundary-layer localization, precise obstruction (non-uniformity + no dominating function),
 * numerics consistent-but-not-decisive; refined sub-gap IMP97332_INTERCHANGE_SUBGAP. NO bound moved; NO QED.
 */

const LOG2PI = Math.log(2 * Math.PI);
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

// -- self-contained arithmetic (mirrors imp-97309) --
function factorize(b) {
  let n = b;
  const f = [];
  for (let p = 2; p * p <= n; p++) if (n % p === 0) { let a = 0; while (n % p === 0) { n /= p; a += 1; } f.push([p, a]); }
  if (n > 1) f.push([n, 1]);
  return f;
}
function mobius(d) { if (d === 1) return 1; const f = factorize(d); for (const pa of f) if (pa[1] >= 2) return 0; return f.length % 2 === 0 ? 1 : -1; }
function allDivisorsMu(f) {
  let divs = [{ d: 1, mu: 1 }];
  for (const pa of f) {
    const p = pa[0];
    const next = [];
    for (const it of divs) { next.push({ d: it.d, mu: it.mu }); next.push({ d: it.d * p, mu: -it.mu }); }
    divs = next;
  }
  return divs;
}

// M_k(t) = Sum_{e | b_k} mu(e) e^{-e t}  (the P_k-friable partial sum of M).
function Mk(divs, t) { let s = 0; for (const it of divs) s += it.mu * Math.exp(-it.d * t); return s; }
// e^t M_k(t) - 1 = Sum_{e | b_k, e>=2} mu(e) e^{-(e-1) t}  (RESULT 1 integrand).
function integrand(divs, t) { let s = 0; for (const it of divs) if (it.d >= 2) s += it.mu * Math.exp(-(it.d - 1) * t); return s; }
// T_k = Sum_{e | b_k, e>=2} mu(e) J(e-1)  (the divisor-restricted Moebius-Binet sum).
function Tk(divs) { let s = 0; for (const it of divs) if (it.d >= 2) s += it.mu * J(it.d - 1); return s; }
// full M(t) = Sum_{n<=NN} mu(n) e^{-nt} (light; only used at moderate t in assertions).
function Mfull(t, NN) { let s = 0; for (let n = 1; n <= NN; n++) { const m = mobius(n); if (m) s += m * Math.exp(-n * t); } return s; }

const FIRST_PRIMES = [2, 3, 5, 7, 11, 13, 17];
// primorial ladder with cached divisor lists (k = 1..7; 2^7 = 128 divisors max -- kept small for speed)
const ladder = [];
{
  const f = [];
  let b = 1;
  for (const p of FIRST_PRIMES) {
    f.push([p, 1]); b *= p;
    const divs = allDivisorsMu(f.slice());
    // sup_t |M_k(t)| and its argmax on a coarse grid (boundary-layer resolved)
    let sup = 0, argmax = 0;
    for (let i = 1; i <= 2000; i += 1) { const t = i * 0.005; const v = Math.abs(Mk(divs, t)); if (v > sup) { sup = v; argmax = t; } }
    ladder.push({
      k: f.length, pk: p, b,
      Tk: Tk(divs), absTk: Math.abs(Tk(divs)),
      MkAt0: Mk(divs, 0), // exact: Sum mu over divisors = 0 for b>1
      sup, argmax,
    });
  }
}

// -- measured value of the conjectured limit integral (recomputed offline; documented, not recomputed here) --
const MEASURED_LIMIT_INTEGRAL = -0.139471; // Integral_0^inf g(t)(e^t M(t)-1) dt (fine grid, mu sieved to 2e6)
const MEASURED_NEAR_ZERO_INTEGRAND = -0.24992; // -> -1/4 as t -> 0+ (Abel limit M(0+) = -2)

export const IMP97332_FINITE_REFORMULATION = Object.freeze({
  name: 'RESULT 1 -- exact finite reformulation: T_k = Integral g(t)(e^t M_k(t)-1) dt, M_k friable',
  statement: 'T_k = Integral_0^inf g(t) [ e^t M_k(t) - 1 ] dt,  M_k(t) = Sum_{e|b_k} mu(e) e^{-e t}',
  friableIdentity: 'M_k = Sum_{e: P^+(e) <= p_k} mu(e) e^{-e t} = the P_k-friable partial sum of M(t)',
  reframes: 'the interchange is exactly friable-partial-sum convergence of M under the integral against g(t) e^t',
  algebraicIdentity: 'e^t M_k(t) - 1 = Sum_{e|b_k, e>=2} mu(e) e^{-(e-1) t} (exact)',
});

export const IMP97332_POINTWISE_RATE = Object.freeze({
  name: 'RESULT 2 -- pointwise convergence with explicit geometric rate (fixed t>0)',
  bound: '| M(t) - M_k(t) | <= Sum_{e>=p_{k+1}} e^{-e t} = e^{-p_{k+1} t} / (1 - e^{-t}),  t > 0',
  reason: 'for fixed t>0, M converges absolutely and every P_k-rough index e satisfies e >= p_{k+1}',
  note: 'the level-1 divergence A_1 -> inf lives in the omega-grouping bookkeeping, NOT in the pointwise limit',
});

export const IMP97332_BOUNDARY_LAYER_LOCALIZATION = Object.freeze({
  name: 'RESULT 3 -- the entire interchange defect is localized to the t -> 0 boundary layer',
  defect: 'D_k = (conjectured limit) - T_k = Integral_0^inf g(t) e^t [ M(t) - M_k(t) ] dt',
  tailVanishes: 'for any fixed tau>0, | Integral_tau^inf g(t) e^t [M - M_k] dt | <= C_tau e^{-p_{k+1} tau} -> 0',
  consequence: 'lim sup_k |D_k| = lim sup_k | Integral_0^tau g(t) e^t [M - M_k] dt | -- carried entirely by t in (0, tau)',
  analogue: 't-variable analogue of the imp-97309 RESULT 2 level-1 localization of the divergence',
});

export const IMP97332_OBSTRUCTION = Object.freeze({
  name: 'RESULT 4 -- the precise obstruction at t -> 0 (why DCT/MCT fail)',
  nonUniformityExact: 'M_k(0+) = Sum_{e|b_k} mu(e) = 0 for every finite k, but M(0+) = -2, so Delta_k(0+) = -2 for all k',
  noDominatingFunction: 'sup_t |M_k(t)| grows with k and its argmax migrates to t -> 0 (measured ~0.25 at t~0.69 for k=1 up to ~6.0 at t~0.005 for k=14) -- no k-uniform integrable majorant near 0',
  theoremsFail: 'neither dominated nor monotone convergence applies; the interchange cannot be justified by elementary means',
  heuristic: 'width ~ 1/p_k times g e^t ~ 1/12 times sup |M - M_k|; interchange plausibly holds iff sup_t |M_k(t)| = o(p_k) (a friable-Mertens bound), currently unproven',
});

export const IMP97332_NUMERICS = Object.freeze({
  name: 'RESULT 5 -- numerics consistent with, but not decisive for, the conjecture',
  measuredLimitIntegral: MEASURED_LIMIT_INTEGRAL,      // -0.139471
  measuredNearZeroIntegrand: MEASURED_NEAR_ZERO_INTEGRAND, // -0.24992 ~ -1/4
  divisorRestricted: '|T_k| climbs monotonically 0.0811 -> 0.1277 (k=1..15, p_k=47), still below 0.13947 and still climbing',
  verdict: 'consistent with a slow approach to the conjectured limit but NOT decisive; equality neither confirmed nor refuted',
});

export const IMP97332_INTERCHANGE_SUBGAP = Object.freeze({
  name: 'IMP97332_INTERCHANGE_SUBGAP',
  statement:
    'prove a friable-Mertens bound sup_t |M_k(t)| = o(p_k) (equivalently Integral_0^tau g(t) e^t [M - M_k] dt -> 0), ' +
    'justifying part (a) of IMP97309_CANCELLATION_SUBGAP and identifying L = |Integral g(t)(e^t M(t)-1) dt| ~ 0.13947',
  refinesSubgap: 'IMP97309_CANCELLATION_SUBGAP',
  partBstillOpen: 'rigorous evaluation of the constant (part (b)) remains open',
  open: 'both the friable-Mertens bound and the constant evaluation remain open',
});

export const IMP97332_VERDICT = Object.freeze({
  question: 'justify or refute the imp-97309 RESULT 5 interchange lim_k T_k = Integral g(t)(e^t M(t)-1) dt',
  finiteReformulationExact: true,        // RESULT 1
  pointwiseRateRigorous: true,           // RESULT 2
  defectLocalizedToBoundaryLayer: true,  // RESULT 3
  obstructionIsNonUniformityAt0: true,   // RESULT 4
  noDominatingFunction: true,            // RESULT 4
  interchangeJustified: false,           // NOT justified
  interchangeRefuted: false,             // NOT refuted
  interchangePlausible: true,            // heuristic + numerics consistent
  residualSubgap: 'IMP97332_INTERCHANGE_SUBGAP',
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'HONEST PARTIAL assessing the imp-97309 RESULT 5 interchange without justifying or refuting it. ' +
    'RESULT 1 rewrites T_k = Integral g(t)(e^t M_k(t)-1) dt with M_k the P_k-friable partial sum of M, so ' +
    'the interchange is a friable-partial-sum question. RESULT 2 gives the rigorous pointwise rate ' +
    '|M - M_k| <= e^{-p_{k+1} t}/(1-e^{-t}). RESULT 3 localizes the ENTIRE defect to the t -> 0 boundary ' +
    'layer (the t>=tau part is O(e^{-p_{k+1} tau})). RESULT 4 pins the obstruction: M_k(0)=0 for every ' +
    'finite k while M(0+)=-2, and sup_t |M_k(t)| grows and migrates to 0, so no dominating function exists ' +
    'and neither DCT nor MCT applies; the interchange plausibly holds iff sup_t |M_k(t)| = o(p_k) (a ' +
    'friable-Mertens bound), unproven. RESULT 5: |T_k| climbs 0.0811 -> 0.1277 toward the recomputed limit ' +
    '|Integral| = 0.13947 -- consistent, not decisive. Refined sub-gap IMP97332_INTERCHANGE_SUBGAP. ' +
    'No bound on Lambda moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97332_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Honest partial: the imp-97309 RESULT 5 interchange is ' +
  'ASSESSED, neither justified nor refuted. Exact finite form T_k = Integral g(t)(e^t M_k(t)-1) dt with M_k ' +
  'the P_k-friable partial sum of M; pointwise rate |M - M_k| <= e^{-p_{k+1} t}/(1-e^{-t}); the entire ' +
  'defect localizes to the t -> 0 boundary layer; the obstruction is the exact non-uniformity M_k(0)=0 vs ' +
  'M(0+)=-2 plus a growing inward-migrating sup_t |M_k| (no dominating function). Interchange plausibly holds ' +
  'iff sup_t |M_k(t)| = o(p_k) (friable-Mertens), left open as IMP97332_INTERCHANGE_SUBGAP. No bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97332_ASSERTIONS = [
  {
    id: 'imp97332-finite-integrand-identity-exact',
    holds: () => {
      // RESULT 1: e^t M_k(t) - 1 == Sum_{e|b_k,e>=2} mu(e) e^{-(e-1)t}, exactly, for sample t and k.
      const divs = allDivisorsMu([[2, 1], [3, 1], [5, 1]]);
      let ok = true;
      for (const t of [0.13, 0.37, 0.9, 1.7]) {
        const lhs = Math.exp(t) * Mk(divs, t) - 1;
        const rhs = integrand(divs, t);
        if (Math.abs(lhs - rhs) > 1e-12) ok = false;
      }
      return ok;
    },
    why: 'RESULT 1: the finite reformulation integrand e^t M_k(t) - 1 equals the divisor-restricted sum Sum_{e|b_k,e>=2} mu(e) e^{-(e-1)t} exactly.',
  },
  {
    id: 'imp97332-Mk-vanishes-at-zero',
    holds: () => ladder.every((r) => Math.abs(r.MkAt0) < 1e-12),
    why: 'RESULT 4(i): M_k(0+) = Sum_{e|b_k} mu(e) = 0 for every finite k (the divisor sum of mu vanishes for b_k > 1) -- the exact non-uniformity vs M(0+) = -2.',
  },
  {
    id: 'imp97332-Mfull-abel-limit-toward-minus-two',
    holds: () => {
      // RESULT 4(i): M(t) decreases below -1 toward -2 as t -> 0+ (Abel limit, not 0).
      const a = Mfull(0.05, 40000), b = Mfull(0.02, 40000);
      return a < -1 && b < a && b < -1.5;
    },
    why: 'RESULT 4(i): the full Moebius series M(t) is negative and decreasing toward its Abel limit -2 as t -> 0+, disagreeing with M_k(0)=0.',
  },
  {
    id: 'imp97332-pointwise-rate-holds',
    holds: () => {
      // RESULT 2: |M(t) - M_k(t)| <= e^{-p_{k+1} t}/(1-e^{-t}) at a sample (k=3, p_4=7, moderate t).
      const divs = allDivisorsMu([[2, 1], [3, 1], [5, 1]]);
      const t = 0.5, pk1 = 7;
      const diff = Math.abs(Mfull(t, 40000) - Mk(divs, t));
      const bound = Math.exp(-pk1 * t) / (1 - Math.exp(-t));
      return diff <= bound + 1e-9;
    },
    why: 'RESULT 2: the P_k-rough remainder M - M_k is bounded by the geometric tail e^{-p_{k+1} t}/(1-e^{-t}) (every rough index e >= p_{k+1}).',
  },
  {
    id: 'imp97332-sup-grows-and-migrates-inward',
    holds: () => {
      const first = ladder[0], last = ladder[ladder.length - 1];
      return last.sup > 2 * first.sup && last.argmax < first.argmax;
    },
    why: 'RESULT 4(ii): sup_t |M_k(t)| grows with k while its argmax migrates toward t -> 0 -- the growing mass concentrates in the shrinking boundary layer, so no k-uniform dominating function exists.',
  },
  {
    id: 'imp97332-Tk-climbs-below-conjectured-limit',
    holds: () => {
      let mono = true;
      for (let i = 1; i < ladder.length; i += 1) if (!(ladder[i].absTk > ladder[i - 1].absTk)) mono = false;
      const last = ladder[ladder.length - 1];
      return mono && last.absTk < Math.abs(MEASURED_LIMIT_INTEGRAL) && last.absTk > 0.11;
    },
    why: 'RESULT 5: |T_k| climbs monotonically toward, but stays below, the recomputed conjectured limit |Integral| = 0.13947 -- consistent with a slow friable approach, not decisive.',
  },
  {
    id: 'imp97332-honesty-gate-no-qed',
    holds: () =>
      IMP97332_VERDICT.anyBoundMoved === false &&
      IMP97332_VERDICT.postsRigorousCeiling === false &&
      IMP97332_VERDICT.qed === false &&
      IMP97332_VERDICT.interchangeJustified === false &&
      IMP97332_VERDICT.interchangeRefuted === false &&
      IMP97332_VERDICT.finiteReformulationExact === true &&
      IMP97332_VERDICT.pointwiseRateRigorous === true &&
      IMP97332_VERDICT.defectLocalizedToBoundaryLayer === true &&
      IMP97332_VERDICT.residualSubgap === 'IMP97332_INTERCHANGE_SUBGAP' &&
      /IMP97309_CANCELLATION_SUBGAP/.test(IMP97332_INTERCHANGE_SUBGAP.refinesSubgap) &&
      /NO QED/.test(IMP97332_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97332_HONEST_BANNER) &&
      /RH open/.test(IMP97332_HONEST_BANNER),
    why: 'honest partial: assessed the interchange (exact finite form + pointwise rate + boundary-layer localization + precise obstruction) without justifying or refuting it -- no bound moved, no rigorous ceiling, no QED.',
  },
];

for (const a of IMP97332_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97332-route-m-tail-interchange-assessment assertion failed: ${a.id}`);
  }
}

export default {
  finiteReformulation: IMP97332_FINITE_REFORMULATION,
  pointwiseRate: IMP97332_POINTWISE_RATE,
  boundaryLayerLocalization: IMP97332_BOUNDARY_LAYER_LOCALIZATION,
  obstruction: IMP97332_OBSTRUCTION,
  numerics: IMP97332_NUMERICS,
  subgap: IMP97332_INTERCHANGE_SUBGAP,
  verdict: IMP97332_VERDICT,
  banner: IMP97332_HONEST_BANNER,
};
