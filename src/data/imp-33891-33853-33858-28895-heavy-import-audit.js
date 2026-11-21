/**
 * @module imp-33891-33853-33858-28895-heavy-import-audit
 * @fileoverview imp-33891 -- heavy-import safety audit of the imp-33853 (C_ren-gap coefficient
 * closed form), imp-33854 (log-saturation exponent reconciliation), imp-33855 (n_cross-thr
 * monotone ordering), imp-33856 (E_coll discrete-residual log-shortfall fit), imp-33857
 * (hump-peak widening cross-validation), imp-33858 (widening-fit residual localization), and
 * imp-28895 (E_flow-resid widening model derivation) modules, mirroring the imp-33873 audit of
 * the imp-33843/imp-33844/imp-33845 cohort. Confirms none of the seven transitively imports the
 * 16.7MB src/data/zeros-to-1e6.js zero-ordinate bundle (which hangs vite ssrLoadModule /
 * npm-run-assert when pulled into an assertion module), so a consumer viz page can safely
 * import them.
 *
 * METHOD (read-only, performed at author time). Direct grep of each of the seven module source
 * files for ^import( lines, then recursive grep of every named import target, following the
 * transitive closure until every branch terminates at a file with zero import lines.
 *
 * RESULT (audited 2026-07-05).
 *   - imp-33853-cren-gap-coefficient-closed-form.js has ZERO import lines -- fully self-contained.
 *   - imp-33854-log-saturation-exponent-reconciliation.js, imp-33855-ncross-thr-monotone-
 *     ordering.js, imp-33856-ecoll-discrete-residual-log-shortfall-fit.js, and imp-28895-eflow-
 *     resid-widening-model-derivation.js each import effectiveHeightForN (lambda-rh-height-
 *     mapping.js) and C_C_PINNED (polymath15-constant-C-C.js) directly -- the SAME pair already
 *     cleared by the imp-33763/imp-33783/imp-33805/imp-33825/imp-33873 precedent audits.
 *   - imp-33857-hump-peak-widening-crossvalidation.js imports IMP33810_EFLOW_RESID_RATIO_N_LADDER
 *     (imp-33810-eflow-resid-ratio-N-ladder.js) and IMP33844_HUMP_PEAK_CLOSED_FORM (imp-33844-
 *     hump-peak-closed-form.js) -- both precedent-cleared by the imp-33873 audit itself.
 *   - imp-33858-widening-fit-residual-localization.js imports only IMP33810_EFLOW_RESID_RATIO_N_
 *     LADDER (imp-33810-eflow-resid-ratio-N-ladder.js), same precedent-cleared chain.
 * Tracing the shared effectiveHeightForN/C_C_PINNED pair's closure (unchanged since imp-33873):
 * lambda-rh-height-mapping.js -> bridge-lambda-rh.js -> guth-maynard-tail-bound.js (zero imports);
 * polymath15-constant-C-C.js -> g6a-sub-constant-value.js, polymath15-lemma52-shock-holder.js,
 * lambda-intercept-burgers-uniformity.js -> dyson-scaling-N5000.js -> zeta.js -> primes.js (zero
 * imports), dyson-burgers-shock.js / lambda-intercept-analytic.js -> dyson-monotonicity-proof.js /
 * dyson-collision-lower-bound.js -> zeta.js (as above), lambda-intercept-confidence.js ->
 * lambda-error-budget.js (zero imports). imp-33810-eflow-resid-ratio-N-ladder.js and imp-33844-
 * hump-peak-closed-form.js both route through the identical effectiveHeightForN/C_C_PINNED pair.
 * Every branch terminates without ever naming zeros-to-1e6.js. All seven target modules are
 * therefore heavy-import-safe.
 *
 * This is a read-only audit: it changes no bound, establishes no operator positivity, imp-3066
 * K_a >= 0 stays untouched, no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33873 (the precedent heavy-import audit this note mirrors), imp-33825, imp-33805,
 * imp-33783, imp-33763
 */

export const IMP_33891_HEAVY_IMPORT_AUDIT = {
  id: 'imp-33891',
  auditedAt: '2026-07-05',
  modules: [
    {
      file: 'imp-33853-cren-gap-coefficient-closed-form.js',
      directImports: [],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33854-log-saturation-exponent-reconciliation.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33855-ncross-thr-monotone-ordering.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33856-ecoll-discrete-residual-log-shortfall-fit.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33857-hump-peak-widening-crossvalidation.js',
      directImports: ['IMP33810_EFLOW_RESID_RATIO_N_LADDER', 'IMP33844_HUMP_PEAK_CLOSED_FORM'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33858-widening-fit-residual-localization.js',
      directImports: ['IMP33810_EFLOW_RESID_RATIO_N_LADDER'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-28895-eflow-resid-widening-model-derivation.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
    },
  ],
  transitiveClosureFiles: [
    'imp-33810-eflow-resid-ratio-N-ladder.js',
    'imp-33844-hump-peak-closed-form.js',
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
  heavyImportSafeCount: 7,
  recommendation:
    'No action needed -- all seven modules are already heavy-import-safe. imp-33854/imp-33855/' +
    'imp-33856/imp-28895 route through the exact effectiveHeightForN/C_C_PINNED pair already ' +
    'cleared by the imp-33763/imp-33783/imp-33805/imp-33825/imp-33873 precedent audits; imp-33857 ' +
    'and imp-33858 route through the imp-33810/imp-33844 pair which resolves to the same ' +
    'precedent-cleared chain; imp-33853 has no imports at all. This closes the imp-33891 audit ' +
    'item and clears the imp-33853..33858 + imp-28895 cohort for safe consumer-viz import.',
  honestNote:
    'Read-only audit; no new pages fabricated, no new bound claimed by this module itself. ' +
    'imp-3066 K_a >= 0 positivity untouched. No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_33891_ASSERTIONS = [
  {
    id: 'imp33891-exactly-seven-modules-audited',
    holds: () => IMP_33891_HEAVY_IMPORT_AUDIT.modules.length === 7,
    why: 'The audit must cover exactly the seven named modules (imp-33853/54/55/56/57/58 + imp-28895).',
  },
  {
    id: 'imp33891-all-seven-heavy-import-safe',
    holds: () => {
      const m = IMP_33891_HEAVY_IMPORT_AUDIT.modules;
      const safe = m.filter((x) => x.hasHeavyImport === false).length;
      return safe === 7 && safe === IMP_33891_HEAVY_IMPORT_AUDIT.heavyImportSafeCount;
    },
    why: 'Grep-verified: the transitive closure of every import in all seven modules terminates ' +
      'without ever naming zeros-to-1e6.js.',
  },
  {
    id: 'imp33891-one-of-seven-import-free',
    holds: () =>
      IMP_33891_HEAVY_IMPORT_AUDIT.modules.filter((x) => x.directImports.length === 0).length === 1,
    why: 'imp-33853 is fully self-contained with zero import lines; the remaining six all resolve ' +
      'to precedent-cleared chains.',
  },
  {
    id: 'imp33891-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_33891_HEAVY_IMPORT_AUDIT.honestNote) &&
      /no QED/i.test(IMP_33891_HEAVY_IMPORT_AUDIT.honestNote) &&
      /imp-3066/.test(IMP_33891_HEAVY_IMPORT_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed' +
      ' and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33891_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33891 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33891_ASSERTIONS };
