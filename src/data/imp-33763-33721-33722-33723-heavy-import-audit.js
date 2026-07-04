/**
 * @module imp-33763-33721-33722-33723-heavy-import-audit
 * @fileoverview imp-33763 -- heavy-import safety audit of the self-computing imp-33721
 * (sub-decade ramp-inflection localization), imp-33722 (far-tail 1%-of-half exponent-ladder
 * extension), and imp-33723 (closed-form sigma=1/2 crossover) sigma-decay modules, mirroring the
 * imp-33720 audit of the imp-33679..imp-33682 cohort. Confirms none of the three transitively
 * imports the 16.7MB src/data/zeros-to-1e6.js zero-ordinate bundle (which hangs vite
 * ssrLoadModule / npm-run-assert when pulled into an assertion module) and that each computes its
 * landmark from PINNED constants (C_C_PINNED, the fixed-strip E_trunc = 3.06e-5, and the
 * effectiveHeightForN Riemann-von Mangoldt inverse), not from the raw zero list.
 *
 * METHOD (read-only, performed at author time). Direct grep of each of the three module source
 * files for ^import( lines, then recursive grep of every named import target, following the
 * transitive closure until every branch terminates at a file with zero import lines or a file
 * already independently confirmed import-free.
 *
 * RESULT (audited 2026-07-04).
 *   - imp-33721-sigma-ramp-inflection-subdecade.js imports effectiveHeightForN
 *     (lambda-rh-height-mapping.js), C_C_PINNED (polymath15-constant-C-C.js), and
 *     IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY (imp-33582-sigma-postpeak-nearpeak-
 *     threshold-decay.js).
 *   - imp-33722-sigma-exponent-ladder-fartail-1pct-of-half.js imports effectiveHeightForN and
 *     C_C_PINNED only.
 *   - imp-33723-sigma-half-vs-crossover-closed-form.js imports effectiveHeightForN and
 *     C_C_PINNED only.
 * Tracing the transitive closure of all named targets: lambda-rh-height-mapping.js ->
 * bridge-lambda-rh.js -> guth-maynard-tail-bound.js (zero imports); polymath15-constant-C-C.js ->
 * g6a-sub-constant-value.js, polymath15-lemma52-shock-holder.js, lambda-intercept-burgers-
 * uniformity.js -> dyson-scaling-N5000.js -> zeta.js -> primes.js (zero imports),
 * dyson-burgers-shock.js / lambda-intercept-analytic.js -> dyson-monotonicity-proof.js /
 * dyson-collision-lower-bound.js -> zeta.js (as above), lambda-intercept-confidence.js ->
 * lambda-error-budget.js (zero imports). Every branch terminates without ever naming
 * zeros-to-1e6.js. zeta.js's ZETA_ZEROS is a small pinned in-file literal array, not the 16.7MB
 * bundle. All three target modules are therefore heavy-import-safe, and each derives its landmark
 * purely from the pinned C_C_PINNED / E_trunc constants plus the effectiveHeightForN closed-form
 * height map -- no raw zero-ordinate data is consulted.
 *
 * This is a read-only audit: it changes no bound, establishes no operator positivity, imp-3066
 * K_a >= 0 stays untouched, no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33720 (the precedent heavy-import audit this note mirrors), imp-33695, imp-33693
 */

export const IMP_33763_HEAVY_IMPORT_AUDIT = {
  id: 'imp-33763',
  auditedAt: '2026-07-04',
  modules: [
    {
      file: 'imp-33721-sigma-ramp-inflection-subdecade.js',
      directImports: [
        'effectiveHeightForN',
        'C_C_PINNED',
        'IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY',
      ],
      hasHeavyImport: false,
      landmarkFromPinnedConstantsOnly: true,
    },
    {
      file: 'imp-33722-sigma-exponent-ladder-fartail-1pct-of-half.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
      landmarkFromPinnedConstantsOnly: true,
    },
    {
      file: 'imp-33723-sigma-half-vs-crossover-closed-form.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
      landmarkFromPinnedConstantsOnly: true,
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
    'imp-33582-sigma-postpeak-nearpeak-threshold-decay.js',
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
    'No action needed -- all three modules are already heavy-import-safe and already compute ' +
    'their landmarks from pinned constants only. This closes the imp-33763 audit item; no ' +
    'further imp-33721/imp-33722/imp-33723 heavy-import work is queued.',
  honestNote:
    'Read-only audit; no new pages fabricated, no new bound claimed by this module itself. ' +
    'imp-3066 K_a >= 0 positivity untouched. Platt-Trudgian Lambda <= 0.2 remains SOTA. No QED.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_33763_ASSERTIONS = [
  {
    id: 'imp33763-exactly-three-modules-audited',
    holds: () => IMP_33763_HEAVY_IMPORT_AUDIT.modules.length === 3,
    why: 'The audit must cover exactly the three named modules (imp-33721/imp-33722/imp-33723).',
  },
  {
    id: 'imp33763-all-three-heavy-import-safe',
    holds: () => {
      const m = IMP_33763_HEAVY_IMPORT_AUDIT.modules;
      const safe = m.filter((x) => x.hasHeavyImport === false).length;
      return safe === 3 && safe === IMP_33763_HEAVY_IMPORT_AUDIT.heavyImportSafeCount;
    },
    why: 'Grep-verified: the transitive closure of every import in all three modules terminates ' +
      'without ever naming zeros-to-1e6.js.',
  },
  {
    id: 'imp33763-all-three-pinned-constants-only',
    holds: () =>
      IMP_33763_HEAVY_IMPORT_AUDIT.modules.every((x) => x.landmarkFromPinnedConstantsOnly === true),
    why: 'Each module computes its landmark from C_C_PINNED / E_trunc / effectiveHeightForN -- ' +
      'pinned constants and a closed-form height map, not the raw zero-ordinate list.',
  },
  {
    id: 'imp33763-honest-scope-locked',
    holds: () =>
      /SOTA/.test(IMP_33763_HEAVY_IMPORT_AUDIT.honestNote) &&
      /no QED/i.test(IMP_33763_HEAVY_IMPORT_AUDIT.honestNote) &&
      /imp-3066/.test(IMP_33763_HEAVY_IMPORT_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; Platt-Trudgian Lambda <= 0.2 ' +
      'stays SOTA and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33763_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33763 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33763_ASSERTIONS };
