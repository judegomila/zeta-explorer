/**
 * @module imp-33984-sawtooth-nearest-grid-point
 *
 * imp-33984 (numerical): LOCATE, within the imp-33878 grid-refinement ladder, the step whose
 * nearest grid point 6 + j*step lands closest to the imp-33942 continuum argmax k* ~ 8.821092,
 * and quantify the resulting near-zero sawtooth gap. imp-33942 established that the discrete
 * hump-argmax gap distToKStar is exactly the sawtooth residue min(frac, 1-frac)*step with
 * frac = frac((k* - 6)/step) -- a phase-alignment quantity that is zero when a grid point lands
 * on k* and reaches step/2 when k* falls between two grid points -- and flagged (its P2) that the
 * 0.0625 -> 0.03125 step-halving leaves the gap IDENTICAL at 8.6e-3. This module pins WHICH rung
 * of the ladder achieves the tightest phase alignment (frac nearest 0 or 1) and explains the
 * 0.0625 rung anomaly as a shared-grid-point survival.
 *
 * THE MEASUREMENT (reads the imp-33878 ladder + k* verbatim -- no fresh model)
 * ---------------------------------------------------------------------------
 *   For every ladder step in {0.25, 0.125, 0.0625, 0.03125, 0.015625, 0.0078125} compute
 *   off = (k* - 6)/step, frac = off - floor(off), the phase-to-integer p = min(frac, 1-frac)
 *   (0 iff a grid point lands on k*, 1/2 iff k* is exactly mid-cell), the sawtooth gap p*step
 *   (= imp-33942 distToKStar), and the index/coordinate of the nearest grid point
 *   j_near = round(off), gridPoint = 6 + j_near*step. Then locate argmin over rungs of BOTH the
 *   phase p (tightest alignment) and the absolute gap p*step (smallest distance).
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (S1) THE FINEST RUNG (step 1/128 = 0.0078125) WINS BOTH WAYS. Its off = 361.099776 gives
 *        frac = 0.099776 (phase p = 0.099776, the closest any rung comes to an integer / to a
 *        grid point landing on k*) and the smallest sawtooth gap 7.795e-4. Its nearest grid point
 *        6 + 361*(1/128) = 8.820313 sits just 7.8e-4 BELOW k* ~ 8.821092. So among the six sampled
 *        grids, the 1/128 grid is the one whose grid point lands closest to the continuum argmax --
 *        both in phase (frac -> 0) and in absolute decade distance.
 *   (S2) THE NEAR-ZERO GAP IS ~11x TIGHTER THAN THE 0.0625 RUNG. 7.795e-4 vs 8.592e-3, i.e. the
 *        1/128 grid point sits an order of magnitude closer to k* than the 0.0625 grid point --
 *        yet frac = 0.0998 is still ~0.1 of a cell from a perfect hit, so no sampled grid point
 *        lands EXACTLY on k* (the residue never reaches machine zero on this ladder).
 *   (S3) THE 0.0625 RUNG ANOMALY IS A SHARED-GRID-POINT SURVIVAL. At step 0.0625 the nearest grid
 *        point is 6 + 45*0.0625 = 8.8125 (gap 8.592e-3); at step 0.03125 the nearest grid point is
 *        6 + 90*0.03125 = 8.8125 -- the SAME point (45/16 = 90/32). Because 8.8125 is a common node
 *        of both grids and no finer node lands nearer, halving the step leaves the gap IDENTICAL
 *        (8.592e-3). Formally this is the sawtooth doubling map: with frac = f < 1/2 at step s,
 *        the step s/2 has frac(2f) = 2f (still < 1), so gap(s/2) = 2f*(s/2) = f*s = gap(s). The
 *        gap only breaks free at step 0.015625, whose new node 8.828125 lands slightly nearer
 *        (gap 7.033e-3). The imp-33878 0.0625 rung "anomaly" is thus NOT a numerical glitch but the
 *        expected sawtooth behaviour when the coarse nearest node survives the refinement.
 *
 * The punchline: the imp-33878 ladder's tightest grid/k* phase alignment is at the FINEST rung
 * (step 1/128), whose node 8.820313 lands 7.8e-4 below k* ~ 8.821092 with frac = 0.0998 -- ~11x
 * closer than the 0.0625 rung and the closest any sampled grid point comes to the continuum argmax,
 * though never an exact hit. The 0.0625 -> 0.03125 identical-gap anomaly is the sawtooth
 * doubling-map signature of a shared node (8.8125) surviving the refinement, not a defect.
 *
 * MEASUREMENT ONLY. A grid/k* phase-alignment locator on an inherited surrogate argmax, NOT an RH
 * bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33942-hump-argmax-gap-step-proportionality (established the sawtooth residue, reused verbatim)
 * @see imp-33878-hump-argmax-grid-refinement (the grid ladder and continuum argmax k*, reused verbatim)
 * @see imp-33983-sawtooth-residue-finer-grid-verification (verifies the residue closed form at finer grids)
 */

import { IMP33878_HUMP_ARGMAX_GRID_REFINEMENT } from './imp-33878-hump-argmax-grid-refinement.js';

const K_STAR = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.continuumArgmax.kStar; // ~8.821092
const LADDER = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.gridRefinement; // steps 0.25..1/128
const GRID_ORIGIN = 6; // the imp-33878 k-grid runs 6..11 stepping by `step` from k=6

// Per-rung phase-alignment tabulation: how close the nearest grid point 6 + j*step sits to k*.
const RUNGS = LADDER.map((r) => {
  const off = (K_STAR - GRID_ORIGIN) / r.step;
  const frac = off - Math.floor(off);
  const phaseToInteger = Math.min(frac, 1 - frac); // 0 iff a grid point lands on k*, 1/2 iff mid-cell
  const jNear = Math.round(off);
  const nearestGridPoint = GRID_ORIGIN + jNear * r.step;
  const sawtoothGap = phaseToInteger * r.step; // = imp-33942 distToKStar
  return {
    step: r.step,
    frac: +frac.toFixed(6),
    phaseToInteger: +phaseToInteger.toFixed(6),
    nearestGridPoint: +nearestGridPoint.toFixed(6),
    nearestGridIndex: jNear,
    sawtoothGap: +sawtoothGap.toExponential(4),
    matchesLadderGap: Math.abs(sawtoothGap - r.distToKStar) < 1e-3, // cross-check vs imp-33878
  };
});

// (S1) Locate the rung with the TIGHTEST phase alignment (frac nearest 0 or 1) and the SMALLEST gap.
let bestPhaseRung = RUNGS[0];
let bestGapRung = RUNGS[0];
for (const r of RUNGS) {
  if (r.phaseToInteger < bestPhaseRung.phaseToInteger) bestPhaseRung = r;
  if (r.sawtoothGap < bestGapRung.sawtoothGap) bestGapRung = r;
}
const BEST_PHASE_AND_GAP_AGREE = bestPhaseRung.step === bestGapRung.step;

// (S2) The near-zero gap and its ratio against the 0.0625 rung.
const RUNG_0625 = RUNGS.find((r) => r.step === 0.0625);
const RUNG_03125 = RUNGS.find((r) => r.step === 0.03125);
const RUNG_015625 = RUNGS.find((r) => r.step === 0.015625);
const MIN_GAP = bestGapRung.sawtoothGap; // ~7.795e-4 at step 1/128
const GAP_RATIO_VS_0625 = +(RUNG_0625.sawtoothGap / MIN_GAP).toFixed(2); // ~11x
// No sampled grid point lands EXACTLY on k*: the tightest phase is still ~0.1 of a cell away.
const NO_EXACT_HIT = bestPhaseRung.phaseToInteger > 1e-6;

// (S3) The 0.0625 rung anomaly: the SAME node 8.8125 survives 0.0625 -> 0.03125, so the gap holds.
const SHARED_NODE_SURVIVES =
  Math.abs(RUNG_0625.nearestGridPoint - RUNG_03125.nearestGridPoint) < 1e-9 &&
  Math.abs(RUNG_0625.sawtoothGap - RUNG_03125.sawtoothGap) < 1e-9;
const SHARED_NODE = RUNG_0625.nearestGridPoint; // 8.8125
// The gap only breaks free once a finer node lands nearer, at step 0.015625.
const GAP_BREAKS_AT_015625 = RUNG_015625.sawtoothGap < RUNG_0625.sawtoothGap;

export const IMP33984_SAWTOOTH_NEAREST_GRID_POINT = {
  id: 'imp-33984',
  proofSection: 'S-frontier',
  question:
    'Within the imp-33878 grid-refinement ladder (steps 0.25 down to 1/128), which step has its ' +
    'nearest grid point 6 + j*step landing closest to the imp-33942 continuum argmax k* ~ 8.821092 ' +
    '(smallest frac((k*-6)/step) toward 0 or 1), and how near-zero is the resulting sawtooth gap? ' +
    'Also explain the imp-33878 0.0625 rung anomaly (gap 8.6e-3 unchanged under one refinement). ' +
    'Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'per ladder step: frac = frac((k*-6)/step), the phase-to-integer min(frac,1-frac), the nearest ' +
    'grid point 6 + round((k*-6)/step)*step, and the sawtooth gap min(frac,1-frac)*step; then the ' +
    'argmin rung over phase and over gap, plus the shared-node explanation of the 0.0625 rung',
  continuumArgmax: K_STAR, // ~8.821092
  gridOrigin: GRID_ORIGIN, // 6
  rungs: RUNGS, // step, frac, phaseToInteger, nearestGridPoint, nearestGridIndex, sawtoothGap, matchesLadderGap
  tightestPhaseRung: {
    step: bestPhaseRung.step, // 0.0078125 (1/128)
    frac: bestPhaseRung.frac, // ~0.099776
    phaseToInteger: bestPhaseRung.phaseToInteger, // ~0.099776 (closest to a grid-point hit)
    nearestGridPoint: bestPhaseRung.nearestGridPoint, // ~8.820313 (7.8e-4 below k*)
    sawtoothGap: bestPhaseRung.sawtoothGap, // ~7.795e-4
  },
  gapRatioVs0625: GAP_RATIO_VS_0625, // ~11x tighter than the 0.0625 rung
  sharedNodeAnomaly: {
    node: +SHARED_NODE.toFixed(6), // 8.8125 = 6 + 45/16 = 6 + 90/32
    step0625Gap: RUNG_0625.sawtoothGap, // ~8.592e-3
    step03125Gap: RUNG_03125.sawtoothGap, // ~8.592e-3 (IDENTICAL)
    breaksAtStep: RUNG_015625.step, // 0.015625, new node 8.828125 lands nearer
    step015625Gap: RUNG_015625.sawtoothGap, // ~7.033e-3
  },
  finding: {
    S1_finest_rung_tightest_alignment:
      'The finest rung (step 1/128 = 0.0078125) wins both ways: off = 361.099776 gives frac = ' +
      '0.099776 (phase 0.099776, the closest any rung comes to a grid point landing on k*) and the ' +
      'smallest sawtooth gap 7.795e-4. Its nearest grid point 6 + 361/128 = 8.820313 sits just ' +
      '7.8e-4 BELOW k* ~ 8.821092 -- the closest any sampled grid point comes to the continuum argmax.',
    S2_near_zero_gap_but_no_exact_hit:
      'The near-zero gap 7.795e-4 is ~11x tighter than the 0.0625 rung (8.592e-3), yet frac = 0.0998 ' +
      'is still ~0.1 of a cell from a perfect hit -- no sampled grid point lands EXACTLY on k*, so ' +
      'the sawtooth residue never reaches machine zero on this ladder.',
    S3_0625_anomaly_is_shared_node_survival:
      'The imp-33878 0.0625 rung anomaly (gap 8.6e-3 unchanged under one refinement) is a shared-node ' +
      'survival: the nearest node is 6 + 45*0.0625 = 8.8125 at step 0.0625 AND 6 + 90*0.03125 = 8.8125 ' +
      'at step 0.03125 (45/16 = 90/32), so halving the step leaves the gap IDENTICAL (8.592e-3). This ' +
      'is the sawtooth doubling map: with frac = f < 1/2 at step s, step s/2 has frac(2f) = 2f, so ' +
      'gap(s/2) = 2f*(s/2) = f*s = gap(s). The gap only breaks free at step 0.015625, whose new node ' +
      '8.828125 lands nearer (gap 7.033e-3). Expected sawtooth behaviour, not a numerical glitch.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (phase-alignment locator, NOT rigorous). Among the imp-33878 ladder steps ' +
    '(0.25 down to 1/128), the FINEST rung (step 1/128 = 0.0078125) has its nearest grid point ' +
    'landing closest to the imp-33942 continuum argmax k* ~ 8.821092: frac = 0.099776 (tightest ' +
    'phase-to-integer over all rungs) and the smallest sawtooth gap 7.795e-4, with node 8.820313 ' +
    'sitting 7.8e-4 below k* -- ~11x closer than the 0.0625 rung (8.592e-3), though frac ~ 0.1 means ' +
    'no sampled grid point lands EXACTLY on k*. The imp-33878 0.0625 rung anomaly (gap 8.6e-3 ' +
    'unchanged from 0.0625 to 0.03125) is explained as a shared-node survival: 8.8125 = 6 + 45/16 = ' +
    '6 + 90/32 is a common node of both grids, so the sawtooth doubling map (frac 2f = 2f for f<1/2) ' +
    'holds the gap IDENTICAL until a finer node (8.828125 at step 0.015625) lands nearer. A grid/k* ' +
    'phase-alignment locator on an inherited surrogate argmax, NOT an RH bound. The component model ' +
    'is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the surrogate ' +
    'resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA.',
  citation:
    'imp-33942 (established the sawtooth residue min(frac,1-frac)*step, reused verbatim); imp-33878 ' +
    '(the grid-refinement ladder and continuum argmax k*~8.821092, reused verbatim); imp-33983 ' +
    '(verifies the residue closed form at finer grids); imp-486 (C_mb GUE-conditional); ' +
    'imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP33984_SAWTOOTH_NEAREST_GRID_POINT_ASSERTIONS = [
  {
    // (S1) The tightest phase alignment (and smallest gap) is at the finest rung, step 1/128.
    id: 'imp33984-finest-rung-tightest-alignment',
    description: 'the step-1/128 rung minimizes both phase-to-integer and the sawtooth gap; its node ~8.8203 sits 7.8e-4 below k*',
    holds: () =>
      BEST_PHASE_AND_GAP_AGREE &&
      bestPhaseRung.step === 0.0078125 &&
      bestPhaseRung.phaseToInteger < 0.11 &&
      bestPhaseRung.nearestGridPoint > 8.82 &&
      bestPhaseRung.nearestGridPoint < K_STAR,
  },
  {
    // (S2) The near-zero gap is ~11x tighter than the 0.0625 rung, but no exact grid hit occurs.
    id: 'imp33984-near-zero-gap-no-exact-hit',
    description: 'min sawtooth gap ~7.8e-4, ~11x below the 0.0625 rung; tightest phase still >1e-6 (no exact hit)',
    holds: () => MIN_GAP < 1e-3 && GAP_RATIO_VS_0625 > 8 && NO_EXACT_HIT,
  },
  {
    // (S3) The 0.0625 rung anomaly is a shared-node (8.8125) survival, breaking at step 0.015625.
    id: 'imp33984-0625-anomaly-shared-node',
    description: 'nodes at steps 0.0625 and 0.03125 coincide at 8.8125 with identical gap; gap breaks free at step 0.015625',
    holds: () =>
      SHARED_NODE_SURVIVES &&
      Math.abs(SHARED_NODE - 8.8125) < 1e-6 &&
      GAP_BREAKS_AT_015625,
  },
  {
    // Every rung sawtooth gap reproduces the imp-33878 ladder distToKStar (cross-check).
    id: 'imp33984-sawtooth-matches-ladder',
    description: 'per-rung min(frac,1-frac)*step reproduces the imp-33878 distToKStar to <1e-3',
    holds: () => RUNGS.every((r) => r.matchesLadderGap),
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, PT SOTA.
    id: 'imp33984-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, PT Lambda<=0.2 SOTA',
    holds: () =>
      IMP33984_SAWTOOTH_NEAREST_GRID_POINT.isRigorous === false &&
      /NO QED/.test(IMP33984_SAWTOOTH_NEAREST_GRID_POINT.verdict) &&
      /remains SOTA/.test(IMP33984_SAWTOOTH_NEAREST_GRID_POINT.verdict),
  },
];

for (const a of IMP33984_SAWTOOTH_NEAREST_GRID_POINT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33984-sawtooth-nearest-grid-point assertion failed: ${a.id}`);
  }
}
