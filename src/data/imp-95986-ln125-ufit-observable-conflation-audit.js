/**
 * @module imp-95986-ln125-ufit-observable-conflation-audit
 * @fileoverview imp-95986 -- AUDIT of every module/page that tabulates or orders the
 *   ln 1.25 u_fit observable, to confirm none places the TWO distinct ln 1.25 u_fit
 *   observables on a single ordering axis or conflates them as one quantity measured
 *   twice. Audit only: introduces no new cited input, changes no reported interval,
 *   moves no bound, proves NO QED. Import-light (NO zeros bundle); every claim is a
 *   verbatim record of what the audited module actually bakes.
 *
 *   THE TWO ln 1.25 u_fit OBSERVABLES (imp-95963)
 *   -----------------------------------------------
 *   imp-95963 established that ln 1.25 now carries two DIFFERENT u_fit observables at
 *   scales differing by ~1.4e19:
 *     (A) A_opt SCALAR-FLOOR extrapolation (imp-95895): the dual scalar-class floor
 *         A_opt = 6.9643e-18 (O(1e-18)), u_fit_rel = +0.0846%. This is the observable
 *         ln 1.2 (imp-95896) and ln 1.3 (imp-95767) also report, so it is the one
 *         FINDING A orders across the three deltas.
 *     (B) CROSSING-CONSTANT extrapolation (imp-95939): C_fit = 98.376562 against the
 *         analytic C_pred = pi^2/(2 delta^2) = 99.106256 (O(1e2)), u_fit_rel = -0.7363%.
 *         A distinct extrapolation error from the crossing/shift-budget thread.
 *   The two must not be conflated on a single ordering axis.
 *
 *   AUDIT SCOPE AND VERDICT (all consumers named in the ticket)
 *   -----------------------------------------------
 *   Each consumer was read and its ln 1.25 u_fit handling classified as CLEAN (does not
 *   conflate) or CONFLATES. Result: NO consumer conflates the two observables.
 *     - imp-95885 (per-delta comparison table): records ln 1.25 as N/A on the u_fit
 *       ordering axis (ln125HasNoUFitInterval: true, aOpt null, uFitChain null). STALE
 *       (the cell was later filled by imp-95895) but NOT a conflation -- it never places
 *       the crossing figure on the A-floor axis. Staleness already flagged by
 *       imp-95963 / imp-95976. CLEAN.
 *     - imp-95895 (the A_opt scalar-floor fill): the SOURCE of observable (A); reports
 *       only +0.0846% on the A-floor axis. CLEAN.
 *     - imp-95902 (conditioning vs reach): u_fit column carries ONLY A-floor values
 *       (ln 1.25 at 0.085%); crossing-thread deltas recorded uFitRel null. It flags
 *       reachColumnMixesTwoMetrics for the REACH column, not the u_fit column. CLEAN.
 *     - imp-95922 (two-factor fit): fits ONLY the three DD A-floor u_fit points
 *       (ln 1.25 at 0.0846%); ln 1.5 recorded ln15CarriesNoUFit: true. CLEAN.
 *     - imp-95939 (crossing certification): reports its -0.7363% strictly as the
 *       "companion u_fit_rel" of the crossing constant C_fit; never placed on the
 *       A-floor ordering axis. CLEAN.
 *     - imp-95963 (retabulation): AUTHORITATIVE separation; onFindingAaxis true for
 *       (A), false for (B); flags mixing as an observable-conflation artifact. CLEAN.
 *     - imp-95905 (conditioning-not-reach glossary headword): orders ln 1.25 (0.085%)
 *       < ln 1.3 (0.23%) < ln 1.2 using ONLY A-floor values; no crossing figure. CLEAN.
 *     - imp-95976 (interval-exists-correction glossary headword): explicitly names the
 *       crossing figure as a SEPARATE, non-conflatable observable and warns readers not
 *       to substitute it for the A-floor fill. CLEAN.
 *
 *   HONEST SCOPE
 *   ------------
 *   Audit only. No module was found to conflate the two observables on one ordering
 *   axis, so no corrective edit is warranted (the only staleness, imp-95885's N/A cell,
 *   is already glossed by imp-95963 / imp-95976). This module records the audit result
 *   as a standalone lookup. Changes no numeric value, moves no bound, proves NO QED;
 *   the imp-95212 envelope port, signed WEIGHT, and modulus/phase legs stay OPEN.
 *   Sun arXiv:2609.04176 unrefereed. No refereed bound is changed.
 *
 * @see imp-95963-ln125-crossing-vs-floor-ufit-retabulation.js (authoritative two-observable separation)
 * @see imp-95976-ln125-ufit-interval-exists-correction-glossary-headword.js (do-not-substitute correction)
 * @see imp-95885-per-delta-ufit-comparison-table.js (N/A record, stale but not a conflation)
 * @see imp-95895-ln125-ufit-interval.js (the A_opt scalar-floor fill, +0.0846%)
 * @see imp-95939-ln125-reach340-crossing-certification.js (the crossing-constant figure, -0.7363%)
 *
 * Ticket: imp-95986 (accuracy, medium). Audit only; NO QED; no refereed bound is changed.
 */

// Per-consumer audit record. `conflates` is the audited verdict; `axis` is the u_fit
// ordering axis the module actually uses; `note` records the concrete evidence.
const CONSUMER_AUDIT = Object.freeze([
  {
    id: 'imp-95885',
    role: 'per-delta u_fit comparison table',
    ln125UFit: 'N/A (ln125HasNoUFitInterval: true, aOpt null, uFitChain null)',
    axis: 'A-floor (ln 1.25 cell empty at time of writing)',
    conflates: false,
    note: 'Records ln 1.25 as N/A -- never places the crossing figure on the A-floor axis. STALE (cell later filled by imp-95895) but not a conflation; staleness glossed by imp-95963 / imp-95976.',
  },
  {
    id: 'imp-95895',
    role: 'ln 1.25 A_opt scalar-floor u_fit fill (SOURCE of observable A)',
    ln125UFit: '+0.0846% (A_opt = 6.9643e-18)',
    axis: 'A-floor',
    conflates: false,
    note: 'Reports only the A_opt scalar-floor observable; the source of the +0.0846% value FINDING A orders.',
  },
  {
    id: 'imp-95902',
    role: 'conditioning cond = 1/A_opt vs reach across deltas',
    ln125UFit: '0.085% (A-floor); crossing-thread deltas uFitRel null',
    axis: 'A-floor',
    conflates: false,
    note: 'u_fit column carries only A-floor values; the flagged two-metric mixing is in the REACH column, not the u_fit column.',
  },
  {
    id: 'imp-95922',
    role: 'two-factor reach-conditioning u_fit fit',
    ln125UFit: '0.0846% (A-floor)',
    axis: 'A-floor',
    conflates: false,
    note: 'Fits only the three DD A-floor u_fit points; ln 1.5 recorded ln15CarriesNoUFit: true (float64 C-fit crossing, not a u_fit extraction).',
  },
  {
    id: 'imp-95939',
    role: 'reach-340 crossing-constant certification (SOURCE of observable B)',
    ln125UFit: '-0.7363% (companion u_fit_rel of C_fit vs C_pred)',
    axis: 'crossing-constant (own thread only)',
    conflates: false,
    note: 'Reports -0.7363% strictly as the companion u_fit_rel of the crossing constant; never placed on the A-floor ordering axis.',
  },
  {
    id: 'imp-95963',
    role: 'authoritative crossing-vs-floor retabulation',
    ln125UFit: 'both, kept distinct (onFindingAaxis true for A, false for B)',
    axis: 'A-floor for ordering; crossing excluded',
    conflates: false,
    note: 'Separates the two observables explicitly and flags mixing the crossing u_fit onto the A-floor axis as an observable-conflation artifact.',
  },
  {
    id: 'imp-95905',
    role: 'conditioning-not-reach u_fit ordering glossary headword',
    ln125UFit: '0.085% (A-floor)',
    axis: 'A-floor',
    conflates: false,
    note: 'Orders ln 1.25 (0.085%) < ln 1.3 (0.23%) < ln 1.2 using only A-floor values; carries no crossing figure.',
  },
  {
    id: 'imp-95976',
    role: 'interval-exists-correction glossary headword',
    ln125UFit: 'A-floor +0.0846% as the fill; crossing -0.7363% named as separate',
    axis: 'A-floor for the fill; crossing explicitly excluded',
    conflates: false,
    note: 'Names the crossing figure as a SEPARATE, non-conflatable observable and warns readers not to substitute it for the A-floor fill.',
  },
]);

export const IMP95986_LN125_UFIT_OBSERVABLE_CONFLATION_AUDIT = Object.freeze({
  id: 'imp-95986',
  proofSection: 'S-frontier',
  audits: CONSUMER_AUDIT.map((c) => c.id),
  question:
    'do any of the ln 1.25 u_fit consumers (imp-95885, imp-95895, imp-95902, ' +
    'imp-95922, imp-95939, imp-95963, and the imp-95905 / imp-95976 glossary ' +
    'headwords) place the imp-95895 A-floor observable (+0.0846%) and the imp-95939 ' +
    'crossing-constant observable (-0.7363%) on a single ordering axis, or conflate ' +
    'them as one quantity measured twice?',
  consumerAudit: CONSUMER_AUDIT,
  // the two observables, verbatim from imp-95963 (recorded, not re-imported)
  aFloorObservable: Object.freeze({ source: 'imp-95895', uFitRelPct: 0.0846, scale: '1e-18', onFindingAaxis: true }),
  crossingObservable: Object.freeze({ source: 'imp-95939', uFitRelPct: -0.7363, scale: '1e2', onFindingAaxis: false }),
  anyConsumerConflates: false,
  correctiveEditWarranted: false,
  anyBoundMoved: false,
  qed: false,
  verdict:
    'AUDIT CLEAN. Every ln 1.25 u_fit consumer was read and classified: NONE places ' +
    'the imp-95895 A_opt scalar-floor observable (+0.0846%, O(1e-18)) and the imp-95939 ' +
    'crossing-constant observable (-0.7363%, O(1e2)) on a single ordering axis, and ' +
    'none conflates them as one quantity measured twice. The A-floor-ordering consumers ' +
    '(imp-95885, imp-95895, imp-95902, imp-95922, imp-95905) keep only the A-floor value ' +
    'on the u_fit axis and record the crossing-thread deltas as N/A or null; imp-95939 ' +
    'reports its -0.7363% strictly as the companion u_fit_rel of the crossing constant; ' +
    'imp-95963 and imp-95976 separate the two explicitly and flag the conflation trap. ' +
    'The only staleness found (imp-95885 records ln 1.25 as N/A, since filled by ' +
    'imp-95895) is already glossed by imp-95963 / imp-95976, so no corrective edit is ' +
    'warranted. Audit only; introduces no new cited input; changes no reported ' +
    'interval; moves no bound; NO QED; the imp-95212 envelope port, signed WEIGHT, and ' +
    'modulus/phase legs stay OPEN. Sun arXiv:2609.04176 unrefereed. No refereed bound is changed' +
    '.',
  closesTickets: ['imp-95986'],
});

export default IMP95986_LN125_UFIT_OBSERVABLE_CONFLATION_AUDIT;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95986_LN125_UFIT_OBSERVABLE_CONFLATION_AUDIT_ASSERTIONS = [
  {
    id: 'imp95986-every-named-consumer-audited',
    why: 'The ticket names imp-95885/95895/95902/95922/95939/95963 plus the ln 1.25 glossary headwords (imp-95905/imp-95976); each must appear in the audit record.',
    holds: () => {
      const ids = new Set(IMP95986_LN125_UFIT_OBSERVABLE_CONFLATION_AUDIT.audits);
      return [
        'imp-95885', 'imp-95895', 'imp-95902', 'imp-95922',
        'imp-95939', 'imp-95963', 'imp-95905', 'imp-95976',
      ].every((id) => ids.has(id));
    },
  },
  {
    id: 'imp95986-no-consumer-conflates',
    why: 'The audit verdict is that no consumer places the two observables on one ordering axis; every per-consumer record must carry conflates: false and the summary flag must agree.',
    holds: () =>
      IMP95986_LN125_UFIT_OBSERVABLE_CONFLATION_AUDIT.consumerAudit.every((c) => c.conflates === false) &&
      IMP95986_LN125_UFIT_OBSERVABLE_CONFLATION_AUDIT.anyConsumerConflates === false &&
      IMP95986_LN125_UFIT_OBSERVABLE_CONFLATION_AUDIT.correctiveEditWarranted === false,
  },
  {
    id: 'imp95986-two-observables-are-distinct',
    why: 'The audit rests on the imp-95963 separation: the A-floor observable is on the FINDING A axis, the crossing observable is not, and their signed u_fit_rel differ.',
    holds: () => {
      const a = IMP95986_LN125_UFIT_OBSERVABLE_CONFLATION_AUDIT.aFloorObservable;
      const c = IMP95986_LN125_UFIT_OBSERVABLE_CONFLATION_AUDIT.crossingObservable;
      return a.onFindingAaxis === true &&
        c.onFindingAaxis === false &&
        Math.abs(a.uFitRelPct - c.uFitRelPct) > 0.5 &&
        a.uFitRelPct > 0 && c.uFitRelPct < 0;
    },
  },
  {
    id: 'imp95986-honesty-gate-no-qed',
    why: 'Audit only: no bound moved, no QED, no-refereed-bound-change line present, closes imp-95986.',
    holds: () =>
      IMP95986_LN125_UFIT_OBSERVABLE_CONFLATION_AUDIT.anyBoundMoved === false &&
      IMP95986_LN125_UFIT_OBSERVABLE_CONFLATION_AUDIT.qed === false &&
      /AUDIT CLEAN/.test(IMP95986_LN125_UFIT_OBSERVABLE_CONFLATION_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP95986_LN125_UFIT_OBSERVABLE_CONFLATION_AUDIT.verdict) &&
      IMP95986_LN125_UFIT_OBSERVABLE_CONFLATION_AUDIT.closesTickets.includes('imp-95986'),
  },
];

for (const assertion of IMP95986_LN125_UFIT_OBSERVABLE_CONFLATION_AUDIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95986-ln125-ufit-observable-conflation-audit assertion failed: ${assertion.id}`,
    );
  }
}
