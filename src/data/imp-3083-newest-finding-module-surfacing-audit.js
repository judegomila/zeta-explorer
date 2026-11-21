/**
 * @module imp-3083-newest-finding-module-surfacing-audit
 * @fileoverview imp-3083 — Extend the imp-3014 per-page honest-status audit to the
 * four NEWEST finding modules and record which are surfaced on at least one page.
 *
 * imp-3014 added a build check that the key honest-status finding modules are each
 * imported (transitively) by at least one page, so the honest map cannot go dark.
 * The four most recently committed finding modules post-date several of the
 * surfacing tickets, so this module audits each one for page reachability.
 *
 * METHOD (read-only, performed at author time). A transitive import-graph walk was
 * run from every page under src/pages over all `... from "..."` relative imports.
 * A module counts as SURFACED iff its file is reachable from some page node; ORPHAN
 * otherwise. String / comment mentions of a module name do NOT count — only real
 * import edges. (e.g. ch-lip-basin-conditional names imp-3022 in a comment but does
 * not import it, so that mention does not surface imp-3022.)
 *
 * RESULT (audited 2026-06-30):
 *   - ch-lip-basin-conditional-2026-06-30 : SURFACED
 *       (imported by src/pages/RigorDashboardPage.jsx as CH_LIP_BASIN_CONDITIONAL)
 *   - imp-3007-mupass-overflow-cover      : ORPHAN
 *   - imp-3022-ctheta-basin-scaling       : ORPHAN
 *   - imp-3026-c-shock-cross-validation   : ORPHAN
 *
 * The three orphans are imported only by sibling src/data finding modules (the
 * imp-3064/3065/3066/3084/3085/3086/3087/3088/3104/3108/3070/3029 chain), none of
 * which is itself reached from any page. Their data is therefore present in the
 * system of record but never rendered.
 *
 * RECOMMENDATION. Mint a follow-up surfacing ticket for each of the three orphans
 * so each appears on at least one page (the RigorDashboard / frontier diagnostics
 * pages are the natural homes). This module fabricates NO pages; it only records the
 * audit and flags the orphans. No QED; no refereed bound is changed.
 *
 * @see imp-3014 (the per-page honest-status audit this extends)
 * @see ch-lip-basin-conditional-2026-06-30 (the one surfaced newest module)
 */

export const IMP_3083_NEWEST_MODULE_SURFACING_AUDIT = {
  id: 'imp-3083',
  auditedAt: '2026-06-30',
  method:
    'Transitive import-graph walk from every src/pages page over relative `from` imports; ' +
    'SURFACED iff the module file is reachable, ORPHAN otherwise. Comment/string mentions do not count.',
  modules: [
    {
      file: 'ch-lip-basin-conditional-2026-06-30.js',
      surfaced: true,
      surfacedBy: 'src/pages/RigorDashboardPage.jsx (CH_LIP_BASIN_CONDITIONAL)',
    },
    {
      file: 'imp-3007-mupass-overflow-cover.js',
      surfaced: false,
      surfacedBy: null,
    },
    {
      file: 'imp-3022-ctheta-basin-scaling.js',
      surfaced: false,
      surfacedBy: null,
    },
    {
      file: 'imp-3026-c-shock-cross-validation.js',
      surfaced: false,
      surfacedBy: null,
    },
  ],
  orphanCount: 3,
  recommendation:
    'Mint a follow-up surfacing ticket for each of the three orphaned modules so each is ' +
    'rendered on at least one page; do not fabricate pages in this audit ticket.',
  honestNote:
    'Read-only audit; no pages fabricated. No new bound, no QED. No refereed bound is changed.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3083_ASSERTIONS = [
  {
    id: 'imp3083-exactly-four-modules-audited',
    holds: () => IMP_3083_NEWEST_MODULE_SURFACING_AUDIT.modules.length === 4,
    why: 'The audit must cover exactly the four newest finding modules.',
  },
  {
    id: 'imp3083-one-surfaced-three-orphan',
    holds: () => {
      const m = IMP_3083_NEWEST_MODULE_SURFACING_AUDIT.modules;
      const surfaced = m.filter((x) => x.surfaced).length;
      const orphan = m.filter((x) => !x.surfaced).length;
      return surfaced === 1 && orphan === 3 &&
        orphan === IMP_3083_NEWEST_MODULE_SURFACING_AUDIT.orphanCount;
    },
    why: 'Exactly one module (ch-lip-basin-conditional) is surfaced; the other three are orphaned.',
  },
  {
    id: 'imp3083-ch-lip-basin-surfaced-by-rigordashboard',
    holds: () => {
      const m = IMP_3083_NEWEST_MODULE_SURFACING_AUDIT.modules.find(
        (x) => x.file === 'ch-lip-basin-conditional-2026-06-30.js',
      );
      return !!m && m.surfaced === true && /RigorDashboardPage/.test(m.surfacedBy || '');
    },
    why: 'ch-lip-basin-conditional is the one surfaced module, via RigorDashboardPage.',
  },
  {
    id: 'imp3083-honest-scope-locked',
    holds: () => /refereed bound is changed/i.test(IMP_3083_NEWEST_MODULE_SURFACING_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3083_NEWEST_MODULE_SURFACING_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed.',
  },
];

for (const a of IMP_3083_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3083 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3083_ASSERTIONS };
