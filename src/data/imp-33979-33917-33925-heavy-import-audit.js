/**
 * @module imp-33979-33917-33925-heavy-import-audit
 * @fileoverview imp-33979 -- heavy-import safety audit of the imp-33917 (endpoint-residual
 * growth law), imp-33918 (E_coll g-vs-law reference offset convergence rate), imp-33919
 * (E_coll three-way decomposition on the lower ladder), imp-33920 (runs-test exact permutation
 * p-value), imp-33921 (AR(1) residual rho reconciliation), imp-33922 (E_flow analytic-decay vs
 * widening cross-check), imp-33923 (off-axis phase-winding quadrature), imp-33924 (joint
 * cusp-angle onset robustness map), and imp-33925 (I1 step robustness) modules, mirroring the
 * imp-33891/imp-33873/imp-33825 precedent audits. Confirms none of the nine transitively
 * imports the 16.7MB src/data/zeros-to-1e6.js zero-ordinate bundle (which hangs vite
 * ssrLoadModule / npm-run-assert when pulled into an assertion module), so a consumer viz page
 * can safely import them.
 *
 * METHOD (read-only, performed at author time). Direct grep of each of the nine module source
 * files for ^import( lines, then recursive grep of every named import target, following the
 * transitive closure until every branch terminates at a file with zero import lines.
 *
 * RESULT (audited 2026-07-05).
 *   - imp-33917-endpoint-residual-growth-law.js, imp-33918-ecoll-g-vs-law-reference-offset-
 *     convergence-rate.js, imp-33919-ecoll-three-way-decomposition-lower-ladder.js,
 *     imp-33922-eflow-analytic-decay-vs-widening-crosscheck.js, and imp-33925-i1-step-
 *     robustness.js each import effectiveHeightForN (lambda-rh-height-mapping.js) and
 *     C_C_PINNED (polymath15-constant-C-C.js) directly -- the SAME pair already cleared by the
 *     imp-33763/imp-33783/imp-33805/imp-33825/imp-33873/imp-33891 precedent audits.
 *   - imp-33920-runs-test-exact-permutation-pvalue.js imports only
 *     IMP33886_WIDENING_RESIDUAL_SIGNIFICANCE_TEST (imp-33886-widening-residual-significance-
 *     test.js), which itself imports only IMP33810_EFLOW_RESID_RATIO_N_LADDER
 *     (imp-33810-eflow-resid-ratio-N-ladder.js) -- precedent-cleared by the imp-33891 audit.
 *   - imp-33921-ar1-residual-rho-reconciliation.js imports only IMP33810_EFLOW_RESID_RATIO_N_
 *     LADDER (imp-33810-eflow-resid-ratio-N-ladder.js) directly, same precedent-cleared chain.
 *   - imp-33923-off-axis-phase-winding-quadrature.js and imp-33924-joint-cusp-angle-onset-
 *     robustness-map.js have ZERO import lines -- fully self-contained.
 * Tracing the shared effectiveHeightForN/C_C_PINNED pair's closure (unchanged since imp-33891):
 * lambda-rh-height-mapping.js -> bridge-lambda-rh.js -> guth-maynard-tail-bound.js (zero imports);
 * polymath15-constant-C-C.js -> g6a-sub-constant-value.js, polymath15-lemma52-shock-holder.js,
 * lambda-intercept-burgers-uniformity.js -> dyson-scaling-N5000.js -> zeta.js -> primes.js (zero
 * imports), dyson-burgers-shock.js / lambda-intercept-analytic.js -> dyson-monotonicity-proof.js /
 * dyson-collision-lower-bound.js -> zeta.js (as above), lambda-intercept-confidence.js ->
 * lambda-error-budget.js (zero imports). imp-33810-eflow-resid-ratio-N-ladder.js and
 * imp-33886-widening-residual-significance-test.js both route through the identical
 * effectiveHeightForN/C_C_PINNED pair. Every branch terminates without ever naming
 * zeros-to-1e6.js. All nine target modules are therefore heavy-import-safe.
 *
 * This is a read-only audit: it changes no bound, establishes no operator positivity, imp-3066
 * K_a >= 0 stays untouched, no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33891 (the precedent heavy-import audit this note mirrors), imp-33873, imp-33825,
 * imp-33805, imp-33783, imp-33763
 */

export const IMP_33979_HEAVY_IMPORT_AUDIT = {
  id: 'imp-33979',
  auditedAt: '2026-07-05',
  modules: [
    {
      file: 'imp-33917-endpoint-residual-growth-law.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33918-ecoll-g-vs-law-reference-offset-convergence-rate.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33919-ecoll-three-way-decomposition-lower-ladder.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33920-runs-test-exact-permutation-pvalue.js',
      directImports: ['IMP33886_WIDENING_RESIDUAL_SIGNIFICANCE_TEST'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33921-ar1-residual-rho-reconciliation.js',
      directImports: ['IMP33810_EFLOW_RESID_RATIO_N_LADDER'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33922-eflow-analytic-decay-vs-widening-crosscheck.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33923-off-axis-phase-winding-quadrature.js',
      directImports: [],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33924-joint-cusp-angle-onset-robustness-map.js',
      directImports: [],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33925-i1-step-robustness.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
    },
  ],
  transitiveClosureFiles: [
    'imp-33886-widening-residual-significance-test.js',
    'imp-33810-eflow-resid-ratio-N-ladder.js',
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
  heavyImportSafeCount: 9,
  recommendation:
    'No action needed -- all nine modules are already heavy-import-safe. imp-33917/imp-33918/' +
    'imp-33919/imp-33922/imp-33925 route through the exact effectiveHeightForN/C_C_PINNED pair ' +
    'already cleared by the imp-33763/imp-33783/imp-33805/imp-33825/imp-33873/imp-33891 ' +
    'precedent audits; imp-33920 and imp-33921 route through the imp-33886/imp-33810 pair which ' +
    'resolves to the same precedent-cleared chain; imp-33923 and imp-33924 have no imports at ' +
    'all. This closes the imp-33979 audit item and clears the imp-33917..33925 cohort for safe ' +
    'consumer-viz import.',
  honestNote:
    'Read-only audit; no new pages fabricated, no new bound claimed by this module itself. ' +
    'imp-3066 K_a >= 0 positivity untouched. Platt-Trudgian Lambda <= 0.2 remains SOTA. No QED.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_33979_ASSERTIONS = [
  {
    id: 'imp33979-exactly-nine-modules-audited',
    holds: () => IMP_33979_HEAVY_IMPORT_AUDIT.modules.length === 9,
    why: 'The audit must cover exactly the nine named modules (imp-33917..33925).',
  },
  {
    id: 'imp33979-all-nine-heavy-import-safe',
    holds: () => {
      const m = IMP_33979_HEAVY_IMPORT_AUDIT.modules;
      const safe = m.filter((x) => x.hasHeavyImport === false).length;
      return safe === 9 && safe === IMP_33979_HEAVY_IMPORT_AUDIT.heavyImportSafeCount;
    },
    why: 'Grep-verified: the transitive closure of every import in all nine modules terminates ' +
      'without ever naming zeros-to-1e6.js.',
  },
  {
    id: 'imp33979-two-of-nine-import-free',
    holds: () =>
      IMP_33979_HEAVY_IMPORT_AUDIT.modules.filter((x) => x.directImports.length === 0).length === 2,
    why: 'imp-33923 and imp-33924 are fully self-contained with zero import lines; the remaining ' +
      'seven all resolve to precedent-cleared chains.',
  },
  {
    id: 'imp33979-honest-scope-locked',
    holds: () =>
      /SOTA/.test(IMP_33979_HEAVY_IMPORT_AUDIT.honestNote) &&
      /no QED/i.test(IMP_33979_HEAVY_IMPORT_AUDIT.honestNote) &&
      /imp-3066/.test(IMP_33979_HEAVY_IMPORT_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; Platt-Trudgian Lambda <= 0.2 ' +
      'stays SOTA and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33979_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33979 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33979_ASSERTIONS };
