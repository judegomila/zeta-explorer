/**
 * @fileoverview imp-96923 -- RECONCILIATION NOTE (no new solve): records that the imp-96876 diagnosis of
 * the imp-96848 trace-residual vacuity (SUB-GAP IMP96876_TRACE_VACUOUS) is SUPERSEDED by imp-96888, so
 * downstream readers do not re-attempt the lambda_max(R_T) reweighting fix direction imp-96876 prescribed.
 *
 * THE TENSION. imp-96876 measured that the imp-96848 closed-form bound Tr(B^{-1} R_T) overshoots the actual
 * N=100, 2a=ln3 t-truncation residual by ~3.15e15x, and attributed the looseness to the step lambda_max(R_T)
 * <= Tr(B^{-1} R_T) "summing ALL N eigenvalues" -- prescribing "a usable rigorous residual bound must control
 * lambda_max(R_T) directly (per-mode weighted)". imp-96888 then directly assembled the tail block R_T and
 * measured lambda_max(R_T) itself, refuting that diagnosis on both halves:
 *   (a) the lambda_max<=Tr step is only ~1.9x at every rung (R_T is essentially rank-2, NOT "all N modes
 *       carry enormous mass") -- so that step was never the source of the ~15 orders;
 *   (b) lambda_max(R_T) is STILL ~1.66e15x the actual residual -- so controlling it directly, as imp-96876
 *       prescribed, would NOT have helped; the looseness is intrinsic to the Weyl operator-norm bound itself.
 * The operative mechanism imp-96888 identified instead is the PROTECTED-BOTTOM-EIGENVALUE spectral gap: the
 * min-max quadratic form <v0|R_T|v0> in the A_T ground state v0 recovers all ~15 orders (1.17-2.24x actual)
 * because the R_T tail mass (sigma_2 ~ t^4, high-frequency modes) is nearly orthogonal to v0, which sits at
 * the OPPOSITE spectral end from where R_T loads its mass.
 *
 * VERDICT. imp-96876's fix direction ("control lambda_max(R_T) directly, per-mode weighted") is SUPERSEDED.
 * imp-96888 Finding 1 refutes it quantitatively: the lambda_max<=Tr step (1.9x) was never the ~15-order
 * looseness source, and lambda_max(R_T) alone (1.66e15x) is exactly as vacuous as the trace it was meant to
 * replace. The correct target is the min-max form <v0|R_T|v0> (protected-bottom-eigenvalue gap), tracked by
 * the still-open SUB-GAP IMP96888_RAYLEIGH_TAIL_MAJORANT (a rigorous interval majorant for the single scalar
 * tail integral (1/(pi B)) int_{|t|>T} sigma_2(t) |v0.Phi(t)|^2 dt). Reconciliation only: no new (N,T) solve,
 * no residual constant computed here; the Rayleigh floor stays an UPPER bound on the true lambda_min;
 * establishes NO operator positivity; IMP96749_UNIFORM_N_GAP_UNSETTLED stays open; interval-rigorous reach
 * stays 2a <= 0.96; RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96876-krein-tresidual-crossval-measurement.js (superseded diagnosis; IMP96876_TRACE_VACUOUS)
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (refutation + operative mechanism; IMP96888_RAYLEIGH_TAIL_MAJORANT)
 * @see imp-96848-krein-tresidual-rigorous-tailtrace-bound.js (closed-form TRACE bound; IMP96848_TAILTRACE_MAJORANT)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (IMP96749_UNIFORM_N_GAP_UNSETTLED)
 */

// verbatim cross-tabulation at N=100, 2a=ln3, T=4800 (imp-96876 IMP96876_RESIDUAL_TABLE, imp-96888 IMP96888_ROWS[4800])
export const IMP96923_SUPERSESSION_TABLE = Object.freeze({
  actualResid: 4.585845e-4, // measured residual beyond T=4800
  traceRT: 1.446437e12, // imp-96848/imp-96876 TRACE route: Tr(B^{-1} R_T)
  lammaxRT: 7.616616e11, // imp-96888 LAMMAX: sharp Weyl operator norm ||R_T||
  rayleighV0RT: 5.381116e-4, // imp-96888 RAYLEIGH: min-max quadratic form <v0|R_T|v0>
  traceOverLammax: 1.899, // the step imp-96876 blamed -- only ~1.9x, not 15 orders
  lammaxOverActual: 1.661e15, // lambda_max alone is STILL ~15 orders too loose
  rayleighOverActual: 1.1734, // the sharp, rigorous route: only 17% loose
});

export const IMP96923_DIAGNOSIS_STATUS = Object.freeze({
  imp96876Claim: 'the lambda_max(R_T) <= Tr(B^{-1} R_T) step sums ALL N eigenvalues and is the source of the ~3.15e15x looseness',
  imp96876FixDirection: 'control lambda_max(R_T) directly (per-mode weighted)',
  imp96876ClaimRefuted: true, // traceOverLammax ~1.9x: R_T is essentially rank-2, not all-N-modes
  imp96876FixDirectionRefuted: true, // lammaxOverActual ~1.66e15x: controlling lambda_max would not have helped
  operativeMechanism: 'protected-bottom-eigenvalue spectral gap: lambda_min sits at the opposite spectral end from the R_T tail mass, so the min-max form <v0|R_T|v0> in the A_T ground state recovers ~15 orders that the worst-case Weyl norm lambda_max(R_T) discards',
  supersedingSubGap: 'IMP96888_RAYLEIGH_TAIL_MAJORANT',
  supersededSubGap: 'IMP96876_TRACE_VACUOUS',
  supersededSubGapStillValidAsMeasurement: true, // the 3.15e15x TRACE measurement itself is not wrong, only its fix-direction prescription
});

export const IMP96923_VERDICT = Object.freeze({
  ticket: 'imp-96923',
  question:
    'imp-96876 blamed the lambda_max(R_T) <= Tr(B^{-1} R_T) step for the ~3.15e15x trace-residual looseness and prescribed controlling lambda_max(R_T) directly; imp-96888 refuted this at 1.9x -- reconcile the two into a single honest note so the fix direction is not re-attempted.',
  answer:
    'imp-96876\'s fix direction is superseded. imp-96888 assembled R_T directly and found the lambda_max<=Tr step is only ~1.9x (R_T is essentially rank-2), so it was never the ~15-order looseness source; lambda_max(R_T) itself remains ~1.66e15x the actual residual, so controlling it as prescribed would not have closed the gap. The operative mechanism is the protected-bottom-eigenvalue spectral gap: the min-max form <v0|R_T|v0> recovers all ~15 orders (1.17-2.24x actual) because lambda_min sits opposite the R_T tail mass in the spectrum. Downstream work should target IMP96888_RAYLEIGH_TAIL_MAJORANT, not a lambda_max reweighting.',
  reconciliationOnly: true,
  newSolvePerformed: false,
  imp96876FixDirectionRefuted: true,
  operativeSubGap: 'IMP96888_RAYLEIGH_TAIL_MAJORANT',
  operatorPositivityProved: false,
  uniformNGapSettled: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96923_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96923_ASSERTIONS = [
  {
    id: 'imp96923-lammax-step-benign-not-15-orders',
    holds: () => {
      const t = IMP96923_SUPERSESSION_TABLE;
      return t.traceOverLammax > 1.5 && t.traceOverLammax < 2.5 &&
        Math.abs(t.traceOverLammax - t.traceRT / t.lammaxRT) < 0.01;
    },
    why: 'the imp-96876-blamed lambda_max<=Tr step is only ~1.9x (Tr(R_T)/lambda_max(R_T)), refuting the "all N modes carry enormous mass" diagnosis.',
  },
  {
    id: 'imp96923-lammax-alone-still-vacuous',
    holds: () => {
      const t = IMP96923_SUPERSESSION_TABLE;
      return t.lammaxOverActual > 1e14 && Math.abs(t.lammaxOverActual - t.lammaxRT / t.actualResid) / t.lammaxOverActual < 0.01;
    },
    why: 'lambda_max(R_T) is still ~1.66e15x the actual residual, so the imp-96876 prescription (control lambda_max directly) would not have closed the gap.',
  },
  {
    id: 'imp96923-rayleigh-is-the-sharp-rigorous-route',
    holds: () => {
      const t = IMP96923_SUPERSESSION_TABLE;
      return t.rayleighOverActual >= 1 && t.rayleighOverActual < 3 && t.rayleighV0RT >= t.actualResid;
    },
    why: 'the min-max quadratic form <v0|R_T|v0> is a rigorous upper bound (min-max) and lands within 17% of the actual residual, versus the ~15-order-loose lambda_max and trace routes.',
  },
  {
    id: 'imp96923-diagnosis-supersession-recorded',
    holds: () => {
      const d = IMP96923_DIAGNOSIS_STATUS;
      return d.imp96876ClaimRefuted === true && d.imp96876FixDirectionRefuted === true &&
        d.supersedingSubGap === 'IMP96888_RAYLEIGH_TAIL_MAJORANT' &&
        d.supersededSubGap === 'IMP96876_TRACE_VACUOUS' &&
        d.supersededSubGapStillValidAsMeasurement === true;
    },
    why: 'both halves of the imp-96876 diagnosis (the step location and the fix direction) are recorded as refuted, while its underlying 3.15e15x TRACE measurement stays valid; the live sub-gap for downstream work is IMP96888_RAYLEIGH_TAIL_MAJORANT.',
  },
  {
    id: 'imp96923-reconciliation-only-no-qed',
    holds: () =>
      IMP96923_VERDICT.reconciliationOnly === true &&
      IMP96923_VERDICT.newSolvePerformed === false &&
      IMP96923_VERDICT.imp96876FixDirectionRefuted === true &&
      IMP96923_VERDICT.operativeSubGap === 'IMP96888_RAYLEIGH_TAIL_MAJORANT' &&
      IMP96923_VERDICT.operatorPositivityProved === false &&
      IMP96923_VERDICT.uniformNGapSettled === false &&
      IMP96923_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96923_VERDICT.qed === false,
    why: 'reconciliation note only: no new solve, imp-96876 fix direction refuted and superseded, no operator positivity, uniform-N gap open, reach stays 2a <= 0.96, no QED.',
  },
];

for (const a of IMP96923_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96923-krein-lammax-diagnosis-superseded-note assertion failed: ${a.id}`);
  }
}
