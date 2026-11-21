/**
 * @module imp-35994-crossover-height-elasticities
 *
 * imp-35994 (accuracy, measurement): MEASURE the sensitivity of the imp-35950 sigma = 0.5
 * crossover height N_cross ~ 3.267e9 (log10 ~ 9.514) to perturbations of the two pinned
 * inputs E_trunc = 3.06e-5 (imp-2631) and C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643),
 * quantifying the crossover-height elasticities dlog N_cross / dlog E_trunc and
 * dlog N_cross / dlog C_C.
 *
 * imp-35950 located the E_trunc = E_coll (sigma = 0.5) crossover at N_cross ~ 3.267e9 by
 * downslope bisection on the surrogate sigma(N) = E_coll / (E_trunc + E_flow + E_coll) with
 * E_trunc and C_C held at their pinned values, but never propagated any uncertainty in those
 * inputs to the located height. This module reuses the IDENTICAL imp-3406 / imp-33582
 * sub-terms and the SAME downslope bisection (now parameterized in E_trunc and C_C) and takes
 * a symmetric log-space central finite difference of log N_cross about each pinned constant.
 *
 * WHAT THE MEASUREMENT SHOWS (the honest finding). The crossover height is a near-perfect
 * power law in the two constants:
 *   - dlog N_cross / dlog E_trunc ~ -2.098  (N_cross falls as E_trunc rises)
 *   - dlog N_cross / dlog C_C     ~ +2.102  (N_cross rises as C_C rises)
 * Both magnitudes sit just above the naive analytic value 2 that the balance C_C sqrt(L/N) =
 * E_trunc gives when the slow log-height factor L = log T0 is frozen: N_cross ~ C_C^2 L /
 * E_trunc^2 => the frozen-L elasticities are exactly +2 and -2. The measured ~2.10 excess
 * (~5%) is the drift contributed by L(N) increasing with N plus the ~0.1% E_flow tilt at the
 * balance point; the two elasticities are near-equal in magnitude and opposite in sign, as the
 * squared C_C / E_trunc ratio predicts. Both elasticities are FLAT to 4 sig figs across
 * relative perturbations of 1%, 5% and 10%, so the power law holds well beyond the stated
 * provenance widths.
 *
 * ROBUSTNESS BETWEEN THE KNEES. With elasticity ~2.1, a 10% relative perturbation of either
 * constant shifts N_cross by only ~0.087 decades (log10 N_cross ranges ~9.42..9.61 over the
 * full +/-10% box), so the crossover stays STRICTLY between the two imp-35853 knees (log10 N
 * 8.328 and 9.857) under all plausible perturbations. It would take a ~+46% perturbation of
 * C_C (or the matching drop in E_trunc) to push N_cross up to the flattest-point knee, and a
 * far larger swing to reach the elbow knee below -- neither is within the stated provenance.
 *
 * Measurement only; reuses the pinned imp-3406 / imp-33582 constants and the imp-35950
 * downslope locator unchanged (only wrapped to accept perturbed constants); derives no
 * remainder; discharges nothing; changes no bound; establishes no operator positivity;
 * C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb
 * GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35950-etrunc-ecoll-crossover-height (located N_cross ~ 3.267e9 with the constants pinned)
 * @see imp-35853-req4-required-height-continuous-sigma-knee (the two knee locators)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (source sigma model)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// EXACT imp-3406 / imp-33582 sub-terms (identical to imp-35950; no fresh model). E_trunc and
// C_C are now ARGUMENTS so the finite difference can perturb them without touching the pins.
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
function parts(N, eTrunc, cC) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = cC * Math.sqrt(L / N);
  const E_N = eTrunc + E_flow + E_coll;
  return E_coll / E_N; // sigma
}

// Interior peak (reproduces imp-33582 / imp-35813 N ~ 9.22e5) -- anchors the downslope search.
function dSigmadN(N, eTrunc, cC) {
  const h = N * 1e-6;
  return (parts(N + h, eTrunc, cC) - parts(N - h, eTrunc, cC)) / (2 * h);
}
function locatePeak(eTrunc, cC) {
  let a = Math.log(1e4);
  let b = Math.log(1e7);
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    if (dSigmadN(Math.exp(m), eTrunc, cC) > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// Downslope threshold crossing (N > N_peak) -- identical bisection to imp-35950.
function crossBelow(thr, eTrunc, cC) {
  let a = Math.log(locatePeak(eTrunc, cC));
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), eTrunc, cC) > thr) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

const CROSSOVER_SIGMA = 0.5;
const N_BASE = crossBelow(CROSSOVER_SIGMA, E_TRUNC_PT, C_C_PINNED);

// Symmetric log-space central finite difference: elasticity = d(log N_cross) / d(log const).
function elasticity(perturbEtrunc, rel) {
  const eUp = perturbEtrunc ? E_TRUNC_PT * (1 + rel) : E_TRUNC_PT;
  const eDn = perturbEtrunc ? E_TRUNC_PT * (1 - rel) : E_TRUNC_PT;
  const cUp = perturbEtrunc ? C_C_PINNED : C_C_PINNED * (1 + rel);
  const cDn = perturbEtrunc ? C_C_PINNED : C_C_PINNED * (1 - rel);
  const nUp = crossBelow(CROSSOVER_SIGMA, eUp, cUp);
  const nDn = crossBelow(CROSSOVER_SIGMA, eDn, cDn);
  return (Math.log(nUp) - Math.log(nDn)) / (Math.log(1 + rel) - Math.log(1 - rel));
}

const REL_STEPS = [0.01, 0.05, 0.1];
const elasEtrunc = REL_STEPS.map((r) => +elasticity(true, r).toFixed(6));
const elasCC = REL_STEPS.map((r) => +elasticity(false, r).toFixed(6));

// +/-10% box: does the crossover stay strictly between the two imp-35853 knees?
const ELBOW_LOG10 = +Math.log10(2.13e8).toFixed(4); // ~ 8.328 (collision-dominated, sigma ~ 0.783)
const FLATTEST_LOG10 = +Math.log10(7.2e9).toFixed(4); // ~ 9.857 (truncation-dominated, sigma ~ 0.407)
const BOX_REL = 0.1;
const boxCorners = [
  { label: 'E_trunc +10%', log10N: +Math.log10(crossBelow(CROSSOVER_SIGMA, E_TRUNC_PT * (1 + BOX_REL), C_C_PINNED)).toFixed(4) },
  { label: 'E_trunc -10%', log10N: +Math.log10(crossBelow(CROSSOVER_SIGMA, E_TRUNC_PT * (1 - BOX_REL), C_C_PINNED)).toFixed(4) },
  { label: 'C_C +10%', log10N: +Math.log10(crossBelow(CROSSOVER_SIGMA, E_TRUNC_PT, C_C_PINNED * (1 + BOX_REL))).toFixed(4) },
  { label: 'C_C -10%', log10N: +Math.log10(crossBelow(CROSSOVER_SIGMA, E_TRUNC_PT, C_C_PINNED * (1 - BOX_REL))).toFixed(4) },
];
const boxStaysBetweenKnees = boxCorners.every(
  (c) => c.log10N > ELBOW_LOG10 && c.log10N < FLATTEST_LOG10
);

// Decades shifted per 10% relative perturbation (from the mean elasticity, |elas| * ln(1.1) / ln(10)).
const meanAbsElas = (Math.abs(elasCC[0]) + Math.abs(elasEtrunc[0])) / 2;
const decadesPer10pct = +((meanAbsElas * Math.log(1.1)) / Math.log(10)).toFixed(4);

export const IMP35994_CROSSOVER_HEIGHT_ELASTICITIES = {
  id: 'imp-35994',
  proofSection: 'S-frontier',
  question:
    'imp-35950 located the sigma = 0.5 crossover at N_cross ~ 3.267e9 with E_trunc = 3.06e-5 ' +
    '(imp-2631) and C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643) pinned, but never propagated any ' +
    'uncertainty in those inputs to the located height. What are the crossover-height elasticities ' +
    'dlog N_cross / dlog E_trunc and dlog N_cross / dlog C_C, and does the crossover stay strictly ' +
    'between the two imp-35853 knees (log10 N 8.328 and 9.857) under plausible perturbations?',
  method:
    'Reuse the exact imp-3406 / imp-33582 sub-terms and the identical imp-35950 downslope bisection, ' +
    'now parameterized in E_trunc and C_C. Take a symmetric log-space central finite difference of ' +
    'log N_cross about each pinned constant at relative steps 1%, 5%, 10% to estimate the elasticities, ' +
    'and re-run the bisection at the four +/-10% box corners to test whether log10 N_cross stays ' +
    'strictly between the elbow (~ 8.328) and flattest-point (~ 9.857) knees.',
  N_baseline: +N_BASE.toExponential(6), // ~ 3.267e9 (reproduces imp-35950)
  log10N_baseline: +Math.log10(N_BASE).toFixed(4), // ~ 9.514
  relSteps: REL_STEPS,
  dlogN_dlogEtrunc: elasEtrunc, // ~ -2.098 at each step (flat)
  dlogN_dlogCC: elasCC, // ~ +2.102 at each step (flat)
  naiveFrozenLElasticity: 2, // frozen-L balance N ~ C_C^2 L / E_trunc^2 gives exactly +/-2
  decadesPer10pctPerturbation: decadesPer10pct, // ~ 0.087 decades of N_cross per 10% relative shift
  elbowLog10N: ELBOW_LOG10,
  flattestLog10N: FLATTEST_LOG10,
  boxCorners, // log10 N_cross at the four +/-10% corners (all ~ 9.42..9.61)
  boxStaysBetweenKnees, // true: crossover strictly between the two knees across the whole box
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). On the same imp-3406 / imp-33582 surrogate and the identical imp-35950 ' +
    'downslope bisection, the sigma = 0.5 crossover height N_cross ~ 3.267e9 (log10 ~ 9.514) is a ' +
    'near-perfect power law in the two pinned inputs: dlog N_cross / dlog E_trunc ~ -2.098 and ' +
    'dlog N_cross / dlog C_C ~ +2.102, both flat to 4 sig figs across relative perturbations of 1%, 5% ' +
    'and 10%. These sit just above the naive frozen-log-height value 2 that the balance C_C sqrt(L/N) = ' +
    'E_trunc gives (N_cross ~ C_C^2 L / E_trunc^2 => elasticities exactly +/-2); the ~5% excess is the ' +
    'drift from L = log T0 rising with N plus the ~0.1% E_flow tilt at the balance point, and the two ' +
    'elasticities being near-equal in magnitude with opposite sign is exactly the squared C_C / E_trunc ' +
    'dependence. With elasticity ~2.1, a 10% relative perturbation of either constant shifts N_cross by ' +
    'only ~0.087 decades (log10 N_cross ranges ~9.42..9.61 over the full +/-10% box), so the crossover ' +
    'stays STRICTLY between the two imp-35853 knees (log10 N 8.328 and 9.857) under all plausible ' +
    'perturbations. Reuses the pinned imp-3406 / imp-33582 constants and the imp-35950 locator unchanged ' +
    '(only wrapped to accept perturbed constants); derives no remainder; discharges nothing; changes no ' +
    'bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = ' +
    '3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35950 (located N_cross ~ 3.267e9 with the constants pinned); imp-35853 (the two knee locators); ' +
    'imp-35337 (E_trunc = E_coll crossover at sigma = 0.5); imp-33582 (sigma-decay model); imp-3220 / ' +
    'imp-3406 (RvM surrogate log-height); imp-2642 / imp-2643 (C_C = (1/8) sqrt(3 pi)); imp-2631 ' +
    '(E_trunc floor); imp-486 (GUE-conditional caveat). Literature: Riemann-von Mangoldt counting ' +
    'formula; Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35994_CROSSOVER_HEIGHT_ELASTICITIES_ASSERTIONS = [
  {
    // (1) baseline reproduces imp-35950: the parameterized locator lands on the same N_cross.
    id: 'imp35994-baseline-reproduces-imp35950',
    description: 'baseline N_cross ~ 3.267e9 (log10 ~ 9.514) reproduces imp-35950 with the constants pinned',
    holds: () =>
      Math.abs(IMP35994_CROSSOVER_HEIGHT_ELASTICITIES.log10N_baseline - 9.514) < 5e-3,
  },
  {
    // (2) E_trunc elasticity ~ -2.098, near the naive frozen-L value -2 (magnitude just above 2).
    id: 'imp35994-etrunc-elasticity-near-minus-two',
    description: 'dlog N_cross / dlog E_trunc ~ -2.098 (magnitude just above the frozen-L value 2)',
    holds: () =>
      elasEtrunc.every((e) => Math.abs(e + 2.098) < 5e-3) &&
      elasEtrunc.every((e) => e < -2 && e > -2.2),
  },
  {
    // (3) C_C elasticity ~ +2.102, near the naive frozen-L value +2 (magnitude just above 2).
    id: 'imp35994-cc-elasticity-near-plus-two',
    description: 'dlog N_cross / dlog C_C ~ +2.102 (magnitude just above the frozen-L value 2)',
    holds: () =>
      elasCC.every((e) => Math.abs(e - 2.102) < 5e-3) &&
      elasCC.every((e) => e > 2 && e < 2.2),
  },
  {
    // (4) elasticities are flat across the 1% / 5% / 10% steps (power law, not a local slope artifact).
    id: 'imp35994-elasticities-flat-across-steps',
    description: 'both elasticities constant to 4 sig figs across relative steps 1%, 5%, 10%',
    holds: () => {
      const spread = (a) => Math.max(...a) - Math.min(...a);
      return spread(elasEtrunc) < 1e-3 && spread(elasCC) < 1e-3;
    },
  },
  {
    // (5) near-symmetry: the two elasticities are near-equal in magnitude and opposite in sign.
    id: 'imp35994-elasticities-near-symmetric',
    description: '|dlog N/dlog C_C| ~ |dlog N/dlog E_trunc| with opposite sign (squared ratio structure)',
    holds: () =>
      elasEtrunc[0] < 0 &&
      elasCC[0] > 0 &&
      Math.abs(Math.abs(elasCC[0]) - Math.abs(elasEtrunc[0])) < 1e-2,
  },
  {
    // (6) robustness: crossover stays strictly between the two knees across the +/-10% box.
    id: 'imp35994-crossover-stays-between-knees',
    description: 'log10 N_cross strictly between the elbow (~ 8.328) and flattest (~ 9.857) knees over +/-10%',
    holds: () =>
      boxStaysBetweenKnees === true &&
      boxCorners.every(
        (c) => c.log10N > ELBOW_LOG10 && c.log10N < FLATTEST_LOG10
      ) &&
      Math.abs(decadesPer10pct - 0.087) < 5e-3,
  },
  {
    // (7) honesty gate: measurement only, conditional, no bound moves, imp-486 kept, imp-35337a OPEN, no refereed bound is changed, NO QED.
    id: 'imp35994-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35994_CROSSOVER_HEIGHT_ELASTICITIES;
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

for (const a of IMP35994_CROSSOVER_HEIGHT_ELASTICITIES_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35994-crossover-height-elasticities assertion failed: ${a.id}`);
  }
}
