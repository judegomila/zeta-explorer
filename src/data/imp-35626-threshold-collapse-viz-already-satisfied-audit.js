/**
 * @module imp-35626-threshold-collapse-viz-already-satisfied-audit
 *
 * imp-35626 (ux, audit): the ticket asked to "build an import-light viz-data
 * module + page for the imp-35571 route-(i) subleading-rate THRESHOLD-COLLAPSE
 * curve" -- plotting the required log T0 threshold as a function of the
 * poly-log exponent a (log T0 >= 200^(1/a)) and the power-law rate delta
 * (log T0 >= 5.2983/delta) against the landmark log-heights (peak ~13.23,
 * crossover ~20.86, T_PT ~28.73), with a scoping-only banner.
 *
 * FINDING. This module + page ALREADY EXISTS. src/data/imp-35597-threshold-
 * collapse-viz-data.js re-exports the imp-35571 CANDIDATES table and landmark
 * log-heights, and adds two dense curve series (poly-log a in [1,4], power-law
 * delta in [0.1,2]) for plotting -- exactly the threshold-collapse curve this
 * ticket requests. src/pages/Imp35597ThresholdCollapseViz.jsx consumes it, is
 * lazy-imported and routed at "/viz-imp35597-threshold-collapse" in
 * src/App.jsx, and is registered with a full entry (title, oneLine,
 * mathBucket, dataModule, paperSourcePath, ticket) in
 * src/data/visualizations-index.js so it is also reachable via the
 * /visualizations index page. git log confirms it was added by the imp-35597
 * commit (2026-07-15T08:27:25-07:00), well before imp-35626 reached the
 * sonnet queue.
 *
 * DISPOSITION. No new viz-data module or page built in this ticket: imp-35597
 * already discharged this exact requirement. This module records the
 * duplicate-ticket finding so the completed status is auditable. Changes no
 * bound; establishes no operator positivity; no RH verdict; NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35597-threshold-collapse-viz-data.js (the pre-existing module this ticket duplicates)
 * @see src/pages/Imp35597ThresholdCollapseViz.jsx (the pre-existing page)
 * @see imp-35571-route-i-subleading-rate-scope.js (the underlying scoping assessment both cite)
 */

export const IMP35626_THRESHOLD_COLLAPSE_VIZ_ALREADY_SATISFIED_AUDIT = {
  id: 'imp-35626',
  proofSection: 'audit',
  auditedArtifacts: {
    dataModule: 'src/data/imp-35597-threshold-collapse-viz-data.js',
    page: 'src/pages/Imp35597ThresholdCollapseViz.jsx',
    route: '/viz-imp35597-threshold-collapse',
    registeredInVisualizationsIndex: true,
    routedInAppJsx: true,
  },
  question:
    'Does a viz-data module + page for the imp-35571 route-(i) subleading-rate ' +
    'threshold-collapse curve already exist, or does this ticket still need to build one?',
  finding:
    'ALREADY SATISFIED. src/data/imp-35597-threshold-collapse-viz-data.js re-exports the ' +
    'imp-35571 CANDIDATES table and landmark log-heights (peak ~13.2309, crossover ~20.8576, ' +
    'T_PT ~28.7296, leading-rate baseline 200) and adds dense poly-log (a in [1,4]) and ' +
    'power-law (delta in [0.1,2]) curve series. src/pages/Imp35597ThresholdCollapseViz.jsx ' +
    'consumes it, is lazy-imported and routed in src/App.jsx at ' +
    '/viz-imp35597-threshold-collapse, and carries a complete entry in ' +
    'src/data/visualizations-index.js -- reachable both by direct route and via the ' +
    '/visualizations index page. Every requirement imp-35626 names (threshold-collapse curve, ' +
    'landmark markers, scoping-only banner, import-light source) is already built and shipped.',
  priorFixingCommitTitle:
    'imp-35597 (ux, sonnet-4-6, sonnet): viz-data module + page for the imp-35571 route-(i) ' +
    'threshold-collapse curve',
  duplicateOf: 'imp-35597',
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). imp-35626 ' +
    'duplicates work already completed by imp-35597; no further module or page build needed. ' +
    'Changes no bound; establishes no operator positivity; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35597 (git commit that already built this module + page); imp-35571 (the underlying ' +
    'subleading-rate scoping assessment); imp-35538 (REQ-4 log T0 >= 200 threshold this curve ' +
    'probes).',
};

export const IMP35626_THRESHOLD_COLLAPSE_VIZ_ALREADY_SATISFIED_AUDIT_ASSERTIONS = [
  {
    id: 'imp35626-audited-artifacts-identified',
    description: 'the audited data module, page, and route are named explicitly',
    holds: () =>
      IMP35626_THRESHOLD_COLLAPSE_VIZ_ALREADY_SATISFIED_AUDIT.auditedArtifacts.dataModule ===
        'src/data/imp-35597-threshold-collapse-viz-data.js' &&
      IMP35626_THRESHOLD_COLLAPSE_VIZ_ALREADY_SATISFIED_AUDIT.auditedArtifacts.page ===
        'src/pages/Imp35597ThresholdCollapseViz.jsx' &&
      IMP35626_THRESHOLD_COLLAPSE_VIZ_ALREADY_SATISFIED_AUDIT.auditedArtifacts.route ===
        '/viz-imp35597-threshold-collapse',
  },
  {
    id: 'imp35626-reachability-recorded',
    description: 'both routing and visualizations-index registration are recorded as true',
    holds: () =>
      IMP35626_THRESHOLD_COLLAPSE_VIZ_ALREADY_SATISFIED_AUDIT.auditedArtifacts
        .registeredInVisualizationsIndex === true &&
      IMP35626_THRESHOLD_COLLAPSE_VIZ_ALREADY_SATISFIED_AUDIT.auditedArtifacts.routedInAppJsx ===
        true,
  },
  {
    id: 'imp35626-duplicate-of-imp35597-recorded',
    description: 'the ticket that already discharged this requirement is recorded',
    holds: () => IMP35626_THRESHOLD_COLLAPSE_VIZ_ALREADY_SATISFIED_AUDIT.duplicateOf === 'imp-35597',
  },
  {
    id: 'imp35626-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35626_THRESHOLD_COLLAPSE_VIZ_ALREADY_SATISFIED_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35626_THRESHOLD_COLLAPSE_VIZ_ALREADY_SATISFIED_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35626_THRESHOLD_COLLAPSE_VIZ_ALREADY_SATISFIED_AUDIT.verdict),
  },
];

for (const a of IMP35626_THRESHOLD_COLLAPSE_VIZ_ALREADY_SATISFIED_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35626-threshold-collapse-viz-already-satisfied-audit assertion failed: ${a.id}`);
  }
}

export default IMP35626_THRESHOLD_COLLAPSE_VIZ_ALREADY_SATISFIED_AUDIT;
