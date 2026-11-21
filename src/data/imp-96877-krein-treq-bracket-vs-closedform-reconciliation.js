/**
 * @fileoverview imp-96877 -- MEASUREMENT / RECONCILIATION: reconcile the imp-96847 two-route required-
 * truncation-height bracket T_req(100; 1e-3) in [2672.7, 4729] with the imp-96848 closed-form rigorous
 * residual bound. The two siblings estimate the same object (how large the t-truncation height T must be for
 * the 2a=ln3 Route I Krein floor lambda_min(T_a[sigma_2]) at Galerkin dimension N=100 to hold the t-residual
 * below eps=1e-3) by different means and had never been compared. This leaf measures which imp-96847 estimate
 * is tighter, locates the source of the bracket width, and asks whether the imp-96848 bound narrows it.
 *
 * PREMISE (from the tickets, verbatim literals; no new solve).
 *   imp-96847 gave TWO extrapolation routes to T_req(N; eps):
 *     (DECAY) f(T) = L - A exp(-T/tau) per N; T_req = tau(N) ln(A(N)/eps). At N=100 (A=0.234738, tau=489.64):
 *             T_req(100; 1e-3) = 2672.7.
 *     (GEOM)  conservative geometric-doubling envelope from T=800 at the measured per-doubling ratio r=d2/d1;
 *             at N=100 (r=0.221897): T_req(100; 1e-3) = 4729, residual-beyond-T4800 = 1.304172e-3.
 *   Bracket: T_req(100; 1e-3) in [2672.7, 4729] (imp-96847 twoRouteBracketN100).
 *   imp-96848 derived a DISTINCT closed-form rigorous residual upper bound needing NO decay assumption:
 *     L - f(T) <= a^{-(4m+1)} (1/2pi) int_{|t|>T} sigma_2(t) |Psi(t)|^2 dt   (via lambda_max(R_T) <= Tr(B^{-1} R_T)),
 *   but explicitly did NOT compute its constant -- the tail-trace value is the named sub-gap
 *   IMP96848_TAILTRACE_MAJORANT (ingredient (ii): an N-dependent Gegenbauer-transform tail majorant, unassembled).
 *
 * METHOD (measurement / reconciliation only; no new solve, no fabricated number).
 *   1. Compare the two imp-96847 upper estimates at N=100: which is tighter, and by how much.
 *   2. Locate the bracket-width source by evaluating each route residual AT the ladder top T=4800.
 *   3. Ask whether the imp-96848 closed-form bound lands inside / tightens / contradicts [2672.7, 4729].
 *
 * FINDINGS (measured).
 *   1. THE DECAY ESTIMATE IS THE TIGHTER (SMALLER) REQUIRED HEIGHT; GEOM IS THE CONSERVATIVE ONE. At N=100,
 *      DECAY predicts T_req=2672.7, GEOM predicts T_req=4729: the bracket is [2672.7, 4729], width 2056.3,
 *      ratio 1.7694. GEOM is the more conservative (larger) required height because it is the deliberately
 *      pessimistic envelope; DECAY is the optimistic exponential-fit value.
 *   2. THE BRACKET WIDTH IS A 100x RESIDUAL-MODEL DISAGREEMENT AT THE LADDER TOP. Evaluating each route
 *      residual at the current ladder top T=4800 (N=100): the DECAY residual A exp(-T/tau) = 1.2976e-5 is
 *      already ~77x BELOW eps=1e-3, while the GEOM residual-beyond-T4800 = 1.3042e-3 is still ABOVE eps.
 *      The two residual models disagree by a factor of 100.5 at T=4800 -- THAT is why one route says the
 *      1e-3 target is met well before 4800 (T_req=2672.7) and the other says it is not met even at 4800
 *      (T_req=4729). The bracket is not noise; it is the DECAY exponential ansatz vs the GEOM
 *      geometric-envelope ansatz predicting wildly different tail residuals.
 *   3. THE imp-96848 CLOSED-FORM BOUND CANNOT NARROW THE BRACKET NUMERICALLY -- IT IS NUMERICALLY INERT.
 *      imp-96848 did not compute the tail-trace constant (residualConstantComputed=false; blocked on
 *      IMP96848_TAILTRACE_MAJORANT), so it produces NO T_req(100) number and therefore neither lands inside,
 *      tightens, nor contradicts [2672.7, 4729] as currently stated. What it DOES change is the STATUS of
 *      the bracket endpoints: imp-96848 demotes the GEOM geometric law d_{k+1} <= r d_k (source of the 4729
 *      endpoint) to a fitted heuristic with no operator backing, and the DECAY exponential ansatz (source of
 *      the 2672.7 endpoint) is a three-point fit whose exp(-T/tau) tail form is itself unvalidated against
 *      the imp-96848 structural picture (sigma_2 |Psi_N|^2 ~ t^4 ln t times a fast-decaying Gegenbauer
 *      factor). So BOTH endpoints are heuristic; the closed-form bound is the only rigorous route but yields
 *      no value yet.
 *   4. DIRECTIONAL RECONCILIATION PREDICTION (once the sub-gap closes). The imp-96848 bound is a TRACE over
 *      all N eigen-directions (lambda_max(R_T) <= Tr(B^{-1} R_T)), hence a conservative OVER-estimate of the
 *      true residual. When ingredient (ii) is supplied it will require a LARGER T to drive Tr below eps than
 *      the data-fitted true residual does, so the certified T_req(100) is expected to land AT OR ABOVE the
 *      conservative GEOM endpoint 4729 -- NOT below the optimistic DECAY endpoint 2672.7. The rigorous route
 *      therefore does not narrow the bracket downward; it would REPLACE the heuristic upper endpoint with a
 *      certified ceiling >= 4729 while the DECAY value stays the optimistic lower estimate.
 *
 * VERDICT. Reconciled: the imp-96847 bracket [2672.7, 4729] is a pair of HEURISTIC estimates whose 1.77x
 * width traces to a measured 100.5x disagreement between the DECAY and GEOM residual models at T=4800; the
 * imp-96848 closed-form bound does NOT narrow it (its constant is uncomputed -- the sub-gap), is CONSISTENT
 * in direction (both siblings say the residual grows with N: imp-96847 empirically via r/A/tau, imp-96848
 * mechanistically via the degree-<=2N basis diagonal), and being a trace over-estimate is expected to
 * certify an upper endpoint >= 4729 rather than shrink the bracket. Measurement / reconciliation only: no new
 * (N,T) solve, no residual constant computed, the DECAY vs GEOM extrapolations both stay heuristics; the
 * Rayleigh floor stays an UPPER bound on the true lambda_min; establishes NO operator positivity;
 * IMP96749_UNIFORM_N_GAP_UNSETTLED stays open; interval-rigorous reach stays 2a <= 0.96; RH open;
 * no refereed bound is changed; NO QED. Sub-gap IMP96877_CLOSEDFORM_STILL_NUMERICALLY_INERT: the
 * numerical reconciliation completes only when IMP96848_TAILTRACE_MAJORANT supplies the tail-trace constant.
 *
 * @see imp-96847-krein-tconv-tvsn-scaling-law.js (DECAY/GEOM T_req routes; twoRouteBracketN100 [2672.7, 4729])
 * @see imp-96848-krein-tresidual-rigorous-tailtrace-bound.js (closed-form residual bound; IMP96848_TAILTRACE_MAJORANT)
 * @see imp-96827-krein-tresidual-envelope-extrapolation.js (source GEOM envelope; residual-grows-with-N)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (IMP96749_UNIFORM_N_GAP_UNSETTLED)
 */

// --- imp-96847 bracket endpoints and residual-model parameters at N=100 (verbatim; no new solve) ---
export const IMP96877_TREQ_BRACKET_N100 = Object.freeze({
  eps: 1e-3,
  decay: 2672.7, // imp-96847 IMP96847_TREQ_DECAY[1e-3][100]
  geom: 4729, // imp-96847 IMP96847_TREQ_GEOM[100].Treq
  bracket: Object.freeze([2672.7, 4729]), // imp-96847 twoRouteBracketN100
  tighterRoute: 'decay', // DECAY gives the smaller required height; GEOM is the conservative one
  width: 2056.3, // 4729 - 2672.7
  ratio: 1.7694, // 4729 / 2672.7
});

// DECAY residual model at N=100 (verbatim imp-96847 exp fit) -- f(T) = L - A exp(-T/tau)
export const IMP96877_DECAY_FIT_N100 = Object.freeze({ A: 0.234738, tau: 489.64 });

// --- the measured source of the bracket width: residual at the ladder top T=4800 ---
export const IMP96877_RESIDUAL_AT_T4800 = Object.freeze({
  T: 4800,
  decay: 1.297604e-5, // A exp(-T/tau) = 0.234738 exp(-4800/489.64); already ~77x below eps=1e-3
  geom: 1.304172e-3, // imp-96848 IMP96848_GEOM_HEURISTIC_STATUS.n100GeomResidualEnvelope; still above eps
  ratioGeomOverDecay: 100.506, // the 100x residual-model disagreement that opens the bracket
  decayMeetsEpsBefore4800: true, // 1.30e-5 << 1e-3
  geomMeetsEpsBefore4800: false, // 1.30e-3 > 1e-3
});

// --- status of the imp-96848 closed-form bound in this reconciliation ---
export const IMP96877_CLOSEDFORM_STATUS = Object.freeze({
  form: 'L - f(T) <= a^{-(4m+1)} (1/2pi) int_{|t|>T} sigma_2(t) |Psi(t)|^2 dt', // via lambda_max(R_T) <= Tr(B^{-1} R_T)
  residualConstantComputed: false, // imp-96848 residualConstantComputed=false; blocked on the tail-trace sub-gap
  yieldsTreqNumber: false, // no number => cannot land inside / tighten / contradict the bracket numerically
  landsInsideBracket: null, // undetermined -- numerically inert
  tightensBracket: false, // does NOT narrow [2672.7, 4729] at present
  contradictsBracket: false, // consistent in direction (residual grows with N) -- no contradiction
  demotesGeomEndpoint: true, // imp-96848 demotes d_{k+1} <= r d_k (source of the 4729 endpoint) to heuristic
  isTraceOverEstimate: true, // Tr over N directions >= true residual => conservative
  predictedTreqRelativeToBracket: 'at-or-above-geom', // trace over-estimate => certified T_req expected >= 4729
});

export const IMP96877_VERDICT = Object.freeze({
  ticket: 'imp-96877',
  question:
    'does the imp-96848 closed-form rigorous residual bound land inside, tighten, or contradict the imp-96847 two-route T_req(100; 1e-3) bracket [2672.7, 4729], and which imp-96847 upper estimate is tighter?',
  answer:
    'The tighter (smaller) required height is the DECAY estimate 2672.7; GEOM 4729 is the conservative one, giving the bracket [2672.7, 4729] (width 2056.3, ratio 1.77). The width is a measured 100.5x disagreement between the DECAY and GEOM residual models at the ladder top T=4800 (DECAY 1.30e-5, already below eps=1e-3, vs GEOM 1.30e-3, still above). The imp-96848 closed-form bound does NOT tighten or contradict the bracket: its residual constant is uncomputed (the named sub-gap), so it yields no T_req number and is numerically inert. It is consistent in direction (both siblings say the residual grows with N) and, being a trace over-estimate, is expected to certify an upper endpoint >= 4729 once the tail-trace majorant is supplied -- replacing the heuristic upper endpoint rather than shrinking the bracket.',
  binding2a: 'ln3',
  tighterRoute: 'decay',
  bracketWidth: 2056.3,
  bracketRatio: 1.7694,
  residualDisagreementAtT4800: 100.506,
  closedFormTightensBracket: false, // numerically inert (constant uncomputed)
  closedFormContradictsBracket: false, // consistent in direction
  closedFormIsTraceOverEstimate: true, // => certified T_req expected >= geom endpoint 4729
  bothEndpointsHeuristic: true, // GEOM demoted, DECAY three-point exp fit
  newSolvePerformed: false, // reuses imp-96847/imp-96848 literals
  residualConstantComputed: false, // still the imp-96848 sub-gap
  subGap:
    'IMP96877_CLOSEDFORM_STILL_NUMERICALLY_INERT -- the numerical reconciliation completes only when IMP96848_TAILTRACE_MAJORANT (the N-dependent Gegenbauer-transform tail-trace majorant) supplies the closed-form residual constant; until then the imp-96848 bound cannot land inside the [2672.7, 4729] bracket, and both endpoints stay heuristic.',
  operatorPositivityProved: false, // Rayleigh floor stays an UPPER bound
  uniformNGapSettled: false, // IMP96749_UNIFORM_N_GAP_UNSETTLED stays open
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96877_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96877_ASSERTIONS = [
  {
    id: 'imp96877-bracket-endpoints-and-tighter-route',
    holds: () => {
      const b = IMP96877_TREQ_BRACKET_N100;
      return (
        b.bracket[0] === 2672.7 && b.bracket[1] === 4729 &&
        b.decay === b.bracket[0] && b.geom === b.bracket[1] &&
        b.decay < b.geom && b.tighterRoute === 'decay' &&
        Math.abs(b.width - (b.geom - b.decay)) < 0.05 &&
        Math.abs(b.ratio - b.geom / b.decay) < 1e-3
      );
    },
    why: 'the imp-96847 bracket is [2672.7, 4729]; the DECAY route gives the smaller (tighter) required height and GEOM the conservative one; width and ratio recompute from the endpoints.',
  },
  {
    id: 'imp96877-decay-residual-at-T4800-recomputes',
    holds: () => {
      const { A, tau } = IMP96877_DECAY_FIT_N100;
      const r = A * Math.exp(-4800 / tau);
      return Math.abs(r - IMP96877_RESIDUAL_AT_T4800.decay) < 1e-9 && r < 1e-3;
    },
    why: 'the baked DECAY residual at T=4800 must equal A exp(-4800/tau) from the imp-96847 exp-fit literals and sit below eps=1e-3.',
  },
  {
    id: 'imp96877-bracket-width-is-100x-residual-disagreement',
    holds: () => {
      const R = IMP96877_RESIDUAL_AT_T4800;
      const ratio = R.geom / R.decay;
      return (
        Math.abs(ratio - R.ratioGeomOverDecay) < 0.05 &&
        ratio > 90 && ratio < 110 &&
        R.decayMeetsEpsBefore4800 === true && R.geomMeetsEpsBefore4800 === false
      );
    },
    why: 'the bracket width traces to a ~100x disagreement between the DECAY and GEOM residual models at T=4800: DECAY already below eps, GEOM still above.',
  },
  {
    id: 'imp96877-closedform-numerically-inert',
    holds: () => {
      const c = IMP96877_CLOSEDFORM_STATUS;
      return (
        c.residualConstantComputed === false &&
        c.yieldsTreqNumber === false &&
        c.landsInsideBracket === null &&
        c.tightensBracket === false &&
        c.contradictsBracket === false &&
        c.isTraceOverEstimate === true &&
        c.predictedTreqRelativeToBracket === 'at-or-above-geom'
      );
    },
    why: 'the imp-96848 closed-form bound has no computed constant, so it yields no T_req number; it cannot tighten or contradict the bracket, and being a trace over-estimate its certified value is expected at or above the GEOM endpoint.',
  },
  {
    id: 'imp96877-measurement-only-no-qed',
    holds: () =>
      IMP96877_VERDICT.closedFormTightensBracket === false &&
      IMP96877_VERDICT.closedFormContradictsBracket === false &&
      IMP96877_VERDICT.bothEndpointsHeuristic === true &&
      IMP96877_VERDICT.newSolvePerformed === false &&
      IMP96877_VERDICT.residualConstantComputed === false &&
      IMP96877_VERDICT.operatorPositivityProved === false &&
      IMP96877_VERDICT.uniformNGapSettled === false &&
      IMP96877_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96877_VERDICT.qed === false &&
      typeof IMP96877_VERDICT.subGap === 'string' &&
      IMP96877_VERDICT.subGap.includes('IMP96877_CLOSEDFORM_STILL_NUMERICALLY_INERT'),
    why: 'reconciliation only: no new solve, closed-form bound numerically inert, both endpoints heuristic, no operator positivity, uniform-N gap open, reach stays 2a <= 0.96, no QED.',
  },
];

for (const a of IMP96877_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96877-krein-treq-bracket-vs-closedform-reconciliation assertion failed: ${a.id}`);
  }
}
