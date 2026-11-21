/**
 * @module imp-36118-shareflow-sub-1e6-crossing-height
 *
 * imp-36118 (numerical, measurement): LOCATE by bisection the height N at which the middle
 * flow-term FRACTIONAL SHARE shareFlow = E_flow / E(N) of the imp-36046 tail first drops below
 * 1e-6 (and below 1e-5) along the sigma -> 0 tail of E(N) = E_trunc + E_flow + E_coll.
 *
 * imp-36046 baked three tail landmarks but sampled shareFlow only at the imp-35971 sole-survivor
 * height N* ~ 4.7214e13, where it recorded shareFlow ~ 4.14e-7 (already below 1e-6). The two
 * crossings 1e-6 and 1e-5 were therefore never located; this module pins them.
 *
 * SETUP (identical imp-3406 / imp-33582 sub-terms as imp-35971 / imp-35889 / imp-35950; no fresh model).
 *   E_trunc = 3.06e-5 (imp-2631, N-independent fixed-strip route),
 *   E_flow  = C_F (log T0 / T0) exp|t_c|  with C_F = (log(T0 / 2pi) + 1) / 2pi (imp-398),
 *   E_coll  = C_C sqrt(log T0 / N)        with C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643, GUE-conditional).
 * shareFlow = E_flow / (E_trunc + E_flow + E_coll) decays monotonically with height (E_flow ~ log T0 / T0
 * ~ 1/N vanishes while E_trunc is fixed and E_coll ~ 1/sqrt(N) dies slower), so each sub-1e-k crossing
 * first holds at a single threshold N, located here by bisection on log N.
 *
 * WHAT THE MEASUREMENT SHOWS (the honest finding).
 *   - shareFlow first falls below 1e-5 at N ~ 1.2658e12 (log10 N ~ 12.102, log T0 ~ 26.539). There the
 *     tail is already TRUNCATION-dominated: shareTrunc ~ 0.9457, shareColl ~ 0.0543, so the flow term is
 *     five orders below the total while the collision term still carries ~ 5.4% of the mass.
 *   - shareFlow first falls below 1e-6 at N ~ 1.7535e13 (log10 N ~ 13.244, log T0 ~ 29.066). There
 *     shareTrunc ~ 0.9841, shareColl ~ 0.0159 -- deep into the truncation-dominated tail, only ~ 0.43
 *     decades BELOW the imp-35971 sole-survivor height N* ~ 4.7214e13 (where shareFlow ~ 4.14e-7).
 *   - The two crossings are ~ 1.14 decades apart (13.244 - 12.102), matching the shareFlow ~ E_flow / E_trunc
 *     ~ log T0 / T0 ~ N^(-1) (log-corrected) decay: pushing shareFlow down one more order of magnitude costs
 *     ~ 1 decade of N. Both crossings sit ABOVE the imp-36046 Sigma-0.1-landmark N ~ 3.21e11 (shareFlow ~
 *     3.20e-5) and BELOW the sole-survivor height, bracketing where the Gronwall flow term becomes
 *     numerically negligible relative to E_trunc + E_coll.
 *
 * Measurement only; reuses the pinned imp-3406 / imp-33582 constants and the imp-35971 sigma -> 0 downslope
 * bisection unchanged; derives no remainder; discharges nothing; changes no bound; establishes no operator
 * positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb
 * GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-36046-e-share-tail-landmarks-viz-data (the three tail landmarks; sampled shareFlow only at N*)
 * @see imp-35971-etrunc-sole-survivor-height (source sub-terms + bisection pattern this reuses)
 * @see imp-35889-e-share-decomposition-at-knees (the three-way split this whole ladder traces)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).
 *
 * Ticket: imp-36118 (numerical, low). Measurement only, RH-free; changes no bound; NO QED.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// EXACT imp-3406 / imp-33582 sub-terms (identical to imp-35971 / imp-35889 / imp-35950; no fresh model).
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
  return {
    logT0: L,
    E_flow,
    E_coll,
    E_N,
    shareTrunc: E_TRUNC_PT / E_N,
    shareFlow: E_flow / E_N,
    shareColl: E_coll / E_N,
  };
}

// shareFlow decays monotonically with height; locate the first N at which shareFlow < target.
function locateShareFlowBelow(target) {
  let a = Math.log(1e4); // shareFlow well above any tested target here
  let b = Math.log(1e20); // shareFlow well below it
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).shareFlow < target) b = m;
    else a = m;
  }
  return Math.exp((a + b) / 2);
}

function landmarkAt(target) {
  const N = locateShareFlowBelow(target);
  const p = parts(N);
  return {
    target,
    N: +N.toExponential(4),
    log10N: +Math.log10(N).toFixed(4),
    logT0: +p.logT0.toFixed(4),
    shareFlow: +p.shareFlow.toExponential(4),
    shareTrunc: +p.shareTrunc.toFixed(6),
    shareColl: +p.shareColl.toFixed(6),
    dominant: p.shareTrunc > p.shareColl ? 'E_trunc' : 'E_coll',
  };
}

const crossing1e5 = landmarkAt(1e-5); // N ~ 1.2658e12
const crossing1e6 = landmarkAt(1e-6); // N ~ 1.7535e13
const N_STAR = 4.7214e13; // imp-35971 sole-survivor height (shareFlow ~ 4.14e-7 there)
const decadesBetweenCrossings = +(crossing1e6.log10N - crossing1e5.log10N).toFixed(4); // ~ 1.14
const decadesBelowSoleSurvivor = +(Math.log10(N_STAR) - crossing1e6.log10N).toFixed(4); // ~ 0.43

export const IMP36118_SHAREFLOW_SUB_1E6_CROSSING_HEIGHT = {
  id: 'imp-36118',
  proofSection: 'S-frontier',
  question:
    'imp-36046 baked three E(N) = E_trunc + E_flow + E_coll tail landmarks but sampled the middle ' +
    'flow-term fractional share shareFlow = E_flow / E(N) only at the imp-35971 sole-survivor height ' +
    'N* ~ 4.7214e13 (shareFlow ~ 4.14e-7). At what height N does shareFlow first fall below 1e-6 (and ' +
    'below 1e-5) along the sigma -> 0 tail -- i.e. where does the Gronwall flow term become numerically ' +
    'negligible relative to E_trunc + E_coll?',
  method:
    'Reuse the EXACT imp-3406 / imp-33582 sub-terms (E_trunc = 3.06e-5 fixed; E_flow = C_F (log T0 / T0) ' +
    'exp|t_c|; E_coll = C_C sqrt(log T0 / N)) and the imp-35971 sigma -> 0 downslope. shareFlow decays ' +
    'monotonically with height, so bisect on log N for the first height at which shareFlow < 1e-5 and ' +
    '< 1e-6; report the co-located E_trunc / E_coll shares and the decade gaps to the imp-36046 Sigma-0.1 ' +
    'landmark and the sole-survivor height.',
  crossing1e5, // N ~ 1.2658e12: shareTrunc ~ 0.946, shareColl ~ 0.054 (already truncation-dominated)
  crossing1e6, // N ~ 1.7535e13: shareTrunc ~ 0.984, shareColl ~ 0.016 (~ 0.43 decades below N*)
  soleSurvivorN: N_STAR,
  decadesBetweenCrossings, // ~ 1.14 (each order of shareFlow ~ 1 decade of N, log-corrected)
  decadesBelowSoleSurvivor, // ~ 0.43 (the 1e-6 crossing sits just under N*)
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Extending the imp-36046 tail landmarks: the middle flow-term fractional ' +
    'share shareFlow = E_flow / E(N) first falls below 1e-5 at N ~ 1.2658e12 (log10 N ~ 12.102, log T0 ~ ' +
    '26.539), where the tail is already truncation-dominated (shareTrunc ~ 0.9457, shareColl ~ 0.0543), and ' +
    'below 1e-6 at N ~ 1.7535e13 (log10 N ~ 13.244, log T0 ~ 29.066; shareTrunc ~ 0.9841, shareColl ~ ' +
    '0.0159) -- only ~ 0.43 decades BELOW the imp-35971 sole-survivor height N* ~ 4.7214e13 (shareFlow ~ ' +
    '4.14e-7). The two crossings are ~ 1.14 decades apart, matching shareFlow ~ E_flow / E_trunc ~ log T0 / ' +
    'T0 ~ N^(-1) (log-corrected): each order of magnitude in shareFlow costs ~ 1 decade of N. Both crossings ' +
    'sit above the imp-36046 Sigma-0.1-landmark N ~ 3.21e11 (shareFlow ~ 3.20e-5) and below the sole-survivor ' +
    'height, bracketing where the Gronwall flow term goes numerically negligible relative to E_trunc + E_coll. ' +
    'Reuses the pinned imp-3406 / imp-33582 constants and the imp-35971 downslope bisection unchanged; derives ' +
    'no remainder; discharges nothing; changes no bound; establishes no operator positivity; C_C = (1/8) ' +
    'sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are ' +
    'UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36046 (the three tail landmarks this extends; sampled shareFlow only at N*); imp-35971 (source ' +
    'sub-terms + bisection pattern); imp-35889 (three-way split); imp-33582 (sigma-decay model); imp-3220 / ' +
    'imp-3406 (RvM surrogate log-height); imp-2642 / imp-2643 (C_C = (1/8) sqrt(3 pi)); imp-2631 (E_trunc ' +
    'floor); imp-486 (GUE-conditional caveat). Literature: Riemann-von Mangoldt counting formula; ' +
    'Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP36118_SHAREFLOW_SUB_1E6_CROSSING_HEIGHT_ASSERTIONS = [
  {
    // (1) shareFlow < 1e-5 crossing located near N ~ 1.2658e12 with the expected log T0 ~ 26.54.
    id: 'imp36118-1e5-crossing-located',
    description: 'shareFlow first drops below 1e-5 at N ~ 1.2658e12 (log10 ~ 12.10, log T0 ~ 26.54)',
    holds: () =>
      Math.abs(crossing1e5.N / 1.2658e12 - 1) < 1e-3 &&
      Math.abs(crossing1e5.log10N - 12.1024) < 5e-3 &&
      Math.abs(crossing1e5.logT0 - 26.5391) < 0.1 &&
      Math.abs(crossing1e5.shareFlow - 1e-5) < 1e-8,
  },
  {
    // (2) shareFlow < 1e-6 crossing located near N ~ 1.7535e13 with the expected log T0 ~ 29.07.
    id: 'imp36118-1e6-crossing-located',
    description: 'shareFlow first drops below 1e-6 at N ~ 1.7535e13 (log10 ~ 13.24, log T0 ~ 29.07)',
    holds: () =>
      Math.abs(crossing1e6.N / 1.7535e13 - 1) < 1e-3 &&
      Math.abs(crossing1e6.log10N - 13.2439) < 5e-3 &&
      Math.abs(crossing1e6.logT0 - 29.0663) < 0.1 &&
      Math.abs(crossing1e6.shareFlow - 1e-6) < 1e-9,
  },
  {
    // (3) both crossings are truncation-dominated with the three shares summing to ~ 1.
    id: 'imp36118-crossings-truncation-dominated',
    description: 'at both crossings E_trunc dominates the split and the three shares sum to ~ 1',
    holds: () =>
      crossing1e5.dominant === 'E_trunc' &&
      crossing1e6.dominant === 'E_trunc' &&
      Math.abs(crossing1e5.shareTrunc + crossing1e5.shareFlow + crossing1e5.shareColl - 1) < 1e-4 &&
      Math.abs(crossing1e6.shareTrunc + crossing1e6.shareFlow + crossing1e6.shareColl - 1) < 1e-4,
  },
  {
    // (4) the 1e-6 crossing sits below the sole-survivor height (~ 0.43 decades) and above the 1e-5 crossing.
    id: 'imp36118-crossings-bracket-sole-survivor',
    description: '1e-5 crossing < 1e-6 crossing < sole-survivor N*; the 1e-6 crossing is ~ 0.43 decades below N*',
    holds: () =>
      crossing1e5.N < crossing1e6.N &&
      crossing1e6.N < N_STAR &&
      Math.abs(decadesBelowSoleSurvivor - 0.43) < 0.05,
  },
  {
    // (5) the two crossings are ~ 1.14 decades apart (each order of shareFlow ~ 1 decade of N).
    id: 'imp36118-one-decade-per-order',
    description: 'the 1e-5 and 1e-6 crossings are ~ 1.14 decades apart, matching shareFlow ~ N^(-1) decay',
    holds: () =>
      Math.abs(decadesBetweenCrossings - 1.14) < 0.05 &&
      decadesBetweenCrossings > 1.0,
  },
  {
    // (6) honesty gate: measurement only, conditional, no bound moves, imp-486 kept, imp-35337a OPEN, no refereed bound is changed, NO QED.
    id: 'imp36118-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP36118_SHAREFLOW_SUB_1E6_CROSSING_HEIGHT;
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

for (const a of IMP36118_SHAREFLOW_SUB_1E6_CROSSING_HEIGHT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36118-shareflow-sub-1e6-crossing-height assertion failed: ${a.id}`);
  }
}
