/**
 * @module imp-3683-3642-3648-cohort-module-surfacing-audit
 * @fileoverview imp-3683 -- Audit whether the imp-3642 (direct-Dyson-flow
 * sigma-crossover crosscheck), imp-3643 (dense-vs-Lanczos deep-rung
 * skew-Toeplitz fourth-pair crossval), imp-3645 (skew-Toeplitz Krylov
 * depth-vs-N law), imp-3646 (remainder-tail moment-ratio asymptotics),
 * imp-3647 (below-floor replica fold-in margin), and imp-3648 (fit-bias
 * a-window sensitivity, n=7,8 extension) research modules are imported by
 * any page/component or are orphaned data files. imp-3636 audited only
 * through imp-3604, leaving the 3605..3641 range and this 3642..3648 wave
 * unaudited; this continues the imp-3459/imp-3480/imp-3498/imp-3517/
 * imp-3539/imp-3568/imp-3593/imp-3615/imp-3636/imp-3659 orphan-audit series
 * to this next cohort.
 *
 * METHOD (read-only, performed at author time). Same as imp-3659/imp-3636: a
 * transitive import-graph walk from every page under src/pages and every
 * component under src/components over real `from '...'` relative import
 * edges (including a trailing `.js` extension). A module counts as SURFACED
 * iff its file is reachable from some page/component node; ORPHAN otherwise.
 * String / comment mentions (including glossary.js cross-reference prose)
 * and downstream research-module imports that are themselves off the
 * page/component import graph do NOT count as surfacing the raw module file.
 *
 * RESULT (audited 2026-07-03): all six modules are ORPHAN. Each is reached
 * only by sibling research modules deeper in the same chain (e.g. imp-3642
 * by imp-3661/imp-3662/imp-3671/imp-3693; imp-3646 by imp-3664/imp-3665/
 * imp-3670/imp-3685/imp-3689/imp-3690), and none of those importers is
 * itself reachable from src/pages or src/components either. None has a
 * dedicated glossary.js term yet -- imp-3643 and imp-3647 each surface only
 * as a relatedTerms cross-reference inside an unrelated glossary entry
 * (imp-3602's and imp-3558's, respectively), which is not a dedicated term.
 *   - imp-3642-sigma-crossover-tc-direct-dyson-crosscheck.js: ORPHAN (glossary+viz tickets imp-3673/imp-3672 already queued, pending)
 *   - imp-3643-skew-toeplitz-third-gap-dense-crossval.js: ORPHAN (glossary+viz tickets imp-3676/imp-3675 already queued, pending)
 *   - imp-3645-skew-toeplitz-krylov-depth-vs-N-law.js: ORPHAN (viz ticket imp-3677 queued, pending; NO glossary ticket queued)
 *   - imp-3646-remainder-tail-moment-ratio-asymptotics.js: ORPHAN (glossary+viz tickets imp-3679/imp-3678 already queued, pending)
 *   - imp-3647-below-floor-replica-foldin-margin.js: ORPHAN (glossary+viz tickets imp-3682/imp-3681 already queued, pending)
 *   - imp-3648-fit-bias-a-window-sensitivity-n78.js: ORPHAN (no surfacing ticket queued; intentionally-unwired sensitivity-check utility)
 *
 * RECOMMENDATION. No NEW surfacing tickets are needed for imp-3642/3643/
 * 3646/3647: each already has a queued glossary ticket and a queued viz
 * ticket in the sonnet-4-6 bucket. imp-3645 has a queued viz ticket
 * (imp-3677) but NO queued glossary ticket -- a new glossary ticket is the
 * right next step, since imp-3645 is a standalone narrative result (the
 * m*(N) Krylov-depth growth law unifying imp-3575/imp-3625), not a utility.
 * imp-3648 (a-window sensitivity extended to n=7,8) is, like the imp-3603/
 * imp-3624 precedent, a robustness/sensitivity-check utility whose findings
 * are consumed by downstream fit-bias modules (imp-3670/imp-3685/imp-3689)
 * rather than a standalone narrative result: it should stay an
 * intentionally-unwired compute module. This module fabricates NO pages; it
 * only records the audit. No new bound, no QED; Platt-Trudgian Lambda <= 0.2
 * stays SOTA.
 *
 * @see imp-3459, imp-3480, imp-3498, imp-3517, imp-3539, imp-3568, imp-3593, imp-3615, imp-3636, imp-3659 (the prior audits in this series)
 */

export const IMP_3683_3642_3648_COHORT_MODULE_SURFACING_AUDIT = {
  id: 'imp-3683',
  auditedAt: '2026-07-03',
  method:
    'Transitive import-graph walk from every src/pages and src/components node over relative ' +
    '`from` imports (including a trailing .js extension); SURFACED iff the module file is ' +
    'reachable, ORPHAN otherwise. Downstream research-module imports and glossary/comment mentions ' +
    'that are themselves unreached from src/pages or src/components do not count as surfacing.',
  modules: [
    { file: 'imp-3642-sigma-crossover-tc-direct-dyson-crosscheck.js', surfaced: false, hasQueuedGlossaryTicket: true, hasQueuedVizTicket: true, queuedTickets: ['imp-3673', 'imp-3672'] },
    { file: 'imp-3643-skew-toeplitz-third-gap-dense-crossval.js', surfaced: false, hasQueuedGlossaryTicket: true, hasQueuedVizTicket: true, queuedTickets: ['imp-3676', 'imp-3675'] },
    { file: 'imp-3645-skew-toeplitz-krylov-depth-vs-N-law.js', surfaced: false, hasQueuedGlossaryTicket: false, hasQueuedVizTicket: true, queuedTickets: ['imp-3677'] },
    { file: 'imp-3646-remainder-tail-moment-ratio-asymptotics.js', surfaced: false, hasQueuedGlossaryTicket: true, hasQueuedVizTicket: true, queuedTickets: ['imp-3679', 'imp-3678'] },
    { file: 'imp-3647-below-floor-replica-foldin-margin.js', surfaced: false, hasQueuedGlossaryTicket: true, hasQueuedVizTicket: true, queuedTickets: ['imp-3682', 'imp-3681'] },
    { file: 'imp-3648-fit-bias-a-window-sensitivity-n78.js', surfaced: false, hasQueuedGlossaryTicket: false, hasQueuedVizTicket: false, queuedTickets: [] },
  ],
  orphanCount: 6,
  fullyQueuedCount: 4,
  recommendation:
    'No new surfacing tickets needed for imp-3642/3643/3646/3647: each already has a queued ' +
    'glossary ticket and a queued viz ticket, awaiting processing. imp-3645 has a queued viz ' +
    'ticket (imp-3677) but no queued glossary ticket -- queue a new glossary ticket for its ' +
    'm*(N) Krylov-depth growth law. imp-3648 is a robustness/sensitivity-check utility (a-window ' +
    'test of the imp-3581/imp-3600 fit-bias law, extended to n=7,8) consumed by downstream ' +
    'fit-bias modules rather than a standalone narrative result, and should stay an ' +
    'intentionally-unwired compute module -- consistent with the imp-3603/imp-3624 precedent.',
  honestNote:
    'Read-only audit; no pages fabricated. No new bound, no QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3683_ASSERTIONS = [
  {
    id: 'imp3683-exactly-six-modules-audited',
    holds: () => IMP_3683_3642_3648_COHORT_MODULE_SURFACING_AUDIT.modules.length === 6,
    why: 'The audit must cover exactly the six named imp-3642/3643/3645/3646/3647/3648 cohort modules.',
  },
  {
    id: 'imp3683-all-six-orphan',
    holds: () => {
      const m = IMP_3683_3642_3648_COHORT_MODULE_SURFACING_AUDIT.modules;
      const orphan = m.filter((x) => !x.surfaced).length;
      return orphan === 6 && orphan === IMP_3683_3642_3648_COHORT_MODULE_SURFACING_AUDIT.orphanCount;
    },
    why: 'None of imp-3642/3643/3645/3646/3647/3648 is reachable from any src/pages or src/components entry point as of the 2026-07-03 audit.',
  },
  {
    id: 'imp3683-four-fully-queued',
    holds: () => {
      const m = IMP_3683_3642_3648_COHORT_MODULE_SURFACING_AUDIT.modules;
      const queued = m.filter((x) => x.hasQueuedGlossaryTicket && x.hasQueuedVizTicket).length;
      return queued === 4 && queued === IMP_3683_3642_3648_COHORT_MODULE_SURFACING_AUDIT.fullyQueuedCount;
    },
    why: 'imp-3642/3643/3646/3647 each already have a queued glossary ticket and a queued viz ticket pending processing.',
  },
  {
    id: 'imp3683-3645-missing-glossary-ticket',
    holds: () => {
      const m = IMP_3683_3642_3648_COHORT_MODULE_SURFACING_AUDIT.modules.find((x) => x.file.startsWith('imp-3645'));
      return !!m && m.hasQueuedVizTicket === true && m.hasQueuedGlossaryTicket === false;
    },
    why: 'imp-3645 has a queued viz ticket but no queued glossary ticket, which is the gap this audit recommends closing.',
  },
  {
    id: 'imp3683-3648-unqueued-utility',
    holds: () => {
      const m = IMP_3683_3642_3648_COHORT_MODULE_SURFACING_AUDIT.modules.find((x) => x.file.startsWith('imp-3648'));
      return !!m && !m.hasQueuedGlossaryTicket && !m.hasQueuedVizTicket && m.queuedTickets.length === 0;
    },
    why: 'imp-3648 is a sensitivity-check utility with no queued surfacing ticket, consistent with the recommendation that it stay unwired.',
  },
  {
    id: 'imp3683-honest-scope-locked',
    holds: () => /SOTA/.test(IMP_3683_3642_3648_COHORT_MODULE_SURFACING_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3683_3642_3648_COHORT_MODULE_SURFACING_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; Platt-Trudgian Lambda <= 0.2 stays SOTA.',
  },
];

for (const a of IMP_3683_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3683 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3683_ASSERTIONS };
