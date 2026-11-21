/**
 * @module imp-36060-eflow-share-frontier-heights
 *
 * imp-36060 (accuracy, measurement): TABULATE the middle flow-term fractional share
 * E_flow / E(N) of the imp-35889 three-way split E(N) = E_trunc + E_flow + E_coll at the two
 * PHYSICALLY-RELEVANT frontier heights the verified-frontier work actually uses:
 *   - N ~ 488602 : retained terms per mollified sum at the Platt-Trudgian anchor T_PT = 3e12
 *                  (imp-35812 / imp-35852 / imp-35948 multiset height),
 *   - N ~ 1.236e13 : the PT verified height N(T_PT), the exact Riemann-von Mangoldt count at T_PT.
 * imp-35997 LOCATED where the flow share is largest (peak ~ 15.9% at N* ~ 9.65e1) and gave the share
 * at the imp-35853 knees and the sigma = 0.5 crossover, but NEVER tabulated it at these two operative
 * frontier heights. This module fills that single missing pair of datapoints.
 *
 * SETUP (byte-identical imp-3406 / imp-33582 sub-terms as imp-35889 / imp-35950 / imp-35971 / imp-35997;
 * no fresh model).
 *   E_trunc = 3.06e-5 (imp-2631, N-independent fixed-strip route),
 *   E_flow  = C_F (log T0 / T0) exp|t_c|  with C_F = (log(T0 / 2pi) + 1) / 2pi (imp-398),
 *   E_coll  = C_C sqrt(log T0 / N)        with C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643, GUE-conditional).
 *
 * WHAT THE MEASUREMENT SHOWS (the honest finding).
 *   - At the retained-term anchor N ~ 488602 (log T0 ~ 12.65, T0 ~ 3.13e5) the flow share is
 *     E_flow / E(N) ~ 3.69e-2 (~ 3.7%). E_coll still dominates (share ~ 0.948) and E_flow (~ 3.7%) here
 *     even leads the flat E_trunc floor (~ 1.49%): flow is the MIDDLE term. This height sits ~ 3.70
 *     decades ABOVE the imp-35997 peak, so the share is ~ 4.30x below the ~ 0.1587 maximum.
 *   - At the PT verified height N ~ 1.236e13 (log T0 ~ 28.73, T0 ~ 3e12 = T_PT) the flow share has
 *     COLLAPSED to E_flow / E(N) ~ 1.36e-6 (~ 1.4 ppm) -- ~ 1.16e5x below the peak share and ~ 11.11
 *     decades above the peak height. Here the split has INVERTED: the flat E_trunc floor now dominates
 *     (share ~ 0.981), E_coll is ~ 1.88%, and E_flow (~ 4.25e-11) is ~ 4 orders of magnitude BELOW even
 *     E_coll. The flow channel is emphatically the smallest, utterly negligible term at the PT height.
 *   - So at the operative frontier E_flow is negligible relative to BOTH other channels: at the anchor
 *     E_coll leads by ~ 26x and at the PT height E_trunc leads by ~ 7.2e5x. The flow term never binds
 *     the frontier bound at either height.
 *
 * Measurement only; reuses the pinned imp-3406 / imp-33582 constants and the imp-35889 / imp-35950 /
 * imp-35997 sub-terms unchanged; derives no remainder; discharges nothing; changes no bound; establishes
 * no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and
 * C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35997-eflow-max-share-height (locates the peak flow share ~ 15.9% at N* ~ 9.65e1)
 * @see imp-35889-e-share-decomposition-at-knees (the three-way split whose flow share this tabulates)
 * @see imp-35950-etrunc-ecoll-crossover-height (the sigma = 0.5 crossover, flow share ~ 9.51e-4)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// EXACT imp-3406 / imp-3529 / imp-33582 sub-terms (identical to imp-35889 / imp-35950 / imp-35997; no fresh model).
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
    E_trunc: E_TRUNC_PT,
    E_flow,
    E_coll,
    E_N,
    shareTrunc: E_TRUNC_PT / E_N,
    shareFlow: E_flow / E_N,
    shareColl: E_coll / E_N,
  };
}

// The two frontier heights the verified-frontier work actually operates at.
const N_ANCHOR = 488602; // retained terms per mollified sum at T_PT (imp-35812 / imp-35852 / imp-35948)
const N_PT = 1.236e13; // PT verified height N(T_PT), the RvM count at T_PT = 3e12
// imp-35997 peak (recomputed there on the same model): share ~ 0.1587 at N* ~ 9.6548e1.
const N_STAR = 9.6548e1;
const PEAK_SHARE = 1.5875e-1;

const pAnchor = parts(N_ANCHOR);
const pPT = parts(N_PT);

const frontierShares = {
  retainedTermAnchor: {
    N: N_ANCHOR,
    log10N: +Math.log10(N_ANCHOR).toFixed(4), // ~ 5.6890
    logT0: +pAnchor.logT0.toFixed(4), // ~ 12.6532
    E_trunc: +pAnchor.E_trunc.toExponential(4), // 3.06e-5
    E_flow: +pAnchor.E_flow.toExponential(4), // ~ 7.6093e-5
    E_coll: +pAnchor.E_coll.toExponential(4), // ~ 1.9528e-3
    E_N: +pAnchor.E_N.toExponential(4),
    shareFlow: +pAnchor.shareFlow.toExponential(4), // ~ 3.6946e-2 (~ 3.7%)
    shareTrunc: +pAnchor.shareTrunc.toExponential(4), // ~ 1.4858e-2
    shareColl: +pAnchor.shareColl.toExponential(4), // ~ 9.4820e-1 (E_coll dominates)
    decadesAbovePeak: +(Math.log10(N_ANCHOR) - Math.log10(N_STAR)).toFixed(4), // ~ 3.7042
    peakOverShare: +(PEAK_SHARE / pAnchor.shareFlow).toFixed(4), // ~ 4.30x below the peak share
    flowIsMiddleTerm: pAnchor.E_flow > pAnchor.E_trunc && pAnchor.E_flow < pAnchor.E_coll,
  },
  ptVerifiedHeight: {
    N: N_PT,
    log10N: +Math.log10(N_PT).toFixed(4), // ~ 13.0920
    logT0: +pPT.logT0.toFixed(4), // ~ 28.7294 (T0 ~ 3e12 = T_PT)
    E_trunc: +pPT.E_trunc.toExponential(4), // 3.06e-5
    E_flow: +pPT.E_flow.toExponential(4), // ~ 4.2529e-11
    E_coll: +pPT.E_coll.toExponential(4), // ~ 5.8506e-7
    E_N: +pPT.E_N.toExponential(4),
    shareFlow: +pPT.shareFlow.toExponential(4), // ~ 1.3638e-6 (~ 1.4 ppm)
    shareTrunc: +pPT.shareTrunc.toExponential(4), // ~ 9.8124e-1 (E_trunc now dominates -- split inverted)
    shareColl: +pPT.shareColl.toExponential(4), // ~ 1.8761e-2
    decadesAbovePeak: +(Math.log10(N_PT) - Math.log10(N_STAR)).toFixed(4), // ~ 11.1073
    peakOverShare: +(PEAK_SHARE / pPT.shareFlow).toExponential(4), // ~ 1.16e5x below the peak share
    flowIsSmallestTerm: pPT.E_flow < pPT.E_coll && pPT.E_flow < pPT.E_trunc,
  },
};

export const IMP36060_EFLOW_SHARE_FRONTIER_HEIGHTS = {
  id: 'imp-36060',
  proofSection: 'S-frontier',
  question:
    'imp-35997 located where the middle flow term E_flow of the E(N) = E_trunc + E_flow + E_coll split ' +
    'reaches its maximum fractional share (~ 15.9% at N* ~ 9.65e1) and gave the share at the imp-35853 ' +
    'knees and the sigma = 0.5 crossover, but never tabulated E_flow / E(N) at the two heights the ' +
    'verified-frontier work actually uses: the retained-term anchor N ~ 488602 at T_PT and the PT ' +
    'verified height N ~ 1.236e13. What is the flow share at each, and how negligible is the flow ' +
    'channel there relative to E_trunc and E_coll?',
  method:
    'Reuse the EXACT imp-3406 / imp-33582 sub-terms (E_trunc = 3.06e-5 fixed; E_flow = C_F (log T0 / T0) ' +
    'exp|t_c|; E_coll = C_C sqrt(log T0 / N)) unchanged from imp-35997. Evaluate the three-way split and ' +
    'its shares at N = 488602 and N = 1.236e13, and place each relative to the imp-35997 peak (share ' +
    '~ 0.1587 at N* ~ 9.65e1).',
  frontierShares, // anchor share ~ 3.69e-2 (E_coll leads, flow is middle); PT height share ~ 1.36e-6 (E_trunc leads, flow smallest)
  eFlowNegligibleAtFrontier:
    pAnchor.shareFlow < 0.05 && pPT.shareFlow < 1e-5 && pAnchor.E_flow < pAnchor.E_coll && pPT.E_flow < pPT.E_trunc,
  splitInvertsAcrossFrontier:
    pAnchor.shareColl > pAnchor.shareTrunc && pPT.shareTrunc > pPT.shareColl, // E_coll-led at anchor -> E_trunc-led at PT height
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Tabulating the middle-term share E_flow / E(N) of the imp-35889 ' +
    'E(N) = E_trunc + E_flow + E_coll split (same imp-3406 / imp-33582 surrogate as imp-35997) at the two ' +
    'operative frontier heights: at the retained-term anchor N ~ 488602 (log T0 ~ 12.65) the flow share ' +
    'is ~ 3.69e-2 (~ 3.7%) -- E_coll dominates (~ 0.948) and E_flow is the MIDDLE term, ahead of the ' +
    'E_trunc floor (~ 1.49%); this sits ~ 3.70 decades above the imp-35997 peak so it is ~ 4.30x below ' +
    'the ~ 0.1587 maximum share. At the PT verified height N ~ 1.236e13 (log T0 ~ 28.73, T0 ~ 3e12 = ' +
    'T_PT) the flow share has COLLAPSED to ~ 1.36e-6 (~ 1.4 ppm), ~ 1.16e5x below the peak and ~ 11.11 ' +
    'decades above the peak height; there the split INVERTS -- the flat E_trunc floor dominates ' +
    '(~ 0.981), E_coll is ~ 1.88%, and E_flow (~ 4.25e-11) is ~ 4 orders of magnitude below even E_coll ' +
    'and is the smallest, utterly negligible term. So at the operative frontier the flow channel never ' +
    'binds the bound: E_coll leads it ~ 26x at the anchor and E_trunc leads it ~ 7.2e5x at the PT height. ' +
    'Reuses the pinned imp-3406 / imp-33582 constants and the imp-35889 / imp-35950 / imp-35997 sub-terms ' +
    'unchanged; derives no remainder; discharges nothing; changes no bound; establishes no operator ' +
    'positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb ' +
    'GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35997 (locates the peak flow share ~ 15.9% at N* ~ 9.65e1); imp-35889 (the three-way split ' +
    'whose flow share this tabulates); imp-35950 / imp-35337 (E_trunc = E_coll sigma = 0.5 crossover, ' +
    'flow share ~ 9.51e-4); imp-35812 / imp-35852 / imp-35948 (retained-term anchor N ~ 488602 at T_PT); ' +
    'imp-35764 (PT-anchor height N(T_PT) ~ 1.236e13); imp-33582 (sigma-decay model); imp-3220 / imp-3406 ' +
    '(RvM surrogate log-height); imp-398 (C_F flow prefactor); imp-2642 / imp-2643 (C_C = (1/8) ' +
    'sqrt(3 pi)); imp-2631 (E_trunc floor); imp-486 (GUE-conditional caveat). Literature: ' +
    'Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP36060_EFLOW_SHARE_FRONTIER_HEIGHTS_ASSERTIONS = [
  {
    // (1) retained-term anchor flow share ~ 3.69e-2, E_coll dominant, flow is the middle term.
    id: 'imp36060-anchor-flow-share',
    description: 'at N ~ 488602 the flow share is ~ 3.69e-2 with E_coll dominant (~ 0.948) and E_flow the middle term',
    holds: () =>
      Math.abs(frontierShares.retainedTermAnchor.shareFlow - 3.6946e-2) < 5e-4 &&
      Math.abs(frontierShares.retainedTermAnchor.shareColl - 9.482e-1) < 5e-3 &&
      frontierShares.retainedTermAnchor.flowIsMiddleTerm === true,
  },
  {
    // (2) PT verified-height flow share ~ 1.36e-6, split inverted (E_trunc dominant), flow the smallest term.
    id: 'imp36060-pt-height-flow-share',
    description: 'at N ~ 1.236e13 the flow share collapses to ~ 1.36e-6 with E_trunc dominant (~ 0.981) and E_flow smallest',
    holds: () =>
      Math.abs(frontierShares.ptVerifiedHeight.shareFlow - 1.3638e-6) < 5e-8 &&
      Math.abs(frontierShares.ptVerifiedHeight.shareTrunc - 9.8124e-1) < 5e-3 &&
      frontierShares.ptVerifiedHeight.flowIsSmallestTerm === true,
  },
  {
    // (3) both frontier heights sit above the imp-35997 peak, so shares are below the ~ 0.1587 maximum.
    id: 'imp36060-both-below-peak-share',
    description: 'anchor ~ 4.30x below and PT height ~ 1.16e5x below the imp-35997 peak share (~ 3.70 / ~ 11.11 decades above N*)',
    holds: () =>
      Math.abs(frontierShares.retainedTermAnchor.decadesAbovePeak - 3.7042) < 5e-3 &&
      Math.abs(frontierShares.retainedTermAnchor.peakOverShare - 4.2968) < 5e-2 &&
      Math.abs(frontierShares.ptVerifiedHeight.decadesAbovePeak - 11.1073) < 5e-3 &&
      frontierShares.ptVerifiedHeight.peakOverShare > 1e5,
  },
  {
    // (4) the flow channel is negligible at the frontier and the split inverts across the two heights.
    id: 'imp36060-flow-negligible-split-inverts',
    description: 'flow share < 5% at anchor and < 1e-5 at PT height; the E_coll-led anchor split inverts to an E_trunc-led PT split',
    holds: () =>
      IMP36060_EFLOW_SHARE_FRONTIER_HEIGHTS.eFlowNegligibleAtFrontier === true &&
      IMP36060_EFLOW_SHARE_FRONTIER_HEIGHTS.splitInvertsAcrossFrontier === true,
  },
  {
    // (5) honesty gate: measurement only, conditional, no bound moves, imp-486 kept, imp-35337a OPEN, no refereed bound is changed, NO QED.
    id: 'imp36060-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP36060_EFLOW_SHARE_FRONTIER_HEIGHTS;
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

for (const a of IMP36060_EFLOW_SHARE_FRONTIER_HEIGHTS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36060-eflow-share-frontier-heights assertion failed: ${a.id}`);
  }
}
