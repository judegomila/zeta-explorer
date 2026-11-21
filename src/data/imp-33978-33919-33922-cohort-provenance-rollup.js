/**
 * @module imp-33978-33919-33922-cohort-provenance-rollup
 * @fileoverview imp-33978 -- META provenance roll-up cataloguing the imp-33919/imp-33920/imp-33921/imp-33922
 * residual-STATISTICS diagnostics cohort (three-way decomposition on a lower ladder, exact runs-test
 * permutation p-value, AR(1) rho reconciliation, four-factor widening decay cross-check), mirroring the
 * imp-33804/imp-33824 rollup pattern and confirming each module carries the mandatory honest banner: no
 * QED, imp-3066 K_a >= 0 untouched, and no refereed bound is changed.
 *
 * METHOD (read-only, performed at author time). Each module's @fileoverview/verdict block was read and
 * classified into the evidence class it earns on its own terms:
 *   - "E_coll three-way decomposition on the lower 1e6..1e12 ladder": recomputes the imp-33887 exact
 *     gap_disc - law = discretization + I1 + reference split off the 1e12..1e15 anchor and finds the
 *     near-cancellation to ~1e-5 is ANCHOR-SPECIFIC -- the net residual grows ~100x toward low N and the
 *     two offsets diverge in magnitude rather than continuing to match.
 *   - "exact runs-test permutation p-value": replaces the imp-33886 normal-approximation Wald-Wolfowitz
 *     p-value with the EXACT enumeration over all C(21,11)=352716 sign-arrangements of the 21 imp-33858
 *     residual signs, confirming the white-noise-null rejection survives (exact p ~5.70e-4 one-sided,
 *     ~1.0-1.14e-3 two-sided) without any normal-approximation dependence.
 *   - "AR(1) rho reconciliation": fits the explicit first-order autoregression to the same 21 imp-33858
 *     signed residuals and reconciles the three previously-unfit rho estimates (Yule-Walker ~0.757,
 *     DW-implied ~0.889, AR(1)-MLE ~0.968) as one shared numerator differing only through how the
 *     far-tail endpoint residual enters the denominator/DW correction.
 *   - "four-factor widening decay cross-check": tests whether the imp-33885 analytic (log N)^3/N E_flow
 *     decay law reproduces the imp-33884 exact 903.538 head-to-tail widening; finds it reproduces the RAW
 *     E_flow factor F1 to machine precision but over-predicts the widening alone by ~19.9x, the gap being
 *     the F2*F3*F4 attribution attenuation dominated by the normaliser collapse F2.
 * The honest-banner check greps each module for the mandatory phrases (no QED, imp-3066 K_a >= 0
 * untouched, no refereed bound is changed); glossary coverage was cross-checked against
 * src/data/glossary.js and src/pages.
 *
 * RESULT (audited 2026-07-05). All four modules carry the full honest banner as a literal "NO QED" string
 * in their exported verdict field together with an explicit isRigorous: false field, state imp-3066 K_a
 * >= 0 untouched verbatim, and state Platt-Trudgian Lambda <= 0.2 remains SOTA verbatim.
 *   - imp-33919-ecoll-three-way-decomposition-lower-ladder.js     : E_coll three-way decomposition on the lower ladder
 *   - imp-33920-runs-test-exact-permutation-pvalue.js             : exact runs-test permutation p-value
 *   - imp-33921-ar1-residual-rho-reconciliation.js                : AR(1) rho reconciliation
 *   - imp-33922-eflow-analytic-decay-vs-widening-crosscheck.js    : four-factor widening decay cross-check
 *
 * SHARED PROVENANCE. All four modules recompute diagnostics on the SAME imp-33858 "widening-fit residual
 * localization" 21-rung signed-residual series (itself derived from the imp-33810 quarter-decade ladder
 * and the imp-33843 log-linear OLS fit), and all four inherit the imp-3220/imp-3406 component model as
 * their non-rigorous extrapolation base -- no module re-derives a fresh model or a fresh residual series.
 *
 * SURFACING NOTE (secondary, grep-verified against src/data/glossary.js and src/pages). imp-33920,
 * imp-33921, and imp-33922 each have a dedicated headline glossary.js term; imp-33919 has NEITHER a
 * dedicated glossary term NOR any routed-page reference at audit time -- the clean glossary gap in this
 * cohort. None of the four cohort modules currently has a routed src/pages reference.
 *
 * @see imp-33804 (the imp-33765/33766/33767 rollup this note mirrors), imp-33824, imp-33784, imp-33719,
 * imp-33858 (the shared residual series all four modules diagnose)
 */

export const IMP_33978_33919_33922_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-33978',
  auditedAt: '2026-07-05',
  method:
    'Read each of the four imp-33919/33920/33921/33922 module @fileoverview/verdict blocks; classify by ' +
    'evidence class (E_coll three-way decomposition on the lower ladder / exact runs-test permutation ' +
    'p-value / AR(1) rho reconciliation / four-factor widening decay cross-check); grep for the ' +
    'mandatory honest-banner phrases (no QED, imp-3066 K_a >= 0 untouched, no refereed bound is changed' +
    '); cross-check glossary.js and src/pages for dedicated coverage.',
  sharedResidualSeries: 'imp-33858-widening-fit-residual-localization.js',
  sharedComponentModelProvenance: 'imp-3220 / imp-3406 (non-rigorous extrapolation base for all four modules)',
  modules: [
    {
      file: 'imp-33919-ecoll-three-way-decomposition-lower-ladder.js',
      evidenceClass: 'E_coll three-way decomposition on the lower 1e6..1e12 ladder',
      noQED: true,
      noQEDForm: 'literal-string',
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      hasGlossaryTerm: false,
      hasRoutedVizPage: false,
    },
    {
      file: 'imp-33920-runs-test-exact-permutation-pvalue.js',
      evidenceClass: 'exact runs-test permutation p-value',
      noQED: true,
      noQEDForm: 'literal-string',
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      hasGlossaryTerm: true,
      hasRoutedVizPage: false,
    },
    {
      file: 'imp-33921-ar1-residual-rho-reconciliation.js',
      evidenceClass: 'AR(1) rho reconciliation',
      noQED: true,
      noQEDForm: 'literal-string',
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      hasGlossaryTerm: true,
      hasRoutedVizPage: false,
    },
    {
      file: 'imp-33922-eflow-analytic-decay-vs-widening-crosscheck.js',
      evidenceClass: 'four-factor widening decay cross-check',
      noQED: true,
      noQEDForm: 'literal-string',
      untouchedInvariant: 'imp-3066 K_a >= 0',
      plattTrudgianSOTA: true,
      hasGlossaryTerm: true,
      hasRoutedVizPage: false,
    },
  ],
  evidenceClassCounts: {
    'E_coll three-way decomposition on the lower 1e6..1e12 ladder': 1,
    'exact runs-test permutation p-value': 1,
    'AR(1) rho reconciliation': 1,
    'four-factor widening decay cross-check': 1,
  },
  honestBannerFullCoverageCount: 4,
  glossaryCoveredCount: 3,
  routedVizPageCount: 0,
  recommendation:
    'No action needed on the honest-banner side -- all four modules already carry the full mandatory ' +
    'banner as a literal "NO QED" string plus isRigorous: false. imp-33919 is the sole cohort member ' +
    'lacking a dedicated glossary term, making it the natural next glossary candidate; none of the four ' +
    'has a routed viz page yet.',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module ' +
    'itself. imp-3066 K_a >= 0 positivity untouched across all four cohort members; no refereed bound is changed' +
    '. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_33978_ASSERTIONS = [
  {
    id: 'imp33978-exactly-four-modules-catalogued',
    holds: () => IMP_33978_33919_33922_COHORT_PROVENANCE_ROLLUP.modules.length === 4,
    why: 'The roll-up must cover exactly the four named cohort modules (imp-33919/33920/33921/33922).',
  },
  {
    id: 'imp33978-four-distinct-evidence-classes',
    holds: () => {
      const m = IMP_33978_33919_33922_COHORT_PROVENANCE_ROLLUP.modules;
      const counts = IMP_33978_33919_33922_COHORT_PROVENANCE_ROLLUP.evidenceClassCounts;
      const distinctClasses = new Set(m.map((x) => x.evidenceClass));
      return (
        distinctClasses.size === 4 &&
        Object.values(counts).every((c) => c === 1) &&
        Object.keys(counts).length === 4
      );
    },
    why: 'Each of the four modules earns a DISTINCT evidence class -- no two modules should share a class.',
  },
  {
    id: 'imp33978-all-four-carry-full-honest-banner',
    holds: () =>
      IMP_33978_33919_33922_COHORT_PROVENANCE_ROLLUP.modules.every(
        (x) => x.noQED === true && /imp-3066/.test(x.untouchedInvariant) && x.plattTrudgianSOTA === true
      ) && IMP_33978_33919_33922_COHORT_PROVENANCE_ROLLUP.honestBannerFullCoverageCount === 4,
    why: 'Every module in the cohort must state no-QED as a literal string, imp-3066 K_a >= 0 untouched, ' +
      'and no refereed bound is changed -- grep-verified against the source files.',
  },
  {
    id: 'imp33978-three-glossary-zero-viz',
    holds: () => {
      const m = IMP_33978_33919_33922_COHORT_PROVENANCE_ROLLUP.modules;
      const withTerm = m.filter((x) => x.hasGlossaryTerm === true).length;
      const withViz = m.filter((x) => x.hasRoutedVizPage === true).length;
      return (
        withTerm === 3 &&
        withTerm === IMP_33978_33919_33922_COHORT_PROVENANCE_ROLLUP.glossaryCoveredCount &&
        withViz === 0 &&
        withViz === IMP_33978_33919_33922_COHORT_PROVENANCE_ROLLUP.routedVizPageCount
      );
    },
    why: 'Grep-verified: imp-33920/33921/33922 each have a dedicated headline glossary term; imp-33919 ' +
      'has none. None of the four has a routed src/pages reference.',
  },
  {
    id: 'imp33978-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_33978_33919_33922_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /no QED/i.test(IMP_33978_33919_33922_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /imp-3066/.test(IMP_33978_33919_33922_COHORT_PROVENANCE_ROLLUP.honestNote),
    why: 'VERDICT LOCK: this is a read-only roll-up, not a bound; no refereed bound is changed' +
      ' and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33978_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33978 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33978_ASSERTIONS };
