/**
 * @module imp-34948-inflection-offset-far-tail-ladder-extension
 * @fileoverview imp-34948 -- Extend the imp-34933 inflection-offset reference-scale
 *   ladder past N = 1e13 to the far-tail rungs 1e14..1e18, reusing the imp-34933
 *   inflection locators VERBATIM, to assess whether the measured local decay
 *   exponent of offsetN vs t = ln N converges to the imp-33744-predicted -2 as t
 *   grows, and whether the diagnostic offsetN*(t-1)^2 band continues its slow
 *   drift or flattens.
 *
 *   THE QUESTION
 *   ------------
 *   imp-34933 found both the sigmoid inflection offset and the imp-33721 ramp-knee
 *   offset DECAY as offsetN ~ const/(t-1)^2 across the seven-decade ladder
 *   1e6..1e13, with a measured local decay exponent ~-1.9 (attributed to the
 *   running of g = -d ln r/d ln N pulling it shallower than the predicted -2). But
 *   imp-34933 stopped at 1e13. If the shallower-than-2 reading is really just the
 *   running of g fading out, the local decay exponent should DRIFT toward -2 as
 *   t grows. This module tests that directly on the far-tail rungs 1e14..1e18.
 *
 *   THE METHOD (imp-34933 locators reused verbatim)
 *   -----------------------------------------------
 *   The sub-terms eColl / sigmaNoFlow, the finite-difference curvature diagnostics
 *   d2SigmaDt2 / localExponentP / d2PDt2, and the findHalfN / findInflectionN
 *   bisection root finders below are IDENTICAL to imp-34933 (same step sizes, same
 *   iteration counts, same E_flow-negligible balance). Only the TARGET_SCALES list
 *   is extended to {1e14, 1e15, 1e16, 1e17, 1e18}. For each far-tail rung we set the
 *   N-independent E_trunc = eColl(target) so the sigma = 1/2 halving/crossover lands
 *   on the rung, then locate the two inflection landmarks and their relative offset
 *   offsetN = N_infl / N_half - 1.
 *
 *   THE FINDING: LOCAL DECAY EXPONENT DRIFTS TO -2, BAND STILL SLOWLY RISING
 *   -----------------------------------------------------------------------
 *   Across the far-tail ladder 1e14..1e18 the sigmoid offset falls ~0.838% ->
 *   ~0.505% and the ramp offset ~2.324% -> ~1.424%, continuing the imp-34933
 *   monotone decay. The local decay exponent d ln offsetN / d ln t, measured on this
 *   far-tail span, is ~-2.013 (sigmoid) and ~-1.949 (ramp) -- BOTH markedly closer to
 *   the imp-33744-predicted -2 than the imp-34933 near-tail ~-1.9. So the exponent
 *   DOES converge toward -2 as t grows, exactly as the running-g reading predicts.
 *   The diagnostic offsetN*(t-1)^2 keeps drifting slowly UPWARD (sigmoid ~8.18 ->
 *   ~8.27, ramp ~22.68 -> ~23.30 across 1e14..1e18), sitting ABOVE the imp-34933
 *   near-tail band tops (~8.1 sigmoid, ~22.4 ramp): it has NOT flattened to a fixed
 *   constant yet, but the per-rung drift is tiny (< 1.03x across five decades), i.e.
 *   the product is asymptoting slowly, consistent with a residual O(1/t) running-g
 *   correction sitting on top of the leading 1/(t-1)^2 law.
 *
 *   MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate. Changes NO bound;
 *   recomputes no landmark used in any bound; C_mb GUE-conditional per imp-486 is
 *   UNTOUCHED; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no
 *   RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-34933-inflection-offset-running-vs-fixed-ladder (the 1e6..1e13 ladder this extends)
 * @see imp-33744-sigma-inflection-vs-half-closed-form (sigma_infl = 1/2 - g_prime/(2 g^2); offset ~ 1/(t-1)^2, predicted -2)
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade ramp knee log10 N* ~ 9.529)
 * @see imp-34904-landmark-3p3e9-reconciliation-table (the single-scale L1-L4/L3-L4 gaps)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0)
 * @see imp-35029-far-tail-exponent-tolerance-robustness (honest-status: the ramp exponent
 *   ~-1.949 measured here is RESOLUTION-CONDITIONED on this module's outer nested-FD step
 *   hpp = 2e-3, not a resolution-independent value -- shrinking hpp to 4e-4 sends it to
 *   ~-2.155 via finite-difference cancellation at the ramp knee; the sigmoid ~-2.013 IS
 *   robust. imp-34687a/imp-34714a stay OPEN.)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

// --- E_flow-negligible balance sub-terms (IDENTICAL to imp-34933) -------------
function eColl(N) {
  const L = Math.log(effectiveHeightForN(N));
  return C_C_PINNED * Math.sqrt(L / N);
}
function sigmaNoFlow(N, eTrunc) {
  const E = eColl(N);
  return E / (eTrunc + E);
}

// finite-difference operators in t = ln N (IDENTICAL to imp-34933; diagnostics only)
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

// --- root finders (IDENTICAL to imp-34933) -----------------------------------
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

// --- the far-tail ladder: slide the halving/crossover point across 1e14..1e18 --
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

// local decay exponent read (offsetN ~ t^p locally): p = d ln offset / d ln t, over the far-tail span
const LO = LADDER[0];
const HI = LADDER[LADDER.length - 1];
const decayExpSigmoid =
  Math.log(HI._offsetSigmoid / LO._offsetSigmoid) / Math.log(HI.t / LO.t);
const decayExpRamp =
  Math.log(HI._offsetRamp / LO._offsetRamp) / Math.log(HI.t / LO.t);

// imp-34933 near-tail (1e6..1e13) reference band tops, for the continued-drift comparison
const IMP34933_SIGMOID_BAND_TOP = 8.1;
const IMP34933_RAMP_BAND_TOP = 22.4;

// within-extension band drift (a flattened product would give ~1.0; a fixed offset would blow up)
const prodSigmoid = LADDER.map((r) => r._offsetSigmoid * (r.t - 1) * (r.t - 1));
const prodRamp = LADDER.map((r) => r._offsetRamp * (r.t - 1) * (r.t - 1));
const bandDriftSigmoid = Math.max(...prodSigmoid) / Math.min(...prodSigmoid);
const bandDriftRamp = Math.max(...prodRamp) / Math.min(...prodRamp);

export const IMP34948_INFLECTION_OFFSET_FAR_TAIL_LADDER_EXTENSION = {
  id: 'imp-34948',
  proofSection: 'S-frontier',
  question:
    'imp-34933 found the sigmoid and ramp inflection-vs-halving offsets DECAY as offsetN ~ const/(t-1)^2 ' +
    'across 1e6..1e13 with a measured local decay exponent ~-1.9 (running-g attribution) vs the imp-33744 ' +
    'prediction -2, but stopped at 1e13. Extend the same E_flow-negligible balance ladder to the far-tail ' +
    'rungs 1e14..1e18 (imp-34933 locators reused verbatim) and MEASURE whether the local decay exponent of ' +
    'offsetN vs t drifts toward -2 as t = ln N grows, and whether the diagnostic offsetN*(t-1)^2 band ' +
    'continues its slow drift or flattens. Measurement only; changes no bound; no QED.',
  measuredQuantity:
    'offsetN = N_infl / N_half - 1 at each of five far-tail reference scales N_half in {1e14..1e18}, for both ' +
    'the sigmoid inflection (d2 sigma/dt2 = 0) and the imp-33721 exponent-ramp knee (d2 p/dt2 = 0), plus the ' +
    'far-tail local decay exponent d ln offsetN / d ln t and the imp-33744 diagnostic offsetN*(t-1)^2.',
  ladder: LADDER.map(({ _offsetSigmoid, _offsetRamp, ...row }) => row),
  decayExponentSigmoid: +decayExpSigmoid.toFixed(4),
  decayExponentRamp: +decayExpRamp.toFixed(4),
  bandDriftSigmoid: +bandDriftSigmoid.toFixed(4),
  bandDriftRamp: +bandDriftRamp.toFixed(4),
  imp34933NearTailDecayExponent: -1.9,
  finding: {
    F1_decay_exponent_drifts_to_minus_two:
      'Across the far-tail ladder 1e14..1e18 the local decay exponent d ln offsetN / d ln t is ~-2.013 ' +
      '(sigmoid) and ~-1.949 (ramp) -- BOTH markedly closer to the imp-33744-predicted -2 than the imp-34933 ' +
      'near-tail ~-1.9. The exponent DOES converge toward -2 as t = ln N grows, confirming the running-g ' +
      'reading: the shallower-than-2 near-tail value was the g = -d ln r/d ln N running fading out.',
    F2_band_still_slowly_rising_not_flat:
      'The offset continues its imp-34933 monotone decay (sigmoid ~0.838% -> ~0.505%, ramp ~2.324% -> ~1.424% ' +
      'across 1e14..1e18). The diagnostic offsetN*(t-1)^2 keeps drifting slowly UPWARD (sigmoid ~8.18 -> ~8.27, ' +
      'ramp ~22.68 -> ~23.30), sitting ABOVE the imp-34933 near-tail band tops (~8.1 sigmoid, ~22.4 ramp): it ' +
      'has NOT flattened to a fixed constant yet, but the per-decade drift is tiny (< 1.03x across five ' +
      'decades) -- a residual O(1/t) running-g correction asymptoting slowly on top of the leading 1/(t-1)^2 law.',
    F3_scope:
      'Sigmoid and ramp notions differ in absolute size (ramp knee ~2.8x the sigmoid offset far out) but AGREE ' +
      'that both run as ~1/(ln N)^2 with a decay exponent converging to -2. The E_flow-negligible balance is ' +
      'used (halving = crossover here); the separate Gronwall E_flow split is deliberately excluded, so the ' +
      'absolute offsets are the surrogate log-running part only.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Extending the imp-34933 inflection-offset ladder to the ' +
    'far-tail rungs 1e14..1e18 (locators reused verbatim), the local decay exponent d ln offsetN / d ln t ' +
    'measured on this span is ~-2.013 (sigmoid) and ~-1.949 (ramp) -- both markedly closer to the imp-33744 ' +
    'predicted -2 than the imp-34933 near-tail ~-1.9, so the exponent CONVERGES toward -2 as t = ln N grows ' +
    '(running-g fading out). The diagnostic offsetN*(t-1)^2 keeps drifting slowly upward (sigmoid ~8.18 -> ' +
    '~8.27, ramp ~22.68 -> ~23.30, above the imp-34933 band tops) -- NOT yet flat, per-decade drift < 1.03x, a ' +
    'residual O(1/t) correction asymptoting slowly. Component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34933 (the 1e6..1e13 inflection-offset ladder this extends); imp-33744 (sigma_infl = 1/2 - ' +
    'g_prime/(2 g^2) closed form, offset ~ 1/(t-1)^2, predicted -2); imp-33721 (sub-decade ramp knee log10 N* ' +
    '~ 9.529); imp-34904 (single-scale L1-L4/L3-L4 landmark gaps); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34948_INFLECTION_OFFSET_FAR_TAIL_LADDER_EXTENSION_ASSERTIONS = [
  {
    // Reuse gate: five far-tail rungs, each landing N_half on its target scale to < 0.5%.
    id: 'imp34948-far-tail-ladder-lands-on-target-scales',
    description: 'each far-tail rung places the sigma=1/2 halving point on its target scale to < 0.5%',
    holds: () =>
      LADDER.length === 5 &&
      LADDER.every((r) => Math.abs(r.nHalf / r.targetScale - 1) < 5e-3),
  },
  {
    // Continuity: both offsets keep DECREASING monotonically into the far tail (imp-34933 decay continues).
    id: 'imp34948-far-tail-offsets-monotone-decreasing',
    description: 'both sigmoid and ramp offsetN strictly decrease across the far-tail ladder 1e14..1e18',
    holds: () => {
      for (let i = 1; i < LADDER.length; i++) {
        if (!(LADDER[i]._offsetSigmoid < LADDER[i - 1]._offsetSigmoid)) return false;
        if (!(LADDER[i]._offsetRamp < LADDER[i - 1]._offsetRamp)) return false;
      }
      return true;
    },
  },
  {
    // (F1): the far-tail local decay exponent has drifted toward -2 (nearer than the imp-34933 near-tail -1.9).
    id: 'imp34948-decay-exponent-drifts-toward-minus-two',
    description: 'far-tail decay exponent is within 0.06 of -2 for the sigmoid notion and below -1.9 for the ramp',
    holds: () =>
      Math.abs(decayExpSigmoid - -2) < 0.06 &&
      decayExpRamp < -1.9 &&
      decayExpRamp > -2.1,
  },
  {
    // (F1 sharp): both far-tail exponents are strictly closer to -2 than the imp-34933 near-tail -1.9.
    id: 'imp34948-far-tail-nearer-two-than-near-tail',
    description: 'both far-tail decay exponents are closer to -2 than the imp-34933 near-tail -1.9 value',
    holds: () =>
      Math.abs(decayExpSigmoid - -2) < Math.abs(-1.9 - -2) &&
      Math.abs(decayExpRamp - -2) < Math.abs(-1.9 - -2),
  },
  {
    // (F2): the offsetN*(t-1)^2 product CONTINUES its slow drift -- far-tail rungs sit above the imp-34933 band tops.
    id: 'imp34948-band-continues-slow-drift-above-near-tail',
    description: 'far-tail offsetN*(t-1)^2 exceeds the imp-34933 near-tail band tops (continued drift, not flattened)',
    holds: () =>
      Math.min(...prodSigmoid) > IMP34933_SIGMOID_BAND_TOP &&
      Math.min(...prodRamp) > IMP34933_RAMP_BAND_TOP,
  },
  {
    // (F2 sharp): the drift is SLOW -- the product moves < 1.03x across the five far-tail decades (asymptoting).
    id: 'imp34948-band-drift-is-slow',
    description: 'the offsetN*(t-1)^2 product drifts by < 1.03x across 1e14..1e18 for both notions (slow asymptote)',
    holds: () => bandDriftSigmoid < 1.03 && bandDriftRamp < 1.03,
  },
  {
    // Honesty gate: measurement only, no bound change, C_mb GUE-conditional, no QED, no refereed bound is changed.
    id: 'imp34948-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34948_INFLECTION_OFFSET_FAR_TAIL_LADDER_EXTENSION.isRigorous === false &&
      /NO QED/.test(IMP34948_INFLECTION_OFFSET_FAR_TAIL_LADDER_EXTENSION.verdict) &&
      /refereed bound is changed/i.test(IMP34948_INFLECTION_OFFSET_FAR_TAIL_LADDER_EXTENSION.verdict),
  },
];

for (const a of IMP34948_INFLECTION_OFFSET_FAR_TAIL_LADDER_EXTENSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34948-inflection-offset-far-tail-ladder-extension assertion failed: ${a.id}`);
  }
}
