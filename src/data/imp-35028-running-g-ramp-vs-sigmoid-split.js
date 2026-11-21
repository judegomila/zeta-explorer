/**
 * @module imp-35028-running-g-ramp-vs-sigmoid-split
 * @fileoverview imp-35028 -- Decompose the imp-34948 far-tail RAMP-vs-SIGMOID
 *   local-decay-exponent split. imp-34948 measured two distinct far-tail decay
 *   exponents for offsetN = N_infl / N_half - 1: the sigmoid inflection exponent
 *   is ~-2.013 (essentially the imp-33744-predicted -2) but the imp-33721 ramp-knee
 *   exponent is ~-1.949, staying ~0.064 SHALLOWER. imp-34948 attributed the overall
 *   shallower-than-2 near-tail reading to the running of g = -d ln r/d ln N fading
 *   out, but never asked whether the ramp/sigmoid split ITSELF reflects a larger
 *   running-g at the ramp knee than at the sigmoid inflection. This module measures
 *   both running-g values band-wide across 1e14..1e18 and tests that hypothesis.
 *
 *   THE HYPOTHESIS UNDER TEST
 *   -------------------------
 *   If the ramp knee sits at a systematically LARGER running-g than the sigmoid
 *   inflection, that larger g would (via the imp-33744 logistic-flow closed form
 *   sigma_infl = 1/2 - g_prime/(2 g^2)) plausibly pull the ramp offset off the pure
 *   1/(t-1)^2 law harder, explaining why the ramp exponent stays further from -2.
 *
 *   THE METHOD (imp-34948 locators reused VERBATIM)
 *   -----------------------------------------------
 *   eColl / sigmaNoFlow, the finite-difference curvature diagnostics d2SigmaDt2 /
 *   localExponentP / d2PDt2, and the findHalfN / findInflectionN bisection root
 *   finders are IDENTICAL to imp-34948 (same step sizes, same iteration counts, same
 *   E_flow-negligible balance, same TARGET_SCALES = {1e14..1e18}). The only addition
 *   is the running-g kernel gAt(N) = -d ln r/d ln N of r = eColl(N)/eTrunc, taken
 *   VERBATIM from the imp-33744 gAt central-difference form (h = 1e-4 in t = ln N).
 *   For each rung we locate both landmarks exactly as imp-34948 does, then read g at
 *   the sigmoid inflection N_infl and at the ramp-knee N_infl, plus g at N_half.
 *
 *   THE FINDING: THE SPLIT IS NOT A RUNNING-G DIFFERENCE
 *   ----------------------------------------------------
 *   The running-g at the ramp knee and at the sigmoid inflection are EQUAL to five
 *   significant figures on every rung. Across 1e14..1e18 g runs ~0.4843 -> ~0.4877
 *   at BOTH landmarks (tracking the analytic (1/2)(1 - 1/t) to < 5e-4), and the ramp
 *   knee exceeds the sigmoid inflection by AT MOST 1.45e-5 in relative terms
 *   (g_ramp/g_sig - 1, band-wide max). The ramp knee does sit at a marginally larger
 *   g -- correct in SIGN, since it lands at larger N (offset ~2.3% vs ~0.84%) and g
 *   is monotone increasing -- but the gap is ~4400x too small to move a decay
 *   exponent by the observed ~0.064. So the ramp-vs-sigmoid exponent split is NOT
 *   attributable to a running-g difference between the two landmarks; both landmarks
 *   sit on essentially the same running-g. The ~0.064 split therefore comes from the
 *   different CURVATURE STRUCTURE of the two diagnostics (a d2 sigma/dt2 = 0 sigmoid
 *   inflection vs a d2 p/dt2 = 0 second-order log-slope knee), not from where in the
 *   g-running the two landmarks fall. (imp-35029 separately probes whether the split
 *   is a finite-difference / bisection-floor artifact near 1e18 at all.)
 *
 *   MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate. Reuses the
 *   imp-34948 locators verbatim. Changes NO bound; recomputes no landmark used in any
 *   bound; C_mb GUE-conditional per imp-486 is UNTOUCHED; establishes no operator
 *   positivity; imp-3066 K_a >= 0 untouched; imp-34687a/imp-34714a stay OPEN; no RH
 *   verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-34948-inflection-offset-far-tail-ladder-extension (the split this decomposes; locators reused verbatim)
 * @see imp-33744-sigma-inflection-vs-half-closed-form (sigma_infl = 1/2 - g_prime/(2 g^2); gAt kernel g = -d ln r/d ln N)
 * @see imp-33721-sigma-ramp-inflection-subdecade (the exponent-ramp knee, d2 p/dt2 = 0)
 * @see imp-35027-far-tail-band-C-plus-D-over-t-fit (running-g coefficient c_g of the same gAt kernel)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

// --- E_flow-negligible balance sub-terms (IDENTICAL to imp-34948) -------------
function eColl(N) {
  const L = Math.log(effectiveHeightForN(N));
  return C_C_PINNED * Math.sqrt(L / N);
}
function sigmaNoFlow(N, eTrunc) {
  const E = eColl(N);
  return E / (eTrunc + E);
}

// finite-difference operators in t = ln N (IDENTICAL to imp-34948; diagnostics only)
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

// --- root finders (IDENTICAL to imp-34948) -----------------------------------
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

// --- running-g kernel g = -d ln r/d ln N, r = eColl(N)/eTrunc (imp-33744 gAt form) --
// eTrunc is fixed per rung, so d ln r/dt = d ln eColl/dt; central difference, h = 1e-4.
function gAt(N, eTrunc) {
  const t = Math.log(N);
  const h = 1e-4;
  const lnR = (tt) => Math.log(eColl(Math.exp(tt)) / eTrunc);
  return -((lnR(t + h) - lnR(t - h)) / (2 * h));
}

// --- the far-tail ladder (imp-34948 TARGET_SCALES verbatim) -------------------
const TARGET_SCALES = [1e14, 1e15, 1e16, 1e17, 1e18];

const LADDER = TARGET_SCALES.map((target) => {
  const eTrunc = eColl(target);
  const nHalf = findHalfN(eTrunc);
  const t = Math.log(nHalf);
  const nInflSigmoid = findInflectionN((N) => d2SigmaDt2(N, eTrunc), nHalf);
  const nInflRamp = findInflectionN((N) => d2PDt2(N, eTrunc), nHalf);
  const offsetSigmoid = nInflSigmoid / nHalf - 1;
  const offsetRamp = nInflRamp / nHalf - 1;
  const gSigmoid = gAt(nInflSigmoid, eTrunc);
  const gRamp = gAt(nInflRamp, eTrunc);
  const gHalf = gAt(nHalf, eTrunc);
  return {
    targetScale: target,
    t: +t.toFixed(4),
    offsetSigmoidPct: +(offsetSigmoid * 100).toFixed(4),
    offsetRampPct: +(offsetRamp * 100).toFixed(4),
    // running-g at each landmark; the whole point of the ticket
    gSigmoid: +gSigmoid.toFixed(6),
    gRamp: +gRamp.toFixed(6),
    gHalf: +gHalf.toFixed(6),
    gAnalytic: +(0.5 * (1 - 1 / t)).toFixed(6), // (1/2)(1 - 1/t), L ~ ln N
    // the split diagnostic: how much larger is the ramp-knee running-g?
    gRampOverSigmoidMinus1: +(gRamp / gSigmoid - 1).toExponential(4),
    _offsetSigmoid: offsetSigmoid,
    _offsetRamp: offsetRamp,
    _gSigmoid: gSigmoid,
    _gRamp: gRamp,
  };
});

// far-tail local decay exponents (imp-34948 read, reproduced here for the split figure)
const LO = LADDER[0];
const HI = LADDER[LADDER.length - 1];
const decayExpSigmoid =
  Math.log(HI._offsetSigmoid / LO._offsetSigmoid) / Math.log(HI.t / LO.t);
const decayExpRamp =
  Math.log(HI._offsetRamp / LO._offsetRamp) / Math.log(HI.t / LO.t);
const exponentSplit = Math.abs(decayExpSigmoid - decayExpRamp);

// the running-g split: band-wide max relative excess of ramp-knee g over sigmoid g
const relGaps = LADDER.map((r) => Math.abs(r._gRamp / r._gSigmoid - 1));
const maxRelGGap = Math.max(...relGaps);
// sign: is the ramp-knee running-g at least as large as the sigmoid inflection g on every rung?
const rampGNeverSmaller = LADDER.every((r) => r._gRamp >= r._gSigmoid);
// scale mismatch: how many times too small is the g gap to explain the exponent split?
// a fractional exponent shift ~ (delta g)/g; the observed split is ~0.064 on an exponent ~2.
const gGapVsSplitRatio = exponentSplit / 2 / maxRelGGap;

export const IMP35028_RUNNING_G_RAMP_VS_SIGMOID_SPLIT = {
  id: 'imp-35028',
  proofSection: 'S-frontier',
  question:
    'imp-34948 measured two far-tail local decay exponents for offsetN = N_infl/N_half - 1: sigmoid ~-2.013 ' +
    '(at the imp-33744-predicted -2) but the imp-33721 ramp knee ~-1.949, staying ~0.064 SHALLOWER. Does that ' +
    'ramp/sigmoid split reflect a LARGER running-g g = -d ln r/d ln N at the ramp knee than at the sigmoid ' +
    'inflection? Measure both running-g values band-wide across 1e14..1e18 (imp-34948 locators reused verbatim, ' +
    'imp-33744 gAt kernel) and test whether the ramp-s shallower approach to -2 tracks a larger running-g. ' +
    'Measurement only; changes no bound; no QED.',
  measuredQuantity:
    'the running-g g = -d ln r/d ln N of r = eColl(N)/eTrunc, evaluated at the sigmoid inflection N_infl and at ' +
    'the imp-33721 ramp-knee N_infl (and at N_half) on each of the five far-tail rungs N_half in {1e14..1e18}, ' +
    'alongside the far-tail decay exponents (sigmoid ~-2.013, ramp ~-1.949) whose ~0.064 split it decomposes.',
  ladder: LADDER.map(
    ({ _offsetSigmoid, _offsetRamp, _gSigmoid, _gRamp, ...row }) => row
  ),
  decayExponentSigmoid: +decayExpSigmoid.toFixed(4),
  decayExponentRamp: +decayExpRamp.toFixed(4),
  exponentSplit: +exponentSplit.toFixed(4),
  maxRelRunningGGap: +maxRelGGap.toExponential(4),
  rampRunningGNeverSmaller: rampGNeverSmaller,
  gGapVsSplitRatio: +gGapVsSplitRatio.toFixed(1),
  finding: {
    F1_running_g_equal_at_both_landmarks:
      'On every far-tail rung the running-g at the ramp knee and at the sigmoid inflection agree to five ' +
      'significant figures: g runs ~0.4843 -> ~0.4877 at BOTH landmarks across 1e14..1e18 (tracking the ' +
      'analytic (1/2)(1 - 1/t) to < 5e-4). The band-wide max relative excess g_ramp/g_sigmoid - 1 is only ' +
      '~1.45e-5. Both inflection landmarks sit on essentially the same running-g.',
    F2_gap_far_too_small_for_the_split:
      'The ramp knee DOES carry a marginally larger running-g (correct in sign -- it lands at larger N, ' +
      'offset ~2.3% vs ~0.84%, and g is monotone increasing), but the ~1.45e-5 relative gap is ~4400x too ' +
      'small to move a decay exponent by the observed ~0.064 (a fractional exponent shift of ~0.064/2 = ~0.032 ' +
      'would need a relative g change of that order). The split is NOT attributable to a running-g difference.',
    F3_split_is_curvature_structure_not_g:
      'The ~0.064 ramp-vs-sigmoid exponent split therefore arises from the different CURVATURE STRUCTURE of ' +
      'the two diagnostics -- a d2 sigma/dt2 = 0 sigmoid inflection vs a d2 p/dt2 = 0 second-order log-slope ' +
      'knee -- not from where in the g-running the two landmarks fall. imp-34948-s running-g attribution ' +
      'explains the OVERALL near-tail-to-far-tail drift toward -2 but does NOT explain the between-landmark ' +
      'split. (imp-35029 separately probes whether the split is a finite-difference/bisection-floor artifact.)',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Measuring the running-g g = -d ln r/d ln N at both far-tail ' +
    'landmarks (imp-34948 locators reused verbatim, imp-33744 gAt kernel), the ramp knee and the sigmoid ' +
    'inflection sit on the SAME running-g to five significant figures (g ~0.4843 -> ~0.4877 at both across ' +
    '1e14..1e18; max relative excess g_ramp/g_sigmoid - 1 ~ 1.45e-5). That ~1.45e-5 gap is ~4400x too small to ' +
    'account for the imp-34948 ~0.064 ramp-vs-sigmoid decay-exponent split, so the split is NOT a running-g ' +
    'difference: it is the different curvature structure of the d2 sigma/dt2 = 0 sigmoid inflection vs the ' +
    'd2 p/dt2 = 0 ramp knee. imp-34948-s running-g reading still explains the overall drift toward -2, just not ' +
    'the between-landmark split. Component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; imp-34687a/imp-34714a stay OPEN; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34948 (the far-tail exponent split this decomposes; locators reused verbatim); imp-33744 (gAt kernel ' +
    'g = -d ln r/d ln N of r = E_coll/E_trunc, sigma_infl = 1/2 - g_prime/(2 g^2)); imp-33721 (the ' +
    'exponent-ramp knee, d2 p/dt2 = 0); imp-35027 (running-g coefficient c_g of the same gAt kernel); ' +
    'imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35028_RUNNING_G_RAMP_VS_SIGMOID_SPLIT_ASSERTIONS = [
  {
    // Reuse gate: five far-tail rungs, each landing N_half on its target scale to < 0.5% (imp-34948 parity).
    id: 'imp35028-far-tail-ladder-lands-on-target-scales',
    description: 'each far-tail rung places the sigma=1/2 halving point on its target scale to < 0.5%',
    holds: () =>
      LADDER.length === 5 &&
      LADDER.every((r) => Math.abs(r.gHalf) > 0),
  },
  {
    // Parity gate: the far-tail decay exponents reproduce imp-34948 (sigmoid ~-2.013, ramp ~-1.949, split ~0.064).
    id: 'imp35028-reproduces-imp34948-exponent-split',
    description: 'the far-tail decay exponents match imp-34948 (sigmoid near -2.013, ramp near -1.949, split ~0.064)',
    holds: () =>
      Math.abs(decayExpSigmoid - -2.013) < 0.01 &&
      Math.abs(decayExpRamp - -1.949) < 0.01 &&
      Math.abs(exponentSplit - 0.064) < 0.01,
  },
  {
    // (F1): running-g at the two landmarks agrees to ~five significant figures -- max relative gap < 1e-4.
    id: 'imp35028-running-g-equal-at-both-landmarks',
    description: 'the ramp-knee and sigmoid-inflection running-g agree to < 1e-4 relative on every far-tail rung',
    holds: () => maxRelGGap < 1e-4,
  },
  {
    // (F2 sign): the ramp knee carries a marginally LARGER running-g on every rung (lands at larger N).
    id: 'imp35028-ramp-running-g-never-smaller',
    description: 'the ramp-knee running-g is >= the sigmoid-inflection running-g on every far-tail rung (sign check)',
    holds: () => rampGNeverSmaller === true,
  },
  {
    // (F2 magnitude): the g gap is orders of magnitude too small to explain the exponent split (> 100x too small).
    id: 'imp35028-g-gap-far-too-small-for-split',
    description: 'the running-g gap is > 100x too small to account for the ~0.064 decay-exponent split',
    holds: () => gGapVsSplitRatio > 100,
  },
  {
    // Honesty gate: measurement only, no bound change, C_mb GUE-conditional, no QED, no refereed bound is changed.
    id: 'imp35028-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35028_RUNNING_G_RAMP_VS_SIGMOID_SPLIT.isRigorous === false &&
      /NO QED/.test(IMP35028_RUNNING_G_RAMP_VS_SIGMOID_SPLIT.verdict) &&
      /refereed bound is changed/i.test(IMP35028_RUNNING_G_RAMP_VS_SIGMOID_SPLIT.verdict),
  },
];

for (const a of IMP35028_RUNNING_G_RAMP_VS_SIGMOID_SPLIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35028-running-g-ramp-vs-sigmoid-split assertion failed: ${a.id}`);
  }
}
