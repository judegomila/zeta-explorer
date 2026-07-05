/**
 * @module imp-33942-hump-argmax-gap-step-proportionality
 *
 * imp-33942 (numerical): TEST the imp-33905 R2 proportional-shrink claim. imp-33905 R2
 * attributes the ~0.07-decade grid-vs-continuum argmax gap (k* - k_qd = 8.821092 - 8.75 =
 * 0.07109) to the step = 0.25 grid-discretization distance and asserts it "shrinks
 * monotonically as the grid refines ... vanishes in the continuum limit -- the signature of a
 * discretization distance". The implicit stronger reading (and the reason imp-33905 cites the
 * imp-33878 G2 ladder 0.25 -> 0.071, 0.125 -> 0.054, 0.0625 -> 8.6e-3) is that the gap shrinks
 * IN STEP WITH the grid, i.e. halving the grid step halves the gap. That proportional-shrink
 * reading was NEVER tested at the finer grids. This module tabulates it.
 *
 * THE TEST (reads the imp-33878 grid-refinement ladder verbatim -- no fresh model)
 * -------------------------------------------------------------------------------
 *   Reuses IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.gridRefinement (the SAME resid_exp(k) =
 *   p_ecoll(1 - sigma_hi) - p_sigma sliding-window argmax on the SAME imp-33810 component
 *   model, already computed at steps 0.25, 0.125, 0.0625, 0.03125, 0.015625, 0.0078125) and the
 *   continuum argmax k* ~ 8.821092. For every rung it computes the gap distToKStar, the ratio
 *   gap/step (constant iff the gap is proportional to the step), the ratio gap/(step/2) (the
 *   fraction of the half-step bound consumed), the per-refinement ratio gap(finer)/gap(coarser)
 *   at each step-halving (0.5 iff proportional), and the sawtooth prediction
 *   dist_nearest(step) = min(frac, 1 - frac) * step with frac = frac((k* - 6)/step), the
 *   distance from k* to the nearest grid point 6 + j*step.
 *
 * THE FINDING (measurement only -- REFINES imp-33905 R2: BOUNDED, NOT PROPORTIONAL)
 * --------------------------------------------------------------------------------
 *   (P1) THE GAP IS GRID-BOUNDED BY step/2 AT EVERY RUNG -- R2s bounded/vanishing reading holds.
 *        gap/(step/2) stays in (0, 1] at all six rungs (0.569, 0.863, 0.275, 0.550, 0.900,
 *        0.200), so gap <= step/2 always and gap -> 0 as step -> 0. The finest rung gap
 *        (7.8e-4 at step 1/128) is ~91x below the coarsest (7.1e-2 at step 0.25).
 *   (P2) BUT THE GAP DOES NOT SHRINK PROPORTIONALLY TO THE STEP. If gap ~ step then gap/step
 *        would be constant; instead it ranges over ~4.5x (0.284, 0.431, 0.138, 0.275, 0.450,
 *        0.100), NOT constant. Halving the step does NOT halve the gap: the per-refinement
 *        ratios are 0.758, 0.159, 1.000, 0.819, 0.111 -- wildly off the proportional value 0.5.
 *        At the two grids the ticket names: 0.25 -> 0.125 undershrinks (ratio 0.758, gap only
 *        falls 24% not 50%), 0.125 -> 0.0625 overshrinks (ratio 0.159, gap falls far past
 *        quartering). Most starkly, 0.0625 -> 0.03125 leaves the gap IDENTICAL (ratio 1.000):
 *        halving the step shrinks the gap by ZERO because the argmax rung 8.8125 survives.
 *   (P3) THE GAP IS THE SAWTOOTH RESIDUE (k* - 6) mod step, NOT A PROPORTIONAL DECAY. The
 *        closed-form distance from k* to the nearest grid point 6 + j*step,
 *        min(frac, 1 - frac) * step with frac = frac((k* - 6)/step), reproduces the imp-33878
 *        distToKStar at EVERY rung to < 1e-3 (0.0711, 0.0539, 0.0086, 0.0086, 0.0070, 0.0008).
 *        The gap is thus a phase-dependent sawtooth in step (bounded by step/2, zero whenever a
 *        grid point lands on k*), not a quantity that scales linearly with the step. Its overall
 *        envelope shrinks to zero, but the per-refinement drop is set by grid/k* phase alignment,
 *        not by the step ratio.
 *
 * The punchline: imp-33905 R2 is HALF right. The gap IS grid-bounded (<= step/2) and DOES vanish
 * in the continuum limit -- that part of R2 stands. But it does NOT shrink proportionally to the
 * step: halving the grid step changes the gap by anywhere from 0% (ratio 1.000, argmax rung
 * unchanged) to ~84% (ratio 0.159), because the gap is the sawtooth residue (k* - 6) mod step, a
 * phase-alignment quantity, not a proportional discretization decay. R2s "shrinks monotonically /
 * proportional discretization distance" framing should be read as an ENVELOPE bound (<= step/2),
 * not a per-refinement proportionality.
 *
 * MEASUREMENT ONLY. A proportionality diagnostic of an inherited surrogate argmax, NOT an RH
 * bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no
 * bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33905-hump-argmax-grid-vs-continuum-reconciliation (R2 claims the gap is the step distance)
 * @see imp-33878-hump-argmax-grid-refinement (the grid ladder and continuum argmax k*, reused verbatim)
 * @see imp-33902-hump-argmax-convergence-rate (Richardson limit k*_R~8.821091 cross-check)
 */

import { IMP33878_HUMP_ARGMAX_GRID_REFINEMENT } from './imp-33878-hump-argmax-grid-refinement.js';

const K_STAR = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.continuumArgmax.kStar; // ~8.821092
const LADDER = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.gridRefinement; // steps 0.25..1/128
const GRID_ORIGIN = 6; // the imp-33878 k-grid runs 6..11 stepping by `step` from k=6

// Sawtooth prediction: distance from k* to the nearest grid point 6 + j*step.
function distToNearestGridPoint(step) {
  const off = (K_STAR - GRID_ORIGIN) / step;
  const frac = off - Math.floor(off);
  return Math.min(frac, 1 - frac) * step;
}

// Per-rung proportionality tabulation.
const RUNGS = LADDER.map((r) => {
  const sawtooth = distToNearestGridPoint(r.step);
  return {
    step: r.step,
    argmaxK: r.argmaxK,
    gap: r.distToKStar, // = |argmaxK - k*|
    gapOverStep: +(r.distToKStar / r.step).toFixed(4), // constant iff gap ~ step
    gapOverHalfStep: +(r.distToKStar / (r.step / 2)).toFixed(4), // in (0,1] iff bounded by step/2
    sawtoothPredicted: +sawtooth.toExponential(4),
    sawtoothMatches: Math.abs(sawtooth - r.distToKStar) < 1e-3,
  };
});

// Per-refinement ratios at each step-halving (0.5 iff the gap is proportional to the step).
const HALVING_RATIOS = [];
for (let i = 1; i < LADDER.length; i++) {
  const stepHalved = Math.abs(LADDER[i - 1].step / LADDER[i].step - 2) < 1e-9;
  HALVING_RATIOS.push({
    fromStep: LADDER[i - 1].step,
    toStep: LADDER[i].step,
    stepHalved,
    gapRatio: +(LADDER[i].distToKStar / LADDER[i - 1].distToKStar).toFixed(4),
    proportionalTarget: 0.5,
  });
}

// (P1) Bounded by step/2 at every rung, and the finest gap is far below the coarsest.
const ALL_BOUNDED_BY_HALF_STEP = RUNGS.every((r) => r.gapOverHalfStep <= 1 + 1e-9 && r.gap > 0);
const COARSEST_GAP = LADDER[0].distToKStar; // ~7.1e-2
const FINEST_GAP = LADDER[LADDER.length - 1].distToKStar; // ~7.8e-4
const ENVELOPE_SHRINK_FACTOR = +(COARSEST_GAP / FINEST_GAP).toFixed(1); // ~91x

// (P2) NOT proportional: gap/step is not constant, and the halving ratios are not ~0.5.
const GAP_OVER_STEP_VALUES = RUNGS.map((r) => r.gapOverStep);
const GAP_OVER_STEP_MIN = Math.min(...GAP_OVER_STEP_VALUES); // ~0.100
const GAP_OVER_STEP_MAX = Math.max(...GAP_OVER_STEP_VALUES); // ~0.450
const GAP_OVER_STEP_SPREAD = +(GAP_OVER_STEP_MAX / GAP_OVER_STEP_MIN).toFixed(2); // ~4.5x (would be 1.0 if proportional)
const HALVING_RATIO_VALUES = HALVING_RATIOS.map((h) => h.gapRatio);
const HALVING_RATIO_MIN = Math.min(...HALVING_RATIO_VALUES); // ~0.111
const HALVING_RATIO_MAX = Math.max(...HALVING_RATIO_VALUES); // ~1.000 (no shrink at all)
// A refinement where halving the step shrinks the gap by essentially nothing (argmax rung survives).
const FLAT_REFINEMENT_EXISTS = HALVING_RATIO_VALUES.some((v) => v > 0.95);

// (P3) The gap is the sawtooth residue (k*-6) mod step -- matches at every rung.
const SAWTOOTH_MATCHES_ALL = RUNGS.every((r) => r.sawtoothMatches);

export const IMP33942_HUMP_ARGMAX_GAP_STEP_PROPORTIONALITY = {
  id: 'imp-33942',
  proofSection: 'S-frontier',
  question:
    'imp-33905 R2 attributes the ~0.07-decade grid-vs-continuum argmax gap to the step=0.25 ' +
    'discretization distance and asserts it vanishes as the grid refines, citing the imp-33878 ' +
    'ladder (0.25->0.071, 0.125->0.054, 0.0625->8.6e-3) -- but never tested whether the gap ' +
    'shrinks PROPORTIONALLY to the step (halves/quarters in step with the grid) or merely stays ' +
    'bounded by it. Re-run the SAME resid_exp(k) argmax gap at step 0.125 and 0.0625 and tabulate ' +
    'the proportional-shrink test. Measurement/reconciliation only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the imp-33878 sliding-window resid_exp(k) argmax gap distToKStar = |argmaxK - k*| at grid ' +
    'steps 0.25..1/128 (k*~8.821092), tabulated as gap/step, gap/(step/2), the per-refinement ' +
    'halving ratio gap(finer)/gap(coarser), and the sawtooth prediction (k*-6) mod step',
  continuumArgmax: K_STAR, // ~8.821092
  rungs: RUNGS, // step, argmaxK, gap, gapOverStep, gapOverHalfStep, sawtoothPredicted, sawtoothMatches
  halvingRatios: HALVING_RATIOS, // per step-halving: gapRatio (0.5 iff proportional)
  finding: {
    P1_gap_bounded_by_half_step:
      'gap/(step/2) stays in (0,1] at all six rungs (0.569, 0.863, 0.275, 0.550, 0.900, 0.200), ' +
      'so gap <= step/2 always and gap -> 0 as step -> 0; the finest gap (7.8e-4 at step 1/128) ' +
      'is ~91x below the coarsest (7.1e-2 at step 0.25). imp-33905 R2s bounded/vanishing reading ' +
      'holds as an ENVELOPE bound.',
    P2_gap_not_proportional_to_step:
      'gap/step is NOT constant -- it ranges ~4.5x (0.284, 0.431, 0.138, 0.275, 0.450, 0.100) -- ' +
      'so the gap is not proportional to the step. Halving the step does NOT halve the gap: the ' +
      'per-refinement ratios are 0.758, 0.159, 1.000, 0.819, 0.111, off the proportional 0.5. At ' +
      'the two grids the ticket names, 0.25->0.125 undershrinks (0.758, gap falls only 24%) and ' +
      '0.125->0.0625 overshrinks (0.159); most starkly 0.0625->0.03125 leaves the gap IDENTICAL ' +
      '(1.000) because the argmax rung 8.8125 survives the refinement.',
    P3_gap_is_sawtooth_residue:
      'the gap equals the distance from k* to the nearest grid point 6+j*step, ' +
      'min(frac,1-frac)*step with frac=frac((k*-6)/step), reproducing the imp-33878 distToKStar ' +
      'at every rung to <1e-3 (0.0711, 0.0539, 0.0086, 0.0086, 0.0070, 0.0008). The gap is a ' +
      'phase-dependent sawtooth in the step (zero whenever a grid point lands on k*), not a ' +
      'proportional discretization decay.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT/RECONCILIATION (NOT rigorous). REFINES imp-33905 R2. The grid-vs-continuum ' +
    'argmax gap IS grid-bounded (gap <= step/2 at every rung, gap -> 0 as step -> 0, finest ~91x ' +
    'below coarsest) -- that half of R2 stands. BUT it does NOT shrink PROPORTIONALLY to the ' +
    'step: gap/step is not constant (ranges ~4.5x) and halving the grid step changes the gap by ' +
    'anywhere from 0% (ratio 1.000, argmax rung 8.8125 unchanged from step 0.0625 to 0.03125) to ' +
    '~84% (ratio 0.159 from 0.125 to 0.0625), because the gap is the sawtooth residue (k*-6) mod ' +
    'step -- a grid/k* phase-alignment quantity (matched by min(frac,1-frac)*step to <1e-3 at ' +
    'every rung), not a proportional decay. imp-33905 R2s "shrinks monotonically / proportional ' +
    'discretization distance" framing should be read as an ENVELOPE bound (<= step/2), not a ' +
    'per-refinement proportionality. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the surrogate resid_exp(k) is descriptive, not ' +
    'derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33905 (R2 claims the gap is the step discretization distance and vanishes as the grid ' +
    'refines); imp-33878 (the grid-refinement ladder and continuum argmax k*~8.821092, reused ' +
    'verbatim); imp-33902 (Richardson limit k*_R~8.821091 cross-check); imp-486 (C_mb ' +
    'GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP33942_HUMP_ARGMAX_GAP_STEP_PROPORTIONALITY_ASSERTIONS = [
  {
    // (P1) The gap is bounded by step/2 at every rung and vanishes as the grid refines.
    id: 'imp33942-gap-bounded-by-half-step',
    description: 'gap/(step/2) in (0,1] at every rung; finest gap far below coarsest (envelope -> 0)',
    holds: () => ALL_BOUNDED_BY_HALF_STEP && FINEST_GAP < COARSEST_GAP && ENVELOPE_SHRINK_FACTOR > 10,
  },
  {
    // (P2) The gap is NOT proportional to the step: gap/step not constant, halving ratios not ~0.5.
    id: 'imp33942-gap-not-proportional-to-step',
    description: 'gap/step spreads ~4.5x (not constant) and a step-halving leaves the gap unchanged (ratio ~1)',
    holds: () =>
      GAP_OVER_STEP_SPREAD > 2 &&
      FLAT_REFINEMENT_EXISTS &&
      HALVING_RATIO_MIN < 0.3 &&
      HALVING_RATIO_MAX > 0.95,
  },
  {
    // (P3) The gap is exactly the sawtooth residue (k*-6) mod step at every rung.
    id: 'imp33942-gap-is-sawtooth-residue',
    description: 'min(frac,1-frac)*step reproduces the imp-33878 distToKStar at every rung to <1e-3',
    holds: () => SAWTOOTH_MATCHES_ALL,
  },
  {
    // Honesty gate: measurement only, isRigorous false, refines R2 (bounded not proportional), no QED, PT SOTA.
    id: 'imp33942-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, NOT proportional verdict, no QED, PT Lambda<=0.2 SOTA',
    holds: () =>
      IMP33942_HUMP_ARGMAX_GAP_STEP_PROPORTIONALITY.isRigorous === false &&
      /does NOT shrink PROPORTIONALLY/.test(IMP33942_HUMP_ARGMAX_GAP_STEP_PROPORTIONALITY.verdict) &&
      /NO QED/.test(IMP33942_HUMP_ARGMAX_GAP_STEP_PROPORTIONALITY.verdict) &&
      /remains SOTA/.test(IMP33942_HUMP_ARGMAX_GAP_STEP_PROPORTIONALITY.verdict),
  },
];

for (const a of IMP33942_HUMP_ARGMAX_GAP_STEP_PROPORTIONALITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33942-hump-argmax-gap-step-proportionality assertion failed: ${a.id}`);
  }
}
