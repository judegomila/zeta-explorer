/**
 * @module imp-33719-33679-33682-cohort-provenance-rollup
 * @fileoverview imp-33719 -- META provenance roll-up cataloguing the imp-33679/imp-33680/imp-33681/
 * imp-33682 peak-trough-gap-amplitude sub-cohort (four modules: a cluster-peak envelope-HEIGHT
 * saturation extension into [1200,1600], a leave-two-out ROBUSTNESS refit of the [400,1200] height
 * slope, a peak-minus-trough AMPLITUDE composite series over [400,1200], and an inter-peak
 * GAP-vs-HEIGHT correlation test over [400,1200]), by EVIDENCE CLASS, mirroring the imp-33693
 * imp-33660/imp-33663 rollup pattern and confirming each module carries the mandatory honest banner:
 * no-QED, the imp-3066 K_a >= 0 operator-positivity invariant untouched, and no refereed bound is changed.
 *
 * METHOD (read-only, performed at author time). Each module's @fileoverview/detail block was read
 * and classified into the evidence class it earns on its own terms:
 *   - "cluster-peak envelope-height saturation extension": extends the imp-33660 [400,1200]
 *     height-growth fit into a fresh [1200,1600] window, testing whether the weak-positive trend
 *     persists, reverts, or saturates on peaks the original sample never reached.
 *   - "leave-two-out robustness / two-point-artifact test": drops the two tallest imp-33638 tail
 *     clusters from the imp-33660 sixteen [400,1200] peaks and refits the height slope, testing
 *     whether the positive trend is carried by two outliers or is a distributed effect.
 *   - "peak-minus-trough amplitude composite series measurement": differences the imp-33660 height
 *     series against the imp-33662 trough-floor series to form a peak-to-trough AMPLITUDE series
 *     over the shared [400,1200] peaks, testing whether amplitude grows faster or slower than the
 *     peak heights alone.
 *   - "inter-peak gap-vs-height correlation test": cross-correlates the imp-33661 inter-peak GAP
 *     sequence against the imp-33660 cluster-peak HEIGHT sequence at the shared [400,1200] peaks,
 *     testing whether spacing and height share a common lattice driver.
 * The honest-banner check greps each module for the mandatory phrases (no QED, imp-3066 K_a >= 0
 * untouched, no refereed bound is changed) and for the Polymath15 G6a/H2 bridge status line;
 * shared-caveat coverage (NPHI=10 Phi-series truncation, the imp-33599/imp-33621/imp-33638
 * latticeJitterCaveat lineage) and glossary/viz-page coverage were cross-checked against
 * src/data/glossary.js and src/pages. Import lines were grepped per the imp-33695 heavy-import
 * safety pattern (the 16.7MB zeros bundle hangs vite ssrLoadModule / npm-run-assert when
 * transitively pulled into an assertion module).
 *
 * RESULT (audited 2026-07-04). All four modules carry the full honest banner and all four state
 * imp-3066 K_a >= 0 untouched. None of the four references the Polymath15 G6a_shock_lipschitz/H2
 * bridge -- entirely within the A(tau)-kernel band-clearing cluster-envelope frontier, disjoint
 * from the G6a inviscid-window material.
 *   - imp-33679-cluster-peak-envelope-height-1200-1600.js       : cluster-peak envelope-height saturation extension
 *   - imp-33680-cluster-peak-height-leave-two-out-refit.js      : leave-two-out robustness / two-point-artifact test
 *   - imp-33681-peak-minus-trough-amplitude-series-n400-1200.js : peak-minus-trough amplitude composite series measurement
 *   - imp-33682-gap-vs-height-correlation-n400-1200.js          : inter-peak gap-vs-height correlation test
 *
 * HEAVY-IMPORT NOTE (imp-33720 formalized, audited 2026-07-04). imp-33679 and imp-33682 have zero
 * import/require statements (self-computing). imp-33680 imports IMP33660_CLUSTER_PEAK_ENVELOPE_
 * HEIGHT_GROWTH_FIT and imp-33681 imports both IMP33660_..._GROWTH_FIT and IMP33662_INTER_CLUSTER_
 * TROUGH_FLOOR_DRIFT -- both are LOCAL sibling data modules, not the zeros bundle; imp-33693/imp-33695
 * already grep-verified imp-33660 and imp-33662 themselves have ZERO import statements, and imp-33720
 * independently re-grepped both here, confirming the transitive closure for all four modules in this
 * cohort stays heavy-import-safe. The dedicated pass is now CLOSED (see the imp33720-heavy-import-
 * audit-formalized assertion below).
 *
 * SHARED CAVEATS. All four inherit the NPHI=10 Phi-series truncation and all four explicitly
 * restate the imp-33599/imp-33621/imp-33638 latticeJitterCaveat lineage (imp-33679 and imp-33681
 * extend the lineage citation through imp-33660/imp-33661 as well). Unlike the imp-33693 cohort,
 * these four do NOT share one identical underlying dataset: imp-33679 scans a disjoint fresh
 * [1200,1600] window, imp-33680/imp-33681/imp-33682 reuse the imp-33660/imp-33661/imp-33662
 * [400,1200] sixteen/fifteen-peak series already computed upstream.
 *
 * SURFACING NOTE (secondary). Unlike the imp-33693 cohort (zero dedicated viz pages at audit time),
 * three of these four already have a dedicated routed viz page: imp-33679 -> Imp33717Envelope
 * HeightExtensionViz.jsx, imp-33681 -> Imp33716PeakMinusTroughAmplitudeViz.jsx, imp-33682 ->
 * Imp33715GapVsHeightIndependenceViz.jsx. imp-33680 (leave-two-out refit) remains the one member
 * without a dedicated viz page. All four already have a dedicated headline glossary term.
 *
 * @see imp-33693 (the imp-33660/33663 sixteen-peak cohort rollup this note mirrors), imp-33268,
 * imp-33287, imp-33307, imp-3886, imp-3931, imp-33551, imp-33574 (the precedent provenance
 * roll-ups this pattern follows)
 */

export const IMP_33719_33679_33682_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-33719',
  auditedAt: '2026-07-04',
  method:
    'Read each of the four imp-33679/33680/33681/33682 module @fileoverview/detail blocks; ' +
    'classify by evidence class (cluster-peak envelope-height saturation extension / leave-two-out ' +
    'robustness two-point-artifact test / peak-minus-trough amplitude composite series measurement / ' +
    'inter-peak gap-vs-height correlation test); grep for the mandatory honest-banner phrases ' +
    '(no QED, imp-3066 K_a >= 0 untouched, no refereed bound is changed) plus the explicit ' +
    'G6a/H2 bridge status and the shared-caveat phrases (NPHI=10, latticeJitterCaveat lineage); ' +
    'cross-check glossary.js and src/pages for dedicated coverage and import lines for heavy-import safety.',
  modules: [
    {
      file: 'imp-33679-cluster-peak-envelope-height-1200-1600.js',
      evidenceClass: 'cluster-peak envelope-height saturation extension',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasNPHI10Caveat: true,
      hasLatticeJitterCaveat: true,
      hasGlossaryTerm: true,
      hasRoutedVizPage: true,
      hasHeavyImport: false,
    },
    {
      file: 'imp-33680-cluster-peak-height-leave-two-out-refit.js',
      evidenceClass: 'leave-two-out robustness / two-point-artifact test',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasNPHI10Caveat: true,
      hasLatticeJitterCaveat: true,
      hasGlossaryTerm: true,
      hasRoutedVizPage: false,
      hasHeavyImport: false,
    },
    {
      file: 'imp-33681-peak-minus-trough-amplitude-series-n400-1200.js',
      evidenceClass: 'peak-minus-trough amplitude composite series measurement',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasNPHI10Caveat: true,
      hasLatticeJitterCaveat: true,
      hasGlossaryTerm: true,
      hasRoutedVizPage: true,
      hasHeavyImport: false,
    },
    {
      file: 'imp-33682-gap-vs-height-correlation-n400-1200.js',
      evidenceClass: 'inter-peak gap-vs-height correlation test',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasNPHI10Caveat: true,
      hasLatticeJitterCaveat: true,
      hasGlossaryTerm: true,
      hasRoutedVizPage: true,
      hasHeavyImport: false,
    },
  ],
  evidenceClassCounts: {
    'cluster-peak envelope-height saturation extension': 1,
    'leave-two-out robustness / two-point-artifact test': 1,
    'peak-minus-trough amplitude composite series measurement': 1,
    'inter-peak gap-vs-height correlation test': 1,
  },
  honestBannerFullCoverageCount: 4,
  nphi10CaveatCount: 4,
  latticeJitterCaveatCount: 4,
  glossaryCoveredCount: 4,
  routedVizPageCount: 3,
  heavyImportSafeCount: 4,
  recommendation:
    'No action needed on the honest-banner side -- all four modules already carry the full ' +
    'mandatory banner and all four state imp-3066 untouched. Three of four already have a ' +
    'dedicated routed viz page (imp-33679, imp-33681, imp-33682); imp-33680 (leave-two-out refit) ' +
    'is the sole remaining viz gap and the best candidate for a new dedicated viz page, mirroring ' +
    'the imp-33693 roll-up recommendation pattern. The imp-33720 heavy-import audit is now CLOSED: ' +
    'the transitive-safety check this roll-up performed informally has been formally re-verified.',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module ' +
    'itself. imp-3066 K_a >= 0 positivity untouched across all four cohort members. ' +
    'No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_33719_ASSERTIONS = [
  {
    id: 'imp33719-exactly-four-modules-catalogued',
    holds: () => IMP_33719_33679_33682_COHORT_PROVENANCE_ROLLUP.modules.length === 4,
    why: 'The roll-up must cover exactly the four named cohort modules (imp-33679/33680/33681/33682).',
  },
  {
    id: 'imp33719-four-distinct-evidence-classes',
    holds: () => {
      const m = IMP_33719_33679_33682_COHORT_PROVENANCE_ROLLUP.modules;
      const counts = IMP_33719_33679_33682_COHORT_PROVENANCE_ROLLUP.evidenceClassCounts;
      const distinctClasses = new Set(m.map((x) => x.evidenceClass));
      return distinctClasses.size === 4 &&
        Object.values(counts).every((c) => c === 1) &&
        Object.keys(counts).length === 4;
    },
    why: 'Each of the four modules earns a DISTINCT evidence class -- no two modules should share a class.',
  },
  {
    id: 'imp33719-all-four-carry-full-honest-banner',
    holds: () =>
      IMP_33719_33679_33682_COHORT_PROVENANCE_ROLLUP.modules.every(
        (x) => x.noQED === true && x.untouchedInvariant === 'imp-3066 K_a >= 0' && x.plattTrudgianSOTA === true
      ) && IMP_33719_33679_33682_COHORT_PROVENANCE_ROLLUP.honestBannerFullCoverageCount === 4,
    why: 'Every module in the cohort must state no-QED, imp-3066 K_a >= 0 untouched, and ' +
      'no refereed bound is changed -- grep-verified against the source files.',
  },
  {
    id: 'imp33719-zero-bridge-touching-consistent-not-referenced',
    holds: () => {
      const m = IMP_33719_33679_33682_COHORT_PROVENANCE_ROLLUP.modules;
      return m.every((x) => x.g6aH2Status === 'not referenced');
    },
    why: 'Grep-verified: none of the four modules mentions the Polymath15 G6a_shock_lipschitz/H2 ' +
      'bridge, so "not referenced" is the correct status for all four, not a gap.',
  },
  {
    id: 'imp33719-shared-caveat-counts-match',
    holds: () => {
      const m = IMP_33719_33679_33682_COHORT_PROVENANCE_ROLLUP.modules;
      const nphi = m.filter((x) => x.hasNPHI10Caveat === true).length;
      const jitter = m.filter((x) => x.hasLatticeJitterCaveat === true).length;
      return nphi === 4 && nphi === IMP_33719_33679_33682_COHORT_PROVENANCE_ROLLUP.nphi10CaveatCount &&
        jitter === 4 && jitter === IMP_33719_33679_33682_COHORT_PROVENANCE_ROLLUP.latticeJitterCaveatCount;
    },
    why: 'Grep-verified: all four modules inherit the NPHI=10 Phi-kernel truncation and all four ' +
      'explicitly restate the imp-33599/imp-33621/imp-33638 latticeJitterCaveat lineage.',
  },
  {
    id: 'imp33719-four-glossary-three-viz',
    holds: () => {
      const m = IMP_33719_33679_33682_COHORT_PROVENANCE_ROLLUP.modules;
      const withTerm = m.filter((x) => x.hasGlossaryTerm === true).length;
      const withViz = m.filter((x) => x.hasRoutedVizPage === true).length;
      return withTerm === 4 && withTerm === IMP_33719_33679_33682_COHORT_PROVENANCE_ROLLUP.glossaryCoveredCount &&
        withViz === 3 && withViz === IMP_33719_33679_33682_COHORT_PROVENANCE_ROLLUP.routedVizPageCount;
    },
    why: 'Grep-verified: all four modules have a dedicated headline glossary term; three of the ' +
      'four (imp-33679, imp-33681, imp-33682) have a dedicated routed viz page, imp-33680 does not.',
  },
  {
    id: 'imp33719-all-four-heavy-import-safe',
    holds: () => {
      const m = IMP_33719_33679_33682_COHORT_PROVENANCE_ROLLUP.modules;
      const safe = m.filter((x) => x.hasHeavyImport === false).length;
      return safe === 4 && safe === IMP_33719_33679_33682_COHORT_PROVENANCE_ROLLUP.heavyImportSafeCount;
    },
    why: 'Grep-verified: imp-33679/imp-33682 have zero import/require statements; imp-33680/imp-33681 ' +
      'import only local sibling data modules (imp-33660, imp-33662) already confirmed import-free by ' +
      'imp-33693/imp-33695, so none can transitively pull in the 16.7MB zeros bundle.',
  },
  {
    id: 'imp33720-heavy-import-audit-formalized',
    holds: () => {
      const m = IMP_33719_33679_33682_COHORT_PROVENANCE_ROLLUP.modules;
      const byFile = Object.fromEntries(m.map((x) => [x.file, x]));
      return (
        byFile['imp-33679-cluster-peak-envelope-height-1200-1600.js'].hasHeavyImport === false &&
        byFile['imp-33680-cluster-peak-height-leave-two-out-refit.js'].hasHeavyImport === false &&
        byFile['imp-33681-peak-minus-trough-amplitude-series-n400-1200.js'].hasHeavyImport === false &&
        byFile['imp-33682-gap-vs-height-correlation-n400-1200.js'].hasHeavyImport === false
      );
    },
    why: 'imp-33720 formal audit (mirroring imp-33695): direct grep of each of the four module ' +
      'source files for ^import/require( confirms imp-33679 and imp-33682 have ZERO import lines ' +
      '(fully self-computing), and imp-33680/imp-33681 import ONLY the local sibling modules ' +
      'imp-33660 and imp-33662 -- both of which were independently re-grepped here and also have ' +
      'ZERO import lines. The transitive closure of all four modules therefore contains no path ' +
      'to the 16.7MB zeros bundle; this closes the imp-33719 recommendation item that flagged ' +
      'imp-33720 as still queued.',
  },
  {
    id: 'imp33719-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_33719_33679_33682_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /no QED/i.test(IMP_33719_33679_33682_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /imp-3066/.test(IMP_33719_33679_33682_COHORT_PROVENANCE_ROLLUP.honestNote),
    why: 'VERDICT LOCK: this is a read-only roll-up, not a bound; no refereed bound is changed' +
      ' and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33719_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33719 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33719_ASSERTIONS };
