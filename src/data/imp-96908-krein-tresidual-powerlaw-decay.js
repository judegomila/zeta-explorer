/**
 * @fileoverview imp-96908 -- MEASUREMENT: the T-decay power law of the imp-96888 min-max Rayleigh residual
 * <v0|R_T|v0> for the Route I Krein floor lambda_min(T_a[sigma_2]) at N=100, 2a=ln3, and the T needed for
 * that rigorous residual to fall below the ~1e-3 floor-vs-plateau margin.
 *
 * imp-96888 established that the sharp t-truncation residual is the min-max quadratic form
 *   <v0|R_T|v0> = (1/(pi B)) int_{|t|>T} sigma_2(t) |v0 . Phi(t)|^2 dt
 * with v0 the A_T ground state -- a RIGOROUS upper bound on the residual L - f(T) by min-max for ANY trial
 * v0 (lambda_min(A_T + R_T) <= lambda_min(A_T) + <v0|R_T|v0>). It measured only three rungs
 * T in {4800,6400,9600} and never fit the decay rate. This leaf EXTENDS the ladder to
 * T in {4800,6400,9600,14400,21600,32400}, FITS the power law <v0|R_T|v0> ~ c T^-q, and sizes the T needed
 * for the bound to drop below the ~1e-3 margin.
 *
 * Driver: tmp/imp-96908-tresidual-powerlaw.py (/tmp/rhvenv, scipy 1.18) reuses the imp-96876/imp-96806/
 * imp-96888 build()/lam_min() solver VERBATIM (Gegenbauer C_n^{13/2} basis, condB=1, core panel=1.5/gl=24,
 * tail panel=3.0/gl=16), streaming the tail Rayleigh integral in panel chunks. Only change from imp-96888:
 * Tfar 60000 -> 100000 (so the ratio Tfar/Tmax stays ~3x at the top rung T=32400). Every literal below is
 * verbatim from the run (/tmp/imp-96908-out.json).
 *
 * FINDINGS (measured).
 *   1. THE MIN-MAX RESIDUAL FOLLOWS A CLEAN SINGLE POWER LAW <v0|R_T|v0> ~ 2.494e7 * T^-2.898. The global
 *      log-linear least-squares fit over all six rungs gives c=2.494312e7, q=2.897848 with an RMS log-
 *      residual of only 7.78e-3 (~0.8%). The LOCAL segment exponents -dlnR/dlnT are remarkably stable across
 *      the whole 6.75x ladder -- 2.9447, 2.8822, 2.8725, 2.8915, 2.9468 -- clustering tightly at q ~ 2.90
 *      with no drift, so a single power law describes the decay from T=4800 to T=32400 (no crossover).
 *   2. THE EXTENDED LADDER (verbatim <v0|R_T|v0>, Tfar=100000):
 *        T=4800:  5.384460e-4   (f(T)=0.000240440)
 *        T=6400:  2.307993e-4   (f(T)=0.000240552)
 *        T=9600:  7.173015e-5   (f(T)=0.000240617)
 *        T=14400: 2.238126e-5   (f(T)=0.000240636)
 *        T=21600: 6.929865e-6   (f(T)=0.000240645)
 *        T=32400: 2.098101e-6   (f(T)=0.000240648)
 *      The three overlapping rungs match the imp-96888 Tfar=60000 values to within +0.06% / +0.13% / +0.41%
 *      (a tiny upward shift from the larger Tfar capturing more tail mass), confirming Tfar is NOT the
 *      dominant error and the imp-96888 rungs were already tail-converged.
 *   3. T-SIZING FOR THE 1e-3 MARGIN: solving c T^-q = 1e-3 gives T* = 3871, i.e. the rigorous min-max
 *      residual bound is ALREADY below the ~1e-3 floor-vs-plateau margin at the FIRST measured rung T=4800
 *      (5.38e-4 < 1e-3). No large T is needed -- T ~ 3900 suffices for the min-max residual leg. The
 *      t-truncation residual is therefore NOT the binding difficulty for a 2a=ln3 certificate; the binding
 *      leg is the uniform-in-N spectral gap (IMP96749_UNIFORM_N_GAP_UNSETTLED) and the promotion of the
 *      Rayleigh QUADRATURE value to a rigorous interval majorant (IMP96888_RAYLEIGH_TAIL_MAJORANT).
 *
 * VERDICT. The min-max residual <v0|R_T|v0> decays as a clean single power law ~ 2.494e7 * T^-2.898 (local
 * exponents 2.87-2.95, no crossover across the 4800 -> 32400 ladder), and T* = 3871 already places the
 * rigorous Rayleigh bound below the ~1e-3 margin -- so t-truncation is a settled, cheap leg at 2a=ln3, N=100.
 * Measurement only: <v0|R_T|v0> is a QUADRATURE evaluation of the tail integral, NOT the rigorous interval
 * majorant (IMP96888_RAYLEIGH_TAIL_MAJORANT stays open); the power-law fit is an empirical decay law, not a
 * proven asymptotic; Rayleigh floors are UPPER bounds on the true lambda_min; establishes NO operator
 * positivity; IMP96749_UNIFORM_N_GAP_UNSETTLED stays open; interval-rigorous reach stays 2a <= 0.96; RH open;
 * no refereed bound is changed; NO QED.
 *
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (the min-max Rayleigh residual this leaf fits; IMP96888_RAYLEIGH_TAIL_MAJORANT)
 * @see imp-96876-krein-tresidual-crossval-measurement.js (reused build()/lam_min() solver; IMP96876_TRACE_VACUOUS)
 * @see imp-96827-krein-tresidual-envelope-extrapolation.js (GEOM/EXP envelope; enclosure [0.579666,0.581292])
 * @see imp-96806-krein-tconv-plateau-2a-ln3.js (reused solver; IMP96806_TSWEEP_LN3)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (IMP96749_UNIFORM_N_GAP_UNSETTLED)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// extended T ladder: <v0|R_T|v0> and f(T)=lambda_min(A_T) at N=100, 2a=ln3, Tfar=100000
// (verbatim from tmp/imp-96908-out.json)
export const IMP96908_ROWS = Object.freeze({
  4800: Object.freeze({ rayleighV0RT: 5.384460e-4, fT: 0.000240440 }),
  6400: Object.freeze({ rayleighV0RT: 2.307993e-4, fT: 0.000240552 }),
  9600: Object.freeze({ rayleighV0RT: 7.173015e-5, fT: 0.000240617 }),
  14400: Object.freeze({ rayleighV0RT: 2.238126e-5, fT: 0.000240636 }),
  21600: Object.freeze({ rayleighV0RT: 6.929865e-6, fT: 0.000240645 }),
  32400: Object.freeze({ rayleighV0RT: 2.098101e-6, fT: 0.000240648 }),
});

// global log-linear least-squares power-law fit <v0|R_T|v0> ~ c T^-q
export const IMP96908_FIT = Object.freeze({
  c: 2.494312e7,
  q: 2.897848,
  rmsLnResid: 7.7780e-3, // ~0.8% -- a clean single power law
});

// local segment exponents -dlnR/dlnT across consecutive rungs (tightly clustered at ~2.90, no drift)
export const IMP96908_SEG_EXPONENTS = Object.freeze([
  Object.freeze({ T0: 4800, T1: 6400, qLocal: 2.9447 }),
  Object.freeze({ T0: 6400, T1: 9600, qLocal: 2.8822 }),
  Object.freeze({ T0: 9600, T1: 14400, qLocal: 2.8725 }),
  Object.freeze({ T0: 14400, T1: 21600, qLocal: 2.8915 }),
  Object.freeze({ T0: 21600, T1: 32400, qLocal: 2.9468 }),
]);

export const IMP96908_VERDICT = Object.freeze({
  ticket: 'imp-96908',
  question:
    'measure the T-decay power law of the imp-96888 min-max Rayleigh residual <v0|R_T|v0> across an extended T ladder, fit <v0|R_T|v0> ~ c T^-q, and size how large T must reach for the rigorous residual to fall below the ~1e-3 floor-vs-plateau margin at 2a=ln3, N=100',
  answer:
    'the min-max residual follows a clean single power law <v0|R_T|v0> ~ 2.494e7 * T^-2.898 (global fit, RMS log-residual 7.78e-3 ~0.8%); the local segment exponents 2.9447/2.8822/2.8725/2.8915/2.9468 cluster tightly at q ~ 2.90 with no drift across the 4800 -> 32400 ladder (no crossover). Solving c T^-q = 1e-3 gives T* = 3871, so the rigorous Rayleigh bound is ALREADY below the ~1e-3 margin at the first measured rung T=4800 (5.38e-4). The t-truncation residual is a settled, cheap leg (T ~ 3900 suffices); the binding difficulty at 2a=ln3 is the uniform-in-N spectral gap and the promotion of the Rayleigh quadrature value to a rigorous interval majorant, not the truncation of the t-integral.',
  binding2a: 'ln3',
  N: 100,
  Tfar: 100000,
  margin: 1e-3,
  powerLawC: 2.494312e7,
  powerLawQ: 2.897848,
  powerLawRmsLnResid: 7.7780e-3, // clean single power law
  segExponentsStableNearQ: true, // local exponents 2.87-2.95, no drift/crossover
  TstarForMargin: 3871.0, // c T^-q = 1e-3
  residualBelowMarginAtFirstRung: true, // 5.38e-4 < 1e-3 already at T=4800
  crossValMaxRelDiffVsImp96888: 0.0041, // 3 overlap rungs match imp-96888 (Tfar=60000) to +0.06/0.13/0.41%
  rayleighValueIsQuadratureNotIntervalMajorant: true, // IMP96888_RAYLEIGH_TAIL_MAJORANT stays OPEN
  powerLawIsEmpiricalNotProvenAsymptotic: true, // fit, not a proven decay theorem
  operatorPositivityProved: false, // Rayleigh floor is an UPPER bound
  uniformNGapSettled: false, // IMP96749_UNIFORM_N_GAP_UNSETTLED stays open
  subGap:
    'IMP96908_TRUNCATION_LEG_SETTLED -- the min-max t-truncation residual <v0|R_T|v0> decays as ~2.494e7*T^-2.898 and is already below the ~1e-3 floor-vs-plateau margin at T~3900 (T*=3871), so t-truncation is NOT the binding leg for a 2a=ln3 certificate. Remaining open: the rigorous interval majorant for the single scalar tail integral with a fixed rational trial v0 (IMP96888_RAYLEIGH_TAIL_MAJORANT), and the uniform-in-N spectral gap (IMP96749_UNIFORM_N_GAP_UNSETTLED).',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96908_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96908_ASSERTIONS = [
  {
    id: 'imp96908-monotone-decay',
    holds: () => {
      const Ts = Object.keys(IMP96908_ROWS).map(Number).sort((a, b) => a - b);
      for (let i = 1; i < Ts.length; i++) {
        if (!(IMP96908_ROWS[Ts[i]].rayleighV0RT < IMP96908_ROWS[Ts[i - 1]].rayleighV0RT)) return false;
      }
      return Ts.length === 6;
    },
    why: 'the min-max residual <v0|R_T|v0> decays strictly and monotonically across the six-rung ladder from T=4800 to T=32400.',
  },
  {
    id: 'imp96908-single-power-law',
    holds: () => {
      // global exponent ~2.90 and every local segment exponent within 0.05 of it -> clean single power law
      const q = IMP96908_FIT.q;
      return q > 2.85 && q < 2.95 && IMP96908_FIT.rmsLnResid < 0.02 &&
        IMP96908_SEG_EXPONENTS.every((s) => Math.abs(s.qLocal - q) < 0.06);
    },
    why: 'the global fit exponent q=2.898 with RMS log-residual 0.78% and local segment exponents all within 0.05 of it confirm a single power law with no crossover across the 6.75x ladder.',
  },
  {
    id: 'imp96908-fit-reproduces-rows',
    holds: () => {
      // the fitted c T^-q reproduces each measured rung to within ~5% (clean power law over the ladder)
      return Object.entries(IMP96908_ROWS).every(([T, r]) => {
        const pred = IMP96908_FIT.c * Math.pow(Number(T), -IMP96908_FIT.q);
        return Math.abs(pred - r.rayleighV0RT) / r.rayleighV0RT < 0.05;
      });
    },
    why: 'the fitted law 2.494e7*T^-2.898 predicts every measured Rayleigh residual to within 5%, verifying the reported c,q against the row literals.',
  },
  {
    id: 'imp96908-Tstar-below-margin',
    holds: () => {
      // T* solves c T^-q = margin, and the residual is already below margin at the first rung
      const Tstar = Math.pow(IMP96908_FIT.c / IMP96908_VERDICT.margin, 1 / IMP96908_FIT.q);
      return Math.abs(Tstar - IMP96908_VERDICT.TstarForMargin) / IMP96908_VERDICT.TstarForMargin < 0.01 &&
        IMP96908_ROWS[4800].rayleighV0RT < IMP96908_VERDICT.margin &&
        IMP96908_VERDICT.residualBelowMarginAtFirstRung === true;
    },
    why: 'solving c T^-q = 1e-3 reproduces T*=3871 (< first measured rung 4800), and <v0|R_T|v0>=5.38e-4 < 1e-3 already at T=4800 -- the t-truncation leg is settled cheaply.',
  },
  {
    id: 'imp96908-measurement-only-no-qed',
    holds: () =>
      IMP96908_VERDICT.segExponentsStableNearQ === true &&
      IMP96908_VERDICT.residualBelowMarginAtFirstRung === true &&
      IMP96908_VERDICT.rayleighValueIsQuadratureNotIntervalMajorant === true &&
      IMP96908_VERDICT.powerLawIsEmpiricalNotProvenAsymptotic === true &&
      IMP96908_VERDICT.operatorPositivityProved === false &&
      IMP96908_VERDICT.uniformNGapSettled === false &&
      IMP96908_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96908_VERDICT.qed === false &&
      typeof IMP96908_VERDICT.subGap === 'string' &&
      IMP96908_VERDICT.subGap.includes('IMP96908_TRUNCATION_LEG_SETTLED'),
    why: 'decay law fit and T-sizing done, but the Rayleigh value is quadrature not the rigorous interval majorant and the power law is empirical not proven: Rayleigh floor is an UPPER bound, no operator positivity, uniform-N gap open, reach stays 2a <= 0.96, no QED.',
  },
];

for (const a of IMP96908_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96908-krein-tresidual-powerlaw-decay assertion failed: ${a.id}`);
  }
}

void LN3;
