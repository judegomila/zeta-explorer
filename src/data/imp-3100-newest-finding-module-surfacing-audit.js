/**
 * @module imp-3100-newest-finding-module-surfacing-audit
 * @fileoverview imp-3100 — Extend the per-page honest-status surfacing audit to the
 * three NEWEST finding modules NOT covered by the imp-3083 audit:
 * imp-3064 (deficit/excess-fraction grid), imp-3065 (residual-deficit quadrature),
 * imp-3066 (off-diagonal endpoint-Hankel obstruction).
 *
 * imp-3083 audited the four newest finding modules up to that point and, in its
 * narrative, named the imp-3064/3065/3066 chain as the unreached sibling cluster
 * that orphans imp-3007/3022/3026 — but it did NOT record a per-module SURFACED /
 * ORPHAN verdict for imp-3064/3065/3066 themselves. This module closes that gap by
 * auditing each of the three directly.
 *
 * METHOD (read-only, performed at author time). A transitive import-graph walk was
 * run from every page under src/pages over all `... from "..."` relative imports.
 * A module counts as SURFACED iff its file is reachable from some page node; ORPHAN
 * otherwise. String / comment mentions of a module name do NOT count — only real
 * import edges. The walk resolved bare, .js, .jsx and /index variants.
 *
 * RESULT (audited 2026-06-30):
 *   - imp-3064-deficit-excess-fraction-grid         : ORPHAN
 *   - imp-3065-residual-deficit-quadrature-2026-06-30 : ORPHAN
 *   - imp-3066-offdiagonal-hankel-obstruction       : ORPHAN
 *
 * All three are imported only by sibling src/data finding modules (e.g. the
 * imp-3084/3085/3086/3087/3088/3102/3103/3105/3106/3107/3110 chain), none of which
 * is itself reached from any page. Their data is present in the system of record but
 * never rendered. Each carries the honest scope of its source ticket: scalar cover
 * only / representative monomial truncation / no RH verdict.
 *
 * RECOMMENDATION. Mint a follow-up surfacing ticket for each of the three orphans so
 * each appears on at least one page with its honest scope caveat (the existing
 * RouteMapPage / ClosureRoutesPage scalar-cover-vs-operator-positivity annotations
 * are the natural homes — see imp-3101). This module fabricates NO pages; it only
 * records the audit and flags the orphans. No QED; no refereed bound is changed.
 *
 * @see imp-3083 (the four-module audit this extends)
 * @see imp-3014 (the original per-page honest-status audit)
 */

export const IMP_3100_NEWEST_MODULE_SURFACING_AUDIT = {
  id: 'imp-3100',
  auditedAt: '2026-06-30',
  method:
    'Transitive import-graph walk from every src/pages page over relative `from` imports; ' +
    'SURFACED iff the module file is reachable, ORPHAN otherwise. Comment/string mentions do not count.',
  modules: [
    {
      file: 'imp-3064-deficit-excess-fraction-grid.js',
      surfaced: false,
      surfacedBy: null,
      honestScope: 'deficit/excess-fraction grid; scalar cover only; no RH verdict',
    },
    {
      file: 'imp-3065-residual-deficit-quadrature-2026-06-30.js',
      surfaced: false,
      surfacedBy: null,
      honestScope: 'residual-deficit quadrature; representative truncation; no RH verdict',
    },
    {
      file: 'imp-3066-offdiagonal-hankel-obstruction.js',
      surfaced: false,
      surfacedBy: null,
      honestScope: 'off-diagonal endpoint-Hankel obstruction; operator step OPEN; no RH verdict',
    },
  ],
  orphanCount: 3,
  recommendation:
    'Mint a follow-up surfacing ticket for each of the three orphaned modules so each is ' +
    'rendered on at least one page with its honest scope caveat; do not fabricate pages here.',
  honestNote:
    'Read-only audit; no pages fabricated. No new bound, no QED. No refereed bound is changed.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3100_ASSERTIONS = [
  {
    id: 'imp3100-exactly-three-modules-audited',
    holds: () => IMP_3100_NEWEST_MODULE_SURFACING_AUDIT.modules.length === 3,
    why: 'The audit must cover exactly the three newest finding modules imp-3064/3065/3066.',
  },
  {
    id: 'imp3100-all-three-orphan',
    holds: () => {
      const m = IMP_3100_NEWEST_MODULE_SURFACING_AUDIT.modules;
      const orphan = m.filter((x) => !x.surfaced).length;
      return orphan === 3 && orphan === IMP_3100_NEWEST_MODULE_SURFACING_AUDIT.orphanCount;
    },
    why: 'All three audited modules are ORPHANED (unreached from any page).',
  },
  {
    id: 'imp3100-covers-3064-3065-3066',
    holds: () => {
      const files = IMP_3100_NEWEST_MODULE_SURFACING_AUDIT.modules.map((x) => x.file);
      return ['3064', '3065', '3066'].every((n) =>
        files.some((f) => f.indexOf('imp-' + n) === 0));
    },
    why: 'The audit must name exactly imp-3064, imp-3065 and imp-3066.',
  },
  {
    id: 'imp3100-every-orphan-carries-honest-scope',
    holds: () =>
      IMP_3100_NEWEST_MODULE_SURFACING_AUDIT.modules.every(
        (x) => typeof x.honestScope === 'string' && /no RH verdict|OPEN/.test(x.honestScope),
      ),
    why: 'Each orphan records its honest scope caveat (scalar cover / truncation / no RH verdict).',
  },
  {
    id: 'imp3100-honest-scope-locked',
    holds: () => /refereed bound is changed/i.test(IMP_3100_NEWEST_MODULE_SURFACING_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3100_NEWEST_MODULE_SURFACING_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed.',
  },
];

for (const a of IMP_3100_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3100 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3100_ASSERTIONS };
