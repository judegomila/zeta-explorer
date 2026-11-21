/**
 * @module imp-35950-etrunc-ecoll-crossover-height
 *
 * imp-35950 (accuracy, measurement): LOCATE the exact height N of the E_trunc = E_coll
 * (sigma = 0.5) crossover that imp-35889 placed BETWEEN its two knees but never located,
 * and tabulate E_flow's residual share and the E_trunc / E_coll ratio precisely there.
 *
 * imp-35889 decomposed the full E(N) = E_trunc + E_flow + E_coll three-way split at the two
 * imp-35853 knees (Kneedle elbow sigma ~ 0.783, collision-dominated, N ~ 2.13e8; flattest
 * point sigma ~ 0.407, truncation-dominated, N ~ 7.20e9) and noted the E_trunc = E_coll
 * crossover (the imp-35337 sigma = 0.5 landmark) sits BETWEEN the two knees -- but it never
 * located that crossover's height. This module reuses the EXACT imp-3406 / imp-33582
 * sub-terms and the identical imp-35889 / imp-35853 downslope bisection to pin N_cross where
 * sigma(N) = 0.5, then tabulates the three fractional shares, the E_trunc / E_coll ratio
 * (expected ~ 1) and the residual E_flow share (expected << both) precisely at N_cross.
 *
 * WHAT THE MEASUREMENT SHOWS (the honest finding). On the same surrogate, sigma(N) = 0.5 lands
 * at N_cross ~ 3.267e9 (log10 N_cross ~ 9.514, log T0 ~ 20.85). There:
 *   - shareTrunc ~ 0.4990, shareColl ~ 0.5000 (= sigma by construction), so E_trunc and E_coll
 *     each carry essentially half the mass and E_trunc / E_coll ~ 0.9981 (~ 1, as expected).
 *   - E_flow is the tiny residual: share ~ 9.51e-4 (E_flow ~ 5.83e-8), far below both.
 * Because E_flow is negligible, sigma ~ E_coll / (E_trunc + E_coll), so sigma = 0.5 is
 * (up to that ~ 0.1% E_flow tilt) exactly the E_trunc = E_coll balance point. The crossover
 * height INTERPOLATES between the two knees: log10 N_cross ~ 9.514 sits between the Kneedle
 * elbow (log10 N ~ 8.328, N ~ 2.13e8, sigma ~ 0.783 > 1/2) and the flattest point (log10 N ~
 * 9.857, N ~ 7.20e9, sigma ~ 0.407 < 1/2), confirming imp-35889's BETWEEN-the-knees claim.
 *
 * Measurement only; reuses the pinned imp-3406 / imp-33582 constants and the imp-35853 /
 * imp-35889 downslope locator unchanged; derives no remainder; discharges nothing; changes
 * no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643),
 * E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a
 * stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35889-e-share-decomposition-at-knees (placed the crossover between its two knees)
 * @see imp-35853-req4-required-height-continuous-sigma-knee (the two knee locators)
 * @see imp-35337-sigma-crossover-landmarks (E_trunc = E_coll crossover at sigma = 0.5)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (source sigma model)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// EXACT imp-3406 / imp-3529 / imp-33582 sub-terms (identical to imp-35889; no fresh model).
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

// Downslope threshold crossing (N > N_peak): first N with sigma below thr -- identical to imp-35889.
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

// The imp-35337 E_trunc = E_coll crossover sigma landmark (where E_flow negligible).
const CROSSOVER_SIGMA = 0.5;
const N_CROSS = crossBelow(CROSSOVER_SIGMA);
const P_CROSS = parts(N_CROSS);

// The two imp-35889 knee heights (log10) that the crossover should interpolate between.
const ELBOW_N = 2.13e8; // Kneedle elbow (sigma ~ 0.783, collision-dominated)
const FLATTEST_N = 7.2e9; // flattest point (sigma ~ 0.407, truncation-dominated)

const crossover = {
  sigmaTarget: CROSSOVER_SIGMA,
  N: +N_CROSS.toExponential(6),
  log10N: +Math.log10(N_CROSS).toFixed(4),
  logT0: +P_CROSS.logT0.toFixed(4),
  E_trunc: +P_CROSS.E_trunc.toExponential(4),
  E_flow: +P_CROSS.E_flow.toExponential(4),
  E_coll: +P_CROSS.E_coll.toExponential(4),
  E_N: +P_CROSS.E_N.toExponential(4),
  shareTrunc: +(P_CROSS.E_trunc / P_CROSS.E_N).toFixed(6),
  shareFlow: +(P_CROSS.E_flow / P_CROSS.E_N).toExponential(4),
  shareColl: +(P_CROSS.E_coll / P_CROSS.E_N).toFixed(6),
  truncOverColl: +(P_CROSS.E_trunc / P_CROSS.E_coll).toFixed(6),
};

// The crossover log10 height interpolates between the two knees (elbow < crossover < flattest).
const interpolatesBetweenKnees =
  Math.log10(ELBOW_N) < crossover.log10N && crossover.log10N < Math.log10(FLATTEST_N);

export const IMP35950_ETRUNC_ECOLL_CROSSOVER_HEIGHT = {
  id: 'imp-35950',
  proofSection: 'S-frontier',
  question:
    'imp-35889 placed the E_trunc = E_coll (sigma = 0.5) crossover BETWEEN its two knees but never ' +
    'located it. What is the exact height N_cross of that crossover on the same imp-3406 / imp-33582 ' +
    'surrogate, and what are the three fractional shares, the E_trunc / E_coll ratio and the residual ' +
    'E_flow share precisely there?',
  method:
    'Reuse the exact imp-3406 / imp-33582 sub-terms (E_trunc = 3.06e-5 fixed; E_flow = C_F (log T0 / T0) ' +
    'exp|t_c|; E_coll = C_C sqrt(log T0 / N)) and the identical imp-35889 / imp-35853 downslope bisection. ' +
    'Bisect sigma(N) = E_coll / E(N) on the post-peak downslope for the target sigma = 0.5 to locate ' +
    'N_cross, then tabulate at N_cross: the three shares, E_trunc / E_coll (should be ~ 1) and the ' +
    'residual E_flow share (expected << both). Compare log10 N_cross against the elbow (N ~ 2.13e8) and ' +
    'flattest-point (N ~ 7.20e9) knees to confirm it interpolates between them.',
  crossover, // N_cross ~ 3.267e9, log10 ~ 9.514; shareTrunc ~ 0.499, shareColl ~ 0.500, E_flow share ~ 9.5e-4
  elbowLog10N: +Math.log10(ELBOW_N).toFixed(4), // ~ 8.328 (collision-dominated, sigma ~ 0.783)
  flattestLog10N: +Math.log10(FLATTEST_N).toFixed(4), // ~ 9.857 (truncation-dominated, sigma ~ 0.407)
  interpolatesBetweenKnees, // log10 N_cross sits strictly between the two knee heights
  eFlowResidualNegligible: crossover.shareFlow < 0.01, // E_flow the tiny residual at the balance point
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). On the same imp-3406 / imp-33582 surrogate and the identical imp-35889 / ' +
    'imp-35853 downslope bisection, the E_trunc = E_coll (sigma = 0.5) crossover that imp-35889 placed ' +
    'BETWEEN its two knees lands at N_cross ~ 3.267e9 (log10 N_cross ~ 9.514, log T0 ~ 20.85). There ' +
    'E_trunc and E_coll each carry essentially half the mass -- shareTrunc ~ 0.4990, shareColl ~ 0.5000 ' +
    '(= sigma by construction) -- so E_trunc / E_coll ~ 0.9981 (~ 1, as expected). E_flow is the tiny ' +
    'residual: share ~ 9.51e-4 (E_flow ~ 5.83e-8), far below both. Because E_flow is negligible, sigma ~ ' +
    'E_coll / (E_trunc + E_coll), so sigma = 0.5 is (up to that ~ 0.1% E_flow tilt) exactly the ' +
    'E_trunc = E_coll balance point. The crossover height INTERPOLATES between the two imp-35889 knees: ' +
    'log10 N_cross ~ 9.514 sits strictly between the Kneedle elbow (log10 N ~ 8.328, N ~ 2.13e8, sigma ~ ' +
    '0.783 > 1/2) and the flattest point (log10 N ~ 9.857, N ~ 7.20e9, sigma ~ 0.407 < 1/2), confirming ' +
    'imp-35889 BETWEEN-the-knees claim. Reuses the pinned imp-3406 / imp-33582 constants and the ' +
    'imp-35853 / imp-35889 locators unchanged; derives no remainder; discharges nothing; changes no ' +
    'bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = ' +
    '3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35889 (placed the crossover between its two knees); imp-35853 (the two knee locators reused ' +
    'here); imp-35337 (E_trunc = E_coll crossover at sigma = 0.5); imp-33582 (sigma-decay model); ' +
    'imp-3220 / imp-3406 (RvM surrogate log-height); imp-2642 / imp-2643 (C_C = (1/8) sqrt(3 pi)); ' +
    'imp-2631 (E_trunc floor); imp-486 (GUE-conditional caveat). Literature: Riemann-von Mangoldt ' +
    'counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35950_ETRUNC_ECOLL_CROSSOVER_HEIGHT_ASSERTIONS = [
  {
    // (1) same imp-33582 model in use: reproduces the interior peak that anchors the downslope search.
    id: 'imp35950-reproduces-imp33582-peak',
    description: 'peak N ~ 9.22e5 -- confirms the identical imp-33582 sigma model / downslope locator is in use',
    holds: () => Math.abs(N_PEAK / 9.22e5 - 1) < 5e-3,
  },
  {
    // (2) crossover located: sigma(N_cross) = 0.5 to bisection tolerance; N_cross ~ 3.267e9, log10 ~ 9.514.
    id: 'imp35950-crossover-located-at-sigma-half',
    description: 'sigma(N_cross) = 0.5; N_cross ~ 3.267e9 (log10 ~ 9.514), log T0 ~ 20.85',
    holds: () =>
      Math.abs(P_CROSS.sigma - 0.5) < 1e-6 &&
      Math.abs(crossover.log10N - 9.514) < 5e-3 &&
      Math.abs(crossover.logT0 - 20.85) < 5e-2,
  },
  {
    // (3) E_trunc = E_coll balance: each ~ half the mass, ratio ~ 1.
    id: 'imp35950-etrunc-ecoll-balance-ratio-one',
    description: 'shareTrunc ~ 0.499 and shareColl ~ 0.500 (= sigma); E_trunc / E_coll ~ 1 (0.998)',
    holds: () =>
      Math.abs(crossover.shareColl - 0.5) < 1e-4 &&
      Math.abs(crossover.shareTrunc - 0.499) < 5e-3 &&
      Math.abs(crossover.truncOverColl - 1) < 5e-3,
  },
  {
    // (4) E_flow is the tiny residual at the balance point (<< both other terms).
    id: 'imp35950-eflow-residual-negligible',
    description: 'E_flow share ~ 9.5e-4 << shareTrunc, shareColl -- the residual term at the crossover',
    holds: () =>
      crossover.shareFlow < 0.01 &&
      crossover.shareFlow < crossover.shareTrunc &&
      crossover.shareFlow < crossover.shareColl,
  },
  {
    // (5) the crossover height interpolates between the two imp-35889 knees (elbow < crossover < flattest).
    id: 'imp35950-interpolates-between-knees',
    description: 'log10 N_cross ~ 9.514 sits strictly between the elbow (~ 8.328) and flattest-point (~ 9.857) knees',
    holds: () =>
      IMP35950_ETRUNC_ECOLL_CROSSOVER_HEIGHT.interpolatesBetweenKnees === true &&
      crossover.log10N > IMP35950_ETRUNC_ECOLL_CROSSOVER_HEIGHT.elbowLog10N &&
      crossover.log10N < IMP35950_ETRUNC_ECOLL_CROSSOVER_HEIGHT.flattestLog10N,
  },
  {
    // (6) internal consistency: the three shares sum to 1 and E_coll share reproduces the target sigma.
    id: 'imp35950-shares-sum-to-one-and-match-sigma',
    description: 'shareTrunc + shareFlow + shareColl ~ 1; E_coll share equals the crossBelow target sigma = 0.5',
    holds: () => {
      const s = crossover.shareTrunc + crossover.shareFlow + crossover.shareColl;
      return Math.abs(s - 1) < 1e-3 && Math.abs(crossover.shareColl - CROSSOVER_SIGMA) < 1e-3;
    },
  },
  {
    // (7) honesty gate: measurement only, conditional, no bound moves, imp-486 kept, imp-35337a OPEN, no refereed bound is changed, NO QED.
    id: 'imp35950-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35950_ETRUNC_ECOLL_CROSSOVER_HEIGHT;
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

for (const a of IMP35950_ETRUNC_ECOLL_CROSSOVER_HEIGHT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35950-etrunc-ecoll-crossover-height assertion failed: ${a.id}`);
  }
}
