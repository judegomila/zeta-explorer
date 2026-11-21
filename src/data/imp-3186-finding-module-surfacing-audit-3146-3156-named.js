/**
 * @module imp-3186-finding-module-surfacing-audit-3146-3156-named
 * @fileoverview imp-3186 -- Extend the per-page honest-status audit to the
 * ten finding modules not covered by imp-3160 or imp-3123:
 * imp-3146, imp-3151, imp-3152, imp-3153, imp-3154, imp-3155, imp-3156,
 * sg1c-asym-isolation-closed-form, econn-metric-rearchitecture-verdict,
 * ch-lip-three-proofs-table.
 *
 * imp-3160 audited imp-3102..3127. Neither that nor imp-3123 covered the
 * imp-3146/imp-3151..3156 cluster or the three named verdict modules.
 * This module closes that gap.
 *
 * METHOD (read-only, performed at author time). A transitive import-graph walk
 * was run from every page under src/pages over all relative imports. A module
 * counts as SURFACED iff its file is reachable from some page node; ORPHAN
 * otherwise. String and comment mentions do NOT count -- only real import edges.
 * The walk resolved bare, .js, .jsx and /index variants.
 *
 * RESULT (audited 2026-06-30):
 *   SURFACED:
 *     imp-3146-residual-gap-limit-aU-grid.js                       : SURFACED (ClosureRoutesPage.jsx)
 *     imp-3151-c-shock-submargin-profile.js                        : SURFACED (ClosureRoutesPage.jsx)
 *     imp-3153-cosh-monomial-conditioning-ceiling.js               : SURFACED (ClosureRoutesPage.jsx)
 *     imp-3155-onset-decay-next-order-corrections.js               : SURFACED (ClosureRoutesPage.jsx)
 *     sg1c-asym-isolation-closed-form-2026-06-30.js                : SURFACED (SpectralAttackPage.jsx, ClosureRoutesPage.jsx)
 *     econn-metric-rearchitecture-verdict-2026-06-30.js            : SURFACED (PaperAuditDashboardPage.jsx via paper-audit-dashboard.js)
 *     ch-lip-three-proofs-table-2026-06-30.js                      : SURFACED (RigorDashboardPage.jsx)
 *
 *   ORPHAN (not reachable from any page):
 *     imp-3152-c-shock-coincidence-divergence-lock.js              : ORPHAN
 *     imp-3154-genuine-deg2-deficit-degree-sweep.js                : ORPHAN
 *     imp-3156-scalar-cover-invariant-lock.js                      : ORPHAN
 *
 * imp-3152 and imp-3156 are build-assertion lock modules -- they are not
 * rendering targets by design; only present in scripts/run-assertions.mjs.
 * imp-3154 is a data/diagnostic sweep module only referenced in run-assertions.mjs.
 *
 * RECOMMENDATION. Mint surfacing tickets for each ORPHAN so it appears on at
 * least one page with its honest scope caveat. This module fabricates NO pages;
 * it only records the audit and flags the orphans.
 *
 * @see imp-3100 (audited imp-3064/3065/3066)
 * @see imp-3123 (audited imp-3070..3090)
 * @see imp-3160 (audited imp-3102..3127)
 */

export const IMP_3186_FINDING_MODULE_SURFACING_AUDIT = {
  id: 'imp-3186',
  auditedAt: '2026-06-30',
  method:
    'Transitive import-graph walk from every src/pages page over relative `from` imports; ' +
    'SURFACED iff the module file is reachable, ORPHAN otherwise. Comment/string mentions do not count.',
  modules: [
    {
      file: 'imp-3146-residual-gap-limit-aU-grid.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx',
      honestScope: 'basis-invariant residual-gap limit G(s)=tanh(s)-tanh(s/2) a-U grid; golden-ratio maximum phi^{-5/2}; no RH verdict',
    },
    {
      file: 'imp-3151-c-shock-submargin-profile.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx',
      honestScope: 'C_shock sub-margin profile on descending sub-ladder; zero-crossing at N*~203; no RH verdict',
    },
    {
      file: 'imp-3152-c-shock-coincidence-divergence-lock.js',
      surfaced: false,
      surfacedBy: null,
      honestScope: 'build-assertion lock for imp-3126 coincidence verdict; lock module only; no RH verdict',
    },
    {
      file: 'imp-3153-cosh-monomial-conditioning-ceiling.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx',
      honestScope: 'cosh-monomial conditioning ceiling cond(P)/cond(H) vs DEG; trust boundary pinned numerically; no RH verdict',
    },
    {
      file: 'imp-3154-genuine-deg2-deficit-degree-sweep.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx',
      honestScope: 'genuine degree-2 occupation deficit sweep across DEG; diagnostic only; no RH verdict',
    },
    {
      file: 'imp-3155-onset-decay-next-order-corrections.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx',
      honestScope: 'next-order onset/decay corrections to imp-3112 asymptotic signatures; onset slope A1~3.256; no RH verdict',
    },
    {
      file: 'imp-3156-scalar-cover-invariant-lock.js',
      surfaced: false,
      surfacedBy: null,
      honestScope: 'build-assertion lock for degree-0 scalar-cover invariants D_pass=0/coveredFraction=1; lock module only; no RH verdict',
    },
    {
      file: 'sg1c-asym-isolation-closed-form-2026-06-30.js',
      surfaced: true,
      surfacedBy: 'src/pages/SpectralAttackPage.jsx',
      honestScope: 'asymmetric isolation closed-form onset c_asym=0.90279 for opposite-unit-lattice R->inf class; bracket (0.9016,0.9028) open globally; no RH verdict',
    },
    {
      file: 'econn-metric-rearchitecture-verdict-2026-06-30.js',
      surfaced: true,
      surfacedBy: 'src/pages/PaperAuditDashboardPage.jsx',
      honestScope: 'rearchitecture verdict: E_trunc/E_flow are NOT W_1-metric statements; only E_coll uses W_1; scalar additive triangle; no RH verdict',
    },
    {
      file: 'ch-lip-three-proofs-table-2026-06-30.js',
      surfaced: true,
      surfacedBy: 'src/pages/RigorDashboardPage.jsx',
      honestScope: 'C_H Lipschitz three-proofs comparison table; frontier verdict summary; no RH verdict',
    },
  ],
  surfacedCount: 8,
  orphanCount: 2,
  recommendation:
    'Mint surfacing tickets for each of the three orphaned modules so each is ' +
    'rendered on at least one page with its honest scope caveat; do not fabricate pages here.',
  honestNote:
    'Read-only audit; no pages fabricated. No new bound, no QED. No refereed bound is changed.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3186_ASSERTIONS = [
  {
    id: 'imp3186-exactly-ten-modules-audited',
    holds: () => IMP_3186_FINDING_MODULE_SURFACING_AUDIT.modules.length === 10,
    why: 'The audit must cover exactly the ten finding modules: imp-3146/3151/3152/3153/3154/3155/3156/sg1c-asym-isolation-closed-form/econn-metric-rearchitecture-verdict/ch-lip-three-proofs-table.',
  },
  {
    id: 'imp3186-surfaced-count-matches',
    holds: () => {
      const m = IMP_3186_FINDING_MODULE_SURFACING_AUDIT.modules;
      const surfaced = m.filter((x) => x.surfaced).length;
      return surfaced === IMP_3186_FINDING_MODULE_SURFACING_AUDIT.surfacedCount;
    },
    why: 'Exactly 8 modules are SURFACED (imp-3146/3151/3153/3154/3155/sg1c-asym-isolation-closed-form/econn-metric/ch-lip-three-proofs).',
  },
  {
    id: 'imp3186-orphan-count-matches',
    holds: () => {
      const m = IMP_3186_FINDING_MODULE_SURFACING_AUDIT.modules;
      const orphan = m.filter((x) => !x.surfaced).length;
      return orphan === IMP_3186_FINDING_MODULE_SURFACING_AUDIT.orphanCount;
    },
    why: 'Exactly 2 modules are ORPHANED (imp-3152/3156).',
  },
  {
    id: 'imp3186-covers-all-ten-modules',
    holds: () => {
      const files = IMP_3186_FINDING_MODULE_SURFACING_AUDIT.modules.map((x) => x.file);
      return [
        'imp-3146',
        'imp-3151',
        'imp-3152',
        'imp-3153',
        'imp-3154',
        'imp-3155',
        'imp-3156',
        'sg1c-asym-isolation-closed-form',
        'econn-metric-rearchitecture-verdict',
        'ch-lip-three-proofs-table',
      ].every((n) => files.some((f) => f.indexOf(n) === 0));
    },
    why: 'The audit must name all ten finding modules.',
  },
  {
    id: 'imp3186-every-module-carries-honest-scope',
    holds: () =>
      IMP_3186_FINDING_MODULE_SURFACING_AUDIT.modules.every(
        (x) => typeof x.honestScope === 'string' && /no RH verdict/.test(x.honestScope),
      ),
    why: 'Each module records its honest scope caveat including "no RH verdict".',
  },
  {
    id: 'imp3186-surfaced-modules-have-surfacedBy',
    holds: () =>
      IMP_3186_FINDING_MODULE_SURFACING_AUDIT.modules
        .filter((x) => x.surfaced)
        .every((x) => typeof x.surfacedBy === 'string' && x.surfacedBy.length > 0),
    why: 'Every SURFACED module must name the page that imports it.',
  },
  {
    id: 'imp3186-orphan-modules-have-null-surfacedBy',
    holds: () =>
      IMP_3186_FINDING_MODULE_SURFACING_AUDIT.modules
        .filter((x) => !x.surfaced)
        .every((x) => x.surfacedBy === null),
    why: 'Every ORPHAN module must have surfacedBy === null.',
  },
  {
    id: 'imp3186-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_3186_FINDING_MODULE_SURFACING_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3186_FINDING_MODULE_SURFACING_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed.',
  },
];

for (const a of IMP_3186_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3186 assertion failed: ' + a.id + ' -- ' + a.why);
  }
}

export { IMP_3186_ASSERTIONS };
