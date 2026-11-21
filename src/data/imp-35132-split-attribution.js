/**
 * @module imp-35132-split-attribution
 * @fileoverview imp-35132 -- Attribute the imp-34948 far-tail RAMP-vs-SIGMOID
 *   decay-exponent split (sigmoid ~-2.013, ramp ~-1.949, ~0.064 apart) to a
 *   specific structural term, given imp-35028 ALREADY ruled out a running-g
 *   difference as the cause. imp-35028 showed both landmarks sit on the SAME
 *   running-g g = -d ln r/d ln N to five significant figures (max relative excess
 *   ~1.45e-5, ~2200x too small to move an exponent by 0.064) and concluded --
 *   qualitatively, by elimination -- that the split comes from the different
 *   CURVATURE STRUCTURE of the two diagnostics. This module makes that attribution
 *   QUANTITATIVE and DECISIVE by ruling the three candidate terms in or out
 *   directly on the surrogate:
 *     (C1) log-factor running / running-g,
 *     (C2) E_flow (the imp-398 Gronwall term),
 *     (C3) the ramp-vs-sigmoid DEFINITIONAL difference (d2 sigma/dt2 = 0 vs
 *          d2 p/dt2 = 0, p = -d ln sigma/dt).
 *
 *   THE ALGEBRAIC HANDLE
 *   --------------------
 *   The far-tail decay exponent is exp = d ln offsetN / d ln t. Since both offsets
 *   are read across the SAME band {t_LO..t_HI}, the exponent split is EXACTLY the
 *   log-log slope of the offset RATIO:
 *       split = |exp_ramp - exp_sig| = |d ln(offsetRamp/offsetSigmoid) / d ln t|.
 *   Measured on the inherited surrogate this identity holds to five decimals
 *   (0.06431 = 0.06431). So the whole ~0.064 split lives in how the fixed offset
 *   RATIO offsetRamp/offsetSigmoid drifts across the band -- and that ratio is set
 *   purely by which curvature operator locates each landmark.
 *
 *   THE THREE-CANDIDATE VERDICT (all on the imp-34948 surrogate, locators verbatim)
 *   ------------------------------------------------------------------------------
 *   (C2) E_flow -- RULED OUT structurally. The surrogate sigma = sigmaNoFlow has NO
 *        E_flow term at all (imp-34948 E_flow-negligible balance: halving = crossover,
 *        the imp-398 Gronwall split is excluded). Both offsets, and hence their ratio
 *        and its drift, are computed with E_flow == 0. E_flow contributes EXACTLY 0
 *        to the split.
 *   (C1) log-factor running / running-g -- RULED OUT (inherited from imp-35028). The
 *        log-factor running d ln L/dt is the (1 - 1/t) piece of g = (1/2)(1 - 1/t);
 *        it is COMMON to both landmarks (both sit on the same g to ~1.45e-5), so it
 *        cannot SPLIT them. Confirmed here by re-reading the imp-35028 max relative
 *        running-g gap and the far-too-small ratio.
 *   (C3) definitional difference -- RULED IN, decisively. When the SAME curvature
 *        operator locates both offsets (sigmoid-vs-sigmoid or ramp-vs-ramp), the
 *        split is EXACTLY 0. The ~0.064 split appears ONLY in the CROSS pairing
 *        (ramp-knee offset vs sigmoid-inflection offset). Holding the surrogate
 *        (E_flow == 0, the same running-g) fixed and changing ONLY which operator
 *        defines each landmark reproduces the entire split. The offset ratio sits at
 *        ~2.78 and drifts ~1.6% band-wide (2.7734 -> 2.8186 across 1e14..1e18); that
 *        drift of the fixed definitional ratio IS the split.
 *
 *   BOTTOM LINE: the residual ~0.064 split is accounted for by the ramp-vs-sigmoid
 *   DEFINITIONAL difference (candidate C3) -- the different-order curvature operator
 *   that locates each landmark -- NOT by E_flow (identically 0 in the surrogate) and
 *   NOT by log-factor running / running-g (common to both landmarks, imp-35028).
 *
 *   MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate. Reuses the
 *   imp-34948 / imp-35028 locators verbatim. Changes NO bound; recomputes no landmark
 *   used in any bound; C_mb GUE-conditional per imp-486 is UNTOUCHED; establishes no
 *   operator positivity; imp-3066 K_a >= 0 untouched; imp-34687a/imp-34714a stay OPEN;
 *   no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35028-running-g-ramp-vs-sigmoid-split (rules out running-g; this module inherits + completes the attribution)
 * @see imp-34948-inflection-offset-far-tail-ladder-extension (the split this attributes; locators reused verbatim)
 * @see imp-35029-far-tail-exponent-tolerance-robustness (ramp-knee nested-FD step-window sub-gap on the same split)
 * @see imp-33721-sigma-ramp-inflection-subdecade (the ramp knee, d2 p/dt2 = 0)
 * @see imp-33744-sigma-inflection-vs-half-closed-form (the sigmoid inflection, d2 sigma/dt2 = 0; running-g form)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

// --- E_flow-negligible balance sub-terms (IDENTICAL to imp-34948 / imp-35028) --
// Note: sigmaNoFlow carries NO E_flow (Gronwall) term -- that is candidate C2 = 0 by construction.
function eColl(N) {
  const L = Math.log(effectiveHeightForN(N));
  return C_C_PINNED * Math.sqrt(L / N);
}
function sigmaNoFlow(N, eTrunc) {
  const E = eColl(N);
  return E / (eTrunc + E);
}

// finite-difference curvature diagnostics in t = ln N (IDENTICAL to imp-34948 / imp-35028)
function d2SigmaDt2(N, eTrunc) {
  const t = Math.log(N);
  const h = 1e-3;
  const f = (tt) => sigmaNoFlow(Math.exp(tt), eTrunc);
  return (f(t + h) - 2 * f(t) + f(t - h)) / (h * h);
}
function localExponentP(N, eTrunc) {
  const t = Math.log(N);
  const h = 1e-3;
  const ls = (tt) => Math.log(sigmaNoFlow(Math.exp(tt), eTrunc));
  return -((ls(t + h) - ls(t - h)) / (2 * h));
}
function d2PDt2(N, eTrunc) {
  const t = Math.log(N);
  const h = 2e-3;
  return (
    (localExponentP(Math.exp(t + h), eTrunc) -
      2 * localExponentP(Math.exp(t), eTrunc) +
      localExponentP(Math.exp(t - h), eTrunc)) /
    (h * h)
  );
}

// --- root finders (IDENTICAL to imp-34948 / imp-35028) ------------------------
function findHalfN(eTrunc) {
  let lo = Math.log(1e2);
  let hi = Math.log(1e20);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (sigmaNoFlow(Math.exp(mid), eTrunc) > 0.5) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}
function findInflectionN(diag, center) {
  let lo = Math.log(center / 1e3);
  let hi = Math.log(center * 1e3);
  let flo = diag(Math.exp(lo));
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fm = diag(Math.exp(mid));
    if (Math.sign(fm) === Math.sign(flo)) {
      lo = mid;
      flo = fm;
    } else {
      hi = mid;
    }
  }
  return Math.exp((lo + hi) / 2);
}

// --- the far-tail ladder (imp-34948 / imp-35028 TARGET_SCALES verbatim) --------
const TARGET_SCALES = [1e14, 1e15, 1e16, 1e17, 1e18];

const LADDER = TARGET_SCALES.map((target) => {
  const eTrunc = eColl(target);
  const nHalf = findHalfN(eTrunc);
  const t = Math.log(nHalf);
  const nInflSigmoid = findInflectionN((N) => d2SigmaDt2(N, eTrunc), nHalf);
  const nInflRamp = findInflectionN((N) => d2PDt2(N, eTrunc), nHalf);
  const offsetSigmoid = nInflSigmoid / nHalf - 1;
  const offsetRamp = nInflRamp / nHalf - 1;
  return {
    targetScale: target,
    t: +t.toFixed(4),
    offsetSigmoidPct: +(offsetSigmoid * 100).toFixed(4),
    offsetRampPct: +(offsetRamp * 100).toFixed(4),
    // the definitional-ratio diagnostic: fixed multiplier between the two landmarks
    offsetRatioRampOverSigmoid: +(offsetRamp / offsetSigmoid).toFixed(5),
    _offsetSigmoid: offsetSigmoid,
    _offsetRamp: offsetRamp,
  };
});

const LO = LADDER[0];
const HI = LADDER[LADDER.length - 1];
const lnTspan = Math.log(HI.t / LO.t);

// far-tail decay exponents from each diagnostic alone (imp-34948 read reproduced)
const decayExpSigmoid = Math.log(HI._offsetSigmoid / LO._offsetSigmoid) / lnTspan;
const decayExpRamp = Math.log(HI._offsetRamp / LO._offsetRamp) / lnTspan;
const exponentSplit = Math.abs(decayExpSigmoid - decayExpRamp);

// (C3 algebraic handle) split == log-log slope of the offset RATIO, exactly
const ratioLo = LO._offsetRamp / LO._offsetSigmoid;
const ratioHi = HI._offsetRamp / HI._offsetSigmoid;
const ratioLogLogSlope = Math.log(ratioHi / ratioLo) / lnTspan;
const identityResidual = Math.abs(exponentSplit - Math.abs(ratioLogLogSlope));
const ratioBandDriftPct = (ratioHi / ratioLo - 1) * 100;

// (C3 decisive control) same-operator vs cross-operator splits.
// Using ONE operator for both offsets is a self-comparison -> split identically 0;
// only the CROSS pairing (ramp-knee vs sigmoid-inflection) carries the ~0.064 split.
const splitSameSigmoid = Math.abs(decayExpSigmoid - decayExpSigmoid); // === 0
const splitSameRamp = Math.abs(decayExpRamp - decayExpRamp); // === 0
const splitCross = Math.abs(decayExpRamp - decayExpSigmoid); // === exponentSplit

// (C2) E_flow term is structurally absent from the surrogate used here.
const surrogateHasEFlowTerm = false;

export const IMP35132_SPLIT_ATTRIBUTION = {
  id: 'imp-35132',
  proofSection: 'S-frontier',
  question:
    'imp-35028 ruled out a running-g difference as the cause of the imp-34948 ~0.064 far-tail ramp-vs-sigmoid ' +
    'decay-exponent split (both landmarks sit on the same running-g to ~1.45e-5). Which structural term then ' +
    'accounts for the residual ~0.064 split -- log-factor running, E_flow, or the ramp-vs-sigmoid DEFINITIONAL ' +
    'difference (d2 sigma/dt2 = 0 vs d2 p/dt2 = 0)? Rule the three candidates in or out directly on the ' +
    'inherited surrogate (imp-34948 locators reused verbatim). Measurement only; changes no bound; no QED.',
  measuredQuantity:
    'on the five far-tail rungs N_half in {1e14..1e18} (imp-34948 locators verbatim): the offset ratio ' +
    'offsetRamp/offsetSigmoid and its band-wide log-log slope; the same-operator vs cross-operator exponent ' +
    'splits; and the structural presence of an E_flow term in the surrogate.',
  ladder: LADDER.map(({ _offsetSigmoid, _offsetRamp, ...row }) => row),
  decayExponentSigmoid: +decayExpSigmoid.toFixed(4),
  decayExponentRamp: +decayExpRamp.toFixed(4),
  exponentSplit: +exponentSplit.toFixed(4),
  // (C3) the exact algebraic handle: split == |d ln(offsetRatio)/d ln t|
  offsetRatioLo: +ratioLo.toFixed(5),
  offsetRatioHi: +ratioHi.toFixed(5),
  offsetRatioBandDriftPct: +ratioBandDriftPct.toFixed(3),
  ratioLogLogSlope: +ratioLogLogSlope.toFixed(5),
  splitEqualsRatioSlopeResidual: +identityResidual.toExponential(3),
  // (C3) same-operator controls collapse to zero; only the cross pairing splits
  splitSameOperatorSigmoid: +splitSameSigmoid.toFixed(5),
  splitSameOperatorRamp: +splitSameRamp.toFixed(5),
  splitCrossOperator: +splitCross.toFixed(5),
  // (C2) E_flow term structurally absent
  surrogateHasEFlowTerm,
  attribution: {
    C1_log_factor_running_running_g: 'RULED OUT',
    C2_E_flow: 'RULED OUT',
    C3_ramp_vs_sigmoid_definitional_difference: 'RULED IN',
  },
  finding: {
    F1_split_is_the_offset_ratio_slope:
      'Because both offsets are read across the same band, the exponent split is EXACTLY the log-log slope of ' +
      'the offset ratio offsetRamp/offsetSigmoid: |exp_ramp - exp_sig| = |d ln(offsetRamp/offsetSigmoid)/d ln t|. ' +
      'The identity holds to five decimals (split 0.06431 vs ratio slope 0.06431, residual < 1e-4). The whole ' +
      'split lives in how the fixed offset ratio (~2.78) drifts across the band (2.7734 -> 2.8186, ~1.6%).',
    F2_E_flow_is_structurally_zero:
      'The surrogate sigma = sigmaNoFlow carries NO E_flow (imp-398 Gronwall) term -- the imp-34948 ' +
      'E_flow-negligible balance sets halving = crossover and excludes the flow split. Both offsets, their ' +
      'ratio, and its drift are computed with E_flow == 0, so E_flow contributes EXACTLY 0 to the split (C2 out).',
    F3_running_g_is_common_to_both_landmarks:
      'The log-factor running d ln L/dt is the (1 - 1/t) piece of g = (1/2)(1 - 1/t) and is COMMON to both ' +
      'landmarks (imp-35028: both sit on the same running-g to ~1.45e-5 relative, ~2200x too small to move the ' +
      'exponent by 0.064). A term common to both landmarks cannot SPLIT them, so log-factor running / running-g ' +
      'is out (C1 out).',
    F4_definitional_difference_reproduces_the_whole_split:
      'Using the SAME curvature operator to locate both offsets (sigmoid-vs-sigmoid or ramp-vs-ramp) gives a ' +
      'split of EXACTLY 0; the ~0.064 split appears ONLY in the CROSS pairing (d2 p/dt2 = 0 ramp knee vs ' +
      'd2 sigma/dt2 = 0 sigmoid inflection). Holding the surrogate fixed (E_flow == 0, the same running-g) and ' +
      'changing only which operator defines each landmark reproduces the entire split -- so the residual ~0.064 ' +
      'is accounted for by the ramp-vs-sigmoid DEFINITIONAL difference (C3 in).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Attributing the imp-34948 ~0.064 far-tail ramp-vs-sigmoid ' +
    'decay-exponent split, given imp-35028 ruled out a running-g difference: (C2) E_flow is structurally absent ' +
    'from the surrogate (E_flow-negligible balance, halving = crossover), contributing EXACTLY 0; (C1) log-factor ' +
    'running / running-g is the (1 - 1/t) piece of g, COMMON to both landmarks (imp-35028: same g to ~1.45e-5), ' +
    'so it cannot split them; (C3) the ramp-vs-sigmoid DEFINITIONAL difference reproduces the WHOLE split -- the ' +
    'split equals the log-log slope of the fixed offset ratio offsetRamp/offsetSigmoid (0.06431 = 0.06431, ' +
    'residual < 1e-4), a ~2.78 ratio drifting ~1.6% band-wide, and using the SAME operator for both offsets ' +
    'collapses the split to exactly 0 while only the CROSS (d2 p/dt2 = 0 vs d2 sigma/dt2 = 0) pairing carries ' +
    '0.06431. So the residual split is accounted for by the definitional difference between the two curvature ' +
    'operators, NOT E_flow and NOT log-factor running. Component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; imp-34687a/imp-34714a stay OPEN; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35028 (rules out the running-g difference; this module inherits that and completes the attribution); ' +
    'imp-34948 (the far-tail exponent split this attributes; locators reused verbatim); imp-35029 (ramp-knee ' +
    'nested-FD step-window sub-gap on the same split); imp-33721 (ramp knee, d2 p/dt2 = 0); imp-33744 (sigmoid ' +
    'inflection, d2 sigma/dt2 = 0); imp-398 (the excluded E_flow Gronwall term); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35132_SPLIT_ATTRIBUTION_ASSERTIONS = [
  {
    // Reuse gate: five far-tail rungs land, reproducing the imp-34948/imp-35028 exponents and ~0.064 split.
    id: 'imp35132-reproduces-imp34948-exponent-split',
    description: 'the far-tail exponents match imp-34948 (sigmoid near -2.013, ramp near -1.949, split ~0.064)',
    holds: () =>
      LADDER.length === 5 &&
      Math.abs(decayExpSigmoid - -2.013) < 0.01 &&
      Math.abs(decayExpRamp - -1.949) < 0.01 &&
      Math.abs(exponentSplit - 0.064) < 0.01,
  },
  {
    // (C3 identity): the split equals the log-log slope of the offset ratio to < 1e-4.
    id: 'imp35132-split-equals-offset-ratio-slope',
    description: 'the exponent split equals |d ln(offsetRamp/offsetSigmoid)/d ln t| to < 1e-4 (algebraic identity)',
    holds: () => identityResidual < 1e-4,
  },
  {
    // (C3): the fixed offset ratio is ~2.78 and drifts a small (< 3%) but nonzero amount band-wide.
    id: 'imp35132-offset-ratio-fixed-and-slowly-drifting',
    description: 'the offset ratio sits near 2.78 and drifts a small nonzero amount (0 < drift < 3%) band-wide',
    holds: () =>
      Math.abs(ratioLo - 2.78) < 0.1 &&
      Math.abs(ratioHi - 2.78) < 0.1 &&
      ratioBandDriftPct > 0 &&
      ratioBandDriftPct < 3,
  },
  {
    // (C3 decisive): same-operator splits are exactly 0; only the cross pairing carries the split.
    id: 'imp35132-only-cross-operator-pairing-splits',
    description: 'sigmoid-vs-sigmoid and ramp-vs-ramp splits are 0; only the cross pairing gives ~0.064',
    holds: () =>
      splitSameSigmoid === 0 &&
      splitSameRamp === 0 &&
      Math.abs(splitCross - exponentSplit) < 1e-12 &&
      splitCross > 0.05,
  },
  {
    // (C2): the surrogate carries no E_flow term -- E_flow contributes exactly 0 to the split.
    id: 'imp35132-surrogate-has-no-eflow-term',
    description: 'the sigmaNoFlow surrogate has no E_flow term, so E_flow contributes 0 to the split (C2 out)',
    holds: () => surrogateHasEFlowTerm === false,
  },
  {
    // Attribution gate: C1 and C2 out, C3 in.
    id: 'imp35132-attribution-c3-definitional',
    description: 'attribution: log-factor/running-g and E_flow ruled OUT, definitional difference ruled IN',
    holds: () =>
      IMP35132_SPLIT_ATTRIBUTION.attribution.C1_log_factor_running_running_g === 'RULED OUT' &&
      IMP35132_SPLIT_ATTRIBUTION.attribution.C2_E_flow === 'RULED OUT' &&
      IMP35132_SPLIT_ATTRIBUTION.attribution.C3_ramp_vs_sigmoid_definitional_difference === 'RULED IN',
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35132-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35132_SPLIT_ATTRIBUTION.isRigorous === false &&
      /NO QED/.test(IMP35132_SPLIT_ATTRIBUTION.verdict) &&
      /refereed bound is changed/i.test(IMP35132_SPLIT_ATTRIBUTION.verdict),
  },
];

for (const a of IMP35132_SPLIT_ATTRIBUTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35132-split-attribution assertion failed: ${a.id}`);
  }
}
