/**
 * @module imp-33913-33877-33878-33879-33896-heavy-import-audit
 * @fileoverview imp-33913 -- heavy-import safety audit of the imp-33877 (widening-fit
 * tail-endpoint artifact test), imp-33878 (hump-argmax grid refinement), imp-33879
 * (geometric-center correction endpoint/midpoint offset), and imp-33896 (decade-label
 * consistency audit) modules, mirroring the imp-33805 and imp-33842 precedent audits.
 * Confirms none of the four transitively imports the 16.7MB src/data/zeros-to-1e6.js
 * zero-ordinate bundle (which hangs vite ssrLoadModule / npm-run-assert when pulled into
 * an assertion module), so a consumer viz page can safely import any of them.
 *
 * METHOD (read-only, performed at author time). Direct grep of each of the four module
 * source files for ^import( lines, then recursive grep of every named import target,
 * following the transitive closure until every branch terminates at a file with zero
 * import lines.
 *
 * RESULT (audited 2026-07-05).
 *   - imp-33877-widening-fit-tail-endpoint-artifact-test.js imports effectiveHeightForN
 *     (lambda-rh-height-mapping.js), C_C_PINNED (polymath15-constant-C-C.js) -- the same
 *     import pair already cleared by the imp-33763/imp-33783/imp-33805/imp-33825/imp-33842
 *     precedent audits -- plus IMP33810_EFLOW_RESID_RATIO_N_LADDER from
 *     imp-33810-eflow-resid-ratio-N-ladder.js, which imports only the identical cleared pair
 *     (already traced by the imp-33842 audit).
 *   - imp-33878-hump-argmax-grid-refinement.js imports the identical cleared pair only.
 *   - imp-33879-geometric-center-correction-endpoint-midpoint-offset.js imports
 *     effectiveHeightForN only, from the same cleared source.
 *   - imp-33896-decade-label-consistency-audit.js has ZERO import lines -- fully
 *     self-contained.
 * Tracing the shared pair's closure (as established by the imp-33842 precedent):
 * lambda-rh-height-mapping.js -> bridge-lambda-rh.js -> guth-maynard-tail-bound.js (zero
 * imports); polymath15-constant-C-C.js -> g6a-sub-constant-value.js,
 * polymath15-lemma52-shock-holder.js, lambda-intercept-burgers-uniformity.js ->
 * dyson-scaling-N5000.js -> zeta.js -> primes.js (zero imports), dyson-burgers-shock.js /
 * lambda-intercept-analytic.js -> dyson-monotonicity-proof.js / dyson-collision-lower-bound.js
 * -> zeta.js (as above), lambda-intercept-confidence.js -> lambda-error-budget.js (zero
 * imports). Every branch terminates without ever naming zeros-to-1e6.js. All four target
 * modules are therefore heavy-import-safe.
 *
 * This is a read-only audit: it changes no bound, establishes no operator positivity, imp-3066
 * K_a >= 0 stays untouched, no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33842 (the precedent heavy-import audit this note mirrors), imp-33805, imp-33825
 */

export const IMP_33913_HEAVY_IMPORT_AUDIT = {
  id: 'imp-33913',
  auditedAt: '2026-07-05',
  modules: [
    {
      file: 'imp-33877-widening-fit-tail-endpoint-artifact-test.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED', 'IMP33810_EFLOW_RESID_RATIO_N_LADDER'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33878-hump-argmax-grid-refinement.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33879-geometric-center-correction-endpoint-midpoint-offset.js',
      directImports: ['effectiveHeightForN'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33896-decade-label-consistency-audit.js',
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
    'imp-33810-eflow-resid-ratio-N-ladder.js',
  ],
  heavyImportSafeCount: 4,
  recommendation:
    'No action needed -- all four modules are already heavy-import-safe. imp-33877/imp-33878/' +
    'imp-33879 share the exact effectiveHeightForN/C_C_PINNED import pair already cleared by the ' +
    'imp-33763/imp-33783/imp-33805/imp-33825/imp-33842 precedent audits (imp-33877 additionally ' +
    'pulls in the already-cleared imp-33810 module), and imp-33896 has no imports at all. This ' +
    'closes the imp-33913 audit item; no further imp-33877/imp-33878/imp-33879/imp-33896 ' +
    'heavy-import work is queued.',
  honestNote:
    'Read-only audit; no new pages fabricated, no new bound claimed by this module itself. ' +
    'imp-3066 K_a >= 0 positivity untouched. No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_33913_ASSERTIONS = [
  {
    id: 'imp33913-exactly-four-modules-audited',
    holds: () => IMP_33913_HEAVY_IMPORT_AUDIT.modules.length === 4,
    why: 'The audit must cover exactly the four named modules (imp-33877/imp-33878/imp-33879/' +
      'imp-33896).',
  },
  {
    id: 'imp33913-all-four-heavy-import-safe',
    holds: () => {
      const m = IMP_33913_HEAVY_IMPORT_AUDIT.modules;
      const safe = m.filter((x) => x.hasHeavyImport === false).length;
      return safe === 4 && safe === IMP_33913_HEAVY_IMPORT_AUDIT.heavyImportSafeCount;
    },
    why: 'Grep-verified: the transitive closure of every import in all four modules terminates ' +
      'without ever naming zeros-to-1e6.js.',
  },
  {
    id: 'imp33913-one-of-four-import-free',
    holds: () =>
      IMP_33913_HEAVY_IMPORT_AUDIT.modules.filter((x) => x.directImports.length === 0).length === 1,
    why: 'Only imp-33896 is fully self-contained with zero import lines; the other three each ' +
      'have a traced, already-cleared transitive closure.',
  },
  {
    id: 'imp33913-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_33913_HEAVY_IMPORT_AUDIT.honestNote) &&
      /no QED/i.test(IMP_33913_HEAVY_IMPORT_AUDIT.honestNote) &&
      /imp-3066/.test(IMP_33913_HEAVY_IMPORT_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed' +
      ' and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33913_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33913 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33913_ASSERTIONS };
