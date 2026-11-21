/**
 * @module imp-36064-eflow-inclusion-tilt-closed-form
 *
 * imp-36064 (accuracy, derivation): DERIVE IN CLOSED FORM the imp-36022 E_flow-inclusion
 * tilt that separates the two E_trunc = E_coll crossover definitions -- the sigma = 1/2
 * balance (imp-35950 / imp-35994, E_coll = E_trunc + E_flow) and the raw ratio balance
 * (imp-35968, E_coll = E_trunc) -- and confirm the closed expression reproduces the pinned
 * ~0.0017-decade stored gap between the two modules.
 *
 * THE CLOSED FORM (elementary; no fresh model).
 * Write f = E_flow / E_trunc, evaluated at the raw-ratio crossover height N_cross where by
 * definition E_coll = E_trunc. There the three imp-3406 / imp-33582 sub-terms are
 *   E_trunc = E_trunc,  E_flow = f E_trunc,  E_coll = E_trunc,
 * so the total is E_N = E_trunc (2 + f) and the collision share is
 *   sigma(N_cross) = E_coll / E_N = 1 / (2 + f)   < 1/2   (since f > 0).
 * The tilt below the sigma = 1/2 target is therefore, in closed form,
 *   1/2 - sigma(N_cross) = 1/2 - 1/(2 + f)
 *                       = ((2 + f) - 2) / (2 (2 + f))
 *                       = f / (2 (2 + f))
 *                       = (E_flow/E_trunc) / (2 (2 + E_flow/E_trunc)),
 * exactly the expression imp-36022 quoted but never derived. This is a SIGMA-space tilt: it
 * says the raw-ratio crossover sits at collision share 1/(2+f), a hair under one half.
 *
 * FROM SIGMA-TILT TO THE STORED DECADE GAP. The two modules bisect on log10 N, so the SIGMA
 * tilt maps to a DECADE separation through the local downslope steepness s = |d sigma / d log10 N|
 * at N_cross:
 *   Delta log10 N (ratio def above sigma def) = (1/2 - sigma(N_cross)) / s
 *                                            = [f / (2 (2 + f))] / s.
 * With the pinned sub-terms at N_cross ~ 3.28e9 (log T0 ~ 20.858): f = E_flow/E_trunc ~
 * 1.8992e-3, so sigma(N_cross) = 1/(2 + f) ~ 0.499526 and the tilt f/(2(2+f)) ~ 4.7436e-4.
 * The local slope s ~ 0.27382 per decade converts that to Delta log10 N ~ 4.7436e-4 / 0.27382
 * ~ 1.7324e-3 decade -- reproducing the stored gap imp-35968 log10 9.5159 minus imp-35950
 * log10 9.5142 = +0.0017 to four decimals. So the entire genuine separation between the two
 * crossover definitions is the E_flow-inclusion tilt, now pinned in closed form.
 *
 * Derivation within the imp-33582 extrapolation component model only; reuses the byte-identical
 * imp-3406 / imp-33582 sub-terms and the pinned imp-35968 / imp-35950 stored objects unchanged;
 * derives no remainder; discharges nothing; changes no bound; establishes no operator
 * positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and
 * C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; NOT rigorous; NO QED;
 * no refereed bound is changed.
 *
 * @see imp-36022-etrunc-ecoll-crossover-reconciliation (names the tilt; never derives it)
 * @see imp-35968-e-trunc-coll-crossover-location (raw ratio E_coll/E_trunc = 1; stored log10 9.5159)
 * @see imp-35950-etrunc-ecoll-crossover-height (sigma = 0.5 bisection; stored log10 9.5142)
 * @see imp-35994-crossover-height-elasticities (same sigma = 0.5 locator reused)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP35968_E_TRUNC_COLL_CROSSOVER_LOCATION } from './imp-35968-e-trunc-coll-crossover-location.js';
import { IMP35950_ETRUNC_ECOLL_CROSSOVER_HEIGHT } from './imp-35950-etrunc-ecoll-crossover-height.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any derivation here)

// EXACT imp-3406 / imp-33582 sub-terms (byte-identical to imp-35950 / imp-35968 / imp-36022).
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

// imp-35968 raw-ratio crossover N_cross: bisect E_coll / E_trunc = 1 (E_flow excluded).
function locateRatioCrossover() {
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
// imp-35950 sigma = 0.5 crossover N_cross: bisect sigma(N) = 0.5 (E_coll = E_trunc + E_flow).
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

const N_RATIO = locateRatioCrossover();
const N_SIGMA = crossBelow(0.5);
const P_RATIO = parts(N_RATIO);

// The dimensionless flow-to-truncation ratio at the raw-ratio crossover.
const f = P_RATIO.E_flow / P_RATIO.E_trunc; // ~ 1.8992e-3

// CLOSED FORM: collision share at the crossover, and the tilt below 1/2.
const sigmaClosed = 1 / (2 + f); // = sigma(N_cross)
const tiltClosed = f / (2 * (2 + f)); // = 1/2 - sigma(N_cross), the imp-36022 tilt
// Direct numeric tilt from the recomputed parts (independent of the closed algebra).
const tiltNumeric = 0.5 - P_RATIO.sigma;

// Local downslope steepness s = |d sigma / d log10 N| at the crossover (sigma-tilt -> decade gap).
const lgRatio = Math.log10(N_RATIO); // ~ 9.5159
const lgSigma = Math.log10(N_SIGMA); // ~ 9.5142
const D_LOG10 = 1e-6;
const slope =
  (sigma(Math.pow(10, lgRatio + D_LOG10)) - sigma(Math.pow(10, lgRatio - D_LOG10))) /
  (2 * D_LOG10); // negative on the downslope
const sAbs = Math.abs(slope);
// Decade separation predicted by the closed tilt divided by the local slope.
const decadeFromTilt = tiltClosed / sAbs;
// Actual decade gap between the two recomputed crossovers.
const decadeGap = lgRatio - lgSigma; // ~ +0.0017324

// The pinned STORED gap the closed form must reproduce.
const stored35968Log10 = IMP35968_E_TRUNC_COLL_CROSSOVER_LOCATION.log10_N_cross; // 9.5159
const stored35950Log10 = IMP35950_ETRUNC_ECOLL_CROSSOVER_HEIGHT.crossover.log10N; // 9.5142
const storedGapDecades = stored35968Log10 - stored35950Log10; // ~ +0.0017

export const IMP36064_EFLOW_INCLUSION_TILT_CLOSED_FORM = {
  id: 'imp-36064',
  proofSection: 'S-frontier',
  question:
    'imp-36022 quoted the E_flow-inclusion tilt 1/2 - sigma(N_cross) = 1/(2+f) separating the ' +
    'imp-35950 sigma = 0.5 crossover from the imp-35968 raw-ratio E_coll/E_trunc = 1 crossover, ' +
    'but never derived it. Derive the tilt in closed form from the imp-3406 / imp-33582 sub-terms, ' +
    'evaluate f = E_flow/E_trunc at the crossover, and confirm the closed expression reproduces the ' +
    'pinned ~0.0017-decade stored gap between the two modules.',
  method:
    'At the raw-ratio crossover E_coll = E_trunc, so with f = E_flow/E_trunc the total is ' +
    'E_N = E_trunc (2 + f) and the collision share is sigma = 1/(2+f); hence the tilt below 1/2 is ' +
    '1/2 - 1/(2+f) = f/(2(2+f)). Recompute f, sigmaClosed and tiltClosed from the byte-identical ' +
    'sub-terms, measure the local downslope steepness s = |d sigma / d log10 N| at N_cross, convert ' +
    'the sigma-tilt to a decade separation tilt/s, and compare against the pinned imp-35968 / ' +
    'imp-35950 stored log10 N_cross gap.',
  f_flow_over_trunc: +f.toExponential(6), // ~ 1.899241e-3
  sigmaClosed: +sigmaClosed.toFixed(6), // ~ 0.499526 = 1/(2+f)
  sigmaNumeric: +P_RATIO.sigma.toFixed(6), // ~ 0.499526 (must match sigmaClosed)
  tiltClosed: +tiltClosed.toExponential(6), // ~ 4.743597e-4 = f/(2(2+f))
  tiltNumeric: +tiltNumeric.toExponential(6), // ~ 4.743597e-4 (must match tiltClosed)
  localSlopePerDecade: +sAbs.toFixed(6), // ~ 0.273816 = |d sigma / d log10 N| at N_cross
  decadeFromTilt: +decadeFromTilt.toExponential(6), // ~ 1.732401e-3 (tilt / slope)
  decadeGapRecomputed: +decadeGap.toFixed(6), // ~ +0.001732
  storedGapDecades: +storedGapDecades.toFixed(6), // ~ +0.0017 (imp-35968 - imp-35950)
  stored35968Log10: +stored35968Log10.toFixed(4), // 9.5159
  stored35950Log10: +stored35950Log10.toFixed(4), // 9.5142
  closedFormula: '1/2 - sigma(N_cross) = f/(2(2+f)), f = E_flow/E_trunc at E_coll = E_trunc',
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'CLOSED-FORM DERIVATION (NOT rigorous). At the raw-ratio crossover E_coll = E_trunc, so writing ' +
    'f = E_flow/E_trunc the three imp-3406 / imp-33582 sub-terms give E_N = E_trunc (2 + f) and the ' +
    'collision share sigma(N_cross) = 1/(2 + f) = ' + sigmaClosed.toFixed(6) + ', a hair below 1/2 ' +
    'because f = ' + f.toExponential(4) + ' > 0. The tilt below the sigma = 1/2 target is therefore, ' +
    'in closed form, 1/2 - 1/(2+f) = f/(2(2+f)) = ' + tiltClosed.toExponential(4) + ', matching the ' +
    'independently recomputed 0.5 - sigma = ' + tiltNumeric.toExponential(4) + ' to machine epsilon. ' +
    'That SIGMA-space tilt maps to the modules DECADE separation through the local downslope steepness ' +
    's = |d sigma / d log10 N| ~ ' + sAbs.toFixed(6) + ' per decade at N_cross ~ ' +
    N_RATIO.toExponential(3) + ': tilt/s = ' + decadeFromTilt.toExponential(4) + ' decade, reproducing ' +
    'the recomputed gap ' + decadeGap.toFixed(6) + ' and the pinned STORED gap (imp-35968 log10 ' +
    stored35968Log10.toFixed(4) + ' minus imp-35950 log10 ' + stored35950Log10.toFixed(4) + ' = +' +
    storedGapDecades.toFixed(4) + '). So the entire genuine separation between the two crossover ' +
    'definitions is the E_flow-inclusion tilt, now pinned in closed form. Derivation within the ' +
    'imp-33582 extrapolation component model only; reuses the byte-identical imp-3406 / imp-33582 ' +
    'sub-terms and the pinned imp-35968 / imp-35950 stored objects unchanged; derives no remainder; ' +
    'discharges nothing; changes no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) ' +
    '(imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are ' +
    'UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36022 (names the E_flow-inclusion tilt 1/(2+f); never derives it); imp-35968 (raw ratio ' +
    'E_coll/E_trunc = 1; stored log10 9.5159); imp-35950 (sigma = 0.5 bisection; stored log10 9.5142); ' +
    'imp-35994 (same sigma = 0.5 locator reused); imp-33582 (sigma-decay model); imp-3220 / imp-3406 ' +
    '(RvM surrogate log-height); imp-2642 / imp-2643 (C_C = (1/8) sqrt(3 pi)); imp-2631 (E_trunc floor); ' +
    'imp-486 (GUE-conditional caveat). Literature: Riemann-von Mangoldt counting formula; ' +
    'Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP36064_EFLOW_INCLUSION_TILT_CLOSED_FORM_ASSERTIONS = [
  {
    // (1) closed collision share 1/(2+f) equals the independently recomputed sigma at N_cross.
    id: 'imp36064-closed-sigma-matches-numeric',
    description: 'sigma(N_cross) = 1/(2+f) reproduces the recomputed collision share to machine epsilon',
    holds: () => Math.abs(sigmaClosed - P_RATIO.sigma) < 1e-12,
  },
  {
    // (2) closed tilt f/(2(2+f)) equals the direct numeric tilt 0.5 - sigma.
    id: 'imp36064-closed-tilt-matches-numeric',
    description: 'closed tilt f/(2(2+f)) equals 0.5 - sigma(N_cross) to machine epsilon',
    holds: () => Math.abs(tiltClosed - tiltNumeric) < 1e-12,
  },
  {
    // (3) algebraic identity: f/(2(2+f)) == 1/2 - 1/(2+f) exactly (independent of the specific f).
    id: 'imp36064-tilt-algebraic-identity',
    description: 'f/(2(2+f)) is algebraically identical to 1/2 - 1/(2+f)',
    holds: () => Math.abs(tiltClosed - (0.5 - 1 / (2 + f))) < 1e-15,
  },
  {
    // (4) the crossover sits just BELOW sigma = 1/2 (tilt positive, f > 0), as imp-36022 predicted.
    id: 'imp36064-crossover-below-one-half',
    description: 'sigma(N_cross) < 1/2 with a positive tilt ~ 4.74e-4 (f = E_flow/E_trunc > 0)',
    holds: () => sigmaClosed < 0.5 && tiltClosed > 0 && Math.abs(tiltClosed - 4.7436e-4) < 5e-7,
  },
  {
    // (5) sigma-tilt -> decade via the local slope reproduces the recomputed decade gap.
    id: 'imp36064-tilt-over-slope-reproduces-decade-gap',
    description: 'tilt / |d sigma / d log10 N| reproduces the recomputed ~0.0017324 decade gap',
    holds: () => Math.abs(decadeFromTilt - decadeGap) < 1e-6 && decadeGap > 0,
  },
  {
    // (6) the closed-form decade gap reproduces the PINNED stored gap (imp-35968 - imp-35950) ~ 0.0017.
    id: 'imp36064-reproduces-stored-decade-gap',
    description: 'closed tilt/slope ~ 0.001732 reproduces the pinned stored gap ~ +0.0017 (< 5e-4 off)',
    holds: () =>
      Math.abs(decadeFromTilt - storedGapDecades) < 5e-4 &&
      storedGapDecades > 0 &&
      storedGapDecades < 5e-3,
  },
  {
    // (7) honesty gate: derivation only, conditional, no bound moves, imp-486 kept, imp-35337a OPEN, no refereed bound is changed, NO QED.
    id: 'imp36064-derivation-only-no-qed',
    description: 'derivation only: not rigorous/unconditional, changes no bound, keeps imp-486, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP36064_EFLOW_INCLUSION_TILT_CLOSED_FORM;
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

for (const a of IMP36064_EFLOW_INCLUSION_TILT_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36064-eflow-inclusion-tilt-closed-form assertion failed: ${a.id}`);
  }
}
