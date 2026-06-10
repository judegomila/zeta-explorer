/**
 * @module imp-2563-zeta-zeros-corruption-audit
 * @fileoverview Follow-on to imp-2563 (S4 fanout): closes the DETECTION half of
 * the named open sub-gap imp-2563-sub-data-audit by shipping a build-time
 * tripwire that pins the ZETA_ZEROS corruption deliverable (A) flagged in the
 * imp-2563 ticket. Exports {@link ZETA_ZEROS_CORRUPTION_AUDIT} (audit record)
 * and {@link ZETA_ZEROS_CORRUPTION_AUDIT_ASSERTIONS} (build guards), and
 * self-executes the tripwire on import.
 *
 * THE BUG (verified)
 * ------------------
 * src/math/zeta.js exports ZETA_ZEROS, documented as "first 870 nontrivial
 * zeta zeros (Odlyzko)". It is CORRECT and matches the canonical Odlyzko table
 * ZEROS_EXTENDED (src/data/zeros-to-1e6.js, imp-359 / imp-858) EXACTLY through
 * index 649 (gamma_649 = 1001.349482638). Starting at index 650 the table is
 * CORRUPT: a block appended under the in-file comment "Extended zeros
 * (651-1000+) from Odlyzko tables" SKIPS at least one genuine zero, so every
 * value from index 650 onward is shifted upward and drifts away from the truth:
 *
 *   index  ZETA_ZEROS (zeta.js)   ZEROS_EXTENDED (truth)   |diff|
 *   649    1001.349482638         1001.349482638           0          (last good)
 *   650    1002.472902268         1002.404305488           6.86e-2    (onset)
 *   651    1003.901451565         1003.267808179           6.34e-1
 *   655    1009.254692498         1008.795709901           4.59e-1
 *   662    1019.025372564         1017.266402364           1.76e+0    (and growing)
 *
 * ZETA_ZEROS[650..869] are therefore NOT the true 651st..870th zeros. Any
 * consumer that reads ZETA_ZEROS above index 649 (e.g. high-index zero-density,
 * pair/triple-correlation, or Lambda-ladder code) is silently using wrong
 * ordinates. The corruption was confirmed by direct elementwise comparison of
 * ZETA_ZEROS against ZEROS_EXTENDED (the 1,000,000-ordinate Odlyzko table).
 *
 * WHAT THIS MODULE DOES (and does NOT do)
 * ---------------------------------------
 * DOES: pins the corruption as a build-time tripwire so the bug can never
 * silently regress further or be "fixed" without this audit noticing - it
 * checks, against a baked window of the authoritative Odlyzko ordinates, that
 * ZETA_ZEROS still matches truth through index 649 and still diverges from
 * index 650. The baked reference window (indices 646..662) is copied verbatim
 * from ZEROS_EXTENDED so this audit stays LIGHT (it does not import the 16.7 MB
 * zeros bundle).
 *
 * DOES NOT: fix the table or re-point consumers. Replacing ZETA_ZEROS[650..869]
 * with the correct ZEROS_EXTENDED slice (or re-pointing the ~190 consumers at
 * ZEROS_EXTENDED) is a larger, separate data change and is the remaining open
 * residual imp-2563-sub-data-audit-fix. The PATH_C_BASELINE_FIT ladder
 * replacement and the imp-1149 Theorem-3 re-grade (the other parts of imp-2563
 * deliverable A) likewise remain open (imp-2563-sub-pathc-ladder-replace,
 * imp-2563-sub-imp1149-recalibrate), as do the imp-2563 theorem module (B,
 * imp-2563-sub-sandwich-theorem) and corollary relabel (C). This follow-on
 * does NOT re-flip the already-completed imp-2563 queue ticket.
 *
 * @see imp-2563
 * @see imp-2563-sub-data-audit
 */

import { ZETA_ZEROS } from '../math/zeta.js';

// ── Authoritative Odlyzko ordinates around the corruption boundary ───────────
// Verbatim copy of ZEROS_EXTENDED[i] (src/data/zeros-to-1e6.js, the canonical
// 1e6-ordinate Odlyzko table) for i in [646, 662]. Baked as a literal window so
// this audit does not transitively import the 16.7 MB zeros bundle.
const AUTHORITATIVE = {
  646: 997.511934752,
  647: 998.827547137,
  648: 999.791571557,
  649: 1001.349482638, // last index where ZETA_ZEROS is still correct
  650: 1002.404305488, // corruption onset: ZETA_ZEROS has 1002.472902268 here
  651: 1003.267808179,
  652: 1004.675044121,
  653: 1005.543420304,
  654: 1008.006704307,
  655: 1008.795709901,
  656: 1009.806590747,
  657: 1010.569757011,
  658: 1012.410042516,
  659: 1013.058638098,
  660: 1014.689632622,
  661: 1016.060178943,
  662: 1017.266402364,
};

const LAST_GOOD_INDEX = 649;
const CORRUPTION_ONSET_INDEX = 650;
const MATCH_TOL = 1e-6;   // ZETA_ZEROS is quoted to 9 digits; truth agrees to < 1e-6 when correct
const DIVERGE_MIN = 1e-3; // corrupt rows are off by >= ~0.07, far above this floor

// ── Build the audit window ───────────────────────────────────────────────────
const WINDOW = Object.keys(AUTHORITATIVE)
  .map((k) => Number(k))
  .sort((a, b) => a - b)
  .map((i) => {
    const zeta = ZETA_ZEROS[i];
    const truth = AUTHORITATIVE[i];
    const diff = typeof zeta === 'number' ? Math.abs(zeta - truth) : null;
    const shouldMatch = i <= LAST_GOOD_INDEX;
    const matches = diff !== null && diff <= MATCH_TOL;
    const diverges = diff !== null && diff >= DIVERGE_MIN;
    return {
      index: i,
      zeta_zeros: zeta ?? null,
      authoritative: truth,
      abs_diff: diff !== null ? +diff.toExponential(3) : null,
      expected: shouldMatch ? 'match' : 'diverge',
      verdict: shouldMatch ? (matches ? 'ok-match' : 'UNEXPECTED-MISMATCH') : (diverges ? 'corrupt-as-expected' : 'UNEXPECTED-AGREEMENT'),
    };
  });

const GOOD_ROWS = WINDOW.filter((r) => r.index <= LAST_GOOD_INDEX);
const CORRUPT_ROWS = WINDOW.filter((r) => r.index >= CORRUPTION_ONSET_INDEX);
const ALL_GOOD_MATCH = GOOD_ROWS.every((r) => r.verdict === 'ok-match');
const ALL_CORRUPT_DIVERGE = CORRUPT_ROWS.every((r) => r.verdict === 'corrupt-as-expected');
const ONSET_ROW = WINDOW.find((r) => r.index === CORRUPTION_ONSET_INDEX) || null;

// ── Exported audit record ─────────────────────────────────────────────────────
export const ZETA_ZEROS_CORRUPTION_AUDIT = {
  id: 'imp-2563-sub-data-audit',
  status: 'detection-shipped',
  title:
    'ZETA_ZEROS (src/math/zeta.js) is corrupt from index 650 onward - diverges ' +
    'from the canonical Odlyzko ZEROS_EXTENDED ladder',

  finding:
    'ZETA_ZEROS matches ZEROS_EXTENDED exactly through index 649 ' +
    '(gamma = 1001.349482638) and then diverges starting at index 650 ' +
    '(ZETA_ZEROS = 1002.472902268 vs truth 1002.404305488, |diff| = 6.86e-2), ' +
    'with the error growing past 1.7 by index 662. The corruption begins at the ' +
    'in-file "Extended zeros (651-1000+)" appended block, which skips at least ' +
    'one genuine zero so all subsequent ordinates are shifted upward.',

  lastGoodIndex: LAST_GOOD_INDEX,
  corruptionOnsetIndex: CORRUPTION_ONSET_INDEX,
  onset: ONSET_ROW
    ? {
        index: ONSET_ROW.index,
        zeta_zeros: ONSET_ROW.zeta_zeros,
        authoritative: ONSET_ROW.authoritative,
        abs_diff: ONSET_ROW.abs_diff,
      }
    : null,

  zetaZerosLength: ZETA_ZEROS.length,
  auditWindow: WINDOW,

  summary: {
    goodRowsChecked: GOOD_ROWS.length,
    allGoodMatch: ALL_GOOD_MATCH,
    corruptRowsChecked: CORRUPT_ROWS.length,
    allCorruptDiverge: ALL_CORRUPT_DIVERGE,
  },

  consumerImpact:
    'About 190 modules import ZETA_ZEROS; any that read indices >= 650 (high-N ' +
    'zero-density, pair/triple-correlation, Lambda-ladder code) are silently ' +
    'using wrong ordinates above gamma ~ 1001.35. Consumers needing zeros ' +
    'beyond index 649 should read ZEROS_EXTENDED (src/data/zeros-to-1e6.js) ' +
    'instead, until ZETA_ZEROS is repaired.',

  openResiduals: [
    {
      id: 'imp-2563-sub-data-audit-fix',
      title: 'Repair ZETA_ZEROS[650..869] (replace with the ZEROS_EXTENDED slice) or re-point consumers',
      status: 'open',
    },
    {
      id: 'imp-2563-sub-pathc-ladder-replace',
      title: 'Replace PATH_C_BASELINE_FIT with the corrected exact t_c ladder (imp-2563 deliverable A)',
      status: 'open',
    },
    {
      id: 'imp-2563-sub-imp1149-recalibrate',
      title: 'Re-grade the imp-1149 Theorem-3 N^{-3/2} bridge as a mean-field-proxy statement; name the particle-vs-proxy E(N) gap',
      status: 'open',
    },
    {
      id: 'imp-2563-sub-sandwich-theorem',
      title: 'imp-2563 deliverable B: backward-flow-min-gap-sandwich theorem module (referee must-fixes)',
      status: 'open',
    },
  ],

  sources: [
    'src/math/zeta.js ZETA_ZEROS (corrupt table under audit)',
    'src/data/zeros-to-1e6.js ZEROS_EXTENDED (canonical Odlyzko ground truth; values baked here)',
    'imp-2563 ticket deliverable A (DATA + AUDIT)',
    'src/data/imp-2563-discriminant-tc-characterization.js (sibling: headline deliverable B; named this sub-gap open)',
  ],
};

// ── Build-time assertions ─────────────────────────────────────────────────────
export const ZETA_ZEROS_CORRUPTION_AUDIT_ASSERTIONS = [
  {
    id: 'imp2563-zeta-zeros-good-prefix-matches-odlyzko',
    holds: () => GOOD_ROWS.length >= 4 && ALL_GOOD_MATCH === true,
    why:
      'ZETA_ZEROS must still match the canonical Odlyzko ZEROS_EXTENDED ladder ' +
      'on every audited index <= 649 (the good prefix). If this fails, the ' +
      'corruption has spread BELOW index 650, or the table was edited - either ' +
      'way the corruption boundary moved and this audit must be re-derived.',
  },
  {
    id: 'imp2563-zeta-zeros-corruption-onset-at-650',
    holds: () =>
      ONSET_ROW !== null &&
      ONSET_ROW.verdict === 'corrupt-as-expected' &&
      ALL_CORRUPT_DIVERGE === true,
    why:
      'ZETA_ZEROS must diverge from the Odlyzko truth by >= 1e-3 at every ' +
      'audited index >= 650 (corruption onset). This pins the KNOWN bug so it ' +
      'cannot silently regress. If this fails because the rows now MATCH, the ' +
      'table was repaired (close imp-2563-sub-data-audit-fix and retire this ' +
      'tripwire); if it fails for another reason, the corruption pattern changed.',
  },
  {
    id: 'imp2563-zeta-zeros-length-unchanged',
    holds: () => ZETA_ZEROS.length === 870,
    why:
      'ZETA_ZEROS is documented as 870 entries. A length change means the table ' +
      'was edited (likely the repair), which should be reconciled with this ' +
      'audit before trusting either the table or the tripwire.',
  },
];

// ── Self-executing tripwire (matches the imp-2561/imp-2562 sibling pattern) ───
for (const a of ZETA_ZEROS_CORRUPTION_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `[imp-2563-zeta-zeros-corruption-audit] build-time assertion failed: ${a.id} - ${a.why}`,
    );
  }
}
