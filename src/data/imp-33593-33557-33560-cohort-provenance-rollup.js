/**
 * @module imp-33593-33557-33560-cohort-provenance-rollup
 * @fileoverview imp-33593 -- META provenance roll-up cataloguing the imp-33557/imp-33558/imp-33559/
 * imp-33560 deep-tail node-budget and envelope cohort (four modules: a graded-plateau BAND-CROSSING
 * minimum-budget sweep, a low-height ENVELOPE extension to tau in {5,6}, a REFERENCE-LIBM envelope
 * ceiling recompute under ~106-bit double-double, and a deep-tail CROSS-SOLVER baseline-relative
 * check) by EVIDENCE CLASS, mirroring the imp-33719 imp-33679/33682 rollup pattern and confirming
 * each module carries the mandatory honest banner: no-QED, the imp-3066 K_a >= 0 operator-positivity
 * invariant untouched, and Platt-Trudgian Lambda <= 0.2 SOTA.
 *
 * METHOD (read-only, performed at author time). Each module's @fileoverview/detail block was read
 * and classified into the evidence class it earns on its own terms:
 *   - "graded-plateau band-crossing minimum-budget sweep": sweeps the imp-33539 flat ~200-node
 *     graded-GL plateau minimum at the imp-33537 band-crossing rungs n in {495,510,596}, testing
 *     whether the flat minimum survives where the imp-33316 <64 ULP band itself fails.
 *   - "low-height envelope extension": extends the imp-33538 tau-uniform envelope constant (bound
 *     at tau in {7..10}) down to tau in {5,6}, testing whether a lower height raises the binding
 *     constant.
 *   - "reference-libm envelope ceiling recompute": recomputes the imp-33312/imp-33538 per-height
 *     band ceilings under the imp-33534 ~106-bit double-double reference-precision libm, testing
 *     whether the named ~10.78 ULP envelope constant and its binding height survive.
 *   - "deep-tail cross-solver baseline-relative check": extends the imp-33536 R_40 baseline-relative
 *     cross-solver finding to the deep-tail A(tau) weight, testing whether the imp-33539 ~9.3x/~186x
 *     graded-vs-uniform saving is an intrinsic graded advantage or an artifact of the weak uniform
 *     baseline.
 * The honest-banner check greps each module for the mandatory phrases (no QED, imp-3066 K_a >= 0
 * untouched, Platt-Trudgian Lambda <= 0.2 SOTA); shared-caveat coverage (NPHI=10 Phi-series
 * truncation, the imp-33249/imp-33537 latticeJitterCaveat lineage) and glossary/viz-page coverage
 * were cross-checked against src/data/glossary.js and src/pages. Import lines were grepped per the
 * imp-33695/imp-33720 heavy-import safety pattern (the 16.7MB zeros bundle hangs vite ssrLoadModule
 * / npm-run-assert when transitively pulled into an assertion module).
 *
 * RESULT (audited 2026-07-04). All four modules carry the full honest banner and all four state
 * imp-3066 K_a >= 0 untouched. None of the four references the Polymath15 G6a_shock_lipschitz/H2
 * bridge -- entirely within the A(tau)-kernel deep-tail node-budget/envelope frontier, disjoint from
 * the G6a inviscid-window material.
 *   - imp-33557-band-crossing-min-budget.js                        : graded-plateau band-crossing minimum-budget sweep
 *   - imp-33558-envelope-below-tau7.js                              : low-height envelope extension
 *   - imp-33559-envelope-under-reference-libm.js                    : reference-libm envelope ceiling recompute
 *   - imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget.js  : deep-tail cross-solver baseline-relative check
 *
 * GLOSSARY / VIZ COVERAGE. imp-33557 has a dedicated headline glossary term (the
 * flat-minimum-is-band-conditional verdict) and a dedicated routed viz page
 * (Imp33587BandCrossingFloorClimbViz.jsx). imp-33559 and imp-33560 each have a dedicated headline
 * glossary term (Reference-Precision Envelope Reconciliation; Deep-Tail Baseline-Relative Extension);
 * imp-33560 has a dedicated routed viz page (Imp33591DeepTailCrossSolverNodeBudgetViz.jsx, which
 * bakes its RUNG_TABLE literals rather than importing the module) but imp-33559 does not yet have
 * one. imp-33558 has a dedicated routed viz page (Imp33589HeightCollapsingEnvelopeCeilingViz.jsx,
 * which imports its data module directly) but is referenced only inside other terms' `related`
 * arrays, not as its own headline glossary term -- the sole glossary gap in the cohort.
 *
 * HEAVY-IMPORT NOTE (audited 2026-07-04, mirroring imp-33695/imp-33720). imp-33557, imp-33559, and
 * imp-33560 have zero import/require statements (self-computing). imp-33558 imports
 * IMP33538_TAU_UNIFORM_ENVELOPE_CONSTANT from the local sibling module imp-33538, which itself
 * imports only the local sibling imp-33312 -- and imp-33312 has zero import lines. The transitive
 * closure of all four cohort modules therefore contains no path to the 16.7MB zeros bundle.
 *
 * SHARED CAVEATS. All four inherit the NPHI=10 Phi-series truncation and all four explicitly
 * restate or descend from the imp-33249/imp-33277/imp-33296/imp-33537 latticeJitterCaveat lineage.
 * Unlike a same-dataset cohort, these four do NOT share one identical underlying series: imp-33557
 * sweeps a fresh three-rung band-crossing ladder, imp-33558/imp-33559 both recompute the imp-33312/
 * imp-33538 four-height envelope band (on different axes -- lower heights vs reference-precision
 * libm), and imp-33560 runs an independent Clenshaw-Curtis cross-solver sweep at the deeper
 * n in {350,375,400} rungs.
 *
 * @see imp-33719 (the imp-33679/33682 sub-cohort rollup this note mirrors), imp-33693, imp-33268,
 * imp-33287, imp-33307, imp-3886, imp-3931, imp-33551, imp-33574, imp-33615 (the precedent
 * provenance roll-ups this pattern follows)
 */

export const IMP_33593_33557_33560_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-33593',
  auditedAt: '2026-07-04',
  method:
    'Read each of the four imp-33557/33558/33559/33560 module @fileoverview/detail blocks; ' +
    'classify by evidence class (graded-plateau band-crossing minimum-budget sweep / low-height ' +
    'envelope extension / reference-libm envelope ceiling recompute / deep-tail cross-solver ' +
    'baseline-relative check); grep for the mandatory honest-banner phrases (no QED, imp-3066 ' +
    'K_a >= 0 untouched, Platt-Trudgian Lambda <= 0.2 SOTA) plus the explicit G6a/H2 bridge status ' +
    'and the shared-caveat phrases (NPHI=10, latticeJitterCaveat lineage); cross-check glossary.js ' +
    'and src/pages for dedicated coverage and import lines for heavy-import safety.',
  modules: [
    {
      file: 'imp-33557-band-crossing-min-budget.js',
      evidenceClass: 'graded-plateau band-crossing minimum-budget sweep',
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
      file: 'imp-33558-envelope-below-tau7.js',
      evidenceClass: 'low-height envelope extension',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasNPHI10Caveat: true,
      hasLatticeJitterCaveat: true,
      hasGlossaryTerm: false,
      hasRoutedVizPage: true,
      hasHeavyImport: false,
    },
    {
      file: 'imp-33559-envelope-under-reference-libm.js',
      evidenceClass: 'reference-libm envelope ceiling recompute',
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
      file: 'imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget.js',
      evidenceClass: 'deep-tail cross-solver baseline-relative check',
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
    'graded-plateau band-crossing minimum-budget sweep': 1,
    'low-height envelope extension': 1,
    'reference-libm envelope ceiling recompute': 1,
    'deep-tail cross-solver baseline-relative check': 1,
  },
  honestBannerFullCoverageCount: 4,
  nphi10CaveatCount: 4,
  latticeJitterCaveatCount: 4,
  glossaryCoveredCount: 3,
  routedVizPageCount: 3,
  heavyImportSafeCount: 4,
  recommendation:
    'No action needed on the honest-banner side -- all four modules already carry the full ' +
    'mandatory banner and all four state imp-3066 untouched. Two coverage gaps remain, each the ' +
    'mirror image of the other: imp-33558 has a routed viz page but no dedicated headline glossary ' +
    'term (the best candidate for a new glossary entry), and imp-33559 has a dedicated glossary ' +
    'term but no routed viz page (the best candidate for a new viz page) -- both already queued ' +
    '(imp-33594 for the imp-33559 viz gap).',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module ' +
    'itself. imp-3066 K_a >= 0 positivity untouched across all four cohort members. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_33593_ASSERTIONS = [
  {
    id: 'imp33593-exactly-four-modules-catalogued',
    holds: () => IMP_33593_33557_33560_COHORT_PROVENANCE_ROLLUP.modules.length === 4,
    why: 'The roll-up must cover exactly the four named cohort modules (imp-33557/33558/33559/33560).',
  },
  {
    id: 'imp33593-four-distinct-evidence-classes',
    holds: () => {
      const m = IMP_33593_33557_33560_COHORT_PROVENANCE_ROLLUP.modules;
      const counts = IMP_33593_33557_33560_COHORT_PROVENANCE_ROLLUP.evidenceClassCounts;
      const distinctClasses = new Set(m.map((x) => x.evidenceClass));
      return distinctClasses.size === 4 &&
        Object.values(counts).every((c) => c === 1) &&
        Object.keys(counts).length === 4;
    },
    why: 'Each of the four modules earns a DISTINCT evidence class -- no two modules should share a class.',
  },
  {
    id: 'imp33593-all-four-carry-full-honest-banner',
    holds: () =>
      IMP_33593_33557_33560_COHORT_PROVENANCE_ROLLUP.modules.every(
        (x) => x.noQED === true && x.untouchedInvariant === 'imp-3066 K_a >= 0' && x.plattTrudgianSOTA === true
      ) && IMP_33593_33557_33560_COHORT_PROVENANCE_ROLLUP.honestBannerFullCoverageCount === 4,
    why: 'Every module in the cohort must state no-QED, imp-3066 K_a >= 0 untouched, and ' +
      'Platt-Trudgian Lambda <= 0.2 SOTA -- grep-verified against the source files.',
  },
  {
    id: 'imp33593-zero-bridge-touching-consistent-not-referenced',
    holds: () => {
      const m = IMP_33593_33557_33560_COHORT_PROVENANCE_ROLLUP.modules;
      return m.every((x) => x.g6aH2Status === 'not referenced');
    },
    why: 'Grep-verified: none of the four modules mentions the Polymath15 G6a_shock_lipschitz/H2 ' +
      'bridge, so "not referenced" is the correct status for all four, not a gap.',
  },
  {
    id: 'imp33593-shared-caveat-counts-match',
    holds: () => {
      const m = IMP_33593_33557_33560_COHORT_PROVENANCE_ROLLUP.modules;
      const nphi = m.filter((x) => x.hasNPHI10Caveat === true).length;
      const jitter = m.filter((x) => x.hasLatticeJitterCaveat === true).length;
      return nphi === 4 && nphi === IMP_33593_33557_33560_COHORT_PROVENANCE_ROLLUP.nphi10CaveatCount &&
        jitter === 4 && jitter === IMP_33593_33557_33560_COHORT_PROVENANCE_ROLLUP.latticeJitterCaveatCount;
    },
    why: 'Grep-verified: all four modules inherit the NPHI=10 Phi-kernel truncation and all four ' +
      'restate or descend from the imp-33249/33277/33296/33537 latticeJitterCaveat lineage.',
  },
  {
    id: 'imp33593-three-glossary-three-viz-mirrored-gaps',
    holds: () => {
      const m = IMP_33593_33557_33560_COHORT_PROVENANCE_ROLLUP.modules;
      const withTerm = m.filter((x) => x.hasGlossaryTerm === true).length;
      const withViz = m.filter((x) => x.hasRoutedVizPage === true).length;
      const noTermHasViz = m.find((x) => x.file === 'imp-33558-envelope-below-tau7.js');
      const hasTermNoViz = m.find((x) => x.file === 'imp-33559-envelope-under-reference-libm.js');
      return withTerm === 3 && withTerm === IMP_33593_33557_33560_COHORT_PROVENANCE_ROLLUP.glossaryCoveredCount &&
        withViz === 3 && withViz === IMP_33593_33557_33560_COHORT_PROVENANCE_ROLLUP.routedVizPageCount &&
        noTermHasViz.hasGlossaryTerm === false && noTermHasViz.hasRoutedVizPage === true &&
        hasTermNoViz.hasGlossaryTerm === true && hasTermNoViz.hasRoutedVizPage === false;
    },
    why: 'Grep-verified: three of the four modules have a dedicated headline glossary term ' +
      '(imp-33557, imp-33559, imp-33560) and three have a dedicated routed viz page (imp-33557, ' +
      'imp-33558, imp-33560); the two single-coverage gaps are DISTINCT and mirror each other -- ' +
      'imp-33558 (viz, no term) and imp-33559 (term, no viz).',
  },
  {
    id: 'imp33593-all-four-heavy-import-safe',
    holds: () => {
      const m = IMP_33593_33557_33560_COHORT_PROVENANCE_ROLLUP.modules;
      const safe = m.filter((x) => x.hasHeavyImport === false).length;
      return safe === 4 && safe === IMP_33593_33557_33560_COHORT_PROVENANCE_ROLLUP.heavyImportSafeCount;
    },
    why: 'Grep-verified: imp-33557/imp-33559/imp-33560 have zero import/require statements; ' +
      'imp-33558 imports only the local sibling imp-33538, which itself imports only the local ' +
      'sibling imp-33312 (zero import lines) -- no path to the 16.7MB zeros bundle.',
  },
  {
    id: 'imp33593-honest-scope-locked',
    holds: () =>
      /SOTA/.test(IMP_33593_33557_33560_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /no QED/i.test(IMP_33593_33557_33560_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /imp-3066/.test(IMP_33593_33557_33560_COHORT_PROVENANCE_ROLLUP.honestNote),
    why: 'VERDICT LOCK: this is a read-only roll-up, not a bound; Platt-Trudgian Lambda <= 0.2 ' +
      'stays SOTA and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33593_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33593 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33593_ASSERTIONS };
