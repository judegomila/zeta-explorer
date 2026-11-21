/**
 * @module imp-35968-e-trunc-coll-crossover-location
 *
 * imp-35968 (accuracy, measurement): LOCATE in shared N the E_trunc = E_coll crossover
 * height (the imp-35337 sigma = 1/2 landmark) that imp-35889 asserted "sits BETWEEN the two
 * imp-35853 knees" but never located, and MEASURE its log10-N distance to each knee and to
 * the imp-33701 sigmoid-inflection decade [1e10, 1e11].
 *
 * imp-35889 decomposed E(N) = E_trunc + E_flow + E_coll at the two imp-35853 knees (Kneedle
 * elbow sigma ~ 0.783 at N ~ 2.13e8; flattest point sigma ~ 0.407 at N ~ 7.20e9) and, noting
 * E_flow is negligible at both, argued sigma ~ E_coll / (E_trunc + E_coll) so the E_trunc =
 * E_coll balance crosses at sigma = 1/2 -- somewhere BETWEEN the elbow (collision-dominated)
 * and the flattest point (truncation-dominated). It never gave that crossover N. This module
 * reuses the IDENTICAL imp-3406 / imp-33582 sub-terms and imp-35853 downslope locator, then
 * bisects the ratio E_trunc / E_coll = 1 directly to pin the crossover height.
 *
 * WHAT THE LOCATION SHOWS (the honest finding).
 *   - The E_trunc = E_coll crossover sits at N_cross ~ 3.28e9 (log10 N ~ 9.516, log T0 ~ 20.858),
 *     where sigma ~ 0.4999 (just below 1/2 because the tiny positive E_flow pushes the collision
 *     share fractionally under one half). This CONFIRMS the imp-35889 ordering
 *     N_elbow (~2.13e8) < N_cross (~3.28e9) < N_flat (~7.20e9).
 *   - Distance to the knees (log10 N): the crossover lies ~1.16 decades ABOVE the Kneedle
 *     elbow and ~0.37 decade BELOW the flattest point, so it is markedly closer to the flattest
 *     (truncation-dominated) knee -- the E_trunc = E_coll balance is nearly at the flattest bend,
 *     consistent with the flattest point sitting only slightly past crossover (sigma 0.407 < 1/2).
 *   - Relative to the imp-33701 inflection decade [1e10, 1e11] (log10 N in [10, 11]): the
 *     crossover falls ~0.51 decade BELOW the lower edge of that decade. So the E_trunc = E_coll
 *     dominance flip PRECEDES the imp-33701 sigma-ramp inflection -- the collision term already
 *     yields to the truncation floor about half a decade before the required-height sigmoid
 *     accelerates most steeply.
 *
 * Measurement only; reuses the pinned imp-3406 / imp-33582 constants and the imp-35853 knee
 * locator unchanged; derives no remainder; discharges nothing; changes no bound; establishes
 * no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5
 * (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; NO QED;
 * no refereed bound is changed.
 *
 * @see imp-35889-e-share-decomposition-at-knees (asserts the crossover is between the knees)
 * @see imp-35853-req4-required-height-continuous-sigma-knee (the two knee locators)
 * @see imp-35337-sigma-landmarks-double-double-certification (E_trunc = E_coll at sigma = 0.5)
 * @see imp-33701-sigma-postpeak-ramp-curvature-inflection (the [1e10,1e11] inflection decade)
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

// The two imp-35853 knee N heights (Kneedle elbow / flattest point) -- same locator as imp-35889.
const N_ELBOW = crossBelow(0.783); // ~2.13e8, collision-dominated bend
const N_FLAT = crossBelow(0.407); // ~7.20e9, truncation-dominated region

// Locate the E_trunc = E_coll crossover DIRECTLY by bisecting the ratio E_coll / E_trunc = 1.
// E_coll = C_C sqrt(log T0 / N) decreases with N while E_trunc is fixed, so the ratio is
// monotone-decreasing across the downslope: > 1 below N_cross, < 1 above it.
function locateCrossover() {
  let a = Math.log(N_PEAK);
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    const p = parts(Math.exp(m));
    if (p.E_coll / p.E_trunc > 1) a = m; // still collision-heavy -> go higher
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_CROSS = locateCrossover();
const P_CROSS = parts(N_CROSS);

// imp-33701 sigmoid-inflection decade (the single D2 sign change) -- log10 N in [10, 11].
const INFLECTION_DECADE_LO = 10; // log10(1e10)
const INFLECTION_DECADE_HI = 11; // log10(1e11)

const log10 = (x) => Math.log10(x);
const lgCross = log10(N_CROSS);
const lgElbow = log10(N_ELBOW);
const lgFlat = log10(N_FLAT);

// Signed log10-N distances (positive = crossover is ABOVE the reference).
const distToElbowDecades = lgCross - lgElbow; // > 0: crossover above the elbow
const distToFlatDecades = lgFlat - lgCross; // > 0: flattest point above crossover
// Distance to the inflection decade: 0 if inside; else signed gap to the nearer edge.
const distToInflectionDecade =
  lgCross < INFLECTION_DECADE_LO
    ? lgCross - INFLECTION_DECADE_LO // negative: below the decade
    : lgCross > INFLECTION_DECADE_HI
      ? lgCross - INFLECTION_DECADE_HI // positive: above the decade
      : 0; // inside the decade

export const IMP35968_E_TRUNC_COLL_CROSSOVER_LOCATION = {
  id: 'imp-35968',
  proofSection: 'S-frontier',
  question:
    'imp-35889 asserted the E_trunc = E_coll crossover (imp-35337 sigma = 1/2 landmark) sits BETWEEN the two ' +
    'imp-35853 knees but never located it. WHERE in shared N is that crossover, does N_elbow < N_cross < N_flat ' +
    'hold, and how far (log10 N) is it from each knee and from the imp-33701 inflection decade [1e10, 1e11]?',
  method:
    'Reuse the exact imp-3406 / imp-33582 sub-terms (E_trunc = 3.06e-5 fixed; E_flow = C_F (log T0 / T0) exp|t_c|; ' +
    'E_coll = C_C sqrt(log T0 / N)) and the imp-35853 downslope locator. Bisect the monotone ratio E_coll / E_trunc ' +
    '= 1 to pin N_cross, recover the two knee heights with the same crossBelow locator, then form the signed ' +
    'log10-N distances to each knee and to the [1e10, 1e11] inflection decade.',
  N_cross: +N_CROSS.toExponential(4),
  log10_N_cross: +lgCross.toFixed(4),
  logT0_at_cross: +P_CROSS.logT0.toFixed(4),
  sigma_at_cross: +P_CROSS.sigma.toFixed(6), // ~0.4999: just below 1/2 (tiny E_flow)
  E_trunc_at_cross: +P_CROSS.E_trunc.toExponential(4),
  E_coll_at_cross: +P_CROSS.E_coll.toExponential(4),
  E_flow_at_cross: +P_CROSS.E_flow.toExponential(4),
  truncOverColl_at_cross: +(P_CROSS.E_trunc / P_CROSS.E_coll).toFixed(6), // ~1 by construction
  N_elbow: +N_ELBOW.toExponential(4),
  log10_N_elbow: +lgElbow.toFixed(4),
  N_flat: +N_FLAT.toExponential(4),
  log10_N_flat: +lgFlat.toFixed(4),
  ordering_elbow_lt_cross_lt_flat: N_ELBOW < N_CROSS && N_CROSS < N_FLAT,
  distToElbowDecades: +distToElbowDecades.toFixed(4), // ~+1.16 (crossover above the elbow)
  distToFlatDecades: +distToFlatDecades.toFixed(4), // ~+0.37 (flattest above crossover)
  distToInflectionDecade: +distToInflectionDecade.toFixed(4), // ~-0.51 (crossover below [1e10,1e11])
  crossoverBelowInflectionDecade: lgCross < INFLECTION_DECADE_LO,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Bisecting the monotone ratio E_coll / E_trunc = 1 on the SAME imp-3406 / imp-33582 ' +
    'surrogate places the E_trunc = E_coll crossover at N_cross ~ ' + N_CROSS.toExponential(3) + ' (log10 N ~ ' +
    lgCross.toFixed(2) + ', log T0 ~ ' + P_CROSS.logT0.toFixed(2) + '), where sigma ~ ' + P_CROSS.sigma.toFixed(4) +
    ' (just below 1/2 because the tiny positive E_flow pushes the collision share fractionally under one half). ' +
    'This CONFIRMS the imp-35889 ordering N_elbow (~' + N_ELBOW.toExponential(2) + ') < N_cross < N_flat (~' +
    N_FLAT.toExponential(2) + '). The crossover lies ~' + distToElbowDecades.toFixed(2) + ' decades above the ' +
    'Kneedle elbow and ~' + distToFlatDecades.toFixed(2) + ' decade below the flattest point, so it is markedly ' +
    'closer to the truncation-dominated flattest knee. Relative to the imp-33701 inflection decade [1e10, 1e11] it ' +
    'sits ~' + Math.abs(distToInflectionDecade).toFixed(2) + ' decade below the lower edge, so the E_trunc = E_coll ' +
    'dominance flip PRECEDES the imp-33701 sigma-ramp inflection by about half a decade. Measurement only; reuses ' +
    'the pinned imp-3406 / imp-33582 constants and the imp-35853 knee locator unchanged; derives no remainder; ' +
    'discharges nothing; changes no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / ' +
    'imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays ' +
    'OPEN; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35889 (asserts the crossover between the knees); imp-35853 (the two knee locators reused here); ' +
    'imp-35337 (E_trunc = E_coll crossover at sigma = 0.5); imp-33701 (the [1e10,1e11] inflection decade); ' +
    'imp-33582 (sigma-decay model); imp-3220 / imp-3406 (RvM surrogate log-height); imp-2642 / imp-2643 ' +
    '(C_C = (1/8) sqrt(3 pi)); imp-2631 (E_trunc floor); imp-486 (GUE-conditional caveat). Literature: ' +
    'Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35968_E_TRUNC_COLL_CROSSOVER_LOCATION_ASSERTIONS = [
  {
    // (1) same imp-33582 model in use: reproduces the interior peak that anchors the downslope search.
    id: 'imp35968-reproduces-imp33582-peak',
    description: 'peak N ~ 9.22e5 -- confirms the identical imp-33582 sigma model / downslope locator is in use',
    holds: () => Math.abs(N_PEAK / 9.22e5 - 1) < 5e-3,
  },
  {
    // (2) the crossover is a genuine E_trunc = E_coll balance: the ratio is 1 to bisection tolerance.
    id: 'imp35968-crossover-is-etrunc-equals-ecoll',
    description: 'at N_cross the ratio E_trunc / E_coll ~ 1 (to bisection tolerance) -- a true balance point',
    holds: () => Math.abs(P_CROSS.E_trunc / P_CROSS.E_coll - 1) < 1e-4,
  },
  {
    // (3) sigma at the crossover is ~1/2 (just below, since E_flow > 0) -- matches the imp-35337 landmark.
    id: 'imp35968-sigma-at-crossover-is-one-half',
    description: 'sigma at the crossover ~ 0.5 (fractionally below, E_flow > 0) -- the imp-35337 sigma = 1/2 landmark',
    holds: () => Math.abs(P_CROSS.sigma - 0.5) < 5e-3 && P_CROSS.sigma < 0.5,
  },
  {
    // (4) the imp-35889 ordering N_elbow < N_cross < N_flat holds.
    id: 'imp35968-ordering-between-knees',
    description: 'N_elbow < N_cross < N_flat -- confirms imp-35889 assertion that the crossover sits between the knees',
    holds: () =>
      IMP35968_E_TRUNC_COLL_CROSSOVER_LOCATION.ordering_elbow_lt_cross_lt_flat === true &&
      N_ELBOW < N_CROSS &&
      N_CROSS < N_FLAT,
  },
  {
    // (5) distances: crossover is ~1.16 decades above the elbow and ~0.37 decade below the flattest point.
    id: 'imp35968-log10-distances-to-knees',
    description: 'crossover ~1.16 decades above the elbow, ~0.37 decade below the flattest point (both positive)',
    holds: () =>
      distToElbowDecades > 0 &&
      distToFlatDecades > 0 &&
      Math.abs(distToElbowDecades - 1.16) < 0.15 &&
      Math.abs(distToFlatDecades - 0.37) < 0.15 &&
      distToElbowDecades > distToFlatDecades, // closer to the flattest knee
  },
  {
    // (6) the crossover falls ~0.5 decade BELOW the imp-33701 inflection decade [1e10, 1e11].
    id: 'imp35968-below-imp33701-inflection-decade',
    description: 'crossover log10 N < 10 (below the [1e10,1e11] inflection decade) by ~0.5 decade',
    holds: () =>
      IMP35968_E_TRUNC_COLL_CROSSOVER_LOCATION.crossoverBelowInflectionDecade === true &&
      distToInflectionDecade < 0 &&
      Math.abs(distToInflectionDecade + 0.51) < 0.2,
  },
  {
    // (7) honesty gate: measurement only, conditional, no bound moves, imp-486 kept, imp-35337a OPEN, no refereed bound is changed, NO QED.
    id: 'imp35968-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35968_E_TRUNC_COLL_CROSSOVER_LOCATION;
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

for (const a of IMP35968_E_TRUNC_COLL_CROSSOVER_LOCATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35968-e-trunc-coll-crossover-location assertion failed: ${a.id}`);
  }
}
