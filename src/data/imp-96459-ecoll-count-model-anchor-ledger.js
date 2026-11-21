/**
 * @module data/imp-96459-ecoll-count-model-anchor-ledger
 * @fileoverview imp-96459 -- assemble the E_coll count-model story spread
 *   across three modules into one readable ledger.
 *
 *   imp-96402 built the two-endpoint anchor (N=1 macroscopic gap; N=1e22 at the
 *   double-precision floor), imp-96426 filled the N=1e3..1e6 intermediate rungs
 *   bridging those endpoints, and imp-96429 showed the whole verdict is exactly
 *   C_KH-invariant (the Koksma-Hlawka factor cancels as a common sqrt-prefactor
 *   in every relative gap). This module copies the already-baked rows from all
 *   three verbatim into a single tabulation, columns N, true gamma_N,
 *   count-inversion gamma_N, gammaRelGap, rateRelGap, and a C_KH-invariance
 *   note, so the full N=1..1e22 count-model dependence and its C_KH-invariance
 *   are readable in one place.
 *
 *   NO RE-DERIVATION. Every value below is imported and copied verbatim from
 *   imp-96402 / imp-96426 / imp-96429 -- this module computes nothing new.
 *   TABULATION ONLY. Closes no gap, changes no bound, proves no constant. C_H
 *   stays UNPROVEN (imp-2642 / imp-2701); no refereed bound is changed
 *   . RH remains open. NO QED.
 *
 * Provenance of baked inputs (single sources of truth, cited not re-derived):
 *   - imp-96402-ecoll-anchor-from-tabulated-true-zero-height.js: N=1 and
 *     N=1e22 endpoint anchors.
 *   - imp-96426-ecoll-anchor-intermediate-heights.js: N=1e3..1e6 intermediate
 *     anchors.
 *   - imp-96429-ecoll-ckh-sensitivity.js: the C_KH-invariance sweep result.
 *
 * Syntax note: this header avoids the close-comment terminator sequence inside
 *   prose and uses brace notation dg_{k*}/dt for derivative-like expressions.
 */

import {
  IMP96402_ECOLL_ANCHOR_FROM_TABULATED_TRUE_ZERO_HEIGHT as SRC_96402,
} from './imp-96402-ecoll-anchor-from-tabulated-true-zero-height.js';
import {
  IMP96426_ECOLL_ANCHOR_INTERMEDIATE_HEIGHTS as SRC_96426,
} from './imp-96426-ecoll-anchor-intermediate-heights.js';
import {
  IMP96429_ECOLL_CKH_SENSITIVITY as SRC_96429,
} from './imp-96429-ecoll-ckh-sensitivity.js';

// One ledger row per anchor, columns copied verbatim from the source modules.
function ledgerRow(anchor, ckhInvarianceNote) {
  return {
    N: anchor.N,
    source: anchor.source,
    gammaTrue: anchor.gammaTrue,
    gammaCount: anchor.gammaCount,
    gammaRelGap: anchor.gammaRelGap,
    rateRelGap: anchor.rateRelGap,
    ckhInvarianceNote,
  };
}

const CKH_NOTE_MEASURED =
  'imp-96429 measured this endpoint directly: rate gap stable to within max ' +
  'deviation ' +
  SRC_96429.maxRelGapDeviation.atFirstZero.toExponential(2) +
  ' (N=1) / ' +
  SRC_96429.maxRelGapDeviation.at1e22.toExponential(2) +
  ' (N=1e22) across a 3-decade C_KH sweep (0.1x..100x baseline).';
const CKH_NOTE_MECHANISM =
  'Not directly swept by imp-96429, but covered by the same algebraic ' +
  'mechanism: C_KH enters both rateCount and rateTrue as the identical ' +
  'sqrt(C_KH) prefactor, so it cancels in rateRelGap for any N.';

export const IMP96459_ECOLL_COUNT_MODEL_ANCHOR_LEDGER = {
  id: 'imp-96459',
  title:
    'Single honest-ledger tabulation of the E_coll count-model anchors: the ' +
    'imp-96402 endpoints (N=1, 1e22), the imp-96426 intermediate rungs ' +
    '(N=1e3..1e6), and the imp-96429 C_KH-invariance sweep',
  kind: 'tabulation / assembly (no closure, no bound change, no re-derivation)',
  rows: [
    ledgerRow(SRC_96402.contrastAnchorFirstZero, CKH_NOTE_MEASURED),
    ledgerRow(SRC_96426.intermediateAnchors[0], CKH_NOTE_MECHANISM),
    ledgerRow(SRC_96426.intermediateAnchors[1], CKH_NOTE_MECHANISM),
    ledgerRow(SRC_96426.intermediateAnchors[2], CKH_NOTE_MECHANISM),
    ledgerRow(SRC_96426.intermediateAnchors[3], CKH_NOTE_MECHANISM),
    ledgerRow(SRC_96402.primaryAnchorOdlyzko1e22, CKH_NOTE_MEASURED),
  ],
  ckhInvarianceSummary: SRC_96429.verdict,
  verdict:
    'LEDGER ASSEMBLED. Six rows (N=1, 1e3, 1e4, 1e5, 1e6, 1e22) copied ' +
    'verbatim from imp-96402 and imp-96426 show the count-model relative gap ' +
    'shrinking monotonically from macroscopic (N=1) to the double-precision ' +
    'floor (N=1e22); imp-96429 shows this verdict is exactly C_KH-invariant. ' +
    'Tabulation only: no gap closed, no bound changed, no value re-derived, ' +
    'G6_polymath15_bridge not closed, conditional C_H <= 0.127 stays ' +
    'UNPROVEN, C_H isRigorousUpperBound = false (imp-2642/imp-2701). ' +
    'No refereed bound is changed. RH open. NO QED.',
  provenance:
    'imp-96402-ecoll-anchor-from-tabulated-true-zero-height.js (N=1, N=1e22 ' +
    'rows); imp-96426-ecoll-anchor-intermediate-heights.js (N=1e3..1e6 rows); ' +
    'imp-96429-ecoll-ckh-sensitivity.js (C_KH-invariance sweep).',
};

// Machine-readable honest-status banner (imp-96337 convention) for any
// consumer surface that renders this ledger.
export const IMP96459_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Tabulation only: every row '
  + 'is copied verbatim from imp-96402/imp-96426/imp-96429, nothing '
  + 're-derived; no gap closed, no bound changed, conditional C_H <= 0.127 '
  + 'stays UNPROVEN.';

export const IMP96459_ECOLL_COUNT_MODEL_ANCHOR_LEDGER_ASSERTIONS = [
  {
    id: 'imp96459-six-rows-present',
    holds: () => IMP96459_ECOLL_COUNT_MODEL_ANCHOR_LEDGER.rows.length === 6,
    why:
      'The ledger must carry exactly the six baked anchors (N=1, 1e3, 1e4, ' +
      '1e5, 1e6, 1e22) copied from imp-96402 and imp-96426, no more and no ' +
      'fewer.',
  },
  {
    id: 'imp96459-rows-match-source-verbatim',
    holds: () =>
      IMP96459_ECOLL_COUNT_MODEL_ANCHOR_LEDGER.rows[0].gammaTrue ===
        SRC_96402.contrastAnchorFirstZero.gammaTrue &&
      IMP96459_ECOLL_COUNT_MODEL_ANCHOR_LEDGER.rows[5].gammaTrue ===
        SRC_96402.primaryAnchorOdlyzko1e22.gammaTrue &&
      IMP96459_ECOLL_COUNT_MODEL_ANCHOR_LEDGER.rows[2].gammaTrue ===
        SRC_96426.intermediateAnchors[1].gammaTrue,
    why:
      'Every ledger row must be a verbatim copy of the source anchor object, ' +
      'not a re-derivation, so a spot-check against the first, an ' +
      'intermediate, and the last row must find byte-identical values.',
  },
  {
    id: 'imp96459-gamma-gap-monotone-decreasing',
    holds: () => {
      const gaps = IMP96459_ECOLL_COUNT_MODEL_ANCHOR_LEDGER.rows.map((r) =>
        Math.abs(r.gammaRelGap),
      );
      return gaps.every((g, i) => i === 0 || g < gaps[i - 1]);
    },
    why:
      'The assembled ledger must reproduce the imp-96426 monotone-decay ' +
      'result across all six rows: the count-model gap shrinks strictly as N ' +
      'grows from 1 to 1e22.',
  },
  {
    id: 'imp96459-no-closure-c-h-still-open',
    holds: () =>
      /no gap closed|NO QED|no bound changed/i.test(
        IMP96459_ECOLL_COUNT_MODEL_ANCHOR_LEDGER.verdict,
      ) &&
      IMP96459_ECOLL_COUNT_MODEL_ANCHOR_LEDGER.kind.includes('no closure'),
    why:
      'This ticket is tabulation only: it must not assert closure of ' +
      'G6_polymath15_bridge, must not change any bound, and must not ' +
      'reclassify the unproven conditional C_H <= 0.127 as rigorous.',
  },
  {
    id: 'imp96459-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96459_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96459_HONEST_BANNER) &&
      /NO QED/.test(IMP96459_HONEST_BANNER),
    why:
      'the honest banner carries the RH-open / PT-Lambda / NO-QED markers ' +
      'for any consumer surface that renders this finding.',
  },
];
