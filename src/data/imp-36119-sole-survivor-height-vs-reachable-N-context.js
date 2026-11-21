/**
 * @module imp-36119-sole-survivor-height-vs-reachable-N-context
 *
 * imp-36119 (accuracy, assessment): CONTEXTUALIZE the imp-35971 E_trunc sole-survivor height
 * N* ~ 4.7214e13 -- the deep-tail landmark where E_trunc = 3.06e-5 stands essentially alone in
 * E(N) = E_trunc + E_flow + E_coll -- against the operationally-relevant, physically-reachable
 * scales the imp-36046 tail viz never places it beside. It answers a single ORIENTATION question:
 * how many orders of magnitude does the sole-survivor landmark sit above the scales at which the
 * program actually assembles anything?
 *
 * THE REACHABLE ANCHORS (all pinned upstream; nothing re-derived here).
 *   - PT retained-term anchor N ~ 488602 = floor(sqrt(T_PT / 4pi)) at T_PT = 3e12 (imp-35812 /
 *     imp-35674 Part D): the actual number of mollified-sum terms retained at the verified height.
 *   - Extended empirical E1/E2 floor N* = 1e6 (PATH 1): the largest N at which the empirical
 *     E1/E2 sweep was carried out.
 *   - Verified zero-height rung T_PT = 3e12 (Platt-Trudgian 2021): the height to which the RH zero
 *     check is complete. On the E(N) model's own height map this same T_PT is reached at only
 *     N ~ 488602 retained terms, so anchors (1) and (3) are the SAME physical point -- one measured
 *     as a term count, one as a height.
 *
 * WHAT THE ASSESSMENT SHOWS (the honest finding).
 *   - On the model N-axis (assembly term-count) the sole-survivor landmark N* ~ 4.7214e13
 *     (log10 ~ 13.674) sits ~ 7.99 decades ABOVE the PT retained-term anchor N ~ 488602
 *     (ratio ~ 9.66e7) and ~ 7.67 decades above the empirical E1/E2 floor N* = 1e6 (ratio ~ 4.72e7).
 *     Roughly EIGHT orders of magnitude separate the sole-survivor height from anything the program
 *     has actually summed or swept.
 *   - Read instead as a HEIGHT: the model maps N* to T0(N*) ~ 1.091e13 (log T0 ~ 30.02), which sits
 *     only ~ 0.56 decades (factor ~ 3.64) above the verified zero-height T_PT = 3e12. So the
 *     sole-survivor height is "close" to the verified height as a T-value but ~ 8 decades beyond it
 *     as a retained-term count -- the gap is entirely in how many terms the E(N) model's N-axis
 *     counts, not in the height reached.
 *   - Plainly: the sole-survivor height is a MODEL-EXTRAPOLATION LANDMARK on the sigma -> 0 tail of
 *     the imp-3406 / imp-33582 surrogate, NOT a reachable assembly height. It marks where the fixed
 *     truncation floor would stand alone IF the E(N) decomposition were pushed ~ 8 decades past every
 *     scale at which the program assembles, sweeps, or verifies anything.
 *
 * Assessment only; reuses the pinned imp-35971 sole-survivor literal and the imp-35812 retained-term
 * anchor unchanged; derives no remainder; discharges nothing; changes no bound; establishes no
 * operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631)
 * and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35971-etrunc-sole-survivor-height (the sole-survivor height N* ~ 4.7214e13 this contextualizes)
 * @see imp-36046-e-share-tail-landmarks-viz-data (the tail viz that never places N* beside reachable scales)
 * @see imp-35812-w1-summation-scheme-measured-cost (retained-term anchor N ~ 488602 at T_PT = 3e12)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse used for the height read)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).
 *
 * Ticket: imp-36119 (accuracy, low). Assessment only, RH-free; changes no bound; NO QED.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any assessment here)

// Pinned landmarks (nothing re-derived; literals reused verbatim from the cited tickets).
const N_STAR = 4.7214e13; // imp-35971 E_trunc sole-survivor height
const N_PT_ANCHOR = 488602; // imp-35812 retained-term count = floor(sqrt(T_PT / 4pi)) at T_PT = 3e12
const N_E1E2_FLOOR = 1e6; // PATH-1 extended empirical E1/E2 sweep floor
const T_PT = 3e12; // Platt-Trudgian verified zero-height (imp-35812)

const log10 = (x) => Math.log10(x);

// N-axis (assembly term-count) separations.
const N_STAR_LOG10 = +log10(N_STAR).toFixed(4); // ~ 13.6741
const vsRetainedAnchor = {
  N: N_PT_ANCHOR,
  log10N: +log10(N_PT_ANCHOR).toFixed(4), // ~ 5.6890
  decadesBelowSoleSurvivor: +(log10(N_STAR) - log10(N_PT_ANCHOR)).toFixed(4), // ~ 7.9851
  ratioSoleSurvivorOverAnchor: +(N_STAR / N_PT_ANCHOR).toExponential(4), // ~ 9.6631e7
};
const vsEmpiricalFloor = {
  N: N_E1E2_FLOOR,
  log10N: +log10(N_E1E2_FLOOR).toFixed(4), // 6.0000
  decadesBelowSoleSurvivor: +(log10(N_STAR) - log10(N_E1E2_FLOOR)).toFixed(4), // ~ 7.6741
  ratioSoleSurvivorOverFloor: +(N_STAR / N_E1E2_FLOOR).toExponential(4), // ~ 4.7214e7
};

// Height read: the same sole-survivor N* mapped to a height T0, compared to the verified height.
const T0_STAR = effectiveHeightForN(N_STAR); // ~ 1.0913e13
const vsVerifiedHeight = {
  T_PT,
  log10_T_PT: +log10(T_PT).toFixed(4), // ~ 12.4771
  T0_at_sole_survivor: +T0_STAR.toExponential(4), // ~ 1.0913e13
  logT0_at_sole_survivor: +Math.log(T0_STAR).toFixed(4), // ~ 30.0210
  decadesAboveVerifiedHeight: +(log10(T0_STAR) - log10(T_PT)).toFixed(4), // ~ 0.5608
  ratioT0OverVerified: +(T0_STAR / T_PT).toFixed(4), // ~ 3.6377
  // Same physical height, two coordinates: T_PT is reached at only N ~ 488602 retained terms,
  // so on the term-count axis the sole-survivor landmark still sits ~ 8 decades beyond T_PT.
  retainedTermCountAtVerifiedHeight: N_PT_ANCHOR,
};

export const IMP36119_SOLE_SURVIVOR_HEIGHT_VS_REACHABLE_N_CONTEXT = {
  id: 'imp-36119',
  proofSection: 'S-frontier',
  question:
    'The imp-36046 tail viz extends E(N) = E_trunc + E_flow + E_coll shares out to the imp-35971 ' +
    'sole-survivor height N* ~ 4.7214e13 where E_trunc stands essentially alone, but never places ' +
    'that landmark beside the scales the program actually reaches. How many orders of magnitude does ' +
    'N* sit above the PT retained-term anchor N ~ 488602 (imp-35812), the extended empirical E1/E2 ' +
    'floor N* = 1e6 (PATH 1), and the verified zero-height rung T_PT = 3e12?',
  method:
    'Reuse the pinned landmarks verbatim (N* ~ 4.7214e13 from imp-35971; N ~ 488602 = floor(sqrt(T_PT ' +
    '/ 4pi)) from imp-35812; N* = 1e6 from PATH 1; T_PT = 3e12 from Platt-Trudgian). Tabulate the ' +
    'log10 separations on the model N-axis (assembly term-count) against the two N-anchors, and the ' +
    'height read T0(N*) vs T_PT via effectiveHeightForN. State plainly that the sole-survivor height ' +
    'is a model-extrapolation landmark, not a reachable assembly height.',
  soleSurvivorLog10N: N_STAR_LOG10, // ~ 13.6741
  vsRetainedAnchor, // ~ 7.99 decades above N ~ 488602 (ratio ~ 9.66e7)
  vsEmpiricalFloor, // ~ 7.67 decades above N* = 1e6 (ratio ~ 4.72e7)
  vsVerifiedHeight, // as a HEIGHT only ~ 0.56 decades above T_PT, but ~ 8 decades on the term-count axis
  isRigorous: false,
  isUnconditional: false,
  isReachableAssemblyHeight: false, // the whole point: it is a model-extrapolation landmark
  verdict:
    'ASSESSMENT (NOT rigorous). Placing the imp-35971 E_trunc sole-survivor height N* ~ 4.7214e13 ' +
    '(log10 ~ 13.674) beside the reachable scales: on the E(N) model N-axis (assembly term-count) it ' +
    'sits ~ 7.99 decades ABOVE the PT retained-term anchor N ~ 488602 (= floor(sqrt(T_PT / 4pi)) at ' +
    'T_PT = 3e12; ratio ~ 9.66e7) and ~ 7.67 decades above the extended empirical E1/E2 floor N* = 1e6 ' +
    '(ratio ~ 4.72e7) -- roughly EIGHT orders of magnitude beyond anything the program has actually ' +
    'summed or swept. Read as a HEIGHT instead, the model maps N* to T0(N*) ~ 1.091e13 (log T0 ~ 30.02), ' +
    'only ~ 0.56 decades (factor ~ 3.64) above the verified zero-height T_PT = 3e12; but that same T_PT ' +
    'is reached at only N ~ 488602 retained terms, so the ~ 8-decade gap lives entirely in how many terms ' +
    'the N-axis counts, not in the height. The sole-survivor height is therefore a MODEL-EXTRAPOLATION ' +
    'LANDMARK on the sigma -> 0 tail of the imp-3406 / imp-33582 surrogate -- it marks where the fixed ' +
    'truncation floor would stand alone if the decomposition were pushed ~ 8 decades past every assembly, ' +
    'sweep, or verification scale -- NOT a reachable assembly height. Reuses the pinned imp-35971 / ' +
    'imp-35812 literals unchanged; derives no remainder; discharges nothing; changes no bound; establishes ' +
    'no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) ' +
    'and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35971 (sole-survivor height N* ~ 4.7214e13 this contextualizes); imp-36046 (the tail viz that ' +
    'never placed N* beside reachable scales); imp-35812 / imp-35674 Part D (retained-term anchor N ~ ' +
    '488602 at T_PT = 3e12); PATH 1 (extended empirical E1/E2 floor N* = 1e6); imp-3220 / imp-3406 (RvM ' +
    'surrogate log-height); imp-2642 / imp-2643 (C_C = (1/8) sqrt(3 pi)); imp-2631 (E_trunc floor); ' +
    'imp-486 (GUE-conditional caveat). Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian ' +
    '2021 (Lambda <= 0.2).',
};

export const IMP36119_SOLE_SURVIVOR_HEIGHT_VS_REACHABLE_N_CONTEXT_ASSERTIONS = [
  {
    // (1) sole-survivor landmark sits ~ 7.99 decades above the PT retained-term anchor N ~ 488602.
    id: 'imp36119-vs-retained-anchor',
    description: 'N* ~ 4.7214e13 sits ~ 7.99 decades above the PT retained-term anchor N ~ 488602 (ratio ~ 9.66e7)',
    holds: () =>
      Math.abs(vsRetainedAnchor.N - 488602) < 1 &&
      Math.abs(vsRetainedAnchor.decadesBelowSoleSurvivor - 7.9851) < 5e-3 &&
      Math.abs(vsRetainedAnchor.ratioSoleSurvivorOverAnchor / 9.6631e7 - 1) < 1e-3,
  },
  {
    // (2) sole-survivor landmark sits ~ 7.67 decades above the empirical E1/E2 floor N* = 1e6.
    id: 'imp36119-vs-empirical-floor',
    description: 'N* ~ 4.7214e13 sits ~ 7.67 decades above the PATH-1 empirical E1/E2 floor N* = 1e6 (ratio ~ 4.72e7)',
    holds: () =>
      vsEmpiricalFloor.N === 1e6 &&
      Math.abs(vsEmpiricalFloor.decadesBelowSoleSurvivor - 7.6741) < 5e-3 &&
      Math.abs(vsEmpiricalFloor.ratioSoleSurvivorOverFloor / 4.7214e7 - 1) < 1e-3,
  },
  {
    // (3) as a HEIGHT the landmark is only ~ 0.56 decades above the verified height T_PT = 3e12,
    //     while its retained-term count at that height stays ~ 488602 (the ~ 8-decade term-count gap).
    id: 'imp36119-height-read-vs-verified',
    description: 'T0(N*) ~ 1.091e13 sits only ~ 0.56 decades (factor ~ 3.64) above the verified height T_PT = 3e12',
    holds: () =>
      Math.abs(vsVerifiedHeight.T0_at_sole_survivor / 1.0913e13 - 1) < 1e-3 &&
      Math.abs(vsVerifiedHeight.logT0_at_sole_survivor - 30.021) < 0.01 &&
      Math.abs(vsVerifiedHeight.decadesAboveVerifiedHeight - 0.5608) < 5e-3 &&
      Math.abs(vsVerifiedHeight.ratioT0OverVerified - 3.6377) < 5e-3 &&
      vsVerifiedHeight.retainedTermCountAtVerifiedHeight === 488602,
  },
  {
    // (4) the two N-axis anchors are both ~ 8 decades (i.e. > 7.5) below the sole-survivor landmark,
    //     confirming the "roughly eight orders of magnitude" orientation claim.
    id: 'imp36119-roughly-eight-decades',
    description: 'both reachable N-anchors sit > 7.5 decades below N*, so the landmark is ~ 8 orders of magnitude beyond reachable N',
    holds: () =>
      vsRetainedAnchor.decadesBelowSoleSurvivor > 7.5 &&
      vsEmpiricalFloor.decadesBelowSoleSurvivor > 7.5 &&
      Math.abs(N_STAR_LOG10 - 13.6741) < 5e-3,
  },
  {
    // (5) honesty gate: assessment only, conditional, no bound moves, not a reachable height,
    //     imp-486 kept, imp-35337a OPEN, no refereed bound is changed, NO QED.
    id: 'imp36119-assessment-only-no-qed',
    description: 'assessment only: not rigorous/unconditional, not a reachable height, changes no bound, keeps imp-486, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP36119_SOLE_SURVIVOR_HEIGHT_VS_REACHABLE_N_CONTEXT;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        r.isReachableAssemblyHeight === false &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a\s+stays\s+OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP36119_SOLE_SURVIVOR_HEIGHT_VS_REACHABLE_N_CONTEXT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36119-sole-survivor-height-vs-reachable-N-context assertion failed: ${a.id}`);
  }
}
