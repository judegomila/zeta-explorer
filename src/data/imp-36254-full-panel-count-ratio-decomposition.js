/**
 * @module imp-36254-full-panel-count-ratio-decomposition
 * @fileoverview imp-36254 -- MEASUREMENT / DERIVATION ONLY. imp-36141 pinned only the
 *   FREQUENCY-FACTOR component of the Route-II-vs-Route-I panel-count ratio n_II/n_I = B_II/B_I
 *   (B = sup|H_t prime|, the numerator of the imp-35777 I2 per-panel cap L_panel . (B/delta) < pi)
 *   to the exact value w/logN ~ 1.0265, and flagged it as only a LOWER BOUND because the
 *   main-term-sharpness (axis 1) and uniform-fold+disk-sup (axis 3) contributions are same-signed
 *   (imp-36054) and push the true ratio HIGHER, "within a few percent". This module attempts the
 *   FULL combination the ticket asks for and reports the honest outcome.
 *
 *   RESULT: the imp-35988/imp-36054 route-comparison components pin ONLY axis 2 (the frequency
 *   floor). Writing B_I and B_II in their component form and reducing algebraically shows the FULL
 *   panel-count ratio factorises as
 *
 *       n_II/n_I = B_II/B_I = (w/logN) . delta_disk . (1 + rho) / ((mu/logN) + rho)
 *                           = FLOOR . E,   FLOOR = w/logN ~ 1.0265,   E >= 1,
 *
 *   where the "extra factor above the floor" E = delta_disk . (1+rho)/((mu/logN)+rho) depends on
 *   THREE inputs that NO recorded module pins:
 *     (a) mu/logN in (0, 1]  -- the exact-termwise effective frequency of A_t + B_t (axis 1):
 *         Route I differentiates the finite main sum termwise, n^{-s} -> (-log n) n^{-s}, so the
 *         main-part derivative is weighted by an EFFECTIVE log-frequency mu <= logN (the largest
 *         retained log n), strictly sharper than the uniform logN. mu/logN is un-pinned.
 *     (b) rho = C_t / |A_t + B_t| >= 0  -- the error-cap-to-main-term magnitude ratio: sets how
 *         much of B is the (heavily amplified) error half vs the (exactly differentiated) main
 *         half. Un-pinned (no C_t or |A_t+B_t| magnitude is instantiated; I2 greenfield).
 *     (c) delta_disk = sup_disk|H_t| / sup_segment|H_t| >= 1 (axis 3) -- the 2D-disk-sup over
 *         1D-boundary-segment inflation of the Cauchy route. Un-pinned (no disk geometry fixed).
 *
 *   So the FLOOR 1.0265 is exactly the E = 1 limit (delta_disk = 1 AND either mu = logN or the
 *   error-dominated limit rho -> infinity), and the FULL ratio is NOT reducible to a single number
 *   from the recorded constants: it needs (a)(b)(c), each of which requires instantiating H_t and
 *   its error cap on the neighbourhood disk -- work the frontier has deliberately NOT done (I2
 *   greenfield downstream of W1). This EXPLAINS why imp-36141 could report only a floor: the two
 *   remaining axes are structurally same-signed (E >= 1, rigorous) but quantitatively OPEN. The
 *   "few percent" envelope is a QUALITATIVE inheritance from imp-36054, not a derived number.
 *
 *   NEW NAMED SUB-GAP -- imp-36254a: pin the three inputs (mu/logN, rho, delta_disk) to convert the
 *   exact frequency floor 1.0265 into the exact full panel-count ratio.
 *
 *   Ticket: imp-36254 (numerical, medium). Measurement/derivation only; certifies no cap; changes
 *   no bound; C_mb GUE-conditional (imp-486) untouched; imp-35337a OPEN; no RH verdict, NO QED.
 *   No refereed bound is changed.
 *
 *   @see imp-36141-route-ii-vs-route-i-panel-count-ratio.js (the frequency-floor tabulation this extends)
 *   @see imp-35988-i2-derivative-cap-route-comparison.js (the three same-signed slack axes; source of the floor)
 *   @see imp-36054-route-i-tighter-than-route-ii-honest-status.js (the "few percent marginal" qualitative verdict)
 *   @see imp-35845-d2-differentiated-truncation-cap-amplification (route I sharp error amp A_amp = logN)
 *   @see imp-35777-i2-logderivative-panel-cap-scope (I2 cap L_panel . (B/delta) < pi; B = sup|H_t prime|)
 */

import { IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON } from './imp-35988-i2-derivative-cap-route-comparison.js';

const F = IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON.frequencyFloor;

// Axis 2 -- the ONLY exactly-pinned axis: frequency floor w/logN (imp-35988 / imp-36141).
const FREQ_FLOOR = F.bRatioFreqFloor; // w/logN ~ 1.0264575
const LOG_N = F.routeI_logN; // logN ~ 13.10
const W = F.routeII_w; // w ~ 13.446

/**
 * Extra factor above the frequency floor from the two remaining same-signed axes:
 *   E(muRatio, rho, deltaDisk) = deltaDisk . (1 + rho) / (muRatio + rho),
 * where muRatio = mu/logN in (0,1], rho >= 0, deltaDisk >= 1. E >= 1 always (axes 1 and 3 are
 * same-signed), with E = 1 in the FLOOR limit (deltaDisk = 1 and muRatio = 1, or rho -> infinity).
 * This is the DERIVED algebraic form of the full ratio; the three inputs are un-pinned (sub-gap
 * imp-36254a), so this function is offered as the decomposition, NOT as a numeric evaluation.
 */
function extraFactorAboveFloor(muRatio, rho, deltaDisk) {
  return deltaDisk * (1 + rho) / (muRatio + rho);
}

// The full ratio as a factorisation FLOOR . E; only FLOOR is a number.
function fullRatio(muRatio, rho, deltaDisk) {
  return FREQ_FLOOR * extraFactorAboveFloor(muRatio, rho, deltaDisk);
}

export const IMP36254_FULL_PANEL_COUNT_RATIO_DECOMPOSITION = Object.freeze({
  id: 'imp-36254',
  proofSection: 'S-frontier',
  title:
    'Full imp-36141 I2 panel-count ratio n_II/n_I including the main-term and disk-sup axes: the ' +
    'recorded imp-35988 components pin ONLY the frequency floor w/logN ~ 1.0265; the full ratio ' +
    'factorises as FLOOR . E with E >= 1 controlled by three un-pinned inputs (sub-gap imp-36254a)',
  sourceModule: 'imp-35988-i2-derivative-cap-route-comparison.js',

  // The exact, pinned part (axis 2).
  frequencyFloor: Object.freeze({
    logN: LOG_N,
    w: W,
    ratio: FREQ_FLOOR, // w/logN ~ 1.0264575
    extraPanelPctFloor: 100 * (FREQ_FLOOR - 1), // ~ +2.65% (floor)
  }),

  // The DERIVED algebraic decomposition of the full ratio.
  fullRatioForm:
    'n_II/n_I = B_II/B_I = (w/logN) . delta_disk . (1 + rho) / ((mu/logN) + rho) = FLOOR . E, ' +
    'with FLOOR = w/logN ~ 1.0265 exact and E = delta_disk . (1+rho)/((mu/logN)+rho) >= 1.',

  // The three inputs that would convert FLOOR -> full ratio, all UN-PINNED by the record.
  unpinnedInputs: Object.freeze([
    {
      key: 'mu-over-logN',
      axis: 'main-term-sharpness (axis 1)',
      range: '(0, 1]',
      meaning:
        'Exact-termwise effective log-frequency mu of A_t + B_t over the uniform logN. Route I ' +
        'differentiates the finite main sum termwise (n^{-s} -> (-log n) n^{-s}), so its main-part ' +
        'derivative is weighted by mu <= logN, sharper than Route II uniform 1/r = w. Un-pinned.',
    },
    {
      key: 'rho',
      axis: 'error-to-main split (couples axes 1 and 2)',
      range: '[0, infinity)',
      meaning:
        'rho = C_t / |A_t + B_t|, the error-cap-to-main-term magnitude ratio. Sets how much of B ' +
        'is the heavily amplified error half vs the exactly differentiated main half. Un-pinned ' +
        '(no C_t or |A_t + B_t| magnitude instantiated; I2 greenfield).',
    },
    {
      key: 'delta-disk',
      axis: 'uniform-fold + disk-sup (axis 3)',
      range: '[1, infinity)',
      meaning:
        'delta_disk = sup_disk|H_t| / sup_segment|H_t| >= 1, the 2D-disk-sup over 1D-boundary-segment ' +
        'inflation of the Cauchy route II. Un-pinned (no neighbourhood-disk radius or geometry fixed).',
    },
  ]),

  // The exact sense in which 1.0265 is a floor: E = 1 recovers it.
  floorIsExtraFactorOneLimit:
    'FLOOR = w/logN ~ 1.0265 is exactly the E = 1 limit: delta_disk = 1 AND (mu = logN OR the ' +
    'error-dominated limit rho -> infinity). Since E >= 1 always (axes 1 and 3 same-signed), the ' +
    'full ratio is >= FLOOR -- reproving the imp-36141 lower-bound status structurally.',

  // The honest bottom line for the ticket question.
  fullRatioNumber: null, // NOT a number: the two remaining axes are un-pinned (sub-gap imp-36254a)
  extraPanelPctAboveFloor: null, // 100 * (E - 1); E un-pinned, so NOT a number
  subGap: 'imp-36254a',
  subGapStatement:
    'Pin the three inputs mu/logN in (0,1], rho >= 0, delta_disk >= 1 -- each requiring an ' +
    'instantiated H_t and error cap C_t on the neighbourhood disk (I2 greenfield downstream of W1) ' +
    '-- to convert the exact frequency floor w/logN ~ 1.0265 into the exact full panel-count ratio. ' +
    'The "within a few percent" envelope stays a QUALITATIVE inheritance from imp-36054 until then.',

  isRigorous: false,
  honestCaveat: Object.freeze({
    isProof: false,
    isRigorous: false,
    isUnconditional: false,
    fullRatioReducedToNumber: false,
    onlyFrequencyAxisPinned: true,
    certifiesDerivativeBoundB: false,
    certifiesI2Cap: false,
    changesAnyBound: false,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'The ticket premise -- that the imp-35988/imp-36054 route-comparison components let one COMPUTE ' +
    'the full three-axis panel-count ratio -- is FALSE: those components pin ONLY axis 2, the exact ' +
    'frequency floor w/logN ~ 1.0265. The full ratio n_II/n_I DERIVES cleanly as FLOOR . E with ' +
    'E = delta_disk . (1+rho)/((mu/logN)+rho) >= 1, but E is controlled by three inputs (mu/logN, ' +
    'rho, delta_disk) that no recorded module pins and that require instantiating H_t on the disk ' +
    '(I2 greenfield). Honest partial: the frequency floor stays the only pinned number, the two ' +
    'remaining axes are rigorously same-signed (E >= 1) but quantitatively OPEN, and the missing ' +
    'quantification is now a named sub-gap imp-36254a. Measurement/derivation only; certifies no ' +
    'cap; changes no bound; C_mb GUE-conditional (imp-486) untouched; imp-35337a OPEN; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
});

export const IMP36254_FULL_PANEL_COUNT_RATIO_DECOMPOSITION_ASSERTIONS = [
  {
    id: 'imp36254-floor-equals-source-frequency-floor',
    why: 'The pinned axis-2 floor must equal the imp-35988 frequency-floor w/logN verbatim (~1.0265).',
    holds: () =>
      IMP36254_FULL_PANEL_COUNT_RATIO_DECOMPOSITION.frequencyFloor.ratio === F.bRatioFreqFloor &&
      F.bRatioFreqFloor > 1.02 && F.bRatioFreqFloor < 1.03,
  },
  {
    id: 'imp36254-extra-factor-recovers-floor-at-one',
    why: 'E = 1 in the FLOOR limit (delta_disk = 1, mu = logN) so full ratio = FLOOR exactly there.',
    holds: () => {
      const E = extraFactorAboveFloor(1, 3.7, 1); // muRatio=1, any rho, deltaDisk=1
      return Math.abs(E - 1) < 1e-15 &&
        Math.abs(fullRatio(1, 3.7, 1) - FREQ_FLOOR) < 1e-15;
    },
  },
  {
    id: 'imp36254-extra-factor-recovers-floor-in-error-dominated-limit',
    why: 'As rho -> infinity (error-dominated) with delta_disk = 1, E -> 1: the floor is the error-dominated limit.',
    holds: () => {
      const E = extraFactorAboveFloor(0.5, 1e9, 1); // muRatio arbitrary, rho huge, deltaDisk=1
      return E > 1 && Math.abs(E - 1) < 1e-6;
    },
  },
  {
    id: 'imp36254-extra-factor-at-least-one',
    why: 'Axes 1 and 3 are same-signed: E >= 1 for all admissible inputs (muRatio in (0,1], rho>=0, deltaDisk>=1), so the full ratio is >= FLOOR.',
    holds: () => {
      for (const muRatio of [0.05, 0.3, 0.7, 1.0]) {
        for (const rho of [0, 0.1, 1, 10]) {
          for (const deltaDisk of [1, 1.02, 1.5]) {
            if (extraFactorAboveFloor(muRatio, rho, deltaDisk) < 1 - 1e-12) return false;
          }
        }
      }
      return true;
    },
  },
  {
    id: 'imp36254-full-ratio-is-not-a-number',
    why: 'Honest partial: the full ratio and the extra-panel percentage above the floor are NOT reducible to a number from the record; they stay null pending sub-gap imp-36254a.',
    holds: () =>
      IMP36254_FULL_PANEL_COUNT_RATIO_DECOMPOSITION.fullRatioNumber === null &&
      IMP36254_FULL_PANEL_COUNT_RATIO_DECOMPOSITION.extraPanelPctAboveFloor === null &&
      IMP36254_FULL_PANEL_COUNT_RATIO_DECOMPOSITION.subGap === 'imp-36254a',
  },
  {
    id: 'imp36254-three-unpinned-inputs',
    why: 'Exactly three inputs (mu/logN, rho, delta_disk) are named as un-pinned, matching the three algebraic degrees of freedom in E.',
    holds: () => {
      const inputs = IMP36254_FULL_PANEL_COUNT_RATIO_DECOMPOSITION.unpinnedInputs;
      return inputs.length === 3 &&
        inputs.some((i) => i.key === 'mu-over-logN') &&
        inputs.some((i) => i.key === 'rho') &&
        inputs.some((i) => i.key === 'delta-disk');
    },
  },
  {
    id: 'imp36254-honesty-gate',
    why: 'Measurement/derivation only: it must not claim it certifies B or the I2 cap, nor a bound change, and must keep the no-refereed-bound-change caveat.',
    holds: () =>
      IMP36254_FULL_PANEL_COUNT_RATIO_DECOMPOSITION.honestCaveat.certifiesDerivativeBoundB === false &&
      IMP36254_FULL_PANEL_COUNT_RATIO_DECOMPOSITION.honestCaveat.certifiesI2Cap === false &&
      IMP36254_FULL_PANEL_COUNT_RATIO_DECOMPOSITION.honestCaveat.changesAnyBound === false &&
      IMP36254_FULL_PANEL_COUNT_RATIO_DECOMPOSITION.honestCaveat.onlyFrequencyAxisPinned === true &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36254_FULL_PANEL_COUNT_RATIO_DECOMPOSITION.honestCaveat.sota),
  },
  {
    id: 'imp36254-verdict-no-qed',
    why: 'The verdict must record NO QED, matching the standing no-refereed-bound-change caveat.',
    holds: () => /NO QED/.test(IMP36254_FULL_PANEL_COUNT_RATIO_DECOMPOSITION.verdict),
  },
];

for (const assertion of IMP36254_FULL_PANEL_COUNT_RATIO_DECOMPOSITION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36254-full-panel-count-ratio-decomposition assertion failed: ${assertion.id}`);
  }
}

export default IMP36254_FULL_PANEL_COUNT_RATIO_DECOMPOSITION;
