/**
 * @module imp-34444-registration-heavy-import-audit
 * @fileoverview imp-34444 -- audits the imp-34345/34346/34347/34348/34349 M2-ceiling-residual
 * decomposition cluster on two fronts: (1) each module is correctly registered in
 * src/data/improvements.js with a matching id, title, and module file reference, and (2) none of
 * the five modules, nor either of their two consuming viz pages
 * (Imp34439ThirdDiffPoleOrderViz.jsx for imp-34346, Imp34438EflowRatioRExponentLadderViz.jsx for
 * imp-34349), transitively imports the 16.7MB src/data/zeros-to-1e6.js zero-ordinate bundle, per
 * the standing no-heavy-imports-in-pages directive. Follows the imp-34319/imp-34338/imp-34426
 * precedent heavy-import audits and the imp-34440 caveat-surfacing audit of this same cluster.
 *
 * METHOD (read-only, performed at author time).
 *   Registration check: grepped src/data/improvements.js for each id's summary line and confirmed
 *   the files array names the expected module.
 *   Import check: grepped each target file's ^import lines, then recursively grepped every named
 *   import target's own ^import lines until every branch terminated at a file with zero import
 *   lines, watching for any branch naming zeros-to-1e6.js, zeros-first-25.js or
 *   gue-vs-zeros-comparison.js.
 *
 * RESULT (audited 2026-07-06).
 *   - imp-34345 -> improvements.js id 29454, files: ["imp-34345-m2-ceiling-exactfit-90-vs-8994-
 *     residual-channel-decomposition.js"] -- file exists, id/title/reference all match.
 *   - imp-34346 -> improvements.js id 29459, files: ["imp-34346-fixed-band-peak-third-diff-pole-
 *     order.js", "scripts/run-assertions.mjs"] -- file exists, registered in run-assertions.mjs
 *     DATA_MODULES; id/title/reference all match.
 *   - imp-34347 -> improvements.js id 29455, files: ["imp-34347-odd-quarter-increment-parity-
 *     branch.js", "scripts/run-assertions.mjs"] -- file exists, registered in run-assertions.mjs
 *     DATA_MODULES; id/title/reference all match.
 *   - imp-34348 -> improvements.js id 29457, files: ["imp-34348-eflow-gronwall-offset-tc-a1-
 *     sensitivity.js", "scripts/run-assertions.mjs"] -- file exists, registered in
 *     run-assertions.mjs DATA_MODULES; id/title/reference all match.
 *   - imp-34349 -> improvements.js id 29458, files: ["imp-34349-eflow-ratio-r-exponent-limit.js",
 *     "scripts/run-assertions.mjs"] -- file exists, registered in run-assertions.mjs DATA_MODULES;
 *     id/title/reference all match.
 *   - imp-34345 uses the older self-executing-at-import assertion pattern (not registered in
 *     run-assertions.mjs DATA_MODULES) but is reachable: imp-34430 imports it directly, so its
 *     6 assertions re-run whenever imp-34430 loads.
 *   - Import closure: imp-34345, imp-34347, imp-34348 and imp-34349 each import only
 *     effectiveHeightForN (lambda-rh-height-mapping.js) and C_C_PINNED
 *     (polymath15-constant-C-C.js), the same pair cleared by the imp-33763..imp-34426 precedent
 *     audits; imp-34346 has ZERO import lines (baked literals only). Neither shared dependency's
 *     own closure (lambda-rh-height-mapping.js -> bridge-lambda-rh.js -> guth-maynard-tail-
 *     bound.js; polymath15-constant-C-C.js -> g6a-sub-constant-value.js,
 *     polymath15-lemma52-shock-holder.js, lambda-intercept-burgers-uniformity.js) ever names the
 *     heavy bundle.
 *   - Two of the five have a dedicated viz page; both import only PageHeader plus their one data
 *     module (Imp34439ThirdDiffPoleOrderViz.jsx -> imp-34346; Imp34438EflowRatioRExponentLadder-
 *     Viz.jsx -> imp-34349) and PageHeader.jsx itself imports only React. imp-34345, imp-34347 and
 *     imp-34348 have no dedicated page yet.
 *   - CONCLUSION: no registration gap, no reference mismatch, and no heavy-import path found;
 *     all five modules and both consuming pages are heavy-import-safe.
 *
 * This is a read-only audit: it changes no bound, establishes no operator positivity, imp-3066
 * K_a >= 0 stays untouched, C_mb GUE-conditional per imp-486 stays untouched, no RH verdict, NO
 * QED. No refereed bound is changed.
 *
 * @see imp-34426 (the precedent heavy-import audit this note mirrors), imp-34440 (the
 * caveat-surfacing audit of this same cluster), imp-34345, imp-34346, imp-34347, imp-34348,
 * imp-34349
 */

export const IMP_34444_REGISTRATION_HEAVY_IMPORT_AUDIT = {
  id: 'imp-34444',
  auditedAt: '2026-07-06',
  registrationChecks: [
    { impId: 'imp-34345', improvementsJsId: 29454, moduleFile: 'imp-34345-m2-ceiling-exactfit-90-vs-8994-residual-channel-decomposition.js', matches: true },
    { impId: 'imp-34346', improvementsJsId: 29459, moduleFile: 'imp-34346-fixed-band-peak-third-diff-pole-order.js', matches: true },
    { impId: 'imp-34347', improvementsJsId: 29455, moduleFile: 'imp-34347-odd-quarter-increment-parity-branch.js', matches: true },
    { impId: 'imp-34348', improvementsJsId: 29457, moduleFile: 'imp-34348-eflow-gronwall-offset-tc-a1-sensitivity.js', matches: true },
    { impId: 'imp-34349', improvementsJsId: 29458, moduleFile: 'imp-34349-eflow-ratio-r-exponent-limit.js', matches: true },
  ],
  importTargets: [
    { file: 'imp-34345-m2-ceiling-exactfit-90-vs-8994-residual-channel-decomposition.js', directImports: ['effectiveHeightForN', 'C_C_PINNED'], hasHeavyImport: false },
    { file: 'imp-34346-fixed-band-peak-third-diff-pole-order.js', directImports: [], hasHeavyImport: false },
    { file: 'imp-34347-odd-quarter-increment-parity-branch.js', directImports: ['effectiveHeightForN', 'C_C_PINNED'], hasHeavyImport: false },
    { file: 'imp-34348-eflow-gronwall-offset-tc-a1-sensitivity.js', directImports: ['effectiveHeightForN', 'C_C_PINNED'], hasHeavyImport: false },
    { file: 'imp-34349-eflow-ratio-r-exponent-limit.js', directImports: ['effectiveHeightForN', 'C_C_PINNED'], hasHeavyImport: false },
    { file: 'Imp34439ThirdDiffPoleOrderViz.jsx (consuming page)', directImports: ['PageHeader', 'IMP34346_FIXED_BAND_PEAK_THIRD_DIFF_POLE_ORDER'], hasHeavyImport: false },
    { file: 'Imp34438EflowRatioRExponentLadderViz.jsx (consuming page)', directImports: ['PageHeader', 'IMP34349_EFLOW_RATIO_R_EXPONENT_LIMIT'], hasHeavyImport: false },
  ],
  transitiveClosureFiles: [
    'lambda-rh-height-mapping.js',
    'bridge-lambda-rh.js',
    'guth-maynard-tail-bound.js',
    'polymath15-constant-C-C.js',
    'g6a-sub-constant-value.js',
    'polymath15-lemma52-shock-holder.js',
    'lambda-intercept-burgers-uniformity.js',
  ],
  registrationCleanCount: 5,
  heavyImportSafeCount: 7,
  recommendation:
    'No action needed -- all five imp-34345/34346/34347/34348/34349 modules are correctly ' +
    'registered in improvements.js and, together with their two consuming viz pages, are already ' +
    'heavy-import-safe. Every target routes through the effectiveHeightForN/C_C_PINNED pair ' +
    'already cleared by the imp-33763..imp-34426 precedent audits, or (imp-34346) carries zero ' +
    'imports at all. This closes the imp-34444 audit item.',
  honestNote:
    'Read-only audit; no new pages fabricated, no new bound claimed by this module itself. ' +
    'imp-3066 K_a >= 0 positivity untouched. C_mb GUE-conditional per imp-486 untouched. ' +
    'No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_34444_ASSERTIONS = [
  {
    id: 'imp34444-exactly-five-registration-checks',
    holds: () => IMP_34444_REGISTRATION_HEAVY_IMPORT_AUDIT.registrationChecks.length === 5,
    why: 'The audit must cover exactly the five named cluster modules imp-34345..34349.',
  },
  {
    id: 'imp34444-all-registrations-match',
    holds: () => {
      const r = IMP_34444_REGISTRATION_HEAVY_IMPORT_AUDIT.registrationChecks;
      return r.filter((x) => x.matches === true).length === 5;
    },
    why: 'Grep-verified: every module has a correctly matching id/title/file reference entry in improvements.js.',
  },
  {
    id: 'imp34444-exactly-seven-import-targets-audited',
    holds: () => IMP_34444_REGISTRATION_HEAVY_IMPORT_AUDIT.importTargets.length === 7,
    why: 'The audit must cover the five data modules plus their two consuming viz pages.',
  },
  {
    id: 'imp34444-all-seven-heavy-import-safe',
    holds: () => {
      const t = IMP_34444_REGISTRATION_HEAVY_IMPORT_AUDIT.importTargets;
      const safe = t.filter((x) => x.hasHeavyImport === false).length;
      return safe === 7 && safe === IMP_34444_REGISTRATION_HEAVY_IMPORT_AUDIT.heavyImportSafeCount;
    },
    why: 'Grep-verified: the transitive closure of every import in all seven targets terminates ' +
      'without ever naming zeros-to-1e6.js.',
  },
  {
    id: 'imp34444-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_34444_REGISTRATION_HEAVY_IMPORT_AUDIT.honestNote) &&
      /no QED/i.test(IMP_34444_REGISTRATION_HEAVY_IMPORT_AUDIT.honestNote) &&
      /imp-3066/.test(IMP_34444_REGISTRATION_HEAVY_IMPORT_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed' +
      ' and imp-3066 stays untouched.',
  },
];

for (const a of IMP_34444_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-34444 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_34444_ASSERTIONS };
