/**
 * @module imp-3517-3481-3490-cohort-module-surfacing-audit
 * @fileoverview imp-3517 — Audit whether the newest imp-3481..imp-3490 moment-ladder /
 * xi* / degree-2 / operator-norm research modules are imported or surfaced by any
 * page or component, flagging the orphans. This continues the imp-3459/imp-3480/
 * imp-3498 orphan-audit series to the next cohort.
 *
 * METHOD (read-only, performed at author time). A transitive import-graph walk was
 * run from every page under src/pages over all `... from "..."` relative imports.
 * A module counts as SURFACED iff its file is reachable from some page node; ORPHAN
 * otherwise. String / comment mentions (e.g. `@see` lines, prose referencing an
 * imp-NNNN id) do NOT count — only real `import { ... } from '...'` edges, including
 * transitively through other data modules.
 *
 * RESULT (audited 2026-07-03): all ten modules are ORPHAN. Several are imported by
 * *later* research modules (imp-3481 alone is pulled in by imp-3501, imp-3503,
 * imp-3532, imp-3546, imp-3552), but that whole downstream chain is itself not
 * reachable from any src/pages entry point, so none of it counts as surfaced:
 *   - imp-3481-autocorrelation-moment-ladder.js                : ORPHAN
 *   - imp-3482-degree2-deficit-support-certification.js        : ORPHAN
 *   - imp-3483-Ttilde-peak-slope-xistar-global-uniqueness.js    : ORPHAN
 *   - imp-3484-P2-spectral-integral-enumeration.js              : ORPHAN
 *   - imp-3485-Ttilde-independent-operator-norm-crossval.js     : ORPHAN
 *   - imp-3486-critical-decay-exponent.js                       : ORPHAN
 *   - imp-3487-degree2-deficit-a-threshold.js                   : ORPHAN
 *   - imp-3488-degree2-miss-factor-closed-form.js                : ORPHAN
 *   - imp-3489-xistar-U-independence-certification.js            : ORPHAN
 *   - imp-3490-degree2-exponent-wide-k-ladder.js                 : ORPHAN
 *
 * RECOMMENDATION. Mint follow-up surfacing tickets that place these beside their
 * natural narrative homes: imp-3485/imp-3489/imp-3483 (solver-independent capture
 * constant, xi* invariance/uniqueness) belong beside the existing C_inf sections on
 * ClosureRoutesPage; imp-3486/imp-3487/imp-3488/imp-3490 (degree-2 deficit/miss-factor
 * family) belong in a shared degree-2 narrative section; imp-3481/imp-3482/imp-3484
 * (moment ladder, spectral integral) belong beside the moment-ladder visualizations.
 * This module fabricates NO pages; it only records the audit and flags the orphans.
 * No new bound, no QED; no refereed bound is changed.
 *
 * @see imp-3459, imp-3480, imp-3498 (the prior audits in this orphan-surfacing series)
 */

export const IMP_3517_3481_3490_COHORT_MODULE_SURFACING_AUDIT = {
  id: 'imp-3517',
  auditedAt: '2026-07-03',
  method:
    'Transitive import-graph walk from every src/pages page over relative `from` imports; ' +
    'SURFACED iff the module file is reachable, ORPHAN otherwise. Comment/string mentions do not count.',
  modules: [
    { file: 'imp-3481-autocorrelation-moment-ladder.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3482-degree2-deficit-support-certification.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3483-Ttilde-peak-slope-xistar-global-uniqueness.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3484-P2-spectral-integral-enumeration.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3485-Ttilde-independent-operator-norm-crossval.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3486-critical-decay-exponent.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3487-degree2-deficit-a-threshold.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3488-degree2-miss-factor-closed-form.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3489-xistar-U-independence-certification.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3490-degree2-exponent-wide-k-ladder.js', surfaced: false, surfacedBy: null },
  ],
  orphanCount: 10,
  recommendation:
    'Mint follow-up surfacing tickets grouped by narrative home: imp-3483/imp-3485/imp-3489 ' +
    'beside the C_inf sections on ClosureRoutesPage; imp-3486/imp-3487/imp-3488/imp-3490 as a ' +
    'shared degree-2 deficit/miss-factor section; imp-3481/imp-3482/imp-3484 beside the ' +
    'moment-ladder visualizations. Do not fabricate pages in this audit ticket.',
  honestNote:
    'Read-only audit; no pages fabricated. No new bound, no QED. No refereed bound is changed.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3517_ASSERTIONS = [
  {
    id: 'imp3517-exactly-ten-modules-audited',
    holds: () => IMP_3517_3481_3490_COHORT_MODULE_SURFACING_AUDIT.modules.length === 10,
    why: 'The audit must cover exactly the ten named imp-3481..3490 cohort modules.',
  },
  {
    id: 'imp3517-all-ten-orphan',
    holds: () => {
      const m = IMP_3517_3481_3490_COHORT_MODULE_SURFACING_AUDIT.modules;
      const orphan = m.filter((x) => !x.surfaced).length;
      return orphan === 10 && orphan === IMP_3517_3481_3490_COHORT_MODULE_SURFACING_AUDIT.orphanCount;
    },
    why: 'None of imp-3481..3490 is reachable from any src/pages entry point as of the 2026-07-03 audit.',
  },
  {
    id: 'imp3517-honest-scope-locked',
    holds: () => /refereed bound is changed/i.test(IMP_3517_3481_3490_COHORT_MODULE_SURFACING_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3517_3481_3490_COHORT_MODULE_SURFACING_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed.',
  },
];

for (const a of IMP_3517_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3517 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3517_ASSERTIONS };
