/**
 * @module imp-3438-newest-enumeration-cohort-surfacing-audit
 * @fileoverview imp-3438 — Audit whether the imp-3381/3382/3383/3384/3385 cohort
 * (PCC-free route enumeration, raw-diagonal ||R|| growth law, onset third-order
 * Pade, interior crossover, smooth-core family search) is imported by any
 * page/component consumer or is orphaned data files.
 *
 * METHOD (read-only, performed at author time). Grepped src/pages and
 * src/components for each module's exported symbol name, following the
 * imp-3083/imp-3398/imp-3459/imp-3480 surfacing-audit pattern. String/comment
 * mentions of the "imp-NNNN" id do NOT count as surfacing -- only a real
 * `import { SYMBOL } from '.../imp-NNNN-....js'` edge does.
 *
 * RESULT (audited 2026-07-03):
 *   - imp-3381-pcc-free-route-enumeration.js       : ORPHAN
 *   - imp-3382-rawdiagonal-R-degree-growth-law.js  : SURFACED
 *       (imported by src/pages/ClosureRoutesPage.jsx as IMP3382_RAWDIAGONAL_R_DEGREE_GROWTH_LAW)
 *   - imp-3383-onset-third-order-higher-pade.js    : SURFACED
 *       (imported by src/pages/ClosureRoutesPage.jsx as IMP3383_ONSET_THIRD_ORDER_HIGHER_PADE)
 *   - imp-3384-interior-crossover-below-horizon.js : SURFACED
 *       (imported by src/pages/ClosureRoutesPage.jsx as IMP3384_INTERIOR_CROSSOVER_BELOW_HORIZON)
 *   - imp-3385-mupass-smooth-core-family-search.js : SURFACED
 *       (imported by src/pages/ClosureRoutesPage.jsx as IMP3385_MUPASS_SMOOTH_CORE_FAMILY_SEARCH)
 *
 * The one orphan, imp-3381 (the PCC-free-vs-RH-equivalent closure-route
 * enumeration matrix), has zero page/component importers. Its conclusion --
 * that isLiveTarget := pccFree && !rhEquiv is empty within the closure
 * family, pushing the live targets to the out-of-family C_H/G6a Holder-1/2
 * shock modulus and the winding-under-heat-flow thread -- was already given a
 * prose write-up by imp-3437 (a content/analysis note), but that note does not
 * import the imp-3381 data module itself, so the module's route-matrix table
 * remains unrendered.
 *
 * RECOMMENDATION. Mint a follow-up surfacing ticket to add a small route-matrix
 * table/viz on ClosureRoutesPage (or beside the imp-3437 analysis note) that
 * imports IMP3381_PCC_FREE_ROUTE_ENUMERATION directly and renders its rows, so
 * the enumeration backing the imp-3437 conclusion is traceable to live data
 * rather than only prose. This module fabricates NO pages; it only records the
 * audit and flags the orphan. No QED; no refereed bound is changed.
 *
 * @see imp-3083 (the prior finding-module surfacing audit this pattern follows)
 * @see imp-3398, imp-3459, imp-3480 (subsequent cohorts audited the same way)
 */

export const IMP_3438_NEWEST_ENUMERATION_COHORT_SURFACING_AUDIT = {
  id: 'imp-3438',
  auditedAt: '2026-07-03',
  method:
    'Grep each module exported symbol name for real `import { SYMBOL } from` edges under src/pages ' +
    'and src/components, following the imp-3083/imp-3398/imp-3459/imp-3480 pattern. Comment/string ' +
    'mentions of the imp-id do not count.',
  modules: [
    {
      file: 'imp-3381-pcc-free-route-enumeration.js',
      surfaced: false,
      surfacedBy: null,
    },
    {
      file: 'imp-3382-rawdiagonal-R-degree-growth-law.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx (IMP3382_RAWDIAGONAL_R_DEGREE_GROWTH_LAW)',
    },
    {
      file: 'imp-3383-onset-third-order-higher-pade.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx (IMP3383_ONSET_THIRD_ORDER_HIGHER_PADE)',
    },
    {
      file: 'imp-3384-interior-crossover-below-horizon.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx (IMP3384_INTERIOR_CROSSOVER_BELOW_HORIZON)',
    },
    {
      file: 'imp-3385-mupass-smooth-core-family-search.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx (IMP3385_MUPASS_SMOOTH_CORE_FAMILY_SEARCH)',
    },
  ],
  orphanCount: 1,
  recommendation:
    'Mint a follow-up surfacing ticket for imp-3381 (PCC-free route enumeration) adding a small ' +
    'route-matrix table/viz that imports the data module directly, so the imp-3437 prose conclusion ' +
    'is traceable to live data; do not fabricate pages in this audit ticket.',
  honestNote:
    'Read-only audit; no pages fabricated. No new bound, no QED. No refereed bound is changed.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3438_ASSERTIONS = [
  {
    id: 'imp3438-exactly-five-modules-audited',
    holds: () => IMP_3438_NEWEST_ENUMERATION_COHORT_SURFACING_AUDIT.modules.length === 5,
    why: 'The audit must cover exactly the five named imp-3381..3385 modules.',
  },
  {
    id: 'imp3438-four-surfaced-one-orphan',
    holds: () => {
      const m = IMP_3438_NEWEST_ENUMERATION_COHORT_SURFACING_AUDIT.modules;
      const surfaced = m.filter((x) => x.surfaced).length;
      const orphan = m.filter((x) => !x.surfaced).length;
      return surfaced === 4 && orphan === 1 &&
        orphan === IMP_3438_NEWEST_ENUMERATION_COHORT_SURFACING_AUDIT.orphanCount;
    },
    why: 'Four of the five modules (imp-3382/3383/3384/3385) are surfaced via ClosureRoutesPage; imp-3381 is orphaned.',
  },
  {
    id: 'imp3438-imp3381-is-the-orphan',
    holds: () => {
      const m = IMP_3438_NEWEST_ENUMERATION_COHORT_SURFACING_AUDIT.modules.find(
        (x) => x.file === 'imp-3381-pcc-free-route-enumeration.js',
      );
      return !!m && m.surfaced === false && m.surfacedBy === null;
    },
    why: 'imp-3381 is the one orphaned module found by this audit.',
  },
  {
    id: 'imp3438-honest-scope-locked',
    holds: () => /refereed bound is changed/i.test(IMP_3438_NEWEST_ENUMERATION_COHORT_SURFACING_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3438_NEWEST_ENUMERATION_COHORT_SURFACING_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed.',
  },
];

for (const a of IMP_3438_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3438 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3438_ASSERTIONS };
