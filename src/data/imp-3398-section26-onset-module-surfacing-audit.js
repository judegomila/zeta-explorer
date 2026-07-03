/**
 * @module imp-3398-section26-onset-module-surfacing-audit
 * @fileoverview imp-3398 — Audit whether the section-26 / onset analysis modules
 * imp-3309, imp-3310, imp-3322, imp-3324, imp-3325 are imported by any page/consumer
 * or are orphaned data files, and record which need wiring.
 *
 * METHOD (read-only, performed at author time). A transitive import-graph walk was
 * run from every page under src/pages over all `... from "..."` relative imports.
 * A module counts as SURFACED iff its file is reachable from some page node; ORPHAN
 * otherwise. String / comment mentions do NOT count — only real import edges.
 *
 * RESULT (audited 2026-07-03):
 *   - imp-3309-two-tail-underflow-horizons.js        : SURFACED
 *       (imported by src/pages/ClosureRoutesPage.jsx as IMP3309_TWO_TAIL_UNDERFLOW_HORIZONS)
 *   - imp-3310-mupass-passive-core-assembly-recipe.js : ORPHAN
 *   - imp-3322-spread-contraction-discriminator.js    : SURFACED
 *       (imported by src/pages/ClosureRoutesPage.jsx as IMP3322_SPREAD_CONTRACTION_DISCRIMINATOR)
 *   - imp-3324-sigma-CH-sensitivity.js                : SURFACED
 *       (imported by src/pages/ClosureRoutesPage.jsx as IMP3324_SIGMA_CH_SENSITIVITY)
 *   - imp-3325-onset-pade-resummation.js              : SURFACED
 *       (imported by src/pages/ClosureRoutesPage.jsx as IMP3325_ONSET_PADE_RESUMMATION)
 *
 * The one orphan, imp-3310, is imported only by sibling src/data finding modules
 * (imp-3385-mupass-smooth-core-family-search.js and
 * imp-3386-mupass-multiharmonic-scalar-core-saturation.js), neither of which is
 * itself reached from any page. Its data is therefore present in the system of
 * record but never rendered.
 *
 * RECOMMENDATION. Mint a follow-up surfacing ticket for imp-3310 (and, transitively,
 * for the imp-3385/imp-3386 chain that currently only consumes it) so it appears on
 * at least one page; the ClosureRoutesPage mupass-core section is the natural home.
 * This module fabricates NO pages; it only records the audit and flags the orphan.
 * No QED; Platt-Trudgian Lambda <= 0.2 stays SOTA.
 *
 * @see imp-3083 (the prior finding-module surfacing audit this pattern follows)
 */

export const IMP_3398_SECTION26_ONSET_MODULE_SURFACING_AUDIT = {
  id: 'imp-3398',
  auditedAt: '2026-07-03',
  method:
    'Transitive import-graph walk from every src/pages page over relative `from` imports; ' +
    'SURFACED iff the module file is reachable, ORPHAN otherwise. Comment/string mentions do not count.',
  modules: [
    {
      file: 'imp-3309-two-tail-underflow-horizons.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx (IMP3309_TWO_TAIL_UNDERFLOW_HORIZONS)',
    },
    {
      file: 'imp-3310-mupass-passive-core-assembly-recipe.js',
      surfaced: false,
      surfacedBy: null,
    },
    {
      file: 'imp-3322-spread-contraction-discriminator.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx (IMP3322_SPREAD_CONTRACTION_DISCRIMINATOR)',
    },
    {
      file: 'imp-3324-sigma-CH-sensitivity.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx (IMP3324_SIGMA_CH_SENSITIVITY)',
    },
    {
      file: 'imp-3325-onset-pade-resummation.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx (IMP3325_ONSET_PADE_RESUMMATION)',
    },
  ],
  orphanCount: 1,
  recommendation:
    'Mint a follow-up surfacing ticket for imp-3310 (mupass passive-core assembly recipe) ' +
    'so it is rendered on at least one page; do not fabricate pages in this audit ticket.',
  honestNote:
    'Read-only audit; no pages fabricated. No new bound, no QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3398_ASSERTIONS = [
  {
    id: 'imp3398-exactly-five-modules-audited',
    holds: () => IMP_3398_SECTION26_ONSET_MODULE_SURFACING_AUDIT.modules.length === 5,
    why: 'The audit must cover exactly the five named section-26/onset modules.',
  },
  {
    id: 'imp3398-four-surfaced-one-orphan',
    holds: () => {
      const m = IMP_3398_SECTION26_ONSET_MODULE_SURFACING_AUDIT.modules;
      const surfaced = m.filter((x) => x.surfaced).length;
      const orphan = m.filter((x) => !x.surfaced).length;
      return surfaced === 4 && orphan === 1 &&
        orphan === IMP_3398_SECTION26_ONSET_MODULE_SURFACING_AUDIT.orphanCount;
    },
    why: 'Four of the five modules (imp-3309/3322/3324/3325) are surfaced via ClosureRoutesPage; imp-3310 is orphaned.',
  },
  {
    id: 'imp3398-imp3310-is-the-orphan',
    holds: () => {
      const m = IMP_3398_SECTION26_ONSET_MODULE_SURFACING_AUDIT.modules.find(
        (x) => x.file === 'imp-3310-mupass-passive-core-assembly-recipe.js',
      );
      return !!m && m.surfaced === false && m.surfacedBy === null;
    },
    why: 'imp-3310 is the one orphaned module found by this audit.',
  },
  {
    id: 'imp3398-honest-scope-locked',
    holds: () => /SOTA/.test(IMP_3398_SECTION26_ONSET_MODULE_SURFACING_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3398_SECTION26_ONSET_MODULE_SURFACING_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; Platt-Trudgian Lambda <= 0.2 stays SOTA.',
  },
];

for (const a of IMP_3398_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3398 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3398_ASSERTIONS };
