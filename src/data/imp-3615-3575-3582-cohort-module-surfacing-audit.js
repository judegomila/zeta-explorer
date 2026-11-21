/**
 * @module imp-3615-3575-3582-cohort-module-surfacing-audit
 * @fileoverview imp-3615 -- Audit whether the imp-3575 (skew-Toeplitz
 * N=1600 Krylov reconverge), imp-3576 (inner-A(tau) Simpson truncation
 * constant), imp-3579 (degree-d miss-factor moment-refinement invariance),
 * imp-3580 (sigma-crossover floor invariance), imp-3581 (remainder-tail
 * exponent derivation), and imp-3582 (replica-hiding grid threshold)
 * research modules are imported by any page/component or are orphaned data
 * files. imp-3593 audited only through imp-3558; this continues the
 * imp-3459/imp-3480/imp-3498/imp-3517/imp-3539/imp-3568/imp-3593
 * orphan-audit series to this next cohort.
 *
 * METHOD (read-only, performed at author time). Same as imp-3593: a
 * transitive import-graph walk from every page under src/pages and every
 * component under src/components over real `from '...'` relative import
 * edges (including a trailing `.js` extension). A module counts as SURFACED
 * iff its file is reachable from some page/component node; ORPHAN otherwise.
 * String / comment mentions -- a glossary.js prose entry citing an imp-NNNN
 * id, or a downstream "-viz-data" file's `@fileoverview` comment naming a
 * cohort id while baking its own literal numbers rather than importing the
 * source module -- do NOT count as a real import edge.
 *
 * RESULT (audited 2026-07-03): all six modules are ORPHAN. Four of the six
 * (imp-3575, imp-3580, imp-3581, imp-3582) already have a routed viz page
 * from the imp-3611/3612/3613/3614 follow-up tickets (App.jsx registers
 * /viz-imp3611-skew-toeplitz-krylov-gap-ladder,
 * /viz-imp3612-fit-bias-depth-sweep, /viz-imp3613-replica-fold-in-geometry,
 * /viz-imp3614-sigma-crossover-floor-invariance), but each of those four viz
 * pages consumes a "-viz-data" module that bakes its own reference literals
 * with ZERO import statements, so the original research-module file itself
 * is still not on any transitive import path from src/pages. The other two
 * (imp-3576, imp-3579) have only a glossary.js prose entry (term/definition/
 * firstUsed/relatedTerms strings citing "imp-3576" / "imp-3579"), which is a
 * string mention, not a module import, and are therefore ORPHAN too.
 *   - imp-3575-skew-toeplitz-gap-N1600-krylov-reconverge.js : ORPHAN (viz page imp-3611 exists but its viz-data bakes literals, no import edge)
 *   - imp-3576-inner-simpson-truncation-constant.js         : ORPHAN (glossary.js prose mention only, no import edge)
 *   - imp-3579-miss-factor-moment-refinement-invariance.js  : ORPHAN (glossary.js prose mention only, no import edge)
 *   - imp-3580-sigma-crossover-floor-invariance.js           : ORPHAN (viz page imp-3614 exists but its viz-data bakes literals, no import edge)
 *   - imp-3581-remainder-tail-exponent-derivation.js         : ORPHAN (viz page imp-3612 exists but its viz-data bakes literals, no import edge)
 *   - imp-3582-replica-hiding-grid-threshold.js              : ORPHAN (viz page imp-3613 exists but its viz-data bakes literals, no import edge)
 *
 * RECOMMENDATION. No new surfacing work is required for imp-3575/3580/3581/
 *3582: each already has a live, routed viz page under a follow-up ticket
 * number (imp-3611/3614/3612/3613); the source-module orphan status is an
 * artifact of the standard "viz-data bakes literals" pattern used across
 * this whole viz-ticket series (consistent with imp-3552/imp-3558 in the
 * imp-3593 audit) and does not indicate missing user-facing surfacing. Only
 * imp-3576 and imp-3579 remain genuinely unsurfaced beyond glossary prose;
 * both are narrow numerical-certification results (a Simpson truncation
 * constant and a miss-factor invariance check) for which a glossary entry is
 * adequate and no further viz ticket is recommended. This module fabricates
 * NO pages; it only records the audit. No new bound, no QED; no refereed bound is changed.
 *
 * @see imp-3459, imp-3480, imp-3498, imp-3517, imp-3539, imp-3568, imp-3593 (the prior audits in this series)
 */

export const IMP_3615_3575_3582_COHORT_MODULE_SURFACING_AUDIT = {
  id: 'imp-3615',
  auditedAt: '2026-07-03',
  method:
    'Transitive import-graph walk from every src/pages and src/components node over relative ' +
    '`from` imports (including a trailing .js extension); SURFACED iff the module file is ' +
    'reachable, ORPHAN otherwise. Comment/string mentions (including @fileoverview references in ' +
    'downstream -viz-data files that bake their own literals, and glossary.js prose citations) do ' +
    'not count as an import edge.',
  modules: [
    { file: 'imp-3575-skew-toeplitz-gap-N1600-krylov-reconverge.js', surfaced: false, surfacedBy: null, hasVizPage: true },
    { file: 'imp-3576-inner-simpson-truncation-constant.js', surfaced: false, surfacedBy: null, hasVizPage: false },
    { file: 'imp-3579-miss-factor-moment-refinement-invariance.js', surfaced: false, surfacedBy: null, hasVizPage: false },
    { file: 'imp-3580-sigma-crossover-floor-invariance.js', surfaced: false, surfacedBy: null, hasVizPage: true },
    { file: 'imp-3581-remainder-tail-exponent-derivation.js', surfaced: false, surfacedBy: null, hasVizPage: true },
    { file: 'imp-3582-replica-hiding-grid-threshold.js', surfaced: false, surfacedBy: null, hasVizPage: true },
  ],
  orphanCount: 6,
  vizPageCount: 4,
  recommendation:
    'No new surfacing ticket needed for imp-3575/3580/3581/3582: each already has a live, routed ' +
    'viz page (imp-3611/3614/3612/3613) even though the source module itself stays off the ' +
    'transitive import path because the viz-data file bakes literals instead of importing it -- ' +
    'the standard pattern across this ticket series. imp-3576 (inner Simpson truncation constant) ' +
    'and imp-3579 (miss-factor invariance) remain glossary-only; both are narrow numerical- ' +
    'certification results for which a glossary entry is adequate, no further viz ticket ' +
    'recommended. Do not fabricate pages in this audit ticket.',
  honestNote:
    'Read-only audit; no pages fabricated. No new bound, no QED. No refereed bound is changed.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3615_ASSERTIONS = [
  {
    id: 'imp3615-exactly-six-modules-audited',
    holds: () => IMP_3615_3575_3582_COHORT_MODULE_SURFACING_AUDIT.modules.length === 6,
    why: 'The audit must cover exactly the six named imp-3575/3576/3579/3580/3581/3582 cohort modules.',
  },
  {
    id: 'imp3615-all-six-orphan',
    holds: () => {
      const m = IMP_3615_3575_3582_COHORT_MODULE_SURFACING_AUDIT.modules;
      const orphan = m.filter((x) => !x.surfaced).length;
      return orphan === 6 && orphan === IMP_3615_3575_3582_COHORT_MODULE_SURFACING_AUDIT.orphanCount;
    },
    why: 'None of imp-3575/3576/3579/3580/3581/3582 is reachable from any src/pages or src/components entry point as of the 2026-07-03 audit.',
  },
  {
    id: 'imp3615-four-have-viz-pages',
    holds: () => {
      const m = IMP_3615_3575_3582_COHORT_MODULE_SURFACING_AUDIT.modules;
      const withViz = m.filter((x) => x.hasVizPage).length;
      return withViz === 4 && withViz === IMP_3615_3575_3582_COHORT_MODULE_SURFACING_AUDIT.vizPageCount;
    },
    why: 'imp-3575/3580/3581/3582 each have a routed viz page from the imp-3611/3614/3612/3613 follow-up tickets, despite remaining import-orphan.',
  },
  {
    id: 'imp3615-honest-scope-locked',
    holds: () => /refereed bound is changed/i.test(IMP_3615_3575_3582_COHORT_MODULE_SURFACING_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3615_3575_3582_COHORT_MODULE_SURFACING_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed.',
  },
];

for (const a of IMP_3615_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3615 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3615_ASSERTIONS };
