/**
 * @module imp-36277-crossover-elasticity-analytic-derivation
 *
 * imp-36277 (numerical, derivation): DERIVE analytically the imp-36139 crossover-height elasticity
 * d log N_cross / d log E_trunc ~ -2.095 from the imp-33723 closed-form fixed point, confirming
 * that the +0.095 excess in magnitude over the raw -2 is EXACTLY the logarithmic-derivative
 * contribution of the log T0(N_cross) factor -- not a fitted residual.
 *
 * imp-36139 swept E_trunc over a half-to-double floor grid, re-ran the imp-35968 E_coll = E_trunc
 * bisector, and reported an OLS elasticity d log N_cross / d log E_trunc ~ -2.0953 (R^2 ~ 0.9999993)
 * with local endpoint slopes -2.090 (half floor) and -2.101 (double floor). It ATTRIBUTED the ~0.095
 * excess over the closed-form -2 to the growth of log T0(N_cross) as N_cross rises, but never derived
 * it. This module supplies the derivation.
 *
 * THE DERIVATION.
 *   The imp-33723 fixed point is E_coll(N_cross) = E_trunc, i.e. C_C sqrt(log T0(N) / N) = E_trunc,
 *   which rearranges to the closed form
 *       N_cross = (C_C / E_trunc)^2 * log T0(N_cross).
 *   Taking logs (C_C held fixed; only E_trunc varies, as in the imp-36139 sweep):
 *       log N_cross = 2 log C_C - 2 log E_trunc + log log T0(N_cross).
 *   Differentiate implicitly w.r.t. x = log E_trunc. Write S = d log N_cross / dx and
 *   g = d log logT0 / d log N evaluated at N_cross. The last term contributes g * S by the chain
 *   rule, so
 *       S = -2 + g * S   =>   S = -2 / (1 - g).
 *   The raw -2 is the leading N_cross ~ E_trunc^{-2} scaling; the correction 1/(1 - g) is the drift
 *   from the slowly growing log T0(N_cross) factor. The magnitude excess is exactly
 *       |S| - 2 = 2g / (1 - g),
 *   a pure function of g > 0. So the imp-36139 "+0.095" is not fitted noise -- it is 2g/(1-g).
 *
 * TWO INDEPENDENT DETERMINATIONS OF g (they must agree).
 *   (A) Finite-difference g = d logT0-log / d log N of log log T0(N) via effectiveHeightForN.
 *   (B) Closed form from the Riemann-von Mangoldt law itself. effectiveHeightForN inverts
 *       N = (T0 / 2pi)(u - 1) with u = log(T0 / 2pi), so with L = log T0:
 *           d log N / d log T0 = u / (u - 1),   d log L / d log T0 = 1 / L,
 *       hence  g = d log L / d log N = (u - 1) / (u * L).
 *   At the baseline crossover N_cross ~ 3.280294e9 (T0 ~ 1.1438e9, L ~ 20.858, u ~ 19.020) both give
 *   g ~ 0.045423, hence S ~ -2 / (1 - 0.045423) ~ -2.09517 and |S| - 2 ~ 0.09517 -- reproducing the
 *   imp-36139 OLS slope -2.0953 and its +0.095 excess to ~3 significant figures.
 *
 * ENDPOINT CROSS-CHECK. Evaluating S = -2/(1-g) at the half-floor crossover (N ~ 1.399e10, g smaller
 * because log T0 is larger and grows slower) gives S ~ -2.0894, and at the double-floor crossover
 * (N ~ 7.66e8) gives S ~ -2.1018 -- matching the imp-36139 local endpoint slopes -2.090 and -2.101.
 * The slight steepening toward smaller N is exactly the rise in g as log T0 shrinks, confirming the
 * curvature imp-36139 measured is the log T0(N_cross) drift, not an artifact.
 *
 * Derivation/measurement only; reuses the pinned imp-3406 / imp-33582 sub-terms and the imp-35968
 * crossover bisector unchanged; derives no remainder; discharges nothing; changes no bound;
 * establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643) and C_mb
 * GUE-conditional (imp-486) are UNTOUCHED; the nominal E_trunc = 3.06e-5 (imp-2631) baseline is
 * unchanged; imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-36139-etrunc-coll-crossover-sensitivity (measured the OLS elasticity -2.0953 this derives)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (the N_cross ~ (C_C/E_trunc)^2 logT0 fixed point)
 * @see imp-35968-e-trunc-coll-crossover-location (located N_cross at the single nominal E_trunc)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any derivation here)
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631) -- the nominal baseline

// EXACT imp-3406 / imp-33582 sub-terms (identical to imp-35968 / imp-36139), E_trunc parameterized.
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
function eColl(N) {
  const L = Math.log(effectiveHeightForN(N));
  return C_C_PINNED * Math.sqrt(L / N);
}

// Locate the E_coll = E_trunc crossover -- IDENTICAL imp-35968 / imp-36139 bisector.
function locateCrossover(Etr) {
  let a = Math.log(1e4);
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (eColl(Math.exp(m)) / Etr > 1) a = m; // still collision-heavy -> go higher
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// g = d log logT0 / d log N at N -- determination (A): centered finite difference in log N.
function gFiniteDiff(N) {
  const h = 1e-4;
  const lN = Math.log(N);
  const yp = Math.log(Math.log(effectiveHeightForN(Math.exp(lN + h))));
  const ym = Math.log(Math.log(effectiveHeightForN(Math.exp(lN - h))));
  return (yp - ym) / (2 * h);
}

// g = d log logT0 / d log N at N -- determination (B): closed form (u-1)/(u*L) from the RvM law
// N = (T0/2pi)(u-1), u = log(T0/2pi), L = log T0, which effectiveHeightForN inverts exactly.
function gClosedForm(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const u = Math.log(T0 / TWO_PI);
  return (u - 1) / (u * L);
}

// Analytic elasticity S = -2 / (1 - g) from the implicit differentiation.
const elasticity = (g) => -2 / (1 - g);

// Baseline (nominal E_trunc) and the imp-36139 half/double floor endpoints.
const N_BASE = locateCrossover(E_TRUNC_PT);
const N_HALF = locateCrossover(E_TRUNC_PT * 0.5);
const N_DOUBLE = locateCrossover(E_TRUNC_PT * 2.0);

const G_BASE_FD = gFiniteDiff(N_BASE);
const G_BASE_CF = gClosedForm(N_BASE);
const S_BASE = elasticity(G_BASE_CF);
const EXCESS_MAG = Math.abs(S_BASE) - 2; // = 2g/(1-g): the log T0(N_cross) drift contribution
const EXCESS_IDENTITY = (2 * G_BASE_CF) / (1 - G_BASE_CF); // must equal EXCESS_MAG exactly

const S_HALF = elasticity(gClosedForm(N_HALF)); // ~ -2.089 (matches imp-36139 half-floor local slope)
const S_DOUBLE = elasticity(gClosedForm(N_DOUBLE)); // ~ -2.102 (matches double-floor local slope)

const T0_BASE = effectiveHeightForN(N_BASE);

export const IMP36277_CROSSOVER_ELASTICITY_ANALYTIC_DERIVATION = {
  id: 'imp-36277',
  proofSection: 'S-frontier',
  question:
    'imp-36139 measured the E_trunc = E_coll crossover-height elasticity d log N_cross / d log E_trunc ~ -2.0953 by ' +
    'OLS and attributed the +0.095 excess over the closed-form -2 to log T0(N_cross) growth, but never derived it. ' +
    'Can the -2.095 be derived analytically from the imp-33723 fixed point N_cross ~ (C_C/E_trunc)^2 logT0(N_cross), ' +
    'and is the +0.095 excess exactly the logarithmic-derivative contribution of the log T0(N_cross) factor?',
  method:
    'Take logs of the imp-33723 closed form: log N_cross = 2 log C_C - 2 log E_trunc + log log T0(N_cross). ' +
    'Differentiate implicitly w.r.t. x = log E_trunc (C_C fixed) to get S = -2 + g S, g = d log logT0 / d log N ' +
    'at N_cross, hence S = -2/(1 - g) and |S| - 2 = 2g/(1 - g). Evaluate g two independent ways -- finite ' +
    'difference of log log T0 via effectiveHeightForN, and the closed form (u-1)/(u L) from the RvM law ' +
    'N = (T0/2pi)(u-1) -- at the baseline crossover and at the imp-36139 half/double floor endpoints, and compare ' +
    'S to the imp-36139 OLS slope and local endpoint slopes.',
  closedForm: 'N_cross = (C_C / E_trunc)^2 * log T0(N_cross)  [imp-33723 fixed point E_coll(N_cross) = E_trunc]',
  elasticityFormula: 'd log N_cross / d log E_trunc = -2 / (1 - g),  g = d log logT0 / d log N at N_cross',
  excessFormula: '|elasticity| - 2 = 2 g / (1 - g)  [pure function of g > 0: the log T0(N_cross) drift]',
  N_cross_baseline: +N_BASE.toExponential(6), // reproduces imp-35968 / imp-36139 ~ 3.280294e9
  T0_baseline: +T0_BASE.toExponential(4),
  logT0_baseline: +Math.log(T0_BASE).toFixed(5),
  g_baseline_finiteDiff: +G_BASE_FD.toFixed(6), // ~0.045423
  g_baseline_closedForm: +G_BASE_CF.toFixed(6), // ~0.045423 (agree to ~1e-6)
  elasticity_baseline_derived: +S_BASE.toFixed(6), // ~ -2.09517
  elasticity_baseline_imp36139_OLS: -2.0953, // the measured value being reproduced
  excess_magnitude_derived: +EXCESS_MAG.toFixed(6), // ~0.09517 = 2g/(1-g)
  excess_magnitude_imp36139: 0.0953, // imp-36139 |slope| - 2
  elasticity_halfFloor_derived: +S_HALF.toFixed(6), // ~ -2.089 vs imp-36139 local -2.090
  elasticity_doubleFloor_derived: +S_DOUBLE.toFixed(6), // ~ -2.102 vs imp-36139 local -2.101
  elasticity_halfFloor_imp36139_local: -2.09, // imp-36139 localSlope_halfFloorEdge
  elasticity_doubleFloor_imp36139_local: -2.101, // imp-36139 localSlope_doubleFloorEdge
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'DERIVATION (analytic, NOT a new rigorous bound). Implicit differentiation of the imp-33723 closed form ' +
    'log N_cross = 2 log C_C - 2 log E_trunc + log log T0(N_cross) w.r.t. log E_trunc gives d log N_cross / ' +
    'd log E_trunc = -2 / (1 - g) with g = d log logT0 / d log N at N_cross, so the excess over the raw -2 is ' +
    'exactly 2g/(1 - g) -- a pure function of the log T0(N_cross) drift, NOT a fitted residual. Two independent ' +
    'determinations of g agree at the baseline crossover N_cross ~ ' + N_BASE.toExponential(4) + ' (finite ' +
    'difference ' + G_BASE_FD.toFixed(6) + ' vs the RvM closed form (u-1)/(u L) = ' + G_BASE_CF.toFixed(6) + '), ' +
    'yielding elasticity ' + S_BASE.toFixed(5) + ' and magnitude excess ' + EXCESS_MAG.toFixed(5) + ' -- reproducing ' +
    'the imp-36139 OLS slope -2.0953 and its +0.095 excess. Evaluated at the imp-36139 half- and double-floor ' +
    'crossovers the same formula gives ' + S_HALF.toFixed(3) + ' and ' + S_DOUBLE.toFixed(3) + ', matching the ' +
    'measured local endpoint slopes -2.090 and -2.101; the slight steepening toward smaller N is precisely the ' +
    'rise in g as log T0 shrinks. So the imp-36139 attribution is confirmed analytically: the +0.095 is the ' +
    'logarithmic-derivative contribution of log T0(N_cross), full stop. Derivation only; reuses the imp-3406 / ' +
    'imp-33582 sub-terms and the imp-35968 bisector unchanged; derives no remainder; discharges nothing; changes ' +
    'no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643) and C_mb ' +
    'GUE-conditional (imp-486) are UNTOUCHED; the nominal E_trunc = 3.06e-5 (imp-2631) baseline is unchanged; ' +
    'imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36139 (measured OLS elasticity -2.0953 and local slopes, attributed excess to logT0 growth); imp-33723 ' +
    '(N_cross ~ (C_C/E_trunc)^2 logT0 closed form); imp-35968 (located N_cross, reused bisector); imp-3444 (L5 ' +
    'landmark N_cross ~ 3.280294e9); imp-33582 (sigma-decay model); imp-3220 / imp-3406 (RvM surrogate log-height); ' +
    'imp-2642 / imp-2643 (C_C = (1/8) sqrt(3 pi)); imp-2631 (E_trunc fixed-strip floor); imp-486 (GUE-conditional ' +
    'caveat). Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP36277_CROSSOVER_ELASTICITY_ANALYTIC_DERIVATION_ASSERTIONS = [
  {
    // (1) baseline crossover reproduces the imp-35968 / imp-36139 landmark (same bisector, same sub-terms).
    id: 'imp36277-baseline-reproduces-crossover',
    description: 'the baseline crossover reproduces imp-35968 / imp-36139 N_cross ~ 3.280294e9',
    holds: () => Math.abs(N_BASE / 3.280294e9 - 1) < 1e-3,
  },
  {
    // (2) the two independent determinations of g agree (finite difference vs RvM closed form).
    id: 'imp36277-g-two-determinations-agree',
    description: 'finite-difference g and the RvM closed-form (u-1)/(u L) agree at the baseline crossover',
    holds: () => Math.abs(G_BASE_FD - G_BASE_CF) < 1e-4 && G_BASE_CF > 0,
  },
  {
    // (3) the derived elasticity reproduces the imp-36139 OLS slope -2.0953.
    id: 'imp36277-derived-elasticity-reproduces-OLS',
    description: 'S = -2/(1 - g) reproduces the imp-36139 OLS elasticity -2.0953 to ~3 sig figs',
    holds: () => Math.abs(S_BASE - -2.0953) < 5e-3 && S_BASE < -2 && S_BASE > -2.2,
  },
  {
    // (4) the magnitude excess is EXACTLY 2g/(1-g) -- an algebraic identity, not a fit.
    id: 'imp36277-excess-equals-2g-over-1-minus-g',
    description: 'the excess |S| - 2 equals the closed identity 2g/(1 - g) exactly',
    holds: () => Math.abs(EXCESS_MAG - EXCESS_IDENTITY) < 1e-12 && Math.abs(EXCESS_MAG - 0.0952) < 5e-3,
  },
  {
    // (5) the endpoint elasticities reproduce the imp-36139 local half/double-floor slopes.
    id: 'imp36277-endpoints-match-local-slopes',
    description: 'S at the half/double floor crossovers reproduces imp-36139 local slopes -2.090 / -2.101',
    holds: () =>
      Math.abs(S_HALF - -2.09) < 5e-3 &&
      Math.abs(S_DOUBLE - -2.101) < 5e-3 &&
      S_DOUBLE < S_HALF, // steeper (more negative) toward smaller N, as g rises
  },
  {
    // (6) honesty gate: derivation only, conditional, no bound moves, imp-486 kept, imp-35337a OPEN, no refereed bound is changed, NO QED.
    id: 'imp36277-derivation-only-no-qed',
    description: 'derivation only: not rigorous/unconditional, changes no bound, keeps imp-486, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP36277_CROSSOVER_ELASTICITY_ANALYTIC_DERIVATION;
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

for (const a of IMP36277_CROSSOVER_ELASTICITY_ANALYTIC_DERIVATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36277-crossover-elasticity-analytic-derivation assertion failed: ${a.id}`);
  }
}
