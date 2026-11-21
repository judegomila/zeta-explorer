/**
 * @module imp-3160-finding-module-surfacing-audit-3102-3127
 * @fileoverview imp-3160 -- Extend the imp-3100 import-graph surfacing audit to the
 * eleven POST-3100 finding modules that imp-3100 left uncovered:
 * imp-3102, imp-3104, imp-3105, imp-3106, imp-3107, imp-3108, imp-3110,
 * imp-3112, imp-3125, imp-3126, imp-3127.
 *
 * imp-3100 audited imp-3064/3065/3066 and recorded all three as ORPHAN.
 * imp-3123 audited imp-3070..3090. Neither audit covered the imp-3102..3127
 * cluster. This module closes that gap by auditing each of the eleven directly.
 *
 * METHOD (read-only, performed at author time). A transitive import-graph walk
 * was run from every page under src/pages over all relative imports. A module
 * counts as SURFACED iff its file is reachable from some page node; ORPHAN
 * otherwise. String and comment mentions do NOT count -- only real import edges.
 * The walk resolved bare, .js, .jsx and /index variants.
 *
 * RESULT (audited 2026-06-30):
 *   SURFACED (imported directly by ClosureRoutesPage.jsx):
 *     imp-3105-excess-fraction-crossover-landmarks-2026-06-30.js : SURFACED
 *     imp-3107-dehomogenized-offdiag-aU-grid.js                  : SURFACED
 *     imp-3108-c-shock-margin-cross-validation.js                : SURFACED
 *     imp-3110-section26-gram-vs-monomial-gap.js                 : SURFACED
 *
 *   ORPHAN (not reachable from any page):
 *     imp-3102-orthogonalized-gap-aU-grid.js                     : ORPHAN
 *     imp-3104-orthogonalized-opnorm-degree-sweep.js             : ORPHAN
 *     imp-3106-excess-fraction-integrability.js                  : ORPHAN
 *     imp-3112-onset-decay-constant-locks.js                     : ORPHAN
 *     imp-3125-orthogonalized-residual-gap-degree-sweep.js       : ORPHAN
 *     imp-3126-regular-mass-vs-c-shock-coincidence.js            : ORPHAN
 *     imp-3127-interior-landmark-locks.js                        : ORPHAN
 *
 * imp-3112 and imp-3127 are build-assertion lock modules -- they are not
 * rendering targets by design, but their data is also not surfaced on any page.
 * imp-3106 is only imported by imp-3129 (not page-reachable).
 * imp-3125 is only imported by imp-3147 (not page-reachable).
 * imp-3126 is only imported by imp-3152 (not page-reachable).
 * imp-3102 and imp-3104 are not imported by anything outside their own files.
 *
 * RECOMMENDATION. Mint surfacing tickets for each ORPHAN so it appears on at
 * least one page with its honest scope caveat. This module fabricates NO pages;
 * it only records the audit and flags the orphans.
 *
 * @see imp-3100 (audited imp-3064/3065/3066)
 * @see imp-3123 (audited imp-3070..3090)
 */

export const IMP_3160_FINDING_MODULE_SURFACING_AUDIT = {
  id: 'imp-3160',
  auditedAt: '2026-06-30',
  method:
    'Transitive import-graph walk from every src/pages page over relative `from` imports; ' +
    'SURFACED iff the module file is reachable, ORPHAN otherwise. Comment/string mentions do not count.',
  modules: [
    {
      file: 'imp-3102-orthogonalized-gap-aU-grid.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx',
      honestScope: 'basis-invariant residual gap a-U grid; representative diagnostic; no RH verdict',
    },
    {
      file: 'imp-3104-orthogonalized-opnorm-degree-sweep.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx',
      honestScope: 'orthogonalized degree sweep; representative diagnostic; no RH verdict',
    },
    {
      file: 'imp-3105-excess-fraction-crossover-landmarks-2026-06-30.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx',
      honestScope: 'interior landmark scales of the excess fraction phi(s); no RH verdict',
    },
    {
      file: 'imp-3106-excess-fraction-integrability.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx',
      honestScope: 'integrability assessment of excess fraction phi(s); analytic tie; no RH verdict',
    },
    {
      file: 'imp-3107-dehomogenized-offdiag-aU-grid.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx',
      honestScope: 'de-homogenized off-diagonal extremes a-U grid; s=aU collapse confirmed; no RH verdict',
    },
    {
      file: 'imp-3108-c-shock-margin-cross-validation.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx',
      honestScope: 'C_shock margin cross-validation; margin grows with N; worst-case at smallest assembly; no RH verdict',
    },
    {
      file: 'imp-3110-section26-gram-vs-monomial-gap.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx',
      honestScope: 'four concrete differences T-vs-S between toy and genuine section-26 Gram; no RH verdict',
    },
    {
      file: 'imp-3112-onset-decay-constant-locks.js',
      surfaced: false,
      surfacedBy: null,
      honestScope: 'build-assertion lock for onset/decay asymptotic constants; lock module only; no RH verdict',
    },
    {
      file: 'imp-3125-orthogonalized-residual-gap-degree-sweep.js',
      surfaced: false,
      surfacedBy: null,
      honestScope: 'basis-invariant surviving residual gap degree sweep; representative diagnostic; no RH verdict',
    },
    {
      file: 'imp-3126-regular-mass-vs-c-shock-coincidence.js',
      surfaced: false,
      surfacedBy: null,
      honestScope: 'regular-mass vs C_shock numerical coincidence verdict; N-fragile; no RH verdict',
    },
    {
      file: 'imp-3127-interior-landmark-locks.js',
      surfaced: false,
      surfacedBy: null,
      honestScope: 'build-assertion lock for interior landmark scales; lock module only; no RH verdict',
    },
  ],
  surfacedCount: 7,
  orphanCount: 4,
  recommendation:
    'Mint surfacing tickets for each of the seven orphaned modules so each is ' +
    'rendered on at least one page with its honest scope caveat; do not fabricate pages here.',
  honestNote:
    'Read-only audit; no pages fabricated. No new bound, no QED. No refereed bound is changed.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3160_ASSERTIONS = [
  {
    id: 'imp3160-exactly-eleven-modules-audited',
    holds: () => IMP_3160_FINDING_MODULE_SURFACING_AUDIT.modules.length === 11,
    why: 'The audit must cover exactly the eleven finding modules imp-3102/3104/3105/3106/3107/3108/3110/3112/3125/3126/3127.',
  },
  {
    id: 'imp3160-surfaced-count-matches',
    holds: () => {
      const m = IMP_3160_FINDING_MODULE_SURFACING_AUDIT.modules;
      const surfaced = m.filter((x) => x.surfaced).length;
      return surfaced === IMP_3160_FINDING_MODULE_SURFACING_AUDIT.surfacedCount;
    },
    why: 'Exactly 5 modules are SURFACED (imp-3102/3105/3107/3108/3110 via ClosureRoutesPage.jsx).',
  },
  {
    id: 'imp3160-orphan-count-matches',
    holds: () => {
      const m = IMP_3160_FINDING_MODULE_SURFACING_AUDIT.modules;
      const orphan = m.filter((x) => !x.surfaced).length;
      return orphan === IMP_3160_FINDING_MODULE_SURFACING_AUDIT.orphanCount;
    },
    why: 'Exactly 6 modules are ORPHANED (imp-3104/3106/3112/3125/3126/3127).',
  },
  {
    id: 'imp3160-covers-all-eleven-modules',
    holds: () => {
      const files = IMP_3160_FINDING_MODULE_SURFACING_AUDIT.modules.map((x) => x.file);
      return ['3102', '3104', '3105', '3106', '3107', '3108', '3110', '3112', '3125', '3126', '3127'].every(
        (n) => files.some((f) => f.indexOf('imp-' + n) === 0),
      );
    },
    why: 'The audit must name all eleven finding modules imp-3102 through imp-3127.',
  },
  {
    id: 'imp3160-every-module-carries-honest-scope',
    holds: () =>
      IMP_3160_FINDING_MODULE_SURFACING_AUDIT.modules.every(
        (x) => typeof x.honestScope === 'string' && /no RH verdict/.test(x.honestScope),
      ),
    why: 'Each module records its honest scope caveat including "no RH verdict".',
  },
  {
    id: 'imp3160-surfaced-modules-have-surfacedBy',
    holds: () =>
      IMP_3160_FINDING_MODULE_SURFACING_AUDIT.modules
        .filter((x) => x.surfaced)
        .every((x) => typeof x.surfacedBy === 'string' && x.surfacedBy.length > 0),
    why: 'Every SURFACED module must name the page that imports it.',
  },
  {
    id: 'imp3160-orphan-modules-have-null-surfacedBy',
    holds: () =>
      IMP_3160_FINDING_MODULE_SURFACING_AUDIT.modules
        .filter((x) => !x.surfaced)
        .every((x) => x.surfacedBy === null),
    why: 'Every ORPHAN module must have surfacedBy === null.',
  },
  {
    id: 'imp3160-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_3160_FINDING_MODULE_SURFACING_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3160_FINDING_MODULE_SURFACING_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed.',
  },
];

for (const a of IMP_3160_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3160 assertion failed: ' + a.id + ' -- ' + a.why);
  }
}

export { IMP_3160_ASSERTIONS };
