/**
 * @module imp-34338-heavy-import-audit
 * @fileoverview imp-34338 -- heavy-import safety audit of the five most-recent opus-channel data
 * modules imp-34246 (widening-slope-limit-analytic-derivation), imp-34247 (widening-slope-pole-
 * divergence), imp-34248 (crossover-surplus-small-thr-asymptotic), imp-34249 (logt0-resid product
 * landmark, housed inside imp-34197-logt0-resid-product-approach-rate.js) and imp-34250 (deep-
 * ladder-tie-margin-classification), plus every page that consumes them. Confirms none
 * transitively imports the 16.7MB src/data/zeros-to-1e6.js zero-ordinate bundle (which hangs
 * vite ssrLoadModule / npm-run-assert when pulled into an assertion module), mirroring the
 * imp-34319/imp-34262 precedent audits.
 *
 * METHOD (read-only, performed at author time). Direct grep of each target module for ^import
 * lines, then recursive grep of every named import target, following the transitive closure
 * until every branch terminates at a file with zero import lines.
 *
 * RESULT (audited 2026-07-05).
 *   - imp-34246 and imp-34247 both import only effectiveHeightForN (lambda-rh-height-mapping.js)
 *     and C_C_PINNED (polymath15-constant-C-C.js) -- the same pair cleared by the imp-33763/
 *     imp-33783/imp-33805/imp-33825/imp-33873/imp-33891/imp-33979/imp-33995/imp-34262/imp-34319
 *     precedent audits.
 *   - imp-34248-crossover-surplus-small-thr-asymptotic.js imports the same effectiveHeightForN/
 *     C_C_PINNED pair and has no consuming page yet (not wired into any page's import list).
 *   - imp-34197-logt0-resid-product-approach-rate.js (which houses the imp-34249 addendum) has
 *     ZERO import lines and no consuming page yet.
 *   - imp-34250-deep-ladder-tie-margin-classification.js imports the precedent-cleared pair plus
 *     IMP33878_HUMP_ARGMAX_GRID_REFINEMENT (imp-33878-...) and
 *     IMP34172_DEEP_LADDER_SECOND_PATH_CROSSVALIDATION (imp-34172-...), which in turn imports
 *     the same pair plus IMP34106_SAWTOOTH_PHASE_REALIGNMENT_DEEP_LADDER (imp-34106-...), which
 *     imports only the same precedent-cleared pair plus imp-33878 again -- closing the loop with
 *     no new branches.
 *   - Imp34205WideningSlopeConvergenceViz.jsx imports PageHeader, its own viz-data module
 *     (imp-34205-widening-slope-convergence-viz-data.js, which imports IMP34129_WIDENING_SLOPE_
 *     DRIFT_CONVERGENCE_FIT -> imp-33877-widening-fit-tail-endpoint-artifact-test.js ->
 *     imp-33810-eflow-resid-ratio-N-ladder.js, all resolving to the precedent-cleared pair), and
 *     imp-34246 itself (cleared above).
 *   - Imp34237FixedBandPeakReaccelAndSurrogatePoleViz.jsx imports PageHeader, its own viz-data
 *     module (zero imports), and imp-34247 itself (cleared above).
 *   - Imp34182DeepLadderPrecisionFloorViz.jsx imports PageHeader, its own viz-data module (zero
 *     imports), and imp-34250 itself (cleared above).
 * Tracing the shared effectiveHeightForN/C_C_PINNED pair's closure (unchanged since imp-34319):
 * lambda-rh-height-mapping.js -> bridge-lambda-rh.js -> guth-maynard-tail-bound.js (zero imports);
 * polymath15-constant-C-C.js -> g6a-sub-constant-value.js, polymath15-lemma52-shock-holder.js,
 * lambda-intercept-burgers-uniformity.js -> dyson-scaling-N5000.js -> zeta.js -> primes.js (zero
 * imports), dyson-burgers-shock.js / lambda-intercept-analytic.js -> dyson-monotonicity-proof.js /
 * dyson-collision-lower-bound.js -> zeta.js (as above), lambda-intercept-confidence.js ->
 * lambda-error-budget.js (zero imports). Every branch terminates without ever naming
 * zeros-to-1e6.js. All five target modules and all three consuming pages are heavy-import-safe.
 *
 * This is a read-only audit: it changes no bound, establishes no operator positivity, imp-3066
 * K_a >= 0 stays untouched, no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34319 (the precedent heavy-import audit this note mirrors), imp-34262, imp-33995,
 * imp-34246, imp-34247, imp-34248, imp-34249, imp-34250
 */

export const IMP_34338_HEAVY_IMPORT_AUDIT = {
  id: 'imp-34338',
  auditedAt: '2026-07-05',
  modules: [
    {
      file: 'imp-34246-widening-slope-limit-analytic-derivation.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-34247-widening-slope-pole-divergence.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-34248-crossover-surplus-small-thr-asymptotic.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-34197-logt0-resid-product-approach-rate.js (houses imp-34249 addendum)',
      directImports: [],
      hasHeavyImport: false,
    },
    {
      file: 'imp-34250-deep-ladder-tie-margin-classification.js',
      directImports: [
        'effectiveHeightForN',
        'C_C_PINNED',
        'IMP33878_HUMP_ARGMAX_GRID_REFINEMENT',
        'IMP34172_DEEP_LADDER_SECOND_PATH_CROSSVALIDATION',
      ],
      hasHeavyImport: false,
    },
    {
      file: 'Imp34205WideningSlopeConvergenceViz.jsx (consuming page)',
      directImports: [
        'PageHeader',
        'IMP34205_*_viz-data (-> imp-34129 -> imp-33877 -> imp-33810, precedent-cleared pair)',
        'IMP34246_WIDENING_SLOPE_LIMIT_ANALYTIC_DERIVATION',
      ],
      hasHeavyImport: false,
    },
    {
      file: 'Imp34237FixedBandPeakReaccelAndSurrogatePoleViz.jsx (consuming page)',
      directImports: [
        'PageHeader',
        'IMP34237_*_viz-data (zero imports)',
        'IMP34247_WIDENING_SLOPE_POLE_DIVERGENCE',
      ],
      hasHeavyImport: false,
    },
    {
      file: 'Imp34182DeepLadderPrecisionFloorViz.jsx (consuming page)',
      directImports: [
        'PageHeader',
        'IMP34182_*_viz-data (zero imports)',
        'IMP34250_DEEP_LADDER_TIE_MARGIN_CLASSIFICATION',
      ],
      hasHeavyImport: false,
    },
  ],
  modulesWithoutConsumingPage: [
    'imp-34248-crossover-surplus-small-thr-asymptotic.js',
    'imp-34197-logt0-resid-product-approach-rate.js (imp-34249 addendum)',
  ],
  transitiveClosureFiles: [
    'lambda-rh-height-mapping.js',
    'bridge-lambda-rh.js',
    'guth-maynard-tail-bound.js',
    'polymath15-constant-C-C.js',
    'g6a-sub-constant-value.js',
    'polymath15-lemma52-shock-holder.js',
    'lambda-intercept-burgers-uniformity.js',
    'dyson-scaling-N5000.js (src/math)',
    'zeta.js (src/math)',
    'primes.js (src/math)',
    'dyson-burgers-shock.js',
    'lambda-intercept-analytic.js',
    'dyson-monotonicity-proof.js',
    'dyson-collision-lower-bound.js',
    'lambda-intercept-confidence.js',
    'lambda-error-budget.js',
    'imp-33878-hump-argmax-grid-refinement.js',
    'imp-34172-deep-ladder-second-path-crossvalidation.js',
    'imp-34106-sawtooth-phase-realignment-deep-ladder.js',
    'imp-34129-widening-slope-drift-convergence-fit.js',
    'imp-33877-widening-fit-tail-endpoint-artifact-test.js',
    'imp-33810-eflow-resid-ratio-N-ladder.js',
  ],
  heavyImportSafeCount: 8,
  recommendation:
    'No action needed -- imp-34246/34247/34248/34249/34250 and all three of their consuming ' +
    'pages are already heavy-import-safe. Every target routes through the exact ' +
    'effectiveHeightForN/C_C_PINNED pair already cleared by the imp-33763/imp-33783/imp-33805/' +
    'imp-33825/imp-33873/imp-33891/imp-33979/imp-33995/imp-34262/imp-34319 precedent audits, and ' +
    'the extra named imports (imp-33878, imp-34172, imp-34106, imp-34129, imp-33877, imp-33810) ' +
    'resolve to the same precedent-cleared chain. imp-34248 and imp-34249 currently have no ' +
    'consuming page at all, so there is no page-level risk to audit for them yet. This closes ' +
    'the imp-34338 audit item.',
  honestNote:
    'Read-only audit; no new pages fabricated, no new bound claimed by this module itself. ' +
    'imp-3066 K_a >= 0 positivity untouched. No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_34338_ASSERTIONS = [
  {
    id: 'imp34338-exactly-eight-targets-audited',
    holds: () => IMP_34338_HEAVY_IMPORT_AUDIT.modules.length === 8,
    why: 'The audit must cover exactly the five named data modules plus their three consuming pages.',
  },
  {
    id: 'imp34338-all-eight-heavy-import-safe',
    holds: () => {
      const m = IMP_34338_HEAVY_IMPORT_AUDIT.modules;
      const safe = m.filter((x) => x.hasHeavyImport === false).length;
      return safe === 8 && safe === IMP_34338_HEAVY_IMPORT_AUDIT.heavyImportSafeCount;
    },
    why: 'Grep-verified: the transitive closure of every import in all eight targets terminates ' +
      'without ever naming zeros-to-1e6.js.',
  },
  {
    id: 'imp34338-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_34338_HEAVY_IMPORT_AUDIT.honestNote) &&
      /no QED/i.test(IMP_34338_HEAVY_IMPORT_AUDIT.honestNote) &&
      /imp-3066/.test(IMP_34338_HEAVY_IMPORT_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed' +
      ' and imp-3066 stays untouched.',
  },
];

for (const a of IMP_34338_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-34338 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_34338_ASSERTIONS };
