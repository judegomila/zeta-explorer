/**
 * @module imp-33983-sawtooth-residue-finer-grid-verification
 *
 * imp-33983 (numerical): VERIFY the imp-33942 sawtooth-residue closed form
 * gap(step) = min(frac, 1 - frac) * step (frac = frac((k* - 6)/step)) at grid steps FINER than
 * the imp-33878 ladder floor of 0.0078125. imp-33942 P3 established that the imp-33878
 * grid-vs-continuum argmax gap distToKStar = |argmaxK - k*| equals the distance from the continuum
 * argmax k* ~ 8.821092 to the nearest sliding-window grid point 6 + j*step -- a phase-dependent
 * sawtooth in the step, bounded by step/2, matching every rung of the imp-33878 ladder (steps
 * 0.25..1/128) to < 1e-3. That closed form was verified only THROUGH the imp-33878 floor of
 * 1/128 = 0.0078125. This module EXTENDS the imp-33878 argmax ladder TWO more rungs
 * (step 1/256 = 0.00390625 and step 1/512 = 0.001953125) on the SAME imp-33810 component model and
 * measures whether the sawtooth closed form, the step/2 bound, and the phase-alignment behaviour
 * hold at the finer grids.
 *
 * THE EXTENSION (re-runs the imp-33878 resid_exp(k) argmax verbatim at two finer steps)
 * -----------------------------------------------------------------------------------
 *   resid_exp(k) = p_ecoll (1 - sigma_hi) - p_sigma is the imp-33773 M2 sub-leading residual over
 *   the sliding window [10^k, 10^(k+1)] (p_sigma = OLS(ln sigma vs ln N) at 4 pts/decade,
 *   p_ecoll = -d log E_coll / d log N over the endpoints, sigma_hi at the upper endpoint) -- the
 *   EXACT imp-33878/imp-33810 quantity, re-implemented here identically (same inherited parts:
 *   E_trunc = 3.06e-5 fixed strip, E_coll = C_C sqrt(log T0 / N), E_flow = C_F (log T0 / T0)
 *   Gronwall, T0 = effectiveHeightForN(N)); no fresh model. For each new step the discrete
 *   argmax over the k = 6..11 grid is recomputed, and the actual gap distToKStar is compared with
 *   the sawtooth prediction min(frac, 1 - frac) * step and with the step/2 bound. k* is read
 *   verbatim from the imp-33878 continuum argmax (ternary search, ~8.821092).
 *
 * THE FINDING (measurement only -- CONFIRMS the sawtooth closed form below the imp-33878 floor)
 * -------------------------------------------------------------------------------------------
 *   (V1) THE SAWTOOTH CLOSED FORM HOLDS EXACTLY AT BOTH NEW RUNGS. The re-run discrete argmax gap
 *        distToKStar equals min(frac, 1 - frac) * step to < 1e-6 at step 1/256 and 1/512, exactly
 *        as it did through the imp-33878 floor -- the imp-33942 P3 sawtooth-residue identity is
 *        NOT an artifact of the coarser ladder.
 *   (V2) THE GAP STAYS BOUNDED BY step/2 AT BOTH NEW RUNGS, APPROACHING THE BOUND. gap/(step/2) is
 *        0.399 at 1/256 and 0.798 at 1/512, both in (0, 1], so gap <= step/2 continues to hold as
 *        the grid refines -- but the ratio is CLIMBING toward the bound (it was 0.200 at 1/128),
 *        because (V3) the gap itself is frozen while step/2 keeps halving.
 *   (V3) THE GAP IS FROZEN AT 7.795e-4 ACROSS BOTH NEW RUNGS -- DYADIC PHASE-LOCK. The argmax grid
 *        point is 8.8203125 = 6 + 361/128 at 1/128, and because that value is a terminating dyadic
 *        it REMAINS on every finer dyadic grid (= 6 + 722/256 = 6 + 1444/512), so it stays the
 *        nearest grid point to k* and stays the argmax -- the gap does not shrink at 1/256 or
 *        1/512. This is a direct continuation of the imp-33942 P2 "flat refinement" (per-refinement
 *        ratio 1.000, argmax rung survives), now extended two rungs deeper.
 *   (V4) THE GAP -> 0 BEHAVIOUR RESUMES ONLY WHEN A FINER GRID POINT LANDS NEARER k* (below the two
 *        new rungs). An out-of-ladder check confirms the frozen argmax finally MOVES below 1/512:
 *        at 1/2048 the argmax jumps to 8.821289 (gap 1.97e-4) and at 1/4096 to 8.821045
 *        (gap 4.71e-5), the sawtooth resuming its descent toward zero -- exactly the ticket's
 *        "approaches zero as a grid point nears k*" behaviour, phase-gated by dyadic alignment.
 *
 * The punchline: the imp-33942 sawtooth-residue closed form gap(step) = min(frac, 1 - frac) * step
 * survives two rungs below the imp-33878 floor of 1/128 -- it matches the re-run argmax gap
 * EXACTLY (< 1e-6) at 1/256 and 1/512, the gap stays bounded by step/2 (0.399, 0.798), and the
 * "approaches zero as a grid point nears k*" reading is confirmed as PHASE-GATED: because the
 * argmax point 8.8203125 is a terminating dyadic it stays on every finer dyadic grid, freezing the
 * gap at 7.795e-4 across 1/256 and 1/512 (gap/(step/2) climbing toward 1), and the gap only drops
 * again once a still-finer grid lands a point between 8.8203125 and k* (verified at 1/2048, 1/4096).
 * The gap vanishes in the continuum ENVELOPE, but per-rung it is the phase-locked sawtooth residue,
 * not a proportional decay -- reaffirming the imp-33942 verdict at finer resolution.
 *
 * MEASUREMENT ONLY. A closed-form verification of an inherited surrogate argmax, NOT an RH bound.
 * The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33942-hump-argmax-gap-step-proportionality (P3 sawtooth-residue closed form verified here at finer grids)
 * @see imp-33878-hump-argmax-grid-refinement (the ladder extended here; source of k* and the model)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the ladder storing resid_exp(k), reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33878_HUMP_ARGMAX_GRID_REFINEMENT } from './imp-33878-hump-argmax-grid-refinement.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed strip (imp-2631/imp-33582/imp-33620/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33878/imp-33810/imp-33773 exactly

// EXACT inherited imp-3406/imp-33810/imp-33878 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// p_sigma = -slope of OLS(ln sigma vs ln N), 4 pts/decade (imp-33582/imp-33730, verbatim).
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}

// p_ecoll = -d log E_coll / d log N over endpoints (imp-33620/imp-33727, verbatim).
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// resid_exp(k) over window [10^k, 10^(k+1)] (imp-33810/imp-33878 defn, verbatim).
function residExp(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const sigmaHi = parts(hi).sigma;
  return pEcoll * (1 - sigmaHi) - pSigma;
}

// Discrete argmax of resid_exp over the k=6..11 grid at a given step (imp-33878 argmaxGrid).
function argmaxGrid(step) {
  let bestK = 6;
  let bestV = -Infinity;
  for (let k = 6; k <= 11 + 1e-9; k += step) {
    const kk = +k.toFixed(10);
    const v = residExp(kk);
    if (v > bestV) {
      bestV = v;
      bestK = kk;
    }
  }
  return { k: bestK, v: bestV };
}

// k* read verbatim from the imp-33878 continuum argmax (ternary search, ~8.821092).
const K_STAR = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.continuumArgmax.kStar;
const GRID_ORIGIN = 6; // the k-grid runs 6..11 stepping by `step` from k=6

// Sawtooth prediction: distance from k* to the nearest grid point 6 + j*step (imp-33942 defn).
function distToNearestGridPoint(step) {
  const off = (K_STAR - GRID_ORIGIN) / step;
  const frac = off - Math.floor(off);
  return Math.min(frac, 1 - frac) * step;
}

// The imp-33878 ladder floor and the TWO new finer rungs extended here.
const LADDER_FLOOR_STEP = 0.0078125; // 1/128 -- the imp-33878 ladder floor
const NEW_STEPS = [0.00390625, 0.001953125]; // 1/256 and 1/512

function rungFor(step) {
  const a = argmaxGrid(step);
  const gap = Math.abs(a.k - K_STAR);
  const saw = distToNearestGridPoint(step);
  return {
    step,
    argmaxK: +a.k.toFixed(8),
    gap: +gap.toExponential(4), // = |argmaxK - k*|
    gapOverHalfStep: +(gap / (step / 2)).toFixed(4), // in (0,1] iff bounded by step/2
    sawtoothPredicted: +saw.toExponential(4),
    sawtoothAbsError: +Math.abs(saw - gap).toExponential(3),
    sawtoothMatches: Math.abs(saw - gap) < 1e-6,
  };
}

const FLOOR_RUNG = rungFor(LADDER_FLOOR_STEP); // the imp-33878 floor, recomputed as the anchor
const NEW_RUNGS = NEW_STEPS.map(rungFor); // the two extension rungs

// (V4) Out-of-ladder check: the frozen argmax finally MOVES below 1/512, gap resuming its descent.
const DEEPER_STEPS = [0.00048828125, 0.000244140625]; // 1/2048 and 1/4096
const DEEPER_RUNGS = DEEPER_STEPS.map(rungFor);

// (V1) The sawtooth closed form matches the re-run argmax gap at both new rungs.
const SAWTOOTH_MATCHES_NEW = NEW_RUNGS.every((r) => r.sawtoothMatches);
// (V2) The gap stays bounded by step/2 at both new rungs.
const BOUNDED_BY_HALF_STEP_NEW = NEW_RUNGS.every((r) => r.gapOverHalfStep <= 1 + 1e-9 && r.gap > 0);
// (V3) The gap is frozen across the floor and both new rungs (dyadic phase-lock at 8.8203125).
const FROZEN_ARGMAX_K = 8.8203125; // = 6 + 361/128 -- terminating dyadic, survives every finer grid
const GAP_FROZEN =
  FLOOR_RUNG.argmaxK === FROZEN_ARGMAX_K &&
  NEW_RUNGS.every((r) => r.argmaxK === FROZEN_ARGMAX_K && r.gap === FLOOR_RUNG.gap);
// gap/(step/2) climbs toward the bound as step halves while the gap stays frozen.
const HALF_STEP_RATIO_CLIMBS =
  NEW_RUNGS[0].gapOverHalfStep > FLOOR_RUNG.gapOverHalfStep &&
  NEW_RUNGS[1].gapOverHalfStep > NEW_RUNGS[0].gapOverHalfStep;
// (V4) Below 1/512 the argmax finally moves off 8.8203125 and the gap drops (sawtooth resumes).
const GAP_RESUMES_DESCENT =
  DEEPER_RUNGS.every((r) => r.sawtoothMatches) &&
  DEEPER_RUNGS[0].argmaxK !== FROZEN_ARGMAX_K &&
  DEEPER_RUNGS[0].gap < FLOOR_RUNG.gap &&
  DEEPER_RUNGS[1].gap < DEEPER_RUNGS[0].gap;

export const IMP33983_SAWTOOTH_RESIDUE_FINER_GRID_VERIFICATION = {
  id: 'imp-33983',
  proofSection: 'S-frontier',
  question:
    'imp-33942 P3 established that the imp-33878 grid-vs-continuum argmax gap distToKStar equals the ' +
    'sawtooth residue min(frac,1-frac)*step (frac=frac((k*-6)/step)) -- the distance from k*~8.821092 ' +
    'to the nearest sliding-window grid point -- but verified it only THROUGH the imp-33878 ladder ' +
    'floor of 1/128=0.0078125. Extend the imp-33878 resid_exp(k) argmax ladder two more rungs ' +
    '(1/256, 1/512), confirm the sawtooth closed form still matches the re-run argmax gap, the gap ' +
    'stays bounded by step/2, and the gap approaches zero as a grid point nears k*. Measurement only; ' +
    'NOT an RH bound; no QED.',
  measuredQuantity:
    'the re-run imp-33878 sliding-window resid_exp(k) discrete argmax gap distToKStar = |argmaxK - k*| ' +
    'at grid steps 1/256 and 1/512 (k*~8.821092), compared with the imp-33942 sawtooth prediction ' +
    'min(frac,1-frac)*step and the step/2 bound, plus an out-of-ladder 1/2048, 1/4096 phase check',
  continuumArgmax: K_STAR, // ~8.821092 (imp-33878, verbatim)
  ladderFloorRung: FLOOR_RUNG, // 1/128 anchor, recomputed
  newRungs: NEW_RUNGS, // 1/256, 1/512: step, argmaxK, gap, gapOverHalfStep, sawtoothPredicted, sawtoothMatches
  deeperPhaseCheckRungs: DEEPER_RUNGS, // 1/2048, 1/4096: where the frozen argmax finally moves
  finding: {
    V1_sawtooth_closed_form_holds_at_finer_grids:
      'The re-run discrete argmax gap equals min(frac,1-frac)*step to <1e-6 at BOTH new rungs ' +
      '(1/256 and 1/512), exactly as through the imp-33878 floor -- the imp-33942 P3 sawtooth-residue ' +
      'identity is not an artifact of the coarser ladder.',
    V2_gap_bounded_by_half_step_climbing:
      'gap/(step/2) is 0.399 at 1/256 and 0.798 at 1/512, both in (0,1], so gap <= step/2 keeps ' +
      'holding as the grid refines; the ratio CLIMBS toward the bound (0.200 at 1/128) because the ' +
      'gap is frozen while step/2 keeps halving.',
    V3_gap_frozen_dyadic_phase_lock:
      'The argmax grid point is 8.8203125 = 6 + 361/128 at 1/128; being a terminating dyadic it ' +
      'stays on every finer dyadic grid (= 6+722/256 = 6+1444/512), so it remains nearest to k* and ' +
      'remains the argmax -- the gap is FROZEN at 7.795e-4 across 1/256 and 1/512. A direct ' +
      'continuation of the imp-33942 P2 flat-refinement (ratio 1.000), now two rungs deeper.',
    V4_gap_to_zero_resumes_below_the_new_rungs:
      'The frozen argmax finally MOVES below 1/512: at 1/2048 it jumps to 8.821289 (gap 1.97e-4) and ' +
      'at 1/4096 to 8.821045 (gap 4.71e-5), the sawtooth resuming its descent toward zero once a ' +
      'finer grid point lands between 8.8203125 and k* -- the ticket approaches-zero-as-a-grid-point-' +
      'nears-k* behaviour, phase-gated by dyadic alignment.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). VERIFIES the imp-33942 P3 sawtooth-residue closed form ' +
    'gap(step) = min(frac,1-frac)*step two rungs below the imp-33878 ladder floor of 1/128. Extending ' +
    'the imp-33878 resid_exp(k) argmax ladder to steps 1/256 and 1/512 on the same imp-33810 model, ' +
    'the re-run discrete argmax gap distToKStar matches the sawtooth prediction EXACTLY (<1e-6) at ' +
    'both new rungs, and the gap stays bounded by step/2 (gap/(step/2) = 0.399, 0.798, both in (0,1]). ' +
    'The gap does NOT shrink at 1/256 or 1/512 -- it is FROZEN at 7.795e-4 because the argmax grid ' +
    'point 8.8203125 = 6+361/128 is a terminating dyadic that survives on every finer dyadic grid ' +
    '(a continuation of the imp-33942 P2 flat-refinement, per-refinement ratio 1.000), driving ' +
    'gap/(step/2) UP toward the bound rather than the gap down. The ticket approaches-zero behaviour ' +
    'is confirmed as PHASE-GATED: the gap resumes its descent only once a still-finer grid lands a ' +
    'point nearer k* (verified out-of-ladder at 1/2048 -> gap 1.97e-4, 1/4096 -> gap 4.71e-5). So the ' +
    'sawtooth closed form, the step/2 envelope bound, and the phase-alignment reading of imp-33942 ' +
    'all survive at finer resolution. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the surrogate resid_exp(k) is descriptive, not derived; ' +
    'the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33942 (P3 sawtooth-residue closed form verified here at finer grids); imp-33878 (the ladder ' +
    'extended here; source of k*~8.821092 and the resid_exp model); imp-33810 (the ladder storing ' +
    'resid_exp(k), reused verbatim); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ' +
    'ansatz); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33983_SAWTOOTH_RESIDUE_FINER_GRID_VERIFICATION_ASSERTIONS = [
  {
    // (V1) The sawtooth closed form matches the re-run argmax gap at both new rungs (<1e-6).
    id: 'imp33983-sawtooth-holds-at-finer-grids',
    description: 'min(frac,1-frac)*step reproduces the re-run argmax gap at 1/256 and 1/512 to <1e-6',
    holds: () => SAWTOOTH_MATCHES_NEW && NEW_RUNGS.length === 2,
  },
  {
    // (V2) The gap stays bounded by step/2 at both new rungs, and the ratio climbs toward the bound.
    id: 'imp33983-gap-bounded-by-half-step',
    description: 'gap/(step/2) in (0,1] at 1/256 and 1/512, climbing toward the bound (0.399, 0.798)',
    holds: () =>
      BOUNDED_BY_HALF_STEP_NEW &&
      HALF_STEP_RATIO_CLIMBS &&
      NEW_RUNGS[0].gapOverHalfStep > 0.39 &&
      NEW_RUNGS[0].gapOverHalfStep < 0.41 &&
      NEW_RUNGS[1].gapOverHalfStep > 0.79 &&
      NEW_RUNGS[1].gapOverHalfStep < 0.81,
  },
  {
    // (V3) The gap is frozen at 8.8203125 across the floor and both new rungs (dyadic phase-lock).
    id: 'imp33983-gap-frozen-dyadic-phase-lock',
    description: 'argmax stays 8.8203125 = 6+361/128 and gap stays 7.795e-4 at 1/128, 1/256, 1/512',
    holds: () => GAP_FROZEN && FLOOR_RUNG.gap > 7.7e-4 && FLOOR_RUNG.gap < 7.9e-4,
  },
  {
    // (V4) Below 1/512 the argmax moves off 8.8203125 and the gap resumes its descent toward zero.
    id: 'imp33983-gap-resumes-descent-below-new-rungs',
    description: 'at 1/2048 and 1/4096 the argmax moves and the gap drops (1.97e-4, 4.71e-5); sawtooth still exact',
    holds: () => GAP_RESUMES_DESCENT,
  },
  {
    // Honesty gate: measurement only, isRigorous false, VERIFIES imp-33942 sawtooth, no QED, no refereed bound is changed.
    id: 'imp33983-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, VERIFIES the imp-33942 sawtooth, no QED, no refereed bound is changed',
    holds: () =>
      IMP33983_SAWTOOTH_RESIDUE_FINER_GRID_VERIFICATION.isRigorous === false &&
      /VERIFIES the imp-33942/.test(IMP33983_SAWTOOTH_RESIDUE_FINER_GRID_VERIFICATION.verdict) &&
      /NO QED/.test(IMP33983_SAWTOOTH_RESIDUE_FINER_GRID_VERIFICATION.verdict) &&
      /refereed bound is changed/i.test(IMP33983_SAWTOOTH_RESIDUE_FINER_GRID_VERIFICATION.verdict),
  },
];

for (const a of IMP33983_SAWTOOTH_RESIDUE_FINER_GRID_VERIFICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33983-sawtooth-residue-finer-grid-verification assertion failed: ${a.id}`);
  }
}
