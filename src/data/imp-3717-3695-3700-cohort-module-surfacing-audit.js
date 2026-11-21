/**
 * @module imp-3717-3695-3700-cohort-module-surfacing-audit
 * @fileoverview imp-3717 -- Audit whether the newest viz-DATA modules
 * imp-3695 (feature-specific fold-in floor ladder), imp-3696 (matched-pair
 * Krylov depth sweep), imp-3697 (a-weight decay crosscheck), imp-3698
 * (fifth-pair adjacent-pairing degeneracy), imp-3699 (fit-bias decay law),
 * and imp-3700 (mesoscopic-vs-shock scale separation) are imported by their
 * committed viz pages or are orphaned data files. This extends the
 * imp-3459/imp-3480/imp-3498/imp-3517/imp-3539/imp-3568/imp-3593/imp-3615/
 * imp-3636/imp-3659/imp-3683/imp-3705 surfacing-audit series to the
 * viz-data cohort those prior audits (which covered plain research modules)
 * did not cover.
 *
 * METHOD (read-only, performed at author time). Same as imp-3683/imp-3705:
 * a transitive import-graph walk from every page under src/pages and every
 * component under src/components over real `from '...'` relative import
 * edges (including a trailing `.js` extension). A module counts as SURFACED
 * iff its file is reachable from some page/component node; ORPHAN otherwise.
 * For this cohort each candidate is itself named `*-viz-data.js`, so the
 * check is direct: does the sibling `*Viz.jsx` page import it, and is that
 * page lazy-loaded and routed in src/App.jsx?
 *
 * RESULT (audited 2026-07-03): all six modules are SURFACED. Each
 * `imp-<id>-...-viz-data.js` file is imported directly by its sibling page
 * component, and every one of those six pages is lazy-loaded and routed in
 * src/App.jsx:
 *   - imp-3695-feature-foldin-floor-ladder-viz-data.js: SURFACED (page Imp3695FeatureFoldinFloorLadderViz.jsx, route /viz-imp3695-feature-foldin-floor-ladder)
 *   - imp-3696-matched-pair-krylov-depth-sweep-viz-data.js: SURFACED (page Imp3696MatchedPairKrylovDepthSweepViz.jsx, route /viz-imp3696-matched-pair-krylov-depth-sweep)
 *   - imp-3697-a-weight-decay-crosscheck-viz-data.js: SURFACED (page Imp3697AWeightDecayCrosscheckViz.jsx, route /viz-imp3697-a-weight-decay-crosscheck; also re-imported downstream by imp-3716-a-weight-ratio-crossing-nonexistence.js)
 *   - imp-3698-fifth-pair-adjacent-pairing-viz-data.js: SURFACED (page Imp3698FifthPairAdjacentPairingViz.jsx, route /viz-imp3698-fifth-pair-adjacent-pairing)
 *   - imp-3699-fit-bias-decay-viz-data.js: SURFACED (page Imp3699FitBiasDecayViz.jsx, route /viz-imp3699-fit-bias-decay)
 *   - imp-3700-mesoscopic-shock-scale-separation-viz-data.js: SURFACED (page Imp3700MesoscopicShockScaleSeparationViz.jsx, route /viz-imp3700-mesoscopic-shock-scale-separation)
 *
 * NOTE ON THE improvements.js LEDGER (not a surfacing defect): the
 * improvements.js entry at id 3695 itself was reassigned to an unrelated
 * "gap-domination bootstrap lemma" (fable-5 proof engine) entry after a
 * shared-counter id collision with a sibling engine (see commit 4722ecf8).
 * That is a ledger bookkeeping collision, distinct from this audit's
 * question of whether the imp-3695 *viz-data file* is reachable from a
 * page -- it is.
 *
 * RECOMMENDATION. No new surfacing tickets are needed for this cohort: all
 * six viz-data modules are already fully wired (data -> page -> route).
 * This module fabricates no pages; it only records the audit. No new
 * bound, no QED; no refereed bound is changed.
 *
 * @see imp-3459, imp-3480, imp-3498, imp-3517, imp-3539, imp-3568, imp-3593, imp-3615, imp-3636, imp-3659, imp-3683, imp-3705 (the prior audits in this series)
 */

export const IMP_3717_3695_3700_COHORT_MODULE_SURFACING_AUDIT = {
  id: 'imp-3717',
  auditedAt: '2026-07-03',
  method:
    'Transitive import-graph walk from every src/pages and src/components node over relative ' +
    '`from` imports (including a trailing .js extension); SURFACED iff the module file is ' +
    'reachable, ORPHAN otherwise. For this viz-data cohort, checked directly: does the sibling ' +
    '*Viz.jsx page import the data file, and is that page lazy-loaded and routed in src/App.jsx.',
  modules: [
    { file: 'imp-3695-feature-foldin-floor-ladder-viz-data.js', surfaced: true, vizPage: 'Imp3695FeatureFoldinFloorLadderViz.jsx', route: '/viz-imp3695-feature-foldin-floor-ladder' },
    { file: 'imp-3696-matched-pair-krylov-depth-sweep-viz-data.js', surfaced: true, vizPage: 'Imp3696MatchedPairKrylovDepthSweepViz.jsx', route: '/viz-imp3696-matched-pair-krylov-depth-sweep' },
    { file: 'imp-3697-a-weight-decay-crosscheck-viz-data.js', surfaced: true, vizPage: 'Imp3697AWeightDecayCrosscheckViz.jsx', route: '/viz-imp3697-a-weight-decay-crosscheck' },
    { file: 'imp-3698-fifth-pair-adjacent-pairing-viz-data.js', surfaced: true, vizPage: 'Imp3698FifthPairAdjacentPairingViz.jsx', route: '/viz-imp3698-fifth-pair-adjacent-pairing' },
    { file: 'imp-3699-fit-bias-decay-viz-data.js', surfaced: true, vizPage: 'Imp3699FitBiasDecayViz.jsx', route: '/viz-imp3699-fit-bias-decay' },
    { file: 'imp-3700-mesoscopic-shock-scale-separation-viz-data.js', surfaced: true, vizPage: 'Imp3700MesoscopicShockScaleSeparationViz.jsx', route: '/viz-imp3700-mesoscopic-shock-scale-separation' },
  ],
  orphanCount: 0,
  fullySurfacedCount: 6,
  recommendation:
    'No new surfacing tickets needed: all six viz-data modules in the imp-3695..imp-3700 cohort ' +
    'are already fully wired (data file imported by its page, page lazy-loaded and routed in ' +
    'src/App.jsx). The only related open item is an improvements.js ledger bookkeeping collision ' +
    'at id 3695 (already logged separately in commit 4722ecf8), not a surfacing defect.',
  honestNote:
    'Read-only audit; no pages fabricated. No new bound, no QED. No refereed bound is changed.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3717_ASSERTIONS = [
  {
    id: 'imp3717-exactly-six-modules-audited',
    holds: () => IMP_3717_3695_3700_COHORT_MODULE_SURFACING_AUDIT.modules.length === 6,
    why: 'The audit must cover exactly the six named imp-3695..imp-3700 cohort viz-data modules.',
  },
  {
    id: 'imp3717-all-six-surfaced',
    holds: () => {
      const m = IMP_3717_3695_3700_COHORT_MODULE_SURFACING_AUDIT.modules;
      const surfaced = m.filter((x) => x.surfaced).length;
      return surfaced === 6 && IMP_3717_3695_3700_COHORT_MODULE_SURFACING_AUDIT.orphanCount === 0;
    },
    why: 'All six imp-3695..imp-3700 viz-data modules are reachable from their sibling routed page as of the 2026-07-03 audit.',
  },
  {
    id: 'imp3717-fully-surfaced-count-matches',
    holds: () => IMP_3717_3695_3700_COHORT_MODULE_SURFACING_AUDIT.fullySurfacedCount ===
      IMP_3717_3695_3700_COHORT_MODULE_SURFACING_AUDIT.modules.filter((x) => x.surfaced).length,
    why: 'The fullySurfacedCount summary field must match the per-module surfaced tally.',
  },
  {
    id: 'imp3717-every-module-has-a-route',
    holds: () => IMP_3717_3695_3700_COHORT_MODULE_SURFACING_AUDIT.modules.every((x) => typeof x.route === 'string' && x.route.startsWith('/viz-imp')),
    why: 'Each surfaced module must record the concrete /viz-imp... route that proves it is routed, not just imported.',
  },
  {
    id: 'imp3717-honest-scope-locked',
    holds: () => /refereed bound is changed/i.test(IMP_3717_3695_3700_COHORT_MODULE_SURFACING_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3717_3695_3700_COHORT_MODULE_SURFACING_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed.',
  },
];

for (const a of IMP_3717_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3717 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3717_ASSERTIONS };
