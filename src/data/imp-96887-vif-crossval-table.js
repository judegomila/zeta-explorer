/**
 * @module imp-96887-vif-crossval-table
 * @fileoverview imp-96887 -- tabulate the imp-96853 cross-validation: the RIGOROUS
 *   two-sided-envelope conditional VIF upper bound (0.0054629, z >= 26.023) against the
 *   closed-form ACTUAL finite-window VIF (0.005463, z = 26.023) it brackets, and the tiny
 *   z-shift the 5.65e-8 envelope slack induces between them.
 *
 *   WHY A TABLE (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96853 already derived and exported all three VIF levels (rho_1-only head, actual
 *   finite-window, two-sided-envelope upper bound) plus the slack sum, but only as nested
 *   fields inside its assessment object -- no side-by-side comparison and no explicit
 *   z-shift figure. This module imports IMP96853_VIF_TWOSIDED_ENVELOPE_PARTITION_ASSESSMENT
 *   directly (no re-derivation, no re-import of the zeros bundle -- the source module itself
 *   is import-light) and reshapes its three levels into a chart/table-ready row list, then
 *   computes the envelope-vs-actual z-shift explicitly.
 *
 *   THE TABLE
 *   -----------------------------------------------
 *   | level                  | VIF        | z        | relation to actual  |
 *   |------------------------|------------|----------|----------------------|
 *   | rho_1-only head        | 0.075232   | 7.012    | rigorous, conservative (drops tail) |
 *   | actual finite-window   | 0.005463   | 26.023   | closed-form tail, no envelope |
 *   | two-sided-envelope UB  | 0.0054629  | 26.023   | rigorous conditional upper bound |
 *
 *   The envelope-bounded VIF exceeds the actual value by exactly the slack sum (5.65e-8),
 *   and because z falls as VIF rises (z = REL_ERR / sqrt(2*VIF/N_W)), the envelope bound's
 *   z is slightly BELOW the actual z -- a shift of |dz| ~ 1.35e-4, four orders of magnitude
 *   smaller than the gap between either VIF level and the rho_1-only head's z = 7.012.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A presentation/reshaping module. It establishes nothing new: every number is imported
 *   verbatim from imp-96853, and the only new computation is the explicit z-shift
 *   subtraction. NO QED. No refereed bound is changed; RH open.
 *
 * @see imp-96853-vif-twosided-envelope-partition-assessment.js (source: all three VIF levels)
 * @see imp-96628-boxsine-lagcorr-ibp-envelope (the certified two-sided C(k)/L^2 envelope)
 * @see imp-96593-vif-exact-tail-rigor-upgrade-assessment.js (residual obstruction after imp-96853)
 *
 * Ticket: imp-96887 (content, low, sonnet-4-6). Presentation only; no bound moved; NO QED;
 * no refereed bound is changed.
 */

import { IMP96853_VIF_TWOSIDED_ENVELOPE_PARTITION_ASSESSMENT } from './imp-96853-vif-twosided-envelope-partition-assessment.js';

const LEVELS = IMP96853_VIF_TWOSIDED_ENVELOPE_PARTITION_ASSESSMENT.levels;

// Chart/table-ready rows, reshaped directly from the imp-96853 levels (no re-derivation).
const TABLE = [
  {
    key: 'rho1Head',
    label: 'rho_1-only head',
    vif: LEVELS.rho1Head.vifUpper,
    z: LEVELS.rho1Head.zLower,
    relationToActual: 'rigorous but conservative -- drops the whole tail in the bound-enlarging direction',
  },
  {
    key: 'actualFiniteWindow',
    label: 'actual finite-window',
    vif: LEVELS.actualFiniteWindow.vif,
    z: LEVELS.actualFiniteWindow.z,
    relationToActual: 'closed-form tail summed over the whole Bartlett window; no envelope slack added',
  },
  {
    key: 'twoSidedEnvelopeBound',
    label: 'two-sided-envelope upper bound',
    vif: LEVELS.twoSidedEnvelopeBound.vifUpper,
    z: LEVELS.twoSidedEnvelopeBound.zLower,
    relationToActual: 'RIGOROUS conditional upper bound = actual + envelope slack (5.65e-8); needs no per-lag sign',
  },
];

const actualRow = TABLE.find((r) => r.key === 'actualFiniteWindow');
const envelopeRow = TABLE.find((r) => r.key === 'twoSidedEnvelopeBound');

// The envelope-vs-actual cross-validation: same slack that separates the two VIF values
// separates their z-levels, in the opposite direction (z falls as VIF rises).
const vifGap = envelopeRow.vif - actualRow.vif; // == envelopeSlackSum, 5.65e-8
const zShift = envelopeRow.z - actualRow.z; // ~ -1.35e-4

export const IMP96887_VIF_CROSSVAL_TABLE = {
  ticket: 'imp-96887',
  source: 'imp-96853',
  question:
    'Tabulate the imp-96853 cross-validation: how do the rigorous two-sided-envelope conditional VIF ' +
    'upper bound and the closed-form actual finite-window VIF compare, and how large is the z-shift ' +
    'the envelope slack induces between them?',
  table: TABLE,
  crossValidation: {
    vifGap,
    vifGapMatchesSlackSum: Math.abs(vifGap - IMP96853_VIF_TWOSIDED_ENVELOPE_PARTITION_ASSESSMENT.envelopeSlackSum) < 1e-12,
    zShift,
    zShiftMagnitude: Math.abs(zShift),
    note:
      'The envelope-bounded VIF exceeds the actual finite-window VIF by exactly the imp-96853 slack sum ' +
      '(5.65e-8), and because z falls as VIF rises, the envelope bound\'s z sits |dz| ~ 1.35e-4 BELOW the ' +
      'actual z -- four orders of magnitude smaller than the gap to the rho_1-only head\'s z = 7.012.',
  },
  verdict:
    'Cross-validated: the two-sided-envelope upper bound (VIF <= 0.0054629, z >= 26.023) brackets the ' +
    'closed-form actual finite-window value (VIF = 0.005463, z = 26.023) from above by exactly the ' +
    '5.65e-8 slack sum, shifting z down by only ~1.35e-4 -- the rigorous conditional bound is ' +
    'essentially indistinguishable from the actual value. Presentation/reshaping only; every figure is ' +
    'imported verbatim from imp-96853; no bound moved; conditional on the GUE sine kernel / Montgomery ' +
    'pair correlation for the zeta zeros (UNPROVEN); changes no unconditional bound; RH open; NO QED; ' +
    'no refereed bound is changed.',
};

export default IMP96887_VIF_CROSSVAL_TABLE;

// --- self-executing internal-consistency assertions ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // 1. Table rows reproduce the imp-96853 levels verbatim (no transcription drift).
  if (TABLE.length !== 3) throw new Error('imp-96887: table must have exactly 3 rows');
  if (!approx(TABLE[0].vif, 0.075232, 1e-5)) throw new Error('imp-96887: rho_1-only head VIF drifted');
  if (!approx(TABLE[1].vif, 0.005463, 1e-5)) throw new Error('imp-96887: actual finite-window VIF drifted');
  if (!approx(TABLE[2].vif, 0.0054629, 1e-6)) throw new Error('imp-96887: envelope-bounded VIF drifted');

  // 2. The envelope VIF strictly exceeds the actual VIF (a genuine upper bound), by exactly the slack sum.
  if (!(envelopeRow.vif > actualRow.vif)) throw new Error('imp-96887: envelope VIF must exceed actual VIF');
  if (!IMP96887_VIF_CROSSVAL_TABLE.crossValidation.vifGapMatchesSlackSum)
    throw new Error('imp-96887: vif gap must equal the imp-96853 envelope slack sum');

  // 3. z falls as VIF rises: the envelope bound's z sits (slightly) below the actual z.
  if (!(envelopeRow.z < actualRow.z)) throw new Error('imp-96887: envelope z must sit below actual z (VIF is higher)');
  if (!approx(zShift, -1.3458e-4, 1e-6)) throw new Error('imp-96887: z-shift drifted from ~-1.3458e-4');
  if (!(IMP96887_VIF_CROSSVAL_TABLE.crossValidation.zShiftMagnitude < 1e-3))
    throw new Error('imp-96887: z-shift magnitude must stay well below 1e-3');

  // 4. The z-shift is far smaller than the gap to the conservative rho_1-only head.
  const headGap = Math.abs(TABLE[0].z - actualRow.z);
  if (!(IMP96887_VIF_CROSSVAL_TABLE.crossValidation.zShiftMagnitude < headGap / 1000))
    throw new Error('imp-96887: envelope z-shift must be >=1000x smaller than the rho_1-head z gap');

  // honesty gates
  if (!/NO QED/.test(IMP96887_VIF_CROSSVAL_TABLE.verdict))
    throw new Error('imp-96887: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96887_VIF_CROSSVAL_TABLE.verdict))
    throw new Error('imp-96887: verdict dropped the no-refereed-bound-change banner');
  if (!/RH open/.test(IMP96887_VIF_CROSSVAL_TABLE.verdict))
    throw new Error('imp-96887: verdict dropped the RH-open banner');
})();
