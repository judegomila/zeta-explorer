/**
 * @fileoverview imp-97004 -- AUDIT (no new solve): checks every downstream consumer of imp-96876's
 * SUPERSEDED lambda_max(R_T) per-mode-reweighting fix direction (refuted by imp-96888, reconciled by
 * imp-96923/imp-96973) for any module that still prescribes it as live guidance.
 *
 * SCOPE. Every src/data/*.js module referencing "imp-96876" (grep -rl 'imp-96876' src/data/), excluding
 * imp-96876 itself and the two ledger monoliths (improvements.js, improvement-queue.js, which only log the
 * ticket, not a technical prescription):
 *   imp-96888, imp-96893, imp-96894, imp-96896, imp-96900, imp-96908, imp-96909, imp-96923, imp-96973,
 *   and the glossary.js "Min-Max Rayleigh Residual Bound" headword.
 *
 * FINDING. None prescribes per-mode reweighting of lambda_max(R_T) as a live fix direction.
 *   - imp-96888, imp-96900, imp-96923, imp-96973, and the glossary.js headword each explicitly name the
 *     imp-96876 lambda_max(R_T) prescription and mark it REFUTED/SUPERSEDED, pointing instead at the
 *     min-max quadratic form <v0|R_T|v0> (IMP96888_RAYLEIGH_TAIL_MAJORANT) as the operative target.
 *   - imp-96893, imp-96894, imp-96896, imp-96908, imp-96909 cite imp-96876 only for its MEASUREMENT data
 *     (the seven-point N=100, 2a=ln3 floor sweep IMP96876_FLOOR/IMP96876_TS, or the reused build()/lam_min()
 *     solver) -- none of them touch, cite, or re-propose the lambda_max(R_T) fix direction at all.
 * No module needs a fix; this is a clean audit (0 stale prescriptions found).
 *
 * @see imp-96876-krein-tresidual-crossval-measurement.js (source of the superseded fixDirection field, IMP96876_TRACE_DIAGNOSIS.fixDirection)
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (the refutation)
 * @see imp-96923-krein-lammax-diagnosis-superseded-note.js (the reconciliation note this audit checks propagated)
 * @see imp-96973-krein-tailtrace-vacuity-factorisation.js (the three-factor reconciliation, also names the reweighting fix direction as superseded)
 */

export const IMP97004_AUDIT_SCOPE = Object.freeze([
  'imp-96888-krein-tresidual-rayleigh-permode-bound.js',
  'imp-96893-krein-floor-extrapolation.js',
  'imp-96894-krein-ln3-legendre-gegenbauer-crossbasis.js',
  'imp-96896-krein-hight-floor-residual-viz-data.js',
  'imp-96900-krein-trace-vacuous-glossary-headword.js',
  'imp-96908-krein-tresidual-powerlaw-decay.js',
  'imp-96909-rational-trial-residual-bound.js',
  'imp-96923-krein-lammax-diagnosis-superseded-note.js',
  'imp-96973-krein-tailtrace-vacuity-factorisation.js',
  'glossary.js (Min-Max Rayleigh Residual Bound headword)',
]);

export const IMP97004_AUDIT_ROWS = Object.freeze([
  { file: 'imp-96888-krein-tresidual-rayleigh-permode-bound.js', citesFixDirection: true, stalePrescription: false, note: 'explicitly refutes the per-mode reweighting fix direction' },
  { file: 'imp-96893-krein-floor-extrapolation.js', citesFixDirection: false, stalePrescription: false, note: 'reuses only the IMP96876_FLOOR sweep data' },
  { file: 'imp-96894-krein-ln3-legendre-gegenbauer-crossbasis.js', citesFixDirection: false, stalePrescription: false, note: 'reuses only the measured N=100 floor value' },
  { file: 'imp-96896-krein-hight-floor-residual-viz-data.js', citesFixDirection: false, stalePrescription: false, note: 'viz-data leaf importing IMP96876_TS/IMP96876_FLOOR only' },
  { file: 'imp-96900-krein-trace-vacuous-glossary-headword.js', citesFixDirection: true, stalePrescription: false, note: 'glossary headword names the refuted prescription explicitly' },
  { file: 'imp-96908-krein-tresidual-powerlaw-decay.js', citesFixDirection: false, stalePrescription: false, note: 'reuses only the build()/lam_min() solver' },
  { file: 'imp-96909-rational-trial-residual-bound.js', citesFixDirection: false, stalePrescription: false, note: 'reuses only the build()/lam_min() solver' },
  { file: 'imp-96923-krein-lammax-diagnosis-superseded-note.js', citesFixDirection: true, stalePrescription: false, note: 'the reconciliation note itself: marks both halves of the diagnosis refuted' },
  { file: 'imp-96973-krein-tailtrace-vacuity-factorisation.js', citesFixDirection: true, stalePrescription: false, note: 'explicit: "NOT per-mode reweighting of R_T eigenvalues"' },
  { file: 'glossary.js (Min-Max Rayleigh Residual Bound headword)', citesFixDirection: true, stalePrescription: false, note: 'names imp-96876 as "the refuted lambda_max(R_T) prescription"' },
]);

export const IMP97004_VERDICT = Object.freeze({
  ticket: 'imp-97004',
  question:
    'audit every downstream consumer of the SUPERSEDED imp-96876 lambda_max(R_T) per-mode-reweighting fix direction (refuted by imp-96888, reconciled by imp-96923/imp-96973) for any module still prescribing it as live guidance.',
  answer:
    'clean audit: 10 modules reference imp-96876 (excluding imp-96876 itself and the two ledger monoliths); 5 explicitly cite and correctly mark the fix direction as refuted/superseded, 5 cite imp-96876 only for its unrelated measurement data or reused solver code. Zero modules still prescribe per-mode reweighting of lambda_max(R_T) as an active fix direction.',
  modulesAudited: 10,
  stalePrescriptionsFound: 0,
  auditOnly: true,
  newSolvePerformed: false,
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97004_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97004_ASSERTIONS = [
  {
    id: 'imp97004-scope-matches-rows',
    holds: () => IMP97004_AUDIT_SCOPE.length === IMP97004_AUDIT_ROWS.length &&
      IMP97004_AUDIT_SCOPE.every((f, i) => f === IMP97004_AUDIT_ROWS[i].file),
    why: 'the audited-scope list and the per-file row table must enumerate the same files in the same order.',
  },
  {
    id: 'imp97004-no-stale-prescriptions',
    holds: () => IMP97004_AUDIT_ROWS.every((r) => r.stalePrescription === false),
    why: 'the audit finding is that zero consumer modules still prescribe the refuted per-mode reweighting fix direction.',
  },
  {
    id: 'imp97004-citing-rows-are-correct',
    holds: () => IMP97004_AUDIT_ROWS.filter((r) => r.citesFixDirection).length === 5,
    why: 'exactly five of the ten audited modules explicitly cite the imp-96876 fix direction (each to mark it refuted/superseded), matching the manual grep count.',
  },
  {
    id: 'imp97004-verdict-consistent',
    holds: () => IMP97004_VERDICT.modulesAudited === IMP97004_AUDIT_ROWS.length &&
      IMP97004_VERDICT.stalePrescriptionsFound === IMP97004_AUDIT_ROWS.filter((r) => r.stalePrescription).length &&
      IMP97004_VERDICT.auditOnly === true &&
      IMP97004_VERDICT.newSolvePerformed === false &&
      IMP97004_VERDICT.operatorPositivityProved === false &&
      IMP97004_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97004_VERDICT.qed === false,
    why: 'audit-only ticket: no new solve, no operator positivity claimed, reach stays 2a <= 0.96, no QED.',
  },
];

for (const a of IMP97004_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97004-krein-reweighting-consumer-audit assertion failed: ${a.id}`);
  }
}
