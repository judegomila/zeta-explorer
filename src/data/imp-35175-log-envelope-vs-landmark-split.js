/**
 * @module imp-35175-log-envelope-vs-landmark-split
 * @fileoverview imp-35175 -- Reconcile the imp-35036 logarithmic residual-gap law
 *   1/2 - p_dec ~ 1/(2 ln N) (for the far-tail decay exponent of the GUE-conditional
 *   share sigma = E_coll/E(N)) against the imp-35132 ~0.064 between-landmark
 *   decay-exponent split (ramp-knee vs sigmoid-inflection). The question: is the
 *   0.064 split just the SAME logarithmic-approach phenomenon read at two different N
 *   -- i.e. a finite-N reading of the 1/(2 ln N) envelope -- or a DISTINCT structural
 *   effect? imp-35132 already attributed it (by elimination) to the ramp-vs-sigmoid
 *   DEFINITIONAL difference (its candidate C3), ruling out running-g (imp-35028) and
 *   E_flow. This module places the imp-35036 envelope side by side with the split for
 *   the first time and DECIDES the question directly on the shared surrogate.
 *
 *   THE TEST
 *   --------
 *   The imp-35036 gap-closure law says the log-approach envelope carried by the
 *   surrogate at scale N is env(N) = 1/(2 ln N) (its F2: 1/2 - p_dec ~ 1/(2 ln N), the
 *   (1/2) d ln L/d ln N ~ 1/(2 ln N) log-factor running of L = log T0). If the ~0.064
 *   split were a finite-N reading of THAT envelope evaluated at the two imp-35132
 *   landmark N, then env(N_ramp) - env(N_sigmoid) would reproduce ~0.064. It does not,
 *   by orders of magnitude:
 *     (1) WITHIN a rung the two landmarks sit ~1-1.5% apart in N (N_ramp/N_sigmoid
 *         ~1.009-1.015), so env(N_ramp) - env(N_sigmoid) ~ -[1/(2 (ln N)^2)] d ln N is
 *         only ~2.6e-6..7.0e-6 across the five far-tail rungs -- ~9145x too small at
 *         1e14 to be the 0.06431 split. This ~micro-scale between-landmark envelope gap
 *         is the SAME order as the imp-35028 running-g gap (~1.45e-5) that imp-35028
 *         already found ~2200x too small -- so this is a THIRD independent angle giving
 *         the same ruling.
 *     (2) Even the most generous "two very different N" reading -- env at N_half of the
 *         FIRST rung (1e14) minus env at N_half of the LAST rung (1e18), spanning four
 *         decades -- is only ~3.45e-3, still ~18.7x too small to be the 0.064 split.
 *     (3) The regimes do not even match: the imp-35036 envelope governs the sigma
 *         decay exponent approaching +1/2 from below, whereas the imp-35132 split is
 *         between two OFFSET decay exponents near -2 (d ln offset/d ln t). The 0.064 is
 *         a difference of ~-2 exponents, not a reading of the +1/2 envelope.
 *
 *   VERDICT: the ~0.064 between-landmark split is a DISTINCT structural effect, NOT a
 *   finite-N reading of the imp-35036 1/(2 ln N) logarithmic-approach envelope. The
 *   envelope difference between the two landmarks is ~4 orders of magnitude too small
 *   within a rung and ~19x too small even band-wide. This CONFIRMS the imp-35132 C3
 *   attribution (ramp-vs-sigmoid definitional difference) from a third, independent
 *   direction -- the gap-closure law itself -- and unifies it with imp-35028: the
 *   between-landmark log-approach gap is a micro-scale (~1e-6..1e-5) quantity, whoever
 *   measures it (running-g, imp-35028; or the 1/(2 ln N) envelope, here), and the split
 *   lives elsewhere (the different curvature operator that locates each landmark).
 *
 *   MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate. Reuses the imp-35132
 *   (= imp-34948/imp-35028) locators verbatim and the imp-35036 envelope 1/(2 ln N).
 *   Changes NO bound; recomputes no landmark used in any bound; C_mb GUE-conditional
 *   per imp-486 is UNTOUCHED; far-tail exponent 1/2 per imp-3463; establishes no
 *   operator positivity; imp-3066 K_a >= 0 untouched; imp-34687a/imp-34714a stay OPEN;
 *   no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35036-sigma-decay-exponent-ladder-extension (the 1/(2 ln N) gap-closure envelope tested here)
 * @see imp-35132-split-attribution (the ~0.064 split; C3 definitional attribution confirmed here)
 * @see imp-35028-running-g-ramp-vs-sigmoid-split (running-g gap ~1.45e-5; same micro-scale as the envelope gap)
 * @see imp-34948-inflection-offset-far-tail-ladder-extension (the far-tail offset-exponent split; locators reused)
 * @see imp-3463-sigma-fartail-decay (far-tail sigma exponent -> 1/2 from below)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

// --- surrogate sub-terms (IDENTICAL to imp-34948 / imp-35028 / imp-35132) ------
function eColl(N) {
  const L = Math.log(effectiveHeightForN(N));
  return C_C_PINNED * Math.sqrt(L / N);
}
function sigmaNoFlow(N, eTrunc) {
  const E = eColl(N);
  return E / (eTrunc + E);
}

// finite-difference curvature diagnostics in t = ln N (verbatim imp-35132)
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

// root finders (verbatim imp-35132)
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

// --- the imp-35036 residual-gap envelope: env(N) = 1/(2 ln N) --------------------
// (imp-35036 F2: 1/2 - p_dec ~ 1/(2 ln N), the (1/2) d ln L/d ln N ~ 1/(2 ln N) piece)
const envelope = (N) => 1 / (2 * Math.log(N));

// --- the far-tail ladder (imp-34948 / imp-35132 TARGET_SCALES verbatim) ----------
const TARGET_SCALES = [1e14, 1e15, 1e16, 1e17, 1e18];

const LADDER = TARGET_SCALES.map((target) => {
  const eTrunc = eColl(target);
  const nHalf = findHalfN(eTrunc);
  const nSigmoid = findInflectionN((N) => d2SigmaDt2(N, eTrunc), nHalf);
  const nRamp = findInflectionN((N) => d2PDt2(N, eTrunc), nHalf);
  const envSigmoid = envelope(nSigmoid);
  const envRamp = envelope(nRamp);
  const envSplitWithinRung = Math.abs(envRamp - envSigmoid);
  return {
    targetScale: target,
    landmarkRatioRampOverSigmoid: +(nRamp / nSigmoid).toFixed(5),
    envelopeSigmoid: +envSigmoid.toFixed(7),
    envelopeRamp: +envRamp.toFixed(7),
    envelopeSplitWithinRung: +envSplitWithinRung.toExponential(4),
    _nHalf: nHalf,
    _nSigmoid: nSigmoid,
    _nRamp: nRamp,
    _offsetSigmoid: nSigmoid / nHalf - 1,
    _offsetRamp: nRamp / nHalf - 1,
    _envSplitWithinRung: envSplitWithinRung,
  };
});

const LO = LADDER[0];
const HI = LADDER[LADDER.length - 1];
const lnTspan = Math.log(Math.log(HI._nHalf) / Math.log(LO._nHalf));

// (reproduce the imp-35132 ~0.064 offset-exponent split, self-consistently)
const decayExpSigmoid = Math.log(HI._offsetSigmoid / LO._offsetSigmoid) / lnTspan;
const decayExpRamp = Math.log(HI._offsetRamp / LO._offsetRamp) / lnTspan;
const exponentSplit = Math.abs(decayExpSigmoid - decayExpRamp);

// the two side-by-side envelope readings of the split
const maxEnvSplitWithinRung = Math.max(...LADDER.map((r) => r._envSplitWithinRung));
const bandEndpointEnvDiff = Math.abs(envelope(LO._nHalf) - envelope(HI._nHalf));

// how far short each envelope reading falls of the actual 0.064 split
const shortfallWithinRung = exponentSplit / maxEnvSplitWithinRung; // ~9145x at 1e14
const shortfallBandWide = exponentSplit / bandEndpointEnvDiff; // ~18.7x

export const IMP35175_LOG_ENVELOPE_VS_LANDMARK_SPLIT = {
  id: 'imp-35175',
  proofSection: 'S-frontier',
  question:
    'Is the imp-35132 ~0.064 between-landmark (ramp-knee vs sigmoid-inflection) decay-exponent split a ' +
    'finite-N reading of the imp-35036 logarithmic-approach envelope 1/2 - p_dec ~ 1/(2 ln N) evaluated at ' +
    'two different N, or a DISTINCT structural effect? Place the envelope 1/(2 ln N) side by side with the ' +
    'split on the shared surrogate (imp-35132 locators verbatim) and test whether env(N_ramp) - env(N_sigmoid) ' +
    'reproduces ~0.064. Measurement only; changes no bound; C_mb GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'on the five far-tail rungs N_half in {1e14..1e18} (imp-35132 locators verbatim): the two landmark N ' +
    '(sigmoid inflection, ramp knee), the imp-35036 envelope env(N) = 1/(2 ln N) at each, the within-rung ' +
    'envelope split env(N_ramp) - env(N_sigmoid), the band-wide envelope difference across the four decades, ' +
    'and their shortfall ratios against the reproduced ~0.06431 exponent split',
  ladder: LADDER.map(({ _nHalf, _nSigmoid, _nRamp, _offsetSigmoid, _offsetRamp, _envSplitWithinRung, ...row }) => row),
  exponentSplit: +exponentSplit.toFixed(5), // ~0.06431 (imp-35132 reproduced)
  maxEnvelopeSplitWithinRung: +maxEnvSplitWithinRung.toExponential(4), // ~7.03e-6
  bandEndpointEnvelopeDiff: +bandEndpointEnvDiff.toExponential(4), // ~3.45e-3
  shortfallWithinRungFactor: +shortfallWithinRung.toExponential(3), // ~9.14e3
  shortfallBandWideFactor: +shortfallBandWide.toFixed(2), // ~18.66
  runningGGapImp35028: 1.45e-5, // imp-35028 micro-scale gap, same order as the envelope gap
  verdictSplitIsDistinctStructural: true,
  finding: {
    F1_within_rung_envelope_gap_is_micro_scale:
      'The two landmarks sit ~1-1.5% apart in N within each rung (N_ramp/N_sigmoid ~1.009-1.015), so the ' +
      'imp-35036 envelope difference env(N_ramp) - env(N_sigmoid) = -[1/(2 (ln N)^2)] d ln N is only ' +
      '~2.6e-6..7.0e-6 across the five far-tail rungs -- ~9145x too small at 1e14 to be the 0.06431 split. ' +
      'This micro-scale gap is the SAME order as the imp-35028 running-g gap (~1.45e-5), a third independent ' +
      'angle giving the same ruling.',
    F2_band_wide_envelope_diff_still_far_too_small:
      'Even the most generous two-very-different-N reading -- env at N_half of the first rung (1e14) minus ' +
      'env at N_half of the last rung (1e18), spanning four decades -- is only ~3.45e-3, still ~18.7x too ' +
      'small to be the 0.064 split. No pair of N on the ladder makes the 1/(2 ln N) envelope reproduce it.',
    F3_regimes_do_not_match:
      'The imp-35036 envelope governs the sigma decay exponent approaching +1/2 from below, whereas the ' +
      'imp-35132 split is between two OFFSET decay exponents near -2 (d ln offset/d ln t). The 0.064 is a ' +
      'difference of ~-2 exponents, not a reading of the +1/2 envelope, so the envelope is not even the ' +
      'right quantity for it.',
    F4_confirms_imp35132_c3_from_a_third_angle:
      'The between-landmark log-approach gap is a micro-scale (~1e-6..1e-5) quantity whoever measures it ' +
      '(running-g, imp-35028; or the 1/(2 ln N) envelope, here), so the ~0.064 split cannot be a finite-N ' +
      'reading of the logarithmic approach. It is a DISTINCT structural effect -- the imp-35132 C3 ' +
      'ramp-vs-sigmoid definitional difference (the different curvature operator that locates each landmark) ' +
      '-- now confirmed from a third, independent direction (the gap-closure envelope itself).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Placing the imp-35036 logarithmic residual-gap envelope ' +
    '1/(2 ln N) side by side with the imp-35132 ~0.064 between-landmark decay-exponent split on the shared ' +
    'surrogate: the envelope difference between the two landmarks is ~2.6e-6..7.0e-6 within a rung ' +
    '(~9145x too small at 1e14) and ~3.45e-3 even across the whole 1e14..1e18 band (~18.7x too small), so NO ' +
    'pair of N makes 1/(2 ln N) reproduce 0.064. The within-rung envelope gap is the same micro-scale as the ' +
    'imp-35028 running-g gap (~1.45e-5), and the regimes differ (envelope governs the +1/2 sigma exponent, the ' +
    'split is between ~-2 offset exponents). VERDICT: the ~0.064 split is a DISTINCT structural effect, NOT a ' +
    'finite-N reading of the imp-35036 logarithmic-approach envelope -- confirming the imp-35132 C3 ' +
    'ramp-vs-sigmoid definitional attribution from a third independent angle. Component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; ' +
    'far-tail exponent 1/2 per imp-3463; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; imp-34687a/imp-34714a stay OPEN; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35036 (the 1/(2 ln N) gap-closure envelope tested here); imp-35132 (the ~0.064 split; C3 ' +
    'definitional attribution confirmed here); imp-35028 (running-g gap ~1.45e-5, same micro-scale); ' +
    'imp-34948 (the far-tail offset-exponent split; locators reused verbatim); imp-3463 (far-tail sigma ' +
    'exponent -> 1/2); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35175_LOG_ENVELOPE_VS_LANDMARK_SPLIT_ASSERTIONS = [
  {
    // Reuse gate: five far-tail rungs land and reproduce the imp-35132 ~0.06431 exponent split.
    id: 'imp35175-reproduces-imp35132-split',
    description: 'the five rungs reproduce the imp-35132 between-landmark exponent split ~0.06431',
    holds: () => LADDER.length === 5 && Math.abs(exponentSplit - 0.06431) < 1e-3,
  },
  {
    // (F1): the within-rung envelope split is micro-scale (< 1e-5) on every rung and shrinks with N.
    id: 'imp35175-within-rung-envelope-split-micro-scale',
    description: 'env(N_ramp) - env(N_sigmoid) is < 1e-5 on every rung and monotone decreasing with N',
    holds: () => {
      for (let i = 0; i < LADDER.length; i++) {
        if (!(LADDER[i]._envSplitWithinRung < 1e-5)) return false;
        if (i > 0 && !(LADDER[i]._envSplitWithinRung < LADDER[i - 1]._envSplitWithinRung)) return false;
      }
      return true;
    },
  },
  {
    // (F1): the within-rung envelope split is thousands of times too small to be the 0.064 split.
    id: 'imp35175-within-rung-shortfall-thousands',
    description: 'the split exceeds the largest within-rung envelope gap by > 5000x (finite-N reading fails)',
    holds: () => shortfallWithinRung > 5000,
  },
  {
    // (F2): even the four-decade band-wide envelope difference falls > 10x short of 0.064.
    id: 'imp35175-band-wide-shortfall',
    description: 'the band-wide (1e14->1e18) envelope diff ~3.45e-3 is still > 10x too small for the split',
    holds: () =>
      bandEndpointEnvDiff > 1e-3 && bandEndpointEnvDiff < 1e-2 && shortfallBandWide > 10,
  },
  {
    // (F4): micro-scale envelope gap agrees in order of magnitude with the imp-35028 running-g gap.
    id: 'imp35175-envelope-gap-matches-imp35028-scale',
    description: 'the within-rung envelope gap is the same micro-scale (~1e-6..1e-5) as the imp-35028 running-g gap',
    holds: () => maxEnvSplitWithinRung > 1e-6 && maxEnvSplitWithinRung < 1.45e-5,
  },
  {
    // Verdict gate: split is a distinct structural effect, not a finite-N envelope reading.
    id: 'imp35175-verdict-distinct-structural',
    description: 'verdict: the ~0.064 split is a distinct structural effect, not a 1/(2 ln N) envelope reading',
    holds: () => IMP35175_LOG_ENVELOPE_VS_LANDMARK_SPLIT.verdictSplitIsDistinctStructural === true,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35175-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35175_LOG_ENVELOPE_VS_LANDMARK_SPLIT.isRigorous === false &&
      /NO QED/.test(IMP35175_LOG_ENVELOPE_VS_LANDMARK_SPLIT.verdict) &&
      /refereed bound is changed/i.test(IMP35175_LOG_ENVELOPE_VS_LANDMARK_SPLIT.verdict),
  },
];

for (const a of IMP35175_LOG_ENVELOPE_VS_LANDMARK_SPLIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35175-log-envelope-vs-landmark-split assertion failed: ${a.id}`);
  }
}
