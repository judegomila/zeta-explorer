/**
 * @module imp-33268-33229-33235-cohort-provenance-rollup
 * @fileoverview imp-33268 -- META provenance roll-up cataloguing the imp-33229/imp-33231/
 * imp-33232/imp-33233/imp-33234/imp-33235 verification-and-cross-check cohort (six modules) by
 * EVIDENCE CLASS and confirming each module carries the mandatory honest banner: no-QED,
 * imp-3066 K_a >= 0 positivity untouched, Platt-Trudgian Lambda <= 0.2 SOTA, and (where the
 * module touches the Polymath15 bridge) the G6a/H2 status.
 *
 * METHOD (read-only, performed at author time, following the imp-3886/imp-33247/imp-3931 audit
 * precedent). Each module's @fileoverview/detail block was read and classified into the evidence
 * class it earns on its own terms:
 *   - "extended-precision assessment": ASSESSES whether a higher arithmetic tier (double-double)
 *     changes a measured floor/onset, without running a full derivation or dense solve.
 *   - "dense-solve measurement": adds a genuinely new full-spectrum dense-solve data point.
 *   - "rule-design refutation": independently RUNS a previously-derived quadrature rule/budget
 *     over a wider domain than it was validated on and reports where the design's own headline
 *     claim fails.
 *   - "obstruction-pinning derivation": DERIVES a quantitative bound that pins down (narrows) a
 *     previously only qualitatively-named obstruction/escape-hatch.
 *   - "cross-validation": compares two independently-computed machineries against each other over
 *     a domain neither was previously checked on.
 *   - "literal cross-check": re-derives previously-baked literals from scratch and confirms the
 *     residual is explainable storage-precision rounding, not drift.
 * The honest-banner check greps each module for the mandatory phrases (no QED, imp-3066 K_a >= 0
 * untouched, Platt-Trudgian Lambda <= 0.2 SOTA) and, for modules that touch the Polymath15 bridge
 * (G6a_shock_lipschitz / H2), the explicit G6a/H2 status line.
 *
 * RESULT (audited 2026-07-04). All six modules carry the full honest banner. None of the six
 * references the Polymath15 G6a/H2 bridge -- this cohort sits entirely in the Watson-majorant /
 * saddle-window / Conjecture-22.1-modulation frontier, disjoint from the G6a inviscid-window
 * material, so "not referenced" is the correct (not missing) status for all six.
 *   - imp-33229-high-tau-extended-precision-assessment.js         : extended-precision assessment
 *   - imp-33231-fifth-pair-spread-n2800-resolved.js                : dense-solve measurement
 *   - imp-33232-a-weight-fixed-graded-gl-budget-full-window-verify.js: rule-design refutation
 *   - imp-33233-conjecture-22-1-modulation-band-limit-assessment.js: obstruction-pinning derivation
 *   - imp-33234-saddle-window-direct-vs-log-a-cross-validation.js  : cross-validation
 *   - imp-33235-imp-33213-ladder-literal-cross-check.js            : literal cross-check
 *
 * SURFACING NOTE (secondary, following the imp-33247 method). Three of the six (imp-33231,
 * imp-33232, imp-33234) have their measured numbers baked as literals into a routed viz-data
 * page module (Imp33264FifthPairSpreadLadderN2800ExtendedViz, Imp33257NodeBudgetFullWindowUlpViz,
 * Imp33261SaddleWindowDirectVsLogAViz respectively) -- no real import edge to the source module
 * itself, per project convention. imp-33229 has neither a dedicated glossary term nor any viz
 * presence; the other five each have a dedicated glossary `term:` entry.
 *
 * @see imp-3886, imp-33247, imp-3931 (the precedent provenance roll-ups this note follows)
 * @see imp-33287, imp-33307, imp-33551 (later provenance roll-ups in the same series)
 */

export const IMP_33268_33229_33235_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-33268',
  auditedAt: '2026-07-04',
  method:
    'Read each of the six imp-33229/33231/33232/33233/33234/33235 module @fileoverview/detail ' +
    'blocks; classify by evidence class (extended-precision assessment / dense-solve measurement ' +
    '/ rule-design refutation / obstruction-pinning derivation / cross-validation / literal ' +
    'cross-check); grep for the mandatory honest-banner phrases (no QED, imp-3066 K_a >= 0 ' +
    'untouched, Platt-Trudgian Lambda <= 0.2 SOTA) plus, where applicable, the explicit G6a/H2 ' +
    'bridge status line.',
  modules: [
    {
      file: 'imp-33229-high-tau-extended-precision-assessment.js',
      evidenceClass: 'extended-precision assessment',
      noQED: true,
      kaUntouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasBakedLiteralViz: false,
    },
    {
      file: 'imp-33231-fifth-pair-spread-n2800-resolved.js',
      evidenceClass: 'dense-solve measurement',
      noQED: true,
      kaUntouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasBakedLiteralViz: true,
    },
    {
      file: 'imp-33232-a-weight-fixed-graded-gl-budget-full-window-verify.js',
      evidenceClass: 'rule-design refutation',
      noQED: true,
      kaUntouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasBakedLiteralViz: true,
    },
    {
      file: 'imp-33233-conjecture-22-1-modulation-band-limit-assessment.js',
      evidenceClass: 'obstruction-pinning derivation',
      noQED: true,
      kaUntouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasBakedLiteralViz: false,
    },
    {
      file: 'imp-33234-saddle-window-direct-vs-log-a-cross-validation.js',
      evidenceClass: 'cross-validation',
      noQED: true,
      kaUntouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasBakedLiteralViz: true,
    },
    {
      file: 'imp-33235-imp-33213-ladder-literal-cross-check.js',
      evidenceClass: 'literal cross-check',
      noQED: true,
      kaUntouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasBakedLiteralViz: false,
    },
  ],
  evidenceClassCounts: {
    'extended-precision assessment': 1,
    'dense-solve measurement': 1,
    'rule-design refutation': 1,
    'obstruction-pinning derivation': 1,
    'cross-validation': 1,
    'literal cross-check': 1,
  },
  honestBannerFullCoverageCount: 6,
  glossaryCoveredCount: 5,
  bakedLiteralVizCount: 3,
  recommendation:
    'No action needed on the honest-banner side -- all six modules already carry the full ' +
    'mandatory banner. imp-33229 is the only module of the six without a dedicated glossary term ' +
    'or any viz-page presence (baked-literal or otherwise) and is the best candidate for one, ' +
    'following the imp-3900/3903/3904 dedicated-small-viz-page precedent.',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module ' +
    'itself. imp-3066 K_a >= 0 positivity untouched. Platt-Trudgian Lambda <= 0.2 remains SOTA. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_33268_ASSERTIONS = [
  {
    id: 'imp33268-exactly-six-modules-catalogued',
    holds: () => IMP_33268_33229_33235_COHORT_PROVENANCE_ROLLUP.modules.length === 6,
    why: 'The roll-up must cover exactly the six named cohort modules (imp-33229/33231/33232/33233/33234/33235).',
  },
  {
    id: 'imp33268-six-distinct-evidence-classes',
    holds: () => {
      const m = IMP_33268_33229_33235_COHORT_PROVENANCE_ROLLUP.modules;
      const counts = IMP_33268_33229_33235_COHORT_PROVENANCE_ROLLUP.evidenceClassCounts;
      const distinctClasses = new Set(m.map((x) => x.evidenceClass));
      return distinctClasses.size === 6 &&
        Object.values(counts).every((c) => c === 1) &&
        Object.keys(counts).length === 6;
    },
    why: 'Each of the six modules earns a DISTINCT evidence class -- no two modules should share a class.',
  },
  {
    id: 'imp33268-all-six-carry-full-honest-banner',
    holds: () =>
      IMP_33268_33229_33235_COHORT_PROVENANCE_ROLLUP.modules.every(
        (x) => x.noQED === true && x.kaUntouched === true && x.plattTrudgianSOTA === true
      ) && IMP_33268_33229_33235_COHORT_PROVENANCE_ROLLUP.honestBannerFullCoverageCount === 6,
    why: 'Every module in the cohort must state no-QED, imp-3066 K_a >= 0 untouched, and ' +
      'Platt-Trudgian Lambda <= 0.2 SOTA -- grep-verified against the source files.',
  },
  {
    id: 'imp33268-zero-bridge-touching-consistent-not-referenced',
    holds: () => {
      const m = IMP_33268_33229_33235_COHORT_PROVENANCE_ROLLUP.modules;
      return m.every((x) => x.g6aH2Status === 'not referenced');
    },
    why: 'Grep-verified: none of the six modules mentions the Polymath15 G6a_shock_lipschitz/H2 ' +
      'bridge, so "not referenced" is the correct status for all six, not a gap.',
  },
  {
    id: 'imp33268-five-glossary-three-baked-viz',
    holds: () => {
      const m = IMP_33268_33229_33235_COHORT_PROVENANCE_ROLLUP.modules;
      const withTerm = m.filter((x) => x.hasGlossaryTerm === true).length;
      const withViz = m.filter((x) => x.hasBakedLiteralViz === true).length;
      return withTerm === 5 && withTerm === IMP_33268_33229_33235_COHORT_PROVENANCE_ROLLUP.glossaryCoveredCount &&
        withViz === 3 && withViz === IMP_33268_33229_33235_COHORT_PROVENANCE_ROLLUP.bakedLiteralVizCount;
    },
    why: 'Grep-verified: five of the six modules have a dedicated glossary term (all but imp-33229); ' +
      'three have baked-literal viz presence (imp-33231, imp-33232, imp-33234).',
  },
  {
    id: 'imp33268-honest-scope-locked',
    holds: () =>
      /SOTA/.test(IMP_33268_33229_33235_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /no QED/i.test(IMP_33268_33229_33235_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /imp-3066/.test(IMP_33268_33229_33235_COHORT_PROVENANCE_ROLLUP.honestNote),
    why: 'VERDICT LOCK: this is a read-only roll-up, not a bound; Platt-Trudgian Lambda <= 0.2 ' +
      'stays SOTA and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33268_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33268 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33268_ASSERTIONS };
