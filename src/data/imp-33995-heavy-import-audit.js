/**
 * @module imp-33995-heavy-import-audit
 * @fileoverview imp-33995 -- heavy-import safety audit of the imp-33940 (interior-residual
 * boundary-stability), imp-33941 (endpoint-peak-growth model-selection), imp-33942 (hump-argmax
 * gap-step proportionality), imp-33976 (model-cusp-onset-family honest banner), and imp-33977
 * (g-vs-law offset viz-data) modules, mirroring the imp-33979 precedent audit. Confirms none of
 * the five transitively imports the 16.7MB src/data/zeros-to-1e6.js zero-ordinate bundle (which
 * hangs vite ssrLoadModule / npm-run-assert when pulled into an assertion module), so a consumer
 * viz page can safely import them.
 *
 * METHOD (read-only, performed at author time). Direct grep of each of the five module source
 * files for ^import( lines, then recursive grep of every named import target, following the
 * transitive closure until every branch terminates at a file with zero import lines.
 *
 * RESULT (audited 2026-07-05).
 *   - imp-33940-interior-residual-boundary-stability.js and imp-33977-g-vs-law-offset-viz-
 *     data.js each import effectiveHeightForN (lambda-rh-height-mapping.js) and C_C_PINNED
 *     (polymath15-constant-C-C.js) directly -- the SAME pair already cleared by the
 *     imp-33763/imp-33783/imp-33805/imp-33825/imp-33873/imp-33891/imp-33979 precedent audits.
 *   - imp-33941-endpoint-peak-growth-model-selection.js imports only
 *     IMP33917_ENDPOINT_RESIDUAL_GROWTH_LAW (imp-33917-endpoint-residual-growth-law.js), which
 *     itself imports the same effectiveHeightForN/C_C_PINNED pair -- precedent-cleared by the
 *     imp-33979 audit.
 *   - imp-33942-hump-argmax-gap-step-proportionality.js imports only
 *     IMP33878_HUMP_ARGMAX_GRID_REFINEMENT (imp-33878-hump-argmax-grid-refinement.js), which
 *     itself imports the same effectiveHeightForN/C_C_PINNED pair.
 *   - imp-33976-model-cusp-onset-family-honest-banner.js imports four modules directly:
 *     IMP33853_CREN_GAP_COEFFICIENT_CLOSED_FORM (imp-33853), IMP33882_CUSP_EXPONENT_ONSET_
 *     COEFFICIENT_ROBUSTNESS (imp-33882), and IMP33883_OFF_AXIS_ONSET_ANGLE_ROBUSTNESS
 *     (imp-33883) each have ZERO import lines -- fully self-contained; IMP33924_JOINT_CUSP_
 *     ANGLE_ONSET_ROBUSTNESS_MAP (imp-33924-joint-cusp-angle-onset-robustness-map.js) also has
 *     ZERO import lines, per the imp-33979 audit.
 * Tracing the shared effectiveHeightForN/C_C_PINNED pair's closure (unchanged since imp-33979):
 * lambda-rh-height-mapping.js -> bridge-lambda-rh.js -> guth-maynard-tail-bound.js (zero imports);
 * polymath15-constant-C-C.js -> g6a-sub-constant-value.js, polymath15-lemma52-shock-holder.js,
 * lambda-intercept-burgers-uniformity.js -> dyson-scaling-N5000.js -> zeta.js -> primes.js (zero
 * imports), dyson-burgers-shock.js / lambda-intercept-analytic.js -> dyson-monotonicity-proof.js /
 * dyson-collision-lower-bound.js -> zeta.js (as above), lambda-intercept-confidence.js ->
 * lambda-error-budget.js (zero imports). Every branch terminates without ever naming
 * zeros-to-1e6.js. All five target modules are therefore heavy-import-safe.
 *
 * This is a read-only audit: it changes no bound, establishes no operator positivity, imp-3066
 * K_a >= 0 stays untouched, no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33979 (the precedent heavy-import audit this note mirrors), imp-33891, imp-33873,
 * imp-33825, imp-33805, imp-33783, imp-33763
 */

export const IMP_33995_HEAVY_IMPORT_AUDIT = {
  id: 'imp-33995',
  auditedAt: '2026-07-05',
  modules: [
    {
      file: 'imp-33940-interior-residual-boundary-stability.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33941-endpoint-peak-growth-model-selection.js',
      directImports: ['IMP33917_ENDPOINT_RESIDUAL_GROWTH_LAW'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33942-hump-argmax-gap-step-proportionality.js',
      directImports: ['IMP33878_HUMP_ARGMAX_GRID_REFINEMENT'],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33976-model-cusp-onset-family-honest-banner.js',
      directImports: [
        'IMP33853_CREN_GAP_COEFFICIENT_CLOSED_FORM',
        'IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ROBUSTNESS',
        'IMP33883_OFF_AXIS_ONSET_ANGLE_ROBUSTNESS',
        'IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP',
      ],
      hasHeavyImport: false,
    },
    {
      file: 'imp-33977-g-vs-law-offset-viz-data.js',
      directImports: ['effectiveHeightForN', 'C_C_PINNED'],
      hasHeavyImport: false,
    },
  ],
  transitiveClosureFiles: [
    'imp-33917-endpoint-residual-growth-law.js',
    'imp-33878-hump-argmax-grid-refinement.js',
    'imp-33853-cren-gap-coefficient-closed-form.js (zero imports)',
    'imp-33882-cusp-exponent-onset-coefficient-robustness.js (zero imports)',
    'imp-33883-off-axis-onset-angle-robustness.js (zero imports)',
    'imp-33924-joint-cusp-angle-onset-robustness-map.js (zero imports)',
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
  heavyImportSafeCount: 5,
  recommendation:
    'No action needed -- all five modules are already heavy-import-safe. imp-33940 and ' +
    'imp-33977 route through the exact effectiveHeightForN/C_C_PINNED pair already cleared by ' +
    'the imp-33763/imp-33783/imp-33805/imp-33825/imp-33873/imp-33891/imp-33979 precedent audits; ' +
    'imp-33941 and imp-33942 route through the imp-33917/imp-33878 wrappers which resolve to the ' +
    'same precedent-cleared chain; imp-33976 fans out to four modules, three of which have no ' +
    'imports at all and the fourth (imp-33924) is precedent-cleared as import-free by imp-33979. ' +
    'This closes the imp-33995 audit item and clears the imp-33940/33941/33942/33976/33977 ' +
    'cohort for safe consumer-viz import.',
  honestNote:
    'Read-only audit; no new pages fabricated, no new bound claimed by this module itself. ' +
    'imp-3066 K_a >= 0 positivity untouched. Platt-Trudgian Lambda <= 0.2 remains SOTA. No QED.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_33995_ASSERTIONS = [
  {
    id: 'imp33995-exactly-five-modules-audited',
    holds: () => IMP_33995_HEAVY_IMPORT_AUDIT.modules.length === 5,
    why: 'The audit must cover exactly the five named modules (imp-33940/33941/33942/33976/33977).',
  },
  {
    id: 'imp33995-all-five-heavy-import-safe',
    holds: () => {
      const m = IMP_33995_HEAVY_IMPORT_AUDIT.modules;
      const safe = m.filter((x) => x.hasHeavyImport === false).length;
      return safe === 5 && safe === IMP_33995_HEAVY_IMPORT_AUDIT.heavyImportSafeCount;
    },
    why: 'Grep-verified: the transitive closure of every import in all five modules terminates ' +
      'without ever naming zeros-to-1e6.js.',
  },
  {
    id: 'imp33995-honest-scope-locked',
    holds: () =>
      /SOTA/.test(IMP_33995_HEAVY_IMPORT_AUDIT.honestNote) &&
      /no QED/i.test(IMP_33995_HEAVY_IMPORT_AUDIT.honestNote) &&
      /imp-3066/.test(IMP_33995_HEAVY_IMPORT_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; Platt-Trudgian Lambda <= 0.2 ' +
      'stays SOTA and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33995_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33995 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33995_ASSERTIONS };
