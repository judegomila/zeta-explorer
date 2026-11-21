/**
 * @module imp-35627-peak-damping-viz-already-satisfied-audit
 *
 * imp-35627 (ux, audit): the ticket asked to "build an import-light viz-data
 * module + page for the imp-35574 landmark log-damping comparison" -- a
 * two-bar/scatter view of the E_coll=E_trunc crossover (raw gap ~18% -> shift
 * ~0.98%, damping ~18x) vs the interior sigma-peak LOCATION (raw gap ~24% ->
 * shift +43.99%, damping ~0.55 AMPLIFIED), making the ~32x damping contrast
 * visible, with a measurement-only banner.
 *
 * FINDING. This module + page ALREADY EXISTS. src/data/imp-35593-peak-damping-
 * viz-data.js re-exports the imp-35574 peak / rawHeightGapAtPeak /
 * dampingComparison fields verbatim and forms paired-bar series for the
 * raw-height gap, relative landmark shift, and damping factor at both
 * landmarks, plus the ~32.55x crossover-vs-peak readout -- exactly the
 * comparison this ticket requests. src/pages/Imp35593PeakDampingViz.jsx
 * consumes it, is lazy-imported and routed at "/viz-imp35593-peak-damping"
 * in src/App.jsx, and is registered with a full entry (title, oneLine,
 * mathBucket, dataModule, paperSourcePath, ticket, pedagogicalStep 91) in
 * src/data/visualizations-index.js so it is also reachable via the
 * /visualizations index page. The page's closing banner already states the
 * measurement-only disposition (no new derivation, imp-35337a sub-gap OPEN,
 * C_C/E_trunc UNTOUCHED, no operator positivity, no RH verdict, NO QED). git
 * log confirms imp-35593 was added at 2026-07-15T08:16:03-07:00, before
 * imp-35627 reached the sonnet queue.
 *
 * DISPOSITION. No new viz-data module or page built in this ticket: imp-35593
 * already discharged this exact requirement. This module records the
 * duplicate-ticket finding so the completed status is auditable. Changes no
 * bound; establishes no operator positivity; no RH verdict; NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35593-peak-damping-viz-data.js (the pre-existing module this ticket duplicates)
 * @see src/pages/Imp35593PeakDampingViz.jsx (the pre-existing page)
 * @see imp-35574-peak-location-height-map-damping.js (the underlying measurement both cite)
 */

export const IMP35627_PEAK_DAMPING_VIZ_ALREADY_SATISFIED_AUDIT = {
  id: 'imp-35627',
  proofSection: 'audit',
  auditedArtifacts: {
    dataModule: 'src/data/imp-35593-peak-damping-viz-data.js',
    page: 'src/pages/Imp35593PeakDampingViz.jsx',
    route: '/viz-imp35593-peak-damping',
    registeredInVisualizationsIndex: true,
    routedInAppJsx: true,
  },
  question:
    'Does a viz-data module + page for the imp-35574 landmark log-damping comparison ' +
    '(crossover ~18x damping vs peak-location ~0.55 amplification) already exist, or does ' +
    'this ticket still need to build one?',
  finding:
    'ALREADY SATISFIED. src/data/imp-35593-peak-damping-viz-data.js re-exports the imp-35574 ' +
    'peak, rawHeightGapAtPeak, and dampingComparison fields verbatim and builds paired-bar ' +
    'series (raw-height gap, relative landmark shift, damping factor) contrasting the peak ' +
    'location against the crossover, plus the ~32.55x crossover-vs-peak readout. ' +
    'src/pages/Imp35593PeakDampingViz.jsx consumes it, is lazy-imported and routed in ' +
    'src/App.jsx at /viz-imp35593-peak-damping, and carries a complete entry in ' +
    'src/data/visualizations-index.js -- reachable both by direct route and via the ' +
    '/visualizations index page. Every requirement imp-35627 names (paired-bar landmark ' +
    'comparison, ~32x damping contrast, measurement-only banner, import-light source) is ' +
    'already built and shipped.',
  priorFixingCommitTitle:
    'imp-35593 (ux, sonnet-4-6, sonnet): viz-data module + page for the imp-35574 peak-LOCATION ' +
    'vs crossover height-map damping comparison',
  duplicateOf: 'imp-35593',
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). imp-35627 ' +
    'duplicates work already completed by imp-35593; no further module or page build needed. ' +
    'Changes no bound; establishes no operator positivity; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35593 (git commit that already built this module + page); imp-35574 (the underlying ' +
    'peak-location vs crossover height-map damping measurement); imp-35458 (the ~18x crossover ' +
    'damping factor mirrored there).',
};

export const IMP35627_PEAK_DAMPING_VIZ_ALREADY_SATISFIED_AUDIT_ASSERTIONS = [
  {
    id: 'imp35627-audited-artifacts-identified',
    description: 'the audited data module, page, and route are named explicitly',
    holds: () =>
      IMP35627_PEAK_DAMPING_VIZ_ALREADY_SATISFIED_AUDIT.auditedArtifacts.dataModule ===
        'src/data/imp-35593-peak-damping-viz-data.js' &&
      IMP35627_PEAK_DAMPING_VIZ_ALREADY_SATISFIED_AUDIT.auditedArtifacts.page ===
        'src/pages/Imp35593PeakDampingViz.jsx' &&
      IMP35627_PEAK_DAMPING_VIZ_ALREADY_SATISFIED_AUDIT.auditedArtifacts.route ===
        '/viz-imp35593-peak-damping',
  },
  {
    id: 'imp35627-reachability-recorded',
    description: 'both routing and visualizations-index registration are recorded as true',
    holds: () =>
      IMP35627_PEAK_DAMPING_VIZ_ALREADY_SATISFIED_AUDIT.auditedArtifacts
        .registeredInVisualizationsIndex === true &&
      IMP35627_PEAK_DAMPING_VIZ_ALREADY_SATISFIED_AUDIT.auditedArtifacts.routedInAppJsx === true,
  },
  {
    id: 'imp35627-duplicate-of-imp35593-recorded',
    description: 'the ticket that already discharged this requirement is recorded',
    holds: () => IMP35627_PEAK_DAMPING_VIZ_ALREADY_SATISFIED_AUDIT.duplicateOf === 'imp-35593',
  },
  {
    id: 'imp35627-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35627_PEAK_DAMPING_VIZ_ALREADY_SATISFIED_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35627_PEAK_DAMPING_VIZ_ALREADY_SATISFIED_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35627_PEAK_DAMPING_VIZ_ALREADY_SATISFIED_AUDIT.verdict),
  },
];

for (const a of IMP35627_PEAK_DAMPING_VIZ_ALREADY_SATISFIED_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35627-peak-damping-viz-already-satisfied-audit assertion failed: ${a.id}`);
  }
}

export default IMP35627_PEAK_DAMPING_VIZ_ALREADY_SATISFIED_AUDIT;
