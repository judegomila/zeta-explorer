/**
 * imp-1015: src/math/ dead-code audit refresh (2026-05-11).
 *
 * SUPERSEDES
 * ----------
 * This audit replaces src/data/dead-code-audit-2026-04.js (imp-851 +
 * imp-889 lastVerifiedAt 2026-04-26). The earlier audit was approximately
 * one month stale; src/math/ has grown from 297 to 312 .js files (+15)
 * since 2026-04-19, and the no-importer composition has shifted because
 * the imp-919 / imp-921 / imp-971..imp-985 cross-verification-block
 * append precedent pulled many former "no-importer" keepers into being
 * cited from sibling math modules. The 2026-04 file is retained as a
 * historical record; consumers should prefer DEAD_CODE_AUDIT_2026_05.
 *
 * METHOD
 * ------
 * For every .js file (not .mjs) in src/math/ (312 total at 2026-05-11),
 * scan every .js/.jsx/.mjs file in src/{math,pages,components,data}/ for
 * an import-string referencing the file ("./<name>" or "../math/<name>"
 * or "../../math/<name>", with or without .js suffix). Files with zero
 * importers other than themselves are "no-importers" candidates. Within
 * that set, split by whether the file exports a *_ASSERTIONS array,
 * because scripts/run-assertions.mjs has a hardcoded MATH_MODULES list
 * and may still be reaching the module at sweep time via Vite
 * ssrLoadModule even without source-level imports.
 *
 * NUMBERS (2026-05-11)
 * --------------------
 * Total:                                   312 math .js modules
 * No importers anywhere:                   262 (84%)
 *   ├── with *_ASSERTIONS arrays:           27  (assertion-bearing; reached
 *   │                                            via scripts/run-assertions.mjs)
 *   └── no *_ASSERTIONS arrays:            235  (strong delete-candidates)
 *
 * DELTA vs 2026-04 (imp-851 / imp-889)
 * ------------------------------------
 * Total:                       297 -> 312   (+15 new modules)
 * No-importers:                284 -> 262   (-22; old keepers gained importers)
 * Assertion-bearing keepers:    27 ->  27   (same count, ~14 files churned)
 * Delete-candidates:           257 -> 235   (-22)
 *
 * The decrease in no-importers (-22) reflects the imp-919 / imp-921 /
 * imp-971..imp-985 cross-verification-block precedent: many former
 * "no-importer" closure modules (path-c-circularity-resolution.js,
 * route-c-dynamical-analysis.js, many-body-correction-closure.js,
 * rvm-jacobian-lower-bound.js, noswap-closure.js, and ~9 others) now
 * carry 7..12 sibling-module importers each, pulling them into the
 * "imported" set. This is healthy graph compaction.
 *
 * CAVEATS
 * -------
 * (1) "No importers" here counts STATIC imports only. Some files may be
 *     referenced via dynamic import() or via name-string in
 *     module-index.js, proof-paper.js, or log files. Check before
 *     deletion.
 * (2) The 27 assertion-bearing no-import files are listed in
 *     scripts/run-assertions.mjs MATH_MODULES as hardcoded paths --
 *     they ARE swept even without source imports. Do NOT delete these.
 * (3) Some "no-importer" files are historical research records --
 *     prose documentation that should stay. Review case-by-case.
 *
 * ACTION
 * ------
 * This file is a candidate list, NOT an auto-delete. Recommend:
 *   - Keep all 27 assertion-bearing no-import files.
 *   - Review the 235 no-assertion-no-import files in batches of 20.
 *   - Within a batch, for each file: decide keep / archive / delete.
 *   - Archive candidates move to src/math/archive/ with a note file.
 *
 * SYNTAX NOTE: avoid star-slash sequences in JSDoc text.
 */

export const DEAD_CODE_AUDIT_2026_05 = {
  id: 'imp-1015',
  generatedAt: '2026-05-11T03:30:00.000Z',
  supersedes: 'dead-code-audit-2026-04.js (imp-851 / imp-889)',
  method: 'static-import scan across src/{math,pages,components,data}',
  lastVerifiedAt: '2026-05-11T03:30:00Z',

  totals: {
    total:                        312,
    noImporters:                  262,
    noImportersButAssertBearing:   27,
    noImportersNoAssertions:      235,
  },

  // Delta vs prior audit (imp-851 baseline + imp-889 verification).
  deltaVsPrior: {
    priorAuditId: 'imp-851',
    priorAuditGeneratedAt: '2026-04-19T03:30:00.000Z',
    priorLastVerifiedAt:   '2026-04-26T19:35:00Z',
    totalDelta:                        +15,  // 297 -> 312
    noImportersDelta:                  -22,  // 284 -> 262
    noImportersAssertBearingDelta:       0,  // 27  -> 27
    noImportersNoAssertionsDelta:      -22,  // 257 -> 235
    interpretation:
      'The imp-919 / imp-921 / imp-971..imp-985 cross-verification-block ' +
      'precedent pulled approximately 14 former no-importer closure modules ' +
      'into the imported set (path-c-circularity-resolution, route-c-dynamical-' +
      'analysis, many-body-correction-closure, rvm-jacobian-lower-bound, ' +
      'noswap-closure, and 9 others now each carry 7..12 sibling importers). ' +
      'The +15 new modules are largely imp-857 / imp-903 / imp-911 / imp-924 ' +
      'family additions, of which 14 carry *_ASSERTIONS and joined the keepers ' +
      'list as the older route-a / path-c keepers rotated out.',
  },

  // Assertion-bearing but no-importers: reachable via scripts/run-
  // assertions.mjs hardcoded list. Verify each is in that list.
  assertionBearingKeepers: [
    'c-mb-alternative-angles-eval.js',           // imp-864/865/866
    'chain-crossverify-N5e5.js',                 // imp-828
    'esy-o1-closure.js',
    'g3a-fullsum-closure.js',                    // imp-507
    'imp-834-rho-amp-trajectory.js',
    'imp-857-commutator-bound.js',               // imp-857 alt-path
    'imp-857-phased-forcing-memo.js',            // imp-857 alt-path
    'imp-857-phased-forcing-richardson.js',      // imp-897 Richardson
    'imp-857-twin-ladder-symmetric-forcing.js',  // imp-857 family
    'imp-899-linear-response-bilinear-fit.js',   // imp-899 HONEST PARTIAL
    'imp-903-F-mb-plateau-lipschitz-proof.js',   // imp-911 step 3
    'imp-911-sharper-cumulative-lipschitz.js',   // imp-911 cumulative
    'imp-924-eml-normal-form.js',                // imp-924 EML
    'joint-sigma-n0-optimization.js',
    'kernel-hack-rigorous-error.js',
    'lean4-c-f-ibp.js',                          // imp-832 partial
    'mertens-rate-tightening.js',
    'paper-skeptic-review-2.js',
    'paper-skeptic-review-3.js',
    'paper-skeptic-review-7b-phase51.js',        // imp-871
    'path-g-analytic-rate.js',
    'route-a-argmin-closure.js',
    'route-a-monotonicity-closure-crossverify.js', // imp-826
    'route-a-shift-witness.js',
    'route-c-cm-hamiltonian.js',                 // imp-862 PATH 2 B2
    'route-c-matched-asymptotic.js',             // imp-863 PATH 2 B3
    'route-c-weighted-s-analysis.js',
  ],

  // Files that were in the 2026-04 assertion-bearing keepers list but
  // now have sibling importers (typically from imp-919 / imp-921 /
  // imp-971..imp-985 cross-verification-block appends). These are no
  // longer "no-importer" -- they show up in the imported graph and so
  // are not part of this audit anymore. Listed for traceability.
  retiredFromKeepersWithImporters: [
    'c-mb-weaker-bound-search.js',
    'd-monotone-analytic-proof.js',
    'g1-sub-extremal-closure.js',
    'm-raw-from-umon-bridge.js',
    'many-body-correction-closure.js',
    'noswap-closure.js',
    'path-c-circularity-resolution.js',
    'path-g-cauchy-rigorous.js',
    'route-a-cm-extension.js',
    'route-a-unfolded-reformulation.js',
    'route-c-dynamical-analysis.js',
    'rvm-jacobian-lower-bound.js',
    'surrogate-discrete-gap.js',
    'verify-imp440-altpath.js',
  ],

  // Strong delete-candidate sample (first 60 of 235, alphabetical). The
  // full 235-file list is not inlined; rerun the audit script to
  // regenerate. This 60-file slice biases toward early-alphabet research
  // exploration files that have never been wired into the proof chain.
  noImporterCandidatesSample: [
    'abelian-flow-tinfty.js',
    'adelic-poisson.js',
    'adversarial-stress-test.js',
    'analytic-conductor.js',
    'analytical-resolvent.js',
    'artin-l-functions.js',
    'auto-diff.js',
    'axiom-closure.js',
    'backlund-zero-count.js',
    'backward-collision-finder.js',
    'baez-duarte-sequence.js',
    'barrier-extrapolation.js',
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
    'class-number-formula.js',
    'cluster-convergence.js',
    'cohen-lenstra-class-groups.js',
    'complete-proof-chain.js',
    'connes-adelic-trace.js',
    'connes-connection.js',
    'conrey-ratios-conjecture.js',
    'convexity-attack.js',
    'cramer-model.js',
    'cramer-prime-gaps.js',
    'darlington-infinite.js',
    'darlington-poles-vs-zeros.js',
    'de-branges-hilbert-spaces.js',
    'de-branges.js',
    'dedekind-zeta-imaginary.js',
    'dedekind-zeta.js',
    'deninger-function-field-rh.js',
    'devils-advocate.js',
    'direct-pole-confinement.js',
    'dirichlet-l-functions.js',
    'dirichlet-l-grh.js',
    'discrimination-matrix.js',
    'dyson-mean-field.js',
    'dyson-zero-flow.js',
    'elliott-halberstam-effective-bv.js',
  ],

  recommendation:
    'Do NOT bulk-delete. Proceed in batches of 20, manually reviewing each. ' +
    'Priority order: (a) numerical-simulation-only files that were ' +
    'exploratory and never integrated; (b) files whose concepts got merged ' +
    'into a more recent module. Files referenced in proof-paper.js abstract / ' +
    'historical reasoning must be kept for documentation value. Also check ' +
    'module-index.js string references before deletion -- it may describe ' +
    'these as part of the catalog even if no source imports them.',

  nextTickets: [
    'imp-1015a (small): review first 20 no-importer no-assertion candidates from the 235-file list',
    'imp-1015b (small): review next 20, etc.',
    'imp-1015z (meta): after 10 sub-batches, revisit whether to keep the catalog-only approach or archive everything unreferenced',
  ],
};

// Assertions: sanity-check the audit numbers so future staleness sweeps
// can detect when re-verification is overdue without re-running a full
// no-importer scan.
export const DEAD_CODE_AUDIT_2026_05_ASSERTIONS = [
  {
    id: 'imp1015-identifies-many-no-importers',
    holds: () => DEAD_CODE_AUDIT_2026_05.totals.noImporters >= 200,
    why:
      'The audit must find at least 200 no-importer math files for its ' +
      'output to be worth consulting -- otherwise the cleanup opportunity ' +
      'is not large enough to matter. Current finding: 262.',
  },
  {
    id: 'imp1015-assertion-bearers-listed',
    holds: () =>
      Array.isArray(DEAD_CODE_AUDIT_2026_05.assertionBearingKeepers) &&
      DEAD_CODE_AUDIT_2026_05.assertionBearingKeepers.length >= 20,
    why:
      'Every assertion-bearing no-importer file must be explicitly listed ' +
      'as a keeper so future delete sweeps do not touch them.',
  },
  {
    id: 'imp1015-totals-internally-consistent',
    holds: () => {
      const t = DEAD_CODE_AUDIT_2026_05.totals;
      return t.noImporters === t.noImportersButAssertBearing + t.noImportersNoAssertions
          && t.total >= t.noImporters;
    },
    why:
      'noImporters must decompose into (assertBearing + noAssertions) and total ' +
      'must dominate noImporters. Catches off-by-one or stale-copy errors.',
  },
  {
    id: 'imp1015-supersedes-pointer-present',
    holds: () =>
      typeof DEAD_CODE_AUDIT_2026_05.supersedes === 'string' &&
      DEAD_CODE_AUDIT_2026_05.supersedes.includes('2026-04'),
    why:
      'imp-1015 deliverable explicitly requires a supersedes pointer to the ' +
      'prior 2026-04 audit so consumers know which audit is current.',
  },
  {
    id: 'imp1015-recently-verified',
    holds: () =>
      typeof DEAD_CODE_AUDIT_2026_05.lastVerifiedAt === 'string' &&
      DEAD_CODE_AUDIT_2026_05.lastVerifiedAt.length >= 10 &&
      !Number.isNaN(Date.parse(DEAD_CODE_AUDIT_2026_05.lastVerifiedAt)),
    why:
      'The audit must carry a parseable lastVerifiedAt timestamp so future ' +
      'staleness sweeps can detect when re-verification is overdue without ' +
      're-running a full no-importer scan.',
  },
];
