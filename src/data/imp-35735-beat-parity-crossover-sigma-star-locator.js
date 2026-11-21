/**
 * @module imp-35735-beat-parity-crossover-sigma-star-locator
 *
 * imp-35735 (numerical/measurement, S-frontier): imp-35678 concluded the finite-height
 * BEAT (carried by the DOMINANT E_coll term, whose far-tail share = sigma) hands off
 * MECHANICALLY to E_trunc (the C_T-barrier) parity as sigma -> 0, but never LOCATED the
 * crossover sigma* where the E_coll share (= sigma) actually falls below the E_trunc
 * share (= 1 - sigma - E_flow_share). This module locates that crossover.
 *
 * THE CROSSOVER (clean characterization)
 * -----------------------------------------------------------------------------
 * The E_coll share EQUALS the E_trunc share iff E_coll = E_trunc (both divided by the
 * same E(N)), so the crossover is simply where the GUE-conditional collision term meets
 * the N-independent C_T-barrier floor:
 *     E_coll(N*) = E_trunc = 3.06e-5.
 * At that N* the share identity is exact:
 *     sigma* = E_coll/E(N*) = E_trunc/E(N*) = (1 - sigma* - E_flow_share)  =>
 *     sigma* = (1 - E_flow_share)/2.
 * The TRIVIAL reading (ignore E_flow) gives sigma* ~ 0.5; the REFINEMENT with the true
 * E_flow share at N* pulls it below 0.5 by exactly E_flow_share/2.
 *
 * WHAT THE MEASUREMENT SHOWS (reusing the imp-35410/imp-35732 parts() VERBATIM)
 * -----------------------------------------------------------------------------
 *   crossover  N* ~ 3.280294e9   (log10 N* ~ 9.51591),  T0 ~ 1.143785e9
 *   E_coll(N*) = E_trunc = 3.06e-5  (by construction),  E_flow(N*) ~ 5.811677e-8
 *   TRUE E_flow share at N*        ~ 9.487195e-4   (NOT the deep-tail ~5.655e-9 literal!)
 *   sigma* (E_coll share = E_trunc share)  ~ 0.4995256402582481
 *   trivial (E_flow -> 0)          = 0.5
 *   refinement gap 0.5 - sigma*    = E_flow_share/2 ~ 4.743597e-4
 * KEY SUBTLETY: the crossover sits at a SHALLOW tail (N* ~ 3.28e9), where the E_flow
 * share is ~9.49e-4 -- about FIVE decades LARGER than the deep-tail ~5.655e-9 literal
 * (imp-35677/imp-35732). So refining "with the true E_flow share" is NOT a rounding
 * correction to 0.5: it uses the E_flow share AT the crossover, moving sigma* to
 * 0.49952564, a bona fide sub-0.5 shift of ~4.74e-4.
 *
 * WHERE IT SITS RELATIVE TO THE imp-35334 LANDMARK LADDER
 * -----------------------------------------------------------------------------
 * sigma* ~ 0.4995 sits ~499.5x ABOVE the SHALLOWEST imp-35334/imp-35677 far-tail landmark
 * (sigma = 1e-3) and ~5e5x above the deepest (sigma = 1e-6); equivalently N* ~ 3.28e9 is
 * ~6.22 decades SHALLOWER than the imp-35334 landmark N ~ 5.432e15. So across the ENTIRE
 * recorded far-tail landmark ladder (sigma <= 1e-3, N >= 5.432e15) the beat carrier
 * E_coll is ALREADY DEEPLY SUB-DOMINANT to the C_T-barrier E_trunc -- the mechanical
 * handoff imp-35678 describes is COMPLETE everywhere on the ladder; the regime in which
 * E_coll is the DOMINANT term (imp-35678 / imp-2800 at N* = 1e4, sigma ~ 0.902) is
 * confined to the SHALLOW tail sigma > sigma* ~ 0.5 (N < N* ~ 3.28e9). sigma* is exactly
 * the boundary separating the finite-N "E_coll dominant / beat visible" regime from the
 * far-tail "E_trunc dominant / parity-with-PT" regime.
 *
 * MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406 extrapolation,
 * NOT a rigorous asymptotic; this LOCATES a crossover the imp-35678 handoff left implicit;
 * reconciles two recorded readings; asserts NO beat beyond the recorded (already-caveated)
 * imp-452/459 finite-height one; changes no bound; establishes no operator positivity;
 * C_mb stays GUE-conditional per imp-486; the imp-34791 E_trunc barrier-lemma
 * reclassification is UNCHANGED; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35678-finite-height-beat-vs-parity-regime-boundary (the mechanical handoff this LOCATES)
 * @see imp-35723-beat-parity-regime-boundary-Nsigma-locator (SAME crossover, located by mapping the imp-35750
 *   sigma = 0.5 handoff onto the sigma(N) ladder: N_cross ~ 3.267e9 there vs N* ~ 3.280294e9 here, agreeing to
 *   the N-decade -- the N-space framing (imp-35723) and the sigma-space framing (THIS module) of the identical
 *   beat-carrier-to-barrier handoff)
 * @see imp-35677-postport-residual-share-sigma-ladder (the deep-tail E_coll share = sigma ladder)
 * @see imp-35732-eflow-share-true-nscaling-interior-bucket-split (parts()/bisection source; true E_flow N-scaling)
 * @see imp-35334-far-tail-effectively-unconditional-vs-etrunc-conditionality (the landmark ladder sigma<=1e-3)
 * @see imp-398 (E_flow C_F prefactor); imp-486 (C_mb GUE-conditional; E_coll share = sigma)
 * @see imp-34791-etrunc-eflow-pt-anchor-honest-discharge (E_trunc = 3.06e-5 unported barrier lemma)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-34791)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35410/imp-35334/imp-35732 exactly
const L_PT = 0.2; // Platt-Trudgian 2021 bound -- matched, not beaten
const SIGMA_LANDMARK_SHALLOWEST = 1.0e-3; // imp-35334/imp-35677 shallowest far-tail landmark
const N_LANDMARK_SHALLOWEST = 5.432e15; // imp-35334 N at sigma = 1e-3 (for decade comparison)

// EXACT imp-35410/imp-35732 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous (imp-398)
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (imp-486 C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Crossover N* where E_coll(N) = E_trunc (E_coll decreasing in N -> log10-N bisection).
function crossoverLog10() {
  let lo = 4;
  let hi = 16;
  for (let it = 0; it < 200; it++) {
    const mid = (lo + hi) / 2;
    if (parts(Math.pow(10, mid)).E_coll - E_TRUNC_PT > 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const LOG10_N_STAR = crossoverLog10();
const N_STAR = Math.pow(10, LOG10_N_STAR);
const P_STAR = parts(N_STAR);

const E_FLOW_SHARE_STAR = P_STAR.E_flow / P_STAR.E_N; // TRUE E_flow share AT the crossover
const E_TRUNC_SHARE_STAR = E_TRUNC_PT / P_STAR.E_N; // = sigma* (crossover crux)
const SIGMA_STAR = P_STAR.sigma; // E_coll share at N* = E_trunc share
const SIGMA_STAR_TRIVIAL = 0.5; // ignore E_flow: sigma = 1 - sigma -> 0.5
const SIGMA_STAR_REFINED = (1 - E_FLOW_SHARE_STAR) / 2; // refine with the true E_flow share
const REFINEMENT_GAP = SIGMA_STAR_TRIVIAL - SIGMA_STAR_REFINED; // = E_flow_share/2

// Regime placement relative to the imp-35334 landmark ladder.
const RATIO_ABOVE_SHALLOWEST_LANDMARK = SIGMA_STAR / SIGMA_LANDMARK_SHALLOWEST; // ~499.5
const DECADES_SHALLOWER_THAN_LANDMARK = Math.log10(N_LANDMARK_SHALLOWEST) - LOG10_N_STAR; // ~6.22

export const IMP35735_CROSSOVER = {
  log10N: +LOG10_N_STAR.toFixed(6),
  N: +N_STAR.toExponential(9),
  T0: +P_STAR.T0.toExponential(6),
  E_coll: +P_STAR.E_coll.toExponential(9),
  E_trunc: E_TRUNC_PT,
  E_flow: +P_STAR.E_flow.toExponential(6),
  eFlowShareStar: +E_FLOW_SHARE_STAR.toExponential(9),
  eTruncShareStar: +E_TRUNC_SHARE_STAR.toExponential(9),
  sigmaStar: +SIGMA_STAR.toExponential(12),
  sigmaStarTrivial: SIGMA_STAR_TRIVIAL,
  sigmaStarRefined: +SIGMA_STAR_REFINED.toExponential(12),
  refinementGap: +REFINEMENT_GAP.toExponential(9), // = eFlowShareStar/2
  ratioAboveShallowestLandmark: +RATIO_ABOVE_SHALLOWEST_LANDMARK.toFixed(6),
  decadesShallowerThanLandmark: +DECADES_SHALLOWER_THAN_LANDMARK.toFixed(6),
};

export const IMP35735_BEAT_PARITY_CROSSOVER_SIGMA_STAR_LOCATOR = {
  id: 'imp-35735',
  proofSection: 'S-frontier',
  question:
    'LOCATE the far-tail crossover sigma* where the imp-35678 finite-height beat carrier (E_coll share ' +
    '= sigma) drops below the E_trunc C_T-barrier share (1 - sigma - E_flow_share): trivially where ' +
    'sigma = 1 - sigma - E_flow_share (sigma ~ 0.5), then refined with the TRUE E_flow share at the ' +
    'crossover, and characterize how far above the imp-35334 landmark ladder it sits. Measurement only; ' +
    'reconciles two recorded readings; changes no bound; C_mb GUE-conditional per imp-486; NO QED.',
  componentModel:
    'Reuses the imp-35410/imp-35732 parts() VERBATIM: E(N) = E_trunc + E_flow + E_coll; E_flow = ' +
    'C_F (log T0 / T0) Gronwall with C_F = (log(T0/2pi)+1)/2pi (imp-398); E_coll = C_C sqrt(log T0 / N) ' +
    '(GUE-conditional, imp-486); E_trunc = 3.06e-5 (N-independent floor, imp-34791). The crossover is ' +
    'located by log10-N bisection on E_coll(N) = E_trunc (E_coll share = E_trunc share iff E_coll = E_trunc).',
  crossover: IMP35735_CROSSOVER,
  findings: {
    M1_crossover_is_where_ecoll_meets_the_barrier: {
      claim:
        'The E_coll share EQUALS the E_trunc share exactly at N* ~ 3.280294e9 (log10 N* ~ 9.51591), where ' +
        'E_coll(N*) = E_trunc = 3.06e-5 by construction, so sigma* = E_coll/E(N*) = E_trunc/E(N*). This is ' +
        'the crossover the imp-35678 mechanical handoff left implicit.',
      N_star: IMP35735_CROSSOVER.N,
      sigmaStar: IMP35735_CROSSOVER.sigmaStar,
      eTruncShareStar: IMP35735_CROSSOVER.eTruncShareStar,
    },
    M2_trivial_half_refined_below_by_eflow_share: {
      claim:
        'The TRIVIAL reading (ignore E_flow) gives sigma* = 0.5; refining with the TRUE E_flow share at ' +
        'the crossover pulls it to 0.49952564, below 0.5 by exactly E_flow_share/2 ~ 4.743597e-4. Because ' +
        'the crossover is at a SHALLOW tail (N* ~ 3.28e9) the true E_flow share there is ~9.487e-4 -- about ' +
        'five decades LARGER than the deep-tail ~5.655e-9 literal (imp-35677/imp-35732) -- so the refinement ' +
        'is a bona fide sub-0.5 shift, not a rounding correction.',
      sigmaStarTrivial: IMP35735_CROSSOVER.sigmaStarTrivial,
      sigmaStarRefined: IMP35735_CROSSOVER.sigmaStarRefined,
      eFlowShareStar: IMP35735_CROSSOVER.eFlowShareStar,
      refinementGap: IMP35735_CROSSOVER.refinementGap,
    },
    M3_crossover_far_above_the_landmark_ladder: {
      claim:
        'sigma* ~ 0.4995 sits ~499.5x ABOVE the shallowest imp-35334/imp-35677 far-tail landmark ' +
        '(sigma = 1e-3), i.e. N* ~ 3.28e9 is ~6.22 decades SHALLOWER than the imp-35334 landmark ' +
        'N ~ 5.432e15. So across the ENTIRE recorded far-tail ladder (sigma <= 1e-3) the beat carrier ' +
        'E_coll is ALREADY deeply sub-dominant to E_trunc -- the imp-35678 handoff is complete everywhere ' +
        'on the ladder; E_coll dominance (imp-2800 at N=1e4, sigma ~ 0.902) is confined to sigma > sigma*. ' +
        'sigma* is the boundary between the finite-N "beat visible" and far-tail "parity-with-PT" regimes.',
      ratioAboveShallowestLandmark: IMP35735_CROSSOVER.ratioAboveShallowestLandmark,
      decadesShallowerThanLandmark: IMP35735_CROSSOVER.decadesShallowerThanLandmark,
      L_pt_matched_not_beaten: L_PT,
    },
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Locating the imp-35678 beat->parity crossover by ' +
    'log10-N bisection on E_coll(N) = E_trunc (the E_coll share = E_trunc share iff E_coll = E_trunc) ' +
    'shows: (M1) the crossover sits at N* ~ 3.280294e9 (log10 N* ~ 9.51591), where sigma* = E_coll/E(N*) ' +
    '= E_trunc/E(N*) ~ 0.4995256402582481. (M2) The TRIVIAL reading (ignore E_flow) gives 0.5; refining ' +
    'with the TRUE E_flow share AT the crossover (~9.487e-4 -- about five decades larger than the deep-tail ' +
    '~5.655e-9 literal, because N* is a SHALLOW tail) pulls sigma* to 0.49952564, below 0.5 by exactly ' +
    'E_flow_share/2 ~ 4.743597e-4. (M3) sigma* ~ 0.4995 sits ~499.5x ABOVE the shallowest imp-35334 landmark ' +
    '(sigma = 1e-3) -- N* ~ 3.28e9 is ~6.22 decades SHALLOWER than the landmark N ~ 5.432e15 -- so across ' +
    'the ENTIRE recorded far-tail landmark ladder (sigma <= 1e-3) the beat carrier E_coll is already deeply ' +
    'sub-dominant to the C_T-barrier E_trunc; E_coll dominance (imp-2800 at N=1e4, sigma ~ 0.902) is confined ' +
    'to the shallow tail sigma > sigma*, and sigma* is exactly the boundary between the finite-N "beat ' +
    'visible" regime and the far-tail "parity-with-PT" regime that imp-35678 described mechanically. The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; this ' +
    'reconciles two recorded readings; asserts NO beat beyond the recorded (already-caveated) imp-452/459 ' +
    'finite-height one; changes no bound; establishes no operator positivity; C_mb GUE-conditional per ' +
    'imp-486 UNTOUCHED; imp-34791 E_trunc reclassification UNCHANGED; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35678 (finite-height beat vs parity mechanical handoff); imp-35677 (deep-tail E_coll share = sigma ' +
    'ladder); imp-35732 (parts()/bisection source, true E_flow N-scaling); imp-35334 (landmark ladder ' +
    'N ~ 5.432e15 at sigma = 1e-3); imp-2800 (E_coll dominates at N=1e4); imp-398 (E_flow C_F prefactor); ' +
    'imp-486 (C_mb GUE-conditional, E_coll share = sigma); imp-34791 (E_trunc = unported barrier lemma).',
};

export default IMP35735_BEAT_PARITY_CROSSOVER_SIGMA_STAR_LOCATOR;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35735_ASSERTIONS = [
  {
    // (M1) crossover crux: E_coll(N*) = E_trunc and E_coll share = E_trunc share at N*.
    id: 'imp35735-crossover-ecoll-equals-etrunc',
    description: 'At N* the collision term meets the C_T-barrier floor: E_coll(N*) = E_trunc, so E_coll share = E_trunc share',
    holds: () =>
      Math.abs(P_STAR.E_coll - E_TRUNC_PT) / E_TRUNC_PT < 1e-9 &&
      Math.abs(SIGMA_STAR - E_TRUNC_SHARE_STAR) < 1e-12 &&
      Math.abs(LOG10_N_STAR - 9.51591) < 1e-3 &&
      Math.abs(N_STAR - 3.280294e9) / 3.280294e9 < 1e-4,
  },
  {
    // (M2) sigma* = (1 - E_flow_share)/2: trivial 0.5, refined below 0.5 by exactly E_flow_share/2.
    id: 'imp35735-sigma-star-half-minus-eflow-share',
    description: 'sigma* = (1 - E_flow_share)/2: trivial 0.5, refined 0.49952564 (below 0.5 by E_flow_share/2)',
    holds: () =>
      SIGMA_STAR_TRIVIAL === 0.5 &&
      Math.abs(SIGMA_STAR - SIGMA_STAR_REFINED) < 1e-12 && // the live sigma* IS the refined form
      SIGMA_STAR < 0.5 && // refinement pulls it strictly below the trivial 0.5
      Math.abs(SIGMA_STAR - 0.4995256402582481) < 1e-9 &&
      Math.abs(REFINEMENT_GAP - E_FLOW_SHARE_STAR / 2) < 1e-15 &&
      Math.abs(REFINEMENT_GAP - 4.743597e-4) < 1e-8,
  },
  {
    // (M2b) the TRUE E_flow share at the SHALLOW crossover (~9.49e-4) is decades above the deep-tail literal.
    id: 'imp35735-crossover-eflow-share-is-shallow-tail-scale',
    description: 'True E_flow share at the crossover ~9.487e-4 is ~5 decades above the deep-tail ~5.655e-9 literal',
    holds: () =>
      Math.abs(E_FLOW_SHARE_STAR - 9.487194835e-4) < 1e-11 &&
      E_FLOW_SHARE_STAR / 5.655e-9 > 1e4, // shallow-tail E_flow share dwarfs the deep-tail literal
  },
  {
    // (M3) regime placement: crossover sits far ABOVE (shallower than) the imp-35334 landmark ladder.
    id: 'imp35735-crossover-far-above-landmark-ladder',
    description: 'sigma* ~ 499.5x above the shallowest landmark (1e-3); N* ~ 6.22 decades shallower than N ~ 5.432e15',
    holds: () =>
      Math.abs(RATIO_ABOVE_SHALLOWEST_LANDMARK - 499.5256) < 1e-3 &&
      RATIO_ABOVE_SHALLOWEST_LANDMARK > 100 && // sigma* deep above the whole ladder (sigma <= 1e-3)
      Math.abs(DECADES_SHALLOWER_THAN_LANDMARK - 6.22) < 1e-2 &&
      DECADES_SHALLOWER_THAN_LANDMARK > 6, // N* many decades shallower than the landmark N
  },
  {
    // Regime bracket: E_coll dominant (sigma > sigma*) at shallow N; E_trunc dominant (sigma < sigma*) at deep N.
    id: 'imp35735-regime-bracket-around-crossover',
    description: 'E_coll dominant just below N* (sigma>sigma*); E_trunc dominant just above N* (sigma<sigma*)',
    holds: () =>
      parts(N_STAR / 10).E_coll > E_TRUNC_PT && // shallower tail: beat carrier still dominant
      parts(N_STAR / 10).sigma > SIGMA_STAR &&
      parts(N_STAR * 10).E_coll < E_TRUNC_PT && // deeper tail: barrier dominant, handoff done
      parts(N_STAR * 10).sigma < SIGMA_STAR,
  },
  {
    // Honesty gate: measurement only, reconciles two readings, GUE-conditional per imp-486, no QED, no refereed bound is changed.
    id: 'imp35735-honesty-gate-no-qed',
    description: 'Measurement only: locates the imp-35678 crossover, C_mb GUE-conditional per imp-486, no beat, no QED, no refereed bound is changed',
    holds: () =>
      IMP35735_BEAT_PARITY_CROSSOVER_SIGMA_STAR_LOCATOR.isRigorous === false &&
      /crossover/.test(IMP35735_BEAT_PARITY_CROSSOVER_SIGMA_STAR_LOCATOR.verdict) &&
      /asserts NO beat beyond the recorded/.test(IMP35735_BEAT_PARITY_CROSSOVER_SIGMA_STAR_LOCATOR.verdict) &&
      /UNTOUCHED/.test(IMP35735_BEAT_PARITY_CROSSOVER_SIGMA_STAR_LOCATOR.verdict) &&
      /NO QED/.test(IMP35735_BEAT_PARITY_CROSSOVER_SIGMA_STAR_LOCATOR.verdict) &&
      /refereed bound is changed/i.test(IMP35735_BEAT_PARITY_CROSSOVER_SIGMA_STAR_LOCATOR.verdict),
  },
];

for (const a of IMP35735_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35735-beat-parity-crossover-sigma-star-locator assertion failed: ${a.id}`);
  }
}
