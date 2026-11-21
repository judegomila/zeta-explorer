/**
 * imp-95137 — accuracy cross-check of the imp-95210 alias-decomposed
 * Lipschitz ledger 44.476/x (vs the prior 84.769/x) and its claimed
 * "free 1.9x cell reduction" for the tiered window-1 certifier.
 *
 * SCOPE. Accuracy audit only. Independently re-derives the arithmetic
 * relationships stated in imp-95210-window1-pilot-certificate.js
 * (LEDGERS_PER_X + FEASIBILITY) and flags any discrepancy. Changes no
 * bound, certifies nothing, promotes nothing. NO QED; no refereed bound is changed.
 *
 * WHAT WAS VERIFIED (recomputable from the frozen imp-95210 constants):
 *  1. LEDGER RATIO. 84.76908 / 44.476493 = 1.905930, matching the
 *     claimed 1.906 to 7.0e-5. CONFIRMED.
 *  2. CELL REDUCTION. The feasibility model has cells scale linearly
 *     with the ledger (cells = 2 * dryRunPerSide * ledger / oldLedger).
 *     Hence the cell-reduction ratio EQUALS the ledger ratio. The stored
 *     scenario cellsTotal (1.115e10 vs 5.848e9) give 1.9066, agreeing
 *     with the exact ledger ratio 1.9059 to rounding (4e-4, the stored
 *     cell counts carry 4 sig figs). The "free 1.9x" is a direct
 *     arithmetic consequence, CONFIRMED consistent, not an extra claim.
 *  3. TRUE-DERIVATIVE GAP. 44.476493 / 0.234494 = 189.7 (the module's
 *     ">150x above true derivative" and "190x gap"); trueMeasuredMax
 *     = maxDPilotPerU[0]/(4*pi) = 2.946742/(4*pi) = 0.234494. CONFIRMED.
 *
 * WHAT COULD NOT BE INDEPENDENTLY RE-DERIVED (flagged, honest sub-gap):
 *  - THE ABSOLUTE 44.476493 CONSTANT. It is an external byproduct of the
 *    native/gate2-interval Arb overhang+mismatch mass computation, not
 *    reconstructible from the data present in the imp-95210 module. The
 *    per-defect table PER_DEFECT_SCALES holds SAMPLED true-scale
 *    derivatives (sum_j dAbsDperU = 8.81/u => 0.701/x; sum_j of the
 *    o+mm+rr triangle = 8.46/u => 0.673/x), which are the ~0.67-0.70/x
 *    true scales, NOT the rigorous x-uniform triangle ledger. So this
 *    audit confirms the RATIO and the cell-reduction CONSISTENCY, but the
 *    magnitude 44.476 stays external-dependent (the module itself notes
 *    "Arb re-derivation pending"). No discrepancy is implied by this; it
 *    is simply outside what the module's own data can check.
 *
 * VERDICT. No discrepancy found. The 1.906x ledger ratio and the derived
 * 1.9x cell reduction are arithmetically consistent with the frozen
 * imp-95210 constants; the absolute 44.476 ledger remains an unverified
 * external Arb byproduct (sub-gap ALIAS-LEDGER-ARB-REDERIVE OPEN).
 */

import {
  LEDGERS_PER_X,
  FEASIBILITY,
  MEASURED_SCALES,
} from './imp-95210-window1-pilot-certificate.js';

export const IMP95137_ALIAS_LEDGER_CROSSCHECK = Object.freeze({
  ticket: 'imp-95137-alias-ledger-crosscheck',
  parent: 'imp-95210-window1-pilot-certificate',
  ledgerRatio: 84.76908 / 44.476493, // 1.905930
  claimedRatio: 1.906,
  ledgerRatioMatch: Math.abs(84.76908 / 44.476493 - 1.906) < 1e-4,
  cellReductionFromStored:
    FEASIBILITY.scenarios[0].cellsTotal / FEASIBILITY.scenarios[1].cellsTotal, // 1.9066
  cellReductionEqualsLedgerRatio: true, // cells scale linearly with the ledger, by construction
  trueDerivativeGap: LEDGERS_PER_X.aliasDecomposed / LEDGERS_PER_X.trueMeasuredMax, // 189.7
  aliasConstantIndependentlyRederived: false, // external Arb byproduct; per-defect table is sampled true-scale
  subGap: 'ALIAS-LEDGER-ARB-REDERIVE-OPEN',
  verdict:
    'NO DISCREPANCY: 84.76908/44.476493 = 1.9059 matches the claimed 1.906 (7e-5); ' +
    'cell reduction equals the ledger ratio by the linear feasibility model (stored 1.9066 vs 1.9059, ' +
    'rounding-level); the absolute 44.476 ledger stays an unverified external Arb byproduct. ' +
    'Audit only; changes no bound; NO QED; no refereed bound is changed.',
});

// ── self-executing assertions (import-light; recomputable arithmetic only) ───
export const IMP95137_ASSERTIONS = [
  {
    id: 'imp95137-ledger-ratio-confirmed',
    description:
      'the 84.76908/44.476493 ledger ratio recomputes to 1.9059, matching the claimed 1.906 to 1e-4',
    holds: () =>
      Math.abs(84.76908 / 44.476493 - 1.906) < 1e-4 &&
      Math.abs(LEDGERS_PER_X.existingCertifier / LEDGERS_PER_X.aliasDecomposed - 1.906) < 1e-4,
  },
  {
    id: 'imp95137-cell-reduction-equals-ledger-ratio',
    description:
      'cells scale linearly with the ledger, so the cell-reduction ratio equals the ledger ratio to rounding (stored 1.9066 vs exact 1.9059)',
    holds: () => {
      const ledgerRatio = LEDGERS_PER_X.existingCertifier / LEDGERS_PER_X.aliasDecomposed;
      const cellRatio =
        FEASIBILITY.scenarios[0].cellsTotal / FEASIBILITY.scenarios[1].cellsTotal;
      return Math.abs(cellRatio - ledgerRatio) < 1e-3;
    },
  },
  {
    id: 'imp95137-true-derivative-gap-and-anchor',
    description:
      'the alias ledger sits 189.7x above the true measured derivative, and trueMeasuredMax = maxDPilotPerU[0]/(4 pi)',
    holds: () =>
      Math.abs(LEDGERS_PER_X.aliasDecomposed / LEDGERS_PER_X.trueMeasuredMax - 189.7) < 1 &&
      Math.abs(MEASURED_SCALES.maxDPilotPerU[0] / (4 * Math.PI) - LEDGERS_PER_X.trueMeasuredMax) < 1e-5,
  },
  {
    id: 'imp95137-honesty-gate-audit-only',
    description:
      'fail-closed honesty: absolute constant not independently re-derived, sub-gap OPEN, no bound promoted, NO QED and no-refereed-bound-change stated',
    holds: () =>
      IMP95137_ALIAS_LEDGER_CROSSCHECK.aliasConstantIndependentlyRederived === false &&
      /OPEN/.test(IMP95137_ALIAS_LEDGER_CROSSCHECK.subGap) &&
      /NO QED/.test(IMP95137_ALIAS_LEDGER_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP95137_ALIAS_LEDGER_CROSSCHECK.verdict),
  },
];

for (const a of IMP95137_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95137-alias-ledger-crosscheck assertion failed: ${a.id}`);
  }
}

export default IMP95137_ALIAS_LEDGER_CROSSCHECK;
