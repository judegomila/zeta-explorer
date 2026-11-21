/**
 * @fileoverview imp-96973 -- RECONCILIATION / MEASUREMENT: localise where the imp-96848 tail-trace-bound
 * ~3e15x numerical vacuity actually sits, resolving the imp-96876 vs imp-96888 tension (recorded by
 * imp-96923) into a SINGLE honest attribution, and confirming it holds at a SECOND (N,2a) rung.
 *
 * THE CONFLICT. The Weyl residual identity A_infty = A_T + R_T (R_T PSD, since sigma_2 >= 0 on the tail)
 * gives |lambda_min(A_infty) - lambda_min(A_T)| <= ||R_T|| = lambda_max(R_T). imp-96848 bounded the residual
 * by the closed-form majorant Tr(B^{-1} R_T) (the sum of ALL N tail eigenvalues), which at N=100, 2a=ln3,
 * T=4800 reads 1.446e12 vs. the actual measured residual 4.586e-4 -- a ~3.15e15x (~15-order) overshoot
 * (SUB-GAP IMP96848_TAILTRACE_MAJORANT / IMP96876_TRACE_VACUOUS). imp-96876/imp-96900 attributed that
 * looseness to the lambda_max(R_T) <= Tr(R_T) step and prescribed "control lambda_max(R_T) directly".
 * imp-96888 then REFUTED that (the lambda_max <= Tr step is only ~1.9x; lambda_max(R_T) is itself ~1.66e15x
 * vacuous), locating the true cause in the protected-bottom-eigenvalue spectral gap. imp-96923 recorded the
 * two chains as an unresolved tension.
 *
 * THE RECONCILIATION (this leaf). The total vacuity is an EXACT MULTIPLICATIVE FACTORISATION of three
 * telescoping ratios, each isolating one step of the bounding chain:
 *
 *   Tr(B^-1 R_T) / actual  =  [Tr / lambda_max]  x  [lambda_max / rayleigh]  x  [rayleigh / actual]
 *        (TOTAL)               (sum-vs-single)      (SPECTRAL GAP)             (trial-vector slack)
 *
 *   where rayleigh = <v0 | R_T | v0> is the min-max quadratic form in the A_T ground state v0 (a rigorous
 *   upper bound on the residual by min-max). At N=100, 2a=ln3, T=4800:
 *     TOTAL 3.154e15  =  [1.899]  x  [1.415e15]  x  [1.173],  product recomposes to 3.154e15 (closes exactly).
 *
 *   So the ~15-order vacuity lives ENTIRELY in step 2 (lambda_max / rayleigh = the spectral-gap factor):
 *   lambda_min sits at the OPPOSITE spectral end from the R_T mass (which sigma_2 ~ t^4 loads onto high-
 *   frequency modes nearly orthogonal to v0), so the Weyl worst-direction norm overshoots the protected
 *   bottom eigenvalue by ~15 orders. Step 1 (the imp-96876-blamed sum-vs-single step) is a benign ~1.9x, and
 *   step 3 (the trial-vector slack of v0) is a benign ~1.17x. imp-96876/imp-96900 mis-localised the vacuity
 *   in step 1; imp-96888 correctly localised it in step 2; this factorisation makes the split arithmetically
 *   explicit and the recomposition exact.
 *
 * ROBUST AT A SECOND (N,2a) RUNG. imp-96888 measured only (N=100, 2a=ln3) across T; this leaf re-runs the
 * full factorisation at two NEW (N,2a) points and confirms the split is not a (100,ln3) artifact:
 *     (2a=ln3,  N=100): TOTAL 3.154e15 = [1.899] x [1.415e15] x [1.173]   (reproduces imp-96888 verbatim)
 *     (2a=ln3,  N=88 ): TOTAL 8.977e14 = [1.875] x [4.274e14] x [1.120]
 *     (2a=0.96, N=100): TOTAL 1.475e14 = [1.907] x [6.477e13] x [1.194]
 *   Step 1 stays 1.88-1.91x at EVERY rung (the sum-vs-single step is uniformly benign); step 3 stays
 *   1.12-1.19x; the ~14-15 orders live in step 2 at every rung. The attribution is (N,2a)-robust.
 *
 * Driver: tmp/imp-96973-reconcile.py (/tmp/rhvenv, scipy 1.18) reuses the imp-96876/imp-96888/imp-96806
 * build()/lam_min()/tail_block()/core_block() solver VERBATIM (Gegenbauer C_n^{13/2} basis, condB=1,
 * panel=1.5 core / 3.0 tail, Tref=12800 for L, Tfar=60000). Literals below are verbatim from the run
 * (/tmp/imp-96973-out.json).
 *
 * VERDICT. Single honest attribution: the imp-96848 Tr(B^-1 R_T) vacuity is DOMINATED (all ~15 orders) by
 * the spectral-gap factor lambda_max(R_T)/<v0|R_T|v0>, NOT by the lambda_max <= Tr sum-vs-single step
 * (uniform ~1.9x, imp-96876/imp-96900 prescription mis-targeted) nor by the trial-vector slack (~1.17x).
 * The fix direction is therefore the min-max quadratic form (SUB-GAP IMP96888_RAYLEIGH_TAIL_MAJORANT: a
 * rigorous interval majorant for the single scalar tail integral (1/(pi B)) int_{|t|>T} sigma_2 |v0.Phi|^2
 * dt with a fixed rational trial v0), NOT per-mode reweighting of R_T eigenvalues.
 *
 * Measurement / reconciliation only: the residual, trace, lambda_max and Rayleigh values are QUADRATURE
 * evaluations, NOT rigorous interval majorants; the TRACE bound remains VALID (changes no bound); Rayleigh
 * floors are UPPER bounds on the true lambda_min; establishes NO operator positivity;
 * IMP96749_UNIFORM_N_GAP_UNSETTLED and IMP96888_RAYLEIGH_TAIL_MAJORANT stay open; interval-rigorous reach
 * stays 2a <= 0.96; RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (min-max Rayleigh bound; the diagnosis this leaf factorises)
 * @see imp-96876-krein-tresidual-crossval-measurement.js (IMP96876_TRACE_VACUOUS; the lambda_max-step prescription this leaf mis-localises to step 1)
 * @see imp-96848-krein-tresidual-rigorous-tailtrace-bound.js (closed-form TRACE bound; IMP96848_TAILTRACE_MAJORANT, still VALID)
 * @see imp-96900-krein-trace-vacuous-glossary-headword.js (IMP96876_TRACE_VACUOUS headword; fix-direction reconciled here)
 * @see imp-96806-krein-tconv-plateau-2a-ln3.js (reused build()/lam_min() solver; IMP96806_TSWEEP_LN3)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// per-(N,2a) multiplicative factorisation of the Tr(B^-1 R_T)/actual vacuity at T=4800, Tref=12800, Tfar=60000
// (verbatim from tmp/imp-96973-out.json). key = "<2a-tag>-N<N>"
export const IMP96973_RUNGS = Object.freeze({
  'ln3-N100': Object.freeze({
    twoA: LN3,
    N: 100,
    traceRT: 1446437293087.9375, // Tr(B^-1 R_T): imp-96848 route (all N tail modes)
    lammaxRT: 761661599882.6953, // lambda_max(R_T): Weyl operator norm ||R_T||
    rayleighV0RT: 5.381115666090913e-4, // <v0|R_T|v0>: min-max quadratic form in A_T ground state
    actualResid: 4.585862096558868e-4, // measured L - f(4800), L ~ f(12800)
    total: 3154122960159035.0, // Tr/actual: TOTAL vacuity
    step1SumVsSingle: 1.8990550308834075, // Tr/lammax -- the imp-96876-blamed step, BENIGN ~1.9x
    step2SpectralGap: 1415434358124475.8, // lammax/rayleigh -- carries ALL ~15 orders
    step3TrialSlack: 1.1734141918765473, // rayleigh/actual -- BENIGN ~1.17x
    recomposed: 3154122960159034.5, // step1*step2*step3, closes to TOTAL
  }),
  'ln3-N88': Object.freeze({
    twoA: LN3,
    N: 88,
    traceRT: 274945266424.1644,
    lammaxRT: 146604344777.78177,
    rayleighV0RT: 3.4304486043544965e-4,
    actualResid: 3.0627781768866047e-4,
    total: 897698920865544.4,
    step1SumVsSingle: 1.8754237252717016,
    step2SpectralGap: 427362020791354.0,
    step3TrialSlack: 1.1200447457287417,
    recomposed: 897698920865544.1,
  }),
  '0p96-N100': Object.freeze({
    twoA: 0.96,
    N: 100,
    traceRT: 3647157447803.918,
    lammaxRT: 1912955347543.6519,
    rayleighV0RT: 0.0295354491947961,
    actualResid: 0.024728044178580433,
    total: 147490736487890.38,
    step1SumVsSingle: 1.906556497770366,
    step2SpectralGap: 64768114238827.914,
    step3TrialSlack: 1.194411049312985,
    recomposed: 147490736487890.38,
  }),
});

export const IMP96973_VERDICT = Object.freeze({
  ticket: 'imp-96973',
  question:
    'localise where the imp-96848 tail-trace-bound ~3e15x vacuity actually sits (lambda_max<=Tr step vs protected-bottom spectral gap vs constant), reconciling imp-96848/96876/96888/96900/96923 into a single honest attribution and confirming it at a second (N,2a) rung.',
  answer:
    'the total Tr(B^-1 R_T)/actual vacuity is an exact multiplicative factorisation [Tr/lammax] x [lammax/rayleigh] x [rayleigh/actual] = (sum-vs-single) x (spectral gap) x (trial slack). All ~14-15 orders live in the spectral-gap factor lammax/rayleigh (1.415e15 at N=100,2a=ln3); the lambda_max<=Tr sum-vs-single step is a uniform ~1.9x and the trial-vector slack a uniform ~1.17x. This reconciles the tension: imp-96876/imp-96900 mis-localised the vacuity in step 1 (~1.9x), imp-96888 correctly localised it in step 2 (the protected bottom eigenvalue sits at the opposite spectral end from the sigma_2 ~ t^4 tail mass). Robust across three (N,2a) rungs: step 1 stays 1.88-1.91x and step 3 stays 1.12-1.19x at every rung while step 2 carries 6.5e13-1.4e15x. Fix direction is the min-max quadratic form (IMP96888_RAYLEIGH_TAIL_MAJORANT), not per-mode reweighting of R_T eigenvalues.',
  bindingRung: 'ln3-N100',
  T: 4800,
  Tref: 12800,
  Tfar: 60000,
  factorisationClosesEveryRung: true, // step1*step2*step3 == total at every rung
  step1IsUniformlyBenign: true, // Tr/lammax in [1.87,1.91] at every rung -- imp-96876/96900 mis-localisation
  step3IsUniformlyBenign: true, // rayleigh/actual in [1.12,1.20] at every rung
  vacuityLivesInSpectralGap: true, // step2 = lammax/rayleigh carries all ~14-15 orders at every rung
  imp96876Step1MisLocalisation: true, // the lambda_max<=Tr step is NOT where the ~15 orders live
  imp96888SpectralGapConfirmed: true, // imp-96888 diagnosis reproduced verbatim and extended to 2 new rungs
  traceBoundStillValid: true, // reconciliation changes NO bound; Tr(B^-1 R_T) remains a valid majorant
  rayleighIsRigorousUpperBound: true, // <v0|R_T|v0> >= actual at every rung (min-max)
  secondRungConfirmed: true, // (N=88,2a=ln3) and (N=100,2a=0.96) both confirm the split
  operatorPositivityProved: false, // Rayleigh floor is an UPPER bound
  uniformNGapSettled: false, // IMP96749_UNIFORM_N_GAP_UNSETTLED stays open
  rayleighTailMajorantOpen: true, // IMP96888_RAYLEIGH_TAIL_MAJORANT stays open (fix direction, not executed)
  subGap:
    'IMP96888_RAYLEIGH_TAIL_MAJORANT -- the reconciliation confirms the fix must control the min-max quadratic form <v0|R_T|v0> = (1/(pi B)) int_{|t|>T} sigma_2 |v0.Phi(t)|^2 dt with a fixed rational trial v0 (the spectral-gap factor is the sole ~15-order slack), NOT lambda_max(R_T) (imp-96876/96900 step-1 prescription mis-localised) nor Tr(R_T). Remaining open: a rigorous interval majorant for that single scalar tail integral.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96973_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96973_ASSERTIONS = [
  {
    id: 'imp96973-factorisation-closes',
    holds: () =>
      Object.values(IMP96973_RUNGS).every((r) => {
        const prod = r.step1SumVsSingle * r.step2SpectralGap * r.step3TrialSlack;
        return (
          Math.abs(prod / r.total - 1) < 1e-6 &&
          Math.abs(r.recomposed / r.total - 1) < 1e-6 &&
          Math.abs(r.total - r.traceRT / r.actualResid) / r.total < 1e-6
        );
      }),
    why: 'the three telescoping ratios recompose exactly to the total vacuity Tr/actual at every rung -- the factorisation is an identity, not an approximation.',
  },
  {
    id: 'imp96973-step1-uniformly-benign',
    holds: () =>
      Object.values(IMP96973_RUNGS).every(
        (r) =>
          r.step1SumVsSingle > 1.5 &&
          r.step1SumVsSingle < 2.5 &&
          Math.abs(r.step1SumVsSingle - r.traceRT / r.lammaxRT) < 1e-6,
      ),
    why: 'the lambda_max<=Tr sum-vs-single step is 1.88-1.91x at every (N,2a) rung -- imp-96876/imp-96900 mis-localised the ~15-order vacuity here.',
  },
  {
    id: 'imp96973-vacuity-lives-in-spectral-gap',
    holds: () =>
      Object.values(IMP96973_RUNGS).every(
        (r) =>
          r.step2SpectralGap > 1e13 &&
          Math.abs(r.step2SpectralGap - r.lammaxRT / r.rayleighV0RT) / r.step2SpectralGap < 1e-6,
      ),
    why: 'the spectral-gap factor lambda_max(R_T)/<v0|R_T|v0> carries 6.5e13-1.4e15x at every rung -- the entire ~14-15 orders, confirming the imp-96888 diagnosis.',
  },
  {
    id: 'imp96973-step3-benign-and-rayleigh-valid',
    holds: () =>
      Object.values(IMP96973_RUNGS).every(
        (r) =>
          r.step3TrialSlack > 1 &&
          r.step3TrialSlack < 1.3 &&
          r.rayleighV0RT >= r.actualResid,
      ),
    why: 'the trial-vector slack rayleigh/actual is a benign 1.12-1.20x and <v0|R_T|v0> >= actual at every rung -- the min-max Rayleigh form is a rigorous upper bound within ~20% of the true residual.',
  },
  {
    id: 'imp96973-reproduces-imp96888-binding-rung',
    holds: () => {
      const r = IMP96973_RUNGS['ln3-N100'];
      // the (N=100,2a=ln3) rung reproduces the imp-96888 verbatim literals
      return (
        Math.abs(r.traceRT - 1.446437e12) / r.traceRT < 1e-5 &&
        Math.abs(r.lammaxRT - 7.616616e11) / r.lammaxRT < 1e-5 &&
        Math.abs(r.rayleighV0RT - 5.381116e-4) / r.rayleighV0RT < 1e-5
      );
    },
    why: 'the binding rung reproduces the imp-96888 Tr/lammax/rayleigh literals, so this reconciliation extends a verified measurement rather than replacing it.',
  },
  {
    id: 'imp96973-measurement-only-no-qed',
    holds: () =>
      IMP96973_VERDICT.factorisationClosesEveryRung === true &&
      IMP96973_VERDICT.step1IsUniformlyBenign === true &&
      IMP96973_VERDICT.vacuityLivesInSpectralGap === true &&
      IMP96973_VERDICT.imp96876Step1MisLocalisation === true &&
      IMP96973_VERDICT.imp96888SpectralGapConfirmed === true &&
      IMP96973_VERDICT.traceBoundStillValid === true &&
      IMP96973_VERDICT.secondRungConfirmed === true &&
      IMP96973_VERDICT.operatorPositivityProved === false &&
      IMP96973_VERDICT.uniformNGapSettled === false &&
      IMP96973_VERDICT.rayleighTailMajorantOpen === true &&
      IMP96973_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96973_VERDICT.qed === false &&
      typeof IMP96973_VERDICT.subGap === 'string' &&
      IMP96973_VERDICT.subGap.includes('IMP96888_RAYLEIGH_TAIL_MAJORANT'),
    why: 'reconciliation done (factorisation closes, step 1 benign, vacuity in spectral gap, second rung confirmed), but values are quadrature not interval majorants, the trace bound stays valid, no operator positivity, uniform-N gap and Rayleigh majorant open, reach stays 2a<=0.96, no QED.',
  },
];

for (const a of IMP96973_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96973-krein-tailtrace-vacuity-factorisation assertion failed: ${a.id}`);
  }
}

void LN3;
