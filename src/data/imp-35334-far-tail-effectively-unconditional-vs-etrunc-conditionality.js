/**
 * @module imp-35334-far-tail-effectively-unconditional-vs-etrunc-conditionality
 *
 * imp-35334 (proof/assessment, frontier-direction): the currentStatus notes that the
 * GUE-conditional share sigma(N) = E_coll / E(N) decays toward 0 as the constant E_trunc
 * floor outlives the vanishing collision term (imp-33582/imp-3444), dropping below 0.1 only
 * at N ~ 3.213e11 (imp-33582) and below 0.01 at N ~ 4.624e13 (imp-33620/imp-34474). This
 * module (i) MEASURES the next threshold -- the height where sigma first drops below 1e-3 --
 * by the identical imp-34474/imp-33620 log10-N bisection, and (ii) ASSESSES the binary the
 * ticket poses: does the E(N) bridge become effectively UNCONDITIONAL in the far tail, or
 * does the surviving E_trunc floor itself carry an unremoved conditional dependence?
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-34474 / imp-33620 / imp-3406 / imp-3220)
 * --------------------------------------------------------------------------------------
 *     E(N)   = E_trunc + E_flow + E_coll,      sigma(N) = E_coll / E(N),
 *     T0     = effectiveHeightForN(N)          (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant early, GUE-conditional C_H = 1/8)
 *     E_flow = C_F (log T0 / T0) * Gronwall,   C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                        (N-independent floor, imp-2631/imp-3220)
 * No re-derivation, no fresh model: the exact imp-34474 parts() and the identical decreasing-
 * sigma bisection, evaluated at the sigma < 1e-3 threshold.
 *
 * THE MEASUREMENT (measurement only)
 * ----------------------------------
 *   N_0001     = 5.432329825e15         (sigma < 1e-3 threshold, log10 N ~ 15.735)
 *   T0(N_0001) = 1.074271e15
 *   E_trunc    = 3.060000e-5            (constant floor)
 *   E_coll     = 3.063063e-8            (GUE-conditional, decayed to ~0.1% of E_trunc)
 *   E_flow     = 1.732127e-13           (negligible)
 *   E(N_0001)  = 3.063063080e-5         headline GUE-conditional slack Lambda <= E(N)
 *   sigma      = 0.001000000            (= 1e-3 by construction at the threshold)
 *   The sigma < 1e-3 landmark sits ~2.07 decades in N past the imp-33620 sigma < 0.01 point.
 *
 * THE THREE-WAY CONDITIONALITY DECOMPOSITION (the assessment core)
 * ---------------------------------------------------------------
 *   The three sub-terms carry THREE DISTINCT provenance classes -- they are NOT one bucket:
 *     - E_coll  : GUE-conditional (imp-486 C_mb; C_H = 1/8 ansatz). This is the ONLY term
 *                 that depends on the GUE pair-correlation hypothesis. Its share of E(N) is
 *                 exactly sigma.
 *     - E_flow  : unconditionally rigorous (imp-398). Fully discharged; no GUE, no C_T.
 *     - E_trunc : "rigorous-modulo-C_T" (imp-2643/imp-2706 ledger), reclassified by imp-34791
 *                 from "effective constant C_T" to an UNPORTED BARRIER LEMMA (deterministic
 *                 barrier-type realness control above T_PT -- NO GUE, NO PCC). Its residual
 *                 is a DIFFERENT conditionality from the GUE one, and it is sigma-BLIND.
 *   At the sigma < 1e-3 landmark the three shares of E(N) are:
 *     GUE-conditional (E_coll)/E(N)          = 1.000000e-3   (= sigma)
 *     C_T barrier-lemma (E_trunc)/E(N)       = 0.999000      (dominates the surviving bridge)
 *     fully-unconditional (E_flow)/E(N)      = 5.65e-9       (negligible)
 *
 * THE FINDINGS
 * ------------
 *   (M1) THE sigma < 1e-3 LANDMARK IS N ~ 5.432e15. The identical imp-34474 bisection first
 *        drops sigma below 1e-3 at N ~ 5.432329825e15 (log10 N ~ 15.735, T0 ~ 1.074e15), where
 *        E_coll ~ 3.063e-8 has decayed to ~0.1% of the E_trunc floor and E(N)/E_trunc = 1.001001.
 *        This extends the imp-33582 (sigma<0.1) / imp-33620 (sigma<0.01) ladder one further
 *        decade of sigma, ~2.07 decades in N past the sigma<0.01 point.
 *   (M2) EFFECTIVELY UNCONDITIONAL RELATIVE TO GUE -- YES. The GUE dependence of the E(N)
 *        bridge lives ENTIRELY in E_coll (imp-486 C_mb / C_H): its share of E(N) is exactly
 *        sigma. So at the sigma < 1e-3 landmark >= 99.9% of the headline slack is GUE-
 *        UNCONDITIONAL (E_trunc + E_flow), and that GUE-conditional share -> 0 monotonically
 *        with sigma. With respect to the imp-486 GUE hypothesis the far-tail bridge IS
 *        effectively unconditional: the vanishing sigma is precisely the fraction of the
 *        bound the GUE assumption is responsible for.
 *   (M3) BUT THE SURVIVING FLOOR IS NOT UNCONDITIONAL -- E_trunc REINTRODUCES A DIFFERENT,
 *        UNREMOVED CONDITIONALITY. As sigma -> 0 the bridge E(N) -> E_trunc + E_flow is
 *        DOMINATED by E_trunc (share ~0.999), and E_trunc is only rigorous-modulo-C_T: its
 *        residual is the imp-34791 unported barrier lemma (deterministic realness control
 *        above T_PT, NO GUE/PCC). That residual is sigma-BLIND -- it stays at full strength in
 *        the floor no matter how deep the tail. The truly fully-unconditional share (E_flow)
 *        is ~5.65e-9, negligible. So the far tail does NOT reach unconditional: it trades the
 *        vanishing GUE-conditional E_coll for a bridge PINNED by the C_T-conditional E_trunc.
 *
 * The punchline: the sigma < 1e-3 landmark is N ~ 5.432e15 (log10 N ~ 15.735). The E(N) bridge
 * becomes effectively unconditional ONLY relative to the imp-486 GUE hypothesis -- the GUE-
 * conditional share is exactly sigma and vanishes -- but it does NOT become unconditional
 * simpliciter: the surviving E_trunc floor (share ~0.999) carries a DISTINCT, sigma-blind
 * conditional dependence, the imp-34791 rigorous-modulo-C_T unported barrier lemma (a
 * deterministic residual, NO GUE). Two ORTHOGONAL conditionalities; the sigma decay removes
 * only the GUE one and is blind to the C_T one. The far tail trades GUE-conditionality for
 * C_T-conditionality; it never reaches unconditional.
 *
 * ASSESSMENT ONLY. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; the imp-34791
 * E_trunc = barrier-lemma reclassification is UNCHANGED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34474-far-tail-en-headline-slack-vs-lpt (sigma < 0.01 landmark; parts() + bisection source)
 * @see imp-33620-etrunc-ecoll-ladder-1e15-extension (sigma < 0.01 far-tail landmark, ladder source)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (sigma < 0.1 landmark N ~ 3.213e11)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.28e9, sigma ~ 0.5)
 * @see imp-34791-etrunc-eflow-pt-anchor-honest-discharge (E_trunc = rigorous-modulo-C_T unported barrier lemma)
 * @see imp-2706-ecoll-conditional-modulo-ch (E_trunc/E_flow rigorous sub-terms; E_coll GUE-conditional)
 * @see imp-486 (C_mb GUE-conditional); imp-398 (E_flow C_F prefactor)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34474/imp-33620/imp-3406 exactly
const L_PT = 0.121; // imp-452/imp-459 unconditional finite-height beat (< PT 0.2)

// EXACT imp-34474/imp-33620 sub-terms (no re-derivation, no fresh model).
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
// Identical decreasing-sigma log10-N bisection to imp-34474.
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

// (M1) The sigma < 1e-3 landmark.
const SIGMA_0001_LOG10 = thresholdLog10(0.001, 14, 20); // ~15.734986
const N_0001 = Math.pow(10, SIGMA_0001_LOG10); // ~5.432e15
const P = parts(N_0001);

// The imp-33620/imp-34474 sigma < 0.01 landmark, for the span comparison.
const SIGMA_001_LOG10 = thresholdLog10(0.01, 12, 16); // ~13.665054
const SPAN_DECADES_PAST_001 = SIGMA_0001_LOG10 - SIGMA_001_LOG10; // ~2.07

// (M2)/(M3) The three-way conditionality decomposition of E(N) at the landmark.
const GUE_CONDITIONAL_SHARE = P.E_coll / P.E_N; // = sigma = 1e-3 (GUE, imp-486)
const CT_BARRIER_SHARE = E_TRUNC_PT / P.E_N; // ~0.999 (rigorous-modulo-C_T, imp-34791)
const UNCONDITIONAL_SHARE = P.E_flow / P.E_N; // ~5.65e-9 (fully rigorous, imp-398)
const SHARE_SUM = GUE_CONDITIONAL_SHARE + CT_BARRIER_SHARE + UNCONDITIONAL_SHARE; // == 1

const E_N_OVER_E_TRUNC = P.E_N / E_TRUNC_PT; // ~1.001001
const L_PT_OVER_E_N = L_PT / P.E_N; // ~3950.3
const L_PT_OVER_E_TRUNC = L_PT / E_TRUNC_PT; // 3954.2484 (structural ceiling as sigma -> 0)

export const IMP35334_FAR_TAIL_EFFECTIVELY_UNCONDITIONAL_VS_ETRUNC_CONDITIONALITY = {
  id: 'imp-35334',
  proofSection: 'S-frontier',
  question:
    'MEASURE the height where the GUE-conditional share sigma(N) = E_coll / E(N) first drops below ' +
    '1e-3 (extending the imp-33582 sigma<0.1 / imp-33620 sigma<0.01 ladder), and ASSESS whether the ' +
    'E(N) bridge becomes effectively unconditional in the far tail (the constant E_trunc floor ' +
    'outliving the vanishing GUE-conditional E_coll) or whether E_trunc itself carries an unremoved ' +
    'conditional dependence. Assessment only; C_mb stays GUE-conditional per imp-486; changes no ' +
    'bound; NO QED.',
  componentModel:
    'E(N) = E_trunc + E_flow + E_coll; sigma = E_coll/E(N); T0 = effectiveHeightForN(N) (RvM inverse); ' +
    'E_coll = C_C sqrt(log T0 / N) (GUE-conditional C_H = 1/8, imp-486); E_flow = C_F (log T0 / T0) ' +
    'Gronwall (unconditionally rigorous, imp-398); E_trunc = 3.06e-5 (N-independent floor, ' +
    'rigorous-modulo-C_T, imp-34791 unported barrier lemma). Identical parts() and decreasing-sigma ' +
    'log10-N bisection to imp-34474.',
  landmark: {
    N_0001: +N_0001.toExponential(9), // 5.432329825e15
    log10_N: +SIGMA_0001_LOG10.toFixed(6), // 15.734986
    T0: +P.T0.toExponential(6), // 1.074271e15
    E_trunc: +E_TRUNC_PT.toExponential(6), // 3.060000e-5
    E_coll: +P.E_coll.toExponential(6), // 3.063063e-8
    E_flow: +P.E_flow.toExponential(6), // 1.732127e-13
    E_N: +P.E_N.toExponential(9), // 3.063063080e-5
    sigma: +P.sigma.toFixed(9), // 0.001000000
    E_N_over_E_trunc: +E_N_OVER_E_TRUNC.toFixed(9), // 1.001001007
    span_decades_past_sigma_001: +SPAN_DECADES_PAST_001.toFixed(4), // ~2.0699
    L_pt_over_E_N: +L_PT_OVER_E_N.toFixed(3), // ~3950.294
    L_pt_over_E_trunc_ceiling: +L_PT_OVER_E_TRUNC.toFixed(4), // 3954.2484
  },
  conditionalityDecomposition: {
    note:
      'The three sub-terms carry THREE DISTINCT provenance classes, not one bucket. At the ' +
      'sigma < 1e-3 landmark N ~ 5.432e15 the shares of E(N) are:',
    GUE_conditional_E_coll: +GUE_CONDITIONAL_SHARE.toExponential(6), // 1.000000e-3 (= sigma; imp-486 C_mb)
    C_T_barrier_lemma_E_trunc: +CT_BARRIER_SHARE.toFixed(9), // 0.999000 (imp-34791 unported barrier lemma)
    fully_unconditional_E_flow: +UNCONDITIONAL_SHARE.toExponential(6), // 5.65e-9 (imp-398, fully rigorous)
    share_sum: +SHARE_SUM.toFixed(12), // 1.000000000000
  },
  findings: {
    M1_sigma_below_1e_3_landmark: {
      claim:
        'The identical imp-34474 bisection first drops sigma below 1e-3 at N ~ 5.432329825e15 ' +
        '(log10 N ~ 15.735, T0 ~ 1.074e15), where E_coll ~ 3.063e-8 has decayed to ~0.1% of the ' +
        'E_trunc floor and E(N)/E_trunc = 1.001001 -- ~2.07 decades in N past the sigma<0.01 point',
      N_0001: +N_0001.toExponential(9),
      sigma: +P.sigma.toFixed(9),
      E_N_over_E_trunc: +E_N_OVER_E_TRUNC.toFixed(9),
    },
    M2_effectively_unconditional_relative_to_GUE_yes: {
      claim:
        'The GUE dependence of the bridge lives ENTIRELY in E_coll (imp-486 C_mb / C_H): its share ' +
        'of E(N) is exactly sigma. At the sigma < 1e-3 landmark >= 99.9% of the headline slack is ' +
        'GUE-UNCONDITIONAL (E_trunc + E_flow), and the GUE-conditional share -> 0 monotonically with ' +
        'sigma. Relative to the imp-486 GUE hypothesis the far-tail bridge IS effectively unconditional',
      GUE_conditional_share: +GUE_CONDITIONAL_SHARE.toExponential(6), // = sigma
      GUE_unconditional_share: +(1 - GUE_CONDITIONAL_SHARE).toFixed(9), // 0.999000
    },
    M3_surviving_floor_carries_unremoved_C_T_conditionality: {
      claim:
        'But E_trunc reintroduces a DIFFERENT, unremoved conditionality. As sigma -> 0 the bridge is ' +
        'DOMINATED by E_trunc (share ~0.999), and E_trunc is only rigorous-modulo-C_T: its residual is ' +
        'the imp-34791 unported barrier lemma (deterministic realness control above T_PT, NO GUE/PCC), ' +
        'which is sigma-BLIND and stays at full strength in the floor. The fully-unconditional share ' +
        '(E_flow) is ~5.65e-9, negligible. The far tail trades GUE-conditionality for C_T-conditionality; ' +
        'it never reaches unconditional',
      C_T_barrier_lemma_share: +CT_BARRIER_SHARE.toFixed(9), // 0.999000
      fully_unconditional_share: +UNCONDITIONAL_SHARE.toExponential(6), // 5.65e-9
      etrunc_class: 'rigorous-modulo-C_T (imp-34791 unported barrier lemma; deterministic, NO GUE/PCC)',
    },
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT + ASSESSMENT (frontier-direction, NOT rigorous). (M1) The identical imp-34474 ' +
    'decreasing-sigma bisection first drops the GUE-conditional share sigma = E_coll/E(N) below 1e-3 ' +
    'at N ~ 5.432329825e15 (log10 N ~ 15.735, T0 ~ 1.074e15), where E_coll ~ 3.063e-8 is ~0.1% of the ' +
    'E_trunc floor and E(N)/E_trunc = 1.001001 -- ~2.07 decades in N past the imp-33620 sigma<0.01 ' +
    'landmark. (M2) The far-tail bridge IS effectively unconditional RELATIVE TO GUE: the GUE ' +
    'dependence (imp-486 C_mb / C_H) lives entirely in E_coll, whose share of E(N) is exactly sigma, ' +
    'so >= 99.9% of the headline is GUE-unconditional at this landmark and the GUE-conditional share ' +
    'vanishes monotonically. (M3) But it does NOT become unconditional simpliciter: as sigma -> 0 the ' +
    'bridge is DOMINATED by the E_trunc floor (share ~0.999), which is only rigorous-modulo-C_T -- its ' +
    'residual is the imp-34791 UNPORTED BARRIER LEMMA (a deterministic realness control above T_PT, NO ' +
    'GUE, NO PCC), a DIFFERENT conditionality that is sigma-BLIND and persists at full strength in the ' +
    'floor. The fully-unconditional (E_flow) share is ~5.65e-9, negligible. So the far tail trades the ' +
    'vanishing GUE-conditional E_coll for a bridge PINNED by the C_T-conditional E_trunc: TWO ORTHOGONAL ' +
    'conditionalities, and the sigma decay removes only the GUE one. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'share per imp-486 is UNTOUCHED; the imp-34791 E_trunc = barrier-lemma reclassification is ' +
    'UNCHANGED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no ' +
    'RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34474 (sigma<0.01 landmark, parts() + bisection source); imp-33620 (sigma<0.01 far-tail ' +
    'ladder); imp-33582 (sigma<0.1 landmark N ~ 3.213e11); imp-3444 (E_coll = E_trunc crossover N ~ ' +
    '3.28e9, sigma ~ 0.5); imp-34791 (E_trunc = rigorous-modulo-C_T unported barrier lemma; ' +
    'deterministic, NO GUE/PCC); imp-2706 (E_trunc/E_flow rigorous sub-terms, E_coll GUE-conditional); ' +
    'imp-486 (C_mb GUE-conditional); imp-398 (E_flow C_F prefactor); imp-2642 (C_H = 1/8 ansatz); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35334_FAR_TAIL_EFFECTIVELY_UNCONDITIONAL_VS_ETRUNC_CONDITIONALITY_ASSERTIONS = [
  {
    // (M1): the sigma < 1e-3 threshold re-pins to N ~ 5.432e15 (log10 N ~ 15.735) with sigma = 1e-3.
    id: 'imp35334-sigma-below-1e-3-landmark',
    description: 'sigma < 1e-3 first at N ~ 5.432329825e15 (log10 N ~ 15.735), sigma = 1e-3 exactly',
    holds: () =>
      Math.abs(N_0001 - 5.432329825e15) / 5.432329825e15 < 1e-6 &&
      Math.abs(P.sigma - 0.001) < 1e-9 &&
      Math.abs(SIGMA_0001_LOG10 - 15.734986) < 1e-4,
  },
  {
    // (M1): the landmark sits ~2.07 decades past the imp-33620/imp-34474 sigma < 0.01 point,
    // and the headline is 1.001001x the E_trunc floor (E_coll ~ 0.1% E_trunc).
    id: 'imp35334-landmark-span-and-floor-ratio',
    description: 'sigma<1e-3 is ~2.07 decades past sigma<0.01; E(N)/E_trunc = 1.001001',
    holds: () =>
      Math.abs(SPAN_DECADES_PAST_001 - 2.0699) < 5e-3 &&
      Math.abs(E_N_OVER_E_TRUNC - 1.001001) < 1e-5,
  },
  {
    // (M2): the GUE-conditional share equals sigma, so >= 99.9% of the bridge is GUE-unconditional.
    id: 'imp35334-gue-conditional-share-equals-sigma',
    description: 'GUE-conditional share (E_coll)/E(N) = sigma = 1e-3; >= 99.9% GUE-unconditional',
    holds: () =>
      Math.abs(GUE_CONDITIONAL_SHARE - P.sigma) < 1e-15 &&
      Math.abs(GUE_CONDITIONAL_SHARE - 0.001) < 1e-9 &&
      1 - GUE_CONDITIONAL_SHARE > 0.9989,
  },
  {
    // (M3): the surviving floor is C_T-conditional not unconditional -- E_trunc dominates (~0.999)
    // while the fully-unconditional E_flow share is negligible (~5.65e-9); the three shares sum to 1.
    id: 'imp35334-surviving-floor-is-C_T-conditional-not-unconditional',
    description: 'E_trunc share ~0.999 (C_T barrier lemma) dominates; E_flow share ~5.65e-9; shares sum to 1',
    holds: () =>
      Math.abs(CT_BARRIER_SHARE - 0.999) < 1e-5 &&
      UNCONDITIONAL_SHARE < 1e-7 &&
      Math.abs(SHARE_SUM - 1) < 1e-12 &&
      CT_BARRIER_SHARE > GUE_CONDITIONAL_SHARE, // the C_T-conditional floor outweighs the vanishing GUE share
  },
  {
    // Honesty gate: assessment only, GUE-conditional per imp-486, E_trunc barrier-lemma per imp-34791,
    // no QED, no refereed bound is changed.
    id: 'imp35334-honesty-gate-no-qed',
    description: 'Assessment only: C_mb GUE-conditional (imp-486), E_trunc barrier lemma (imp-34791), no QED, no refereed bound is changed',
    holds: () =>
      IMP35334_FAR_TAIL_EFFECTIVELY_UNCONDITIONAL_VS_ETRUNC_CONDITIONALITY.isRigorous === false &&
      /GUE-conditional share per imp-486 is UNTOUCHED/.test(
        IMP35334_FAR_TAIL_EFFECTIVELY_UNCONDITIONAL_VS_ETRUNC_CONDITIONALITY.verdict,
      ) &&
      /unported barrier lemma/i.test(
        IMP35334_FAR_TAIL_EFFECTIVELY_UNCONDITIONAL_VS_ETRUNC_CONDITIONALITY.verdict,
      ) &&
      /NO QED/.test(IMP35334_FAR_TAIL_EFFECTIVELY_UNCONDITIONAL_VS_ETRUNC_CONDITIONALITY.verdict) &&
      /refereed bound is changed/i.test(IMP35334_FAR_TAIL_EFFECTIVELY_UNCONDITIONAL_VS_ETRUNC_CONDITIONALITY.verdict),
  },
];

for (const a of IMP35334_FAR_TAIL_EFFECTIVELY_UNCONDITIONAL_VS_ETRUNC_CONDITIONALITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35334-far-tail-effectively-unconditional-vs-etrunc-conditionality assertion failed: ${a.id}`,
    );
  }
}
