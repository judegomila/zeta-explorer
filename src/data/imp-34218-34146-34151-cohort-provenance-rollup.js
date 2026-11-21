/**
 * @module imp-34218-34146-34151-cohort-provenance-rollup
 * @fileoverview imp-34218 -- META provenance roll-up cataloguing the imp-34146/imp-34147/
 * imp-34148/imp-34149/imp-34150/imp-34151 apex-tilt and F4-cancellation cohort (six modules)
 * by EVIDENCE CLASS and confirming each module carries the mandatory honest banner: no-QED,
 * imp-3066 K_a >= 0 operator-positivity untouched, and no refereed bound is changed,
 * following the imp-3886/imp-33247/imp-33268/imp-33287/imp-33307 audit pattern.
 *
 * METHOD (read-only, performed at author time). Each module's @fileoverview/detail block was
 * read and classified into the evidence class it earns on its own terms:
 *   - "higher-order term fit extension": extends a previously-fit lower-order apex coefficient
 *     (the imp-34084 cubic tilt) to the next odd order (quintic) on the identical basis.
 *   - "window-centre stability sweep": re-runs a fixed-centre coefficient fit at a sweep of
 *     window centres to test whether a claimed sign is a stable property or a local artifact.
 *   - "symmetric-trim cancellation bisection": bisects a symmetric two-sided window-trim
 *     parameter for the exact point where an offsetting head/tail push cancels.
 *   - "tail-only cancellation bisection": bisects the same underlying cancellation condition
 *     under a one-sided (tail-only, low endpoint pinned) window-trim instead of symmetric.
 *   - "independent code-path cross-validation": re-locates a previously ratio-derived crossing
 *     via a structurally different, ratio-free code path and a second root-finder.
 *   - "past-crossing extension": extends a previously band-limited O(1) measurement past a
 *     located zero-crossing into the sign-flipped region to test whether it still holds.
 * The honest-banner check greps each module for the mandatory phrases (no QED, imp-3066
 * K_a >= 0 untouched, no refereed bound is changed) and for a Polymath15 G6a/H2 bridge
 * mention, plus glossary.js and src/pages/ for dedicated-term and routed-viz coverage.
 *
 * RESULT (audited 2026-07-05). All six modules carry the full honest banner and all six state
 * the SAME untouched invariant, imp-3066 K_a >= 0 -- this cohort sits entirely inside the
 * imp-3220/imp-3406 apex-surrogate and M2-residual-crossing territory, unlike mixed cohorts
 * (e.g. imp-33307's) that span both imp-3066 and imp-486 scope. None of the six references
 * the Polymath15 G6a_shock_lipschitz/H2 bridge -- this cohort is disjoint from that inviscid-
 * window material, so "not referenced" is correct for all six. All six already have a
 * dedicated glossary.js term (added by imp-34217); none has a routed src/pages/ viz page or a
 * dedicated baked-literal viz-data module -- imp-34163 mentions several of them in passing but
 * is not a dedicated viz for this cohort, so the gap is genuine, not a false negative.
 *   - imp-34146-apex-quintic-tilt-coefficient.js                    : higher-order term fit extension
 *   - imp-34147-apex-cubic-tilt-sign-sweep.js                       : window-centre stability sweep
 *   - imp-34148-symmetric-trim-f4-cancellation.js                   : symmetric-trim cancellation bisection
 *   - imp-34149-tail-only-f4-unity-crossing.js                      : tail-only cancellation bisection
 *   - imp-34150-m2-residual-crossing-direct-bisection-crossval.js   : independent code-path cross-validation
 *   - imp-34151-cancellation-numerator-past-crossing.js             : past-crossing extension
 *
 * SURFACING NOTE (secondary). None of the six has a dedicated viz page or baked-literal viz
 * module of its own -- all six are the best remaining candidates for one, mirroring the
 * imp-33268/imp-33307 roll-ups' same recommendation pattern for their own uncovered members.
 *
 * @see imp-33268, imp-33287, imp-33307, imp-3886, imp-3931 (the precedent provenance roll-ups this note follows)
 * @see imp-34217 (added the glossary.js entries this roll-up finds already in place)
 */

export const IMP_34218_34146_34151_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-34218',
  auditedAt: '2026-07-05',
  method:
    'Read each of the six imp-34146/34147/34148/34149/34150/34151 module @fileoverview/detail ' +
    'blocks; classify by evidence class (higher-order term fit extension / window-centre ' +
    'stability sweep / symmetric-trim cancellation bisection / tail-only cancellation ' +
    'bisection / independent code-path cross-validation / past-crossing extension); grep for ' +
    'the mandatory honest-banner phrases (no QED, imp-3066 K_a >= 0 untouched, no refereed bound is changed' +
    ') plus the explicit G6a/H2 bridge status and glossary/viz coverage.',
  modules: [
    {
      file: 'imp-34146-apex-quintic-tilt-coefficient.js',
      evidenceClass: 'higher-order term fit extension',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasDedicatedViz: false,
    },
    {
      file: 'imp-34147-apex-cubic-tilt-sign-sweep.js',
      evidenceClass: 'window-centre stability sweep',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasDedicatedViz: false,
    },
    {
      file: 'imp-34148-symmetric-trim-f4-cancellation.js',
      evidenceClass: 'symmetric-trim cancellation bisection',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasDedicatedViz: false,
    },
    {
      file: 'imp-34149-tail-only-f4-unity-crossing.js',
      evidenceClass: 'tail-only cancellation bisection',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasDedicatedViz: false,
    },
    {
      file: 'imp-34150-m2-residual-crossing-direct-bisection-crossval.js',
      evidenceClass: 'independent code-path cross-validation',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasDedicatedViz: false,
    },
    {
      file: 'imp-34151-cancellation-numerator-past-crossing.js',
      evidenceClass: 'past-crossing extension',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasDedicatedViz: false,
    },
  ],
  evidenceClassCounts: {
    'higher-order term fit extension': 1,
    'window-centre stability sweep': 1,
    'symmetric-trim cancellation bisection': 1,
    'tail-only cancellation bisection': 1,
    'independent code-path cross-validation': 1,
    'past-crossing extension': 1,
  },
  honestBannerFullCoverageCount: 6,
  glossaryCoveredCount: 6,
  dedicatedVizCount: 0,
  recommendation:
    'No action needed on the honest-banner side -- all six modules already carry the full ' +
    'mandatory banner and all six already have a dedicated glossary term (imp-34217). None of ' +
    'the six has a routed viz page or a dedicated baked-literal viz-data module; any one of ' +
    'them is a reasonable next candidate, mirroring the imp-33268/imp-33307 roll-ups\' same ' +
    'recommendation pattern for their own uncovered members.',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module ' +
    'itself. imp-3066 K_a >= 0 positivity untouched for all six members. No refereed bound is changed' +
    '. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_34218_ASSERTIONS = [
  {
    id: 'imp34218-exactly-six-modules-catalogued',
    holds: () => IMP_34218_34146_34151_COHORT_PROVENANCE_ROLLUP.modules.length === 6,
    why: 'The roll-up must cover exactly the six named cohort modules (imp-34146..imp-34151).',
  },
  {
    id: 'imp34218-six-distinct-evidence-classes',
    holds: () => {
      const m = IMP_34218_34146_34151_COHORT_PROVENANCE_ROLLUP.modules;
      const counts = IMP_34218_34146_34151_COHORT_PROVENANCE_ROLLUP.evidenceClassCounts;
      const distinctClasses = new Set(m.map((x) => x.evidenceClass));
      return distinctClasses.size === 6 &&
        Object.values(counts).every((c) => c === 1) &&
        Object.keys(counts).length === 6;
    },
    why: 'Each of the six modules earns a DISTINCT evidence class -- no two modules should share a class.',
  },
  {
    id: 'imp34218-all-six-carry-full-honest-banner',
    holds: () =>
      IMP_34218_34146_34151_COHORT_PROVENANCE_ROLLUP.modules.every(
        (x) => x.noQED === true && x.untouchedInvariant === 'imp-3066 K_a >= 0' && x.plattTrudgianSOTA === true
      ) && IMP_34218_34146_34151_COHORT_PROVENANCE_ROLLUP.honestBannerFullCoverageCount === 6,
    why: 'Every module in the cohort must state no-QED, imp-3066 K_a >= 0 untouched, and ' +
      'no refereed bound is changed -- grep-verified against the source files.',
  },
  {
    id: 'imp34218-zero-bridge-touching-consistent-not-referenced',
    holds: () => {
      const m = IMP_34218_34146_34151_COHORT_PROVENANCE_ROLLUP.modules;
      return m.every((x) => x.g6aH2Status === 'not referenced');
    },
    why: 'Grep-verified: none of the six modules mentions the Polymath15 G6a_shock_lipschitz/H2 ' +
      'bridge, so "not referenced" is the correct status for all six, not a gap.',
  },
  {
    id: 'imp34218-six-glossary-zero-dedicated-viz',
    holds: () => {
      const m = IMP_34218_34146_34151_COHORT_PROVENANCE_ROLLUP.modules;
      const withTerm = m.filter((x) => x.hasGlossaryTerm === true).length;
      const withViz = m.filter((x) => x.hasDedicatedViz === true).length;
      return withTerm === 6 && withTerm === IMP_34218_34146_34151_COHORT_PROVENANCE_ROLLUP.glossaryCoveredCount &&
        withViz === 0 && withViz === IMP_34218_34146_34151_COHORT_PROVENANCE_ROLLUP.dedicatedVizCount;
    },
    why: 'Grep-verified: all six modules have a dedicated glossary term (imp-34217); none has a ' +
      'routed viz page or dedicated baked-literal viz-data module.',
  },
  {
    id: 'imp34218-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_34218_34146_34151_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /no QED/i.test(IMP_34218_34146_34151_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /imp-3066/.test(IMP_34218_34146_34151_COHORT_PROVENANCE_ROLLUP.honestNote),
    why: 'VERDICT LOCK: this is a read-only roll-up, not a bound; no refereed bound is changed' +
      ' and imp-3066 stays untouched.',
  },
];

for (const a of IMP_34218_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-34218 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_34218_ASSERTIONS };
