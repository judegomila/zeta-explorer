/**
 * @module imp-35456-en-component-budget-at-verified-height-3e12
 *
 * imp-35456 (measurement, frontier-direction): the imp-35334/imp-35418/imp-35410 cohort
 * tabulated the three-way E-component share decomposition (E_coll GUE-conditional /
 * E_flow fully-unconditional / E_trunc C_T-barrier-lemma, each divided by E(N)) only at
 * the FAR-TAIL sigma landmarks (sigma < 0.1 at N ~ 3.2e11 up to sigma < 1e-4 at N ~ 6.2e17).
 * NONE measured the shares at the height that actually BINDS Lambda <= 0.2: the Platt-Trudgian
 * verified zero height X ~ 3e12 (bridge-lambda-rh sotaUpperBound.verifiedHeight; the PT-floor
 * anchor per the PT-floor-binds-on-verified-height audit). This module measures the identical
 * three shares at N corresponding to X ~ 3e12 and reports which term dominates the E(N) budget
 * at the binding height. Identical imp-35418 parts(); measurement only.
 *
 * THE HEIGHT (the anchor, not a sigma target)
 * -------------------------------------------
 * All prior cohort modules located N by a DECREASING-sigma bisection (find N so E_coll/E(N)
 * hits a target). Here the anchor is a fixed HEIGHT, not a sigma: X = 3e12 is the height to
 * which the zeros are actually verified (Platt-Trudgian), and the imp-2564/PT-floor audit
 * pins Lambda <= 0.2 to THIS verified height. We invert once through the same RvM map used by
 * parts() -- N = zeroCountAtHeight(3e12) -- so effectiveHeightForN(N) round-trips to X = 3e12
 * and the sub-terms are byte-identical to the cohort. N ~ 1.236e13 (log10 N ~ 13.0921).
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-35418 / imp-35334 / imp-34474)
 * -----------------------------------------------------------------------------
 *     E(N)   = E_trunc + E_flow + E_coll,      sigma(N) = E_coll / E(N),
 *     T0     = effectiveHeightForN(N)          (Riemann-von Mangoldt inverse; == X here)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant early, GUE-conditional C_H = 1/8)
 *     E_flow = C_F (log T0 / T0) * Gronwall,   C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                        (N-independent floor, imp-2631/imp-3220)
 * No re-derivation, no fresh model: the exact imp-35418 parts() evaluated at the single height X.
 *
 * THE E(N) COMPONENT BUDGET AT THE BINDING VERIFIED HEIGHT X ~ 3e12 (measurement only; sums to 1)
 * ----------------------------------------------------------------------------------------------
 *   term      provenance class                    value        share of E(N)
 *   E_trunc   C_T barrier lemma (imp-34791)        3.06e-5      0.981239503   <- DOMINANT bottleneck
 *   E_coll    GUE-conditional C_mb  (imp-486)      5.850e-7     1.875913e-2
 *   E_flow    fully unconditional   (imp-398)      4.252e-11    1.363519e-6
 *   E(N) = 3.118505e-5 ;  sigma = E_coll/E(N) = 1.875913e-2 ;  three shares sum to 1.
 *   At the height that actually binds Lambda <= 0.2, the C_T barrier-lemma E_trunc floor is
 *   ~98.1% of the whole E(N) budget -- it out-weighs the GUE-conditional E_coll by 52.3x and the
 *   fully-unconditional E_flow by ~7.2e5x. The dominant contributor is the imp-34791 unported
 *   barrier-lemma floor, NOT the GUE term and NOT the unconditional flow term.
 *
 * WHERE THE BINDING HEIGHT SITS ON THE COHORT SIGMA LADDER (measurement only)
 * --------------------------------------------------------------------------
 *   sigma at X ~ 3e12 is 1.876e-2 -- BETWEEN the imp-33582 sigma < 0.1 rung (N ~ 3.2e11) and the
 *   imp-34474 sigma < 0.01 rung (N ~ 4.6e13). The binding verified height already sits well inside
 *   the E_trunc-dominant regime the cohort mapped in the far tail: E_trunc dominance is not a
 *   far-tail artifact, it is the state of the budget at the height Lambda <= 0.2 actually uses.
 *
 * THE FINDINGS
 * ------------
 *   (M1) THE BUDGET AT X ~ 3e12. At the binding verified height (N ~ 1.236e13, T0 = 3e12) the three
 *        shares of E(N) are E_trunc/E(N) = 0.981240 (C_T barrier lemma, imp-34791), E_coll/E(N) =
 *        1.876e-2 (GUE-conditional, imp-486), E_flow/E(N) = 1.364e-6 (fully unconditional, imp-398).
 *        The three sum to 1; the C_T barrier-lemma E_trunc floor is the dominant contributor.
 *   (M2) E_trunc IS THE BOTTLENECK BY A WIDE MARGIN. E_trunc out-weighs E_coll by 52.3x and E_flow
 *        by ~7.196e5x. Any tightening of E(N) at the binding height is gated by the E_trunc floor,
 *        not by the GUE-conditional E_coll term or the unconditional E_flow term.
 *   (M3) THE BINDING HEIGHT IS ALREADY E_trunc-DOMINANT. sigma at X ~ 3e12 is 1.876e-2, between the
 *        imp-33582 sigma<0.1 (N ~ 3.2e11) and imp-34474 sigma<0.01 (N ~ 4.6e13) rungs; E_trunc
 *        dominance holds at the actually-binding height, not only in the far tail the cohort mapped.
 *
 * MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; the E_trunc = 3.06e-5
 * fixed-strip barrier-lemma constant (imp-2631, reclassified imp-34791) is UNCHANGED; identifying the
 * dominant term does NOT tighten it and closes no gap; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35418-far-tail-three-way-share-ladder-eflow-1e-9-landmark (parts() + far-tail share ladder source)
 * @see imp-35334-far-tail-effectively-unconditional-vs-etrunc-conditionality (sigma<1e-3 landmark, three-provenance classes)
 * @see imp-35410-far-tail-sigma-1e-4-threshold-three-way-shares (sigma<1e-4 far-tail landmark)
 * @see imp-34474-far-tail-en-headline-slack-vs-lpt (sigma<0.01 landmark N ~ 4.6e13)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (sigma<0.1 landmark N ~ 3.2e11)
 * @see imp-34791-etrunc-eflow-pt-anchor-honest-discharge (E_trunc = rigorous-modulo-C_T unported barrier lemma)
 * @see imp-486 (C_mb GUE-conditional); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route)
 * @see bridge-lambda-rh (sotaUpperBound.verifiedHeight = 3.0e12, the PT verified zero height X)
 * @see lambda-rh-height-mapping (effectiveHeightForN / zeroCountAtHeight: N <-> T0)
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35418/imp-35334/imp-34474 exactly

// The Platt-Trudgian verified zero height X that binds Lambda <= 0.2 (imp-2564/PT-floor anchor).
const X_VERIFIED_HEIGHT = 3.0e12; // == bridge-lambda-rh sotaUpperBound.verifiedHeight

// EXACT imp-35418/imp-35334 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Invert ONCE through the same RvM map used by parts(): N such that T0 round-trips to X.
const N_AT_X = zeroCountAtHeight(X_VERIFIED_HEIGHT); // ~1.236e13
const LOG10_N_AT_X = Math.log10(N_AT_X); // ~13.0921
const P = parts(N_AT_X);

const E_COLL_SHARE = P.E_coll / P.E_N; // ~1.876e-2 (GUE-conditional)
const E_FLOW_SHARE = P.E_flow / P.E_N; // ~1.364e-6 (fully unconditional)
const E_TRUNC_SHARE = E_TRUNC_PT / P.E_N; // ~0.981240 (C_T barrier lemma) -- DOMINANT
const SHARE_SUM = E_COLL_SHARE + E_FLOW_SHARE + E_TRUNC_SHARE;

// (M2) how far E_trunc out-weighs the other two at the binding height.
const ETRUNC_OVER_ECOLL = E_TRUNC_PT / P.E_coll; // ~52.31
const ETRUNC_OVER_EFLOW = E_TRUNC_PT / P.E_flow; // ~7.196e5

export const IMP35456_EN_COMPONENT_BUDGET_AT_VERIFIED_HEIGHT_3E12 = {
  id: 'imp-35456',
  proofSection: 'S-frontier',
  question:
    'MEASURE the imp-35334 three-way E-component share decomposition (E_coll GUE-conditional / ' +
    'E_flow fully-unconditional / E_trunc C_T-barrier-lemma, each divided by E(N)) at the height that ' +
    'actually BINDS Lambda <= 0.2 -- the Platt-Trudgian verified zero height X ~ 3e12 (imp-2564/' +
    'PT-floor anchor) -- and identify which term dominates the E(N) budget there. Measurement only; ' +
    'changes no bound; NO QED.',
  componentModel:
    'E(N) = E_trunc + E_flow + E_coll; sigma = E_coll/E(N); T0 = effectiveHeightForN(N) (RvM inverse); ' +
    'E_coll = C_C sqrt(log T0 / N) (GUE-conditional C_H = 1/8, imp-486); E_flow = C_F (log T0 / T0) ' +
    'Gronwall (unconditionally rigorous, imp-398); E_trunc = 3.06e-5 (N-independent floor, ' +
    'rigorous-modulo-C_T, imp-34791 unported barrier lemma). Identical parts() to imp-35418/imp-35334; ' +
    'the height is fixed to X = 3e12 by N = zeroCountAtHeight(3e12), NOT by a sigma-target bisection.',
  bindingHeight: {
    note:
      'The anchor is the PT verified zero height X = 3e12 (bridge-lambda-rh sotaUpperBound.verifiedHeight), ' +
      'the height the PT-floor audit pins Lambda <= 0.2 to. N is its RvM-inverse zero count.',
    X_verified_height: X_VERIFIED_HEIGHT, // 3.0e12
    N: +N_AT_X.toExponential(9), // 1.236240302e13
    log10_N: +LOG10_N_AT_X.toFixed(6), // 13.092103
    T0: +P.T0.toExponential(6), // 3.000000e12 (round-trips to X)
  },
  budget: {
    note:
      'The three sub-terms carry THREE DISTINCT provenance classes; their shares of E(N) at the binding ' +
      'verified height X ~ 3e12. The C_T barrier-lemma E_trunc floor dominates. Shares sum to 1:',
    E_trunc: {
      value: E_TRUNC_PT,
      share: +E_TRUNC_SHARE.toFixed(9), // 0.981239503
      provenance: 'C_T barrier lemma (imp-2631/imp-34791; deterministic, NO GUE/PCC)',
    },
    E_coll: {
      value: +P.E_coll.toExponential(6), // 5.850045e-7
      share: +E_COLL_SHARE.toExponential(6), // 1.875913e-2
      provenance: 'GUE-conditional C_mb (imp-486; C_H = 1/8 ansatz)',
    },
    E_flow: {
      value: +P.E_flow.toExponential(6), // 4.252142e-11
      share: +E_FLOW_SHARE.toExponential(6), // 1.363519e-6
      provenance: 'fully unconditional (imp-398 C_F prefactor)',
    },
    E_N: +P.E_N.toExponential(9), // 3.118504697e-5
    sigma: +P.sigma.toExponential(9), // 1.875913322e-2
    share_sum: +SHARE_SUM.toFixed(12), // 1
    E_trunc_over_E_coll: +ETRUNC_OVER_ECOLL.toFixed(4), // 52.3073
    E_trunc_over_E_flow: +ETRUNC_OVER_EFLOW.toExponential(4), // 7.1964e5
    dominant_term: 'E_trunc',
  },
  findings: {
    M1_budget_at_verified_height: {
      claim:
        'At the binding verified height X ~ 3e12 (N ~ 1.236e13, T0 = 3e12) the three shares of E(N) are ' +
        'E_trunc/E(N) = 0.981240 (C_T barrier lemma, imp-34791), E_coll/E(N) = 1.876e-2 (GUE-conditional, ' +
        'imp-486), E_flow/E(N) = 1.364e-6 (fully unconditional, imp-398). The three sum to 1; the C_T ' +
        'barrier-lemma E_trunc floor is the dominant contributor to E(N) at the height that binds Lambda <= 0.2',
      E_trunc_share: +E_TRUNC_SHARE.toFixed(9),
      E_coll_share: +E_COLL_SHARE.toExponential(6),
      E_flow_share: +E_FLOW_SHARE.toExponential(6),
    },
    M2_etrunc_is_the_bottleneck: {
      claim:
        'E_trunc is the bottleneck by a wide margin: it out-weighs E_coll by 52.3x and E_flow by ~7.196e5x. ' +
        'Any tightening of E(N) at the binding height is gated by the imp-34791 C_T barrier-lemma floor, not ' +
        'the GUE-conditional E_coll or the unconditional E_flow',
      E_trunc_over_E_coll: +ETRUNC_OVER_ECOLL.toFixed(4),
      E_trunc_over_E_flow: +ETRUNC_OVER_EFLOW.toExponential(4),
    },
    M3_binding_height_already_etrunc_dominant: {
      claim:
        'sigma at X ~ 3e12 is 1.876e-2, between the imp-33582 sigma<0.1 (N ~ 3.2e11) and imp-34474 ' +
        'sigma<0.01 (N ~ 4.6e13) rungs; E_trunc dominance holds at the actually-binding height, not only in ' +
        'the far tail the imp-35334/imp-35418 cohort mapped. E_trunc dominance is not a far-tail artifact',
      sigma_at_verified_height: +P.sigma.toExponential(6),
    },
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). (M1) At the Platt-Trudgian verified zero height X ~ 3e12 ' +
    '(imp-2564/PT-floor anchor; N ~ 1.236240302e13, log10 N ~ 13.0921, T0 = 3e12) the E(N) component budget is ' +
    'E_trunc = 3.06e-5 share 0.981239503 (C_T barrier lemma, imp-34791), E_coll = 5.850045e-7 share 1.875913e-2 ' +
    '(GUE-conditional, imp-486), E_flow = 4.252142e-11 share 1.363519e-6 (fully unconditional, imp-398), with ' +
    'E(N) = 3.118504697e-5 and sigma = 1.875913e-2; the three shares sum to 1. The C_T barrier-lemma E_trunc ' +
    'floor is the DOMINANT contributor (~98.1% of E(N)) at the height that actually binds Lambda <= 0.2. (M2) ' +
    'E_trunc out-weighs the GUE-conditional E_coll by 52.3x and the fully-unconditional E_flow by ~7.196e5x, so ' +
    'the E(N) bottleneck at the binding height is the imp-34791 unported barrier-lemma floor -- NOT the GUE term ' +
    'and NOT the unconditional flow term. (M3) sigma at X ~ 3e12 is 1.876e-2, between the imp-33582 sigma<0.1 ' +
    '(N ~ 3.2e11) and imp-34474 sigma<0.01 (N ~ 4.6e13) far-tail rungs: E_trunc dominance is the state of the ' +
    'budget at the actually-binding height, not merely a far-tail artifact. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional share per imp-486 is ' +
    'UNTOUCHED; the E_trunc = 3.06e-5 fixed-strip barrier-lemma constant (imp-2631, reclassified imp-34791) is ' +
    'UNCHANGED; identifying the dominant term tightens no bound and closes no gap; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35418 (parts() + far-tail share ladder source); imp-35334 (three-provenance classes, sigma<1e-3 ' +
    'landmark); imp-35410 (sigma<1e-4 far-tail landmark); imp-34474 (sigma<0.01 landmark N ~ 4.6e13); imp-33582 ' +
    '(sigma<0.1 landmark N ~ 3.2e11); imp-34791 (E_trunc = rigorous-modulo-C_T unported barrier lemma; ' +
    'deterministic, NO GUE/PCC); imp-2706 (E_trunc/E_flow rigorous sub-terms, E_coll GUE-conditional); imp-486 ' +
    '(C_mb GUE-conditional); imp-398 (E_flow C_F prefactor); imp-2642 (C_H = 1/8 ansatz); imp-2631 (E_trunc ' +
    'fixed-strip route); imp-2564 (PT-floor binds on verified height X ~ 3e12); bridge-lambda-rh ' +
    '(sotaUpperBound.verifiedHeight = 3.0e12); lambda-rh-height-mapping (effectiveHeightForN / zeroCountAtHeight).',
};

export const IMP35456_EN_COMPONENT_BUDGET_AT_VERIFIED_HEIGHT_3E12_ASSERTIONS = [
  {
    // The anchor: N is the RvM-inverse zero count of X = 3e12 and T0 round-trips to X = 3e12.
    id: 'imp35456-verified-height-anchor-roundtrips',
    description: 'N = zeroCountAtHeight(3e12) ~ 1.236e13 (log10 N ~ 13.0921); T0 round-trips to X = 3e12',
    holds: () =>
      Math.abs(N_AT_X - 1.236240302e13) / 1.236240302e13 < 1e-6 &&
      Math.abs(LOG10_N_AT_X - 13.092103) < 1e-5 &&
      Math.abs(P.T0 - X_VERIFIED_HEIGHT) / X_VERIFIED_HEIGHT < 1e-9,
  },
  {
    // (M1): the three shares at X ~ 3e12 -- E_trunc 0.981240 / E_coll 1.876e-2 / E_flow 1.364e-6 -- and
    // they sum to 1.
    id: 'imp35456-budget-shares-at-verified-height',
    description: 'At X ~ 3e12: E_trunc/E(N)=0.981240, E_coll/E(N)~1.876e-2, E_flow/E(N)~1.364e-6, sum=1',
    holds: () =>
      Math.abs(E_TRUNC_SHARE - 0.981239503) < 1e-6 &&
      Math.abs(E_COLL_SHARE - 1.875913e-2) < 1e-7 &&
      Math.abs(E_FLOW_SHARE - 1.363519e-6) < 1e-11 &&
      Math.abs(SHARE_SUM - 1) < 1e-9,
  },
  {
    // (M1/M2): E_trunc is strictly the DOMINANT term and out-weighs both others by wide margins.
    id: 'imp35456-etrunc-dominant-and-bottleneck',
    description: 'E_trunc share > E_coll share > E_flow share; E_trunc/E_coll ~52.3, E_trunc/E_flow ~7.2e5',
    holds: () =>
      E_TRUNC_SHARE > E_COLL_SHARE &&
      E_COLL_SHARE > E_FLOW_SHARE &&
      E_TRUNC_SHARE > 0.98 &&
      Math.abs(ETRUNC_OVER_ECOLL - 52.3073) < 1e-2 &&
      Math.abs(ETRUNC_OVER_EFLOW - 7.1964e5) / 7.1964e5 < 1e-3,
  },
  {
    // (M3): sigma at the binding verified height sits between the imp-33582 sigma<0.1 and imp-34474
    // sigma<0.01 far-tail rungs -- E_trunc dominance is the state at the actually-binding height.
    id: 'imp35456-sigma-between-far-tail-rungs',
    description: 'sigma at X ~ 3e12 ~ 1.876e-2 lies between the sigma<0.1 and sigma<0.01 cohort rungs',
    holds: () => P.sigma < 0.1 && P.sigma > 0.01 && Math.abs(P.sigma - 1.875913322e-2) < 1e-8,
  },
  {
    // Honesty gate: measurement only, GUE-conditional per imp-486, E_trunc barrier-lemma per imp-34791,
    // no QED, no refereed bound is changed.
    id: 'imp35456-honesty-gate-no-qed',
    description: 'Measurement only: C_mb GUE-conditional (imp-486), E_trunc barrier lemma (imp-34791), no QED, no refereed bound is changed',
    holds: () =>
      IMP35456_EN_COMPONENT_BUDGET_AT_VERIFIED_HEIGHT_3E12.isRigorous === false &&
      /GUE-conditional share per imp-486 is UNTOUCHED/.test(
        IMP35456_EN_COMPONENT_BUDGET_AT_VERIFIED_HEIGHT_3E12.verdict,
      ) &&
      /unported barrier[- ]lemma/i.test(
        IMP35456_EN_COMPONENT_BUDGET_AT_VERIFIED_HEIGHT_3E12.verdict,
      ) &&
      /NO QED/.test(IMP35456_EN_COMPONENT_BUDGET_AT_VERIFIED_HEIGHT_3E12.verdict) &&
      /refereed bound is changed/i.test(IMP35456_EN_COMPONENT_BUDGET_AT_VERIFIED_HEIGHT_3E12.verdict),
  },
];

for (const a of IMP35456_EN_COMPONENT_BUDGET_AT_VERIFIED_HEIGHT_3E12_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35456-en-component-budget-at-verified-height-3e12 assertion failed: ${a.id}`,
    );
  }
}
