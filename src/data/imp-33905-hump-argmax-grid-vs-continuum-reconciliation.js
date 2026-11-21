/**
 * @module imp-33905-hump-argmax-grid-vs-continuum-reconciliation
 *
 * imp-33905 (accuracy): RECONCILE the two finer-grid hump-argmax readings. The
 * imp-33896 decade-label consistency audit records k = 8.75 (resid 6.5245e-2) as
 * the "sub-integer quarter-decade peak" of the M3 saturation-curvature hump,
 * while imp-33878 Richardson/ternary-refines the SAME sliding-window resid_exp(k)
 * argmax to a continuum limit k* ~ 8.821 (resid 6.5337e-2). Are these the same
 * argmax at two grid resolutions, or a genuine ~0.07-decade discrepancy?
 *
 * THE RECONCILIATION (reads the two published data objects -- no fresh model)
 * -------------------------------------------------------------------------
 *   This module imports the imp-33878 grid-refinement result and the imp-33896
 *   audit result and places both on a common grid-spacing axis. It uses ONLY the
 *   already-computed exported values (imp-33878 reuses the imp-33810 component
 *   model verbatim; imp-33896 is import-free), so it introduces no new derivation
 *   and no new model -- it is a pure cross-reading reconciliation.
 *
 * THE FINDING (accuracy reconciliation only -- SAME argmax at two resolutions)
 * --------------------------------------------------------------------------
 *   (R1) k = 8.75 IS the imp-33878 quarter-decade rung, not an independent reading.
 *        imp-33896 quarterDecadePeakK = 8.75 and quarterDecadePeakValue = 6.5245e-2
 *        equal imp-33878 gridRefinement[step = 0.25] argmaxK = 8.75 and
 *        residAtArgmax = 6.5245e-2 to machine precision. Both are the SAME
 *        sliding-window resid_exp(k) = p_ecoll(1 - sigma_hi) - p_sigma argmax on the
 *        SAME imp-33810 model, sampled on the SAME quarter-decade (step = 0.25) grid.
 *   (R2) THE ~0.07-DECADE GAP IS THE step = 0.25 GRID-DISCRETIZATION DISTANCE, NOT A
 *        GENUINE DISCREPANCY. k* - k_qd = 8.821092 - 8.75 = 0.07109 decade equals the
 *        imp-33878 recorded distToKStar at step = 0.25 (0.07109) exactly. It is
 *        bounded by the grid step (0.07109 < 0.25) and shrinks monotonically as the
 *        grid refines (imp-33878 G2: 0.25 -> 0.071, 0.125 -> 0.054, 0.0625 -> 8.6e-3,
 *        ..., 1/128 -> 7.8e-4), i.e. it vanishes in the continuum limit -- the
 *        signature of a discretization distance, not a competing feature.
 *   (R3) THE TWO RESID VALUES AGREE TO ~0.14% -- ONE BROAD PEAK, NOT TWO. The hump
 *        amplitude at k = 8.75 (6.5245e-2) and at k* (6.5337e-2) differ by only
 *        9.2e-5 (~0.14% of the peak), consistent with both sampling a single broad
 *        quadratic maximum (imp-33878 resid double-prime(k*) ~ -3.6e-2). There is no
 *        second argmax; the quarter-decade snapshot merely undershoots the continuum.
 *   (R4) THE CONTINUUM SITS BETWEEN k = 8.75 AND k = 9. imp-33896 framed k = 8.75 as
 *        a -0.25-decade nudge BELOW the integer label k = 9; imp-33878 shows the true
 *        limit k* ~ 8.821 lies between them -- the quarter-decade snapshot undershoots
 *        it by 0.071 and the integer label overshoots it by 0.179. The quarter-decade
 *        grid does NOT land on the continuum argmax; it is one rung short of it.
 *
 * The punchline: the imp-33896 k = 8.75 reading and the imp-33878 k* ~ 8.821 reading
 * are the SAME sliding-window resid_exp(k) argmax at two grid resolutions -- the
 * quarter-decade discrete snapshot and its continuum (grid-step -> 0) limit. The
 * ~0.07-decade offset between them is precisely the imp-33878 step = 0.25 distToKStar,
 * a grid-discretization distance that shrinks toward zero as the grid refines, NOT a
 * genuine two-reading discrepancy. This is an accuracy reconciliation only.
 *
 * MEASUREMENT/RECONCILIATION ONLY. Reads two inherited surrogate readings, NOT an RH
 * bound. The component model behind both is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the surrogate resid_exp(k) is descriptive,
 * not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33878-hump-argmax-grid-refinement (the continuum argmax k*~8.821 and the grid ladder)
 * @see imp-33896-decade-label-consistency-audit (the quarter-decade k=8.75 reading)
 * @see imp-33902-hump-argmax-convergence-rate (Richardson limit k*_R~8.821091 cross-check)
 * @see imp-33857-hump-peak-widening-crossvalidation (X3 booked the discretization offset)
 */

import { IMP33878_HUMP_ARGMAX_GRID_REFINEMENT } from './imp-33878-hump-argmax-grid-refinement.js';
import { DECADE_LABEL_CONSISTENCY_AUDIT } from './imp-33896-decade-label-consistency-audit.js';

// The imp-33878 continuum argmax (ternary) and the quarter-decade (step=0.25) rung.
const K_STAR = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.continuumArgmax.kStar; // ~8.821092
const RESID_AT_KSTAR = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.continuumArgmax.residAtKStar; // ~6.5337e-2
const QUARTER_RUNG = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.gridRefinement.find(
  (r) => r.step === 0.25,
); // { step:0.25, argmaxK:8.75, residAtArgmax:0.065245, distToKStar:0.07109 }

// The imp-33896 published quarter-decade reading.
const AUDIT_QD_K = DECADE_LABEL_CONSISTENCY_AUDIT.quarterDecadePeakK; // 8.75
const AUDIT_QD_VALUE = DECADE_LABEL_CONSISTENCY_AUDIT.quarterDecadePeakValue; // 6.5245e-2
const INTEGER_LABEL_K = DECADE_LABEL_CONSISTENCY_AUDIT.integerDecadePeakK; // 9

// (R1) The imp-33896 k=8.75 reading IS the imp-33878 step=0.25 rung (same argmax, same grid).
const SAME_ARGMAX_K = AUDIT_QD_K === QUARTER_RUNG.argmaxK; // true
const SAME_RESID_VALUE = Math.abs(AUDIT_QD_VALUE - QUARTER_RUNG.residAtArgmax) < 1e-9; // true

// (R2) The ~0.07-decade gap is exactly the imp-33878 step=0.25 distToKStar (a grid distance).
const GAP_KSTAR_MINUS_QD = +(K_STAR - AUDIT_QD_K).toFixed(6); // ~0.071092
const GAP_MATCHES_DIST_TO_KSTAR =
  Math.abs(GAP_KSTAR_MINUS_QD - QUARTER_RUNG.distToKStar) < 5e-5; // true (both ~0.07109)
const GAP_BOUNDED_BY_STEP = GAP_KSTAR_MINUS_QD < QUARTER_RUNG.step; // 0.071 < 0.25

// (R3) The two resid amplitudes agree to ~0.14% -- one broad peak.
const RESID_ABS_GAP = +(RESID_AT_KSTAR - AUDIT_QD_VALUE).toExponential(4); // ~9.2e-5
const RESID_REL_GAP_PCT = +((RESID_ABS_GAP / RESID_AT_KSTAR) * 100).toFixed(3); // ~0.141%

// (R4) The continuum argmax sits BETWEEN the quarter-decade snapshot and the integer label.
const KSTAR_BETWEEN_QD_AND_INTEGER = AUDIT_QD_K < K_STAR && K_STAR < INTEGER_LABEL_K; // 8.75<8.821<9
const INTEGER_MINUS_KSTAR = +(INTEGER_LABEL_K - K_STAR).toFixed(6); // ~0.178908

export const IMP33905_HUMP_ARGMAX_GRID_VS_CONTINUUM_RECONCILIATION = {
  id: 'imp-33905',
  proofSection: 'S-frontier',
  question:
    'imp-33896 records k=8.75 (6.5245e-2) as the sub-integer quarter-decade hump peak while imp-33878 ' +
    'refines the same sliding-window resid_exp(k) argmax to a continuum limit k*~8.821 (6.5337e-2). ' +
    'Are these the same argmax at two grid resolutions, or a genuine ~0.07-decade discrepancy? ' +
    'Accuracy reconciliation only; NOT an RH bound; no QED.',
  commonGridSpacingAxis: {
    quarterDecadeReading: {
      source: 'imp-33896 (= imp-33878 gridRefinement step=0.25 rung)',
      gridStep: QUARTER_RUNG.step, // 0.25
      argmaxK: AUDIT_QD_K, // 8.75
      residAtArgmax: AUDIT_QD_VALUE, // 6.5245e-2
      distToContinuum: QUARTER_RUNG.distToKStar, // ~0.07109
    },
    continuumReading: {
      source: 'imp-33878 (ternary, grid step -> 0)',
      gridStep: 0,
      argmaxK: K_STAR, // ~8.821092
      residAtArgmax: RESID_AT_KSTAR, // ~6.5337e-2
      distToContinuum: 0,
    },
  },
  reconciliation: {
    R1_same_argmax_same_grid: {
      sameArgmaxK: SAME_ARGMAX_K,
      sameResidValue: SAME_RESID_VALUE,
      note:
        'imp-33896 k=8.75 / 6.5245e-2 equals the imp-33878 step=0.25 rung to machine precision -- ' +
        'the SAME resid_exp(k) argmax on the SAME model at the SAME quarter-decade grid, not an ' +
        'independent reading.',
    },
    R2_gap_is_grid_distance: {
      gap_kStar_minus_qd: GAP_KSTAR_MINUS_QD, // ~0.071092
      matchesImp33878DistToKStar: GAP_MATCHES_DIST_TO_KSTAR,
      boundedByGridStep: GAP_BOUNDED_BY_STEP,
      note:
        'the ~0.07-decade gap is exactly the imp-33878 step=0.25 distToKStar; it is bounded by the ' +
        'grid step and shrinks monotonically as the grid refines (0.25->0.071 ... 1/128->7.8e-4), ' +
        'i.e. a grid-discretization distance that vanishes in the continuum limit, NOT a genuine ' +
        'two-reading discrepancy.',
    },
    R3_one_broad_peak: {
      residAbsGap: RESID_ABS_GAP, // ~9.2e-5
      residRelGapPct: RESID_REL_GAP_PCT, // ~0.141%
      note:
        'the hump amplitude at k=8.75 and at k* differ by only ~0.14% of the peak, consistent with ' +
        'both sampling a single broad quadratic maximum (resid double-prime(k*)~-3.6e-2); there is ' +
        'no second argmax.',
    },
    R4_continuum_between_snapshot_and_integer: {
      kStarBetween: KSTAR_BETWEEN_QD_AND_INTEGER,
      integerMinusKStar: INTEGER_MINUS_KSTAR, // ~0.179
      note:
        'the continuum argmax k*~8.821 lies BETWEEN the quarter-decade snapshot k=8.75 (undershoot ' +
        '0.071) and the integer label k=9 (overshoot 0.179); the quarter-decade grid is one rung ' +
        'short of the continuum, not on it.',
    },
  },
  isRigorous: false,
  verdict:
    'ACCURACY RECONCILIATION (NOT rigorous). The imp-33896 k=8.75 (6.5245e-2) reading and the ' +
    'imp-33878 k*~8.821 (6.5337e-2) reading are the SAME sliding-window resid_exp(k) argmax at two ' +
    'grid resolutions -- the quarter-decade (step=0.25) discrete snapshot and its continuum ' +
    '(grid-step->0) limit. k=8.75/6.5245e-2 equals the imp-33878 step=0.25 rung to machine ' +
    'precision, and the ~0.07-decade offset between the two is precisely the imp-33878 step=0.25 ' +
    'distToKStar (0.07109), a grid-discretization distance bounded by the grid step and shrinking ' +
    'toward zero as the grid refines -- NOT a genuine two-reading discrepancy. The two resid ' +
    'amplitudes agree to ~0.14%, confirming a single broad peak, and the continuum argmax sits ' +
    'BETWEEN the quarter-decade snapshot (k=8.75) and the integer label (k=9). The component model ' +
    'behind both is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes ' +
    'no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33878 (continuum argmax k*~8.821 and the grid-refinement ladder, reused verbatim); ' +
    'imp-33896 (quarter-decade k=8.75 reading, reused verbatim); imp-33902 (Richardson limit ' +
    'k*_R~8.821091 cross-check); imp-33857 (X3 booked the discretization offset); imp-486 (C_mb ' +
    'GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP33905_HUMP_ARGMAX_GRID_VS_CONTINUUM_RECONCILIATION_ASSERTIONS = [
  {
    // (R1) imp-33896 k=8.75/6.5245e-2 IS the imp-33878 step=0.25 rung (same argmax, same grid).
    id: 'imp33905-same-argmax-same-quarter-decade-grid',
    description: 'imp-33896 k=8.75 / 6.5245e-2 equals the imp-33878 step=0.25 rung to machine precision',
    holds: () => SAME_ARGMAX_K && SAME_RESID_VALUE && AUDIT_QD_K === 8.75,
  },
  {
    // (R2) The ~0.07-decade gap equals the imp-33878 step=0.25 distToKStar (a grid distance).
    id: 'imp33905-gap-is-grid-discretization-distance',
    description: 'k*-k_qd ~0.071 equals imp-33878 step=0.25 distToKStar and is bounded by the grid step',
    holds: () =>
      GAP_MATCHES_DIST_TO_KSTAR &&
      GAP_BOUNDED_BY_STEP &&
      GAP_KSTAR_MINUS_QD > 0.05 &&
      GAP_KSTAR_MINUS_QD < 0.09,
  },
  {
    // (R3) The two resid amplitudes agree to well under 1% -- a single broad peak.
    id: 'imp33905-one-broad-peak-resid-agrees',
    description: 'resid at k=8.75 and at k* agree to ~0.14% (one broad quadratic maximum, not two argmaxes)',
    holds: () => RESID_REL_GAP_PCT > 0 && RESID_REL_GAP_PCT < 0.5 && RESID_ABS_GAP > 0,
  },
  {
    // (R4) The continuum argmax sits strictly between the quarter-decade snapshot and the integer label.
    id: 'imp33905-continuum-between-snapshot-and-integer-label',
    description: 'k*~8.821 lies between the quarter-decade k=8.75 and the integer label k=9',
    holds: () => KSTAR_BETWEEN_QD_AND_INTEGER && INTEGER_MINUS_KSTAR > 0.1 && INTEGER_MINUS_KSTAR < 0.25,
  },
  {
    // Honesty gate: reconciliation only, isRigorous false, same-argmax verdict, no QED, no refereed bound is changed.
    id: 'imp33905-honesty-gate-no-qed',
    description: 'Reconciliation only: isRigorous false, SAME argmax verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP33905_HUMP_ARGMAX_GRID_VS_CONTINUUM_RECONCILIATION.isRigorous === false &&
      /SAME sliding-window resid_exp\(k\) argmax at two/.test(
        IMP33905_HUMP_ARGMAX_GRID_VS_CONTINUUM_RECONCILIATION.verdict,
      ) &&
      /NO QED/.test(IMP33905_HUMP_ARGMAX_GRID_VS_CONTINUUM_RECONCILIATION.verdict) &&
      /refereed bound is changed/i.test(IMP33905_HUMP_ARGMAX_GRID_VS_CONTINUUM_RECONCILIATION.verdict),
  },
];

for (const a of IMP33905_HUMP_ARGMAX_GRID_VS_CONTINUUM_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33905-hump-argmax-grid-vs-continuum-reconciliation assertion failed: ${a.id}`);
  }
}
