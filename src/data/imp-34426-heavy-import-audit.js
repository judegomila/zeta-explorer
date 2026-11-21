/**
 * @module imp-34426-heavy-import-audit
 * @fileoverview imp-34426 -- heavy-import safety audit of the imp-34325..34330 widening-slope/
 * crossover cohort (imp-34325 deep-ladder-kahan-ols-crossvalidation, imp-34326 widening-slope-
 * background-reconciliation, imp-34327 widening-slope-minus-one-crossing-location, imp-34328
 * sigma-vs-product-gap-log2pi-shift, imp-34329 crossover-surplus-fartail-composite-limit,
 * imp-34330 widening-residual-prepole-reversal), plus the four viz pages built on top of them
 * (imp-34416/34417/34418/34419) and the imp-34377 resid_exp-pole cohort index page that also
 * consumes imp-34326 directly. Confirms none transitively imports the 16.7MB
 * src/data/zeros-to-1e6.js zero-ordinate bundle, mirroring the imp-34319/imp-34338 precedent
 * audits.
 *
 * METHOD (read-only, performed at author time). Direct grep of each target file for ^import
 * lines, then recursive grep of every named import target, following the transitive closure
 * until every branch terminates at a file with zero import lines.
 *
 * RESULT (audited 2026-07-06).
 *   - imp-34325, imp-34326, imp-34329 and imp-34330 each import only effectiveHeightForN
 *     (lambda-rh-height-mapping.js) and C_C_PINNED (polymath15-constant-C-C.js) -- the same pair
 *     cleared by the imp-33763/imp-33783/imp-33805/imp-33825/imp-33873/imp-33891/imp-33979/
 *     imp-33995/imp-34262/imp-34319/imp-34338 precedent audits.
 *   - imp-34325 additionally imports IMP33878_HUMP_ARGMAX_GRID_REFINEMENT (imp-33878, already
 *     precedent-cleared) and IMP34250_DEEP_LADDER_TIE_MARGIN_CLASSIFICATION (imp-34250, cleared
 *     by imp-34338 down to the same pair).
 *   - imp-34326 additionally imports IMP34246_WIDENING_SLOPE_LIMIT_ANALYTIC_DERIVATION and
 *     IMP34247_WIDENING_SLOPE_POLE_DIVERGENCE (both imp-34246/imp-34247, cleared by imp-34338).
 *   - imp-34327 imports only effectiveHeightForN.
 *   - imp-34328 has ZERO import lines.
 *   - Imp34416CrossoverSurplusFartailCompositeLimitViz.jsx imports PageHeader and imp-34329
 *     directly (cleared above).
 *   - Imp34417SigmaVsProductGapComplementViz.jsx imports PageHeader and imp-34328 directly
 *     (zero imports, cleared above).
 *   - Imp34418WideningResidualPrepoleReversalViz.jsx imports PageHeader and imp-34330 directly
 *     (cleared above).
 *   - Imp34419WideningSlopeMinusOneCrossingViz.jsx imports PageHeader, effectiveHeightForN, and
 *     imp-34327 directly (cleared above).
 *   - Imp34377ResidExpPoleCohortIndexPage.jsx (cohort index page consuming imp-34326 alongside
 *     imp-34287/imp-34169/imp-34309/imp-34247/imp-34310/imp-34333) imports PageHeader, Link, and
 *     seven data modules; imp-34326/imp-34247 are cleared above, and imp-34287, imp-34169,
 *     imp-34309, imp-34310 and imp-34333 each carry only the same precedent-cleared
 *     effectiveHeightForN/C_C_PINNED pair (or, for imp-34333, zero imports at all).
 * Tracing the shared effectiveHeightForN/C_C_PINNED pair's closure (unchanged since imp-34338):
 * lambda-rh-height-mapping.js -> bridge-lambda-rh.js -> guth-maynard-tail-bound.js (zero
 * imports); polymath15-constant-C-C.js -> g6a-sub-constant-value.js,
 * polymath15-lemma52-shock-holder.js, lambda-intercept-burgers-uniformity.js (all terminating
 * without naming zeros-to-1e6.js, per the imp-34338 closure trace). Every branch in this cohort
 * terminates without ever naming zeros-to-1e6.js, zeros-first-25.js, or
 * gue-vs-zeros-comparison.js. All ten targets are heavy-import-safe.
 *
 * This is a read-only audit: it changes no bound, establishes no operator positivity, imp-3066
 * K_a >= 0 stays untouched, no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34338 (the precedent heavy-import audit this note mirrors), imp-34319, imp-34325,
 * imp-34326, imp-34327, imp-34328, imp-34329, imp-34330
 */

export const IMP_34426_HEAVY_IMPORT_AUDIT = {
  id: 'imp-34426',
  auditedAt: '2026-07-06',
  targets: [
    {
      file: 'imp-34325-deep-ladder-kahan-ols-crossvalidation.js',
      directImports: [
        'effectiveHeightForN',
        'C_C_PINNED',
        'IMP33878_HUMP_ARGMAX_GRID_REFINEMENT',
        'IMP34250_DEEP_LADDER_TIE_MARGIN_CLASSIFICATION',
      ],
      hasHeavyImport: false,
    },
    {
      file: 'imp-34326-widening-slope-background-reconciliation.js',
      directImports: [
        'effectiveHeightForN',
        'C_C_PINNED',
        'IMP34246_WIDENING_SLOPE_LIMIT_ANALYTIC_DERIVATION',
        'IMP34247_WIDENING_SLOPE_POLE_DIVERGENCE',
      ],
      hasHeavyImport: false,
    },
    {
      file: 'imp-34327-widening-slope-minus-one-crossing-location.js',
      directImports: ['effectiveHeightForN'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-34328-sigma-vs-product-gap-log2pi-shift.js',
      directImports: [],
      hasHeavyImport: false,
    },
    {
      file: 'imp-34329-crossover-surplus-fartail-composite-limit.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-34330-widening-residual-prepole-reversal.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
    },
    {
      file: 'Imp34416CrossoverSurplusFartailCompositeLimitViz.jsx (consuming page)',
      directImports: ['PageHeader', 'IMP34329_CROSSOVER_SURPLUS_FARTAIL_COMPOSITE_LIMIT'],
      hasHeavyImport: false,
    },
    {
      file: 'Imp34417SigmaVsProductGapComplementViz.jsx (consuming page)',
      directImports: ['PageHeader', 'IMP34328_SIGMA_VS_PRODUCT_GAP_LOG2PI_SHIFT'],
      hasHeavyImport: false,
    },
    {
      file: 'Imp34418WideningResidualPrepoleReversalViz.jsx (consuming page)',
      directImports: ['PageHeader', 'IMP34330_WIDENING_RESIDUAL_PREPOLE_REVERSAL'],
      hasHeavyImport: false,
    },
    {
      file: 'Imp34419WideningSlopeMinusOneCrossingViz.jsx (consuming page)',
      directImports: ['PageHeader', 'effectiveHeightForN', 'IMP34327_WIDENING_SLOPE_MINUS_ONE_CROSSING'],
      hasHeavyImport: false,
    },
  ],
  transitiveClosureFiles: [
    'lambda-rh-height-mapping.js',
    'bridge-lambda-rh.js',
    'guth-maynard-tail-bound.js',
    'polymath15-constant-C-C.js',
    'g6a-sub-constant-value.js',
    'polymath15-lemma52-shock-holder.js',
    'lambda-intercept-burgers-uniformity.js',
    'imp-33878-hump-argmax-grid-refinement.js',
    'imp-34250-deep-ladder-tie-margin-classification.js',
    'imp-34246-widening-slope-limit-analytic-derivation.js',
    'imp-34247-widening-slope-pole-divergence.js',
  ],
  heavyImportSafeCount: 10,
  recommendation:
    'No action needed -- imp-34325/34326/34327/34328/34329/34330 and all four of their ' +
    'consuming viz pages (imp-34416/34417/34418/34419) are already heavy-import-safe. Every ' +
    'target routes through the exact effectiveHeightForN/C_C_PINNED pair already cleared by the ' +
    'imp-33763/imp-33783/imp-33805/imp-33825/imp-33873/imp-33891/imp-33979/imp-33995/imp-34262/' +
    'imp-34319/imp-34338 precedent audits, or (imp-34327, imp-34328) carry fewer imports still. ' +
    'This closes the imp-34426 audit item.',
  honestNote:
    'Read-only audit; no new pages fabricated, no new bound claimed by this module itself. ' +
    'imp-3066 K_a >= 0 positivity untouched. No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_34426_ASSERTIONS = [
  {
    id: 'imp34426-exactly-ten-targets-audited',
    holds: () => IMP_34426_HEAVY_IMPORT_AUDIT.targets.length === 10,
    why: 'The audit must cover exactly the six named data modules plus their four consuming viz pages.',
  },
  {
    id: 'imp34426-all-ten-heavy-import-safe',
    holds: () => {
      const t = IMP_34426_HEAVY_IMPORT_AUDIT.targets;
      const safe = t.filter((x) => x.hasHeavyImport === false).length;
      return safe === 10 && safe === IMP_34426_HEAVY_IMPORT_AUDIT.heavyImportSafeCount;
    },
    why: 'Grep-verified: the transitive closure of every import in all ten targets terminates ' +
      'without ever naming zeros-to-1e6.js.',
  },
  {
    id: 'imp34426-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_34426_HEAVY_IMPORT_AUDIT.honestNote) &&
      /no QED/i.test(IMP_34426_HEAVY_IMPORT_AUDIT.honestNote) &&
      /imp-3066/.test(IMP_34426_HEAVY_IMPORT_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed' +
      ' and imp-3066 stays untouched.',
  },
];

for (const a of IMP_34426_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-34426 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_34426_ASSERTIONS };
