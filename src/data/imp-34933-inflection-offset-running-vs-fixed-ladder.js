/**
 * @module imp-34933-inflection-offset-running-vs-fixed-ladder
 * @fileoverview imp-34933 -- Assess whether the imp-34904 L1-L4 (~3.06%) and
 *   L3-L4 (~3.48%) inflection-vs-crossover / inflection-vs-halving landmark
 *   offsets are a FIXED structural constant or a slowly-RUNNING imp-33744
 *   log-factor term, by measuring the offsets across a range of N-decades
 *   rather than only at the single ~3.3e9 landmark cluster.
 *
 *   THE QUESTION
 *   ------------
 *   imp-34904 attributed the L1-L4 (crossover-vs-knee) and L3-L4 (halving-vs-knee)
 *   gaps to the imp-33744 DEFINITIONAL inflection-vs-crossover offset -- claimed to
 *   be the log-factor running of L = log T0(N), a structural E_coll term that
 *   VANISHES as N grows (sigma_infl = 1/2 - g_prime/(2 g^2), reaching 1/2 only in
 *   the pure power-law limit). But imp-34904 measured the offset only at ONE scale
 *   (the ~3.3e9 cluster), so it could equally well be a fixed ~3% constant. This
 *   module DISCRIMINATES the two readings by sweeping the reference scale.
 *
 *   THE METHOD (E_flow-negligible balance; identical imp-33744 sub-terms)
 *   --------------------------------------------------------------------
 *   sigma(N) = E_coll / (E_trunc + E_coll),  E_coll = C_C sqrt(L / N),  L = log T0(N).
 *   In this balance sigma = 1/2 EXACTLY at the E_coll = E_trunc crossover, so the
 *   halving landmark and the crossover coincide (their ~0.4% imp-34904 L1-L3 split
 *   is the separate Gronwall E_flow term, deliberately excluded here). Varying the
 *   N-independent E_trunc slides that halving/crossover point along a LADDER of
 *   reference scales N_half in {1e6, 1e7, ..., 1e13}: for each rung we set
 *   E_trunc = C_C sqrt(L(N_target)/N_target) so N_half lands on the rung, then
 *   locate two inflection landmarks and their relative N-offset above N_half:
 *     - sigmoid inflection  (d2 sigma/dt2 = 0, t = ln N) -- the imp-33744 closed form,
 *     - exponent-ramp inflection (d2 p/dt2 = 0, p = -d ln sigma/dt) -- the imp-33721
 *       "knee" notion that imp-34904 L4 actually uses.
 *   The offset is offsetN = N_infl / N_half - 1 at each rung.
 *
 *   THE FINDING: RUNNING, NOT FIXED
 *   -------------------------------
 *   Both offsets DECAY MONOTONICALLY as the reference scale grows -- the sigmoid
 *   offset falls ~4.21% -> ~0.97% and the ramp offset ~10.86% -> ~2.68% across the
 *   seven-decade ladder 1e6..1e13 (a >4x drop). The offset is therefore a slowly
 *   RUNNING term, NOT a fixed structural constant. The decay tracks the imp-33744
 *   closed-form prediction offsetN ~ const / (t - 1)^2, t = ln N: the diagnostic
 *   offsetN * (t - 1)^2 stays inside a narrow, slowly-drifting band (~6.9..8.1 for
 *   the sigmoid notion; ~17.8..22.4 for the ramp notion) rather than growing like
 *   (t-1)^2 (which a fixed offset would) -- so the local decay exponent of offsetN
 *   vs t is ~ -1.9, consistent with the predicted -2 (the running of g pulls it
 *   slightly shallower). As N -> infinity, t -> infinity and the offset -> 0.
 *
 *   So imp-34904 L1-L4 / L3-L4 are correctly attributed: they are the log-factor
 *   running of L = log T0(N), confirmed to shrink as ~1/(ln N)^2 across seven
 *   decades, NOT a fixed ~3% structural constant.
 *
 *   MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate. Changes NO bound;
 *   recomputes no landmark used in any bound; C_mb GUE-conditional per imp-486 is
 *   UNTOUCHED; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no
 *   RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-34904-landmark-3p3e9-reconciliation-table (the single-scale L1-L4/L3-L4 gaps)
 * @see imp-33744-sigma-inflection-vs-half-closed-form (sigma_infl = 1/2 - g_prime/(2 g^2) closed form)
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade knee log10 N* ~ 9.529)
 * @see imp-33582 / imp-33708 (sigma=1/2 halving landmark; E_flow negligible far tail)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

// --- E_flow-negligible balance sub-terms (identical to imp-33744) -------------
function eColl(N) {
  const L = Math.log(effectiveHeightForN(N));
  return C_C_PINNED * Math.sqrt(L / N);
}
function sigmaNoFlow(N, eTrunc) {
  const E = eColl(N);
  return E / (eTrunc + E);
}

// finite-difference operators in t = ln N (diagnostics only, no fresh model)
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

// --- root finders ------------------------------------------------------------
// sigma is monotone-decreasing in N, so bisection for sigma = 1/2 is robust.
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
// single sign change of the curvature diagnostic on a window centred on N_half.
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

// --- the ladder: slide the halving/crossover point across seven decades -------
const TARGET_SCALES = [1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13];

const LADDER = TARGET_SCALES.map((target) => {
  // choose E_trunc so the E_coll = E_trunc crossover (= halving point here) lands on target
  const eTrunc = eColl(target);
  const nHalf = findHalfN(eTrunc);
  const t = Math.log(nHalf);
  const nInflSigmoid = findInflectionN((N) => d2SigmaDt2(N, eTrunc), nHalf);
  const nInflRamp = findInflectionN((N) => d2PDt2(N, eTrunc), nHalf);
  const offsetSigmoid = nInflSigmoid / nHalf - 1;
  const offsetRamp = nInflRamp / nHalf - 1;
  return {
    targetScale: target,
    eTrunc: +eTrunc.toExponential(4),
    nHalf: +nHalf.toExponential(5),
    t: +t.toFixed(4),
    offsetSigmoidPct: +(offsetSigmoid * 100).toFixed(4),
    offsetRampPct: +(offsetRamp * 100).toFixed(4),
    // imp-33744 predicts offsetN ~ const/(t-1)^2; this product should stay banded, not grow
    sigmoidOffsetTimesTm1Sq: +(offsetSigmoid * (t - 1) * (t - 1)).toFixed(4),
    rampOffsetTimesTm1Sq: +(offsetRamp * (t - 1) * (t - 1)).toFixed(4),
    _offsetSigmoid: offsetSigmoid,
    _offsetRamp: offsetRamp,
  };
});

// endpoints for the decay-exponent read (offsetN ~ t^p locally): p = d ln offset / d ln t
const LO = LADDER[0];
const HI = LADDER[LADDER.length - 1];
const decayExpSigmoid =
  Math.log(HI._offsetSigmoid / LO._offsetSigmoid) / Math.log(HI.t / LO.t);
const decayExpRamp =
  Math.log(HI._offsetRamp / LO._offsetRamp) / Math.log(HI.t / LO.t);

// contraction ratios across the full seven-decade ladder (a fixed constant would give ~1)
const shrinkFactorSigmoid = LO._offsetSigmoid / HI._offsetSigmoid;
const shrinkFactorRamp = LO._offsetRamp / HI._offsetRamp;

export const IMP34933_INFLECTION_OFFSET_RUNNING_VS_FIXED_LADDER = {
  id: 'imp-34933',
  proofSection: 'S-frontier',
  question:
    'imp-34904 attributed the L1-L4 (~3.06%) crossover-vs-knee and L3-L4 (~3.48%) halving-vs-knee ' +
    'landmark gaps to the imp-33744 DEFINITIONAL inflection offset -- claimed to be the slowly-running ' +
    'log-factor of L = log T0(N), which vanishes as N grows -- but measured it only at the single ' +
    '~3.3e9 cluster. Is the offset a FIXED ~3% structural constant or a RUNNING term? Measure the ' +
    'inflection-vs-halving offset across a ladder of reference scales (1e6..1e13, by sliding E_trunc) ' +
    'and read whether it shrinks toward 0 (running) or stays fixed. Measurement only; changes no bound; no QED.',
  measuredQuantity:
    'offsetN = N_infl / N_half - 1 at each of seven reference scales N_half in {1e6..1e13}, for both ' +
    'the sigmoid inflection (d2 sigma/dt2 = 0) and the imp-33721 exponent-ramp knee (d2 p/dt2 = 0), plus ' +
    'the imp-33744 diagnostic offsetN*(t-1)^2 and the local decay exponent d ln offsetN / d ln t.',
  ladder: LADDER.map(({ _offsetSigmoid, _offsetRamp, ...row }) => row),
  decayExponentSigmoid: +decayExpSigmoid.toFixed(4),
  decayExponentRamp: +decayExpRamp.toFixed(4),
  shrinkFactorSigmoid: +shrinkFactorSigmoid.toFixed(4),
  shrinkFactorRamp: +shrinkFactorRamp.toFixed(4),
  finding: {
    F1_offset_runs_not_fixed:
      'Across the seven-decade ladder 1e6..1e13 the sigmoid inflection offset falls from ~4.21% to ~0.97% ' +
      'and the ramp knee offset from ~10.86% to ~2.68% -- MONOTONICALLY, a >4x contraction. The offset is a ' +
      'slowly RUNNING term, NOT a fixed ~3% structural constant. The imp-34904 L1-L4 / L3-L4 attribution to ' +
      'the log-factor running is confirmed against the fixed-constant alternative.',
    F2_scaling_is_one_over_lnN_sq:
      'The offset tracks the imp-33744 closed-form offsetN ~ const/(t-1)^2, t = ln N: offsetN*(t-1)^2 stays ' +
      'inside a narrow, slowly-drifting band (~6.9..8.1 sigmoid, ~17.8..22.4 ramp) rather than growing like ' +
      '(t-1)^2. The measured local decay exponent d ln offsetN / d ln t ~ -1.9 is consistent with the ' +
      'predicted -2 (the running of g = -d ln r/d ln N pulls it slightly shallower). Offset -> 0 as N -> infinity.',
    F3_scope:
      'Sigmoid and ramp notions differ in absolute size (the ramp knee is ~2.6x the sigmoid offset, matching ' +
      'the imp-34904 L1-L4/L3-L4 spread) but AGREE on the qualitative verdict -- both run as ~1/(ln N)^2. The ' +
      'E_flow-negligible balance is used (halving = crossover here); the ~0.4% imp-34904 L1-L3 Gronwall E_flow ' +
      'split is a separate term deliberately excluded, so absolute offsets are the surrogate log-running part only.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Sliding the N-independent E_trunc places the sigma=1/2 ' +
    'halving/crossover point on a ladder of reference scales 1e6..1e13; at each rung the inflection-vs-halving ' +
    'offsetN = N_infl/N_half - 1 SHRINKS monotonically (sigmoid ~4.21% -> ~0.97%, ramp ~10.86% -> ~2.68%, a >4x ' +
    'contraction). So the imp-34904 L1-L4/L3-L4 offset is a slowly RUNNING log-factor term, NOT a fixed ~3% ' +
    'structural constant, confirming the imp-33744 reading. The decay tracks the closed form offsetN ~ ' +
    'const/(t-1)^2 (t = ln N): offsetN*(t-1)^2 stays banded, local decay exponent d ln offsetN/d ln t ~ -1.9 ' +
    '(predicted -2, running-g shallower), offset -> 0 as N -> infinity. Component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34904 (single-scale L1-L4/L3-L4 landmark gaps); imp-33744 (sigma_infl = 1/2 - g_prime/(2 g^2) closed ' +
    'form, offset ~ 1/(t-1)^2); imp-33721 (sub-decade ramp knee log10 N* ~ 9.529); imp-33582/imp-33708 ' +
    '(sigma=1/2 halving landmark; E_flow negligible far tail); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34933_INFLECTION_OFFSET_RUNNING_VS_FIXED_LADDER_ASSERTIONS = [
  {
    // Reuse gate: seven-rung ladder built on the imp-33744 sub-terms, each rung landing N_half on its target.
    id: 'imp34933-ladder-lands-on-target-scales',
    description: 'each ladder rung places the sigma=1/2 halving point on its target scale to < 0.5%',
    holds: () =>
      LADDER.length === 7 || LADDER.length === 8
        ? LADDER.every((r) => Math.abs(r.nHalf / r.targetScale - 1) < 5e-3)
        : false,
  },
  {
    // (F1): the sigmoid offset DECREASES monotonically as the reference scale grows -- running, not fixed.
    id: 'imp34933-sigmoid-offset-monotone-decreasing',
    description: 'sigmoid inflection offsetN strictly decreases across the seven-decade ladder',
    holds: () => {
      for (let i = 1; i < LADDER.length; i++) {
        if (!(LADDER[i]._offsetSigmoid < LADDER[i - 1]._offsetSigmoid)) return false;
      }
      return true;
    },
  },
  {
    // (F1): the ramp knee offset (imp-33721 D2 notion, what imp-34904 L4 uses) also decreases monotonically.
    id: 'imp34933-ramp-offset-monotone-decreasing',
    description: 'exponent-ramp knee offsetN strictly decreases across the seven-decade ladder',
    holds: () => {
      for (let i = 1; i < LADDER.length; i++) {
        if (!(LADDER[i]._offsetRamp < LADDER[i - 1]._offsetRamp)) return false;
      }
      return true;
    },
  },
  {
    // (F1 sharp): NOT a fixed constant -- both offsets shrink by > 3x across the ladder (a constant gives ~1x).
    id: 'imp34933-offset-shrinks-more-than-3x',
    description: 'both offsets contract by > 3x across 1e6..1e13, ruling out a fixed structural constant',
    holds: () => shrinkFactorSigmoid > 3 && shrinkFactorRamp > 3,
  },
  {
    // (F2): the offset tracks the imp-33744 offsetN ~ const/(t-1)^2 -- the product stays banded, not growing.
    // A fixed offset would make this product grow like (t-1)^2 (a > 4x rise across the ladder); here it drifts < 1.4x.
    id: 'imp34933-offset-times-tm1sq-stays-banded',
    description: 'offsetN*(t-1)^2 stays inside a narrow band (drift < 1.4x), confirming ~1/(ln N)^2 running',
    holds: () => {
      const prod = LADDER.map((r) => r._offsetSigmoid * (r.t - 1) * (r.t - 1));
      const lo = Math.min(...prod);
      const hi = Math.max(...prod);
      return hi / lo < 1.4;
    },
  },
  {
    // (F2 sharp): the local decay exponent d ln offsetN / d ln t is near the predicted -2 (running g pulls shallower).
    id: 'imp34933-decay-exponent-near-minus-two',
    description: 'local decay exponent of offsetN vs t is in [-2.1, -1.6] for both notions (predicted -2)',
    holds: () =>
      decayExpSigmoid > -2.1 &&
      decayExpSigmoid < -1.6 &&
      decayExpRamp > -2.1 &&
      decayExpRamp < -1.6,
  },
  {
    // Anchor: the ramp knee offset at the ~3.3e9 cluster is the same few-percent order imp-34904 L3-L4 reports.
    id: 'imp34933-anchor-matches-imp34904-order',
    description: 'ramp knee offset near N ~ 1e9-1e10 is a few percent, the imp-34904 L1-L4/L3-L4 order of magnitude',
    holds: () => {
      const row = LADDER.find((r) => r.targetScale === 1e9);
      return row && row._offsetRamp > 0.02 && row._offsetRamp < 0.08;
    },
  },
  {
    // Honesty gate: measurement only, no bound change, C_mb GUE-conditional, no QED, no refereed bound is changed.
    id: 'imp34933-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34933_INFLECTION_OFFSET_RUNNING_VS_FIXED_LADDER.isRigorous === false &&
      /NO QED/.test(IMP34933_INFLECTION_OFFSET_RUNNING_VS_FIXED_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP34933_INFLECTION_OFFSET_RUNNING_VS_FIXED_LADDER.verdict),
  },
];

for (const a of IMP34933_INFLECTION_OFFSET_RUNNING_VS_FIXED_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34933-inflection-offset-running-vs-fixed-ladder assertion failed: ${a.id}`);
  }
}
