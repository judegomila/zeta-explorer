/**
 * @fileoverview imp-96876 -- MEASUREMENT / CROSS-VALIDATION: a direct high-T Route I Krein solve at
 * N=100, 2a=ln3 (Gegenbauer C_n^{13/2} basis, condB=1) measures the ACTUAL t-truncation residual profile
 * of the floor lambda_min(T_a[sigma_2]) and cross-tabulates it against the two coexisting upper-bound
 * routes for that residual:
 *   (GEOM)  imp-96827 geometric-per-doubling envelope: residual beyond T=4800 <= 1.304172e-3 (a fit).
 *   (TRACE) imp-96848 closed-form bound: L - f(T) <= a^{-(4m+1)} (1/2pi) int_{|t|>T} sigma_2 |Psi|^2 dt
 *           = Tr(B^{-1} R_T) (rigorous chain, R_T = M(inf) - M(T) >= 0; the NUMBER was its named sub-gap
 *           IMP96848_TAILTRACE_MAJORANT, evaluated here by direct quadrature of the transform diagonal).
 *
 * PREMISE (from the ticket). Three residual estimates coexisted for the 2a=ln3, N=100 residual and had
 * never been cross-tabulated against a direct measurement. This leaf runs the solve and tabulates which
 * upper-bound route is tighter, and by how much. Driver: tmp/imp-96876-tresidual-crossval.py (/tmp/rhvenv,
 * scipy 1.18) reuses the imp-96806 build()/lam_min() solver VERBATIM (Gegenbauer basis, panel=1.5) and adds
 * a scalar tail integrator for the TRACE route. Every literal below is verbatim from the run.
 *
 * FINDINGS (measured).
 *   1. THE DIRECT HIGH-T SOLVE VALIDATES THE imp-96827 ENCLOSURE. Extending the T-sweep past 4800 the
 *      N=100 floor keeps climbing: f(4800)=0.57998757 -> f(6400)=0.58025863 -> f(9600)=0.58041429 ->
 *      f(12800)=0.58044615 (increments +2.71e-4, +1.56e-4, +3.19e-5, still shrinking). The best-estimate
 *      limit L ~ 0.580446 lands INSIDE the imp-96827 enclosure [0.579666, 0.581292] and within 3.28e-5 of
 *      its center 0.580479 -- the plateau-tolerance leaf is corroborated by direct measurement.
 *   2. GEOM IS A VALID, CONSERVATIVE UPPER BOUND; THE imp-96827 EXP SUB-MODEL WAS TOO OPTIMISTIC. The
 *      ACTUAL residual beyond T=4800 is L - f(4800) = 4.586e-4. The GEOM envelope 1.304e-3 exceeds it by
 *      2.84x -- a valid, order-correct upper bound. By contrast the imp-96827 exponential-fit "residual"
 *      was -3.22e-4 (it placed the limit BELOW f(4800), i.e. predicted convergence was already reached);
 *      the direct solve REFUTES that -- the floor climbs a further +4.6e-4 above f(4800). So of the two
 *      imp-96827 sub-models GEOM is the safe one; EXP under-shot the true plateau by ~8e-4.
 *   3. THE imp-96848 CLOSED-FORM TRACE BOUND IS VALID BUT NUMERICALLY VACUOUS -- ~3e15x TOO LOOSE. The
 *      quadrature value of Tr(B^{-1} R_T) at T=4800 is 1.446e12 (tail-converged to ~0.1%: the transform
 *      diagonal |Psi_N(t)|^2 decays like t^{-7.4}, so sigma_2 |Psi|^2 ~ t^{-3.4} is integrable and the
 *      integral is a genuine number, not roundoff). It is a valid upper bound (1.446e12 >> 4.586e-4) but
 *      overshoots the actual residual by a factor 3.15e15. Reason: the step lambda_max(R_T) <= Tr(B^{-1}
 *      R_T) sums ALL N eigenvalues, and with sigma_2 ~ t^4 the high-index tail modes carry enormous mass
 *      unrelated to the minimising eigenvector.
 *
 * VERDICT. Cross-validation: at N=100, 2a=ln3 the direct high-T solve gives actual residual-beyond-4800 =
 * 4.586e-4, corroborates the imp-96827 enclosure (L~0.580446 inside [0.579666,0.581292], 3.3e-5 from
 * center), and ranks the two bound routes decisively -- the GEOM fit (1.304e-3, 2.84x) is the ONLY
 * numerically usable residual bound, while the imp-96848 closed-form TRACE bound (1.446e12, 3.15e15x) is
 * mathematically valid but numerically vacuous. This SHARPENS the imp-96848 sub-gap: even a
 * perfectly-assembled tail-trace majorant (its ingredient (ii)) would be ~15 orders too loose, because the
 * looseness is in the lambda_max(R_T) <= Tr(R_T) step, NOT in the un-computed constant; a usable rigorous
 * residual bound must control lambda_max(R_T) directly (per-mode weighted), not the trace. Measurement /
 * cross-validation only: the TRACE value is a QUADRATURE evaluation, NOT the rigorous interval majorant
 * (IMP96848_TAILTRACE_MAJORANT stays open); Rayleigh floors are UPPER bounds on the true lambda_min;
 * establishes NO operator positivity; IMP96749_UNIFORM_N_GAP_UNSETTLED stays open; interval-rigorous reach
 * stays 2a <= 0.96; RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96827-krein-tresidual-envelope-extrapolation.js (GEOM/EXP envelope; enclosure [0.579666,0.581292])
 * @see imp-96848-krein-tresidual-rigorous-tailtrace-bound.js (closed-form TRACE bound; IMP96848_TAILTRACE_MAJORANT)
 * @see imp-96847-krein-tconv-tvsn-scaling-law.js (two-route T_req bracket the residual routes descend from)
 * @see imp-96806-krein-tconv-plateau-2a-ln3.js (reused build()/lam_min() solver; IMP96806_TSWEEP_LN3)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (IMP96749_UNIFORM_N_GAP_UNSETTLED)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// direct high-T floor sweep at N=100, 2a=ln3 (verbatim from tmp/imp-96876-out.json; panel=1.5)
export const IMP96876_TS = Object.freeze([800, 1600, 3200, 4800, 6400, 9600, 12800]);
export const IMP96876_FLOOR = Object.freeze({
  800: 0.53384558,
  1600: 0.57076391,
  3200: 0.57895618,
  4800: 0.57998757,
  6400: 0.58025863,
  9600: 0.58041429,
  12800: 0.58044615,
});
export const IMP96876_L_EST = 0.58044615; // best (highest-T) estimate of the plateau limit L

// cross-validation against the imp-96827 plateau enclosure (verbatim imp-96827 IMP96827_N100_ENCLOSURE)
export const IMP96876_ENCLOSURE_CHECK = Object.freeze({
  LExp: 0.579666, // imp-96827 exponential-fit limit (lower end) -- too optimistic (below true L)
  center: 0.580479, // imp-96827 enclosure center
  LGeom: 0.581292, // imp-96827 geometric-per-doubling upper envelope (upper end)
  measuredL: 0.58044615,
  insideEnclosure: true, // 0.579666 < 0.580446 < 0.581292
  distToCenter: 3.28e-5, // |measuredL - center|
});

// the residual-beyond-T=4800 cross-tabulation (the binding rung both routes quote)
export const IMP96876_RESIDUAL_TABLE = Object.freeze({
  actual: 4.585800e-4, // L_est - f(4800): measured actual residual beyond T=4800
  geom: 1.304172e-3, // imp-96827 GEOM envelope (verbatim) -- valid upper bound
  trace: 1.446437e12, // imp-96848 Tr(B^{-1} R_T) at T=4800, quadrature (Tfar=60000, tail-converged ~0.1%)
  geomOverActual: 2.844, // GEOM / actual -- conservative but order-correct
  traceOverActual: 3.15e15, // TRACE / actual -- numerically vacuous
  traceOverGeom: 1.11e15, // TRACE / GEOM -- the looseness gap between the two routes
  bothAreUpperBounds: true, // actual <= GEOM and actual <= TRACE
  geomTighter: true, // GEOM << TRACE
  expSubModelResidual: -3.22e-4, // imp-96827 EXP "residual" (LExp - f(4800)) -- REFUTED (limit below true L)
});

// why the TRACE bound is vacuous (diagnostic, not a fabricated tightening)
export const IMP96876_TRACE_DIAGNOSIS = Object.freeze({
  psiDiagonalDecayExponent: -7.4, // measured |Psi_N(t)|^2 ~ t^{-7.4} (genuine Gegenbauer decay, not roundoff)
  integrandDecayExponent: -3.4, // sigma_2 |Psi|^2 ~ t^{-3.4} => integrable, TRACE is a real converged number
  loosenessSource: 'lambda_max(R_T) <= Tr(B^{-1} R_T) sums ALL N eigenvalues; sigma_2 ~ t^4 gives high-index tail modes enormous mass unrelated to the minimising eigenvector',
  fixDirection: 'a usable rigorous residual bound must control lambda_max(R_T) directly (per-mode weighted), not the trace',
});

export const IMP96876_VERDICT = Object.freeze({
  ticket: 'imp-96876',
  question:
    'a direct high-T Krein solve at N=100, 2a=ln3: what is the actual t-residual beyond T=4800, and how do the imp-96827 geometric envelope and the imp-96848 closed-form Tr(B^{-1} R_T) bound compare to it (which is tighter, by how much)?',
  answer:
    'actual residual beyond T=4800 = 4.586e-4 (floor climbs f(4800)=0.57998757 -> L~0.580446). The imp-96827 GEOM envelope 1.304e-3 is a valid, order-correct upper bound (2.84x actual) and the ONLY numerically usable one; its EXP sub-model (-3.22e-4, limit below f(4800)) is REFUTED by the further climb. The imp-96848 closed-form TRACE bound Tr(B^{-1} R_T) = 1.446e12 is a valid but numerically VACUOUS upper bound (3.15e15x actual): the looseness is in lambda_max(R_T) <= Tr(R_T) (sums all N tail-mode masses, sigma_2 ~ t^4), NOT in the un-computed constant. The measured L~0.580446 lands inside the imp-96827 enclosure [0.579666,0.581292], 3.3e-5 from its center.',
  binding2a: 'ln3',
  directSolvePerformed: true,
  enclosureValidated: true, // measured L inside imp-96827 [LExp, LGeom]
  geomIsValidUpperBound: true, // actual 4.586e-4 <= GEOM 1.304e-3
  geomOverActual: 2.844,
  expSubModelRefuted: true, // EXP put the limit below f(4800); floor actually climbs +4.6e-4
  traceIsValidUpperBound: true, // actual 4.586e-4 <= TRACE 1.446e12
  traceIsNumericallyVacuous: true, // 3.15e15x the actual residual
  traceOverActual: 3.15e15,
  traceLoosenessInLambdaMaxStep: true, // not in the un-computed constant -- sharpens the sub-gap
  traceValueIsQuadratureNotIntervalMajorant: true, // IMP96848_TAILTRACE_MAJORANT stays OPEN
  operatorPositivityProved: false, // Rayleigh floor is an UPPER bound
  uniformNGapSettled: false, // IMP96749_UNIFORM_N_GAP_UNSETTLED stays open
  subGap:
    'IMP96876_TRACE_VACUOUS -- the imp-96848 closed-form residual bound Tr(B^{-1} R_T) overshoots the actual N=100 residual by ~3e15x because the looseness lives in the lambda_max(R_T) <= Tr(R_T) step (sigma_2 ~ t^4 loads the high-index tail modes), so even a perfectly-assembled IMP96848_TAILTRACE_MAJORANT would be ~15 orders too loose; a usable rigorous residual bound must control lambda_max(R_T) directly, and the GEOM fit (2.84x) remains the only numerically useful residual estimate.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96876_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96876_ASSERTIONS = [
  {
    id: 'imp96876-floor-monotone-climb-past-4800',
    holds: () => {
      const f = IMP96876_FLOOR;
      // the N=100 floor climbs monotonically off T=800 all the way to T=12800
      return IMP96876_TS.every((T, i) => i === 0 || f[T] > f[IMP96876_TS[i - 1]]);
    },
    why: 'the direct high-T solve shows the N=100 floor still climbing monotonically past T=4800 (the truncation residual is being paid down), so f(4800) is NOT yet the limit.',
  },
  {
    id: 'imp96876-enclosure-validated',
    holds: () => {
      const e = IMP96876_ENCLOSURE_CHECK;
      return (
        e.LExp < e.measuredL && e.measuredL < e.LGeom && // measured L inside the imp-96827 enclosure
        e.insideEnclosure === true &&
        Math.abs(e.measuredL - e.center) < 1e-4 && // within the enclosure half-width of the center
        Math.abs(Math.abs(e.measuredL - e.center) - e.distToCenter) < 1e-6
      );
    },
    why: 'the directly-measured plateau L~0.580446 lands inside the imp-96827 enclosure [0.579666,0.581292] and within 3.3e-5 of its center 0.580479 -- corroborating the extrapolation leaf.',
  },
  {
    id: 'imp96876-geom-valid-and-tight',
    holds: () => {
      const r = IMP96876_RESIDUAL_TABLE;
      // GEOM is an upper bound on the measured residual and within an order of magnitude of it
      return r.actual < r.geom && r.geom < 10 * r.actual &&
        Math.abs(r.geomOverActual - r.geom / r.actual) < 0.02;
    },
    why: 'the imp-96827 GEOM envelope 1.304e-3 is a valid upper bound on the measured 4.586e-4 residual and is order-correct (2.84x) -- the only numerically usable residual bound.',
  },
  {
    id: 'imp96876-exp-submodel-refuted',
    holds: () => {
      const r = IMP96876_RESIDUAL_TABLE;
      // EXP predicted the limit BELOW f(4800) (negative residual); the solve shows a positive climb
      return r.expSubModelResidual < 0 && r.actual > 0;
    },
    why: 'the imp-96827 exponential-fit sub-model placed the limit below f(4800) (residual -3.22e-4), but the direct solve shows the floor climbs a further +4.586e-4 -- EXP under-shot the true plateau.',
  },
  {
    id: 'imp96876-trace-valid-but-vacuous',
    holds: () => {
      const r = IMP96876_RESIDUAL_TABLE;
      // TRACE is a valid upper bound but astronomically loose (>= 1e12 x the actual residual)
      return r.actual < r.trace && r.traceOverActual > 1e12 &&
        r.trace > r.geom && r.traceOverGeom > 1e12;
    },
    why: 'the imp-96848 closed-form Tr(B^{-1} R_T)=1.446e12 is a valid upper bound (>> actual) but numerically vacuous: it overshoots the measured residual by ~3e15x, far looser than the GEOM fit.',
  },
  {
    id: 'imp96876-trace-integrand-integrable-not-roundoff',
    holds: () => {
      const d = IMP96876_TRACE_DIAGNOSIS;
      // the transform diagonal decays fast enough that the tail integral converges (a real number)
      return d.psiDiagonalDecayExponent < -6 && d.integrandDecayExponent < -3 && d.integrandDecayExponent > -4;
    },
    why: 'the measured |Psi_N|^2 ~ t^{-7.4} decay (genuine, not roundoff) makes sigma_2 |Psi|^2 ~ t^{-3.4} integrable, so the TRACE value is a real converged number and the vacuity is intrinsic, not a quadrature artifact.',
  },
  {
    id: 'imp96876-measurement-only-no-qed',
    holds: () =>
      IMP96876_VERDICT.directSolvePerformed === true &&
      IMP96876_VERDICT.enclosureValidated === true &&
      IMP96876_VERDICT.geomIsValidUpperBound === true &&
      IMP96876_VERDICT.traceIsNumericallyVacuous === true &&
      IMP96876_VERDICT.traceValueIsQuadratureNotIntervalMajorant === true &&
      IMP96876_VERDICT.operatorPositivityProved === false &&
      IMP96876_VERDICT.uniformNGapSettled === false &&
      IMP96876_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96876_VERDICT.qed === false &&
      typeof IMP96876_VERDICT.subGap === 'string' &&
      IMP96876_VERDICT.subGap.includes('IMP96876_TRACE_VACUOUS'),
    why: 'cross-validation done (GEOM valid+tight, TRACE valid+vacuous, enclosure corroborated), but the TRACE value is quadrature not the rigorous interval majorant, Rayleigh floor is an UPPER bound: no operator positivity, uniform-N gap open, reach stays 2a <= 0.96, no QED.',
  },
];

for (const a of IMP96876_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96876-krein-tresidual-crossval-measurement assertion failed: ${a.id}`);
  }
}

void LN3;
