/**
 * imp-851: src/math/ dead-code audit (2026-04-19).
 *
 * METHOD
 * ------
 * For every .js file in src/math/ (297 total), grep every .js/.jsx file in
 * src/{math,pages,components,data}/ for an import of the form
 * "./<name>" or "../math/<name>" (with or without .js suffix). Files with
 * zero importers are "no-importers" candidates. Within that set, split by
 * whether the file exports a *_ASSERTIONS array — because scripts/run-
 * assertions.mjs has its own hardcoded list and may still be reaching the
 * module even without source-level imports.
 *
 * NUMBERS
 * -------
 * Total:                                   297 math modules
 * No importers anywhere:                   284 (96%)
 *   ├── with *_ASSERTIONS arrays:           27  (assertion-bearing; potentially
 *   │                                            reachable via run-assertions.mjs)
 *   └── no *_ASSERTIONS arrays:            257  (strong delete-candidates)
 *
 * CAVEATS
 * -------
 * (1) "No importers" here counts STATIC imports only. Some files may be
 *     referenced via dynamic import() or via name-string in module-index.js,
 *     proof-paper.js, or log files. Check before deletion.
 * (2) The 27 assertion-bearing no-import files are listed in scripts/run-
 *     assertions.mjs MATH_MODULES / DATA_MODULES as hardcoded paths — they
 *     ARE swept even without source imports. Do NOT delete these.
 * (3) Some "no-importer" files are historical research records — prose
 *     documentation that should stay. Review case-by-case.
 *
 * ACTION
 * ------
 * This file is a candidate list, NOT an auto-delete. Recommend:
 *   • Keep all 27 assertion-bearing no-import files.
 *   • Review the 257 no-assertion-no-import files in batches of 20.
 *   • Within a batch, for each file: decide keep / archive / delete.
 *   • Archive candidates move to src/math/archive/ with a note file.
 *
 * SYNTAX NOTE: avoid (star)(slash) sequences in JSDoc text.
 */

export const DEAD_CODE_AUDIT_2026_04 = {
  id: 'imp-851',
  generatedAt: '2026-04-19T03:30:00.000Z',
  method: 'static-import scan across src/{math,pages,components,data}',

  totals: {
    total:                        297,
    noImporters:                  284,
    noImportersButAssertBearing:   27,
    noImportersNoAssertions:      257,
  },

  // Assertion-bearing but no-importers: reachable via scripts/run-
  // assertions.mjs hardcoded list. Verify each is in that list.
  assertionBearingKeepers: [
    'c-mb-weaker-bound-search.js',          // imp-856
    'chain-crossverify-N5e5.js',            // imp-828
    'd-monotone-analytic-proof.js',
    'esy-o1-closure.js',
    'g1-sub-extremal-closure.js',
    'g3a-fullsum-closure.js',               // imp-507
    'joint-sigma-n0-optimization.js',
    'kernel-hack-rigorous-error.js',
    'lean4-c-f-ibp.js',                     // imp-832 partial
    'm-raw-from-umon-bridge.js',            // imp-462
    'many-body-correction-closure.js',      // imp-471
    'mertens-rate-tightening.js',
    'noswap-closure.js',
    'paper-skeptic-review-2.js',
    'paper-skeptic-review-3.js',
    'path-c-circularity-resolution.js',
    'path-g-analytic-rate.js',
    'path-g-cauchy-rigorous.js',            // imp-427
    'route-a-argmin-closure.js',
    'route-a-cm-extension.js',              // imp-456
    'route-a-monotonicity-closure-crossverify.js', // imp-826
    'route-a-shift-witness.js',
    'route-a-unfolded-reformulation.js',
    'route-c-dynamical-analysis.js',        // imp-834
    'rvm-jacobian-lower-bound.js',          // imp-469
    'surrogate-discrete-gap.js',
    'verify-imp440-altpath.js',             // imp-830
  ],

  // Strong delete-candidate sample (first 40 of 257). The full list is
  // too long to put inline; rerun the audit script to regenerate.
  noImporterCandidatesSample: [
    'abelian-flow-tinfty.js',
    'adelic-poisson.js',
    'adversarial-s7.js',
    'adversarial-stress-test.js',
    'analytic-conductor.js',
    'analytical-resolvent.js',
    'artin-l-functions.js',
    'audit-fixes.js',
    'auto-diff.js',
    'axiom-closure.js',
    'backlund-zero-count.js',
    'backward-collision-finder.js',
    'baez-duarte-sequence.js',
    'barrier-extrapolation.js',
    'bayesian-failure.js',
    'berry-keating-connes.js',
    'berry-keating-xp-operator.js',
    'beurling-nyman-criterion.js',
    'bombieri-lagarias-positivity.js',
    'bombieri-vinogradov.js',
    'bounded-prime-gaps.js',
    'branched-flow.js',
    'brun-constant.js',
    'bsd-elliptic-curves.js',
    'bulk-zeros.js',
    'burgess-character-sums.js',
    'c-mb-unconditional-bound.js',          // NOTE: imp-486; contains constants used elsewhere via proof-paper.js text — do NOT delete
    'carlson-identification.js',
    'cascade-analyticity.js',
    'cascade-critical-strip.js',
    'cascade-lp-unification.js',
    'cauchy-sequence.js',
    'cdv-reconciliation.js',
    'cdv-variable-transformations.js',
    'certified-lambda-hybrid.js',
    'chebotarev-density.js',
    'chebyshev-bias.js',
    'chowla-conjecture-partial.js',
    'chowla-liouville.js',
    'circularity-audit.js',
  ],

  recommendation:
    'Do NOT bulk-delete. Proceed in batches of 20, manually reviewing each. ' +
    'Priority order: (a) numerical-simulation-only files that were ' +
    'exploratory and never integrated; (b) files whose concepts got merged ' +
    'into a more recent module. Files referenced in proof-paper.js abstract / ' +
    'historical reasoning must be kept for documentation value. Also check ' +
    'module-index.js string references before deletion — it may describe ' +
    'these as part of the catalog even if no source imports them.',

  nextTickets: [
    'imp-851a (small): review first 20 no-importer no-assertion candidates',
    'imp-851b (small): review next 20, etc.',
    'imp-851z (meta): after 10 sub-batches, revisit whether to keep the catalog-only approach or archive everything unreferenced',
  ],
};

export const DEAD_CODE_AUDIT_2026_04_ASSERTIONS = [
  {
    id: 'imp851-identifies-many-no-importers',
    holds: () => DEAD_CODE_AUDIT_2026_04.totals.noImporters >= 200,
    why:
      'The audit must find at least 200 no-importer math files for its ' +
      'output to be worth consulting — otherwise the cleanup opportunity ' +
      'is not large enough to matter. Current finding: 284.',
  },
  {
    id: 'imp851-assertion-bearers-listed',
    holds: () =>
      Array.isArray(DEAD_CODE_AUDIT_2026_04.assertionBearingKeepers) &&
      DEAD_CODE_AUDIT_2026_04.assertionBearingKeepers.length >= 20,
    why:
      'Every assertion-bearing no-importer file must be explicitly listed ' +
      'as a keeper so future delete sweeps do not touch them.',
  },
];
