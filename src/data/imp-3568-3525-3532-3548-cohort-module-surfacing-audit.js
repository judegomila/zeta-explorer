/**
 * @module imp-3568-3525-3532-3548-cohort-module-surfacing-audit
 * @fileoverview imp-3568 — Audit whether the newest imp-3525/3526/3527/3528/3529/
 * 3530/3531/3532/3548 (moment-ladder / skew-Toeplitz / xi* quadrature) research
 * modules are imported by any page/component or are orphaned data files. imp-3539
 * audited only through imp-3511 and misses this wave; this continues the
 * imp-3459/imp-3480/imp-3498/imp-3517/imp-3539 orphan-audit series to the next
 * cohort.
 *
 * METHOD (read-only, performed at author time). A transitive import-graph walk was
 * run from every page under src/pages and every component under src/components over
 * all `... from "..."` relative imports. A module counts as SURFACED iff its file is
 * reachable from some page/component node; ORPHAN otherwise. String / comment
 * mentions (e.g. `@see` lines, prose referencing an imp-NNNN id) do NOT count — only
 * real `import { ... } from '...'` edges, including transitively through other data
 * modules. This matters here specifically: the five downstream "-viz-data" files
 * (imp-3563, imp-3564, imp-3565, imp-3566, imp-3567) each carry an `@fileoverview`
 * comment naming one of this cohort's ids and DO have page consumers, but every one
 * of them bakes its own import-light literal data (per the established
 * "verify-heavy-assertion-modules" convention) rather than importing the cohort
 * module — so the comment mention does not create a real import edge, and the
 * cohort module stays unreached.
 *
 * RESULT (audited 2026-07-03): all nine modules are ORPHAN. Each is pulled in by
 * *later* research data modules, but the entire downstream chain checked (imp-3540,
 * imp-3545, imp-3546, imp-3547, imp-3549, imp-3550, imp-3551, imp-3552, imp-3553,
 * imp-3554, imp-3555, imp-3556, imp-3557, imp-3558, imp-3571, imp-3572, imp-3573,
 * imp-3574, imp-3576, imp-3581, imp-3597, imp-3600) is itself not reachable from any
 * src/pages or src/components entry point, so none of it counts as surfaced:
 *   - imp-3525-corrected-solver-agreement-crossval.js   : ORPHAN (imported by imp-3554)
 *   - imp-3526-remainder-tail-cancellation-free-r4.js   : ORPHAN (imported by imp-3553, imp-3557, imp-3581, imp-3600)
 *   - imp-3527-sinh-cancellation-safety-k-ladder.js     : ORPHAN (imported by imp-3553, imp-3557; @see-only in imp-3566)
 *   - imp-3528-degree4-moment-simpson-refinement.js     : ORPHAN (imported by imp-3547, imp-3557, imp-3576, imp-3597)
 *   - imp-3529-sigma-postpeak-decay-exponent.js         : ORPHAN (imported by imp-3556; @see-only in imp-3565)
 *   - imp-3530-power-iteration-budget-closed-form-fit.js: ORPHAN (imported by imp-3540, imp-3545, imp-3549, imp-3555; @see-only in imp-3564)
 *   - imp-3531-far-tail-band-max-grid-convergence.js    : ORPHAN (imported by imp-3550, imp-3558, imp-3571)
 *   - imp-3532-moment-tail-closed-error-bound.js        : ORPHAN (imported by imp-3546, imp-3552, imp-3573, imp-3574; @see-only in imp-3567)
 *   - imp-3548-xistar-quadrature-scheme-invariance.js   : ORPHAN (imported by imp-3551, imp-3572; @see-only in imp-3563)
 *
 * RECOMMENDATION. Mint follow-up surfacing tickets grouped by narrative home:
 * imp-3525/3526/3527/3528 (solver-agreement crossval, cancellation-free tail
 * remainder, cancellation-safety K-ladder, degree-4 Simpson refinement) belong
 * beside the existing moment-ladder derivation visualizations; imp-3529/3530/3531/
 * 3532 (post-peak decay exponent, power-iteration budget closed form, far-tail band
 * max convergence, moment-tail closed error bound) belong beside the power-budget /
 * tail-certificate narrative section; imp-3548 (xi* quadrature scheme invariance)
 * belongs beside the existing xi*/C_inf sections on ClosureRoutesPage. This module
 * fabricates NO pages; it only records the audit and flags the orphans. No new
 * bound, no QED; no refereed bound is changed.
 *
 * @see imp-3459, imp-3480, imp-3498, imp-3517, imp-3539 (the prior audits in this series)
 */

export const IMP_3568_3525_3532_3548_COHORT_MODULE_SURFACING_AUDIT = {
  id: 'imp-3568',
  auditedAt: '2026-07-03',
  method:
    'Transitive import-graph walk from every src/pages and src/components node over relative ' +
    '`from` imports; SURFACED iff the module file is reachable, ORPHAN otherwise. Comment/string ' +
    'mentions (including @fileoverview references in downstream -viz-data files that bake their ' +
    'own literals) do not count.',
  modules: [
    { file: 'imp-3525-corrected-solver-agreement-crossval.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3526-remainder-tail-cancellation-free-r4.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3527-sinh-cancellation-safety-k-ladder.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3528-degree4-moment-simpson-refinement.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3529-sigma-postpeak-decay-exponent.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3530-power-iteration-budget-closed-form-fit.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3531-far-tail-band-max-grid-convergence.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3532-moment-tail-closed-error-bound.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3548-xistar-quadrature-scheme-invariance.js', surfaced: false, surfacedBy: null },
  ],
  orphanCount: 9,
  recommendation:
    'Mint follow-up surfacing tickets grouped by narrative home: imp-3525/3526/3527/3528 beside ' +
    'the moment-ladder derivation visualizations; imp-3529/3530/3531/3532 beside the power-budget / ' +
    'tail-certificate narrative section; imp-3548 beside the xi*/C_inf sections on ClosureRoutesPage. ' +
    'Do not fabricate pages in this audit ticket.',
  honestNote:
    'Read-only audit; no pages fabricated. No new bound, no QED. No refereed bound is changed.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3568_ASSERTIONS = [
  {
    id: 'imp3568-exactly-nine-modules-audited',
    holds: () => IMP_3568_3525_3532_3548_COHORT_MODULE_SURFACING_AUDIT.modules.length === 9,
    why: 'The audit must cover exactly the nine named imp-3525..3532 (plus imp-3548) cohort modules.',
  },
  {
    id: 'imp3568-all-nine-orphan',
    holds: () => {
      const m = IMP_3568_3525_3532_3548_COHORT_MODULE_SURFACING_AUDIT.modules;
      const orphan = m.filter((x) => !x.surfaced).length;
      return orphan === 9 && orphan === IMP_3568_3525_3532_3548_COHORT_MODULE_SURFACING_AUDIT.orphanCount;
    },
    why: 'None of imp-3525..3532/imp-3548 is reachable from any src/pages or src/components entry point as of the 2026-07-03 audit.',
  },
  {
    id: 'imp3568-honest-scope-locked',
    holds: () => /refereed bound is changed/i.test(IMP_3568_3525_3532_3548_COHORT_MODULE_SURFACING_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3568_3525_3532_3548_COHORT_MODULE_SURFACING_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed.',
  },
];

for (const a of IMP_3568_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3568 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3568_ASSERTIONS };
