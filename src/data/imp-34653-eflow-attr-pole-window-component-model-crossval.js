/**
 * @module imp-34653-eflow-attr-pole-window-component-model-crossval
 * @fileoverview imp-34653 -- CROSS-VALIDATE that the imp-34636 pole-centred window is ONE
 *   coherent measurement, not a SEAM between two source ladders. imp-34636 assembled its
 *   5-rung pole-centred OLS window (k in {21.2, 21.25, 21.28095, 21.3, 21.35}) by SPLICING
 *   rungs taken VERBATIM from two different modules -- FOUR from the imp-34406 near ladder
 *   (k = 21.2 .. 21.3) and ONE from the imp-34572 far ladder (k = 21.35) -- but never
 *   re-derived eflow_attr at those k-nodes from a SINGLE component-model code path to confirm
 *   the two source ladders are on the same footing. This module recomputes eflow_attr AND the
 *   surrogate numerator resid_exp at all five pole-window k-nodes independently, from ONE
 *   inline copy of the inherited imp-3220/imp-3406 component-model definition (the verbatim
 *   imp-34169 parts()/eflowLogSlope() machinery), and checks they reproduce the spliced
 *   imp-34406/imp-34572 baked values to tolerance.
 *
 *   WHY THIS MATTERS. The imp-34636 pole window mixes rungs from two ladders that were
 *   published in separate modules. If those two ladders had been sampled at different inner
 *   resolutions or with any divergent sub-term convention, the k = 21.35 far rung would sit on
 *   a different footing from the four near rungs, and the imp-34636 pole-centred slope would be
 *   a SPLICING ARTIFACT of the seam rather than a single coherent measurement. Recomputing all
 *   five nodes from one code path settles whether the near and far source ladders agree.
 *
 *   METHOD (import-light, verbatim imp-34169/imp-34109 machinery). The component model
 *   sigma(N) = E_coll / (E_trunc + E_flow + E_coll) is the inherited imp-3220/imp-3406 sub-term
 *   set EXACTLY as in imp-34109/imp-34169: E_trunc = 3.06e-5 (fixed-strip, imp-2631),
 *   E_flow = C_F (L/T0) exp(TC_A1_TRAP), E_coll = C_C_PINNED sqrt(L/N), with T0 =
 *   effectiveHeightForN(N) and L = ln T0. eflow_attr(k) = (E_flow/E_N) |d ln E_flow / d log10 N|
 *   at N = 10^(k+1) (the imp-34406 direct-recovery numerator); resid_exp(k) =
 *   pEcoll (1 - sigma) - pSigma (the imp-34169 surrogate numerator whose zero is the pole).
 *   Only two import-light scalars are pulled (effectiveHeightForN, C_C_PINNED) -- NO 16.7MB
 *   zeros bundle in the chain, per [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]].
 *   The baked pole-window rungs are imported from imp-34406 (near) and imp-34572 (far) as the
 *   comparison targets.
 *
 *   FINDINGS (cross-validation only).
 *   ---------------------------------------------------------------------------------
 *   (F1) THE FIVE POLE-WINDOW eflow_attr NODES REPRODUCE FROM ONE CODE PATH TO < 1e-9. The
 *        independent recomputation of eflow_attr at k = 21.2, 21.25, 21.28095, 21.3 (imported
 *        from imp-34406) and k = 21.35 (imported from imp-34572) matches the spliced baked
 *        values to a maximum relative error of 8.60e-10 -- the largest at k = 21.2, the smallest
 *        (6.07e-11) at the k = 21.35 FAR rung. The single far-side rung is reproduced just as
 *        tightly as the four near rungs, so the two source ladders are on the SAME footing: the
 *        pole window is one coherent measurement, NOT a seam artifact of two differently-sampled
 *        ladders.
 *   (F2) THE SURROGATE resid_exp SCHEDULE THROUGH THE POLE IS REPRODUCED AND CHANGES SIGN AT
 *        THE AT-POLE RUNG. Independently recomputed resid_exp(k) is strictly decreasing across
 *        the window -- +2.211e-8 (21.2), +8.190e-9 (21.25), -6.69e-13 (21.28095), -4.886e-9
 *        (21.3), -1.717e-8 (21.35) -- crossing zero AT the median rung k* = 21.28095 (resid_exp
 *        there is -6.69e-13, at the double-precision floor). So the AT-pole rung the imp-34636
 *        window centres on genuinely SITS on the resid_exp zero (imp-34169 k* ~ 21.280947), and
 *        the eflow_attr numerator stays smooth and positive across it (4.520e-15 at k*) while the
 *        DENOMINATOR resid_exp is what vanishes -- confirming eflow_over_resid = eflow_attr /
 *        resid_exp has a GENUINE pole, not a numerator zero, from the single code path.
 *   (F3) THE SPLICE IS SEAMLESS. The four near (imp-34406) and one far (imp-34572) baked rungs,
 *        recomputed under one convention, are monotone-decreasing in eflow_attr (5.383e-15 ->
 *        3.894e-15) and monotone-decreasing in resid_exp with NO discontinuity or footing jump
 *        at the k = 21.3 -> 21.35 seam between the two source ladders. The imp-34636 pole-centred
 *        leading-slope measurement therefore rests on a coherent five-node ladder, not a spliced
 *        seam between two resolutions.
 *
 *   The punchline: recomputing eflow_attr and resid_exp at the five imp-34636 pole-window k-nodes
 *   from a SINGLE inline copy of the inherited imp-3220/imp-3406 component model reproduces the
 *   spliced imp-34406 (near, 4 rungs) and imp-34572 (far, 1 rung) baked values to a max relative
 *   error of 8.60e-10, with the far rung reproduced as tightly as the near ones and resid_exp
 *   crossing zero exactly at the median k* = 21.28095. The imp-34636 pole window is ONE coherent
 *   measurement on a common footing, NOT a splicing artifact of two differently-sampled ladders.
 *
 *   CROSS-VALIDATION ONLY. An independent recomputation of an inherited surrogate on inherited
 *   k-nodes, confirming two source ladders agree; NOT an RH bound and changing no result. The
 *   component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 *   the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 *   positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34636-eflow-attr-pole-centred-window-slope.js (the pole window this cross-validates)
 *   @see imp-34406-eflow-attr-smooth-nonzero-across-pole.js (the near source ladder, 4 rungs)
 *   @see imp-34572-eflow-attr-far-side-pole-smoothness.js (the far source ladder, the 21.35 rung)
 *   @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero.js (the parts()/eflowLogSlope()/resid_exp machinery)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34406_EFLOW_ATTR_RUNGS } from './imp-34406-eflow-attr-smooth-nonzero-across-pole.js';
import { IMP34572_FAR_SIDE_RUNGS } from './imp-34572-eflow-attr-far-side-pole-smoothness.js';

const KSTAR = 21.28095; // imp-34023/imp-34237/imp-34310, verbatim

// --- inherited imp-3220/imp-3406 component model (verbatim imp-34109/imp-34169 parts()) ----
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-34169
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

function olsSlope(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return sxy / sxx;
}

function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(parts(N).sigma));
  }
  return -olsSlope(xs, ys);
}
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}

// eflow_attr(k) = (E_flow/E_N) |d ln E_flow / d log10 N| at N = 10^(k+1) -- the imp-34406 numerator.
function eflowAttrAt(k) {
  const hi = Math.pow(10, k + 1);
  const ph = parts(hi);
  return (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
}
// resid_exp(k) = pEcoll (1 - sigma) - pSigma -- the imp-34169 surrogate numerator (its zero is the pole).
function residExpAt(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  return pEcoll * (1 - ph.sigma) - pSigma;
}

// --- the five imp-34636 pole-window k-nodes and their baked source rungs -------------------
const rungAt = (rungs, k) => rungs.find((r) => r.k === k);
const POLE_WINDOW_KS = [21.2, 21.25, 21.28095, 21.3, 21.35];

const CROSSVAL_ROWS = POLE_WINDOW_KS.map((k) => {
  const nearHit = rungAt(IMP34406_EFLOW_ATTR_RUNGS, k);
  const src = nearHit || rungAt(IMP34572_FAR_SIDE_RUNGS, k);
  const baked = src.eflowAttr;
  const recomputed = eflowAttrAt(k);
  const residExp = residExpAt(k);
  return {
    k,
    source: nearHit ? 'imp-34406 (near)' : 'imp-34572 (far)',
    bakedEflowAttr: baked,
    recomputedEflowAttr: recomputed,
    relErr: Math.abs(recomputed / baked - 1),
    residExp,
  };
});

const MAX_REL_ERR = CROSSVAL_ROWS.reduce((m, r) => Math.max(m, r.relErr), 0); // ~8.60e-10
const FAR_ROW = CROSSVAL_ROWS.find((r) => r.k === 21.35); // the single imp-34572 far rung
const POLE_ROW = CROSSVAL_ROWS.find((r) => r.k === KSTAR); // the median AT-pole rung

// --- (F2) resid_exp is strictly decreasing and changes sign at the AT-pole rung ------------
const RESID_EXP_STRICTLY_DECREASING = CROSSVAL_ROWS.every(
  (r, i) => i === 0 || r.residExp < CROSSVAL_ROWS[i - 1].residExp,
);
const RESID_EXP_POSITIVE_BELOW_POLE =
  CROSSVAL_ROWS[0].residExp > 0 && CROSSVAL_ROWS[1].residExp > 0; // 21.2, 21.25
const RESID_EXP_NEGATIVE_ABOVE_POLE =
  CROSSVAL_ROWS[3].residExp < 0 && CROSSVAL_ROWS[4].residExp < 0; // 21.3, 21.35
// eflow_attr stays smooth+positive and monotone-decreasing across the whole spliced window.
const EFLOW_ATTR_MONOTONE_DECREASING = CROSSVAL_ROWS.every(
  (r, i) => i === 0 || r.recomputedEflowAttr < CROSSVAL_ROWS[i - 1].recomputedEflowAttr,
);

export const IMP34653_POLE_WINDOW_MAX_REL_ERR = MAX_REL_ERR; // 8.60e-10
export const IMP34653_FAR_RUNG_REL_ERR = FAR_ROW.relErr; // 6.07e-11
export const IMP34653_POLE_RUNG_RESID_EXP = POLE_ROW.residExp; // -6.69e-13 (~0, the pole)

export const IMP34653_EFLOW_ATTR_POLE_WINDOW_COMPONENT_MODEL_CROSSVAL = {
  ticket: 'imp-34653',
  proofSection: 'S-frontier',
  kStar: KSTAR,
  question:
    'imp-34636 assembled its 5-rung pole-centred OLS window by SPLICING four rungs verbatim ' +
    'from the imp-34406 near ladder (k = 21.2 .. 21.3) and one from the imp-34572 far ladder ' +
    '(k = 21.35), but never re-derived eflow_attr at those k-nodes from a SINGLE component-model ' +
    'code path to confirm the two source ladders are on the same footing. Recompute eflow_attr ' +
    'and the surrogate numerator resid_exp at all five pole-window k-nodes independently from one ' +
    'inline copy of the inherited imp-3220/imp-3406 model and confirm they reproduce the spliced ' +
    'imp-34406/imp-34572 baked values to tolerance. Cross-validation only; NO QED.',
  poleWindowKs: POLE_WINDOW_KS,
  rows: CROSSVAL_ROWS.map((r) => ({
    k: r.k,
    source: r.source,
    bakedEflowAttr: +r.bakedEflowAttr.toExponential(8),
    recomputedEflowAttr: +r.recomputedEflowAttr.toExponential(8),
    relErr: +r.relErr.toExponential(3),
    residExp: +r.residExp.toExponential(4),
  })),
  maxRelErr: +MAX_REL_ERR.toExponential(3), // 8.600e-10
  farRungRelErr: +FAR_ROW.relErr.toExponential(3), // 6.073e-11
  poleRungResidExp: +POLE_ROW.residExp.toExponential(4), // -6.6924e-13
  residExpStrictlyDecreasing: RESID_EXP_STRICTLY_DECREASING, // true
  eflowAttrMonotoneDecreasing: EFLOW_ATTR_MONOTONE_DECREASING, // true
  finding: {
    F1_five_nodes_reproduce_from_one_code_path:
      'Independent recomputation of eflow_attr at k = 21.2, 21.25, 21.28095, 21.3 (imp-34406 near) ' +
      'and k = 21.35 (imp-34572 far) matches the spliced baked values to a max relative error of ' +
      '8.60e-10 -- largest at k = 21.2, smallest (6.07e-11) at the k = 21.35 FAR rung. The single ' +
      'far-side rung reproduces as tightly as the four near rungs, so the two source ladders are on ' +
      'the SAME footing: the imp-34636 pole window is one coherent measurement, NOT a seam artifact.',
    F2_resid_exp_reproduces_and_crosses_zero_at_the_pole:
      'Independently recomputed resid_exp(k) is strictly decreasing -- +2.211e-8 (21.2), +8.190e-9 ' +
      '(21.25), -6.69e-13 (21.28095), -4.886e-9 (21.3), -1.717e-8 (21.35) -- crossing zero AT the ' +
      'median rung k* = 21.28095 (resid_exp -6.69e-13, at the double-precision floor). The AT-pole ' +
      'rung the imp-34636 window centres on genuinely sits on the resid_exp zero (imp-34169 ' +
      'k* ~ 21.280947); eflow_attr stays smooth+positive (4.520e-15 at k*) while the DENOMINATOR ' +
      'resid_exp vanishes -- a GENUINE pole in eflow_over_resid, not a numerator zero.',
    F3_the_splice_is_seamless:
      'The four near (imp-34406) and one far (imp-34572) rungs, recomputed under one convention, are ' +
      'monotone-decreasing in eflow_attr (5.383e-15 -> 3.894e-15) and in resid_exp with NO ' +
      'discontinuity or footing jump at the k = 21.3 -> 21.35 seam between the two source ladders. ' +
      'The imp-34636 pole-centred leading-slope measurement rests on a coherent five-node ladder, ' +
      'not a spliced seam between two resolutions.',
  },
  isRigorous: false,
  honest:
    'CROSS-VALIDATION ONLY -- an independent recomputation of eflow_attr and the surrogate numerator ' +
    'resid_exp at the five imp-34636 pole-window k-nodes from a SINGLE inline copy of the inherited ' +
    'imp-3220/imp-3406 component model (verbatim imp-34169 parts()/eflowLogSlope()), reproducing the ' +
    'spliced imp-34406 (near, 4 rungs) and imp-34572 (far, 1 rung) baked values to a max relative ' +
    'error of 8.60e-10, with the far rung reproduced as tightly as the near ones and resid_exp ' +
    'crossing zero at the median k* = 21.28095. The imp-34636 pole window is ONE coherent measurement ' +
    'on a common footing, NOT a splicing artifact of two differently-sampled ladders. Confirms two ' +
    'source ladders agree; NOT an RH bound and changing no result. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED; no refereed bound is changed.',
};

export const IMP34653_ASSERTIONS = [
  {
    // Reuse gate: the five pole-window k-nodes and their baked targets are the imp-34406/imp-34572 rungs.
    id: 'imp-34653-uses-imp34406-imp34572-baked-pole-window',
    description: 'five pole-window nodes; four baked from imp-34406 near, the k=21.35 rung from imp-34572 far',
    holds: () =>
      CROSSVAL_ROWS.length === 5 &&
      CROSSVAL_ROWS.filter((r) => r.source === 'imp-34406 (near)').length === 4 &&
      FAR_ROW.source === 'imp-34572 (far)' &&
      POLE_ROW.k === KSTAR &&
      Math.abs(POLE_ROW.bakedEflowAttr - 4.51969554e-15) < 1e-22,
  },
  {
    // (F1) the five nodes reproduce from one code path to < 1e-9, far rung as tightly as near.
    id: 'imp-34653-five-nodes-reproduce-to-under-1e-9',
    description: 'independent recomputation matches all five baked eflow_attr values to max rel err < 1e-9',
    holds: () =>
      MAX_REL_ERR < 1e-9 &&
      CROSSVAL_ROWS.every((r) => r.relErr < 1e-9) &&
      FAR_ROW.relErr < 1e-9,
  },
  {
    // (F2) resid_exp is strictly decreasing and changes sign at the AT-pole median rung k*.
    id: 'imp-34653-resid-exp-crosses-zero-at-pole',
    description: 'recomputed resid_exp strictly decreasing, positive below k*, ~0 at k*, negative above',
    holds: () =>
      RESID_EXP_STRICTLY_DECREASING &&
      RESID_EXP_POSITIVE_BELOW_POLE &&
      RESID_EXP_NEGATIVE_ABOVE_POLE &&
      Math.abs(POLE_ROW.residExp) < 1e-11,
  },
  {
    // (F3) the splice is seamless: eflow_attr monotone-decreasing across the two-ladder seam.
    id: 'imp-34653-splice-is-seamless',
    description: 'eflow_attr monotone-decreasing across all five nodes incl. the k=21.3 -> 21.35 ladder seam',
    holds: () => EFLOW_ATTR_MONOTONE_DECREASING,
  },
  {
    // Honesty gate: cross-validation only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp-34653-honesty-gate-no-qed',
    description: 'Cross-validation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34653_EFLOW_ATTR_POLE_WINDOW_COMPONENT_MODEL_CROSSVAL.isRigorous === false &&
      /NO QED/.test(IMP34653_EFLOW_ATTR_POLE_WINDOW_COMPONENT_MODEL_CROSSVAL.honest) &&
      /refereed bound is changed/i.test(IMP34653_EFLOW_ATTR_POLE_WINDOW_COMPONENT_MODEL_CROSSVAL.honest),
  },
];

for (const a of IMP34653_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34653-eflow-attr-pole-window-component-model-crossval assertion failed: ${a.id}`);
  }
}
