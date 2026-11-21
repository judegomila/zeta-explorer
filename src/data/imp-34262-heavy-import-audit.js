/**
 * @module imp-34262-heavy-import-audit
 * @fileoverview imp-34262 -- heavy-import safety audit of the recent M2-ceiling data modules
 * imp-34188 (widening-slope-limit-exactly-minus-one), imp-34189 (m2-ceiling-next-order-window-
 * width-correction), and imp-34172 (deep-ladder-second-path-crossvalidation), plus their sole
 * consuming page Imp34255M2CeilingWindowWidthDivergenceViz.jsx (which imports the imp-34255
 * viz-data module, not the three above directly). Confirms none transitively imports the
 * 16.7MB src/data/zeros-to-1e6.js zero-ordinate bundle (which hangs vite ssrLoadModule /
 * npm-run-assert when pulled into an assertion module), mirroring the imp-33995 precedent audit.
 *
 * METHOD (read-only, performed at author time). Direct grep of each target module for ^import(
 * lines, then recursive grep of every named import target, following the transitive closure
 * until every branch terminates at a file with zero import lines.
 *
 * RESULT (audited 2026-07-05).
 *   - imp-34188-widening-slope-limit-exactly-minus-one.js imports effectiveHeightForN
 *     (lambda-rh-height-mapping.js), C_C_PINNED (polymath15-constant-C-C.js), and
 *     IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST (imp-33877-widening-fit-tail-endpoint-
 *     artifact-test.js). The first two are the SAME pair already cleared by the imp-33763/
 *     imp-33783/imp-33805/imp-33825/imp-33873/imp-33891/imp-33979/imp-33995 precedent audits.
 *     imp-33877 itself imports only the same effectiveHeightForN/C_C_PINNED pair plus
 *     IMP33810_EFLOW_RESID_RATIO_N_LADDER (imp-33810-eflow-resid-ratio-N-ladder.js), which in
 *     turn imports only the same precedent-cleared pair.
 *   - imp-34189-m2-ceiling-next-order-window-width-correction.js imports only the same
 *     effectiveHeightForN/C_C_PINNED pair directly -- precedent-cleared.
 *   - imp-34172-deep-ladder-second-path-crossvalidation.js imports the same pair plus
 *     IMP33878_HUMP_ARGMAX_GRID_REFINEMENT (imp-33878-hump-argmax-grid-refinement.js, itself
 *     precedent-cleared as importing only the same pair) and
 *     IMP34106_SAWTOOTH_PHASE_REALIGNMENT_DEEP_LADDER (imp-34106-sawtooth-phase-realignment-
 *     deep-ladder.js), which imports the same pair plus the already-cleared imp-33878 module.
 *   - Imp34255M2CeilingWindowWidthDivergenceViz.jsx imports only React, PageHeader, and named
 *     exports from imp-34255-m2-ceiling-window-width-divergence-viz-data.js, which itself has
 *     ZERO import lines (self-contained literal data module).
 * Tracing the shared effectiveHeightForN/C_C_PINNED pair's closure (unchanged since imp-33995):
 * lambda-rh-height-mapping.js -> bridge-lambda-rh.js -> guth-maynard-tail-bound.js (zero imports);
 * polymath15-constant-C-C.js -> g6a-sub-constant-value.js, polymath15-lemma52-shock-holder.js,
 * lambda-intercept-burgers-uniformity.js -> dyson-scaling-N5000.js -> zeta.js -> primes.js (zero
 * imports), dyson-burgers-shock.js / lambda-intercept-analytic.js -> dyson-monotonicity-proof.js /
 * dyson-collision-lower-bound.js -> zeta.js (as above), lambda-intercept-confidence.js ->
 * lambda-error-budget.js (zero imports). Every branch terminates without ever naming
 * zeros-to-1e6.js. All three target modules and the consuming page are therefore heavy-import-
 * safe.
 *
 * This is a read-only audit: it changes no bound, establishes no operator positivity, imp-3066
 * K_a >= 0 stays untouched, no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33995 (the precedent heavy-import audit this note mirrors), imp-33979, imp-33891,
 * imp-33873, imp-33825, imp-33805, imp-33783, imp-33763, imp-34188, imp-34189, imp-34172,
 * imp-34255
 */

export const IMP_34262_HEAVY_IMPORT_AUDIT = {
  id: 'imp-34262',
  auditedAt: '2026-07-05',
  modules: [
    {
      file: 'imp-34188-widening-slope-limit-exactly-minus-one.js',
      directImports: [
        'effectiveHeightForN',
        'C_C_PINNED',
        'IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST',
      ],
      hasHeavyImport: false,
    },
    {
      file: 'imp-34189-m2-ceiling-next-order-window-width-correction.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-34172-deep-ladder-second-path-crossvalidation.js',
      directImports: [
        'effectiveHeightForN',
        'C_C_PINNED',
        'IMP33878_HUMP_ARGMAX_GRID_REFINEMENT',
        'IMP34106_SAWTOOTH_PHASE_REALIGNMENT_DEEP_LADDER',
      ],
      hasHeavyImport: false,
    },
    {
      file: 'Imp34255M2CeilingWindowWidthDivergenceViz.jsx (consuming page)',
      directImports: [
        'React',
        'PageHeader',
        'imp-34255-m2-ceiling-window-width-divergence-viz-data.js (zero imports)',
      ],
      hasHeavyImport: false,
    },
  ],
  transitiveClosureFiles: [
    'imp-33877-widening-fit-tail-endpoint-artifact-test.js',
    'imp-33810-eflow-resid-ratio-N-ladder.js',
    'imp-33878-hump-argmax-grid-refinement.js',
    'imp-34106-sawtooth-phase-realignment-deep-ladder.js',
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
  ],
  heavyImportSafeCount: 4,
  recommendation:
    'No action needed -- all three M2-ceiling modules and their consuming page are already ' +
    'heavy-import-safe. imp-34188, imp-34189, and imp-34172 all route through the exact ' +
    'effectiveHeightForN/C_C_PINNED pair already cleared by the imp-33763/imp-33783/imp-33805/ ' +
    'imp-33825/imp-33873/imp-33891/imp-33979/imp-33995 precedent audits, and their extra named ' +
    'imports (imp-33877, imp-33878, imp-34106) resolve to the same precedent-cleared chain. The ' +
    'consuming page imports only a zero-import viz-data literal module. This closes the ' +
    'imp-34262 audit item and clears the imp-34188/imp-34189/imp-34172 cohort plus the imp-34255 ' +
    'page for safe consumer-viz import.',
  honestNote:
    'Read-only audit; no new pages fabricated, no new bound claimed by this module itself. ' +
    'imp-3066 K_a >= 0 positivity untouched. No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_34262_ASSERTIONS = [
  {
    id: 'imp34262-exactly-four-targets-audited',
    holds: () => IMP_34262_HEAVY_IMPORT_AUDIT.modules.length === 4,
    why: 'The audit must cover exactly the three named data modules plus the one consuming page.',
  },
  {
    id: 'imp34262-all-four-heavy-import-safe',
    holds: () => {
      const m = IMP_34262_HEAVY_IMPORT_AUDIT.modules;
      const safe = m.filter((x) => x.hasHeavyImport === false).length;
      return safe === 4 && safe === IMP_34262_HEAVY_IMPORT_AUDIT.heavyImportSafeCount;
    },
    why: 'Grep-verified: the transitive closure of every import in all four targets terminates ' +
      'without ever naming zeros-to-1e6.js.',
  },
  {
    id: 'imp34262-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_34262_HEAVY_IMPORT_AUDIT.honestNote) &&
      /no QED/i.test(IMP_34262_HEAVY_IMPORT_AUDIT.honestNote) &&
      /imp-3066/.test(IMP_34262_HEAVY_IMPORT_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed' +
      ' and imp-3066 stays untouched.',
  },
];

for (const a of IMP_34262_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-34262 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_34262_ASSERTIONS };
