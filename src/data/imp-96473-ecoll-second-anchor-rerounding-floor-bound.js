/**
 * @module data/imp-96473-ecoll-second-anchor-rerounding-floor-bound
 * @fileoverview imp-96473 -- quantify the re-rounding-floor residual magnitude
 *   of the two imp-96349 RECONSTRUCTED second E_coll anchors and bound each one
 *   against the 6-significant-figure storage floor, confirming (per imp-96380)
 *   that they are storage artifacts, not independent evidence.
 *
 *   imp-96380 asserted -- but never bounded numerically -- that of the anchors
 *   touching the imp-96311 cross-column E_coll ratio law, only imp-96327 (N = 1e4,
 *   the single INDEPENDENTLY baked imp-96290 pair) is a genuine independent cross-
 *   check. The two imp-96349 second anchors,
 *
 *       SECOND ANCHOR A: N = 1e6, same C_H pair {0.125, 0.127},
 *       SECOND ANCHOR B: N = 1e4, distinct C_H pair {0.127, 1.0},
 *
 *   are RECONSTRUCTED from E_coll = C_H * R(N) and then re-rounded to 6 sig figs,
 *   so their UNROUNDED ratios equal C_H_b / C_H_a exactly (residual 0) by
 *   construction. This module measures, for each reconstructed anchor, the exact
 *   reconstructed ratio, the stored (6-sig-fig) ratio, and their residual, and
 *   bounds each residual against the relative re-rounding floor implied by 6-sig-
 *   fig storage.
 *
 *   THE RE-ROUNDING FLOOR (honest form). Storing a value x to 6 significant
 *   figures introduces an absolute half-ULP 0.5 * 10^(floor(log10|x|) - 5), i.e.
 *   a RELATIVE half-ULP that ranges from ~0.5e-6 (leading digit 9) to ~5e-6
 *   (leading digit 1). The flat "~5e-7" figure quoted informally is only the
 *   optimistic single-operand end. A RATIO of two 6-sig-fig operands therefore
 *   carries a relative floor equal to the SUM of the two per-operand relative
 *   half-ULPs, operand-specific rather than a flat constant.
 *
 *   MEASUREMENT (recomputed from the imp-96349 single source of truth):
 *
 *   SECOND ANCHOR A (N = 1e6, {0.125, 0.127}): exact reconstructed ratio 1.016,
 *   stored 6-sig-fig ratio 1.01600171, relative residual +1.68e-6. Per-operand
 *   relative half-ULPs 3.82e-6 and 3.76e-6 -> summed ratio floor 7.58e-6. The
 *   residual is 0.22x the honest floor: comfortably inside.
 *
 *   SECOND ANCHOR B (N = 1e4, {0.127, 1.0}): exact reconstructed ratio 7.874016,
 *   stored 6-sig-fig ratio 7.873981, relative residual -4.39e-6. Per-operand
 *   relative half-ULPs 4.52e-6 (0.0110547, leading digit 1) and 5.74e-7
 *   (0.0870445, leading digit 8) -> summed ratio floor 5.10e-6. The residual is
 *   0.86x the honest floor: inside, but riding near it because the 0.127 column
 *   sits at the worst-case leading-digit-1 end of 6-sig-fig storage.
 *
 *   VERDICT. Both reconstructed-anchor residuals are (a) EXACTLY zero before
 *   re-rounding (unrounded ratio = C_H_b/C_H_a to machine precision) and (b) at
 *   or below their operand-specific 6-sig-fig ratio floor after re-rounding. They
 *   carry NO information beyond the storage grid and are NOT independent
 *   corroboration -- confirming imp-96380. NOTE the honesty flag: against a FLAT
 *   5e-7 floor, BOTH second anchors (1.68e-6 and 4.39e-6) would appear to EXCEED;
 *   that flat figure is the optimistic single-operand end, and the correct
 *   operand-specific floors (7.58e-6 and 5.10e-6) are the ones that actually bound
 *   them.
 *
 *   ACCURACY AUDIT ONLY. Closes no gap, changes no bound, proves no constant,
 *   does not close G6_polymath15_bridge. The conditional bound C_H <= 0.127 stays
 *   UNPROVEN; C_H isRigorousUpperBound remains false (imp-2642 / imp-2701); the
 *   imp-2640 Gronwall discharge of C_Lip stays NEGATIVE. RH remains open. NO QED.
 *
 * Provenance of baked inputs (single sources of truth, cited not re-derived):
 *   - imp-96349-ecoll-ratio-law-second-anchor-crossvalidation.js: the two
 *     RECONSTRUCTED second anchors (values, stored ratios, exact-by-construction
 *     residuals) whose re-rounding floors this module bounds.
 *   - imp-96380-ecoll-anchor-independence-subgap-crossref.js: the assertion that
 *     the imp-96349 second anchors are re-rounding-floor artifacts, not
 *     independent evidence -- the claim this module bounds numerically.
 *
 * Syntax note: this header avoids the close-comment terminator sequence inside
 *   prose; relative-ULP quantities are written as ratio-floor, not a fraction.
 */

import { IMP96349_ECOLL_RATIO_LAW_SECOND_ANCHOR } from './imp-96349-ecoll-ratio-law-second-anchor-crossvalidation.js';

// Relative half-ULP of a value stored to 6 significant figures: absolute
// half-ULP 0.5 * 10^(floor(log10|x|) - 5) divided by |x|. Ranges over
// [~0.5e-6, ~5e-6] as the leading significant digit runs 9 -> 1.
function relHalfUlp6(x) {
  const exp = Math.floor(Math.log10(Math.abs(x)));
  const absHalf = 0.5 * Math.pow(10, exp - 5);
  return absHalf / Math.abs(x);
}

// The informal flat "~5e-7" re-rounding floor cited in the imp-96473 task: the
// OPTIMISTIC single-operand relative half-ULP (leading digit ~9). Retained only
// to flag that it is anti-conservative for a two-operand ratio.
const FLAT_FLOOR = 5e-7;

// Bound one imp-96349 reconstructed anchor against the 6-sig-fig storage floor.
function boundAnchor(anchor, label) {
  const exactReconstructedRatio = anchor.C_H_b / anchor.C_H_a; // unrounded == target
  const storedRatio = anchor.anchorRatio; // ratio of the 6-sig-fig re-stored values
  const absResidual = storedRatio - exactReconstructedRatio;
  const relResidual = absResidual / exactReconstructedRatio;
  const relA = relHalfUlp6(anchor.valA);
  const relB = relHalfUlp6(anchor.valB);
  const ratioRelFloor = relA + relB; // honest operand-specific ratio floor
  return {
    label,
    N: anchor.N,
    C_H_a: anchor.C_H_a,
    C_H_b: anchor.C_H_b,
    valA: anchor.valA,
    valB: anchor.valB,
    exactReconstructedRatio,
    storedRatio,
    absResidual,
    relResidual,
    exactResidualByConstruction: anchor.exactResidual, // 0 to machine precision
    relHalfUlpA: relA,
    relHalfUlpB: relB,
    ratioRelFloor,
    residualOverFloor: Math.abs(relResidual) / ratioRelFloor,
    withinOperandFloor: Math.abs(relResidual) <= ratioRelFloor,
    withinFlatFloor: Math.abs(relResidual) <= FLAT_FLOOR,
  };
}

const ANCHOR_A = boundAnchor(
  IMP96349_ECOLL_RATIO_LAW_SECOND_ANCHOR.secondAnchorA,
  'second anchor A (N = 1e6, {0.125, 0.127})',
);
const ANCHOR_B = boundAnchor(
  IMP96349_ECOLL_RATIO_LAW_SECOND_ANCHOR.secondAnchorB,
  'second anchor B (N = 1e4, {0.127, 1.0})',
);

export const IMP96473_ECOLL_SECOND_ANCHOR_REROUNDING_FLOOR = {
  id: 'imp-96473',
  title:
    'Re-rounding-floor bound of the two imp-96349 reconstructed second E_coll ' +
    'anchors: each measured residual sits at or below its operand-specific ' +
    '6-sig-fig storage floor and carries no independent information (imp-96380)',
  kind: 'measurement / accuracy audit (no closure, no bound change)',
  flatFloorCited: FLAT_FLOOR,
  anchorA: ANCHOR_A,
  anchorB: ANCHOR_B,
  floorRule:
    'A value stored to 6 sig figs carries relative half-ULP in [~0.5e-6, ~5e-6] ' +
    '(leading digit 9 -> 1). A ratio of two such operands carries a relative ' +
    'floor = relHalfUlp(a) + relHalfUlp(b), operand-specific, NOT a flat 5e-7.',
  measurement: {
    anchorA:
      'Second anchor A: exact reconstructed ratio ' +
      ANCHOR_A.exactReconstructedRatio.toFixed(6) +
      ', stored 6-sig-fig ratio ' +
      ANCHOR_A.storedRatio.toFixed(8) +
      ', relative residual ' +
      ANCHOR_A.relResidual.toExponential(3) +
      ' vs operand floor ' +
      ANCHOR_A.ratioRelFloor.toExponential(3) +
      ' (' +
      ANCHOR_A.residualOverFloor.toFixed(2) +
      'x floor). Unrounded residual ' +
      ANCHOR_A.exactResidualByConstruction.toExponential(1) +
      ' by construction.',
    anchorB:
      'Second anchor B: exact reconstructed ratio ' +
      ANCHOR_B.exactReconstructedRatio.toFixed(6) +
      ', stored 6-sig-fig ratio ' +
      ANCHOR_B.storedRatio.toFixed(6) +
      ', relative residual ' +
      ANCHOR_B.relResidual.toExponential(3) +
      ' vs operand floor ' +
      ANCHOR_B.ratioRelFloor.toExponential(3) +
      ' (' +
      ANCHOR_B.residualOverFloor.toFixed(2) +
      'x floor). Unrounded residual ' +
      ANCHOR_B.exactResidualByConstruction.toExponential(1) +
      ' by construction. Rides near the floor because the 0.127 column sits at ' +
      'the worst-case leading-digit-1 end of 6-sig-fig storage.',
    flatFloorFlag:
      'Against the informal FLAT ' +
      FLAT_FLOOR.toExponential(0) +
      ' floor, NEITHER anchor is within (A ' +
      ANCHOR_A.withinFlatFloor +
      ' at ' +
      Math.abs(ANCHOR_A.relResidual).toExponential(2) +
      ', B ' +
      ANCHOR_B.withinFlatFloor +
      ' at ' +
      Math.abs(ANCHOR_B.relResidual).toExponential(2) +
      '): both exceed 5e-7. That flat figure is the optimistic single-operand ' +
      'end; the correct operand-specific floors (7.58e-6 and 5.10e-6) are the ' +
      'ones that actually bound both residuals.',
  },
  verdict:
    'RE-ROUNDING-FLOOR BOUND COMPLETE. Both imp-96349 reconstructed second ' +
    'anchors have UNROUNDED ratios equal to C_H_b/C_H_a to machine precision ' +
    '(residual 0 by construction) and post-rounding relative residuals AT OR ' +
    'BELOW their operand-specific 6-sig-fig ratio floors (' +
    ANCHOR_A.residualOverFloor.toFixed(2) +
    'x and ' +
    ANCHOR_B.residualOverFloor.toFixed(2) +
    'x). They carry no information beyond the storage grid and are NOT ' +
    'independent corroboration, confirming imp-96380 -- with the honesty flag ' +
    'that the flat ~5e-7 floor is anti-conservative for a two-operand ratio and ' +
    'the operand-specific floor is required. Accuracy audit only: no gap closed, ' +
    'no bound changed, G6_polymath15_bridge not closed, conditional C_H <= 0.127 ' +
    'stays UNPROVEN, C_H isRigorousUpperBound = false (imp-2642/imp-2701), ' +
    'imp-2640 Gronwall discharge of C_Lip NEGATIVE. RH open. NO QED.',
  provenance:
    'imp-96349-ecoll-ratio-law-second-anchor-crossvalidation.js (the two ' +
    'reconstructed second anchors); imp-96380-ecoll-anchor-independence-subgap-' +
    'crossref.js (the artifact-not-evidence assertion bounded here).',
};

export const IMP96473_ECOLL_SECOND_ANCHOR_REROUNDING_FLOOR_ASSERTIONS = [
  {
    id: 'imp96473-anchor-a-within-operand-floor',
    holds: () => ANCHOR_A.withinOperandFloor && ANCHOR_A.residualOverFloor < 1,
    why:
      'Second anchor A post-rounding relative residual must sit below its ' +
      'operand-specific 6-sig-fig ratio floor (sum of the two relative half-ULPs), ' +
      'confirming it is a storage artifact carrying no independent information.',
  },
  {
    id: 'imp96473-anchor-b-within-operand-floor',
    holds: () => ANCHOR_B.withinOperandFloor && ANCHOR_B.residualOverFloor < 1,
    why:
      'Second anchor B post-rounding relative residual must sit below its ' +
      'operand-specific ratio floor even though it rides near it (the 0.127 ' +
      'column is at the worst-case leading-digit-1 end of 6-sig-fig storage).',
  },
  {
    id: 'imp96473-both-anchors-exact-by-construction',
    holds: () =>
      Math.abs(ANCHOR_A.exactResidualByConstruction) < 1e-12 &&
      Math.abs(ANCHOR_B.exactResidualByConstruction) < 1e-12,
    why:
      'The unrounded reconstructed ratios must equal C_H_b/C_H_a to machine ' +
      'precision, so the measured residuals are pure re-rounding-floor artifacts ' +
      'and the anchors are not independent evidence (imp-96380).',
  },
  {
    id: 'imp96473-flat-floor-is-anti-conservative',
    holds: () => ANCHOR_B.withinFlatFloor === false,
    why:
      'The honesty flag: anchor B (relative residual 4.39e-6) EXCEEDS the flat ' +
      '5e-7 floor, so the flat figure is anti-conservative for a two-operand ' +
      'ratio and the operand-specific floor is the correct bound.',
  },
  {
    id: 'imp96473-no-closure-c-h-still-open',
    holds: () =>
      /no gap closed|NO QED|no bound changed/i.test(
        IMP96473_ECOLL_SECOND_ANCHOR_REROUNDING_FLOOR.verdict,
      ) &&
      IMP96473_ECOLL_SECOND_ANCHOR_REROUNDING_FLOOR.kind.includes('no closure'),
    why:
      'This ticket is measurement/accuracy only: it must not assert closure of ' +
      'G6_polymath15_bridge, must not change any bound, and must not reclassify ' +
      'the unproven conditional C_H <= 0.127 as rigorous.',
  },
];
