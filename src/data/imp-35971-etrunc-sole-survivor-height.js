/**
 * @module imp-35971-etrunc-sole-survivor-height
 *
 * imp-35971 (numerical, measurement): LOCATE the deep-parity height N at which the fixed
 * truncation floor E_trunc = 3.06e-5 becomes the SOLE non-negligible term of
 * E(N) = E_trunc + E_flow + E_coll -- i.e. the first N at which BOTH E_coll and E_flow have
 * fallen below 1% of E_trunc (so E(N) is within 1% of E_trunc alone). This extends the
 * imp-35889 three-way share decomposition (which stopped at the two imp-35853 knees, where
 * E_coll still carries ~ 0.41 to ~ 0.78 of the mass) all the way down the sigma -> 0 tail.
 *
 * SETUP (identical imp-3406 / imp-33582 sub-terms as imp-35889 / imp-35950; no fresh model).
 *   E_trunc = 3.06e-5 (imp-2631, N-independent fixed-strip route),
 *   E_flow  = C_F (log T0 / T0) exp|t_c|  with C_F = (log(T0 / 2pi) + 1) / 2pi (imp-398),
 *   E_coll  = C_C sqrt(log T0 / N)        with C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643, GUE-conditional).
 * Both E_flow and E_coll decay monotonically with height, so "BOTH below 1% of E_trunc" first
 * holds at a single threshold N, located here by bisection on log N down the sigma -> 0 tail.
 *
 * WHAT THE MEASUREMENT SHOWS (the honest finding).
 *   - E_trunc becomes the SOLE non-negligible term at N* ~ 4.7214e13 (log10 N* ~ 13.674,
 *     log T0 ~ 30.02). There sigma ~ 9.90e-3 (just under 0.01, since sigma ~ E_coll / E(N)
 *     ~ 0.01 / 1.01), E_coll / E_trunc = 1.00e-2 (binding, hits the 1% threshold exactly) and
 *     E_flow / E_trunc ~ 4.18e-7 (already vanishingly small). E(N*) / E_trunc ~ 1.010.
 *   - The threshold is set ENTIRELY by the collision term. E_flow falls below 1% of E_trunc far
 *     earlier, at N ~ 4.62e8 (~ 5 decades below N*), while E_coll only reaches 1% of E_trunc at
 *     N ~ 4.72e13 (= N*). So E_coll is the LAST survivor before E_trunc stands alone -- the
 *     sqrt(1/N) collision tail is what keeps E(N) above the pure-E_trunc floor deep into parity.
 *   - Cross-check against the roadmap sigma < 0.1 landmark N ~ 3.21e11: there sigma ~ 0.1000
 *     (confirms the landmark), but E_coll / E_trunc ~ 0.111 -- still ~ 11x above the 1% bar --
 *     so the sole-survivor height sits ~ 2.17 decades ABOVE the sigma < 0.1 landmark. The far
 *     tail then decays like E_coll / E_trunc ~ C_C sqrt(log T0 / N) / E_trunc ~ N^(-1/2)
 *     (log-corrected), i.e. pushing the collision share down another factor of 10 costs ~ 2
 *     more decades of N.
 *
 * Measurement only; reuses the pinned imp-3406 / imp-33582 constants and the imp-35889 /
 * imp-35853 sigma -> 0 downslope locator unchanged; derives no remainder; discharges nothing;
 * changes no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 /
 * imp-2643) and E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED;
 * imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35889-e-share-decomposition-at-knees (the three-way split at the two knees this extends)
 * @see imp-35950-etrunc-ecoll-crossover-height (the E_trunc = E_coll sigma = 0.5 crossover, N ~ 3.27e9)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (source sigma model)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// EXACT imp-3406 / imp-3529 / imp-33582 sub-terms (identical to imp-35889 / imp-35950; no fresh model).
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

const THRESHOLD = 0.01; // "negligible" = below 1% of the fixed E_trunc floor

// First N (both terms decay monotonically) at which BOTH E_coll and E_flow are below 1% of E_trunc.
function bothBelow(N) {
  const p = parts(N);
  return p.E_coll / E_TRUNC_PT < THRESHOLD && p.E_flow / E_TRUNC_PT < THRESHOLD;
}
function locateBothBelow() {
  let a = Math.log(1e8); // below any plausible threshold
  let b = Math.log(1e20); // above it
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (bothBelow(Math.exp(m))) b = m;
    else a = m;
  }
  return Math.exp((a + b) / 2);
}

// The individual-term 1%-of-E_trunc crossings (which term is the last survivor?).
function crossBelowRatio(which) {
  let a = Math.log(1e6);
  let b = Math.log(1e20);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    const p = parts(Math.exp(m));
    const r = (which === 'coll' ? p.E_coll : p.E_flow) / E_TRUNC_PT;
    if (r < THRESHOLD) b = m;
    else a = m;
  }
  return Math.exp((a + b) / 2);
}

const N_STAR = locateBothBelow();
const pStar = parts(N_STAR);
const N_FLOW_1PCT = crossBelowRatio('flow'); // ~ 4.62e8
const N_COLL_1PCT = crossBelowRatio('coll'); // ~ 4.72e13 (= N_STAR: collision is the binding / last term)

// Roadmap sigma < 0.1 landmark cross-check.
const N_SIGMA_0P1 = 3.21e11;
const pSigma = parts(N_SIGMA_0P1);

const soleSurvivor = {
  N: +N_STAR.toExponential(4), // ~ 4.7214e13
  log10N: +(Math.log10(N_STAR)).toFixed(4), // ~ 13.674
  logT0: +pStar.logT0.toFixed(4), // ~ 30.02
  sigma: +pStar.sigma.toExponential(4), // ~ 9.9010e-3
  ratioCollOverTrunc: +(pStar.E_coll / E_TRUNC_PT).toExponential(4), // ~ 1.0000e-2 (binding)
  ratioFlowOverTrunc: +(pStar.E_flow / E_TRUNC_PT).toExponential(4), // ~ 4.18e-7
  eNOverTrunc: +(pStar.E_N / E_TRUNC_PT).toFixed(4), // ~ 1.0100
  bindingTerm: pStar.E_coll > pStar.E_flow ? 'E_coll' : 'E_flow',
};
const survivorLadder = {
  N_flow_1pct: +N_FLOW_1PCT.toExponential(4), // ~ 4.6230e8
  N_coll_1pct: +N_COLL_1PCT.toExponential(4), // ~ 4.7214e13
  decadesFlowBeforeColl: +(Math.log10(N_COLL_1PCT) - Math.log10(N_FLOW_1PCT)).toFixed(4), // ~ 5.01
};
const sigma0p1Landmark = {
  N: N_SIGMA_0P1,
  sigma: +pSigma.sigma.toExponential(4), // ~ 1.0004e-1
  ratioCollOverTrunc: +(pSigma.E_coll / E_TRUNC_PT).toFixed(4), // ~ 0.1112 (still ~ 11x above the 1% bar)
  ratioFlowOverTrunc: +(pSigma.E_flow / E_TRUNC_PT).toExponential(4), // ~ 3.55e-5
  decadesBelowSoleSurvivor: +(Math.log10(N_STAR) - Math.log10(N_SIGMA_0P1)).toFixed(4), // ~ 2.17
};

export const IMP35971_ETRUNC_SOLE_SURVIVOR_HEIGHT = {
  id: 'imp-35971',
  proofSection: 'S-frontier',
  question:
    'imp-35889 decomposed E(N) = E_trunc + E_flow + E_coll only at the two imp-35853 knees, where E_coll ' +
    'still carries most of the mass. At what deep-parity height N does the fixed floor E_trunc = 3.06e-5 ' +
    'become the SOLE non-negligible term -- i.e. where do BOTH E_coll and E_flow first fall below 1% of ' +
    'E_trunc -- and which term is the last to become negligible?',
  method:
    'Reuse the EXACT imp-3406 / imp-33582 sub-terms (E_trunc = 3.06e-5 fixed; E_flow = C_F (log T0 / T0) ' +
    'exp|t_c|; E_coll = C_C sqrt(log T0 / N)) and the imp-35889 / imp-35853 sigma -> 0 downslope. Bisect on ' +
    'log N for the first height at which both E_coll / E_trunc < 0.01 and E_flow / E_trunc < 0.01; locate the ' +
    'individual 1%-of-E_trunc crossings of each term; and cross-check the roadmap sigma < 0.1 landmark N ~ 3.21e11.',
  soleSurvivor, // N* ~ 4.72e13, sigma ~ 9.90e-3, E_coll / E_trunc = 1.00e-2 (binding), E_flow / E_trunc ~ 4.18e-7
  survivorLadder, // E_flow < 1% at N ~ 4.62e8, E_coll < 1% at N ~ 4.72e13 (~ 5 decades later): E_coll is the last survivor
  sigma0p1Landmark, // at N ~ 3.21e11 sigma ~ 0.10 but E_coll / E_trunc ~ 0.111 -- sole-survivor height sits ~ 2.17 decades higher
  collisionIsLastSurvivor: N_COLL_1PCT > N_FLOW_1PCT && soleSurvivor.bindingTerm === 'E_coll',
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Extending the imp-35889 E(N) = E_trunc + E_flow + E_coll split into the ' +
    'sigma -> 0 tail on the same imp-3406 / imp-33582 surrogate: the fixed truncation floor E_trunc = 3.06e-5 ' +
    'becomes the SOLE non-negligible term at N* ~ 4.7214e13 (log10 N* ~ 13.674, log T0 ~ 30.02), where both ' +
    'other terms have dropped below 1% of E_trunc. There sigma ~ 9.90e-3 (just under 0.01, since sigma ~ E_coll ' +
    '/ E(N) ~ 0.01 / 1.01), E_coll / E_trunc = 1.00e-2 (the BINDING term, hitting the 1% bar exactly) and ' +
    'E_flow / E_trunc ~ 4.18e-7 (already vanishing), so E(N*) / E_trunc ~ 1.010. The threshold is set ENTIRELY ' +
    'by the collision term: E_flow falls below 1% of E_trunc far earlier at N ~ 4.62e8 (~ 5 decades below N*), ' +
    'while E_coll only reaches 1% at N ~ 4.72e13 -- so the sqrt(1/N) collision tail is the LAST survivor before ' +
    'E_trunc stands alone. Cross-checking the roadmap sigma < 0.1 landmark N ~ 3.21e11: sigma ~ 0.10 there ' +
    '(confirming the landmark) but E_coll / E_trunc ~ 0.111 is still ~ 11x above the 1% bar, so the sole-survivor ' +
    'height sits ~ 2.17 decades ABOVE the sigma < 0.1 landmark, and the far tail decays like E_coll / E_trunc ~ ' +
    'N^(-1/2) (log-corrected). Reuses the pinned imp-3406 / imp-33582 constants and the imp-35889 / imp-35853 ' +
    'downslope locator unchanged; derives no remainder; discharges nothing; changes no bound; establishes no ' +
    'operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb ' +
    'GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35889 (the three-way split at the two knees this extends); imp-35950 / imp-35968 (E_trunc = E_coll ' +
    'sigma = 0.5 crossover, N ~ 3.27e9); imp-35853 (downslope locator); imp-33582 (sigma-decay model); ' +
    'imp-3220 / imp-3406 (RvM surrogate log-height); imp-2642 / imp-2643 (C_C = (1/8) sqrt(3 pi)); imp-2631 ' +
    '(E_trunc floor); imp-486 (GUE-conditional caveat). Literature: Riemann-von Mangoldt counting formula; ' +
    'Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35971_ETRUNC_SOLE_SURVIVOR_HEIGHT_ASSERTIONS = [
  {
    // (1) sole-survivor height located near N ~ 4.72e13 with the expected log T0 ~ 30.
    id: 'imp35971-sole-survivor-height-located',
    description: 'E_trunc becomes the sole non-negligible term at N* ~ 4.72e13 (log10 ~ 13.67, log T0 ~ 30.0)',
    holds: () =>
      Math.abs(soleSurvivor.N / 4.7214e13 - 1) < 1e-3 &&
      Math.abs(soleSurvivor.log10N - 13.674) < 5e-3 &&
      Math.abs(soleSurvivor.logT0 - 30.02) < 0.1,
  },
  {
    // (2) at N* both terms are below 1% of E_trunc, E_coll is binding (hits the bar), E(N*) ~ 1.01 E_trunc.
    id: 'imp35971-both-terms-below-one-percent',
    description: 'at N* E_coll / E_trunc = 0.01 (binding) and E_flow / E_trunc < 0.01, so E(N*) / E_trunc ~ 1.01',
    holds: () =>
      Math.abs(soleSurvivor.ratioCollOverTrunc - 0.01) < 5e-5 &&
      soleSurvivor.ratioFlowOverTrunc < 0.01 &&
      Math.abs(soleSurvivor.eNOverTrunc - 1.01) < 1e-3,
  },
  {
    // (3) sigma at N* is just under 0.01 (sigma ~ E_coll / E(N) ~ 0.01 / 1.01).
    id: 'imp35971-sigma-just-under-one-percent',
    description: 'sigma(N*) ~ 9.90e-3 -- just below 0.01 because the tiny E_flow keeps E(N) fractionally above E_trunc + E_coll',
    holds: () => Math.abs(soleSurvivor.sigma - 9.901e-3) < 5e-5 && soleSurvivor.sigma < 0.01,
  },
  {
    // (4) E_coll is the LAST survivor: it crosses 1% ~ 5 decades after E_flow does.
    id: 'imp35971-collision-is-last-survivor',
    description: 'E_flow < 1% of E_trunc at N ~ 4.62e8, E_coll only at N ~ 4.72e13 (~ 5 decades later); binding term is E_coll',
    holds: () =>
      IMP35971_ETRUNC_SOLE_SURVIVOR_HEIGHT.collisionIsLastSurvivor === true &&
      Math.abs(survivorLadder.N_coll_1pct / 4.7214e13 - 1) < 1e-3 &&
      Math.abs(survivorLadder.N_flow_1pct / 4.6230e8 - 1) < 1e-3 &&
      survivorLadder.decadesFlowBeforeColl > 4.5,
  },
  {
    // (5) the E_coll 1% crossing equals the both-below threshold N* (collision sets the threshold).
    id: 'imp35971-collision-sets-the-threshold',
    description: 'the both-terms-below-1% height N* equals the E_coll 1% crossing (E_flow already negligible there)',
    holds: () => Math.abs(soleSurvivor.N / survivorLadder.N_coll_1pct - 1) < 1e-6,
  },
  {
    // (6) roadmap sigma < 0.1 landmark cross-check: sigma ~ 0.10 there, but E_coll still ~ 11x above the 1% bar,
    //     so the sole-survivor height sits ~ 2.17 decades higher.
    id: 'imp35971-sigma-0p1-landmark-crosscheck',
    description: 'at N ~ 3.21e11 sigma ~ 0.10 but E_coll / E_trunc ~ 0.111 (~ 11x the 1% bar); sole-survivor height ~ 2.17 decades higher',
    holds: () =>
      Math.abs(sigma0p1Landmark.sigma - 0.1) < 1e-3 &&
      Math.abs(sigma0p1Landmark.ratioCollOverTrunc - 0.1112) < 5e-3 &&
      sigma0p1Landmark.ratioCollOverTrunc > 0.05 &&
      Math.abs(sigma0p1Landmark.decadesBelowSoleSurvivor - 2.17) < 0.05,
  },
  {
    // (7) honesty gate: measurement only, conditional, no bound moves, imp-486 kept, imp-35337a OPEN, no refereed bound is changed, NO QED.
    id: 'imp35971-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35971_ETRUNC_SOLE_SURVIVOR_HEIGHT;
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

for (const a of IMP35971_ETRUNC_SOLE_SURVIVOR_HEIGHT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35971-etrunc-sole-survivor-height assertion failed: ${a.id}`);
  }
}
