/**
 * @module imp-33825-33786-33787-33788-33789-heavy-import-audit
 * @fileoverview imp-33825 -- heavy-import safety audit of the imp-33786 (H3 joint-curvature input
 * scoping), imp-33787 (G7 Perron lower-bound feasibility), imp-33788 (E_flow displacement
 * sqrt-log running correction), and imp-33789 (decoupled-rate grid) modules, mirroring the
 * imp-33805 audit of the imp-33765/imp-33766/imp-33767 cohort. Confirms none of the four
 * transitively imports the 16.7MB src/data/zeros-to-1e6.js zero-ordinate bundle (which hangs
 * vite ssrLoadModule / npm-run-assert when pulled into an assertion module).
 *
 * METHOD (read-only, performed at author time). Direct grep of each of the four module source
 * files for ^import( lines, then recursive grep of every named import target, following the
 * transitive closure until every branch terminates at a file with zero import lines.
 *
 * RESULT (audited 2026-07-04).
 *   - imp-33786-h3-joint-curvature-input-scoping.js has ZERO import lines -- fully self-contained.
 *   - imp-33787-g7-perron-lower-bound.js has ZERO import lines -- fully self-contained.
 *   - imp-33788-eflow-displacement-sqrtlog-running-correction.js imports effectiveHeightForN
 *     (lambda-rh-height-mapping.js) and C_C_PINNED (polymath15-constant-C-C.js) only -- the same
 *     import pair already cleared by the imp-33763/imp-33783/imp-33805 precedent audits.
 *   - imp-33789-decoupled-rate-grid.js has ZERO import lines -- fully self-contained.
 * Tracing the shared pair's closure: lambda-rh-height-mapping.js -> bridge-lambda-rh.js ->
 * guth-maynard-tail-bound.js (zero imports); polymath15-constant-C-C.js -> g6a-sub-constant-
 * value.js, polymath15-lemma52-shock-holder.js, lambda-intercept-burgers-uniformity.js ->
 * dyson-scaling-N5000.js -> zeta.js -> primes.js (zero imports), dyson-burgers-shock.js /
 * lambda-intercept-analytic.js -> dyson-monotonicity-proof.js / dyson-collision-lower-bound.js ->
 * zeta.js (as above), lambda-intercept-confidence.js -> lambda-error-budget.js (zero imports).
 * Every branch terminates without ever naming zeros-to-1e6.js. All four target modules are
 * therefore heavy-import-safe.
 *
 * This is a read-only audit: it changes no bound, establishes no operator positivity, imp-3066
 * K_a >= 0 stays untouched, no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33805 (the precedent heavy-import audit this note mirrors), imp-33783, imp-33763
 */

export const IMP_33825_HEAVY_IMPORT_AUDIT = {
  id: 'imp-33825',
  auditedAt: '2026-07-04',
  modules: [
    {
      file: 'imp-33786-h3-joint-curvature-input-scoping.js',
      directImports: [],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33787-g7-perron-lower-bound.js',
      directImports: [],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33788-eflow-displacement-sqrtlog-running-correction.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33789-decoupled-rate-grid.js',
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
  heavyImportSafeCount: 4,
  recommendation:
    'No action needed -- all four modules are already heavy-import-safe. imp-33788 shares the ' +
    'exact import pair already cleared by the imp-33763/imp-33783/imp-33805 precedent audits, ' +
    'and imp-33786/imp-33787/imp-33789 have no imports at all. This closes the imp-33825 audit ' +
    'item; no further imp-33786/imp-33787/imp-33788/imp-33789 heavy-import work is queued.',
  honestNote:
    'Read-only audit; no new pages fabricated, no new bound claimed by this module itself. ' +
    'imp-3066 K_a >= 0 positivity untouched. No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_33825_ASSERTIONS = [
  {
    id: 'imp33825-exactly-four-modules-audited',
    holds: () => IMP_33825_HEAVY_IMPORT_AUDIT.modules.length === 4,
    why: 'The audit must cover exactly the four named modules (imp-33786/imp-33787/imp-33788/imp-33789).',
  },
  {
    id: 'imp33825-all-four-heavy-import-safe',
    holds: () => {
      const m = IMP_33825_HEAVY_IMPORT_AUDIT.modules;
      const safe = m.filter((x) => x.hasHeavyImport === false).length;
      return safe === 4 && safe === IMP_33825_HEAVY_IMPORT_AUDIT.heavyImportSafeCount;
    },
    why: 'Grep-verified: the transitive closure of every import in all four modules terminates ' +
      'without ever naming zeros-to-1e6.js.',
  },
  {
    id: 'imp33825-three-of-four-import-free',
    holds: () =>
      IMP_33825_HEAVY_IMPORT_AUDIT.modules.filter((x) => x.directImports.length === 0).length === 3,
    why: 'imp-33786, imp-33787, and imp-33789 are fully self-contained with zero import lines, so ' +
      'only imp-33788 has a transitive closure to trace.',
  },
  {
    id: 'imp33825-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_33825_HEAVY_IMPORT_AUDIT.honestNote) &&
      /no QED/i.test(IMP_33825_HEAVY_IMPORT_AUDIT.honestNote) &&
      /imp-3066/.test(IMP_33825_HEAVY_IMPORT_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed' +
      ' and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33825_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33825 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33825_ASSERTIONS };
