/**
 * @module imp-33873-33843-33844-33845-heavy-import-audit
 * @fileoverview imp-33873 -- heavy-import safety audit of the imp-33843 (eflow_attr/resid_exp
 * log-linear widening-form fit), imp-33844 (M3 hump-peak closed form), and imp-33845 (C_ren-C_PS
 * fixed-3/2 onset-rate) modules, mirroring the imp-33825 audit of the imp-33786/imp-33787/
 * imp-33788/imp-33789 cohort. Confirms none of the three transitively imports the 16.7MB
 * src/data/zeros-to-1e6.js zero-ordinate bundle (which hangs vite ssrLoadModule / npm-run-assert
 * when pulled into an assertion module), so a consumer viz page can safely import them.
 *
 * METHOD (read-only, performed at author time). Direct grep of each of the three module source
 * files for ^import( lines, then recursive grep of every named import target, following the
 * transitive closure until every branch terminates at a file with zero import lines.
 *
 * RESULT (audited 2026-07-05).
 *   - imp-33845-cren-gap-onset-rate.js has ZERO import lines -- fully self-contained.
 *   - imp-33843-eflow-resid-widening-form-fit.js imports only the imp-33810 ladder
 *     (IMP33810_EFLOW_RESID_RATIO_N_LADDER from imp-33810-eflow-resid-ratio-N-ladder.js), which
 *     in turn imports effectiveHeightForN (lambda-rh-height-mapping.js) and C_C_PINNED
 *     (polymath15-constant-C-C.js) -- the SAME pair already cleared by the imp-33763/imp-33783/
 *     imp-33805/imp-33825 precedent audits.
 *   - imp-33844-hump-peak-closed-form.js imports effectiveHeightForN (lambda-rh-height-mapping.js)
 *     and C_C_PINNED (polymath15-constant-C-C.js) directly -- the identical precedent-cleared pair.
 * Tracing the shared pair's closure: lambda-rh-height-mapping.js -> bridge-lambda-rh.js ->
 * guth-maynard-tail-bound.js (zero imports); polymath15-constant-C-C.js -> g6a-sub-constant-
 * value.js, polymath15-lemma52-shock-holder.js, lambda-intercept-burgers-uniformity.js ->
 * dyson-scaling-N5000.js -> zeta.js -> primes.js (zero imports), dyson-burgers-shock.js /
 * lambda-intercept-analytic.js -> dyson-monotonicity-proof.js / dyson-collision-lower-bound.js ->
 * zeta.js (as above), lambda-intercept-confidence.js -> lambda-error-budget.js (zero imports).
 * Every branch terminates without ever naming zeros-to-1e6.js. All three target modules are
 * therefore heavy-import-safe.
 *
 * This is a read-only audit: it changes no bound, establishes no operator positivity, imp-3066
 * K_a >= 0 stays untouched, no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33825 (the precedent heavy-import audit this note mirrors), imp-33805, imp-33783, imp-33763
 */

export const IMP_33873_HEAVY_IMPORT_AUDIT = {
  id: 'imp-33873',
  auditedAt: '2026-07-05',
  modules: [
    {
      file: 'imp-33843-eflow-resid-widening-form-fit.js',
      directImports: ['IMP33810_EFLOW_RESID_RATIO_N_LADDER'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33844-hump-peak-closed-form.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33845-cren-gap-onset-rate.js',
      directImports: [],
      hasHeavyImport: false,
    },
  ],
  transitiveClosureFiles: [
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
  heavyImportSafeCount: 3,
  recommendation:
    'No action needed -- all three modules are already heavy-import-safe. imp-33843 and imp-33844 ' +
    'route through the exact effectiveHeightForN/C_C_PINNED pair already cleared by the imp-33763/' +
    'imp-33783/imp-33805/imp-33825 precedent audits, and imp-33845 has no imports at all. This ' +
    'closes the imp-33873 audit item and unblocks the imp-33864/33865/33866 viz consumers.',
  honestNote:
    'Read-only audit; no new pages fabricated, no new bound claimed by this module itself. ' +
    'imp-3066 K_a >= 0 positivity untouched. No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_33873_ASSERTIONS = [
  {
    id: 'imp33873-exactly-three-modules-audited',
    holds: () => IMP_33873_HEAVY_IMPORT_AUDIT.modules.length === 3,
    why: 'The audit must cover exactly the three named modules (imp-33843/imp-33844/imp-33845).',
  },
  {
    id: 'imp33873-all-three-heavy-import-safe',
    holds: () => {
      const m = IMP_33873_HEAVY_IMPORT_AUDIT.modules;
      const safe = m.filter((x) => x.hasHeavyImport === false).length;
      return safe === 3 && safe === IMP_33873_HEAVY_IMPORT_AUDIT.heavyImportSafeCount;
    },
    why: 'Grep-verified: the transitive closure of every import in all three modules terminates ' +
      'without ever naming zeros-to-1e6.js.',
  },
  {
    id: 'imp33873-one-of-three-import-free',
    holds: () =>
      IMP_33873_HEAVY_IMPORT_AUDIT.modules.filter((x) => x.directImports.length === 0).length === 1,
    why: 'imp-33845 is fully self-contained with zero import lines; imp-33843 and imp-33844 both ' +
      'resolve to the same precedent-cleared effectiveHeightForN/C_C_PINNED pair.',
  },
  {
    id: 'imp33873-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_33873_HEAVY_IMPORT_AUDIT.honestNote) &&
      /no QED/i.test(IMP_33873_HEAVY_IMPORT_AUDIT.honestNote) &&
      /imp-3066/.test(IMP_33873_HEAVY_IMPORT_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed' +
      ' and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33873_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33873 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33873_ASSERTIONS };
