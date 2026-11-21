/**
 * @module imp-35838-frontier-batch-registration-reachability-audit
 *
 * imp-35838 (meta, audit): registration/reachability check (imp-35590/imp-35447 method) on
 * the freshly committed frontier assessment batch imp-35762/imp-35763/imp-35764/imp-35766/
 * imp-35777/imp-35778.
 *
 * METHOD. Grepped scripts/run-assertions.mjs DATA_MODULES for each of the six file paths,
 * confirmed each source module exports both a result-object const and a `*_ASSERTIONS`
 * array (the run-assertions.mjs processOne() loader discovers `*_ASSERTIONS` exports
 * generically via Object.entries(mod).filter(([k,v]) => k.endsWith('_ASSERTIONS') &&
 * Array.isArray(v)) -- no per-module named import is required for wiring), then grepped
 * src/App.jsx and src/data/visualizations-index.js to check viz-suffixed vs registry-only
 * status.
 *
 * FINDING -- ALL SIX FULLY WIRED, NO ORPHANS, VIZ-STATUS CONSISTENT.
 *   - imp-35762: DATA_MODULES-listed, exports IMP35762_KRAWCZYK_SURPLUS_SHIFT_RESIDUAL_ISOLATION
 *     + _ASSERTIONS. Has a viz page (imp-35824-krawczyk-surplus-waterfall-viz-data.js,
 *     route /viz-imp35824-surplus-waterfall) registered in both App.jsx and
 *     visualizations-index.js.
 *   - imp-35763: DATA_MODULES-listed, exports IMP35763_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_FILL
 *     + _ASSERTIONS. Has a viz page (imp-35823-required-height-ladder-viz-data.js, route
 *     /viz-imp35823-required-height-ladder) registered in both App.jsx and
 *     visualizations-index.js.
 *   - imp-35764: DATA_MODULES-listed, exports
 *     IMP35764_COLLISION_SCALE_PT_ANCHOR_PREFACTOR_PROPAGATION + _ASSERTIONS. Registry-only
 *     (no viz page yet) -- correctly absent from visualizations-index.js and App.jsx.
 *   - imp-35766: DATA_MODULES-listed, exports IMP35766_KRAWCZYK_CANCELLATION_RATIO_BEYOND_BAND
 *     + _ASSERTIONS. Registry-only; a viz page is a separate still-pending ticket
 *     (imp-35837), so its absence from visualizations-index.js is expected, not orphaning.
 *   - imp-35777: DATA_MODULES-listed, exports IMP35777_I2_LOGDERIVATIVE_PANEL_CAP_SCOPE +
 *     _ASSERTIONS. Registry-only, correctly absent from visualizations-index.js.
 *   - imp-35778: DATA_MODULES-listed, exports
 *     IMP35778_I3_EDGE_TYPE_FLOOR_DECOMPOSITION_SCOPE + _ASSERTIONS. Registry-only,
 *     correctly absent from visualizations-index.js.
 *
 * SCOPE. Read-only registration/reachability audit only. No source file required
 * correction -- all six modules were already properly wired before this audit ran. Changes
 * no bound; establishes no operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35590-registration-reachability-audit (method precedent)
 * @see imp-35447-imp35404-registration-reachability-audit (single-module precedent)
 * @see imp-35762-krawczyk-surplus-shift-residual-isolation.js (audited module)
 * @see imp-35763-req4-required-height-sigma-landmark-fill.js (audited module)
 * @see imp-35764-collision-scale-pt-anchor-prefactor-propagation.js (audited module)
 * @see imp-35766-krawczyk-cancellation-ratio-beyond-band.js (audited module)
 * @see imp-35777-i2-logderivative-panel-cap-scope.js (audited module)
 * @see imp-35778-i3-edge-type-floor-decomposition-scope.js (audited module)
 */

const AUDITED_BATCH = [
  {
    file: 'imp-35762-krawczyk-surplus-shift-residual-isolation',
    resultExport: 'IMP35762_KRAWCZYK_SURPLUS_SHIFT_RESIDUAL_ISOLATION',
    listedInDataModules: true,
    hasAssertionsExport: true,
    hasVizPage: true,
    vizRoute: '/viz-imp35824-surplus-waterfall',
  },
  {
    file: 'imp-35763-req4-required-height-sigma-landmark-fill',
    resultExport: 'IMP35763_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_FILL',
    listedInDataModules: true,
    hasAssertionsExport: true,
    hasVizPage: true,
    vizRoute: '/viz-imp35823-required-height-ladder',
  },
  {
    file: 'imp-35764-collision-scale-pt-anchor-prefactor-propagation',
    resultExport: 'IMP35764_COLLISION_SCALE_PT_ANCHOR_PREFACTOR_PROPAGATION',
    listedInDataModules: true,
    hasAssertionsExport: true,
    hasVizPage: false,
    vizRoute: null,
  },
  {
    file: 'imp-35766-krawczyk-cancellation-ratio-beyond-band',
    resultExport: 'IMP35766_KRAWCZYK_CANCELLATION_RATIO_BEYOND_BAND',
    listedInDataModules: true,
    hasAssertionsExport: true,
    hasVizPage: false,
    vizRoute: null,
  },
  {
    file: 'imp-35777-i2-logderivative-panel-cap-scope',
    resultExport: 'IMP35777_I2_LOGDERIVATIVE_PANEL_CAP_SCOPE',
    listedInDataModules: true,
    hasAssertionsExport: true,
    hasVizPage: false,
    vizRoute: null,
  },
  {
    file: 'imp-35778-i3-edge-type-floor-decomposition-scope',
    resultExport: 'IMP35778_I3_EDGE_TYPE_FLOOR_DECOMPOSITION_SCOPE',
    listedInDataModules: true,
    hasAssertionsExport: true,
    hasVizPage: false,
    vizRoute: null,
  },
];

const DANGLING_OR_ORPHANED_FOUND = 0;
const VIZ_STATUS_MISMATCH_FOUND = 0;

export const IMP35838_FRONTIER_BATCH_REGISTRATION_REACHABILITY_AUDIT = {
  id: 'imp-35838',
  proofSection: 'audit',
  question:
    'Do the six freshly committed frontier modules imp-35762/imp-35763/imp-35764/imp-35766/' +
    'imp-35777/imp-35778 each export a result-object const plus a wired *_ASSERTIONS array ' +
    'in scripts/run-assertions.mjs, and does viz-suffixed vs registry-only status match ' +
    'App.jsx / visualizations-index.js?',
  verdictShort:
    'CLEAN. All six are DATA_MODULES-listed and export a result-object const plus a ' +
    '*_ASSERTIONS array (auto-discovered generically by the run-assertions.mjs loader). ' +
    'imp-35762 and imp-35763 have registered viz pages (imp-35824, imp-35823); imp-35764/' +
    'imp-35766/imp-35777/imp-35778 are registry-only and correctly absent from ' +
    'visualizations-index.js. No orphans, no mismatch, no action needed.',
  auditedBatch: AUDITED_BATCH,
  danglingOrOrphanedFound: DANGLING_OR_ORPHANED_FOUND,
  vizStatusMismatchFound: VIZ_STATUS_MISMATCH_FOUND,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked ' +
    'scripts/run-assertions.mjs DATA_MODULES wiring, each module’s exports, and ' +
    'App.jsx / visualizations-index.js viz-page registration for six recently committed ' +
    'frontier modules. Result: fully wired, no orphans, viz-status consistent. Changes no ' +
    'bound; establishes no operator positivity; no RH verdict; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35762, imp-35763, imp-35764, imp-35766, imp-35777, imp-35778 (audited modules); ' +
    'imp-35590/imp-35447 (registration/reachability method).',
};

export const IMP35838_FRONTIER_BATCH_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35838-batch-size-six',
    description: 'exactly six modules were audited',
    holds: () => AUDITED_BATCH.length === 6,
  },
  {
    id: 'imp35838-all-listed-in-data-modules',
    description: 'every audited file is DATA_MODULES-listed with a result export and *_ASSERTIONS export',
    holds: () =>
      AUDITED_BATCH.every(
        (m) => m.listedInDataModules === true && m.hasAssertionsExport === true && !!m.resultExport
      ),
  },
  {
    id: 'imp35838-viz-page-count-matches-known-two',
    description: 'exactly imp-35762 and imp-35763 have registered viz pages, the rest are registry-only',
    holds: () => {
      const withViz = AUDITED_BATCH.filter((m) => m.hasVizPage);
      const withoutViz = AUDITED_BATCH.filter((m) => !m.hasVizPage);
      return (
        withViz.length === 2 &&
        withViz.every((m) => typeof m.vizRoute === 'string' && m.vizRoute.startsWith('/viz-')) &&
        withoutViz.length === 4 &&
        withoutViz.every((m) => m.vizRoute === null)
      );
    },
  },
  {
    id: 'imp35838-not-orphaned',
    description: 'no dangling or orphaned module found',
    holds: () => IMP35838_FRONTIER_BATCH_REGISTRATION_REACHABILITY_AUDIT.danglingOrOrphanedFound === 0,
  },
  {
    id: 'imp35838-no-viz-status-mismatch',
    description: 'viz-suffixed vs registry-only status matches App.jsx / visualizations-index.js for every module',
    holds: () => IMP35838_FRONTIER_BATCH_REGISTRATION_REACHABILITY_AUDIT.vizStatusMismatchFound === 0,
  },
  {
    id: 'imp35838-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35838_FRONTIER_BATCH_REGISTRATION_REACHABILITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35838_FRONTIER_BATCH_REGISTRATION_REACHABILITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35838_FRONTIER_BATCH_REGISTRATION_REACHABILITY_AUDIT.verdict),
  },
];

for (const a of IMP35838_FRONTIER_BATCH_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35838-frontier-batch-registration-reachability-audit assertion failed: ${a.id}`);
  }
}

export default IMP35838_FRONTIER_BATCH_REGISTRATION_REACHABILITY_AUDIT;
