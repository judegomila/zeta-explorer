/**
 * @fileoverview imp-96888 -- MEASUREMENT / DERIVATION: a per-mode residual bound for the Route I Krein
 * floor lambda_min(T_a[sigma_2]) at N=100, 2a=ln3 that replaces the numerically vacuous imp-96848 trace
 * majorant. imp-96876 (SUB-GAP IMP96876_TRACE_VACUOUS) attributed the 3.15e15x looseness of the closed-form
 * bound Tr(B^{-1} R_T) to the step lambda_max(R_T) <= Tr(R_T), and prescribed "control lambda_max(R_T)
 * directly (per-mode weighted)". This leaf ASSEMBLES the tail block R_T = M(inf) - M(T) (PSD) and measures,
 * rung by rung, three residual quantities against the actual measured residual:
 *   (TRACE)    Tr(B^{-1} R_T)              -- the imp-96848 route (sum of ALL N tail eigenvalues).
 *   (LAMMAX)   lambda_max(R_T)             -- the sharp Weyl operator-norm residual ||R_T||.
 *   (RAYLEIGH) <v0 | R_T | v0>             -- the min-max quadratic form in the truncated ground state v0.
 *
 * Weyl residual identity: A_infty = A_T + R_T with R_T PSD (sigma_2 >= 0 on the tail), giving the operator
 * bound |lambda_min(A_infty) - lambda_min(A_T)| <= ||R_T|| = lambda_max(R_T). The min-max (Rayleigh) bound is
 * sharper still: since A_infty = A_T + R_T, taking the A_T ground state v0 as a trial vector,
 *   lambda_min(A_infty) <= <v0 | A_T + R_T | v0> = lambda_min(A_T) + <v0 | R_T | v0>,
 * so the residual L - f(T) = lambda_min(A_infty) - lambda_min(A_T) <= <v0 | R_T | v0>. This is a RIGOROUS
 * upper bound on the residual for ANY trial v0 (exactness of v0 is not required -- a rational near-ground
 * trial would keep it rigorous), and it is a SINGLE scalar tail integral
 *   <v0 | R_T | v0> = (1/(pi B)) int_{|t|>T} sigma_2(t) |v0 . Phi(t)|^2 dt,
 * not the trace diagonal sum_j |Phi_j(t)|^2.
 *
 * Driver: tmp/imp-96888-lammax-rt.py (/tmp/rhvenv, scipy 1.18) reuses the imp-96876/imp-96806 build()/
 * lam_min() solver VERBATIM (Gegenbauer C_n^{13/2} basis, condB=1, panel=1.5, Tfar=60000). Every literal
 * below is verbatim from the run (/tmp/imp-96888-out.json).
 *
 * FINDINGS (measured).
 *   1. THE imp-96876 DIAGNOSIS IS REFUTED: THE lambda_max <= Tr STEP IS ONLY ~1.9x, NOT 15 ORDERS. At
 *      T=4800 lambda_max(R_T)=7.617e11 while Tr(R_T)=1.446e12, so Tr/lambda_max=1.90 (the tail block is
 *      essentially rank-2, not "all N modes carry enormous mass"). Controlling lambda_max(R_T) directly, as
 *      imp-96876 prescribed, does NOT help: lambda_max(R_T) is STILL 1.66e15x the actual residual 4.586e-4.
 *      The ~15-order looseness is INTRINSIC to the Weyl operator-norm bound, not to the trace step.
 *   2. THE SHARP RESIDUAL IS THE MIN-MAX RAYLEIGH FORM <v0|R_T|v0>, WHICH RECOVERS ~15 ORDERS. Using the
 *      A_T ground state v0 as trial vector, <v0|R_T|v0> = 5.381e-4 at T=4800, only 1.17x the actual
 *      4.586e-4 -- and it is a RIGOROUS upper bound on the residual by min-max. Rung ladder:
 *        T=4800: <v0|R_T|v0>=5.381e-4 (1.17x actual), lambda_max=7.617e11, Tr=1.446e12
 *        T=6400: <v0|R_T|v0>=2.305e-4 (1.23x actual)
 *        T=9600: <v0|R_T|v0>=7.144e-5 (2.24x actual)
 *      lambda_max/Rayleigh ~ 1.4e15 at every rung: the operator-norm bound overshoots the min-max bound by
 *      ~15 orders because R_T top eigenvectors are nearly orthogonal to the protected ground state v0.
 *   3. WHY: lambda_min sits at the OPPOSITE spectral end from the R_T mass. ||R_T|| is a worst-case over ALL
 *      directions; the tail perturbation loads high-frequency modes (sigma_2 ~ t^4) that are nearly
 *      orthogonal to v0, so first-order perturbation of the PROTECTED bottom eigenvalue is ~15 orders below
 *      the top-of-spectrum norm. The gap protecting lambda_min, not any per-mode reweighting of R_T eigen-
 *      values, is what makes the residual small.
 *
 * VERDICT. The residual bound must control the QUADRATIC FORM <v0|R_T|v0> (min-max, protected bottom
 * eigenvalue), NOT lambda_max(R_T) (Weyl, worst direction) and NOT Tr(R_T) (all modes). The Rayleigh route
 * is a rigorous upper bound within 1.17-2.24x of the measured residual across T in {4800,6400,9600},
 * recovering ~15 orders vs both the trace and the operator-norm routes. This CORRECTS the imp-96876
 * prescription ("control lambda_max(R_T) directly") -- lambda_max is itself vacuous. The remaining open task
 * (SUB-GAP IMP96888_RAYLEIGH_TAIL_MAJORANT) is a rigorous interval majorant for the SINGLE scalar tail
 * integral (1/(pi B)) int_{|t|>T} sigma_2(t) |v0 . Phi(t)|^2 dt with a fixed rational trial v0 -- a far more
 * tractable object than the trace diagonal, since |v0 . Phi(t)|^2 concentrates the mass the trace disperses.
 * Measurement / derivation only: the Rayleigh value is a QUADRATURE evaluation, NOT the rigorous interval
 * majorant (which stays open); Rayleigh floors are UPPER bounds on the true lambda_min; establishes NO
 * operator positivity; IMP96749_UNIFORM_N_GAP_UNSETTLED stays open; interval-rigorous reach stays
 * 2a <= 0.96; RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96876-krein-tresidual-crossval-measurement.js (IMP96876_TRACE_VACUOUS; the lambda_max prescription this leaf corrects)
 * @see imp-96848-krein-tresidual-rigorous-tailtrace-bound.js (closed-form TRACE bound; IMP96848_TAILTRACE_MAJORANT)
 * @see imp-96827-krein-tresidual-envelope-extrapolation.js (GEOM/EXP envelope; enclosure [0.579666,0.581292])
 * @see imp-96806-krein-tconv-plateau-2a-ln3.js (reused build()/lam_min() solver; IMP96806_TSWEEP_LN3)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (IMP96749_UNIFORM_N_GAP_UNSETTLED)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// per-rung residual comparison at N=100, 2a=ln3, Tfar=60000 (verbatim from tmp/imp-96888-out.json)
export const IMP96888_ROWS = Object.freeze({
  4800: Object.freeze({
    traceRT: 1.446437e12, // Tr(B^{-1} R_T): imp-96848 route
    lammaxRT: 7.616616e11, // lambda_max(R_T): sharp Weyl operator norm ||R_T||
    rayleighV0RT: 5.381116e-4, // <v0|R_T|v0>: min-max quadratic form in the A_T ground state
    actualResid: 4.585845e-4, // measured L - f(4800)
    rayleighOverActual: 1.1734, // RIGOROUS upper bound, only 17% loose
    lammaxOverActual: 1.661e15, // Weyl norm still ~15 orders too loose
    traceOverLammax: 1.899, // the lambda_max <= Tr step is ONLY ~1.9x (imp-96876 diagnosis refuted)
    lammaxOverRayleigh: 1.415e15, // operator norm overshoots the min-max bound by ~15 orders
  }),
  6400: Object.freeze({
    traceRT: 6.524032e11,
    lammaxRT: 3.455364e11,
    rayleighV0RT: 2.304929e-4,
    actualResid: 1.875213e-4,
    rayleighOverActual: 1.2292,
    lammaxOverActual: 1.843e15,
    traceOverLammax: 1.888,
    lammaxOverRayleigh: 1.499e15,
  }),
  9600: Object.freeze({
    traceRT: 2.073893e11,
    lammaxRT: 1.101931e11,
    rayleighV0RT: 7.143893e-5,
    actualResid: 3.186173e-5,
    rayleighOverActual: 2.2422,
    lammaxOverActual: 3.458e15,
    traceOverLammax: 1.882,
    lammaxOverRayleigh: 1.542e15,
  }),
});

export const IMP96888_VERDICT = Object.freeze({
  ticket: 'imp-96888',
  question:
    'assemble the tail block R_T at N=100, 2a=ln3 and derive a per-mode residual bound that controls lambda_max(R_T) directly (as imp-96876 prescribed) so the t-truncation residual majorant is not ~15 orders loose -- does controlling lambda_max help, or is a different quantity needed?',
  answer:
    'controlling lambda_max(R_T) does NOT help. Direct assembly shows the lambda_max(R_T) <= Tr(R_T) step is only ~1.9x (the tail block is essentially rank-2), yet lambda_max(R_T)=7.617e11 is STILL 1.66e15x the actual residual 4.586e-4 -- the ~15-order looseness is intrinsic to the Weyl operator-norm bound, not the trace step, so the imp-96876 prescription is refuted. The sharp bound is the min-max quadratic form <v0|R_T|v0>=5.381e-4 in the A_T ground state v0, a RIGOROUS upper bound on the residual (only 1.17x actual at T=4800; 1.17-2.24x across T in {4800,6400,9600}), which recovers ~15 orders because lambda_min sits at the opposite spectral end from the R_T mass and is protected by the spectral gap. The remaining open task is a rigorous interval majorant for the single scalar integral (1/(pi B)) int_{|t|>T} sigma_2 |v0.Phi(t)|^2 dt with a fixed rational trial v0.',
  binding2a: 'ln3',
  N: 100,
  Tfar: 60000,
  tailBlockAssembled: true,
  lammaxStepIsOnly19x: true, // Tr/lambda_max ~ 1.9 -- imp-96876 lambda_max-step diagnosis REFUTED
  lammaxIsStillVacuous: true, // lambda_max(R_T) ~ 1.66e15x actual: controlling it does not help
  imp96876PrescriptionRefuted: true, // "control lambda_max(R_T) directly" would still be ~15 orders loose
  rayleighIsRigorousUpperBound: true, // min-max: residual <= <v0|R_T|v0> for any trial v0
  rayleighOverActualMax: 2.2422, // worst rung (T=9600); T=4800 is 1.17x
  rayleighRecoversOrders: 15, // <v0|R_T|v0> vs lambda_max(R_T): ~15 orders tighter
  rayleighValueIsQuadratureNotIntervalMajorant: true, // IMP96888_RAYLEIGH_TAIL_MAJORANT stays OPEN
  operatorPositivityProved: false, // Rayleigh floor is an UPPER bound
  uniformNGapSettled: false, // IMP96749_UNIFORM_N_GAP_UNSETTLED stays open
  subGap:
    'IMP96888_RAYLEIGH_TAIL_MAJORANT -- the sharp t-truncation residual bound is the min-max quadratic form <v0|R_T|v0> = (1/(pi B)) int_{|t|>T} sigma_2 |v0.Phi(t)|^2 dt in the truncated ground state v0 (rigorous upper bound by min-max for any trial v0, 1.17-2.24x the measured residual), NOT lambda_max(R_T) (~1.66e15x, imp-96876 prescription refuted) nor Tr(R_T) (~3.15e15x). Remaining open: a rigorous interval majorant for that single scalar tail integral with a fixed rational trial v0 -- a far more tractable object than the trace diagonal because |v0.Phi(t)|^2 concentrates the mass the trace disperses across all N modes.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96888_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96888_ASSERTIONS = [
  {
    id: 'imp96888-lammax-step-is-benign',
    holds: () => {
      // the lambda_max(R_T) <= Tr(R_T) step is only ~1.9x at every rung -- NOT the 15-order looseness source
      return Object.values(IMP96888_ROWS).every(
        (r) => r.traceOverLammax > 1.5 && r.traceOverLammax < 2.5 &&
          Math.abs(r.traceOverLammax - r.traceRT / r.lammaxRT) < 0.01,
      );
    },
    why: 'direct assembly shows Tr(R_T)/lambda_max(R_T) ~ 1.9 at every rung (the tail block is essentially rank-2), refuting the imp-96876 claim that all N tail modes carry the looseness.',
  },
  {
    id: 'imp96888-lammax-still-vacuous',
    holds: () => {
      // lambda_max(R_T) itself is still ~15 orders too loose -- controlling it does not help
      return Object.values(IMP96888_ROWS).every(
        (r) => r.lammaxOverActual > 1e14 && r.lammaxRT > r.actualResid,
      );
    },
    why: 'lambda_max(R_T) ~ 1.66e15x the actual residual: the Weyl operator-norm bound is intrinsically vacuous, so the imp-96876 "control lambda_max directly" prescription would still be ~15 orders loose.',
  },
  {
    id: 'imp96888-rayleigh-rigorous-upper-bound',
    holds: () => {
      // <v0|R_T|v0> is a valid upper bound on the residual (min-max) at every rung
      return Object.values(IMP96888_ROWS).every(
        (r) => r.rayleighV0RT >= r.actualResid && r.rayleighOverActual >= 1,
      );
    },
    why: 'by min-max, lambda_min(A_T+R_T) <= lambda_min(A_T) + <v0|R_T|v0>, so <v0|R_T|v0> is a rigorous upper bound on the residual for the A_T ground-state trial v0 -- confirmed >= actual at every rung.',
  },
  {
    id: 'imp96888-rayleigh-recovers-15-orders',
    holds: () => {
      // <v0|R_T|v0> is order-tight (< 3x actual) AND ~15 orders below lambda_max(R_T)
      return Object.values(IMP96888_ROWS).every(
        (r) => r.rayleighOverActual < 3 && r.lammaxOverRayleigh > 1e14 &&
          Math.abs(r.lammaxOverRayleigh - r.lammaxRT / r.rayleighV0RT) / r.lammaxOverRayleigh < 0.01,
      );
    },
    why: 'the min-max Rayleigh bound lands within 1.17-2.24x of the measured residual while sitting ~1.4e15x below lambda_max(R_T) -- the min-max form recovers the ~15 orders the operator-norm bound discards.',
  },
  {
    id: 'imp96888-measurement-only-no-qed',
    holds: () =>
      IMP96888_VERDICT.tailBlockAssembled === true &&
      IMP96888_VERDICT.lammaxStepIsOnly19x === true &&
      IMP96888_VERDICT.lammaxIsStillVacuous === true &&
      IMP96888_VERDICT.imp96876PrescriptionRefuted === true &&
      IMP96888_VERDICT.rayleighIsRigorousUpperBound === true &&
      IMP96888_VERDICT.rayleighValueIsQuadratureNotIntervalMajorant === true &&
      IMP96888_VERDICT.operatorPositivityProved === false &&
      IMP96888_VERDICT.uniformNGapSettled === false &&
      IMP96888_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96888_VERDICT.qed === false &&
      typeof IMP96888_VERDICT.subGap === 'string' &&
      IMP96888_VERDICT.subGap.includes('IMP96888_RAYLEIGH_TAIL_MAJORANT'),
    why: 'derivation done (lambda_max step benign, lambda_max still vacuous, Rayleigh rigorous+tight), but the Rayleigh value is quadrature not the rigorous interval majorant, Rayleigh floor is an UPPER bound: no operator positivity, uniform-N gap open, reach stays 2a <= 0.96, no QED.',
  },
];

for (const a of IMP96888_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96888-krein-tresidual-rayleigh-permode-bound assertion failed: ${a.id}`);
  }
}

void LN3;
