/**
 * @module imp-33693-33660-33663-cohort-provenance-rollup
 * @fileoverview imp-33693 -- META provenance roll-up cataloguing the newest sixteen-peak
 * band-clearing cluster cohort imp-33660/imp-33661/imp-33662/imp-33663 (four modules: a
 * peak-envelope HEIGHT growth-law fit, an extended peak-SPACING periodicity re-fit, an
 * inter-cluster TROUGH-floor drift measurement, and an extended recovery-grade-vs-spike-height
 * correlation) across the combined [400,1200] window, by EVIDENCE CLASS, and confirming each
 * module carries the mandatory honest banner: no-QED, the imp-3066 K_a >= 0 operator-positivity
 * invariant untouched, and no refereed bound is changed, following the
 * imp-3886/imp-33247/imp-33268/imp-33287/imp-33307/imp-3931/imp-33551/imp-33574 audit pattern.
 *
 * METHOD (read-only, performed at author time). Each module's @fileoverview/detail block was
 * read and classified into the evidence class it earns on its own terms:
 *   - "peak-envelope height growth-law fit": fits the sixteen cluster-peak envelope HEIGHTS to
 *     constant/linear/sqrt/log growth laws, testing whether the re-intensifying tail clusters
 *     signal a genuine growth trend or remain within jitter.
 *   - "extended spacing-periodicity irregularity confirmation": re-runs an existing nine-peak
 *     spacing-irregularity fit on the doubled sixteen-peak sample to test whether the CV drops
 *     toward an emerging quasi-period or the irregularity persists.
 *   - "inter-cluster trough-floor flatness measurement": tabulates the LOCAL-MINIMUM envelope
 *     between adjacent band-clearing clusters and fits trough-vs-n, to separate a genuine
 *     peak-height growth from a rising between-cluster baseline.
 *   - "extended recovery-grade correlation tautology confirmation": extends an existing
 *     three-point recovery-grade-vs-spike-height correlation to the full sixteen-peak sample,
 *     re-testing whether the exact-rung floor reading remains tautological and the
 *     cluster-envelope reading remains uncorrelated.
 * The honest-banner check greps each module for the mandatory phrases (no QED, imp-3066 K_a >= 0
 * untouched, no refereed bound is changed) and for the Polymath15 G6a/H2 bridge status line;
 * shared-caveat coverage (NPHI=10 Phi-series truncation, the imp-33249/imp-33296/imp-33599/
 * imp-33621/imp-33638 latticeJitterCaveat) and glossary/viz-page coverage were cross-checked
 * against src/data/glossary.js and src/pages. imp-33695 additionally grepped each module's
 * `^import`/`require(` lines to audit heavy-import safety (the 16.7MB zeros bundle hangs
 * vite ssrLoadModule / npm-run-assert when transitively pulled into an assertion module).
 *
 * RESULT (audited 2026-07-04). All four modules carry the full honest banner and all four state
 * imp-3066 K_a >= 0 untouched. None of the four references the Polymath15 G6a_shock_lipschitz/H2
 * bridge -- this cohort is entirely within the A(tau)-kernel band-clearing cluster-envelope
 * frontier, disjoint from the G6a inviscid-window material, so "not referenced" is correct for
 * all four. HEAVY-IMPORT AUDIT (imp-33695): all four modules have ZERO import/require
 * statements -- each self-computes its floorUlp(n) scan and bakes its literals entirely from
 * inline arithmetic at import time, so none can transitively pull in the zeros bundle.
 *   - imp-33660-cluster-peak-envelope-height-growth-fit.js               : peak-envelope height growth-law fit
 *   - imp-33661-cluster-peak-spacing-periodicity-extended-n400-1200.js   : extended spacing-periodicity irregularity confirmation
 *   - imp-33662-inter-cluster-trough-floor-drift-n400-1200.js            : inter-cluster trough-floor flatness measurement
 *   - imp-33663-recovery-grade-vs-spike-height-sixteen-peaks.js          : extended recovery-grade correlation tautology confirmation
 *
 * SHARED CAVEATS. All four inherit the NPHI=10 Phi-series truncation and all four explicitly
 * restate the imp-33599/imp-33621/imp-33638 latticeJitterCaveat (the clustered-spike heights,
 * gaps, troughs, and recovery grades are jitter-driven, not a smooth error curve). All four
 * derive their sixteen-peak sample off the IDENTICAL combined [400,1200] grade-4
 * floorUlp(n) +/-5 rolling-max envelope scan, so they share one underlying dataset viewed
 * through four distinct lenses (height, spacing, trough, correlation).
 *
 * SURFACING NOTE (secondary). All four already have a dedicated headline glossary term. NONE of
 * the four has a dedicated routed viz page -- this mirrors the imp-33574 roll-up's
 * cited-but-no-dedicated-viz gap, and is already partially queued: imp-33694 (pending, medium
 * priority) targets a viz for the imp-33662 trough series, and imp-33677 (pending, low priority)
 * targets a viz for the imp-33661/imp-33639 gap sequence. imp-33660 and imp-33663 remain
 * uncovered by any queued viz ticket.
 *
 * @see imp-33268, imp-33287, imp-33307, imp-3886, imp-3931, imp-33551, imp-33574 (the precedent
 * provenance roll-ups this note follows)
 */

export const IMP_33693_33660_33663_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-33693',
  auditedAt: '2026-07-04',
  method:
    'Read each of the four imp-33660/33661/33662/33663 module @fileoverview/detail blocks; ' +
    'classify by evidence class (peak-envelope height growth-law fit / extended ' +
    'spacing-periodicity irregularity confirmation / inter-cluster trough-floor flatness ' +
    'measurement / extended recovery-grade correlation tautology confirmation); grep for the ' +
    'mandatory honest-banner phrases (no QED, imp-3066 K_a >= 0 untouched, no refereed bound is changed' +
    ') plus the explicit G6a/H2 bridge status and the shared-caveat phrases ' +
    '(NPHI=10, latticeJitterCaveat); cross-check glossary.js and src/pages for dedicated coverage.',
  modules: [
    {
      file: 'imp-33660-cluster-peak-envelope-height-growth-fit.js',
      evidenceClass: 'peak-envelope height growth-law fit',
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
      file: 'imp-33661-cluster-peak-spacing-periodicity-extended-n400-1200.js',
      evidenceClass: 'extended spacing-periodicity irregularity confirmation',
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
      file: 'imp-33662-inter-cluster-trough-floor-drift-n400-1200.js',
      evidenceClass: 'inter-cluster trough-floor flatness measurement',
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
      file: 'imp-33663-recovery-grade-vs-spike-height-sixteen-peaks.js',
      evidenceClass: 'extended recovery-grade correlation tautology confirmation',
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
  ],
  evidenceClassCounts: {
    'peak-envelope height growth-law fit': 1,
    'extended spacing-periodicity irregularity confirmation': 1,
    'inter-cluster trough-floor flatness measurement': 1,
    'extended recovery-grade correlation tautology confirmation': 1,
  },
  honestBannerFullCoverageCount: 4,
  nphi10CaveatCount: 4,
  latticeJitterCaveatCount: 4,
  glossaryCoveredCount: 4,
  routedVizPageCount: 0,
  heavyImportSafeCount: 4,
  recommendation:
    'No action needed on the honest-banner side -- all four modules already carry the full ' +
    'mandatory banner and all four state imp-3066 untouched. All four lack a dedicated routed ' +
    'viz page; imp-33694 (trough series) and imp-33677 (gap sequence) already queue two of the ' +
    'four gaps, leaving imp-33660 (height growth fit) and imp-33663 (recovery-grade correlation) ' +
    'as the best candidates for new dedicated viz pages, mirroring the imp-33574 roll-up ' +
    'recommendation pattern.',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module ' +
    'itself. imp-3066 K_a >= 0 positivity untouched across all four cohort members. ' +
    'No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_33693_ASSERTIONS = [
  {
    id: 'imp33693-exactly-four-modules-catalogued',
    holds: () => IMP_33693_33660_33663_COHORT_PROVENANCE_ROLLUP.modules.length === 4,
    why: 'The roll-up must cover exactly the four named cohort modules (imp-33660/33661/33662/33663).',
  },
  {
    id: 'imp33693-four-distinct-evidence-classes',
    holds: () => {
      const m = IMP_33693_33660_33663_COHORT_PROVENANCE_ROLLUP.modules;
      const counts = IMP_33693_33660_33663_COHORT_PROVENANCE_ROLLUP.evidenceClassCounts;
      const distinctClasses = new Set(m.map((x) => x.evidenceClass));
      return distinctClasses.size === 4 &&
        Object.values(counts).every((c) => c === 1) &&
        Object.keys(counts).length === 4;
    },
    why: 'Each of the four modules earns a DISTINCT evidence class -- no two modules should share a class.',
  },
  {
    id: 'imp33693-all-four-carry-full-honest-banner',
    holds: () =>
      IMP_33693_33660_33663_COHORT_PROVENANCE_ROLLUP.modules.every(
        (x) => x.noQED === true && x.untouchedInvariant === 'imp-3066 K_a >= 0' && x.plattTrudgianSOTA === true
      ) && IMP_33693_33660_33663_COHORT_PROVENANCE_ROLLUP.honestBannerFullCoverageCount === 4,
    why: 'Every module in the cohort must state no-QED, imp-3066 K_a >= 0 untouched, and ' +
      'no refereed bound is changed -- grep-verified against the source files.',
  },
  {
    id: 'imp33693-zero-bridge-touching-consistent-not-referenced',
    holds: () => {
      const m = IMP_33693_33660_33663_COHORT_PROVENANCE_ROLLUP.modules;
      return m.every((x) => x.g6aH2Status === 'not referenced');
    },
    why: 'Grep-verified: none of the four modules mentions the Polymath15 G6a_shock_lipschitz/H2 ' +
      'bridge, so "not referenced" is the correct status for all four, not a gap.',
  },
  {
    id: 'imp33693-shared-caveat-counts-match',
    holds: () => {
      const m = IMP_33693_33660_33663_COHORT_PROVENANCE_ROLLUP.modules;
      const nphi = m.filter((x) => x.hasNPHI10Caveat === true).length;
      const jitter = m.filter((x) => x.hasLatticeJitterCaveat === true).length;
      return nphi === 4 && nphi === IMP_33693_33660_33663_COHORT_PROVENANCE_ROLLUP.nphi10CaveatCount &&
        jitter === 4 && jitter === IMP_33693_33660_33663_COHORT_PROVENANCE_ROLLUP.latticeJitterCaveatCount;
    },
    why: 'Grep-verified: all four modules inherit the NPHI=10 Phi-kernel truncation and all four ' +
      'explicitly restate the imp-33599/imp-33621/imp-33638 latticeJitterCaveat.',
  },
  {
    id: 'imp33693-four-glossary-zero-viz',
    holds: () => {
      const m = IMP_33693_33660_33663_COHORT_PROVENANCE_ROLLUP.modules;
      const withTerm = m.filter((x) => x.hasGlossaryTerm === true).length;
      const withViz = m.filter((x) => x.hasRoutedVizPage === true).length;
      return withTerm === 4 && withTerm === IMP_33693_33660_33663_COHORT_PROVENANCE_ROLLUP.glossaryCoveredCount &&
        withViz === 0 && withViz === IMP_33693_33660_33663_COHORT_PROVENANCE_ROLLUP.routedVizPageCount;
    },
    why: 'Grep-verified: all four modules have a dedicated headline glossary term; none of the ' +
      'four have a dedicated routed viz page.',
  },
  {
    id: 'imp33693-imp33695-all-four-heavy-import-safe',
    holds: () => {
      const m = IMP_33693_33660_33663_COHORT_PROVENANCE_ROLLUP.modules;
      const safe = m.filter((x) => x.hasHeavyImport === false).length;
      return safe === 4 && safe === IMP_33693_33660_33663_COHORT_PROVENANCE_ROLLUP.heavyImportSafeCount;
    },
    why: 'imp-33695 grep-verified: all four modules have zero import/require statements, so none ' +
      'can transitively pull in the 16.7MB zeros bundle that hangs vite ssrLoadModule / npm-run-assert.',
  },
  {
    id: 'imp33693-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_33693_33660_33663_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /no QED/i.test(IMP_33693_33660_33663_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /imp-3066/.test(IMP_33693_33660_33663_COHORT_PROVENANCE_ROLLUP.honestNote),
    why: 'VERDICT LOCK: this is a read-only roll-up, not a bound; no refereed bound is changed' +
      ' and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33693_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33693 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33693_ASSERTIONS };
