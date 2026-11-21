/**
 * @module imp-35699-post-port-unconditional-share-9999-99999-crossings
 *
 * imp-35699 (measurement, frontier-direction): imp-35654 characterizes the POST-PORT far-tail
 * bridge as "unconditional up to a vanishing GUE-conditional share sigma" -- i.e. AFTER the
 * imp-34791 E_trunc barrier lemma is ported, the post-port unconditional share is 1 - sigma and
 * the sole residual conditional share is the GUE-conditional sigma = E_coll / E(N) (baked
 * landmark: sigma < 1e-3 at N ~ 5.432e15). imp-35654 never tabulates the share ladder nor the
 * crossing N. This module MEASURES the post-port unconditional share 1 - sigma across the
 * imp-35337 interior peak and the imp-35334 sigma landmarks, and LOCATES the N at which the
 * post-port unconditional share first exceeds 0.9999 and 0.99999, quantifying how deep the tail
 * must go for near-total unconditionality.
 *
 * IMPORTANT -- the "post-port" framing is HYPOTHETICAL (imp-35654). The E_trunc barrier-lemma port
 * is NOT done: PRE-port (imp-35334/imp-35410) E_trunc/E(N) is a DISTINCT C_T barrier-lemma
 * conditionality (imp-34791, deterministic realness control above T_PT, NO GUE/PCC) and the true
 * pre-port unconditional share is only E_flow/E(N) (~7.35e-11 at sigma < 1e-4). The 1 - sigma
 * reading measured here is the SHARE THAT WOULD BE UNCONDITIONAL ONCE the port lands, not a
 * present-tense unconditional share. Measurement of the imp-35654 post-port model only.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-35410 / imp-35334 / imp-34474 / imp-3406)
 * --------------------------------------------------------------------------------------
 *     E(N)   = E_trunc + E_flow + E_coll,      sigma(N) = E_coll / E(N),
 *     T0     = effectiveHeightForN(N)          (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant early, GUE-conditional C_H = 1/8)
 *     E_flow = C_F (log T0 / T0) * Gronwall,   C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                        (N-independent floor, imp-2631/imp-3220)
 *   post-port unconditional share = 1 - sigma  (imp-35654: E_trunc reclassed as unconditional
 *                                               after the port; only E_coll/E(N) = sigma survives).
 * No re-derivation, no fresh model: the exact imp-35410 parts() and the identical decreasing-sigma
 * log10-N bisection, read as 1 - sigma.
 *
 * THE MEASUREMENT (measurement only)
 * ----------------------------------
 *   post-port unconditional share ladder (1 - sigma):
 *     imp-35337 interior peak  N ~ 9.219e5   sigma ~ 0.949429   1 - sigma ~ 0.050571
 *     imp-35334 sigma < 0.1    N ~ 3.213e11  sigma = 0.1        1 - sigma = 0.900000
 *     imp-35334 sigma < 0.01   N ~ 4.624e13  sigma = 0.01       1 - sigma = 0.990000
 *     imp-35334 sigma < 1e-3   N ~ 5.432e15  sigma = 1e-3       1 - sigma = 0.999000
 *   crossings:
 *     1 - sigma > 0.9999  first at N ~ 6.164881782e17  (log10 N ~ 17.789925, = imp-35410 sigma<1e-4)
 *     1 - sigma > 0.99999 first at N ~ 6.888981945e19  (log10 N ~ 19.838155, sigma<1e-5)
 *   The 0.99999 crossing sits ~2.048 decades in N past the 0.9999 crossing: each extra "nine" of
 *   post-port unconditionality costs ~2.05 decades of tail height.
 *
 * THE FINDINGS
 * ------------
 *   (M1) THE POST-PORT UNCONDITIONAL SHARE LADDER. 1 - sigma climbs 0.050571 (imp-35337 peak) ->
 *        0.9 -> 0.99 -> 0.999 across the imp-35334 landmarks. At the interior peak the post-port
 *        unconditional share is only ~5%: near the peak the (would-be-ported) bridge is still
 *        ~95% GUE-conditional -- near-total unconditionality is a FAR-tail phenomenon only.
 *   (M2) THE 0.9999 CROSSING IS N ~ 6.165e17. The post-port unconditional share 1 - sigma first
 *        exceeds 0.9999 exactly where sigma first drops below 1e-4, at N ~ 6.164881782e17
 *        (log10 N ~ 17.7899), the imp-35410 sigma < 1e-4 landmark.
 *   (M3) THE 0.99999 CROSSING IS N ~ 6.889e19. 1 - sigma first exceeds 0.99999 where sigma first
 *        drops below 1e-5, at N ~ 6.888981945e19 (log10 N ~ 19.8382), ~2.048 decades in N past the
 *        0.9999 crossing. Each additional nine of post-port unconditionality costs ~2.05 decades
 *        of tail height -- the residual GUE-conditional share sigma vanishes only ~1 decade per
 *        ~2.05 decades of N, so "near-total unconditionality" requires astronomically deep tails.
 *
 * MEASUREMENT ONLY. The "post-port unconditional share = 1 - sigma" reading is the imp-35654
 * HYPOTHETICAL post-port model; the E_trunc barrier-lemma port is NOT done, so 1 - sigma is the
 * would-be-unconditional share, not a present-tense one (the true pre-port unconditional share is
 * E_flow/E(N)). The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; the imp-34791
 * E_trunc = barrier-lemma reclassification is UNCHANGED; ports nothing; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35654 (post-port far-tail mixed-conditionality verdict: unconditional share = 1-sigma, residual = sigma)
 * @see imp-35410-far-tail-sigma-1e-4-threshold-three-way-shares (sigma<1e-4 landmark; parts() + bisection source)
 * @see imp-35334-far-tail-effectively-unconditional-vs-etrunc-conditionality (sigma<1e-3 landmark ladder)
 * @see imp-35337 (interior sigma-peak sigma_max ~ 0.949429 at N ~ 9.219e5)
 * @see imp-34791-etrunc-eflow-pt-anchor-honest-discharge (E_trunc = unported barrier lemma; deterministic, NO GUE/PCC)
 * @see imp-486 (C_mb GUE-conditional); imp-398 (E_flow C_F prefactor)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35410/imp-35334 exactly
const L_PT = 0.121; // imp-452/imp-459 unconditional finite-height beat (< PT 0.2)

// EXACT imp-35410/imp-35334 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

function sigmaAt(N) {
  return parts(N).sigma;
}
// Identical decreasing-sigma log10-N bisection to imp-35410/imp-35334.
function thresholdLog10(target, loExp, hiExp) {
  let lo = loExp;
  let hi = hiExp;
  for (let it = 0; it < 200; it++) {
    const mid = (lo + hi) / 2;
    if (sigmaAt(Math.pow(10, mid)) > target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// (M1) The post-port unconditional share ladder across the imp-35337 peak + imp-35334 landmarks.
const N_PEAK = 9.219e5; // imp-35337 interior sigma-peak location (ill-conditioned argmax)
const SIGMA_PEAK = sigmaAt(N_PEAK); // ~0.949429
const UNCOND_AT_PEAK = 1 - SIGMA_PEAK; // ~0.050571

const LADDER = [
  { label: 'imp-35337 interior peak', N: N_PEAK, sigma: SIGMA_PEAK },
  { label: 'imp-35334 sigma<0.1', N: Math.pow(10, thresholdLog10(0.1, 10, 14)), sigma: 0.1 },
  { label: 'imp-35334 sigma<0.01', N: Math.pow(10, thresholdLog10(0.01, 12, 16)), sigma: 0.01 },
  { label: 'imp-35334 sigma<1e-3', N: Math.pow(10, thresholdLog10(0.001, 14, 20)), sigma: 0.001 },
].map((r) => ({
  landmark: r.label,
  N: +r.N.toExponential(6),
  sigma: +r.sigma.toFixed(9),
  postPortUnconditionalShare: +(1 - r.sigma).toFixed(9),
}));

// (M2) The 0.9999 crossing: 1 - sigma > 0.9999  <=>  sigma < 1e-4 (imp-35410 landmark).
const LOG10_9999 = thresholdLog10(0.0001, 16, 22); // ~17.789925
const N_9999 = Math.pow(10, LOG10_9999); // ~6.165e17
const P_9999 = parts(N_9999);

// (M3) The 0.99999 crossing: 1 - sigma > 0.99999  <=>  sigma < 1e-5.
const LOG10_99999 = thresholdLog10(0.00001, 18, 24); // ~19.838155
const N_99999 = Math.pow(10, LOG10_99999); // ~6.889e19
const P_99999 = parts(N_99999);

const SPAN_DECADES_9999_TO_99999 = LOG10_99999 - LOG10_9999; // ~2.048

export const IMP35699_POST_PORT_UNCONDITIONAL_SHARE_CROSSINGS = {
  id: 'imp-35699',
  proofSection: 'S-frontier',
  question:
    'MEASURE the imp-35654 POST-PORT unconditional share 1 - sigma across the imp-35337 interior ' +
    'peak and the imp-35334 sigma landmarks, and LOCATE the N at which the post-port far-tail ' +
    'bridge unconditional share first exceeds 0.9999 and 0.99999, quantifying how deep the tail ' +
    'must go for near-total unconditionality. Measurement only; ports nothing; C_mb stays ' +
    'GUE-conditional per imp-486; changes no bound; NO QED.',
  componentModel:
    'E(N) = E_trunc + E_flow + E_coll; sigma = E_coll/E(N); post-port unconditional share = 1 - sigma ' +
    '(imp-35654: after the imp-34791 E_trunc barrier-lemma port, only the GUE-conditional E_coll/E(N) ' +
    'survives as conditional). T0 = effectiveHeightForN(N) (RvM inverse); E_coll = C_C sqrt(log T0 / N) ' +
    '(GUE-conditional C_H = 1/8, imp-486); E_flow = C_F (log T0 / T0) Gronwall (unconditionally rigorous, ' +
    'imp-398); E_trunc = 3.06e-5 (N-independent floor, imp-34791 unported barrier lemma). Identical ' +
    'parts() and decreasing-sigma log10-N bisection to imp-35410/imp-35334.',
  postPortFraming:
    'HYPOTHETICAL: the E_trunc barrier-lemma port (imp-34791) is NOT done. 1 - sigma is the share that ' +
    'WOULD be unconditional once the port lands (imp-35654); PRE-port the true unconditional share is ' +
    'only E_flow/E(N) (~7.35e-11 at sigma<1e-4) while E_trunc/E(N) is a DISTINCT C_T barrier-lemma ' +
    'conditionality (deterministic, NO GUE/PCC). Measurement of the imp-35654 post-port model only.',
  ladder: LADDER,
  crossings: {
    cross_0_9999: {
      claim:
        'The post-port unconditional share 1 - sigma first exceeds 0.9999 where sigma first drops ' +
        'below 1e-4, at N ~ 6.164881782e17 (log10 N ~ 17.7899, the imp-35410 sigma<1e-4 landmark)',
      N: +N_9999.toExponential(9), // 6.164881782e17
      log10_N: +LOG10_9999.toFixed(6), // 17.789925
      T0: +P_9999.T0.toExponential(6), // 1.065055e17
      sigma: +P_9999.sigma.toFixed(12), // 1.000000e-4
      postPortUnconditionalShare: +(1 - P_9999.sigma).toFixed(9), // 0.999900000
    },
    cross_0_99999: {
      claim:
        'The post-port unconditional share 1 - sigma first exceeds 0.99999 where sigma first drops ' +
        'below 1e-5, at N ~ 6.888981945e19 (log10 N ~ 19.8382), ~2.048 decades past the 0.9999 crossing',
      N: +N_99999.toExponential(9), // 6.888981945e19
      log10_N: +LOG10_99999.toFixed(6), // 19.838155
      T0: +P_99999.T0.toExponential(6), // 1.056594e19
      sigma: +P_99999.sigma.toFixed(12), // 1.000000e-5
      postPortUnconditionalShare: +(1 - P_99999.sigma).toFixed(9), // 0.999990000
    },
    span_decades_9999_to_99999: +SPAN_DECADES_9999_TO_99999.toFixed(4), // ~2.0482
    cost_per_extra_nine_decades:
      'Each additional nine of post-port unconditionality costs ~2.05 decades of tail height N.',
  },
  findings: {
    M1_post_port_share_ladder: {
      claim:
        'The post-port unconditional share 1 - sigma climbs 0.050571 (imp-35337 interior peak) -> ' +
        '0.9 -> 0.99 -> 0.999 across the imp-35334 sigma landmarks. At the interior peak the post-port ' +
        'unconditional share is only ~5% -- near-total unconditionality is a FAR-tail phenomenon only',
      unconditional_share_at_peak: +UNCOND_AT_PEAK.toFixed(9), // ~0.050571
      sigma_at_peak: +SIGMA_PEAK.toFixed(9), // ~0.949429
      ladder: LADDER,
    },
    M2_cross_0_9999_landmark: {
      claim:
        'The post-port unconditional share first exceeds 0.9999 at N ~ 6.164881782e17 (log10 N ~ ' +
        '17.7899), exactly the imp-35410 sigma<1e-4 landmark',
      N: +N_9999.toExponential(9),
      postPortUnconditionalShare: +(1 - P_9999.sigma).toFixed(9),
    },
    M3_cross_0_99999_landmark: {
      claim:
        'The post-port unconditional share first exceeds 0.99999 at N ~ 6.888981945e19 (log10 N ~ ' +
        '19.8382), ~2.048 decades past the 0.9999 crossing: each extra nine of post-port ' +
        'unconditionality costs ~2.05 decades of tail height N',
      N: +N_99999.toExponential(9),
      postPortUnconditionalShare: +(1 - P_99999.sigma).toFixed(9),
      span_decades_from_0_9999: +SPAN_DECADES_9999_TO_99999.toFixed(4),
    },
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). (M1) The imp-35654 post-port unconditional share ' +
    '1 - sigma climbs 0.050571 (imp-35337 interior peak N ~ 9.219e5) -> 0.9 (N ~ 3.213e11) -> 0.99 ' +
    '(N ~ 4.624e13) -> 0.999 (N ~ 5.432e15) across the imp-35334 sigma landmarks; near the interior ' +
    'peak the would-be-unconditional share is only ~5%, so near-total unconditionality is a FAR-tail ' +
    'phenomenon. (M2) The post-port unconditional share 1 - sigma first exceeds 0.9999 where sigma ' +
    'first drops below 1e-4, at N ~ 6.164881782e17 (log10 N ~ 17.7899, T0 ~ 1.065e17), the imp-35410 ' +
    'sigma<1e-4 landmark. (M3) It first exceeds 0.99999 where sigma first drops below 1e-5, at N ~ ' +
    '6.888981945e19 (log10 N ~ 19.8382, T0 ~ 1.057e19), ~2.048 decades in N past the 0.9999 crossing: ' +
    'each additional nine of post-port unconditionality costs ~2.05 decades of tail height. The ' +
    '"post-port unconditional share = 1 - sigma" reading is the imp-35654 HYPOTHETICAL post-port model; ' +
    'the imp-34791 E_trunc barrier-lemma port is NOT done, so 1 - sigma is the would-be-unconditional ' +
    'share, not a present-tense one (the true pre-port unconditional share is E_flow/E(N)). The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional share per imp-486 is UNTOUCHED; the imp-34791 E_trunc = barrier-lemma ' +
    'reclassification is UNCHANGED; ports nothing; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35654 (post-port unconditional share = 1-sigma, residual GUE share = sigma); imp-35410 ' +
    '(sigma<1e-4 landmark, parts() + bisection source); imp-35334 (sigma<1e-3 ladder); imp-35337 ' +
    '(interior sigma-peak sigma_max ~ 0.949429 at N ~ 9.219e5); imp-34791 (E_trunc = unported barrier ' +
    'lemma; deterministic, NO GUE/PCC); imp-486 (C_mb GUE-conditional); imp-398 (E_flow C_F prefactor); ' +
    'imp-2642 (C_H = 1/8 ansatz); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP35699_POST_PORT_UNCONDITIONAL_SHARE_CROSSINGS_ASSERTIONS = [
  {
    // (M1): the ladder reads 1 - sigma at the imp-35337 peak (~0.0506) then 0.9 / 0.99 / 0.999.
    id: 'imp35699-post-port-share-ladder',
    description: '1 - sigma ladder: ~0.0506 at imp-35337 peak, then 0.9, 0.99, 0.999 at imp-35334 landmarks',
    holds: () =>
      Math.abs(UNCOND_AT_PEAK - 0.050571) < 1e-4 &&
      Math.abs(LADDER[1].postPortUnconditionalShare - 0.9) < 1e-9 &&
      Math.abs(LADDER[2].postPortUnconditionalShare - 0.99) < 1e-9 &&
      Math.abs(LADDER[3].postPortUnconditionalShare - 0.999) < 1e-9,
  },
  {
    // (M2): the 0.9999 crossing is the imp-35410 sigma<1e-4 landmark N ~ 6.165e17.
    id: 'imp35699-cross-0-9999-landmark',
    description: '1 - sigma > 0.9999 first at N ~ 6.164881782e17 (log10 N ~ 17.7899), = imp-35410 sigma<1e-4',
    holds: () =>
      Math.abs(N_9999 - 6.164881782e17) / 6.164881782e17 < 1e-6 &&
      Math.abs(LOG10_9999 - 17.789925) < 1e-4 &&
      Math.abs((1 - P_9999.sigma) - 0.9999) < 1e-9,
  },
  {
    // (M3): the 0.99999 crossing is the sigma<1e-5 landmark N ~ 6.889e19.
    id: 'imp35699-cross-0-99999-landmark',
    description: '1 - sigma > 0.99999 first at N ~ 6.888981945e19 (log10 N ~ 19.8382), sigma<1e-5',
    holds: () =>
      Math.abs(N_99999 - 6.888981945e19) / 6.888981945e19 < 1e-6 &&
      Math.abs(LOG10_99999 - 19.838155) < 1e-4 &&
      Math.abs((1 - P_99999.sigma) - 0.99999) < 1e-9,
  },
  {
    // (M3): each extra nine of post-port unconditionality costs ~2.05 decades of tail height.
    id: 'imp35699-cost-per-extra-nine',
    description: 'the 0.99999 crossing sits ~2.048 decades in N past the 0.9999 crossing',
    holds: () => Math.abs(SPAN_DECADES_9999_TO_99999 - 2.0482) < 5e-3,
  },
  {
    // Honesty gate: post-port framing is hypothetical, ports nothing, GUE-conditional per imp-486,
    // E_trunc barrier lemma per imp-34791, no QED, no refereed bound is changed.
    id: 'imp35699-honesty-gate-no-qed',
    description: 'Measurement only: post-port hypothetical, ports nothing, C_mb GUE-conditional (imp-486), no QED, no refereed bound is changed',
    holds: () =>
      IMP35699_POST_PORT_UNCONDITIONAL_SHARE_CROSSINGS.isRigorous === false &&
      /GUE-conditional share per imp-486 is UNTOUCHED/.test(
        IMP35699_POST_PORT_UNCONDITIONAL_SHARE_CROSSINGS.verdict,
      ) &&
      /would-be-unconditional/i.test(IMP35699_POST_PORT_UNCONDITIONAL_SHARE_CROSSINGS.verdict) &&
      /ports nothing/i.test(IMP35699_POST_PORT_UNCONDITIONAL_SHARE_CROSSINGS.verdict) &&
      /NO QED/.test(IMP35699_POST_PORT_UNCONDITIONAL_SHARE_CROSSINGS.verdict) &&
      /refereed bound is changed/i.test(IMP35699_POST_PORT_UNCONDITIONAL_SHARE_CROSSINGS.verdict),
  },
];

for (const a of IMP35699_POST_PORT_UNCONDITIONAL_SHARE_CROSSINGS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35699-post-port-unconditional-share-9999-99999-crossings assertion failed: ${a.id}`,
    );
  }
}
