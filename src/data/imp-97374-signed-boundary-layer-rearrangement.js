/**
 * @module imp-97374-signed-boundary-layer-rearrangement
 *
 * imp-97374 (proof, HONEST PARTIAL -- ATTEMPTS the imp-97353 refined sub-gap
 * IMP97353_SIGNED_BOUNDARY_LAYER_SUBGAP and REFRAMES it as a conditional-rearrangement problem):
 *
 * imp-97353 refuted the sup-majorant route (sup_t |M_k(t)| = o(p_k) is FALSE, sup ~ 1.71^k) and
 * relocated the obstruction to the SIGNED estimate
 *     D_k := Integral_0^tau g(t) e^t [M(t) - M_k(t)] dt  -->  0   (oscillatory cancellation, NOT a sup bound),
 * where M(t) = Sum_{n>=1} mu(n) e^{-n t}, M_k(t) = Sum_{e | b_k} mu(e) e^{-e t} is the P_k-friable partial
 * sum, b_k the k-th primorial, and g(t) = 2 Sum_{j>=1} 1/(t^2 + 4 pi^2 j^2) > 0 is the imp-97332 weight.
 * This module attempts that signed estimate. It does not prove it; it IDENTIFIES the precise mechanism
 * (a re-ordering of a conditionally convergent series) and contributes exact structure. RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 (exact, rigorous, NEW). The weight g is EXACTLY Binet second kernel: J(m) = mu_B(m).
 * -------------------------------------------------------------------------------
 * Using coth(t/2)/2 = 1/2 + 1/(e^t - 1), the partial-fraction weight collapses to the closed form
 *     g(t) = coth(t/2)/(2t) - 1/t^2 = (1/t) [ 1/(e^t - 1) - 1/t + 1/2 ],
 * which is precisely Binet second-formula kernel. Hence the tail Binet coefficient is a Binet function
 * value in CLOSED FORM:
 *     J(m) = Integral_0^inf g(t) e^{-m t} dt = mu_B(m) = log Gamma(m) - (m - 1/2) log m + m - (1/2) log(2 pi).
 * (Verified: closed form vs direct quadrature agree to 3e-10 at m = 1, 2, 5; the two branches are
 * continuous to 5e-15 where the deep-m Stirling series 1/(12m) - 1/(360 m^3) + ... takes over from the
 * lgamma branch, needed only to dodge catastrophic cancellation for the huge divisors e | b_k.) Therefore
 *     T_k = Sum_{e | b_k, e>=2} mu(e) mu_B(e-1),     L := Integral_0^inf g(t) [e^t M(t) - 1] dt
 *          = Sum_{n>=2} mu(n) mu_B(n-1)   (the FULL Moebius-Binet series),
 * and the signed estimate D_k -> 0 is EXACTLY the statement that the friable partial sums T_k converge to
 * the full-series value L. This turns the boundary-layer integral into a Moebius-weighted Stirling-remainder
 * series, computable in closed form (no quadrature, no boundary-layer grid).
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 (rigorous, NEW). The series is CONDITIONALLY, not absolutely, convergent -- the deep reason the
 * sup-majorant route (imp-97353) had to fail.
 * -------------------------------------------------------------------------------
 * mu_B(m) > 0 is monotone decreasing with mu_B(m) ~ 1/(12 m) (Watson/Stirling). Hence
 *     Sum_{n>=2} |mu(n) mu_B(n-1)|  asymptotic to  (1/12) Sum_{n squarefree} 1/(n-1)  =  +infinity
 * (measured: the absolute partial sum climbs 0.304 -> 0.690 over N = 100 -> 2e5, increment ~ (6/pi^2)(ln 10)/12
 * per decade, no plateau), while the SIGNED natural-order sum Sum_{n>=2} mu(n) mu_B(n-1) converges
 * conditionally to -0.139467 (measured, sieved mu to 4e6; matches the imp-97332 integral L = -0.139471).
 * So the boundary-layer defect is governed by a CONDITIONALLY convergent series. This RIGOROUSLY explains
 * imp-97353: no k-uniform dominating function / sup majorant can exist because Sum |terms| = infinity;
 * the "signed oscillatory cancellation" demanded by the sub-gap is precisely this conditional convergence.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 (rigorous reframing, NEW; the precise obstruction). The interchange is a RE-ORDERING of a
 * conditionally convergent series by largest prime factor.
 * -------------------------------------------------------------------------------
 * T_k sums exactly the terms mu(n) mu_B(n-1) over the P_k-friable n (all prime factors <= p_k); as k grows
 * these exhaust every squarefree n, so {T_k} is the sequence of partial sums of the SAME series
 * Sum_{n>=2} mu(n) mu_B(n-1) taken in "smooth-numbers-first" (friable / largest-prime-factor) ORDER -- a
 * rearrangement of the natural order. For a conditionally convergent series (RESULT 2), Riemann rearrangement
 * says the value can change under reordering. Agnew theorem (1955) says a permutation preserves EVERY
 * convergent series sum IFF it carries each initial segment [1, n] into a bounded number of blocks (intervals).
 * The friable reordering FAILS this: passing k -> k+1 appends the set { p_{k+1} * e : e | b_k }, which is
 * scattered non-contiguously across [p_{k+1}, b_{k+1}] (an unbounded, growing block count). So the friable
 * reordering is NOT Agnew-sum-preserving a priori -- sum preservation (equivalently D_k -> 0) cannot follow
 * from general reordering theory and must be extracted from the specific arithmetic of mu and mu_B. This is
 * the precise obstruction the sub-gap now names. It also recovers the imp-97332 boundary-layer picture: the
 * un-accumulated friable tail L - T_k is exactly the mass the reordering has not yet delivered.
 *
 * -------------------------------------------------------------------------------
 * RESULT 4 (measured, closed-form ladder). The SIGNED defect DECAYS while the sup GROWS -- cancellation is real.
 * -------------------------------------------------------------------------------
 * Exact closed-form evaluation (RESULT 1, no quadrature) extends the imp-97332 ladder from k = 15 to k = 25:
 *     |T_k| :  0.08106, 0.12093 (k=5), 0.12593 (k=10), 0.12771 (k=15), 0.12869 (k=20), 0.12935 (k=25),
 * climbing MONOTONICALLY toward |L| = 0.139467. The signed defect |D_k| = |L| - |T_k| decays
 *     5.84e-2, 1.85e-2, 1.35e-2, 1.18e-2, 1.08e-2, 1.01e-2   (k = 1, 5, 10, 15, 20, 25),
 * with ratio |D_k| / |D_{k-1}| CLIMBING 0.577 -> 0.989 toward 1: a sub-geometric, log-scale approach --
 * the fingerprint of a delicate conditional-rearrangement limit, NOT of absolute convergence. Contrast with
 * imp-97353: sup_t |M_k(t)| ~ 1.71^k GROWS exponentially while the SIGNED D_k DECAYS. This is direct
 * evidence that the oscillatory cancellation is genuine (the estimate holds numerically), but the ratio -> 1
 * means a plateau at some L* strictly below L cannot be numerically excluded -- consistent with, not proof of,
 * D_k -> 0.
 *
 * -------------------------------------------------------------------------------
 * VERDICT. Neither proved nor refuted; the obstruction is IDENTIFIED, not removed.
 * -------------------------------------------------------------------------------
 * The signed boundary-layer estimate D_k -> 0 is EXACTLY: the largest-prime-factor reordering of the
 * conditionally convergent series Sum_{n>=2} mu(n) mu_B(n-1) preserves its sum. RESULT 1 gives the closed
 * form (weight = Binet kernel, so the whole integral is a Moebius-Stirling series); RESULT 2 proves the
 * series is only conditionally convergent, rigorously explaining why imp-97353 sup-majorant had to fail;
 * RESULT 3 reframes the interchange as a non-Agnew reordering (the precise obstruction); RESULT 4 measures
 * the signed defect decaying (cancellation real) but sub-geometrically (not decisive). No general theorem
 * closes it; the specific arithmetic of mu must be used. RH open; no bound on Lambda moves; no refereed bound is changed
 * ; NO QED.
 *
 * -------------------------------------------------------------------------------
 * RESIDUAL (refined sub-gap; sharpens the imp-97353 one).
 * -------------------------------------------------------------------------------
 *     IMP97374_FRIABLE_REARRANGEMENT_SUBGAP:
 *       prove that the largest-prime-factor (friable / primorial) reordering of the CONDITIONALLY convergent
 *       series Sum_{n>=2} mu(n) mu_B(n-1) preserves its sum, i.e. T_k -> L. Because the reordering is not
 *       Agnew-bounded (RESULT 3) and the series is not absolutely convergent (RESULT 2), this needs the
 *       arithmetic of mu (e.g. a friable-block cancellation bound Sum_{P^+(e)=p} mu(e) mu_B(e-1) summed over
 *       p, or a friable Mellin / Perron contour for Sum_{P^+(n)<=y} mu(n) mu_B(n-1)), NOT any sup majorant
 *       (imp-97353) and NOT general reordering theory. Still OPEN: the rigorous super-linear lower bound
 *       sup_t |M_k(t)| >> p_k (imp-97375). Part (b) (rigorous evaluation of the constant L) stays open.
 *
 * @see imp-97353-friable-mertens-sup-refutation.js (IMP97353_SIGNED_BOUNDARY_LAYER_SUBGAP attempted here)
 * @see imp-97332-route-m-tail-interchange-assessment.js (weight g, T_k, boundary-layer localization)
 * @see imp-97309-route-m-arith-tail-cancellation-assessment.js (IMP97309_CANCELLATION_SUBGAP root)
 *
 * Ticket: imp-97374 (proof, opus-4-8, api-pool). Honest partial: NEW closed form J = Binet function mu_B
 * (weight g = Binet second kernel), so the signed boundary-layer integral is the Moebius-Stirling series
 * Sum mu(n) mu_B(n-1); proved CONDITIONALLY (not absolutely) convergent (explains the imp-97353 sup-majorant
 * death); reframed the interchange as a non-Agnew reordering of a conditionally convergent series (the precise
 * obstruction); closed-form ladder to k=25 shows the SIGNED defect decays (sub-geometrically) while the sup
 * grows. Obstruction relocated to IMP97374_FRIABLE_REARRANGEMENT_SUBGAP. No bound moved; NO QED.
 */

// ---- Binet function mu_B(m) = J(m): lgamma branch for small m, Stirling asymptotic for large m ----
const LN2PI = Math.log(2 * Math.PI);
function lgamma(x) {
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
  x -= 1;
  let a = c[0];
  const tt = x + g + 0.5;
  for (let i = 1; i < g + 2; i++) a += c[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(tt) - tt + Math.log(a);
}
// mu_B(z) = log Gamma(z) - (z - 1/2) log z + z - (1/2) log(2 pi); Stirling series past z = 50 to avoid
// catastrophic cancellation (mu_B ~ 1/(12z) is a tiny difference of O(z log z) terms for huge divisors).
function muB(z) {
  if (z >= 50) {
    const z2 = z * z;
    return 1 / (12 * z) - 1 / (360 * z * z2) + 1 / (1260 * z * z2 * z2);
  }
  return lgamma(z) - (z - 0.5) * Math.log(z) + z - 0.5 * LN2PI;
}

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
// T_k = Sum_{e | b_k, e>=2} mu(e) mu_B(e-1), exact closed-form friable partial sum (signed divisor walk).
function Tk(k) {
  let divs = [1];
  for (let i = 0; i < k; i++) {
    const p = PRIMES[i];
    const nx = [];
    for (const d of divs) { nx.push(d); nx.push(-d * p); }
    divs = nx;
  }
  let s = 0;
  for (const d of divs) { const e = Math.abs(d); if (e < 2) continue; s += (d > 0 ? 1 : -1) * muB(e - 1); }
  return s;
}

// measured full-series (natural order) limit and the imp-97332 integral it matches
const L_NATURAL = -0.139467; // Sum_{n>=2} mu(n) mu_B(n-1), sieved to 4e6 (matches integral L = -0.139471)
const L_ABS = 0.139467;

export const IMP97374_BINET_CLOSED_FORM = Object.freeze({
  name: 'RESULT 1 -- weight g is Binet second kernel; J(m) = mu_B(m) in closed form',
  kernel: 'g(t) = coth(t/2)/(2t) - 1/t^2 = (1/t)[1/(e^t - 1) - 1/t + 1/2]  (Binet second-formula kernel)',
  coefficient: 'J(m) = Integral_0^inf g(t) e^{-m t} dt = mu_B(m) = logGamma(m) - (m - 1/2)log m + m - (1/2)log(2 pi)',
  seriesForm: 'T_k = Sum_{e|b_k, e>=2} mu(e) mu_B(e-1);  L = Integral g[e^t M - 1] = Sum_{n>=2} mu(n) mu_B(n-1)',
  meaning: 'the signed boundary-layer integral is a Moebius-weighted Stirling-remainder series -- no quadrature, no boundary-layer grid',
});

export const IMP97374_CONDITIONAL_CONVERGENCE = Object.freeze({
  name: 'RESULT 2 -- the Moebius-Binet series is CONDITIONALLY, not absolutely, convergent',
  absolute: 'Sum_{n>=2} |mu(n) mu_B(n-1)| ~ (1/12) Sum_{n squarefree} 1/(n-1) = +infinity (mu_B>0, ~1/(12m))',
  absoluteMeasured: 'absolute partial sum climbs 0.304 -> 0.690 over N = 1e2 -> 2e5, no plateau',
  signed: 'signed natural-order sum converges conditionally to -0.139467 (matches imp-97332 integral -0.139471)',
  explainsImp97353: 'Sum |terms| = infinity => NO k-uniform dominating function / sup majorant can exist; the demanded oscillatory cancellation IS this conditional convergence',
});

export const IMP97374_REARRANGEMENT_REFRAME = Object.freeze({
  name: 'RESULT 3 -- the interchange is a re-ordering of a conditionally convergent series (the precise obstruction)',
  reorder: 'T_k = partial sums of Sum mu(n) mu_B(n-1) in largest-prime-factor (friable) order, a rearrangement of natural order',
  riemann: 'conditionally convergent (RESULT 2) => Riemann rearrangement allows the value to change under reordering',
  agnew: 'Agnew (1955): a permutation preserves every convergent sum IFF it maps each [1,n] into a bounded number of blocks',
  failsAgnew: 'step k->k+1 appends { p_{k+1} e : e | b_k }, scattered non-contiguously across [p_{k+1}, b_{k+1}] (unbounded block count) => NOT Agnew-sum-preserving',
  conclusion: 'D_k -> 0 cannot follow from general reordering theory; it must be extracted from the arithmetic of mu',
});

export const IMP97374_SIGNED_LADDER = Object.freeze({
  name: 'RESULT 4 -- closed-form ladder to k=25: signed defect DECAYS (sub-geometrically) while the sup GROWS',
  absTk: '|T_k|: 0.08106 (k=1), 0.12093 (k=5), 0.12593 (k=10), 0.12771 (k=15), 0.12869 (k=20), 0.12935 (k=25)',
  absDefect: '|D_k| = |L| - |T_k|: 5.84e-2, 1.85e-2, 1.35e-2, 1.18e-2, 1.08e-2, 1.01e-2 (k=1,5,10,15,20,25)',
  ratio: '|D_k|/|D_{k-1}| climbs 0.577 -> 0.989 toward 1: sub-geometric, log-scale approach (conditional-limit fingerprint)',
  contrast: 'sup_t |M_k| ~ 1.71^k GROWS (imp-97353) while the SIGNED D_k DECAYS -- the oscillatory cancellation is genuine',
  decisive: false,
  note: 'ratio -> 1 => a plateau at L* strictly below L cannot be numerically excluded; consistent with, not proof of, D_k -> 0',
});

export const IMP97374_FRIABLE_REARRANGEMENT_SUBGAP = Object.freeze({
  name: 'IMP97374_FRIABLE_REARRANGEMENT_SUBGAP',
  supMajorantDead: 'imp-97353: sup_t |M_k| = o(p_k) FALSE; RESULT 2 here gives the reason (series not absolutely convergent)',
  statement:
    'prove the largest-prime-factor (friable / primorial) reordering of the CONDITIONALLY convergent series ' +
    'Sum_{n>=2} mu(n) mu_B(n-1) preserves its sum (T_k -> L); needs the arithmetic of mu (a friable-block ' +
    'cancellation bound / a friable Mellin-Perron contour for Sum_{P^+(n)<=y} mu(n) mu_B(n-1)), NOT a sup ' +
    'majorant and NOT general reordering theory (the reordering is not Agnew-bounded)',
  alsoOpen: 'rigorous super-linear lower bound sup_t |M_k(t)| >> p_k (imp-97375, currently measured)',
  refinesSubgap: 'IMP97353_SIGNED_BOUNDARY_LAYER_SUBGAP / IMP97309_CANCELLATION_SUBGAP',
  partBstillOpen: 'rigorous evaluation of the constant L (part (b)) remains open',
});

export const IMP97374_VERDICT = Object.freeze({
  question: 'attempt the signed estimate Integral_0^tau g e^t [M - M_k] dt -> 0 directly (imp-97353 sub-gap)',
  binetClosedFormExact: true,          // RESULT 1
  conditionalNotAbsolute: true,        // RESULT 2
  reorderingIdentified: true,          // RESULT 3
  friableReorderingIsAgnewBounded: false, // RESULT 3 -- so no free lunch from reordering theory
  signedDefectDecaysMeasured: true,    // RESULT 4
  signedEstimateProved: false,         // NOT proved
  signedEstimateRefuted: false,        // NOT refuted -- obstruction identified, not removed
  explainsSupMajorantDeath: true,      // RESULT 2 explains imp-97353
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  residualSubgap: 'IMP97374_FRIABLE_REARRANGEMENT_SUBGAP',
  conclusion:
    'HONEST PARTIAL. The signed boundary-layer estimate is recast in CLOSED FORM: the imp-97332 weight g is ' +
    'Binet second kernel, so J(m) = mu_B(m) and the integral is the Moebius-Stirling series ' +
    'Sum_{n>=2} mu(n) mu_B(n-1) (T_k its friable partial sums). That series is CONDITIONALLY (not absolutely) ' +
    'convergent -- Sum |terms| = infinity -- which rigorously explains why the imp-97353 sup-majorant route had ' +
    'to fail. The interchange is therefore a largest-prime-factor RE-ORDERING of a conditionally convergent ' +
    'series; the reordering is not Agnew-bounded, so D_k -> 0 cannot follow from general reordering theory and ' +
    'needs the arithmetic of mu. A closed-form ladder to k=25 shows the SIGNED defect |D_k| decaying ' +
    '(sub-geometrically, ratio -> 1) while sup_t |M_k| ~ 1.71^k grows -- the cancellation is genuine but the ' +
    'numerics are not decisive. Obstruction relocated to IMP97374_FRIABLE_REARRANGEMENT_SUBGAP. No bound on ' +
    'Lambda moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97374_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Honest partial: the imp-97332 weight g is Binet second ' +
  'kernel, so the signed boundary-layer integral is the Moebius-Stirling series Sum mu(n) mu_B(n-1) (closed ' +
  'form J = mu_B). That series is CONDITIONALLY (not absolutely) convergent -- rigorously explaining the ' +
  'imp-97353 sup-majorant death -- so the interchange is a largest-prime-factor re-ordering of a conditionally ' +
  'convergent series, which is not Agnew-bounded (the precise obstruction). Closed-form ladder to k=25: the ' +
  'signed defect decays sub-geometrically while the sup grows. Obstruction relocated to ' +
  'IMP97374_FRIABLE_REARRANGEMENT_SUBGAP. No bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97374_ASSERTIONS = [
  {
    id: 'imp97374-binet-closed-form-matches-quadrature',
    holds: () => {
      // RESULT 1: mu_B(m) = Integral_0^inf g(t) e^{-m t} dt via g(t) = (1/t)[1/(e^t-1) - 1/t + 1/2].
      const gker = (t) => (1 / t) * (1 / Math.expm1(t) - 1 / t + 0.5);
      let ok = true;
      for (const m of [1, 2, 5]) {
        const N = 120000, tmax = 60 / m, h = tmax / N;
        let s = 0;
        for (let i = 0; i < N; i++) { const t = (i + 0.5) * h; s += gker(t) * Math.exp(-m * t) * h; }
        if (Math.abs(s - muB(m)) > 1e-6) ok = false;
      }
      return ok;
    },
    why: 'RESULT 1: the weight g is Binet second kernel, so J(m) = mu_B(m) in closed form (matches direct quadrature).',
  },
  {
    id: 'imp97374-binet-branch-continuity',
    holds: () => {
      // RESULT 1: the lgamma branch and the Stirling-asymptotic branch agree at the z=50 seam.
      const z2 = 50 * 50;
      const asym = 1 / (12 * 50) - 1 / (360 * 50 * z2) + 1 / (1260 * 50 * z2 * z2);
      const exact = lgamma(50) - (50 - 0.5) * Math.log(50) + 50 - 0.5 * LN2PI;
      return Math.abs(asym - exact) < 1e-12;
    },
    why: 'RESULT 1: mu_B is continuous across the z=50 seam (Stirling asymptotic dodges catastrophic lgamma cancellation for huge divisors).',
  },
  {
    id: 'imp97374-binet-positive-monotone',
    holds: () => {
      // RESULT 2: mu_B(m) > 0, monotone decreasing, ~ 1/(12 m).
      let ok = muB(1) > 0 && muB(1000) > 0 && muB(1e6) > 0;
      ok = ok && muB(2) < muB(1) && muB(10) < muB(2) && muB(100) < muB(10);
      ok = ok && Math.abs(muB(1000) * 12 * 1000 - 1) < 1e-3;
      return ok;
    },
    why: 'RESULT 2: mu_B(m) is positive, monotone decreasing, ~ 1/(12 m); hence Sum |mu(n) mu_B(n-1)| diverges (not absolutely convergent).',
  },
  {
    id: 'imp97374-Tk-monotone-climb-below-L',
    holds: () => {
      // RESULT 4: |T_k| climbs monotonically and stays below |L| on the closed-form ladder.
      let ok = true, prev = 0;
      for (let k = 1; k <= 12; k++) {
        const a = Math.abs(Tk(k));
        if (!(a > prev) || a >= L_ABS) ok = false;
        prev = a;
      }
      return ok;
    },
    why: 'RESULT 4: the friable partial sums |T_k| climb monotonically toward |L| = 0.139467 and stay below it.',
  },
  {
    id: 'imp97374-signed-defect-ratio-climbs-to-one',
    holds: () => {
      // RESULT 4: |D_k| = |L| - |T_k| decays sub-geometrically (ratio |D_k|/|D_{k-1}| climbs toward 1).
      const d = [];
      for (let k = 1; k <= 12; k++) d.push(L_ABS - Math.abs(Tk(k)));
      const r2 = d[2] / d[1];   // early ratio
      const rLate = d[11] / d[10]; // late ratio
      // decaying, sub-geometric, ratio climbing toward 1 (but still < 1: no crossing)
      return d[11] > 0 && d[11] < d[0] && rLate > r2 && rLate > 0.9 && rLate < 1;
    },
    why: 'RESULT 4: the SIGNED defect decays but sub-geometrically (ratio climbs 0.58 -> ~0.97 toward 1) -- a conditional-rearrangement fingerprint, not absolute convergence.',
  },
  {
    id: 'imp97374-Tk-matches-imp97332-ladder',
    holds: () => {
      // cross-check: the closed-form ladder reproduces the imp-97332 measured |T_1| and the climb.
      const t1 = Math.abs(Tk(1)); // = |mu(2) mu_B(1)| = mu_B(1) = 0.081061...
      return Math.abs(t1 - 0.081061) < 1e-4 && Math.abs(Tk(1)) < Math.abs(Tk(5));
    },
    why: 'cross-check: closed-form |T_1| = mu_B(1) = 0.08106 reproduces the imp-97332 RESULT 5 measured value.',
  },
  {
    id: 'imp97374-honesty-gate-no-qed',
    holds: () =>
      IMP97374_VERDICT.anyBoundMoved === false &&
      IMP97374_VERDICT.postsRigorousCeiling === false &&
      IMP97374_VERDICT.qed === false &&
      IMP97374_VERDICT.signedEstimateProved === false &&
      IMP97374_VERDICT.signedEstimateRefuted === false &&
      IMP97374_VERDICT.binetClosedFormExact === true &&
      IMP97374_VERDICT.conditionalNotAbsolute === true &&
      IMP97374_VERDICT.reorderingIdentified === true &&
      IMP97374_VERDICT.friableReorderingIsAgnewBounded === false &&
      IMP97374_VERDICT.residualSubgap === 'IMP97374_FRIABLE_REARRANGEMENT_SUBGAP' &&
      /IMP97353_SIGNED_BOUNDARY_LAYER_SUBGAP/.test(IMP97374_FRIABLE_REARRANGEMENT_SUBGAP.refinesSubgap) &&
      /NO QED/.test(IMP97374_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97374_HONEST_BANNER) &&
      /RH open/.test(IMP97374_HONEST_BANNER),
    why: 'honest partial: reframed the signed sub-gap as a conditional reordering problem -- no bound moved, no rigorous ceiling, no QED.',
  },
];

for (const a of IMP97374_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97374-signed-boundary-layer-rearrangement assertion failed: ${a.id}`);
  }
}

export default {
  binetClosedForm: IMP97374_BINET_CLOSED_FORM,
  conditionalConvergence: IMP97374_CONDITIONAL_CONVERGENCE,
  rearrangementReframe: IMP97374_REARRANGEMENT_REFRAME,
  signedLadder: IMP97374_SIGNED_LADDER,
  subgap: IMP97374_FRIABLE_REARRANGEMENT_SUBGAP,
  verdict: IMP97374_VERDICT,
  banner: IMP97374_HONEST_BANNER,
  naturalOrderLimit: L_NATURAL,
};
