/**
 * @module imp-35889-e-share-decomposition-at-knees
 *
 * imp-35889 (accuracy, measurement): DECOMPOSE the full E(N) = E_trunc + E_flow + E_coll
 * three-way split at the two imp-35853 knee heights (Kneedle elbow sigma ~ 0.783, flattest
 * point sigma ~ 0.407) to identify WHICH remainder term dominates E(N) at each knee.
 *
 * imp-35853 located its two knees on the REQ-4 required-height downslope using only
 * sigma = E_coll / (E_trunc + E_flow + E_coll), which pins the COLLISION share alone and
 * says nothing about how the remaining (1 - sigma) mass splits between the fixed truncation
 * floor E_trunc and the (tiny) flow term E_flow. This module reuses the EXACT imp-3406 /
 * imp-33582 sub-terms (E_trunc = 3.06e-5 fixed; E_flow = C_F (log T0 / T0) exp|t_c|;
 * E_coll = C_C sqrt(log T0 / N)) and, at each knee N (located by the same downslope
 * bisection on the imp-3220 / imp-3406 RvM surrogate), tabulates all three terms and their
 * fractional shares.
 *
 * WHAT THE SPLIT SHOWS (the honest finding). The DOMINANT term FLIPS between the two knees:
 *   - Kneedle elbow (sigma ~ 0.783, N ~ 2.13e8, log T0 ~ 18.28): E_coll DOMINATES with share
 *     ~ 0.783 (= sigma by construction); E_trunc is the runner-up (~ 0.213); E_flow is
 *     negligible (~ 0.0041). E_trunc / E_coll ~ 0.272.
 *   - Flattest point (sigma ~ 0.407, N ~ 7.20e9, log T0 ~ 21.60): E_trunc DOMINATES with
 *     share ~ 0.592; E_coll drops to the runner-up (~ 0.407 = sigma); E_flow is even smaller
 *     (~ 0.00057). E_trunc / E_coll ~ 1.456.
 * Because E_flow is negligible at both heights, sigma ~ E_coll / (E_trunc + E_coll), so the
 * E_trunc-vs-E_coll balance crosses exactly at sigma = 1/2: the elbow (sigma ~ 0.783 > 1/2)
 * is collision-dominated, the flattest point (sigma ~ 0.407 < 1/2) is truncation-dominated,
 * and the E_trunc = E_coll crossover height (imp-35337 sigma = 0.5 landmark) sits BETWEEN the
 * two knees. E_flow shrinks monotonically with height (log T0 / T0 decay), so it never
 * competes for dominance on this stretch of the downslope.
 *
 * Measurement only; reuses the pinned imp-3406 / imp-33582 constants and the imp-35853 knee
 * locators unchanged; derives no remainder; discharges nothing; changes no bound; establishes
 * no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5
 * (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; NO QED;
 * no refereed bound is changed.
 *
 * @see imp-35853-req4-required-height-continuous-sigma-knee (the two knee locators)
 * @see imp-35337-sigma-landmarks-double-double-certification (E_trunc = E_coll crossover at sigma = 0.5)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (source sigma model)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// EXACT imp-3406 / imp-3529 / imp-33582 sub-terms (identical to imp-35853; no fresh model).
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { sigma: E_coll / E_N, logT0: L, E_trunc: E_TRUNC_PT, E_flow, E_coll, E_N };
}
const sigma = (N) => parts(N).sigma;

// Interior peak (reproduces imp-33582 / imp-35813 N ~ 9.22e5) -- anchors the downslope search.
function dSigmadN(N) {
  const h = N * 1e-6;
  return (sigma(N + h) - sigma(N - h)) / (2 * h);
}
function locatePeak() {
  let a = Math.log(1e4);
  let b = Math.log(1e7);
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    if (dSigmadN(Math.exp(m)) > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_PEAK = locatePeak();

// Downslope threshold crossing (N > N_peak): first N with sigma below thr -- identical to imp-35853.
function crossBelow(thr) {
  let a = Math.log(N_PEAK);
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (sigma(Math.exp(m)) > thr) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// The two imp-35853 knee sigma targets (Kneedle elbow / flattest point).
const KNEEDLE_ELBOW_SIGMA = 0.783;
const FLATTEST_POINT_SIGMA = 0.407;

function splitAtSigma(label, sTarget) {
  const N = crossBelow(sTarget);
  const p = parts(N);
  const shares = {
    E_trunc: p.E_trunc / p.E_N,
    E_flow: p.E_flow / p.E_N,
    E_coll: p.E_coll / p.E_N,
  };
  const dominant = Object.entries(shares).sort((a, b) => b[1] - a[1])[0][0];
  return {
    label,
    sigmaTarget: sTarget,
    N: +N.toExponential(4),
    logT0: +p.logT0.toFixed(4),
    E_trunc: +p.E_trunc.toExponential(4),
    E_flow: +p.E_flow.toExponential(4),
    E_coll: +p.E_coll.toExponential(4),
    E_N: +p.E_N.toExponential(4),
    shareTrunc: +shares.E_trunc.toFixed(5),
    shareFlow: +shares.E_flow.toFixed(6),
    shareColl: +shares.E_coll.toFixed(5),
    dominant,
    truncOverColl: +(p.E_trunc / p.E_coll).toFixed(4),
  };
}

const kneedleElbow = splitAtSigma('Kneedle-elbow', KNEEDLE_ELBOW_SIGMA); // E_coll dominates (~0.783)
const flattestPoint = splitAtSigma('Flattest-point', FLATTEST_POINT_SIGMA); // E_trunc dominates (~0.592)

export const IMP35889_E_SHARE_DECOMPOSITION_AT_KNEES = {
  id: 'imp-35889',
  proofSection: 'S-frontier',
  question:
    'At the two imp-35853 REQ-4 required-height knees (Kneedle elbow sigma ~ 0.783, flattest point sigma ~ 0.407), ' +
    'the sigma = E_coll / E(N) definition pins only the COLLISION share. What is the full E_trunc / E_flow / E_coll ' +
    'three-way split at each knee, and which of the three remainder terms dominates E(N)?',
  method:
    'Reuse the exact imp-3406 / imp-33582 sub-terms (E_trunc = 3.06e-5 fixed; E_flow = C_F (log T0 / T0) exp|t_c|; ' +
    'E_coll = C_C sqrt(log T0 / N)) and the imp-35853 downslope bisection. At each knee N (located by crossBelow at ' +
    'the target sigma) tabulate E_trunc, E_flow, E_coll and their fractional shares of E(N), then identify the ' +
    'dominant term and the E_trunc / E_coll ratio.',
  kneedleElbow, // E_coll DOMINATES: share ~ 0.783 (= sigma), E_trunc ~ 0.213, E_flow ~ 0.0041
  flattestPoint, // E_trunc DOMINATES: share ~ 0.592, E_coll ~ 0.407 (= sigma), E_flow ~ 0.00057
  // The honest finding: the dominant term FLIPS between the two knees. E_flow is negligible at both, so
  // sigma ~ E_coll / (E_trunc + E_coll) and the E_trunc = E_coll crossover sits at sigma = 1/2, BETWEEN
  // the elbow (sigma ~ 0.783, collision-dominated) and the flattest point (sigma ~ 0.407, truncation-dominated).
  dominantTermFlips: kneedleElbow.dominant !== flattestPoint.dominant,
  balanceCrossoverSigma: 0.5, // E_trunc = E_coll where E_flow negligible -- imp-35337 crossover landmark
  eFlowNegligibleAtBothKnees: kneedleElbow.shareFlow < 0.01 && flattestPoint.shareFlow < 0.01,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Decomposing the full E(N) = E_trunc + E_flow + E_coll split at the two imp-35853 ' +
    'knees on the same imp-3406 / imp-33582 surrogate: the DOMINANT term FLIPS between them. At the Kneedle elbow ' +
    '(sigma ~ 0.783, N ~ 2.13e8, log T0 ~ 18.28) E_coll DOMINATES with share ~ 0.783 (= sigma), E_trunc is the ' +
    'runner-up (~ 0.213) and E_flow is negligible (~ 0.0041). At the flattest point (sigma ~ 0.407, N ~ 7.20e9, ' +
    'log T0 ~ 21.60) E_trunc DOMINATES with share ~ 0.592, E_coll drops to the runner-up (~ 0.407 = sigma) and ' +
    'E_flow is smaller still (~ 0.00057). Because E_flow is negligible at both heights, sigma ~ E_coll / (E_trunc + ' +
    'E_coll), so the E_trunc-vs-E_coll balance crosses exactly at sigma = 1/2 (the imp-35337 crossover landmark), ' +
    'which sits BETWEEN the two knees; E_flow decays monotonically (log T0 / T0) and never competes. So the elbow ' +
    'is a collision-dominated bend and the flattest point is a truncation-dominated region -- the two knees describe ' +
    'opposite sides of the E_trunc = E_coll crossover. Reuses the pinned imp-3406 / imp-33582 constants and the ' +
    'imp-35853 knee locators unchanged; derives no remainder; discharges nothing; changes no bound; establishes no ' +
    'operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb ' +
    'GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35853 (the two knee locators reused here); imp-35337 (E_trunc = E_coll crossover at sigma = 0.5); ' +
    'imp-33582 (sigma-decay model); imp-3220 / imp-3406 (RvM surrogate log-height); imp-2642 / imp-2643 ' +
    '(C_C = (1/8) sqrt(3 pi)); imp-2631 (E_trunc floor); imp-486 (GUE-conditional caveat). Literature: ' +
    'Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35889_E_SHARE_DECOMPOSITION_AT_KNEES_ASSERTIONS = [
  {
    // (1) same imp-33582 model in use: reproduces the interior peak that anchors the downslope search.
    id: 'imp35889-reproduces-imp33582-peak',
    description: 'peak N ~ 9.22e5 -- confirms the identical imp-33582 sigma model / downslope locator is in use',
    holds: () => Math.abs(N_PEAK / 9.22e5 - 1) < 5e-3,
  },
  {
    // (2) Kneedle elbow: E_coll dominates; E_coll share = sigma ~ 0.783; E_trunc runner-up; E_flow negligible.
    id: 'imp35889-kneedle-elbow-collision-dominated',
    description: 'Kneedle elbow (sigma ~ 0.783): E_coll DOMINATES with share ~ 0.783, E_trunc ~ 0.213, E_flow < 0.01',
    holds: () =>
      kneedleElbow.dominant === 'E_coll' &&
      Math.abs(kneedleElbow.shareColl - 0.783) < 5e-3 &&
      Math.abs(kneedleElbow.shareTrunc - 0.213) < 5e-3 &&
      kneedleElbow.shareFlow < 0.01,
  },
  {
    // (3) Flattest point: E_trunc dominates; E_coll share = sigma ~ 0.407; E_flow even smaller.
    id: 'imp35889-flattest-point-truncation-dominated',
    description: 'flattest point (sigma ~ 0.407): E_trunc DOMINATES with share ~ 0.592, E_coll ~ 0.407, E_flow < 0.01',
    holds: () =>
      flattestPoint.dominant === 'E_trunc' &&
      Math.abs(flattestPoint.shareTrunc - 0.592) < 5e-3 &&
      Math.abs(flattestPoint.shareColl - 0.407) < 5e-3 &&
      flattestPoint.shareFlow < flattestPoint.shareColl,
  },
  {
    // (4) the dominant term FLIPS and the E_trunc / E_coll ratio crosses 1 between the two knees.
    id: 'imp35889-dominant-term-flips-across-knees',
    description: 'dominant term flips E_coll -> E_trunc; truncOverColl < 1 at the elbow and > 1 at the flattest point',
    holds: () =>
      IMP35889_E_SHARE_DECOMPOSITION_AT_KNEES.dominantTermFlips === true &&
      kneedleElbow.truncOverColl < 1 &&
      flattestPoint.truncOverColl > 1 &&
      kneedleElbow.sigmaTarget > 0.5 &&
      flattestPoint.sigmaTarget < 0.5,
  },
  {
    // (5) E_flow is negligible at both knees and shrinks with height (log T0 / T0 decay).
    id: 'imp35889-eflow-negligible-and-decaying',
    description: 'E_flow share < 0.01 at both knees and smaller at the higher (flattest-point) knee than at the elbow',
    holds: () =>
      IMP35889_E_SHARE_DECOMPOSITION_AT_KNEES.eFlowNegligibleAtBothKnees === true &&
      flattestPoint.E_flow < kneedleElbow.E_flow &&
      flattestPoint.logT0 > kneedleElbow.logT0,
  },
  {
    // (6) internal consistency: the three shares sum to 1 and E_coll share reproduces the target sigma at each knee.
    id: 'imp35889-shares-sum-to-one-and-match-sigma',
    description: 'shareTrunc + shareFlow + shareColl ~ 1 at each knee; E_coll share equals the crossBelow target sigma',
    holds: () => {
      const s1 = kneedleElbow.shareTrunc + kneedleElbow.shareFlow + kneedleElbow.shareColl;
      const s2 = flattestPoint.shareTrunc + flattestPoint.shareFlow + flattestPoint.shareColl;
      return (
        Math.abs(s1 - 1) < 1e-3 &&
        Math.abs(s2 - 1) < 1e-3 &&
        Math.abs(kneedleElbow.shareColl - KNEEDLE_ELBOW_SIGMA) < 1e-3 &&
        Math.abs(flattestPoint.shareColl - FLATTEST_POINT_SIGMA) < 1e-3
      );
    },
  },
  {
    // (7) honesty gate: measurement only, conditional, no bound moves, imp-486 kept, imp-35337a OPEN, no refereed bound is changed, NO QED.
    id: 'imp35889-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35889_E_SHARE_DECOMPOSITION_AT_KNEES;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a\s+stays\s+OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35889_E_SHARE_DECOMPOSITION_AT_KNEES_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35889-e-share-decomposition-at-knees assertion failed: ${a.id}`);
  }
}
