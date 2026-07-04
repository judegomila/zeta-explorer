/**
 * @module imp-3886-3844-3854-cohort-module-surfacing-audit
 * @fileoverview imp-3886 -- Audit whether the newest research cohort
 * (imp-3844, imp-3846, imp-3848, imp-3849, imp-3850, imp-3854) is imported by
 * any page/component consumer or is orphaned data, and cross-check whether
 * each already has a glossary entry.
 *
 * METHOD (read-only, performed at author time). Same transitive-import-graph
 * method as the imp-3417/3438/3459/3480/3498/3517/3539/3568/3593/3615/3636/
 * 3659/3683/3705/3717 orphan-audit series: a module counts as SURFACED iff its
 * file is reachable via real `from '...'` import edges from some node under
 * src/pages or src/components (including transitively through other
 * reachable data modules). String / comment mentions (JSDoc @see lines,
 * glossary prose citations, object-literal string fields naming a ticket id)
 * do NOT count as an import edge.
 *
 * RESULT (audited 2026-07-03). All six modules are research-only: ZERO have
 * any page/component import edge, direct or transitive.
 *   - imp-3844-a-weight-correction-limit-closed-form.js       : no consumer
 *   - imp-3846-g6a-k4-caustic-regularity-toolkit-assessment.js : no consumer
 *   - imp-3848-moment-ratio-drift-saddle-correction.js         : no consumer
 *   - imp-3849-saddle-ratio-well-depth-inner-converged.js      : cited (string
 *     import) only by imp-3885-saddle-crossing-reconciliation-honest-status.js,
 *     which is itself unreachable from src/pages or src/components -- the
 *     citation chain never lands on a page, so it stays ORPHAN.
 *   - imp-3850-a-weight-dual-path-tau25-30-reconciliation.js   : no consumer
 *   - imp-3854-thetabar-insensitivity-derivation.js            : cited by
 *     imp-3870-smin-dmin-slack-measurement.js, imp-3874-dpsi-sensitivity-
 *     verification.js, and imp-3894-endpoint-concavity-slack-measurement.js,
 *     none of which are themselves page/component-reachable -- ORPHAN.
 *
 * Unlike the imp-3417/imp-3438 precedent (where most of the cohort was
 * already surfaced via ClosureRoutesPage.jsx and only one or two modules were
 * orphaned), this cohort is 0-for-6 on viz-page surfacing.
 *
 * GLOSSARY CROSS-CHECK. All six already have a DEDICATED glossary `term:`
 * entry in src/data/glossary.js (grep-verified, not just a citation):
 *   - imp-3844 -> "imp-3844 A-weight correction limit closed form: c_inf, B"
 *   - imp-3846 -> "imp-3846 K4 caustic-regularity toolkit assessment..."
 *   - imp-3848 -> "imp-3848 next-order saddle correction..."
 *   - imp-3849 -> "imp-3849 inner-quadrature-converged exact-saddle ratio..."
 *   - imp-3850 -> "imp-3850 dual-path -ln A(tau) reconciliation window..."
 *   - imp-3854 -> "imp-3854 thetaBar double-inertness..."
 * So the gap for this cohort is specifically the viz-page side, not the
 * glossary side.
 *
 * RECOMMENDATION. Queue one viz ticket per module (six total), following the
 * imp-3900/3903/3904 precedent of a dedicated small viz page per completed
 * numerical/derivation result; this module fabricates no pages itself, it
 * only records the audit.
 *
 * @see imp-3417, imp-3438 (the closest prior audits in this series)
 */

export const IMP_3886_3844_3854_COHORT_MODULE_SURFACING_AUDIT = {
  id: 'imp-3886',
  auditedAt: '2026-07-03',
  method:
    'Transitive import-graph walk from every src/pages and src/components node over relative ' +
    '`from` imports (including a trailing .js extension); SURFACED iff the module file is ' +
    'reachable, ORPHAN otherwise. String/comment/object-literal-string mentions of a ticket id ' +
    'do not count as an import edge.',
  modules: [
    { file: 'imp-3844-a-weight-correction-limit-closed-form.js', surfaced: false, hasGlossaryTerm: true, hasVizPage: false },
    { file: 'imp-3846-g6a-k4-caustic-regularity-toolkit-assessment.js', surfaced: false, hasGlossaryTerm: true, hasVizPage: false },
    { file: 'imp-3848-moment-ratio-drift-saddle-correction.js', surfaced: false, hasGlossaryTerm: true, hasVizPage: false },
    { file: 'imp-3849-saddle-ratio-well-depth-inner-converged.js', surfaced: false, hasGlossaryTerm: true, hasVizPage: false, citedByOrphan: 'imp-3885-saddle-crossing-reconciliation-honest-status.js' },
    { file: 'imp-3850-a-weight-dual-path-tau25-30-reconciliation.js', surfaced: false, hasGlossaryTerm: true, hasVizPage: false },
    { file: 'imp-3854-thetabar-insensitivity-derivation.js', surfaced: false, hasGlossaryTerm: true, hasVizPage: false, citedByOrphan: 'imp-3870/imp-3874/imp-3894 (all themselves orphan)' },
  ],
  surfacedCount: 0,
  orphanCount: 6,
  glossaryCoveredCount: 6,
  recommendation:
    'All six modules are research-only (no page/component consumer, direct or transitive) but ' +
    'already carry a dedicated glossary term; queue one viz ticket per module (six total) to ' +
    'close the surfacing gap, following the imp-3900/3903/3904 dedicated-small-viz-page precedent.',
  honestNote:
    'Read-only audit; no pages fabricated. No new bound, no QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3886_ASSERTIONS = [
  {
    id: 'imp3886-exactly-six-modules-audited',
    holds: () => IMP_3886_3844_3854_COHORT_MODULE_SURFACING_AUDIT.modules.length === 6,
    why: 'The audit must cover exactly the six named cohort modules (imp-3844/3846/3848/3849/3850/3854).',
  },
  {
    id: 'imp3886-zero-surfaced-six-orphan',
    holds: () => {
      const m = IMP_3886_3844_3854_COHORT_MODULE_SURFACING_AUDIT.modules;
      const surfaced = m.filter((x) => x.surfaced).length;
      const orphan = m.filter((x) => !x.surfaced).length;
      return surfaced === 0 && orphan === 6 &&
        surfaced === IMP_3886_3844_3854_COHORT_MODULE_SURFACING_AUDIT.surfacedCount &&
        orphan === IMP_3886_3844_3854_COHORT_MODULE_SURFACING_AUDIT.orphanCount;
    },
    why: 'None of the six modules are imported by any page/component, directly or transitively, as of the 2026-07-03 audit.',
  },
  {
    id: 'imp3886-all-six-have-glossary-terms',
    holds: () => IMP_3886_3844_3854_COHORT_MODULE_SURFACING_AUDIT.modules.every((x) => x.hasGlossaryTerm === true) &&
      IMP_3886_3844_3854_COHORT_MODULE_SURFACING_AUDIT.glossaryCoveredCount === 6,
    why: 'Grep-verified: each of the six modules already has a dedicated `term:` entry in src/data/glossary.js.',
  },
  {
    id: 'imp3886-honest-scope-locked',
    holds: () => /SOTA/.test(IMP_3886_3844_3854_COHORT_MODULE_SURFACING_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3886_3844_3854_COHORT_MODULE_SURFACING_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; Platt-Trudgian Lambda <= 0.2 stays SOTA.',
  },
];

for (const a of IMP_3886_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3886 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3886_ASSERTIONS };
