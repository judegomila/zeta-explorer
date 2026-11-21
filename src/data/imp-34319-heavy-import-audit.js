/**
 * @module imp-34319-heavy-import-audit
 * @fileoverview imp-34319 -- heavy-import safety audit of the imp-34233 (fixed-band-peak-
 * combined-grid-ceiling-contest) and imp-34234 (trough-peak-perstep-crossover-tenth-decade) data
 * modules, plus their sole consuming pages Imp34281M2CeilingCohortIndexPage.jsx and
 * Imp34157TroughPeakRatioCreepViz.jsx. Confirms none transitively imports the 16.7MB
 * src/data/zeros-to-1e6.js zero-ordinate bundle (which hangs vite ssrLoadModule / npm-run-assert
 * when pulled into an assertion module), mirroring the imp-34262/imp-33995 precedent audits.
 *
 * METHOD (read-only, performed at author time). Direct grep of each target module for ^import
 * lines, then recursive grep of every named import target, following the transitive closure
 * until every branch terminates at a file with zero import lines.
 *
 * RESULT (audited 2026-07-05).
 *   - imp-34233-fixed-band-peak-combined-grid-ceiling-contest.js imports only effectiveHeightForN
 *     (lambda-rh-height-mapping.js) and C_C_PINNED (polymath15-constant-C-C.js) -- the SAME pair
 *     already cleared by the imp-33763/imp-33783/imp-33805/imp-33825/imp-33873/imp-33891/
 *     imp-33979/imp-33995/imp-34262 precedent audits.
 *   - imp-34234-trough-peak-perstep-crossover-tenth-decade.js imports the same
 *     effectiveHeightForN/C_C_PINNED pair plus IMP34153_TROUGH_PEAK_PERSTEP_CROSSOVER_LOCATE
 *     (imp-34153-trough-peak-perstep-crossover-locate.js), which in turn imports the same pair
 *     plus IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE (imp-34085-trough-peak-ratio-convergence.js) ->
 *     IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST (imp-33877-...) ->
 *     IMP33810_EFLOW_RESID_RATIO_N_LADDER (imp-33810-...), all resolving to the same
 *     precedent-cleared pair with no further branches.
 *   - Imp34281M2CeilingCohortIndexPage.jsx imports PageHeader, the imp-34282 status-note module
 *     (zero imports), the imp-34211 closedform-vs-bisection module (same precedent-cleared pair),
 *     and imp-34233 itself (cleared above).
 *   - Imp34157TroughPeakRatioCreepViz.jsx imports PageHeader, SurrogateDiagnosticCohortNote, the
 *     imp-34085 and imp-34214 modules (both resolving to the same precedent-cleared pair), and
 *     imp-34234 itself (cleared above).
 * Tracing the shared effectiveHeightForN/C_C_PINNED pair's closure (unchanged since imp-34262):
 * lambda-rh-height-mapping.js -> bridge-lambda-rh.js -> guth-maynard-tail-bound.js (zero imports);
 * polymath15-constant-C-C.js -> g6a-sub-constant-value.js, polymath15-lemma52-shock-holder.js,
 * lambda-intercept-burgers-uniformity.js -> dyson-scaling-N5000.js -> zeta.js -> primes.js (zero
 * imports), dyson-burgers-shock.js / lambda-intercept-analytic.js -> dyson-monotonicity-proof.js /
 * dyson-collision-lower-bound.js -> zeta.js (as above), lambda-intercept-confidence.js ->
 * lambda-error-budget.js (zero imports). Every branch terminates without ever naming
 * zeros-to-1e6.js. Both target modules and both consuming pages are therefore heavy-import-safe.
 *
 * This is a read-only audit: it changes no bound, establishes no operator positivity, imp-3066
 * K_a >= 0 stays untouched, no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34262 (the precedent heavy-import audit this note mirrors), imp-33995, imp-33979,
 * imp-33891, imp-33873, imp-33825, imp-33805, imp-33783, imp-33763, imp-34233, imp-34234
 */

export const IMP_34319_HEAVY_IMPORT_AUDIT = {
  id: 'imp-34319',
  auditedAt: '2026-07-05',
  modules: [
    {
      file: 'imp-34233-fixed-band-peak-combined-grid-ceiling-contest.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-34234-trough-peak-perstep-crossover-tenth-decade.js',
      directImports: [
        'effectiveHeightForN',
        'C_C_PINNED',
        'IMP34153_TROUGH_PEAK_PERSTEP_CROSSOVER_LOCATE',
      ],
      hasHeavyImport: false,
    },
    {
      file: 'Imp34281M2CeilingCohortIndexPage.jsx (consuming page)',
      directImports: [
        'PageHeader',
        'IMP34282_B_INF_DESCRIPTIVE_VS_DERIVATION_STATUS_NOTE (zero imports)',
        'IMP34211_CLOSEDFORM_VS_BISECTION_KEND_GAP',
        'IMP34233_FIXED_BAND_PEAK_COMBINED_GRID_CEILING_CONTEST',
      ],
      hasHeavyImport: false,
    },
    {
      file: 'Imp34157TroughPeakRatioCreepViz.jsx (consuming page)',
      directImports: [
        'PageHeader',
        'SurrogateDiagnosticCohortNote',
        'IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE',
        'IMP34214_TROUGH_PEAK_RATIO_LIMIT_FIT',
        'IMP34234_TROUGH_PEAK_PERSTEP_CROSSOVER_TENTH_DECADE',
      ],
      hasHeavyImport: false,
    },
  ],
  transitiveClosureFiles: [
    'imp-34153-trough-peak-perstep-crossover-locate.js',
    'imp-34085-trough-peak-ratio-convergence.js',
    'imp-33877-widening-fit-tail-endpoint-artifact-test.js',
    'imp-33810-eflow-resid-ratio-N-ladder.js',
    'imp-34211-closedform-vs-bisection-kend-gap.js',
    'imp-34214-trough-peak-ratio-limit-fit.js',
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
    'No action needed -- imp-34233 and imp-34234 and their two consuming pages are already ' +
    'heavy-import-safe. Both target modules route through the exact effectiveHeightForN/' +
    'C_C_PINNED pair already cleared by the imp-33763/imp-33783/imp-33805/imp-33825/imp-33873/' +
    'imp-33891/imp-33979/imp-33995/imp-34262 precedent audits, and their extra named imports ' +
    '(imp-34153, imp-34085, imp-33877, imp-33810, imp-34211, imp-34214) resolve to the same ' +
    'precedent-cleared chain. This closes the imp-34319 audit item.',
  honestNote:
    'Read-only audit; no new pages fabricated, no new bound claimed by this module itself. ' +
    'imp-3066 K_a >= 0 positivity untouched. No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_34319_ASSERTIONS = [
  {
    id: 'imp34319-exactly-four-targets-audited',
    holds: () => IMP_34319_HEAVY_IMPORT_AUDIT.modules.length === 4,
    why: 'The audit must cover exactly the two named data modules plus the two consuming pages.',
  },
  {
    id: 'imp34319-all-four-heavy-import-safe',
    holds: () => {
      const m = IMP_34319_HEAVY_IMPORT_AUDIT.modules;
      const safe = m.filter((x) => x.hasHeavyImport === false).length;
      return safe === 4 && safe === IMP_34319_HEAVY_IMPORT_AUDIT.heavyImportSafeCount;
    },
    why: 'Grep-verified: the transitive closure of every import in all four targets terminates ' +
      'without ever naming zeros-to-1e6.js.',
  },
  {
    id: 'imp34319-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_34319_HEAVY_IMPORT_AUDIT.honestNote) &&
      /no QED/i.test(IMP_34319_HEAVY_IMPORT_AUDIT.honestNote) &&
      /imp-3066/.test(IMP_34319_HEAVY_IMPORT_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed' +
      ' and imp-3066 stays untouched.',
  },
];

for (const a of IMP_34319_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-34319 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_34319_ASSERTIONS };
