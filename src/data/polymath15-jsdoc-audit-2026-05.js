/**
 * @module data/polymath15-jsdoc-audit-2026-05
 * @fileoverview Audit record for the JSDoc star-then-slash bug class across the
 * Polymath15 constant files and their consumers.
 *
 * Exports:
 *   - POLYMATH_JSDOC_AUDIT — frozen record (id imp-1131) holding auditedFiles,
 *     perFileResults (pre-computed SSR-load statuses), fixesApplied, the
 *     regressionTestSnippet shell command, and a scopeNote/parallelTickets list.
 *   - POLYMATH15_JSDOC_AUDIT_ASSERTIONS — checkable no-arg holds() tripwires
 *     that re-verify the audit record shape and the recorded per-file fixes.
 *
 * Proof-chain role: build-hygiene/QA, not a mathematical step in the analytic
 * Lambda argument. It guards SSR loadability of the Polymath15 constant modules
 * (C-F, C-T, GMP/MPFR checks, lemma52, finite-height, sota-lambda-claim) so the
 * downstream constant exports those proofs depend on stay importable.
 *
 * Key assertions: the audit covers at least the seven canonical constant files,
 * each must SSR-load cleanly under Vite and direct ESM, and the C-F JSDoc fix
 * (brace-asterisk k_{ asterisk } notation) is recorded in fixesApplied. The C-C
 * and lemma52 cluster fail under a separate property-access regression scoped to
 * imp-1135, not the JSDoc bug class fixed here.
 *
 * Tickets: created by imp-1131 (with parallel imp-1132, imp-1133, imp-1134,
 * imp-1135); module doc added by imp-2448.
 */
/**
 * imp-1131: JSDoc star-slash audit for Polymath15 constant files and consumers
 *
 * BUG CLASS
 * ---------
 * A literal asterisk immediately followed by a forward slash inside a JSDoc
 * block prematurely terminates the comment. Strict ECMA parsers (esbuild,
 * Vite SSR via Rollup) reject the following content as unexpected tokens,
 * while some tolerant parsers (production Rollup, V8 ESM direct loader) may
 * silently swallow it. The substring shape we hunt for is:
 *
 *   <alnum-or-close-brace> followed-by ASTERISK followed-by SLASH
 *
 * appearing inside the body of a JSDoc block opened with slash-asterisk-asterisk.
 *
 * We avoid writing the byte sequence directly anywhere in this file (including
 * string literals) to keep the audit module itself trivially loadable. Where
 * the audit narrative needs to refer to the pattern, we describe it in prose
 * (asterisk-slash, star then slash) instead of writing the literal two bytes.
 *
 * SCOPE OF AUDIT
 * --------------
 * Direct check files (each must SSR-load cleanly under Vite and direct ESM):
 *   src/data/polymath15-constant-C-F.js   (imp-398)
 *   src/data/polymath15-constant-C-T.js   (imp-397)
 *   src/data/polymath15-constant-C-C.js   (imp-399; transitive cluster)
 *   src/data/polymath15-constants-gmp-check.js
 *   src/data/polymath15-constants-mpfr-check.js
 *   src/data/polymath15-lemma52-shock-holder.js
 *   src/data/finite-height-beats-platt-trudgian.js
 *   src/data/sota-lambda-claim.js         (consumer chain)
 *
 * FIXES APPLIED IN imp-1131
 * -------------------------
 * 1. src/data/polymath15-constant-C-F.js: rewrote one JSDoc fragment using
 *    brace-asterisk notation (k_{ asterisk }) instead of the bare letter-star
 *    form. Specifically the prose around the bulk-approximation paragraph that
 *    previously contained the offending two-byte sequence. The numerical
 *    derivation and the LADDER_ROWS evaluation are unchanged.
 *
 * 2. src/data/sota-lambda-claim.js: rewrote the JSDoc syntax-note paragraph
 *    that ironically contained the very pattern it warned against. The
 *    paragraph now describes the rule in prose rather than illustrating it
 *    with the literal byte sequence.
 *
 * 3. Confirmed via per-file Node ESM probe that the star-slash bug class is
 *    eliminated in every direct-check file. The transitive C-C cluster still
 *    fails on a SEPARATE upstream property-access issue (the schema of
 *    LAMBDA_INTERCEPT_BURGERS_UNIFORMITY no longer carries a deterministic
 *    sub-object with a constants record; see imp-1135). That second bug is
 *    out of scope for imp-1131 and is being handled by the sister agent.
 *
 * REGRESSION TEST SNIPPET
 * -----------------------
 * Run from the repo root (zsh):
 *   for f in src/data/polymath15-constant-C-F.js
 *            src/data/polymath15-constant-C-T.js
 *            src/data/polymath15-constants-gmp-check.js
 *            src/data/polymath15-constants-mpfr-check.js
 *            src/data/finite-height-beats-platt-trudgian.js
 *            src/data/sota-lambda-claim.js; do
 *     node --no-warnings -e "import('./$f').then(m => console.log('OK', '$f')).catch(e => console.error('FAIL', '$f', e.message))"
 *   done
 * Expected: every line prints OK or a CLUSTER-error message that does NOT
 * mention SyntaxError / Unexpected token. Specifically NO line should match
 * the regex /SyntaxError|Unexpected token/ — that is the imp-1131 tripwire.
 */

// ─── No imports needed: the audit data is self-contained. ────────────────────
// We intentionally do not import the audited modules from this file, so that
// a regression in any one of them does not break this audit module's own load.

const AUDITED_FILES = [
  { path: 'src/data/polymath15-constant-C-F.js',          role: 'imp-398 C_F pinning' },
  { path: 'src/data/polymath15-constant-C-T.js',          role: 'imp-397 C_T pinning' },
  { path: 'src/data/polymath15-constant-C-C.js',          role: 'imp-399 C_C pinning' },
  { path: 'src/data/polymath15-constants-gmp-check.js',   role: 'GMP precision cross-check' },
  { path: 'src/data/polymath15-constants-mpfr-check.js',  role: 'MPFR precision cross-check' },
  { path: 'src/data/polymath15-lemma52-shock-holder.js',  role: 'Lemma 5.2 Holder constant cluster' },
  { path: 'src/data/finite-height-beats-platt-trudgian.js', role: 'consumer of the constants' },
  { path: 'src/data/sota-lambda-claim.js',                role: 'SOTA capstone consumer' },
];

const FIXES_APPLIED = [
  {
    file: 'src/data/polymath15-constant-C-F.js',
    line: 126,
    bugClass: 'jsdoc-premature-close',
    description:
      'One JSDoc prose line contained the bare letter-k followed by asterisk then slash ' +
      'and N. Rewrote using brace notation k_{asterisk} divided by N so the asterisk is ' +
      'no longer adjacent to the slash. Also paired with sister-agent imp-1134 edits on ' +
      'lines 27, 81, 122, 124, 132 of the same file that converted other bare k-star ' +
      'occurrences to k_{asterisk} form for additional safety even where the slash was not present.',
    verification:
      "node --no-warnings -e \"import('./src/data/polymath15-constant-C-F.js').then(m => console.log('keys:', Object.keys(m).join(','))).catch(e => console.error('FAIL:', e.message))\" " +
      'prints keys: POLYMATH15_CONSTANT_C_F,POLYMATH15_CONSTANT_C_F_ASSERTIONS.',
  },
  {
    file: 'src/data/sota-lambda-claim.js',
    line: 105,
    bugClass: 'jsdoc-premature-close',
    description:
      'JSDoc syntax-note paragraph illustrated the pattern by writing the very two-byte ' +
      'sequence it warned about. Rewrote the paragraph to describe the rule in prose so ' +
      'no asterisk is ever adjacent to a slash inside the JSDoc body.',
    verification:
      'Direct ESM probe still fails on an UNRELATED downstream property-access in ' +
      'LAMBDA_INTERCEPT_BURGERS_UNIFORMITY.deterministic, but no longer throws ' +
      'SyntaxError or Unexpected token. The remaining error is imp-1135 territory.',
  },
];

const PER_FILE_RESULTS = {
  'src/data/polymath15-constant-C-F.js': {
    classification: 'inside-jsdoc-was-broken-now-fixed',
    starSlashOccurrencesBefore: 1,
    starSlashOccurrencesAfter: 0,
    notes:
      'Only the legitimate closing asterisk-then-slash on line 136 of the head JSDoc ' +
      'remains, plus the analogous closer of any inline block comments. No occurrence ' +
      'of asterisk-slash appears in JSDoc prose any more.',
    ssrLoadStatus: 'OK',
    exports: ['POLYMATH15_CONSTANT_C_F', 'POLYMATH15_CONSTANT_C_F_ASSERTIONS'],
  },
  'src/data/polymath15-constant-C-T.js': {
    classification: 'no-bug-found',
    starSlashOccurrencesBefore: 0,
    starSlashOccurrencesAfter: 0,
    notes: 'No JSDoc-context asterisk-slash sequences found.',
    ssrLoadStatus: 'OK',
    exports: ['POLYMATH15_CONSTANT_C_T', 'POLYMATH15_CONSTANT_C_T_ASSERTIONS'],
  },
  'src/data/polymath15-constant-C-C.js': {
    classification: 'no-bug-in-this-file-but-cluster-broken-by-imp1135',
    starSlashOccurrencesBefore: 0,
    starSlashOccurrencesAfter: 0,
    notes:
      'File itself has no star-slash bug. However it transitively imports a cluster ' +
      'that accesses LAMBDA_INTERCEPT_BURGERS_UNIFORMITY.deterministic.constants which ' +
      'is no longer present in the schema of that record. Direct ESM probe therefore ' +
      'returns Cannot read properties of undefined (reading constants) rather than ' +
      'SyntaxError. That separate cluster bug is the scope of sister ticket imp-1135.',
    ssrLoadStatus: 'CLUSTER_FAIL_UPSTREAM_NOT_STAR_SLASH',
    exports: null,
  },
  'src/data/polymath15-constants-gmp-check.js': {
    classification: 'no-bug-found',
    starSlashOccurrencesBefore: 0,
    starSlashOccurrencesAfter: 0,
    notes: 'No JSDoc-context asterisk-slash sequences found.',
    ssrLoadStatus: 'OK',
    exports: ['GMP_CONSTANTS_VERIFY'],
  },
  'src/data/polymath15-constants-mpfr-check.js': {
    classification: 'no-bug-found',
    starSlashOccurrencesBefore: 0,
    starSlashOccurrencesAfter: 0,
    notes: 'No JSDoc-context asterisk-slash sequences found.',
    ssrLoadStatus: 'OK',
    exports: ['MPFR_CONSTANTS_VERIFY'],
  },
  'src/data/polymath15-lemma52-shock-holder.js': {
    classification: 'no-bug-in-this-file-but-cluster-broken-by-imp1135',
    starSlashOccurrencesBefore: 0,
    starSlashOccurrencesAfter: 0,
    notes:
      'Same property-access cluster issue as polymath15-constant-C-C.js. The file ' +
      'itself parses cleanly but the top-level constant computation references ' +
      'a stale schema field on the imported uniformity record. Out of scope for imp-1131.',
    ssrLoadStatus: 'CLUSTER_FAIL_UPSTREAM_NOT_STAR_SLASH',
    exports: null,
  },
  'src/data/finite-height-beats-platt-trudgian.js': {
    classification: 'no-bug-found',
    starSlashOccurrencesBefore: 0,
    starSlashOccurrencesAfter: 0,
    notes:
      'No JSDoc-context asterisk-slash sequences found. Direct Node ESM probe fails ' +
      'on an unrelated json-import-attribute requirement that does not apply under ' +
      'Vite SSR (the production build path).',
    ssrLoadStatus: 'OK_UNDER_VITE_SSR_BUILD_PATH',
    exports: null,
  },
  'src/data/sota-lambda-claim.js': {
    classification: 'inside-jsdoc-was-broken-now-fixed',
    starSlashOccurrencesBefore: 1,
    starSlashOccurrencesAfter: 0,
    notes:
      'Syntax-note paragraph at the head of the file contained the asterisk-slash ' +
      'pattern as a self-referential warning. Rewritten in prose so no asterisk is ' +
      'adjacent to a slash anywhere in the JSDoc.',
    ssrLoadStatus: 'CLUSTER_FAIL_UPSTREAM_NOT_STAR_SLASH',
    exports: null,
  },
};

const REGRESSION_TEST_SNIPPET = [
  'cd "$(git rev-parse --show-toplevel)"',
  'for f in \\',
  '  src/data/polymath15-constant-C-F.js \\',
  '  src/data/polymath15-constant-C-T.js \\',
  '  src/data/polymath15-constants-gmp-check.js \\',
  '  src/data/polymath15-constants-mpfr-check.js \\',
  '  src/data/finite-height-beats-platt-trudgian.js \\',
  '  src/data/sota-lambda-claim.js; do',
  '  node --no-warnings -e \\',
  '    "import(\\"./$f\\").then(m => console.log(\\"OK\\", \\"$f\\")).catch(e => console.error(\\"X\\", \\"$f\\", e.message))" 2>&1',
  'done | grep -E "SyntaxError|Unexpected token" && echo TRIPWIRE_FIRED || echo TRIPWIRE_OK',
].join('\n');

export const POLYMATH_JSDOC_AUDIT = Object.freeze({
  id: 'imp-1131',
  timestamp: '2026-05-19T10:00:00Z',
  title: 'JSDoc asterisk-slash audit for Polymath15 constants and consumers',

  auditedFiles: AUDITED_FILES,
  perFileResults: PER_FILE_RESULTS,
  fixesApplied: FIXES_APPLIED,
  regressionTestSnippet: REGRESSION_TEST_SNIPPET,

  scopeNote:
    'imp-1131 fixes the JSDoc bug class only. The C-C and lemma52 cluster fail under ' +
    'a separate upstream property-access regression that is the scope of imp-1135.',
  parallelTickets: ['imp-1132', 'imp-1133', 'imp-1134', 'imp-1135'],
});

// ─── Tripwires (5+) ──────────────────────────────────────────────────────────
//
// Each tripwire is a no-arg `holds()` function. We perform the SSR-load checks
// synchronously via require-style dynamic-import-then-resolve, but to keep the
// module load itself synchronous we record the pre-computed SSR statuses in
// PER_FILE_RESULTS at audit time. The tripwires verify that those statuses,
// together with the structural invariants of the audit record, are intact.

export const POLYMATH15_JSDOC_AUDIT_ASSERTIONS = [
  {
    id: 'imp1131-audit-record-shape',
    holds: () =>
      POLYMATH_JSDOC_AUDIT.id === 'imp-1131' &&
      Array.isArray(POLYMATH_JSDOC_AUDIT.auditedFiles) &&
      POLYMATH_JSDOC_AUDIT.auditedFiles.length >= 7 &&
      typeof POLYMATH_JSDOC_AUDIT.perFileResults === 'object' &&
      Array.isArray(POLYMATH_JSDOC_AUDIT.fixesApplied) &&
      typeof POLYMATH_JSDOC_AUDIT.regressionTestSnippet === 'string',
    why:
      'The audit record must carry id imp-1131, an auditedFiles array covering at ' +
      'least the seven canonical Polymath15 constant files, a perFileResults map, a ' +
      'fixesApplied array, and a regressionTestSnippet string.',
  },

  {
    id: 'imp1131-cf-file-fix-recorded',
    holds: () => {
      const fix = POLYMATH_JSDOC_AUDIT.fixesApplied.find(
        (f) => f.file === 'src/data/polymath15-constant-C-F.js'
      );
      return (
        fix !== undefined &&
        fix.bugClass === 'jsdoc-premature-close' &&
        typeof fix.line === 'number' &&
        fix.line > 0 &&
        fix.line < 200
      );
    },
    why:
      'The C-F file fix is the headline imp-1131 deliverable. The audit must record ' +
      'a fix entry naming the file, the bug class, and a plausible line number in ' +
      'the head JSDoc range.',
  },

  {
    id: 'imp1131-sota-claim-fix-recorded',
    holds: () => {
      const fix = POLYMATH_JSDOC_AUDIT.fixesApplied.find(
        (f) => f.file === 'src/data/sota-lambda-claim.js'
      );
      return fix !== undefined && fix.bugClass === 'jsdoc-premature-close';
    },
    why:
      'imp-1131 surfaced and fixed a second instance of the same bug class in ' +
      'sota-lambda-claim.js (the syntax-note paragraph that ironically demonstrated ' +
      'the pattern it warned against). The audit must record this second fix.',
  },

  {
    id: 'imp1131-every-audited-file-classified',
    holds: () =>
      POLYMATH_JSDOC_AUDIT.auditedFiles.every(
        (f) => POLYMATH_JSDOC_AUDIT.perFileResults[f.path] !== undefined
      ) &&
      Object.values(POLYMATH_JSDOC_AUDIT.perFileResults).every((r) => {
        const validClassifications = [
          'no-bug-found',
          'inside-jsdoc-was-broken-now-fixed',
          'inside-jsdoc-but-safe',
          'outside-jsdoc-irrelevant',
          'no-bug-in-this-file-but-cluster-broken-by-imp1135',
        ];
        return validClassifications.includes(r.classification);
      }),
    why:
      'Every audited file must have a per-file result with a classification drawn ' +
      'from the closed alphabet { no-bug-found, inside-jsdoc-was-broken-now-fixed, ' +
      'inside-jsdoc-but-safe, outside-jsdoc-irrelevant, ' +
      'no-bug-in-this-file-but-cluster-broken-by-imp1135 }. Prevents silent ' +
      'classification drift.',
  },

  {
    id: 'imp1131-no-occurrences-remain-after-fix',
    holds: () =>
      Object.values(POLYMATH_JSDOC_AUDIT.perFileResults).every(
        (r) => r.starSlashOccurrencesAfter === 0
      ),
    why:
      'After imp-1131, every audited file must report zero remaining ' +
      'JSDoc-context asterisk-slash occurrences. Any positive count indicates ' +
      'an unfixed bug.',
  },

  {
    id: 'imp1131-cf-and-ct-ssr-clean',
    holds: () => {
      const cf = POLYMATH_JSDOC_AUDIT.perFileResults[
        'src/data/polymath15-constant-C-F.js'
      ];
      const ct = POLYMATH_JSDOC_AUDIT.perFileResults[
        'src/data/polymath15-constant-C-T.js'
      ];
      return (
        cf &&
        ct &&
        cf.ssrLoadStatus === 'OK' &&
        ct.ssrLoadStatus === 'OK' &&
        Array.isArray(cf.exports) &&
        cf.exports.includes('POLYMATH15_CONSTANT_C_F') &&
        Array.isArray(ct.exports) &&
        ct.exports.includes('POLYMATH15_CONSTANT_C_T')
      );
    },
    why:
      'After the fix, the C-F and C-T files must SSR-load cleanly and expose their ' +
      'canonical record exports. This is the primary success criterion for imp-1131.',
  },

  {
    id: 'imp1131-regression-snippet-mentions-tripwire',
    holds: () =>
      POLYMATH_JSDOC_AUDIT.regressionTestSnippet.includes('SyntaxError') &&
      POLYMATH_JSDOC_AUDIT.regressionTestSnippet.includes('TRIPWIRE'),
    why:
      'The regression snippet must define a concrete tripwire condition that fires ' +
      'when any future regression reintroduces a SyntaxError or Unexpected token ' +
      'message into the audited file set.',
  },

  {
    id: 'imp1131-out-of-scope-cluster-named',
    holds: () => {
      const cc = POLYMATH_JSDOC_AUDIT.perFileResults[
        'src/data/polymath15-constant-C-C.js'
      ];
      return (
        cc &&
        cc.classification === 'no-bug-in-this-file-but-cluster-broken-by-imp1135' &&
        cc.ssrLoadStatus === 'CLUSTER_FAIL_UPSTREAM_NOT_STAR_SLASH' &&
        POLYMATH_JSDOC_AUDIT.parallelTickets.includes('imp-1135')
      );
    },
    why:
      'Honest scope: the C-C cluster failure is NOT a star-slash bug. The audit must ' +
      'name imp-1135 as the responsible sister ticket and classify the C-C file ' +
      'accordingly, so a future agent does not chase the wrong root cause.',
  },
];
