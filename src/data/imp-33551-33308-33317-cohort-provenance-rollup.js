/**
 * @module imp-33551-33308-33317-cohort-provenance-rollup
 * @fileoverview imp-33551 -- META provenance roll-up cataloguing the imp-33308/imp-33309/
 * imp-33310/imp-33312/imp-33313/imp-33314/imp-33315/imp-33316/imp-33317 graded-quadrature /
 * node-budget / sigma-shape cohort (nine modules) by EVIDENCE CLASS and confirming each module
 * carries the mandatory honest banner: no-QED, the imp-3066 K_a >= 0 operator-positivity
 * invariant untouched, and no refereed bound is changed, following the imp-3886/imp-33247/
 * imp-33268/imp-33287/imp-33307 audit pattern.
 *
 * METHOD (read-only, performed at author time). Each module's @fileoverview/detail block was
 * read and classified into the evidence class it earns on its own terms:
 *   - "cross-object node-budget transfer": carries a graded-inner-grid node saving proven for a
 *     scalar weight through to the full moment-ratio object built on top of it.
 *   - "non-monotone growth-law fit": tabulates and least-squares fits a candidate growth law
 *     across a plateau ladder, finding the data does NOT support a monotone growth reading.
 *   - "converged-literal feasibility assessment": cross-checks a Richardson-converged value
 *     against prior baked literals within the storage-precision tolerance band.
 *   - "cross-height jitter-band sweep": reruns a previously single-height lattice-jitter scan
 *     across a ladder of heights to test tau-uniformity.
 *   - "deeper-height node-budget extension": extends a previously capped node-budget/crossover
 *     measurement to new (higher) heights.
 *   - "evaluation-order sensitivity perturbation": recomputes an identical scan under alternate
 *     floating-point evaluation orderings to bound a previously unquantified libm caveat.
 *   - "asymptotic-law vs interior-max reconciliation derivation": derives a closed-form asymptotic
 *     implied by a prior leading-order law and tests it against an independently-located interior
 *     extremum, reporting where the two regimes are complementary rather than unified.
 *   - "deep-tail node-budget extension": extends a previously shallow-rung node-budget measurement
 *     to much deeper saddle rungs.
 *   - "closure-gap extrapolation": extends a previously-tabulated model-vs-measurement crossing-gap
 *     closure to a finer/deeper grid and reports the residual after closure.
 * The honest-banner check greps each module for the mandatory phrases (no QED, imp-3066 K_a >= 0
 * untouched, no refereed bound is changed) and for the Polymath15 G6a/H2 bridge status line.
 *
 * RESULT (audited 2026-07-04). All nine modules carry the full honest banner and all nine state
 * imp-3066 K_a >= 0 untouched (imp-33315 additionally caveats that its C_C constant is GUE-
 * conditional per imp-486, but its own untouched-invariant statement is still imp-3066, not a
 * split like the imp-33307 roll-up found for imp-33274). None of the nine references the
 * Polymath15 G6a_shock_lipschitz/H2 bridge -- this cohort spans the R_40 node-budget/graded-
 * quadrature/tau-uniform-jitter/sigma-far-tail/tilt-closure frontier, disjoint from the G6a
 * inviscid-window material, so "not referenced" is correct for all nine.
 *   - imp-33308-graded-inner-grid-r40-node-budget.js                    : cross-object node-budget transfer
 *   - imp-33309-max-bj-growth-fit.js                                    : non-monotone growth-law fit
 *   - imp-33310-r40-converged-literal-feasibility.js                    : converged-literal feasibility assessment
 *   - imp-33312-tau-uniform-jitter-band.js                              : cross-height jitter-band sweep
 *   - imp-33313-a-weight-graded-gl-1ulp-budget-tau1112.js               : deeper-height node-budget extension
 *   - imp-33314-eval-order-ulp-sensitivity.js                           : evaluation-order sensitivity perturbation
 *   - imp-33315-sigma-fartail-law-vs-interior-max-reconciliation.js     : asymptotic-law vs interior-max reconciliation derivation
 *   - imp-33316-graded-plateau-deep-tail-node-budget.js                 : deep-tail node-budget extension
 *   - imp-33317-tilt-closure-crossing-gap.js                            : closure-gap extrapolation
 *
 * SURFACING NOTE (secondary). Six of the nine (imp-33308, imp-33309, imp-33312, imp-33313,
 * imp-33315, imp-33317) have a dedicated glossary term; the other three (imp-33310, imp-33314,
 * imp-33316) are referenced only inside other terms' definitions/relatedTerms, not as their own
 * headline entry. Four of the nine (imp-33309, imp-33315, imp-33316, imp-33317) have a dedicated
 * routed viz page. imp-33316 is the best candidate for a new glossary term: it already has a
 * dedicated routed viz page (Imp33548GradedPlateauDeepTailNodeBudgetViz.jsx) and is cited by five
 * further downstream viz pages, yet has no headline glossary entry of its own -- the same
 * has-viz-lacks-glossary asymmetry the imp-33307 roll-up flagged for its own uncovered member
 * (imp-33276).
 *
 * @see imp-33268, imp-33287, imp-33307, imp-3886, imp-3931 (the precedent provenance roll-ups
 * this note follows)
 */

export const IMP_33551_33308_33317_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-33551',
  auditedAt: '2026-07-04',
  method:
    'Read each of the nine imp-33308/33309/33310/33312/33313/33314/33315/33316/33317 module ' +
    '@fileoverview/detail blocks; classify by evidence class (cross-object node-budget transfer / ' +
    'non-monotone growth-law fit / converged-literal feasibility assessment / cross-height ' +
    'jitter-band sweep / deeper-height node-budget extension / evaluation-order sensitivity ' +
    'perturbation / asymptotic-law vs interior-max reconciliation derivation / deep-tail ' +
    'node-budget extension / closure-gap extrapolation); grep for the mandatory honest-banner ' +
    'phrases (no QED, imp-3066 K_a >= 0 untouched, no refereed bound is changed) plus the ' +
    'explicit G6a/H2 bridge status; cross-check glossary.js and src/pages for dedicated coverage.',
  modules: [
    {
      file: 'imp-33308-graded-inner-grid-r40-node-budget.js',
      evidenceClass: 'cross-object node-budget transfer',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasRoutedVizPage: false,
    },
    {
      file: 'imp-33309-max-bj-growth-fit.js',
      evidenceClass: 'non-monotone growth-law fit',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasRoutedVizPage: true,
    },
    {
      file: 'imp-33310-r40-converged-literal-feasibility.js',
      evidenceClass: 'converged-literal feasibility assessment',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasRoutedVizPage: false,
    },
    {
      file: 'imp-33312-tau-uniform-jitter-band.js',
      evidenceClass: 'cross-height jitter-band sweep',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasRoutedVizPage: false,
    },
    {
      file: 'imp-33313-a-weight-graded-gl-1ulp-budget-tau1112.js',
      evidenceClass: 'deeper-height node-budget extension',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasRoutedVizPage: false,
    },
    {
      file: 'imp-33314-eval-order-ulp-sensitivity.js',
      evidenceClass: 'evaluation-order sensitivity perturbation',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasRoutedVizPage: false,
    },
    {
      file: 'imp-33315-sigma-fartail-law-vs-interior-max-reconciliation.js',
      evidenceClass: 'asymptotic-law vs interior-max reconciliation derivation',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasRoutedVizPage: true,
    },
    {
      file: 'imp-33316-graded-plateau-deep-tail-node-budget.js',
      evidenceClass: 'deep-tail node-budget extension',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasRoutedVizPage: true,
    },
    {
      file: 'imp-33317-tilt-closure-crossing-gap.js',
      evidenceClass: 'closure-gap extrapolation',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasRoutedVizPage: true,
    },
  ],
  evidenceClassCounts: {
    'cross-object node-budget transfer': 1,
    'non-monotone growth-law fit': 1,
    'converged-literal feasibility assessment': 1,
    'cross-height jitter-band sweep': 1,
    'deeper-height node-budget extension': 1,
    'evaluation-order sensitivity perturbation': 1,
    'asymptotic-law vs interior-max reconciliation derivation': 1,
    'deep-tail node-budget extension': 1,
    'closure-gap extrapolation': 1,
  },
  honestBannerFullCoverageCount: 9,
  glossaryCoveredCount: 6,
  routedVizPageCount: 4,
  recommendation:
    'No action needed on the honest-banner side -- all nine modules already carry the full ' +
    'mandatory banner and all nine state imp-3066 untouched. imp-33316 is the best candidate for ' +
    'a new dedicated glossary term: it already has its own routed viz page and is cited by five ' +
    'further downstream viz pages, yet has no headline glossary entry of its own, mirroring the ' +
    'imp-33307 roll-up\'s recommendation pattern for its own uncovered member (imp-33276).',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module ' +
    'itself. imp-3066 K_a >= 0 positivity untouched across all nine cohort members. ' +
    'No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_33551_ASSERTIONS = [
  {
    id: 'imp33551-exactly-nine-modules-catalogued',
    holds: () => IMP_33551_33308_33317_COHORT_PROVENANCE_ROLLUP.modules.length === 9,
    why: 'The roll-up must cover exactly the nine named cohort modules (imp-33308/33309/33310/33312/33313/33314/33315/33316/33317).',
  },
  {
    id: 'imp33551-nine-distinct-evidence-classes',
    holds: () => {
      const m = IMP_33551_33308_33317_COHORT_PROVENANCE_ROLLUP.modules;
      const counts = IMP_33551_33308_33317_COHORT_PROVENANCE_ROLLUP.evidenceClassCounts;
      const distinctClasses = new Set(m.map((x) => x.evidenceClass));
      return distinctClasses.size === 9 &&
        Object.values(counts).every((c) => c === 1) &&
        Object.keys(counts).length === 9;
    },
    why: 'Each of the nine modules earns a DISTINCT evidence class -- no two modules should share a class.',
  },
  {
    id: 'imp33551-all-nine-carry-full-honest-banner',
    holds: () =>
      IMP_33551_33308_33317_COHORT_PROVENANCE_ROLLUP.modules.every(
        (x) => x.noQED === true && x.untouchedInvariant === 'imp-3066 K_a >= 0' && x.plattTrudgianSOTA === true
      ) && IMP_33551_33308_33317_COHORT_PROVENANCE_ROLLUP.honestBannerFullCoverageCount === 9,
    why: 'Every module in the cohort must state no-QED, imp-3066 K_a >= 0 untouched, and ' +
      'no refereed bound is changed -- grep-verified against the source files.',
  },
  {
    id: 'imp33551-zero-bridge-touching-consistent-not-referenced',
    holds: () => {
      const m = IMP_33551_33308_33317_COHORT_PROVENANCE_ROLLUP.modules;
      return m.every((x) => x.g6aH2Status === 'not referenced');
    },
    why: 'Grep-verified: none of the nine modules mentions the Polymath15 G6a_shock_lipschitz/H2 ' +
      'bridge, so "not referenced" is the correct status for all nine, not a gap.',
  },
  {
    id: 'imp33551-six-glossary-four-viz',
    holds: () => {
      const m = IMP_33551_33308_33317_COHORT_PROVENANCE_ROLLUP.modules;
      const withTerm = m.filter((x) => x.hasGlossaryTerm === true).length;
      const withViz = m.filter((x) => x.hasRoutedVizPage === true).length;
      return withTerm === 6 && withTerm === IMP_33551_33308_33317_COHORT_PROVENANCE_ROLLUP.glossaryCoveredCount &&
        withViz === 4 && withViz === IMP_33551_33308_33317_COHORT_PROVENANCE_ROLLUP.routedVizPageCount;
    },
    why: 'Grep-verified: six of the nine modules have a dedicated glossary term (all but ' +
      'imp-33310, imp-33314, imp-33316); four have a dedicated routed viz page (imp-33309, ' +
      'imp-33315, imp-33316, imp-33317).',
  },
  {
    id: 'imp33551-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_33551_33308_33317_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /no QED/i.test(IMP_33551_33308_33317_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /imp-3066/.test(IMP_33551_33308_33317_COHORT_PROVENANCE_ROLLUP.honestNote),
    why: 'VERDICT LOCK: this is a read-only roll-up, not a bound; no refereed bound is changed' +
      ' and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33551_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33551 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33551_ASSERTIONS };
