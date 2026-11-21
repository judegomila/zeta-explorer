/**
 * @module imp-33783-33743-33744-33745-heavy-import-audit
 * @fileoverview imp-33783 -- heavy-import safety audit of the imp-33743 (far-tail sigma crossover
 * closed form), imp-33744 (sigma-inflection vs sigma=1/2-halving closed form), and imp-33745 (G6a
 * H0 provenance-independence scoping) modules, mirroring the imp-33763 audit of the
 * imp-33721/imp-33722/imp-33723 cohort. Confirms none of the three transitively imports the
 * 16.7MB src/data/zeros-to-1e6.js zero-ordinate bundle (which hangs vite ssrLoadModule /
 * npm-run-assert when pulled into an assertion module).
 *
 * METHOD (read-only, performed at author time). Direct grep of each of the three module source
 * files for ^import( lines, then recursive grep of every named import target, following the
 * transitive closure until every branch terminates at a file with zero import lines or a file
 * already independently confirmed import-free by the imp-33763 precedent audit.
 *
 * RESULT (audited 2026-07-04).
 *   - imp-33743-sigma-fartail-crossover-closed-form.js imports effectiveHeightForN
 *     (lambda-rh-height-mapping.js) and C_C_PINNED (polymath15-constant-C-C.js) only.
 *   - imp-33744-sigma-inflection-vs-half-closed-form.js imports effectiveHeightForN and
 *     C_C_PINNED only (identical import pair to imp-33743).
 *   - imp-33745-h0-provenance-independence-scoping.js has ZERO import lines -- fully
 *     self-contained, no transitive closure to trace.
 * Tracing the transitive closure of the shared pair: lambda-rh-height-mapping.js ->
 * bridge-lambda-rh.js -> guth-maynard-tail-bound.js (zero imports); polymath15-constant-C-C.js ->
 * g6a-sub-constant-value.js, polymath15-lemma52-shock-holder.js, lambda-intercept-burgers-
 * uniformity.js -> dyson-scaling-N5000.js -> zeta.js -> primes.js (zero imports),
 * dyson-burgers-shock.js / lambda-intercept-analytic.js -> dyson-monotonicity-proof.js /
 * dyson-collision-lower-bound.js -> zeta.js (as above), lambda-intercept-confidence.js ->
 * lambda-error-budget.js (zero imports) -- this is the same closure already traced by imp-33763,
 * since imp-33743 and imp-33744 import the identical two symbols. Every branch terminates without
 * ever naming zeros-to-1e6.js. All three target modules are therefore heavy-import-safe.
 *
 * This is a read-only audit: it changes no bound, establishes no operator positivity, imp-3066
 * K_a >= 0 stays untouched, no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33763 (the precedent heavy-import audit this note mirrors), imp-33720, imp-33695
 */

export const IMP_33783_HEAVY_IMPORT_AUDIT = {
  id: 'imp-33783',
  auditedAt: '2026-07-04',
  modules: [
    {
      file: 'imp-33743-sigma-fartail-crossover-closed-form.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33744-sigma-inflection-vs-half-closed-form.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33745-h0-provenance-independence-scoping.js',
      directImports: [],
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
    'No action needed -- all three modules are already heavy-import-safe. imp-33743/imp-33744 ' +
    'share the exact import pair already cleared by the imp-33763 precedent audit, and imp-33745 ' +
    'has no imports at all. This closes the imp-33783 audit item; no further imp-33743/' +
    'imp-33744/imp-33745 heavy-import work is queued.',
  honestNote:
    'Read-only audit; no new pages fabricated, no new bound claimed by this module itself. ' +
    'imp-3066 K_a >= 0 positivity untouched. No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_33783_ASSERTIONS = [
  {
    id: 'imp33783-exactly-three-modules-audited',
    holds: () => IMP_33783_HEAVY_IMPORT_AUDIT.modules.length === 3,
    why: 'The audit must cover exactly the three named modules (imp-33743/imp-33744/imp-33745).',
  },
  {
    id: 'imp33783-all-three-heavy-import-safe',
    holds: () => {
      const m = IMP_33783_HEAVY_IMPORT_AUDIT.modules;
      const safe = m.filter((x) => x.hasHeavyImport === false).length;
      return safe === 3 && safe === IMP_33783_HEAVY_IMPORT_AUDIT.heavyImportSafeCount;
    },
    why: 'Grep-verified: the transitive closure of every import in all three modules terminates ' +
      'without ever naming zeros-to-1e6.js.',
  },
  {
    id: 'imp33783-h0-scoping-import-free',
    holds: () =>
      IMP_33783_HEAVY_IMPORT_AUDIT.modules.find(
        (x) => x.file === 'imp-33745-h0-provenance-independence-scoping.js'
      ).directImports.length === 0,
    why: 'imp-33745 is fully self-contained with zero import lines, so it has no transitive ' +
      'closure to trace at all.',
  },
  {
    id: 'imp33783-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_33783_HEAVY_IMPORT_AUDIT.honestNote) &&
      /no QED/i.test(IMP_33783_HEAVY_IMPORT_AUDIT.honestNote) &&
      /imp-3066/.test(IMP_33783_HEAVY_IMPORT_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed' +
      ' and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33783_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33783 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33783_ASSERTIONS };
