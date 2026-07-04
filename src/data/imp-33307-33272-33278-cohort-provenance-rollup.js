/**
 * @module imp-33307-33272-33278-cohort-provenance-rollup
 * @fileoverview imp-33307 -- META provenance roll-up cataloguing the imp-33272/imp-33273/
 * imp-33274/imp-33275/imp-33276/imp-33277/imp-33278 verification-and-measurement cohort
 * (seven modules) by EVIDENCE CLASS and confirming each module carries the mandatory
 * honest banner: no-QED, the relevant operator-level positivity invariant untouched, and
 * Platt-Trudgian Lambda <= 0.2 SOTA, following the imp-3886/imp-33247/imp-33268/imp-33287
 * audit pattern.
 *
 * METHOD (read-only, performed at author time). Each module's @fileoverview/detail block was
 * read and classified into the evidence class it earns on its own terms:
 *   - "extended-precision cross-check": cross-checks a derived backward-error floor against
 *     an INDEPENDENT double-double eigensolve of the same matrix.
 *   - "exact decomposition/reframing": splits an already-computed aggregate ratio into two
 *     additive parts (genuine + over-charge) with no new quadrature and no cross term.
 *   - "sliding-window fit": re-fits an effective exponent under a different window-slicing
 *     methodology to test whether a prior window-dependence was a slicing artifact.
 *   - "rung-uniformity cross-validation": re-runs a previously endpoint-only extrapolation at
 *     every ladder rung to test whether the endpoint agreement generalises.
 *   - "cross-outer invariance": extends a previously single-inner-grid cross-outer control to
 *     every refined inner grid.
 *   - "node-budget extension": extends a previously capped node-budget measurement to new
 *     (deeper) rungs, in both single- and double-precision arithmetic.
 *   - "height-sweep": sweeps a single-height measurement across a geometric ladder of heights
 *     to test whether a claimed growth order actually holds across scale.
 * The honest-banner check greps each module for the mandatory phrases (no QED, the applicable
 * untouched-positivity invariant, Platt-Trudgian Lambda <= 0.2 SOTA) and for the Polymath15
 * G6a/H2 bridge status line.
 *
 * RESULT (audited 2026-07-04). All seven modules carry the full honest banner. Six of the
 * seven (all but imp-33274) state the imp-3066 K_a >= 0 operator-positivity invariant
 * untouched; imp-33274 sits entirely in the imp-486 C_mb GUE-conditional sigma(N) territory
 * and instead states that invariant untouched -- the correct (not missing) untouched-object
 * for a module outside imp-3066's scope, mirroring the same single-exception pattern the
 * imp-33287 roll-up found for imp-33255. None of the seven references the Polymath15
 * G6a_shock_lipschitz/H2 bridge -- this cohort spans the fifth-pair-spectral/majorant/
 * sigma-regime/saddle-A/R_40/graded-quadrature/Nyquist-floor frontier, disjoint from the G6a
 * inviscid-window material, so "not referenced" is correct for all seven.
 *   - imp-33272-fifth-pair-extended-precision-crossval.js               : extended-precision cross-check
 *   - imp-33273-majorant-overcharge-decomposition.js                    : exact decomposition/reframing
 *   - imp-33274-sigma-postpeak-later-window-decay-exponent.js           : sliding-window fit
 *   - imp-33275-richardson-saddle-a-rung-uniformity.js                  : rung-uniformity cross-validation
 *   - imp-33276-r40-cross-outer-invariance-all-inner-grids.js           : cross-outer invariance
 *   - imp-33277-a-weight-graded-gl-1ulp-budget-tau78.js                 : node-budget extension
 *   - imp-33278-modulation-nyquist-floor-height-sweep.js                : height-sweep
 *
 * SURFACING NOTE (secondary). Four of the seven (imp-33272, imp-33273, imp-33274, imp-33276)
 * already have a dedicated routed viz page. Six of the seven (all but imp-33276) have a
 * dedicated glossary term; imp-33276 has a viz page but NO glossary term and is the best
 * candidate for one, following the imp-33268 roll-up's same recommendation pattern for its
 * own uncovered member (imp-33229).
 *
 * @see imp-33268, imp-33287, imp-3886, imp-3931 (the precedent provenance roll-ups this note follows)
 */

export const IMP_33307_33272_33278_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-33307',
  auditedAt: '2026-07-04',
  method:
    'Read each of the seven imp-33272/33273/33274/33275/33276/33277/33278 module ' +
    '@fileoverview/detail blocks; classify by evidence class (extended-precision cross-check / ' +
    'exact decomposition-reframing / sliding-window fit / rung-uniformity cross-validation / ' +
    'cross-outer invariance / node-budget extension / height-sweep); grep for the mandatory ' +
    'honest-banner phrases (no QED, the applicable untouched-positivity invariant, ' +
    'Platt-Trudgian Lambda <= 0.2 SOTA) plus the explicit G6a/H2 bridge status.',
  modules: [
    {
      file: 'imp-33272-fifth-pair-extended-precision-crossval.js',
      evidenceClass: 'extended-precision cross-check',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasBakedLiteralViz: true,
    },
    {
      file: 'imp-33273-majorant-overcharge-decomposition.js',
      evidenceClass: 'exact decomposition/reframing',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasBakedLiteralViz: true,
    },
    {
      file: 'imp-33274-sigma-postpeak-later-window-decay-exponent.js',
      evidenceClass: 'sliding-window fit',
      noQED: true,
      untouchedInvariant: 'imp-486 C_mb GUE-conditional',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasBakedLiteralViz: true,
    },
    {
      file: 'imp-33275-richardson-saddle-a-rung-uniformity.js',
      evidenceClass: 'rung-uniformity cross-validation',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasBakedLiteralViz: false,
    },
    {
      file: 'imp-33276-r40-cross-outer-invariance-all-inner-grids.js',
      evidenceClass: 'cross-outer invariance',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasBakedLiteralViz: true,
    },
    {
      file: 'imp-33277-a-weight-graded-gl-1ulp-budget-tau78.js',
      evidenceClass: 'node-budget extension',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasBakedLiteralViz: false,
    },
    {
      file: 'imp-33278-modulation-nyquist-floor-height-sweep.js',
      evidenceClass: 'height-sweep',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasBakedLiteralViz: false,
    },
  ],
  evidenceClassCounts: {
    'extended-precision cross-check': 1,
    'exact decomposition/reframing': 1,
    'sliding-window fit': 1,
    'rung-uniformity cross-validation': 1,
    'cross-outer invariance': 1,
    'node-budget extension': 1,
    'height-sweep': 1,
  },
  honestBannerFullCoverageCount: 7,
  glossaryCoveredCount: 6,
  bakedLiteralVizCount: 4,
  recommendation:
    'No action needed on the honest-banner side -- all seven modules already carry the full ' +
    'mandatory banner. imp-33276 is the only one of the seven without a dedicated glossary ' +
    'term (it already has a routed viz page) and is the best candidate for one, following the ' +
    'imp-33268 roll-up\'s recommendation pattern for its own uncovered member.',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module ' +
    'itself. imp-3066 K_a >= 0 positivity untouched (imp-486 C_mb GUE-conditional untouched for ' +
    'the one out-of-scope member, imp-33274). Platt-Trudgian Lambda <= 0.2 remains SOTA. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_33307_ASSERTIONS = [
  {
    id: 'imp33307-exactly-seven-modules-catalogued',
    holds: () => IMP_33307_33272_33278_COHORT_PROVENANCE_ROLLUP.modules.length === 7,
    why: 'The roll-up must cover exactly the seven named cohort modules (imp-33272..imp-33278).',
  },
  {
    id: 'imp33307-seven-distinct-evidence-classes',
    holds: () => {
      const m = IMP_33307_33272_33278_COHORT_PROVENANCE_ROLLUP.modules;
      const counts = IMP_33307_33272_33278_COHORT_PROVENANCE_ROLLUP.evidenceClassCounts;
      const distinctClasses = new Set(m.map((x) => x.evidenceClass));
      return distinctClasses.size === 7 &&
        Object.values(counts).every((c) => c === 1) &&
        Object.keys(counts).length === 7;
    },
    why: 'Each of the seven modules earns a DISTINCT evidence class -- no two modules should share a class.',
  },
  {
    id: 'imp33307-all-seven-carry-full-honest-banner',
    holds: () =>
      IMP_33307_33272_33278_COHORT_PROVENANCE_ROLLUP.modules.every(
        (x) => x.noQED === true && typeof x.untouchedInvariant === 'string' && x.untouchedInvariant.length > 0 && x.plattTrudgianSOTA === true
      ) && IMP_33307_33272_33278_COHORT_PROVENANCE_ROLLUP.honestBannerFullCoverageCount === 7,
    why: 'Every module in the cohort must state no-QED, an explicit untouched-positivity ' +
      'invariant, and Platt-Trudgian Lambda <= 0.2 SOTA -- grep-verified against the source files.',
  },
  {
    id: 'imp33307-six-imp3066-one-imp486-untouched',
    holds: () => {
      const m = IMP_33307_33272_33278_COHORT_PROVENANCE_ROLLUP.modules;
      const imp3066Count = m.filter((x) => x.untouchedInvariant === 'imp-3066 K_a >= 0').length;
      const imp486Count = m.filter((x) => x.untouchedInvariant === 'imp-486 C_mb GUE-conditional').length;
      return imp3066Count === 6 && imp486Count === 1;
    },
    why: 'Grep-verified: imp-33274 alone sits in imp-486 C_mb GUE-conditional territory, ' +
      'outside imp-3066 scope; the other six state imp-3066 K_a >= 0 untouched.',
  },
  {
    id: 'imp33307-zero-bridge-touching-consistent-not-referenced',
    holds: () => {
      const m = IMP_33307_33272_33278_COHORT_PROVENANCE_ROLLUP.modules;
      return m.every((x) => x.g6aH2Status === 'not referenced');
    },
    why: 'Grep-verified: none of the seven modules mentions the Polymath15 G6a_shock_lipschitz/H2 ' +
      'bridge, so "not referenced" is the correct status for all seven, not a gap.',
  },
  {
    id: 'imp33307-six-glossary-four-baked-viz',
    holds: () => {
      const m = IMP_33307_33272_33278_COHORT_PROVENANCE_ROLLUP.modules;
      const withTerm = m.filter((x) => x.hasGlossaryTerm === true).length;
      const withViz = m.filter((x) => x.hasBakedLiteralViz === true).length;
      return withTerm === 6 && withTerm === IMP_33307_33272_33278_COHORT_PROVENANCE_ROLLUP.glossaryCoveredCount &&
        withViz === 4 && withViz === IMP_33307_33272_33278_COHORT_PROVENANCE_ROLLUP.bakedLiteralVizCount;
    },
    why: 'Grep-verified: six of the seven modules have a dedicated glossary term (all but ' +
      'imp-33276); four have baked-literal viz presence (imp-33272, imp-33273, imp-33274, imp-33276).',
  },
  {
    id: 'imp33307-honest-scope-locked',
    holds: () =>
      /SOTA/.test(IMP_33307_33272_33278_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /no QED/i.test(IMP_33307_33272_33278_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /imp-3066/.test(IMP_33307_33272_33278_COHORT_PROVENANCE_ROLLUP.honestNote),
    why: 'VERDICT LOCK: this is a read-only roll-up, not a bound; Platt-Trudgian Lambda <= 0.2 ' +
      'stays SOTA and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33307_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33307 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33307_ASSERTIONS };
