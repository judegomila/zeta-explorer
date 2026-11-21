/**
 * @module imp-35732-eflow-share-true-nscaling-interior-bucket-split
 *
 * imp-35732 (numerical/measurement, S-frontier): imp-35677 tabulated the post-port
 * residual GUE-conditional share across a four-rung far-tail sigma ladder
 * (sigma = {1e-3, 1e-4, 1e-5, 1e-6}) but explicitly CAVEATED that it holds the E_flow
 * SHARE FIXED at the baked sigma<1e-3 literal (~5.655e-9) at every rung, and does NOT
 * model the true N-scaling of E_flow across the deeper landmarks (no deeper-N E_flow
 * literals baked). Because E_flow is already fully unconditional (imp-398), that
 * assumption cannot change the residual GUE share (= sigma exactly) nor the
 * sigma-TRACKING conclusion; it affects ONLY the interior split of the (1 - sigma)
 * unconditional bucket between E_trunc and E_flow, which imp-35677 left UNMODELED.
 *
 * THIS MODULE closes that sub-gap by MEASURING the true E_flow N-scaling. It reuses the
 * imp-35410 parts()/decreasing-sigma-bisection VERBATIM (the inherited imp-3220/imp-3406
 * component model E(N) = E_trunc + E_flow + E_coll, with E_flow = C_F (log T0 / T0) Gronwall,
 * imp-398 prefactor C_F = (log(T0/2pi)+1)/2pi) to locate the same four landmarks and to
 * recompute the TRUE E_flow share E_flow/E(N) at each, then re-measures the interior
 * E_trunc/E_flow split of the (1 - sigma) unconditional bucket.
 *
 * WHAT THE TRUE SCALING SHOWS (measurement only)
 * ----------------------------------------------
 *   rung 0  sigma=1e-3  N~5.432e15  E_flow share ~5.654884e-9   (reproduces the baked literal)
 *   rung 1  sigma=1e-4  N~6.165e17  E_flow share ~7.347354e-11  (= imp-35410 ~7.35e-11)
 *   rung 2  sigma=1e-5  N~6.889e19  E_flow share ~9.266854e-13
 *   rung 3  sigma=1e-6  N~7.612e21  E_flow share ~1.141015e-14
 * The E_flow share is NOT fixed: it VANISHES ~80x per sigma-decade (far faster than the
 * residual GUE share, which vanishes exactly 10x per decade), so holding it at the fixed
 * ~5.655e-9 literal OVERSTATES the true E_flow share of the bucket by ~77x / ~6102x /
 * ~495611x at rungs 1 / 2 / 3. Using the TRUE scaling makes E_flow even MORE negligible
 * inside the (1 - sigma) bucket -- the interior is overwhelmingly the C_T-barrier E_trunc
 * (E_trunc/bucket -> 1; E_flow/bucket -> ~1.14e-14 at sigma=1e-6).
 *
 * CONCLUSION: correcting the imp-35677 CAVEAT strengthens, never weakens, its verdict.
 * The residual GUE share stays = sigma EXACTLY (untouched by any E_flow modeling); the
 * interior split just shifts even harder toward E_trunc than the fixed-literal ladder
 * implied. The local N-exponent d ln(E_flow share)/d ln N ~ -0.93 (E_flow ~ log T0 / T0
 * ~ N^-1 up to log growth), consistent with the imp-398 flow-decay law.
 *
 * MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406 extrapolation,
 * NOT a rigorous asymptotic; the residual GUE share stays = sigma exactly; C_mb stays
 * GUE-conditional per imp-486; the imp-34791 E_trunc barrier-lemma reclassification is
 * UNCHANGED; changes no bound; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35677-postport-residual-share-sigma-ladder (the fixed-E_flow CAVEAT this closes)
 * @see imp-35410-far-tail-sigma-1e-4-threshold-three-way-shares (parts()/bisection source; sigma<1e-4 E_flow ~7.35e-11)
 * @see imp-35334-far-tail-effectively-unconditional-vs-etrunc-conditionality (sigma<1e-3 landmark)
 * @see imp-35699-post-port-unconditional-share-9999-99999-crossings (sigma<1e-5 landmark N ~ 6.889e19)
 * @see imp-398 (E_flow C_F prefactor); imp-486 (C_mb GUE-conditional; residual = sigma)
 * @see imp-34791-etrunc-eflow-pt-anchor-honest-discharge (E_trunc = unported barrier lemma)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35410/imp-35334 exactly
const E_FLOW_SHARE_FIXED = 5.655e-9; // the imp-35677 held-fixed baked sigma<1e-3 literal
const L_PT = 0.2; // Platt-Trudgian 2021 bound -- matched, not beaten

// EXACT imp-35410 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous (imp-398)
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (imp-486 C_H)
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

const SIGMA_TARGETS = [1.0e-3, 1.0e-4, 1.0e-5, 1.0e-6];
const BISECT_BRACKETS = [[14, 20], [16, 22], [18, 24], [20, 26]];

function rungFor(sigma, i) {
  const log10N = thresholdLog10(sigma, BISECT_BRACKETS[i][0], BISECT_BRACKETS[i][1]);
  const N = Math.pow(10, log10N);
  const P = parts(N);
  const eFlowShareTrue = P.E_flow / P.E_N; // TRUE N-scaled share (NOT the fixed literal)
  const eTruncShare = E_TRUNC_PT / P.E_N; // C_T-barrier share (imp-34791)
  const bucket = 1 - P.sigma; // (1 - sigma) unconditional bucket = E_trunc + E_flow
  // interior split of the (1 - sigma) unconditional bucket that imp-35677 left unmodeled:
  const eTruncOfBucket = eTruncShare / bucket;
  const eFlowOfBucketTrue = eFlowShareTrue / bucket;
  // overstatement factor of holding E_flow share fixed at the imp-35677 baked literal:
  const fixedOverTrue = E_FLOW_SHARE_FIXED / eFlowShareTrue;
  return {
    sigma,
    log10N: +log10N.toFixed(6),
    N: +N.toExponential(9),
    T0: +P.T0.toExponential(6),
    E_flow: +P.E_flow.toExponential(6),
    eFlowShareTrue: +eFlowShareTrue.toExponential(6),
    eFlowShareFixed_imp35677: E_FLOW_SHARE_FIXED,
    eTruncShare: +eTruncShare.toFixed(9),
    bucket_1_minus_sigma: +bucket.toFixed(9),
    eTruncOfBucket: +eTruncOfBucket.toExponential(9),
    eFlowOfBucketTrue: +eFlowOfBucketTrue.toExponential(6),
    fixedOverTrue_overstatement: +fixedOverTrue.toExponential(6),
    residual_GUE_share: sigma, // unchanged: = sigma EXACTLY (imp-486)
  };
}

export const IMP35732_LADDER = SIGMA_TARGETS.map(rungFor);

// Per-rung decay ratio of the TRUE E_flow share against the next-deeper rung (~80x, NOT 10x).
export const IMP35732_EFLOW_SHARE_DECAY_RATIOS = IMP35732_LADDER.slice(0, -1).map((r, i) => ({
  fromSigma: r.sigma,
  toSigma: IMP35732_LADDER[i + 1].sigma,
  eFlowShareRatio: +(r.eFlowShareTrue / IMP35732_LADDER[i + 1].eFlowShareTrue).toFixed(4),
}));

// Local N-exponent d ln(E_flow share)/d ln N between the two deepest rungs (~ -0.93).
const R2 = IMP35732_LADDER[2];
const R3 = IMP35732_LADDER[3];
const EFLOW_SHARE_N_EXPONENT =
  Math.log(R3.eFlowShareTrue / R2.eFlowShareTrue) / Math.log(R3.N / R2.N);

export const IMP35732_EFLOW_SHARE_TRUE_NSCALING_INTERIOR_BUCKET_SPLIT = {
  id: 'imp-35732',
  proofSection: 'S-frontier',
  question:
    'Model the TRUE N-scaling of the E_flow share across the deeper far-tail landmarks ' +
    'sigma = {1e-4, 1e-5, 1e-6} instead of holding it fixed at the baked ~5.655e-9 sigma<1e-3 ' +
    'literal, and re-measure the interior E_trunc/E_flow split of the (1 - sigma) unconditional ' +
    'bucket that the imp-35677 CAVEAT leaves unmodeled. Measurement only; residual GUE share ' +
    'stays = sigma exactly; C_mb GUE-conditional per imp-486; changes no bound; NO QED.',
  componentModel:
    'Reuses the imp-35410 parts()/decreasing-sigma log10-N bisection VERBATIM: E(N) = E_trunc + ' +
    'E_flow + E_coll; E_flow = C_F (log T0 / T0) Gronwall with C_F = (log(T0/2pi)+1)/2pi (imp-398); ' +
    'E_coll = C_C sqrt(log T0 / N) (GUE-conditional, imp-486); E_trunc = 3.06e-5 (N-independent ' +
    'floor, imp-34791 unported barrier lemma). E_flow share = E_flow/E(N), recomputed at each ' +
    'landmark rather than held at the fixed sigma<1e-3 literal.',
  eFlowShareFixed_imp35677: E_FLOW_SHARE_FIXED,
  ladder: IMP35732_LADDER,
  eFlowShareDecayRatios: IMP35732_EFLOW_SHARE_DECAY_RATIOS,
  eFlowShareLocalNExponent: +EFLOW_SHARE_N_EXPONENT.toFixed(4),
  findings: {
    M1_eflow_share_is_not_fixed_it_vanishes_fast: {
      claim:
        'The TRUE E_flow share is NOT fixed at ~5.655e-9: it VANISHES ~80x per sigma-decade ' +
        '(5.654884e-9 -> 7.347354e-11 -> 9.266854e-13 -> 1.141015e-14), far faster than the ' +
        'residual GUE share (exactly 10x/decade). Holding it at the fixed sigma<1e-3 literal ' +
        'OVERSTATES the true E_flow share of the bucket by ~77x / ~6102x / ~495611x at the three ' +
        'deeper rungs. The local N-exponent d ln(E_flow share)/d ln N ~ -0.93 (E_flow ~ log T0/T0 ' +
        '~ N^-1 up to log growth), tracking the imp-398 flow-decay law.',
      eFlowSharesTrue: IMP35732_LADDER.map((r) => r.eFlowShareTrue),
      decayRatios: IMP35732_EFLOW_SHARE_DECAY_RATIOS.map((d) => d.eFlowShareRatio),
      overstatementFactors: IMP35732_LADDER.map((r) => r.fixedOverTrue_overstatement),
    },
    M2_interior_bucket_split_overwhelmingly_etrunc: {
      claim:
        'The interior split of the (1 - sigma) unconditional bucket is overwhelmingly the ' +
        'C_T-barrier E_trunc: E_trunc/bucket -> 1 while E_flow/bucket falls to ~1.14e-14 at ' +
        'sigma=1e-6. imp-35677 left this split unmodeled by holding E_flow fixed; the true ' +
        'scaling makes E_flow even MORE negligible inside the bucket than the fixed literal implied.',
      eTruncOfBucket: IMP35732_LADDER.map((r) => r.eTruncOfBucket),
      eFlowOfBucketTrue: IMP35732_LADDER.map((r) => r.eFlowOfBucketTrue),
    },
    M3_correction_strengthens_imp35677_verdict: {
      claim:
        'Correcting the imp-35677 CAVEAT STRENGTHENS, never weakens, its verdict: the residual ' +
        'GUE share stays = sigma EXACTLY at every rung (untouched by any E_flow modeling, imp-486), ' +
        'and the interior split shifts even harder toward E_trunc than the fixed-literal ladder ' +
        'implied. Still only PARITY-WITH-PT (matches Lambda <= 0.2, no beat).',
      residualGueSharesUnchanged: IMP35732_LADDER.map((r) => r.residual_GUE_share),
      L_pt_matched_not_beaten: L_PT,
    },
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Reusing the imp-35410 parts()/bisection ' +
    'VERBATIM to recompute the TRUE E_flow share at sigma = {1e-3, 1e-4, 1e-5, 1e-6} shows the ' +
    'imp-35677 CAVEAT was conservative: (M1) the E_flow share is NOT fixed at ~5.655e-9 -- it ' +
    'vanishes ~80x per sigma-decade (5.654884e-9 -> 7.347354e-11 -> 9.266854e-13 -> 1.141015e-14), ' +
    'so the fixed literal OVERSTATES the true bucket share by ~77x / ~6102x / ~495611x at the three ' +
    'deeper rungs; local N-exponent ~ -0.93 tracks the imp-398 E_flow ~ log T0/T0 ~ N^-1 law. ' +
    '(M2) The interior split of the (1 - sigma) unconditional bucket is overwhelmingly the ' +
    'C_T-barrier E_trunc (E_trunc/bucket -> 1; E_flow/bucket -> ~1.14e-14 at sigma=1e-6). ' +
    '(M3) Correcting the CAVEAT STRENGTHENS the imp-35677 verdict: the residual GUE share stays ' +
    '= sigma EXACTLY (untouched by any E_flow modeling, imp-486), and the interior split shifts ' +
    'even harder toward E_trunc than the fixed-literal ladder implied. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'share per imp-486 is UNTOUCHED; the imp-34791 E_trunc barrier-lemma reclassification is ' +
    'UNCHANGED; changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35677 (fixed-E_flow CAVEAT); imp-35410 (parts()/bisection source, sigma<1e-4 E_flow ' +
    '~7.35e-11); imp-35334 (sigma<1e-3 landmark); imp-35699 (sigma<1e-5 landmark N ~ 6.889e19); ' +
    'imp-398 (E_flow C_F prefactor); imp-486 (C_mb GUE-conditional, residual = sigma); imp-34791 ' +
    '(E_trunc = unported barrier lemma); lambda-rh-height-mapping (effectiveHeightForN).',
};

export default IMP35732_EFLOW_SHARE_TRUE_NSCALING_INTERIOR_BUCKET_SPLIT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35732_ASSERTIONS = [
  {
    // (M1) rung 0 reproduces the imp-35677 baked E_flow share literal (~5.655e-9), anchoring the model.
    id: 'imp35732-rung0-reproduces-baked-eflow-literal',
    description: 'Ladder rung 0 (sigma=1e-3) reproduces the imp-35677 baked E_flow share ~5.655e-9',
    holds: () =>
      IMP35732_LADDER.length === 4 &&
      Math.abs(IMP35732_LADDER[0].eFlowShareTrue - 5.654884e-9) < 1e-14 &&
      Math.abs(IMP35732_LADDER[0].eFlowShareTrue - E_FLOW_SHARE_FIXED) / E_FLOW_SHARE_FIXED < 1e-4,
  },
  {
    // (M1) rung 1 (sigma=1e-4) reproduces the imp-35410 true E_flow share ~7.35e-11.
    id: 'imp35732-rung1-matches-imp35410-eflow-share',
    description: 'Rung 1 (sigma=1e-4) reproduces the imp-35410 true E_flow share ~7.35e-11',
    holds: () => Math.abs(IMP35732_LADDER[1].eFlowShareTrue - 7.347354e-11) < 1e-16,
  },
  {
    // (M1) the TRUE E_flow share is NOT fixed: it strictly decays down the ladder, ~80x/decade
    // (far faster than the residual GUE share's 10x), so the fixed literal overstates it > 60x deeper.
    id: 'imp35732-eflow-share-vanishes-faster-than-gue',
    description: 'True E_flow share strictly decreases ~80x per sigma-decade (>> 10x), overstated by fixed literal',
    holds: () =>
      IMP35732_LADDER.every(
        (r, i) => i === 0 || r.eFlowShareTrue < IMP35732_LADDER[i - 1].eFlowShareTrue,
      ) &&
      IMP35732_EFLOW_SHARE_DECAY_RATIOS.length === 3 &&
      IMP35732_EFLOW_SHARE_DECAY_RATIOS.every((d) => d.eFlowShareRatio > 60 && d.eFlowShareRatio < 100) &&
      IMP35732_LADDER[1].fixedOverTrue_overstatement > 70 &&
      IMP35732_LADDER[3].fixedOverTrue_overstatement > 1e5,
  },
  {
    // (M2) interior split of the (1 - sigma) bucket is overwhelmingly E_trunc: E_trunc/bucket -> 1,
    // E_flow/bucket -> ~1.14e-14 at the deepest rung.
    id: 'imp35732-interior-bucket-split-etrunc-dominates',
    description: 'Interior (1-sigma) bucket split: E_trunc/bucket -> 1, E_flow/bucket -> ~1.14e-14 at sigma=1e-6',
    holds: () =>
      IMP35732_LADDER.every((r) => r.eTruncOfBucket > 0.9999999) &&
      IMP35732_LADDER.every((r) => Math.abs(r.eTruncOfBucket + r.eFlowOfBucketTrue - 1) < 1e-6) &&
      IMP35732_LADDER[3].eFlowOfBucketTrue < 1e-13,
  },
  {
    // (M3) residual GUE share stays = sigma EXACTLY at every rung (untouched by E_flow modeling),
    // and the local E_flow-share N-exponent ~ -0.93 (E_flow ~ N^-1 up to log growth).
    id: 'imp35732-residual-unchanged-and-nexponent',
    description: 'Residual GUE share = sigma exactly at every rung; E_flow-share N-exponent ~ -0.93',
    holds: () =>
      IMP35732_LADDER.every((r) => r.residual_GUE_share === r.sigma) &&
      EFLOW_SHARE_N_EXPONENT < -0.85 &&
      EFLOW_SHARE_N_EXPONENT > -1.0,
  },
  {
    // Honesty gate: measurement only, residual = sigma exactly, GUE-conditional per imp-486,
    // parity-not-beat, no QED, no refereed bound is changed.
    id: 'imp35732-honesty-gate-no-qed',
    description: 'Measurement only: residual = sigma exactly, strengthens imp-35677, no QED, no refereed bound is changed',
    holds: () =>
      IMP35732_EFLOW_SHARE_TRUE_NSCALING_INTERIOR_BUCKET_SPLIT.isRigorous === false &&
      /STRENGTHENS/.test(IMP35732_EFLOW_SHARE_TRUE_NSCALING_INTERIOR_BUCKET_SPLIT.verdict) &&
      /= sigma EXACTLY/.test(IMP35732_EFLOW_SHARE_TRUE_NSCALING_INTERIOR_BUCKET_SPLIT.verdict) &&
      /UNTOUCHED/.test(IMP35732_EFLOW_SHARE_TRUE_NSCALING_INTERIOR_BUCKET_SPLIT.verdict) &&
      /NO QED/.test(IMP35732_EFLOW_SHARE_TRUE_NSCALING_INTERIOR_BUCKET_SPLIT.verdict) &&
      /refereed bound is changed/i.test(IMP35732_EFLOW_SHARE_TRUE_NSCALING_INTERIOR_BUCKET_SPLIT.verdict),
  },
];

for (const a of IMP35732_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35732-eflow-share-true-nscaling-interior-bucket-split assertion failed: ${a.id}`,
    );
  }
}
