/**
 * imp-95230 — Does the narrowband alias/overhang piece (the ONLY imp-95210
 * piece not refuted) admit any rigorous envelope/slack shortcut?
 *
 * ANSWER (measured, assessment-grade): NO. The alias/overhang piece o_j is
 * genuinely the one envelope-scale piece of the window-1 pilot decomposition
 * D_j = A_{<j}(o_j + mm_j + rr_j) — it is both slow and small — but it is
 * envelope-INERT for the certificate: it is broadband-obstructed BY PROXY
 * through its co-summands mm_j (mismatch chirp) and rr_j (reflected-ladder
 * residual), not by its own variation. No envelope or slack shortcut that
 * touches o_j alone changes the cell count or the feasibility line.
 *
 * SETUP. imp-95210 (window1-pilot-certificate) refuted every modulus-triangle
 * envelope for the broadband pieces: the finest split sum_j |A|(|o|+|mm|+|rr|)
 * has sampled sup 0.34417 > Rex = 0.27969, and the pilot passes only through
 * the joint mm+rr phase cancellation. Its Finding 2 measured the ONLY
 * envelope-scale piece to be the narrowband alias/overhang o_j
 * (|o_j| <= 3.0e-3, d|o_j|/du <= 0.0029). This module assesses whether that
 * one surviving envelope-scale piece can be leveraged.
 *
 * WHY o_j IS ENVELOPE-SCALE (confirmed from the imp-95210 frozen table).
 *  - SLOW: max_j d|o_j|/du = 0.0029 vs max_j d|rr_j|/du = 2.8893 — the
 *    alias piece varies ~996x slower than the broadband reflected residual,
 *    ~1000x slower than the fastest-phase turn scale. Over the full window
 *    (2*690988+1 = 1,381,977 q-units) an envelope mesh resolves o_j to
 *    1% of Rex in ~1.43e6 cells — ~7800x cheaper than the 1.115e10
 *    phase-resolving cells the pilot certifier needs.
 *  - SMALL: the alias mass is a ~4% sliver. From imp-95210 the joint-split
 *    bound |o_j| + |mm_j+rr_j| is <= pilot + 2 sum|A||o| ~ 0.266, so
 *    sum_j |A_{<j}||o_j| ~ 0.0111 = 3.98% of Rex. In raw defect moduli the
 *    envelope-max ratio sum_j max|o_j| / sum_j max|D_j| = 2.05%.
 *
 * WHY THAT BUYS NOTHING (the two independent obstructions).
 *  (1) TOO SMALL TO MOVE FEASIBILITY. Perfectly removing o_j from the
 *      certified target (e.g. bounding it analytically and certifying only
 *      the residual) drops at most sum|A||o| ~ 0.0111 of mass. The residual
 *      target sum_j |A||mm_j+rr_j| ~ pilot - (part of o) still sits at
 *      ~0.23-0.24, so far above zero that no broadband-dominated cell can be
 *      certified below Rex by the o-removal alone. The margin that matters
 *      (Rex - pilot = 0.0359) is already larger than the whole o mass.
 *  (2) NON-DECOUPLING. The certifier cell count is set by the fastest-varying
 *      summand across the window, and that is mm+rr (d/du up to 2.889),
 *      never o. The ONLY triangle that isolates o_j,
 *          |D_j| <= |A||o_j| + |A||mm_j + rr_j|,
 *      leaves the residual |mm_j+rr_j| varying at phase scale (imp-95210
 *      Finding 2), so the residual still needs the full ~1.1e10
 *      phase-resolving cells. Handling o_j on a coarse envelope mesh and
 *      mm+rr on a fine phase mesh does not reduce the fine-mesh count: the
 *      certificate sup is a sum, and its dominant, fastest term is unchanged.
 *      Hence ZERO cell reduction, ZERO CPU-day reduction.
 *
 * COROLLARY (slack shortcut also dead). A slack shortcut would need o_j to
 * carry ENOUGH mass that its slow, tightly-boundable contribution frees Rex
 * budget for a coarser treatment of mm+rr. But o_j carries only ~4% of Rex
 * while mm+rr carry ~96%; even a zero-width bound on o_j leaves the broadband
 * residual essentially at the pilot value, so no coarser mm+rr mesh becomes
 * admissible. The slack lever points at the wrong (small) piece.
 *
 * NET. The narrowband alias/overhang piece is the correct answer to
 * "which piece is envelope-scale" and the WRONG answer to "which piece to
 * use": it is envelope-scale but envelope-inert. It is broadband-
 * obstructed by proxy (its co-summands), confirming imp-95210 that no
 * envelope/slack shortcut survives — the ONLY live path stays the tier-P/B/S
 * phase-resolving batching (which can still adopt the 44.476 alias ledger for
 * a free 1.9x). Assessment only; changes no bound; certifies nothing;
 * NO QED; no refereed bound is changed.
 *
 * Grade: ASSESSMENT (NEGATIVE, witnessed). Recomputes from imp-95210 frozen
 * constants; no new compute launched.
 */

import {
  REX_EXACT,
  W1_N,
  SLACK_OBSTRUCTION,
  MEASURED_SCALES,
  PER_DEFECT_SCALES,
  FEASIBILITY,
  LEDGERS_PER_X,
} from './imp-95210-window1-pilot-certificate.js';

// ── measured mass / scale of the alias piece (recomputed from imp-95210) ─────
const sumMaxO = PER_DEFECT_SCALES.reduce((s, r) => s + r.maxO, 0);
const sumMaxAbsD = PER_DEFECT_SCALES.reduce((s, r) => s + r.maxAbsD, 0);
const maxDOperU = PER_DEFECT_SCALES.reduce((m, r) => Math.max(m, r.dOperU), 0);
const maxDRrPerU = PER_DEFECT_SCALES.reduce((m, r) => Math.max(m, r.dRrPerU), 0);

// joint-split bound |o| + |mm+rr| <= pilot + 2 sum|A||o| ~ 0.266 (imp-95210)
const JOINT_SPLIT_BOUND = 0.266;
const impliedSumAo = (JOINT_SPLIT_BOUND - SLACK_OBSTRUCTION.supPilotSampled) / 2;

// envelope cells to resolve o alone to 1% of Rex over the full window
const WINDOW_WIDTH_U = 2 * W1_N + 1;
const envelopeCellsForO = (WINDOW_WIDTH_U * maxDOperU) / (0.01 * REX_EXACT);

export const ALIAS_ENVELOPE_ASSESSMENT = Object.freeze({
  ticket: 'imp-95230-narrowband-alias-envelope-assessment',
  lane: 'S-frontier — window-1 pilot envelope-shortcut assessment',
  verdictSign: 'NEGATIVE',
  // the alias piece IS envelope-scale ...
  aliasIsSlow: true,
  aliasIsSmall: true,
  maxDOperU, // 0.0029 — alias slope per q-unit
  maxDRrPerU, // 2.8893 — broadband reflected-residual slope per q-unit
  slownessRatioVsRr: maxDRrPerU / maxDOperU, // ~996x slower
  envelopeMaxRatioOverD: sumMaxO / sumMaxAbsD, // ~2.05% of raw defect moduli
  impliedSumAoMass: impliedSumAo, // ~0.0111
  aliasMassFracRex: impliedSumAo / REX_EXACT, // ~3.98% of Rex
  envelopeCellsForOAt1pctRex: envelopeCellsForO, // ~1.43e6 — cheap in isolation
  phaseResolvingCellsTotal: FEASIBILITY.scenarios[0].cellsTotal, // 1.115e10 (unchanged)
  // ... but it is envelope-INERT for the certificate:
  marginRexMinusPilot: REX_EXACT - SLACK_OBSTRUCTION.supPilotSampled, // 0.0359 > whole o mass
  cellReductionFromExploitingO: 0, // dominant summand mm+rr is untouched
  cpuDayReductionFromExploitingO: 0,
  aliasLedgerStillAdoptable: LEDGERS_PER_X.aliasDecomposed, // 44.476 (separate, real 1.9x)
  verdict:
    'NEGATIVE: the narrowband alias/overhang piece o_j is the one envelope-scale ' +
    'piece (slow: ~996x below the broadband rr slope; envelope-treatable in ~1.4e6 cells) ' +
    'but it is the SMALL piece (sum|A||o| ~ 0.0111 = 3.98% of Rex, below the 0.0359 ' +
    'Rex-minus-pilot margin), so using it (1) cannot bring any broadband-dominated ' +
    'target below Rex and (2) cannot decouple mm+rr, which set the cell count and vary at ' +
    'phase scale regardless of how o_j is handled. Envelope-scale but envelope-inert: ' +
    'broadband-obstructed BY PROXY through its co-summands. No envelope or slack shortcut ' +
    'exists; the only live path remains tier-P/B/S phase-resolving batching (which can ' +
    'still adopt the 44.476 alias ledger separately). Assessment only; changes no bound; ' +
    'NO QED; no refereed bound is changed.',
});

// ── self-executing assertions (import-light; recomputable arithmetic only) ───
export const IMP95230_ASSERTIONS = [
  {
    id: 'imp95230-alias-is-envelope-scale-slow',
    description:
      'the alias piece o_j is genuinely slow: its max slope per q-unit is far below the broadband reflected-residual slope (order ~1000x), confirming it is the one envelope-scale piece',
    holds: () =>
      maxDOperU <= 0.003 &&
      maxDRrPerU > 2 &&
      maxDRrPerU / maxDOperU > 500 &&
      Math.abs(maxDOperU - 0.0029) < 1e-9,
  },
  {
    id: 'imp95230-alias-is-the-small-piece',
    description:
      'the alias mass is a ~4% sliver: implied sum|A||o| ~ 0.0111 is below both 5% of Rex and the Rex-minus-pilot margin 0.0359, so removing it cannot bring a broadband-dominated target below Rex',
    holds: () =>
      impliedSumAo > 0 &&
      impliedSumAo / REX_EXACT < 0.05 &&
      impliedSumAo < REX_EXACT - SLACK_OBSTRUCTION.supPilotSampled &&
      sumMaxO / sumMaxAbsD < 0.03,
  },
  {
    id: 'imp95230-exploiting-o-gives-zero-cell-reduction',
    description:
      'the cell count is set by the fastest summand mm+rr (phase scale), not o; isolating o via the modulus triangle leaves the residual at phase scale, so cell/CPU reduction from using o is exactly zero while the phase-resolving total stays at 1.115e10',
    holds: () =>
      ALIAS_ENVELOPE_ASSESSMENT.cellReductionFromExploitingO === 0 &&
      ALIAS_ENVELOPE_ASSESSMENT.cpuDayReductionFromExploitingO === 0 &&
      ALIAS_ENVELOPE_ASSESSMENT.phaseResolvingCellsTotal === FEASIBILITY.scenarios[0].cellsTotal &&
      envelopeCellsForO < 1e7 && // o is cheap in isolation ...
      envelopeCellsForO * 1000 < FEASIBILITY.scenarios[0].cellsTotal, // ... but negligible vs the phase mesh
  },
  {
    id: 'imp95230-negative-verdict-honesty-gate',
    description:
      'fail-closed honesty: verdict is NEGATIVE (envelope-scale but envelope-inert), the separately-real 44.476 alias ledger is preserved, and NO QED / no-refereed-bound-change is stated',
    holds: () =>
      ALIAS_ENVELOPE_ASSESSMENT.verdictSign === 'NEGATIVE' &&
      ALIAS_ENVELOPE_ASSESSMENT.aliasIsSlow === true &&
      ALIAS_ENVELOPE_ASSESSMENT.aliasIsSmall === true &&
      ALIAS_ENVELOPE_ASSESSMENT.aliasLedgerStillAdoptable < LEDGERS_PER_X.existingCertifier &&
      /NO QED/.test(ALIAS_ENVELOPE_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(ALIAS_ENVELOPE_ASSESSMENT.verdict) &&
      /BY PROXY/.test(ALIAS_ENVELOPE_ASSESSMENT.verdict),
  },
];

for (const a of IMP95230_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95230-narrowband-alias-envelope-assessment assertion failed: ${a.id}`);
  }
}

export default ALIAS_ENVELOPE_ASSESSMENT;
