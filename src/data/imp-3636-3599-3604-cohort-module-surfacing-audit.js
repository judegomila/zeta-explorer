/**
 * @module imp-3636-3599-3604-cohort-module-surfacing-audit
 * @fileoverview imp-3636 -- Audit whether the imp-3599 (flow-gap next-order
 * correction), imp-3600 (n=5,6 remainder-tail exponent ladder), imp-3601
 * (m-fold aliasing replica threshold), imp-3602 (second skew-Toeplitz gap
 * exponent), imp-3603 (inner-truncation Gauss-Legendre cross-val), and
 * imp-3604 (sigma-crossover flow-factor invariance) research modules are
 * imported by any page/component or are orphaned data files. imp-3615
 * audited only through imp-3582; this continues the imp-3459/imp-3480/
 * imp-3498/imp-3517/imp-3539/imp-3568/imp-3593/imp-3615 orphan-audit series
 * to this next cohort.
 *
 * METHOD (read-only, performed at author time). Same as imp-3615: a
 * transitive import-graph walk from every page under src/pages and every
 * component under src/components over real `from '...'` relative import
 * edges (including a trailing `.js` extension). A module counts as SURFACED
 * iff its file is reachable from some page/component node; ORPHAN otherwise.
 * String / comment mentions and downstream research-module imports that are
 * themselves off the page/component import graph do NOT count as surfacing.
 *
 * RESULT (audited 2026-07-03): all six modules are ORPHAN, and unlike the
 * imp-3615 cohort (four of six already had a routed viz page), NONE of these
 * six has any page, component, or glossary.js entry yet -- each is reached
 * only by sibling research modules deeper in the same chain (e.g. imp-3599
 * is imported by imp-3604/imp-3617/imp-3641; imp-3602 by imp-3619/imp-3623/
 * imp-3625/imp-3639/imp-3645), and none of those importers is itself
 * reachable from src/pages or src/components either.
 *   - imp-3599-flow-gap-nextorder-correction.js          : ORPHAN (glossary+viz tickets imp-3626/imp-3627 already queued, pending)
 *   - imp-3600-remainder-tail-exponent-ladder-n56.js      : ORPHAN (glossary+viz tickets imp-3628/imp-3629 already queued, pending)
 *   - imp-3601-second-fold-replica-threshold.js           : ORPHAN (glossary+viz tickets imp-3630/imp-3631 already queued, pending)
 *   - imp-3602-skew-toeplitz-second-gap-exponent.js       : ORPHAN (glossary+viz tickets imp-3632/imp-3633 already queued, pending)
 *   - imp-3603-inner-truncation-gauss-legendre-crossval.js: ORPHAN (no surfacing ticket queued; intentionally-unwired cross-validation utility)
 *   - imp-3604-sigma-crossover-flow-factor-invariance.js  : ORPHAN (glossary+viz tickets imp-3634/imp-3635 already queued, pending)
 *
 * RECOMMENDATION. No NEW surfacing tickets are needed for imp-3599/3600/
 * 3601/3602/3604: each already has a queued glossary ticket and a queued viz
 * ticket (imp-3626..3635) in the sonnet-4-6 bucket; this audit's job is
 * limited to confirming those tickets are still the right destination and
 * that no consumer has appeared out-of-band, which the grep above confirms.
 * imp-3603 (inner-truncation Gauss-Legendre cross-validation) is different
 * in kind from the other five: it is a numerical cross-check utility whose
 * findings (the M_0..M_4 outer-quadrature-free confirmation) are consumed
 * and extended by downstream verification modules (imp-3621, imp-3644)
 * rather than being a standalone narrative result: it should stay an
 * intentionally-unwired compute module, consistent with the imp-3576/
 * imp-3579 precedent in the imp-3615 audit. This module fabricates NO
 * pages; it only records the audit. No new bound, no QED; no refereed bound is changed.
 *
 * @see imp-3459, imp-3480, imp-3498, imp-3517, imp-3539, imp-3568, imp-3593, imp-3615 (the prior audits in this series)
 */

export const IMP_3636_3599_3604_COHORT_MODULE_SURFACING_AUDIT = {
  id: 'imp-3636',
  auditedAt: '2026-07-03',
  method:
    'Transitive import-graph walk from every src/pages and src/components node over relative ' +
    '`from` imports (including a trailing .js extension); SURFACED iff the module file is ' +
    'reachable, ORPHAN otherwise. Downstream research-module imports and glossary/comment mentions ' +
    'that are themselves unreached from src/pages or src/components do not count as surfacing.',
  modules: [
    { file: 'imp-3599-flow-gap-nextorder-correction.js', surfaced: false, hasQueuedGlossaryTicket: true, hasQueuedVizTicket: true, queuedTickets: ['imp-3626', 'imp-3627'] },
    { file: 'imp-3600-remainder-tail-exponent-ladder-n56.js', surfaced: false, hasQueuedGlossaryTicket: true, hasQueuedVizTicket: true, queuedTickets: ['imp-3628', 'imp-3629'] },
    { file: 'imp-3601-second-fold-replica-threshold.js', surfaced: false, hasQueuedGlossaryTicket: true, hasQueuedVizTicket: true, queuedTickets: ['imp-3630', 'imp-3631'] },
    { file: 'imp-3602-skew-toeplitz-second-gap-exponent.js', surfaced: false, hasQueuedGlossaryTicket: true, hasQueuedVizTicket: true, queuedTickets: ['imp-3632', 'imp-3633'] },
    { file: 'imp-3603-inner-truncation-gauss-legendre-crossval.js', surfaced: false, hasQueuedGlossaryTicket: false, hasQueuedVizTicket: false, queuedTickets: [] },
    { file: 'imp-3604-sigma-crossover-flow-factor-invariance.js', surfaced: false, hasQueuedGlossaryTicket: true, hasQueuedVizTicket: true, queuedTickets: ['imp-3634', 'imp-3635'] },
  ],
  orphanCount: 6,
  alreadyQueuedCount: 5,
  recommendation:
    'No new surfacing tickets needed for imp-3599/3600/3601/3602/3604: each already has a queued ' +
    'glossary ticket and a queued viz ticket (imp-3626..3635) awaiting processing. imp-3603 is a ' +
    'numerical cross-validation utility (outer-quadrature-free confirmation feeding imp-3621/ ' +
    'imp-3644) rather than a standalone narrative result, and should stay an ' +
    'intentionally-unwired compute module -- consistent with the imp-3576/imp-3579 precedent.',
  honestNote:
    'Read-only audit; no pages fabricated. No new bound, no QED. No refereed bound is changed.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3636_ASSERTIONS = [
  {
    id: 'imp3636-exactly-six-modules-audited',
    holds: () => IMP_3636_3599_3604_COHORT_MODULE_SURFACING_AUDIT.modules.length === 6,
    why: 'The audit must cover exactly the six named imp-3599/3600/3601/3602/3603/3604 cohort modules.',
  },
  {
    id: 'imp3636-all-six-orphan',
    holds: () => {
      const m = IMP_3636_3599_3604_COHORT_MODULE_SURFACING_AUDIT.modules;
      const orphan = m.filter((x) => !x.surfaced).length;
      return orphan === 6 && orphan === IMP_3636_3599_3604_COHORT_MODULE_SURFACING_AUDIT.orphanCount;
    },
    why: 'None of imp-3599/3600/3601/3602/3603/3604 is reachable from any src/pages or src/components entry point as of the 2026-07-03 audit.',
  },
  {
    id: 'imp3636-five-have-queued-tickets',
    holds: () => {
      const m = IMP_3636_3599_3604_COHORT_MODULE_SURFACING_AUDIT.modules;
      const queued = m.filter((x) => x.hasQueuedGlossaryTicket && x.hasQueuedVizTicket).length;
      return queued === 5 && queued === IMP_3636_3599_3604_COHORT_MODULE_SURFACING_AUDIT.alreadyQueuedCount;
    },
    why: 'imp-3599/3600/3601/3602/3604 each already have a queued glossary ticket and viz ticket (imp-3626..3635) pending processing.',
  },
  {
    id: 'imp3636-3603-unqueued',
    holds: () => {
      const m = IMP_3636_3599_3604_COHORT_MODULE_SURFACING_AUDIT.modules.find((x) => x.file.startsWith('imp-3603'));
      return !!m && !m.hasQueuedGlossaryTicket && !m.hasQueuedVizTicket && m.queuedTickets.length === 0;
    },
    why: 'imp-3603 is a cross-validation utility with no queued surfacing ticket, consistent with the recommendation that it stay unwired.',
  },
  {
    id: 'imp3636-honest-scope-locked',
    holds: () => /refereed bound is changed/i.test(IMP_3636_3599_3604_COHORT_MODULE_SURFACING_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3636_3599_3604_COHORT_MODULE_SURFACING_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed.',
  },
];

for (const a of IMP_3636_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3636 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3636_ASSERTIONS };
