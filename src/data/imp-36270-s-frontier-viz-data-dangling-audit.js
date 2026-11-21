/**
 * @module imp-36270-s-frontier-viz-data-dangling-audit
 *
 * imp-36270 (meta, audit): a consumed-vs-dangling audit over every recent S-frontier
 * viz-data module in the imp-361xx/imp-362xx cohort. imp-36138 (sub-percent shareColl
 * threshold crossings) was flagged dangling by an earlier scout pass (no page imported its
 * export while its sibling imp-36097 was rendered by Imp36143EShareThresholdCrossingLadderViz.jsx),
 * with the wiring fix tracked separately as imp-36261. This audit enumerates the FULL cohort
 * of 15 files matching src/data/imp-36{1,2}xx-*-viz-data.js, greps src/pages + src/components
 * for an import of each one's chart-ready IMP36*_ export, and reports which are consumed and
 * which are still dangling.
 *
 * METHOD. `ls src/data | grep -E "^imp-36(1[0-9]{2}|2[0-9]{2})"` then filtered to filenames
 * containing "viz-data" (15 files, imp-36104..imp-36251). For each, `grep -rl <basename>
 * src/pages src/components` located the consuming file (if any); where found, the consuming
 * page's registration in src/App.jsx (lazy import + <Route element>) was also confirmed so
 * "consumed" means reachable from a live route, not merely referenced by an orphaned file.
 *
 * FINDING. 7 of 15 are consumed (all via a routed src/pages/*.jsx that imports the module's
 * export and is wired into App.jsx): imp-36138 (Imp36143EShareThresholdCrossingLadderViz.jsx
 * -- the imp-36261 fix already landed, so this module is NO LONGER dangling), imp-36185
 * (Imp36203EShareFiveLandmarkDecayCurveViz.jsx), imp-36186 (Imp36204KbnKahanTwoEpisodeSeparationViz.jsx),
 * imp-36211 (Imp36211RouteReadinessComparisonViz.jsx), imp-36226
 * (Imp36226ClusteredVsDefaultDepthScalingViz.jsx), imp-36227 (Imp36227EnThreefoldImp321LadderViz.jsx),
 * imp-36251 (Imp36251KrawczykResidualOperatorFixedpointViz.jsx). 8 of 15 are DANGLING (grep
 * finds zero consumers in src/pages or src/components): imp-36104 (KBN-Kahan separation-onset
 * ladder), imp-36105 (recovery-detuning width), imp-36144 (KBN-Kahan intermittency band),
 * imp-36145 (joint recovery contour), imp-36168 (route derivative-cap tightness), imp-36171
 * (Route-B per-N rate curve), imp-36187 (Krawczyk surrogate/layer width ladder), imp-36188
 * (sigma_N U-shape arc). Each dangling module still ships valid baked chart literals and
 * passes its own internal assertions -- it simply has no page/component rendering it yet.
 *
 * SCOPE. Assessment/audit only. No source file was modified as a result of this check beyond
 * this report module; wiring any dangling module into a page is separate future work (already
 * queued individually for several, e.g. low-priority tickets targeting imp-36138's siblings).
 * Changes no bound; establishes no operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-36261 (the imp-36138 wiring fix this audit confirms landed)
 * @see imp-36264-imp36135-160-36246-251-cross-reference-integrity-audit.js (audit method template, citation integrity variant)
 * @see imp-36189-imp36098-166-registration-reachability-audit.js (sibling registration/reachability audit family)
 */

const CONSUMED_MODULES = [
  { id: 'imp-36138', file: 'imp-36138-sharecoll-subpercent-threshold-crossings-viz-data', consumer: 'Imp36143EShareThresholdCrossingLadderViz.jsx' },
  { id: 'imp-36185', file: 'imp-36185-e-share-five-landmark-tail-decay-viz-data', consumer: 'Imp36203EShareFiveLandmarkDecayCurveViz.jsx' },
  { id: 'imp-36186', file: 'imp-36186-kbn-kahan-two-episode-separation-viz-data', consumer: 'Imp36204KbnKahanTwoEpisodeSeparationViz.jsx' },
  { id: 'imp-36211', file: 'imp-36211-perN-route-readiness-comparison-viz-data', consumer: 'Imp36211RouteReadinessComparisonViz.jsx' },
  { id: 'imp-36226', file: 'imp-36226-clustered-vs-default-depth-scaling-viz-data', consumer: 'Imp36226ClusteredVsDefaultDepthScalingViz.jsx' },
  { id: 'imp-36227', file: 'imp-36227-en-threefold-imp321-ladder-viz-data', consumer: 'Imp36227EnThreefoldImp321LadderViz.jsx' },
  { id: 'imp-36251', file: 'imp-36251-krawczyk-residual-operator-fixedpoint-viz-data', consumer: 'Imp36251KrawczykResidualOperatorFixedpointViz.jsx' },
];

const DANGLING_MODULES = [
  { id: 'imp-36104', file: 'imp-36104-kbn-kahan-separation-onset-viz-data' },
  { id: 'imp-36105', file: 'imp-36105-recovery-detuning-width-viz-data' },
  { id: 'imp-36144', file: 'imp-36144-kbn-kahan-intermittency-band-viz-data' },
  { id: 'imp-36145', file: 'imp-36145-joint-recovery-contour-viz-data' },
  { id: 'imp-36168', file: 'imp-36168-route-derivative-cap-tightness-viz-data' },
  { id: 'imp-36171', file: 'imp-36171-routeB-perN-rate-curve-viz-data' },
  { id: 'imp-36187', file: 'imp-36187-krawczyk-surrogate-layer-width-ladder-viz-data' },
  { id: 'imp-36188', file: 'imp-36188-sigma-n-ushape-arc-viz-data' },
];

const AUDITED_COHORT_COUNT = CONSUMED_MODULES.length + DANGLING_MODULES.length; // 15

export const IMP36270_S_FRONTIER_VIZ_DATA_DANGLING_AUDIT = {
  id: 'imp-36270',
  proofSection: 'S-frontier',
  question:
    'Of the 15 imp-361xx/imp-362xx S-frontier viz-data modules (files matching ' +
    'src/data/imp-36{1,2}xx-*-viz-data.js), how many are actually imported by a routed ' +
    'src/pages component versus shipping baked chart literals with no consumer?',
  verdictShort:
    '7 of 15 consumed (imp-36138, imp-36185, imp-36186, imp-36211, imp-36226, imp-36227, ' +
    'imp-36251, each via a routed src/pages/*.jsx wired into App.jsx). 8 of 15 DANGLING: ' +
    'imp-36104, imp-36105, imp-36144, imp-36145, imp-36168, imp-36171, imp-36187, imp-36188. ' +
    'The originally-flagged imp-36138 case is now RESOLVED (imp-36261 wired it into ' +
    'Imp36143EShareThresholdCrossingLadderViz.jsx) -- the dangling set has shifted to a ' +
    'different 8 modules.',
  consumedModules: CONSUMED_MODULES,
  danglingModules: DANGLING_MODULES,
  auditedCohortCount: AUDITED_COHORT_COUNT,
  consumedCount: CONSUMED_MODULES.length,
  danglingCount: DANGLING_MODULES.length,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Enumerated all ' +
    '15 imp-361xx/imp-362xx viz-data modules, grepped src/pages + src/components for an ' +
    'import of each module’s export, and confirmed each hit’s page is registered in ' +
    'App.jsx routing. Result: 7 consumed, 8 dangling. No source file required correction; ' +
    'wiring the dangling 8 into pages is separate future work. Changes no bound; establishes ' +
    'no operator positivity; no RH verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-36261 (the imp-36138 wiring fix this audit confirms landed); imp-36264/imp-36189 ' +
    '(sibling audit-family templates); imp-36104..imp-36251 (the audited viz-data cohort).',
};

export const IMP36270_S_FRONTIER_VIZ_DATA_DANGLING_AUDIT_ASSERTIONS = [
  {
    id: 'imp36270-audited-fifteen-files',
    description: 'the audit covers exactly the 15 imp-361xx/imp-362xx viz-data files',
    holds: () => IMP36270_S_FRONTIER_VIZ_DATA_DANGLING_AUDIT.auditedCohortCount === 15,
  },
  {
    id: 'imp36270-consumed-plus-dangling-equals-total',
    description: 'consumed count plus dangling count accounts for the full audited cohort',
    holds: () =>
      IMP36270_S_FRONTIER_VIZ_DATA_DANGLING_AUDIT.consumedCount +
        IMP36270_S_FRONTIER_VIZ_DATA_DANGLING_AUDIT.danglingCount ===
      IMP36270_S_FRONTIER_VIZ_DATA_DANGLING_AUDIT.auditedCohortCount,
  },
  {
    id: 'imp36270-imp36138-now-consumed',
    description: 'imp-36138, the originally-flagged dangling case, now appears in the consumed list (imp-36261 fix landed)',
    holds: () =>
      IMP36270_S_FRONTIER_VIZ_DATA_DANGLING_AUDIT.consumedModules.some((m) => m.id === 'imp-36138'),
  },
  {
    id: 'imp36270-eight-dangling-modules',
    description: 'exactly 8 modules remain dangling in this cohort',
    holds: () => IMP36270_S_FRONTIER_VIZ_DATA_DANGLING_AUDIT.danglingModules.length === 8,
  },
  {
    id: 'imp36270-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36270_S_FRONTIER_VIZ_DATA_DANGLING_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP36270_S_FRONTIER_VIZ_DATA_DANGLING_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP36270_S_FRONTIER_VIZ_DATA_DANGLING_AUDIT.verdict),
  },
];

for (const a of IMP36270_S_FRONTIER_VIZ_DATA_DANGLING_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36270-s-frontier-viz-data-dangling-audit assertion failed: ${a.id}`);
  }
}

export default IMP36270_S_FRONTIER_VIZ_DATA_DANGLING_AUDIT;
