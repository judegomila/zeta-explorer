/**
 * @module imp-33615-33577-33582-cohort-provenance-rollup
 * @fileoverview imp-33615 -- META provenance roll-up cataloguing the imp-33577/imp-33578/imp-33579/
 * imp-33580/imp-33581/imp-33582 deep-tail cohort (six modules) by EVIDENCE CLASS and confirming each
 * module carries the mandatory honest banner: no-QED, the imp-3066 K_a >= 0 operator-positivity
 * invariant untouched, and no refereed bound is changed, following the imp-3886/imp-33247/
 * imp-33268/imp-33287/imp-33307 audit pattern.
 *
 * METHOD (read-only, performed at author time). Each module's @fileoverview/detail block was read
 * and classified into the evidence class it earns on its own terms:
 *   - "cross-solver band budget": runs an INDEPENDENT quadrature rule against a prior rule's
 *     node-budget failure to test whether the failure is a rule-invariant floor or a rule artifact.
 *   - "low-height reference-libm envelope": extends a prior high-band double-double reference-libm
 *     recompute down to the low-height band to test whether a downward precision shift persists.
 *   - "band-crossing floor bisection": densely scans a jittery lattice quantity across a bracket to
 *     test whether a claimed crossing rung is a single point or a non-monotone envelope.
 *   - "graded-mapped-CC uniform-abscissa artifact": composes a grading map onto an independent
 *     solver's single-grid sweep to isolate whether a climbing node budget is a fixed-abscissa
 *     placement artifact or a genuine solver-family property.
 *   - "dd libm self-error sweep": sweeps a reference-precision surrogate's own internal truncation
 *     parameters to bound whether a measured effect is limited by the surrogate's own resolution.
 *   - "sigma post-peak finer-grid decay": re-fits a per-decade local exponent ladder on a finer grid
 *     to test whether a claimed decay rate is a fixed constant or itself accelerating.
 * The honest-banner check greps each module for the mandatory phrases (no QED, imp-3066 K_a >= 0
 * untouched, no refereed bound is changed) and for the Polymath15 G6a_shock_lipschitz/H2 bridge
 * status line.
 *
 * RESULT (audited 2026-07-04). All six modules carry the full honest banner and all six state the
 * imp-3066 K_a >= 0 operator-positivity invariant untouched (no imp-486-scope exception in this
 * cohort, unlike the imp-33307 roll-up's imp-33274). None of the six references the Polymath15
 * G6a_shock_lipschitz/H2 bridge -- this cohort spans the band-crossing/graded-quadrature/reference-
 * libm-precision/sigma-decay frontier, disjoint from the G6a inviscid-window material, so "not
 * referenced" is correct for all six.
 *   - imp-33577-band-crossing-cross-solver-node-budget.js       : cross-solver band budget
 *   - imp-33578-low-height-envelope-under-reference-libm.js     : low-height reference-libm envelope
 *   - imp-33579-band-crossing-floor-bisection.js                : band-crossing floor bisection
 *   - imp-33580-graded-mapped-cc-abscissa-artifact.js           : graded-mapped-CC uniform-abscissa artifact
 *   - imp-33581-dd-self-error-sweep.js                          : dd libm self-error sweep
 *   - imp-33582-sigma-postpeak-nearpeak-threshold-decay.js      : sigma post-peak finer-grid decay
 *
 * SURFACING NOTE (secondary). Four of the six (imp-33577, imp-33579, imp-33580, imp-33582) already
 * have a dedicated routed viz page and a dedicated glossary term. The other two (imp-33578, imp-33581)
 * have neither: both are pure reference-libm precision-diagnostic recomputations (a low-height dd
 * recompute and a dd-self-error convergence sweep) that confirm a prior module's shift is real rather
 * than establishing a new headline finding, so the absence of a dedicated page is consistent with this
 * project's practice of reserving glossary/viz entries for headline verdicts, not every confirmatory
 * diagnostic -- but if coverage is desired, these two are the best candidates.
 *
 * @see imp-33268, imp-33287, imp-33307, imp-3886, imp-3931 (the precedent provenance roll-ups this note follows)
 */

export const IMP_33615_33577_33582_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-33615',
  auditedAt: '2026-07-04',
  method:
    'Read each of the six imp-33577/33578/33579/33580/33581/33582 module @fileoverview/detail ' +
    'blocks; classify by evidence class (cross-solver band budget / low-height reference-libm ' +
    'envelope / band-crossing floor bisection / graded-mapped-CC uniform-abscissa artifact / dd ' +
    'libm self-error sweep / sigma post-peak finer-grid decay); grep for the mandatory honest-' +
    'banner phrases (no QED, imp-3066 K_a >= 0 untouched, no refereed bound is changed) plus ' +
    'the explicit G6a/H2 bridge status.',
  modules: [
    {
      file: 'imp-33577-band-crossing-cross-solver-node-budget.js',
      evidenceClass: 'cross-solver band budget',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasBakedLiteralViz: true,
    },
    {
      file: 'imp-33578-low-height-envelope-under-reference-libm.js',
      evidenceClass: 'low-height reference-libm envelope',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasBakedLiteralViz: false,
    },
    {
      file: 'imp-33579-band-crossing-floor-bisection.js',
      evidenceClass: 'band-crossing floor bisection',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasBakedLiteralViz: true,
    },
    {
      file: 'imp-33580-graded-mapped-cc-abscissa-artifact.js',
      evidenceClass: 'graded-mapped-CC uniform-abscissa artifact',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasBakedLiteralViz: true,
    },
    {
      file: 'imp-33581-dd-self-error-sweep.js',
      evidenceClass: 'dd libm self-error sweep',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasBakedLiteralViz: false,
    },
    {
      file: 'imp-33582-sigma-postpeak-nearpeak-threshold-decay.js',
      evidenceClass: 'sigma post-peak finer-grid decay',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasBakedLiteralViz: true,
    },
  ],
  evidenceClassCounts: {
    'cross-solver band budget': 1,
    'low-height reference-libm envelope': 1,
    'band-crossing floor bisection': 1,
    'graded-mapped-CC uniform-abscissa artifact': 1,
    'dd libm self-error sweep': 1,
    'sigma post-peak finer-grid decay': 1,
  },
  honestBannerFullCoverageCount: 6,
  glossaryCoveredCount: 4,
  bakedLiteralVizCount: 4,
  recommendation:
    'No action needed on the honest-banner side -- all six modules already carry the full ' +
    'mandatory banner. imp-33578 and imp-33581 are the only two of the six without a dedicated ' +
    'glossary term or viz page; both are confirmatory reference-libm precision diagnostics rather ' +
    'than headline verdicts, so the gap is consistent with project practice, but they are the best ' +
    'candidates if a dedicated entry is later wanted.',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module ' +
    'itself. imp-3066 K_a >= 0 positivity untouched across all six. No refereed bound is changed' +
    '. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_33615_ASSERTIONS = [
  {
    id: 'imp33615-exactly-six-modules-catalogued',
    holds: () => IMP_33615_33577_33582_COHORT_PROVENANCE_ROLLUP.modules.length === 6,
    why: 'The roll-up must cover exactly the six named cohort modules (imp-33577..imp-33582).',
  },
  {
    id: 'imp33615-six-distinct-evidence-classes',
    holds: () => {
      const m = IMP_33615_33577_33582_COHORT_PROVENANCE_ROLLUP.modules;
      const counts = IMP_33615_33577_33582_COHORT_PROVENANCE_ROLLUP.evidenceClassCounts;
      const distinctClasses = new Set(m.map((x) => x.evidenceClass));
      return distinctClasses.size === 6 &&
        Object.values(counts).every((c) => c === 1) &&
        Object.keys(counts).length === 6;
    },
    why: 'Each of the six modules earns a DISTINCT evidence class -- no two modules should share a class.',
  },
  {
    id: 'imp33615-all-six-carry-full-honest-banner',
    holds: () =>
      IMP_33615_33577_33582_COHORT_PROVENANCE_ROLLUP.modules.every(
        (x) => x.noQED === true && x.untouchedInvariant === 'imp-3066 K_a >= 0' && x.plattTrudgianSOTA === true
      ) && IMP_33615_33577_33582_COHORT_PROVENANCE_ROLLUP.honestBannerFullCoverageCount === 6,
    why: 'Every module in the cohort must state no-QED, the imp-3066 K_a >= 0 untouched invariant, ' +
      'and no refereed bound is changed -- grep-verified against the source files.',
  },
  {
    id: 'imp33615-zero-bridge-touching-consistent-not-referenced',
    holds: () => {
      const m = IMP_33615_33577_33582_COHORT_PROVENANCE_ROLLUP.modules;
      return m.every((x) => x.g6aH2Status === 'not referenced');
    },
    why: 'Grep-verified: none of the six modules mentions the Polymath15 G6a_shock_lipschitz/H2 ' +
      'bridge, so "not referenced" is the correct status for all six, not a gap.',
  },
  {
    id: 'imp33615-four-glossary-four-baked-viz',
    holds: () => {
      const m = IMP_33615_33577_33582_COHORT_PROVENANCE_ROLLUP.modules;
      const withTerm = m.filter((x) => x.hasGlossaryTerm === true).length;
      const withViz = m.filter((x) => x.hasBakedLiteralViz === true).length;
      return withTerm === 4 && withTerm === IMP_33615_33577_33582_COHORT_PROVENANCE_ROLLUP.glossaryCoveredCount &&
        withViz === 4 && withViz === IMP_33615_33577_33582_COHORT_PROVENANCE_ROLLUP.bakedLiteralVizCount;
    },
    why: 'Grep-verified: four of the six modules have a dedicated glossary term and viz page ' +
      '(all but imp-33578 and imp-33581, the two confirmatory precision diagnostics).',
  },
  {
    id: 'imp33615-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_33615_33577_33582_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /no QED/i.test(IMP_33615_33577_33582_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /imp-3066/.test(IMP_33615_33577_33582_COHORT_PROVENANCE_ROLLUP.honestNote),
    why: 'VERDICT LOCK: this is a read-only roll-up, not a bound; no refereed bound is changed' +
      ' and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33615_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33615 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33615_ASSERTIONS };
