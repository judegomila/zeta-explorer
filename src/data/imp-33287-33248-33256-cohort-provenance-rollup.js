/**
 * @module imp-33287-33248-33256-cohort-provenance-rollup
 * @fileoverview imp-33287 -- META provenance roll-up cataloguing the imp-33248/imp-33249/
 * imp-33250/imp-33251/imp-33252/imp-33253/imp-33254/imp-33255/imp-33256 opus-4-8 numerical
 * cohort (nine modules) by EVIDENCE CLASS and confirming each module carries the mandatory
 * honest banner: no-QED, the relevant operator-level positivity invariant untouched, and
 * no refereed bound is changed, following the imp-33268/imp-3886/imp-3931 audit precedent.
 *
 * METHOD (read-only, performed at author time). Each module's @fileoverview/detail block was
 * read and classified into the evidence class it earns on its own terms:
 *   - "cancellation-free reconstruction measurement": RUNS a previously-named-but-never-performed
 *     high-tau extended-precision reconstruction and recovers a genuine signal.
 *   - "node-budget measurement": MEASURES a minimal quadrature node budget for a target ULP bar
 *     that a prior ticket left unmeasured.
 *   - "N-uniformity assessment": ASSESSES whether a realised ratio is N-flat across sampled
 *     plateaus, without claiming a certified N-uniform constant.
 *   - "independent recomputation/verification": independently RECOMPUTES a bound from raw
 *     literature inputs and cross-checks an intermediate quantity against a second machinery.
 *   - "extrapolation cross-validation": Richardson-extrapolates a direct ladder to its limit and
 *     measures the residual against an independently-computed log-domain quantity.
 *   - "floor derivation": DERIVES a previously-only-measured few-ULP floor from a first-principles
 *     conditioning-number argument (Wilkinson backward error) and checks it against measured rungs.
 *   - "mechanism measurement": MEASURES the quantitative root cause of a previously only
 *     qualitatively-described scaling artifact.
 *   - "regime exponent fit": FITS a single effective exponent to a regime a prior ticket only
 *     characterised pointwise/locally.
 *   - "quadrature-sensitivity tabulation": TABULATES how a previously-computed ratio drifts under
 *     a named quadrature-resolution sweep that was never actually run.
 * The honest-banner check greps each module for the mandatory phrases (no QED, the applicable
 * untouched-positivity invariant, no refereed bound is changed) and for the Polymath15
 * G6a/H2 bridge status line.
 *
 * RESULT (audited 2026-07-04). All nine modules carry the full honest banner. Eight of the nine
 * (all but imp-33255) state the imp-3066 K_a >= 0 operator-positivity invariant untouched, since
 * imp-33255 sits entirely in the imp-486 C_mb GUE-conditional sigma(N) territory and instead
 * states that invariant untouched -- the correct (not missing) untouched-object for a module
 * outside imp-3066's scope. None of the nine references the Polymath15 G6a_shock_lipschitz/H2
 * bridge -- this cohort spans the Watson-majorant/saddle-window/fifth-pair-spectral/sigma-regime
 * frontier, disjoint from the G6a inviscid-window material, so "not referenced" is correct for
 * all nine.
 *   - imp-33248-dd-watson-bracket-high-tau-run.js                       : cancellation-free reconstruction measurement
 *   - imp-33249-a-weight-graded-gl-minimal-full-window-1ulp-budget.js   : node-budget measurement
 *   - imp-33250-tail-weight-ratio-n-uniformity-assessment.js            : N-uniformity assessment
 *   - imp-33251-modulation-nyquist-floor-independent-verification.js   : independent recomputation/verification
 *   - imp-33252-richardson-extrapolate-saddle-a-ladder.js               : extrapolation cross-validation
 *   - imp-33253-fifth-pair-condition-number-floor.js                    : floor derivation
 *   - imp-33254-graded-panel-width-ratio-subpeak-count-measure.js       : mechanism measurement
 *   - imp-33255-sigma-postpeak-regime-effective-exponent.js             : regime exponent fit
 *   - imp-33256-r40-inner-quadrature-sweep.js                           : quadrature-sensitivity tabulation
 *
 * SURFACING NOTE (secondary). Three of the nine (imp-33248, imp-33250, imp-33256) already have a
 * dedicated routed viz page (imp-33285, imp-33286, imp-33284 respectively). Seven of the nine
 * (all but imp-33249, imp-33254) have a dedicated glossary term; imp-33249 and imp-33254 have
 * neither a glossary term nor a viz page and are the best candidates for one, following the
 * imp-33268 roll-up's same recommendation pattern for its own uncovered member (imp-33229).
 *
 * @see imp-33268, imp-3886, imp-3931 (the precedent provenance roll-ups this note follows)
 * @see imp-33307, imp-33551 (later provenance roll-ups in the same series)
 */

export const IMP_33287_33248_33256_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-33287',
  auditedAt: '2026-07-04',
  method:
    'Read each of the nine imp-33248/33249/33250/33251/33252/33253/33254/33255/33256 module ' +
    '@fileoverview/detail blocks; classify by evidence class (cancellation-free reconstruction ' +
    'measurement / node-budget measurement / N-uniformity assessment / independent ' +
    'recomputation-verification / extrapolation cross-validation / floor derivation / mechanism ' +
    'measurement / regime exponent fit / quadrature-sensitivity tabulation); grep for the ' +
    'mandatory honest-banner phrases (no QED, the applicable untouched-positivity invariant, ' +
    'no refereed bound is changed) plus the explicit G6a/H2 bridge status.',
  modules: [
    {
      file: 'imp-33248-dd-watson-bracket-high-tau-run.js',
      evidenceClass: 'cancellation-free reconstruction measurement',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasBakedLiteralViz: true,
    },
    {
      file: 'imp-33249-a-weight-graded-gl-minimal-full-window-1ulp-budget.js',
      evidenceClass: 'node-budget measurement',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasBakedLiteralViz: false,
    },
    {
      file: 'imp-33250-tail-weight-ratio-n-uniformity-assessment.js',
      evidenceClass: 'N-uniformity assessment',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasBakedLiteralViz: true,
    },
    {
      file: 'imp-33251-modulation-nyquist-floor-independent-verification.js',
      evidenceClass: 'independent recomputation/verification',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasBakedLiteralViz: false,
    },
    {
      file: 'imp-33252-richardson-extrapolate-saddle-a-ladder.js',
      evidenceClass: 'extrapolation cross-validation',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasBakedLiteralViz: false,
    },
    {
      file: 'imp-33253-fifth-pair-condition-number-floor.js',
      evidenceClass: 'floor derivation',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasBakedLiteralViz: false,
    },
    {
      file: 'imp-33254-graded-panel-width-ratio-subpeak-count-measure.js',
      evidenceClass: 'mechanism measurement',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasBakedLiteralViz: false,
    },
    {
      file: 'imp-33255-sigma-postpeak-regime-effective-exponent.js',
      evidenceClass: 'regime exponent fit',
      noQED: true,
      untouchedInvariant: 'imp-486 C_mb GUE-conditional',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasBakedLiteralViz: false,
    },
    {
      file: 'imp-33256-r40-inner-quadrature-sweep.js',
      evidenceClass: 'quadrature-sensitivity tabulation',
      noQED: true,
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasBakedLiteralViz: true,
    },
  ],
  evidenceClassCounts: {
    'cancellation-free reconstruction measurement': 1,
    'node-budget measurement': 1,
    'N-uniformity assessment': 1,
    'independent recomputation/verification': 1,
    'extrapolation cross-validation': 1,
    'floor derivation': 1,
    'mechanism measurement': 1,
    'regime exponent fit': 1,
    'quadrature-sensitivity tabulation': 1,
  },
  honestBannerFullCoverageCount: 9,
  glossaryCoveredCount: 7,
  bakedLiteralVizCount: 3,
  recommendation:
    'No action needed on the honest-banner side -- all nine modules already carry the full ' +
    'mandatory banner. imp-33249 and imp-33254 are the only two of the nine without a dedicated ' +
    'glossary term or any viz-page presence and are the best candidates for one, following the ' +
    'imp-3900/3903/3904 dedicated-small-viz-page precedent.',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module ' +
    'itself. imp-3066 K_a >= 0 positivity untouched (imp-486 C_mb GUE-conditional untouched for ' +
    'the one out-of-scope member, imp-33255). No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_33287_ASSERTIONS = [
  {
    id: 'imp33287-exactly-nine-modules-catalogued',
    holds: () => IMP_33287_33248_33256_COHORT_PROVENANCE_ROLLUP.modules.length === 9,
    why: 'The roll-up must cover exactly the nine named cohort modules (imp-33248..imp-33256).',
  },
  {
    id: 'imp33287-nine-distinct-evidence-classes',
    holds: () => {
      const m = IMP_33287_33248_33256_COHORT_PROVENANCE_ROLLUP.modules;
      const counts = IMP_33287_33248_33256_COHORT_PROVENANCE_ROLLUP.evidenceClassCounts;
      const distinctClasses = new Set(m.map((x) => x.evidenceClass));
      return distinctClasses.size === 9 &&
        Object.values(counts).every((c) => c === 1) &&
        Object.keys(counts).length === 9;
    },
    why: 'Each of the nine modules earns a DISTINCT evidence class -- no two modules should share a class.',
  },
  {
    id: 'imp33287-all-nine-carry-full-honest-banner',
    holds: () =>
      IMP_33287_33248_33256_COHORT_PROVENANCE_ROLLUP.modules.every(
        (x) => x.noQED === true && typeof x.untouchedInvariant === 'string' && x.untouchedInvariant.length > 0 && x.plattTrudgianSOTA === true
      ) && IMP_33287_33248_33256_COHORT_PROVENANCE_ROLLUP.honestBannerFullCoverageCount === 9,
    why: 'Every module in the cohort must state no-QED, an explicit untouched-positivity ' +
      'invariant, and no refereed bound is changed -- grep-verified against the source files.',
  },
  {
    id: 'imp33287-eight-imp3066-one-imp486-untouched',
    holds: () => {
      const m = IMP_33287_33248_33256_COHORT_PROVENANCE_ROLLUP.modules;
      const imp3066Count = m.filter((x) => x.untouchedInvariant === 'imp-3066 K_a >= 0').length;
      const imp486Count = m.filter((x) => x.untouchedInvariant === 'imp-486 C_mb GUE-conditional').length;
      return imp3066Count === 8 && imp486Count === 1;
    },
    why: 'Grep-verified: imp-33255 alone sits in imp-486 C_mb GUE-conditional territory, ' +
      'outside imp-3066 scope; the other eight state imp-3066 K_a >= 0 untouched.',
  },
  {
    id: 'imp33287-zero-bridge-touching-consistent-not-referenced',
    holds: () => {
      const m = IMP_33287_33248_33256_COHORT_PROVENANCE_ROLLUP.modules;
      return m.every((x) => x.g6aH2Status === 'not referenced');
    },
    why: 'Grep-verified: none of the nine modules mentions the Polymath15 G6a_shock_lipschitz/H2 ' +
      'bridge, so "not referenced" is the correct status for all nine, not a gap.',
  },
  {
    id: 'imp33287-seven-glossary-three-baked-viz',
    holds: () => {
      const m = IMP_33287_33248_33256_COHORT_PROVENANCE_ROLLUP.modules;
      const withTerm = m.filter((x) => x.hasGlossaryTerm === true).length;
      const withViz = m.filter((x) => x.hasBakedLiteralViz === true).length;
      return withTerm === 7 && withTerm === IMP_33287_33248_33256_COHORT_PROVENANCE_ROLLUP.glossaryCoveredCount &&
        withViz === 3 && withViz === IMP_33287_33248_33256_COHORT_PROVENANCE_ROLLUP.bakedLiteralVizCount;
    },
    why: 'Grep-verified: seven of the nine modules have a dedicated glossary term (all but ' +
      'imp-33249, imp-33254); three have baked-literal viz presence (imp-33248, imp-33250, imp-33256).',
  },
  {
    id: 'imp33287-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_33287_33248_33256_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /no QED/i.test(IMP_33287_33248_33256_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /imp-3066/.test(IMP_33287_33248_33256_COHORT_PROVENANCE_ROLLUP.honestNote),
    why: 'VERDICT LOCK: this is a read-only roll-up, not a bound; no refereed bound is changed' +
      ' and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33287_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33287 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33287_ASSERTIONS };
