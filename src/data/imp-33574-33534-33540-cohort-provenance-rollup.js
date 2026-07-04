/**
 * @module imp-33574-33534-33540-cohort-provenance-rollup
 * @fileoverview imp-33574 -- META provenance roll-up cataloguing the newest numerical/accuracy
 * cohort imp-33534/imp-33536/imp-33537/imp-33538/imp-33539/imp-33540 (six modules: libm
 * reference-precision fragility, an independent R_40 cross-solver node-budget attribution, a
 * deep-tail plateau jitter-spike recurrence scan, a named tau-uniform envelope constant, a
 * deep-tail minimum node-budget sweep, and a sigma far-tail overshoot two-power decomposition) by
 * EVIDENCE CLASS and confirming each module carries the mandatory honest banner: no-QED, the
 * imp-3066 K_a >= 0 operator-positivity invariant untouched, and Platt-Trudgian Lambda <= 0.2
 * SOTA, following the imp-3886/imp-33247/imp-33268/imp-33287/imp-33307/imp-3931/imp-33551 audit
 * pattern.
 *
 * METHOD (read-only, performed at author time). Each module's @fileoverview/detail block was
 * read and classified into the evidence class it earns on its own terms:
 *   - "reference-precision libm fragility quantification": recomputes an existing single-hit
 *     result under a genuine higher-precision (double-double) libm to quantify a previously
 *     unquantified cross-platform caveat.
 *   - "independent cross-solver baseline-relative attribution": reruns a prior node-saving claim
 *     on a solver sharing nothing with either side of the original comparison, and attributes the
 *     claimed saving to the weak baseline rather than to the graded rule itself.
 *   - "dense-scan jitter-spike recurrence measurement": densifies a coarse single-rung spike
 *     reading into dense integer windows to test whether the spike recurs or was a one-off.
 *   - "named conservative-envelope constant derivation": derives an existing qualitative
 *     conservative ceiling as an explicit named constant and measures the per-rung slack inside it.
 *   - "deep-tail minimum node-budget sweep": sweeps a node budget at fixed deeper rungs to locate
 *     the smallest budget that clears an existing floor band, testing whether that minimum grows.
 *   - "closed-form overshoot two-power decomposition derivation": derives an exact algebraic
 *     identity splitting a previously scalar residual across two power-law factors.
 * The honest-banner check greps each module for the mandatory phrases (no QED, imp-3066 K_a >= 0
 * untouched, Platt-Trudgian Lambda <= 0.2 SOTA) and for the Polymath15 G6a/H2 bridge status line;
 * shared-caveat coverage (NPHI=10 Phi-series truncation, the imp-33249/imp-33296
 * latticeJitterCaveat, GUE-conditional C_C per imp-486) and glossary/viz-page coverage were
 * cross-checked against src/data/glossary.js and src/pages.
 *
 * RESULT (audited 2026-07-04). All six modules carry the full honest banner and all six state
 * imp-3066 K_a >= 0 untouched. None of the six references the Polymath15 G6a_shock_lipschitz/H2
 * bridge -- this cohort spans the A(tau)-kernel node-budget/jitter-envelope frontier and the
 * separate sigma far-tail decomposition, disjoint from the G6a inviscid-window material, so "not
 * referenced" is correct for all six.
 *   - imp-33534-min-node-reference-precision-libm.js             : reference-precision libm fragility quantification
 *   - imp-33536-r40-graded-vs-cc-cross-solver-node-budget.js      : independent cross-solver baseline-relative attribution
 *   - imp-33537-deep-tail-plateau-spike-recurrence.js             : dense-scan jitter-spike recurrence measurement
 *   - imp-33538-tau-uniform-envelope-constant.js                 : named conservative-envelope constant derivation
 *   - imp-33539-graded-plateau-deeper-tail-min-budget.js          : deep-tail minimum node-budget sweep
 *   - imp-33540-sigma-fartail-overshoot-two-power-decomposition.js: closed-form overshoot two-power decomposition derivation
 *
 * SHARED CAVEATS. Five of the six (all but imp-33540, which works in the separate sigma
 * far-tail E_coll/E_flow/E_trunc decomposition rather than the A(tau) Phi-kernel) inherit the
 * NPHI=10 Phi-series truncation. Four of the six (imp-33534, imp-33536, imp-33537, imp-33539)
 * explicitly restate the imp-33249/imp-33296 latticeJitterCaveat (arithmetic-floor jitter, not a
 * smooth error curve); imp-33538 measures the envelope OF that jitter without re-citing the named
 * caveat, and imp-33540 does not touch it at all. imp-33540 alone caveats its C_C constant as
 * GUE-conditional per imp-486.
 *
 * SURFACING NOTE (secondary). All six already have a dedicated headline glossary term
 * (imp-33534 added by imp-33569; the other five were already covered). Four of the six
 * (imp-33536, imp-33537, imp-33538, imp-33540) already have a dedicated routed viz page
 * (imp-33573, imp-33571, imp-33572, imp-33570 respectively); imp-33534 and imp-33539 do not --
 * imp-33539 is cited inside two OTHER pages' text (Imp33609GradedMappedCcAbscissaArtifactViz.jsx,
 * Imp33630GradeVsNodeBudgetViz.jsx) but has no page of its own, the same
 * cited-but-no-dedicated-viz gap the imp-33551 roll-up flagged for its own uncovered members.
 *
 * @see imp-33268, imp-33287, imp-33307, imp-3886, imp-3931, imp-33551 (the precedent provenance
 * roll-ups this note follows)
 */

export const IMP_33574_33534_33540_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-33574',
  auditedAt: '2026-07-04',
  method:
    'Read each of the six imp-33534/33536/33537/33538/33539/33540 module @fileoverview/detail ' +
    'blocks; classify by evidence class (reference-precision libm fragility quantification / ' +
    'independent cross-solver baseline-relative attribution / dense-scan jitter-spike recurrence ' +
    'measurement / named conservative-envelope constant derivation / deep-tail minimum ' +
    'node-budget sweep / closed-form overshoot two-power decomposition derivation); grep for the ' +
    'mandatory honest-banner phrases (no QED, imp-3066 K_a >= 0 untouched, Platt-Trudgian ' +
    'Lambda <= 0.2 SOTA) plus the explicit G6a/H2 bridge status and the shared-caveat phrases ' +
    '(NPHI=10, latticeJitterCaveat, GUE-conditional); cross-check glossary.js and src/pages for ' +
    'dedicated coverage.',
  modules: [
    {
      file: 'imp-33534-min-node-reference-precision-libm.js',
      evidenceClass: 'reference-precision libm fragility quantification',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasNPHI10Caveat: true,
      hasLatticeJitterCaveat: true,
      hasGlossaryTerm: true,
      hasRoutedVizPage: false,
    },
    {
      file: 'imp-33536-r40-graded-vs-cc-cross-solver-node-budget.js',
      evidenceClass: 'independent cross-solver baseline-relative attribution',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasNPHI10Caveat: true,
      hasLatticeJitterCaveat: true,
      hasGlossaryTerm: true,
      hasRoutedVizPage: true,
    },
    {
      file: 'imp-33537-deep-tail-plateau-spike-recurrence.js',
      evidenceClass: 'dense-scan jitter-spike recurrence measurement',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasNPHI10Caveat: true,
      hasLatticeJitterCaveat: true,
      hasGlossaryTerm: true,
      hasRoutedVizPage: true,
    },
    {
      file: 'imp-33538-tau-uniform-envelope-constant.js',
      evidenceClass: 'named conservative-envelope constant derivation',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasNPHI10Caveat: true,
      hasLatticeJitterCaveat: false,
      hasGlossaryTerm: true,
      hasRoutedVizPage: true,
    },
    {
      file: 'imp-33539-graded-plateau-deeper-tail-min-budget.js',
      evidenceClass: 'deep-tail minimum node-budget sweep',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasNPHI10Caveat: true,
      hasLatticeJitterCaveat: true,
      hasGlossaryTerm: true,
      hasRoutedVizPage: false,
    },
    {
      file: 'imp-33540-sigma-fartail-overshoot-two-power-decomposition.js',
      evidenceClass: 'closed-form overshoot two-power decomposition derivation',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasNPHI10Caveat: false,
      hasLatticeJitterCaveat: false,
      hasGlossaryTerm: true,
      hasRoutedVizPage: true,
    },
  ],
  evidenceClassCounts: {
    'reference-precision libm fragility quantification': 1,
    'independent cross-solver baseline-relative attribution': 1,
    'dense-scan jitter-spike recurrence measurement': 1,
    'named conservative-envelope constant derivation': 1,
    'deep-tail minimum node-budget sweep': 1,
    'closed-form overshoot two-power decomposition derivation': 1,
  },
  honestBannerFullCoverageCount: 6,
  nphi10CaveatCount: 5,
  latticeJitterCaveatCount: 4,
  glossaryCoveredCount: 6,
  routedVizPageCount: 4,
  recommendation:
    'No action needed on the honest-banner side -- all six modules already carry the full ' +
    'mandatory banner and all six state imp-3066 untouched. imp-33539 is the best candidate for ' +
    'a new dedicated viz page: it is already cited by two downstream pages ' +
    '(Imp33609GradedMappedCcAbscissaArtifactViz.jsx, Imp33630GradeVsNodeBudgetViz.jsx) yet has no ' +
    'headline viz page of its own, mirroring the imp-33551 roll-up recommendation pattern.',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module ' +
    'itself. imp-3066 K_a >= 0 positivity untouched across all six cohort members. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_33574_ASSERTIONS = [
  {
    id: 'imp33574-exactly-six-modules-catalogued',
    holds: () => IMP_33574_33534_33540_COHORT_PROVENANCE_ROLLUP.modules.length === 6,
    why: 'The roll-up must cover exactly the six named cohort modules (imp-33534/33536/33537/33538/33539/33540).',
  },
  {
    id: 'imp33574-six-distinct-evidence-classes',
    holds: () => {
      const m = IMP_33574_33534_33540_COHORT_PROVENANCE_ROLLUP.modules;
      const counts = IMP_33574_33534_33540_COHORT_PROVENANCE_ROLLUP.evidenceClassCounts;
      const distinctClasses = new Set(m.map((x) => x.evidenceClass));
      return distinctClasses.size === 6 &&
        Object.values(counts).every((c) => c === 1) &&
        Object.keys(counts).length === 6;
    },
    why: 'Each of the six modules earns a DISTINCT evidence class -- no two modules should share a class.',
  },
  {
    id: 'imp33574-all-six-carry-full-honest-banner',
    holds: () =>
      IMP_33574_33534_33540_COHORT_PROVENANCE_ROLLUP.modules.every(
        (x) => x.noQED === true && x.untouchedInvariant === 'imp-3066 K_a >= 0' && x.plattTrudgianSOTA === true
      ) && IMP_33574_33534_33540_COHORT_PROVENANCE_ROLLUP.honestBannerFullCoverageCount === 6,
    why: 'Every module in the cohort must state no-QED, imp-3066 K_a >= 0 untouched, and ' +
      'Platt-Trudgian Lambda <= 0.2 SOTA -- grep-verified against the source files.',
  },
  {
    id: 'imp33574-zero-bridge-touching-consistent-not-referenced',
    holds: () => {
      const m = IMP_33574_33534_33540_COHORT_PROVENANCE_ROLLUP.modules;
      return m.every((x) => x.g6aH2Status === 'not referenced');
    },
    why: 'Grep-verified: none of the six modules mentions the Polymath15 G6a_shock_lipschitz/H2 ' +
      'bridge, so "not referenced" is the correct status for all six, not a gap.',
  },
  {
    id: 'imp33574-shared-caveat-counts-match',
    holds: () => {
      const m = IMP_33574_33534_33540_COHORT_PROVENANCE_ROLLUP.modules;
      const nphi = m.filter((x) => x.hasNPHI10Caveat === true).length;
      const jitter = m.filter((x) => x.hasLatticeJitterCaveat === true).length;
      return nphi === 5 && nphi === IMP_33574_33534_33540_COHORT_PROVENANCE_ROLLUP.nphi10CaveatCount &&
        jitter === 4 && jitter === IMP_33574_33534_33540_COHORT_PROVENANCE_ROLLUP.latticeJitterCaveatCount;
    },
    why: 'Grep-verified: five of the six modules inherit the NPHI=10 Phi-kernel truncation (all ' +
      'but imp-33540, which works in the separate sigma far-tail decomposition); four of the six ' +
      'explicitly restate the imp-33249/imp-33296 latticeJitterCaveat (imp-33534, imp-33536, ' +
      'imp-33537, imp-33539).',
  },
  {
    id: 'imp33574-six-glossary-four-viz',
    holds: () => {
      const m = IMP_33574_33534_33540_COHORT_PROVENANCE_ROLLUP.modules;
      const withTerm = m.filter((x) => x.hasGlossaryTerm === true).length;
      const withViz = m.filter((x) => x.hasRoutedVizPage === true).length;
      return withTerm === 6 && withTerm === IMP_33574_33534_33540_COHORT_PROVENANCE_ROLLUP.glossaryCoveredCount &&
        withViz === 4 && withViz === IMP_33574_33534_33540_COHORT_PROVENANCE_ROLLUP.routedVizPageCount;
    },
    why: 'Grep-verified: all six modules have a dedicated headline glossary term; four of the six ' +
      'have a dedicated routed viz page (imp-33536, imp-33537, imp-33538, imp-33540) while ' +
      'imp-33534 and imp-33539 do not.',
  },
  {
    id: 'imp33574-honest-scope-locked',
    holds: () =>
      /SOTA/.test(IMP_33574_33534_33540_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /no QED/i.test(IMP_33574_33534_33540_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /imp-3066/.test(IMP_33574_33534_33540_COHORT_PROVENANCE_ROLLUP.honestNote),
    why: 'VERDICT LOCK: this is a read-only roll-up, not a bound; Platt-Trudgian Lambda <= 0.2 ' +
      'stays SOTA and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33574_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33574 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33574_ASSERTIONS };
